import type { LeadStage } from "@/lib/data/seed";
import type { TaskLaneInsight } from "@/lib/data/seed";
import type { Todo } from "@/lib/data/todos";

export type TodoCountSummary = {
  open: number;
  done: number;
  total: number;
  /** Open tasks with no lane assigned. */
  uncategorized: number;
};

export const LEAD_PIPELINE_STAGES: LeadStage[] = [
  "cold",
  "warm",
  "negotiation",
  "closed",
  "lost",
];

/** Stages still in active pursuit (excludes closed / lost). */
export const ACTIVE_LEAD_STAGES: LeadStage[] = ["cold", "warm", "negotiation"];

export type LeadCountSummary = {
  total: number;
  byStage: Record<LeadStage, number>;
  inPipeline: number;
};

export function emptyLeadsByStage(): Record<LeadStage, number> {
  return { cold: 0, warm: 0, negotiation: 0, closed: 0, lost: 0 };
}

export function summarizeTodos(todos: Todo[]): TodoCountSummary {
  let open = 0;
  let done = 0;
  let uncategorized = 0;
  for (const t of todos) {
    if (t.done) {
      done++;
    } else {
      open++;
      if (!t.category_id) uncategorized++;
    }
  }
  return { open, done, total: open + done, uncategorized };
}

export function summarizeLeadsByStage<T extends { stage: LeadStage }>(
  leads: T[],
): LeadCountSummary {
  const byStage = emptyLeadsByStage();
  for (const l of leads) {
    if (l.stage in byStage) byStage[l.stage] += 1;
  }
  return summarizeLeadsByStageRecord(byStage);
}

export function summarizeLeadsByStageRecord(
  byStage: Record<LeadStage, number>,
): LeadCountSummary {
  const inPipeline = ACTIVE_LEAD_STAGES.reduce((sum, stage) => sum + (byStage[stage] ?? 0), 0);
  const total = Object.values(byStage).reduce((sum, n) => sum + n, 0);
  return { total, byStage, inPipeline };
}

export function sumTaskLaneOpen(lanes: TaskLaneInsight[]): number {
  return lanes.reduce((sum, lane) => sum + lane.open, 0);
}

export function sumTaskLaneDone(lanes: TaskLaneInsight[]): number {
  return lanes.reduce((sum, lane) => sum + lane.done, 0);
}
