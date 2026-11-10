import { NextRequest, NextResponse } from 'next/server'
import { createPaymentSession } from '@/lib/handypay'
import type { SupportedCurrency } from '@/lib/handypay'
import { createClient } from '@supabase/supabase-js'

function svc() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, currency, description, orderId, customerEmail, customerName, optIn, items } = body

    if (!amount || !currency || !description || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_BASE_URL ?? 'https://mineandyoursshop.online'

    const session = await createPaymentSession({
      amount: Math.round(amount),
      currency: currency as SupportedCurrency,
      description,
      orderId,
      successUrl: `${origin}/checkout/success?order=${orderId}`,
      cancelUrl: `${origin}/cart`,
    })

    // Save order to Supabase
    try {
      await svc().from('myshop_orders').insert({
        id: orderId,
        handypay_session_id: session.id,
        status: 'pending',
        amount_usd_cents: Math.round(amount),
        currency,
        description,
        customer_email: customerEmail || null,
        customer_name: customerName || null,
        marketing_opt_in: optIn ?? false,
        items: items ?? [],
        created_at: new Date().toISOString(),
      })
    } catch (dbErr) {
      // Non-fatal: order still goes through
      console.warn('Order save failed:', dbErr)
    }

    return NextResponse.json({ url: session.url, id: session.id })
  } catch (err: unknown) {
    console.error('HandyPay error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Payment session failed' },
      { status: 500 }
    )
  }
}