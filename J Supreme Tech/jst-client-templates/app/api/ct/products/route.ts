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

export async function PATCH(req: NextRequest) {
  const { id, name, category, subcategory, price, sku, description, active } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (category !== undefined) updates.category = category;
  if (subcategory !== undefined) updates.subcategory = subcategory;
  if (price !== undefined) updates.price = Number(price);
  if (sku !== undefined) updates.sku = sku;
  if (description !== undefined) updates.description = description;
  if (active !== undefined) updates.active = active;
  const { data, error } = await sb.from("ct_products").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await sb.from("ct_products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}