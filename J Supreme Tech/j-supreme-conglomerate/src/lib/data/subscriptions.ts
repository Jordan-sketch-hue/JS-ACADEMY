import { getServiceSupabase } from "@/lib/supabase/admin";

export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly";
export type SubscriptionStatus = "active" | "paused" | "canceled";

export const BILLING_CYCLE_VALUES: BillingCycle[] = [
  "weekly",
  "monthly",
  "quarterly",
  "yearly",
];
export const SUBSCRIPTION_STATUS_VALUES: SubscriptionStatus[] = [
  "active",
  "paused",
  "canceled",
];

export type SubscriptionCard = {
  id: string;
  owner_clerk_id: string;
  name: string;
  last4: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
};

export type Subscription = {
  id: string;
  owner_clerk_id: string;
  card_id: string | null;
  name: string;
  amount: number | null;
  currency: string;
  billing_cycle: BillingCycle;
  next_due_date: string | null;
  category: string | null;
  notes: string | null;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
};

export type CardInput = { name: string; last4?: string | null; color?: string | null };

export type SubscriptionInput = {
  name?: string | null;
  card_id?: string | null;
  amount?: number | null;
  currency?: string | null;
  billing_cycle?: BillingCycle;
  next_due_date?: string | null;
  category?: string | null;
  notes?: string | null;
  status?: SubscriptionStatus;
};

export type SubscriptionPatch = SubscriptionInput;

export type SubscriptionResult =
  | { ok: true; subscription: Subscription }
  | { ok: false; error: string };
export type CardResult =
  | { ok: true; card: SubscriptionCard }
  | { ok: false; error: string };

/** Cards the operator starts with; more can be added in the UI. */
export const DEFAULT_CARD_SPECS: { name: string; color: string }[] = [
  { name: "NCB", color: "#1f4fa3" },
  { name: "Scotia", color: "#d6001c" },
];

const CARD_SELECT = "id,owner_clerk_id,name,last4,color,sort_order,created_at";
const SUB_SELECT =
  "id,owner_clerk_id,card_id,name,amount,currency,billing_cycle,next_due_date,category,notes,status,created_at,updated_at";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function iso(d = new Date()) {
  return d.toISOString();
}

function formatSupabaseNetworkError(message: string): string {
  if (
    !/fetch failed|failed to fetch|networkerror|econnrefused|enotfound|eai_again|etimedout/i.test(
      message,
    )
  ) {
    return message;
  }
  return `${message} — Could not reach Supabase from this server. Confirm the HTTPS Project URL + SUPABASE_SERVICE_ROLE_KEY and that the project isn't paused.`;
}

function tableHint(message: string, code: string): string {
  return /relation|does not exist|schema cache/i.test(message) || code === "42P01"
    ? " Run supabase/migrations/20260531130000_subscriptions.sql in your project’s SQL editor, then try again."
    : "";
}

function normCycle(raw: unknown): BillingCycle {
  const s = String(raw ?? "monthly").toLowerCase().trim();
  return (BILLING_CYCLE_VALUES as string[]).includes(s)
    ? (s as BillingCycle)
    : "monthly";
}
function normStatus(raw: unknown): SubscriptionStatus {
  const s = String(raw ?? "active").toLowerCase().trim();
  return (SUBSCRIPTION_STATUS_VALUES as string[]).includes(s)
    ? (s as SubscriptionStatus)
    : "active";
}
function normCurrency(raw: unknown): string {
  const s = String(raw ?? "USD").toUpperCase().trim();
  return /^[A-Z]{3}$/.test(s) ? s : "USD";
}
function normAmount(raw: number | null | undefined): number | null {
  if (raw == null || raw === ("" as unknown)) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
function normDate(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null;
  const s = String(raw).trim();
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : null;
}

// ---- per-process fallback (no Supabase env) -------------------------------
type Mem = { cards: SubscriptionCard[]; subs: Subscription[] };
const mem = new Map<string, Mem>();
function bucket(owner: string): Mem {
  let b = mem.get(owner);
  if (!b) {
    const now = iso();
    b = {
      cards: DEFAULT_CARD_SPECS.map((spec, i) => ({
        id: crypto.randomUUID(),
        owner_clerk_id: owner,
        name: spec.name,
        last4: null,
        color: spec.color,
        sort_order: i,
        created_at: now,
      })),
      subs: [],
    };
    mem.set(owner, b);
  }
  return b;
}

// ---- cards ----------------------------------------------------------------
async function ensureDefaultCards(owner: string): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  try {
    const { count, error } = await sb
      .from("subscription_cards")
      .select("id", { count: "exact", head: true })
      .eq("owner_clerk_id", owner);
    if (error || (count ?? 0) > 0) return;
    await sb.from("subscription_cards").insert(
      DEFAULT_CARD_SPECS.map((spec, i) => ({
        owner_clerk_id: owner,
        name: spec.name,
        color: spec.color,
        sort_order: i,
      })),
    );
  } catch {
    /* ignore */
  }
}

export async function listSubscriptionCards(
  owner: string,
): Promise<SubscriptionCard[]> {
  const sb = getServiceSupabase();
  if (!sb) {
    return bucket(owner)
      .cards.slice()
      .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
  }
  await ensureDefaultCards(owner);
  try {
    const { data, error } = await sb
      .from("subscription_cards")
      .select(CARD_SELECT)
      .eq("owner_clerk_id", owner)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) return [];
    return (data ?? []) as SubscriptionCard[];
  } catch {
    return [];
  }
}

export async function createSubscriptionCard(
  owner: string,
  input: CardInput,
): Promise<CardResult> {
  const name = input.name?.trim();
  if (!name) return { ok: false, error: "Card name is required." };
  const last4 = input.last4?.trim()?.replace(/\D/g, "").slice(0, 4) || null;
  const color = input.color?.trim() || null;

  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(owner);
    const card: SubscriptionCard = {
      id: crypto.randomUUID(),
      owner_clerk_id: owner,
      name,
      last4,
      color,
      sort_order: b.cards.length,
      created_at: iso(),
    };
    b.cards.push(card);
    return { ok: true, card };
  }
  try {
    const { data, error } = await sb
      .from("subscription_cards")
      .insert({ owner_clerk_id: owner, name, last4, color, sort_order: 100 })
      .select(CARD_SELECT)
      .single();
    if (error) {
      const code =
        "code" in error ? String((error as { code?: string }).code ?? "") : "";
      const msg = (error as { message?: string }).message ?? "Could not save card.";
      return { ok: false, error: `${msg}${tableHint(msg, code)}` };
    }
    return { ok: true, card: data as SubscriptionCard };
  } catch (e) {
    return {
      ok: false,
      error: formatSupabaseNetworkError(e instanceof Error ? e.message : "Unknown error"),
    };
  }
}

export async function deleteSubscriptionCard(
  owner: string,
  cardId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(owner);
    b.cards = b.cards.filter((c) => c.id !== cardId);
    b.subs.forEach((s) => {
      if (s.card_id === cardId) s.card_id = null;
    });
    return { ok: true };
  }
  try {
    const { error } = await sb
      .from("subscription_cards")
      .delete()
      .eq("id", cardId)
      .eq("owner_clerk_id", owner);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

// ---- subscriptions --------------------------------------------------------
function buildRow(owner: string, input: SubscriptionInput) {
  return {
    owner_clerk_id: owner,
    card_id:
      input.card_id && UUID_RE.test(String(input.card_id).trim())
        ? String(input.card_id).trim()
        : null,
    name: input.name?.trim() || "Untitled subscription",
    amount: normAmount(input.amount),
    currency: normCurrency(input.currency),
    billing_cycle: normCycle(input.billing_cycle),
    next_due_date: normDate(input.next_due_date),
    category: input.category?.trim() || null,
    notes: input.notes?.trim() || null,
    status: normStatus(input.status),
  };
}

export async function listSubscriptions(owner: string): Promise<Subscription[]> {
  const sb = getServiceSupabase();
  if (!sb) {
    return bucket(owner)
      .subs.slice()
      .sort((a, b) => (a.next_due_date ?? "9999").localeCompare(b.next_due_date ?? "9999"));
  }
  try {
    const { data, error } = await sb
      .from("subscriptions")
      .select(SUB_SELECT)
      .eq("owner_clerk_id", owner)
      .order("next_due_date", { ascending: true, nullsFirst: false });
    if (error) return [];
    return (data ?? []).map((row) => ({
      ...(row as Subscription),
      amount: (row as Subscription).amount != null ? Number((row as Subscription).amount) : null,
      billing_cycle: normCycle((row as Subscription).billing_cycle),
      status: normStatus((row as Subscription).status),
    }));
  } catch {
    return [];
  }
}

export async function createSubscription(
  owner: string,
  input: SubscriptionInput,
): Promise<SubscriptionResult> {
  if (!input.name?.trim()) return { ok: false, error: "Subscription name is required." };
  const row = buildRow(owner, input);

  const sb = getServiceSupabase();
  if (!sb) {
    const now = iso();
    const subscription: Subscription = { id: crypto.randomUUID(), ...row, created_at: now, updated_at: now };
    bucket(owner).subs.push(subscription);
    return { ok: true, subscription };
  }
  try {
    const { data, error } = await sb
      .from("subscriptions")
      .insert(row)
      .select(SUB_SELECT)
      .single();
    if (error) {
      const code =
        "code" in error ? String((error as { code?: string }).code ?? "") : "";
      const msg = (error as { message?: string }).message ?? "Could not save subscription.";
      return { ok: false, error: `${msg}${tableHint(msg, code)}` };
    }
    return {
      ok: true,
      subscription: { ...(data as Subscription), amount: data.amount != null ? Number(data.amount) : null },
    };
  } catch (e) {
    return {
      ok: false,
      error: formatSupabaseNetworkError(e instanceof Error ? e.message : "Unknown error"),
    };
  }
}

export async function updateSubscription(
  owner: string,
  id: string,
  patch: SubscriptionPatch,
): Promise<SubscriptionResult> {
  const updates: Record<string, unknown> = {};
  if (patch.name !== undefined) {
    const n = patch.name?.trim();
    if (!n) return { ok: false, error: "Subscription name is required." };
    updates.name = n;
  }
  if (patch.card_id !== undefined) {
    updates.card_id =
      patch.card_id && UUID_RE.test(String(patch.card_id).trim())
        ? String(patch.card_id).trim()
        : null;
  }
  if (patch.amount !== undefined) updates.amount = normAmount(patch.amount);
  if (patch.currency !== undefined) updates.currency = normCurrency(patch.currency);
  if (patch.billing_cycle !== undefined) updates.billing_cycle = normCycle(patch.billing_cycle);
  if (patch.next_due_date !== undefined) updates.next_due_date = normDate(patch.next_due_date);
  if (patch.category !== undefined) updates.category = patch.category?.trim() || null;
  if (patch.notes !== undefined) updates.notes = patch.notes?.trim() || null;
  if (patch.status !== undefined) updates.status = normStatus(patch.status);

  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(owner);
    const s = b.subs.find((x) => x.id === id);
    if (!s) return { ok: false, error: "Subscription not found." };
    Object.assign(s, updates, { updated_at: iso() });
    return { ok: true, subscription: s };
  }
  try {
    const { data, error } = await sb
      .from("subscriptions")
      .update(updates)
      .eq("id", id)
      .eq("owner_clerk_id", owner)
      .select(SUB_SELECT)
      .single();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Subscription not found." };
    return {
      ok: true,
      subscription: { ...(data as Subscription), amount: data.amount != null ? Number(data.amount) : null },
    };
  } catch (e) {
    return {
      ok: false,
      error: formatSupabaseNetworkError(e instanceof Error ? e.message : "Unknown error"),
    };
  }
}

export async function deleteSubscription(
  owner: string,
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(owner);
    const i = b.subs.findIndex((x) => x.id === id);
    if (i === -1) return { ok: false, error: "Subscription not found." };
    b.subs.splice(i, 1);
    return { ok: true };
  }
  try {
    const { error } = await sb
      .from("subscriptions")
      .delete()
      .eq("id", id)
      .eq("owner_clerk_id", owner);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
