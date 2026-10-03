import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

webpush.setVapidDetails(
  'mailto:jordanroad631@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Subscribe: POST { endpoint, keys: { p256dh, auth } }
export async function PUT(req: NextRequest) {
  const sub = await req.json()
  await supabase.from('push_subscriptions').upsert({
    endpoint: sub.endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
  }, { onConflict: 'endpoint' })
  return NextResponse.json({ ok: true })
}

// Send push to all subscribers — called internally by scraper
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, body, url } = await req.json()

  const { data: subs } = await supabase.from('push_subscriptions').select('*')
  if (!subs || subs.length === 0) return NextResponse.json({ sent: 0 })

  const payload = JSON.stringify({ title, body, url })
  let sent = 0

  await Promise.allSettled(
    subs.map(async (s: any) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        )
        sent++
      } catch (err: any) {
        // Remove stale subscriptions
        if (err.statusCode === 410) {
          await supabase.from('push_subscriptions').delete().eq('endpoint', s.endpoint)
        }
      }
    })
  )

  return NextResponse.json({ sent })
}
