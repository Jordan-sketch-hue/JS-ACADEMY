"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  createSubscription,
  createSubscriptionCard,
  deleteSubscription,
  deleteSubscriptionCard,
  updateSubscription,
  type CardInput,
  type SubscriptionInput,
  type SubscriptionPatch,
  type SubscriptionStatus,
} from "@/lib/data/subscriptions";
import {
  applySubscriptionSync,
  previewSubscriptionSync,
} from "@/lib/data/subscription-budget-sync";

export async function createSubscriptionAction(input: SubscriptionInput) {
  const owner = await requireOwnerClerkId();
  const result = await createSubscription(owner, input);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/subscriptions");
  return { ok: true as const, subscription: result.subscription };
}

export async function updateSubscriptionAction(id: string, patch: SubscriptionPatch) {
  const owner = await requireOwnerClerkId();
  const result = await updateSubscription(owner, id, patch);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/subscriptions");
  return { ok: true as const, subscription: result.subscription };
}

export async function setSubscriptionStatusAction(
  id: string,
  status: SubscriptionStatus,
) {
  return updateSubscriptionAction(id, { status });
}

export async function deleteSubscriptionAction(id: string) {
  const owner = await requireOwnerClerkId();
  const result = await deleteSubscription(owner, id);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/subscriptions");
  return { ok: true as const };
}

export async function createCardAction(input: CardInput) {
  const owner = await requireOwnerClerkId();
  const result = await createSubscriptionCard(owner, input);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/subscriptions");
  return { ok: true as const, card: result.card };
}

export async function deleteCardAction(id: string) {
  const owner = await requireOwnerClerkId();
  const result = await deleteSubscriptionCard(owner, id);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/subscriptions");
  return { ok: true as const };
}

// ── Budget sync ────────────────────────────────────────────────────────────

export async function previewSubscriptionSyncAction() {
  const owner = await requireOwnerClerkId();
  return previewSubscriptionSync(owner);
}

export async function applySubscriptionSyncAction(approveSubIds: string[] = []) {
  const owner = await requireOwnerClerkId();
  const result = await applySubscriptionSync(owner, { approveSubIds });
  if (result.ok) {
    revalidatePath("/budget");
    revalidatePath("/subscriptions");
  }
  return result;
}

// ── Statement seed ─────────────────────────────────────────────────────────

const STATEMENT_SUBSCRIPTIONS: SubscriptionInput[] = [
  // --- USD tools (billed to NCB/Scotia card) ---
  { name: "Vercel Pro",        amount: 20,    currency: "USD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "Hosting",   notes: "Multiple project deployments" },
  { name: "Railway",           amount: 10,    currency: "USD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "Hosting",   notes: "WhatsApp bot, Discord bots, daily content engine" },
  { name: "Resend",            amount: 20,    currency: "USD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "Email",     notes: "Transactional email across all brands" },
  { name: "Anthropic API",     amount: 50,    currency: "USD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "AI",        notes: "J Supreme Command, JARVIS, Claude agents" },
  { name: "Supabase",          amount: 25,    currency: "USD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "Database",  notes: "Multiple project databases" },
  { name: "Namecheap Domains", amount: 150,   currency: "USD", billing_cycle: "yearly",   next_due_date: "2027-01-01", category: "Domains",   notes: "Fleet of brand domains" },
  { name: "Adobe Creative Cloud", amount: 55, currency: "USD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "Design",    notes: "Brand identity work across 16 brands" },
  { name: "ChatGPT Plus",      amount: 20,    currency: "USD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "AI",        notes: "GPT-4o access" },
  { name: "Codemagic CI/CD",   amount: 49,    currency: "USD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "DevOps",    notes: "iOS/Android pipeline builds" },
  // --- JMD recurring (visible in NCB BPYMT / Scotia withdrawals) ---
  { name: "FLOW / Mobile",     amount: 4000,  currency: "JMD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "Utilities", notes: "Business mobile plan" },
  { name: "JPS / Electricity", amount: 12000, currency: "JMD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "Utilities", notes: "Office/home electricity" },
  { name: "NCB Bank Fees",     amount: 500,   currency: "JMD", billing_cycle: "monthly",  next_due_date: "2026-09-01", category: "Banking",   notes: "Monthly account maintenance fee" },
];

export async function seedStatementSubscriptionsAction() {
  const owner = await requireOwnerClerkId();
  const results: string[] = [];
  for (const input of STATEMENT_SUBSCRIPTIONS) {
    const res = await createSubscription(owner, input);
    if (res.ok) results.push(res.subscription.name);
  }
  revalidatePath("/subscriptions");
  return { ok: true as const, seeded: results.length, names: results };
}
