import { getServiceSupabase } from "@/lib/supabase/admin";
import { toMonthly } from "@/lib/subscriptions/compute";
import type { BillingCycle } from "@/lib/data/subscriptions";

/**
 * One-way sync: active subscriptions → Budget module.
 *
 * Each active subscription becomes:
 *   • a recurring `budget_bill` (durable commitment; powers the Bills tab), and
 *   • a current-month `budget_transaction` at its monthly-equivalent amount
 *     (so it shows up in the cash-flow chart, which is transaction-based).
 *
 * Both rows are stamped source='subscription' + a deterministic external_id, so
 * re-running never double-posts. Subscriptions whose name collides with an
 * existing *manual* bill/expense are reported as collisions and only created
 * when the operator explicitly approves them.
 */

const NO_SB = "Supabase is not configured." as const;
const SUBSCRIPTIONS_CATEGORY = "Subscriptions";

export type SyncCollision = {
  sub_id: string;
  name: string;
  amount: number | null;
  currency: string;
  matchedBy: "bill" | "transaction";
};

export type SubscriptionSyncPreview =
  | {
      ok: true;
      newSubs: { sub_id: string; name: string }[];
      alreadySynced: number;
      collisions: SyncCollision[];
      /** New subs with no amount set — a bill is created, but no cash-flow expense. */
      missingAmount: number;
    }
  | { ok: false; error: string };

export type SubscriptionSyncResult =
  | { ok: true; bills: number; transactions: number; skippedCollisions: number }
  | { ok: false; error: string };

type SbClient = NonNullable<ReturnType<typeof getServiceSupabase>>;

type SubRow = {
  id: string;
  name: string;
  amount: number | null;
  currency: string;
  billing_cycle: BillingCycle;
  next_due_date: string | null;
};

type SyncState = {
  subs: SubRow[];
  /** external_ids of bills already created by a previous sync. */
  syncedBillExt: Set<string>;
  /** external_ids of subscription expense txns already posted. */
  syncedTxnExt: Set<string>;
  /** normalized names of manually-entered bills (not from this sync). */
  manualBillNames: Set<string>;
  /** normalized payees of manually-entered expense transactions. */
  manualPayees: Set<string>;
};

function normName(s: string | null | undefined): string {
  return String(s ?? "").toLowerCase().trim().replace(/\s+/g, " ");
}

function round2(n: number): number {
  return Math.round((Number.isFinite(n) ? n : 0) * 100) / 100;
}

function todayStr(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function monthKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function billExtId(subId: string): string {
  return `subscription:${subId}`;
}
function txnExtId(subId: string): string {
  return `sub:${subId}:${monthKey()}`;
}

async function loadState(sb: SbClient, owner: string): Promise<SyncState> {
  const [subsRes, billsRes, txnsRes] = await Promise.all([
    sb
      .from("subscriptions")
      .select("id,name,amount,currency,billing_cycle,next_due_date,status")
      .eq("owner_clerk_id", owner)
      .eq("status", "active"),
    sb
      .from("budget_bills")
      .select("name,source,external_id")
      .eq("owner_clerk_id", owner),
    sb
      .from("budget_transactions")
      .select("payee,source,external_id,kind")
      .eq("owner_clerk_id", owner),
  ]);

  const subs: SubRow[] = (subsRes.data ?? []).map((r) => {
    const o = r as Record<string, unknown>;
    return {
      id: String(o.id),
      name: String(o.name ?? ""),
      amount: o.amount != null ? Number(o.amount) : null,
      currency: o.currency ? String(o.currency).toUpperCase() : "USD",
      billing_cycle: (String(o.billing_cycle ?? "monthly") as BillingCycle),
      next_due_date: o.next_due_date != null ? String(o.next_due_date).slice(0, 10) : null,
    };
  });

  const syncedBillExt = new Set<string>();
  const manualBillNames = new Set<string>();
  for (const r of billsRes.data ?? []) {
    const o = r as Record<string, unknown>;
    if (o.source === "subscription" && o.external_id != null) {
      syncedBillExt.add(String(o.external_id));
    } else {
      manualBillNames.add(normName(o.name as string));
    }
  }

  const syncedTxnExt = new Set<string>();
  const manualPayees = new Set<string>();
  for (const r of txnsRes.data ?? []) {
    const o = r as Record<string, unknown>;
    if (o.source === "subscription" && o.external_id != null) {
      syncedTxnExt.add(String(o.external_id));
    } else if (o.source === "manual" && o.kind === "expense") {
      manualPayees.add(normName(o.payee as string));
    }
  }

  return { subs, syncedBillExt, syncedTxnExt, manualBillNames, manualPayees };
}

function classify(state: SyncState) {
  const fresh: SubRow[] = [];
  const collisions: SyncCollision[] = [];
  let alreadySynced = 0;

  for (const s of state.subs) {
    if (state.syncedBillExt.has(billExtId(s.id))) {
      alreadySynced += 1;
      continue;
    }
    const n = normName(s.name);
    const byBill = state.manualBillNames.has(n);
    const byTxn = state.manualPayees.has(n);
    if (byBill || byTxn) {
      collisions.push({
        sub_id: s.id,
        name: s.name,
        amount: s.amount,
        currency: s.currency,
        matchedBy: byBill ? "bill" : "transaction",
      });
    } else {
      fresh.push(s);
    }
  }
  return { fresh, collisions, alreadySynced };
}

export async function previewSubscriptionSync(
  owner: string,
): Promise<SubscriptionSyncPreview> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  try {
    const state = await loadState(sb, owner);
    const { fresh, collisions, alreadySynced } = classify(state);
    return {
      ok: true,
      newSubs: fresh.map((s) => ({ sub_id: s.id, name: s.name })),
      alreadySynced,
      collisions,
      missingAmount: fresh.filter((s) => s.amount == null).length,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

async function ensureSubscriptionsCategory(
  sb: SbClient,
  owner: string,
): Promise<string | null> {
  const { data: existing } = await sb
    .from("budget_categories")
    .select("id,name,kind")
    .eq("owner_clerk_id", owner)
    .eq("kind", "expense");
  const match = (existing ?? []).find(
    (c) => normName((c as Record<string, unknown>).name as string) === "subscriptions",
  );
  if (match) return String((match as Record<string, unknown>).id);

  const { data, error } = await sb
    .from("budget_categories")
    .insert({
      owner_clerk_id: owner,
      name: SUBSCRIPTIONS_CATEGORY,
      group_name: "Recurring",
      kind: "expense",
      monthly_limit: 0,
      sort_order: 900,
    })
    .select("id")
    .single();
  if (error || !data) return null;
  return String((data as Record<string, unknown>).id);
}

async function firstAccountId(sb: SbClient, owner: string): Promise<string | null> {
  const { data } = await sb
    .from("budget_accounts")
    .select("id")
    .eq("owner_clerk_id", owner)
    .eq("archived", false)
    .order("sort_order", { ascending: true })
    .limit(1);
  const row = data?.[0] as Record<string, unknown> | undefined;
  return row?.id ? String(row.id) : null;
}

export async function applySubscriptionSync(
  owner: string,
  opts: { approveSubIds?: string[] } = {},
): Promise<SubscriptionSyncResult> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: NO_SB };
  try {
    const state = await loadState(sb, owner);
    const approve = new Set(opts.approveSubIds ?? []);
    const { fresh, collisions } = classify(state);

    const collisionById = new Map(collisions.map((c) => [c.sub_id, c]));
    const approvedCollisionSubs = state.subs.filter(
      (s) => collisionById.has(s.id) && approve.has(s.id),
    );
    const toSync = [...fresh, ...approvedCollisionSubs];
    const skippedCollisions = collisions.length - approvedCollisionSubs.length;

    if (toSync.length === 0) {
      return { ok: true, bills: 0, transactions: 0, skippedCollisions };
    }

    const categoryId = await ensureSubscriptionsCategory(sb, owner);
    const accountId = await firstAccountId(sb, owner);
    const today = todayStr();

    const billRows: Record<string, unknown>[] = [];
    const txnRows: Record<string, unknown>[] = [];

    for (const s of toSync) {
      const billExt = billExtId(s.id);
      if (!state.syncedBillExt.has(billExt)) {
        billRows.push({
          owner_clerk_id: owner,
          name: s.name,
          amount: s.amount ?? 0,
          cadence: s.billing_cycle,
          next_due_date: s.next_due_date,
          category_id: categoryId,
          account_id: accountId,
          currency: s.currency,
          active: true,
          source: "subscription",
          external_id: billExt,
        });
      }

      const txnExt = txnExtId(s.id);
      if (s.amount != null && s.amount > 0 && !state.syncedTxnExt.has(txnExt)) {
        txnRows.push({
          owner_clerk_id: owner,
          account_id: accountId,
          category_id: categoryId,
          txn_date: today,
          payee: s.name,
          memo: `Subscription · ${s.billing_cycle}`,
          kind: "expense",
          amount: round2(toMonthly(s.amount, s.billing_cycle)),
          currency: s.currency,
          cleared: true,
          source: "subscription",
          external_id: txnExt,
        });
      }
    }

    let bills = 0;
    let transactions = 0;
    if (billRows.length) {
      const { error } = await sb.from("budget_bills").insert(billRows);
      if (error) return { ok: false, error: error.message };
      bills = billRows.length;
    }
    if (txnRows.length) {
      const { error } = await sb.from("budget_transactions").insert(txnRows);
      if (error) return { ok: false, error: error.message };
      transactions = txnRows.length;
    }

    return { ok: true, bills, transactions, skippedCollisions };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
