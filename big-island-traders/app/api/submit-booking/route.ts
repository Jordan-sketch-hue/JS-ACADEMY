import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Only save to Supabase if env vars are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, serviceKey);
    const { error } = await supabase.from("bit_leads").insert([{
      name: body.name,
      company: body.company,
      email: body.email,
      phone: body.phone,
      occasion: body.occasion,
      budget_range: body.budget_range,
      message: body.message,
      preferred_date: body.preferred_date,
      source: body.source || "booking_page",
      status: "new",
    }]);
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Optional: send email via Resend
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "WIAG Gifting <noreply@bigislandtraders.com>",
          to: [body.email],
          subject: "Consultation Booking Confirmed — Big Island Traders",
          html: `<p>Hi ${body.name},</p><p>Your consultation request has been received. We will contact you within 4 hours to confirm your preferred date.</p><p>Phone: 876-885-3250 | Email: bigislandtraderz@gmail.com</p><p>— Big Island Traders Team</p>`,
        }),
      });
    } catch (e) {
      console.warn("Resend email failed:", e);
    }
  }

  return NextResponse.json({ success: true });
}
