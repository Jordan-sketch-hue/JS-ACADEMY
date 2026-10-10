"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Globe2,
  Info,
  Megaphone,
  Smartphone,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  SERVICES,
  SOURCES,
  PRICING_LAST_REVIEWED,
  JMD_PER_USD,
  fmtJmd,
  fmtUsd,
  usd,
  midpoint,
  getServiceStats,
  type Competitor,
  type Positioning,
  type ServiceCategory,
} from "@/lib/data/market-pricing";

const ICONS: Record<ServiceCategory["iconKey"], LucideIcon> = {
  globe: Globe2,
  smartphone: Smartphone,
  megaphone: Megaphone,
};

/** Solid fills for recharts bars (parse reliably across themes). */
const BAR_FILL: Record<Positioning, string> = {
  You: "#8b5cf6", // violet — your brand accent
  Budget: "#94a3b8", // slate-400
  "Mid-market": "#38bdf8", // sky-400
  Premium: "#fb923c", // orange-400
};

const BADGE_VARIANT: Record<
  Positioning,
  "default" | "secondary" | "outline" | "success" | "warning"
> = {
  You: "success",
  Budget: "outline",
  "Mid-market": "default",
  Premium: "warning",
};

/** Trim long provider names for the chart's Y axis (full names stay in the table). */
function shorten(name: string): string {
  const map: Record<string, string> = {
    "J Supreme Tech": "J Supreme (You)",
    "Best Web Design JA": "Best Web Design",
    "Freelance developer": "Freelancer",
    "Freelance manager": "Freelancer",
    "Caribbean agency": "Caribbean agency",
    "Diaspora / offshore agency": "Diaspora agency",
    "Diaspora / US agency": "Diaspora (US)",
    "Boutique marketing agency": "Boutique agency",
    "Full-service agency": "Full-service",
  };
  return map[name] ?? name;
}

export function MarketPricingClient() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <Intro />

      <Tabs defaultValue={SERVICES[0].key}>
        <TabsList className="h-auto flex-wrap">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.iconKey];
            return (
              <TabsTrigger key={s.key} value={s.key} className="gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {SERVICES.map((s) => (
          <TabsContent key={s.key} value={s.key} className="mt-4">
            <ServicePanel service={s} />
          </TabsContent>
        ))}
      </Tabs>

      <SourcesFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Intro + cross-service KPI summary                                  */
/* ------------------------------------------------------------------ */

function Intro() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4 text-primary" />
            Where J Supreme sits against the Jamaican market — websites, apps, and social.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Representative price bands compiled from public agency pages &amp; 2025–2026
            pricing guides. Tune the numbers in{" "}
            <code className="rounded bg-muted/60 px-1 py-0.5 text-[11px]">
              lib/data/market-pricing.ts
            </code>
            .
          </p>
        </div>
        <Badge variant="outline" className="font-mono text-[10px]">
          Reviewed {PRICING_LAST_REVIEWED} · J${JMD_PER_USD} ≈ US$1
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <SummaryCard key={s.key} service={s} index={i} />
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ service, index }: { service: ServiceCategory; index: number }) {
  const Icon = ICONS[service.iconKey];
  const stats = getServiceStats(service);
  const you = stats.you;
  const below = stats.vsMedian < 0;
  const pct = Math.round(Math.abs(stats.vsMedian) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index }}
    >
      <Card className="relative h-full overflow-hidden border-border/60 bg-card/40 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon className="h-4 w-4 text-primary" />
            {service.label}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
            {service.unit}
          </span>
        </CardHeader>
        <CardContent>
          {you && (
            <>
              <div className="text-2xl font-semibold tracking-tight">
                {fmtJmd(you.jmdLow)}–{fmtJmd(you.jmdHigh)}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {fmtUsd(usd(you.jmdLow))}–{fmtUsd(usd(you.jmdHigh))} · your range
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium",
                    below
                      ? "bg-positive/10 text-positive"
                      : "bg-warning/10 text-warning",
                  )}
                >
                  {below ? (
                    <ArrowDownRight className="h-3 w-3" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3" />
                  )}
                  {pct}% {below ? "below" : "above"} median
                </span>
                <span className="text-muted-foreground">
                  mkt {fmtJmd(stats.marketMedian)}
                </span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Per-service panel: callout + range chart + tiers + table          */
/* ------------------------------------------------------------------ */

function ServicePanel({ service }: { service: ServiceCategory }) {
  const stats = getServiceStats(service);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">{service.tagline}</p>

      <RangeChartCard service={service} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TierList service={service} />
        </div>
        <div className="lg:col-span-3">
          <CompetitorTable service={service} marketMedian={stats.marketMedian} />
        </div>
      </div>
    </div>
  );
}

function RangeChartCard({ service }: { service: ServiceCategory }) {
  const stats = getServiceStats(service);

  // Sort cheapest → priciest by midpoint so the chart reads like a ladder.
  const rows = useMemo(
    () =>
      [...service.competitors]
        .sort((a, b) => midpoint(a) - midpoint(b))
        .map((c) => ({
          name: shorten(c.name),
          range: [c.jmdLow, c.jmdHigh] as [number, number],
          positioning: c.positioning,
          jmdLow: c.jmdLow,
          jmdHigh: c.jmdHigh,
          isYou: !!c.isYou,
        })),
    [service],
  );

  const maxHigh = Math.max(...rows.map((r) => r.jmdHigh));
  const chartHeight = rows.length * 46 + 36;

  return (
    <Card className="border-border/60 bg-card/40 shadow-none backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base font-medium">
          Price range by provider
          <Badge variant="secondary" className="font-mono text-[10px] font-normal">
            {service.unit}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Each bar is a typical engagement band. Dashed line = market median (
          {fmtJmd(stats.marketMedian)}).{" "}
          <span className="font-medium text-foreground">J Supreme</span> is highlighted in
          violet.
        </p>
      </CardHeader>
      <CardContent>
        <div style={{ height: chartHeight }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
              barCategoryGap="28%"
            >
              <CartesianGrid
                horizontal={false}
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis
                type="number"
                domain={[0, Math.ceil((maxHigh * 1.05) / 50_000) * 50_000]}
                tickFormatter={(v: number) => fmtJmd(v)}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={104}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: "hsl(var(--muted) / 0.3)" }} content={<RangeTooltip />} />
              <ReferenceLine
                x={stats.marketMedian}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                strokeOpacity={0.7}
              />
              <Bar dataKey="range" radius={[4, 4, 4, 4]} isAnimationActive={false}>
                {rows.map((r) => (
                  <Cell
                    key={r.name}
                    fill={BAR_FILL[r.positioning]}
                    fillOpacity={r.isYou ? 1 : 0.78}
                    stroke={r.isYou ? "#a78bfa" : "transparent"}
                    strokeWidth={r.isYou ? 1.5 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <Legend />
      </CardContent>
    </Card>
  );
}

function Legend() {
  const items: Positioning[] = ["You", "Budget", "Mid-market", "Premium"];
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/50 pt-3">
      {items.map((p) => (
        <span key={p} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="h-2.5 w-2.5 rounded-sm"
            style={{ background: BAR_FILL[p] }}
            aria-hidden
          />
          {p === "You" ? "J Supreme" : p}
        </span>
      ))}
    </div>
  );
}

type TooltipRow = {
  name: string;
  jmdLow: number;
  jmdHigh: number;
  positioning: Positioning;
};

function RangeTooltip({
  active,
  payload,
}: {
  active?: boolean;
  // recharts passes a loosely-typed payload
  payload?: Array<{ payload: TooltipRow }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{row.name}</p>
      <p className="mt-1 text-muted-foreground">
        <span className="font-semibold text-foreground">
          {fmtJmd(row.jmdLow)} – {fmtJmd(row.jmdHigh)}
        </span>
      </p>
      <p className="text-muted-foreground">
        {fmtUsd(usd(row.jmdLow))} – {fmtUsd(usd(row.jmdHigh))}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">
        {row.positioning === "You" ? "Your positioning" : row.positioning}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing tiers                                                      */
/* ------------------------------------------------------------------ */

function TierList({ service }: { service: ServiceCategory }) {
  return (
    <Card className="h-full border-border/60 bg-card/40 shadow-none backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Market pricing tiers</CardTitle>
        <p className="text-sm text-muted-foreground">What buyers pay, by scope.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {service.tiers.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-border/50 bg-background/30 p-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium">{t.name}</span>
              <span className="text-sm font-semibold tabular-nums">
                {fmtJmd(t.jmdLow)}–{fmtJmd(t.jmdHigh)}
              </span>
            </div>
            <div className="mt-0.5 flex items-baseline justify-between gap-2">
              <span className="text-xs text-muted-foreground">{t.detail}</span>
              <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                {fmtUsd(usd(t.jmdLow))}–{fmtUsd(usd(t.jmdHigh))}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Competitor table                                                   */
/* ------------------------------------------------------------------ */

function CompetitorTable({
  service,
  marketMedian,
}: {
  service: ServiceCategory;
  marketMedian: number;
}) {
  const rows = [...service.competitors].sort((a, b) => midpoint(a) - midpoint(b));

  return (
    <Card className="h-full border-border/60 bg-card/40 shadow-none backdrop-blur-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Competitor breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sorted cheapest → priciest by midpoint.
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Provider</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead className="text-right">Range (JMD)</TableHead>
              <TableHead className="hidden text-right sm:table-cell">USD</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((c) => (
              <ProviderRow key={c.name} c={c} marketMedian={marketMedian} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProviderRow({ c, marketMedian }: { c: Competitor; marketMedian: number }) {
  return (
    <TableRow className={cn(c.isYou && "bg-primary/5 hover:bg-primary/10")}>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-[10px] font-black text-white shadow-sm",
              c.accent,
            )}
          >
            {c.initials}
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-sm font-medium leading-tight",
                c.isYou && "text-primary",
              )}
            >
              {c.name}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">{c.blurb}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={BADGE_VARIANT[c.positioning]} className="whitespace-nowrap text-[10px]">
          {c.positioning === "You" ? "You" : c.positioning}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-sm font-semibold tabular-nums">
          {fmtJmd(c.jmdLow)}–{fmtJmd(c.jmdHigh)}
        </span>
        <p className="text-[10px] text-muted-foreground tabular-nums">
          mid {fmtJmd(midpoint(c))}
          {marketMedian > 0 &&
            ` · ${midpoint(c) <= marketMedian ? "≤" : ">"} mkt`}
        </p>
      </TableCell>
      <TableCell className="hidden text-right text-xs text-muted-foreground tabular-nums sm:table-cell">
        {fmtUsd(usd(c.jmdLow))}–{fmtUsd(usd(c.jmdHigh))}
      </TableCell>
    </TableRow>
  );
}

/* ------------------------------------------------------------------ */
/*  Sources                                                            */
/* ------------------------------------------------------------------ */

function SourcesFooter() {
  return (
    <Card className="border-dashed border-border/60 bg-transparent shadow-none">
      <CardContent className="space-y-2 py-4">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          Sources &amp; method
        </p>
        <p className="text-xs text-muted-foreground">
          Bands are representative market estimates for positioning — not official quotes.
          Compiled from public Jamaican agency pages and 2025–2026 pricing guides; converted
          at J${JMD_PER_USD} ≈ US$1.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((src) => (
            <a
              key={src.url}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary underline-offset-4 hover:underline"
            >
              {src.label}
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
