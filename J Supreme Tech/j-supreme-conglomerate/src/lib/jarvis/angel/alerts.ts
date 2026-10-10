/**
 * Angel — lead alerts.
 *
 * When triage flags a conversation as a real opportunity (a new lead, a service
 * question, someone wanting to book or see a mockup, or anything high-priority),
 * Angel emails Jordan immediately via the existing Resend pipeline so a hot lead
 * never sits unseen. The reply still waits for approval in the dashboard — the
 * email is just the heads-up.
 */
import "server-only";
import { sendNotificationEmail, isEmailConfigured } from "@/lib/notify/email";
import { INTENT_META, type AngelIntent, type AngelTriage } from "./types";
import { logAction } from "./store";

const APP_URL = "https://jsupremeconglomerate.online/jarvis/angel";

/** Intents that mean "an opportunity / someone wants to move forward". */
const ALERT_INTENTS: AngelIntent[] = [
  "new_lead",
  "service_inquiry",
  "scheduling",
  "needs_mockup",
];

/** Worth an email when it's an opportunity intent, or anything high priority — but never spam. */
export function isAlertWorthy(triage: { intent: AngelIntent; priority: string }): boolean {
  if (triage.intent === "spam") return false;
  return ALERT_INTENTS.includes(triage.intent) || triage.priority === "high";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const VERB: Record<AngelIntent, string> = {
  support_request: "needs support — settings / account / data change",
  new_lead: "is a new lead",
  service_inquiry: "asked about your services",
  scheduling: "wants to book a call",
  needs_mockup: "wants to see a mockup",
  needs_update: "asked for an update",
  follow_up: "is waiting to hear back",
  general: "sent a message",
  spam: "sent a message",
};

export type AlertThread = {
  id: string;
  brand: string;
  platform: string;
  participant_name: string | null;
  participant_username: string | null;
  last_message_text: string | null;
};

export async function sendLeadAlert(thread: AlertThread, triage: AngelTriage): Promise<boolean> {
  if (!isEmailConfigured()) return false;

  const who =
    thread.participant_name ||
    (thread.participant_username ? `@${thread.participant_username}` : "Someone");
  const channel = thread.platform === "instagram" ? "Instagram DM" : "Facebook Messenger";
  const meta = INTENT_META[triage.intent];
  const summary = triage.summary || thread.last_message_text || "(no message text)";
  const safeWho = escapeHtml(who);

  const subject = `🟢 ${meta.label}: ${who} (${channel})`;

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:540px;margin:0 auto;padding:12px;color:#111111">
    <p style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#9aa0a6;margin:0 0 10px">Angel · ${channel}</p>
    <h1 style="font-size:23px;line-height:1.35;margin:0 0 18px;font-weight:600">${meta.emoji}&nbsp; ${safeWho} ${VERB[triage.intent]}</h1>
    <p style="font-size:15px;line-height:1.65;margin:0 0 24px;color:#3c4043">${escapeHtml(summary)}</p>
    <div style="background:#f6f7f8;border-radius:14px;padding:18px 20px;margin:0 0 26px">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#9aa0a6;margin:0 0 10px">Angel drafted this reply</p>
      <p style="font-size:15px;line-height:1.65;margin:0;color:#202124">${escapeHtml(triage.draftReply)}</p>
    </div>
    <a href="${APP_URL}" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:11px">Review &amp; approve&nbsp;→</a>
    <p style="font-size:12px;color:#bdc1c6;margin:26px 0 0;line-height:1.6">${meta.label} · ${triage.priority} priority · nothing is sent until you approve it in Angel.</p>
  </div>`;

  const text = `${meta.label}: ${who} ${VERB[triage.intent]} (${channel})

What they want: ${summary}

Angel's draft reply:
${triage.draftReply}

Review & approve: ${APP_URL}
(${triage.priority} priority — nothing sends until you approve.)`;

  const res = await sendNotificationEmail({ subject, html, text });
  await logAction({
    threadUuid: thread.id,
    brand: thread.brand,
    action: res.ok ? "lead_alert_sent" : "lead_alert_failed",
    detail: res.ok ? triage.intent : res.error,
  });
  return res.ok;
}

const SHELL = "font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:540px;margin:0 auto;padding:12px;color:#111111";
const DRAFTBOX = "background:#f6f7f8;border-radius:14px;padding:18px 20px;margin:0 0 26px";
const CTA = "display:inline-block;background:#111111;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:11px";

function whoOf(t: AlertThread): string {
  return t.participant_name || (t.participant_username ? `@${t.participant_username}` : "Someone");
}
function channelOf(t: AlertThread): string {
  return t.platform === "instagram" ? "Instagram DM" : "Facebook Messenger";
}

/**
 * The "needs you" email — Angel deliberately did NOT auto-reply (money, complaint,
 * urgency, etc.). Mobile-actionable: one tap opens the thread to reply.
 */
export async function sendEscalationEmail(
  thread: AlertThread,
  triage: AngelTriage,
  reason: string,
): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  const who = whoOf(thread);
  const channel = channelOf(thread);
  const summary = triage.summary || thread.last_message_text || "(no message text)";

  const subject = `⚠️ Needs you: ${who} (${channel})`;
  const html = `
  <div style="${SHELL}">
    <p style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#d9534f;margin:0 0 10px">Angel · ${channel} · needs your call</p>
    <h1 style="font-size:23px;line-height:1.35;margin:0 0 14px;font-weight:600">⚠️&nbsp; ${escapeHtml(who)} ${VERB[triage.intent]}</h1>
    <div style="background:#fff4f4;border:1px solid #ffd7d7;border-radius:10px;padding:10px 14px;margin:0 0 18px;color:#b42318;font-size:13px">${escapeHtml(reason)}</div>
    <p style="font-size:15px;line-height:1.65;margin:0 0 24px;color:#3c4043">${escapeHtml(summary)}</p>
    <div style="${DRAFTBOX}">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#9aa0a6;margin:0 0 10px">Angel held this draft — review before it goes out</p>
      <p style="font-size:15px;line-height:1.65;margin:0;color:#202124">${escapeHtml(triage.draftReply || "(no draft)")}</p>
    </div>
    <a href="${APP_URL}" style="${CTA}">Open &amp; reply&nbsp;→</a>
    <p style="font-size:12px;color:#bdc1c6;margin:26px 0 0;line-height:1.6">Angel did <b>not</b> auto-reply to this one — it's waiting for you.</p>
  </div>`;
  const text = `NEEDS YOU: ${who} ${VERB[triage.intent]} (${channel})
Why Angel held it: ${reason}
What they want: ${summary}

Angel's held draft:
${triage.draftReply}

Open & reply: ${APP_URL}`;

  const res = await sendNotificationEmail({ subject, html, text });
  await logAction({
    threadUuid: thread.id,
    brand: thread.brand,
    action: res.ok ? "escalation_sent" : "escalation_failed",
    detail: res.ok ? reason : res.error,
  });
  return res.ok;
}

/**
 * The "you owe them an update" email — Angel previously replied with a promise
 * ("I'll check / I'll get back to you / shortly with updates") and never delivered.
 * Fires INSTEAD of a nudge so the client doesn't get poked when WE'RE the bottleneck.
 * Capped at one per thread via meta.owed_email_sent_at.
 */
export async function sendOwedUpdateEmail(
  thread: AlertThread,
  lastPromise: string,
  sinceIso: string | null,
): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  const who = whoOf(thread);
  const channel = channelOf(thread);
  const since = sinceIso ? new Date(sinceIso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "earlier";

  const subject = `⏳ You owe ${who} an update (${channel})`;
  const html = `
  <div style="${SHELL}">
    <p style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#b45309;margin:0 0 10px">Angel · ${channel} · waiting on you</p>
    <h1 style="font-size:23px;line-height:1.35;margin:0 0 14px;font-weight:600">⏳&nbsp; ${escapeHtml(who)} is waiting for the update we promised</h1>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:10px 14px;margin:0 0 18px;color:#92400e;font-size:13px">Angel was about to nudge them — but our last reply (sent <b>${escapeHtml(since)}</b>) promised an update we haven't delivered. The client isn't ghosting; we are. Emailing you instead of poking them.</div>
    <div style="${DRAFTBOX}">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#9aa0a6;margin:0 0 10px">What Angel last told them</p>
      <p style="font-size:15px;line-height:1.65;margin:0;color:#202124;white-space:pre-wrap">${escapeHtml(lastPromise)}</p>
    </div>
    <a href="${APP_URL}" style="${CTA}">Open thread &amp; reply&nbsp;→</a>
    <p style="font-size:12px;color:#bdc1c6;margin:26px 0 0;line-height:1.6">Angel will NOT auto-nudge this thread again — you decide when to follow up.</p>
  </div>`;
  const text = `YOU OWE ${who} AN UPDATE (${channel})

Angel's last reply (sent ${since}) promised an update we haven't delivered. Skipping the auto-nudge — emailing you instead.

What Angel told them:
${lastPromise}

Open & reply: ${APP_URL}`;

  const res = await sendNotificationEmail({ subject, html, text });
  await logAction({
    threadUuid: thread.id,
    brand: thread.brand,
    action: res.ok ? "owed_update_emailed" : "owed_update_email_failed",
    detail: res.ok ? "we made a promise — held nudge" : res.error,
  });
  return res.ok;
}

/** FYI that Angel auto-handled an opportunity, so Jordan stays looped and can take over. */
export async function sendAutoReplyFyi(
  thread: AlertThread,
  triage: AngelTriage,
  sentText: string,
): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  const who = whoOf(thread);
  const channel = channelOf(thread);
  const meta = INTENT_META[triage.intent];
  const summary = triage.summary || thread.last_message_text || "(no message text)";

  const subject = `✅ Angel replied: ${who} (${meta.label})`;
  const html = `
  <div style="${SHELL}">
    <p style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#1a8f4c;margin:0 0 10px">Angel · ${channel} · auto-replied</p>
    <h1 style="font-size:22px;line-height:1.35;margin:0 0 16px;font-weight:600">${meta.emoji}&nbsp; ${escapeHtml(who)} ${VERB[triage.intent]} — Angel replied</h1>
    <p style="font-size:14px;line-height:1.6;margin:0 0 8px;color:#5f6368"><b>They said:</b> ${escapeHtml(summary)}</p>
    <div style="${DRAFTBOX}">
      <p style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#9aa0a6;margin:0 0 10px">Angel sent</p>
      <p style="font-size:15px;line-height:1.65;margin:0;color:#202124">${escapeHtml(sentText)}</p>
    </div>
    <a href="${APP_URL}" style="${CTA}">Open thread / take over&nbsp;→</a>
    <p style="font-size:12px;color:#bdc1c6;margin:26px 0 0;line-height:1.6">${meta.label} · auto-handled. Reply yourself anytime to take it back.</p>
  </div>`;
  const text = `Angel auto-replied to ${who} (${meta.label}, ${channel}).
They said: ${summary}
Angel sent: ${sentText}
Open: ${APP_URL}`;

  const res = await sendNotificationEmail({ subject, html, text });
  await logAction({
    threadUuid: thread.id,
    brand: thread.brand,
    action: res.ok ? "auto_reply_fyi_sent" : "auto_reply_fyi_failed",
    detail: res.ok ? triage.intent : res.error,
  });
  return res.ok;
}
