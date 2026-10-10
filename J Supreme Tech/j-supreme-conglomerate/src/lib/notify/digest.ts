import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { listMeetings } from "@/lib/data/meetings";
import { listSubscriptions } from "@/lib/data/subscriptions";
import { listCrmLeads } from "@/lib/data/crm";
import { listTodos, listTodoCategories } from "@/lib/data/todos";
import { daysUntil, formatMoney, toMonthly } from "@/lib/subscriptions/compute";
import { APP_URL, emailShell, escapeHtml, section } from "@/lib/notify/format";

const TZ = "America/Jamaica";

function jmDate(d = new Date()): string {
  return d.toLocaleDateString("en-US", {
    timeZone: TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: TZ,
    month: "short",
    day: "numeric",
  });
}

function dueTone(days: number): "over" | "due" | "normal" {
  if (days < 0) return "over";
  if (days <= 3) return "due";
  return "normal";
}

export type DigestEmail = { subject: string; html: string; text: string };

type Row = { label: string; meta?: string; tone?: "due" | "over" | "normal" };

/** Builds the daily activity digest for one workspace owner. Each section is
 * independent so a single query failure degrades to an empty section. */
export async function buildDigest(owner: string): Promise<DigestEmail> {
  const now = Date.now();
  const in7 = now + 7 * 24 * 60 * 60 * 1000;

  const [meetingsR, subsR, leadsR, todosR, invoicesR, catsR] = await Promise.allSettled([
    listMeetings(owner),
    listSubscriptions(owner),
    listCrmLeads(owner),
    listTodos(owner),
    (async () => {
      const sb = getServiceSupabase();
      if (!sb) return [] as Record<string, unknown>[];
      const { data } = await sb
        .from("invoices")
        .select("number,amount,currency,status,due_date")
        .eq("owner_clerk_id", owner)
        .neq("status", "paid");
      return (data ?? []) as Record<string, unknown>[];
    })(),
    listTodoCategories(owner),
  ]);

  const meetings = meetingsR.status === "fulfilled" ? meetingsR.value : [];
  const subs = subsR.status === "fulfilled" ? subsR.value : [];
  const leads = leadsR.status === "fulfilled" ? leadsR.value : [];
  const todos = todosR.status === "fulfilled" ? todosR.value : [];
  const invoices = invoicesR.status === "fulfilled" ? invoicesR.value : [];
  const catName = new Map(
    (catsR.status === "fulfilled" ? catsR.value.categories : []).map((c) => [c.id, c.name]),
  );

  // ── Meetings (next 7 days) ──
  const upMeetings = meetings
    .filter((m) => {
      if (m.status !== "scheduled") return false;
      const t = new Date(m.starts_at).getTime();
      return t >= now - 3 * 60 * 60 * 1000 && t <= in7;
    })
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  const meetingRows = upMeetings.map((m) => ({
    label: m.title,
    meta: fmtDateTime(m.starts_at),
    tone: "normal" as const,
  }));

  // ── Subscriptions due (overdue + next 7 days) ──
  const dueSubs = subs
    .filter((s) => s.status === "active")
    .map((s) => ({ s, d: daysUntil(s.next_due_date) }))
    .filter((x) => x.d !== null && (x.d as number) <= 7)
    .sort((a, b) => (a.d as number) - (b.d as number));
  const subRows = dueSubs.map(({ s, d }) => ({
    label: s.name,
    meta: `${s.amount != null ? formatMoney(s.amount, s.currency) + " · " : ""}${
      (d as number) < 0 ? `${Math.abs(d as number)}d overdue` : (d as number) === 0 ? "today" : `in ${d}d`
    }`,
    tone: dueTone(d as number),
  }));

  // ── CRM follow-ups due ──
  const dueLeads = leads
    .filter((l) => l.next_follow_up_at && new Date(l.next_follow_up_at).getTime() <= in7)
    .sort(
      (a, b) =>
        new Date(a.next_follow_up_at as string).getTime() -
        new Date(b.next_follow_up_at as string).getTime(),
    );
  const leadRows = dueLeads.map((l) => {
    const t = new Date(l.next_follow_up_at as string).getTime();
    return {
      label: `${l.company}${l.tags?.includes("P1") ? " · P1" : ""}`,
      meta: fmtDate(l.next_follow_up_at as string),
      tone: (t < now ? "over" : "due") as "over" | "due",
    };
  });

  // ── Unpaid invoices ──
  const invByCur = new Map<string, number>();
  for (const inv of invoices) {
    const cur = String(inv.currency ?? "USD").toUpperCase();
    invByCur.set(cur, (invByCur.get(cur) ?? 0) + Number(inv.amount ?? 0));
  }
  const invoiceRows: Row[] = [];
  if (invoices.length) {
    invoiceRows.push({
      label: `${invoices.length} unpaid invoice${invoices.length === 1 ? "" : "s"}`,
      meta: "",
      tone: "normal",
    });
    for (const [cur, total] of invByCur) {
      invoiceRows.push({ label: `Outstanding (${cur})`, meta: formatMoney(total, cur), tone: "due" });
    }
  }

  // ── Open tasks (ALL open work, ranked: overdue/due first, then priority, then newest) ──
  const openTodos = todos.filter((t) => !t.done);
  const PRI_WORD = ["", "low", "normal", "high", "urgent"];
  const rankedTodos = openTodos.slice().sort((a, b) => {
    const ad = a.due_date ? Date.parse(a.due_date) : Infinity;
    const bd = b.due_date ? Date.parse(b.due_date) : Infinity;
    if (ad !== bd) return ad - bd;
    if (b.priority !== a.priority) return b.priority - a.priority;
    return (b.created_at || "").localeCompare(a.created_at || "");
  });
  const todoRows = rankedTodos.slice(0, 8).map((t) => {
    const due = t.due_date ? Date.parse(t.due_date) : null;
    const overdue = due != null && due < now;
    const soon = due != null && due <= in7;
    return {
      label: t.title,
      meta: t.due_date
        ? `${overdue ? "overdue · " : ""}${fmtDate(t.due_date)}`
        : PRI_WORD[t.priority] || "open",
      tone: (overdue ? "over" : soon || t.priority >= 3 ? "due" : "normal") as
        | "over"
        | "due"
        | "normal",
    };
  });
  const taskTitle =
    openTodos.length > 8 ? `Open tasks · top 8 of ${openTodos.length}` : "Open tasks";

  // Open-by-lane breakdown (mirrors the Tasks page chips).
  const catCounts = new Map<string, number>();
  for (const t of openTodos) {
    const name = (t.category_id ? catName.get(t.category_id) : null) || "Other";
    catCounts.set(name, (catCounts.get(name) ?? 0) + 1);
  }
  const catLine = [...catCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([n, c]) => `${n} ${c}`)
    .join("  ·  ");

  // ── Monthly subscription cost (active) ──
  const monthlyByCur = new Map<string, number>();
  for (const s of subs) {
    if (s.status !== "active" || s.amount == null) continue;
    const cur = s.currency || "USD";
    monthlyByCur.set(cur, (monthlyByCur.get(cur) ?? 0) + toMonthly(s.amount, s.billing_cycle));
  }
  const subCostLine = [...monthlyByCur.entries()]
    .map(([cur, v]) => formatMoney(v, cur))
    .join(" · ");

  const summaryParts = [
    `${upMeetings.length} meeting${upMeetings.length === 1 ? "" : "s"}`,
    `${dueSubs.length} sub${dueSubs.length === 1 ? "" : "s"} due`,
    `${dueLeads.length} follow-up${dueLeads.length === 1 ? "" : "s"}`,
    `${invoices.length} unpaid`,
    `${openTodos.length} open task${openTodos.length === 1 ? "" : "s"}`,
  ];

  const quiet =
    !meetingRows.length &&
    !subRows.length &&
    !leadRows.length &&
    !invoiceRows.length &&
    !todoRows.length;

  const kpis = [
    { value: upMeetings.length, label: "Meetings" },
    { value: dueSubs.length, label: "Subs due" },
    { value: dueLeads.length, label: "Follow-ups" },
    { value: invoices.length, label: "Unpaid" },
    { value: openTodos.length, label: "Open tasks" },
  ];

  const inner = `
    ${subCostLine ? `<p style="margin:4px 0 2px;font-family:Inter,system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:13px;color:#737373">Active subscriptions running <strong style="color:#141414;font-weight:600">${escapeHtml(subCostLine)}</strong> / month.</p>` : ""}
    ${quiet ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0 2px"><tr><td style="background:#FAFAFA;border:1px solid #E6E6E6;border-radius:12px;padding:15px 16px;font-family:Inter,system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:14px;color:#141414"><strong style="font-weight:600">All clear.</strong> <span style="color:#737373">Nothing due in the next 7 days.</span></td></tr></table>` : ""}
    ${section("Upcoming meetings · 7 days", meetingRows)}
    ${section("Subscriptions due", subRows)}
    ${section("Client follow-ups", leadRows)}
    ${section("Invoices outstanding", invoiceRows)}
    ${catLine ? `<p style="margin:22px 0 -8px;font-family:'JetBrains Mono',ui-monospace,'SF Mono',Consolas,monospace;font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#737373">Open by lane &nbsp; <span style="color:#141414">${escapeHtml(catLine)}</span></p>` : ""}
    ${section(taskTitle, todoRows)}
  `;

  const subject = `J Supreme — daily digest · ${summaryParts.slice(0, 3).join(", ")}`;
  const html = emailShell({
    heading: "Daily digest",
    subheading: jmDate(),
    eyebrow: "Workspace digest",
    kpis,
    inner,
    cta: { label: "Open workspace", href: APP_URL },
    footer: "Sent every morning (Jamaica) from your J Supreme Conglomerate workspace. To pause, ask Claude to disable the digest cron.",
  });

  const text =
    `J Supreme — Daily digest (${jmDate()})\n` +
    `${summaryParts.join(" · ")}\n\n` +
    `Meetings (7d):\n${upMeetings.map((m) => `  • ${m.title} — ${fmtDateTime(m.starts_at)}`).join("\n") || "  none"}\n\n` +
    `Subscriptions due:\n${dueSubs.map(({ s, d }) => `  • ${s.name} (${(d as number) < 0 ? "overdue" : "in " + d + "d"})`).join("\n") || "  none"}\n\n` +
    `Follow-ups:\n${dueLeads.map((l) => `  • ${l.company} — ${fmtDate(l.next_follow_up_at as string)}`).join("\n") || "  none"}\n\n` +
    `Unpaid invoices: ${invoices.length}\n\n` +
    `Open tasks (${openTodos.length}):\n${rankedTodos.slice(0, 8).map((t) => `  • ${t.title}${t.due_date ? ` (due ${fmtDate(t.due_date)})` : ""}`).join("\n") || "  none"}`;

  return { subject, html, text };
}
