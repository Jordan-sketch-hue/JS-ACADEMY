import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(req: NextRequest) {
  const { clientId, customerName, service, phone, scheduledAt, notes } = await req.json();
  if (!clientId || !customerName || !service) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const { data, error } = await sb.from("ct_appointments").insert({ client_id: clientId, customer_name: customerName, service, phone: phone ?? null, scheduled_at: scheduledAt ?? null, status: "pending", notes: notes ?? null }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}