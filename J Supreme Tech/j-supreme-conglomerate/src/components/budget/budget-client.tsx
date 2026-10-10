"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  ACCOUNT_TYPES,
  BILL_CADENCES,
  LIABILITY_TYPES,
  advanceBillDate,
  accountBalance,
  billMonthlyEquivalent,
  buildBudgetGroups,
  budgetMonthTotals,
  cashFlowSeries,
  currentMonthKey,
  daysUntil,
  goalPct,
  monthLabel,
  monthSummary,
  netWorth,
  shiftMonthKey,
  spendingByCategory,
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
import {
  createAccountAction,
  createBillAction,
  createCategoryAction,
  createGoalAction,
  createTransactionAction,
  deleteAccountAction,
  deleteBillAction,
  deleteCategoryAction,
  deleteGoalAction,
  deleteTransactionAction,
  importPaidInvoicesAction,
  loadBudgetWorkspaceAction,
  seedStarterBudgetAction,
  seedStatementBudgetAction,
  updateAccountAction,
  updateBillAction,
  updateCategoryAction,
  updateGoalAction,
  updateTransactionAction,
} from "@/app/(app)/budget/actions";
import { CashFlowChart } from "@/components/budget/cash-flow-chart";
import { SpendingDonut } from "@/components/budget/spending-donut";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatCurrencyAmount } from "@/lib/utils";
import {
  ArrowLeftRight,
  Banknote,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Download,
  Landmark,
  LayoutGrid,
  Pencil,
  PiggyBank,
  Plus,
  Receipt,
  Sparkles,
  Target,
  Trash2,
  Wallet,
} from "lucide-react";

// ── small utils ─────────────────────────────────────────────────────────────

const NONE = "__none__";
const ALL = "__all__";

function parseMoney(s: string): number {
  const n = Number.parseFloat(String(s).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

type TabKey =
  | "overview"
  | "budget"
  | "transactions"
  | "accounts"
  | "goals"
  | "bills";

const TABS: { key: TabKey; label: string; icon: typeof Wallet }[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "budget", label: "Budget", icon: Wallet },
  { key: "transactions", label: "Transactions", icon: Receipt },
  { key: "accounts", label: "Accounts", icon: Landmark },
  { key: "goals", label: "Goals", icon: Target },
  { key: "bills", label: "Bills", icon: CalendarClock },
];

// ── presentational ───────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "negative";
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/30 p-5">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-[1.7rem] font-semibold leading-none tabular-nums",
          tone === "positive" && "text-emerald-600 dark:text-emerald-400",
          tone === "negative" && "text-rose-600 dark:text-rose-400",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/50 bg-card/30 p-5",
        className,
      )}
    >
      {title || action ? (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title ? (
            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(1, pct));
  const tone =
    pct > 1
      ? "bg-rose-500"
      : pct >= 0.85
        ? "bg-amber-500"
        : "bg-emerald-500";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-all", tone)}
        style={{ width: `${clamped * 100}%` }}
      />
    </div>
  );
}

function LimitInput({
  value,
  onCommit,
  disabled,
}: {
  value: number;
  onCommit: (n: number) => void;
  disabled?: boolean;
}) {
  const [v, setV] = useState(value ? String(value) : "");
  useEffect(() => {
    setV(value ? String(value) : "");
  }, [value]);
  const commit = () => {
    const n = parseMoney(v);
    if (n !== value) onCommit(n);
  };
  return (
    <input
      inputMode="decimal"
      disabled={disabled}
      value={v}
      placeholder="0"
      onChange={(e) => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
      className="h-8 w-24 rounded-md border border-border/60 bg-background/60 px-2 text-right text-sm tabular-nums outline-none focus:border-primary/60 disabled:opacity-50"
    />
  );
}

function accountTypeLabel(t: AccountType): string {
  return ACCOUNT_TYPES.find((a) => a.value === t)?.label ?? t;
}

// ── Account dialog ────────────────────────────────────────────────────────────

function AccountDialog({
  open,
  editing,
  baseCurrency,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  editing: BudgetAccount | null;
  baseCurrency: string;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType>("checking");
  const [institution, setInstitution] = useState("");
  const [startingBalance, setStartingBalance] = useState("");
  const [currency, setCurrency] = useState(baseCurrency);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setName(editing?.name ?? "");
    setType(editing?.type ?? "checking");
    setInstitution(editing?.institution ?? "");
    setStartingBalance(
      editing && editing.starting_balance !== 0
        ? String(editing.starting_balance)
        : "",
    );
    setCurrency(editing?.currency ?? baseCurrency);
  }, [open, editing, baseCurrency]);

  const submit = () => {
    setError(null);
    if (!name.trim()) {
      setError("Account name is required.");
      return;
    }
    const input = {
      name: name.trim(),
      type,
      institution: institution.trim() || null,
      starting_balance: parseMoney(startingBalance),
      currency,
    };
    start(async () => {
      const res = editing
        ? await updateAccountAction(editing.id, input)
        : await createAccountAction(input);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onSaved();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit account" : "Add account"}</DialogTitle>
          <DialogDescription>
            Track balances across cash, bank, credit and investment accounts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="acct-name">Account name</Label>
            <Input
              id="acct-name"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Business Checking"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as AccountType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acct-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="acct-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="JMD">JMD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="acct-inst">Institution</Label>
              <Input
                id="acct-inst"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acct-bal">Current balance</Label>
              <Input
                id="acct-bal"
                inputMode="decimal"
                value={startingBalance}
                onChange={(e) => setStartingBalance(e.target.value)}
                placeholder="0.00"
              />
              {LIABILITY_TYPES.includes(type) ? (
                <p className="text-[11px] text-muted-foreground">
                  For what you owe, enter a negative number (e.g. -1200).
                </p>
              ) : null}
            </div>
          </div>
          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : editing ? "Save" : "Add account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Category dialog ──────────────────────────────────────────────────────────

function CategoryDialog({
  open,
  editing,
  groups,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  editing: BudgetCategory | null;
  groups: string[];
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [kind, setKind] = useState<CategoryKind>("expense");
  const [limit, setLimit] = useState("");

  useEffect(() => {
    if (!open) return;
    setError(null);
    setName(editing?.name ?? "");
    setGroup(editing?.group_name ?? groups[0] ?? "General");
    setKind(editing?.kind ?? "expense");
    setLimit(editing && editing.monthly_limit !== 0 ? String(editing.monthly_limit) : "");
  }, [open, editing, groups]);

  const submit = () => {
    setError(null);
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    const input = {
      name: name.trim(),
      group_name: group.trim() || "General",
      kind,
      monthly_limit: kind === "income" ? 0 : parseMoney(limit),
    };
    start(async () => {
      const res = editing
        ? await updateCategoryAction(editing.id, input)
        : await createCategoryAction(input);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onSaved();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>
            Group categories (e.g. Business, Living) and set a monthly limit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cat-name">Category name</Label>
            <Input
              id="cat-name"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Software & SaaS"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cat-group">Group</Label>
              <Input
                id="cat-group"
                value={group}
                list="budget-groups"
                onChange={(e) => setGroup(e.target.value)}
                placeholder="e.g. Business"
              />
              <datalist id="budget-groups">
                {groups.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as CategoryKind)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {kind === "expense" ? (
            <div className="space-y-2">
              <Label htmlFor="cat-limit">Monthly limit</Label>
              <Input
                id="cat-limit"
                inputMode="decimal"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="0.00"
              />
            </div>
          ) : null}
          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : editing ? "Save" : "Add category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Transaction dialog ────────────────────────────────────────────────────────

function TransactionDialog({
  open,
  editing,
  accounts,
  categories,
  baseCurrency,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  editing: BudgetTransaction | null;
  accounts: BudgetAccount[];
  categories: BudgetCategory[];
  baseCurrency: string;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<TxnKind>("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayStr());
  const [payee, setPayee] = useState("");
  const [memo, setMemo] = useState("");
  const [accountId, setAccountId] = useState<string>(NONE);
  const [toAccountId, setToAccountId] = useState<string>(NONE);
  const [categoryId, setCategoryId] = useState<string>(NONE);
  const [currency, setCurrency] = useState(baseCurrency);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setKind(editing?.kind ?? "expense");
    setAmount(editing ? String(editing.amount) : "");
    setDate(editing?.txn_date ?? todayStr());
    setPayee(editing?.payee ?? "");
    setMemo(editing?.memo ?? "");
    setAccountId(editing?.account_id ?? accounts[0]?.id ?? NONE);
    setToAccountId(editing?.transfer_account_id ?? NONE);
    setCategoryId(editing?.category_id ?? NONE);
    setCurrency(editing?.currency ?? baseCurrency);
  }, [open, editing, accounts, baseCurrency]);

  const relevantCategories = categories.filter(
    (c) => !c.archived && (kind === "income" ? c.kind === "income" : c.kind === "expense"),
  );

  const submit = () => {
    setError(null);
    const amt = parseMoney(amount);
    if (!(amt > 0)) {
      setError("Enter an amount greater than 0.");
      return;
    }
    if (kind === "transfer" && (accountId === NONE || toAccountId === NONE)) {
      setError("Pick both accounts for a transfer.");
      return;
    }
    if (kind === "transfer" && accountId === toAccountId) {
      setError("Transfer accounts must differ.");
      return;
    }
    const input = {
      kind,
      amount: amt,
      txn_date: date || todayStr(),
      payee: payee.trim() || null,
      memo: memo.trim() || null,
      account_id: accountId === NONE ? null : accountId,
      transfer_account_id:
        kind === "transfer" ? (toAccountId === NONE ? null : toAccountId) : null,
      category_id: kind === "transfer" || categoryId === NONE ? null : categoryId,
      currency,
    };
    start(async () => {
      const res = editing
        ? await updateTransactionAction(editing.id, input)
        : await createTransactionAction(input);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onSaved();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit transaction" : "Add transaction"}
          </DialogTitle>
          <DialogDescription>
            Record income, an expense, or a transfer between accounts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {(["expense", "income", "transfer"] as TxnKind[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  "rounded-md border px-2 py-1.5 text-sm capitalize transition",
                  kind === k
                    ? "border-primary/60 bg-primary/10 font-medium text-primary"
                    : "border-border/60 text-muted-foreground hover:bg-muted/40",
                )}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="txn-amount">Amount</Label>
              <Input
                id="txn-amount"
                inputMode="decimal"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="txn-date">Date</Label>
              <Input
                id="txn-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {kind === "transfer" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>From account</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To account</Label>
                <Select value={toAccountId} onValueChange={setToAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Account</Label>
                <Select value={accountId} onValueChange={setAccountId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>No account</SelectItem>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Uncategorized</SelectItem>
                    {relevantCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.group_name} · {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="txn-payee">Payee</Label>
            <Input
              id="txn-payee"
              value={payee}
              onChange={(e) => setPayee(e.target.value)}
              placeholder={kind === "income" ? "Who paid you" : "Who you paid"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="txn-memo">Memo</Label>
            <Textarea
              id="txn-memo"
              rows={2}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Optional note"
            />
          </div>
          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : editing ? "Save" : "Add transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Goal dialog ──────────────────────────────────────────────────────────────

function GoalDialog({
  open,
  editing,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  editing: BudgetGoal | null;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [targetDate, setTargetDate] = useState("");

  useEffect(() => {
    if (!open) return;
    setError(null);
    setName(editing?.name ?? "");
    setTarget(editing ? String(editing.target_amount) : "");
    setSaved(editing && editing.saved_amount !== 0 ? String(editing.saved_amount) : "");
    setTargetDate(editing?.target_date ?? "");
  }, [open, editing]);

  const submit = () => {
    setError(null);
    if (!name.trim()) {
      setError("Goal name is required.");
      return;
    }
    const input = {
      name: name.trim(),
      target_amount: parseMoney(target),
      saved_amount: parseMoney(saved),
      target_date: targetDate || null,
    };
    start(async () => {
      const res = editing
        ? await updateGoalAction(editing.id, input)
        : await createGoalAction(input);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onSaved();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit goal" : "Add savings goal"}</DialogTitle>
          <DialogDescription>
            Set a target and track how close you are.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal name</Label>
            <Input
              id="goal-name"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emergency fund"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="goal-target">Target amount</Label>
              <Input
                id="goal-target"
                inputMode="decimal"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-saved">Saved so far</Label>
              <Input
                id="goal-saved"
                inputMode="decimal"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-date">Target date</Label>
            <Input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : editing ? "Save" : "Add goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Bill dialog ──────────────────────────────────────────────────────────────

function BillDialog({
  open,
  editing,
  categories,
  accounts,
  baseCurrency,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  editing: BudgetBill | null;
  categories: BudgetCategory[];
  accounts: BudgetAccount[];
  baseCurrency: string;
  onOpenChange: (o: boolean) => void;
  onSaved: () => void;
}) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [cadence, setCadence] = useState<BillCadence>("monthly");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState<string>(NONE);
  const [accountId, setAccountId] = useState<string>(NONE);
  const [autopay, setAutopay] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setName(editing?.name ?? "");
    setAmount(editing ? String(editing.amount) : "");
    setCadence(editing?.cadence ?? "monthly");
    setDueDate(editing?.next_due_date ?? "");
    setCategoryId(editing?.category_id ?? NONE);
    setAccountId(editing?.account_id ?? NONE);
    setAutopay(editing?.autopay ?? false);
  }, [open, editing]);

  const submit = () => {
    setError(null);
    if (!name.trim()) {
      setError("Bill name is required.");
      return;
    }
    const input = {
      name: name.trim(),
      amount: parseMoney(amount),
      cadence,
      next_due_date: dueDate || null,
      category_id: categoryId === NONE ? null : categoryId,
      account_id: accountId === NONE ? null : accountId,
      autopay,
      currency: baseCurrency,
    };
    start(async () => {
      const res = editing
        ? await updateBillAction(editing.id, input)
        : await createBillAction(input);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      onSaved();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit bill" : "Add recurring bill"}</DialogTitle>
          <DialogDescription>
            Track subscriptions and recurring bills with their next due date.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bill-name">Bill name</Label>
            <Input
              id="bill-name"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Adobe Creative Cloud"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bill-amount">Amount</Label>
              <Input
                id="bill-amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Cadence</Label>
              <Select value={cadence} onValueChange={(v) => setCadence(v as BillCadence)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BILL_CADENCES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="bill-due">Next due date</Label>
              <Input
                id="bill-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>None</SelectItem>
                  {categories
                    .filter((c) => !c.archived && c.kind === "expense")
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.group_name} · {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pay from</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Account" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>None</SelectItem>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <label className="flex cursor-pointer items-center gap-2 pt-7">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={autopay}
                onChange={(e) => setAutopay(e.target.checked)}
              />
              <span className="text-sm">Autopay enabled</span>
            </label>
          </div>
          {error ? (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : editing ? "Save" : "Add bill"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main client ──────────────────────────────────────────────────────────────

export function BudgetClient({
  initialWorkspace,
}: {
  initialWorkspace: BudgetWorkspace;
}) {
  const [workspace, setWorkspace] = useState<BudgetWorkspace>(initialWorkspace);
  const [tab, setTab] = useState<TabKey>("overview");
  const [monthKey, setMonthKey] = useState<string>(currentMonthKey());
  const [isPending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);

  // dialog state
  const [acctDialog, setAcctDialog] = useState<{ open: boolean; editing: BudgetAccount | null }>({ open: false, editing: null });
  const [catDialog, setCatDialog] = useState<{ open: boolean; editing: BudgetCategory | null }>({ open: false, editing: null });
  const [txnDialog, setTxnDialog] = useState<{ open: boolean; editing: BudgetTransaction | null }>({ open: false, editing: null });
  const [goalDialog, setGoalDialog] = useState<{ open: boolean; editing: BudgetGoal | null }>({ open: false, editing: null });
  const [billDialog, setBillDialog] = useState<{ open: boolean; editing: BudgetBill | null }>({ open: false, editing: null });

  // transaction filters
  const [filterAccount, setFilterAccount] = useState<string>(ALL);
  const [filterCategory, setFilterCategory] = useState<string>(ALL);
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    startTransition(async () => {
      const ws = await loadBudgetWorkspaceAction();
      setWorkspace(ws);
    });
  }, []);

  const { accounts, categories, transactions, goals, bills, baseCurrency } = workspace;

  const isEmpty =
    accounts.length === 0 &&
    categories.length === 0 &&
    transactions.length === 0 &&
    goals.length === 0 &&
    bills.length === 0;

  const accountName = useCallback(
    (id: string | null) => (id ? accounts.find((a) => a.id === id)?.name ?? "—" : "—"),
    [accounts],
  );
  const categoryName = useCallback(
    (id: string | null) =>
      id ? categories.find((c) => c.id === id)?.name ?? "Uncategorized" : "Uncategorized",
    [categories],
  );

  const groups = useMemo(
    () => Array.from(new Set(categories.map((c) => c.group_name))).sort(),
    [categories],
  );

  // computed views
  const nw = useMemo(() => netWorth(accounts, transactions), [accounts, transactions]);
  const summary = useMemo(() => monthSummary(transactions, monthKey), [transactions, monthKey]);
  const totals = useMemo(
    () => budgetMonthTotals(categories, transactions, monthKey),
    [categories, transactions, monthKey],
  );
  const cashFlow = useMemo(
    () => cashFlowSeries(transactions, monthKey, 6),
    [transactions, monthKey],
  );
  const donut = useMemo(
    () => spendingByCategory(categories, transactions, monthKey),
    [categories, transactions, monthKey],
  );
  const budgetGroups = useMemo(
    () => buildBudgetGroups(categories, transactions, monthKey),
    [categories, transactions, monthKey],
  );

  const filteredTxns = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      if (filterAccount !== ALL && t.account_id !== filterAccount && t.transfer_account_id !== filterAccount)
        return false;
      if (filterCategory !== ALL) {
        if (filterCategory === NONE) {
          if (t.category_id) return false;
        } else if (t.category_id !== filterCategory) return false;
      }
      if (q) {
        const hay = `${t.payee ?? ""} ${t.memo ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [transactions, filterAccount, filterCategory, search]);

  const upcomingBills = useMemo(
    () =>
      [...bills]
        .filter((b) => b.active)
        .sort((a, b) => (a.next_due_date ?? "9999").localeCompare(b.next_due_date ?? "9999")),
    [bills],
  );
  const monthlyCommitments = useMemo(
    () => bills.filter((b) => b.active).reduce((s, b) => s + billMonthlyEquivalent(b), 0),
    [bills],
  );

  // actions
  const onSeed = () => {
    startTransition(async () => {
      const res = await seedStarterBudgetAction();
      if (res.ok) {
        setNotice("Starter budget created.");
        const ws = await loadBudgetWorkspaceAction();
        setWorkspace(ws);
      } else {
        setNotice(res.error);
      }
    });
  };
  const onImportInvoices = () => {
    startTransition(async () => {
      const res = await importPaidInvoicesAction();
      if (res.ok) {
        setNotice(
          res.imported > 0
            ? `Imported ${res.imported} paid invoice${res.imported === 1 ? "" : "s"} as income.`
            : "No new paid invoices to import.",
        );
        const ws = await loadBudgetWorkspaceAction();
        setWorkspace(ws);
      } else {
        setNotice(res.error);
      }
    });
  };

  const del = (label: string, fn: () => Promise<{ ok: boolean; error?: string }>) => {
    if (!window.confirm(`Delete this ${label}? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setNotice(res.error ?? "Delete failed.");
      const ws = await loadBudgetWorkspaceAction();
      setWorkspace(ws);
    });
  };

  const markBillPaid = (bill: BudgetBill) => {
    startTransition(async () => {
      if (bill.amount > 0) {
        await createTransactionAction({
          kind: "expense",
          amount: bill.amount,
          txn_date: todayStr(),
          payee: bill.name,
          memo: "Recurring bill",
          account_id: bill.account_id,
          category_id: bill.category_id,
          currency: bill.currency,
        });
      }
      if (bill.next_due_date) {
        await updateBillAction(bill.id, {
          next_due_date: advanceBillDate(bill.next_due_date, bill.cadence),
        });
      }
      setNotice(`Logged "${bill.name}" as paid.`);
      const ws = await loadBudgetWorkspaceAction();
      setWorkspace(ws);
    });
  };

  const contributeToGoal = (goal: BudgetGoal) => {
    const raw = window.prompt(`Add to "${goal.name}" — amount:`, "");
    if (raw == null) return;
    const add = parseMoney(raw);
    if (!(add > 0)) return;
    startTransition(async () => {
      await updateGoalAction(goal.id, { saved_amount: goal.saved_amount + add });
      const ws = await loadBudgetWorkspaceAction();
      setWorkspace(ws);
    });
  };

  // ── empty state ──────────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-border/50 bg-card/30 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wallet className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Set up your budget
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Start with a clean set of business + personal categories and an
            operating cash account — all limits begin at zero, so every number
            is yours. Rename, re-budget, and add accounts anytime.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Button
              onClick={() => {
                startTransition(async () => {
                  const res = await seedStatementBudgetAction();
                  if (res.ok) {
                    setNotice(`Seeded NCB + Scotia accounts with ${res.transactions} statement transactions.`);
                    const ws = await loadBudgetWorkspaceAction();
                    setWorkspace(ws);
                  } else {
                    setNotice("Seed failed — check console.");
                  }
                });
              }}
              disabled={isPending}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isPending ? "Setting up…" : "Seed from bank statements"}
            </Button>
            <Button onClick={onSeed} disabled={isPending} variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Create starter budget
            </Button>
            <Button
              variant="outline"
              onClick={() => setAcctDialog({ open: true, editing: null })}
              disabled={isPending}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Start blank
            </Button>
          </div>
          {notice ? (
            <p className="mt-4 text-xs text-muted-foreground">{notice}</p>
          ) : null}
        </div>
        <AccountDialog
          open={acctDialog.open}
          editing={acctDialog.editing}
          baseCurrency={baseCurrency}
          onOpenChange={(o) => setAcctDialog((s) => ({ ...s, open: o }))}
          onSaved={refresh}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budget</h1>
          <p className="text-sm text-muted-foreground">
            Cash flow, categories, accounts, goals &amp; bills — all in one place.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onImportInvoices}
            disabled={isPending}
          >
            <Download className="h-4 w-4" />
            Import invoices
          </Button>
          <Button
            size="sm"
            className="gap-1"
            onClick={() => setTxnDialog({ open: true, editing: null })}
          >
            <Plus className="h-4 w-4" />
            Add transaction
          </Button>
        </div>
      </div>

      {notice ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-2.5 text-sm">
          <span>{notice}</span>
          <button
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setNotice(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-full border border-border/50 bg-card/30 p-1">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition",
                active
                  ? "bg-background font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Month switcher (overview + budget) */}
      {(tab === "overview" || tab === "budget") && (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonthKey((m) => shiftMonthKey(m, -1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[150px] text-center text-sm font-medium">
            {monthLabel(monthKey)}
          </span>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonthKey((m) => shiftMonthKey(m, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {monthKey !== currentMonthKey() ? (
            <Button variant="ghost" size="sm" onClick={() => setMonthKey(currentMonthKey())}>
              This month
            </Button>
          ) : null}
        </div>
      )}

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Net worth" value={formatCurrency(nw, baseCurrency)} hint="All accounts" tone={nw >= 0 ? "default" : "negative"} />
            <KpiCard label="Income" value={formatCurrency(summary.income, baseCurrency)} hint={monthLabel(monthKey)} tone="positive" />
            <KpiCard label="Expenses" value={formatCurrency(summary.expense, baseCurrency)} hint={monthLabel(monthKey)} tone="negative" />
            <KpiCard label="Net this month" value={formatCurrency(summary.net, baseCurrency)} tone={summary.net >= 0 ? "positive" : "negative"} hint={`${formatCurrency(monthlyCommitments, baseCurrency)} in bills/mo`} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard title="Cash flow · last 6 months" className="lg:col-span-2">
              <CashFlowChart data={cashFlow} currency={baseCurrency} />
            </SectionCard>
            <SectionCard title="Spending by category">
              <SpendingDonut data={donut} currency={baseCurrency} />
            </SectionCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <SectionCard title="Budget progress" className="lg:col-span-2" action={<Button variant="ghost" size="sm" onClick={() => setTab("budget")}>Open</Button>}>
              {budgetGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">No expense categories yet.</p>
              ) : (
                <div className="space-y-3">
                  {budgetGroups
                    .flatMap((g) => g.rows)
                    .filter((r) => r.budgeted > 0 || r.activity > 0)
                    .sort((a, b) => b.activity - a.activity)
                    .slice(0, 7)
                    .map((r) => (
                      <div key={r.category.id}>
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="truncate">{r.category.name}</span>
                          <span className="shrink-0 tabular-nums text-muted-foreground">
                            {formatCurrency(r.activity, baseCurrency)}
                            {r.budgeted > 0 ? ` / ${formatCurrency(r.budgeted, baseCurrency)}` : ""}
                          </span>
                        </div>
                        <div className="mt-1">
                          <ProgressBar pct={r.pct} />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </SectionCard>

            <div className="space-y-4">
              <SectionCard title="Upcoming bills" action={<Button variant="ghost" size="sm" onClick={() => setTab("bills")}>All</Button>}>
                {upcomingBills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bills tracked.</p>
                ) : (
                  <ul className="space-y-2">
                    {upcomingBills.slice(0, 4).map((b) => {
                      const d = daysUntil(b.next_due_date);
                      return (
                        <li key={b.id} className="flex items-center justify-between gap-2 text-sm">
                          <span className="truncate">{b.name}</span>
                          <span className="flex shrink-0 items-center gap-2">
                            <span className="tabular-nums">{formatCurrency(b.amount, b.currency)}</span>
                            {d != null ? (
                              <Badge variant={d < 0 ? "destructive" : "secondary"} className="text-[10px]">
                                {d < 0 ? `${Math.abs(d)}d late` : d === 0 ? "today" : `${d}d`}
                              </Badge>
                            ) : null}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </SectionCard>

              <SectionCard title="Goals" action={<Button variant="ghost" size="sm" onClick={() => setTab("goals")}>All</Button>}>
                {goals.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No goals yet.</p>
                ) : (
                  <div className="space-y-3">
                    {goals.slice(0, 3).map((g) => (
                      <div key={g.id}>
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="truncate">{g.name}</span>
                          <span className="shrink-0 tabular-nums text-muted-foreground">
                            {Math.round(goalPct(g) * 100)}%
                          </span>
                        </div>
                        <div className="mt-1">
                          <ProgressBar pct={goalPct(g)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* ── BUDGET ── */}
      {tab === "budget" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Budgeted" value={formatCurrency(totals.budgeted, baseCurrency)} />
            <KpiCard label="Spent" value={formatCurrency(totals.spent, baseCurrency)} tone="negative" />
            <KpiCard label="Remaining" value={formatCurrency(totals.remaining, baseCurrency)} tone={totals.remaining >= 0 ? "positive" : "negative"} />
            <KpiCard label="Income − budget" value={formatCurrency(totals.leftToBudget, baseCurrency)} tone={totals.leftToBudget >= 0 ? "positive" : "negative"} hint="Left to assign" />
          </div>

          <SectionCard
            title={`Categories · ${monthLabel(monthKey)}`}
            action={
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setCatDialog({ open: true, editing: null })}>
                <Plus className="h-4 w-4" />
                Category
              </Button>
            }
          >
            {budgetGroups.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No expense categories yet — add one to start budgeting.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Category</TableHead>
                      <TableHead className="w-28 text-right">Budgeted</TableHead>
                      <TableHead className="w-28 text-right">Spent</TableHead>
                      <TableHead className="w-28 text-right">Remaining</TableHead>
                      <TableHead className="min-w-[120px]">Progress</TableHead>
                      <TableHead className="w-16" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetGroups.map((g) => (
                      <GroupRows
                        key={g.group}
                        group={g.group}
                        rows={g.rows}
                        groupBudgeted={g.budgeted}
                        groupActivity={g.activity}
                        groupRemaining={g.remaining}
                        currency={baseCurrency}
                        disabled={isPending}
                        onCommitLimit={(catId, n) =>
                          startTransition(async () => {
                            await updateCategoryAction(catId, { monthly_limit: n });
                            const ws = await loadBudgetWorkspaceAction();
                            setWorkspace(ws);
                          })
                        }
                        onEdit={(c) => setCatDialog({ open: true, editing: c })}
                        onDelete={(c) =>
                          del("category", () => deleteCategoryAction(c.id))
                        }
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {/* ── TRANSACTIONS ── */}
      {tab === "transactions" && (
        <SectionCard
          title={`Transactions · ${filteredTxns.length}`}
          action={
            <Button size="sm" className="gap-1" onClick={() => setTxnDialog({ open: true, editing: null })}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          }
        >
          <div className="mb-3 grid gap-2 sm:grid-cols-3">
            <Input
              placeholder="Search payee / memo…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={filterAccount} onValueChange={setFilterAccount}>
              <SelectTrigger>
                <SelectValue placeholder="All accounts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All accounts</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All categories</SelectItem>
                <SelectItem value={NONE}>Uncategorized</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.group_name} · {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {filteredTxns.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No transactions match.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">Date</TableHead>
                    <TableHead className="min-w-[160px]">Payee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="w-32 text-right">Amount</TableHead>
                    <TableHead className="w-20" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTxns.slice(0, 400).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {t.txn_date}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{t.payee ?? "—"}</div>
                        {t.memo ? (
                          <div className="text-xs text-muted-foreground">{t.memo}</div>
                        ) : null}
                        {t.source === "invoice" ? (
                          <Badge variant="secondary" className="mt-0.5 text-[10px]">invoice</Badge>
                        ) : null}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {t.kind === "transfer" ? (
                          <span className="inline-flex items-center gap-1">
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            Transfer
                          </span>
                        ) : (
                          categoryName(t.category_id)
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {t.kind === "transfer"
                          ? `${accountName(t.account_id)} → ${accountName(t.transfer_account_id)}`
                          : accountName(t.account_id)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right tabular-nums font-medium",
                          t.kind === "income" && "text-emerald-600 dark:text-emerald-400",
                          t.kind === "expense" && "text-rose-600 dark:text-rose-400",
                        )}
                      >
                        {t.kind === "income" ? "+" : t.kind === "expense" ? "−" : ""}
                        {formatCurrencyAmount(t.amount, t.currency)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTxnDialog({ open: true, editing: t })}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => del("transaction", () => deleteTransactionAction(t.id))}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredTxns.length > 400 ? (
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Showing first 400 of {filteredTxns.length}.
                </p>
              ) : null}
            </div>
          )}
        </SectionCard>
      )}

      {/* ── ACCOUNTS ── */}
      {tab === "accounts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <KpiCard label="Net worth" value={formatCurrency(nw, baseCurrency)} />
            <Button size="sm" className="gap-1" onClick={() => setAcctDialog({ open: true, editing: null })}>
              <Plus className="h-4 w-4" />
              Add account
            </Button>
          </div>
          {accounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No accounts yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((a) => {
                const bal = accountBalance(a, transactions);
                return (
                  <div key={a.id} className={cn("rounded-2xl border border-border/50 bg-card/30 p-5", a.archived && "opacity-60")}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {LIABILITY_TYPES.includes(a.type) ? <Banknote className="h-4 w-4" /> : <Landmark className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium leading-tight">{a.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {accountTypeLabel(a.type)}
                            {a.institution ? ` · ${a.institution}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setAcctDialog({ open: true, editing: a })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => del("account", () => deleteAccountAction(a.id))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className={cn("mt-3 text-xl font-semibold tabular-nums", bal < 0 && "text-rose-600 dark:text-rose-400")}>
                      {formatCurrencyAmount(bal, a.currency)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── GOALS ── */}
      {tab === "goals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <Button size="sm" className="gap-1" onClick={() => setGoalDialog({ open: true, editing: null })}>
              <Plus className="h-4 w-4" />
              Add goal
            </Button>
          </div>
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No savings goals yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {goals.map((g) => {
                const pct = goalPct(g);
                return (
                  <div key={g.id} className="rounded-2xl border border-border/50 bg-card/30 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <PiggyBank className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium leading-tight">{g.name}</p>
                          {g.target_date ? (
                            <p className="text-xs text-muted-foreground">by {g.target_date}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setGoalDialog({ open: true, editing: g })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => del("goal", () => deleteGoalAction(g.id))}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline justify-between text-sm">
                      <span className="font-semibold tabular-nums">{formatCurrency(g.saved_amount, baseCurrency)}</span>
                      <span className="text-muted-foreground tabular-nums">of {formatCurrency(g.target_amount, baseCurrency)}</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar pct={pct} />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{Math.round(pct * 100)}% funded</span>
                      <Button variant="outline" size="sm" onClick={() => contributeToGoal(g)}>
                        Add funds
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── BILLS ── */}
      {tab === "bills" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <KpiCard label="Monthly commitments" value={formatCurrency(monthlyCommitments, baseCurrency)} hint="All active bills, normalized /mo" />
            <Button size="sm" className="gap-1" onClick={() => setBillDialog({ open: true, editing: null })}>
              <Plus className="h-4 w-4" />
              Add bill
            </Button>
          </div>
          {upcomingBills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recurring bills tracked.</p>
          ) : (
            <SectionCard>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[160px]">Bill</TableHead>
                      <TableHead className="w-28 text-right">Amount</TableHead>
                      <TableHead>Cadence</TableHead>
                      <TableHead>Next due</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-40 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBills.map((b) => {
                      const d = daysUntil(b.next_due_date);
                      return (
                        <TableRow key={b.id}>
                          <TableCell>
                            <div className="font-medium">{b.name}</div>
                            {b.autopay ? (
                              <Badge variant="secondary" className="mt-0.5 text-[10px]">autopay</Badge>
                            ) : null}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatCurrencyAmount(b.amount, b.currency)}
                          </TableCell>
                          <TableCell className="capitalize text-muted-foreground">
                            {BILL_CADENCES.find((c) => c.value === b.cadence)?.label ?? b.cadence}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <span className="tabular-nums text-muted-foreground">{b.next_due_date ?? "—"}</span>
                              {d != null ? (
                                <Badge variant={d < 0 ? "destructive" : d <= 5 ? "default" : "secondary"} className="text-[10px]">
                                  {d < 0 ? `${Math.abs(d)}d late` : d === 0 ? "today" : `${d}d`}
                                </Badge>
                              ) : null}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {categoryName(b.category_id)}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button variant="outline" size="sm" onClick={() => markBillPaid(b)} disabled={isPending}>
                                Mark paid
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setBillDialog({ open: true, editing: b })}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => del("bill", () => deleteBillAction(b.id))}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AccountDialog
        open={acctDialog.open}
        editing={acctDialog.editing}
        baseCurrency={baseCurrency}
        onOpenChange={(o) => setAcctDialog((s) => ({ ...s, open: o }))}
        onSaved={refresh}
      />
      <CategoryDialog
        open={catDialog.open}
        editing={catDialog.editing}
        groups={groups}
        onOpenChange={(o) => setCatDialog((s) => ({ ...s, open: o }))}
        onSaved={refresh}
      />
      <TransactionDialog
        open={txnDialog.open}
        editing={txnDialog.editing}
        accounts={accounts}
        categories={categories}
        baseCurrency={baseCurrency}
        onOpenChange={(o) => setTxnDialog((s) => ({ ...s, open: o }))}
        onSaved={refresh}
      />
      <GoalDialog
        open={goalDialog.open}
        editing={goalDialog.editing}
        onOpenChange={(o) => setGoalDialog((s) => ({ ...s, open: o }))}
        onSaved={refresh}
      />
      <BillDialog
        open={billDialog.open}
        editing={billDialog.editing}
        categories={categories}
        accounts={accounts}
        baseCurrency={baseCurrency}
        onOpenChange={(o) => setBillDialog((s) => ({ ...s, open: o }))}
        onSaved={refresh}
      />
    </div>
  );
}

// ── Budget group rows (collapsible-free, group header + category rows) ─────────

function GroupRows({
  group,
  rows,
  groupBudgeted,
  groupActivity,
  groupRemaining,
  currency,
  disabled,
  onCommitLimit,
  onEdit,
  onDelete,
}: {
  group: string;
  rows: {
    category: BudgetCategory;
    budgeted: number;
    activity: number;
    remaining: number;
    pct: number;
  }[];
  groupBudgeted: number;
  groupActivity: number;
  groupRemaining: number;
  currency: string;
  disabled: boolean;
  onCommitLimit: (catId: string, n: number) => void;
  onEdit: (c: BudgetCategory) => void;
  onDelete: (c: BudgetCategory) => void;
}) {
  return (
    <>
      <TableRow className="bg-muted/30 hover:bg-muted/30">
        <TableCell className="font-semibold uppercase tracking-wide text-xs text-muted-foreground">
          {group}
        </TableCell>
        <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
          {formatCurrency(groupBudgeted, currency)}
        </TableCell>
        <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
          {formatCurrency(groupActivity, currency)}
        </TableCell>
        <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
          {formatCurrency(groupRemaining, currency)}
        </TableCell>
        <TableCell colSpan={2} />
      </TableRow>
      {rows.map((r) => (
        <TableRow key={r.category.id}>
          <TableCell className="pl-4">{r.category.name}</TableCell>
          <TableCell className="text-right">
            <LimitInput
              value={r.budgeted}
              disabled={disabled}
              onCommit={(n) => onCommitLimit(r.category.id, n)}
            />
          </TableCell>
          <TableCell className="text-right tabular-nums text-muted-foreground">
            {formatCurrency(r.activity, currency)}
          </TableCell>
          <TableCell
            className={cn(
              "text-right tabular-nums",
              r.remaining < 0 && "text-rose-600 dark:text-rose-400",
            )}
          >
            {formatCurrency(r.remaining, currency)}
          </TableCell>
          <TableCell>
            <ProgressBar pct={r.pct} />
          </TableCell>
          <TableCell>
            <div className="flex justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(r.category)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(r.category)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
