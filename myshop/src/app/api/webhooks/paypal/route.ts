import { NextRequest, NextResponse } from 'next/server'

// PayPal sends async events here. Register this URL on developer.paypal.com
// after deploy: https://myshop.vercel.app/api/webhooks/paypal
// Also set PAYPAL_WEBHOOK_ID in env.
export async function POST(req: NextRequest) {
  const body = await req.text()
  const event = JSON.parse(body)

  const eventType: string = event.event_type ?? ''

  switch (eventType) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      // Already handled by /api/payments/paypal/capture — idempotent log
      console.log('[webhook] Capture completed:', event.resource?.id)
      break
    case 'PAYMENT.CAPTURE.DENIED':
    case 'PAYMENT.CAPTURE.REVERSED':
      // TODO: mark order as refunded/reversed in Supabase
      console.log('[webhook] Capture reversed/denied:', event.resource?.id)
      break
    default:
      console.log('[webhook] Unhandled event:', eventType)
  }

  return NextResponse.json({ received: true })
}
