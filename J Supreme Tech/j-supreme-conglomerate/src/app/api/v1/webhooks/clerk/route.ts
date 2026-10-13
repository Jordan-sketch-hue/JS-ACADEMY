import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getServiceSupabase } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/** Verify Clerk webhook signature (Svix-style HMAC). */
function verifyClerkSignature(req: Request, body: string): boolean {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) return false;

  const svixId        = req.headers.get("svix-id") ?? "";
  const svixTimestamp = req.headers.get("svix-timestamp") ?? "";
  const svixSignature = req.headers.get("svix-signature") ?? "";

  if (!svixId || !svixTimestamp || !svixSignature) return false;

  // Timestamp must be within 5 minutes
  const ts = parseInt(svixTimestamp, 10);
  if (Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const toSign = `${svixId}.${svixTimestamp}.${body}`;
  // Secret is prefixed with "whsec_"; strip it, then base64-decode
  const rawSecret = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expectedHmac = crypto.createHmac("sha256", rawSecret).update(toSign).digest("base64");

  // svix-signature may include a "v1," prefix
  return svixSignature.split(" ").some((sig) => {
    const sigVal = sig.replace(/^v1,/, "");
    return crypto.timingSafeEqual(Buffer.from(sigVal), Buffer.from(expectedHmac));
  });
}

export async function POST(req: Request) {
  const body = await req.text();

  if (!verifyClerkSignature(req, body)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { type: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type === "user.created") {
    await handleUserCreated(event.data);
  }

  return NextResponse.json({ received: true, type: event.type });
}

async function handleUserCreated(data: Record<string, unknown>) {
  const clerkId   = String(data.id ?? "");
  const emails    = (data.email_addresses as Array<{ email_address: string; primary: boolean }>) ?? [];
  const primary   = emails.find((e) => e.primary) ?? emails[0];
  const email     = primary?.email_address ?? null;
  const firstName = String((data.first_name as string) ?? "");
  const lastName  = String((data.last_name as string) ?? "");
  const name      = [firstName, lastName].filter(Boolean).join(" ") || null;

  if (!clerkId) return;

  const supabase = getServiceSupabase();

  // 1. Create SaaS tenant record (trial account)
  const { error: tenantErr } = await supabase
    .from("ss_tenants")
    .upsert(
      {
        clerk_user_id: clerkId,
        email: email ?? null,
        full_name: name ?? null,
        plan: "trial",
        status: "active",
        onboarded_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id" },
    );

  if (tenantErr) {
    console.error("[clerk-webhook] ss_tenants upsert failed:", tenantErr.message);
  } else {
    console.log(`[clerk-webhook] ss_tenant seeded for ${email ?? clerkId}`);
  }

  // 2. Seed a CRM client row (owner = this user, so their own CRM is pre-populated)
  const operatorClerkId = process.env.OPERATOR_CLERK_ID;
  if (operatorClerkId && operatorClerkId !== clerkId) {
    // Only create a CRM entry under the operator if this isn't Jordan himself signing in
    const { error: crmErr } = await supabase
      .from("clients")
      .insert({
        owner_clerk_id: operatorClerkId,
        business_name: name ?? email ?? clerkId,
        contact_name: name ?? null,
        email: email ?? null,
        industry: "General",
        notes: `Auto-created on platform sign-up (Clerk user ${clerkId}).`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    if (crmErr && !crmErr.message.includes("duplicate")) {
      console.error("[clerk-webhook] clients insert failed:", crmErr.message);
    }
  }
}
