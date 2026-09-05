import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Cross-device sync for a single personal user. The table has RLS enabled
// with zero policies, so it is unreachable via the anon/publishable key —
// only this server-side route (using the service-role key) can read or
// write it. Never import this client into anything that runs in the browser.
function getClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

const VALID_KEYS = new Set(['progress', 'audio_positions'])

export async function GET(req: NextRequest) {
  const supabase = getClient()
  if (!supabase) return NextResponse.json({ error: 'Sync not configured' }, { status: 503 })

  const key = req.nextUrl.searchParams.get('key')
  if (!key || !VALID_KEYS.has(key)) {
    return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('academy_sync')
    .select('data, updated_at')
    .eq('key', key)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data: data?.data ?? null, updatedAt: data?.updated_at ?? null })
}

export async function POST(req: NextRequest) {
  const supabase = getClient()
  if (!supabase) return NextResponse.json({ error: 'Sync not configured' }, { status: 503 })

  const body = await req.json().catch(() => null)
  const key = body?.key
  if (!key || !VALID_KEYS.has(key) || body.data === undefined) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { error } = await supabase
    .from('academy_sync')
    .upsert({ key, data: body.data, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
