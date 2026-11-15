/**
 * POST /api/payments/fygaro
 *
 * Creates an order and returns a Fygaro payment link.
 *
 * Body: CheckoutPayload
 * Returns: FygaroInitiateResponse
 *
 * Critical rule: this route creates the order in `pending_payment` status.
 * The order is ONLY moved to `paid` when the HMAC-verified webhook fires.
 * Never trust the success redirect URL alone.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { createFygaroPaymentLink, generateOrderNumber } from "@/lib/fygaro";
import type { CheckoutPayload, ApiResponse, FygaroInitiateResponse } from "@/types";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "";

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<FygaroInitiateResponse>>> {
  const body = await req.json() as CheckoutPayload;

  const { cartId, customerName, customerPhone, customerEmail, deliveryMethod, deliveryAddress, deliveryBranch } = body;

  if (!cartId || !customerName || !customerPhone || !deliveryMethod) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const db = getSupabaseAdmin();

  // 1. Load cart + items
  const { data: cart, error: cartErr } = await db
    .from("hi_carts")
    .select("*, items:hi_cart_items(*, variant:hi_product_variants(*, product:hi_products(name)))")
    .eq("id", cartId)
    .eq("status", "active")
    .single();

  if (cartErr || !cart) {
    return NextResponse.json({ ok: false, error: "Cart not found or already converted" }, { status: 404 });
  }

  if (!cart.items || cart.items.length === 0) {
    return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 });
  }

  // 2. Look up customer segment and apply wholesale discount (server-side only)
  let discountPct = 0;
  if (cart.customer_id) {
    const { data: customer } = await db
      .from("hi_customers")
      .select("segment")
      .eq("id", cart.customer_id)
      .single();

    if (customer && customer.segment !== "retail") {
      const { data: tier } = await db
        .from("hi_wholesale_tiers")
        .select("discount_pct")
        .eq("segment", customer.segment)
        .single();
      discountPct = tier?.discount_pct ?? 0;
    }
  }

  // 3. Calculate totals (always server-side — never trust client amounts)
  const DELIVERY_FEES: Record<string, number> = {
    islandwide: 100000,  // J$1,000.00
    knutsford:  70000,   // J$700.00
    pickup:     0,
  };

  const subtotal   = (cart.items as any[]).reduce((sum: number, item: any) => sum + item.price_jmd * item.quantity, 0);
  const discount   = Math.round(subtotal * (discountPct / 100));
  const deliveryFee = DELIVERY_FEES[deliveryMethod] ?? 100000;
  const total      = subtotal - discount + deliveryFee;

  // 4. Build order number and create order
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderErr } = await db
    .from("hi_orders")
    .insert({
      order_number:    orderNumber,
      customer_id:     cart.customer_id,
      customer_name:   customerName,
      customer_email:  customerEmail ?? null,
      customer_phone:  customerPhone,
      status:          "pending_payment",
      delivery_method: deliveryMethod,
      delivery_address: deliveryAddress ?? null,
      delivery_branch: deliveryBranch ?? null,
      subtotal_jmd:    subtotal,
      discount_jmd:    discount,
      delivery_fee_jmd: deliveryFee,
      total_jmd:       total,
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ ok: false, error: "Failed to create order" }, { status: 500 });
  }

  // 5. Copy cart items → order items
  const orderItems = (cart.items as any[]).map((item: any) => ({
    order_id:       order.id,
    variant_id:     item.variant_id,
    product_name:   item.variant?.product?.name ?? "Hair Product",
    variant_desc:   `${item.variant?.texture ?? ""} ${item.variant?.length_in ?? ""}" ${item.variant?.colour ?? ""}`.trim(),
    quantity:       item.quantity,
    unit_price_jmd: item.price_jmd,
  }));

  await db.from("hi_order_items").insert(orderItems);

  // 6. Create Fygaro payment link
  const { paymentId, paymentLink } = await createFygaroPaymentLink({
    orderNumber,
    amountJMD:    total,
    customerName,
    customerEmail,
    customerPhone,
    description:  `House of Isabelle — Order ${orderNumber}`,
    successUrl:   `${SITE}/order/success?ref=${orderNumber}`,
    cancelUrl:    `${SITE}/checkout?cart=${cartId}`,
    webhookUrl:   `${SITE}/api/webhooks/fygaro`,
  });

  // 7. Store payment link on order
  await db
    .from("hi_orders")
    .update({ fygaro_payment_id: paymentId, fygaro_payment_link: paymentLink })
    .eq("id", order.id);

  // 8. Mark cart as converted
  await db.from("hi_carts").update({ status: "converted" }).eq("id", cartId);

  return NextResponse.json({
    ok: true,
    data: { orderId: order.id, orderNumber, paymentLink },
  });
}
