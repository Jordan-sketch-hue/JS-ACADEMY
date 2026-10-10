import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/cyber/rate-limit";

/** Placeholder for Zapier, n8n, TradingView, GitHub — verify signatures in production. */
export async function POST(req: Request) {
  // Public + unauthenticated until signature verification lands — generous
  // per-IP cap so legitimate providers burst freely but abuse is bounded.
  const gate = rateLimit(req, { limit: 60, windowMs: 60_000, key: "webhook-inbound" });
  if (!gate.ok) return gate.response;

  const provider = new URL(req.url).searchParams.get("provider");
  const body = await req.text();
  return NextResponse.json({
    received: true,
    provider,
    bytes: body.length,
    hint: "Route to automation_endpoints table + queue workers.",
  });
}
