import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { origin, searchParams } = new URL(req.url)
  const next = searchParams.get("next") ?? "/account"
  // Supabase implicit flow: browser client reads the #access_token hash after redirect
  return NextResponse.redirect(`${origin}${next}`)
}
