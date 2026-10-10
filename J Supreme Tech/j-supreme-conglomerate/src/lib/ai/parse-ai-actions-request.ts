import {
  parseAiUserMessageForIntent,
  type ParsedAiCommand,
} from "@/components/app/ai-command-parser";
import type { CreateCrmDealInput } from "@/lib/data/crm-records";
import type { LeadStage } from "@/lib/data/seed";

const STAGES: readonly LeadStage[] = ["cold", "warm", "negotiation", "closed", "lost"];

function pickStr(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function parseLane(v: unknown): "tech" | "marketing" | "trading" | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.toLowerCase().trim();
  if (s === "tech" || s === "marketing" || s === "trading") return s;
  return undefined;
}

function parseStage(v: unknown): LeadStage | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.toLowerCase().trim();
  if ((STAGES as readonly string[]).includes(s)) return s as LeadStage;
  return undefined;
}

/**
 * Deterministic quick actions: optional `kind` + fields, or legacy `{ message }` string parse.
 */
export function parseAiActionsRequest(body: Record<string, unknown>): ParsedAiCommand | null {
  const kind = body.kind;
  if (kind === "todo") {
    const title = typeof body.title === "string" ? body.title.trim() : "";
    return {
      kind: "todo",
      title: title || "New task",
      laneHint: parseLane(body.laneHint) ?? parseLane(body.lane_hint),
      notes: pickStr(body.notes),
      due_date: pickStr(body.due_date),
    };
  }

  if (kind === "crm_add") {
    const input: CreateCrmDealInput = {
      business_name: typeof body.business_name === "string" ? body.business_name : "",
      contact_name: pickStr(body.contact_name),
      email: pickStr(body.email),
      phone: pickStr(body.phone),
      industry: pickStr(body.industry),
      notes: pickStr(body.notes),
      services_needed: pickStr(body.services_needed),
      project_deadline: pickStr(body.project_deadline),
    };
    const st = parseStage(body.stage);
    if (st) input.stage = st;

    const budget = body.budget_amount;
    if (typeof budget === "number" && !Number.isNaN(budget)) {
      input.budget_amount = budget;
    } else if (typeof budget === "string" && budget.trim()) {
      const n = Number(budget.replace(/,/g, ""));
      if (!Number.isNaN(n)) input.budget_amount = n;
    }

    return { kind: "crm_add", input };
  }

  const message = typeof body.message === "string" ? body.message : "";
  return parseAiUserMessageForIntent(message);
}
