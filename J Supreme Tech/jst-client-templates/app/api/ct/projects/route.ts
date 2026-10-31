import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(req: NextRequest) {
  const { clientId, title, description, clientName, dueAt, status, budget, currency } = await req.json();
  if (!(clientId && title)) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  const { data, error } = await sb.from("ct_projects").insert({ client_id: clientId, title, description: description ?? null, client_name: clientName ?? null, due_at: dueAt ?? null, status: status ?? 'active', budget: budget ? Number(budget) : null, currency: currency ?? 'JMD' }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
export async function GET(req: NextRequest) {
  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) return NextResponse.json({ error: "clientId required" }, { status: 400 });
  const { data, error } = await sb.from("ct_projects").select("*").eq("client_id", clientId).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}