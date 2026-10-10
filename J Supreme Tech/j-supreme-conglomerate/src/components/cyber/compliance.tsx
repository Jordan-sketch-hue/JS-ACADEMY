/**
 * Compliance & Audit — framework readiness mapping.
 * Server component: renders the typed framework model. Audit-ready posture
 * for SOC 2 / GDPR / PCI / OWASP ASVS with honest readiness percentages.
 */

import { FileCheck2, ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FRAMEWORKS } from "@/lib/cyber/data";

function readinessCls(r: number): string {
  if (r >= 75) return "text-positive";
  if (r >= 50) return "text-warning";
  return "text-negative";
}

export function Compliance() {
  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
              <ClipboardCheck className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-jarvis text-xl font-semibold tracking-tight">Compliance &amp; Audit</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Readiness against the frameworks that matter for a multi-tenant group handling payments and
                personal data. Every control maps to evidence so an audit is a report, not a fire drill.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {FRAMEWORKS.map((f) => (
          <Card key={f.id} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <FileCheck2 className="h-4 w-4 text-foreground/70" />
                    {f.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.scope}</p>
                </div>
                <span className={`font-jarvis text-2xl font-bold ${readinessCls(f.readiness)}`}>{f.readiness}%</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Progress value={f.readiness} className="h-1.5" />
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {f.controlsMet}/{f.controlsTotal}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{f.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground">
          Readiness is self-assessed and tracked here so gaps are visible before an auditor finds them. Closing
          the shared cross-framework controls first — security headers, rate limiting, formal audit logging,
          DSAR workflow — lifts SOC 2, GDPR and OWASP together.
        </CardContent>
      </Card>
    </div>
  );
}
