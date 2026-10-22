import { NextRequest, NextResponse } from 'next/server'
import { createPaymentSession } from '@/lib/handypay'

export async function POST(req: NextRequest) {
  try {
    const { amountJmd, description, items } = await req.json()
    const orderId = crypto.randomUUID()
    const host = req.headers.get('host') ?? 'localhost:3000'
    const proto = host.startsWith('localhost') ? 'http' : 'https'
    const base = `${proto}://${host}`

    const session = await createPaymentSession({
      amountJmd,
      description,
      orderId,
      successUrl: `${base}/checkout/success`,
      cancelUrl: `${base}/checkout`,
    })

    return NextResponse.json({ url: session.url, orderId, sessionId: session.id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
