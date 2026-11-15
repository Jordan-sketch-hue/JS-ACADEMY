/**
 * Fygaro Payment Integration
 * Docs: https://app.fygaro.com (merchant portal)
 *
 * Flow:
 *   1. POST /api/payments/fygaro → creates order → returns {paymentLink}
 *   2. Customer pays on Fygaro
 *   3. Fygaro POSTs to /api/webhooks/fygaro with HMAC-SHA256 signature
 *   4. Webhook verifies sig → marks order paid
 *
 * NEVER mark an order paid without verifying the HMAC.
 */

import crypto from "crypto";

const FYGARO_BASE_URL   = process.env.FYGARO_BASE_URL   ?? "https://app.fygaro.com";
const FYGARO_MERCHANT_ID = process.env.FYGARO_MERCHANT_ID ?? "";
const FYGARO_SECRET_KEY  = process.env.FYGARO_SECRET_KEY  ?? "";
const FYGARO_WEBHOOK_SECRET = process.env.FYGARO_WEBHOOK_SECRET ?? "";

if (!FYGARO_MERCHANT_ID || !FYGARO_SECRET_KEY) {
  console.warn("[fygaro] FYGARO_MERCHANT_ID or FYGARO_SECRET_KEY not set — payments disabled");
}

export interface FygaroPaymentRequest {
  orderNumber: string;      // HI-YYYYMMDD-XXXX
  amountJMD: number;        // JMD cents
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  webhookUrl: string;
}

export interface FygaroPaymentLinkResponse {
  paymentId: string;
  paymentLink: string;
}

/** Initiates a Fygaro payment and returns the redirect URL */
export async function createFygaroPaymentLink(
  req: FygaroPaymentRequest
): Promise<FygaroPaymentLinkResponse> {
  const amountJMD = (req.amountJMD / 100).toFixed(2); // convert cents → dollars

  const payload = {
    merchant_id:  FYGARO_MERCHANT_ID,
    amount:       amountJMD,
    currency:     "JMD",
    reference:    req.orderNumber,
    description:  req.description,
    customer_name:  req.customerName,
    customer_email: req.customerEmail ?? "",
    customer_phone: req.customerPhone,
    success_url:  req.successUrl,
    cancel_url:   req.cancelUrl,
    webhook_url:  req.webhookUrl,
  };

  // Build HMAC-SHA256 signature
  const signaturePayload = Object.entries(payload)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const signature = crypto
    .createHmac("sha256", FYGARO_SECRET_KEY)
    .update(signaturePayload)
    .digest("hex");

  const res = await fetch(`${FYGARO_BASE_URL}/api/v1/payments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Fygaro-Signature": signature,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fygaro create payment failed: ${res.status} — ${text}`);
  }

  const data = await res.json();
  return {
    paymentId:   data.payment_id ?? data.id,
    paymentLink: data.payment_url ?? data.link,
  };
}

/** Verifies the HMAC-SHA256 signature on an incoming Fygaro webhook */
export function verifyFygaroWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  const expected = crypto
    .createHmac("sha256", FYGARO_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signatureHeader.replace(/^sha256=/, ""), "hex")
  );
}

/** Generates a unique order number: HI-20261115-0001 */
export function generateOrderNumber(): string {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HI-${date}-${random}`;
}
