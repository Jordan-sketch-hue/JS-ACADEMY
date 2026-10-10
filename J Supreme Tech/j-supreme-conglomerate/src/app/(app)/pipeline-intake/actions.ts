"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  createIntakeForm,
  deleteIntakeFormAndSubmissions,
  deleteIntakeSubmission,
  listIntakeSubmissions,
  updateIntakeSubmission,
  type CreateIntakeFormInput,
} from "@/lib/data/intake-forms";
import {
  startWorkflowFromIntake,
  workflowStatusForSubmissions,
} from "@/lib/data/project-workflows";

export async function createPipelineIntakeFormAction(input: CreateIntakeFormInput) {
  const owner = await requireOwnerClerkId();
  const r = await createIntakeForm(owner, input);
  if (r.ok) revalidatePath("/pipeline-intake");
  return r;
}

export async function refreshIntakeSubmissionsAction(formId: string) {
  const owner = await requireOwnerClerkId();
  return listIntakeSubmissions(owner, formId);
}

export async function workflowStatusesForSubmissionsAction(submissionIds: string[]) {
  const owner = await requireOwnerClerkId();
  return workflowStatusForSubmissions(owner, submissionIds);
}

export async function deleteIntakeSubmissionAction(formId: string, submissionId: string) {
  const owner = await requireOwnerClerkId();
  const r = await deleteIntakeSubmission(owner, formId, submissionId);
  if (r.ok) revalidatePath("/pipeline-intake");
  return r;
}

export async function deleteIntakeFormAction(formId: string) {
  const owner = await requireOwnerClerkId();
  const r = await deleteIntakeFormAndSubmissions(owner, formId);
  if (r.ok) revalidatePath("/pipeline-intake");
  return r;
}

export async function updateIntakeSubmissionAction(
  formId: string,
  submissionId: string,
  answers: Record<string, string>,
) {
  const owner = await requireOwnerClerkId();
  const r = await updateIntakeSubmission(owner, formId, submissionId, answers);
  if (r.ok) revalidatePath("/pipeline-intake");
  return r;
}

export async function startWorkflowFromIntakeAction(
  formId: string,
  submissionId: string,
) {
  const owner = await requireOwnerClerkId();
  const r = await startWorkflowFromIntake(owner, formId, submissionId);
  if (r.ok) {
    revalidatePath("/pipeline-intake");
    revalidatePath("/projects");
    revalidatePath("/todos");
  }
  return r;
}
