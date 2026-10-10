import { buildVercelSitesHub } from "@/lib/vercel-portfolio/build-hub";
import { LAUNCH_WORKFLOW, SITE_SEED_CHECKS, SITE_SEED_NOTES } from "@/lib/jarvis/templates";
import type {
  AutoCheckResult,
  AutoSignal,
  IntegrationStatus,
  JarvisHub,
  JarvisSite,
} from "@/lib/jarvis/types";
import type { VercelSiteEntry } from "@/lib/vercel-portfolio/types";

const env = (name: string) => !!process.env[name]?.trim();

/**
 * Readiness of the command center's own platform keys. Booleans only — the
 * actual secret never leaves the server. This is the "what do I still need to
 * wire up" panel; per-site keys are detected separately via the Vercel env API.
 */
function computeIntegrations(vercelConnected: boolean): IntegrationStatus[] {
  return [
    {
      key: "vercel",
      label: "Vercel API",
      connected: vercelConnected,
      purpose: "Auto-track every site, list deploys, and one-click revert.",
      todo: "Create a Full-Access token and add VERCEL_ACCESS_TOKEN + VERCEL_TEAM_ID.",
      envVars: ["VERCEL_ACCESS_TOKEN", "VERCEL_TEAM_ID"],
      setupUrl: "https://vercel.com/account/tokens",
    },
    {
      key: "resend",
      label: "Resend email",
      connected: env("RESEND_API_KEY") && env("NOTIFY_EMAIL"),
      purpose: "Send EOD digests, error alerts, and booking/intake notifications.",
      todo: "Add RESEND_API_KEY and NOTIFY_EMAIL (verify a sending domain for MAIL_FROM).",
      envVars: ["RESEND_API_KEY", "NOTIFY_EMAIL"],
      setupUrl: "https://resend.com/api-keys",
    },
    {
      key: "supabase",
      label: "Supabase",
      connected:
        env("NEXT_PUBLIC_SUPABASE_URL") &&
        (env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_SECRET_KEY")),
      purpose: "Persisted CRM, intake, contracts, and back-office data.",
      todo: "Add NEXT_PUBLIC_SUPABASE_URL + a service-role/secret key.",
      envVars: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
      setupUrl: "https://supabase.com/dashboard",
    },
    {
      key: "clerk",
      label: "Clerk auth",
      connected:
        env("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY") && env("CLERK_SECRET_KEY"),
      purpose: "Gate this operator app behind your login + password.",
      todo: "Add both Clerk keys, then set a username/password in the Clerk dashboard.",
      envVars: ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY"],
      setupUrl: "https://dashboard.clerk.com",
    },
    {
      key: "openai",
      label: "AI (OpenAI)",
      connected: env("OPENAI_API_KEY"),
      purpose: "Power Jarvis AI chat, CRM parsing, and command actions.",
      todo: "Add OPENAI_API_KEY (server-only).",
      envVars: ["OPENAI_API_KEY"],
      setupUrl: "https://platform.openai.com/api-keys",
    },
  ];
}

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function computeAuto(site: VercelSiteEntry): Partial<Record<AutoSignal, AutoCheckResult>> {
  const status = site.health?.status ?? "not-deployed";
  const host = hostOf(site.url);
  const isVercelHost = host.endsWith(".vercel.app") || host === "";
  const updatedMs = site.updatedAt ? Date.parse(site.updatedAt) : NaN;
  const fresh = Number.isFinite(updatedMs) && Date.now() - updatedMs < THIRTY_DAYS;
  const tracked = site.source === "vercel-api" || !!site.updatedAt;

  return {
    deployed:
      status === "not-deployed"
        ? { signal: "deployed", state: "fail", detail: "Not deployed yet." }
        : { signal: "deployed", state: "pass", detail: "Live on Vercel." },
    online:
      status === "healthy"
        ? { signal: "online", state: "pass", detail: `HTTP ${site.health?.statusCode ?? 200}` }
        : status === "warning"
          ? {
              signal: "online",
              state: "fail",
              detail: `Responding with ${site.health?.statusCode ?? "4xx"}.`,
            }
          : status === "offline"
            ? { signal: "online", state: "fail", detail: "No response / 5xx." }
            : { signal: "online", state: "pending", detail: "Not deployed." },
    https: site.url.startsWith("https")
      ? { signal: "https", state: "pass", detail: "TLS OK." }
      : { signal: "https", state: "fail", detail: "Not served over HTTPS." },
    "custom-domain": isVercelHost
      ? {
          signal: "custom-domain",
          state: "pending",
          detail: "Still on a *.vercel.app URL.",
        }
      : { signal: "custom-domain", state: "pass", detail: host },
    "fresh-deploy": !site.updatedAt
      ? { signal: "fresh-deploy", state: "pending", detail: "Last deploy time unknown." }
      : fresh
        ? { signal: "fresh-deploy", state: "pass", detail: "Deployed in the last 30 days." }
        : { signal: "fresh-deploy", state: "fail", detail: "No deploy in 30+ days." },
    "vercel-tracked": tracked
      ? { signal: "vercel-tracked", state: "pass", detail: "Matched on your Vercel account." }
      : {
          signal: "vercel-tracked",
          state: "fail",
          detail: "Not matched via API (token missing or name mismatch).",
        },
  };
}

export async function buildJarvisHub(): Promise<JarvisHub> {
  const hub = await buildVercelSitesHub();

  const sites: JarvisSite[] = hub.sites.map((site) => ({
    ...site,
    vercelProjectId: null,
    isVercelTracked: site.source === "vercel-api" || !!site.updatedAt,
    auto: computeAuto(site),
    seedNote: SITE_SEED_NOTES[site.id],
    seedChecks: SITE_SEED_CHECKS[site.id],
  }));

  const totals = {
    total: sites.length,
    online: sites.filter((s) => s.health?.status === "healthy").length,
    offline: sites.filter(
      (s) => s.health?.status === "offline" || s.health?.status === "warning",
    ).length,
    notDeployed: sites.filter((s) => s.health?.status === "not-deployed").length,
    customDomains: sites.filter((s) => s.auto["custom-domain"]?.state === "pass").length,
    vercelTracked: sites.filter((s) => s.isVercelTracked).length,
  };

  return {
    sites,
    categories: hub.categories,
    template: LAUNCH_WORKFLOW,
    vercelApiConnected: hub.vercelApiConnected,
    vercelApiError: hub.vercelApiError,
    checkedAt: hub.checkedAt,
    integrations: computeIntegrations(hub.vercelApiConnected),
    totals,
  };
}
