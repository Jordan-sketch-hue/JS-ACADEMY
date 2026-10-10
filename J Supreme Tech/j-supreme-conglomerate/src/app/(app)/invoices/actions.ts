"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  createInvoice,
  deleteInvoice,
  generateFinalInvoice,
  generateNextRecurringInvoice,
  listInvoices,
  updateInvoice,
  type CreateInvoiceInput,
  type Recurrence,
  type UpdateInvoiceInput,
} from "@/lib/data/invoices";

export type EarningsInvoiceSummary = {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: string;
  issued_at: string | null;
  paid_at: string | null;
  created_at: string;
  services_rendered: string[];
  is_deposit: boolean;
  total_project_amount: number | null;
  recurrence: Recurrence;
  next_issue_date: string | null;
  income_category: string | null;
  notes: string | null;
  client_business_name: string | null;
};

export async function listInvoicesForEarningsAction(): Promise<
  EarningsInvoiceSummary[]
> {
  const owner = await requireOwnerClerkId();
  const rows = await listInvoices(owner);
  return rows
    .filter((r) => r.status !== "void")
    .map((r) => ({
      id: r.id,
      number: r.number,
      amount: r.amount,
      currency: r.currency,
      status: r.status,
      issued_at: r.issued_at,
      paid_at: r.paid_at,
      created_at: r.created_at,
      services_rendered: r.services_rendered,
      is_deposit: r.is_deposit,
      total_project_amount: r.total_project_amount,
      recurrence: r.recurrence,
      next_issue_date: r.next_issue_date,
      income_category: r.income_category,
      notes: r.notes,
      client_business_name: r.client_business_name,
    }));
}

export async function createInvoiceAction(input: CreateInvoiceInput) {
  const owner = await requireOwnerClerkId();
  const result = await createInvoice(owner, input);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${result.id}`);
  return { ok: true as const, id: result.id };
}

export async function deleteInvoiceAction(invoiceId: string) {
  const owner = await requireOwnerClerkId();
  const result = await deleteInvoice(owner, invoiceId);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/invoices");
  return { ok: true as const };
}

export async function updateInvoiceAction(
  invoiceId: string,
  input: UpdateInvoiceInput,
) {
  const owner = await requireOwnerClerkId();
  const result = await updateInvoice(owner, invoiceId, input);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  return { ok: true as const, id: result.id };
}

export async function generateFinalInvoiceAction(invoiceId: string) {
  const owner = await requireOwnerClerkId();
  const result = await generateFinalInvoice(owner, invoiceId);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${result.id}`);
  return { ok: true as const, id: result.id };
}

export async function generateNextRecurringInvoiceAction(invoiceId: string) {
  const owner = await requireOwnerClerkId();
  const result = await generateNextRecurringInvoice(owner, invoiceId);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/invoices");
  revalidatePath(`/invoices/${result.id}`);
  return { ok: true as const, id: result.id };
}
