/**
 * Angel — the sync + autonomy engine.
 *
 * Per run, for each brand:
 *  1. Fetch the Meta inbox (FB Messenger + IG DMs).
 *  2. For every conversation with a FRESH client message, triage + draft, then
 *     DECIDE what to do based on the brand's autonomy setting:
 *       - escalate  → email Jordan, do NOT auto-reply (money / complaint / urgent / etc.)
 *       - auto-send → reply via Graph API, loop Jordan in if it's an opportunity
 *       - draft     → leave it in the approval queue (+ lead alert)
 *  3. Forward qualified leads into the CRM (deduped, once per thread).
 *  4. Run time-based follow-ups on threads that went quiet after we replied.
 *
 * Guardrails: only acts on messages inside ALERT_WINDOW (so a first sync / IG
 * backfill never auto-replies to months-old threads); escalation floor always
 * applies even in full-auto; follow-ups are capped.
 */
import { angelBrands, angelBrand, type AngelBrand } from "./config";
import { fetchBrandInbox } from "./meta-inbox";
import {
  triageThread,
  draftFollowUp,
  draftSeenHook,
  draftClientCheckIn,
  DEFAULT_HOOK_OFFER,
} from "./triage";
import { buildClientIndex, classifyRelationship, type ClientIndex } from "./relationship";
import { sendReply } from "./send";
import { graphGet } from "@/lib/marketing/meta/graph";
import { igGet } from "./ig-login";
import { getValidIgToken } from "./ig-store";
import {
  getThreadByKey,
  getThreadByParticipant,
  insertThread,
  updateThread,
  upsertMessages,
  listThreads,
  listMessages,
  logAction,
  getSettings,
  upsertSettings,
  patchThreadMeta,
} from "./store";
import {
  humanTakeoverActive,
  newestHumanOutboundMs,
  cooldownMs,
  fingerprint,
} from "./takeover";
import {
  isAlertWorthy,
  sendLeadAlert,
  sendEscalationEmail,
  sendAutoReplyFyi,
  sendOwedUpdateEmail,
  type AlertThread,
} from "./alerts";
import { assessEscalation, canAutoSend, needsReply, OPPORTUNITY_INTENTS } from "./autonomy";
import { forwardLeadToCrm } from "./crm-forward";
import { isTicketWorthy, createOpsTicket, sendOpsTicketPush } from "@/lib/ops-ticket";
import type {
  AngelAutonomy,
  AngelIntent,
  AngelPlatform,
  AngelThreadInput,
  AngelThreadRow,
  AngelTriage,
} from "./types";

export type SyncSummary = {
  brand: string;
  fetched: number;
  created: number;
  updated: number;
  autoReplied: number;
  escalated: number;
  followedUp: number;
  igPermissionOk: boolean;
  notes: string[];
};

type SyncCtx = {
  autonomy: AngelAutonomy;
  forwardCrm: boolean;
  followUpEnabled: boolean;
  seenHookEnabled: boolean;
  hookOffer: string;
  /** Onboarded-client roster (built once per run) so nudges know who's a client. */
  clientIndex: ClientIndex | null;
  counters: { autoReplied: number; escalated: number; followedUp: number };
};

const ALERT_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const FOLLOWUP_DELAY_MS = 2 * 24 * 60 * 60 * 1000; // wait 2 days of silence
const FOLLOWUP_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // never resurrect very old threads
const FOLLOWUP_MAX = 2; // at most 2 nudges per thread
const FOLLOWUP_PER_RUN = 5; // bound work/cost per run

// Seen-hook: fire a discount CTA a few minutes after a lead READS our reply but
// stays quiet. MIN keeps us inside the "5–10 min" window (cron ticks every 5 min);
// MAX avoids a creepy hook hours/days after the read when a tick is missed.
const SEEN_HOOK_MIN_MS = 6 * 60 * 1000; // give them ~6 min to answer first
const SEEN_HOOK_MAX_MS = 12 * 60 * 60 * 1000; // don't hook a read older than 12h
const SEEN_HOOK_PER_RUN = 8; // bound work/cost per run
// Only dangle the discount at genuine sales conversations — never spam/general.
const HOOK_INTENTS: AngelIntent[] = [
  "new_lead",
  "service_inquiry",
  "needs_mockup",
  "scheduling",
  "follow_up",
];

/**
 * Promise phrases — if OUR last reply contains any of these, the client isn't
 * ghosting us, WE owe THEM. The nudge engine treats silence-after-our-reply as
 * a ghost; that's only true when our reply was a question/invitation, not when
 * it kicked the ball forward ("I'll get back to you with X"). When matched, we
 * email Jordan once and suppress the nudge.
 */
const PROMISE_PHRASES =
  /\b(?:i(?:'|’)?ll|we(?:'|’)?ll|i\s+will|we\s+will)\s+(?:check|look\s+(?:in)?to|look\s+at|review|update(?:\s+you)?|let\s+you\s+know|get\s+back|be\s+in\s+touch|reach\s+out|follow\s+up|send|share|pass\s+(?:that|this|along)|come\s+back|circle\s+back|return|handle|sort|fix|resolve|investigate|action|process|confirm|verify|address|run\s+that\s+by)\b|\b(?:get(?:ting)?\s+back\s+to\s+you|back\s+to\s+you\s+(?:shortly|soon))\b|\bshortly\s+with\s+(?:an?\s+)?updates?\b|\bupdates?\s+(?:shortly|soon|by)\b|\b(?:once|when)\s+(?:i|we)\s+(?:hear|know|have)\b/i;

/**
 * Decide whether OUR last outbound message kicked the ball into our court.
 * Returns true when the nudge should be SUPPRESSED — caller emails Jordan instead.
 * Caps at one "you owe them" email per thread via meta.owed_email_sent_at.
 */
async function suppressNudgeIfWeOweThem(
  brand: AngelBrand,
  t: AngelThreadRow,
): Promise<boolean> {
  if (!t.last_message_text || !PROMISE_PHRASES.test(t.last_message_text)) return false;
  const meta = (t.meta ?? {}) as Record<string, unknown>;
  if (meta.owed_email_sent_at) {
    // Already alerted you about this one — just keep skipping silently.
    return true;
  }
  const alertRow: AlertThread = {
    id: t.id,
    brand: t.brand,
    platform: t.platform,
    participant_name: t.participant_name,
    participant_username: t.participant_username,
    last_message_text: t.last_message_text,
  };
  await sendOwedUpdateEmail(alertRow, t.last_message_text, t.sent_at);
  await updateThread(t.id, {
    meta: { ...meta, owed_email_sent_at: new Date().toISOString() },
    // Park it so it stops showing as an open lead in the dashboard counters.
    follow_up_count: FOLLOWUP_MAX,
  });
  void brand; // brand is part of the signature for symmetry with the cron loop
  return true;
}

function newestClientTimeMs(t: AngelThreadInput): number {
  const cm = [...t.messages].reverse().find((m) => m.fromClient);
  const iso = cm?.createdTime ?? (t.lastMessageFromClient ? t.lastMessageAt : null);
  const ms = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(ms) ? 0 : ms;
}

/** Within the window and a genuinely fresh client message (not a backfill). */
function isFreshInbound(input: AngelThreadInput): boolean {
  if (!input.lastMessageFromClient) return false;
  const newest = newestClientTimeMs(input);
  return newest > 0 && newest >= Date.now() - ALERT_WINDOW_MS;
}

function alertRowFrom(id: string, input: AngelThreadInput, existing?: AngelThreadRow | null): AlertThread {
  return {
    id,
    brand: input.brand,
    platform: input.platform,
    participant_name: input.participantName ?? existing?.participant_name ?? null,
    participant_username: input.participantUsername ?? existing?.participant_username ?? null,
    last_message_text: input.lastMessageText,
  };
}

function rowToInput(row: AngelThreadRow, msgs: Awaited<ReturnType<typeof listMessages>>): AngelThreadInput {
  return {
    brand: row.brand,
    platform: row.platform,
    threadId: row.thread_id,
    pageId: row.page_id ?? "",
    participantId: row.participant_id,
    participantName: row.participant_name,
    participantUsername: row.participant_username,
    lastMessageText: row.last_message_text,
    lastMessageAt: row.last_message_at,
    lastMessageFromClient: row.last_message_from_client,
    messageCount: row.message_count,
    messages: msgs.map((m) => ({
      messageId: m.message_id,
      fromId: m.from_id,
      fromName: m.from_name,
      fromClient: m.from_client,
      body: m.body ?? "",
      createdTime: m.created_time,
    })),
  };
}

/**
 * If the newest outbound message on this thread was typed by a human (Jordan
 * replying by hand) and it's recent, stamp `meta.human_takeover_at` so every
 * auto-send path can see it — even ones that don't have the raw messages loaded.
 * Returns the (possibly updated) meta to hand straight to actOnThread.
 */
async function stampTakeoverIfHuman(
  rowId: string,
  currentMeta: Record<string, unknown> | null | undefined,
  messages: AngelThreadInput["messages"],
): Promise<Record<string, unknown>> {
  const meta = (currentMeta ?? {}) as Record<string, unknown>;
  const humanMs = newestHumanOutboundMs(messages, meta);
  if (humanMs == null || Date.now() - humanMs >= cooldownMs()) return meta;
  const prior = typeof meta.human_takeover_at === "string" ? Date.parse(meta.human_takeover_at) : NaN;
  if (!Number.isNaN(prior) && prior >= humanMs) return meta; // already stamped this reply or newer
  const at = new Date(humanMs).toISOString();
  await updateThread(rowId, { meta: { ...meta, human_takeover_at: at } });
  await logAction({ threadUuid: rowId, action: "human_takeover", detail: at });
  return { ...meta, human_takeover_at: at };
}

/**
 * Decide + act on a freshly-triaged thread. Mutates the row in the DB and sends
 * messages/emails as needed. Returns the action taken. `currentMeta` carries the
 * thread's latest meta (incl. any human-takeover stamp) so we never auto-send on
 * top of Jordan while he's personally handling the chat.
 */
async function actOnThread(
  rowId: string,
  input: AngelThreadInput,
  triage: AngelTriage,
  ctx: SyncCtx,
  draftIsFree: boolean,
  currentMeta?: Record<string, unknown> | null,
): Promise<"escalated" | "auto_replied" | "drafted" | "held"> {
  const alertRow = alertRowFrom(rowId, input);
  const escalation = assessEscalation(input, triage);

  // 1) Escalate — never auto-reply to money / complaints / urgent / unclear.
  if (escalation.escalate) {
    await updateThread(rowId, {
      status: "open",
      escalated_at: new Date().toISOString(),
      ...(draftIsFree ? { draft_reply: triage.draftReply, draft_status: "pending" } : {}),
    });
    await sendEscalationEmail(alertRow, triage, escalation.reason ?? "Needs your attention");
    ctx.counters.escalated++;
    return "escalated";
  }

  // 1.5) Hands off if Jordan is personally handling this chat right now. We still
  // drop a draft into the queue (invisible to the client, handy for him) but never
  // send on our own — no talking over the owner mid-reply.
  if (
    canAutoSend(ctx.autonomy, triage.intent) &&
    humanTakeoverActive({ messages: input.messages, meta: currentMeta })
  ) {
    await updateThread(rowId, {
      status: "open",
      ...(draftIsFree ? { draft_reply: triage.draftReply, draft_status: "pending" } : {}),
    });
    await logAction({
      threadUuid: rowId,
      brand: input.brand,
      action: "held_for_human",
      detail: "owner active — auto-send suppressed",
    });
    return "held";
  }

  // 1.75) Cut off the volley. Angel sends ONE opener automatically; once that's out
  // (meta.auto_opened_at is stamped), a real conversation has started — we do NOT keep
  // auto-firing scripts. A client reply that actually needs an answer is handed to
  // Jordan with a ready draft (and one heads-up email); a pure "ok / thanks / 👍" gets
  // no reply at all. If there's nothing to follow up on, we don't follow up.
  if (canAutoSend(ctx.autonomy, triage.intent)) {
    const metaObj = (currentMeta ?? {}) as Record<string, unknown>;
    if (metaObj.auto_opened_at) {
      if (!needsReply(input.lastMessageText)) {
        await updateThread(rowId, { status: "open" });
        await logAction({
          threadUuid: rowId,
          brand: input.brand,
          action: "left_quiet",
          detail: "ack / no context — no reply needed",
        });
        return "held";
      }
      // Substantive reply after the opener → hand it to Jordan. Draft it for him, and
      // email him ONCE per thread (not on every back-and-forth message).
      await updateThread(rowId, {
        status: "open",
        ...(draftIsFree ? { draft_reply: triage.draftReply, draft_status: "pending" } : {}),
      });
      if (!metaObj.handoff_emailed_at) {
        await sendEscalationEmail(
          alertRow,
          triage,
          "Client replied — over to you (Angel already sent the opener)",
        );
        await patchThreadMeta(rowId, { handoff_emailed_at: new Date().toISOString() });
        ctx.counters.escalated++;
        return "escalated";
      }
      await logAction({
        threadUuid: rowId,
        brand: input.brand,
        action: "handoff_draft",
        detail: "client replied — draft refreshed for you",
      });
      return "drafted";
    }
  }

  // 2) Auto-send when autonomy allows and we have a usable draft + recipient.
  if (canAutoSend(ctx.autonomy, triage.intent) && triage.draftReply.trim() && input.participantId) {
    const res = await sendReply(rowId, triage.draftReply); // marks sent/done/sent_at
    if (res.ok) {
      await updateThread(rowId, { auto_handled: true });
      // Stamp the opener so the next client reply hits the cut-off guard above.
      // patchThreadMeta read-modify-writes so it keeps the angel_sent fingerprint
      // sendReply just stored (don't overwrite meta with the pre-send snapshot).
      await patchThreadMeta(rowId, { auto_opened_at: new Date().toISOString() });
      if (OPPORTUNITY_INTENTS.includes(triage.intent)) {
        await sendAutoReplyFyi(alertRow, triage, triage.draftReply);
      }
      ctx.counters.autoReplied++;
      return "auto_replied";
    }
    // Send failed (e.g. outside Meta's 24h window) → hold it for Jordan.
    await updateThread(rowId, {
      status: "open",
      escalated_at: new Date().toISOString(),
      ...(draftIsFree ? { draft_reply: triage.draftReply, draft_status: "pending" } : {}),
    });
    await sendEscalationEmail(alertRow, triage, `Couldn't auto-send: ${res.error ?? "Meta error"}`);
    ctx.counters.escalated++;
    return "escalated";
  }

  // 3) Approval mode (or faq_auto on a non-FAQ intent) → leave a draft + alert.
  await updateThread(rowId, {
    status: "open",
    ...(draftIsFree ? { draft_reply: triage.draftReply, draft_status: "pending" } : {}),
  });
  if (isAlertWorthy(triage)) await sendLeadAlert(alertRow, triage);
  return "drafted";
}

async function maybeForwardCrm(
  rowId: string,
  input: AngelThreadInput,
  triage: AngelTriage,
  ctx: SyncCtx,
  alreadyForwarded: boolean,
): Promise<void> {
  if (!ctx.forwardCrm || alreadyForwarded) return;
  if (!OPPORTUNITY_INTENTS.includes(triage.intent)) return;
  const leadId = await forwardLeadToCrm(rowId, input, triage);
  await updateThread(rowId, {
    crm_forwarded_at: new Date().toISOString(),
    ...(leadId ? { crm_lead_id: leadId } : {}),
  });
}

async function syncThread(input: AngelThreadInput, ctx: SyncCtx): Promise<"created" | "updated"> {
  const existing = await getThreadByKey(input.brand, input.platform, input.threadId);

  if (!existing) {
    const tri = await triageThread(input);
    const row = await insertThread({
      brand: input.brand,
      platform: input.platform,
      thread_id: input.threadId,
      page_id: input.pageId,
      participant_id: input.participantId,
      participant_name: input.participantName,
      participant_username: input.participantUsername,
      last_message_text: input.lastMessageText,
      last_message_at: input.lastMessageAt,
      last_message_from_client: input.lastMessageFromClient,
      message_count: input.messageCount,
      intent: tri.intent,
      priority: tri.priority,
      summary: tri.summary,
      triage_engine: tri.engine,
      triaged_at: new Date().toISOString(),
      draft_reply: tri.draftReply,
      draft_status: "pending",
      status: "open",
    });
    await upsertMessages(row.id, input.messages);
    await logAction({
      threadUuid: row.id,
      brand: input.brand,
      action: "triaged",
      detail: `${tri.engine} · ${tri.intent}`,
    });
    if (isFreshInbound(input)) {
      const meta = await stampTakeoverIfHuman(row.id, row.meta, input.messages);
      await actOnThread(row.id, input, tri, ctx, true, meta);
      await maybeForwardCrm(row.id, input, tri, ctx, false);
    }
    return "created";
  }

  await upsertMessages(existing.id, input.messages);

  const lastTriagedMs = existing.triaged_at ? Date.parse(existing.triaged_at) : 0;
  const newestClientMs = newestClientTimeMs(input);
  const hasNewInbound = input.lastMessageFromClient && newestClientMs > lastTriagedMs;

  // Always keep message metadata current.
  const metaPatch: Record<string, unknown> = {
    last_message_text: input.lastMessageText,
    last_message_at: input.lastMessageAt,
    last_message_from_client: input.lastMessageFromClient,
    message_count: input.messageCount,
    participant_name: input.participantName ?? existing.participant_name,
    participant_username: input.participantUsername ?? existing.participant_username,
    participant_id: input.participantId ?? existing.participant_id,
  };

  if (hasNewInbound && isFreshInbound(input)) {
    const tri = await triageThread(input);
    Object.assign(metaPatch, {
      intent: tri.intent,
      priority: tri.priority,
      summary: tri.summary,
      triage_engine: tri.engine,
      triaged_at: new Date().toISOString(),
    });
    await updateThread(existing.id, metaPatch);

    const draftIsFree =
      existing.draft_status === "pending" || existing.draft_status === "dismissed";
    const meta = await stampTakeoverIfHuman(existing.id, existing.meta, input.messages);
    await actOnThread(existing.id, input, tri, ctx, draftIsFree, meta);
    await maybeForwardCrm(existing.id, input, tri, ctx, !!existing.crm_forwarded_at);
  } else {
    await updateThread(existing.id, metaPatch);
  }

  return "updated";
}

/** Proactive follow-ups: nudge contacts who went quiet after we replied. */
async function runFollowUps(brand: AngelBrand, ctx: SyncCtx): Promise<void> {
  if (!ctx.followUpEnabled) return;
  const candidates = await listThreads({ brand: brand.slug, statuses: ["done"] });
  const now = Date.now();
  let done = 0;

  for (const t of candidates) {
    if (done >= FOLLOWUP_PER_RUN) break;
    if ((t.follow_up_count ?? 0) >= FOLLOWUP_MAX) continue;
    if (t.last_message_from_client) continue; // they replied → main loop handles it
    if (!t.sent_at) continue; // only follow up threads we actually replied to
    if (humanTakeoverActive({ meta: t.meta })) continue; // Jordan's on it — don't nudge over him
    const sentMs = Date.parse(t.sent_at);
    if (now - sentMs > FOLLOWUP_MAX_AGE_MS) continue; // too old to resurrect
    const lastTouch = Date.parse(t.last_follow_up_at ?? t.sent_at);
    if (now - lastTouch < FOLLOWUP_DELAY_MS) continue; // not quiet long enough
    // Our last reply promised an update we never delivered → email Jordan, don't nudge them.
    if (await suppressNudgeIfWeOweThem(brand, t)) continue;

    const msgs = await listMessages(t.id);
    const input = rowToInput(t, msgs);
    // Existing clients get a warm, relationship-tone check-in; new leads get the
    // sales-y "still interested?" chase.
    const relationship = classifyRelationship({ input, intent: t.intent, index: ctx.clientIndex });
    const isClient = relationship === "existing_client";
    const text = isClient ? await draftClientCheckIn(input) : await draftFollowUp(input);
    const nextCount = (t.follow_up_count ?? 0) + 1;
    const relMeta = { ...((t.meta ?? {}) as Record<string, unknown>), relationship };
    const detail = `#${nextCount}${isClient ? " · client" : ""}`;

    if (ctx.autonomy === "full_auto") {
      const res = await sendReply(t.id, text); // sets status done + sent_at
      if (res.ok) {
        await updateThread(t.id, {
          follow_up_count: nextCount,
          last_follow_up_at: new Date().toISOString(),
          auto_handled: true,
          meta: relMeta,
        });
        await logAction({ threadUuid: t.id, brand: brand.slug, action: "follow_up_sent", detail });
        ctx.counters.followedUp++;
        done++;
      }
    } else {
      await updateThread(t.id, {
        draft_reply: text,
        draft_status: "pending",
        status: "open",
        follow_up_count: nextCount,
        last_follow_up_at: new Date().toISOString(),
        meta: relMeta,
      });
      await logAction({ threadUuid: t.id, brand: brand.slug, action: "follow_up_drafted", detail });
      ctx.counters.followedUp++;
      done++;
    }
  }
}

/**
 * Seen-hooks: a few minutes after a lead READS our reply but stays silent, send
 * (full_auto) or draft a warm nudge that dangles the configured discount. Read
 * receipts are stamped onto `meta.seen_at` by processRead (webhook); we act here
 * once that's aged past the grace window. One hook per thread (`meta.hook_sent_at`).
 */
async function runSeenHooks(brand: AngelBrand, ctx: SyncCtx): Promise<void> {
  if (!ctx.seenHookEnabled) return;
  const candidates = await listThreads({ brand: brand.slug, statuses: ["done"] });
  const now = Date.now();
  let done = 0;

  for (const t of candidates) {
    if (done >= SEEN_HOOK_PER_RUN) break;
    if (t.last_message_from_client) continue; // they replied → not a ghost
    if (!t.sent_at) continue; // we must have actually replied
    if (!t.intent || !HOOK_INTENTS.includes(t.intent)) continue; // sales chats only

    const meta = (t.meta ?? {}) as Record<string, unknown>;
    if (meta.hook_sent_at) continue; // one hook per thread (or already skipped)
    if (humanTakeoverActive({ meta })) continue; // Jordan's on it — no discount hook over him
    const seenMs = typeof meta.seen_at === "string" ? Date.parse(meta.seen_at) : NaN;
    if (Number.isNaN(seenMs)) continue; // never seen our reply → nothing to hook

    const sinceSeen = now - seenMs;
    if (sinceSeen < SEEN_HOOK_MIN_MS) continue; // still inside their grace period
    if (sinceSeen > SEEN_HOOK_MAX_MS) {
      // Read is stale (a tick was missed) — mark so we stop scanning it, no creepy late hook.
      await updateThread(t.id, { meta: { ...meta, hook_sent_at: "skipped_stale" } });
      continue;
    }
    // Our last reply promised an update we never delivered → email Jordan, don't hook them.
    if (await suppressNudgeIfWeOweThem(brand, t)) {
      // Stamp hook_sent_at too so this thread is permanently out of the seen-hook scan.
      await updateThread(t.id, { meta: { ...meta, hook_sent_at: "skipped_we_owe" } });
      continue;
    }

    const msgs = await listMessages(t.id);
    const input = rowToInput(t, msgs);
    // Never dangle the new-customer discount at someone we already serve — a
    // current client gets a warm, no-discount check-in instead of the hook.
    const relationship = classifyRelationship({ input, intent: t.intent, index: ctx.clientIndex });
    const isClient = relationship === "existing_client";
    const text = isClient
      ? await draftClientCheckIn(input)
      : await draftSeenHook(input, ctx.hookOffer);
    const stampedMeta = { ...meta, relationship, hook_sent_at: new Date().toISOString() };
    const detail = isClient ? "client check-in (no discount)" : "discount cta";

    if (ctx.autonomy === "full_auto") {
      const res = await sendReply(t.id, text); // sets status done + sent_at; leaves meta intact
      if (res.ok) {
        await updateThread(t.id, { meta: stampedMeta, auto_handled: true });
        await logAction({ threadUuid: t.id, brand: brand.slug, action: "seen_hook_sent", detail });
        ctx.counters.followedUp++;
        done++;
      }
    } else {
      await updateThread(t.id, {
        draft_reply: text,
        draft_status: "pending",
        status: "open",
        meta: stampedMeta,
      });
      await logAction({ threadUuid: t.id, brand: brand.slug, action: "seen_hook_drafted", detail });
      ctx.counters.followedUp++;
      done++;
    }
  }
}

async function loadCtx(brandSlug: string): Promise<SyncCtx> {
  const settings = await getSettings(brandSlug);
  // Proactive nudges (the "still interested?" follow-up + the discount seen-hook) are
  // OFF by default. Two reasons: (1) the follow-up waits 2 days of silence, which is
  // OUTSIDE Meta's 24h messaging window — those sends fail anyway; (2) dangling "10%
  // off if you start this week" at someone you can't even reach after 24h makes no
  // sense. Only run them if explicitly opted back in with ANGEL_NUDGES=1.
  const nudgesAllowed = process.env.ANGEL_NUDGES === "1";
  return {
    autonomy:
      (settings?.autonomy as AngelAutonomy) ||
      (process.env.ANGEL_AUTONOMY as AngelAutonomy) ||
      "full_auto",
    forwardCrm: settings?.forward_crm ?? true,
    followUpEnabled: nudgesAllowed && (settings?.follow_up_enabled ?? false),
    seenHookEnabled: nudgesAllowed && (settings?.seen_hook_enabled ?? false),
    hookOffer:
      settings?.hook_offer?.trim() ||
      process.env.ANGEL_HOOK_OFFER?.trim() ||
      DEFAULT_HOOK_OFFER,
    clientIndex: null,
    counters: { autoReplied: 0, escalated: 0, followedUp: 0 },
  };
}

export async function syncBrand(brand: AngelBrand): Promise<SyncSummary> {
  const ctx = await loadCtx(brand.slug);

  // Build the onboarded-client roster once per run so the nudges below can tell an
  // existing client apart from a new lead (best-effort — never block the sync on it).
  if (ctx.followUpEnabled || ctx.seenHookEnabled) {
    try {
      ctx.clientIndex = await buildClientIndex();
    } catch {
      ctx.clientIndex = null;
    }
  }

  const { threads, igPermissionOk, notes } = await fetchBrandInbox(brand);
  let created = 0;
  let updated = 0;
  for (const t of threads) {
    try {
      const r = await syncThread(t, ctx);
      if (r === "created") created++;
      else updated++;
    } catch (e) {
      notes.push(`thread ${t.threadId}: ${e instanceof Error ? e.message : "error"}`);
    }
  }

  try {
    await runFollowUps(brand, ctx);
  } catch (e) {
    notes.push(`follow-ups: ${e instanceof Error ? e.message : "error"}`);
  }

  try {
    await runSeenHooks(brand, ctx);
  } catch (e) {
    notes.push(`seen-hooks: ${e instanceof Error ? e.message : "error"}`);
  }

  await upsertSettings(brand.slug, {
    ig_permission_ok: igPermissionOk,
    last_sync_at: new Date().toISOString(),
    last_sync_note: notes.slice(0, 6).join(" · ") || "ok",
  });

  return {
    brand: brand.slug,
    fetched: threads.length,
    created,
    updated,
    autoReplied: ctx.counters.autoReplied,
    escalated: ctx.counters.escalated,
    followedUp: ctx.counters.followedUp,
    igPermissionOk,
    notes,
  };
}

export async function syncAllBrands(): Promise<SyncSummary[]> {
  const out: SyncSummary[] = [];
  for (const b of angelBrands()) {
    try {
      out.push(await syncBrand(b));
    } catch (e) {
      out.push({
        brand: b.slug,
        fetched: 0,
        created: 0,
        updated: 0,
        autoReplied: 0,
        escalated: 0,
        followedUp: 0,
        igPermissionOk: false,
        notes: [e instanceof Error ? e.message : "sync error"],
      });
    }
  }
  return out;
}

/* --------------------------- real-time inbound ---------------------------- */

async function fetchSenderProfile(
  brand: AngelBrand,
  platform: AngelPlatform,
  senderId: string,
): Promise<{ name: string | null; username: string | null }> {
  try {
    if (platform === "instagram") {
      const ig = await getValidIgToken(brand.slug);
      if (ig) {
        const p = await igGet<{ username?: string; name?: string }>(senderId, ig.token, {
          fields: "username,name",
        });
        return { name: p.name ?? p.username ?? null, username: p.username ?? null };
      }
    } else {
      const p = await graphGet<{ name?: string; first_name?: string }>(senderId, brand.pageToken, {
        fields: "name,first_name",
      });
      return { name: p.name ?? p.first_name ?? null, username: null };
    }
  } catch {
    // best-effort — a message-request sender's profile may not be readable
  }
  return { name: null, username: null };
}

/**
 * Process a "read" / "seen" webhook event: the lead opened the chat and read up
 * to their watermark. If we sent last and they haven't replied, stamp the moment
 * onto `meta.seen_at` (first read only) so runSeenHooks can nudge after the grace
 * window. No-op unless we're actually waiting on them — never overwrites an
 * existing stamp or a thread we haven't replied to.
 */
export async function processRead(opts: {
  brandSlug: string;
  platform: AngelPlatform;
  senderId: string;
}): Promise<void> {
  const brand = angelBrand(opts.brandSlug);
  if (!brand || !opts.senderId) return;
  const thread =
    (await getThreadByParticipant(opts.brandSlug, opts.platform, opts.senderId)) ??
    (await getThreadByKey(opts.brandSlug, opts.platform, `${opts.platform}:${opts.senderId}`));
  if (!thread) return;
  if (thread.last_message_from_client) return; // they've already replied — nothing to chase
  if (!thread.sent_at) return; // we never actually replied → not our reply being read

  const meta = (thread.meta ?? {}) as Record<string, unknown>;
  if (meta.seen_at || meta.hook_sent_at) return; // first read only; don't reset the clock

  await updateThread(thread.id, { meta: { ...meta, seen_at: new Date().toISOString() } });
  await logAction({ threadUuid: thread.id, brand: opts.brandSlug, action: "seen", detail: opts.platform });
}

/**
 * Process a "message echo" webhook event: a reply that went out on OUR account.
 * Meta sends one for BOTH Angel's own sends and messages Jordan types by hand in
 * the IG/Messenger app. We recognize Angel's via the sent-fingerprint ring buffer;
 * anything else is Jordan personally jumping in → stamp `human_takeover_at` so the
 * next client message doesn't get an auto-reply on top of him. Real-time path; the
 * cron poll is the fallback when the `message_echoes` field isn't subscribed.
 *
 * For an echo, `senderId` is our account and `recipientId` is the client — so we
 * locate the thread by the recipient.
 */
export async function processEcho(opts: {
  brandSlug: string;
  platform: AngelPlatform;
  recipientId: string;
  text: string;
}): Promise<void> {
  if (!opts.recipientId || !opts.text.trim()) return;
  const thread =
    (await getThreadByParticipant(opts.brandSlug, opts.platform, opts.recipientId)) ??
    (await getThreadByKey(opts.brandSlug, opts.platform, `${opts.platform}:${opts.recipientId}`));
  if (!thread) return;

  const meta = (thread.meta ?? {}) as Record<string, unknown>;
  const sent = Array.isArray(meta.angel_sent) ? (meta.angel_sent as unknown[]).map(String) : [];
  if (sent.includes(fingerprint(opts.text))) return; // our own send echoed back — ignore

  await patchThreadMeta(thread.id, { human_takeover_at: new Date().toISOString() });
  await logAction({
    threadUuid: thread.id,
    brand: opts.brandSlug,
    action: "human_takeover",
    detail: "echo · owner replied in app",
  });
}

/**
 * Process a single inbound DM delivered by the webhook (works even for message
 * REQUESTS, which the polling conversations endpoint can't see). Ingest → triage
 * → act per autonomy. Deduped on message id so Meta retries don't double-send.
 */
export async function processInbound(opts: {
  brandSlug: string;
  platform: AngelPlatform;
  senderId: string;
  text: string;
  messageId: string;
  createdTime?: string;
}): Promise<void> {
  const brand = angelBrand(opts.brandSlug);
  if (!brand) return;
  const ctx = await loadCtx(opts.brandSlug);
  const threadId = `${opts.platform}:${opts.senderId}`;
  const createdTime = opts.createdTime ?? new Date().toISOString();

  let existing = await getThreadByKey(opts.brandSlug, opts.platform, threadId);
  if (!existing) {
    const profile = await fetchSenderProfile(brand, opts.platform, opts.senderId);
    existing = await insertThread({
      brand: opts.brandSlug,
      platform: opts.platform,
      thread_id: threadId,
      page_id: brand.pageId,
      participant_id: opts.senderId,
      participant_name: profile.name,
      participant_username: profile.username,
      last_message_text: opts.text,
      last_message_at: createdTime,
      last_message_from_client: true,
      message_count: 1,
      draft_status: "pending",
      status: "open",
    });
  }

  // Dedup: if we've already stored this message id, the webhook is a retry.
  const priorMsgs = await listMessages(existing.id);
  if (opts.messageId && priorMsgs.some((m) => m.message_id === opts.messageId)) return;

  await upsertMessages(existing.id, [
    {
      messageId: opts.messageId || `${Date.parse(createdTime) || Date.now()}`,
      fromId: opts.senderId,
      fromName: existing.participant_name,
      fromClient: true,
      body: opts.text,
      createdTime,
    },
  ]);

  const msgs = await listMessages(existing.id);
  const input: AngelThreadInput = {
    brand: opts.brandSlug,
    platform: opts.platform,
    threadId,
    pageId: brand.pageId,
    participantId: opts.senderId,
    participantName: existing.participant_name,
    participantUsername: existing.participant_username,
    lastMessageText: opts.text,
    lastMessageAt: createdTime,
    lastMessageFromClient: true,
    messageCount: msgs.length,
    messages: msgs.map((m) => ({
      messageId: m.message_id,
      fromId: m.from_id,
      fromName: m.from_name,
      fromClient: m.from_client,
      body: m.body ?? "",
      createdTime: m.created_time,
    })),
  };

  const tri = await triageThread(input);
  await updateThread(existing.id, {
    last_message_text: opts.text,
    last_message_at: createdTime,
    last_message_from_client: true,
    message_count: msgs.length,
    intent: tri.intent,
    priority: tri.priority,
    summary: tri.summary,
    triage_engine: tri.engine,
    triaged_at: new Date().toISOString(),
  });

  const draftIsFree =
    existing.draft_status === "pending" || existing.draft_status === "dismissed";
  const meta = await stampTakeoverIfHuman(existing.id, existing.meta, input.messages);
  await actOnThread(existing.id, input, tri, ctx, draftIsFree, meta);
  await maybeForwardCrm(existing.id, input, tri, ctx, !!existing.crm_forwarded_at);

  // Ops ticket + push notification for ticket-worthy IG/FB DMs.
  if (isTicketWorthy(tri.intent, tri.priority)) {
    const transcript = input.messages
      .slice(-20)
      .map((m) => `[${m.fromClient ? "Client" : "Jordan"}] ${m.body}`)
      .join("\n");
    const ticketRef = await createOpsTicket({
      source: opts.platform,
      sourceKey: `${opts.platform}:${opts.senderId}:${opts.messageId}`,
      clientName: existing.participant_name ?? null,
      contact: existing.participant_username ?? opts.senderId,
      channel: opts.platform,
      category: tri.intent ?? "inquiry",
      priority: tri.priority ?? "normal",
      summary: tri.summary ?? null,
      bodyText: transcript,
    });
    if (ticketRef) {
      sendOpsTicketPush(
        ticketRef,
        `${existing.participant_name ?? opts.senderId} — ${tri.intent}`,
        tri.summary,
        { url: "/jarvis/whatsapp", urgent: tri.priority === "high" },
      );
    }
  }
}
