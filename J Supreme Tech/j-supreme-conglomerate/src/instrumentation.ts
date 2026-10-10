/**
 * Next.js instrumentation — captures every uncaught server error and emails an
 * alert (production only, throttled). See `src/lib/notify/error-alert.ts`.
 */

export async function register(): Promise<void> {
  // no-op; present so Next loads this module
}

export async function onRequestError(
  error: unknown,
  request: { path?: string; method?: string },
  context: { routeType?: string; routePath?: string },
): Promise<void> {
  try {
    const { reportError } = await import("@/lib/notify/error-alert");
    await reportError(`Server error · ${request?.path ?? "unknown route"}`, error, {
      method: request?.method,
      path: request?.path,
      routeType: context?.routeType,
      routePath: context?.routePath,
    });
  } catch {
    // never let error reporting throw
  }
}
