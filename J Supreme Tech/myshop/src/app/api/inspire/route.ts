export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function svc() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get("type") ?? "editorial"
  const mood = searchParams.get("mood")
  const tag = searchParams.get("tag")
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "40"), 80)

  let q = svc().from("myshop_inspire_posts").select("*").eq("published", true).eq("type", type).order("created_at", { ascending: false }).limit(limit)
  if (mood && mood !== "All") q = q.eq("mood", mood)
  if (tag) q = q.contains("tags", [tag])

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts: data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { data, error } = await svc().from("myshop_inspire_posts").insert([{
    type: body.type ?? "user_share",
    user_id: body.user_id ?? null,
    media_url: body.media_url,
    media_type: body.media_type ?? "image",
    caption: body.caption ?? null,
    theme: body.theme ?? null,
    mood: body.mood ?? null,
    tags: body.tags ?? [],
    product_ids: body.product_ids ?? [],
    published: body.type === "editorial" ? true : false,
  }]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ post: data })
}
