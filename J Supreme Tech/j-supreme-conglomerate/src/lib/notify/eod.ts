import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { listMeetings } from "@/lib/data/meetings";
import { listSubscriptions } from "@/lib/data/subscriptions";
import { listCrmLeads } from "@/lib/data/crm";
import { listTodos } from "@/lib/data/todos";
import { formatMoney } from "@/lib/subscriptions/compute";
import { APP_URL, emailShell, section } from "@/lib/notify/format";
import { saveEodReport, type EodReport as StoredEodReport } from "@/lib/data/eod-reports";
import { sendNotificationEmail } from "@/lib/notify/email";

const TZ = "America/Jamaica"; // fixed UTC-5, no DST

type Row = { label: string; meta?: string; tone?: "due" | "over" | "normal" };

type DeployRow = { project: string; message: string };

async function fetchLatestDeployments(sinceMs: number): Promise<DeployRow[]> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  if (!token) return [];
  try {
    const teamParam = process.env.VERCEL_TEAM_ID ? `&teamId=${process.env.VERCEL_TEAM_ID}` : "";
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?since=${sinceMs}&limit=10&state=READY${teamParam}`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
    );
    if (!res.ok) return [];
    const data = await res.json() as { deployments?: Record<string, unknown>[] };
    const seen = new Set<string>();
    const rows: DeployRow[] = [];
    for (const d of data.deployments ?? []) {
      const project = String(d.name ?? "");
      if (seen.has(project)) continue;
      seen.add(project);
      const msg =
        String((d.meta as Record<string, unknown>)?.githubCommitMessage ?? "").split("\n")[0].trim() ||
        "deployed";
      rows.push({ project, message: msg });
    }
    return rows.slice(0, 6);
  } catch {
    return [];
  }
}

export type EodReport = {
  report_date: string;
  title: string;
  html: string;
  text: string;
  metrics: Record<string, number>;
};

/** Today's date (YYYY-MM-DD) in the workspace timezone. */
function todayYmd(): string {
  const p: Record<string, string> = {};
  for (const part of new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())) {
    p[part.type] = part.value;
  }
  return `${p.year}-${p.month}-${p.day}`;
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  });
}

function prettyDate(ymd: string): string {
  return new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export async function buildEodReport(owner: string): Promise<EodReport> {
  const ymd = todayYmd();
  const startMs = Date.parse(`${ymd}T05:00:00.000Z`); // Jamaica 00:00 → 05:00 UTC
  const endMs = startMs + 86_400_000;
  const startIso = new Date(startMs).toISOString();
  const since = (iso: string | null | undefined) =>
    iso ? Date.parse(iso) >= startMs : false;

  const [meetingsR, leadsR, subsR, todosR, invoicesR, deploymentsR] = await Promise.allSettled([
    listMeetings(owner),
    listCrmLeads(owner),
    listSubscriptions(owner),
    listTodos(owner),
    (async () => {
      const sb = getServiceSupabase();
      if (!sb) return [] as Record<string, unknown>[];
      const { data } = await sb
        .from("invoices")
        .select("number,amount,currency,status,created_at,paid_at,updated_at")
        .eq("owner_clerk_id", owner)
        .or(`created_at.gte.${startIso},paid_at.gte.${startIso}`);
      return (data ?? []) as Record<string, unknown>[];
    })(),
    fetchLatestDeployments(startMs),
  ]);

  const meetings = meetingsR.status === "fulfilled" ? meetingsR.value : [];
  const leads = leadsR.status === "fulfilled" ? leadsR.value : [];
  const subs = subsR.status === "fulfilled" ? subsR.value : [];
  const todos = todosR.status === "fulfilled" ? todosR.value : [];
  const invoices = invoicesR.status === "fulfilled" ? invoicesR.value : [];
  const deployments = deploymentsR.status === "fulfilled" ? deploymentsR.value : [];

  // ── today's deltas ──
  const newMeetings = meetings.filter((m) => since(m.created_at));
  const bookings = newMeetings.filter((m) => /booked online/i.test(m.notes ?? ""));
  const meetingsToday = meetings.filter((m) => {
    const t = Date.parse(m.starts_at);
    return t >= startMs && t < endMs;
  });
  const completed = meetings.filter(
    (m) => m.status === "completed" && since(m.updated_at),
  );
  const newLeads = leads.filter((l) => since(l.created_at));
  const newSubs = subs.filter((s) => since(s.created_at));
  const tasksDone = todos.filter((t) => t.done && since(t.updated_at));

  const invCreated = invoices.filter((i) => since(String(i.created_at)));
  const invPaid = invoices.filter(
    (i) => i.status === "paid" && (since(i.paid_at as string) || since(i.updated_at as string)),
  );
  const paidByCur = new Map<string, number>();
  for (const i of invPaid) {
    const cur = String(i.currency ?? "USD").toUpperCase();
    paidByCur.set(cur, (paidByCur.get(cur) ?? 0) + Number(i.amount ?? 0));
  }

  const deployRows: Row[] = deployments.map((d) => ({
    label: d.project,
    meta: d.message,
    tone: "normal",
  }));

  const metrics: Record<string, number> = {
    bookings: bookings.length,
    meetings_today: meetingsToday.length,
    completed: completed.length,
    new_leads: newLeads.length,
    new_subscriptions: newSubs.length,
    tasks_done: tasksDone.length,
    invoices_created: invCreated.length,
    invoices_paid: invPaid.length,
    shipped: deployments.length,
  };

  // ── rows ──
  const meetingRows: Row[] = meetingsToday.map((m) => ({
    label: `${m.title}${m.status !== "scheduled" ? ` (${m.status})` : ""}`,
    meta: fmtTime(m.starts_at),
    tone: "normal",
  }));
  const bookingRows: Row[] = bookings.map((m) => ({
    label: m.client_name || m.title,
    meta: `${fmtTime(m.starts_at)} · ${m.client_email ?? ""}`.trim(),
    tone: "normal",
  }));
  const leadRows: Row[] = newLeads.map((l) => ({
    label: `${l.company}${l.tags?.includes("P1") ? " · P1" : ""}`,
    meta: l.stage,
    tone: "normal",
  }));
  const subRows: Row[] = newSubs.map((s) => ({
    label: s.name,
    meta: s.amount != null ? formatMoney(s.amount, s.currency) : "",
    tone: "normal",
  }));
  const taskRows: Row[] = tasksDone.slice(0, 12).map((t) => ({
    label: t.title,
    meta: "done",
    tone: "normal",
  }));
  const invoiceRows: Row[] = [];
  if (invCreated.length) {
    invoiceRows.push({ label: `${invCreated.length} invoice(s) created`, meta: "", tone: "normal" });
  }
  for (const [cur, total] of paidByCur) {
    invoiceRows.push({ label: `Paid today (${cur})`, meta: formatMoney(total, cur), tone: "normal" });
  }

  const headlineParts = [
    `${bookings.length} new booking${bookings.length === 1 ? "" : "s"}`,
    `${meetingsToday.length} meeting${meetingsToday.length === 1 ? "" : "s"}`,
    `${newLeads.length} new lead${newLeads.length === 1 ? "" : "s"}`,
    `${tasksDone.length} task${tasksDone.length === 1 ? "" : "s"} done`,
    `${invPaid.length} paid`,
  ];

  const quiet =
    !meetingRows.length &&
    !bookingRows.length &&
    !leadRows.length &&
    !subRows.length &&
    !taskRows.length &&
    !invoiceRows.length &&
    !deployRows.length;

  const kpis = [
    { value: bookings.length, label: "Bookings" },
    { value: meetingsToday.length, label: "Meetings" },
    { value: newLeads.length, label: "New leads" },
    { value: tasksDone.length, label: "Tasks done" },
    { value: invPaid.length, label: "Paid" },
    { value: deployments.length, label: "Shipped" },
  ];

  const inner = `
    ${quiet ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0 2px"><tr><td style="background:#FAFAFA;border:1px solid #E6E6E6;border-radius:12px;padding:15px 16px;font-family:Inter,system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:14px;color:#737373">A quiet day — no recorded activity on the workspace.</td></tr></table>` : ""}
    ${section("New bookings", bookingRows)}
    ${section("Meetings today", meetingRows)}
    ${section("New leads", leadRows)}
    ${section("Invoices", invoiceRows)}
    ${section("New subscriptions", subRows)}
    ${section("Tasks completed", taskRows)}
    ${section("Latest shipped", deployRows)}
  `;

  const title = `EOD report · ${prettyDate(ymd)}`;
  const html = emailShell({
    heading: "End-of-day report",
    subheading: prettyDate(ymd),
    eyebrow: "Daily wrap-up",
    kpis,
    inner,
    cta: { label: "View in workspace", href: `${APP_URL}/reports` },
    footer: "Generated each evening (Jamaica) and saved to your workspace → Reports.",
  });

  const shippedText = deployments.length
    ? `\n\nLatest shipped:\n${deployments.map((d) => `  ${d.project}: ${d.message}`).join("\n")}`
    : "";

  const text =
    `${title}\n${headlineParts.join(" · ")}\n\n` +
    `New bookings: ${bookings.length}\nMeetings today: ${meetingsToday.length}\n` +
    `New leads: ${newLeads.length}\nNew subscriptions: ${newSubs.length}\n` +
    `Tasks done: ${tasksDone.length}\nInvoices created: ${invCreated.length} · paid: ${invPaid.length}` +
    shippedText;

  return { report_date: ymd, title, html, text, metrics };
}

export type EodRunResult = {
  report: StoredEodReport | null;
  saveError?: string;
  emailed: boolean;
  emailError?: string;
};

/** Build the EOD report, persist it to the workspace, and (optionally) email it. */
export async function generateAndDeliverEod(
  owner: string,
  opts: { email?: boolean } = {},
): Promise<EodRunResult> {
  const r = await buildEodReport(owner);
  const saved = await saveEodReport(owner, {
    report_date: r.report_date,
    title: r.title,
    html: r.html,
    text: r.text,
    metrics: r.metrics,
  });

  let emailed = false;
  let emailError: string | undefined;
  if (opts.email !== false) {
    const sent = await sendNotificationEmail({
      subject: r.title,
      html: r.html,
      text: r.text,
    });
    emailed = sent.ok;
    if (!sent.ok) emailError = sent.error;
  }

  return {
    report: saved.ok ? saved.report : null,
    saveError: saved.ok ? undefined : saved.error,
    emailed,
    emailError,
  };
}
