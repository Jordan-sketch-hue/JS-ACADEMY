import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function PATCH(req: NextRequest) {
  const { clientId, phone, whatsapp, address, headline, subline, tagline, currency, business_hours, logo_url, hero_url, crm_banner_url } = await req.json();
  if (!clientId) return NextResponse.json({ error: "Missing clientId" }, { status: 400 });
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (phone !== undefined) updates.phone = phone;
  if (whatsapp !== undefined) updates.whatsapp = whatsapp;
  if (address !== undefined) updates.address = address;
  if (headline !== undefined) updates.headline = headline;
  if (subline !== undefined) updates.subline = subline;
  if (tagline !== undefined) updates.tagline = tagline;
  if (currency !== undefined) updates.currency = currency;
  if (business_hours !== undefined) updates.business_hours = business_hours;
  if (logo_url !== undefined) updates.logo_url = logo_url;
  if (hero_url !== undefined) updates.hero_url = hero_url;
  if (crm_banner_url !== undefined) updates.crm_banner_url = crm_banner_url;
  const { data, error } = await sb.from("ct_clients").update(updates).eq("id", clientId).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}