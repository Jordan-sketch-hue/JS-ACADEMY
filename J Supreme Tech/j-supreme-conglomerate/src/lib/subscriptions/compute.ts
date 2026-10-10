import type { BillingCycle, Subscription } from "@/lib/data/subscriptions";

export const BILLING_CYCLES: BillingCycle[] = [
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
];

export const CYCLE_LABEL: Record<BillingCycle, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

/** Short suffix for price display, e.g. "$12 /mo". */
export const CYCLE_SUFFIX: Record<BillingCycle, string> = {
  weekly: "/wk",
  monthly: "/mo",
  quarterly: "/qtr",
  yearly: "/yr",
};

/** Normalize any cycle's amount to a per-month figure for totals. */
export function toMonthly(amount: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly":
      return (amount * 52) / 12;
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "yearly":
      return amount / 12;
    default:
      return amount;
  }
}

/** Advance a YYYY-MM-DD date forward by one billing cycle. */
export function advanceDue(dateStr: string, cycle: BillingCycle): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  switch (cycle) {
    case "weekly":
      date.setUTCDate(date.getUTCDate() + 7);
      break;
    case "monthly":
      date.setUTCMonth(date.getUTCMonth() + 1);
      break;
    case "quarterly":
      date.setUTCMonth(date.getUTCMonth() + 3);
      break;
    case "yearly":
      date.setUTCFullYear(date.getUTCFullYear() + 1);
      break;
  }
  return date.toISOString().slice(0, 10);
}

export type DueTone = "overdue" | "soon" | "upcoming" | "none";

/** Days from today (UTC date-only) until the due date; negative = overdue. */
export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  const due = Date.UTC(y, (m ?? 1) - 1, d ?? 1);
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((due - today) / 86_400_000);
}

export function dueStatus(dateStr: string | null): { label: string; tone: DueTone } {
  const n = daysUntil(dateStr);
  if (n === null) return { label: "No date", tone: "none" };
  if (n < 0) return { label: `${Math.abs(n)}d overdue`, tone: "overdue" };
  if (n === 0) return { label: "Due today", tone: "soon" };
  if (n === 1) return { label: "Due tomorrow", tone: "soon" };
  if (n <= 7) return { label: `Due in ${n}d`, tone: "soon" };
  return { label: `In ${n}d`, tone: "upcoming" };
}

export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1)).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/** Per-currency monthly + yearly totals across active subscriptions. */
export function totalsByCurrency(
  subs: Subscription[],
): { currency: string; monthly: number; yearly: number; count: number }[] {
  const map = new Map<string, { monthly: number; yearly: number; count: number }>();
  for (const s of subs) {
    if (s.status !== "active" || s.amount == null) continue;
    const cur = s.currency || "USD";
    const monthly = toMonthly(s.amount, s.billing_cycle);
    const entry = map.get(cur) ?? { monthly: 0, yearly: 0, count: 0 };
    entry.monthly += monthly;
    entry.yearly += monthly * 12;
    entry.count += 1;
    map.set(cur, entry);
  }
  return [...map.entries()]
    .map(([currency, v]) => ({ currency, ...v }))
    .sort((a, b) => b.monthly - a.monthly);
}
