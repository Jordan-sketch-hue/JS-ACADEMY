export type LeadStage =
  | "cold"
  | "warm"
  | "negotiation"
  | "closed"
  | "lost";

export interface RevenuePoint {
  label: string;
  value: number;
}

export interface DashboardBundle {
  revenue: {
    daily: RevenuePoint[];
    weekly: RevenuePoint[];
    monthly: RevenuePoint[];
    yearly: RevenuePoint[];
  };
  clients: {
    active: number;
    pendingPayments: number;
    newLeads: number;
    conversionRate: number;
  };
  trading: {
    winRate: number;
    plNet: number;
    riskExposure: number;
    fundingProgress: number;
    journalInsight: string;
  };
  pipeline: {
    id: string;
    name: string;
    client: string;
    progress: number;
    deadline: string;
    priority: 1 | 2 | 3 | 4;
    status: string;
  }[];
  aiPanel: {
    label: string;
    value: string;
    delta: string;
  }[];
  notifications: {
    id: string;
    title: string;
    time: string;
    type: "deadline" | "followup" | "trading" | "deploy";
  }[];
  leadsByStage: Record<LeadStage, number>;
  recentActivity: { id: string; text: string; time: string }[];
  /** Open / done task counts per category (Tech, Marketing, Trading, custom). */
  taskLanes: TaskLaneInsight[];
}

export interface TaskLaneInsight {
  categoryId: string;
  name: string;
  color: string | null;
  open: number;
  done: number;
  total: number;
}

/** Empty baseline — dashboard fills from your connected data only. */
export function seedDashboardBundle(_ownerId: string): DashboardBundle {
  const emptyLeads: Record<LeadStage, number> = {
    cold: 0,
    warm: 0,
    negotiation: 0,
    closed: 0,
    lost: 0,
  };

  return {
    revenue: { daily: [], weekly: [], monthly: [], yearly: [] },
    clients: {
      active: 0,
      pendingPayments: 0,
      newLeads: 0,
      conversionRate: 0,
    },
    trading: {
      winRate: 0,
      plNet: 0,
      riskExposure: 0,
      fundingProgress: 0,
      journalInsight:
        "Connect trades in Supabase or log sessions here to see insights.",
    },
    pipeline: [],
    aiPanel: [],
    notifications: [],
    leadsByStage: emptyLeads,
    recentActivity: [],
    taskLanes: [],
  };
}
