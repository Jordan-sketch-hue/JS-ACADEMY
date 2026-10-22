const BASE = 'https://api.handypay.me/api/v1'

async function request(path: string, options: RequestInit = {}) {
  const key = process.env.HANDYPAY_API_KEY
  if (!key) throw new Error('HANDYPAY_API_KEY is not set')
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error?.message ?? 'HandyPay error')
  return json.data
}

export async function createPaymentSession({
  amountJmd,
  description,
  orderId,
  successUrl,
  cancelUrl,
}: {
  amountJmd: number
  description: string
  orderId: string
  successUrl: string
  cancelUrl: string
}): Promise<{ url: string; id: string }> {
  return request('/payment-sessions', {
    method: 'POST',
    body: JSON.stringify({
      line_items: [
        {
          amount: Math.round(amountJmd * 100), // JMD cents
          currency: 'jmd',
          name: description,
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: { order_id: orderId },
    }),
  })
}
