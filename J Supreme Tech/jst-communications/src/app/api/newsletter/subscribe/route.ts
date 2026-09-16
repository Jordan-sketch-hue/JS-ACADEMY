import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RESEND_KEY = process.env.RESEND_API_KEY!;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;
const SITE = "communications.jsupremetech.online";

function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { email, firstName, lastName, utm } = body;

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  // Add contact to Resend audience
  const res = await fetch(`https://api.resend.com/audiences/${AUDIENCE_ID}/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 jst-communications/1.0",
    },
    body: JSON.stringify({
      email,
      first_name: firstName || "",
      last_name: lastName || "",
      unsubscribed: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    if (res.status !== 409) {
      console.error("Resend subscribe error:", err);
      return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
    }
  }

  // Fire newsletter_signup event to Supabase (server-side — can't be blocked by ad blockers)
  const supabase = db();
  if (supabase) {
    await supabase.from("jst_analytics_events").insert({
      site: SITE,
      event: "newsletter_signup",
      page: "/",
      utm_source: utm?.source ?? null,
      utm_medium: utm?.medium ?? null,
      utm_campaign: utm?.campaign ?? null,
      utm_content: utm?.content ?? null,
      utm_term: utm?.term ?? null,
      props: { email_domain: email.split("@")[1] ?? null },
      visitor_hash: null,
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    });
  }

  return NextResponse.json({ ok: true });
}
