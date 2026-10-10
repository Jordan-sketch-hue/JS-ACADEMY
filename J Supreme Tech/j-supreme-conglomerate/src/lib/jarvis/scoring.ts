import type { SiteWorkflowState } from "@/lib/jarvis/store";
import type {
  CheckState,
  JarvisSite,
  WorkflowStepDef,
  WorkflowTemplate,
} from "@/lib/jarvis/types";

/**
 * Resolve the effective state of one step for a site.
 * auto = computed signal · manual = operator's stored tap, falling back to the
 * audit-verified seed (site.seedChecks) when the operator hasn't touched it.
 */
export function resolveStepState(
  site: Pick<JarvisSite, "auto" | "seedChecks">,
  step: WorkflowStepDef,
  manual: Pick<SiteWorkflowState, "checks">,
): CheckState {
  if (step.kind === "auto") {
    return step.signal ? (site.auto[step.signal]?.state ?? "pending") : "pending";
  }
  return manual.checks[step.id] ?? site.seedChecks?.[step.id] ?? "pending";
}

export type Readiness = {
  passed: number;
  applicable: number;
  total: number;
  pct: number;
};

function blankReadiness(): Readiness {
  return { passed: 0, applicable: 0, total: 0, pct: 0 };
}

/** Weighted launch-readiness for a site, plus a per-stage breakdown. */
export function scoreSite(
  template: WorkflowTemplate,
  site: Pick<JarvisSite, "auto" | "seedChecks">,
  manual: Pick<SiteWorkflowState, "checks">,
): { overall: Readiness; byStage: Record<string, Readiness> } {
  const overall = blankReadiness();
  const byStage: Record<string, Readiness> = {};
  let weightedPass = 0;
  let weightedApplicable = 0;

  for (const stage of template.stages) {
    const s = blankReadiness();
    let stagePass = 0;
    let stageApplicable = 0;
    for (const step of stage.steps) {
      const w = step.weight ?? 1;
      const state = resolveStepState(site, step, manual);
      s.total += 1;
      overall.total += 1;
      if (state === "na") continue;
      s.applicable += 1;
      overall.applicable += 1;
      stageApplicable += w;
      weightedApplicable += w;
      if (state === "pass") {
        s.passed += 1;
        overall.passed += 1;
        stagePass += w;
        weightedPass += w;
      }
    }
    s.pct = stageApplicable > 0 ? Math.round((stagePass / stageApplicable) * 100) : 0;
    byStage[stage.id] = s;
  }

  overall.pct =
    weightedApplicable > 0 ? Math.round((weightedPass / weightedApplicable) * 100) : 0;
  return { overall, byStage };
}
