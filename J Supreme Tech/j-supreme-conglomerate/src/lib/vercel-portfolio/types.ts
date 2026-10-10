export type VercelSiteCategory = {
  id: string;
  label: string;
  description?: string;
  order: number;
};

export type VercelSiteHealthStatus =
  | "healthy"
  | "warning"
  | "offline"
  | "not-deployed";

export type VercelSiteEntry = {
  id: string;
  name: string;
  url: string;
  description?: string;
  categoryId: string;
  tags?: string[];
  featured?: boolean;
  /** When set, merges with a live Vercel project of the same name. */
  vercelProjectName?: string;
  source: "catalog" | "vercel-api";
  updatedAt?: string | null;
  nodeVersion?: string | null;
  health?: {
    status: VercelSiteHealthStatus;
    statusCode: number | null;
    responseMs: number | null;
    checkedAt: string;
  };
};

export type VercelSitesHub = {
  categories: VercelSiteCategory[];
  sites: VercelSiteEntry[];
  vercelApiConnected: boolean;
  vercelApiError: string | null;
  checkedAt: string;
  totals: {
    total: number;
    deployed: number;
    healthy: number;
    warning: number;
    offline: number;
    notDeployed: number;
  };
};
