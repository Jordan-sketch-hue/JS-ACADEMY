"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  createCrmDeal,
  deleteCrmClient,
  swapClientRosterWithNeighbor,
  updateClientExtraHyperlinks,
  updateClientMarketingAssetLinks,
  updateClientRosterFields,
  updateClientServiceCategory,
  type CreateCrmDealInput,
  type ClientRosterFieldPatch,
  updateLeadStage,
} from "@/lib/data/crm";
import {
  runProjectWorkflowAutomation,
  startWorkflowFromCrmClient,
} from "@/lib/data/project-workflows";
import type { LeadStage } from "@/lib/data/seed";

export async function createCrmDealAction(input: CreateCrmDealInput) {
  const owner = await requireOwnerClerkId();
  const result = await createCrmDeal(owner, input);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/crm");
  revalidatePath("/dashboard");
  return { ok: true as const, client: result.client, lead: result.lead };
}

export async function updateLeadStageAction(leadId: string, stage: LeadStage) {
  const owner = await requireOwnerClerkId();
  const result = await updateLeadStage(owner, leadId, stage);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/crm");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function swapClientRosterAction(
  clientId: string,
  direction: "up" | "down",
) {
  const owner = await requireOwnerClerkId();
  const result = await swapClientRosterWithNeighbor(owner, clientId, direction);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/crm");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function deleteCrmClientAction(clientId: string) {
  const owner = await requireOwnerClerkId();
  const result = await deleteCrmClient(owner, clientId);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/crm");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function updateClientServiceCategoryAction(
  clientId: string,
  category: string,
) {
  const owner = await requireOwnerClerkId();
  const result = await updateClientServiceCategory(owner, clientId, category);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/crm");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function updateClientMarketingAssetLinksAction(
  clientId: string,
  links: { label: string; url: string }[],
) {
  const owner = await requireOwnerClerkId();
  const result = await updateClientMarketingAssetLinks(owner, clientId, links);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/crm");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function updateClientRosterFieldsAction(
  clientId: string,
  patch: ClientRosterFieldPatch,
) {
  const owner = await requireOwnerClerkId();
  const result = await updateClientRosterFields(owner, clientId, patch);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/crm");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function updateClientExtraHyperlinksAction(
  clientId: string,
  links: { label: string; url: string }[],
) {
  const owner = await requireOwnerClerkId();
  const result = await updateClientExtraHyperlinks(owner, clientId, links);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/crm");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function runClientWorkflowAutomationAction(clientId: string) {
  const owner = await requireOwnerClerkId();
  const workflow = await startWorkflowFromCrmClient(owner, clientId);
  if (!workflow.ok) return { ok: false as const, error: workflow.error };

  const automated = await runProjectWorkflowAutomation(owner, workflow.workflow.id);
  if (!automated.ok) return { ok: false as const, error: automated.error };

  revalidatePath("/crm");
  revalidatePath("/projects");
  revalidatePath("/pipeline-intake");
  revalidatePath("/todos");
  return {
    ok: true as const,
    workflow: automated.workflow,
  };
}
