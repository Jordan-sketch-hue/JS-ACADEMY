/** True when the Clerk publishable key is set (safe in client bundles). */
export function isClerkPublishableKeySet(): boolean {
  return !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
}

/** True when Clerk publishable + secret keys are set (auth required for app routes). */
export function isClerkConfigured(): boolean {
  return (
    isClerkPublishableKeySet() && !!process.env.CLERK_SECRET_KEY?.trim()
  );
}

/**
 * Client Components (ClerkProvider): enable when publishable key is set.
 * Deploy must set CLERK_SECRET_KEY as well so middleware uses Clerk.
 */
export function isClerkProviderEnabled(): boolean {
  return isClerkPublishableKeySet();
}
