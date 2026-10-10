/**
 * Server-only provisioning helpers — create users on any back office we own
 * straight from the CRM. Uses the shared Supabase project's service-role key
 * (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY) for all auth ops.
 */
import "server-only";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { getExternalAccess } from "@/lib/conglomerate-backoffice/external-access";
import { setProjectEnv, redeployLatestProduction } from "@/lib/vercel-portfolio/deployments";

export type BackofficeTarget =
  | "abo-tours"
  | "solid-trust"
  | "solace-auto"
  | "bp-courier-payload"
  | "language-cradle"
  | "ship2door";

/**
 * Back offices with NO per-user accounts — they gate on a single shared secret
 * (Language Cradle = CMS password, Ship 2 Door = capability key). "Provisioning"
 * them means revealing the current secret or rotating it (which needs the
 * target site's Vercel env updated + a redeploy).
 */
const KEYLESS_BACKOFFICES = {
  "language-cradle": {
    project: "thelanguagecradle",
    projectId: "prj_LVVDR9GUWxdS4s5P4QySP6ly0TuT",
    envKey: "CMS_ADMIN_PASSWORD",
    loginUrl: "https://thelanguagecradle.vercel.app/admin/login",
    baseUrl: "https://thelanguagecradle.vercel.app",
  },
  ship2door: {
    project: "ship2doorja",
    projectId: "prj_xiAh9jTQm4dltC9nhUR3gR99Y2mF",
    envKey: "S2D_ADMIN_KEY",
    loginUrl: "https://ship2doorja.vercel.app/back-office",
    baseUrl: "https://ship2doorja.vercel.app",
  },
} as const;

export type ProvisionInput = {
  email: string;
  password: string;
  name?: string;
  /** Per-target role label. "owner"/"admin" map differently per backend. */
  role?: string;
  targets: BackofficeTarget[];
  /** Keyless targets only: rotate the shared secret (+ redeploy) vs just reveal it. */
  rotate?: boolean;
};

export type ProvisionStepResult = {
  target: BackofficeTarget;
  ok: boolean;
  detail?: string;
  error?: string;
};

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase service-role credentials are missing on this server. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY).",
    );
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Upsert a Supabase auth user. Works for AbooTours + Solace (both share the
 * `ibtadbwtrxglujkzqofs` Supabase project). Idempotent: if the email already
 * exists we reset its password and re-confirm.
 */
async function upsertSupabaseAuthUser(email: string, password: string, name?: string) {
  const supabase = adminClient();
  // Try create first; if it 422s with "already registered", fall back to update.
  const created = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: name ? { name } : undefined,
  });

  if (created.error) {
    const msg = created.error.message.toLowerCase();
    const isDup = msg.includes("already") || msg.includes("registered") || msg.includes("duplicate");
    if (!isDup) throw created.error;

    // Look up the existing user by email and reset password.
    const list = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (list.error) throw list.error;
    const existing = list.data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!existing) throw new Error(`Cannot find existing user ${email} to reset password.`);

    const updated = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: name ? { name } : undefined,
    });
    if (updated.error) throw updated.error;
    return { id: updated.data.user?.id ?? existing.id, status: "reset" as const };
  }

  return { id: created.data.user?.id, status: "created" as const };
}

/**
 * Grant the user admin access to the AbooTours back office. The live admin
 * guard reads `aboo_user_profiles` (keyed on the auth user id, role enum
 * admin|basic); we also keep the legacy `abo_admins` row in sync.
 */
async function grantAboAdmin(
  userId: string | undefined,
  email: string,
  name?: string,
  role = "admin",
) {
  const supabase = adminClient();
  const profileRole = role === "basic" ? "basic" : "admin";

  if (userId) {
    const prof = await supabase
      .from("aboo_user_profiles")
      .upsert(
        { user_id: userId, email, display_name: name ?? "Operator", role: profileRole },
        { onConflict: "user_id" },
      );
    if (prof.error) throw prof.error;
  }

  const legacy = await supabase
    .from("abo_admins")
    .upsert(
      { user_id: userId ?? null, email, full_name: name ?? "Operator", role: "admin", active: true },
      { onConflict: "email" },
    );
  if (legacy.error) throw legacy.error;
}

/**
 * Grant the user staff/admin access to the Solid Trust Courier back office.
 * Guard: st_staff.id = auth user id AND status = 'active'. Role 'admin' unlocks
 * the full admin CRM at /admin (sign in via /auth/sign-in).
 */
async function grantSolidTrustStaff(
  userId: string,
  email: string,
  name?: string,
  role = "admin",
) {
  const supabase = adminClient();
  const { error } = await supabase
    .from("st_staff")
    .upsert(
      { id: userId, email, full_name: name ?? "Operator", role, status: "active" },
      { onConflict: "id" },
    );
  if (error) throw error;
}

/** Create or reset a Payload CMS (BP Courier) user via direct courier.users insert. */
async function upsertPayloadUser(email: string, password: string, name?: string, role = "super_admin") {
  const supabase = adminClient();
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 25000, 512, "sha256").toString("hex");

  // Try update first.
  const upd = await supabase
    .schema("courier")
    .from("users")
    .update({
      name: name ?? "Architect",
      role,
      salt,
      hash,
      login_attempts: 0,
      lock_until: null,
      updated_at: new Date().toISOString(),
    })
    .eq("email", email)
    .select("id")
    .maybeSingle();

  if (upd.error && upd.error.code !== "PGRST116") throw upd.error;
  if (upd.data?.id) return { id: upd.data.id, status: "reset" as const };

  // Insert if not present.
  const ins = await supabase
    .schema("courier")
    .from("users")
    .insert({
      email,
      name: name ?? "Architect",
      role,
      salt,
      hash,
      login_attempts: 0,
    })
    .select("id")
    .single();
  if (ins.error) throw ins.error;
  return { id: ins.data.id, status: "created" as const };
}

export async function provisionCredential(input: ProvisionInput): Promise<ProvisionStepResult[]> {
  const { email, password, name, role, targets, rotate } = input;
  const results: ProvisionStepResult[] = [];

  // Aboo + Solace + Solid Trust all share the same Supabase project/auth.
  // Run the shared auth-user upsert once and reuse the id everywhere.
  const needsSupabase =
    targets.includes("abo-tours") ||
    targets.includes("solace-auto") ||
    targets.includes("solid-trust");
  let supabaseResult: { id?: string; status: "created" | "reset" } | null = null;
  let supabaseError: string | null = null;
  if (needsSupabase) {
    try {
      supabaseResult = await upsertSupabaseAuthUser(email, password, name);
    } catch (e) {
      supabaseError = e instanceof Error ? e.message : "unknown supabase error";
    }
  }

  for (const target of targets) {
    if (target === "abo-tours") {
      if (supabaseError) {
        results.push({ target, ok: false, error: supabaseError });
        continue;
      }
      try {
        await grantAboAdmin(supabaseResult?.id, email, name, role ?? "admin");
        results.push({
          target,
          ok: true,
          detail: `Supabase user ${supabaseResult?.status}; aboo_user_profiles + abo_admins upserted (role=admin).`,
        });
      } catch (e) {
        results.push({ target, ok: false, error: e instanceof Error ? e.message : "aboo_user_profiles insert failed" });
      }
      continue;
    }

    if (target === "solid-trust") {
      if (supabaseError) {
        results.push({ target, ok: false, error: supabaseError });
        continue;
      }
      if (!supabaseResult?.id) {
        results.push({
          target,
          ok: false,
          error: "Could not resolve the Supabase user id needed for st_staff.",
        });
        continue;
      }
      try {
        await grantSolidTrustStaff(supabaseResult.id, email, name, role ?? "admin");
        results.push({
          target,
          ok: true,
          detail: `Supabase user ${supabaseResult.status}; st_staff upserted (role=${role ?? "admin"}, status=active).`,
        });
      } catch (e) {
        results.push({ target, ok: false, error: e instanceof Error ? e.message : "st_staff upsert failed" });
      }
      continue;
    }

    if (target === "solace-auto") {
      if (supabaseError) {
        results.push({ target, ok: false, error: supabaseError });
        continue;
      }
      results.push({
        target,
        ok: true,
        detail: `Supabase user ${supabaseResult?.status}. NB: also add ${email} to SOLACE_ADMIN_EMAILS env var on the solace-auto-imports Vercel project and redeploy.`,
      });
      continue;
    }

    if (target === "bp-courier-payload") {
      try {
        const res = await upsertPayloadUser(email, password, name, role ?? "super_admin");
        results.push({
          target,
          ok: true,
          detail: `courier.users ${res.status} with role=${role ?? "super_admin"} (id ${res.id}).`,
        });
      } catch (e) {
        results.push({ target, ok: false, error: e instanceof Error ? e.message : "payload insert failed" });
      }
      continue;
    }

    if (target === "language-cradle" || target === "ship2door") {
      const cfg = KEYLESS_BACKOFFICES[target];
      const access = getExternalAccess();

      if (!rotate) {
        const detail =
          target === "language-cradle"
            ? `Shared CMS password: ${access.languageCradlePassword} — sign in at ${cfg.loginUrl}`
            : `Opens authenticated (magic link): ${access.ship2doorMagicLink}`;
        results.push({ target, ok: true, detail });
        continue;
      }

      // Rotate: write the new shared secret, then redeploy so it takes effect.
      const setRes = await setProjectEnv(cfg.projectId, cfg.envKey, password);
      if (!setRes.ok) {
        results.push({ target, ok: false, error: `Couldn't update ${cfg.envKey}: ${setRes.error}` });
        continue;
      }
      const redeploy = await redeployLatestProduction(cfg.project);
      const newAccess =
        target === "language-cradle"
          ? `New CMS password: ${password} — sign in at ${cfg.loginUrl}`
          : `New magic link: ${cfg.baseUrl}/back-office?key=${encodeURIComponent(password)}`;
      results.push({
        target,
        ok: true,
        detail: redeploy.ok
          ? `${cfg.envKey} rotated on ${cfg.project} + redeploy started. ${newAccess}`
          : `${cfg.envKey} updated but auto-redeploy failed (${redeploy.error}) — redeploy ${cfg.project} once for it to take effect. ${newAccess}`,
      });
      continue;
    }

    results.push({ target, ok: false, error: `Unknown target: ${target as string}` });
  }

  return results;
}
