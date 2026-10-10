import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  type Region,
  type SalesProspect,
  type ProspectStatus,
  type ServiceFocus,
} from "@/lib/sales/types";

export type NewProspect = {
  company: string;
  domain?: string | null;
  contact_name?: string | null;
  first_name?: string | null;
  title?: string | null;
  email: string;
  email_status?: string;
  email_confidence?: number | null;
  region?: Region;
  country?: string | null;
  industry?: string | null;
  service_focus?: ServiceFocus;
  source?: "hunter" | "csv" | "manual" | "places" | "scrape" | "directory";
  criteria?: Record<string, unknown>;
  tags?: string[];
  notes?: string | null;
};

/** A simple, transparent fit score (0-100) used to prioritise the daily queue. */
export function scoreProspect(p: NewProspect): number {
  let s = 40;
  if ((p.email_confidence ?? 0) >= 90) s += 25;
  else if ((p.email_confidence ?? 0) >= 80) s += 15;
  if (p.email_status === "verified") s += 10;
  if (p.contact_name || p.first_name) s += 10;
  if (p.title) s += 8;
  if (p.industry) s += 5;
  if (p.domain) s += 2;
  return Math.max(0, Math.min(100, s));
}

export async function listProspects(
  owner: string,
  opts: { region?: Region; status?: ProspectStatus; limit?: number; search?: string } = {},
): Promise<SalesProspect[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  let q = sb
    .from("sales_prospects")
    .select("*")
    .eq("owner_clerk_id", owner)
    .order("score", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 500);
  if (opts.region) q = q.eq("region", opts.region);
  if (opts.status) q = q.eq("status", opts.status);
  if (opts.search) q = q.or(`company.ilike.%${opts.search}%,email.ilike.%${opts.search}%`);
  const { data } = await q;
  return (data ?? []) as SalesProspect[];
}

/**
 * Insert prospects, skipping any whose email already exists for this owner or is
 * on the suppression list. Returns the count actually added.
 */
export async function upsertProspects(
  owner: string,
  rows: NewProspect[],
): Promise<{ added: number; skipped: number }> {
  const sb = getServiceSupabase();
  if (!sb) return { added: 0, skipped: rows.length };

  const clean = rows
    .map((r) => ({ ...r, email: r.email?.toLowerCase().trim() }))
    .filter((r) => r.email && /.+@.+\..+/.test(r.email));

  if (!clean.length) return { added: 0, skipped: rows.length };

  const emails = clean.map((r) => r.email);
  const [{ data: existing }, { data: suppressed }] = await Promise.all([
    sb.from("sales_prospects").select("email").eq("owner_clerk_id", owner).in("email", emails),
    sb.from("sales_suppressions").select("email").eq("owner_clerk_id", owner).in("email", emails),
  ]);
  const blocked = new Set<string>([
    ...((existing ?? []) as { email: string }[]).map((e) => e.email),
    ...((suppressed ?? []) as { email: string }[]).map((e) => e.email),
  ]);

  const toInsert = clean
    .filter((r) => !blocked.has(r.email))
    // Dedupe within this batch too.
    .filter((r, i, arr) => arr.findIndex((x) => x.email === r.email) === i)
    .map((r) => ({
      owner_clerk_id: owner,
      company: r.company?.trim() || "Unknown company",
      domain: r.domain ?? null,
      contact_name: r.contact_name ?? null,
      first_name: r.first_name ?? null,
      title: r.title ?? null,
      email: r.email,
      email_status: r.email_status ?? "unverified",
      email_confidence: r.email_confidence ?? null,
      region: r.region ?? "local",
      country: r.country ?? null,
      industry: r.industry ?? null,
      service_focus: r.service_focus ?? "tech",
      source: r.source ?? "manual",
      criteria: r.criteria ?? {},
      score: scoreProspect(r),
      status: "new" as ProspectStatus,
      tags: r.tags ?? [],
      notes: r.notes ?? null,
    }));

  if (!toInsert.length) return { added: 0, skipped: clean.length };
  const { error } = await sb.from("sales_prospects").insert(toInsert);
  if (error) return { added: 0, skipped: clean.length };
  return { added: toInsert.length, skipped: clean.length - toInsert.length };
}

export async function updateProspect(
  owner: string,
  id: string,
  patch: Partial<SalesProspect>,
): Promise<{ ok: boolean }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false };
  const { owner_clerk_id: _o, id: _i, ...rest } = patch;
  void _o;
  void _i;
  await sb
    .from("sales_prospects")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("owner_clerk_id", owner)
    .eq("id", id);
  return { ok: true };
}

export async function deleteProspect(owner: string, id: string): Promise<{ ok: boolean }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false };
  await sb.from("sales_prospects").delete().eq("owner_clerk_id", owner).eq("id", id);
  return { ok: true };
}

/** Count of contactable prospects (new/queued) grouped by region. */
export async function countContactableByRegion(
  owner: string,
): Promise<Record<string, number>> {
  const sb = getServiceSupabase();
  if (!sb) return {};
  const { data } = await sb
    .from("sales_prospects")
    .select("region,status")
    .eq("owner_clerk_id", owner)
    .in("status", ["new", "queued"]);
  const out: Record<string, number> = {};
  for (const r of (data ?? []) as { region: string }[]) {
    out[r.region] = (out[r.region] ?? 0) + 1;
  }
  return out;
}

/**
 * Pick the next N fresh prospects for sending, balanced across the enabled
 * regions so every market gets touched each day (round-robin by score).
 */
export async function selectForSend(
  owner: string,
  regions: Region[],
  limit: number,
): Promise<SalesProspect[]> {
  const sb = getServiceSupabase();
  if (!sb || limit <= 0) return [];
  const perRegion = Math.max(1, Math.ceil(limit / Math.max(1, regions.length)));
  const buckets: SalesProspect[][] = [];
  for (const region of regions) {
    const { data } = await sb
      .from("sales_prospects")
      .select("*")
      .eq("owner_clerk_id", owner)
      .eq("region", region)
      .eq("status", "new")
      .order("score", { ascending: false })
      .limit(perRegion * 2);
    buckets.push((data ?? []) as SalesProspect[]);
  }
  // Round-robin interleave so regions stay balanced even if some are thin.
  const out: SalesProspect[] = [];
  let i = 0;
  while (out.length < limit && buckets.some((b) => b.length > i)) {
    for (const b of buckets) {
      if (b[i]) out.push(b[i]);
      if (out.length >= limit) break;
    }
    i++;
  }
  return out.slice(0, limit);
}
