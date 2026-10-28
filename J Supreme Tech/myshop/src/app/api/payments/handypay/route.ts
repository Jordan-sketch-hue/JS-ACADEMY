import { NextRequest, NextResponse } from 'next/server'
import { createPaymentSession, usdToJmd, type SupportedCurrency } from '@/lib/handypay'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, description } = await req.json()
    const cur: SupportedCurrency = currency === 'usd' ? 'usd' : 'jmd'
    const amt = Number(amount)
    if (!amt || amt <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })

    const jmdEquiv = cur === 'usd' ? usdToJmd(amt) : amt
    if (jmdEquiv < 100) return NextResponse.json({ error: 'Minimum is J00 /  USD' }, { status: 400 })

    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
    const session = await createPaymentSession({
      amount: amt,
      currency: cur,
      description: description ?? 'My Shop Order',
      orderId: randomUUID(),
      successUrl: `${origin}/success`,
      cancelUrl: `${origin}/`,
    })
    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Payment failed' }, { status: 500 })
  }
}
