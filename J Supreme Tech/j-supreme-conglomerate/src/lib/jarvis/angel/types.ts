/**
 * Angel — shared types for the client-inbox triage agent.
 *
 * Angel reads the J Supreme Marketing (+ future brand) social inboxes via the
 * Meta Graph API, sorts each conversation into an action bucket, and drafts a
 * reply that waits in an approval queue. Nothing is ever sent without a tap.
 */

export type AngelPlatform = "facebook" | "instagram";

export type AngelIntent =
  | "support_request" // existing client asking us to change account / settings / data, or reporting that something is broken — ALWAYS escalate, never auto-reply
  | "needs_update" // wants changes to existing work
  | "service_inquiry" // asking about a service / pricing
  | "needs_mockup" // wants to see a design / sample
  | "follow_up" // we owe a reply, or it's gone quiet
  | "new_lead" // fresh interest — chase it
  | "scheduling" // wants a call / meeting
  | "spam" // notifications / junk
  | "general"; // FYI / unclear ask

export type AngelPriority = "high" | "medium" | "low";
export type AngelDraftStatus = "pending" | "approved" | "sent" | "dismissed" | "edited";
export type AngelThreadStatus = "open" | "done" | "snoozed" | "dismissed";

/** How much Angel does on its own. approve = draft only; faq_auto = auto-send
 *  simple/FAQ replies; full_auto = auto-reply + auto follow-ups, escalating only
 *  the high-stakes minority. */
export type AngelAutonomy = "approve" | "faq_auto" | "full_auto";

export type AngelMessage = {
  messageId: string;
  fromId: string | null;
  fromName: string | null;
  fromClient: boolean;
  body: string;
  createdTime: string | null;
};

/** Normalized conversation pulled from the Graph API, ready to upsert + triage. */
export type AngelThreadInput = {
  brand: string;
  platform: AngelPlatform;
  threadId: string;
  pageId: string;
  participantId: string | null;
  participantName: string | null;
  participantUsername: string | null;
  lastMessageText: string | null;
  lastMessageAt: string | null;
  lastMessageFromClient: boolean;
  messageCount: number;
  messages: AngelMessage[];
};

export type AngelTriage = {
  intent: AngelIntent;
  priority: AngelPriority;
  summary: string;
  draftReply: string;
  engine: "openai" | "heuristic";
};

/** The shape of a row in jarvis_angel_threads (snake_case, straight from Supabase). */
export type AngelThreadRow = {
  id: string;
  brand: string;
  platform: AngelPlatform;
  thread_id: string;
  page_id: string | null;
  participant_id: string | null;
  participant_name: string | null;
  participant_username: string | null;
  last_message_text: string | null;
  last_message_at: string | null;
  last_message_from_client: boolean;
  message_count: number;
  intent: AngelIntent | null;
  priority: AngelPriority | null;
  summary: string | null;
  triage_engine: string | null;
  triaged_at: string | null;
  draft_reply: string | null;
  draft_status: AngelDraftStatus;
  draft_updated_at: string | null;
  status: AngelThreadStatus;
  snoozed_until: string | null;
  sent_at: string | null;
  alerted_at: string | null;
  auto_handled: boolean | null;
  follow_up_count: number | null;
  last_follow_up_at: string | null;
  escalated_at: string | null;
  crm_forwarded_at: string | null;
  crm_lead_id: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

/** Display metadata for each bucket — keeps the UI labels in one place. */
export const INTENT_META: Record<
  AngelIntent,
  { label: string; blurb: string; emoji: string }
> = {
  support_request: { label: "Support ticket", blurb: "Account / settings / data change — handle directly", emoji: "🆘" },
  needs_update: { label: "Needs an update", blurb: "Wants changes to existing work", emoji: "🔧" },
  service_inquiry: { label: "Service question", blurb: "Asking about a service / pricing", emoji: "💬" },
  needs_mockup: { label: "Wants a mockup", blurb: "Asking to see a design / sample", emoji: "🎨" },
  follow_up: { label: "Follow-up", blurb: "Aging — needs a nudge or reply", emoji: "⏰" },
  new_lead: { label: "New lead", blurb: "Fresh interest — chase it", emoji: "✨" },
  scheduling: { label: "Scheduling", blurb: "Wants a call / meeting", emoji: "📅" },
  general: { label: "General", blurb: "FYI / no clear ask", emoji: "📨" },
  spam: { label: "Spam / noise", blurb: "Notifications or junk", emoji: "🗑️" },
};

/** Order buckets are shown in — action-needed first, noise last. */
export const INTENT_ORDER: AngelIntent[] = [
  "support_request",
  "new_lead",
  "service_inquiry",
  "needs_mockup",
  "needs_update",
  "scheduling",
  "follow_up",
  "general",
  "spam",
];
