import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyWebhookSignature } from "@/lib/handypay";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("x-handypay-signature") ?? "";

  if (!verifyWebhookSignature(rawBody, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.paid") {
    const chargeId = event.id as string;
    const orderId = event.order_id as string;

    // Update lead status
    const { data: lead } = await supabase
      .from("ct_leads")
      .select("id, client_id, name, phone, email, message")
      .ilike("message", `%${chargeId}%`)
      .single();

    if (lead) {
      await supabase.from("ct_leads").update({ status: "confirmed" }).eq("id", lead.id);
    }

    // Log payment
    await supabase.from("ct_notifications").insert({
      client_id: lead?.client_id ?? null,
      type: "payment",
      recipient: orderId,
      template: "handypay_webhook",
      related_id: chargeId,
      status: "received",
      provider_response: event,
    }).select();
  }

  return NextResponse.json({ received: true });
}
