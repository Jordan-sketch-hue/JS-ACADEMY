import { NextRequest, NextResponse } from 'next/server'
import { createPaymentSession } from '@/lib/handypay'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amountJmd, description } = body

    if (!amountJmd || amountJmd < 100) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? ''
    const session = await createPaymentSession({
      amountJmd,
      description: description ?? `The Mandate — Donation (J$${amountJmd.toLocaleString()})`,
      orderId: randomUUID(),
      successUrl: `${origin}/donate/success`,
      cancelUrl:  `${origin}/donate`,
    })
    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Payment failed' }, { status: 500 })
  }
}