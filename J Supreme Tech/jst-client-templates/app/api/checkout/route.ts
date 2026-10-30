import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createCharge, type HandyPayChargeRequest } from "@/lib/handypay";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jst-client-templates.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, customerName, customerPhone, customerEmail, items, totalCents, currency } = body;

    if (!slug || !customerName || !customerPhone || !totalCents) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch client to get client_id
    const { data: client } = await supabase
      .from("ct_clients")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const orderId = `${slug}-${Date.now()}`;

    const chargeReq: HandyPayChargeRequest = {
      order_id: orderId,
      amount: totalCents,
      currency: currency ?? "JMD",
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      description: `Order from ${client.name}`,
      line_items: items,
      pass_fees_to_customer: true,
      success_url: `${BASE_URL}/t/${slug}?payment=success`,
      cancel_url: `${BASE_URL}/t/${slug}?payment=cancelled`,
      webhook_url: `${BASE_URL}/api/webhooks/handypay`,
    };

    const charge = await createCharge(chargeReq);

    // Save lead record
    await supabase.from("ct_leads").insert({
      client_id: client.id,
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      message: `ORDER: ${items?.map((i: { name: string; quantity: number }) => `${i.quantity}x ${i.name}`).join(", ")} | Total: ${(totalCents / 100).toFixed(2)} ${currency ?? "JMD"} | Payment ID: ${charge.id}`,
      status: "new",
    });

    return NextResponse.json({ checkoutUrl: charge.checkout_url, chargeId: charge.id });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
