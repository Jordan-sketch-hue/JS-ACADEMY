import crypto from "crypto";

const HP_MERCHANT_ID = process.env.HANDYPAY_MERCHANT_ID ?? "";
const HP_SECRET = process.env.HANDYPAY_SECRET ?? "";
const HP_BASE_URL = process.env.HANDYPAY_BASE_URL ?? "https://api.handypay.app";

export interface HandyPayLineItem {
  name: string;
  quantity: number;
  unit_price: number; // JMD cents
}

export interface HandyPayChargeRequest {
  order_id: string;
  amount: number; // JMD cents
  currency: "JMD";
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  description: string;
  line_items?: HandyPayLineItem[];
  pass_fees_to_customer: true;
  success_url: string;
  cancel_url: string;
  webhook_url: string;
}

export interface HandyPayChargeResponse {
  id: string;
  status: "pending" | "paid" | "failed";
  checkout_url: string;
  amount: number;
  currency: string;
}

function buildSignature(body: string): string {
  return crypto.createHmac("sha256", HP_SECRET).update(body).digest("hex");
}

export async function createCharge(req: HandyPayChargeRequest): Promise<HandyPayChargeResponse> {
  if (!HP_MERCHANT_ID || !HP_SECRET) {
    // Simulate mode — return a mock checkout URL when keys not set
    return {
      id: `sim_${Date.now()}`,
      status: "pending",
      checkout_url: "#handypay-not-configured",
      amount: req.amount,
      currency: req.currency,
    };
  }

  const body = JSON.stringify({ ...req, merchant_id: HP_MERCHANT_ID });
  const sig = buildSignature(body);

  const res = await fetch(`${HP_BASE_URL}/v1/charges`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-merchant-id": HP_MERCHANT_ID,
      "x-signature": sig,
    },
    body,
  });

  if (!res.ok) throw new Error(`HandyPay error: ${res.status}`);
  return res.json();
}

export function verifyWebhookSignature(rawBody: string, receivedSig: string): boolean {
  if (!HP_SECRET) return true; // allow through in dev/sim
  const expected = buildSignature(rawBody);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSig));
}
