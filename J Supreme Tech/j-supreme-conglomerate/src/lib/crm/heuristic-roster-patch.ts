import type { LeadStage } from "@/lib/data/seed";
import type { ClientRosterFieldPatch } from "@/lib/data/crm";

const STAGES: LeadStage[] = ["cold", "warm", "negotiation", "closed", "lost"];

/** Regex + heuristics shared by CRM AI parse and quick actions (no OpenAI). */
export function heuristicRosterPatchFromText(text: string): ClientRosterFieldPatch {
  const patch: ClientRosterFieldPatch = {};
  const email = text.match(/\b[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}\b/);
  if (email) patch.email = email[0];

  const phone = text.match(/\+?\d[\d\s().-]{8,}\d\b/);
  if (phone) patch.phone = phone[0].replace(/\s+/g, " ").trim();

  const budget =
    text.match(/\$?\s*([\d,]+(?:\.\d+)?)\s*(k|K|thousand)?\b/i) ??
    text.match(/\bbudget\D{0,12}(\$?\s*[\d,]+(?:\.\d+)?)\s*(k|K)?/i);
  if (budget) {
    const n = Number(String(budget[1]).replace(/,/g, ""));
    if (Number.isFinite(n)) {
      const mult =
        /k|thousand/i.test(String(budget[2] ?? budget[0])) ? 1000 : 1;
      patch.budget_amount = Math.round(n * mult * 100) / 100;
    }
  }

  for (const s of STAGES) {
    if (new RegExp(`\\b${s}\\b`, "i").test(text)) {
      patch.pipeline_stage = s;
      break;
    }
  }

  const due = text.match(/\b(20\d{2}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/(20\d{2}))\b/);
  if (due) {
    const raw = due[1];
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      patch.project_deadline = raw;
    } else {
      const d = new Date(raw);
      if (!Number.isNaN(d.getTime())) {
        patch.project_deadline = d.toISOString().slice(0, 10);
      }
    }
  }

  const contactM = text.match(
    /\b(?:contact|pm|rep)\s*[:\-]?\s*([A-Za-z][A-Za-z\s'.-]{1,80})\b/i,
  );
  if (contactM?.[1]?.trim()) {
    const c = contactM[1].trim();
    if (c.length >= 2 && !/@/.test(c)) patch.contact_name = c;
  }

  const industryM = text.match(/\bindustry\s*[:\-]\s*([^,.]+)/i);
  if (industryM?.[1]?.trim()) patch.industry = industryM[1].trim();

  const svcM = text.match(/\b(?:needs|services?|scope)\s*[:\-]\s*([^,.]+)/i);
  if (svcM?.[1]?.trim()) patch.services_needed = svcM[1].trim();

  return patch;
}
