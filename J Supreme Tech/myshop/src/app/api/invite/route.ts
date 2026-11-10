import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!code) return NextResponse.json({ valid: false, error: "No code" }, { status: 400 })

  const { data, error } = await supabase
    .from("myshop_invite_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("active", true)
    .single()

  if (error || !data) return NextResponse.json({ valid: false, error: "Invalid code" }, { status: 404 })
  if (data.max_uses !== null && data.uses >= data.max_uses) {
    return NextResponse.json({ valid: false, error: "Code limit reached" }, { status: 410 })
  }

  await supabase
    .from("myshop_invite_codes")
    .update({ uses: data.uses + 1 })
    .eq("code", code.toUpperCase())

  return NextResponse.json({ valid: true, discount_pct: data.discount_pct, code: data.code })
}