import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(req: NextRequest) {
  const { clientId, name, contactName, phone, email, address, notes } = await req.json();
  if (!(clientId && name)) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const { data, error } = await sb.from("ct_suppliers").insert({ client_id: clientId, name, contact_name: contactName ?? null, phone: phone ?? null, email: email ?? null, address: address ?? null, notes: notes ?? null }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) return NextResponse.json({ error: "clientId required" }, { status: 400 });
  const { data, error } = await sb.from("ct_suppliers").select("*").eq("client_id", clientId).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}