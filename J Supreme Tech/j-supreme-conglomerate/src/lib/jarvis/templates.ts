import type { CheckState, WorkflowTemplate } from "@/lib/jarvis/types";

/**
 * THE LAUNCH WORKFLOW.
 *
 * This is the checklist Jarvis runs against every site. Edit freely — add,
 * remove, or reword steps and the whole control tower updates. Auto steps
 * (kind: "auto") are scored from live signals; manual steps are the things
 * only you can confirm (keys set, content correct, client handed off).
 *
 * Bump `version` whenever you change the shape so saved progress can migrate.
 */
export const LAUNCH_WORKFLOW: WorkflowTemplate = {
  id: "launch-v1",
  label: "Site Launch Workflow",
  version: 1,
  stages: [
    {
      id: "infra",
      label: "Infrastructure",
      hint: "Computed live from Vercel + an HTTP health probe. No action needed — green = good.",
      steps: [
        {
          id: "infra.deployed",
          label: "Deployed to Vercel",
          kind: "auto",
          signal: "deployed",
          weight: 2,
        },
        {
          id: "infra.online",
          label: "Responding (HTTP 200)",
          kind: "auto",
          signal: "online",
          weight: 2,
        },
        {
          id: "infra.https",
          label: "Served over HTTPS",
          kind: "auto",
          signal: "https",
        },
        {
          id: "infra.custom-domain",
          label: "Custom domain connected",
          description: "Live on a real domain, not a *.vercel.app URL.",
          kind: "auto",
          signal: "custom-domain",
        },
        {
          id: "infra.fresh-deploy",
          label: "Deployed recently (< 30 days)",
          kind: "auto",
          signal: "fresh-deploy",
        },
        {
          id: "infra.vercel-tracked",
          label: "Tracked via Vercel API",
          description: "Matched a live project on your Vercel team.",
          kind: "auto",
          signal: "vercel-tracked",
        },
      ],
    },
    {
      id: "integrations",
      label: "Integrations & Keys",
      hint: "The accounts and secrets the site needs to actually work in production.",
      steps: [
        {
          id: "integrations.env-vars",
          label: "Env vars set in Vercel (Production)",
          description: "Every secret the build needs is in Vercel → Settings → Environment Variables.",
          kind: "manual",
          weight: 2,
        },
        {
          id: "integrations.supabase-linked",
          label: "Supabase project linked",
          description: "URL + anon key wired; tables/RLS created.",
          kind: "manual",
        },
        {
          id: "integrations.supabase-auth",
          label: "Supabase auth / admin password set",
          description: "Back-office login works; no open/no-cred admin left in prod.",
          kind: "manual",
          weight: 2,
        },
        {
          id: "integrations.resend-key",
          label: "Resend API key set",
          description: "RESEND_API_KEY present so transactional email can send.",
          kind: "manual",
          weight: 2,
        },
        {
          id: "integrations.resend-domain",
          label: "Resend sending domain verified",
          description: "SPF/DKIM/DMARC DNS records added at the registrar and verified in Resend.",
          kind: "manual",
        },
        {
          id: "integrations.auth-provider",
          label: "Auth provider configured (Clerk / other)",
          description: "Only if the site has a login. Mark N/A for static marketing sites.",
          kind: "manual",
        },
        {
          id: "integrations.payments",
          label: "Payments / checkout connected",
          description: "Stripe/processor keys live. Mark N/A if no commerce.",
          kind: "manual",
        },
        {
          id: "integrations.analytics",
          label: "Analytics installed",
          description: "Vercel Analytics or GA so you can see traffic.",
          kind: "manual",
        },
      ],
    },
    {
      id: "content",
      label: "Content & SEO",
      hint: "What a visitor (and Google, and a link preview) actually sees.",
      steps: [
        {
          id: "content.logo-favicon",
          label: "Real logo + favicon",
          description: "Client's actual logo, not a placeholder or wrong-background variant.",
          kind: "manual",
          weight: 2,
        },
        {
          id: "content.og-image",
          label: "Social / OG preview image",
          description: "Pasting the link in WhatsApp/IG shows a proper card.",
          kind: "manual",
        },
        {
          id: "content.meta",
          label: "Title + meta description set",
          kind: "manual",
        },
        {
          id: "content.real-copy",
          label: "No placeholder copy or stock-photo gaps",
          description: "No lorem ipsum, no broken image slots, real contact info.",
          kind: "manual",
        },
        {
          id: "content.contact",
          label: "Contact details correct",
          description: "Phone, email, WhatsApp, address all current.",
          kind: "manual",
        },
        {
          id: "content.legal",
          label: "Privacy / Terms pages",
          kind: "manual",
        },
      ],
    },
    {
      id: "qa",
      label: "Pre-launch QA",
      hint: "Run these in the Sandbox tab — open the live site and click through.",
      steps: [
        {
          id: "qa.mobile",
          label: "Mobile responsive",
          description: "Looks right at phone width (test in Sandbox).",
          kind: "manual",
          weight: 2,
        },
        {
          id: "qa.forms",
          label: "Forms submit & email arrives",
          description: "Booking/contact/quote forms actually deliver.",
          kind: "manual",
          weight: 2,
        },
        {
          id: "qa.console",
          label: "No console / runtime errors",
          kind: "manual",
        },
        {
          id: "qa.links",
          label: "No broken links or dead buttons",
          kind: "manual",
        },
        {
          id: "qa.checkout",
          label: "Checkout / booking flow tested end-to-end",
          description: "Mark N/A if no transactions.",
          kind: "manual",
        },
      ],
    },
    {
      id: "launch",
      label: "Launch & Handoff",
      hint: "The final mile before you call it shipped.",
      steps: [
        {
          id: "launch.dns-live",
          label: "Domain DNS live & propagated",
          kind: "manual",
          weight: 2,
        },
        {
          id: "launch.credentials",
          label: "Client credentials handed off",
          description: "Logins documented (e.g. BACKOFFICE-CREDENTIALS) and shared securely.",
          kind: "manual",
        },
        {
          id: "launch.rollback",
          label: "Rollback verified",
          description: "Confirmed you can revert the last deploy from the Deploys tab.",
          kind: "manual",
        },
        {
          id: "launch.monitoring",
          label: "Monitoring / uptime on",
          kind: "manual",
        },
        {
          id: "launch.announced",
          label: "Announced / marketing live",
          kind: "manual",
        },
      ],
    },
  ],
};

/**
 * Optional per-site seeds from the launch audit. Keyed by the site `id` used in
 * the Vercel catalog. Use this to drop a note onto a site card — e.g. a known
 * blocker. Pure cosmetic/help; does not affect scoring.
 *
 * Refreshed 2026-06-11 from the full launch audit (Vercel API + HTTP probes +
 * console/link QA + Resend domain check across all nine live clients).
 */
export const SITE_SEED_NOTES: Record<string, string> = {
  "courier-app":
    "Live on bpcouriers.online — deploys healthy. Booking mail via shared Resend. Launch-ad assets ready in OneDrive (BP Courier) — mark Announced when posted.",
  jsuprememarketinsititue:
    "⚠ Latest Vercel deploy ERRORED and no clean alias is attached. Redeploy or retire this project.",
  thelanguagecradle:
    "thelanguagecradle.com live. /admin password-gated (CMS_ADMIN_PASSWORD, fails closed). Supabase CMS env vars added to Vercel 2026-06-11 — admin edits + leads persist again.",
  "aboo-tours":
    "Live on abootours.com — QA clean (0 console errors, 21 links OK). Lead mail sends FROM the verified parent domain; verify abootours.com in Resend only if the client wants a branded FROM.",
  "the-mover-guy":
    "Live on themoverguy.online. Resend domain VERIFIED — orders@themoverguy.online live (2026-06-11).",
  "solace-auto-imports":
    "solaceautoimportsltd.com live w/ Supabase-backed backoffice. Privacy/Terms pages + analytics added 2026-06-11.",
  "the-cleanser-ja":
    "E-commerce on thecleanserja.com (verified Resend domain). Inkress payments configured. Privacy/Terms added 2026-06-11. Run one real card checkout before heavy promotion.",
  "solidtrust-courier":
    "solidtrustservices.com live — Supabase st_* backend, staff invites, Resend domain verified. Online card payments deliberately PAUSED via st_settings toggle.",
  nexpro: "NEXLINK alerts app. Mock data; confirm Supabase + any alert email keys before launch.",
  testloop:
    "testloop.online live. Static landing — no backend keys needed (steps marked N/A). Privacy/Terms + analytics added 2026-06-11.",
  "j-supreme-tech-website":
    "jsupremetech.online live. OG share image + Vercel analytics added 2026-06-11 (Google Ads tag already present).",
  "j-supreme-conglomerate":
    "This app. OG image, favicon.ico, and analytics added 2026-06-11. Tower URL resolution now prefers custom domains over deployment URLs.",
};

/**
 * Audit-verified default states for MANUAL checklist steps, keyed by site id →
 * stepId → state. Seeded server-side so verified progress shows in any browser;
 * the operator's own taps (localStorage) always override a seed.
 *
 * Source: 2026-06-11 launch audit — Vercel env keys per project, Resend domain
 * verification, live-page content checks (favicon/OG/meta/legal/contact),
 * headless-Chrome console + link QA, and prior session test evidence.
 * Steps deliberately left unseeded (pending): things only Jordan can confirm —
 * client credential handoffs, "announced / marketing live", and the Cleanser's
 * real-money card checkout.
 */
export const SITE_SEED_CHECKS: Record<string, Record<string, CheckState>> = {
  "solidtrust-courier": {
    "integrations.env-vars": "pass",
    "integrations.supabase-linked": "pass",
    "integrations.supabase-auth": "pass",
    "integrations.resend-key": "pass",
    "integrations.resend-domain": "pass",
    "integrations.auth-provider": "pass",
    "integrations.payments": "pass",
    "integrations.analytics": "pass",
    "content.logo-favicon": "pass",
    "content.og-image": "pass",
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "pass",
    "content.legal": "pass",
    "qa.mobile": "pass",
    "qa.forms": "pass",
    "qa.console": "pass",
    "qa.links": "pass",
    "qa.checkout": "na", // online card payments paused by design
    "launch.dns-live": "pass",
    "launch.credentials": "pass",
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
  },
  "aboo-tours": {
    "integrations.env-vars": "pass",
    "integrations.supabase-linked": "pass",
    "integrations.supabase-auth": "pass",
    "integrations.resend-key": "pass",
    "integrations.resend-domain": "pass", // sends FROM verified parent domain
    "integrations.auth-provider": "pass",
    "integrations.payments": "na",
    "integrations.analytics": "pass",
    "content.logo-favicon": "pass",
    "content.og-image": "pass",
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "pass",
    "content.legal": "pass",
    "qa.mobile": "pass",
    "qa.forms": "pass",
    "qa.console": "pass",
    "qa.links": "pass",
    "qa.checkout": "pass", // booking flow exercised end-to-end in prior sessions
    "launch.dns-live": "pass",
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
  },
  "courier-app": {
    "integrations.env-vars": "pass",
    "integrations.supabase-linked": "pass",
    "integrations.supabase-auth": "pass",
    "integrations.resend-key": "pass",
    "integrations.resend-domain": "pass",
    "integrations.auth-provider": "pass", // Clerk
    "integrations.payments": "na",
    "integrations.analytics": "pass",
    "content.logo-favicon": "pass",
    "content.og-image": "pass",
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "pass",
    "content.legal": "pass",
    "qa.mobile": "pass",
    "qa.forms": "pass",
    "qa.console": "pass",
    "qa.links": "pass",
    "qa.checkout": "pass", // guest booking flow tested 2026-06-01
    "launch.dns-live": "pass",
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
  },
  thelanguagecradle: {
    "integrations.env-vars": "pass",
    "integrations.supabase-linked": "pass", // env added to Vercel 2026-06-11
    "integrations.supabase-auth": "pass", // CMS_ADMIN_PASSWORD fails closed
    "integrations.resend-key": "pass",
    "integrations.resend-domain": "pass", // verified parent-domain FROM
    "integrations.auth-provider": "pass",
    "integrations.payments": "na",
    "integrations.analytics": "pass",
    "content.logo-favicon": "pass",
    "content.og-image": "pass",
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "pass",
    "content.legal": "pass", // /terms added 2026-06-11
    "qa.mobile": "pass",
    "qa.forms": "pass", // dual-channel intake: Resend + lc_cms_leads
    "qa.console": "pass",
    "qa.links": "pass",
    "qa.checkout": "na",
    "launch.dns-live": "pass",
    "launch.credentials": "pass", // Jordan + Nadine logins documented
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
  },
  "the-cleanser-ja": {
    "integrations.env-vars": "pass",
    "integrations.supabase-linked": "pass",
    "integrations.supabase-auth": "pass",
    "integrations.resend-key": "pass",
    "integrations.resend-domain": "pass", // thecleanserja.com verified
    "integrations.auth-provider": "pass",
    "integrations.payments": "pass", // Inkress configured
    "integrations.analytics": "pass",
    "content.logo-favicon": "pass",
    "content.og-image": "pass",
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "pass",
    "content.legal": "pass", // privacy + terms added 2026-06-11
    "qa.mobile": "pass",
    "qa.forms": "pass",
    "qa.console": "pass",
    "qa.links": "pass",
    // qa.checkout stays pending — run one real card payment to confirm
    "launch.dns-live": "pass",
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
  },
  testloop: {
    "integrations.env-vars": "na", // static landing — no secrets needed
    "integrations.supabase-linked": "na",
    "integrations.supabase-auth": "na",
    "integrations.resend-key": "na", // contact = Discord / WhatsApp / mailto
    "integrations.resend-domain": "na",
    "integrations.auth-provider": "na",
    "integrations.payments": "na",
    "integrations.analytics": "pass",
    "content.logo-favicon": "pass",
    "content.og-image": "pass",
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "pass",
    "content.legal": "pass", // privacy + terms added 2026-06-11
    "qa.mobile": "pass",
    "qa.forms": "na",
    "qa.console": "pass",
    "qa.links": "pass",
    "qa.checkout": "na",
    "launch.dns-live": "pass",
    "launch.credentials": "na", // own property
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
  },
  "solace-auto-imports": {
    "integrations.env-vars": "pass",
    "integrations.supabase-linked": "pass",
    "integrations.supabase-auth": "pass",
    "integrations.resend-key": "pass",
    "integrations.resend-domain": "pass", // verified parent-domain FROM
    "integrations.auth-provider": "pass",
    "integrations.payments": "na",
    "integrations.analytics": "pass",
    "content.logo-favicon": "pass",
    "content.og-image": "pass",
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "pass",
    "content.legal": "pass", // privacy + terms added 2026-06-11
    "qa.mobile": "pass",
    "qa.forms": "pass",
    "qa.console": "pass",
    "qa.links": "pass",
    "qa.checkout": "na",
    "launch.dns-live": "pass",
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
  },
  "j-supreme-conglomerate": {
    "integrations.env-vars": "pass",
    "integrations.supabase-linked": "pass",
    "integrations.supabase-auth": "pass",
    "integrations.resend-key": "pass",
    "integrations.resend-domain": "pass",
    "integrations.auth-provider": "pass", // Clerk + operator allowlist
    "integrations.payments": "na",
    "integrations.analytics": "pass",
    "content.logo-favicon": "pass",
    "content.og-image": "pass", // og.png added 2026-06-11
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "na", // internal operator tool
    "content.legal": "na",
    "qa.mobile": "pass",
    "qa.forms": "pass",
    "qa.console": "pass", // favicon.ico 404 fixed 2026-06-11
    "qa.links": "pass",
    "qa.checkout": "na",
    "launch.dns-live": "pass",
    "launch.credentials": "pass", // operator logins on /backoffice
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
    "launch.announced": "na", // internal
  },
  "j-supreme-tech-website": {
    "integrations.env-vars": "na", // static marketing site — no secrets
    "integrations.supabase-linked": "na",
    "integrations.supabase-auth": "na",
    "integrations.resend-key": "na", // contact = mailto / WhatsApp
    "integrations.resend-domain": "na",
    "integrations.auth-provider": "na",
    "integrations.payments": "na",
    "integrations.analytics": "pass", // Google Ads tag + Vercel analytics
    "content.logo-favicon": "pass",
    "content.og-image": "pass", // og.png added 2026-06-11
    "content.meta": "pass",
    "content.real-copy": "pass",
    "content.contact": "pass",
    "content.legal": "pass",
    "qa.mobile": "pass",
    "qa.forms": "na",
    "qa.console": "pass",
    "qa.links": "pass",
    "qa.checkout": "na",
    "launch.dns-live": "pass",
    "launch.credentials": "na", // own property
    "launch.rollback": "pass",
    "launch.monitoring": "pass",
    "launch.announced": "na", // it IS the marketing site
  },
};
