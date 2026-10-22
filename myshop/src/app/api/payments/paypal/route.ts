import { NextRequest, NextResponse } from 'next/server'
import { paypalCreateOrder } from '@/lib/paypal'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { amountJmd, description } = await req.json()
  const orderId = crypto.randomUUID()

  try {
    const order = await paypalCreateOrder({ amountJmd, description, orderId })
    return NextResponse.json({ paypalOrderId: order.id, orderId })
  } catch (err) {
    console.error('[paypal/create]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
