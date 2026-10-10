/**
 * WhatsApp reply drafting — the brain behind "Approve & Send" parity with Angel.
 *
 * Generates a short, natural WhatsApp reply for a triaged thread. Uses OpenAI when
 * OPENAI_API_KEY is set (same engine Angel reports), with a category heuristic
 * fallback so the surface still works offline / keyless.
 *
 * Safety: it NEVER drafts for scam, payment, or personal threads — those escalate
 * to Jordan untouched (returns null). And it never quotes a fixed price (J Supreme
 * rule): if asked cost, it points to "from J$5,000" and asks the budget.
 */
import type { WaThreadRow } from "./types";

const NO_DRAFT = new Set(["spam", "payment", "personal"]);

export function canDraft(thread: Pick<WaThreadRow, "category">): boolean {
  return !NO_DRAFT.has((thread.category ?? "general") as string);
}

const SYSTEM = [
  "You are Jordan's assistant drafting WhatsApp replies for the J Supreme group (a Jamaica-based studio: business registration, websites, apps, marketing, email/social, consulting).",
  "Write ONE short, warm, natural WhatsApp reply — 1 to 3 sentences. Sound like a real person texting, not a corporate email. No greeting block, no formal signature.",
  "Never quote a fixed price. If they ask cost, say packages start around J$5,000 and ask their budget so you can tailor it.",
  "If it's a client issue/bug, acknowledge it and say you're on it with a quick follow-up. Don't invent facts, links, dates, or numbers you weren't given.",
  "Match a friendly Jamaican business tone. Keep it tight.",
].join(" ");

type DraftResult = { draft: string | null; engine: string };

export async function draftReplyFor(thread: WaThreadRow): Promise<DraftResult> {
  if (!canDraft(thread)) return { draft: null, engine: "skipped" };

  const who = thread.chat_name || (thread.phone ? `+${thread.phone}` : "the contact");
  const said = thread.summary || thread.last_message_text || "(no text)";
  const ctx = [
    `From: ${who}`,
    `Category: ${thread.category ?? "general"}`,
    thread.action_needed ? `What they need: ${thread.action_needed}` : "",
    `Their message: ${said}`,
  ].filter(Boolean).join("\n");

  const key = process.env.OPENAI_API_KEY?.trim();
  if (key) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.6,
          max_tokens: 180,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: `Draft a WhatsApp reply.\n\n${ctx}` },
          ],
        }),
      });
      if (res.ok) {
        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = body.choices?.[0]?.message?.content?.trim();
        if (text) return { draft: text.replace(/^["']|["']$/g, ""), engine: "openai" };
      }
    } catch {
      /* fall through to heuristic */
    }
  }

  return { draft: heuristic(thread), engine: "heuristic" };
}

/** Keyless fallback — a safe, on-brand acknowledgement per category. */
function heuristic(thread: WaThreadRow): string {
  const first = (thread.chat_name || "").trim().split(/\s+/)[0] || "there";
  const cat = thread.category ?? "general";
  switch (cat) {
    case "support":
      return `Hi ${first}! Thanks for flagging this — I'm on it now and I'll confirm here the moment it's sorted. 🙏`;
    case "inquiry":
      return `Hey ${first}! Happy to help with that. Packages start around J$5,000 — may I ask your budget so I can tailor the best option for you?`;
    case "order":
      return `Thanks ${first}! Let me confirm availability and the total, and I'll come right back to you. 🙌`;
    case "shipment":
      return `Hi ${first} — checking on this now, I'll send you the latest tracking shortly. 📦`;
    case "scheduling":
      return `Hi ${first}! Happy to set that up — let me check the schedule and send you a couple of times. 📅`;
    default:
      return `Hey ${first}! Got your message — I'll get back to you shortly with the details. 🙏`;
  }
}
