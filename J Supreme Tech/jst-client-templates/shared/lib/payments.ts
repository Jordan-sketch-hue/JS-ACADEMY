/**
 * shared/lib/payments.ts — Payment gateway stubs for Starter (WiPay/HandyPay JMD)
 * and Growth+ (Stripe USD) tiers.
 *
 * These are integration stubs — actual gateway credentials and business logic
 * must be configured via environment variables per tenant.
 *
 * NEVER log or store raw card data. All PII stays on the gateway side.
 */

import type { PaymentGateway, PaymentTier } from "./client-config";

export interface PaymentIntent {
  amount: number;         // in smallest currency unit (cents / JMD cents)
  currency: string;       // "JMD" | "USD"
  description: string;
  tenantId: string;
  customerId?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  reference: string;
  redirectUrl?: string;
  error?: string;
}

// ─── WiPay (Starter / JMD) ────────────────────────────────────────────────────

export async function createWiPayCheckout(intent: PaymentIntent): Promise<PaymentResult> {
  const apiKey = process.env.WIPAY_API_KEY;
  const accountNo = process.env.WIPAY_ACCOUNT_NO;

  if (!apiKey || !accountNo) {
    return { success: false, reference: "", error: "WiPay credentials not configured." };
  }

  // WiPay expects amount in JMD (not cents). Divide by 100.
  const amountJMD = intent.amount / 100;

  const payload = {
    account_number: accountNo,
    avs: 0,
    currency: "JMD",
    environment: process.env.WIPAY_ENV ?? "sandbox",
    fee_structure: "customer_pays",
    method: "credit_card",
    order_id: `${intent.tenantId}-${Date.now()}`,
    total: amountJMD.toFixed(2),
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/wipay/callback`,
  };

  try {
    const res = await fetch("https://sandbox.wipayfinancial.com/v1/transactions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(payload),
    });
    const data = await res.json() as { status: number; url?: string; transaction_id?: string };

    if (data.status === 200 && data.url) {
      return { success: true, reference: data.transaction_id ?? "", redirectUrl: data.url };
    }
    return { success: false, reference: "", error: "WiPay checkout creation failed." };
  } catch (err) {
    return { success: false, reference: "", error: String(err) };
  }
}

// ─── HandyPay (Starter / JMD) ─────────────────────────────────────────────────

export async function createHandyPayCheckout(intent: PaymentIntent): Promise<PaymentResult> {
  const merchantId = process.env.HANDYPAY_MERCHANT_ID;
  const apiKey = process.env.HANDYPAY_API_KEY;

  if (!merchantId || !apiKey) {
    return { success: false, reference: "", error: "HandyPay credentials not configured." };
  }

  // Amount stays in JMD cents per HandyPay spec
  const payload = {
    merchant_id: merchantId,
    amount: intent.amount,
    currency: "JMD",
    description: intent.description,
    reference: `${intent.tenantId}-${Date.now()}`,
    pass_fees_to_customer: true,
    callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/handypay/webhook`,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/handypay/callback`,
  };

  try {
    const res = await fetch("https://api.handypayja.com/v1/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(payload),
    });
    const data = await res.json() as { checkout_url?: string; reference?: string; error?: string };
    if (data.checkout_url) {
      return { success: true, reference: data.reference ?? "", redirectUrl: data.checkout_url };
    }
    return { success: false, reference: "", error: data.error ?? "HandyPay error." };
  } catch (err) {
    return { success: false, reference: "", error: String(err) };
  }
}

// ─── Stripe (Growth+ / USD) ───────────────────────────────────────────────────

export async function createStripeCheckout(intent: PaymentIntent): Promise<PaymentResult> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return { success: false, reference: "", error: "Stripe secret key not configured." };
  }

  const params = new URLSearchParams({
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(intent.amount),
    "line_items[0][price_data][product_data][name]": intent.description,
    "line_items[0][quantity]": "1",
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/stripe/cancel`,
    ...(intent.customerId && { customer: intent.customerId }),
  });

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json() as { id?: string; url?: string; error?: { message?: string } };
    if (data.url) {
      return { success: true, reference: data.id ?? "", redirectUrl: data.url };
    }
    return { success: false, reference: "", error: data.error?.message ?? "Stripe error." };
  } catch (err) {
    return { success: false, reference: "", error: String(err) };
  }
}

// ─── Gateway router ───────────────────────────────────────────────────────────

export async function createCheckout(
  intent: PaymentIntent,
  tier: PaymentTier,
  gateway: PaymentGateway
): Promise<PaymentResult> {
  if (tier === "starter") {
    return gateway === "wipay"
      ? createWiPayCheckout(intent)
      : createHandyPayCheckout(intent);
  }
  return createStripeCheckout(intent);
}
