import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { SalesSuppression, SuppressionReason } from "@/lib/sales/types";

export async function isSuppressed(owner: string, email: string): Promise<boolean> {
  const sb = getServiceSupabase();
  if (!sb) return false;
  const { data } = await sb
    .from("sales_suppressions")
    .select("id")
    .eq("owner_clerk_id", owner)
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return Boolean(data);
}

/** Idempotent: adding an already-suppressed email is a no-op. */
export async function addSuppression(
  owner: string,
  email: string,
  reason: SuppressionReason,
  source?: string,
): Promise<{ ok: boolean; error?: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Cloud persistence is not configured." };
  const lower = email.toLowerCase().trim();
  const { error } = await sb
    .from("sales_suppressions")
    .upsert(
      { owner_clerk_id: owner, email: lower, reason, source: source ?? null },
      { onConflict: "owner_clerk_id,email" },
    );
  if (error) return { ok: false, error: error.message };

  // Reflect on the prospect record so the UI + engine skip it immediately.
  const status =
    reason === "bounced" ? "bounced" : reason === "complained" ? "unsubscribed" : reason === "unsubscribed" ? "unsubscribed" : "suppressed";
  await sb
    .from("sales_prospects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("owner_clerk_id", owner)
    .eq("email", lower);
  return { ok: true };
}

export async function listSuppressions(
  owner: string,
  limit = 200,
): Promise<SalesSuppression[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("sales_suppressions")
    .select("*")
    .eq("owner_clerk_id", owner)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as SalesSuppression[];
}

export async function removeSuppression(
  owner: string,
  email: string,
): Promise<{ ok: boolean }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false };
  await sb
    .from("sales_suppressions")
    .delete()
    .eq("owner_clerk_id", owner)
    .eq("email", email.toLowerCase());
  return { ok: true };
}
