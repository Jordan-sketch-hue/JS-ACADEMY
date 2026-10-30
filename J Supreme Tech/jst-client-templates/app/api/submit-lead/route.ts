import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { sendLeadEmail, sendLeadWhatsApp } from "@/lib/notify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, name, phone, email, message, source } = body;

  if (!slug || !name || !phone || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Look up client by slug
  const { data: client, error: clientErr } = await supabase
    .from("ct_clients")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (clientErr || !client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Insert lead
  const { data: lead, error: leadErr } = await supabase
    .from("ct_leads")
    .insert({
      client_id: client.id,
      name,
      phone,
      email: email || null,
      message,
      source: source || "web",
      status: "new",
    })
    .select()
    .single();

  if (leadErr) {
    return NextResponse.json({ error: leadErr.message }, { status: 500 });
  }

  // Fire notifications — both are no-ops if env vars absent
  const payload = {
    clientName: client.name,
    clientSlug: slug,
    clientEmail: undefined,
    name,
    phone,
    email,
    message,
  };
  await Promise.all([sendLeadEmail(payload), sendLeadWhatsApp(payload)]);

  return NextResponse.json({ success: true, lead });
}
