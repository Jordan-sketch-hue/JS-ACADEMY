"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, BellOff, CheckCircle2, RefreshCw, XCircle, AlertTriangle, Clock, FlaskConical, Loader2 } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface QARun {
  id: string;
  run_at: string;
  slot: string;
  project_count: number;
  pass_count: number;
  fail_count: number;
  status: string;
}

interface QAResult {
  project_id: string;
  project_name: string;
  url: string;
  http_status: number | null;
  response_ms: number | null;
  passed: boolean;
  error: string | null;
}

interface QAAlert {
  project_id: string;
  project_name: string;
  alert_type: string;
  severity: string;
  message: string;
  fired_at: string;
}

interface QAData {
  run: QARun | null;
  results: QAResult[];
  alerts: QAAlert[];
}

// ── Push subscription helpers ─────────────────────────────────────────────────

async function subscribePush(): Promise<boolean> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return false;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub.toJSON()),
    });
    return true;
  } catch {
    return false;
  }
}

async function unsubscribePush(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return true;
    await fetch("/api/push/subscribe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    });
    await sub.unsubscribe();
    return true;
  } catch {
    return false;
  }
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ passed, error }: { passed: boolean; error?: string | null }) {
  if (passed)
    return (
      <Badge variant="success" className="gap-1 text-[10px] uppercase tracking-wide">
        <CheckCircle2 className="size-3" /> OK
      </Badge>
    );
  return (
    <Badge variant="destructive" className="gap-1 text-[10px] uppercase tracking-wide">
      <XCircle className="size-3" /> FAIL
    </Badge>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === "critical")
    return <Badge variant="destructive" className="text-[10px] uppercase">critical</Badge>;
  return <Badge variant="warning" className="text-[10px] uppercase">warning</Badge>;
}

// ── Main component ────────────────────────────────────────────────────────────

export function QAHealthTab() {
  const [data, setData]           = useState<QAData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult]   = useState<"ok" | "err" | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/qa/health");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  // Check current push subscription status
  useEffect(() => {
    fetchData();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => setPushEnabled(!!sub));
      });
    }
  }, [fetchData]);

  const sendTestAlert = async () => {
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/push/test", { method: "POST" });
      setTestResult(res.ok ? "ok" : "err");
    } catch {
      setTestResult("err");
    } finally {
      setTestLoading(false);
      setTimeout(() => setTestResult(null), 4000);
    }
  };

  const togglePush = async () => {
    setPushLoading(true);
    if (pushEnabled) {
      const ok = await unsubscribePush();
      if (ok) setPushEnabled(false);
    } else {
      const ok = await subscribePush();
      if (ok) setPushEnabled(true);
    }
    setPushLoading(false);
  };

  const passRate = data?.run
    ? Math.round((data.run.pass_count / (data.run.project_count || 1)) * 100)
    : 0;

  return (
    <div className="space-y-4">

      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold tracking-tight">QA Health</h3>
          {data?.run && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {new Date(data.run.run_at).toLocaleString()}
              <span className="ml-1 capitalize text-muted-foreground/70">{data.run.slot}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Alert toggle — green when active, muted when off */}
          <Button size="sm" variant="outline" onClick={togglePush} disabled={pushLoading}
            className={`gap-1.5 text-xs h-7 transition-colors ${
              pushEnabled
                ? "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                : "text-muted-foreground"
            }`}>
            {pushLoading
              ? <Loader2 className="size-3 animate-spin" />
              : pushEnabled
                ? <Bell className="size-3" />
                : <BellOff className="size-3" />}
            {pushLoading ? "…" : pushEnabled ? "Alerts On" : "Enable Alerts"}
          </Button>

          {/* Test button — only meaningful when alerts are on */}
          {pushEnabled ? (
            <Button size="sm" variant="outline" onClick={sendTestAlert} disabled={testLoading}
              className={`gap-1.5 text-xs h-7 transition-colors ${
                testResult === "ok"
                  ? "border-green-500 text-green-600"
                  : testResult === "err"
                  ? "border-destructive text-destructive"
                  : ""
              }`}>
              {testLoading
                ? <Loader2 className="size-3 animate-spin" />
                : <FlaskConical className="size-3" />}
              {testResult === "ok" ? "Sent!" : testResult === "err" ? "Failed" : "Test"}
            </Button>
          ) : (
            <span className="text-[10px] text-muted-foreground/60 italic">enable alerts to test</span>
          )}

          <Button size="sm" variant="outline" onClick={fetchData} disabled={loading}
            className="h-7 w-7 p-0">
            <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Summary row */}
      {loading && !data && (
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-lg" />)}
        </div>
      )}
      {data?.run && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-border/50">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-1">Pass Rate</p>
              <p className="text-2xl font-bold tabular-nums">{passRate}%</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-1">Passing</p>
              <p className="text-2xl font-bold text-green-500 tabular-nums">{data.run.pass_count}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground mb-1">Failing</p>
              <p className={`text-2xl font-bold tabular-nums ${data.run.fail_count > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {data.run.fail_count}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      {data?.run === null && !loading && (
        <p className="text-sm text-muted-foreground">No QA runs yet. Run sop-75 to populate.</p>
      )}

      {/* Open alerts */}
      {data?.alerts && data.alerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Open Alerts</h4>
          {data.alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
              <AlertTriangle className={`size-3.5 mt-0.5 shrink-0 ${a.severity === "critical" ? "text-destructive" : "text-amber-500"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium">{a.project_name}</span>
                  <SeverityBadge severity={a.severity} />
                </div>
                <p className="text-xs text-muted-foreground truncate">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Per-project health cards */}
      {data?.results && data.results.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Projects</h4>
          <div className="grid grid-cols-1 gap-2">
            {data.results.map((r) => (
              <div key={r.project_id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-card px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{r.project_name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{r.url}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {r.response_ms && (
                    <span className={`text-[10px] tabular-nums ${r.response_ms > 3000 ? "text-amber-500" : "text-muted-foreground"}`}>
                      {r.response_ms}ms
                    </span>
                  )}
                  {r.http_status && (
                    <span className="text-[10px] text-muted-foreground tabular-nums">{r.http_status}</span>
                  )}
                  <StatusBadge passed={r.passed} error={r.error} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
