import "server-only";

/**
 * Access details for the back offices that do NOT use the shared Supabase
 * operator identities (architect / ops / support). These are surfaced only on
 * the Clerk-gated /backoffice hub so an operator can open them in one click.
 *
 *   - Ship 2 Door JA  → capability-key middleware (/back-office?key=…)
 *   - Language Cradle  → single shared CMS password (CMS_ADMIN_PASSWORD)
 *
 * Values fall back to the known production defaults so the hub works even
 * before these are mirrored into this project's Vercel env. Override per-env
 * by setting SHIP2DOOR_* / LANGUAGE_CRADLE_ADMIN_PASSWORD on Vercel.
 */

const SHIP2DOOR_BASE = (
  process.env.SHIP2DOOR_APP_URL ?? "https://ship2doorja.vercel.app"
).replace(/\/$/, "");
const SHIP2DOOR_ADMIN_KEY =
  process.env.SHIP2DOOR_ADMIN_KEY ?? "3l9iwqYU8CoLtWVnVPjqKkoNSSMcskN7qH0tcCz5";
const SHIP2DOOR_PORTAL_KEY =
  process.env.SHIP2DOOR_PORTAL_KEY ?? "8xbeEBvTxpKVidNBAQYFfJwFg5UmItd9y15bCCqh";
const LANGUAGE_CRADLE_ADMIN_PASSWORD =
  process.env.LANGUAGE_CRADLE_ADMIN_PASSWORD ?? "Cradle-edb30cad-admin";

export type ExternalAccess = {
  /** One-click authenticated link into the Ship 2 Door back office. */
  ship2doorMagicLink: string;
  /** One-click authenticated link into the Ship 2 Door customer portal. */
  ship2doorPortalLink: string;
  /** Shared CMS password for the Language Cradle /admin editor. */
  languageCradlePassword: string;
};

export function getExternalAccess(): ExternalAccess {
  return {
    ship2doorMagicLink: `${SHIP2DOOR_BASE}/back-office?key=${encodeURIComponent(
      SHIP2DOOR_ADMIN_KEY,
    )}`,
    ship2doorPortalLink: `${SHIP2DOOR_BASE}/portal?key=${encodeURIComponent(
      SHIP2DOOR_PORTAL_KEY,
    )}`,
    languageCradlePassword: LANGUAGE_CRADLE_ADMIN_PASSWORD,
  };
}
