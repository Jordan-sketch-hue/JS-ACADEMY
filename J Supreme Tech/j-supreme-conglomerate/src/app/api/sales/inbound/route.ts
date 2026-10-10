/**
 * POST /api/sales/inbound?key=...
 *
 * Resend inbound-email webhook. When a prospect replies to sales@go.jsupremetech.online
 * (MX pointed at Resend), the reply lands here: we file it into the in-app inbox,
 * mark the prospect as replied, and stop any further follow-ups. You also get a
 * BCC on every outbound send, so replies reach your Gmail thread regardless.
 *
 * Configure in Resend with the shared secret in the URL: .../api/sales/inbound?key=<SALES_WEBHOOK_SECRET>
 */
import { getServiceSupabase } from "@/lib/supabase/admin";
import { insertMessage } from "@/lib/sales/messages";
import { findLatestEmailTo } from "@/lib/sales/emails";

export const runtime = "nodejs";
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
  } catch {
    /* ignore */
  }
  const auth = req.headers.get("authorization");
  return Boolean(auth && secrets.some((s) => auth === `Bearer ${s}`));
}

/** Pull a bare email out of a "Display Name <email@x.com>" header value. */
function extractEmail(raw: string): string {
  const m = raw.match(/<([^>]+)>/);
  return (m ? m[1] : raw).trim().toLowerCase();
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const data = (body.data ?? body) as Record<string, unknown>;
  const fromEmail = extractEmail(String(data.from ?? ""));
  const toEmail = Array.isArray(data.to) ? String(data.to[0]) : String(data.to ?? "");
  const subject = String(data.subject ?? "(no subject)");
  const text = String(data.text ?? "");
  const html = (data.html as string) ?? null;
  const messageId = String(data.message_id ?? data.messageId ?? "") || null;

  if (!fromEmail) return Response.json({ ok: false, error: "no sender" }, { status: 400 });

  const sb = getServiceSupabase();
  if (!sb) return Response.json({ ok: false, error: "no db" }, { status: 503 });

  // Attribute the reply to a known prospect (and therefore an owner).
  const { data: prospect } = await sb
    .from("sales_prospects")
    .select("id,owner_clerk_id")
    .eq("email", fromEmail)
    .maybeSingle();

  let owner = (prospect as { owner_clerk_id?: string } | null)?.owner_clerk_id ?? null;
  const prospectId = (prospect as { id?: string } | null)?.id ?? null;

  // Fall back: thread it to whoever last emailed this address.
  if (!owner) {
    const prior = await findLatestEmailTo(fromEmail);
    owner = prior?.owner_clerk_id ?? null;
  }
  if (!owner) {
    // Unknown sender — accept silently so Resend doesn't retry, but skip storage.
    return Response.json({ ok: true, stored: false });
  }

  await insertMessage(owner, {
    direction: "inbound",
    prospect_id: prospectId,
    thread_id: fromEmail,
    from_email: fromEmail,
    to_email: toEmail,
    subject,
    text,
    html,
    snippet: text.slice(0, 240),
    resend_inbound_id: messageId,
  });

  if (prospectId) {
    await sb
      .from("sales_prospects")
      .update({
        status: "replied",
        reply_received_at: new Date().toISOString(),
        next_action_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("owner_clerk_id", owner)
      .eq("id", prospectId);
  }

  return Response.json({ ok: true, stored: true });
}
