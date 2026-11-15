/**
 * POST /api/webhooks/fygaro
 *
 * Fygaro payment webhook — HMAC-SHA256 verified.
 *
 * NEVER mark an order paid without verifying the signature first.
 * On success: marks order paid, sends Resend + WA + Meta CAPI + GA4.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyFygaroWebhookSignature } from "@/lib/fygaro";
import { sendOrderConfirmation } from "@/lib/resend";
import { notifyOwnerNewOrder } from "@/lib/whatsapp";
import { sendMetaConversionsEvent, sendGA4Purchase, newEventId } from "@/lib/analytics";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Read raw body for HMAC verification (must be done before .json())
  const rawBody = await req.text();
  const signature = req.headers.get("x-fygaro-signature") ?? "";

  // 2. Verify HMAC — reject if invalid
  if (!verifyFygaroWebhookSignature(rawBody, signature)) {
    console.error("[fygaro webhook] Invalid signature — rejected");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  // Only process successful payments
  if (payload.status !== "paid" && payload.event !== "payment.completed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const orderNumber: string = payload.reference ?? payload.order_number;
  if (!orderNumber) {
    return NextResponse.json({ error: "No order reference in webhook" }, { status: 400 });
  }

  const db = getSupabaseAdmin();

  // 3. Load order
  const { data: order, error: orderErr } = await db
    .from("hi_orders")
    .select("*, items:hi_order_items(*)")
    .eq("order_number", orderNumber)
    .single();

  if (orderErr || !order) {
    console.error(`[fygaro webhook] Order ${orderNumber} not found`);
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Idempotency — ignore if already paid
  if (order.status === "paid") {
    return NextResponse.json({ ok: true, already_paid: true });
  }

  // 4. Mark order as paid
  await db
    .from("hi_orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", order.id);

  // 5. Upsert customer record (create if first order)
  if (!order.customer_id && (order.customer_email || order.customer_phone)) {
    await db.from("hi_customers").upsert(
      {
        first_name:    order.customer_name.split(" ")[0],
        last_name:     order.customer_name.split(" ").slice(1).join(" ") || null,
        email:         order.customer_email,
        phone:         order.customer_phone,
        segment:       "retail",
        total_spent_jmd: order.total_jmd,
        order_count:   1,
        last_order_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );
  }

  // Build items summary for notifications
  const itemsSummary = (order.items as any[])
    .map((i: any) => `${i.product_name} ${i.variant_desc} ×${i.quantity}`)
    .join(", ");

  // 6. Send order confirmation email (non-blocking)
  if (order.customer_email) {
    sendOrderConfirmation({
      to:              order.customer_email,
      customerName:    order.customer_name,
      orderNumber:     order.order_number,
      itemsSummary,
      totalJMD:        order.total_jmd,
      deliveryMethod:  order.delivery_method,
      deliveryAddress: order.delivery_address ?? undefined,
    }).catch(console.error);
  }

  // 7. Notify store owner via WhatsApp (non-blocking)
  notifyOwnerNewOrder({
    orderNumber:    order.order_number,
    customerName:   order.customer_name,
    customerPhone:  order.customer_phone,
    totalJMD:       order.total_jmd,
    deliveryMethod: order.delivery_method,
    itemsSummary,
  }).catch(console.error);

  // 8. Meta Conversions API — Purchase event (non-blocking)
  const eventId = newEventId();
  sendMetaConversionsEvent({
    eventName:  "Purchase",
    eventId,
    value:      order.total_jmd / 100 / 140,  // approximate JMD→USD
    currency:   "USD",
    contentIds: (order.items as any[]).map((i: any) => i.variant_id),
    numItems:   (order.items as any[]).reduce((s: number, i: any) => s + i.quantity, 0),
    userEmail:  order.customer_email ?? undefined,
    userPhone:  order.customer_phone,
  }).catch(console.error);

  // 9. GA4 Purchase event (non-blocking) — client_id from query param if available
  const clientId = payload.ga_client_id ?? "server";
  sendGA4Purchase(clientId, {
    transactionId: order.order_number,
    value:         order.total_jmd,
    currency:      "JMD",
    items: (order.items as any[]).map((i: any) => ({
      item_id:   i.variant_id,
      item_name: `${i.product_name} ${i.variant_desc}`,
      price:     i.unit_price_jmd,
      quantity:  i.quantity,
    })),
  }).catch(console.error);

  return NextResponse.json({ ok: true, orderNumber });
}
