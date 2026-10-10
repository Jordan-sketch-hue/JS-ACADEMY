import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  provisionCredential,
  type BackofficeTarget,
} from "@/lib/conglomerate-backoffice/provisioning";

export const dynamic = "force-dynamic";

const VALID_TARGETS: readonly BackofficeTarget[] = [
  "abo-tours",
  "solid-trust",
  "solace-auto",
  "bp-courier-payload",
  "language-cradle",
  "ship2door",
] as const;

// Targets that create a per-user email+password identity (need those fields).
const USER_TARGETS: readonly BackofficeTarget[] = [
  "abo-tours",
  "solid-trust",
  "solace-auto",
  "bp-courier-payload",
] as const;

function parseBody(raw: unknown):
  | {
      ok: true;
      data: { email: string; password: string; name?: string; role?: string; targets: BackofficeTarget[]; rotate: boolean };
    }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Body must be a JSON object." };
  const body = raw as Record<string, unknown>;

  if (!Array.isArray(body.targets) || body.targets.length === 0) {
    return { ok: false, error: "Choose at least one provisioning target." };
  }
  const targets: BackofficeTarget[] = [];
  for (const t of body.targets) {
    if (typeof t !== "string" || !(VALID_TARGETS as readonly string[]).includes(t)) {
      return { ok: false, error: `Unknown target: ${String(t)}` };
    }
    targets.push(t as BackofficeTarget);
  }

  const rotate = body.rotate === true;
  const hasUserTarget = targets.some((t) => (USER_TARGETS as readonly string[]).includes(t));
  const needsPassword = hasUserTarget || rotate;

  // Email is only meaningful for account targets; keyless targets ignore it.
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (hasUserTarget && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return { ok: false, error: "A valid email is required for account targets." };
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (needsPassword && password.length < 10) {
    return {
      ok: false,
      error:
        rotate && !hasUserTarget
          ? "The new shared secret must be at least 10 characters."
          : "Password must be at least 10 characters.",
    };
  }

  const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : undefined;
  const role = typeof body.role === "string" && body.role.trim() ? body.role.trim() : undefined;

  return { ok: true, data: { email, password, name, role, targets, rotate } };
}

export async function POST(req: Request) {
  // Require a signed-in CRM operator (Clerk session) before any provisioning.
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to provision credentials." }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const parsed = parseBody(json);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  try {
    const results = await provisionCredential(parsed.data);
    return NextResponse.json({ ok: results.every((r) => r.ok), results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Provisioning failed." },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ targets: VALID_TARGETS });
}
