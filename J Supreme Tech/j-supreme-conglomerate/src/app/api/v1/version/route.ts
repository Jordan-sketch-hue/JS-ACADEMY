export const dynamic = "force-dynamic";

/**
 * Returns the current Vercel deployment ID.
 * VERCEL_DEPLOYMENT_ID is a runtime env var set by Vercel on every deploy —
 * it changes with each new deployment, making it reliable for update detection.
 */
export function GET() {
  return Response.json(
    { v: process.env.VERCEL_DEPLOYMENT_ID ?? "dev" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
