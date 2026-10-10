import { listCrmClients, listCrmLeads } from "@/lib/data/crm";
import { listTodos, listTodoCategories } from "@/lib/data/todos";
import type { CrmClientRecord, CrmLeadRecord } from "@/lib/data/crm-records";
import type { Todo } from "@/lib/data/todos";

function formatClient(c: CrmClientRecord): string {
  const lines = [
    `### ${c.business_name}`,
    c.contact_name ? `- Contact: ${c.contact_name}` : null,
    c.email ? `- Email: ${c.email}` : null,
    c.phone ? `- Phone: ${c.phone}` : null,
    c.industry ? `- Industry: ${c.industry}` : null,
    c.website ? `- Website: ${c.website}` : null,
    c.service_category ? `- Service line: ${c.service_category}` : null,
    c.services_needed ? `- Services needed: ${c.services_needed}` : null,
    c.notes ? `- Notes: ${c.notes}` : null,
    c.follow_up_notes ? `- Follow-up notes: ${c.follow_up_notes}` : null,
    c.marketing_asset_links?.length
      ? `- Marketing / asset links:\n${c.marketing_asset_links.map((l) => `  - ${l.label}: ${l.url}`).join("\n")}`
      : null,
    c.extra_hyperlinks?.length
      ? `- Extra links:\n${c.extra_hyperlinks.map((l) => `  - ${l.label}: ${l.url}`).join("\n")}`
      : null,
  ].filter(Boolean);
  return lines.join("\n");
}

function formatLead(l: CrmLeadRecord): string {
  const lines = [
    `### ${l.company}`,
    `- Stage: ${l.stage}`,
    l.contact_name ? `- Contact: ${l.contact_name}` : null,
    l.email ? `- Email: ${l.email}` : null,
    l.phone ? `- Phone: ${l.phone}` : null,
    l.estimated_value != null ? `- Est. value: ${l.estimated_value}` : null,
    l.tags?.length ? `- Tags: ${l.tags.join(", ")}` : null,
    l.follow_up_notes ? `- Follow-up: ${l.follow_up_notes}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

function formatTodo(t: Todo, categoryName: string | null): string {
  const status = t.done ? "done" : "open";
  const due = t.due_date ? ` due ${t.due_date}` : "";
  const lane = categoryName ? ` [${categoryName}]` : "";
  const notes = t.notes ? ` — ${t.notes}` : "";
  return `- [${status}]${lane} **${t.title}**${due}${notes}`;
}

const CURSOR_INSTRUCTION = `## How to use this pack (Cursor / ChatGPT)

Paste this file at the top of a thread, then ask for what you want — for example:
- "Draft a landing page structure that matches my active roster and task lanes."
- "Turn client notes into a week of social posts; respect existing links."
- "Propose a Next.js feature list for the J Supreme app using this CRM + tasks snapshot."

**Limits:** This export is a point-in-time snapshot. It does not grant live database access. Do not invent confidential details not present here.`;

/**
 * Markdown snapshot of CRM, pipeline, and tasks for external AI tools (e.g. Cursor).
 */
export async function buildWorkspaceContextMarkdown(ownerClerkId: string): Promise<string> {
  const [clients, leads, catOut, todos] = await Promise.all([
    listCrmClients(ownerClerkId),
    listCrmLeads(ownerClerkId),
    listTodoCategories(ownerClerkId),
    listTodos(ownerClerkId),
  ]);

  const catName = new Map(catOut.categories.map((c) => [c.id, c.name]));

  const openTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done).slice(0, 15);

  const parts: string[] = [
    `# J Supreme Conglomerate — workspace context`,
    ``,
    `_Generated: ${new Date().toISOString()} · Owner scope: \`${ownerClerkId}\`_`,
    ``,
    CURSOR_INSTRUCTION,
    ``,
    `## Clients (${clients.length})`,
    clients.length ? clients.map(formatClient).join("\n\n") : `_No clients in Supabase for this owner._`,
    ``,
    `## Pipeline / leads (${leads.length})`,
    leads.length ? leads.map(formatLead).join("\n\n") : `_No leads._`,
    ``,
    `## Task lanes`,
    catOut.categories.length
      ? catOut.categories.map((c) => `- **${c.name}** (id \`${c.id}\`)`).join("\n")
      : `_No categories (or local-only mode)._`,
    ``,
    `## Open tasks (${openTodos.length})`,
    openTodos.length
      ? openTodos.map((t) => formatTodo(t, t.category_id ? catName.get(t.category_id) ?? null : null)).join("\n")
      : `_None._`,
    ``,
    `## Recently completed (sample, max 15)`,
    doneTodos.length
      ? doneTodos.map((t) => formatTodo(t, t.category_id ? catName.get(t.category_id) ?? null : null)).join("\n")
      : `_None._`,
    ``,
  ];

  return parts.join("\n");
}
