import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { checkAdminAuth, unauthorized } from "@/lib/admin-auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) return unauthorized()
  const { data, error } = await supabase
    .from("myshop_blog_posts")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) return unauthorized()
  const body = await req.json()
  const { data, error } = await supabase
    .from("myshop_blog_posts")
    .insert({ ...body, published_at: body.published ? new Date().toISOString() : null })
    .select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!checkAdminAuth(req)) return unauthorized()
  const { id, ...rest } = await req.json()
  if (rest.published && !rest.published_at) rest.published_at = new Date().toISOString()
  const { data, error } = await supabase
    .from("myshop_blog_posts")
    .update(rest).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!checkAdminAuth(req)) return unauthorized()
  const { id } = await req.json()
  const { error } = await supabase.from("myshop_blog_posts").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
