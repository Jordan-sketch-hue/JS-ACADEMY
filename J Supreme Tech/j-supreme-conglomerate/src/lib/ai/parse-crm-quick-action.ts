import { heuristicRosterPatchFromText } from "@/lib/crm/heuristic-roster-patch";
import type { CreateCrmDealInput } from "@/lib/data/crm-records";

/** Colon/dash or a space after the keyword (e.g. “add client Acme”, “crm: Acme”). */
const CRM_LEAD_PREFIX =
  /^\s*(?:(?:add|create|log)\s+(?:a\s+)?(?:new\s+)?(?:client|lead|crm\s+client|roster\s+row|pipeline\s+card|deal)|(?:new)\s+(?:client|lead)|(?:crm|roster|pipeline))(?:\s*[:\-–]\s*|\s+)(.+)$/i;

function isStageWord(s: string): boolean {
  return /^(cold|warm|negotiation|closed|lost)$/i.test(s.trim());
}

function stripKnownBits(
  sentence: string,
  patch: ReturnType<typeof heuristicRosterPatchFromText>,
): string {
  let s = sentence;
  if (patch.email) s = s.replace(patch.email, " ");
  if (patch.phone) s = s.replace(patch.phone, " ");
  if (patch.budget_amount != null) {
    s = s.replace(/\$?\s*[\d,]+(?:\.\d+)?\s*(k|K|thousand)?\b/gi, " ");
  }
  if (patch.project_deadline) s = s.replace(patch.project_deadline, " ");
  if (patch.contact_name) {
    const esc = patch.contact_name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    s = s.replace(new RegExp(esc, "gi"), " ");
  }
  if (patch.industry) s = s.replace(new RegExp(`industry\\s*:\\s*${patch.industry}`, "i"), " ");
  if (patch.services_needed) {
    s = s.replace(new RegExp(`(?:needs|services?)\\s*:\\s*${patch.services_needed}`, "i"), " ");
  }
  if (patch.pipeline_stage) {
    s = s.replace(new RegExp(`\\b${patch.pipeline_stage}\\b`, "gi"), " ");
  }
  return s.replace(/\s+/g, " ").trim();
}

function deriveBusinessName(
  sentence: string,
  patch: ReturnType<typeof heuristicRosterPatchFromText>,
): string {
  const segments = sentence
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

  for (const seg of segments) {
    if (patch.email && seg.includes(patch.email)) continue;
    if (patch.phone && seg.replace(/\s/g, "") === patch.phone.replace(/\s/g, "")) continue;
    if (/@/.test(seg)) continue;
    if (/^\+?\d[\d\s().-]{8,}\d$/.test(seg.replace(/\s/g, ""))) continue;
    if (isStageWord(seg)) continue;
    if (/^\$?\s*[\d,]+/i.test(seg) && /\bk\b/i.test(seg)) continue;
    const cleaned = seg.replace(/^(?:for|client|company)\s+/i, "").trim();
    if (cleaned.length >= 2) return cleaned.slice(0, 200);
  }

  const dashSplit = sentence.split(/\s+[—–-]\s+/);
  if (dashSplit[0]?.trim() && !/@/.test(dashSplit[0])) {
    const c = dashSplit[0].trim().replace(/^(?:for|client)\s+/i, "");
    if (c.length >= 2) return c.slice(0, 200);
  }

  const rest = stripKnownBits(sentence, patch);
  if (rest.length >= 2) return rest.slice(0, 200);

  if (patch.email) return `Lead (${patch.email})`;
  return "New roster entry";
}

/**
 * If `raw` starts with an add-client / add-lead style prefix, returns a draft for `createCrmDeal`.
 */
export function tryParseCrmQuickAdd(raw: string): CreateCrmDealInput | null {
  const text = raw.trim();
  if (!text) return null;
  const m = text.match(CRM_LEAD_PREFIX);
  if (!m?.[1]) return null;

  const sentence = m[1].trim();
  if (!sentence) return null;

  const patch = heuristicRosterPatchFromText(sentence);
  const business_name = deriveBusinessName(sentence, patch);

  return {
    business_name,
    contact_name: patch.contact_name ?? null,
    email: patch.email ?? null,
    phone: patch.phone ?? null,
    industry: patch.industry ?? null,
    services_needed: patch.services_needed ?? null,
    budget_amount: patch.budget_amount ?? null,
    project_deadline: patch.project_deadline ?? null,
    last_follow_up_at: patch.last_follow_up_at ?? null,
    next_follow_up_at: patch.next_follow_up_at ?? null,
    follow_up_notes: patch.follow_up_notes ?? null,
    stage: patch.pipeline_stage ?? "cold",
  };
}
