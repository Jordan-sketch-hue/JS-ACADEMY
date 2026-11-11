import { NextRequest, NextResponse } from 'next/server'
import { createPaymentSession } from '@/lib/handypay'
import type { SupportedCurrency } from '@/lib/handypay'
import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmation } from '@/lib/resend'

const USD_TO_JMD = parseFloat(process.env.JMD_TO_USD_RATE ?? "158")

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

    // Save order to Supabase (non-fatal)
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
      console.warn('Order save failed:', dbErr)
    }

    // Send order confirmation email (non-fatal)
    if (customerEmail) {
      try {
        const totalUsd = Math.round(amount) / 100
        await sendOrderConfirmation({
          to: customerEmail,
          customerName: customerName || undefined,
          orderRef: orderId.slice(0, 8),
          items: (items ?? []).map((i: { name: string; qty: number; price_usd: number }) => ({
            name: i.name,
            qty: i.qty,
            price_usd: i.price_usd,
          })),
          totalUsd,
        })
      } catch (emailErr) {
        console.warn('Order email failed:', emailErr)
      }
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
