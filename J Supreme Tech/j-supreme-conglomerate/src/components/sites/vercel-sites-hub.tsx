"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { VercelSitesHub } from "@/lib/vercel-portfolio/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  ExternalLink,
  Globe,
  RefreshCw,
  Star,
  AlertCircle,
  CheckCircle2,
  Activity,
  Clock,
  Server,
} from "lucide-react";

type Props = {
  initial: VercelSitesHub;
};

export function VercelSitesHub({ initial }: Props) {
  const [hub, setHub] = useState(initial);
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const refreshFromVercel = async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const res = await fetch("/api/v1/vercel/projects", { cache: "no-store" });
      const data = (await res.json()) as VercelSitesHub & { error?: string };
      if (!res.ok) {
        setRefreshError(data.error ?? "Could not refresh from Vercel.");
        return;
      }
      setHub(data);
    } catch (e) {
      setRefreshError(e instanceof Error ? e.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      void refreshFromVercel();
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return hub.sites.filter((site) => {
      if (categoryFilter !== "all" && site.categoryId !== categoryFilter) {
        return false;
      }
      if (!s) return true;
      return (
        site.name.toLowerCase().includes(s) ||
        site.url.toLowerCase().includes(s) ||
        (site.description ?? "").toLowerCase().includes(s) ||
        (site.tags ?? []).some((t) => t.toLowerCase().includes(s))
      );
    });
  }, [hub.sites, q, categoryFilter]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const site of filtered) {
      const list = map.get(site.categoryId) ?? [];
      list.push(site);
      map.set(site.categoryId, list);
    }
    return hub.categories
      .map((cat) => ({
        category: cat,
        sites: map.get(cat.id) ?? [],
      }))
      .filter((g) => g.sites.length > 0);
  }, [filtered, hub.categories]);

  const featured = useMemo(
    () => hub.sites.filter((s) => s.featured),
    [hub.sites],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">Conglomerate back office</p>
              <p className="text-xs text-muted-foreground">
                Open operator consoles for Aboo Tours, BP Couriers, Solace Auto, and this OS.
              </p>
            </div>
          </div>
          <Button size="sm" className="shrink-0 gap-1.5" asChild>
            <Link href="/backoffice">
              Open back office
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Vercel sites</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Full app catalog with live health, response checks, production URLs,
            and Vercel account sync when{" "}
            <code className="rounded bg-muted px-1 text-[11px]">VERCEL_ACCESS_TOKEN</code>{" "}
            is set. Auto-refreshes every 60 seconds.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 gap-1.5"
          disabled={refreshing}
          onClick={() => void refreshFromVercel()}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing…" : "Refresh from Vercel"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        {hub.vercelApiConnected ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Vercel API connected
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-4 w-4" />
            {hub.vercelApiError ?? "Showing catalog only — add VERCEL_ACCESS_TOKEN on Vercel."}
          </span>
        )}
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">
          {hub.sites.length} site{hub.sites.length === 1 ? "" : "s"}
        </span>
        <span className="text-muted-foreground">·</span>
        <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
          <Link href="/site-kit">Open Site kit</Link>
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Last health check {formatDateTime(hub.checkedAt)}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <HealthMetric
          icon={<Server className="h-4 w-4" />}
          label="Total apps"
          value={hub.totals.total}
          tone="neutral"
          detail={`${hub.totals.deployed} deployed`}
        />
        <HealthMetric
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Healthy"
          value={hub.totals.healthy}
          tone="healthy"
          detail="2xx/3xx response"
        />
        <HealthMetric
          icon={<AlertCircle className="h-4 w-4" />}
          label="Warnings"
          value={hub.totals.warning}
          tone="warning"
          detail="4xx response"
        />
        <HealthMetric
          icon={<Activity className="h-4 w-4" />}
          label="Offline"
          value={hub.totals.offline}
          tone="offline"
          detail="timeout or 5xx"
        />
        <HealthMetric
          icon={<Clock className="h-4 w-4" />}
          label="Auto refresh"
          value="60s"
          tone="neutral"
          detail={refreshing ? "refreshing now" : "continuous"}
        />
      </div>

      {refreshError ? (
        <p role="alert" className="text-sm text-destructive">
          {refreshError}
        </p>
      ) : null}

      {featured.length > 0 && categoryFilter === "all" && !q.trim() ? (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Star className="h-4 w-4 text-amber-500" />
            Featured
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search sites…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={categoryFilter === "all"}
            onClick={() => setCategoryFilter("all")}
          >
            All
          </FilterChip>
          {hub.categories.map((cat) => (
            <FilterChip
              key={cat.id}
              active={categoryFilter === cat.id}
              onClick={() => setCategoryFilter(cat.id)}
            >
              {cat.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No sites match your filters. Add entries in{" "}
            <code className="rounded bg-muted px-1 text-[11px]">catalog.ts</code> or
            connect Vercel.
          </CardContent>
        </Card>
      ) : (
        grouped.map(({ category, sites }) => (
          <section key={category.id} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">{category.label}</h2>
              {category.description ? (
                <p className="text-sm text-muted-foreground">{category.description}</p>
              ) : null}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map((site) => (
                <SiteCard key={site.id} site={site} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function HealthMetric({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  detail: string;
  tone: "healthy" | "warning" | "offline" | "neutral";
}) {
  const toneClass =
    tone === "healthy"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : tone === "warning"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : tone === "offline"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border/60 bg-card/50 text-foreground";

  return (
    <Card className={toneClass}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide opacity-80">
          {icon}
          {label}
        </div>
        <div className="mt-2 text-2xl font-semibold">{value}</div>
        <div className="mt-1 text-xs opacity-75">{detail}</div>
      </CardContent>
    </Card>
  );
}

function healthTone(status?: string) {
  if (status === "healthy") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }
  if (status === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }
  if (status === "offline") {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }
  return "border-border bg-muted text-muted-foreground";
}

function formatDateTime(value?: string | null) {
  if (!value) return "never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function SiteCard({
  site,
}: {
  site: VercelSitesHub["sites"][number];
}) {
  let host = site.url;
  try {
    host = new URL(site.url).hostname;
  } catch {
    /* keep raw */
  }

  return (
    <Card className="group border-border/60 bg-card/50 transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{site.name}</CardTitle>
          {site.featured ? (
            <Star className="h-4 w-4 shrink-0 fill-amber-400 text-amber-500" aria-hidden />
          ) : (
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          )}
        </div>
        <CardDescription className="line-clamp-2 text-xs">
          {site.description ?? host}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2 pt-0">
        {site.health ? (
          <Badge variant="outline" className={`text-[10px] font-normal ${healthTone(site.health.status)}`}>
            {site.health.status}
          </Badge>
        ) : null}
        {site.health?.responseMs !== null && site.health?.responseMs !== undefined ? (
          <Badge variant="outline" className="text-[10px] font-normal">
            {site.health.responseMs}ms
          </Badge>
        ) : null}
        {site.health?.statusCode ? (
          <Badge variant="outline" className="text-[10px] font-normal">
            HTTP {site.health.statusCode}
          </Badge>
        ) : null}
        {(site.tags ?? []).slice(0, 4).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
            {tag}
          </Badge>
        ))}
        {site.source === "vercel-api" ? (
          <Badge variant="outline" className="text-[10px] font-normal">
            auto
          </Badge>
        ) : null}
        <Button variant="default" size="sm" className="ml-auto gap-1 text-xs" asChild>
          <a href={site.url} target="_blank" rel="noopener noreferrer">
            Open
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
        <div className="basis-full text-[11px] text-muted-foreground">
          {site.vercelProjectName ? `Project: ${site.vercelProjectName}` : host}
          {site.nodeVersion ? ` · Node ${site.nodeVersion}` : ""}
          {site.updatedAt ? ` · Updated ${formatDateTime(site.updatedAt)}` : ""}
        </div>
      </CardContent>
    </Card>
  );
}
