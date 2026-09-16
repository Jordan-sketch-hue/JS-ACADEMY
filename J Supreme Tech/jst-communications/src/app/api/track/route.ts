import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "edge";

const SITE = "communications.jsupremetech.online";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function visitorHash(req: Request): string {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  return crypto
    .createHash("sha256")
    .update(`jst-comms:${ip}`)
    .digest("hex")
    .slice(0, 16);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(req: Request) {
  const supabase = db();
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: "not configured" }, { status: 503, headers: CORS });
  }

  const body = await req.json().catch(() => ({}));

  const row = {
    site: SITE,
    event: String(body.event ?? "page_view").slice(0, 64),
    page: String(body.page ?? "/").slice(0, 500),
    utm_source: body.utm?.source ? String(body.utm.source).slice(0, 200) : null,
    utm_medium: body.utm?.medium ? String(body.utm.medium).slice(0, 200) : null,
    utm_campaign: body.utm?.campaign ? String(body.utm.campaign).slice(0, 200) : null,
    utm_content: body.utm?.content ? String(body.utm.content).slice(0, 200) : null,
    utm_term: body.utm?.term ? String(body.utm.term).slice(0, 200) : null,
    props: body.props ?? {},
    visitor_hash: visitorHash(req),
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
  };

  await supabase.from("jst_analytics_events").insert(row);

  return NextResponse.json({ ok: true }, { headers: CORS });
}
