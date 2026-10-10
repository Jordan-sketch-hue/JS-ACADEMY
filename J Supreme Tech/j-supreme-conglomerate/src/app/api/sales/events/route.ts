/**
 * POST /api/sales/events?key=...
 *
 * Resend event webhook (email.delivered / opened / clicked / bounced /
 * complained). Updates the matching outbox row and, crucially, auto-suppresses
 * any address that bounces or files a spam complaint — protecting the sending
 * domain's reputation without manual intervention.
 *
 * Configure in Resend with the shared secret in the URL: .../api/sales/events?key=<SALES_WEBHOOK_SECRET>
 */
import { getServiceSupabase } from "@/lib/supabase/admin";
import { findEmailByResendId, markEmail } from "@/lib/sales/emails";
import { addSuppression } from "@/lib/sales/suppressions";
import type { EmailStatus } from "@/lib/sales/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secrets = [
    process.env.SALES_WEBHOOK_SECRET?.trim(),
    process.env.CRON_SECRET?.trim(),
  ].filter((s): s is string => !!s);
  if (secrets.length === 0) return true; // no secret configured → accept (dev)
  try {
    const key = new URL(req.url).searchParams.get("key");
    if (key && secrets.includes(key)) return true;
  } catch {
    /* ignore */
  }
  const auth = req.headers.get("authorization");
  return Boolean(auth && secrets.some((s) => auth === `Bearer ${s}`));
}

const STATUS_MAP: Record<string, EmailStatus> = {
  "email.delivered": "delivered",
  "email.opened": "opened",
  "email.clicked": "clicked",
  "email.bounced": "bounced",
  "email.complained": "complained",
};

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

  const type = String(body.type ?? "");
  const data = (body.data ?? {}) as Record<string, unknown>;
  const resendId = String(data.email_id ?? data.id ?? "");
  const to = Array.isArray(data.to) ? String(data.to[0]) : String(data.to ?? "");

  const sb = getServiceSupabase();
  const email = resendId ? await findEmailByResendId(resendId) : null;

  // Log the raw event for the dashboard / debugging.
  if (sb) {
    await sb.from("sales_events").insert({
      owner_clerk_id: email?.owner_clerk_id ?? null,
      email_id: email?.id ?? null,
      resend_id: resendId || null,
      type,
      payload: body,
    });
  }

  const newStatus = STATUS_MAP[type];
  if (email && newStatus) {
    const patch: Record<string, unknown> = { status: newStatus };
    if (type === "email.opened") patch.opened_at = new Date().toISOString();
    if (type === "email.delivered") patch.delivered_at = new Date().toISOString();
    await markEmail(email.id, patch);

    if (type === "email.bounced" || type === "email.complained") {
      const reason = type === "email.bounced" ? "bounced" : "complained";
      await addSuppression(email.owner_clerk_id, email.to_email, reason, "resend-webhook");
    }
  } else if (!email && (type === "email.bounced" || type === "email.complained") && to) {
    // No matching row but still honour the bounce/complaint if we can attribute an owner.
    if (sb) {
      const { data: p } = await sb
        .from("sales_prospects")
        .select("owner_clerk_id")
        .eq("email", to.toLowerCase())
        .maybeSingle();
      const owner = (p as { owner_clerk_id?: string } | null)?.owner_clerk_id;
      if (owner) {
        await addSuppression(owner, to, type === "email.bounced" ? "bounced" : "complained", "resend-webhook");
      }
    }
  }

  return Response.json({ ok: true });
}
