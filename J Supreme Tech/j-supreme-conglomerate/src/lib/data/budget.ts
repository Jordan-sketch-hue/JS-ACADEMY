import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  STARTER_CATEGORIES,
  type AccountType,
  type BillCadence,
  type BudgetAccount,
  type BudgetBill,
  type BudgetCategory,
  type BudgetGoal,
  type BudgetTransaction,
  type BudgetWorkspace,
  type CategoryKind,
  type TxnKind,
} from "@/lib/budget/compute";

export type {
  BudgetAccount,
  BudgetBill,
  BudgetCategory,
  BudgetGoal,
  BudgetTransaction,
  BudgetWorkspace,
} from "@/lib/budget/compute";

type Ok<T> = ({ ok: true } & T) | { ok: false; error: string };
type SimpleResult = { ok: true } | { ok: false; error: string };

const NO_SB = "Supabase is not configured." as const;

function num(v: unknown): number {
  if (v == null) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function str(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v);
  return s.length ? s : null;
}
function bool(v: unknown): boolean {
  return v === true || v === "true";
}

// ── Row mappers ──────────────────────────────────────────────────────────

function mapAccount(r: Record<string, unknown>): BudgetAccount {
  return {
    id: String(r.id),
    owner_clerk_id: String(r.owner_clerk_id),
    name: String(r.name ?? ""),
    type: (str(r.type) as AccountType) ?? "checking",
    institution: str(r.institution),
    starting_balance: num(r.starting_balance),
    currency: str(r.currency) ?? "USD",
    archived: bool(r.archived),
    sort_order: num(r.sort_order),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

function mapCategory(r: Record<string, unknown>): BudgetCategory {
  return {
    id: String(r.id),
    owner_clerk_id: String(r.owner_clerk_id),
    name: String(r.name ?? ""),
    group_name: String(r.group_name ?? "General"),
    kind: (str(r.kind) as CategoryKind) ?? "expense",
    monthly_limit: num(r.monthly_limit),
    color: str(r.color),
    sort_order: num(r.sort_order),
    archived: bool(r.archived),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

function mapTxn(r: Record<string, unknown>): BudgetTransaction {
  return {
    id: String(r.id),
    owner_clerk_id: String(r.owner_clerk_id),
    account_id: str(r.account_id),
    category_id: str(r.category_id),
    txn_date: String(r.txn_date).slice(0, 10),
    payee: str(r.payee),
    memo: str(r.memo),
    kind: (str(r.kind) as TxnKind) ?? "expense",
    amount: num(r.amount),
    currency: str(r.currency) ?? "USD",
    cleared: bool(r.cleared),
    transfer_account_id: str(r.transfer_account_id),
    source: str(r.source) ?? "manual",
    external_id: str(r.external_id),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

function mapGoal(r: Record<string, unknown>): BudgetGoal {
  return {
    id: String(r.id),
    owner_clerk_id: String(r.owner_clerk_id),
    name: String(r.name ?? ""),
    target_amount: num(r.target_amount),
    saved_amount: num(r.saved_amount),
    target_date: r.target_date != null ? String(r.target_date).slice(0, 10) : null,
    account_id: str(r.account_id),
    color: str(r.color),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

function mapBill(r: Record<string, unknown>): BudgetBill {
  return {
    id: String(r.id),
    owner_clerk_id: String(r.owner_clerk_id),
    name: String(r.name ?? ""),
    amount: num(r.amount),
    cadence: (str(r.cadence) as BillCadence) ?? "monthly",
    next_due_date:
      r.next_due_date != null ? String(r.next_due_date).slice(0, 10) : null,
    category_id: str(r.category_id),
    account_id: str(r.account_id),
    autopay: bool(r.autopay),
    currency: str(r.currency) ?? "USD",
    active: bool(r.active),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

function emptyWorkspace(): BudgetWorkspace {
  return {
    accounts: [],
    categories: [],
    transactions: [],
    goals: [],
    bills: [],
    baseCurrency: "USD",
  };
}

// ── Load everything ────────────────────────────────────────────────────────

export async function loadBudgetWorkspace(
  ownerClerkId: string,
): Promise<BudgetWorkspace> {
  const sb = getServiceSupabase();
  if (!sb) return emptyWorkspace();
  try {
    const [accountsRes, categoriesRes, txnsRes, goalsRes, billsRes] =
      await Promise.all([
        sb
          .from("budget_accounts")
          .select("*")
          .eq("owner_clerk_id", ownerClerkId)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        sb
          .from("budget_categories")
          .select("*")
          .eq("owner_clerk_id", ownerClerkId)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true }),
        sb
          .from("budget_transactions")
          .select("*")
          .eq("owner_clerk_id", ownerClerkId)
          .order("txn_date", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(4000),
        sb
          .from("budget_goals")
          .select("*")
          .eq("owner_clerk_id", ownerClerkId)
          .order("created_at", { ascending: true }),
        sb
          .from("budget_bills")
          .select("*")
          .eq("owner_clerk_id", ownerClerkId)
          .order("next_due_date", { ascending: true, nullsFirst: false }),
      ]);

    const accounts = (accountsRes.data ?? []).map((r) =>
      mapAccount(r as Record<string, unknown>),
    );
    const categories = (categoriesRes.data ?? []).map((r) =>
      mapCategory(r as Record<string, unknown>),
    );
    const transactions = (txnsRes.data ?? []).map((r) =>
      mapTxn(r as Record<string, unknown>),
    );
    const goals = (goalsRes.data ?? []).map((r) =>
      mapGoal(r as Record<string, unknown>),
    );
    const bills = (billsRes.data ?? []).map((r) =>
      mapBill(r as Record<string, unknown>),
    );

    return {
      accounts,
      categories,
      transactions,
      goals,
      bills,
      baseCurrency: accounts.find((a) => !a.archived)?.currency ?? "USD",
    };
  } catch {
    return emptyWorkspace();
  }
}

// ── Accounts ────────────────────────────────────────────────────────────────

export type AccountInput = {
  name: string;
  type: AccountType;
  institution?: string | null;
  starting_balance?: number;
  currency?: string;
  archived?: boolean;
};

export async function createBudgetAccount(
  owner: string,
  input: AccountInput,
): Promise<Ok<{ record: BudgetAccount }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  if (!input.name.trim()) return { ok: false, error: "Account name is required." };
  const { data: maxRow } = await sb
    .from("budget_accounts")
    .select("sort_order")
    .eq("owner_clerk_id", owner)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (num(maxRow?.sort_order) || 0) + 1;
  const { data, error } = await sb
    .from("budget_accounts")
    .insert({
      owner_clerk_id: owner,
      name: input.name.trim(),
      type: input.type,
      institution: input.institution?.trim() || null,
      starting_balance: input.starting_balance ?? 0,
      currency: (input.currency ?? "USD").toUpperCase(),
      sort_order: nextOrder,
    })
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapAccount(data as Record<string, unknown>) };
}

export async function updateBudgetAccount(
  owner: string,
  id: string,
  patch: Partial<AccountInput>,
): Promise<Ok<{ record: BudgetAccount }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name.trim();
  if (patch.type !== undefined) row.type = patch.type;
  if (patch.institution !== undefined)
    row.institution = patch.institution?.trim() || null;
  if (patch.starting_balance !== undefined)
    row.starting_balance = patch.starting_balance;
  if (patch.currency !== undefined) row.currency = patch.currency.toUpperCase();
  if (patch.archived !== undefined) row.archived = patch.archived;
  const { data, error } = await sb
    .from("budget_accounts")
    .update(row)
    .eq("id", id)
    .eq("owner_clerk_id", owner)
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapAccount(data as Record<string, unknown>) };
}

export async function deleteBudgetAccount(
  owner: string,
  id: string,
): Promise<SimpleResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const { error } = await sb
    .from("budget_accounts")
    .delete()
    .eq("id", id)
    .eq("owner_clerk_id", owner);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Categories ──────────────────────────────────────────────────────────────

export type CategoryInput = {
  name: string;
  group_name: string;
  kind: CategoryKind;
  monthly_limit?: number;
  color?: string | null;
  archived?: boolean;
};

export async function createBudgetCategory(
  owner: string,
  input: CategoryInput,
): Promise<Ok<{ record: BudgetCategory }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  if (!input.name.trim()) return { ok: false, error: "Category name is required." };
  const { data: maxRow } = await sb
    .from("budget_categories")
    .select("sort_order")
    .eq("owner_clerk_id", owner)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (num(maxRow?.sort_order) || 0) + 1;
  const { data, error } = await sb
    .from("budget_categories")
    .insert({
      owner_clerk_id: owner,
      name: input.name.trim(),
      group_name: input.group_name.trim() || "General",
      kind: input.kind,
      monthly_limit: input.monthly_limit ?? 0,
      color: input.color ?? null,
      sort_order: nextOrder,
    })
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapCategory(data as Record<string, unknown>) };
}

export async function updateBudgetCategory(
  owner: string,
  id: string,
  patch: Partial<CategoryInput>,
): Promise<Ok<{ record: BudgetCategory }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name.trim();
  if (patch.group_name !== undefined)
    row.group_name = patch.group_name.trim() || "General";
  if (patch.kind !== undefined) row.kind = patch.kind;
  if (patch.monthly_limit !== undefined) row.monthly_limit = patch.monthly_limit;
  if (patch.color !== undefined) row.color = patch.color;
  if (patch.archived !== undefined) row.archived = patch.archived;
  const { data, error } = await sb
    .from("budget_categories")
    .update(row)
    .eq("id", id)
    .eq("owner_clerk_id", owner)
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapCategory(data as Record<string, unknown>) };
}

export async function deleteBudgetCategory(
  owner: string,
  id: string,
): Promise<SimpleResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const { error } = await sb
    .from("budget_categories")
    .delete()
    .eq("id", id)
    .eq("owner_clerk_id", owner);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Transactions ──────────────────────────────────────────────────────────

export type TransactionInput = {
  account_id?: string | null;
  category_id?: string | null;
  txn_date: string;
  payee?: string | null;
  memo?: string | null;
  kind: TxnKind;
  amount: number;
  currency?: string;
  cleared?: boolean;
  transfer_account_id?: string | null;
};

export async function createBudgetTransaction(
  owner: string,
  input: TransactionInput,
): Promise<Ok<{ record: BudgetTransaction }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  if (!(input.amount > 0)) return { ok: false, error: "Amount must be greater than 0." };
  const { data, error } = await sb
    .from("budget_transactions")
    .insert({
      owner_clerk_id: owner,
      account_id: input.account_id || null,
      category_id: input.kind === "transfer" ? null : input.category_id || null,
      txn_date: input.txn_date,
      payee: input.payee?.trim() || null,
      memo: input.memo?.trim() || null,
      kind: input.kind,
      amount: input.amount,
      currency: (input.currency ?? "USD").toUpperCase(),
      cleared: input.cleared ?? true,
      transfer_account_id:
        input.kind === "transfer" ? input.transfer_account_id || null : null,
      source: "manual",
    })
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapTxn(data as Record<string, unknown>) };
}

export async function updateBudgetTransaction(
  owner: string,
  id: string,
  patch: Partial<TransactionInput>,
): Promise<Ok<{ record: BudgetTransaction }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.account_id !== undefined) row.account_id = patch.account_id || null;
  if (patch.category_id !== undefined) row.category_id = patch.category_id || null;
  if (patch.txn_date !== undefined) row.txn_date = patch.txn_date;
  if (patch.payee !== undefined) row.payee = patch.payee?.trim() || null;
  if (patch.memo !== undefined) row.memo = patch.memo?.trim() || null;
  if (patch.kind !== undefined) row.kind = patch.kind;
  if (patch.amount !== undefined) row.amount = patch.amount;
  if (patch.currency !== undefined) row.currency = patch.currency.toUpperCase();
  if (patch.cleared !== undefined) row.cleared = patch.cleared;
  if (patch.transfer_account_id !== undefined)
    row.transfer_account_id = patch.transfer_account_id || null;
  const { data, error } = await sb
    .from("budget_transactions")
    .update(row)
    .eq("id", id)
    .eq("owner_clerk_id", owner)
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapTxn(data as Record<string, unknown>) };
}

export async function deleteBudgetTransaction(
  owner: string,
  id: string,
): Promise<SimpleResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const { error } = await sb
    .from("budget_transactions")
    .delete()
    .eq("id", id)
    .eq("owner_clerk_id", owner);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Goals ──────────────────────────────────────────────────────────────────

export type GoalInput = {
  name: string;
  target_amount: number;
  saved_amount?: number;
  target_date?: string | null;
  account_id?: string | null;
  color?: string | null;
};

export async function createBudgetGoal(
  owner: string,
  input: GoalInput,
): Promise<Ok<{ record: BudgetGoal }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  if (!input.name.trim()) return { ok: false, error: "Goal name is required." };
  const { data, error } = await sb
    .from("budget_goals")
    .insert({
      owner_clerk_id: owner,
      name: input.name.trim(),
      target_amount: input.target_amount ?? 0,
      saved_amount: input.saved_amount ?? 0,
      target_date: input.target_date || null,
      account_id: input.account_id || null,
      color: input.color ?? null,
    })
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapGoal(data as Record<string, unknown>) };
}

export async function updateBudgetGoal(
  owner: string,
  id: string,
  patch: Partial<GoalInput>,
): Promise<Ok<{ record: BudgetGoal }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name.trim();
  if (patch.target_amount !== undefined) row.target_amount = patch.target_amount;
  if (patch.saved_amount !== undefined) row.saved_amount = patch.saved_amount;
  if (patch.target_date !== undefined) row.target_date = patch.target_date || null;
  if (patch.account_id !== undefined) row.account_id = patch.account_id || null;
  if (patch.color !== undefined) row.color = patch.color;
  const { data, error } = await sb
    .from("budget_goals")
    .update(row)
    .eq("id", id)
    .eq("owner_clerk_id", owner)
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapGoal(data as Record<string, unknown>) };
}

export async function deleteBudgetGoal(
  owner: string,
  id: string,
): Promise<SimpleResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const { error } = await sb
    .from("budget_goals")
    .delete()
    .eq("id", id)
    .eq("owner_clerk_id", owner);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Bills ──────────────────────────────────────────────────────────────────

export type BillInput = {
  name: string;
  amount: number;
  cadence: BillCadence;
  next_due_date?: string | null;
  category_id?: string | null;
  account_id?: string | null;
  autopay?: boolean;
  currency?: string;
  active?: boolean;
};

export async function createBudgetBill(
  owner: string,
  input: BillInput,
): Promise<Ok<{ record: BudgetBill }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  if (!input.name.trim()) return { ok: false, error: "Bill name is required." };
  const { data, error } = await sb
    .from("budget_bills")
    .insert({
      owner_clerk_id: owner,
      name: input.name.trim(),
      amount: input.amount ?? 0,
      cadence: input.cadence,
      next_due_date: input.next_due_date || null,
      category_id: input.category_id || null,
      account_id: input.account_id || null,
      autopay: input.autopay ?? false,
      currency: (input.currency ?? "USD").toUpperCase(),
      active: input.active ?? true,
    })
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapBill(data as Record<string, unknown>) };
}

export async function updateBudgetBill(
  owner: string,
  id: string,
  patch: Partial<BillInput>,
): Promise<Ok<{ record: BudgetBill }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name.trim();
  if (patch.amount !== undefined) row.amount = patch.amount;
  if (patch.cadence !== undefined) row.cadence = patch.cadence;
  if (patch.next_due_date !== undefined)
    row.next_due_date = patch.next_due_date || null;
  if (patch.category_id !== undefined) row.category_id = patch.category_id || null;
  if (patch.account_id !== undefined) row.account_id = patch.account_id || null;
  if (patch.autopay !== undefined) row.autopay = patch.autopay;
  if (patch.currency !== undefined) row.currency = patch.currency.toUpperCase();
  if (patch.active !== undefined) row.active = patch.active;
  const { data, error } = await sb
    .from("budget_bills")
    .update(row)
    .eq("id", id)
    .eq("owner_clerk_id", owner)
    .select("*")
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, record: mapBill(data as Record<string, unknown>) };
}

export async function deleteBudgetBill(
  owner: string,
  id: string,
): Promise<SimpleResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  const { error } = await sb
    .from("budget_bills")
    .delete()
    .eq("id", id)
    .eq("owner_clerk_id", owner);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// ── Starter seed ────────────────────────────────────────────────────────────

export async function seedStarterBudget(
  owner: string,
): Promise<Ok<{ seeded: boolean }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };

  const { count } = await sb
    .from("budget_categories")
    .select("id", { count: "exact", head: true })
    .eq("owner_clerk_id", owner);
  if ((count ?? 0) > 0) return { ok: true, seeded: false };

  const categoryRows = STARTER_CATEGORIES.map((c, i) => ({
    owner_clerk_id: owner,
    name: c.name,
    group_name: c.group_name,
    kind: c.kind,
    monthly_limit: c.monthly_limit,
    sort_order: i + 1,
  }));
  const { error: catErr } = await sb
    .from("budget_categories")
    .insert(categoryRows);
  if (catErr) return { ok: false, error: catErr.message };

  const { count: acctCount } = await sb
    .from("budget_accounts")
    .select("id", { count: "exact", head: true })
    .eq("owner_clerk_id", owner);
  if ((acctCount ?? 0) === 0) {
    const { error: acctErr } = await sb.from("budget_accounts").insert({
      owner_clerk_id: owner,
      name: "Operating Cash",
      type: "checking",
      starting_balance: 0,
      currency: "USD",
      sort_order: 1,
    });
    if (acctErr) return { ok: false, error: acctErr.message };
  }

  return { ok: true, seeded: true };
}

// ── Import paid invoices as income ──────────────────────────────────────────

export async function importPaidInvoicesAsIncome(
  owner: string,
): Promise<Ok<{ imported: number }>> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };

  const { data: invRows, error: invErr } = await sb
    .from("invoices")
    .select(
      "id, number, amount, currency, status, issued_at, paid_at, created_at, company_name, client_id",
    )
    .eq("owner_clerk_id", owner)
    .eq("status", "paid");
  if (invErr) return { ok: false, error: invErr.message };
  const paid = invRows ?? [];
  if (!paid.length) return { ok: true, imported: 0 };

  const [{ data: existing }, { data: accts }, { data: cats }, { data: clientRows }] =
    await Promise.all([
      sb
        .from("budget_transactions")
        .select("external_id")
        .eq("owner_clerk_id", owner)
        .eq("source", "invoice"),
      sb
        .from("budget_accounts")
        .select("id")
        .eq("owner_clerk_id", owner)
        .eq("archived", false)
        .order("sort_order", { ascending: true })
        .limit(1),
      sb
        .from("budget_categories")
        .select("id")
        .eq("owner_clerk_id", owner)
        .eq("kind", "income")
        .order("sort_order", { ascending: true })
        .limit(1),
      sb.from("clients").select("id, business_name").eq("owner_clerk_id", owner),
    ]);

  const seen = new Set(
    (existing ?? []).map((r) => String((r as Record<string, unknown>).external_id)),
  );
  const accountId = (accts?.[0] as Record<string, unknown> | undefined)?.id
    ? String((accts![0] as Record<string, unknown>).id)
    : null;
  const categoryId = (cats?.[0] as Record<string, unknown> | undefined)?.id
    ? String((cats![0] as Record<string, unknown>).id)
    : null;
  const nameById = new Map(
    (clientRows ?? []).map((c) => {
      const o = c as Record<string, unknown>;
      return [String(o.id), String(o.business_name)] as const;
    }),
  );
  const today = new Date().toISOString().slice(0, 10);

  const rows = paid
    .map((r) => r as Record<string, unknown>)
    .filter((inv) => !seen.has(String(inv.id)))
    .map((inv) => {
      const clientId = inv.client_id != null ? String(inv.client_id) : null;
      const payee =
        (clientId ? nameById.get(clientId) : null) ??
        (inv.company_name ? String(inv.company_name) : null) ??
        `Invoice ${inv.number}`;
      const dateSrc =
        (inv.paid_at as string | null) ??
        (inv.issued_at as string | null) ??
        (inv.created_at as string | null);
      return {
        owner_clerk_id: owner,
        account_id: accountId,
        category_id: categoryId,
        txn_date: dateSrc ? String(dateSrc).slice(0, 10) : today,
        payee,
        memo: `Invoice ${inv.number}`,
        kind: "income" as const,
        amount: num(inv.amount),
        currency: inv.currency ? String(inv.currency).toUpperCase() : "USD",
        cleared: true,
        source: "invoice",
        external_id: String(inv.id),
      };
    });

  if (!rows.length) return { ok: true, imported: 0 };
  const { error } = await sb.from("budget_transactions").insert(rows);
  if (error) return { ok: false, error: error.message };
  return { ok: true, imported: rows.length };
}
