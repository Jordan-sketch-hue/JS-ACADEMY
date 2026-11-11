import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    const { email, region, optin_alerts, optin_promos, optin_coupons } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }

    const { error } = await supabase
      .from("myshop_newsletter_subs")
      .upsert(
        { email: email.toLowerCase().trim(), region: region ?? "JM", optin_alerts: optin_alerts ?? true, optin_promos: optin_promos ?? true, optin_coupons: optin_coupons ?? true },
        { onConflict: "email" }
      )

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("newsletter sub error", err)
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  // Update preferences for existing sub
  try {
    const { email, ...prefs } = await req.json()
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })
    const { error } = await supabase
      .from("myshop_newsletter_subs")
      .update(prefs)
      .eq("email", email.toLowerCase().trim())
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
