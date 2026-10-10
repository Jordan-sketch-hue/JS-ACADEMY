/**
 * Vision Board — shared, client-safe types, constants, curated seeds, and pure
 * helpers. Imported by BOTH the server data layer (`@/lib/data/vision`) and the
 * browser localStorage store (`@/lib/vision/local-store`), so this file must NOT
 * import anything server-only.
 */

export type VisionStatus = "vision" | "active" | "achieved";

/** Time horizon keys (stored) → friendly labels (rendered). Ordered soonest → furthest. */
export type VisionHorizon = "now" | "1y" | "3y" | "5y" | "10y" | "someday";

export const VISION_STATUS_VALUES: VisionStatus[] = ["vision", "active", "achieved"];
export const VISION_HORIZON_VALUES: VisionHorizon[] = ["now", "1y", "3y", "5y", "10y", "someday"];

export const HORIZON_LABELS: Record<VisionHorizon, string> = {
  now: "This year",
  "1y": "Next year",
  "3y": "3 years",
  "5y": "5 years",
  "10y": "10 years",
  someday: "Someday",
};

/** The six pillars the board is organized around. Free-text is allowed, but these drive the UI. */
export const VISION_PILLARS = [
  "Empire & Revenue",
  "Products & Platforms",
  "Brand & Reach",
  "Team & Culture",
  "Wealth & Freedom",
  "Legacy & Impact",
] as const;
export type VisionPillar = (typeof VISION_PILLARS)[number];

export const STATUS_LABELS: Record<VisionStatus, string> = {
  vision: "Vision",
  active: "In motion",
  achieved: "Achieved",
};

export type VisionItem = {
  id: string;
  owner_clerk_id: string;
  title: string;
  description: string | null;
  pillar: string;
  horizon: VisionHorizon;
  /** The measurable target, e.g. "J$1M MRR" or "100 subscribers". Optional. */
  metric: string | null;
  status: VisionStatus;
  /** 0–100. */
  progress: number;
  pinned: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type VisionInput = {
  title?: string | null;
  description?: string | null;
  pillar?: string | null;
  horizon?: VisionHorizon | null;
  metric?: string | null;
  status?: VisionStatus | null;
  progress?: number | null;
  pinned?: boolean | null;
};

export type VisionPatch = VisionInput & { sort_order?: number };

export type VisionResult =
  | { ok: true; item: VisionItem }
  | { ok: false; error: string };

// ── normalizers (shared by both persistence backends) ───────────────────────

export function normVisionStatus(raw: unknown): VisionStatus {
  const s = String(raw ?? "vision").toLowerCase().trim();
  return (VISION_STATUS_VALUES as string[]).includes(s) ? (s as VisionStatus) : "vision";
}

export function normHorizon(raw: unknown): VisionHorizon {
  const s = String(raw ?? "3y").toLowerCase().trim();
  return (VISION_HORIZON_VALUES as string[]).includes(s) ? (s as VisionHorizon) : "3y";
}

export function normProgress(raw: number | null | undefined): number {
  const n = Number(raw ?? 0);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function normPillar(raw: unknown): string {
  const s = String(raw ?? "").trim();
  return s || "Empire & Revenue";
}

// ── pure board math (used by the client header) ──────────────────────────────

export type VisionStats = {
  total: number;
  active: number;
  achieved: number;
  dreaming: number;
  /** Average progress across non-achieved items (achieved count as 100). 0–100. */
  momentum: number;
};

export function computeVisionStats(items: VisionItem[]): VisionStats {
  const total = items.length;
  const achieved = items.filter((i) => i.status === "achieved").length;
  const active = items.filter((i) => i.status === "active").length;
  const dreaming = items.filter((i) => i.status === "vision").length;
  const momentum =
    total === 0
      ? 0
      : Math.round(
          items.reduce((sum, i) => sum + (i.status === "achieved" ? 100 : i.progress), 0) / total,
        );
  return { total, active, achieved, dreaming, momentum };
}

/** Sort: pinned first, then by status weight (in motion → vision → achieved), then nearest horizon, then sort_order. */
const HORIZON_WEIGHT: Record<VisionHorizon, number> = { now: 0, "1y": 1, "3y": 2, "5y": 3, "10y": 4, someday: 5 };
const STATUS_WEIGHT: Record<VisionStatus, number> = { active: 0, vision: 1, achieved: 2 };

export function sortVisions(items: VisionItem[]): VisionItem[] {
  return [...items].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (STATUS_WEIGHT[a.status] !== STATUS_WEIGHT[b.status])
      return STATUS_WEIGHT[a.status] - STATUS_WEIGHT[b.status];
    if (HORIZON_WEIGHT[a.horizon] !== HORIZON_WEIGHT[b.horizon])
      return HORIZON_WEIGHT[a.horizon] - HORIZON_WEIGHT[b.horizon];
    return a.sort_order - b.sort_order;
  });
}

// ── curated starter visions ─────────────────────────────────────────────────
// Seeded once per owner (only when the board is empty). Fully editable/deletable
// afterwards — these are real rows, not hardcoded UI.

export type VisionSeedSpec = Omit<
  VisionItem,
  "id" | "owner_clerk_id" | "created_at" | "updated_at"
>;

export const VISION_SEEDS: VisionSeedSpec[] = [
  {
    title: "J$1,000,000+ per month, recurring",
    description:
      "Stack the J Supreme group — agency retainers, Supreme Suite subscriptions, and product revenue — into seven figures of predictable monthly income.",
    pillar: "Empire & Revenue",
    horizon: "3y",
    metric: "J$1M MRR",
    status: "active",
    progress: 15,
    pinned: true,
    sort_order: 0,
  },
  {
    title: "100 paying Supreme Suite subscribers",
    description:
      "Turn the white-label SaaS into a real subscription business — the engine that earns while I sleep.",
    pillar: "Empire & Revenue",
    horizon: "now",
    metric: "100 tenants",
    status: "active",
    progress: 10,
    pinned: false,
    sort_order: 1,
  },
  {
    title: "First J$10M revenue year",
    description: "Cross eight figures in a single year across all brands.",
    pillar: "Empire & Revenue",
    horizon: "5y",
    metric: "J$10M / year",
    status: "vision",
    progress: 0,
    pinned: false,
    sort_order: 2,
  },
  {
    title: "Supreme Suite is the default OS for 500 Caribbean businesses",
    description:
      "Every small business in the region running their CRM, website, and AI staff on a J Supreme platform.",
    pillar: "Products & Platforms",
    horizon: "5y",
    metric: "500 businesses",
    status: "vision",
    progress: 5,
    pinned: false,
    sort_order: 3,
  },
  {
    title: "Ship one product that runs profitably without me",
    description: "A flagship that grows on systems and a team — not on my daily attention.",
    pillar: "Products & Platforms",
    horizon: "3y",
    metric: null,
    status: "active",
    progress: 20,
    pinned: false,
    sort_order: 4,
  },
  {
    title: "J Supreme is a household name across the Caribbean & diaspora",
    description: "When people think 'tech that gets it done in the islands,' they think J Supreme.",
    pillar: "Brand & Reach",
    horizon: "5y",
    metric: null,
    status: "vision",
    progress: 10,
    pinned: false,
    sort_order: 5,
  },
  {
    title: "100,000 engaged followers across the portfolio",
    description: "A real audience that trusts the brand and buys from it.",
    pillar: "Brand & Reach",
    horizon: "3y",
    metric: "100k followers",
    status: "active",
    progress: 8,
    pinned: false,
    sort_order: 6,
  },
  {
    title: "A 10-person A-player team that ships without me in the room",
    description: "Hire people better than me at their craft and give them room to run.",
    pillar: "Team & Culture",
    horizon: "3y",
    metric: "10 hires",
    status: "vision",
    progress: 0,
    pinned: false,
    sort_order: 7,
  },
  {
    title: "Hire my first full-time engineer and designer",
    description: "Move from solo-operator to founder-with-a-team.",
    pillar: "Team & Culture",
    horizon: "now",
    metric: "2 hires",
    status: "active",
    progress: 0,
    pinned: false,
    sort_order: 8,
  },
  {
    title: "Run the group from anywhere for 3 months straight",
    description:
      "Prove the business is truly location-independent — Medellín, Lisbon, wherever the plan points.",
    pillar: "Wealth & Freedom",
    horizon: "now",
    metric: null,
    status: "active",
    progress: 25,
    pinned: true,
    sort_order: 9,
  },
  {
    title: "Consistently profitable trading funding a 6-figure portfolio",
    description: "Take the SMC/ICT bot from demo-locked to a funded, risk-managed live account.",
    pillar: "Wealth & Freedom",
    horizon: "5y",
    metric: "US$100k portfolio",
    status: "active",
    progress: 12,
    pinned: false,
    sort_order: 10,
  },
  {
    title: "A fully paid-for home base",
    description: "Own the roof — a place that's mine, free and clear.",
    pillar: "Wealth & Freedom",
    horizon: "10y",
    metric: null,
    status: "vision",
    progress: 0,
    pinned: false,
    sort_order: 11,
  },
  {
    title: "Create 25 well-paid tech jobs in Jamaica",
    description: "Build the kind of company that keeps Caribbean talent home and paid well.",
    pillar: "Legacy & Impact",
    horizon: "10y",
    metric: "25 jobs",
    status: "vision",
    progress: 0,
    pinned: true,
    sort_order: 12,
  },
  {
    title: "Mentor and fund the next wave of Caribbean founders",
    description: "Be the check and the advice I wish I'd had starting out.",
    pillar: "Legacy & Impact",
    horizon: "10y",
    metric: null,
    status: "vision",
    progress: 0,
    pinned: false,
    sort_order: 13,
  },
  {
    title: "Build something my family is proud of that outlasts me",
    description: "A name and a company that mean something a generation from now.",
    pillar: "Legacy & Impact",
    horizon: "someday",
    metric: null,
    status: "vision",
    progress: 0,
    pinned: false,
    sort_order: 14,
  },
];
