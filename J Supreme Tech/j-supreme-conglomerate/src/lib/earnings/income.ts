/**
 * Shared earnings helpers — income-type grouping, currency math, and the
 * invoice→job mapping. Pure module, safe to import from any client component
 * (earnings page, dashboard billing cards). Only a type is pulled from the
 * server action file, which is erased at compile time.
 */
import { isRecurring, type Recurrence } from "@/lib/invoices/recurrence";
import type { EarningsInvoiceSummary } from "@/app/(app)/invoices/actions";

export type Currency = "USD" | "JMD";
export type DisplayCurrency = "USD" | "JMD";
export type Status = "paid" | "invoiced" | "pending";

export type Job = {
  id: string;
  client: string;
  project: string;
  category: string;
  amount: number;
  deposit?: number;
  currency: Currency;
  date: string;
  status: Status;
  invoiceRef?: string;
  notes?: string;
  /** True when the source invoice recurs — forces the Fixed income group. */
  recurring?: boolean;
  /** Billing cadence — drives the monthly recurring (MRR) calculation. */
  recurrence?: Recurrence;
  /** Explicit income-type override from the source invoice (wins over derivation). */
  incomeGroup?: IncomeGroup;
  sourceInvoiceId?: string;
  sourceInvoiceNumber?: string;
};

/* ---------------- income-type grouping ---------------- */

export const INCOME_GROUPS = [
  "Marketing",
  "Tech",
  "Fixed income",
  "Other",
] as const;
export type IncomeGroup = (typeof INCOME_GROUPS)[number];

export const CATEGORIES = [
  "Website build",
  "Backoffice build",
  "Mockup / design",
  "Branding",
  "Marketing",
  "Integrations / API",
  "Trading bot",
  "Maintenance / retainer",
  "Consulting",
  "Other",
];

/** Granular category → high-level income type. */
export const CATEGORY_TO_GROUP: Record<string, IncomeGroup> = {
  "Website build": "Tech",
  "Backoffice build": "Tech",
  "Integrations / API": "Tech",
  "Trading bot": "Tech",
  Marketing: "Marketing",
  Branding: "Marketing",
  "Mockup / design": "Marketing",
  "Maintenance / retainer": "Fixed income",
  Consulting: "Other",
  Other: "Other",
};

/** Recurring always → Fixed income (wins over everything); then explicit
 *  override; else map by category. A monthly/weekly client is fixed income by
 *  definition, so the recurrence flag takes top priority. */
export function groupForJob(job: {
  category: string;
  recurring?: boolean;
  incomeGroup?: IncomeGroup;
}): IncomeGroup {
  if (job.recurring) return "Fixed income";
  if (job.incomeGroup) return job.incomeGroup;
  return CATEGORY_TO_GROUP[job.category] ?? "Other";
}

function asIncomeGroup(v: string | null | undefined): IncomeGroup | undefined {
  return v && (INCOME_GROUPS as readonly string[]).includes(v)
    ? (v as IncomeGroup)
    : undefined;
}

/** Resolve the income type for a raw invoice: recurring > explicit > derived.
 *  Recurrence wins so any monthly/weekly invoice lands in Fixed income even if
 *  it was previously tagged with another category (e.g. Ferguson Law monthly). */
export function resolveIncomeGroup(input: {
  income_category?: string | null;
  services_rendered?: string[] | null;
  recurrence?: string | null;
}): IncomeGroup {
  if (isRecurring(input.recurrence)) return "Fixed income";
  const explicit = asIncomeGroup(input.income_category);
  if (explicit) return explicit;
  const firstService = input.services_rendered?.[0] ?? "";
  return CATEGORY_TO_GROUP[SERVICE_TO_CATEGORY[firstService] ?? "Other"] ?? "Other";
}

export const SERVICE_TO_CATEGORY: Record<string, string> = {
  "Brand identity": "Branding",
  "Web design & development": "Website build",
  "Mobile app development": "Website build",
  "Software & CRM development": "Backoffice build",
  "Digital marketing": "Marketing",
  "Social media management": "Marketing",
  SEO: "Marketing",
  "Content & copywriting": "Marketing",
  "Photography & video": "Mockup / design",
  "E-commerce setup": "Website build",
  "Consulting & strategy": "Consulting",
  "Maintenance & hosting": "Maintenance / retainer",
};

/* ---------------- money helpers ---------------- */

export const DEFAULT_FX = 155;

/** Monthly multiplier per cadence — matches how the retainers are quoted
 *  (biweekly billed twice a month, weekly four times). Keeps MRR aligned with
 *  the per-cycle invoice amount × cycles-per-month. */
export const MONTHLY_FACTOR: Record<Recurrence, number> = {
  none: 0,
  weekly: 4,
  biweekly: 2,
  monthly: 1,
  quarterly: 1 / 3,
};

/** Monthly recurring value of a job in its native currency (0 if not recurring).
 *  Manual recurring rows without a stored cadence are treated as monthly. */
export function monthlyNative(job: {
  amount: number;
  recurring?: boolean;
  recurrence?: Recurrence;
}): number {
  if (!job.recurring) return 0;
  return job.amount * (MONTHLY_FACTOR[job.recurrence ?? "monthly"] ?? 1);
}

/* ---------------- shared localStorage keys ---------------- */
export const STORAGE_KEY = "jsc-earnings-jobs-v2";
export const FX_KEY = "jsc-earnings-fx-jmd-per-usd";
export const CCY_KEY = "jsc-earnings-display-currency";
export const EXCLUDE_KEY = "jsc-earnings-excluded-invoice-numbers-v2";

export function loadFx(): number {
  if (typeof window === "undefined") return DEFAULT_FX;
  try {
    const raw = window.localStorage.getItem(FX_KEY);
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_FX;
  } catch {
    return DEFAULT_FX;
  }
}

export function loadDisplayCurrency(): DisplayCurrency {
  if (typeof window === "undefined") return "USD";
  try {
    return window.localStorage.getItem(CCY_KEY) === "JMD" ? "JMD" : "USD";
  } catch {
    return "USD";
  }
}

/** Amount collected so far, in the job's native currency. */
export function collectedNative(j: Job): number {
  if (j.status === "paid") return j.amount;
  return Math.min(j.amount, Math.max(0, j.deposit ?? 0));
}

/** Outstanding balance, in the job's native currency. */
export function balanceNative(j: Job): number {
  return Math.max(0, j.amount - collectedNative(j));
}

/** Convert a value in `from` currency into the chosen `to` currency. */
export function convert(
  value: number,
  from: Currency,
  to: DisplayCurrency,
  fx: number,
): number {
  if (from === to) return value;
  if (from === "USD" && to === "JMD") return value * fx;
  if (from === "JMD" && to === "USD") return value / fx;
  return value;
}

/** Round to sensible whole-unit precision per currency. */
export function snap(value: number, c: Currency): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (c === "USD") return Math.round(value);
  return Math.round(value / 100) * 100;
}

/* ---------------- invoice → job mapping ---------------- */

/**
 * Map a Supabase invoice row into an earnings Job.
 *  - Deposit invoice (is_deposit + total_project_amount): the job represents the
 *    WHOLE project; amount = total_project_amount, invoice amount is the deposit.
 *  - Plain invoice: amount/currency/status carry straight through.
 */
export function invoiceToJob(inv: EarningsInvoiceSummary): Job {
  const currency: Currency = inv.currency === "JMD" ? "JMD" : "USD";
  const date = (inv.issued_at ?? inv.created_at ?? new Date().toISOString()).slice(0, 10);
  const services = inv.services_rendered ?? [];
  const project =
    services.length > 0
      ? services.join(" · ")
      : inv.notes?.split("\n")[0] ?? `Invoice ${inv.number}`;
  const category = SERVICE_TO_CATEGORY[services[0] ?? ""] ?? "Other";

  let status: Status;
  let amount: number;
  let deposit: number | undefined;

  const isDeposit =
    inv.is_deposit &&
    inv.total_project_amount != null &&
    inv.total_project_amount > inv.amount;

  if (isDeposit) {
    amount = inv.total_project_amount as number;
    deposit = inv.status === "paid" || inv.paid_at ? inv.amount : 0;
    status = "invoiced";
  } else if (inv.status === "paid") {
    amount = inv.amount;
    status = "paid";
  } else if (inv.status === "draft") {
    amount = inv.amount;
    status = "pending";
  } else {
    amount = inv.amount;
    deposit = 0;
    status = "invoiced";
  }

  return {
    id: `inv_${inv.id}`,
    client: inv.client_business_name ?? "Client",
    project,
    category,
    amount,
    deposit,
    currency,
    date,
    status,
    invoiceRef: inv.number,
    recurring: isRecurring(inv.recurrence),
    recurrence: inv.recurrence,
    incomeGroup: asIncomeGroup(inv.income_category),
    notes: inv.notes ?? undefined,
    sourceInvoiceId: inv.id,
    sourceInvoiceNumber: inv.number,
  };
}
