import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  dailySendCeiling,
  getSalesSettings,
  isSalesSendingConfigured,
} from "@/lib/sales/settings";
import { ensureSalesDefaults } from "@/lib/sales/defaults";
import { listTemplates, pickTemplate } from "@/lib/sales/templates";
import {
  countContactableByRegion,
  selectForSend,
  upsertProspects,
  updateProspect,
} from "@/lib/sales/prospects";
import { sentTodayCount, insertEmail, markEmail } from "@/lib/sales/emails";
import { isSuppressed, addSuppression } from "@/lib/sales/suppressions";
import { insertMessage } from "@/lib/sales/messages";
import { buildMergeContext, renderEmail } from "@/lib/sales/render";
import {
  makeUnsubscribeToken,
  unsubscribeUrl,
  listUnsubscribeHeaders,
} from "@/lib/sales/compliance";
import { sendSalesEmail } from "@/lib/sales/send";
import { sourceLeads, isSourcingConfigured, sourcingProviders } from "@/lib/sales/sourcing";
import type { Region, SalesProspect, SalesSettings, SalesTemplate } from "@/lib/sales/types";

const PER_TICK_MAX = 6; // sent per cron tick; frequent ticks pace the daily total

export type EngineResult = {
  ok: boolean;
  status: string;
  sourced: number;
  sent: number;
  failed: number;
  skipped: number;
  ceiling: number;
  sentToday: number;
  remaining: number;
  notes: string[];
};

function inSendWindow(s: SalesSettings, now = new Date()): boolean {
  const h = now.getUTCHours();
  return h >= s.send_window_start && h < s.send_window_end;
}

/** Top up the prospect pool from Hunter when the contactable count is thin. */
async function sourceIfNeeded(
  owner: string,
  s: SalesSettings,
  need: number,
  notes: string[],
): Promise<number> {
  if (s.mode === "b2c_optin") {
    notes.push("B2C opt-in brand — contacts come from your own consented lists, not cold sourcing.");
    return 0;
  }
  if (!isSourcingConfigured()) {
    notes.push("No sourcing provider configured (set HUNTER_API_KEY or GOOGLE_PLACES_API_KEY).");
    return 0;
  }
  const pool = await countContactableByRegion(owner);
  const total = Object.values(pool).reduce((a, b) => a + b, 0);
  if (total >= need * 2) return 0; // enough on hand

  const want = Math.min(5, Math.max(need, 3)); // small per-tick budget — Hunter rate-limits hard
  const perRegion = Math.max(1, Math.ceil(want / s.regions.length));
  const counter = { used: 0, cap: Math.min(s.hunter_daily_cap, 8) };
  let added = 0;
  for (const region of s.regions as Region[]) {
    if (counter.used >= counter.cap) break;
    const rows = await sourceLeads(region, perRegion, s, counter);
    if (rows.length) {
      const r = await upsertProspects(owner, rows);
      added += r.added;
    }
  }
  if (added) notes.push(`Sourced ${added} new prospect(s) via ${sourcingProviders()}.`);
  return added;
}

type SendTarget = { prospect: SalesProspect; step: number };

/** Initial-contact + due follow-up targets, capped to the per-tick budget. */
async function collectTargets(
  owner: string,
  s: SalesSettings,
  budget: number,
): Promise<SendTarget[]> {
  const targets: SendTarget[] = [];
  const sb = getServiceSupabase();

  // Due follow-ups first (warmer than cold).
  if (sb && budget > 0) {
    const { data } = await sb
      .from("sales_prospects")
      .select("*")
      .eq("owner_clerk_id", owner)
      .eq("status", "contacted")
      .is("reply_received_at", null)
      .not("next_action_at", "is", null)
      .lte("next_action_at", new Date().toISOString())
      .order("next_action_at", { ascending: true })
      .limit(budget);
    for (const p of (data ?? []) as SalesProspect[]) {
      const { count } = await sb
        .from("sales_emails")
        .select("id", { count: "exact", head: true })
        .eq("prospect_id", p.id)
        .eq("direction", "outbound");
      const step = (count ?? 1) + 1;
      if (step <= 3) targets.push({ prospect: p, step });
    }
  }

  // Fresh prospects fill the rest of the budget.
  const remaining = budget - targets.length;
  if (remaining > 0) {
    const fresh = await selectForSend(owner, s.regions as Region[], remaining);
    for (const p of fresh) targets.push({ prospect: p, step: 1 });
  }
  return targets.slice(0, budget);
}

async function sendOne(
  owner: string,
  s: SalesSettings,
  templates: SalesTemplate[],
  target: SendTarget,
  notes: string[],
): Promise<"sent" | "failed" | "skipped"> {
  const p = target.prospect;

  if (await isSuppressed(owner, p.email)) {
    await updateProspect(owner, p.id, { status: "suppressed" });
    return "skipped";
  }

  const tpl = pickTemplate(templates, p.service_focus, target.step);
  if (!tpl) {
    notes.push(`No template for step ${target.step}.`);
    return "skipped";
  }

  const ctx = buildMergeContext(p, s);
  const token = makeUnsubscribeToken(owner, p.email);
  const unsubUrl = unsubscribeUrl(token);
  // Opt-in B2C contacts are tagged "promo"; they get consent-based framing.
  const optin = p.service_focus === "promo";
  const { subject, html, text } = renderEmail(tpl, ctx, s, p.region, unsubUrl, optin);

  const emailId = await insertEmail(owner, {
    prospect_id: p.id,
    template_id: tpl.id,
    step: target.step,
    thread_id: p.email.toLowerCase(),
    to_email: p.email,
    from_email: s.from_email,
    reply_to: s.reply_to,
    subject,
    html,
    text,
    status: "sending",
    unsubscribe_token: token,
  });

  const res = await sendSalesEmail({
    from: s.from_email,
    fromName: s.from_name,
    to: p.email,
    subject,
    html,
    text,
    replyTo: s.reply_to,
    bcc: s.bcc_email,
    headers: listUnsubscribeHeaders(token, s.from_email),
    tags: [
      { name: "kind", value: optin ? "sales_promo" : "sales_outreach" },
      { name: "step", value: String(target.step) },
    ],
  });

  if (res.ok) {
    if (emailId) {
      await markEmail(emailId, {
        status: "sent",
        resend_id: res.id,
        sent_at: new Date().toISOString(),
      });
      await insertMessage(owner, {
        direction: "outbound",
        prospect_id: p.id,
        email_id: emailId,
        thread_id: p.email.toLowerCase(),
        from_email: s.from_email,
        to_email: p.email,
        subject,
        text,
      });
    }
    const next = new Date();
    next.setDate(next.getDate() + 3);
    await updateProspect(owner, p.id, {
      status: "contacted",
      last_contacted_at: new Date().toISOString(),
      next_action_at: target.step >= 3 ? null : next.toISOString(),
    });
    return "sent";
  }

  // Hard bounce / invalid recipient → suppress so we never retry it.
  if (!res.transient && /invalid|not.*exist|bounce|recipient/i.test(res.error)) {
    await addSuppression(owner, p.email, "invalid", "resend-reject");
  }
  if (emailId) {
    await markEmail(emailId, {
      status: res.transient ? "queued" : "failed",
      error: res.error,
      attempts: 1,
    });
  }
  return "failed";
}

/**
 * One scheduler tick. Sources prospects if needed, then sends a paced batch up
 * to the warm-up ceiling. Called by the cron and the "Run now" action.
 */
export async function runSalesEngine(
  owner: string,
  opts: { ignoreWindow?: boolean } = {},
): Promise<EngineResult> {
  const notes: string[] = [];
  await ensureSalesDefaults(owner);
  const s = await getSalesSettings(owner);

  const ceiling = dailySendCeiling(s);
  const sentToday = await sentTodayCount(owner);
  const remaining = Math.max(0, ceiling - sentToday);

  const base: EngineResult = {
    ok: true,
    status: "ok",
    sourced: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    ceiling,
    sentToday,
    remaining,
    notes,
  };

  if (!s.sending_enabled) {
    return { ...base, status: "sending_disabled", notes: ["Sending is turned off in Settings."] };
  }
  if (!opts.ignoreWindow && !inSendWindow(s)) {
    // Still source outside the window so the list keeps filling.
    const sourced = await sourceIfNeeded(owner, s, remaining || 8, notes);
    return { ...base, sourced, status: "outside_send_window" };
  }

  // Keep the pool topped up even before the domain is verified.
  const sourced = await sourceIfNeeded(owner, s, remaining || 8, notes);

  if (!isSalesSendingConfigured(s)) {
    const domain = s.from_email.split("@")[1] || "the outreach subdomain";
    notes.push(
      `${s.brand_name || owner} isn't live yet. Prospects are being collected; sends start automatically once ${domain} is verified in Resend and the brand is switched live.`,
    );
    return { ...base, sourced, status: "pending_domain_verification" };
  }
  if (remaining <= 0) {
    return { ...base, sourced, status: "daily_target_reached" };
  }

  const budget = Math.min(remaining, PER_TICK_MAX);
  const templates = await listTemplates(owner);
  const targets = await collectTargets(owner, s, budget);

  let sent = 0,
    failed = 0,
    skipped = 0;
  for (const t of targets) {
    const r = await sendOne(owner, s, templates, t, notes);
    if (r === "sent") sent++;
    else if (r === "failed") failed++;
    else skipped++;
  }

  return { ...base, sourced, sent, failed, skipped, sentToday: sentToday + sent, remaining: remaining - sent };
}
