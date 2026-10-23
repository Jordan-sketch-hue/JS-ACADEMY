import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'

const SECRET = process.env.HANDYPAY_WEBHOOK_SECRET

async function hasValidSignature(payload: string, signature: string): Promise<boolean> {
  if (!SECRET) return false
  const prefix = 'sha256='
  if (!signature.startsWith(prefix)) return false
  const hex = signature.slice(prefix.length)
  if (!/^[0-9a-f]{64}$/i.test(hex)) return false

  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  )
  const expectedBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  const expected = new Uint8Array(expectedBuf)
  const received = new Uint8Array(32)
  for (let i = 0; i < 32; i++) received[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  let diff = 0
  for (let i = 0; i < 32; i++) diff |= expected[i] ^ received[i]
  return diff === 0
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-handypay-signature') ?? ''

  if (SECRET && !await hasValidSignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: { id: string; type: string; data: Record<string, unknown> }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data as {
      id: string
      metadata?: { order_id?: string }
      customer_details?: { email?: string; name?: string }
      amount_total?: number
    }
    const supabase = await createServiceSupabase()
    await supabase.from('myshop_orders').upsert({
      id: session.metadata?.order_id ?? crypto.randomUUID(),
      paypal_order_id: session.id, // reusing column for HP session ID
      paypal_capture_id: event.id,
      payer_email: session.customer_details?.email ?? '',
      payer_name: session.customer_details?.name ?? '',
      amount_usd: session.amount_total ? session.amount_total / 100 : 0,
      status: 'completed',
    }, { onConflict: 'id' })
  }

  return NextResponse.json({ received: true })
}
