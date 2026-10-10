/**
 * J Supreme — Cyber Command data model
 * ------------------------------------------------------------------
 * Single source of truth for the in-app Security Operations Center.
 *
 * Everything here is REAL, operator-owned configuration — the fleet we
 * actually run, the seven defensive pillars we hold ourselves to, the
 * security controls that are live vs. planned, the incident-response
 * playbooks we execute, and the compliance frameworks we map to.
 *
 * The live fleet scanner (`/api/v1/cyber/scan`) reads `FLEET` and probes
 * each property for real; the SOC pages read the rest to render posture,
 * playbooks, crypto inventory and compliance evidence.
 *
 * Design principle mirrored from the platform brief: ZERO TRUST —
 * "never trust, always verify". Status is honest: `live` controls are
 * enforced today, `partial` are half-wired, `planned` are on the roadmap.
 */

export type ControlStatus = "live" | "partial" | "planned";

export type PillarId =
  | "iam"
  | "encryption"
  | "detection"
  | "defense"
  | "intel"
  | "resilience"
  | "soc";

/* ------------------------------------------------------------------ */
/* 1. The fleet — what we actually push to, use, save and store        */
/* ------------------------------------------------------------------ */

export type FleetTier = "hub" | "platform" | "client" | "mobile" | "infra";

export type FleetProperty = {
  id: string;
  name: string;
  /** Public origin the scanner probes. https:// required for a passing TLS grade. */
  url: string;
  tier: FleetTier;
  /** Where its data lives — drives the data-protection view. */
  dataStore: "supabase" | "vercel-kv" | "wordpress" | "static" | "none";
  /** Does it process payments / PII / credentials? Raises its criticality. */
  sensitivity: "low" | "medium" | "high" | "critical";
  auth: "clerk" | "supabase" | "custom" | "none";
  notes?: string;
};

/**
 * The live properties across the J Supreme group. The scanner hits each
 * origin and inspects the response headers — security headers ride on
 * every HTTP response, so this works even for sites with no /api/health.
 */
export const FLEET: FleetProperty[] = [
  // — Hub & platform —
  { id: "conglomerate", name: "J Supreme Conglomerate", url: "https://jsupremeconglomerate.online", tier: "hub", dataStore: "supabase", sensitivity: "critical", auth: "clerk", notes: "Operator workspace — CRM, invoices, credentials, this SOC." },
  { id: "supreme-suite", name: "Supreme Suite (SaaS)", url: "https://supreme-suite.vercel.app", tier: "platform", dataStore: "supabase", sensitivity: "critical", auth: "supabase", notes: "Multi-tenant white-label SaaS — tenant isolation is paramount." },
  { id: "jst-website", name: "J Supreme Tech", url: "https://jsupremetech.online", tier: "platform", dataStore: "supabase", sensitivity: "high", auth: "none", notes: "Public site + WiPay checkout." },

  // — Client platforms (payments / PII) —
  { id: "solidtrust", name: "Solid Trust Courier", url: "https://solidtrustservices.com", tier: "client", dataStore: "supabase", sensitivity: "high", auth: "supabase", notes: "Freight forwarding, staff auth, e-sign agreements." },
  { id: "moverguy", name: "The Mover Guy", url: "https://themoverguy.online", tier: "client", dataStore: "supabase", sensitivity: "high", auth: "supabase", notes: "Store + WiPay card payments + branded mail." },
  { id: "bpcouriers", name: "BP Couriers", url: "https://bpcouriers.online", tier: "client", dataStore: "supabase", sensitivity: "high", auth: "clerk", notes: "Courier scheduling, Clerk + guest bookings." },
  { id: "language-cradle", name: "The Language Cradle", url: "https://thelanguagecradle.com", tier: "client", dataStore: "supabase", sensitivity: "medium", auth: "supabase", notes: "Flagship IBLC site + CMS." },
  { id: "lc-app", name: "Language Cradle Portal", url: "https://language-cradle-app.vercel.app", tier: "client", dataStore: "supabase", sensitivity: "high", auth: "supabase", notes: "Student portal — entitlements, members-only content." },
  { id: "abootours", name: "Aboo Tours", url: "https://abootours.com", tier: "client", dataStore: "supabase", sensitivity: "medium", auth: "supabase", notes: "Tourism + transfers bookings." },
  { id: "solace", name: "Solace Auto Imports", url: "https://solaceautoimportsltd.com", tier: "client", dataStore: "static", sensitivity: "low", auth: "custom", notes: "Static car gallery." },
  { id: "cleanser", name: "The Cleanser JA", url: "https://the-cleanser-ja.vercel.app", tier: "client", dataStore: "supabase", sensitivity: "high", auth: "supabase", notes: "Herbal e-commerce + admin." },
  { id: "ship2door", name: "Ship 2 Door JA", url: "https://ship2doorja.com", tier: "client", dataStore: "wordpress", sensitivity: "medium", auth: "custom", notes: "WordPress — different attack surface (plugins/admin)." },
  { id: "unique-surfaces", name: "Unique Solid Surfaces", url: "https://unique-solid-surfaces.vercel.app", tier: "client", dataStore: "supabase", sensitivity: "medium", auth: "supabase", notes: "Countertop platform + admin CRM." },
  { id: "nexpro", name: "NEXPRO / NEXLINK", url: "https://nexpro-sigma.vercel.app", tier: "client", dataStore: "supabase", sensitivity: "medium", auth: "supabase", notes: "Agri-tech food-security platform." },
  { id: "courier-logistics", name: "Stratus Courier", url: "https://courier-logistics.vercel.app", tier: "client", dataStore: "none", sensitivity: "low", auth: "none", notes: "Logistics demo — mock data only." },
  { id: "ridelink", name: "RideLink Jamaica", url: "https://ridelink-jamaica.vercel.app", tier: "client", dataStore: "none", sensitivity: "low", auth: "none", notes: "Ride-hailing demo." },
  { id: "crown-district", name: "Crown District JA", url: "https://crown-district-ja.vercel.app", tier: "client", dataStore: "none", sensitivity: "low", auth: "none", notes: "Streetwear e-commerce demo." },
  { id: "fabworks", name: "ForgeWorks / FabWorks", url: "https://fabworks-ja.vercel.app", tier: "client", dataStore: "none", sensitivity: "low", auth: "none", notes: "Fabrication ecosystem demo." },
];

/* ------------------------------------------------------------------ */
/* 2. The seven pillars (the platform brief, mapped to our reality)    */
/* ------------------------------------------------------------------ */

export type Pillar = {
  id: PillarId;
  index: number;
  name: string;
  tagline: string;
  /** lucide-react icon name; resolved in the component. */
  icon: string;
  capabilities: string[];
  /** 0–100 maturity of this pillar across the fleet today. */
  maturity: number;
};

export const PILLARS: Pillar[] = [
  {
    id: "iam",
    index: 1,
    name: "Identity & Access Management",
    tagline: "Zero-trust authentication · continuous verification · risk-based access.",
    icon: "Fingerprint",
    maturity: 72,
    capabilities: [
      "Zero-trust auth — every operator route fails closed (Clerk + email allowlist)",
      "Continuous verification — session re-validated on each request via middleware",
      "Risk-based authentication — step-up on new device / impossible travel (planned)",
      "Behavioral biometrics — typing/navigation baselines (roadmap)",
      "Least-privilege RBAC — architect / ops / support operator tiers",
    ],
  },
  {
    id: "encryption",
    index: 2,
    name: "Encryption & Key Management",
    tagline: "Post-quantum readiness · hybrid crypto · rotation · secret hygiene.",
    icon: "KeyRound",
    maturity: 64,
    capabilities: [
      "TLS 1.3 in transit on every property (Vercel-managed certs, auto-renew)",
      "AES-256 at rest for all Supabase-backed data",
      "Secret management — env-scoped keys, never in client bundles",
      "Key rotation calendar — tracked, reminders on cadence",
      "Post-quantum migration plan — hybrid X25519+ML-KEM readiness checklist",
    ],
  },
  {
    id: "detection",
    index: 3,
    name: "AI Threat Detection",
    tagline: "Network + user-behavior + endpoint analytics · predictive risk scoring.",
    icon: "ScanEye",
    maturity: 41,
    capabilities: [
      "Anomaly detection on auth + request patterns (baseline + z-score)",
      "User & Entity Behavior Analytics (UEBA) on operator sessions",
      "Predictive threat scoring 0–100 per actor / IP / session",
      "Bot & abuse detection — Vercel BotID at the edge (recommended)",
      "Endpoint signal ingestion from each property's /api/health",
    ],
  },
  {
    id: "defense",
    index: 4,
    name: "Autonomous Defense",
    tagline: "Automated containment · dynamic segmentation · adaptive firewall · SOAR.",
    icon: "ShieldHalf",
    maturity: 38,
    capabilities: [
      "Automated containment — auto-block IP / revoke session on high score",
      "Adaptive firewall policies — Vercel Firewall / WAF rules as code",
      "Dynamic segmentation — per-tenant + per-role network boundaries",
      "Incident orchestration (SOAR) — playbook-driven response runbooks",
      "Rate limiting at the edge — token-bucket on every public endpoint",
    ],
  },
  {
    id: "intel",
    index: 5,
    name: "Threat Intelligence Network",
    tagline: "Feed aggregation · reputation scoring · global pattern correlation.",
    icon: "Radar",
    maturity: 33,
    capabilities: [
      "Threat-intel aggregation — IOC feeds (IPs, domains, hashes)",
      "Reputation scoring — IP / ASN / email reputation lookups",
      "Global attack-pattern correlation across the whole fleet",
      "Real-time risk assessment fed back into access decisions",
      "Shared blocklist — one property's attacker is blocked everywhere",
    ],
  },
  {
    id: "resilience",
    index: 6,
    name: "Resilience & Recovery",
    tagline: "Distributed architecture · self-healing · redundant control planes · DR.",
    icon: "HeartPulse",
    maturity: 58,
    capabilities: [
      "Distributed by default — Vercel edge network, multi-region functions",
      "Self-healing — health probes + auto-rollback on failed deploy",
      "Redundant control planes — no single point of operator failure",
      "Automated backups — Supabase PITR, daily snapshots",
      "DR runbooks — tested restore path with defined RTO / RPO",
    ],
  },
  {
    id: "soc",
    index: 7,
    name: "Security Operations Center",
    tagline: "Executive dashboards · analyst views · investigations · compliance reporting.",
    icon: "MonitorCheck",
    maturity: 55,
    capabilities: [
      "Executive dashboard — fleet posture at a glance (this view)",
      "Analyst views — drill into any property's controls + events",
      "Threat investigation workflows — triage → contain → eradicate → recover",
      "Compliance reporting — SOC 2 / GDPR / PCI evidence on demand",
      "Immutable audit log — every operator + security action recorded",
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 3. Security controls — live / partial / planned (honest posture)    */
/* ------------------------------------------------------------------ */

export type Control = {
  id: string;
  pillar: PillarId;
  name: string;
  status: ControlStatus;
  detail: string;
};

export const CONTROLS: Control[] = [
  // IAM
  { id: "iam-zerotrust", pillar: "iam", name: "Fail-closed operator gate", status: "live", detail: "Clerk middleware + operator email allowlist; production denies by default." },
  { id: "iam-mfa", pillar: "iam", name: "MFA on operator accounts", status: "partial", detail: "Available via Clerk; enforce org-wide MFA policy to reach 'live'." },
  { id: "iam-rbac", pillar: "iam", name: "Role tiers (architect/ops/support)", status: "live", detail: "Three universal back-office roles; RLS-scoped on Supabase." },
  { id: "iam-risk", pillar: "iam", name: "Risk-based step-up auth", status: "planned", detail: "New-device / impossible-travel challenge before sensitive actions." },

  // Encryption
  { id: "enc-tls", pillar: "encryption", name: "TLS 1.3 everywhere", status: "live", detail: "Vercel-managed certificates, auto-renewed, HTTPS-only." },
  { id: "enc-rest", pillar: "encryption", name: "AES-256 at rest", status: "live", detail: "Supabase/Postgres transparent disk encryption on all data." },
  { id: "enc-secrets", pillar: "encryption", name: "Secret hygiene", status: "partial", detail: "Env-scoped; rotate the 4-store operator credential set on a schedule." },
  { id: "enc-rotation", pillar: "encryption", name: "Key-rotation calendar", status: "partial", detail: "Tracked here; automate reminders + forced rotation." },
  { id: "enc-pq", pillar: "encryption", name: "Post-quantum readiness", status: "planned", detail: "Adopt hybrid X25519+ML-KEM as platforms ship it; inventory crypto first." },

  // Detection
  { id: "det-anomaly", pillar: "detection", name: "Auth anomaly detection", status: "partial", detail: "Baseline failed-login + geo-velocity; wire alerting." },
  { id: "det-bot", pillar: "detection", name: "Bot / abuse detection", status: "planned", detail: "Enable Vercel BotID at the edge on public forms." },
  { id: "det-score", pillar: "detection", name: "Predictive threat score", status: "planned", detail: "0–100 per actor; feeds autonomous defense." },

  // Defense
  { id: "def-rate", pillar: "defense", name: "Rate limiting", status: "partial", detail: "Token-bucket utility shipped; roll out to every public POST route." },
  { id: "def-headers", pillar: "defense", name: "Security headers", status: "partial", detail: "HSTS / X-Frame / nosniff / Referrer / Permissions on the hub; extend fleet-wide." },
  { id: "def-waf", pillar: "defense", name: "Edge WAF / firewall rules", status: "planned", detail: "Vercel Firewall rules-as-code; geo + path + signature blocks." },
  { id: "def-soar", pillar: "defense", name: "Incident playbooks (SOAR)", status: "live", detail: "Runbooks defined for the top incident classes (see Playbooks)." },

  // Intel
  { id: "intel-feeds", pillar: "intel", name: "IOC feed ingestion", status: "planned", detail: "Pull AbuseIPDB / spam blocklists; cache + correlate." },
  { id: "intel-rep", pillar: "intel", name: "IP / email reputation", status: "planned", detail: "Score inbound on signup / checkout / booking." },
  { id: "intel-shared", pillar: "intel", name: "Fleet-wide shared blocklist", status: "planned", detail: "Block once, block everywhere across all properties." },

  // Resilience
  { id: "res-backup", pillar: "resilience", name: "Automated backups (PITR)", status: "live", detail: "Supabase point-in-time recovery + daily snapshots." },
  { id: "res-rollback", pillar: "resilience", name: "Auto-rollback on bad deploy", status: "partial", detail: "Health-gated; add automatic promote/rollback on probe failure." },
  { id: "res-dr", pillar: "resilience", name: "Tested DR runbook (RTO/RPO)", status: "partial", detail: "Documented; schedule quarterly restore drills." },

  // SOC
  { id: "soc-dash", pillar: "soc", name: "Executive + analyst dashboards", status: "live", detail: "This Cyber Command surface." },
  { id: "soc-audit", pillar: "soc", name: "Immutable audit log", status: "partial", detail: "Operator actions logged; make append-only + tamper-evident." },
  { id: "soc-compliance", pillar: "soc", name: "Compliance evidence", status: "partial", detail: "SOC 2 / GDPR / PCI mapping started (see Compliance)." },
];

/* ------------------------------------------------------------------ */
/* 4. Crypto inventory & key-rotation tracker                          */
/* ------------------------------------------------------------------ */

export type CryptoAsset = {
  name: string;
  algorithm: string;
  scope: string;
  rotationDays: number;
  /** ISO date the secret was last rotated, or null if unknown. */
  lastRotated: string | null;
  pqReady: boolean;
};

export const CRYPTO_INVENTORY: CryptoAsset[] = [
  { name: "TLS certificates (all domains)", algorithm: "ECDSA P-256 / TLS 1.3", scope: "In transit", rotationDays: 90, lastRotated: "2026-05-01", pqReady: false },
  { name: "Supabase data-at-rest", algorithm: "AES-256-GCM", scope: "At rest", rotationDays: 365, lastRotated: "2026-01-01", pqReady: false },
  { name: "Clerk session signing keys", algorithm: "RS256 / EdDSA", scope: "Sessions / JWT", rotationDays: 180, lastRotated: "2026-03-15", pqReady: false },
  { name: "Operator credential set", algorithm: "bcrypt + 4-store sync", scope: "Back-office auth", rotationDays: 90, lastRotated: "2026-05-22", pqReady: false },
  { name: "WiPay payment hash key", algorithm: "MD5 transaction hash", scope: "Payments", rotationDays: 180, lastRotated: null, pqReady: false },
  { name: "Resend / Twilio / API keys", algorithm: "Bearer secrets", scope: "Integrations", rotationDays: 120, lastRotated: "2026-06-11", pqReady: true },
  { name: "CRON_SECRET (scheduled jobs)", algorithm: "HMAC bearer", scope: "Server-to-server", rotationDays: 180, lastRotated: "2026-05-22", pqReady: true },
];

/* ------------------------------------------------------------------ */
/* 5. Incident-response playbooks (SOAR runbooks)                      */
/* ------------------------------------------------------------------ */

export type Severity = "critical" | "high" | "medium" | "low";

export type Playbook = {
  id: string;
  title: string;
  trigger: string;
  severity: Severity;
  /** NIST IR phases: detect → contain → eradicate → recover. */
  steps: { phase: "Detect" | "Contain" | "Eradicate" | "Recover"; action: string }[];
  automatable: boolean;
};

export const PLAYBOOKS: Playbook[] = [
  {
    id: "pb-cred-stuffing",
    title: "Credential stuffing / brute force",
    trigger: "Spike in failed logins from one IP/ASN, or many accounts from one device.",
    severity: "high",
    automatable: true,
    steps: [
      { phase: "Detect", action: "Anomaly engine flags >N failed auths / window; raise actor threat score." },
      { phase: "Contain", action: "Rate-limit + temporarily block source IP; force step-up auth on targeted accounts." },
      { phase: "Eradicate", action: "Invalidate affected sessions; require password reset; rotate any leaked secret." },
      { phase: "Recover", action: "Restore normal limits; add IP to fleet blocklist; post-incident note in audit log." },
    ],
  },
  {
    id: "pb-tenant-leak",
    title: "Multi-tenant data isolation breach (Supreme Suite)",
    trigger: "A tenant query returns another tenant's rows; RLS policy gap.",
    severity: "critical",
    automatable: false,
    steps: [
      { phase: "Detect", action: "RLS audit / anomalous cross-tenant read detected; alert architect tier." },
      { phase: "Contain", action: "Disable the affected endpoint; freeze writes for the tenant scope." },
      { phase: "Eradicate", action: "Patch RLS policy; add regression test; verify with the actual tenant IDs." },
      { phase: "Recover", action: "Re-enable; notify affected tenants per breach policy; file compliance evidence." },
    ],
  },
  {
    id: "pb-secret-leak",
    title: "Leaked API key / secret exposure",
    trigger: "Secret found in client bundle, logs, repo, or flagged by a scanner.",
    severity: "critical",
    automatable: true,
    steps: [
      { phase: "Detect", action: "Secret scanner / dependency alert / anomalous API usage on a key." },
      { phase: "Contain", action: "Revoke the key immediately at the provider; cut the blast radius." },
      { phase: "Eradicate", action: "Rotate across all 4 stores (Supabase/Clerk/Payload/file); purge from history." },
      { phase: "Recover", action: "Re-issue scoped key; add to rotation calendar; confirm services healthy." },
    ],
  },
  {
    id: "pb-payment-fraud",
    title: "Payment fraud / card testing (WiPay)",
    trigger: "Burst of small/declined transactions, mismatched hash, velocity anomaly at checkout.",
    severity: "high",
    automatable: true,
    steps: [
      { phase: "Detect", action: "Checkout velocity + decline-rate anomaly; reputation score on the buyer." },
      { phase: "Contain", action: "Throttle checkout per IP/email; require additional verification." },
      { phase: "Eradicate", action: "Block offending actors; confirm WiPay hash integrity on all orders." },
      { phase: "Recover", action: "Reconcile orders; restore normal flow; report pattern to fleet intel." },
    ],
  },
  {
    id: "pb-ddos",
    title: "Volumetric / application DDoS",
    trigger: "Traffic spike saturating a property; latency + error-rate climb.",
    severity: "high",
    automatable: true,
    steps: [
      { phase: "Detect", action: "Edge metrics + health probe latency breach; auto-page operator." },
      { phase: "Contain", action: "Enable edge WAF challenge / geo-block; tighten rate limits." },
      { phase: "Eradicate", action: "Signature-block the pattern; scale functions; cache aggressively." },
      { phase: "Recover", action: "Relax controls; capture attack signature into the shared blocklist." },
    ],
  },
  {
    id: "pb-wordpress",
    title: "WordPress compromise (Ship 2 Door)",
    trigger: "Unexpected admin user, plugin/file change, or malware flag on the WP property.",
    severity: "high",
    automatable: false,
    steps: [
      { phase: "Detect", action: "File-integrity / admin-user diff; reputation flag on the domain." },
      { phase: "Contain", action: "Lock wp-admin; take site to maintenance; preserve forensic copy." },
      { phase: "Eradicate", action: "Remove backdoors; update core/plugins; reset all WP + DB credentials." },
      { phase: "Recover", action: "Restore from clean backup; harden (2FA, least-plugin); monitor." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 6. Compliance frameworks                                            */
/* ------------------------------------------------------------------ */

export type Framework = {
  id: string;
  name: string;
  scope: string;
  /** 0–100 readiness. */
  readiness: number;
  controlsMet: number;
  controlsTotal: number;
  note: string;
};

export const FRAMEWORKS: Framework[] = [
  { id: "soc2", name: "SOC 2 Type II", scope: "Security, Availability, Confidentiality", readiness: 52, controlsMet: 31, controlsTotal: 60, note: "Audit-ready trajectory; gaps in formal logging + change mgmt." },
  { id: "gdpr", name: "GDPR / Data Protection", scope: "EU/UK personal data", readiness: 61, controlsMet: 22, controlsTotal: 36, note: "DPA + privacy pages live; add DSAR workflow + retention policy." },
  { id: "pci", name: "PCI DSS (SAQ-A)", scope: "Card payments (WiPay hosted)", readiness: 70, controlsMet: 14, controlsTotal: 20, note: "Hosted checkout keeps card data off our servers — SAQ-A scope." },
  { id: "owasp", name: "OWASP ASVS L2", scope: "Application security baseline", readiness: 58, controlsMet: 41, controlsTotal: 71, note: "Strong auth; close headers, rate-limit, input-validation gaps." },
];

/* ------------------------------------------------------------------ */
/* 7. Recommended defensive tooling (the "what else do I need" list)   */
/* ------------------------------------------------------------------ */

export type ToolRec = {
  category: string;
  name: string;
  why: string;
  /** Already wired into this session's stack? */
  available: boolean;
};

export const TOOL_RECS: ToolRec[] = [
  { category: "Edge / WAF", name: "Vercel Firewall + BotID", why: "Rules-as-code WAF, bot detection, DDoS mitigation at the edge — native to your stack.", available: true },
  { category: "Rate limiting", name: "Upstash Redis (or shipped in-memory limiter)", why: "Distributed token-bucket across serverless instances for true fleet-wide limits.", available: true },
  { category: "Error / anomaly", name: "Sentry", why: "Crash + performance + anomaly telemetry; feeds the detection pillar. (MCP available.)", available: true },
  { category: "Dependency / SAST", name: "Aikido Security", why: "SAST + secret + dependency (SCA) scanning on every code change. (MCP available.)", available: true },
  { category: "API security", name: "42Crunch API audit + scan", why: "OpenAPI audit, BOLA/BFLA conformance scanning of your API routes. (Skill available.)", available: true },
  { category: "Secrets", name: "Vercel/Supabase env + rotation calendar", why: "Scoped secrets, never in bundles; automate the rotation cadence tracked here.", available: true },
  { category: "Auth hardening", name: "Clerk MFA + device + bot signals", why: "Org-wide MFA, device fingerprinting, risk signals for step-up auth.", available: true },
  { category: "Data protection", name: "Supabase RLS + PITR backups", why: "Row-level security for tenant isolation; point-in-time recovery for ransomware.", available: true },
  { category: "Email auth", name: "SPF / DKIM / DMARC (Resend)", why: "Stop spoofing of your branded domains; protect deliverability + brand trust.", available: true },
  { category: "Monitoring / uptime", name: "Health probes + status pages", why: "Self-healing signals; you already run /api/health — centralize alerting.", available: true },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export function overallMaturity(): number {
  return Math.round(PILLARS.reduce((s, p) => s + p.maturity, 0) / PILLARS.length);
}

export function controlsByStatus(): Record<ControlStatus, number> {
  return CONTROLS.reduce(
    (acc, c) => ((acc[c.status] += 1), acc),
    { live: 0, partial: 0, planned: 0 } as Record<ControlStatus, number>,
  );
}

export const SEVERITY_RANK: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
