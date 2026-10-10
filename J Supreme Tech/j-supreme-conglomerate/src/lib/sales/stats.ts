import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { getSalesSettings, dailySendCeiling } from "@/lib/sales/settings";
import { sentTodayCount } from "@/lib/sales/emails";
import type { Region } from "@/lib/sales/types";

export type SalesDashboard = {
  sentToday: number;
  ceiling: number;
  dailyTarget: number;
  sentTotal: number;
  delivered: number;
  opened: number;
  replies: number;
  bounced: number;
  suppressed: number;
  unread: number;
  prospectsTotal: number;
  contactable: number;
  byRegion: { region: Region; total: number; contactable: number }[];
  byStatus: Record<string, number>;
  warmupActive: boolean;
  sendingEnabled: boolean;
  sendingConfigured: boolean;
  hunterConfigured: boolean;
};

async function countWhere(
  table: string,
  owner: string,
  filters: [string, unknown][],
): Promise<number> {
  const sb = getServiceSupabase();
  if (!sb) return 0;
  let q = sb.from(table).select("id", { count: "exact", head: true }).eq("owner_clerk_id", owner);
  for (const [k, v] of filters) q = q.eq(k, v as never);
  const { count } = await q;
  return count ?? 0;
}

export async function getSalesDashboard(owner: string): Promise<SalesDashboard> {
  const sb = getServiceSupabase();
  const s = await getSalesSettings(owner);
  const ceiling = dailySendCeiling(s);
  const sentToday = await sentTodayCount(owner);

  const empty: SalesDashboard = {
    sentToday,
    ceiling,
    dailyTarget: s.daily_target,
    sentTotal: 0,
    delivered: 0,
    opened: 0,
    replies: 0,
    bounced: 0,
    suppressed: 0,
    unread: 0,
    prospectsTotal: 0,
    contactable: 0,
    byRegion: [],
    byStatus: {},
    warmupActive: s.warmup_enabled && ceiling < s.daily_target,
    sendingEnabled: s.sending_enabled,
    sendingConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
    hunterConfigured: Boolean(process.env.HUNTER_API_KEY?.trim()),
  };
  if (!sb) return empty;

  const [
    sentTotal,
    delivered,
    opened,
    bouncedRes,
    suppressed,
    unread,
    prospects,
  ] = await Promise.all([
    sb
      .from("sales_emails")
      .select("id", { count: "exact", head: true })
      .eq("owner_clerk_id", owner)
      .eq("direction", "outbound")
      .in("status", ["sent", "delivered", "opened", "clicked"]),
    countWhere("sales_emails", owner, [["status", "delivered"]]),
    sb
      .from("sales_emails")
      .select("id", { count: "exact", head: true })
      .eq("owner_clerk_id", owner)
      .not("opened_at", "is", null),
    sb
      .from("sales_emails")
      .select("id", { count: "exact", head: true })
      .eq("owner_clerk_id", owner)
      .in("status", ["bounced", "complained"]),
    countWhere("sales_suppressions", owner, []),
    sb
      .from("sales_messages")
      .select("id", { count: "exact", head: true })
      .eq("owner_clerk_id", owner)
      .eq("direction", "inbound")
      .eq("read", false),
    sb.from("sales_prospects").select("region,status").eq("owner_clerk_id", owner),
  ]);

  const rows = (prospects.data ?? []) as { region: Region; status: string }[];
  const byStatus: Record<string, number> = {};
  const regionMap = new Map<Region, { total: number; contactable: number }>();
  let replies = 0;
  for (const r of rows) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    if (r.status === "replied" || r.status === "converted") replies++;
    const m = regionMap.get(r.region) ?? { total: 0, contactable: 0 };
    m.total++;
    if (r.status === "new" || r.status === "queued") m.contactable++;
    regionMap.set(r.region, m);
  }

  const byRegion = (["local", "caribbean", "europe", "americas"] as Region[]).map(
    (region) => ({
      region,
      total: regionMap.get(region)?.total ?? 0,
      contactable: regionMap.get(region)?.contactable ?? 0,
    }),
  );

  return {
    ...empty,
    sentTotal: sentTotal.count ?? 0,
    delivered,
    opened: opened.count ?? 0,
    replies,
    bounced: bouncedRes.count ?? 0,
    suppressed,
    unread: unread.count ?? 0,
    prospectsTotal: rows.length,
    contactable: byRegion.reduce((a, b) => a + b.contactable, 0),
    byRegion,
    byStatus,
  };
}

export type BrandSummary = {
  slug: string;
  sentToday: number;
  prospects: number;
  contactable: number;
  replies: number;
  unread: number;
};

/**
 * Compact per-brand numbers for the overview grid. Three set-based queries for
 * the WHOLE roster (not the heavy per-brand dashboard ×N), aggregated in memory.
 */
export async function getBrandSummaries(
  slugs: string[],
): Promise<Record<string, BrandSummary>> {
  const out: Record<string, BrandSummary> = {};
  for (const s of slugs) {
    out[s] = { slug: s, sentToday: 0, prospects: 0, contactable: 0, replies: 0, unread: 0 };
  }
  const sb = getServiceSupabase();
  if (!sb || slugs.length === 0) return out;

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [emails, prospects, messages] = await Promise.all([
    sb
      .from("sales_emails")
      .select("owner_clerk_id")
      .in("owner_clerk_id", slugs)
      .eq("direction", "outbound")
      .gte("sent_at", todayStart.toISOString()),
    sb.from("sales_prospects").select("owner_clerk_id,status").in("owner_clerk_id", slugs),
    sb
      .from("sales_messages")
      .select("owner_clerk_id")
      .in("owner_clerk_id", slugs)
      .eq("direction", "inbound")
      .eq("read", false),
  ]);

  for (const r of (emails.data ?? []) as { owner_clerk_id: string }[]) {
    if (out[r.owner_clerk_id]) out[r.owner_clerk_id].sentToday++;
  }
  for (const r of (prospects.data ?? []) as { owner_clerk_id: string; status: string }[]) {
    const o = out[r.owner_clerk_id];
    if (!o) continue;
    o.prospects++;
    if (r.status === "new" || r.status === "queued") o.contactable++;
    if (r.status === "replied" || r.status === "converted") o.replies++;
  }
  for (const r of (messages.data ?? []) as { owner_clerk_id: string }[]) {
    if (out[r.owner_clerk_id]) out[r.owner_clerk_id].unread++;
  }
  return out;
}
