import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.INBOUND_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }

  const from = String(body.from ?? "");
  const subject = String(body.subject ?? "");
  const html = String(body.html ?? body.text ?? "");
  const bodyText = String(body.text ?? "");
  const toArr = Array.isArray(body.to) ? body.to : [body.to];
  const toEmail = String(toArr[0] ?? "info@solidtrustservices.com");

  const nameMatch = from.match(/^(.+?)\s*<(.+)>$/);
  const fromName = nameMatch ? nameMatch[1].trim() : null;
  const fromEmail = nameMatch ? nameMatch[2].trim() : from.trim();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/^\uFEFF/, ""),
    process.env.SUPABASE_SERVICE_ROLE_KEY!.replace(/^\uFEFF/, ""),
  );

  const { error } = await supabase.from("st_inbound_emails").insert({
    from_email: fromEmail,
    from_name: fromName,
    to_email: toEmail,
    subject: subject || "(no subject)",
    html,
    body_text: bodyText,
    raw: body,
  });

  if (error) {
    console.error("[inbound email] insert failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}