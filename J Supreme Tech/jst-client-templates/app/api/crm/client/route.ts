import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { data: client, error } = await supabase
    .from("ct_clients")
    .select("id, slug, name, category, accent, accent_fg, phone, whatsapp, logo_url")
    .eq("slug", slug)
    .single();

  if (error || !client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  return NextResponse.json(client);
}
