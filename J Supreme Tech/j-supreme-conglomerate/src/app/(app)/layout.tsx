import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAllowedClerkUser } from "@/lib/auth/clerk-operator-email";
import { getOwnerClerkId } from "@/lib/session";
import { isClerkConfigured } from "@/lib/env/clerk";
import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { AppShell } from "@/components/app/app-shell";
import { WorkspaceProvider } from "@/components/app/workspace-context";
import { PushSubscribe } from "@/components/PushSubscribe";

export const dynamic = "force-dynamic";

export default async function AppLayout({  children,
}: {
  children: React.ReactNode;
}) {
  const devAuth =
    process.env.NODE_ENV === "development" &&
    process.env.OS_DEV_AUTH_BYPASS === "true";
  const persistLocally = !isSupabasePersistenceEnabled();

  // Local preview without Clerk keys: honor the documented dev bypass (also
  // applied in middleware + session.ts). Dev-gated, so production still requires
  // a real signed-in operator below.
  if (devAuth) {
    const uid = (await getOwnerClerkId()) ?? "user_dev_admin";
    return (
      <WorkspaceProvider ownerId={uid} persistLocally={persistLocally}>
        <AppShell devAuth setupModeNoClerk={false} persistLocally={persistLocally}>
          {children}
        </AppShell>
      </WorkspaceProvider>
    );
  }

  if (!isClerkConfigured()) {
    redirect("/sign-in?reason=auth_required");
  }

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  if (!(await isAllowedClerkUser(userId))) {
    redirect("/access-denied");
  }

  const uid = await getOwnerClerkId();
  if (!uid) {
    redirect("/sign-in");
  }

  return (
    <WorkspaceProvider ownerId={uid} persistLocally={persistLocally}>
      <AppShell
        devAuth={devAuth}
        setupModeNoClerk={false}
        persistLocally={persistLocally}
      >
        <PushSubscribe />
        {children}
      </AppShell>
    </WorkspaceProvider>
  );
}
