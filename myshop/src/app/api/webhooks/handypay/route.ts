import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { createServiceSupabase } from '@/lib/supabase-server'

export const runtime = 'nodejs'

const SECRET = process.env.HANDYPAY_WEBHOOK_SECRET

function hasValidSignature(payload: string, signature: string): boolean {
  if (!SECRET) return false
  const prefix = 'sha256='
  if (!signature.startsWith(prefix)) return false
  const hex = signature.slice(prefix.length)
  if (!/^[0-9a-f]{64}$/i.test(hex)) return false
  const expected = createHmac('sha256', SECRET).update(payload).digest()
  const received = Buffer.from(hex, 'hex')
  return received.length === expected.length && timingSafeEqual(received, expected)
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-handypay-signature') ?? ''

  if (SECRET && !hasValidSignature(body, signature)) {
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
