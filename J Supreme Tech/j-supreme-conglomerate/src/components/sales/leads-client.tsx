"use client";

import { useState, useTransition } from "react";
import {
  Database, Phone, RefreshCw, Play, Globe, CheckCircle, Clock, Ban,
  Loader2, TrendingUp, MapPin, Star, Share2, ChevronDown, ChevronUp,
  DollarSign, Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LeadRow, LeadsStats } from "@/app/(app)/sales/leads/actions";
import { runScraper, launchCalls } from "@/app/(app)/sales/leads/actions";

// ── Territory rollout map ──────────────────────────────────────────────────
const TERRITORY_PRIORITY: Record<string, { label: string; phase: number; color: string }> = {
  jamaica: { label: "Jamaica 🇯🇲", phase: 1, color: "text-emerald-500" },
  jm:      { label: "Jamaica 🇯🇲", phase: 1, color: "text-emerald-500" },
  florida: { label: "South Florida 🇺🇸", phase: 2, color: "text-sky-500" },
  miami:   { label: "South Florida 🇺🇸", phase: 2, color: "text-sky-500" },
  us:      { label: "USA 🇺🇸",           phase: 2, color: "text-sky-500" },
  usa:     { label: "USA 🇺🇸",           phase: 2, color: "text-sky-500" },
  barbados:{ label: "Barbados 🇧🇧",     phase: 3, color: "text-amber-500" },
  trinidad:{ label: "Trinidad 🇹🇹",     phase: 3, color: "text-amber-500" },
  cayman:  { label: "Cayman 🇰🇾",       phase: 3, color: "text-amber-500" },
  bahamas: { label: "Bahamas 🇧🇸",      phase: 3, color: "text-amber-500" },
  canada:  { label: "Canada 🇨🇦",       phase: 4, color: "text-blue-400" },
  uk:      { label: "UK 🇬🇧",           phase: 4, color: "text-blue-400" },
};

// ── Tier extraction — notes field first (scraper writes TIER:1/2/3), fallback to product ──
function parseTier(product: string | null, notes?: string | null): 1 | 2 | 3 {
  const noteMatch = (notes ?? "").match(/TIER:([123])/);
  if (noteMatch) return parseInt(noteMatch[1]) as 1 | 2 | 3;
  if (!product) return 1;
  if (/US\$/.test(product)) {
    // US$ pricing: infer tier from amount
    const m = product.match(/US\$(\d+)/);
    if (m) {
      const v = parseInt(m[1]);
      if (v >= 500) return 3;
      if (v >= 400) return 2;
    }
    return 1;
  }
  const match = product.match(/J\$(\d[\d,]+)/);
  if (match) {
    const val = parseInt(match[1].replace(/,/g, ""));
    if (val >= 45000) return 2;
  }
  return 1;
}

const TIER_CONFIG = {
  1: { label: "T1", desc: "Basic site",         class: "bg-muted text-muted-foreground border",            ring: "border-l-muted-foreground/20" },
  2: { label: "T2", desc: "Site + CRM",          class: "bg-amber-500/15 text-amber-400 border-amber-500/30", ring: "border-l-amber-500/40" },
  3: { label: "T3", desc: "AI / SaaS",           class: "bg-violet-500/15 text-violet-400 border-violet-500/30", ring: "border-l-violet-500/40" },
} as const;

// Upsell path per tier
const UPSELL: Record<1 | 2 | 3, string> = {
  1: "Upsell to T2: add CRM + AI booking — 2× revenue",
  2: "Upsell to T3: AI Caller subscription — recurring US$ MRR",
  3: "Expand: multi-location, AI sales fleet",
};

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  new:    { label: "New",    class: "bg-sky-600" },
  called: { label: "Called", class: "bg-emerald-600" },
  dnc:    { label: "DNC",    class: "bg-red-600" },
};

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "2-digit" }); }
  catch { return iso; }
}

function StatCard({ label, value, icon: Icon, className = "", sub }: {
  label: string; value: string | number; icon: any; className?: string; sub?: string;
}) {
  return (
    <Card className={`flex items-center gap-3 p-4 ${className}`}>
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        {sub && <p className="mt-0.5 text-[10px] text-muted-foreground/60">{sub}</p>}
      </div>
    </Card>
  );
}

// ── Territory breakdown sidebar ────────────────────────────────────────────
const TERRITORY_ROLLOUT = [
  { phase: 1, label: "Jamaica",       areas: "Kingston · Montego Bay · Portmore · Ocho Rios",              status: "active" },
  { phase: 2, label: "South Florida", areas: "Miami · Fort Lauderdale · Boca Raton · Orlando",            status: "next" },
  { phase: 3, label: "Caribbean",     areas: "Barbados · Trinidad · Bahamas · Cayman · Guyana",           status: "planned" },
  { phase: 4, label: "Canada / UK",   areas: "Toronto · London · Birmingham · Manchester",                status: "later" },
];

const PHASE_COLORS: Record<string, string> = {
  active:  "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
  next:    "text-sky-400 border-sky-500/30 bg-sky-500/10",
  planned: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  later:   "text-muted-foreground border-border bg-muted/30",
};

export function LeadsClient({ initialStats, initialLeads }: {
  initialStats: LeadsStats;
  initialLeads: LeadRow[];
}) {
  const [stats, setStats] = useState(initialStats);
  const [leads, setLeads] = useState(initialLeads);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const [scraping, startScrape] = useTransition();
  const [calling, startCall] = useTransition();
  const [showTerritory, setShowTerritory] = useState(false);
  const [filterTier, setFilterTier] = useState<0 | 1 | 2 | 3>(0);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  function showNotice(type: "ok" | "error", msg: string) {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 6000);
  }

  function handleScrape() {
    startScrape(async () => {
      const res = await runScraper();
      if (res.ok) showNotice("ok", res.message ?? "Scraper started — leads populate in ~2 min.");
      else showNotice("error", res.error ?? "Scraper failed.");
    });
  }

  function handleCalls(limit: number) {
    startCall(async () => {
      const res = await launchCalls(limit);
      if (res.ok) showNotice("ok", `Queued ${res.queued ?? 0} calls.`);
      else showNotice("error", res.error ?? "Failed to launch calls.");
    });
  }

  const newCount = parseInt(stats.new_count ?? "0");

  const filtered = leads.filter(l => {
    const tierMatch = filterTier === 0 || parseTier(l.recommended_product, l.notes) === filterTier;
    const statusMatch = filterStatus === "all" || l.status === filterStatus;
    return tierMatch && statusMatch;
  });

  const t1Count = leads.filter(l => parseTier(l.recommended_product, l.notes) === 1).length;
  const t2Count = leads.filter(l => parseTier(l.recommended_product, l.notes) === 2).length;
  const t3Count = leads.filter(l => parseTier(l.recommended_product, l.notes) === 3).length;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatCard label="Total leads"   value={stats.total ?? 0}       icon={Database} />
        <StatCard label="New / ready"   value={stats.new_count ?? 0}   icon={Clock}    className="border-sky-500/30" />
        <StatCard label="Called"        value={stats.called_count ?? 0} icon={CheckCircle} className="border-emerald-500/30" />
        <StatCard label="DNC"           value={stats.dnc_count ?? 0}   icon={Ban}      className="border-red-500/20" />
        <StatCard
          label="Pipeline value"
          value={stats.revenue_potential ?? "—"}
          icon={TrendingUp}
          className="border-violet-500/30"
          sub="new leads only"
        />
      </div>

      {/* Tier breakdown chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-muted-foreground">Tier:</span>
        {([0, 1, 2, 3] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilterTier(t)}
            className={`rounded-full border px-3 py-0.5 transition-colors ${
              filterTier === t ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === 0 ? "All" : `T${t} (${t === 1 ? t1Count : t === 2 ? t2Count : t3Count})`}
          </button>
        ))}
        <span className="ml-3 text-muted-foreground">Status:</span>
        {["all", "new", "called", "dnc"].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-full border px-3 py-0.5 capitalize transition-colors ${
              filterStatus === s ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleScrape} disabled={scraping} className="gap-2">
          {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {scraping ? "Scraping…" : "Run Scraper"}
        </Button>
        <Button
          onClick={() => handleCalls(10)}
          disabled={calling || newCount === 0}
          variant="outline"
          className="gap-2"
        >
          {calling ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {calling ? "Launching…" : "Launch 10 Calls"}
        </Button>
        {newCount > 10 && (
          <Button onClick={() => handleCalls(Math.min(newCount, 50))} disabled={calling} variant="outline" className="gap-2">
            <Phone className="h-4 w-4" /> Launch {Math.min(newCount, 50)} Calls
          </Button>
        )}
        {notice && (
          <span className={`text-sm ${notice.type === "ok" ? "text-emerald-500" : "text-red-400"}`}>
            {notice.msg}
          </span>
        )}
      </div>

      {/* Territory rollout panel */}
      <div className="rounded-lg border bg-card">
        <button
          onClick={() => setShowTerritory(!showTerritory)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/40 transition-colors"
        >
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> Territory Rollout Plan</span>
          {showTerritory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showTerritory && (
          <div className="border-t px-4 py-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TERRITORY_ROLLOUT.map(t => (
              <div key={t.phase} className={`rounded-md border p-3 ${PHASE_COLORS[t.status]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Phase {t.phase}</span>
                  <span className={`text-[10px] rounded-full border px-1.5 py-0 ${PHASE_COLORS[t.status]}`}>{t.status}</span>
                </div>
                <p className="font-semibold text-sm">{t.label}</p>
                <p className="text-[11px] opacity-70 mt-0.5 leading-relaxed">{t.areas}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tier guide */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {([1, 2, 3] as const).map(t => {
          const cfg = TIER_CONFIG[t];
          return (
            <div key={t} className={`rounded-md border p-2.5 ${cfg.class}`}>
              <p className="font-bold">{cfg.label} — {cfg.desc}</p>
              <p className="mt-0.5 opacity-70 text-[10px] leading-relaxed">{UPSELL[t]}</p>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Leads sourced from findyello.com — Jamaican business directory. Calls are sequential, ~1 every 30s.
      </p>

      {/* Leads table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
          <Database className="h-10 w-10 opacity-30" />
          <p className="text-sm">No leads match this filter. Run the scraper or adjust filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground w-5">T</th>
                <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Business</th>
                <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Phone</th>
                <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Product + Price</th>
                <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Signals</th>
                <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Market</th>
                <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((lead) => {
                const s = STATUS_BADGE[lead.status] ?? { label: lead.status, class: "bg-muted" };
                const tier = parseTier(lead.recommended_product, lead.notes);
                const tierCfg = TIER_CONFIG[tier];
                const marketKey = (lead.market ?? "").toLowerCase().replace(/\s/g, "_");
                const territory = TERRITORY_PRIORITY[marketKey] ?? TERRITORY_PRIORITY[(lead.currency ?? "jmd") === "jmd" ? "jamaica" : "us"];
                return (
                  <tr key={lead.id} className={`hover:bg-muted/20 transition-colors border-l-2 ${tierCfg.ring}`}>
                    {/* Tier */}
                    <td className="px-3 py-2.5">
                      <Badge className={`text-[9px] px-1 py-0 ${tierCfg.class}`}>{tierCfg.label}</Badge>
                    </td>
                    {/* Business */}
                    <td className="px-3 py-2.5 font-medium max-w-[180px]">
                      <span className="block truncate">{lead.business_name ?? "—"}</span>
                      {lead.address && <span className="block text-[10px] text-muted-foreground truncate max-w-[160px]">{lead.address}</span>}
                    </td>
                    {/* Phone */}
                    <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{lead.phone ?? "—"}</td>
                    {/* Product + price */}
                    <td className="px-3 py-2.5 max-w-[200px]">
                      <span className="block text-xs truncate">{lead.recommended_product ?? "—"}</span>
                      {tier < 3 && (
                        <span className="text-[10px] text-violet-400 opacity-70 flex items-center gap-0.5 mt-0.5">
                          <Zap className="h-2.5 w-2.5" />{UPSELL[tier].split(":")[0]}
                        </span>
                      )}
                    </td>
                    {/* Signals */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Globe className={`h-3.5 w-3.5 ${lead.has_website ? "text-amber-500" : "text-emerald-500"}`} title={lead.has_website ? "Has website" : "No website"} />
                        {lead.has_social && <Share2 className="h-3.5 w-3.5 text-sky-400" title="Has social" />}
                        {lead.google_rating && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-400">
                            <Star className="h-2.5 w-2.5 fill-amber-400" />{lead.google_rating}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Market */}
                    <td className="px-3 py-2.5">
                      {territory ? (
                        <span className={`text-[10px] font-medium ${territory.color}`}>
                          Ph{territory.phase} {territory.label}
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">{lead.market ?? "—"}</span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-3 py-2.5">
                      <Badge className={`text-[10px] text-white ${s.class}`}>{s.label}</Badge>
                    </td>
                    {/* Added */}
                    <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(lead.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
