import { clerkClient } from "@clerk/nextjs/server";
import { isAllowedOperatorEmail } from "@/lib/auth/allowed-operator";

export async function getClerkUserPrimaryEmail(
  userId: string,
): Promise<string | null> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId,
    );
    return primary?.emailAddress?.toLowerCase() ?? null;
  } catch {
    return null;
  }
}

// Per-isolate cache of confirmed-disallowed userIds. We fail OPEN when the
// Clerk lookup returns null (transient API failure, edge cold-start, etc.) —
// the user already has a valid Clerk session, so the only purpose of this
// check is to gate accounts we positively confirm are not the owner. Caching
// the disallowed set means even after a transient failure later, a known-bad
// user stays blocked within this isolate.
const knownDisallowed = new Set<string>();

export async function isAllowedClerkUser(userId: string): Promise<boolean> {
  if (knownDisallowed.has(userId)) return false;
  const email = await getClerkUserPrimaryEmail(userId);
  if (email === null) {
    // Lookup failed — trust the session. If this user ever resolves as
    // disallowed later, we'll cache it then.
    return true;
  }
  const allowed = isAllowedOperatorEmail(email);
  if (!allowed) knownDisallowed.add(userId);
  return allowed;
}
