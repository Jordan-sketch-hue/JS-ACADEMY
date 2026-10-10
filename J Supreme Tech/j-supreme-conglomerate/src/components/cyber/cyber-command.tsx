"use client";

/**
 * Cyber Command — the J Supreme Security Operations Center hub.
 * Executive posture + the seven defensive pillars + controls inventory +
 * crypto/key tracker + recommended defensive tooling. Mirrors the platform
 * brief while staying honest about what's live vs. planned.
 */

import { useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock,
  ExternalLink,
  Fingerprint,
  HeartPulse,
  KeyRound,
  Lock,
  MonitorCheck,
  Radar,
  ScanEye,
  ScrollText,
  ShieldCheck,
  ShieldHalf,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  CONTROLS,
  CRYPTO_INVENTORY,
  PILLARS,
  TOOL_RECS,
  controlsByStatus,
  overallMaturity,
  type ControlStatus,
} from "@/lib/cyber/data";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  Fingerprint,
  KeyRound,
  ScanEye,
  ShieldHalf,
  Radar,
  HeartPulse,
  MonitorCheck,
};

function postureLabel(score: number): { label: string; cls: string; dot: string } {
  if (score >= 75) return { label: "HARDENED", cls: "text-positive", dot: "bg-positive" };
  if (score >= 55) return { label: "GUARDED", cls: "text-info", dot: "bg-info" };
  if (score >= 40) return { label: "ELEVATED", cls: "text-warning", dot: "bg-warning" };
  return { label: "EXPOSED", cls: "text-negative", dot: "bg-negative" };
}

const STATUS_META: Record<ControlStatus, { label: string; icon: LucideIcon; cls: string }> = {
  live: { label: "Live", icon: CheckCircle2, cls: "text-positive" },
  partial: { label: "Partial", icon: Clock, cls: "text-warning" },
  planned: { label: "Planned", icon: CircleDashed, cls: "text-muted-foreground" },
};

export function CyberCommand() {
  const maturity = overallMaturity();
  const posture = postureLabel(maturity);
  const counts = useMemo(() => controlsByStatus(), []);

  return (
    <div className="space-y-8">
      {/* ── Header band ───────────────────────────────────────── */}
      <Card className="overflow-hidden border-border">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-jarvis text-xl font-semibold tracking-tight">Cyber Command</h2>
                  <Badge variant="secondary" className="px-1.5 py-0 text-[9px] uppercase tracking-wider">
                    SOC
                  </Badge>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Zero-trust security operations for the entire J Supreme group — identity, encryption,
                  AI threat detection, autonomous defense, intelligence, resilience and compliance, on one
                  screen. <span className="text-foreground/80">Never trust, always verify.</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold", posture.cls)}>
                    <span className={cn("h-1.5 w-1.5 animate-pulse rounded-full", posture.dot)} />
                    Posture: {posture.label}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {counts.live} live · {counts.partial} partial · {counts.planned} planned controls
                  </span>
                </div>
              </div>
            </div>

            {/* Posture gauge */}
            <div className="flex items-center gap-5">
              <div className="text-right">
                <div className={cn("font-jarvis text-4xl font-bold leading-none", posture.cls)}>{maturity}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Defense maturity
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild size="sm">
                  <Link href="/cyber/fleet">
                    <Radar className="mr-1.5 h-3.5 w-3.5" /> Run fleet scan
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/cyber/playbooks">
                    <Workflow className="mr-1.5 h-3.5 w-3.5" /> Playbooks
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── KPI strip ─────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Activity} label="Defense maturity" value={`${maturity}%`} sub="Across 7 pillars" />
        <Kpi icon={CheckCircle2} label="Controls live" value={String(counts.live)} sub={`${counts.partial} partial · ${counts.planned} planned`} cls="text-positive" />
        <Kpi icon={Lock} label="Crypto assets tracked" value={String(CRYPTO_INVENTORY.length)} sub="TLS · at-rest · secrets" />
        <Kpi icon={Radar} label="Properties monitored" value={String(PILLARS.length ? 18 : 0)} sub="Live fleet scan ready" />
      </div>

      {/* ── Tabbed detail ─────────────────────────────────────── */}
      <Tabs defaultValue="pillars" className="space-y-5">
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="pillars">Seven Pillars</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="crypto">Encryption &amp; Keys</TabsTrigger>
          <TabsTrigger value="tooling">Defense Tooling</TabsTrigger>
        </TabsList>

        {/* Pillars */}
        <TabsContent value="pillars" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {PILLARS.map((p) => {
              const Icon = PILLAR_ICONS[p.icon] ?? ShieldCheck;
              return (
                <Card key={p.id} className="group border-border transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06]">
                        <Icon className="h-5 w-5 text-foreground/80" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 text-sm font-semibold leading-tight">
                          <span className="font-mono text-[10px] text-muted-foreground">{String(p.index).padStart(2, "0")}</span>
                          {p.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{p.tagline}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={p.maturity} className="h-1.5" />
                      <span className="font-mono text-[10px] text-muted-foreground">{p.maturity}%</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {p.capabilities.map((c) => (
                        <li key={c} className="flex items-start gap-1.5 text-[12px] leading-snug text-muted-foreground">
                          <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-foreground/40" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Controls inventory */}
        <TabsContent value="controls" className="space-y-4">
          {(["live", "partial", "planned"] as ControlStatus[]).map((status) => {
            const rows = CONTROLS.filter((c) => c.status === status);
            const meta = STATUS_META[status];
            const Icon = meta.icon;
            return (
              <section key={status}>
                <div className="mb-2 flex items-center gap-3">
                  <h3 className="flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">
                    <Icon className={cn("h-3.5 w-3.5", meta.cls)} />
                    <span className={meta.cls}>{meta.label}</span>
                  </h3>
                  <div className="h-px flex-1 bg-border" />
                  <span className="font-mono text-[10px] text-muted-foreground">{rows.length}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {rows.map((c) => (
                    <div key={c.id} className="rounded-lg border border-border bg-card/40 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">{c.name}</p>
                        <Badge variant="outline" className={cn("shrink-0 text-[9px] uppercase", meta.cls)}>
                          {meta.label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{c.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </TabsContent>

        {/* Crypto inventory */}
        <TabsContent value="crypto" className="space-y-3">
          <Card className="border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Asset</th>
                      <th className="px-4 py-2.5 font-medium">Algorithm</th>
                      <th className="px-4 py-2.5 font-medium">Scope</th>
                      <th className="px-4 py-2.5 font-medium">Rotation</th>
                      <th className="px-4 py-2.5 font-medium">Last rotated</th>
                      <th className="px-4 py-2.5 font-medium">PQ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CRYPTO_INVENTORY.map((a) => {
                      const stale =
                        a.lastRotated &&
                        Date.now() - new Date(a.lastRotated).getTime() > a.rotationDays * 86_400_000;
                      return (
                        <tr key={a.name} className="border-b border-border/50 last:border-0">
                          <td className="px-4 py-2.5 font-medium">{a.name}</td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-muted-foreground">{a.algorithm}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{a.scope}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{a.rotationDays}d</td>
                          <td className="px-4 py-2.5">
                            {a.lastRotated ? (
                              <span className={cn("inline-flex items-center gap-1", stale ? "text-warning" : "text-muted-foreground")}>
                                {stale && <AlertTriangle className="h-3 w-3" />}
                                {a.lastRotated}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-negative">
                                <AlertTriangle className="h-3 w-3" /> never
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={cn("h-2 w-2 inline-block rounded-full", a.pqReady ? "bg-positive" : "bg-muted-foreground/40")} title={a.pqReady ? "Post-quantum migration-ready" : "Not yet PQ-ready"} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <p className="px-1 text-xs text-muted-foreground">
            <Lock className="mr-1 inline h-3 w-3" />
            TLS 1.3 in transit · AES-256 at rest · secrets are env-scoped and never shipped to the client.
            Amber = past its rotation window. <span className="text-foreground/70">PQ</span> dot = ready for hybrid
            post-quantum key exchange (X25519 + ML-KEM) when the platform ships it.
          </p>
        </TabsContent>

        {/* Tooling */}
        <TabsContent value="tooling" className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            {TOOL_RECS.map((t) => (
              <div key={t.name} className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-foreground/[0.06]">
                  <ShieldCheck className="h-4 w-4 text-foreground/70" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold">{t.name}</p>
                    {t.available && (
                      <Badge variant="secondary" className="px-1.5 py-0 text-[9px] text-positive">
                        Available now
                      </Badge>
                    )}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{t.category}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.why}</p>
                </div>
              </div>
            ))}
          </div>
          <Card className="border-dashed">
            <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ScrollText className="h-3.5 w-3.5" /> Full architecture blueprint &amp; roadmap saved to
                <code className="rounded bg-muted px-1">_build/cyber/</code>.
              </span>
              <a href="https://vercel.com/docs/security" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-foreground/70 hover:text-foreground">
                Vercel security docs <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  cls,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  cls?: string;
}) {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
          <Icon className="h-4 w-4 text-muted-foreground/60" />
        </div>
        <div className={cn("mt-2 font-jarvis text-2xl font-bold", cls)}>{value}</div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
