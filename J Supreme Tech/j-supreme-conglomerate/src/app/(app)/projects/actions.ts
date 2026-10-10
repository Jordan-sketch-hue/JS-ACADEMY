"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  runProjectWorkflowAutomation,
  updateProjectWorkflowLinks,
  type WorkflowLinkInput,
} from "@/lib/data/project-workflows";

export async function updateProjectWorkflowLinksAction(
  workflowId: string,
  input: WorkflowLinkInput,
) {
  const owner = await requireOwnerClerkId();
  const r = await updateProjectWorkflowLinks(owner, workflowId, input);
  if (r.ok) {
    revalidatePath("/projects");
    revalidatePath("/pipeline-intake");
  }
  return r;
}

export async function runProjectWorkflowAutomationAction(workflowId: string) {
  const owner = await requireOwnerClerkId();
  const r = await runProjectWorkflowAutomation(owner, workflowId);
  if (r.ok) {
    revalidatePath("/projects");
    revalidatePath("/pipeline-intake");
    revalidatePath("/todos");
  }
  return r;
}
