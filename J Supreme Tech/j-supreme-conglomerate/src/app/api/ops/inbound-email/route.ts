/**
 * POST /api/ops/inbound-email?key=<SALES_WEBHOOK_SECRET>
 *
 * Resend inbound-email webhook — catches ALL inbound emails across every JST
 * domain (ops@jsupremetech.online, hello@..., support@..., etc.).
 *
 * In Resend: set each domain's inbound webhook to this URL with ?key=<secret>.
 * Every inbound email creates an ops_ticket + fires a push notification.
 */
import { NextResponse } from "next/server";
import { createOpsTicket, sendOpsTicketPush } from "@/lib/ops-ticket";

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secrets = [
    process.env.SALES_WEBHOOK_SECRET?.trim(),
    process.env.CRON_SECRET?.trim(),
  ].filter((s): s is string => !!s);
  if (secrets.length === 0) return true;
  try {
    const key = new URL(req.url).searchParams.get("key");
    if (key && secrets.includes(key)) return true;
  } catch { /* ignore */ }
  const authHeader = req.headers.get("authorization");
  return Boolean(authHeader && secrets.some((s) => authHeader === `Bearer ${s}`));
}

function extractEmail(raw: string): string {
  const m = raw.match(/<([^>]+)>/);
  return (m ? m[1] : raw).trim().toLowerCase();
}

function extractName(raw: string): string | null {
  const m = raw.match(/^([^<]+)<[^>]+>/);
  return m ? m[1].trim().replace(/^"|"$/g, "") : null;
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const data = (body.data ?? body) as Record<string, unknown>;
  const fromRaw = String(data.from ?? "");
  const fromEmail = extractEmail(fromRaw);
  const fromName = extractName(fromRaw);
  const toEmail = Array.isArray(data.to) ? String(data.to[0]) : String(data.to ?? "");
  const subject = String(data.subject ?? "(no subject)");
  const text = String(data.text ?? data.html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const messageId = String(data.message_id ?? data.messageId ?? "") || `email_${Date.now()}`;

  if (!fromEmail) return NextResponse.json({ ok: false, error: "no sender" }, { status: 400 });

  const summary = subject.slice(0, 160);
  const bodyText = `From: ${fromEmail}\nTo: ${toEmail}\nSubject: ${subject}\n\n${text}`.slice(0, 4000);

  const ticketRef = await createOpsTicket({
    source: "email",
    sourceKey: messageId,
    clientName: fromName,
    contact: fromEmail,
    channel: "email",
    category: "inquiry",
    priority: "normal",
    summary,
    bodyText,
    actionNeeded: `Reply to ${fromEmail}`,
  });

  if (ticketRef) {
    sendOpsTicketPush(
      ticketRef,
      `Email: ${fromName ?? fromEmail}`,
      summary,
    );
  }

  return NextResponse.json({ ok: true, ticketRef });
}
