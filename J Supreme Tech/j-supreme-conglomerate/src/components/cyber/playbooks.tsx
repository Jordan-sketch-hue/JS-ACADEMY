/**
 * Incident-Response Playbooks (SOAR runbooks).
 * NIST IR lifecycle — Detect → Contain → Eradicate → Recover — per threat class.
 * Server component: pure render from the typed playbook model.
 */

import { Workflow, Zap, Hand, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAYBOOKS, SEVERITY_RANK, type Severity } from "@/lib/cyber/data";

const SEV_CLS: Record<Severity, string> = {
  critical: "text-negative border-negative/40 bg-negative/10",
  high: "text-warning border-warning/40 bg-warning/10",
  medium: "text-info border-info/40 bg-info/10",
  low: "text-muted-foreground border-border bg-muted/40",
};

const PHASE_CLS: Record<string, string> = {
  Detect: "text-info",
  Contain: "text-warning",
  Eradicate: "text-negative",
  Recover: "text-positive",
};

export function Playbooks() {
  const ordered = [...PLAYBOOKS].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
              <Workflow className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-jarvis text-xl font-semibold tracking-tight">Incident Response Playbooks</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                One runbook per threat class, structured on the NIST lifecycle —
                <span className="text-info"> Detect</span> →
                <span className="text-warning"> Contain</span> →
                <span className="text-negative"> Eradicate</span> →
                <span className="text-positive"> Recover</span>. The
                <Zap className="mx-1 inline h-3 w-3" />
                marked ones are wired for autonomous execution by the defense layer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 lg:grid-cols-2">
        {ordered.map((pb) => (
          <Card key={pb.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    {pb.automatable ? (
                      <Zap className="h-3.5 w-3.5 shrink-0 text-warning" />
                    ) : (
                      <Hand className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                    {pb.title}
                  </p>
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0" />
                    <span><span className="font-medium text-foreground/70">Trigger:</span> {pb.trigger}</span>
                  </p>
                </div>
                <Badge variant="outline" className={`shrink-0 text-[9px] uppercase ${SEV_CLS[pb.severity]}`}>
                  {pb.severity}
                </Badge>
              </div>

              <ol className="mt-3 space-y-2">
                {pb.steps.map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-xs">
                    <span className={`mt-0.5 w-16 shrink-0 font-mono text-[10px] font-semibold uppercase ${PHASE_CLS[step.phase]}`}>
                      {step.phase}
                    </span>
                    <span className="text-muted-foreground">{step.action}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
