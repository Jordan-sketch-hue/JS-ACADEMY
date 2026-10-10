import { NextResponse } from "next/server";
import { buildDailyBriefEmail } from "@/lib/newsletter/template";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM = "notifications@jsupremeconglomerate.online";
const TO = "jordanmorrisr@gmail.com";
const CRON_SECRET = process.env.CRON_SECRET ?? "";

export async function POST(req: Request) {
  // Protect the endpoint — require either CRON_SECRET header or operator auth
  const auth = req.headers.get("authorization") ?? "";
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";

  if (!isVercelCron && CRON_SECRET && auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Jamaica",
  });
  const dayName = now.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "America/Jamaica",
  });

  const html = buildDailyBriefEmail({ date, dayName });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: `J Supreme Daily Brief — ${dayName}, ${date}`,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json({ error: "Resend error", detail: body }, { status: 500 });
  }

  const data = (await res.json()) as { id?: string };
  return NextResponse.json({ ok: true, id: data.id, date });
}

// Triggered by Vercel cron (see vercel.json)
export async function GET(req: Request) {
  return POST(req);
}
