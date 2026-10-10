import type { CheckState } from "@/lib/jarvis/types";

/**
 * Detected-env → satisfied-check mapping.
 *
 * When the Vercel token is connected, Jarvis reads each site's env-var KEY names
 * (never the values) and uses this table to auto-confirm checklist steps. Match
 * by case-insensitive regex against any key on the project.
 *
 * EDIT FREELY — this is your stack's "if I see this key, that step is handled"
 * heuristic. Add a row when you adopt a new provider (e.g. /PAYSTACK/ → payments).
 *
 * Deliberately NOT auto-passed (a present key doesn't prove the work is done):
 *  - integrations.supabase-auth  → the URL existing ≠ a real admin password set / no-cred admin removed
 *  - integrations.resend-domain  → DKIM/SPF verification happens at the registrar, not in env
 * Those stay manual on purpose so the board never lies to you.
 */
export const ENV_CHECK_RULES: { stepId: string; match: RegExp }[] = [
  { stepId: "integrations.resend-key", match: /RESEND|SENDGRID|POSTMARK|MAILGUN|SMTP_/i },
  { stepId: "integrations.supabase-linked", match: /SUPABASE/i },
  { stepId: "integrations.auth-provider", match: /CLERK|NEXTAUTH|AUTH0|FIREBASE|COGNITO/i },
  { stepId: "integrations.payments", match: /STRIPE|PAYPAL|PADDLE|LEMON|SQUARE|PAYSTACK/i },
  { stepId: "integrations.analytics", match: /POSTHOG|PLAUSIBLE|GA_|GOOGLE_ANALYTICS|GTM_|MIXPANEL|VERCEL_ANALYTICS/i },
];

/**
 * Given the env-var key names found on a project, return the checklist steps we
 * can mark "pass" automatically. "Has any env at all" satisfies the generic
 * "env vars set in Vercel" step.
 */
export function checksSatisfiedByEnv(keys: string[]): Record<string, CheckState> {
  const out: Record<string, CheckState> = {};
  if (keys.length > 0) out["integrations.env-vars"] = "pass";
  for (const rule of ENV_CHECK_RULES) {
    if (keys.some((k) => rule.match.test(k))) out[rule.stepId] = "pass";
  }
  return out;
}
