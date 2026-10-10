import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { SalesCampaign } from "@/lib/sales/types";

export async function listCampaigns(owner: string): Promise<SalesCampaign[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("sales_campaigns")
    .select("*")
    .eq("owner_clerk_id", owner)
    .order("created_at", { ascending: true });
  return (data ?? []) as SalesCampaign[];
}

export async function setCampaignStatus(
  owner: string,
  id: string,
  status: "active" | "paused",
): Promise<{ ok: boolean }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false };
  await sb
    .from("sales_campaigns")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("owner_clerk_id", owner)
    .eq("id", id);
  return { ok: true };
}

export async function updateCampaign(
  owner: string,
  id: string,
  patch: Partial<SalesCampaign>,
): Promise<{ ok: boolean }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false };
  const { owner_clerk_id: _o, id: _i, ...rest } = patch;
  void _o;
  void _i;
  await sb
    .from("sales_campaigns")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("owner_clerk_id", owner)
    .eq("id", id);
  return { ok: true };
}
