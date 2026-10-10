import type {
  VercelSiteCategory,
  VercelSiteEntry,
} from "@/lib/vercel-portfolio/types";

/**
 * Jarvis Workflow — launch control tower types.
 *
 * A "workflow" is a reusable launch-readiness checklist applied to every site.
 * Steps are either:
 *  - "auto"   → computed server-side from live signals (deployed? online? https? domain?)
 *  - "manual" → toggled by the operator and persisted (Resend key set, Supabase password, etc.)
 *
 * Overall readiness blends both and is computed on the client (because manual
 * state lives in the browser store until you wire Supabase persistence).
 */

export type CheckKind = "auto" | "manual";

/** pass = done/green · fail = missing/red · pending = not started · na = not applicable */
export type CheckState = "pass" | "fail" | "pending" | "na";

/** Live signals Jarvis can compute without operator input. */
export type AutoSignal =
  | "deployed"
  | "online"
  | "https"
  | "custom-domain"
  | "fresh-deploy"
  | "vercel-tracked";

export type WorkflowStepDef = {
  /** Stable id, namespaced by stage, e.g. "integrations.resend-key". */
  id: string;
  label: string;
  description?: string;
  kind: CheckKind;
  /** For auto steps: which computed signal drives the result. */
  signal?: AutoSignal;
  /** Relative importance in the readiness score (default 1). */
  weight?: number;
};

export type WorkflowStageDef = {
  id: string;
  label: string;
  hint?: string;
  steps: WorkflowStepDef[];
};

export type WorkflowTemplate = {
  id: string;
  label: string;
  version: number;
  stages: WorkflowStageDef[];
};

/** Result of one computed auto-check for a single site. */
export type AutoCheckResult = {
  signal: AutoSignal;
  state: CheckState;
  detail: string;
};

/** A site enriched with everything Jarvis can determine server-side. */
export type JarvisSite = VercelSiteEntry & {
  /** Resolved Vercel prj_ id when the API token is connected. */
  vercelProjectId: string | null;
  /** True when this site matched a live project on your Vercel account. */
  isVercelTracked: boolean;
  /** Computed auto-check results, keyed by signal. */
  auto: Partial<Record<AutoSignal, AutoCheckResult>>;
  /** Optional operator note seeded from the audit (editable later). */
  seedNote?: string;
  /**
   * Audit-verified default states for MANUAL steps (stepId → state), seeded
   * server-side from the launch audit. The operator's own taps (browser store)
   * always override these — a stored state wins over a seed.
   */
  seedChecks?: Record<string, CheckState>;
};

/**
 * Workspace-level integration readiness — the keys that power THIS command
 * center (not the individual client sites, which each carry their own env).
 * Computed server-side from process.env: booleans only, never the secret value.
 */
export type IntegrationKey = "vercel" | "resend" | "supabase" | "clerk" | "openai";

export type IntegrationStatus = {
  key: IntegrationKey;
  label: string;
  connected: boolean;
  /** What having this key unlocks. */
  purpose: string;
  /** The concrete next action when it's missing. */
  todo: string;
  /** Env var name(s) that drive the check. */
  envVars: string[];
  /** Where to create the key. */
  setupUrl: string;
};

export type JarvisHub = {
  sites: JarvisSite[];
  categories: VercelSiteCategory[];
  template: WorkflowTemplate;
  vercelApiConnected: boolean;
  vercelApiError: string | null;
  checkedAt: string;
  /** Readiness of the command center's own platform keys. */
  integrations: IntegrationStatus[];
  totals: {
    total: number;
    online: number;
    offline: number;
    notDeployed: number;
    customDomains: number;
    vercelTracked: number;
  };
};

/** One production deployment as Jarvis surfaces it. */
export type JarvisDeployment = {
  uid: string;
  url: string;
  state: string;
  created: number;
  target: string | null;
  commitMessage: string | null;
  commitRef: string | null;
  creator: string | null;
  isCurrent: boolean;
};
