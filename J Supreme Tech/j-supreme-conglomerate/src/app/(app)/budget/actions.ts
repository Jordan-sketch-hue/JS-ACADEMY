"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  createBudgetAccount,
  createBudgetBill,
  createBudgetCategory,
  createBudgetGoal,
  createBudgetTransaction,
  deleteBudgetAccount,
  deleteBudgetBill,
  deleteBudgetCategory,
  deleteBudgetGoal,
  deleteBudgetTransaction,
  importPaidInvoicesAsIncome,
  loadBudgetWorkspace,
  seedStarterBudget,
  updateBudgetAccount,
  updateBudgetBill,
  updateBudgetCategory,
  updateBudgetGoal,
  updateBudgetTransaction,
  type AccountInput,
  type BillInput,
  type CategoryInput,
  type GoalInput,
  type TransactionInput,
} from "@/lib/data/budget";

function touch() {
  revalidatePath("/budget");
  revalidatePath("/dashboard");
}

export async function loadBudgetWorkspaceAction() {
  const owner = await requireOwnerClerkId();
  return loadBudgetWorkspace(owner);
}

// Accounts
export async function createAccountAction(input: AccountInput) {
  const owner = await requireOwnerClerkId();
  const res = await createBudgetAccount(owner, input);
  if (res.ok) touch();
  return res;
}
export async function updateAccountAction(id: string, patch: Partial<AccountInput>) {
  const owner = await requireOwnerClerkId();
  const res = await updateBudgetAccount(owner, id, patch);
  if (res.ok) touch();
  return res;
}
export async function deleteAccountAction(id: string) {
  const owner = await requireOwnerClerkId();
  const res = await deleteBudgetAccount(owner, id);
  if (res.ok) touch();
  return res;
}

// Categories
export async function createCategoryAction(input: CategoryInput) {
  const owner = await requireOwnerClerkId();
  const res = await createBudgetCategory(owner, input);
  if (res.ok) touch();
  return res;
}
export async function updateCategoryAction(id: string, patch: Partial<CategoryInput>) {
  const owner = await requireOwnerClerkId();
  const res = await updateBudgetCategory(owner, id, patch);
  if (res.ok) touch();
  return res;
}
export async function deleteCategoryAction(id: string) {
  const owner = await requireOwnerClerkId();
  const res = await deleteBudgetCategory(owner, id);
  if (res.ok) touch();
  return res;
}

// Transactions
export async function createTransactionAction(input: TransactionInput) {
  const owner = await requireOwnerClerkId();
  const res = await createBudgetTransaction(owner, input);
  if (res.ok) touch();
  return res;
}
export async function updateTransactionAction(
  id: string,
  patch: Partial<TransactionInput>,
) {
  const owner = await requireOwnerClerkId();
  const res = await updateBudgetTransaction(owner, id, patch);
  if (res.ok) touch();
  return res;
}
export async function deleteTransactionAction(id: string) {
  const owner = await requireOwnerClerkId();
  const res = await deleteBudgetTransaction(owner, id);
  if (res.ok) touch();
  return res;
}

// Goals
export async function createGoalAction(input: GoalInput) {
  const owner = await requireOwnerClerkId();
  const res = await createBudgetGoal(owner, input);
  if (res.ok) touch();
  return res;
}
export async function updateGoalAction(id: string, patch: Partial<GoalInput>) {
  const owner = await requireOwnerClerkId();
  const res = await updateBudgetGoal(owner, id, patch);
  if (res.ok) touch();
  return res;
}
export async function deleteGoalAction(id: string) {
  const owner = await requireOwnerClerkId();
  const res = await deleteBudgetGoal(owner, id);
  if (res.ok) touch();
  return res;
}

// Bills
export async function createBillAction(input: BillInput) {
  const owner = await requireOwnerClerkId();
  const res = await createBudgetBill(owner, input);
  if (res.ok) touch();
  return res;
}
export async function updateBillAction(id: string, patch: Partial<BillInput>) {
  const owner = await requireOwnerClerkId();
  const res = await updateBudgetBill(owner, id, patch);
  if (res.ok) touch();
  return res;
}
export async function deleteBillAction(id: string) {
  const owner = await requireOwnerClerkId();
  const res = await deleteBudgetBill(owner, id);
  if (res.ok) touch();
  return res;
}

// Setup / import
export async function seedStarterBudgetAction() {
  const owner = await requireOwnerClerkId();
  const res = await seedStarterBudget(owner);
  if (res.ok) touch();
  return res;
}
export async function importPaidInvoicesAction() {
  const owner = await requireOwnerClerkId();
  const res = await importPaidInvoicesAsIncome(owner);
  if (res.ok) touch();
  return res;
}

// ── Bank-statement seeder ───────────────────────────────────────────────────
// Wires NCB 874520241 + Scotia 935609 verified balances and 3-month expense
// summary as real budget transactions (Apr–Jun 2026).

export async function seedStatementBudgetAction() {
  const owner = await requireOwnerClerkId();

  // 1) Ensure categories exist
  await seedStarterBudget(owner);

  // 2) Create NCB account
  const ncb = await createBudgetAccount(owner, {
    name: "NCB Regular Savings 874520241",
    type: "savings",
    starting_balance: 80.75,
    currency: "JMD",
  });

  // 3) Create Scotia account
  const sco = await createBudgetAccount(owner, {
    name: "Scotia Primary Savings Junior 935609",
    type: "savings",
    starting_balance: 207.79,
    currency: "JMD",
  });

  const ncbId = ncb.ok ? ncb.record.id : null;
  const scoId = sco.ok ? sco.record.id : null;

  // 4) Seed 3-month expense summary transactions — field names match TransactionInput exactly
  type ExpenseRow = Omit<TransactionInput, "account_id">;
  const ncbExpenses: ExpenseRow[] = [
    { txn_date: "2026-04-30", payee: "Deriv",             memo: "Deposits out — Apr (11 entries, NCB verified)", amount: 57642.81, kind: "expense" },
    { txn_date: "2026-04-30", payee: "ABM",               memo: "Cash withdrawals — Apr (NCB)",                 amount: 19500.00, kind: "expense" },
    { txn_date: "2026-04-30", payee: "Bills & Fees",      memo: "BPYMT + bank fees — Apr (NCB)",               amount: 9017.57,  kind: "expense" },
    { txn_date: "2026-04-30", payee: "Transfers out",     memo: "Remaining NCB debits — Apr",                  amount: 13145.59, kind: "expense" },
    { txn_date: "2026-05-31", payee: "Deriv",             memo: "Deposits out — May (NCB)",                    amount: 104800.00, kind: "expense" },
    { txn_date: "2026-05-31", payee: "ABM",               memo: "Cash withdrawals — May (NCB)",                amount: 18000.00, kind: "expense" },
    { txn_date: "2026-05-31", payee: "Bills & Fees",      memo: "BPYMT + fees + transfers — May (NCB)",        amount: 112691.37, kind: "expense" },
    { txn_date: "2026-06-30", payee: "Deriv",             memo: "Deposits out — Jun (NCB)",                    amount: 89500.00, kind: "expense" },
    { txn_date: "2026-06-30", payee: "ABM",               memo: "Cash withdrawals — Jun (NCB)",                amount: 18000.00, kind: "expense" },
    { txn_date: "2026-06-30", payee: "Bills & Fees",      memo: "BPYMT + fees + transfers — Jun (NCB)",        amount: 117665.27, kind: "expense" },
  ];

  const scoExpenses: ExpenseRow[] = [
    { txn_date: "2026-05-05", payee: "Scotia withdrawals", memo: "Apr5–May5 total (incl GCT/service charges)",          amount: 26983.77,  kind: "expense" },
    { txn_date: "2026-06-05", payee: "Scotia withdrawals", memo: "May5–Jun5 total (incl NCB self-transfers)",            amount: 281487.75, kind: "expense" },
    { txn_date: "2026-07-05", payee: "Scotia withdrawals", memo: "Jun5–Jul5 total (incl NCB self-transfers & charges)", amount: 65335.98,  kind: "expense" },
  ];

  let inserted = 0;
  if (ncbId) {
    for (const e of ncbExpenses) {
      const r = await createBudgetTransaction(owner, { ...e, account_id: ncbId });
      if (r.ok) inserted++;
    }
  }
  if (scoId) {
    for (const e of scoExpenses) {
      const r = await createBudgetTransaction(owner, { ...e, account_id: scoId });
      if (r.ok) inserted++;
    }
  }

  touch();
  return { ok: true as const, accounts: [ncb.ok, sco.ok].filter(Boolean).length, transactions: inserted };
}
