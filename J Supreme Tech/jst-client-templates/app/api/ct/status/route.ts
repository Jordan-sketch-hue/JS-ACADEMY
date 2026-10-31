import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const ALLOWED = ["ct_appointments","ct_jobs","ct_orders","ct_leads","ct_tasks","ct_quotes","ct_payments"];
export async function PATCH(req: NextRequest) {
  const { table, id, status } = await req.json();
  if (!table || !id || !status || !ALLOWED.includes(table)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { error } = await sb.from(table).update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}