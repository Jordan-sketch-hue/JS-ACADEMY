import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const type = req.nextUrl.searchParams.get("type"); // "order" | "booking" | null (all)

  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { data: client } = await supabase
    .from("ct_clients")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  let query = supabase
    .from("ct_leads")
    .select("id,name,phone,email,message,created_at,status")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false });

  if (type === "booking") {
    query = query.ilike("message", "%BOOKING REQUEST%");
  } else if (type === "order") {
    query = query.or("message.ilike.%ORDER:%,message.ilike.%x %");
  }

  const { data: leads } = await query;
  return NextResponse.json({ clientName: client.name, leads: leads ?? [] });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;
  if (!id || !status) return NextResponse.json({ error: "Missing id or status" }, { status: 400 });

  const { data: lead, error } = await supabase
    .from("ct_leads")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ lead });
}
