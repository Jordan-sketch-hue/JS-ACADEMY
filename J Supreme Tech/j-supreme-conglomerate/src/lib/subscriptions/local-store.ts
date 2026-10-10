"use client";

import type {
  CardInput,
  Subscription,
  SubscriptionCard,
  SubscriptionInput,
  SubscriptionPatch,
} from "@/lib/data/subscriptions";
import { DEFAULT_CARD_SPECS } from "@/lib/data/subscriptions";

/**
 * Browser-only mirror of the subscriptions data lib (used when Supabase
 * persistence is off). Seeds NCB + Scotia on first use; the server actions
 * take over automatically once Supabase is configured.
 */

const CARDS_KEY = (o: string) => `jsc-sub-cards:${o}`;
const SUBS_KEY = (o: string) => `jsc-subs:${o}`;

function read<T>(key: string): T[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, rows: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

export function loadLocalCards(owner: string): SubscriptionCard[] {
  const existing = read<SubscriptionCard>(CARDS_KEY(owner));
  if (existing && existing.length) return existing;
  const now = new Date().toISOString();
  const seeded: SubscriptionCard[] = DEFAULT_CARD_SPECS.map((spec, i) => ({
    id: crypto.randomUUID(),
    owner_clerk_id: owner,
    name: spec.name,
    last4: null,
    color: spec.color,
    sort_order: i,
    created_at: now,
  }));
  write(CARDS_KEY(owner), seeded);
  return seeded;
}

export function createLocalCard(owner: string, input: CardInput): SubscriptionCard | null {
  const name = input.name?.trim();
  if (!name) return null;
  const cards = loadLocalCards(owner);
  const card: SubscriptionCard = {
    id: crypto.randomUUID(),
    owner_clerk_id: owner,
    name,
    last4: input.last4?.trim()?.replace(/\D/g, "").slice(0, 4) || null,
    color: input.color?.trim() || null,
    sort_order: cards.length,
    created_at: new Date().toISOString(),
  };
  cards.push(card);
  write(CARDS_KEY(owner), cards);
  return card;
}

export function removeLocalCard(owner: string, cardId: string): void {
  const cards = loadLocalCards(owner).filter((c) => c.id !== cardId);
  write(CARDS_KEY(owner), cards);
  const subs = loadLocalSubscriptions(owner);
  let touched = false;
  for (const s of subs) {
    if (s.card_id === cardId) {
      s.card_id = null;
      touched = true;
    }
  }
  if (touched) write(SUBS_KEY(owner), subs);
}

export function loadLocalSubscriptions(owner: string): Subscription[] {
  const rows = read<Subscription>(SUBS_KEY(owner)) ?? [];
  return rows
    .slice()
    .sort((a, b) => (a.next_due_date ?? "9999").localeCompare(b.next_due_date ?? "9999"));
}

function applyInput(s: Subscription, input: SubscriptionPatch) {
  if (input.name !== undefined) s.name = input.name?.trim() || s.name;
  if (input.card_id !== undefined) s.card_id = input.card_id?.trim() || null;
  if (input.amount !== undefined) {
    const n = Number(input.amount);
    s.amount = input.amount == null || !Number.isFinite(n) ? null : n;
  }
  if (input.currency !== undefined) s.currency = (input.currency || "USD").toUpperCase();
  if (input.billing_cycle !== undefined) s.billing_cycle = input.billing_cycle;
  if (input.next_due_date !== undefined) {
    const d = input.next_due_date?.trim();
    s.next_due_date = d && /^\d{4}-\d{2}-\d{2}/.test(d) ? d.slice(0, 10) : null;
  }
  if (input.category !== undefined) s.category = input.category?.trim() || null;
  if (input.notes !== undefined) s.notes = input.notes?.trim() || null;
  if (input.status !== undefined) s.status = input.status;
}

export function createLocalSubscription(
  owner: string,
  input: SubscriptionInput,
): Subscription | null {
  if (!input.name?.trim()) return null;
  const now = new Date().toISOString();
  const sub: Subscription = {
    id: crypto.randomUUID(),
    owner_clerk_id: owner,
    card_id: null,
    name: input.name.trim(),
    amount: null,
    currency: "USD",
    billing_cycle: "monthly",
    next_due_date: null,
    category: null,
    notes: null,
    status: "active",
    created_at: now,
    updated_at: now,
  };
  applyInput(sub, input);
  const subs = read<Subscription>(SUBS_KEY(owner)) ?? [];
  subs.push(sub);
  write(SUBS_KEY(owner), subs);
  return sub;
}

export function updateLocalSubscription(
  owner: string,
  id: string,
  patch: SubscriptionPatch,
): Subscription | null {
  const subs = read<Subscription>(SUBS_KEY(owner)) ?? [];
  const s = subs.find((x) => x.id === id);
  if (!s) return null;
  applyInput(s, patch);
  s.updated_at = new Date().toISOString();
  write(SUBS_KEY(owner), subs);
  return s;
}

export function removeLocalSubscription(owner: string, id: string): boolean {
  const subs = read<Subscription>(SUBS_KEY(owner)) ?? [];
  const next = subs.filter((x) => x.id !== id);
  if (next.length === subs.length) return false;
  write(SUBS_KEY(owner), next);
  return true;
}
