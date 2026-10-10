/**
 * Angel — triage a conversation into an action bucket + draft a reply.
 *
 * Two engines, picked automatically:
 *  - OpenAI (when OPENAI_API_KEY is set) — same key the Jarvis chat uses. Reads
 *    the conversation and returns intent / priority / summary / a ready reply.
 *  - Heuristic fallback — keyword rules + templated drafts. Always available,
 *    zero cost, deterministic. Guarantees Angel works even with no AI key.
 *
 * Nothing here sends anything — it only produces a suggested draft.
 */
import { buildScriptPlaybook } from "./playbook";
import type {
  AngelIntent,
  AngelPriority,
  AngelThreadInput,
  AngelTriage,
} from "./types";

const HOUR_MS = 1000 * 60 * 60;

function ageHours(iso: string | null): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : (Date.now() - t) / HOUR_MS;
}

function transcript(thread: AngelThreadInput, max = 8): string {
  return thread.messages
    .slice(-max)
    .map(
      (m) =>
        `${m.fromClient ? thread.participantName || "Client" : "Us"}: ${m.body || "[attachment]"}`,
    )
    .join("\n");
}

/* ------------------------------- heuristics ------------------------------- */

const RULES: { intent: AngelIntent; re: RegExp }[] = [
  // ORDER MATTERS — support tickets MUST be checked before needs_update, because
  // they share verbs ("update", "change", "delete", "remove"). A client asking us
  // to flip a notification or update their stored email is NOT a design revision.
  {
    intent: "support_request",
    re: /\b(?:(?:whatsapp|email|push|sms|in[- ]app|app|text)\s+notif|notif(?:ication)?s?\s+(?:setting|preferenc|aren'?t|not\s+working|stopped)|(?:my|our|the)\s+(?:account|profile|settings?|preferenc|password|email|login|sign[- ]?in|subscription|invoice|receipt|listing|order|package|shipment|tracking)|(?:reset|change|update)\s+(?:my\s+)?(?:password|email|number|phone|address|notification|notif|setting)|(?:can(?:'|’)?t|cannot|unable\s+to)\s+(?:log\s?in|sign\s?in|access|see|find|open|reach|use)|(?:isn(?:'|’)?t|is\s+not|aren(?:'|’)?t|are\s+not|won(?:'|’)?t|doesn(?:'|’)?t)\s+(?:work|working|load|loading|sending|receiv|arriv|come\s+through)|delete\s+(?:duplicat|the\s+duplicat|all\s+duplicat|my\s+account|my\s+data|extra|old|these|those|that\s+account|the\s+account)|duplicate\s+(?:package|entries|entry|items?|listings?|records?|customers?|users?|order|account)|remove\s+(?:duplicat|the\s+duplicat|my\s+account|my\s+data))\b/i,
  },
  {
    intent: "needs_mockup",
    re: /\b(mock ?up|sample|preview|concept|draft design|show me|example|see (a|an|the)|logo|flyer|banner)\b/i,
  },
  {
    intent: "needs_update",
    re: /\b(update|change|edit|revise|revision|fix|tweak|adjust|add (a|the|to|in)|remove|replace|redo|amend|correct)\b/i,
  },
  {
    intent: "scheduling",
    re: /\b(call|meeting|meet|schedule|book a|appointment|zoom|available|availability|what time|free (today|tomorrow)|monday|tuesday|wednesday|thursday|friday)\b/i,
  },
  {
    intent: "service_inquiry",
    re: /\b(how much|price|pricing|cost|quote|do you (do|offer|build|make|handle)|can you (do|build|make|help)|interested in|service|package|rate|charge|website|web ?site|app|marketing|sales|social media|email|branding|seo|business registration|register|registration|incorporat|compliance|consult|consulting|consultation|strategy)\b/i,
  },
];

const SPAM =
  /\b(notification of page|congratulations|you('|’)?ve won|verify your (account|page)|copyright|your page (has|will|is)|claim your|crypto|bitcoin|forex|buy followers|rank (#?1|first)|cheap seo)\b/i;

function lastClientText(thread: AngelThreadInput): string {
  return (
    [...thread.messages].reverse().find((m) => m.fromClient)?.body ||
    (thread.lastMessageFromClient ? thread.lastMessageText || "" : "")
  );
}

function classify(thread: AngelThreadInput): AngelIntent {
  const clientText = thread.messages
    .filter((m) => m.fromClient)
    .map((m) => m.body)
    .join(" ")
    .trim();
  const lastBody = thread.lastMessageText?.trim() ?? "";

  if (!clientText && !lastBody) return "general";
  if (SPAM.test(clientText) || SPAM.test(lastBody)) return "spam";

  for (const r of RULES) if (r.re.test(clientText) || r.re.test(lastBody)) return r.intent;

  // Short, fresh, client-initiated thread with no keyword → treat as a new lead.
  if (thread.messageCount <= 3 && thread.lastMessageFromClient) return "new_lead";
  // We replied last and it's aged → it's a follow-up we owe / can nudge.
  if (!thread.lastMessageFromClient && ageHours(thread.lastMessageAt) > 36) return "follow_up";
  return "general";
}

function priorityFor(thread: AngelThreadInput, intent: AngelIntent): AngelPriority {
  if (intent === "spam" || intent === "general") return "low";
  const age = ageHours(thread.lastMessageAt);
  if (intent === "new_lead" || intent === "service_inquiry") {
    return thread.lastMessageFromClient ? "high" : "medium";
  }
  if (intent === "follow_up") return age > 72 ? "high" : "medium";
  // needs_update / needs_mockup / scheduling: hot if the client is waiting on us.
  if (thread.lastMessageFromClient) return age > 24 ? "high" : "medium";
  return "low";
}

function draftFor(thread: AngelThreadInput, intent: AngelIntent): string {
  const name = thread.participantName?.trim().split(/\s+/)[0] || "there";
  // ONE short message per reply — a real person texting, not a brochure. No
  // greeting/body/close structure, no blank-line segments, at most one emoji.
  switch (intent) {
    case "support_request":
      // Intentionally empty — support requests escalate silently. No draft means
      // no one-tap "send" footgun in the dashboard that could re-introduce a
      // false promise like "I'll update your email" / "I'll delete that".
      return "";
    case "service_inquiry":
      return `Hi ${name} — happy to help. What are you looking to get done, and what budget are you working with? I'll tailor the right package (they start at J$5,000).`;
    case "new_lead":
      return `Hey ${name}! Tell me a bit about your business and what you want to achieve, and I'll map out how we can help.`;
    case "needs_mockup":
      return `Hi ${name} — we can do that. Do you have brand colours, a logo, or any references you like? I'll get a first concept over.`;
    case "needs_update":
      return `Hi ${name} — got it, I'll action that change and send you a preview to confirm.`;
    case "scheduling":
      return `Hi ${name} — happy to set up a call. What day and time works best for you this week?`;
    case "follow_up":
      return `Hi ${name} — just circling back, are you still keen to move forward?`;
    default:
      return `Hi ${name} — got your message, I'll get right back to you.`;
  }
}

export function heuristicTriage(thread: AngelThreadInput): AngelTriage {
  const intent = classify(thread);
  const priority = priorityFor(thread, intent);
  const summary =
    intent === "spam"
      ? "Likely spam / page notification"
      : lastClientText(thread).slice(0, 140) || "No message text (attachment or empty)";
  return { intent, priority, summary, draftReply: draftFor(thread, intent), engine: "heuristic" };
}

/* --------------------------------- OpenAI --------------------------------- */

const ALL_INTENTS: AngelIntent[] = [
  "support_request",
  "needs_update",
  "service_inquiry",
  "needs_mockup",
  "follow_up",
  "new_lead",
  "scheduling",
  "spam",
  "general",
];

async function aiTriage(thread: AngelThreadInput): Promise<AngelTriage | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  const model =
    process.env.OPENAI_MODEL?.trim() ||
    process.env.OPENAI_CHAT_MODEL?.trim() ||
    "gpt-4o-mini";

  const channel = thread.platform === "instagram" ? "Instagram DM" : "Facebook Messenger";
  const system = `You are Angel, the inbox assistant for J Supreme Tech (JST) — a Jamaica-based one-stop studio with the tagline "Run your business — we handle the rest." JST handles SIX things end-to-end, and everything we build is 100% owned by the client: (1) business registration, (2) websites, (3) apps (iOS & Android), (4) marketing & sales, (5) email & social, and (6) consulting. You can speak to ALL six — never tell a client we only do part of that. You triage incoming ${channel} conversations from clients and leads.

${buildScriptPlaybook()}

PRICING — NON-NEGOTIABLE: Never quote, estimate, or confirm a price for any service or package. The only figure allowed is "packages start at J$5,000 (≈ US$32)." When a client asks about cost, give that starting point and ASK their budget and goals, then say we'll tailor a package — do not state any other number, even if one appears in a script.

SUPPORT TICKETS — NON-NEGOTIABLE: You CANNOT actually perform operational actions on a client's product. You cannot change notification settings, update a stored email address, reset a password, delete duplicate packages/listings/data, fix a bug, or troubleshoot a broken feature. If the client is asking for ANY of those — anything that requires logging into their account/dashboard/database and changing state — you MUST classify intent as "support_request" and return draft_reply as an empty string (""). NEVER write "I'll check…", "I'll update…", "I'll delete…", "I'll look into…", "I'll get back to you with…" or any phrase that promises an operational action you can't perform. The escalation system will email Jordan; he will handle it directly. Common support-ticket signals: notification settings (WhatsApp / email / push / SMS), account / email / password / login changes, "delete duplicate ___", "can't see / can't access / can't log in", "not working / broken / error / bug", a literal email address in the message asking us to update it, or any reference to "my account / my profile / my settings".

For draft_reply on non-support intents: base it on the closest matching approved script above, adapted naturally to THIS conversation — use the client's first name if known, fill any [brackets] with real info, follow the PRICING rule above, keep contacts EXACT, and never leave bracket placeholders.

Length & tone (important): keep draft_reply to ONE short message — at most 1–2 sentences, like a real person texting. Do NOT structure it as greeting + body + closing, do NOT use multiple paragraphs or blank lines, and use at most one emoji (often none). Get to the point and ask at most ONE question. Short and human beats long and salesy.

Return STRICT JSON only:
{"intent": one of [${ALL_INTENTS.join(", ")}], "priority": "high"|"medium"|"low", "summary": "<=140 chars describing what they want", "draft_reply": "a warm, professional, ready-to-send reply in the agency's voice — friendly Jamaican-professional, ONE short message of 1–2 sentences max (no multi-paragraph, no blank-line segments, minimal emoji), no bracket placeholders; use their real first name if known. EMPTY STRING ('') when intent is support_request."}
Intent guide: support_request = client asking us to change settings / update account info / delete data / fix a bug — anything operational on a product we built them (ALWAYS return draft_reply: ""); needs_update = wants design/copy changes to existing creative work (e.g. "change the headline on my flyer"); service_inquiry = asking about a service or pricing; needs_mockup = wants to see a design/sample; follow_up = we owe a reply or it has gone quiet; new_lead = fresh interest; scheduling = wants a call/meeting; spam = junk or page notifications; general = FYI or unclear.`;
  const user = `Client: ${thread.participantName || thread.participantUsername || "Unknown"}
Conversation (oldest → newest):
${transcript(thread)}`;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 220,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!r.ok) return null;
    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      intent?: string;
      priority?: string;
      summary?: string;
      draft_reply?: string;
    };
    const intent = (ALL_INTENTS.includes(parsed.intent as AngelIntent)
      ? parsed.intent
      : "general") as AngelIntent;
    const priority = (["high", "medium", "low"].includes(parsed.priority ?? "")
      ? parsed.priority
      : "medium") as AngelPriority;
    const draftReply = (parsed.draft_reply ?? "").trim();
    // Empty draft is INVALID for normal intents (fall back to heuristic), but
    // EXPECTED for support_request — the empty draft is what keeps Angel from
    // promising operational actions it can't perform.
    if (!draftReply && intent !== "support_request") return null;
    return {
      intent,
      priority,
      summary: (parsed.summary ?? "").slice(0, 160),
      draftReply,
      engine: "openai",
    };
  } catch {
    return null;
  }
}

/** Triage with OpenAI when available, otherwise the heuristic engine. */
export async function triageThread(thread: AngelThreadInput): Promise<AngelTriage> {
  const ai = await aiTriage(thread);
  return ai ?? heuristicTriage(thread);
}

/* ------------------------------- follow-ups ------------------------------- */

/** A short, warm nudge for a contact who went quiet after we replied. */
export async function draftFollowUp(thread: AngelThreadInput): Promise<string> {
  const name = thread.participantName?.trim().split(/\s+/)[0] || "there";
  const key = process.env.OPENAI_API_KEY?.trim();
  if (key) {
    try {
      const model =
        process.env.OPENAI_MODEL?.trim() ||
        process.env.OPENAI_CHAT_MODEL?.trim() ||
        "gpt-4o-mini";
      const channel = thread.platform === "instagram" ? "Instagram" : "Messenger";
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          max_tokens: 200,
          messages: [
            {
              role: "system",
              content: `You are Angel for J Supreme Tech (JST), a one-stop studio (registration, websites, apps, marketing & sales, email & social, consulting). Write ONE short, warm ${channel} follow-up to a contact who went quiet after we replied, based on these approved follow-up scripts:\n\n${buildScriptPlaybook(["Follow-Up", "Close & Book"])}\n\nFriendly Jamaican-professional, no bracket placeholders, use their first name if natural. Keep it to 2–3 short lines separated by a blank line (real line breaks, \\n\\n) so it reads easily on a phone — never one dense block. Output only the message text.`,
            },
            {
              role: "user",
              content: `Contact: ${thread.participantName || "client"}\nRecent exchange:\n${transcript(thread, 6)}`,
            },
          ],
        }),
      });
      if (r.ok) {
        const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        const t = data.choices?.[0]?.message?.content?.trim();
        if (t) return t;
      }
    } catch {
      // fall through to template
    }
  }
  return `Hi ${name}! Just circling back to see if you're still interested 🙂\n\nHappy to help whenever you're ready — anything I can answer in the meantime?`;
}

/* --------------------------- existing-client nudge ------------------------ */

/**
 * A warm, relationship-tone nudge for someone we ALREADY serve who went quiet or
 * read-and-ghosted. Re-opens the conversation WITHOUT any discount / "first
 * project" promo — those are acquisition offers and would insult a current client.
 * Used in place of the follow-up / seen-hook for existing clients.
 */
export async function draftClientCheckIn(thread: AngelThreadInput): Promise<string> {
  const name = thread.participantName?.trim().split(/\s+/)[0] || "there";
  const key = process.env.OPENAI_API_KEY?.trim();
  if (key) {
    try {
      const model =
        process.env.OPENAI_MODEL?.trim() ||
        process.env.OPENAI_CHAT_MODEL?.trim() ||
        "gpt-4o-mini";
      const channel = thread.platform === "instagram" ? "Instagram" : "Messenger";
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          max_tokens: 180,
          messages: [
            {
              role: "system",
              content: `You are Angel for J Supreme Tech (JST). The person you're messaging is an EXISTING CLIENT we already work with — NOT a new lead. Write ONE short, warm ${channel} check-in that gently re-opens the conversation and offers help with whatever they currently have on with us. ABSOLUTELY NO discounts, promos, "first project" offers, or any incentive — those are for new leads and would insult a current client. No prices. Friendly Jamaican-professional, use their first name if natural, end with a soft question. 2–3 short lines separated by a blank line (real line breaks, \\n\\n) so it reads easily on a phone. Output only the message text.`,
            },
            {
              role: "user",
              content: `Client: ${thread.participantName || "client"}\nRecent exchange:\n${transcript(thread, 6)}`,
            },
          ],
        }),
      });
      if (r.ok) {
        const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        const t = data.choices?.[0]?.message?.content?.trim();
        if (t) return t;
      }
    } catch {
      // fall through to template
    }
  }
  return `Hi ${name}! 👋 Just checking in 🙂\n\nIs there anything you need from us right now, or anything we can move along for you?\n\nHappy to help whenever you're ready 🙌`;
}

/* ------------------------------- seen hook -------------------------------- */

/** Default promo if none is configured — verb-led so it slots into "I can ${offer}".
 *  Override per-brand via the hook_offer setting or the ANGEL_HOOK_OFFER env var. */
export const DEFAULT_HOOK_OFFER = "lock in 10% off your first project if you get started this week";

/**
 * A short, warm nudge fired a few minutes after a lead READS our reply but doesn't
 * answer — re-opens the chat and dangles the configured discount to spur action.
 * Never quotes a service price; the `offer` line is the only incentive mentioned.
 */
export async function draftSeenHook(thread: AngelThreadInput, offer: string): Promise<string> {
  const name = thread.participantName?.trim().split(/\s+/)[0] || "there";
  const key = process.env.OPENAI_API_KEY?.trim();
  if (key) {
    try {
      const model =
        process.env.OPENAI_MODEL?.trim() ||
        process.env.OPENAI_CHAT_MODEL?.trim() ||
        "gpt-4o-mini";
      const channel = thread.platform === "instagram" ? "Instagram" : "Messenger";
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          max_tokens: 180,
          messages: [
            {
              role: "system",
              content: `You are Angel for J Supreme Tech (JST). The client just READ our last reply but hasn't responded yet. Write ONE short, warm ${channel} nudge that gently re-opens the conversation and offers this limited incentive to act now: "${offer}". Friendly Jamaican-professional, low-pressure (not pushy), use their first name if natural. Do NOT quote any service price — that incentive line is the ONLY offer you may mention. End with a simple question or soft CTA. 2–3 short lines separated by a blank line (real line breaks, \\n\\n) so it reads easily on a phone. Output only the message text.`,
            },
            {
              role: "user",
              content: `Contact: ${thread.participantName || "client"}\nRecent exchange:\n${transcript(thread, 6)}`,
            },
          ],
        }),
      });
      if (r.ok) {
        const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
        const t = data.choices?.[0]?.message?.content?.trim();
        if (t) return t;
      }
    } catch {
      // fall through to template
    }
  }
  return `Hi ${name}! 👋 Saw my last message reached you — no pressure at all 🙂\n\nIf you're ready to move, I can ${offer}. Want me to set that up?\n\nHappy to answer anything in the meantime 🙌`;
}
