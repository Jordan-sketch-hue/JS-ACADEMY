"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpRight,
  Bot,
  CalendarClock,
  Cloud,
  Cpu,
  Inbox,
  MonitorSmartphone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Workflow,
  Zap,
} from "lucide-react";
import { JarvisWorkflowClient } from "@/components/jarvis/jarvis-client";
import type { JarvisHub as JarvisHubData } from "@/lib/jarvis/types";
import {
  AI_WORKFLOWS,
  CLOUD_AUTOMATIONS,
  JARVIS_CATEGORIES,
  PC_ENGINE,
  type JarvisEngine,
  type JarvisStatus,
} from "@/lib/jarvis/hub-data";

const TABS = ["capabilities", "automations", "tower", "ai-workflows"] as const;
type HubTab = (typeof TABS)[number];

function normalizeTab(tab?: string | null): HubTab {
  return (TABS as readonly string[]).includes(tab ?? "")
    ? (tab as HubTab)
    : "capabilities";
}

function StatusPill({ status }: { status: JarvisStatus }) {
  if (status === "live")
    return (
      <Badge variant="success" className="px-1.5 py-0 text-[10px] uppercase tracking-wide">
        Live
      </Badge>
    );
  if (status === "staged")
    return (
      <Badge variant="warning" className="px-1.5 py-0 text-[10px] uppercase tracking-wide">
        Staged for your tap
      </Badge>
    );
  return (
    <Badge variant="outline" className="px-1.5 py-0 text-[10px] uppercase tracking-wide">
      Wire next
    </Badge>
  );
}

function EngineChip({ engine }: { engine: JarvisEngine }) {
  const map = {
    pc: { icon: Cpu, label: "PC engine" },
    cloud: { icon: Cloud, label: "Cloud" },
    "in-app": { icon: MonitorSmartphone, label: "In-app" },
  } as const;
  const { icon: Icon, label } = map[engine];
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-muted/30 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

/** Skeleton shown while the launch tower probes the portfolio (10–20s). */
function TowerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        Jarvis is probing every site live (Vercel API + HTTP health) — this takes a few seconds…
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

type TowerState =
  | { status: "idle" | "loading" }
  | { status: "ready"; hub: JarvisHubData }
  | { status: "error"; message: string };

export function JarvisHub() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<HubTab>(() => normalizeTab(searchParams.get("tab")));
  const [tower, setTower] = useState<TowerState>({ status: "idle" });

  const loadTower = useCallback(async () => {
    setTower({ status: "loading" });
    try {
      const res = await fetch("/api/v1/jarvis/hub", { cache: "no-store" });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? `HTTP ${res.status}`);
      }
      setTower({ status: "ready", hub: (await res.json()) as JarvisHubData });
    } catch (err) {
      setTower({
        status: "error",
        message: err instanceof Error ? err.message : "Unexpected error",
      });
    }
  }, []);

  // Sidebar links land on /jarvis?tab=… — when the hub is ALREADY mounted, the
  // state initializer doesn't re-run, so follow searchParams changes here.
  useEffect(() => {
    setTab(normalizeTab(searchParams.get("tab")));
  }, [searchParams]);

  // Probe the portfolio only when the Tower tab is actually opened.
  useEffect(() => {
    if (tab === "tower" && tower.status === "idle") void loadTower();
  }, [tab, tower.status, loadTower]);

  const onTabChange = (next: string) => {
    const t = normalizeTab(next);
    setTab(t);
    // Keep the URL shareable without triggering a navigation.
    if (typeof window !== "undefined") {
      const url = t === "capabilities" ? "/jarvis" : `/jarvis?tab=${t}`;
      window.history.replaceState(null, "", url);
    }
  };

  const liveCount = JARVIS_CATEGORIES.flatMap((c) => c.capabilities).filter(
    (c) => c.status === "live",
  ).length;
  const stagedCount = JARVIS_CATEGORIES.flatMap((c) => c.capabilities).filter(
    (c) => c.status === "staged",
  ).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
              <Bot className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">Jarvis</h1>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Everything AI in one place — what runs on its own, when it runs, and where the
            results land. Outward actions are always staged for your tap, never auto-fired.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" className="gap-1">
            <Zap className="h-3 w-3" /> {liveCount} live automations
          </Badge>
          <Badge variant="warning" className="gap-1">
            <Inbox className="h-3 w-3" /> {stagedCount} staged for your tap
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <HubStat icon={CalendarClock} label="PC engine runs" value="3× daily" sub="07:30 · 13:00 · 18:30" />
        <HubStat icon={Cloud} label="Cloud crons" value="2 daily" sub="digest + EOD email" />
        <HubStat icon={ShieldCheck} label="Guardrails" value="Full-auto + fence" sub="outward actions staged" />
        <HubStat icon={Workflow} label="Capability areas" value={`${JARVIS_CATEGORIES.length}`} sub="tech · marketing · ops · trading" />
      </div>

      <Tabs value={tab} onValueChange={onTabChange}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="capabilities" className="gap-1.5">
            <Workflow className="h-3.5 w-3.5" /> Capabilities
          </TabsTrigger>
          <TabsTrigger value="automations" className="gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Automations
          </TabsTrigger>
          <TabsTrigger value="tower" className="gap-1.5">
            <MonitorSmartphone className="h-3.5 w-3.5" /> Site Launch Tower
          </TabsTrigger>
          <TabsTrigger value="ai-workflows" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> AI Workflows
          </TabsTrigger>
        </TabsList>

        {/* CAPABILITIES — the categorized map. Static data: renders instantly. */}
        <TabsContent value="capabilities" className="mt-4 space-y-8">
          {JARVIS_CATEGORIES.map((cat) => (
            <section key={cat.id} className="space-y-3">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <span aria-hidden>{cat.emoji}</span> {cat.label}
                </h2>
                <p className="mt-0.5 max-w-3xl text-xs text-muted-foreground">{cat.tagline}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {cat.capabilities.map((cap) => (
                  <Card key={cap.id} className="flex flex-col">
                    <CardContent className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium leading-tight">{cap.name}</h3>
                        <StatusPill status={cap.status} />
                      </div>
                      <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
                        {cap.what}
                      </p>
                      <div className="space-y-1.5 border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
                        {cap.schedule && (
                          <p className="flex items-center gap-1.5">
                            <CalendarClock className="h-3 w-3 shrink-0" /> {cap.schedule}
                          </p>
                        )}
                        {cap.output && (
                          <p className="flex items-center gap-1.5">
                            <Inbox className="h-3 w-3 shrink-0" /> {cap.output}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <EngineChip engine={cap.engine} />
                        {cap.href &&
                          (cap.href.startsWith("/jarvis?tab=") ? (
                            <button
                              type="button"
                              onClick={() => onTabChange(cap.href!.split("tab=")[1]!)}
                              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
                            >
                              Open <ArrowUpRight className="h-3 w-3" />
                            </button>
                          ) : (
                            <Link
                              href={cap.href}
                              className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
                            >
                              Open <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </TabsContent>

        {/* AUTOMATIONS — the two engines, honestly labeled. */}
        <TabsContent value="automations" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                      <Cpu className="h-4 w-4 text-primary" /> {PC_ENGINE.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">{PC_ENGINE.how}</p>
                  </div>
                  <Badge variant="success" className="shrink-0">Live</Badge>
                </div>

                <div className="space-y-2">
                  {PC_ENGINE.slots.map((slot) => (
                    <div
                      key={slot.time}
                      className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                    >
                      <span className="mt-0.5 shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                        {slot.time}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-medium">{slot.name}</p>
                        <p className="text-[11px] leading-snug text-muted-foreground">{slot.does}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Free scanners (run every cycle, $0)
                  </p>
                  <div className="space-y-1">
                    {PC_ENGINE.sops.map((sop) => (
                      <div key={sop.name} className="flex items-baseline justify-between gap-2 text-[11px]">
                        <span className="shrink-0 font-mono text-foreground/90">{sop.name}</span>
                        <span className="min-w-0 flex-1 truncate text-right text-muted-foreground">
                          {sop.does}
                        </span>
                        <Badge variant="outline" className="shrink-0 px-1 py-0 text-[9px]">
                          {sop.slot}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium">
                    <Inbox className="h-3 w-3" /> Results land in
                    <code className="rounded bg-muted px-1 text-[10px]">{PC_ENGINE.inbox}</code>
                  </p>
                  <p className="mt-1 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" /> {PC_ENGINE.guardrail}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold">
                      <Cloud className="h-4 w-4 text-accent" /> Cloud automations — this app
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Run on Vercel around the clock, no PC required.
                    </p>
                  </div>
                  <Badge variant="success" className="shrink-0">Live</Badge>
                </div>
                <div className="space-y-2">
                  {CLOUD_AUTOMATIONS.map((a) => (
                    <div
                      key={a.name}
                      className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-medium">{a.name}</p>
                        <StatusPill status={a.status} />
                      </div>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{a.does}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
                        <span className="font-medium">{a.trigger}</span>
                        {a.endpoint && (
                          <code className="rounded bg-muted px-1">{a.endpoint}</code>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SITE LAUNCH TOWER — fetched lazily the first time the tab opens. */}
        <TabsContent value="tower" className="mt-4">
          {tower.status === "ready" ? (
            <JarvisWorkflowClient initial={tower.hub} />
          ) : tower.status === "error" ? (
            <Card className="border-warning/40 bg-warning/[0.06]">
              <CardContent className="flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <div>
                    <p className="font-medium">Couldn&apos;t scan the portfolio</p>
                    <p className="mt-0.5 text-muted-foreground">{tower.message}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => void loadTower()}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Retry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <TowerSkeleton />
          )}
        </TabsContent>

        {/* AI WORKFLOWS — the reusable library. */}
        <TabsContent value="ai-workflows" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {AI_WORKFLOWS.map((wf) => (
              <Card key={wf.name} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="flex items-center gap-1.5 text-sm font-medium leading-tight">
                      <Sparkles className="h-3.5 w-3.5 text-accent" /> {wf.name}
                    </h3>
                    <EngineChip engine={wf.where === "in-app" ? "in-app" : "pc"} />
                  </div>
                  <p className="flex-1 text-xs leading-relaxed text-muted-foreground">{wf.what}</p>
                  <div className="border-t border-border/50 pt-2 text-[11px]">
                    {wf.href ? (
                      <Link
                        href={wf.href}
                        className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                      >
                        Open in workspace <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    ) : wf.path ? (
                      <code className="rounded bg-muted px-1 text-[10px] text-muted-foreground">
                        {wf.path}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">{wf.hint}</span>
                    )}
                    {wf.hint && (wf.href || wf.path) && (
                      <p className="mt-1 text-muted-foreground">{wf.hint}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HubStat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Bot;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">{value}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {label} · {sub}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
