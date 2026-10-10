"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/components/app/workspace-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  CircleDot,
  Globe2,
  Info,
  RefreshCw,
  Rocket,
  Search,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { JarvisHub, JarvisSite } from "@/lib/jarvis/types";
import { loadJarvisState, type SiteWorkflowState } from "@/lib/jarvis/store";
import { scoreSite } from "@/lib/jarvis/scoring";
import { SiteWorkflowSheet } from "@/components/jarvis/site-workflow-sheet";

const EMPTY_STATE: SiteWorkflowState = { checks: {}, note: "", updatedAt: "" };

function readinessTone(pct: number): { bar: string; text: string; label: string } {
  if (pct >= 100) return { bar: "bg-positive", text: "text-positive", label: "Launch ready" };
  if (pct >= 70) return { bar: "bg-primary", text: "text-primary", label: "Almost there" };
  if (pct >= 40) return { bar: "bg-warning", text: "text-warning", label: "In progress" };
  return { bar: "bg-destructive", text: "text-destructive", label: "Needs work" };
}

function healthDot(status?: string): string {
  if (status === "healthy") return "bg-positive";
  if (status === "warning") return "bg-warning";
  if (status === "offline") return "bg-destructive";
  return "bg-muted-foreground/40";
}

export function JarvisWorkflowClient({ initial }: { initial: JarvisHub }) {
  const { ownerId } = useWorkspace();
  const router = useRouter();
  const [stateMap, setStateMap] = useState<Record<string, SiteWorkflowState>>({});
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refreshState = () => setStateMap(loadJarvisState(ownerId));
  useEffect(refreshState, [ownerId]);

  const scored = useMemo(
    () =>
      initial.sites.map((site) => ({
        site,
        manual: stateMap[site.id] ?? EMPTY_STATE,
        score: scoreSite(initial.template, site, stateMap[site.id] ?? EMPTY_STATE),
      })),
    [initial.sites, initial.template, stateMap],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return scored.filter(({ site }) => {
      if (category !== "all" && site.categoryId !== category) return false;
      if (!needle) return true;
      return (
        site.name.toLowerCase().includes(needle) ||
        site.url.toLowerCase().includes(needle) ||
        (site.tags ?? []).some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [scored, q, category]);

  const summary = useMemo(() => {
    const total = scored.length || 1;
    const avg = Math.round(scored.reduce((a, s) => a + s.score.overall.pct, 0) / total);
    const ready = scored.filter((s) => s.score.overall.pct >= 100).length;
    return { avg, ready };
  }, [scored]);

  const onRefresh = async () => {
    setRefreshing(true);
    router.refresh();
    // give the server component a beat to re-probe health, then reload local state
    setTimeout(() => {
      refreshState();
      setRefreshing(false);
    }, 1200);
  };

  const selected = selectedId
    ? scored.find((s) => s.site.id === selectedId) ?? null
    : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
              <Bot className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">Jarvis Workflow</h1>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Launch control tower for every site. Track live status, run the launch
            checklist, test in the sandbox, and revert a bad deploy — all in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={initial.vercelApiConnected ? "success" : "warning"} className="gap-1">
            <CircleDot className="h-3 w-3" />
            {initial.vercelApiConnected ? "Vercel API connected" : "Vercel API not connected"}
          </Badge>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
            <RefreshCw className={cn("mr-2 h-4 w-4", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat icon={Globe2} label="Sites tracked" value={initial.totals.total} />
        <Stat
          icon={Rocket}
          label="Launch ready"
          value={summary.ready}
          tone="text-positive"
        />
        <Stat icon={Activity} label="Avg readiness" value={`${summary.avg}%`} />
        <Stat icon={CheckCircle2} label="Online" value={initial.totals.online} tone="text-positive" />
        <Stat
          icon={TriangleAlert}
          label="Issues"
          value={initial.totals.offline + initial.totals.notDeployed}
          tone={initial.totals.offline + initial.totals.notDeployed > 0 ? "text-destructive" : undefined}
        />
        <Stat icon={Globe2} label="Custom domains" value={initial.totals.customDomains} />
      </div>

      <Card>
        <CardContent className="space-y-2.5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Command-center keys</p>
            <span className="text-[11px] text-muted-foreground">
              Powers Jarvis itself · client sites carry their own keys
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {initial.integrations.map((it) => (
              <div
                key={it.key}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-3 py-2",
                  it.connected ? "border-positive/30 bg-positive/[0.04]" : "border-warning/40 bg-warning/[0.05]",
                )}
              >
                <span
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    it.connected ? "bg-positive" : "bg-warning",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{it.label}</span>
                    {it.connected ? (
                      <Badge variant="success" className="px-1.5 py-0 text-[10px]">
                        Connected
                      </Badge>
                    ) : (
                      <a
                        href={it.setupUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 text-[11px] font-medium text-warning hover:underline"
                      >
                        Set up <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                    {it.connected ? it.purpose : it.todo}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {!initial.vercelApiConnected && (
        <Card className="border-warning/40 bg-warning/[0.06]">
          <CardContent className="flex flex-col gap-2 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-muted-foreground">
                Showing the static catalog. Set <code className="text-foreground">VERCEL_ACCESS_TOKEN</code>{" "}
                (and <code className="text-foreground">VERCEL_TEAM_ID</code>) in this project to auto-track
                every Vercel site, list deployments, and enable one-click revert.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search sites, domains, tags…"
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {initial.categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5" />
        New sites appear here automatically once deployed to your Vercel team — no upload step needed.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map(({ site, manual, score }) => {
          const tone = readinessTone(score.overall.pct);
          return (
            <Card
              key={site.id}
              className="group cursor-pointer transition-colors hover:border-primary/40"
              onClick={() => setSelectedId(site.id)}
            >
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", healthDot(site.health?.status))} />
                      <h3 className="truncate font-medium">{site.name}</h3>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {site.url.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 rounded-md p-1 text-muted-foreground opacity-60 transition hover:bg-muted/50 hover:opacity-100"
                    aria-label="Open site"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className={cn("font-medium", tone.text)}>{tone.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {score.overall.passed}/{score.overall.applicable} · {score.overall.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full transition-all", tone.bar)}
                      style={{ width: `${score.overall.pct}%` }}
                    />
                  </div>
                </div>

                {site.seedNote && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">{site.seedNote}</p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1">
                    {(site.tags ?? []).slice(0, 2).map((t) => (
                      <Badge key={t} variant="outline" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {manual.lastRun
                      ? `Tested ${new Date(manual.lastRun.at).toLocaleDateString()}`
                      : "Open workflow →"}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">No sites match your filters.</p>
      )}

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {selected && (
            <SiteWorkflowSheet
              site={selected.site}
              template={initial.template}
              ownerId={ownerId}
              vercelConnected={initial.vercelApiConnected}
              onChange={refreshState}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className={cn("text-lg font-semibold leading-none tabular-nums", tone)}>{value}</p>
          <p className="truncate text-[11px] text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
