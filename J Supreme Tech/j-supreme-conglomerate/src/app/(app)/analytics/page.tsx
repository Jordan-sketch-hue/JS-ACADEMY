import { createClient } from "@supabase/supabase-js";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const revalidate = 120;

type Range = "today" | "7d" | "30d";
type Site = "jst" | "comms" | "combined";

async function fetchJstAnalytics(range: Range) {
  const token = process.env.JST_ANALYTICS_READ_TOKEN;
  const base = process.env.JST_SITE_URL ?? "https://jsupremetech.online";
  if (!token) return null;
  try {
    const res = await fetch(`${base}/api/track?range=${range}&token=${token}`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function commsDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function fetchCommsAnalytics(range: Range) {
  const sb = commsDb();
  if (!sb) return null;

  const since = new Date(
    Date.now() -
      (range === "today" ? 0 : range === "7d" ? 7 : 30) * 86400_000,
  );
  if (range === "today") since.setHours(0, 0, 0, 0);
  const sinceIso = since.toISOString();

  const SITE = "communications.jsupremetech.online";

  const { data: events } = await sb
    .from("jst_analytics_events")
    .select("*")
    .eq("site", SITE)
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(500);

  const rows = events ?? [];

  const dailySeries: Record<string, number> = {};
  for (const e of rows) {
    if (e.event !== "page_view") continue;
    const day = e.created_at.slice(0, 10);
    dailySeries[day] = (dailySeries[day] ?? 0) + 1;
  }

  const pageMap: Record<string, number> = {};
  for (const e of rows.filter((e: { event: string }) => e.event === "page_view")) {
    pageMap[e.page] = (pageMap[e.page] ?? 0) + 1;
  }
  const topPages = Object.entries(pageMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }));

  const utmMap: Record<string, number> = {};
  for (const e of rows) {
    if (!e.utm_source) continue;
    const key = `${e.utm_source}|${e.utm_medium ?? ""}`;
    utmMap[key] = (utmMap[key] ?? 0) + 1;
  }
  const utmSources = Object.entries(utmMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([k, sessions]) => {
      const [utm_source, utm_medium] = k.split("|");
      return { utm_source, utm_medium: utm_medium || null, sessions };
    });

  const uniqueVisitorsToday = new Set(
    rows
      .filter((e: { created_at: string; visitor_hash: string }) => {
        const t = new Date(e.created_at).getTime();
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        return t >= start.getTime();
      })
      .map((e: { visitor_hash: string }) => e.visitor_hash),
  ).size;

  return {
    range,
    site: "comms",
    totalEvents: rows.length,
    uniqueVisitorsToday,
    pageViews: rows.filter((e: { event: string }) => e.event === "page_view").length,
    ctaClicks: rows.filter((e: { event: string }) => e.event === "cta_click").length,
    outboundClicks: rows.filter((e: { event: string }) => e.event === "outbound_click").length,
    affiliateClicks: rows.filter((e: { event: string }) => e.event === "affiliate_click").length,
    articleReads: rows.filter((e: { event: string }) => e.event === "article_read").length,
    scrollDepthEvents: rows.filter((e: { event: string }) => e.event === "scroll_depth").length,
    formStarts: rows.filter((e: { event: string }) => e.event === "form_start").length,
    formSubmits: rows.filter((e: { event: string }) => e.event === "form_submit").length,
    newsletterSignups: rows.filter((e: { event: string }) => e.event === "newsletter_signup").length,
    trialSignups: 0,
    intakeSubmissions: 0,
    dailySeries: Object.entries(dailySeries)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views })),
    topPages,
    utmSources,
    recentEvents: rows.slice(0, 50),
  };
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; site?: string }>;
}) {
  const params = await searchParams;
  const range = (["today", "7d", "30d"].includes(params.range ?? "") ? params.range : "7d") as Range;
  const site = (["jst", "comms", "combined"].includes(params.site ?? "") ? params.site : "jst") as Site;

  let jstData = null;
  let commsData = null;

  if (site === "jst" || site === "combined") {
    jstData = await fetchJstAnalytics(range);
  }
  if (site === "comms" || site === "combined") {
    commsData = await fetchCommsAnalytics(range);
  }

  return (
    <AnalyticsDashboard
      data={site === "comms" ? commsData : jstData}
      commsData={commsData}
      site={site}
      range={range}
    />
  );
}
