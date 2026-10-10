/**
 * Minimal layout for the invoice print route.
 * No AppShell, no sidebar — just the invoice document.
 * Auth is enforced the same way as the (app) group.
 */
import { type ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isClerkConfigured } from "@/lib/env/clerk";

export const dynamic = "force-dynamic";

export default async function InvPrintLayout({ children }: { children: ReactNode }) {
  if (isClerkConfigured()) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
  }
  // Render children directly — no AppShell wrapper
  return <>{children}</>;
}
