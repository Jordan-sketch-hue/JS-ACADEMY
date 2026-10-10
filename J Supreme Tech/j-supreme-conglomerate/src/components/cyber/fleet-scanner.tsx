"use client";

/**
 * Fleet Security Scan — the live centerpiece.
 * Calls GET /api/v1/cyber/scan, which probes every property in the FLEET
 * registry server-side and grades each by real TLS + security headers.
 * Worst-graded properties surface first (triage order).
 */

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Lock,
  RefreshCw,
  ShieldAlert,
  XCircle,
  Radar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeaderCheck = { id: string; label: string; present: boolean; weight: number; value?: string };
type ScanResult = {
  id: string;
  name: string;
  url: string;
  tier: string;
  sensitivity: string;
  reachable: boolean;
  https: boolean;
  status: number | null;
  latencyMs: number | null;
  score: number;
  grade: "A" | "B" | "C" | "D" | "F" | "—";
  checks: HeaderCheck[];
  error?: string;
};
type ScanResponse = {
  ok: boolean;
  scannedAt: number;
  summary: { total: number; reachable: number; down: number; avgScore: number; distribution: Record<string, number> };
  results: ScanResult[];
};

const GRADE_CLS: Record<string, string> = {
  A: "text-positive border-positive/40 bg-positive/10",
  B: "text-positive border-positive/30 bg-positive/5",
  C: "text-warning border-warning/40 bg-warning/10",
  D: "text-warning border-warning/40 bg-warning/10",
  F: "text-negative border-negative/40 bg-negative/10",
  "—": "text-muted-foreground border-border bg-muted/40",
};

export function FleetScanner() {
  const [data, setData] = useState<ScanResponse | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const run = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/cyber/scan", { cache: "no-store" });
      if (!res.ok) throw new Error(`Scan failed (${res.status})`);
      setData((await res.json()) as ScanResponse);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    void run();
  }, [run]);

  const s = data?.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <Radar className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-jarvis text-xl font-semibold tracking-tight">Fleet Security Scan</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Live probe of every J Supreme property — TLS, reachability and the seven response
                  security headers that block downgrade, clickjacking, XSS, MIME-sniffing and data leakage.
                  Lowest grades first.
                </p>
              </div>
            </div>
            <Button onClick={() => void run()} disabled={running} size="sm">
              {running ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-1.5 h-3.5 w-3.5" />}
              {running ? "Scanning fleet…" : "Re-run scan"}
            </Button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-negative/30 bg-negative/5 px-4 py-2.5 text-sm text-negative">
              <XCircle className="h-4 w-4" /> {error}
            </div>
          )}

          {s && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Avg posture" value={`${s.avgScore}/100`} cls={s.avgScore >= 75 ? "text-positive" : s.avgScore >= 50 ? "text-warning" : "text-negative"} />
              <Stat label="Reachable" value={`${s.reachable}/${s.total}`} />
              <Stat label="Down / blocked" value={String(s.down)} cls={s.down ? "text-negative" : "text-positive"} />
              <Stat
                label="Grade spread"
                value={(["A", "B", "C", "D", "F"] as const).map((g) => `${g}:${s.distribution[g] ?? 0}`).join("  ")}
                mono
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading skeleton */}
      {!data && running && (
        <div className="grid gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg border border-border bg-muted/30" />
          ))}
        </div>
      )}

      {/* Results */}
      {data && (
        <div className="space-y-2">
          {data.results.map((r) => {
            const isOpen = open === r.id;
            const passed = r.checks.filter((c) => c.present).length;
            return (
              <Card key={r.id} className="border-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : r.id)}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/30"
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border font-jarvis text-sm font-bold", GRADE_CLS[r.grade])}>
                    {r.grade}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{r.name}</p>
                      <Badge variant="outline" className="px-1.5 py-0 text-[9px] uppercase">{r.tier}</Badge>
                      {r.sensitivity === "critical" || r.sensitivity === "high" ? (
                        <Badge variant="outline" className="px-1.5 py-0 text-[9px] uppercase text-warning">
                          {r.sensitivity}
                        </Badge>
                      ) : null}
                    </div>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">{r.url}</p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-4 sm:flex">
                    <Signal ok={r.https} label="TLS" />
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {r.reachable ? `${passed}/${r.checks.length} hdrs` : "unreachable"}
                    </span>
                    {r.latencyMs != null && (
                      <span className="font-mono text-[11px] text-muted-foreground/70">{r.latencyMs}ms</span>
                    )}
                    <span className={cn("font-jarvis text-sm font-bold", r.score >= 75 ? "text-positive" : r.score >= 50 ? "text-warning" : "text-negative")}>
                      {r.reachable ? r.score : "—"}
                    </span>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                  <CardContent className="border-t border-border/60 bg-muted/10 p-4">
                    {r.error && (
                      <div className="mb-3 flex items-center gap-2 rounded-md border border-negative/30 bg-negative/5 px-3 py-2 text-xs text-negative">
                        <ShieldAlert className="h-3.5 w-3.5" /> {r.error}
                      </div>
                    )}
                    <div className="grid gap-2 sm:grid-cols-2">
                      {r.checks.map((c) => (
                        <div key={c.id} className="flex items-start gap-2 text-xs">
                          {c.present ? (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-positive" />
                          ) : (
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" />
                          )}
                          <div className="min-w-0">
                            <p className={cn(c.present ? "text-foreground/80" : "text-muted-foreground")}>{c.label}</p>
                            {c.present && c.value && (
                              <p className="truncate font-mono text-[10px] text-muted-foreground/70">{c.value}</p>
                            )}
                            {!c.present && (
                              <p className="font-mono text-[10px] text-warning/80">missing · +{c.weight} pts available</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <p className="px-1 text-xs text-muted-foreground">
        <Lock className="mr-1 inline h-3 w-3" />
        The scanner only reads public response headers — it never logs in or sends payloads. Fix once at the
        platform layer (security headers in <code className="rounded bg-muted px-1">next.config</code>) and every
        Vercel-hosted property&apos;s grade jumps together.
      </p>
    </div>
  );
}

function Stat({ label, value, cls, mono }: { label: string; value: string; cls?: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card/40 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-bold", mono ? "font-mono text-sm" : "font-jarvis text-xl", cls)}>{value}</p>
    </div>
  );
}

function Signal({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-mono text-[11px]", ok ? "text-positive" : "text-negative")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-positive" : "bg-negative")} /> {label}
    </span>
  );
}
