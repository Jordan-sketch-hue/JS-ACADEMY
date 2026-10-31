import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
export async function POST(req: NextRequest) {
  const { clientId, name, category, subcategory, price, currency, description, sku } = await req.json();
  if (!clientId || !name || price == null) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const { data, error } = await sb.from("ct_products").insert({ client_id: clientId, name, category: category ?? null, subcategory: subcategory ?? null, price: Number(price), currency: currency ?? "JMD", description: description ?? null, sku: sku ?? null, active: true }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
