import { NextRequest, NextResponse } from 'next/server'
import { paypalCaptureOrder } from '@/lib/paypal'
import { createServiceSupabase } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { paypalOrderId, orderId, cart } = await req.json()

  try {
    const result = await paypalCaptureOrder(paypalOrderId)
    if (!result.ok) {
      return NextResponse.json({ error: 'Capture failed' }, { status: 400 })
    }

    const supabase = await createServiceSupabase()
    await supabase.from('myshop_orders').insert({
      id: orderId,
      paypal_order_id: paypalOrderId,
      paypal_capture_id: result.captureId,
      payer_email: result.payerEmail,
      payer_name: result.payerName,
      amount_usd: result.amountUsd,
      items: cart,
      status: 'paid',
    })

    return NextResponse.json({ ok: true, captureId: result.captureId })
  } catch (err) {
    console.error('[paypal/capture]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
