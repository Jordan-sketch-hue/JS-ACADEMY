/**
 * JARVIS HUB — the categorized registry of every AI capability + automation
 * across the empire. Pure static data: this is what makes /jarvis render
 * instantly and always populated (no API calls needed).
 *
 * Two engines exist and are labeled honestly:
 *  - "pc"     → the JARVIS engine on Jordan's PC (Task Scheduler, 07:30/13:00/18:30,
 *               free PowerShell SOPs + a budget-capped Claude pass). Results land in
 *               C:\Users\jader\JARVIS\INBOX.md and staged actions wait for one tap.
 *  - "cloud"  → automations that run in THIS app on Vercel (crons, webhooks, intake).
 *  - "in-app" → interactive AI tools inside this workspace.
 *
 * Edit freely — the hub UI renders whatever is here.
 */

export type JarvisEngine = "pc" | "cloud" | "in-app";
export type JarvisStatus = "live" | "staged" | "wire-next";

export type JarvisCapability = {
  id: string;
  name: string;
  what: string;
  engine: JarvisEngine;
  status: JarvisStatus;
  schedule?: string;
  output?: string;
  /** Internal route or hub tab this capability links to. */
  href?: string;
};

export type JarvisCategory = {
  id: string;
  label: string;
  emoji: string;
  tagline: string;
  capabilities: JarvisCapability[];
};

export const JARVIS_CATEGORIES: JarvisCategory[] = [
  {
    id: "tech-control",
    label: "Tech Control",
    emoji: "🛠",
    tagline:
      "Run the portfolio like an enterprise — sites managed, bugs caught early, and the investor-grade bars held: security, optimization, reach.",
    capabilities: [
      {
        id: "website-management",
        name: "Website management",
        what: "Pings every client live domain each run, samples Vercel deploys for errors, and tracks all ~40 sites in the Launch Tower with live health + readiness.",
        engine: "pc",
        status: "live",
        schedule: "Every run (07:30 / 13:00 / 18:30) + live in the Tower tab",
        output: "Down domain or failed deploy → INBOX alert; demo sites auto-redeployed",
        href: "/jarvis?tab=tower",
      },
      {
        id: "supreme-suite-health",
        name: "Supreme Suite — full platform check",
        what: "Deep-checks the entire SaaS platform: every route of supreme-suite.vercel.app fetched + content-verified against its own registry (40 routes · 7 business workflows · 24 action contracts · 13 systems). The suite's public /status portal runs the same workflows live in-browser, and the Launch Tower pings it like every other site.",
        engine: "in-app",
        status: "live",
        schedule: "60s heartbeat + on-demand deep check from Suite Control",
        output: "Per-route pass/fail with timings in /suite · downloadable receipts on /status",
        href: "/suite",
      },
      {
        id: "site-validation",
        name: "Full-site validation",
        what: "Crawls every managed site — every page from the sitemap, every internal hyperlink, CTAs (book / quote / contact), phone numbers, WhatsApp links, and forms — validated against per-site expectations (including 'dead number must not appear' and 'admin must not be public').",
        engine: "pc",
        status: "live",
        schedule: "Every morning, all 5 client sites (capped + polite crawl)",
        output: "Broken link / missing CTA / wrong phone / missing form → INBOX alert",
      },
      {
        id: "bug-catching",
        name: "Bug catching",
        what: "Builds one rotating project per day with a time-box, auto-applies known safe fixes (Next 16 / Tailwind 4 gotchas), and tracks repos with unshipped changes.",
        engine: "pc",
        status: "live",
        schedule: "Midday build rotation · runtime error alerts via /api/notify/error",
        output: "Failing build → BLOCKED item with the first error line",
      },
      {
        id: "security",
        name: "Security",
        what: "npm-audits one rotating project's production deps every evening and checks no .env / key files are tracked in git. Criticals alert; highs roll into the brief.",
        engine: "pc",
        status: "live",
        schedule: "Evening rotation (rides the marketing wake — $0 extra)",
        output: "CRITICAL vuln or committed secret → INBOX alert with fix steps",
      },
      {
        id: "optimization",
        name: "Optimization",
        what: "Times every client live homepage each morning. Slow pages (>5s) get chased: oversized images, blocking scripts, missing next/image.",
        engine: "pc",
        status: "live",
        schedule: "Morning scan (rides the daily-brief wake)",
        output: "Slow homepage → INBOX alert; demo fixes shipped automatically",
      },
      {
        id: "reach",
        name: "Reach (SEO)",
        what: "Scans every live site for <title>, meta description, OG tags, robots.txt sanity, and sitemap. If Google can't see it, it doesn't exist.",
        engine: "pc",
        status: "live",
        schedule: "Morning scan, alongside optimization",
        output: "Missing basics → INBOX alert (staged once, no repeat noise)",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    emoji: "📣",
    tagline:
      "The content engine keeps every brand moving and routes each piece through the right medium — you just tap publish.",
    capabilities: [
      {
        id: "social-posting",
        name: "Social posting (by medium)",
        what: "Every evening: picks the next brand in rotation, generates + renders the post with that brand's kit, writes the caption, and stages it for your tap. Postiz is the publish rail to IG / FB / TikTok.",
        engine: "pc",
        status: "staged",
        schedule: "Evening (18:30) brand rotation",
        output: "Finished post + caption + exact publish action → INBOX 'READY FOR YOUR TAP'",
      },
      {
        id: "content-engine",
        name: "Content & creative engine",
        what: "Reusable creative toolkit: ad-sets, flyers, IG covers via headless Chrome; data-driven Remotion reels; auto-captions via faster-whisper. Saved in dated brand folders.",
        engine: "pc",
        status: "live",
        output: "PNG / MP4 assets + preview paths in the run journal",
      },
      {
        id: "email-digests",
        name: "Email digests & reports",
        what: "This app emails you a daily digest and an end-of-day report through Resend — bookings, intake, tasks, and money items, without opening anything.",
        engine: "cloud",
        status: "live",
        schedule: "Digest 12:00 UTC · EOD 22:00 UTC (Vercel crons)",
        output: "Email to your inbox via Resend",
      },
      {
        id: "outreach-drafts",
        name: "Outreach drafts",
        what: "Client replies and outreach are drafted in Gmail — never sent automatically. You review, then hit send.",
        engine: "pc",
        status: "live",
        schedule: "Morning triage",
        output: "Gmail drafts + 'draft ready' note in INBOX",
      },
    ],
  },
  {
    id: "business-ops",
    label: "Business Ops",
    emoji: "💼",
    tagline: "Mail, leads, and dates — triaged before you wake up.",
    capabilities: [
      {
        id: "angel-inbox",
        name: "Angel — client inbox agent",
        what: "Reads the J Supreme Marketing inbox (FB Messenger live; IG DMs once the messaging permission is added), triages every conversation, then auto-replies and auto-follows-up in the agency's voice, and forwards leads to the CRM. Money, complaints, and urgent matters are held and escalated to you by email. One toggle dials autonomy from full-auto down to approve-all.",
        engine: "cloud",
        status: "live",
        schedule: "Every 15 min (Vercel cron) + Sync now",
        output: "Auto-handles routine replies + follow-ups; emails you on leads and anything needing your call",
        href: "/jarvis/angel",
      },
      {
        id: "whatsapp-reader",
        name: "WhatsApp — client chat reader",
        what: "A linked-device reader (Baileys on Railway) watches the WhatsApp Business inbox and turns every client conversation into an update card — category, what they want, and what you owe them. Read-only by design: it never sends, reacts, or deletes.",
        engine: "cloud",
        status: "wire-next",
        schedule: "Live stream — summarizes each chat ~8s after it goes quiet",
        output: "Per-client update cards in /jarvis/whatsapp (money, shipments, replies owed)",
        href: "/jarvis/whatsapp",
      },
      {
        id: "intake-autopilot",
        name: "Intake → project autopilot",
        what: "A client intake submission auto-creates a project workflow with phased tasks, a brief, and (when enabled) a deployed starter site kit — zero manual setup.",
        engine: "cloud",
        status: "live",
        schedule: "Instant, on every intake submission",
        output: "Workflow + tasks in Projects; optional auto-deployed site",
        href: "/pipeline-intake",
      },
      {
        id: "mail-triage",
        name: "Mail triage",
        what: "Scans both inboxes for client replies, leads, store / platform notices, and money items; summarizes what matters.",
        engine: "pc",
        status: "live",
        schedule: "Morning (07:30)",
        output: "Summary in INBOX FYI; reply drafts in Gmail",
      },
      {
        id: "lead-surfacing",
        name: "Lead surfacing",
        what: "Read-only scans of live lead tables (Language Cradle CMS, MoverGuy quotes) surface new leads since the last run.",
        engine: "pc",
        status: "live",
        schedule: "Every run",
        output: "New lead → INBOX FYI with name + ask",
      },
      {
        id: "event-radar",
        name: "Event radar & daily brief",
        what: "Flags campaign/event dates within 4 days and writes a 3–6 bullet state-of-the-empire every morning.",
        engine: "pc",
        status: "live",
        schedule: "Every run · brief at 07:30",
        output: "Brief at the top of INBOX",
      },
    ],
  },
  {
    id: "trading",
    label: "Trading",
    emoji: "📈",
    tagline: "Signals computed, never traded — the live-funds guard stays in your hands.",
    capabilities: [
      {
        id: "signal-scan",
        name: "VIX signal scan (DRY-RUN)",
        what: "Runs the Deriv bot + Pine confluence scoring in DRY-RUN against VIX synthetics. Judged by trade count + profit factor, never raw PnL.",
        engine: "pc",
        status: "live",
        schedule: "Evening (18:30)",
        output: "Best setup → INBOX as 'DRY-RUN SIGNAL, manual execution only'",
      },
      {
        id: "mt5-ingest",
        name: "MT5 trade ingest",
        what: "This app exposes an ingest endpoint for MT5 expert advisors to POST fills/equity for the Trading dashboard.",
        engine: "cloud",
        status: "wire-next",
        output: "POST /api/v1/integrations/mt5/ingest",
        href: "/trading",
      },
    ],
  },
];

/* ----------------------------- THE TWO ENGINES ---------------------------- */

export type PcEngineSlot = { time: string; name: string; does: string };
export type PcEngineSop = { name: string; does: string; slot: string };

export const PC_ENGINE = {
  title: "JARVIS engine — Jordan's PC",
  how: "Windows Task Scheduler → free PowerShell SOP scans → a budget-capped Claude pass wakes only when there's something to judge or create. Quiet runs cost $0. Every run with news emails its report to both inboxes via Resend.",
  inbox: "C:\\Users\\jader\\JARVIS\\INBOX.md",
  guardrail:
    "Outward / irreversible actions are STAGED for one tap, never auto-fired: client social posts, client live-domain deploys, store submits, DNS, spend. Client data is read-only. Live trades never happen.",
  slots: [
    {
      time: "07:30",
      name: "Morning",
      does: "Full sweep: domain + deploy health, reach/SEO + speed scan, mail triage, leads, daily brief",
    },
    {
      time: "13:00",
      name: "Midday",
      does: "Build rotation (bug catching) — $0 unless something is actually wrong",
    },
    {
      time: "18:30",
      name: "Evening",
      does: "Marketing post generated + staged, security audit rotation, trading signal scan",
    },
  ] satisfies PcEngineSlot[],
  sops: [
    { name: "sop-10-health", does: "Pings client live domains, toolchain check, event radar", slot: "every run" },
    { name: "sop-20-git", does: "Finds repos with uncommitted / unpushed work", slot: "every run" },
    { name: "sop-30-builds", does: "Builds one rotating project, 180s time-box", slot: "midday" },
    { name: "sop-40-vercel", does: "Samples a linked project's deploys for errors", slot: "every run" },
    { name: "sop-50-security", does: "npm audit (prod deps) + committed-secrets check", slot: "evening" },
    { name: "sop-60-reach", does: "SEO basics + homepage speed on live domains", slot: "morning" },
  ] satisfies PcEngineSop[],
};

export type CloudAutomation = {
  name: string;
  does: string;
  trigger: string;
  endpoint?: string;
  status: JarvisStatus;
};

export const CLOUD_AUTOMATIONS: CloudAutomation[] = [
  {
    name: "Daily digest email",
    does: "Emails the day's operating picture (tasks, intake, money) via Resend",
    trigger: "Vercel cron · 12:00 UTC daily",
    endpoint: "/api/notify/digest",
    status: "live",
  },
  {
    name: "End-of-day report",
    does: "EOD summary email so the day closes itself out",
    trigger: "Vercel cron · 22:00 UTC daily",
    endpoint: "/api/notify/eod",
    status: "live",
  },
  {
    name: "Intake → workflow autopilot",
    does: "Auto-creates a project workflow (+ tasks, brief, optional starter-site deploy) from every intake submission",
    trigger: "On intake submission",
    endpoint: "/api/v1/intake/[token]",
    status: "live",
  },
  {
    name: "Inbound webhook",
    does: "Generic receiver for Zapier / n8n / TradingView alerts",
    trigger: "External POST",
    endpoint: "/api/v1/webhooks/inbound",
    status: "live",
  },
  {
    name: "One-click deploy revert",
    does: "Roll any site back to its previous good deployment from the Tower",
    trigger: "Manual, from the Deploys tab",
    endpoint: "/api/v1/vercel/revert",
    status: "live",
  },
  {
    name: "Error alerts",
    does: "Runtime errors email you immediately via Resend",
    trigger: "On error",
    endpoint: "/api/notify/error",
    status: "live",
  },
  {
    name: "Angel — inbox triage",
    does: "Polls the J Supreme Marketing Meta inbox, triages each conversation, and drafts approval-gated replies",
    trigger: "Vercel cron · every 15 min",
    endpoint: "/api/cron/jarvis-angel",
    status: "live",
  },
];

/* ------------------------------ AI WORKFLOWS ------------------------------ */

export type AiWorkflow = {
  name: string;
  what: string;
  where: "in-app" | "pc";
  href?: string;
  path?: string;
  hint?: string;
};

export const AI_WORKFLOWS: AiWorkflow[] = [
  {
    name: "Jarvis AI chat",
    what: "Conversational operator inside this workspace — add tasks, reminders, and parse client info from chat.",
    where: "in-app",
    hint: "⌘⇧A / Ctrl+Shift+A anywhere in the app",
  },
  {
    name: "Site Kit generator",
    what: "Brief in → branded static site out, with one-click deploy to Vercel.",
    where: "in-app",
    href: "/site-kit",
  },
  {
    name: "AI CRM parser",
    what: "Paste a WhatsApp message or email — Jarvis extracts the client, ask, and budget into the CRM.",
    where: "in-app",
    href: "/crm",
  },
  {
    name: "Ad-set & creative generator",
    what: "Brand-kit-driven ad sets, flyers, and IG covers rendered via headless Chrome.",
    where: "pc",
    path: "J Supreme Tech\\_creative-toolkit",
  },
  {
    name: "Reels studio",
    what: "Data-driven Remotion video reels — swap the JSON, render a new branded reel.",
    where: "pc",
    path: "J Supreme Tech\\reels-studio",
  },
  {
    name: "App-store screenshot rig",
    what: "Renders native-resolution iOS/iPad store screenshots for all 6 mobile apps (51 shots).",
    where: "pc",
    path: "_mobile-launch-audit\\_build\\shoot.cjs",
  },
  {
    name: "Cross-project codemods",
    what: "One script, applied to all 17 web projects at once (e.g. the PWA-popup fix).",
    where: "pc",
    path: "J Supreme Tech\\_build",
  },
  {
    name: "Claude Code sessions",
    what: "The deep-work engine: full builds, deploys, audits, and campaigns run as agent sessions on the PC.",
    where: "pc",
    hint: "Everything in this workspace was shipped this way",
  },
];
