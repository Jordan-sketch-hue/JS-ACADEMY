import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET /api/admin/products — list all products
export async function GET() {
  const sb = adminClient()
  const { data, error } = await sb
    .from("myshop_products")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/admin/products — create product
export async function POST(req: NextRequest) {
  const sb = adminClient()
  const body = await req.json()
  const { data, error } = await sb
    .from("myshop_products")
    .insert(body)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH /api/admin/products — update product
export async function PATCH(req: NextRequest) {
  const sb = adminClient()
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const { data, error } = await sb
    .from("myshop_products")
    .update(updates)
    .eq("id", id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/admin/products — delete product
export async function DELETE(req: NextRequest) {
  const sb = adminClient()
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  const { error } = await sb.from("myshop_products").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
