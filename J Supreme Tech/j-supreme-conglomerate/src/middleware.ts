import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAllowedClerkUser } from "@/lib/auth/clerk-operator-email";

/** Client intake forms stay public; everything else requires sign-in. */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/access-denied(.*)",
  "/intake(.*)",
  "/launch(.*)",
  // Public ad landing hub — paid-traffic destination, must work without auth.
  "/start(.*)",
  // Public legal pages — Meta App Review's crawler must reach these without auth.
  "/privacy",
  "/api/health",
  // Deployment fingerprint for the PWA update banner — must answer pre-auth
  // (Clerk 404s the non-document fetch on public pages otherwise).
  "/api/v1/version",
  // Workspace-context export — self-authorizes via WORKSPACE_CONTEXT_SECRET bearer
  // token (consumed by the J Supreme Command app's Jarvis gnosis). Bypasses Clerk.
  "/api/v1/workspace-context(.*)",
  "/api/v1/intake(.*)",
  "/api/v1/webhooks(.*)",
  // Notification routes carry their own auth (cron secret / same-origin) so they
  // must bypass Clerk — otherwise the Vercel cron request is 404'd by auth.protect().
  "/api/notify(.*)",
  // Push notify endpoint — called by Railway bots with x-push-secret, no Clerk cookie.
  "/api/push/notify(.*)",
  // Marketing publish cron — same deal: the Vercel Cron request has no Clerk cookie,
  // so it self-authorizes with CRON_SECRET (see the route) and must bypass auth.protect().
  "/api/cron(.*)",
  // MT5 bridge ingest — same deal again: the Windows bridge script has no Clerk
  // cookie, so it self-authorizes with a Bearer MT5_INGEST_SECRET (see the route).
  // Without this, auth.protect() 404s the request before the route's own auth
  // check ever runs — confirmed 2026-09-04, the historical sync had only ever
  // worked against local dev (Clerk auto-bypassed there), never production.
  "/api/v1/integrations/mt5/ingest(.*)",
  // Sales Department webhooks (Resend inbound replies + delivery events) and the
  // public one-click unsubscribe. Each carries its own auth: a shared secret on
  // the webhooks, an HMAC-signed token on unsubscribe. No Clerk cookie present.
  "/api/sales(.*)",
  // Client Ops Autopilot approval links — clicked from Jordan's email (no Clerk
  // cookie). Auth is the HMAC-signed token in the URL (see /api/ops/approve).
  "/api/ops(.*)",
  // Public self-service booking page + its submit API (clients have no account).
  "/book(.*)",
  "/api/book(.*)",
  // Public contract e-signing — the unguessable token in the URL is the auth.
  "/sign(.*)",
  // Public marketing short-links (pure UTM 302s, no secrets — see /s/[slug]/route.ts).
  // The secret-carrying launcher lives at /go/* and stays auth-gated.
  "/s(.*)",
]);

function clerkConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() &&
    process.env.CLERK_SECRET_KEY?.trim()
  );
}

const clerkAuthMiddleware = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  const path = req.nextUrl.pathname;
  const operatorRoute = !isPublicRoute(req);

  if (userId) {
    const allowed = await isAllowedClerkUser(userId);
    if (!allowed && operatorRoute) {
      if (!path.startsWith("/access-denied")) {
        return NextResponse.redirect(new URL("/access-denied", req.url));
      }
    }
    if (allowed && (path === "/sign-in" || path.startsWith("/sign-in/"))) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (operatorRoute) {
    await auth.protect();
  }
});

function requireAuthMiddleware(req: NextRequest) {
  const signIn = new URL("/sign-in", req.url);
  if (req.nextUrl.pathname !== signIn.pathname) {
    signIn.searchParams.set("reason", "auth_required");
  }
  return NextResponse.redirect(signIn);
}

/**
 * Local-only escape hatch so you can preview the app in `next dev` before any
 * Clerk keys exist. Gated on NODE_ENV — the only env reliably inlined into the
 * Edge middleware bundle under Turbopack — so it can NEVER fire in production
 * (which keeps failing closed). The moment you add Clerk keys, even in dev,
 * `clerkConfigured()` flips true and full auth is enforced again. Data ownership
 * in dev still resolves via OS_DEV_AUTH_BYPASS in src/lib/session.ts.
 */
const devAuthBypass =
  process.env.NODE_ENV !== "production" && !clerkConfigured();

const middleware = devAuthBypass
  ? () => NextResponse.next()
  : clerkConfigured()
    ? clerkAuthMiddleware
    : requireAuthMiddleware;

export default middleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|mov|mp3|pdf)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
