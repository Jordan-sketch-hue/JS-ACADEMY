/**
 * Angel — autonomy decisions.
 *
 * Even in full-auto, Angel must NOT auto-reply to the high-stakes minority. This
 * module is the "escalation floor": anything about money/pricing, a complaint,
 * a request to speak to a human, urgency, or a missing draft is escalated to
 * Jordan by email instead of being answered automatically.
 */
import "server-only";
import type {
  AngelAutonomy,
  AngelIntent,
  AngelThreadInput,
  AngelTriage,
} from "./types";

const MONEY =
  /\b(price|pricing|cost|costs|quote|how much|rate|rates|charge|charges|fee|fees|budget|invoice|deposit|payment|pay you|discount)\b/i;
const SENTIMENT =
  /\b(not happy|unhappy|disappointed|angry|upset|terrible|worst|horrible|complain|complaint|scam|fraud|sue|lawyer|legal|cancel|refund|report you)\b/i;
const HUMAN =
  /\b(speak|talk|chat|call)\s+(to|with)\s+(the\s+)?(owner|manager|jordan|boss|someone|a person|a human|real person|director)\b/i;
const URGENT = /\b(urgent|asap|emergency|right now|immediately|need this today)\b/i;
/**
 * SUPPORT — operational/account tickets we should NEVER auto-reply to. The bot
 * cannot actually flip a notification setting, update a stored email, delete
 * duplicate records, or fix a bug — so any answer it drafts is a false promise.
 * Hard floor that bypasses intent classification.
 */
const SUPPORT =
  /\b(?:(?:whatsapp|email|push|sms|in[- ]app|app|text)\s+notif|notif(?:ication)?s?\s+(?:setting|preferenc|aren'?t|not\s+working|stopped)|(?:my|our|the)\s+(?:account|profile|settings?|preferenc|password|email|login|sign[- ]?in|subscription|invoice|receipt|listing|order|package|shipment|tracking)|account\s+(?:setting|preference|email|password|update|change)|(?:reset|change|update)\s+(?:my\s+)?(?:password|email|number|phone|address|notification|notif|setting)|(?:can(?:'|’)?t|cannot|unable\s+to)\s+(?:log\s?in|sign\s?in|access|see|find|open|reach|use)|(?:isn(?:'|’)?t|is\s+not|aren(?:'|’)?t|are\s+not|won(?:'|’)?t|will\s+not|doesn(?:'|’)?t|did\s+not|didn(?:'|’)?t)\s+(?:work|working|load|loading|open|opening|show|showing|send|sending|receiv|arriv|come\s+through)|(?:broken|crashing|crashes|frozen|stuck|glitch|bug(?:gy)?|error|errors|missing|gone|disappeared)\b(?!.*\b(?:website\s+for|app\s+for|design\s+for|build|create|make)\b)|delete\s+(?:duplicat|the\s+duplicat|all\s+duplicat|my\s+account|my\s+data|extra|old|these|those|that\s+account|the\s+account)|duplicate\s+(?:package|entries|entry|items?|listings?|records?|customers?|users?|order|account)|remove\s+(?:duplicat|the\s+duplicat|my\s+account|my\s+data))\b/i;
const EMAIL_IN_MSG =
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;

/**
 * Pure acknowledgements / conversation-closers — a message that needs no reply.
 * Matches ONLY when the WHOLE message is an ack / thanks / affirmation, so a real
 * question ("ok and how much?") still gets through. This is what stops Angel from
 * volleying a fresh sales paragraph back at "ok thanks 👍" — if there's nothing to
 * follow up on, we don't follow up.
 */
const ACK_ONLY =
  /^(?:[\s.,!👍🙏🙌❤️😊🔥💯✅👌🎉😂🥰😍👏🤝]*(?:ok(?:ay)?|kk?|thanks?|thank\s?you|thx|ty|tysm|cool|nice|great|perfect|awesome|amazing|wonderful|excellent|alright|aight|sure|fine|yes|yep|yeah|yup|no|nope|got\s?it|gotcha|noted|understood|will\s?do|sounds?\s?good|no\s?worries|no\s?problem|np|cheers|appreciate\s?(?:it|you)|much\s?appreciated|bless|respect|word|deal|done)[\s.,!👍🙏🙌❤️😊🔥💯✅👌🎉😂🥰😍👏🤝]*)+$/i;

const EMOJI_ONLY = /^[\s.,!👍🙏🙌❤️😊🔥💯✅👌🎉😂🥰😍👏🤝🙂😎👀💪✨]+$/u;

/**
 * True when a client message genuinely needs a response — it isn't empty, isn't a
 * bare emoji reaction, and isn't a pure acknowledgement. A question always counts.
 * Used to decide whether a reply on an already-opened thread is worth sending at all.
 */
export function needsReply(text: string | null | undefined): boolean {
  const t = (text ?? "").trim();
  if (!t) return false; // attachment / empty — nothing to answer
  if (EMOJI_ONLY.test(t)) return false; // a 👍 reaction is not a question
  if (/\?/.test(t)) return true; // an explicit question always warrants a reply
  return !ACK_ONLY.test(t); // otherwise reply unless it's a pure ack / closer
}

export type Escalation = { escalate: boolean; reason?: string };

/** Opportunity intents worth forwarding to CRM / looping Jordan in on. */
export const OPPORTUNITY_INTENTS: AngelIntent[] = [
  "new_lead",
  "service_inquiry",
  "scheduling",
  "needs_mockup",
];

function recentClientText(input: AngelThreadInput, triage: AngelTriage): string {
  const recent = input.messages
    .filter((m) => m.fromClient)
    .slice(-3)
    .map((m) => m.body)
    .join(" ");
  return `${input.lastMessageText || ""} ${triage.summary || ""} ${recent}`;
}

export function assessEscalation(
  input: AngelThreadInput,
  triage: AngelTriage,
): Escalation {
  if (triage.intent === "spam") return { escalate: false };
  const text = recentClientText(input, triage);
  // Support tickets ALWAYS escalate — bypass everything else. Caught either by the
  // classifier (intent) or by raw-text safety net (so a mis-classification can't slip through).
  if (triage.intent === "support_request" || SUPPORT.test(text) || EMAIL_IN_MSG.test(text)) {
    return {
      escalate: true,
      reason:
        "Account / settings / data request — Angel can't action this; handle directly",
    };
  }
  if (MONEY.test(text)) return { escalate: true, reason: "Money / pricing — the number is your call" };
  if (SENTIMENT.test(text)) return { escalate: true, reason: "Complaint / sensitive — needs your touch" };
  if (HUMAN.test(text)) return { escalate: true, reason: "They asked to speak to you directly" };
  if (URGENT.test(text)) return { escalate: true, reason: "Marked urgent" };
  if (!triage.draftReply.trim()) return { escalate: true, reason: "No confident draft to send" };
  return { escalate: false };
}

/** FAQ-safe intents that faq_auto mode is allowed to answer automatically. */
const FAQ_SAFE: AngelIntent[] = ["general", "service_inquiry"];

export function canAutoSend(autonomy: AngelAutonomy, intent: AngelIntent): boolean {
  if (intent === "spam") return false;
  // Support tickets are never auto-sent in ANY autonomy mode — assessEscalation
  // already routes these to email, this is a second guard so a refactor can't bypass it.
  if (intent === "support_request") return false;
  if (autonomy === "full_auto") return true;
  if (autonomy === "faq_auto") return FAQ_SAFE.includes(intent);
  return false; // "approve" — draft only
}
