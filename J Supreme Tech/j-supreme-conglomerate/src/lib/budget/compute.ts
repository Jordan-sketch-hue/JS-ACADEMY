// Client-safe budgeting types + pure computation helpers.
// No server / Supabase imports here so this can be used in client components.

export type AccountType =
  | "checking"
  | "savings"
  | "cash"
  | "credit_card"
  | "investment"
  | "loan"
  | "other";

export type CategoryKind = "expense" | "income";
export type TxnKind = "income" | "expense" | "transfer";
export type BillCadence =
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "cash", label: "Cash" },
  { value: "credit_card", label: "Credit card" },
  { value: "investment", label: "Investment" },
  { value: "loan", label: "Loan" },
  { value: "other", label: "Other" },
];

/** Account types that represent money owed (shown as negative liabilities). */
export const LIABILITY_TYPES: AccountType[] = ["credit_card", "loan"];

export const BILL_CADENCES: { value: BillCadence; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export type BudgetAccount = {
  id: string;
  owner_clerk_id: string;
  name: string;
  type: AccountType;
  institution: string | null;
  starting_balance: number;
  currency: string;
  archived: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BudgetCategory = {
  id: string;
  owner_clerk_id: string;
  name: string;
  group_name: string;
  kind: CategoryKind;
  monthly_limit: number;
  color: string | null;
  sort_order: number;
  archived: boolean;
  created_at: string;
  updated_at: string;
};

export type BudgetTransaction = {
  id: string;
  owner_clerk_id: string;
  account_id: string | null;
  category_id: string | null;
  txn_date: string; // YYYY-MM-DD
  payee: string | null;
  memo: string | null;
  kind: TxnKind;
  amount: number; // always positive; sign derived from kind
  currency: string;
  cleared: boolean;
  transfer_account_id: string | null;
  source: string; // manual | invoice
  external_id: string | null;
  created_at: string;
  updated_at: string;
};

export type BudgetGoal = {
  id: string;
  owner_clerk_id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date: string | null;
  account_id: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
};

export type BudgetBill = {
  id: string;
  owner_clerk_id: string;
  name: string;
  amount: number;
  cadence: BillCadence;
  next_due_date: string | null;
  category_id: string | null;
  account_id: string | null;
  autopay: boolean;
  currency: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type BudgetWorkspace = {
  accounts: BudgetAccount[];
  categories: BudgetCategory[];
  transactions: BudgetTransaction[];
  goals: BudgetGoal[];
  bills: BudgetBill[];
  /** Currency used for default labels (first account or USD). */
  baseCurrency: string;
};

// ─────────────────────────────────────────────────────────────────────────
// Month helpers (month keys are "YYYY-MM")
// ─────────────────────────────────────────────────────────────────────────

export function monthKeyOf(dateIso: string): string {
  return String(dateIso).slice(0, 7);
}

export function currentMonthKey(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

export function shiftMonthKey(key: string, delta: number): string {
  const [y, m] = key.split("-").map((n) => Number.parseInt(n, 10));
  const base = new Date(y, (m - 1) + delta, 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}`;
}

export function monthLabel(key: string): string {
  const [y, m] = key.split("-").map((n) => Number.parseInt(n, 10));
  if (!y || !m) return key;
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

export function shortMonthLabel(key: string): string {
  const [y, m] = key.split("-").map((n) => Number.parseInt(n, 10));
  if (!y || !m) return key;
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Balances & net worth
// ─────────────────────────────────────────────────────────────────────────

export function accountBalance(
  account: BudgetAccount,
  transactions: BudgetTransaction[],
): number {
  let bal = account.starting_balance;
  for (const t of transactions) {
    if (t.kind === "transfer") {
      if (t.account_id === account.id) bal -= t.amount;
      if (t.transfer_account_id === account.id) bal += t.amount;
      continue;
    }
    if (t.account_id !== account.id) continue;
    if (t.kind === "income") bal += t.amount;
    else bal -= t.amount;
  }
  return round2(bal);
}

export function netWorth(
  accounts: BudgetAccount[],
  transactions: BudgetTransaction[],
): number {
  return round2(
    accounts
      .filter((a) => !a.archived)
      .reduce((sum, a) => sum + accountBalance(a, transactions), 0),
  );
}

export type MonthSummary = {
  income: number;
  expense: number;
  net: number;
};

export function monthSummary(
  transactions: BudgetTransaction[],
  monthKey: string,
): MonthSummary {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.kind === "transfer") continue;
    if (monthKeyOf(t.txn_date) !== monthKey) continue;
    if (t.kind === "income") income += t.amount;
    else expense += t.amount;
  }
  return {
    income: round2(income),
    expense: round2(expense),
    net: round2(income - expense),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Budget table (budgeted vs spent vs remaining, grouped)
// ─────────────────────────────────────────────────────────────────────────

export type BudgetCategoryRow = {
  category: BudgetCategory;
  budgeted: number;
  activity: number; // spent (expense) or received (income) this month
  remaining: number;
  pct: number; // 0..1 of budgeted used
};

export type BudgetGroupRow = {
  group: string;
  rows: BudgetCategoryRow[];
  budgeted: number;
  activity: number;
  remaining: number;
};

export function categoryActivity(
  transactions: BudgetTransaction[],
  categoryId: string,
  monthKey: string,
): number {
  let total = 0;
  for (const t of transactions) {
    if (t.kind === "transfer") continue;
    if (t.category_id !== categoryId) continue;
    if (monthKeyOf(t.txn_date) !== monthKey) continue;
    total += t.amount;
  }
  return round2(total);
}

export function buildBudgetGroups(
  categories: BudgetCategory[],
  transactions: BudgetTransaction[],
  monthKey: string,
): BudgetGroupRow[] {
  const active = categories
    .filter((c) => !c.archived && c.kind === "expense")
    .sort(
      (a, b) =>
        a.group_name.localeCompare(b.group_name) || a.sort_order - b.sort_order,
    );

  const groups = new Map<string, BudgetCategoryRow[]>();
  for (const category of active) {
    const budgeted = category.monthly_limit;
    const activity = categoryActivity(transactions, category.id, monthKey);
    const remaining = round2(budgeted - activity);
    const pct = budgeted > 0 ? activity / budgeted : activity > 0 ? 1 : 0;
    const row: BudgetCategoryRow = {
      category,
      budgeted,
      activity,
      remaining,
      pct,
    };
    const list = groups.get(category.group_name) ?? [];
    list.push(row);
    groups.set(category.group_name, list);
  }

  return Array.from(groups.entries()).map(([group, rows]) => ({
    group,
    rows,
    budgeted: round2(rows.reduce((s, r) => s + r.budgeted, 0)),
    activity: round2(rows.reduce((s, r) => s + r.activity, 0)),
    remaining: round2(rows.reduce((s, r) => s + r.remaining, 0)),
  }));
}

export type BudgetMonthTotals = {
  budgeted: number;
  spent: number;
  remaining: number;
  income: number;
  leftToBudget: number;
};

export function budgetMonthTotals(
  categories: BudgetCategory[],
  transactions: BudgetTransaction[],
  monthKey: string,
): BudgetMonthTotals {
  const budgeted = round2(
    categories
      .filter((c) => !c.archived && c.kind === "expense")
      .reduce((s, c) => s + c.monthly_limit, 0),
  );
  const summary = monthSummary(transactions, monthKey);
  return {
    budgeted,
    spent: summary.expense,
    remaining: round2(budgeted - summary.expense),
    income: summary.income,
    leftToBudget: round2(summary.income - budgeted),
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Charts
// ─────────────────────────────────────────────────────────────────────────

export type CashFlowPoint = {
  key: string;
  label: string;
  income: number;
  expense: number;
  net: number;
};

export function cashFlowSeries(
  transactions: BudgetTransaction[],
  endMonthKey: string,
  monthsBack = 6,
): CashFlowPoint[] {
  const out: CashFlowPoint[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const key = shiftMonthKey(endMonthKey, -i);
    const s = monthSummary(transactions, key);
    out.push({
      key,
      label: shortMonthLabel(key),
      income: s.income,
      expense: s.expense,
      net: s.net,
    });
  }
  return out;
}

export type CategorySlice = { name: string; value: number; color: string };

const SLICE_PALETTE = [
  "#6366f1",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#3b82f6",
  "#84cc16",
  "#64748b",
];

export function spendingByCategory(
  categories: BudgetCategory[],
  transactions: BudgetTransaction[],
  monthKey: string,
): CategorySlice[] {
  const byCat = new Map<string, number>();
  for (const t of transactions) {
    if (t.kind !== "expense") continue;
    if (monthKeyOf(t.txn_date) !== monthKey) continue;
    const key = t.category_id ?? "__uncategorized__";
    byCat.set(key, (byCat.get(key) ?? 0) + t.amount);
  }
  const nameOf = (id: string) =>
    id === "__uncategorized__"
      ? "Uncategorized"
      : categories.find((c) => c.id === id)?.name ?? "Uncategorized";

  return Array.from(byCat.entries())
    .map(([id, value]) => ({ id, value: round2(value) }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((s, i) => ({
      name: nameOf(s.id),
      value: s.value,
      color: SLICE_PALETTE[i % SLICE_PALETTE.length],
    }));
}

// ─────────────────────────────────────────────────────────────────────────
// Goals & bills
// ─────────────────────────────────────────────────────────────────────────

export function goalPct(goal: BudgetGoal): number {
  if (goal.target_amount <= 0) return 0;
  return Math.min(1, Math.max(0, goal.saved_amount / goal.target_amount));
}

export function daysUntil(dateIso: string | null, now: Date = new Date()): number | null {
  if (!dateIso) return null;
  const d = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((d.getTime() - start.getTime()) / 86_400_000);
}

export function advanceBillDate(dateIso: string, cadence: BillCadence): string {
  const d = new Date(`${dateIso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dateIso;
  switch (cadence) {
    case "weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "biweekly":
      d.setDate(d.getDate() + 14);
      break;
    case "monthly":
      d.setMonth(d.getMonth() + 1);
      break;
    case "quarterly":
      d.setMonth(d.getMonth() + 3);
      break;
    case "yearly":
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Approximate monthly cost of a bill regardless of cadence — for the "monthly commitments" KPI. */
export function billMonthlyEquivalent(bill: BudgetBill): number {
  switch (bill.cadence) {
    case "weekly":
      return round2((bill.amount * 52) / 12);
    case "biweekly":
      return round2((bill.amount * 26) / 12);
    case "monthly":
      return bill.amount;
    case "quarterly":
      return round2(bill.amount / 3);
    case "yearly":
      return round2(bill.amount / 12);
    default:
      return bill.amount;
  }
}

export function round2(n: number): number {
  return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

// ─────────────────────────────────────────────────────────────────────────
// Starter seed (blended business + personal)
// ─────────────────────────────────────────────────────────────────────────

export type StarterCategory = {
  name: string;
  group_name: string;
  kind: CategoryKind;
  monthly_limit: number;
};

// Categories seed a clean structure only — every limit starts at 0 so the
// owner sets their own real numbers. No demo/placeholder amounts.
export const STARTER_CATEGORIES: StarterCategory[] = [
  // Income
  { name: "Client Revenue", group_name: "Income", kind: "income", monthly_limit: 0 },
  { name: "Other Income", group_name: "Income", kind: "income", monthly_limit: 0 },
  // Business
  { name: "Software & SaaS", group_name: "Business", kind: "expense", monthly_limit: 0 },
  { name: "Marketing & Ads", group_name: "Business", kind: "expense", monthly_limit: 0 },
  { name: "Contractors", group_name: "Business", kind: "expense", monthly_limit: 0 },
  { name: "Equipment", group_name: "Business", kind: "expense", monthly_limit: 0 },
  { name: "Taxes Set-aside", group_name: "Business", kind: "expense", monthly_limit: 0 },
  // Living
  { name: "Rent / Mortgage", group_name: "Living", kind: "expense", monthly_limit: 0 },
  { name: "Utilities", group_name: "Living", kind: "expense", monthly_limit: 0 },
  { name: "Groceries", group_name: "Living", kind: "expense", monthly_limit: 0 },
  { name: "Transport", group_name: "Living", kind: "expense", monthly_limit: 0 },
  // Lifestyle
  { name: "Dining & Takeout", group_name: "Lifestyle", kind: "expense", monthly_limit: 0 },
  { name: "Subscriptions", group_name: "Lifestyle", kind: "expense", monthly_limit: 0 },
  { name: "Fun & Leisure", group_name: "Lifestyle", kind: "expense", monthly_limit: 0 },
  // Savings
  { name: "Emergency Fund", group_name: "Savings", kind: "expense", monthly_limit: 0 },
  { name: "Investments", group_name: "Savings", kind: "expense", monthly_limit: 0 },
];
