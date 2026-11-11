import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

function svc() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('x-handypay-signature') ?? ''
  const body = await req.text()
  const secret = process.env.HANDYPAY_WEBHOOK_SECRET ?? ''

  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  if (sig !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)

  if (event.type === 'payment_session.completed') {
    const orderId = event.data?.metadata?.order_id
    if (!orderId) return NextResponse.json({ received: true })

    const sb = svc()

    // Mark order paid
    const { data: order } = await sb
      .from('myshop_orders')
      .update({ status: 'paid', handypay_session_id: event.data.id })
      .eq('id', orderId)
      .select('items')
      .single()

    // Decrement stock for each item
    if (order?.items && Array.isArray(order.items)) {
      for (const item of order.items as Array<{ id: string; qty: number }>) {
        if (!item.id || !item.qty) continue
        const { error: rpcErr } = await sb.rpc('decrement_stock', { product_id: item.id, qty: item.qty })
        if (rpcErr) {
          // Fallback if RPC not set up — raw update
          const { data: prod } = await sb.from('myshop_products').select('stock').eq('id', item.id).single()
          if (prod) {
            const newStock = Math.max(0, (prod.stock ?? 0) - item.qty)
            await sb.from('myshop_products').update({ stock: newStock }).eq('id', item.id)
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
