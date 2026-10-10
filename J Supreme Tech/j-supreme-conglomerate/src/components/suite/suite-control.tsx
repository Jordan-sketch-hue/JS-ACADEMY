"use client";

/**
 * Supreme Suite Control — operator panel for the SaaS arm.
 * The array of sellable tools (13 systems), each launchable + installable,
 * with LIVE health pulled from the suite's own self-check API:
 *   GET  {SUITE}/api/health          → heartbeat + counts
 *   GET  {SUITE}/api/health?deep=1   → every route fetched & marker-checked server-side
 * CORS is open on those endpoints specifically for this panel.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  AudioLines,
  Bot,
  Boxes,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Compass,
  ExternalLink,
  Gift,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  MonitorDown,
  PlayCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
  UtensilsCrossed,
  Warehouse,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SUITE_URL =
  process.env.NEXT_PUBLIC_SUPREME_SUITE_URL ?? "https://supreme-suite.vercel.app";

type Tool = {
  slug: string;
  name: string;
  category: string;
  accent: string;
  icon: LucideIcon;
  tagline: string;
  badge?: string;
};

const TOOLS: Tool[] = [
  { slug: "courier", name: "Courier & Delivery CRM", category: "Operations & Logistics", accent: "#2563eb", icon: Truck, tagline: "Dispatch, track and get paid — islandwide.", badge: "Popular" },
  { slug: "movers", name: "Movers & Storage CRM", category: "Operations & Logistics", accent: "#d97706", icon: Boxes, tagline: "From survey to settled-in — every move on one board.", badge: "Popular" },
  { slug: "warehouse", name: "Warehouse & Inventory (WMS)", category: "Operations & Logistics", accent: "#475569", icon: Warehouse, tagline: "Every pallet accounted for, every order out on time." },
  { slug: "property", name: "Property Management CRM", category: "Operations & Logistics", accent: "#0d9488", icon: Building2, tagline: "Rent in on time, repairs done right, owners happy." },
  { slug: "restaurant", name: "Restaurant & Reservations", category: "Operations & Logistics", accent: "#dc2626", icon: UtensilsCrossed, tagline: "Full tables, smooth service, stocked kitchen.", badge: "New" },
  { slug: "salon", name: "Beauty & Salon Booking", category: "Booking & Appointments", accent: "#db2777", icon: Sparkles, tagline: "Booked, deposited, and never ghosted again.", badge: "Flagship" },
  { slug: "appointments", name: "Universal Appointment CRM", category: "Booking & Appointments", accent: "#7c3aed", icon: CalendarCheck, tagline: "Fill the calendar. Cut the no-shows.", badge: "Popular" },
  { slug: "tours", name: "Tours & Experiences CRM", category: "Booking & Appointments", accent: "#059669", icon: Compass, tagline: "From first inquiry to five-star review." },
  { slug: "school", name: "School & Academy Management", category: "Education", accent: "#1d4ed8", icon: GraduationCap, tagline: "Applications, tuition and timetables — sorted." },
  { slug: "loyalty", name: "Loyalty & Rewards Platform", category: "Growth & Retention", accent: "#ea580c", icon: Gift, tagline: "Turn one-time buyers into regulars on autopilot." },
  { slug: "dashboards", name: "Analytics Dashboards", category: "AI & Intelligence", accent: "#0891b2", icon: LayoutDashboard, tagline: "Every number that matters, on one branded screen." },
  { slug: "chatbot", name: "AI Chatbot Builder", category: "AI & Intelligence", accent: "#8b5cf6", icon: Bot, tagline: "A receptionist that never sleeps, sells while you do.", badge: "New" },
  { slug: "voice", name: "AI Voice Agent", category: "AI & Intelligence", accent: "#16a34a", icon: AudioLines, tagline: "Answers the phone, books the job, logs the summary.", badge: "New" },
];

const CATEGORIES = [
  "Operations & Logistics",
  "Booking & Appointments",
  "Education",
  "Growth & Retention",
  "AI & Intelligence",
];

type Heartbeat = {
  ok: boolean;
  counts?: { systems: number; routes: number; actions: number; workflows: number };
  ts?: number;
};

type DeepRow = { path: string; ok: boolean; ms: number; status: number; detail?: string };

export function SuiteControl() {
  const [beat, setBeat] = useState<Heartbeat | null>(null);
  const [beatErr, setBeatErr] = useState<string | null>(null);
  const [deep, setDeep] = useState<DeepRow[] | null>(null);
  const [deepRunning, setDeepRunning] = useState(false);
  const [checkedAt, setCheckedAt] = useState<number | null>(null);

  const pulse = useCallback(async () => {
    try {
      const res = await fetch(`${SUITE_URL}/api/health`, { cache: "no-store" });
      const json = (await res.json()) as Heartbeat;
      setBeat(json);
      setBeatErr(null);
    } catch (e) {
      setBeat(null);
      setBeatErr(e instanceof Error ? e.message : "unreachable");
    }
  }, []);

  useEffect(() => {
    void pulse();
    const iv = setInterval(() => void pulse(), 60_000);
    return () => clearInterval(iv);
  }, [pulse]);

  const runDeep = useCallback(async () => {
    setDeepRunning(true);
    try {
      const res = await fetch(`${SUITE_URL}/api/health?deep=1`, { cache: "no-store" });
      const json = await res.json();
      setDeep((json.deep ?? []) as DeepRow[]);
      setCheckedAt(Date.now());
    } catch {
      setDeep([]);
    } finally {
      setDeepRunning(false);
    }
  }, []);

  const deepFor = useCallback(
    (slug: string): { ok: boolean | null; ms?: number } => {
      if (!deep) return { ok: null };
      const rows = deep.filter((r) => r.path.includes(":tenant") ? false : r.path.includes(slug));
      const demoRow = deep.find((r) => r.path === "/app/:tenant");
      const detailRow = deep.find((r) => r.path === "/systems/:slug");
      const relevant = rows.length ? rows : [demoRow, detailRow].filter(Boolean) as DeepRow[];
      if (!relevant.length) return { ok: null };
      return { ok: relevant.every((r) => r.ok), ms: relevant[0]?.ms };
    },
    [deep],
  );

  const deepSummary = useMemo(() => {
    if (!deep) return null;
    const ok = deep.filter((d) => d.ok).length;
    return { ok, total: deep.length, allGreen: ok === deep.length };
  }, [deep]);

  return (
    <div className="space-y-8">
      {/* Header band */}
      <Card className="overflow-hidden border-border">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground font-jarvis text-lg font-bold text-background">
                SS
              </span>
              <div>
                <h2 className="font-jarvis text-xl font-semibold tracking-tight">Supreme Suite — the SaaS arsenal</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  {TOOLS.length} white-label systems, ready to sell: branded workspace + public website + AI staff +
                  installable desktop app, each on a 3-day free trial. Every tool below is live and launchable right now.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      beat?.ok
                        ? "bg-positive/10 text-positive"
                        : beatErr
                          ? "bg-negative/10 text-negative"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", beat?.ok ? "bg-positive" : beatErr ? "bg-negative" : "bg-muted-foreground")} />
                    {beat?.ok ? "Platform online" : beatErr ? "Unreachable (deploy pending?)" : "Pinging…"}
                  </span>
                  {beat?.counts && (
                    <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {beat.counts.systems} systems · {beat.counts.routes} routes · {beat.counts.workflows} verified workflows · {beat.counts.actions} action contracts
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <a href={SUITE_URL} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open catalog
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={`${SUITE_URL}/status`} target="_blank" rel="noreferrer">
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Public /status
                </a>
              </Button>
              <Button size="sm" onClick={() => void runDeep()} disabled={deepRunning}>
                {deepRunning ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
                {deepRunning ? "Checking every route…" : "Run full system check"}
              </Button>
            </div>
          </div>

          {deepSummary && (
            <div
              className={cn(
                "mt-4 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-2.5 text-sm",
                deepSummary.allGreen ? "border-positive/30 bg-positive/5 text-positive" : "border-negative/30 bg-negative/5 text-negative",
              )}
            >
              {deepSummary.allGreen ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <span className="font-medium">
                {deepSummary.ok}/{deepSummary.total} routes healthy
                {deepSummary.allGreen ? " — every page, link and workflow surface verified." : " — attention needed."}
              </span>
              {checkedAt && (
                <span className="font-mono text-[11px] uppercase tracking-wider opacity-70">
                  checked {new Date(checkedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tool array, grouped by category */}
      {CATEGORIES.map((cat) => {
        const tools = TOOLS.filter((t) => t.category === cat);
        if (!tools.length) return null;
        return (
          <section key={cat}>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{cat}</h3>
              <div className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] text-muted-foreground">{tools.length}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => {
                const Icon = tool.icon;
                const status = deepFor(tool.slug);
                return (
                  <Card key={tool.slug} className="group border-border transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ background: `${tool.accent}16` }}>
                          <Icon className="h-5 w-5" style={{ color: tool.accent }} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold leading-tight">
                            {tool.name}
                            {tool.badge && (
                              <Badge variant="secondary" className="px-1.5 py-0 text-[9px]">
                                {tool.badge}
                              </Badge>
                            )}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{tool.tagline}</p>
                        </div>
                        <span
                          title={status.ok === null ? "Run the full check for per-tool status" : status.ok ? "Healthy" : "Check failed"}
                          className={cn(
                            "mt-1 h-2 w-2 shrink-0 rounded-full",
                            status.ok === null ? "bg-muted-foreground/40" : status.ok ? "bg-positive" : "bg-negative",
                          )}
                        />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <Button asChild size="sm" variant="default" className="h-7 px-2.5 text-xs">
                          <a href={`${SUITE_URL}/app/demo-${tool.slug}`} target="_blank" rel="noreferrer">
                            <PlayCircle className="mr-1 h-3 w-3" /> Launch demo
                          </a>
                        </Button>
                        <Button asChild size="sm" variant="outline" className="h-7 px-2.5 text-xs">
                          <a href={`${SUITE_URL}/site/demo-${tool.slug}`} target="_blank" rel="noreferrer">
                            <ArrowUpRight className="mr-1 h-3 w-3" /> Website
                          </a>
                        </Button>
                        <Button asChild size="sm" variant="ghost" className="h-7 px-2.5 text-xs">
                          <a href={`${SUITE_URL}/systems/${tool.slug}`} target="_blank" rel="noreferrer">
                            Sales page
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Footer notes */}
      <Card className="border-dashed">
        <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MonitorDown className="h-3.5 w-3.5" /> Every demo installs as a desktop app — open it → “Install app” in the sidebar.
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" /> Health = the suite’s own registry-driven checks (same source as its /status portal).
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Trials: 3 days, no card → /start. Custom verticals: quote via J Supreme Tech.
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
