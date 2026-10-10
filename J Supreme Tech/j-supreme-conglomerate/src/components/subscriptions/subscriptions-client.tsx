"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  CalendarClock,
  Check,
  CreditCard,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import type {
  BillingCycle,
  Subscription,
  SubscriptionCard,
  SubscriptionInput,
  SubscriptionStatus,
} from "@/lib/data/subscriptions";
import {
  advanceDue,
  BILLING_CYCLES,
  CYCLE_LABEL,
  CYCLE_SUFFIX,
  dueStatus,
  formatDueDate,
  formatMoney,
  toMonthly,
  totalsByCurrency,
} from "@/lib/subscriptions/compute";
import {
  createLocalCard,
  createLocalSubscription,
  loadLocalCards,
  loadLocalSubscriptions,
  removeLocalCard,
  removeLocalSubscription,
  updateLocalSubscription,
} from "@/lib/subscriptions/local-store";
import {
  applySubscriptionSyncAction,
  createCardAction,
  createSubscriptionAction,
  deleteCardAction,
  deleteSubscriptionAction,
  previewSubscriptionSyncAction,
  seedStatementSubscriptionsAction,
  setSubscriptionStatusAction,
  updateSubscriptionAction,
} from "@/app/(app)/subscriptions/actions";
import type { SyncCollision } from "@/lib/data/subscription-budget-sync";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CountSummary } from "@/components/shared/count-summary";
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
import { cn } from "@/lib/utils";

type Props = {
  ownerId: string;
  persistLocally: boolean;
  initialSubscriptions: Subscription[];
  initialCards: SubscriptionCard[];
};

const CURRENCIES = ["USD", "JMD"];
const CARD_COLORS = [
  "#1f4fa3",
  "#d6001c",
  "#0a7d33",
  "#6b21a8",
  "#b45309",
  "#0f766e",
  "#be123c",
  "#334155",
];
const ADD_CARD = "__add__";

const TONE_CLASS: Record<string, string> = {
  overdue: "border-rose-500/50 text-rose-600 dark:text-rose-300",
  soon: "border-amber-500/50 text-amber-600 dark:text-amber-300",
  upcoming: "border-border text-muted-foreground",
  none: "border-border text-muted-foreground",
};

type SubForm = {
  id: string | null;
  name: string;
  amount: string;
  currency: string;
  billing_cycle: BillingCycle;
  next_due_date: string;
  card_id: string;
  category: string;
  notes: string;
};

function todayStr(): string {
  const d = new Date();
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function emptySubForm(): SubForm {
  return {
    id: null,
    name: "",
    amount: "",
    currency: "USD",
    billing_cycle: "monthly",
    next_due_date: todayStr(),
    card_id: "",
    category: "",
    notes: "",
  };
}

function subToForm(s: Subscription): SubForm {
  return {
    id: s.id,
    name: s.name,
    amount: s.amount != null ? String(s.amount) : "",
    currency: s.currency || "USD",
    billing_cycle: s.billing_cycle,
    next_due_date: s.next_due_date ?? "",
    card_id: s.card_id ?? "",
    category: s.category ?? "",
    notes: s.notes ?? "",
  };
}

export function SubscriptionsClient({
  ownerId,
  persistLocally,
  initialSubscriptions,
  initialCards,
}: Props) {
  const [subs, setSubs] = useState<Subscription[]>(initialSubscriptions);
  const [cards, setCards] = useState<SubscriptionCard[]>(initialCards);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<SubForm>(emptySubForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // inline "new card" inside the subscription dialog
  const [newCardMode, setNewCardMode] = useState(false);
  const [inlineCardName, setInlineCardName] = useState("");
  const [inlineCardLast4, setInlineCardLast4] = useState("");

  // standalone "add card" dialog (from the cards strip)
  const [cardOpen, setCardOpen] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [cardColor, setCardColor] = useState(CARD_COLORS[0]);

  // budget sync + duplicate confirmation
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [collisionOpen, setCollisionOpen] = useState(false);
  const [collisions, setCollisions] = useState<SyncCollision[]>([]);
  const [approve, setApprove] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (persistLocally) {
      setCards(loadLocalCards(ownerId));
      setSubs(loadLocalSubscriptions(ownerId));
    }
  }, [persistLocally, ownerId]);

  const cardById = useMemo(() => {
    const m = new Map<string, SubscriptionCard>();
    for (const c of cards) m.set(c.id, c);
    return m;
  }, [cards]);

  const { active, inactive } = useMemo(() => {
    const a: Subscription[] = [];
    const i: Subscription[] = [];
    for (const s of subs) (s.status === "active" ? a : i).push(s);
    const byDue = (x: Subscription, y: Subscription) =>
      (x.next_due_date ?? "9999").localeCompare(y.next_due_date ?? "9999");
    a.sort(byDue);
    i.sort(byDue);
    return { active: a, inactive: i };
  }, [subs]);

  const totals = useMemo(() => totalsByCurrency(subs), [subs]);

  const cardMonthly = useMemo(() => {
    // monthly spend per card, summed across currencies (display only).
    const m = new Map<string, { byCur: Map<string, number> }>();
    for (const s of subs) {
      if (s.status !== "active" || s.amount == null) continue;
      const key = s.card_id ?? "none";
      const entry = m.get(key) ?? { byCur: new Map() };
      const cur = s.currency || "USD";
      entry.byCur.set(cur, (entry.byCur.get(cur) ?? 0) + toMonthly(s.amount, s.billing_cycle));
      m.set(key, entry);
    }
    return m;
  }, [subs]);

  function upsertSub(s: Subscription) {
    setSubs((prev) => {
      const idx = prev.findIndex((x) => x.id === s.id);
      if (idx === -1) return [...prev, s];
      const next = prev.slice();
      next[idx] = s;
      return next;
    });
  }

  function openCreate() {
    setForm(emptySubForm());
    setNewCardMode(false);
    setError(null);
    setOpen(true);
  }

  function openEdit(s: Subscription) {
    setForm(subToForm(s));
    setNewCardMode(false);
    setError(null);
    setOpen(true);
  }

  async function addCard(
    input: { name: string; last4?: string; color?: string },
  ): Promise<SubscriptionCard | null> {
    if (!input.name.trim()) return null;
    if (persistLocally) {
      const c = createLocalCard(ownerId, input);
      if (c) setCards((prev) => [...prev, c]);
      return c;
    }
    const res = await createCardAction(input);
    if (!res.ok) {
      setError(res.error);
      return null;
    }
    setCards((prev) => [...prev, res.card]);
    return res.card;
  }

  function submitInlineCard() {
    const name = inlineCardName.trim();
    if (!name) return;
    startTransition(async () => {
      const c = await addCard({ name, last4: inlineCardLast4 });
      if (c) {
        setForm((f) => ({ ...f, card_id: c.id }));
        setNewCardMode(false);
        setInlineCardName("");
        setInlineCardLast4("");
      }
    });
  }

  function submitCardDialog() {
    const name = cardName.trim();
    if (!name) return;
    startTransition(async () => {
      const c = await addCard({ name, last4: cardLast4, color: cardColor });
      if (c) {
        setCardOpen(false);
        setCardName("");
        setCardLast4("");
        setCardColor(CARD_COLORS[0]);
      }
    });
  }

  function removeCard(c: SubscriptionCard) {
    if (
      !window.confirm(
        `Remove card "${c.name}"? Subscriptions linked to it stay, but become unassigned.`,
      )
    )
      return;
    startTransition(async () => {
      if (persistLocally) {
        removeLocalCard(ownerId, c.id);
        setCards((prev) => prev.filter((x) => x.id !== c.id));
        setSubs((prev) =>
          prev.map((s) => (s.card_id === c.id ? { ...s, card_id: null } : s)),
        );
        return;
      }
      const res = await deleteCardAction(c.id);
      if (res.ok) {
        setCards((prev) => prev.filter((x) => x.id !== c.id));
        setSubs((prev) =>
          prev.map((s) => (s.card_id === c.id ? { ...s, card_id: null } : s)),
        );
      } else setError(res.error);
    });
  }

  function submit() {
    setError(null);
    if (!form.name.trim()) {
      setError("Give the subscription a name.");
      return;
    }
    const input: SubscriptionInput = {
      name: form.name,
      amount: form.amount.trim() === "" ? null : Number(form.amount),
      currency: form.currency,
      billing_cycle: form.billing_cycle,
      next_due_date: form.next_due_date || null,
      card_id: form.card_id || null,
      category: form.category,
      notes: form.notes,
    };
    startTransition(async () => {
      if (persistLocally) {
        const s = form.id
          ? updateLocalSubscription(ownerId, form.id, input)
          : createLocalSubscription(ownerId, input);
        if (!s) {
          setError("Could not save on this device.");
          return;
        }
        upsertSub(s);
        setOpen(false);
        return;
      }
      const res = form.id
        ? await updateSubscriptionAction(form.id, input)
        : await createSubscriptionAction(input);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      upsertSub(res.subscription);
      setOpen(false);
    });
  }

  function patchSub(s: Subscription, patch: Partial<SubscriptionInput>) {
    startTransition(async () => {
      if (persistLocally) {
        const updated = updateLocalSubscription(ownerId, s.id, patch);
        if (updated) upsertSub(updated);
        return;
      }
      const res = await updateSubscriptionAction(s.id, patch);
      if (res.ok) upsertSub(res.subscription);
      else setError(res.error);
    });
  }

  function markPaid(s: Subscription) {
    if (!s.next_due_date) return;
    patchSub(s, { next_due_date: advanceDue(s.next_due_date, s.billing_cycle) });
  }

  function changeStatus(s: Subscription, status: SubscriptionStatus) {
    startTransition(async () => {
      if (persistLocally) {
        const updated = updateLocalSubscription(ownerId, s.id, { status });
        if (updated) upsertSub(updated);
        return;
      }
      const res = await setSubscriptionStatusAction(s.id, status);
      if (res.ok) upsertSub(res.subscription);
      else setError(res.error);
    });
  }

  function remove(s: Subscription) {
    if (!window.confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      if (persistLocally) {
        if (removeLocalSubscription(ownerId, s.id))
          setSubs((prev) => prev.filter((x) => x.id !== s.id));
        return;
      }
      const res = await deleteSubscriptionAction(s.id);
      if (res.ok) setSubs((prev) => prev.filter((x) => x.id !== s.id));
      else setError(res.error);
    });
  }

  async function doApply(approveIds: string[]) {
    const res = await applySubscriptionSyncAction(approveIds);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCollisionOpen(false);
    const parts: string[] = [];
    if (res.bills) parts.push(`${res.bills} bill${res.bills === 1 ? "" : "s"}`);
    if (res.transactions)
      parts.push(`${res.transactions} expense${res.transactions === 1 ? "" : "s"}`);
    let msg = parts.length
      ? `Synced ${parts.join(" + ")} to Budget.`
      : "Budget is already up to date.";
    if (res.skippedCollisions)
      msg += ` Skipped ${res.skippedCollisions} possible duplicate${res.skippedCollisions === 1 ? "" : "s"}.`;
    setSyncResult(msg);
  }

  function onSync() {
    setError(null);
    setSyncResult(null);
    startTransition(async () => {
      const res = await previewSubscriptionSyncAction();
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (res.collisions.length > 0) {
        setCollisions(res.collisions);
        setApprove(new Set());
        setCollisionOpen(true);
        return;
      }
      await doApply([]);
    });
  }

  function confirmCollisions() {
    startTransition(async () => {
      await doApply([...approve]);
    });
  }

  function toggleApprove(id: string) {
    setApprove((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <CreditCard className="h-6 w-6 text-primary" />
            Subscriptions
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track renewal dates and which card each subscription is billed to.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {!persistLocally && subs.length === 0 && (
            <Button
              variant="outline"
              onClick={() => {
                startTransition(async () => {
                  const res = await seedStatementSubscriptionsAction();
                  if (res.ok) setSyncResult(`Seeded ${res.seeded} subscriptions from bank statements.`);
                });
              }}
              disabled={isPending}
              className="gap-2"
              title="Pre-load known subscriptions derived from NCB + Scotia statements Apr–Jul 2026"
            >
              <RotateCcw className="h-4 w-4" />
              Seed from statements
            </Button>
          )}
          {!persistLocally && (
            <Button
              variant="outline"
              onClick={onSync}
              disabled={isPending}
              className="gap-2"
              title="Add active subscriptions to the Budget module as bills + this month's cash-flow"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Sync to Budget
            </Button>
          )}
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Add subscription
          </Button>
        </div>
      </div>

      {/* Totals */}
      <div className="flex flex-wrap items-center gap-2">
        <CountSummary
          items={[
            { label: "active", value: active.length, emphasis: true },
            { label: "cards", value: cards.length },
          ]}
        />
        {totals.map((t) => (
          <Badge
            key={t.currency}
            variant="secondary"
            className="gap-1.5 px-2.5 py-1 font-normal tabular-nums"
          >
            <span className="text-base font-semibold leading-none">
              {formatMoney(t.monthly, t.currency)}
            </span>
            <span className="text-[11px] uppercase tracking-wide opacity-90">
              /mo · {t.currency}
            </span>
          </Badge>
        ))}
      </div>

      {/* Cards strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
          Cards
        </span>
        {cards.map((c) => {
          const spend = cardMonthly.get(c.id);
          return (
            <span
              key={c.id}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/50 py-1 pl-1 pr-2 text-xs"
            >
              <span
                className="flex h-5 items-center rounded-full px-2 text-[10px] font-semibold text-white"
                style={{ backgroundColor: c.color || "#475569" }}
              >
                {c.name}
              </span>
              {c.last4 && (
                <span className="font-mono text-muted-foreground">••{c.last4}</span>
              )}
              {spend && (
                <span className="text-muted-foreground/80">
                  {[...spend.byCur.entries()]
                    .map(([cur, v]) => formatMoney(v, cur))
                    .join(" · ")}
                  /mo
                </span>
              )}
              <button
                onClick={() => removeCard(c)}
                className="ml-0.5 text-muted-foreground/40 opacity-0 transition-opacity hover:text-rose-500 group-hover:opacity-100"
                title="Remove card"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 rounded-full text-xs"
          onClick={() => {
            setCardName("");
            setCardLast4("");
            setCardColor(CARD_COLORS[cards.length % CARD_COLORS.length]);
            setCardOpen(true);
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add card
        </Button>
      </div>

      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {syncResult && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          <span>{syncResult}</span>
          <button onClick={() => setSyncResult(null)} aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Active */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
          Active
        </h2>
        {active.length === 0 ? (
          <Card className="border-dashed bg-card/40">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <CreditCard className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No subscriptions yet. Add one to start tracking renewal dates.
              </p>
              <Button variant="outline" onClick={openCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Add subscription
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2.5">
            {active.map((s) => (
              <SubRow
                key={s.id}
                sub={s}
                card={s.card_id ? cardById.get(s.card_id) ?? null : null}
                pending={isPending}
                onEdit={() => openEdit(s)}
                onPaid={() => markPaid(s)}
                onStatus={(st) => changeStatus(s, st)}
                onDelete={() => remove(s)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Paused / canceled */}
      {inactive.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
            Paused &amp; canceled
          </h2>
          <div className="grid gap-2.5">
            {inactive.map((s) => (
              <SubRow
                key={s.id}
                sub={s}
                card={s.card_id ? cardById.get(s.card_id) ?? null : null}
                pending={isPending}
                muted
                onEdit={() => openEdit(s)}
                onPaid={() => markPaid(s)}
                onStatus={(st) => changeStatus(s, st)}
                onDelete={() => remove(s)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Subscription dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit subscription" : "Add subscription"}</DialogTitle>
            <DialogDescription>
              {persistLocally
                ? "Saved to this browser until Supabase is connected."
                : "Saved to your workspace database."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="s-name">Name</Label>
              <Input
                id="s-name"
                value={form.name}
                placeholder="Netflix, Adobe CC, ChatGPT…"
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-[1fr_7rem] gap-3">
              <div className="grid gap-2">
                <Label htmlFor="s-amount">Amount</Label>
                <Input
                  id="s-amount"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  placeholder="0.00"
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(v) => setForm((f) => ({ ...f, currency: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Billing cycle</Label>
                <Select
                  value={form.billing_cycle}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, billing_cycle: v as BillingCycle }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BILLING_CYCLES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {CYCLE_LABEL[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="s-due">Next due date</Label>
                <Input
                  id="s-due"
                  type="date"
                  value={form.next_due_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, next_due_date: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Billed to card</Label>
              <Select
                value={newCardMode ? ADD_CARD : form.card_id || "none"}
                onValueChange={(v) => {
                  if (v === ADD_CARD) {
                    setNewCardMode(true);
                    return;
                  }
                  setNewCardMode(false);
                  setForm((f) => ({ ...f, card_id: v === "none" ? "" : v }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None / not linked</SelectItem>
                  {cards.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                      {c.last4 ? ` ••${c.last4}` : ""}
                    </SelectItem>
                  ))}
                  <SelectItem value={ADD_CARD}>＋ New card…</SelectItem>
                </SelectContent>
              </Select>

              {newCardMode && (
                <div className="flex flex-wrap items-end gap-2 rounded-lg border border-border/60 bg-muted/30 p-2.5">
                  <div className="grid flex-1 gap-1">
                    <Label className="text-[11px]">Card name</Label>
                    <Input
                      value={inlineCardName}
                      placeholder="e.g. CIBC, JN, Amex"
                      onChange={(e) => setInlineCardName(e.target.value)}
                    />
                  </div>
                  <div className="grid w-20 gap-1">
                    <Label className="text-[11px]">Last 4</Label>
                    <Input
                      value={inlineCardLast4}
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="1234"
                      onChange={(e) => setInlineCardLast4(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={submitInlineCard}
                    disabled={isPending || !inlineCardName.trim()}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="s-cat">Category (optional)</Label>
                <Input
                  id="s-cat"
                  value={form.category}
                  placeholder="Software, Personal…"
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="s-notes">Notes (optional)</Label>
                <Input
                  id="s-notes"
                  value={form.notes}
                  placeholder="Plan, login…"
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={isPending}>
              {form.id ? "Save changes" : "Add subscription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add-card dialog */}
      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add a card</DialogTitle>
            <DialogDescription>Add another bank or card to bill subscriptions to.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="c-name">Card name</Label>
              <Input
                id="c-name"
                value={cardName}
                placeholder="NCB, Scotia, CIBC, Amex…"
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="c-last4">Last 4 (optional)</Label>
              <Input
                id="c-last4"
                value={cardLast4}
                inputMode="numeric"
                maxLength={4}
                placeholder="1234"
                onChange={(e) => setCardLast4(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {CARD_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setCardColor(col)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-transform",
                      cardColor === col
                        ? "scale-110 border-foreground"
                        : "border-transparent",
                    )}
                    style={{ backgroundColor: col }}
                    aria-label={`Color ${col}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCardOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitCardDialog} disabled={isPending || !cardName.trim()}>
              Add card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate-confirmation dialog for the Budget sync */}
      <Dialog open={collisionOpen} onOpenChange={setCollisionOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Possible duplicates
            </DialogTitle>
            <DialogDescription>
              These match something already in your Budget. They&apos;ll be skipped
              unless you tick &ldquo;import anyway.&rdquo; Everything else syncs
              regardless.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] space-y-2 overflow-y-auto py-1">
            {collisions.map((c) => {
              const on = approve.has(c.sub_id);
              return (
                <label
                  key={c.sub_id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-card/50 p-3 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggleApprove(c.sub_id)}
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="font-medium">{c.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      already a {c.matchedBy === "bill" ? "budget bill" : "tracked expense"}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "shrink-0 text-xs",
                      on ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
                    )}
                  >
                    {on ? "Import anyway" : "Skip"}
                  </span>
                </label>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCollisionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmCollisions} disabled={isPending}>
              {approve.size > 0
                ? `Import ${approve.size} + sync rest`
                : "Skip dupes, sync rest"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type SubRowProps = {
  sub: Subscription;
  card: SubscriptionCard | null;
  pending: boolean;
  muted?: boolean;
  onEdit: () => void;
  onPaid: () => void;
  onStatus: (s: SubscriptionStatus) => void;
  onDelete: () => void;
};

function SubRow({
  sub: s,
  card,
  pending,
  muted,
  onEdit,
  onPaid,
  onStatus,
  onDelete,
}: SubRowProps) {
  const due = dueStatus(s.next_due_date);

  return (
    <Card className={cn("bg-card/50", muted && "opacity-75")}>
      <CardContent className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium leading-tight">{s.name}</p>
            {card ? (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                style={{ backgroundColor: card.color || "#475569" }}
              >
                {card.name}
                {card.last4 ? ` ••${card.last4}` : ""}
              </span>
            ) : (
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                No card
              </Badge>
            )}
            {s.category && (
              <Badge variant="secondary" className="text-[10px]">
                {s.category}
              </Badge>
            )}
            {s.status === "canceled" && (
              <Badge variant="outline" className="text-[10px] text-rose-500">
                Canceled
              </Badge>
            )}
            {s.status === "paused" && (
              <Badge variant="outline" className="text-[10px] text-amber-500">
                Paused
              </Badge>
            )}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            {s.amount != null && (
              <span className="font-semibold text-foreground">
                {formatMoney(s.amount, s.currency)}
                <span className="font-normal text-muted-foreground">
                  {" "}
                  {CYCLE_SUFFIX[s.billing_cycle]}
                </span>
              </span>
            )}
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-3 w-3" />
              {formatDueDate(s.next_due_date)}
            </span>
            {s.notes && <span className="truncate">· {s.notes}</span>}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
          {s.status === "active" && (
            <Badge
              variant="outline"
              className={cn(
                "gap-1 text-[10px]",
                TONE_CLASS[due.tone],
              )}
            >
              {due.tone === "overdue" && <AlertTriangle className="h-3 w-3" />}
              {due.label}
            </Badge>
          )}
          {s.status === "active" && s.next_due_date && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 text-xs text-emerald-600 dark:text-emerald-400"
              title="Mark paid — roll to next cycle"
              disabled={pending}
              onClick={onPaid}
            >
              <Check className="h-3.5 w-3.5" />
              Paid
            </Button>
          )}
          <div className="flex items-center">
            {s.status === "active" ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                title="Pause"
                disabled={pending}
                onClick={() => onStatus("paused")}
              >
                <Pause className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
                title="Reactivate"
                disabled={pending}
                onClick={() => onStatus("active")}
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
            {s.status !== "canceled" ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                title="Cancel"
                disabled={pending}
                onClick={() => onStatus("canceled")}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            ) : null}
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              title="Edit"
              onClick={onEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-rose-500"
              title="Delete"
              disabled={pending}
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
