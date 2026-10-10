import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  addCadence,
  addDays,
  daysBetween,
  isRecurring,
  type Recurrence,
} from "@/lib/invoices/recurrence";

export type { Recurrence } from "@/lib/invoices/recurrence";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "void";

export type InvoiceLineItemRecord = {
  id: string;
  owner_clerk_id: string;
  invoice_id: string;
  sort_order: number;
  description: string;
  quantity: number;
  unit_rate: number;
  line_total: number;
  created_at: string;
};

export type InvoiceRecord = {
  id: string;
  owner_clerk_id: string;
  client_id: string | null;
  number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issued_at: string | null;
  due_date: string | null;
  paid_at: string | null;
  pdf_url: string | null;
  notes: string | null;
  subtotal: number;
  tax_rate_percent: number | null;
  tax_amount: number;
  discount_amount: number;
  company_name: string | null;
  services_rendered: string[];
  is_deposit: boolean;
  total_project_amount: number | null;
  recurrence: Recurrence;
  next_issue_date: string | null;
  recurrence_parent_id: string | null;
  /** Set on a "final balance" invoice — references the deposit invoice it closes out. */
  deposit_invoice_id: string | null;
  income_category: string | null;
  created_at: string;
  updated_at: string;
};

/** Lightweight summary of the deposit invoice linked to a final-balance invoice. */
export type DepositInvoiceRef = {
  id: string;
  number: string;
  amount: number;
  currency: string;
  issued_at: string | null;
  paid_at: string | null;
  status: InvoiceStatus;
  total_project_amount: number | null;
};

export const DEFAULT_ISSUING_COMPANY = "J Supreme Conglomerate";
export const DEFAULT_ISSUING_PHONE = "658-218-2282";
export const DEFAULT_ISSUING_EMAIL = "global.jsuprememarketing@gmail.com";

export const SERVICE_OPTIONS = [
  "Brand identity",
  "Web design & development",
  "Mobile app development",
  "Software & CRM development",
  "Digital marketing",
  "Social media management",
  "SEO",
  "Content & copywriting",
  "Photography & video",
  "E-commerce setup",
  "Consulting & strategy",
  "Maintenance & hosting",
] as const;
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export type InvoiceListItem = InvoiceRecord & {
  client_business_name: string | null;
};

export type InvoiceWithLines = {
  invoice: InvoiceRecord;
  lines: InvoiceLineItemRecord[];
  client_business_name: string | null;
  /** Present when this invoice is a final-balance invoice linked to a deposit. */
  deposit_invoice?: DepositInvoiceRef | null;
};

const INVOICE_SELECT =
  "id,owner_clerk_id,client_id,number,amount,currency,status,issued_at,due_date,paid_at,pdf_url,notes,subtotal,tax_rate_percent,tax_amount,discount_amount,company_name,services_rendered,is_deposit,total_project_amount,recurrence,next_issue_date,recurrence_parent_id,deposit_invoice_id,income_category,created_at,updated_at";

function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export type InvoiceLineDraft = {
  description: string;
  quantity: number;
  unit_rate: number;
};

export function computeInvoiceTotals(
  lines: InvoiceLineDraft[],
  taxRatePercent: number | null | undefined,
  discountAmount: number | null | undefined,
): {
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  amount: number;
  lineRows: { description: string; quantity: number; unit_rate: number; line_total: number }[];
} {
  const discount = roundMoney(Math.max(0, discountAmount ?? 0));
  const lineRows = lines.map((l) => {
    const qty = Number.isFinite(l.quantity) ? l.quantity : 0;
    const rate = Number.isFinite(l.unit_rate) ? l.unit_rate : 0;
    const line_total = roundMoney(qty * rate);
    return {
      description: l.description.trim() || "Line item",
      quantity: qty,
      unit_rate: rate,
      line_total,
    };
  });
  const subtotal = roundMoney(lineRows.reduce((s, r) => s + r.line_total, 0));
  const afterDiscount = roundMoney(Math.max(0, subtotal - discount));
  const taxPct =
    taxRatePercent != null && Number.isFinite(taxRatePercent)
      ? taxRatePercent
      : null;
  const tax_amount =
    taxPct != null && taxPct > 0 ? roundMoney(afterDiscount * (taxPct / 100)) : 0;
  const amount = roundMoney(afterDiscount + tax_amount);
  return {
    subtotal,
    tax_amount,
    discount_amount: discount,
    amount,
    lineRows,
  };
}

export function generateInvoiceNumber(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `INV-${y}${m}${day}-${rand}`;
}

function mapInvoiceRow(row: Record<string, unknown>): InvoiceRecord {
  return {
    id: String(row.id),
    owner_clerk_id: String(row.owner_clerk_id),
    client_id: row.client_id != null ? String(row.client_id) : null,
    number: String(row.number),
    amount: Number(row.amount),
    currency: String(row.currency ?? "USD"),
    status: row.status as InvoiceStatus,
    issued_at: row.issued_at != null ? String(row.issued_at) : null,
    due_date: row.due_date != null ? String(row.due_date) : null,
    paid_at: row.paid_at != null ? String(row.paid_at) : null,
    pdf_url: row.pdf_url != null ? String(row.pdf_url) : null,
    notes: row.notes != null ? String(row.notes) : null,
    subtotal: Number(row.subtotal ?? 0),
    tax_rate_percent:
      row.tax_rate_percent != null ? Number(row.tax_rate_percent) : null,
    tax_amount: Number(row.tax_amount ?? 0),
    discount_amount: Number(row.discount_amount ?? 0),
    company_name: row.company_name != null ? String(row.company_name) : null,
    services_rendered: Array.isArray(row.services_rendered)
      ? (row.services_rendered as unknown[]).map((v) => String(v))
      : [],
    is_deposit: row.is_deposit === true,
    total_project_amount:
      row.total_project_amount != null ? Number(row.total_project_amount) : null,
    recurrence: normalizeRecurrence(row.recurrence),
    next_issue_date:
      row.next_issue_date != null ? String(row.next_issue_date) : null,
    recurrence_parent_id:
      row.recurrence_parent_id != null ? String(row.recurrence_parent_id) : null,
    deposit_invoice_id:
      row.deposit_invoice_id != null ? String(row.deposit_invoice_id) : null,
    income_category: normalizeIncomeCategory(
      row.income_category != null ? String(row.income_category) : null,
    ),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at ?? row.created_at),
  };
}

function normalizeRecurrence(v: unknown): Recurrence {
  return v === "weekly" || v === "biweekly" || v === "monthly" || v === "quarterly"
    ? v
    : "none";
}

const INCOME_CATEGORY_VALUES = ["Marketing", "Tech", "Fixed income", "Other"];
function normalizeIncomeCategory(v: string | null | undefined): string | null {
  const s = (v ?? "").trim();
  return INCOME_CATEGORY_VALUES.includes(s) ? s : null;
}

function mapLineRow(row: Record<string, unknown>): InvoiceLineItemRecord {
  return {
    id: String(row.id),
    owner_clerk_id: String(row.owner_clerk_id),
    invoice_id: String(row.invoice_id),
    sort_order: Number(row.sort_order ?? 0),
    description: String(row.description ?? ""),
    quantity: Number(row.quantity ?? 0),
    unit_rate: Number(row.unit_rate ?? 0),
    line_total: Number(row.line_total ?? 0),
    created_at: String(row.created_at),
  };
}

export async function listInvoices(
  ownerClerkId: string,
): Promise<InvoiceListItem[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("invoices")
      .select(`${INVOICE_SELECT}, clients(business_name)`)
      .eq("owner_clerk_id", ownerClerkId)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data.map((raw) => {
      const row = raw as Record<string, unknown> & {
        clients?: { business_name?: string } | null;
      };
      const inv = mapInvoiceRow(row);
      const name = row.clients?.business_name ?? null;
      return {
        ...inv,
        client_business_name: name,
      };
    });
  } catch {
    return [];
  }
}

export async function getInvoiceWithLines(
  ownerClerkId: string,
  invoiceId: string,
): Promise<InvoiceWithLines | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  try {
    const { data: invRaw, error: invErr } = await sb
      .from("invoices")
      .select(`${INVOICE_SELECT}, clients(business_name)`)
      .eq("owner_clerk_id", ownerClerkId)
      .eq("id", invoiceId)
      .maybeSingle();
    if (invErr || !invRaw) return null;
    const row = invRaw as Record<string, unknown> & {
      clients?: { business_name?: string } | null;
    };
    const invoice = mapInvoiceRow(row);
    const client_business_name = row.clients?.business_name ?? null;

    const { data: linesRaw, error: lErr } = await sb
      .from("invoice_line_items")
      .select(
        "id,owner_clerk_id,invoice_id,sort_order,description,quantity,unit_rate,line_total,created_at",
      )
      .eq("owner_clerk_id", ownerClerkId)
      .eq("invoice_id", invoiceId)
      .order("sort_order", { ascending: true });
    if (lErr) {
      return { invoice, lines: [], client_business_name };
    }
    const lines = (linesRaw ?? []).map((l) =>
      mapLineRow(l as Record<string, unknown>),
    );

    // If this is a final-balance invoice, fetch the original deposit invoice so
    // the UI can render a full transaction history for both parties.
    let deposit_invoice: DepositInvoiceRef | null = null;
    if (invoice.deposit_invoice_id) {
      const { data: depRaw } = await sb
        .from("invoices")
        .select("id,number,amount,currency,issued_at,paid_at,status,total_project_amount")
        .eq("id", invoice.deposit_invoice_id)
        .eq("owner_clerk_id", ownerClerkId)
        .maybeSingle();
      if (depRaw) {
        const d = depRaw as Record<string, unknown>;
        deposit_invoice = {
          id: String(d.id),
          number: String(d.number),
          amount: Number(d.amount),
          currency: String(d.currency ?? "USD"),
          issued_at: d.issued_at != null ? String(d.issued_at) : null,
          paid_at: d.paid_at != null ? String(d.paid_at) : null,
          status: d.status as InvoiceStatus,
          total_project_amount:
            d.total_project_amount != null ? Number(d.total_project_amount) : null,
        };
      }
    }

    return { invoice, lines, client_business_name, deposit_invoice };
  } catch {
    return null;
  }
}

export type CreateInvoiceInput = {
  client_id: string;
  currency?: string;
  status?: InvoiceStatus;
  issued_at?: string | null;
  due_date?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  tax_rate_percent?: number | null;
  discount_amount?: number | null;
  company_name?: string | null;
  services_rendered?: string[];
  is_deposit?: boolean;
  total_project_amount?: number | null;
  recurrence?: Recurrence;
  next_issue_date?: string | null;
  income_category?: string | null;
  lines: InvoiceLineDraft[];
};

export type InvoiceMutationResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function createInvoice(
  ownerClerkId: string,
  input: CreateInvoiceInput,
): Promise<InvoiceMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) {
    return {
      ok: false,
      error:
        "Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and a service key.",
    };
  }
  if (!input.client_id?.trim()) {
    return { ok: false, error: "Client is required." };
  }
  const { lineRows, subtotal, tax_amount, discount_amount, amount } =
    computeInvoiceTotals(
      input.lines?.length ? input.lines : [{ description: "Service", quantity: 1, unit_rate: 0 }],
      input.tax_rate_percent,
      input.discount_amount,
    );

  const number = generateInvoiceNumber();
  const currency = (input.currency ?? "USD").trim() || "USD";
  const status: InvoiceStatus = input.status ?? "draft";
  const tax_rate_db =
    input.tax_rate_percent != null &&
    Number.isFinite(input.tax_rate_percent) &&
    input.tax_rate_percent > 0
      ? input.tax_rate_percent
      : null;

  try {
    const services = (input.services_rendered ?? [])
      .map((s) => s.trim())
      .filter(Boolean);
    const totalProject =
      input.is_deposit &&
      input.total_project_amount != null &&
      Number.isFinite(input.total_project_amount) &&
      input.total_project_amount > 0
        ? roundMoney(input.total_project_amount)
        : null;
    const recurrence: Recurrence = isRecurring(input.recurrence)
      ? (input.recurrence as Recurrence)
      : "none";
    const nextIssue =
      recurrence !== "none" ? input.next_issue_date?.trim() || null : null;

    const { data: invRow, error: invErr } = await sb
      .from("invoices")
      .insert({
        owner_clerk_id: ownerClerkId,
        client_id: input.client_id.trim(),
        number,
        amount,
        currency,
        status,
        issued_at: input.issued_at?.trim() || null,
        due_date: input.due_date?.trim() || null,
        paid_at: input.paid_at?.trim() || null,
        notes: input.notes?.trim() || null,
        subtotal,
        tax_rate_percent: tax_rate_db,
        tax_amount,
        discount_amount,
        company_name: input.company_name?.trim() || null,
        services_rendered: services,
        is_deposit: input.is_deposit === true,
        total_project_amount: totalProject,
        recurrence,
        next_issue_date: nextIssue,
        income_category: normalizeIncomeCategory(input.income_category),
      })
      .select(INVOICE_SELECT)
      .single();

    if (invErr || !invRow) {
      const msg = invErr?.message ?? "Could not create invoice.";
      const hint = /unique|duplicate|23505/i.test(msg)
        ? " Invoice number collision — retry."
        : /column|42703|does not exist/i.test(msg)
          ? " Apply migration supabase/migrations/20250513220000_invoices_line_items.sql."
          : "";
      return { ok: false, error: `${msg}${hint}` };
    }

    const id = String((invRow as { id: string }).id);

    if (lineRows.length) {
      const inserts = lineRows.map((r, i) => ({
        owner_clerk_id: ownerClerkId,
        invoice_id: id,
        sort_order: i,
        description: r.description,
        quantity: r.quantity,
        unit_rate: r.unit_rate,
        line_total: r.line_total,
      }));
      const { error: liErr } = await sb.from("invoice_line_items").insert(inserts);
      if (liErr) {
        await sb.from("invoices").delete().eq("id", id).eq("owner_clerk_id", ownerClerkId);
        return { ok: false, error: liErr.message };
      }
    }

    return { ok: true, id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

export type UpdateInvoiceInput = {
  client_id: string;
  currency?: string;
  status?: InvoiceStatus;
  issued_at?: string | null;
  due_date?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  tax_rate_percent?: number | null;
  discount_amount?: number | null;
  company_name?: string | null;
  services_rendered?: string[];
  is_deposit?: boolean;
  total_project_amount?: number | null;
  recurrence?: Recurrence;
  next_issue_date?: string | null;
  income_category?: string | null;
  lines: InvoiceLineDraft[];
};

export async function deleteInvoice(
  ownerClerkId: string,
  invoiceId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) {
    return { ok: false, error: "Supabase is not configured." };
  }
  try {
    const { error: linesErr } = await sb
      .from("invoice_line_items")
      .delete()
      .eq("invoice_id", invoiceId)
      .eq("owner_clerk_id", ownerClerkId);
    if (linesErr) {
      return { ok: false, error: linesErr.message };
    }
    const { error: invErr } = await sb
      .from("invoices")
      .delete()
      .eq("id", invoiceId)
      .eq("owner_clerk_id", ownerClerkId);
    if (invErr) {
      return { ok: false, error: invErr.message };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

export async function updateInvoice(
  ownerClerkId: string,
  invoiceId: string,
  input: UpdateInvoiceInput,
): Promise<InvoiceMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) {
    return { ok: false, error: "Supabase is not configured." };
  }
  if (!input.client_id?.trim()) {
    return { ok: false, error: "Client is required." };
  }

  const { lineRows, subtotal, tax_amount, discount_amount, amount } =
    computeInvoiceTotals(
      input.lines?.length ? input.lines : [{ description: "Service", quantity: 1, unit_rate: 0 }],
      input.tax_rate_percent,
      input.discount_amount,
    );

  const currency = (input.currency ?? "USD").trim() || "USD";
  const status: InvoiceStatus = input.status ?? "draft";
  const tax_rate_db =
    input.tax_rate_percent != null &&
    Number.isFinite(input.tax_rate_percent) &&
    input.tax_rate_percent > 0
      ? input.tax_rate_percent
      : null;

  try {
    const services = (input.services_rendered ?? [])
      .map((s) => s.trim())
      .filter(Boolean);
    const totalProject =
      input.is_deposit &&
      input.total_project_amount != null &&
      Number.isFinite(input.total_project_amount) &&
      input.total_project_amount > 0
        ? roundMoney(input.total_project_amount)
        : null;
    const recurrence: Recurrence = isRecurring(input.recurrence)
      ? (input.recurrence as Recurrence)
      : "none";
    const nextIssue =
      recurrence !== "none" ? input.next_issue_date?.trim() || null : null;

    const { error: upErr } = await sb
      .from("invoices")
      .update({
        client_id: input.client_id.trim(),
        amount,
        currency,
        status,
        issued_at: input.issued_at?.trim() || null,
        due_date: input.due_date?.trim() || null,
        paid_at: input.paid_at?.trim() || null,
        notes: input.notes?.trim() || null,
        subtotal,
        tax_rate_percent: tax_rate_db,
        tax_amount,
        discount_amount,
        company_name: input.company_name?.trim() || null,
        services_rendered: services,
        is_deposit: input.is_deposit === true,
        total_project_amount: totalProject,
        recurrence,
        next_issue_date: nextIssue,
        income_category: normalizeIncomeCategory(input.income_category),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .eq("owner_clerk_id", ownerClerkId);

    if (upErr) {
      return { ok: false, error: upErr.message };
    }

    const { error: delErr } = await sb
      .from("invoice_line_items")
      .delete()
      .eq("invoice_id", invoiceId)
      .eq("owner_clerk_id", ownerClerkId);
    if (delErr) {
      return { ok: false, error: delErr.message };
    }

    if (lineRows.length) {
      const inserts = lineRows.map((r, i) => ({
        owner_clerk_id: ownerClerkId,
        invoice_id: invoiceId,
        sort_order: i,
        description: r.description,
        quantity: r.quantity,
        unit_rate: r.unit_rate,
        line_total: r.line_total,
      }));
      const { error: insErr } = await sb.from("invoice_line_items").insert(inserts);
      if (insErr) {
        return { ok: false, error: insErr.message };
      }
    }

    return { ok: true, id: invoiceId };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

/**
 * Generate a "final balance" invoice that closes out a deposit invoice.
 *
 * Format — statement-of-account style so both parties see the full picture:
 *   Line 1: "[Services] — full project"   qty 1 × total_project_amount   = +total
 *   Line 2: "Deposit received — INV-xxx"  qty 1 × −deposit_amount        = −deposit
 *   ──────────────────────────────────────────────────────────────
 *   Net (balance due):                                              = balance
 *
 * The new invoice stores `deposit_invoice_id` so the UI can fetch the deposit
 * details and render a complete payment-history panel for both parties.
 */
export async function generateFinalInvoice(
  ownerClerkId: string,
  depositInvoiceId: string,
): Promise<InvoiceMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const src = await getInvoiceWithLines(ownerClerkId, depositInvoiceId);
  if (!src) return { ok: false, error: "Deposit invoice not found." };

  const inv = src.invoice;
  if (!inv.is_deposit) {
    return { ok: false, error: "This invoice is not marked as a deposit." };
  }
  if (inv.total_project_amount == null || inv.total_project_amount <= 0) {
    return { ok: false, error: "No total project amount recorded on this deposit invoice." };
  }

  const balance = roundMoney(inv.total_project_amount - inv.amount);
  if (balance <= 0) {
    return {
      ok: false,
      error: "No remaining balance — the deposit already covers the full project amount.",
    };
  }

  // Build a human-readable project description from the services on the deposit
  const projectDesc =
    inv.services_rendered.length > 0
      ? `${inv.services_rendered.join(" · ")} — full project`
      : `Full project — see deposit ${inv.number}`;

  // Credit line description references the deposit invoice number + date
  const depositDatePart = inv.issued_at ? ` · ${inv.issued_at.slice(0, 10)}` : "";
  const depositDesc = `Deposit received — ${inv.number}${depositDatePart}`;

  const today = new Date().toISOString().slice(0, 10);

  try {
    const { data: invRow, error: invErr } = await sb
      .from("invoices")
      .insert({
        owner_clerk_id: ownerClerkId,
        client_id: inv.client_id,
        number: generateInvoiceNumber(),
        // amount = the net balance due (full project − deposit)
        amount: balance,
        currency: inv.currency,
        status: "draft" as InvoiceStatus,
        issued_at: today,
        due_date: null,
        paid_at: null,
        // Notes intentionally blank — the Payment History table on the invoice
        // is the definitive record. The user can add custom notes if needed.
        notes: null,
        subtotal: balance,
        tax_rate_percent: null,
        tax_amount: 0,
        discount_amount: 0,
        company_name: inv.company_name,
        services_rendered: inv.services_rendered,
        is_deposit: false,
        total_project_amount: null,
        recurrence: "none",
        next_issue_date: null,
        recurrence_parent_id: null,
        deposit_invoice_id: depositInvoiceId, // ← links this invoice to the deposit
        income_category: inv.income_category,
      })
      .select("id")
      .single();

    if (invErr || !invRow) {
      return {
        ok: false,
        error: invErr?.message ?? "Could not create final invoice.",
      };
    }
    const newId = String((invRow as { id: string }).id);

    // Two-line statement layout:
    //   Line 0 — full project (positive)
    //   Line 1 — deposit credit (negative) → net = balance
    const lineInserts = [
      {
        owner_clerk_id: ownerClerkId,
        invoice_id: newId,
        sort_order: 0,
        description: projectDesc,
        quantity: 1,
        unit_rate: inv.total_project_amount,
        line_total: inv.total_project_amount,
      },
      {
        owner_clerk_id: ownerClerkId,
        invoice_id: newId,
        sort_order: 1,
        description: depositDesc,
        quantity: 1,
        unit_rate: -inv.amount,
        line_total: -inv.amount,
      },
    ];

    const { error: liErr } = await sb
      .from("invoice_line_items")
      .insert(lineInserts);
    if (liErr) {
      await sb
        .from("invoices")
        .delete()
        .eq("id", newId)
        .eq("owner_clerk_id", ownerClerkId);
      return { ok: false, error: liErr.message };
    }

    return { ok: true, id: newId };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

/**
 * Clone a recurring invoice into the next billing period: a fresh draft with a
 * new number, advanced issue/due dates, the same line items, and the recurrence
 * settings carried forward. The source invoice is left untouched.
 */
export async function generateNextRecurringInvoice(
  ownerClerkId: string,
  invoiceId: string,
): Promise<InvoiceMutationResult> {
  const sb = getServiceSupabase();
  if (!sb) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const src = await getInvoiceWithLines(ownerClerkId, invoiceId);
  if (!src) {
    return { ok: false, error: "Source invoice not found." };
  }
  const inv = src.invoice;
  if (!isRecurring(inv.recurrence)) {
    return { ok: false, error: "This invoice is not set to recur." };
  }

  const today = new Date().toISOString().slice(0, 10);
  const srcIssued = inv.issued_at?.slice(0, 10) || today;
  // Honor an explicit next_issue_date override; otherwise advance from the
  // source's issue date by one cadence step.
  const newIssued =
    inv.next_issue_date?.slice(0, 10) || addCadence(srcIssued, inv.recurrence) || today;

  // Preserve the original issued→due gap so payment terms stay consistent.
  let newDue: string | null = null;
  if (inv.due_date && inv.issued_at) {
    const gap = daysBetween(srcIssued, inv.due_date.slice(0, 10));
    newDue = addDays(newIssued, gap);
  } else if (inv.due_date) {
    newDue = addCadence(inv.due_date.slice(0, 10), inv.recurrence);
  }

  const newNext = addCadence(newIssued, inv.recurrence);
  const parentId = inv.recurrence_parent_id ?? inv.id;

  try {
    const { data: invRow, error: invErr } = await sb
      .from("invoices")
      .insert({
        owner_clerk_id: ownerClerkId,
        client_id: inv.client_id,
        number: generateInvoiceNumber(),
        amount: inv.amount,
        currency: inv.currency,
        status: "draft",
        issued_at: newIssued,
        due_date: newDue,
        paid_at: null,
        notes: inv.notes,
        subtotal: inv.subtotal,
        tax_rate_percent: inv.tax_rate_percent,
        tax_amount: inv.tax_amount,
        discount_amount: inv.discount_amount,
        company_name: inv.company_name,
        services_rendered: inv.services_rendered,
        is_deposit: inv.is_deposit,
        total_project_amount: inv.total_project_amount,
        recurrence: inv.recurrence,
        next_issue_date: newNext,
        recurrence_parent_id: parentId,
        income_category: inv.income_category,
      })
      .select("id")
      .single();

    if (invErr || !invRow) {
      return {
        ok: false,
        error: invErr?.message ?? "Could not generate the next invoice.",
      };
    }
    const newId = String((invRow as { id: string }).id);

    if (src.lines.length) {
      const inserts = src.lines.map((l, i) => ({
        owner_clerk_id: ownerClerkId,
        invoice_id: newId,
        sort_order: i,
        description: l.description,
        quantity: l.quantity,
        unit_rate: l.unit_rate,
        line_total: l.line_total,
      }));
      const { error: liErr } = await sb
        .from("invoice_line_items")
        .insert(inserts);
      if (liErr) {
        await sb
          .from("invoices")
          .delete()
          .eq("id", newId)
          .eq("owner_clerk_id", ownerClerkId);
        return { ok: false, error: liErr.message };
      }
    }

    return { ok: true, id: newId };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}
