/**
 * Pure recurring-invoice helpers — safe to import from both server data-layer
 * code and client components (no server-only imports live here).
 */

export type Recurrence =
  | "none"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly";

export const RECURRENCE_OPTIONS: { value: Recurrence; label: string; short: string }[] = [
  { value: "none", label: "One-off (no recurrence)", short: "One-off" },
  { value: "weekly", label: "Weekly", short: "Weekly" },
  { value: "biweekly", label: "Biweekly (every 2 weeks)", short: "Biweekly" },
  { value: "monthly", label: "Monthly", short: "Monthly" },
  { value: "quarterly", label: "Quarterly", short: "Quarterly" },
];

const SHORT_LABEL: Record<Recurrence, string> = {
  none: "One-off",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

export function recurrenceLabel(r: Recurrence): string {
  return SHORT_LABEL[r] ?? "One-off";
}

export function isRecurring(r: Recurrence | string | null | undefined): boolean {
  return (
    r === "weekly" || r === "biweekly" || r === "monthly" || r === "quarterly"
  );
}

/** Fee suffix for contract copy: "JMD 15,000.00 every two weeks" / "per month". */
export function cadenceFeePhrase(r: Recurrence): string {
  switch (r) {
    case "weekly":
      return "per week";
    case "biweekly":
      return "every two weeks";
    case "monthly":
      return "per month";
    case "quarterly":
      return "per quarter";
    default:
      return "";
  }
}

/** Period noun for contract copy: "the first two weeks of service". */
export function cadencePeriodNoun(r: Recurrence): string {
  switch (r) {
    case "weekly":
      return "week";
    case "biweekly":
      return "two weeks";
    case "monthly":
      return "month";
    case "quarterly":
      return "quarter";
    default:
      return "engagement";
  }
}

/** Spelled-out span for legal copy: "two (2) weeks after the deposit is received". */
export function cadenceSpanPhrase(r: Recurrence): string {
  switch (r) {
    case "weekly":
      return "one (1) week";
    case "biweekly":
      return "two (2) weeks";
    case "monthly":
      return "one (1) month";
    case "quarterly":
      return "three (3) months";
    default:
      return "";
  }
}

function parseIsoDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  return new Date(Date.UTC(y, mo - 1, d));
}

function toIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Add `months` to a UTC date, clamping to the last valid day (Jan 31 + 1mo → Feb 28). */
function addMonthsClamped(d: Date, months: number): void {
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
  ).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
}

/** Advance an ISO date (YYYY-MM-DD) by one cadence step. Returns null on bad input. */
export function addCadence(iso: string | null | undefined, cadence: Recurrence): string | null {
  if (!iso) return null;
  const base = parseIsoDate(iso);
  if (!base) return null;
  if (cadence === "weekly") {
    base.setUTCDate(base.getUTCDate() + 7);
  } else if (cadence === "biweekly") {
    base.setUTCDate(base.getUTCDate() + 14);
  } else if (cadence === "monthly") {
    addMonthsClamped(base, 1);
  } else if (cadence === "quarterly") {
    addMonthsClamped(base, 3);
  } else {
    return iso.slice(0, 10);
  }
  return toIso(base);
}

export function addDays(iso: string, days: number): string | null {
  const base = parseIsoDate(iso);
  if (!base) return null;
  base.setUTCDate(base.getUTCDate() + days);
  return toIso(base);
}

/** Whole-day difference (b - a). Returns 0 on bad input. */
export function daysBetween(a: string, b: string): number {
  const da = parseIsoDate(a);
  const db = parseIsoDate(b);
  if (!da || !db) return 0;
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
}

/** Days until an ISO date from today (UTC). Negative = overdue. null on bad input. */
export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const target = parseIsoDate(iso);
  if (!target) return null;
  const now = new Date();
  const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.round((target.getTime() - todayUtc) / 86_400_000);
}
