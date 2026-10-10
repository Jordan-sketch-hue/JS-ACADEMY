"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  createMeeting,
  deleteMeeting,
  setMeetingStatus,
  updateMeeting,
  type MeetingInput,
  type MeetingPatch,
  type MeetingStatus,
} from "@/lib/data/meetings";

export async function createMeetingAction(input: MeetingInput) {
  const owner = await requireOwnerClerkId();
  const result = await createMeeting(owner, input);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/meetings");
  revalidatePath("/dashboard");
  return { ok: true as const, meeting: result.meeting };
}

export async function updateMeetingAction(
  meetingId: string,
  patch: MeetingPatch,
) {
  const owner = await requireOwnerClerkId();
  const result = await updateMeeting(owner, meetingId, patch);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/meetings");
  return { ok: true as const, meeting: result.meeting };
}

export async function setMeetingStatusAction(
  meetingId: string,
  status: MeetingStatus,
) {
  const owner = await requireOwnerClerkId();
  const result = await setMeetingStatus(owner, meetingId, status);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/meetings");
  return { ok: true as const, meeting: result.meeting };
}

export async function deleteMeetingAction(meetingId: string) {
  const owner = await requireOwnerClerkId();
  const result = await deleteMeeting(owner, meetingId);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/meetings");
  return { ok: true as const };
}
