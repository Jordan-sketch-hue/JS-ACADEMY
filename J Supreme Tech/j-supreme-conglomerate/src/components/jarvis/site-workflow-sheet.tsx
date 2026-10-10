"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowUpRight,
  CheckCircle2,
  Circle,
  CircleSlash,
  ExternalLink,
  Loader2,
  Monitor,
  PlayCircle,
  RotateCcw,
  ScanSearch,
  Smartphone,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CheckState, JarvisDeployment, JarvisSite, WorkflowTemplate } from "@/lib/jarvis/types";
import {
  applyChecks,
  cycleCheck,
  getSiteState,
  recordRun,
  saveNote,
  type SiteWorkflowState,
} from "@/lib/jarvis/store";
import { resolveStepState, scoreSite } from "@/lib/jarvis/scoring";

type Props = {
  site: JarvisSite;
  template: WorkflowTemplate;
  ownerId: string;
  vercelConnected: boolean;
  onChange: () => void;
};

const STATE_UI: Record<CheckState, { icon: typeof Circle; cls: string; label: string }> = {
  pass: { icon: CheckCircle2, cls: "text-positive", label: "Done" },
  fail: { icon: XCircle, cls: "text-destructive", label: "Missing" },
  na: { icon: CircleSlash, cls: "text-muted-foreground/50", label: "N/A" },
  pending: { icon: Circle, cls: "text-muted-foreground/40", label: "Pending" },
};

export function SiteWorkflowSheet({
  site,
  template,
  ownerId,
  vercelConnected,
  onChange,
}: Props) {
  const [manual, setManual] = useState<SiteWorkflowState>(() =>
    getSiteState(ownerId, site.id),
  );
  const [note, setNote] = useState(manual.note);

  const score = useMemo(
    () => scoreSite(template, site, manual),
    [template, site, manual],
  );

  const sync = (next: SiteWorkflowState) => {
    setManual({ ...next });
    onChange();
  };

  const projectName = site.vercelProjectName ?? site.name;

  const [detecting, setDetecting] = useState(false);
  const [detect, setDetect] = useState<{ keys: string[]; applied: number } | null>(null);
  const [detectError, setDetectError] = useState<string | null>(null);

  const autoDetect = async () => {
    setDetecting(true);
    setDetectError(null);
    try {
      const res = await fetch(
        `/api/v1/vercel/env?project=${encodeURIComponent(projectName)}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as {
        keys?: string[];
        satisfies?: Record<string, CheckState>;
        error?: string;
      };
      if (!res.ok) {
        setDetectError(data.error ?? "Could not read env from Vercel.");
        return;
      }
      const satisfies = data.satisfies ?? {};
      sync(applyChecks(ownerId, site.id, satisfies));
      setDetect({ keys: data.keys ?? [], applied: Object.keys(satisfies).length });
    } catch (e) {
      setDetectError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setDetecting(false);
    }
  };

  const runChecks = () => {
    let passed = 0;
    let total = 0;
    for (const stage of template.stages) {
      for (const step of stage.steps) {
        if (step.kind !== "auto") continue;
        total += 1;
        if (resolveStepState(site, step, manual) === "pass") passed += 1;
      }
    }
    sync(recordRun(ownerId, site.id, passed, total));
  };

  return (
    <>
      <SheetHeader className="space-y-2 pr-8">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", {
            "bg-positive": site.health?.status === "healthy",
            "bg-warning": site.health?.status === "warning",
            "bg-destructive": site.health?.status === "offline",
            "bg-muted-foreground/40": site.health?.status === "not-deployed" || !site.health,
          })} />
          <SheetTitle className="text-lg">{site.name}</SheetTitle>
        </div>
        <a
          href={site.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {site.url.replace(/^https?:\/\//, "")}
          <ArrowUpRight className="h-3 w-3" />
        </a>
      </SheetHeader>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Launch readiness</span>
          <span className="tabular-nums text-muted-foreground">
            {score.overall.passed}/{score.overall.applicable} steps · {score.overall.pct}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              score.overall.pct >= 100 ? "bg-positive" : score.overall.pct >= 40 ? "bg-primary" : "bg-warning",
            )}
            style={{ width: `${score.overall.pct}%` }}
          />
        </div>
      </div>

      <Tabs defaultValue="checklist" className="mt-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
          <TabsTrigger value="deploys">Deploys</TabsTrigger>
        </TabsList>

        {/* ---- CHECKLIST ---- */}
        <TabsContent value="checklist" className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Tap a manual step to cycle: Done → N/A → Missing → Pending.
            </p>
            <div className="flex items-center gap-2">
              {vercelConnected && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void autoDetect()}
                  disabled={detecting}
                  title="Read this project's env vars from Vercel and auto-tick the integration steps"
                >
                  {detecting ? (
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  ) : (
                    <ScanSearch className="mr-1.5 h-4 w-4" />
                  )}
                  Auto-detect keys
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={runChecks}>
                <PlayCircle className="mr-1.5 h-4 w-4" />
                Snapshot run
              </Button>
            </div>
          </div>

          {detectError && (
            <p className="rounded-md border border-destructive/40 bg-destructive/[0.08] px-3 py-2 text-xs text-destructive">
              {detectError}
            </p>
          )}
          {detect && (
            <div className="rounded-md border border-positive/40 bg-positive/[0.06] px-3 py-2 text-xs">
              <p className="font-medium text-positive">
                Auto-ticked {detect.applied} step{detect.applied === 1 ? "" : "s"} from{" "}
                {detect.keys.length} env var{detect.keys.length === 1 ? "" : "s"} on Vercel.
              </p>
              {detect.keys.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {detect.keys.map((k) => (
                    <Badge key={k} variant="outline" className="px-1.5 py-0 font-mono text-[10px]">
                      {k}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="mt-1.5 text-muted-foreground">
                Supabase admin password &amp; Resend domain stay manual — a key existing doesn&apos;t prove
                those are truly done.
              </p>
            </div>
          )}

          {template.stages.map((stage) => {
            const sr = score.byStage[stage.id];
            return (
              <div key={stage.id} className="rounded-lg border border-border/60">
                <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">{stage.label}</p>
                    {stage.hint && (
                      <p className="text-[11px] text-muted-foreground">{stage.hint}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="shrink-0 tabular-nums">
                    {sr.passed}/{sr.applicable}
                  </Badge>
                </div>
                <ul className="divide-y divide-border/40">
                  {stage.steps.map((step) => {
                    const state = resolveStepState(site, step, manual);
                    const ui = STATE_UI[state];
                    const Icon = ui.icon;
                    const isAuto = step.kind === "auto";
                    const autoDetail = isAuto && step.signal ? site.auto[step.signal]?.detail : undefined;
                    return (
                      <li key={step.id}>
                        <button
                          type="button"
                          disabled={isAuto}
                          onClick={() => {
                            if (!isAuto)
                              sync(cycleCheck(ownerId, site.id, step.id, site.seedChecks?.[step.id]));
                          }}
                          className={cn(
                            "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors",
                            isAuto ? "cursor-default" : "hover:bg-muted/40",
                          )}
                        >
                          <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", ui.cls)} />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="text-sm">{step.label}</span>
                              {isAuto && (
                                <Badge variant="outline" className="px-1 py-0 text-[9px] uppercase">
                                  auto
                                </Badge>
                              )}
                            </span>
                            {(step.description || autoDetail) && (
                              <span className="block text-[11px] text-muted-foreground">
                                {autoDetail ?? step.description}
                              </span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Notes</label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => sync(saveNote(ownerId, site.id, note))}
              placeholder="Blockers, credentials location, who owns DNS…"
              rows={3}
            />
          </div>
        </TabsContent>

        {/* ---- SANDBOX ---- */}
        <TabsContent value="sandbox" className="pt-4">
          <SandboxPane url={site.url} />
        </TabsContent>

        {/* ---- DEPLOYS ---- */}
        <TabsContent value="deploys" className="pt-4">
          <DeploysPane
            projectName={projectName}
            vercelConnected={vercelConnected}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

/* ----------------------------- Sandbox ----------------------------- */

function SandboxPane({ url }: { url: string }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [nonce, setNonce] = useState(0);
  const embeddable = url.startsWith("http");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-md border border-border/60 p-0.5">
          <Button
            size="sm"
            variant={device === "desktop" ? "secondary" : "ghost"}
            className="h-7 px-2"
            onClick={() => setDevice("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={device === "mobile" ? "secondary" : "ghost"}
            className="h-7 px-2"
            onClick={() => setDevice("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setNonce((n) => n + 1)}>
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Reload
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1.5 h-4 w-4" />
              New tab
            </a>
          </Button>
        </div>
      </div>

      <div className="flex justify-center rounded-lg border border-border/60 bg-muted/20 p-2">
        {embeddable ? (
          <iframe
            key={nonce}
            src={url}
            title="Live sandbox"
            className={cn(
              "h-[60vh] rounded-md border border-border/60 bg-background",
              device === "mobile" ? "w-[390px]" : "w-full",
            )}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerPolicy="no-referrer"
          />
        ) : (
          <p className="py-12 text-sm text-muted-foreground">No live URL to preview.</p>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <TriangleAlert className="h-3.5 w-3.5" />
        If the frame is blank, the site blocks embedding (X-Frame-Options) — use “New tab” to test it.
      </p>
    </div>
  );
}

/* ----------------------------- Deploys ----------------------------- */

function DeploysPane({
  projectName,
  vercelConnected,
}: {
  projectName: string;
  vercelConnected: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deployments, setDeployments] = useState<JarvisDeployment[]>([]);
  const [target, setTarget] = useState<JarvisDeployment | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [reverting, setReverting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/vercel/deployments?project=${encodeURIComponent(projectName)}`, {
        cache: "no-store",
      });
      const data = (await res.json()) as { deployments?: JarvisDeployment[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not load deployments.");
        return;
      }
      setDeployments(data.deployments ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }, [projectName]);

  useEffect(() => {
    if (vercelConnected) void load();
  }, [vercelConnected, load]);

  const previous = deployments.find((d) => !d.isCurrent && d.state === "READY");

  const doRevert = async () => {
    if (!target) return;
    setReverting(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/vercel/revert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: projectName,
          deploymentId: target.uid,
          confirm: confirmText,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Revert failed.");
        return;
      }
      setToast(data.message ?? "Reverted.");
      setTarget(null);
      setConfirmText("");
      setTimeout(() => void load(), 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setReverting(false);
    }
  };

  if (!vercelConnected) {
    return (
      <div className="rounded-lg border border-warning/40 bg-warning/[0.06] p-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2 font-medium text-foreground">
          <TriangleAlert className="h-4 w-4 text-warning" />
          Connect Vercel to manage deploys
        </p>
        <p className="mt-1">
          Add <code className="text-foreground">VERCEL_ACCESS_TOKEN</code> and{" "}
          <code className="text-foreground">VERCEL_TEAM_ID</code> to enable deployment history and one-click revert.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Production deployments for <span className="font-mono">{projectName}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => void load()} disabled={loading}>
            <RotateCcw className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={!previous}
            onClick={() => setTarget(previous ?? null)}
          >
            <RotateCcw className="mr-1.5 h-4 w-4" />
            Revert to previous
          </Button>
        </div>
      </div>

      {toast && (
        <p className="rounded-md border border-positive/40 bg-positive/[0.08] px-3 py-2 text-xs text-positive">
          {toast}
        </p>
      )}
      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/[0.08] px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      {loading && deployments.length === 0 ? (
        <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading deployments…
        </p>
      ) : (
        <ul className="space-y-2">
          {deployments.map((d) => (
            <li
              key={d.uid}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={d.state === "READY" ? "success" : d.state === "ERROR" ? "destructive" : "secondary"}
                    className="px-1.5 py-0 text-[10px]"
                  >
                    {d.state}
                  </Badge>
                  {d.isCurrent && (
                    <Badge variant="default" className="px-1.5 py-0 text-[10px]">
                      Live
                    </Badge>
                  )}
                  <span className="truncate text-xs text-muted-foreground">
                    {d.commitMessage ?? d.url.replace(/^https?:\/\//, "")}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {d.created ? new Date(d.created).toLocaleString() : ""}
                  {d.creator ? ` · ${d.creator}` : ""}
                </p>
              </div>
              {!d.isCurrent && d.state === "READY" && (
                <Button size="sm" variant="ghost" onClick={() => setTarget(d)}>
                  Revert here
                </Button>
              )}
            </li>
          ))}
          {deployments.length === 0 && !error && (
            <p className="py-8 text-center text-sm text-muted-foreground">No production deployments found.</p>
          )}
        </ul>
      )}

      {/* Typed-confirmation revert dialog */}
      <Dialog
        open={!!target}
        onOpenChange={(o) => {
          if (!o) {
            setTarget(null);
            setConfirmText("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-destructive" />
              Revert live production?
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p>
                  This points <span className="font-semibold text-foreground">{projectName}</span>’s production
                  domains at deployment{" "}
                  <span className="font-mono text-xs">{target?.uid.slice(0, 12)}…</span>. Anyone visiting the live
                  site will see that older build immediately.
                </p>
                <p>
                  Type <span className="font-mono font-semibold text-foreground">{projectName}</span> to confirm.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={projectName}
            autoFocus
          />
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setTarget(null);
                setConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmText !== projectName || reverting}
              onClick={() => void doRevert()}
            >
              {reverting && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Revert production
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
