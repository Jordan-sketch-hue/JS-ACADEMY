import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const { createClient } = require("@supabase/supabase-js");
  return createClient(url, key);
}

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json([]);
  const supabase = getSupabase();
  const { data, error } = await supabase.from("bit_leads").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data || []);
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return NextResponse.json({ ok: true });
  const supabase = getSupabase();
  const { error } = await supabase.from("bit_leads").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
