import { auth, currentUser } from "@clerk/nextjs/server";
import { isAllowedClerkUser } from "@/lib/auth/clerk-operator-email";
import { isClerkConfigured } from "@/lib/env/clerk";

const devBypass =
  process.env.NODE_ENV === "development" &&
  process.env.OS_DEV_AUTH_BYPASS === "true";

const DEFAULT_OWNER = "user_setup_full_access";

/**
 * Same owner id as the signed-in/session logic, without async.
 * Use anywhere server code must tag rows the same way as `getOwnerClerkId` (e.g. MT5 ingest).
 */
export function resolveDataOwnerIdSync(): string {
  if (devBypass) {
    return process.env.OS_DEV_USER_ID ?? "user_dev_admin";
  }
  const fromEnv =
    process.env.OS_OWNER_ID?.trim() || process.env.NO_CLERK_OWNER_ID?.trim();
  if (fromEnv) return fromEnv;
  return DEFAULT_OWNER;
}

/**
 * Stable owner id for CRM / tasks / APIs.
 * - With Clerk keys: signed-in Clerk `userId`, or `OS_OWNER_ID` to pin one data namespace.
 * - Without Clerk: env owner or built-in default (single-user mode).
 */
export async function getOwnerClerkId(): Promise<string | null> {
  if (devBypass) {
    return process.env.OS_DEV_USER_ID ?? "user_dev_admin";
  }

  if (isClerkConfigured()) {
    const { userId } = await auth();
    if (!userId) return null;
    if (!(await isAllowedClerkUser(userId))) return null;
    const pinned =
      process.env.OS_OWNER_ID?.trim() || process.env.NO_CLERK_OWNER_ID?.trim();
    return pinned || userId;
  }

  return resolveDataOwnerIdSync();
}

export async function requireOwnerClerkId(): Promise<string> {
  const id = await getOwnerClerkId();
  if (!id) {
    throw new Error("Unauthorized");
  }
  return id;
}

export function isAuthDevBypass(): boolean {
  return !!devBypass;
}

/** True when Clerk keys are absent — app uses env owner id without sign-in. */
export function isNoClerkSetupMode(): boolean {
  return !isClerkConfigured();
}

/** Clerk publicMetadata.role === "admin" (set in Dashboard). */
export async function isClerkAdmin(): Promise<boolean> {
  if (!isClerkConfigured()) return true;
  const user = await currentUser();
  return user?.publicMetadata?.role === "admin";
}
