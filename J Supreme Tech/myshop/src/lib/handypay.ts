const RAW_KEY = process.env.HANDYPAY_API_KEY ?? ''
const HANDYPAY_API_KEY = RAW_KEY.replace(/^\uFEFF/, '').trim()
const HANDYPAY_BASE_URL = 'https://api.handypay.me/api/v1'

export const USD_TO_JMD = 158

export type SupportedCurrency = 'usd' | 'jmd'

export function usdToJmd(usdCents: number): number {
  return Math.round((usdCents / 100) * USD_TO_JMD * 100)
}

export function jmdToUsd(jmdCents: number): number {
  return Math.round(((jmdCents / 100) / USD_TO_JMD) * 100)
}

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${HANDYPAY_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${HANDYPAY_API_KEY}`,
      ...(options.headers ?? {}),
    },
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message ?? `HandyPay ${res.status}`)
  }
  return json.data
}

export interface PaymentSessionParams {
  amount: number
  currency: SupportedCurrency
  description: string
  orderId: string
  successUrl: string
  cancelUrl: string
}

export async function createPaymentSession({
  amount,
  currency,
  description,
  orderId,
  successUrl,
  cancelUrl,
}: PaymentSessionParams): Promise<{ url: string; id: string }> {
  return request('/payment-sessions', {
    method: 'POST',
    body: JSON.stringify({
      line_items: [{ amount, currency, name: description, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      pass_fees_to_customer: true,
      metadata: { order_id: orderId },
    }),
  })
}