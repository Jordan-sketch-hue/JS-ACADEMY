import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { checkAdminAuth, unauthorized } from "@/lib/admin-auth"

function svc() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) return unauthorized()
  const { data, error } = await svc()
    .from("myshop_orders")
    .select("id,status,amount_usd_cents,currency,customer_name,customer_email,items,created_at")
    .order("created_at", { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
