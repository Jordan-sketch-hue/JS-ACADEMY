"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import { generateAndDeliverEod } from "@/lib/notify/eod";

export async function generateEodNowAction() {
  const owner = await requireOwnerClerkId();
  const res = await generateAndDeliverEod(owner);
  revalidatePath("/reports");
  return {
    ok: !!res.report,
    report: res.report,
    saveError: res.saveError,
    emailed: res.emailed,
    emailError: res.emailError,
  };
}
