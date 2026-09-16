"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Site = "jst" | "comms" | "combined";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  ArrowUpRight,
  BarChart2,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MousePointerClick,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Design-system color tokens (matches conglomerate's CSS variables)
const C = {
  primary: "hsl(var(--primary))",
  chart1: "#6366f1", // indigo — page views / primary series
  chart2: "#22c55e", // green — conversions / success
  chart3: "#f59e0b", // amber — CTAs / interactions
  chart4: "#ec4899", // pink — trial / newsletter signups
  muted: "hsl(var(--muted-foreground))",
  grid: "hsl(var(--border))",
};

type Range = "today" | "7d" | "30d";

type AnalyticsData = {
  range: Range;
  site?: Site;
  totalEvents: number;
  uniqueVisitorsToday: number;
  pageViews: number;
  ctaClicks: number;
  outboundClicks?: number;
  affiliateClicks?: number;
  articleReads?: number;
  formStarts: number;
  formSubmits: number;
  newsletterSignups: number;
  trialSignups: number;
  intakeSubmissions: number;
  dailySeries: { date: string; views: number }[];
  topPages: { page: string; views: number }[];
  utmSources: { utm_source: string; utm_medium: string | null; sessions: number }[];
  recentEvents: {
    id: number;
    event: string;
    page: string;
    utm_source: string | null;
    props: Record<string, unknown>;
    created_at: string;
  }[];
};

function StatTile({
  label,
  value,
  icon: Icon,
  sub,
  accent = false,
}: {
  label: string;
  value: number | string;
  icon: React.ElementType;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p
              className={cn(
                "mt-1 text-3xl font-bold tabular-nums",
                accent && "text-primary",
              )}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            {sub && (
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            )}
          </div>
          <div className="rounded-lg bg-muted p-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FunnelBar({
  label,
  value,
  max,
  prev,
  color,
}: {
  label: string;
  value: number;
  max: number;
  prev?: number;
  color: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const dropOff = prev != null && prev > 0 ? Math.round(((prev - value) / prev) * 100) : null;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-right text-xs text-muted-foreground">
        {label}
      </span>
      <div className="flex-1 overflow-hidden rounded-full bg-muted" style={{ height: 8 }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-semibold tabular-nums">
        {value}
      </span>
      <span className="w-12 shrink-0 text-right text-xs tabular-nums">
        {dropOff != null && dropOff > 0 ? (
          <span className="text-destructive">−{dropOff}%</span>
        ) : (
          <span className="text-muted-foreground">{pct}%</span>
        )}
      </span>
    </div>
  );
}

const RANGE_LABELS: Record<Range, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

const EVENT_LABELS: Record<string, string> = {
  page_view: "Page View",
  cta_click: "CTA Click",
  form_start: "Form Started",
  form_submit: "Form Submitted",
  newsletter_signup: "Newsletter Signup",
  trial_signup: "Trial Signup",
  intake_submit: "Intake Submitted",
  hover_dwell: "Hover / Dwell",
};

function formatEventTime(iso: string, range: Range): string {
  const d = new Date(iso);
  if (range === "today") {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const EVENT_COLORS: Record<string, string> = {
  page_view: C.chart1,
  cta_click: C.chart3,
  form_start: C.chart3,
  form_submit: C.chart2,
  newsletter_signup: C.chart4,
  trial_signup: C.chart4,
  intake_submit: C.chart2,
};

function RangePicker({ current, site }: { current: Range; site: Site }) {
  const router = useRouter();
  const options: { label: string; value: Range }[] = [
    { label: "Today", value: "today" },
    { label: "7 days", value: "7d" },
    { label: "30 days", value: "30d" },
  ];
  return (
    <div className="flex rounded-lg border border-border bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => router.push(`?range=${o.value}&site=${site}`)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            current === o.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function SitePicker({ current, range }: { current: Site; range: Range }) {
  const router = useRouter();
  const options: { label: string; value: Site }[] = [
    { label: "JST Website", value: "jst" },
    { label: "Communications", value: "comms" },
    { label: "Combined", value: "combined" },
  ];
  return (
    <div className="flex rounded-lg border border-border bg-muted p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => router.push(`?range=${range}&site=${o.value}`)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors",
            current === o.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-sm font-semibold tabular-nums">
          {p.value.toLocaleString()} {p.name}
        </p>
      ))}
    </div>
  );
};

function DashboardInner({
  data,
  range,
  site,
}: {
  data: AnalyticsData | null;
  range: Range;
  site: Site;
}) {
  if (!data) {
    return (
      <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-border">
        <div className="text-center">
          <BarChart2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">Analytics not configured</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              JST_ANALYTICS_READ_TOKEN
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 py-0.5">JST_SITE_URL</code>{" "}
            to your Vercel environment.
          </p>
        </div>
      </div>
    );
  }

  const conversionRate =
    data.formStarts > 0
      ? Math.round((data.formSubmits / data.formStarts) * 100)
      : 0;

  const funnelMax = Math.max(
    data.pageViews,
    data.formStarts,
    data.formSubmits,
    1,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">JST Site Analytics</h1>
          <p className="text-sm text-muted-foreground">
            {site === "comms"
              ? "communications.jsupremetech.online"
              : site === "combined"
                ? "jsupremetech.online + communications"
                : "jsupremetech.online"}{" "}
            — {RANGE_LABELS[range]} · synced{" "}
            {new Date().toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SitePicker current={site} range={range} />
          <RangePicker current={range} site={site} />
          <a
            href={site === "comms" ? "https://communications.jsupremetech.online" : "https://jsupremetech.online"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            Open site
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* KPI tiles — two rows */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile
          label="Visitors today"
          value={data.uniqueVisitorsToday}
          icon={Users}
          accent
        />
        <StatTile
          label="Page views"
          value={data.pageViews}
          icon={Activity}
          sub={RANGE_LABELS[range]}
        />
        <StatTile
          label="CTA clicks"
          value={data.ctaClicks}
          icon={MousePointerClick}
        />
        <StatTile
          label="Form starts"
          value={data.formStarts}
          icon={FileText}
          sub={`${conversionRate}% submit rate`}
        />
        <StatTile
          label="Leads captured"
          value={data.intakeSubmissions + data.trialSignups}
          icon={TrendingUp}
          sub={`${data.intakeSubmissions} intake · ${data.trialSignups} trial`}
          accent
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label="Newsletter signups"
          value={data.newsletterSignups}
          icon={Mail}
        />
        {site === "comms" || site === "combined" ? (
          <>
            <StatTile
              label="Article reads"
              value={data.articleReads ?? 0}
              icon={FileText}
            />
            <StatTile
              label="Outbound clicks"
              value={data.outboundClicks ?? 0}
              icon={ArrowUpRight}
            />
            <StatTile
              label="Affiliate clicks"
              value={data.affiliateClicks ?? 0}
              icon={Zap}
            />
          </>
        ) : (
          <>
            <StatTile
              label="Trial signups"
              value={data.trialSignups}
              icon={Zap}
            />
            <StatTile
              label="Intake submissions"
              value={data.intakeSubmissions}
              icon={ArrowUpRight}
            />
            <StatTile
              label="Total events"
              value={data.totalEvents}
              icon={BarChart2}
            />
          </>
        )}
      </div>

      {/* Daily trend chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Daily page views
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.dailySeries.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
              No data yet — tracking will populate after first visitors.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={data.dailySeries}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.chart1} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.chart1} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={C.grid}
                  strokeOpacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: C.muted }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis
                  tick={{ fontSize: 10, fill: C.muted }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="views"
                  stroke={C.chart1}
                  strokeWidth={2}
                  fill="url(#viewsGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: C.chart1, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Bottom grid: Top pages + UTM sources + Funnel */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top pages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Top pages</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topPages.length === 0 ? (
              <p className="text-xs text-muted-foreground">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={data.topPages.slice(0, 8)}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke={C.grid}
                    strokeOpacity={0.4}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 9, fill: C.muted }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="page"
                    width={90}
                    tick={{ fontSize: 9, fill: C.muted }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: string) =>
                      v.length > 22 ? v.slice(0, 20) + "…" : v
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="views" name="views" radius={[0, 4, 4, 0]}>
                    {data.topPages.slice(0, 8).map((_, i) => (
                      <Cell
                        key={i}
                        fill={C.chart1}
                        fillOpacity={1 - i * 0.08}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* UTM sources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Traffic sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.utmSources.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No UTM-tagged traffic yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={data.utmSources.slice(0, 8)}
                  layout="vertical"
                  margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke={C.grid}
                    strokeOpacity={0.4}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 9, fill: C.muted }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="utm_source"
                    width={80}
                    tick={{ fontSize: 9, fill: C.muted }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: string) =>
                      v.length > 14 ? v.slice(0, 12) + "…" : v
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="sessions"
                    name="sessions"
                    radius={[0, 4, 4, 0]}
                  >
                    {data.utmSources.slice(0, 8).map((_, i) => (
                      <Cell
                        key={i}
                        fill={C.chart3}
                        fillOpacity={1 - i * 0.08}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Conversion funnel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Conversion funnel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="mb-1 flex justify-end gap-2 text-[10px] text-muted-foreground">
              <span className="w-8 text-right">count</span>
              <span className="w-12 text-right">drop-off</span>
            </div>
            <FunnelBar
              label="Page views"
              value={data.pageViews}
              max={funnelMax}
              color={C.chart1}
            />
            <FunnelBar
              label="Form starts"
              value={data.formStarts}
              max={funnelMax}
              prev={data.pageViews}
              color={C.chart3}
            />
            <FunnelBar
              label="Form submits"
              value={data.formSubmits}
              max={funnelMax}
              prev={data.formStarts}
              color={C.chart2}
            />
            <FunnelBar
              label="Newsletter"
              value={data.newsletterSignups}
              max={funnelMax}
              prev={data.pageViews}
              color={C.chart4}
            />
            <FunnelBar
              label="Trial signups"
              value={data.trialSignups}
              max={funnelMax}
              prev={data.pageViews}
              color={C.chart4}
            />
            <FunnelBar
              label="Intake leads"
              value={data.intakeSubmissions}
              max={funnelMax}
              prev={data.formSubmits}
              color={C.chart2}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent events feed */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Recent events</CardTitle>
            <span className="text-xs text-muted-foreground">
              {data.recentEvents.length > 20
                ? `Showing 20 of ${data.recentEvents.length}`
                : `${data.recentEvents.length} event${data.recentEvents.length !== 1 ? "s" : ""}`}
              {" · "}{RANGE_LABELS[range]}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {data.recentEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground">No events recorded in this window.</p>
          ) : (
            <div className="divide-y divide-border">
              <div className="flex items-center gap-3 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <span className="h-1.5 w-1.5 shrink-0" />
                <span className="w-28 shrink-0">Event</span>
                <span className="flex-1">Page</span>
                <span className="w-20 shrink-0 text-right">Source</span>
                <span className="w-32 shrink-0 text-right">Date / Time</span>
              </div>
              {data.recentEvents.slice(0, 20).map((e) => (
                <div
                  key={e.id}
                  className="flex items-center gap-3 py-2 text-xs"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: EVENT_COLORS[e.event] ?? C.muted }}
                  />
                  <span
                    className="w-28 shrink-0 font-medium"
                    style={{ color: EVENT_COLORS[e.event] ?? "inherit" }}
                  >
                    {EVENT_LABELS[e.event] ?? e.event}
                  </span>
                  <span className="flex-1 truncate text-muted-foreground">
                    {e.page || "/"}
                  </span>
                  <span className="w-20 shrink-0 text-right">
                    {e.utm_source ? (
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {e.utm_source}
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/40">—</span>
                    )}
                  </span>
                  <span className="w-32 shrink-0 text-right tabular-nums text-muted-foreground">
                    {formatEventTime(e.created_at, range)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function AnalyticsDashboard({
  data,
  commsData,
  site = "jst",
  range,
}: {
  data: AnalyticsData | null;
  commsData?: AnalyticsData | null;
  site?: Site;
  range: Range;
}) {
  // For "combined" view: merge page views + events from both sources
  const merged: AnalyticsData | null =
    site === "combined" && data && commsData
      ? {
          ...data,
          site: "combined",
          totalEvents: data.totalEvents + commsData.totalEvents,
          uniqueVisitorsToday: data.uniqueVisitorsToday + commsData.uniqueVisitorsToday,
          pageViews: data.pageViews + commsData.pageViews,
          ctaClicks: data.ctaClicks + commsData.ctaClicks,
          outboundClicks: (data.outboundClicks ?? 0) + (commsData.outboundClicks ?? 0),
          affiliateClicks: (data.affiliateClicks ?? 0) + (commsData.affiliateClicks ?? 0),
          articleReads: (data.articleReads ?? 0) + (commsData.articleReads ?? 0),
          newsletterSignups: data.newsletterSignups + commsData.newsletterSignups,
          dailySeries: mergeDailySeries(data.dailySeries, commsData.dailySeries),
          topPages: [...data.topPages, ...commsData.topPages]
            .sort((a, b) => b.views - a.views)
            .slice(0, 10),
          utmSources: [...data.utmSources, ...commsData.utmSources]
            .sort((a, b) => b.sessions - a.sessions)
            .slice(0, 10),
          recentEvents: [...data.recentEvents, ...commsData.recentEvents]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 50),
        }
      : site === "combined"
        ? data ?? commsData
        : site === "comms"
          ? commsData
          : data;

  return (
    <Suspense>
      <DashboardInner data={merged} range={range} site={site} />
    </Suspense>
  );
}

function mergeDailySeries(
  a: { date: string; views: number }[],
  b: { date: string; views: number }[],
): { date: string; views: number }[] {
  const map: Record<string, number> = {};
  for (const e of [...a, ...b]) map[e.date] = (map[e.date] ?? 0) + e.views;
  return Object.entries(map)
    .sort(([x], [y]) => x.localeCompare(y))
    .map(([date, views]) => ({ date, views }));
}
