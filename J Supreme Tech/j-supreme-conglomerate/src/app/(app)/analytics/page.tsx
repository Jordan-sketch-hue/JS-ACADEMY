import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const revalidate = 120;

async function fetchAnalytics(range: "today" | "7d" | "30d" = "7d") {
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

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const validRange = (["today", "7d", "30d"].includes(range ?? "") ? range : "7d") as
    | "today"
    | "7d"
    | "30d";

  const data = await fetchAnalytics(validRange);
  return <AnalyticsDashboard data={data} range={validRange} />;
}
