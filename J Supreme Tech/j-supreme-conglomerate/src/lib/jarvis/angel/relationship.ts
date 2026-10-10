/**
 * Angel — existing-client vs. new-prospect classifier.
 *
 * Angel's acquisition mechanics (the seen-hook discount, the "still interested?"
 * follow-up) are written for NEW leads. Firing the "10% off your first project"
 * hook at someone we already serve is off-brand and embarrassing — so before
 * Angel nudges, it decides who it's talking to.
 *
 * A thread is treated as an EXISTING CLIENT when ANY of these hold:
 *   1. intent === "needs_update"  → definitionally about work we already do
 *   2. the conversation talks like an active engagement ("my site", "you built
 *      it", "the invoice", "still waiting", "it's broken", …)
 *   3. the contact maps to a CRM client who is genuinely onboarded — a *closed*
 *      (won) linked lead, or real onboarding artifacts (website / deployed links
 *      / marketing assets / a real service category / a budget).
 *
 * Rule 3 deliberately ignores Angel's own inbound stubs: every forwarded lead
 * lands in `clients` at lead-stage "cold" with no artifacts, so a bare name/handle
 * match never counts on its own — only an *advanced* client does.
 */
import "server-only";
import { listCrmClients, listCrmLeads } from "@/lib/data/crm";
import { resolveDataOwnerIdSync } from "@/lib/session";
import type { CrmClientRecord } from "@/lib/data/crm-records";
import type { AngelIntent, AngelThreadInput } from "./types";

export type AngelRelationship = "existing_client" | "prospect";

/** Phrases that only make sense coming from someone we're already working with. */
const EXISTING_SIGNALS: RegExp[] = [
  /\b(my|our)\s+(site|web ?site|app|project|logo|order|design|account|build|brand|store|page|deliverable|mock ?up)\b/i,
  /\bthe\s+(invoice|balance|deposit|outstanding\s+payment)\b/i,
  /\byou\s+(built|made|did|created|designed|delivered|set\s*up|handled|sent)\b/i,
  /\b(already|currently)\s+(a\s+client|working\s+with|your\s+client)\b/i,
  /\bstill\s+waiting\b/i,
  /\bwhen\s+will\s+(it|this|the\s+\w+)\b.*\b(ready|done|finished|live|complete|up)\b/i,
  /\bnot\s+working\b|\b(it'?s|is)\s+broken\b|\bthe\s+(bug|issue|error|problem)\b/i,
  /\bupdate\s+(to|on)\s+(my|the|our)\b/i,
];

function recentClientText(input: AngelThreadInput): string {
  const recent = input.messages
    .filter((m) => m.fromClient)
    .slice(-4)
    .map((m) => m.body)
    .join(" ");
  return `${input.lastMessageFromClient ? input.lastMessageText ?? "" : ""} ${recent}`.trim();
}

/** lowercase, strip @ / instagram URL chrome → a bare handle for matching. */
function normalizeHandle(raw: string | null | undefined): string {
  if (!raw) return "";
  let s = String(raw).trim().toLowerCase();
  const m = s.match(/instagram\.com\/([^/?#]+)/);
  if (m) s = m[1];
  return s.replace(/^@/, "").replace(/\/+$/, "").split(/[?#]/)[0].trim();
}

function normalizeName(raw: string | null | undefined): string {
  if (!raw) return "";
  return String(raw).trim().toLowerCase().replace(/^@/, "").replace(/\s+/g, " ");
}

/** A client is "onboarded" (a real client, not just an Angel inbound stub). */
function isOnboarded(client: CrmClientRecord, closedClientIds: Set<string>): boolean {
  if (closedClientIds.has(client.id)) return true;
  return Boolean(
    client.website ||
      client.extra_hyperlinks.length ||
      client.marketing_asset_links.length ||
      (client.service_category && client.service_category !== "general") ||
      client.budget_amount != null,
  );
}

/** Index of onboarded clients, keyed by IG handle and by name, built once per run. */
export type ClientIndex = {
  handles: Set<string>;
  names: Set<string>;
};

export async function buildClientIndex(): Promise<ClientIndex> {
  const owner = resolveDataOwnerIdSync();
  const [clients, leads] = await Promise.all([listCrmClients(owner), listCrmLeads(owner)]);
  const closedClientIds = new Set(
    leads.filter((l) => l.stage === "closed" && l.client_id).map((l) => l.client_id as string),
  );

  const handles = new Set<string>();
  const names = new Set<string>();
  for (const c of clients) {
    if (!isOnboarded(c, closedClientIds)) continue; // ignore bare inbound stubs
    const ig = normalizeHandle(c.social_links?.instagram);
    if (ig) handles.add(ig);
    const bn = normalizeName(c.business_name);
    if (bn) names.add(bn);
    const cn = normalizeName(c.contact_name);
    if (cn) names.add(cn);
  }
  return { handles, names };
}

function matchesOnboardedClient(index: ClientIndex, input: AngelThreadInput): boolean {
  const ig = normalizeHandle(input.participantUsername);
  if (ig && index.handles.has(ig)) return true;
  const nm = normalizeName(input.participantName);
  if (nm && index.names.has(nm)) return true;
  return false;
}

/** Conversation-only signal (no CRM); null when the chat reveals nothing either way. */
export function relationshipFromConversation(
  input: AngelThreadInput,
  intent: AngelIntent | null,
): AngelRelationship | null {
  // support_request and needs_update both definitionally come from someone we
  // already serve — strangers don't ask us to change their account settings
  // or revise creative we haven't produced.
  if (intent === "support_request" || intent === "needs_update") return "existing_client";
  const text = recentClientText(input);
  if (text && EXISTING_SIGNALS.some((re) => re.test(text))) return "existing_client";
  return null;
}

/**
 * Final verdict: existing client when the conversation says so, or (backstop) the
 * contact maps to an onboarded CRM client. Otherwise a prospect.
 */
export function classifyRelationship(args: {
  input: AngelThreadInput;
  intent: AngelIntent | null;
  index?: ClientIndex | null;
}): AngelRelationship {
  if (relationshipFromConversation(args.input, args.intent) === "existing_client") {
    return "existing_client";
  }
  if (args.index && matchesOnboardedClient(args.index, args.input)) {
    return "existing_client";
  }
  return "prospect";
}
