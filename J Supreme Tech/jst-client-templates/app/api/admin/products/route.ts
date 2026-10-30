import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return true; // open when env var not set
  const token = req.headers.get("x-admin-secret") ?? req.nextUrl.searchParams.get("secret");
  return token === expected;
}

const UNAUTHORIZED = NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return UNAUTHORIZED;
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { data: client } = await supabase
    .from("ct_clients")
    .select("id, name")
    .eq("slug", slug)
    .single();

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const { data: products } = await supabase
    .from("ct_products")
    .select("id,name,category,price,currency,description,image_url,active,sku")
    .eq("client_id", client.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ clientName: client.name, products: products ?? [] });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return UNAUTHORIZED;
  const body = await req.json();
  const { slug, name, category, price, currency, description, sku } = body;

  const { data: client } = await supabase
    .from("ct_clients")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  const { data: product, error } = await supabase
    .from("ct_products")
    .insert({ client_id: client.id, name, category: category || null, price, currency: currency || "JMD", description: description || null, sku: sku || null, active: true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return UNAUTHORIZED;
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const allowed = ["name", "category", "price", "currency", "description", "image_url", "active", "sku"];
  const patch = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));

  const { data: product, error } = await supabase
    .from("ct_products")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return UNAUTHORIZED;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("ct_products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
