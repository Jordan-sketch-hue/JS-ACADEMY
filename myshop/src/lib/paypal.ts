const BASE =
  process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_CLIENT_SECRET!
  const creds = Buffer.from(`${id}:${secret}`).toString('base64')
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token as string
}

export function jmdToUsd(jmd: number): string {
  const rate = Number(process.env.JMD_TO_USD_RATE ?? 157)
  return (jmd / rate).toFixed(2)
}

export function paypalReady(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET
  )
}

export async function paypalCreateOrder({
  amountJmd,
  description,
  orderId,
}: {
  amountJmd: number
  description: string
  orderId: string
}): Promise<{ id: string }> {
  const token = await getAccessToken()
  const usd = jmdToUsd(amountJmd)
  const res = await fetch(`${BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          description,
          amount: { currency_code: 'USD', value: usd },
        },
      ],
    }),
  })
  return res.json()
}

export async function paypalCaptureOrder(paypalOrderId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0]
  return {
    ok: data.status === 'COMPLETED',
    orderId: data.id,
    captureId: capture?.id,
    payerEmail: data.payer?.email_address,
    payerName: `${data.payer?.name?.given_name ?? ''} ${data.payer?.name?.surname ?? ''}`.trim(),
    amountUsd: capture?.amount?.value,
  }
}
