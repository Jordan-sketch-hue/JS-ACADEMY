import type { ClientRosterFieldPatch } from "@/lib/data/crm";
import type { CrmClientRecord, CrmLeadRecord } from "@/lib/data/crm-records";
import type { LeadStage } from "@/lib/data/seed";

export function mergeRosterPatchIntoClient(
  c: CrmClientRecord,
  patch: ClientRosterFieldPatch,
): CrmClientRecord {
  const now = new Date().toISOString();
  let n: CrmClientRecord = { ...c, updated_at: now };
  if (patch.business_name !== undefined) n.business_name = patch.business_name;
  if (patch.contact_name !== undefined) n.contact_name = patch.contact_name;
  if (patch.email !== undefined) n.email = patch.email;
  if (patch.phone !== undefined) n.phone = patch.phone;
  if (patch.industry !== undefined) n.industry = patch.industry;
  if (patch.services_needed !== undefined) n.services_needed = patch.services_needed;
  if (patch.budget_amount !== undefined) n.budget_amount = patch.budget_amount;
  if (patch.project_deadline !== undefined) n.project_deadline = patch.project_deadline;
  if (patch.last_follow_up_at !== undefined) n.last_follow_up_at = patch.last_follow_up_at;
  if (patch.next_follow_up_at !== undefined) n.next_follow_up_at = patch.next_follow_up_at;
  if (patch.follow_up_notes !== undefined) n.follow_up_notes = patch.follow_up_notes;
  return n;
}

export function mergeRosterPatchIntoLead(
  l: CrmLeadRecord,
  patch: ClientRosterFieldPatch,
): CrmLeadRecord {
  const now = new Date().toISOString();
  let n: CrmLeadRecord = { ...l, updated_at: now };
  if (patch.business_name !== undefined) n.company = patch.business_name;
  if (patch.contact_name !== undefined) n.contact_name = patch.contact_name;
  if (patch.email !== undefined) n.email = patch.email;
  if (patch.phone !== undefined) n.phone = patch.phone;
  if (patch.follow_up_notes !== undefined) n.follow_up_notes = patch.follow_up_notes;
  if (patch.next_follow_up_at !== undefined) n.next_follow_up_at = patch.next_follow_up_at;
  if (patch.last_follow_up_at !== undefined) n.last_contacted_at = patch.last_follow_up_at;
  if (patch.pipeline_stage !== undefined) n.stage = patch.pipeline_stage as LeadStage;
  return n;
}
