"use client";

import { useMemo, useState, useTransition } from "react";
import { Mail, RefreshCw, ScrollText, X } from "lucide-react";
import type { EodReport } from "@/lib/data/eod-reports";
import { generateEodNowAction } from "@/app/(app)/reports/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const METRIC_LABELS: Record<string, string> = {
  bookings: "bookings",
  meetings_today: "meetings",
  new_leads: "leads",
  new_subscriptions: "subs",
  tasks_done: "tasks",
  invoices_created: "invoices",
  invoices_paid: "paid",
};

function metricLine(metrics: Record<string, number>): string {
  const parts: string[] = [];
  for (const [key, label] of Object.entries(METRIC_LABELS)) {
    const v = metrics[key];
    if (v) parts.push(`${v} ${label}`);
  }
  return parts.join(" · ") || "no activity";
}

function prettyDate(ymd: string): string {
  return new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ReportsClient({
  persistLocally,
  initialReports,
}: {
  persistLocally: boolean;
  initialReports: EodReport[];
}) {
  const [reports, setReports] = useState<EodReport[]>(initialReports);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialReports[0]?.id ?? null,
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = useMemo(
    () => reports.find((r) => r.id === selectedId) ?? null,
    [reports, selectedId],
  );

  function generateNow() {
    setError(null);
    setNotice(null);
    startTransition(async () => {
      const res = await generateEodNowAction();
      if (!res.ok || !res.report) {
        setError(res.saveError || "Could not generate the report.");
        return;
      }
      const report = res.report;
      setReports((prev) => {
        const rest = prev.filter((r) => r.report_date !== report.report_date);
        return [report, ...rest];
      });
      setSelectedId(report.id);
      setNotice(
        res.emailed
          ? "Report generated, saved, and emailed."
          : `Report saved${res.emailError ? ` — email failed: ${res.emailError}` : " (email skipped)"}.`,
      );
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <ScrollText className="h-6 w-6 text-primary" />
            EOD Reports
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            End-of-day activity, saved here and emailed automatically around 5pm.
          </p>
        </div>
        <Button onClick={generateNow} disabled={isPending} className="gap-2 self-start sm:self-auto">
          <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
          {isPending ? "Generating…" : "Generate now"}
        </Button>
      </div>

      {persistLocally && (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          EOD reports need the cloud database (Supabase) — connect it to enable saving + the 5pm email.
        </div>
      )}

      {notice && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          <span className="flex items-center gap-2"><Mail className="h-4 w-4" />{notice}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      )}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      )}

      {reports.length === 0 ? (
        <Card className="border-dashed bg-card/40">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <ScrollText className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              No reports yet. One is generated automatically each day around 5pm — or click
              “Generate now” to make today’s.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* List */}
          <div className="space-y-2">
            {reports.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={cn(
                  "w-full rounded-lg border p-3 text-left transition-colors",
                  r.id === selectedId
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/40",
                )}
              >
                <div className="text-sm font-medium">{prettyDate(r.report_date)}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{metricLine(r.metrics)}</div>
              </button>
            ))}
          </div>

          {/* Viewer */}
          <Card className="overflow-hidden bg-card/40">
            <CardContent className="p-0">
              {selected ? (
                <div>
                  <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-4 py-3">
                    <span className="text-sm font-medium">{selected.title}</span>
                    {Object.entries(METRIC_LABELS).map(([key, label]) =>
                      selected.metrics[key] ? (
                        <Badge key={key} variant="secondary" className="text-[10px]">
                          {selected.metrics[key]} {label}
                        </Badge>
                      ) : null,
                    )}
                  </div>
                  <iframe
                    title={selected.title}
                    srcDoc={selected.html}
                    className="h-[620px] w-full border-0 bg-white"
                  />
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  Select a report to view it.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
