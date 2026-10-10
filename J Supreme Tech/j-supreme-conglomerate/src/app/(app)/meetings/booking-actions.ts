"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  upsertBookingSettings,
  type BookingSettingsPatch,
} from "@/lib/data/booking";

export async function saveBookingSettingsAction(patch: BookingSettingsPatch) {
  const owner = await requireOwnerClerkId();
  const res = await upsertBookingSettings(owner, patch);
  if (res.ok) revalidatePath("/meetings");
  return res;
}
