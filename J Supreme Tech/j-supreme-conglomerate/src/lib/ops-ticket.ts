/**
 * Shared ops-ticket creation for server-side callers (Angel IG sync, etc.).
 *
 * WhatsApp tickets are created by the Railway bot (ticket.mjs). This module
 * handles the same flow for channels that run inside the Next.js app.
 */
import { createHash } from "crypto";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { sendPushToAll } from "@/lib/notify/push";

const TICKET_INTENTS = new Set([
  "support", "payment", "order", "shipment", "scheduling", "inquiry",
]);

export function isTicketWorthy(
  intent: string | null | undefined,
  priority: string | null | undefined,
): boolean {
  if (!intent || intent === "spam" || intent === "personal" || intent === "general") return false;
  if (intent === "support") return true;
  return priority === "high" && TICKET_INTENTS.has(intent);
}

export interface OpsTicketInput {
  source: string;
  sourceKey: string;
  clientName: string | null;
  contact: string | null;
  channel: string;
  category: string;
  priority: string;
  summary: string | null;
  bodyText: string;
  actionNeeded?: string | null;
}

/** Creates (or skips on duplicate sourceKey) an ops_ticket row. Returns the ticket id or null. */
export async function createOpsTicket(input: OpsTicketInput): Promise<string | null> {
  const supabase = getServiceSupabase();
  if (!supabase) return null;

  const id = "t_" + createHash("sha256").update(input.sourceKey).digest("hex").slice(0, 16);
  const slaHours = input.priority === "high" ? 4 : 24;
  const row = {
    id,
    source: input.source,
    source_key: input.sourceKey,
    client_name: input.clientName ?? null,
    contact: input.contact ?? null,
    channel: input.channel,
    category: input.category,
    priority: input.priority,
    summary: input.summary,
    body_text: input.bodyText.slice(0, 4000),
    action_needed: input.actionNeeded ?? null,
    sla_hours: slaHours,
    due_at: new Date(Date.now() + slaHours * 3600_000).toISOString(),
    gate: "approval",
    is_scam: false,
    state: "triaged",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("ops_tickets")
    .upsert(row, { onConflict: "source_key", ignoreDuplicates: true });

  if (error) {
    console.error("[ops-ticket] create failed", error.message);
    return null;
  }
  console.log(`[ops-ticket] ${id} created — [${input.category}/${input.priority}] ${input.summary?.slice(0, 80)}`);
  return id;
}

/** Fire-and-forget push notification for a newly created ticket. */
export function sendOpsTicketPush(
  ticketRef: string,
  label: string,
  summary: string | null,
  opts?: { url?: string; urgent?: boolean },
): void {
  void sendPushToAll({
    title: label,
    body: summary?.slice(0, 120) ?? "Needs attention",
    url: opts?.url ?? "/jarvis/whatsapp",
    tag: ticketRef,
    urgent: opts?.urgent ?? false,
  }).catch((e) => console.error("[ops-ticket] push failed", e?.message));
}
