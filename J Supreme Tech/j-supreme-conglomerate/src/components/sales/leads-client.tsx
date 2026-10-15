"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Phone, RefreshCw, Play, CheckCircle, Ban,
  Loader2, TrendingUp, Flame, MessageSquare,
  ChevronDown, ChevronUp, Database, Zap, Clock,
  PhoneCall, PhoneOff, CalendarCheck, Filter, X,
  ClipboardList, AlertCircle, CheckCheck, VoicemailIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LeadRow, LeadsStats, FollowUpRow, CallFilters, CallLogRow } from "@/app/(app)/sales/leads/actions";
import { runScraper, launchCalls, fetchFilteredCount } from "@/app/(app)/sales/leads/actions";

// ── Tier config ────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  starter: { label: "Starter",  color: "text-sky-400",    bg: "bg-sky-500/10 border-sky-500/30",    icon: "🌱" },
  plus:    { label: "Plus",     color: "text-amber-400",  bg: "bg-amber-500/10 border-amber-500/30", icon: "⚡" },
  elite:   { label: "Elite",    color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/30", icon: "🔮" },
} as const;

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
  catch { return iso; }
}

function StatCard({ label, value, icon: Icon, sub, className = "" }: {
  label: string; value: string | number; icon: any; sub?: string; className?: string;
}) {
  const str = String(value);
  const parts = str.includes(" + ") ? str.split(" + ") : null;
  const fontSize = parts ? "text-sm" : str.length > 10 ? "text-lg" : "text-2xl";
  return (
    <Card className={`flex items-center gap-3 p-4 ${className}`}>
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        {parts ? (
          <div className="font-bold leading-tight text-sm">
            {parts.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        ) : (
          <p className={`${fontSize} font-bold leading-none`}>{value}</p>
        )}
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
        {sub && <p className="mt-0.5 text-[10px] text-muted-foreground/60">{sub}</p>}
      </div>
    </Card>
  );
}

// ── Service tag pills ──────────────────────────────────────────────────────
function ServiceTags({ services }: { services: string[] | null }) {
  if (!services?.length) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <div className="flex flex-wrap gap-0.5">
      {services.slice(0, 4).map(s => (
        <span key={s} className="text-[9px] bg-muted border rounded px-1.5 py-0.5 text-muted-foreground capitalize">{s}</span>
      ))}
      {services.length > 4 && <span className="text-[9px] text-muted-foreground">+{services.length - 4}</span>}
    </div>
  );
}

// ── Market options — values match sales_leads.market column exactly ──────────
// Jamaica local leads have market=NULL → use special value "NULL" to signal IS NULL filter
const MARKET_OPTIONS = [
  { value: "",                  label: "All Markets" },
  { value: "NULL",              label: "Jamaica (local)" },
  { value: "US_MIAMI",         label: "Miami, FL" },
  { value: "US_MIAMI_BEACH",   label: "Miami Beach, FL" },
  { value: "US_ATLANTA",       label: "Atlanta, GA" },
  { value: "US_HOUSTON",       label: "Houston, TX" },
  { value: "US_NYC_BROOKLYN",  label: "NYC – Brooklyn" },
  { value: "US_NYC_BRONX",     label: "NYC – Bronx" },
  { value: "US_NYC_QUEENS",    label: "NYC – Queens" },
  { value: "US_LOS_ANGELES",   label: "Los Angeles, CA" },
  { value: "US_FORT_LAUDERDALE", label: "Fort Lauderdale, FL" },
  { value: "US_CHICAGO",       label: "Chicago, IL" },
  { value: "US_WASHINGTON_DC", label: "Washington, DC" },
  { value: "TT_PORT_OF_SPAIN", label: "Trinidad – Port of Spain" },
  { value: "UK_LONDON",        label: "London, UK" },
  { value: "UK_BIRMINGHAM",    label: "Birmingham, UK" },
  { value: "CA_TORONTO",       label: "Toronto, Canada" },
  { value: "GY_GEORGETOWN",    label: "Georgetown, Guyana" },
  { value: "SR_PARAMARIBO",    label: "Paramaribo, Suriname" },
  { value: "DM_ROSEAU",        label: "Roseau, Dominica" },
  { value: "VC_KINGSTOWN",     label: "Kingstown, St. Vincent" },
  { value: "AG_ST_JOHN",       label: "St. John's, Antigua" },
  { value: "BB_BRIDGETOWN",    label: "Bridgetown, Barbados" },
  { value: "BS_NASSAU",        label: "Nassau, Bahamas" },
  { value: "GD_ST_GEORGE",     label: "St. George's, Grenada" },
  { value: "JA",               label: "Jamaica (intl-coded)" },
  { value: "KN_BASSETERRE",    label: "Basseterre, St. Kitts" },
  { value: "LC_CASTRIES",      label: "Castries, St. Lucia" },
];

const CATEGORY_OPTIONS = [
  { value: "",                    label: "All Categories" },
  { value: "hair_salon",          label: "Hair Salon" },
  { value: "nail_salon",          label: "Nail Salon" },
  { value: "barbershop",          label: "Barbershop" },
  { value: "restaurant",          label: "Restaurant" },
  { value: "dentist",             label: "Dental" },
  { value: "real_estate_firm",    label: "Real Estate" },
  { value: "lawyer",              label: "Law Firm" },
  { value: "auto_repair",         label: "Auto Repair" },
  { value: "spa",                 label: "Spa / Wellness" },
  { value: "digital_agency",      label: "Digital Agency" },
  { value: "web_design",          label: "Web Design" },
  { value: "it_consultant",       label: "IT Consultant" },
  { value: "accountant",          label: "Accountant" },
  { value: "insurance_agent",     label: "Insurance Agent" },
  { value: "pharmacy",            label: "Pharmacy" },
  { value: "bakery",              label: "Bakery" },
  { value: "clothing_boutique",   label: "Clothing Boutique" },
  { value: "catering",            label: "Catering" },
  { value: "staffing",            label: "Staffing" },
  { value: "retail",              label: "Retail" },
  { value: "professional_services", label: "Professional Services" },
];

export function LeadsClient({ initialStats, initialLeads, initialFollowUps = [], initialCallLogs = [] }: {
  initialStats: LeadsStats;
  initialLeads: LeadRow[];
  initialFollowUps?: FollowUpRow[];
  initialCallLogs?: CallLogRow[];
}) {
  const [stats] = useState(initialStats);
  const [leads] = useState(initialLeads);
  const [followUps] = useState(initialFollowUps);
  const [callLogs] = useState(initialCallLogs);
  const [activeTab, setActiveTab] = useState<"dashboard" | "call-log">("dashboard");
  const [notice, setNotice] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const [scraping, startScrape] = useTransition();
  const [calling, startCall] = useTransition();
  const [showLeadsQueue, setShowLeadsQueue] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // ── Filter state ────────────────────────────────────────────────────────
  const [filterMarket,   setFilterMarket]   = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTier,     setFilterTier]     = useState<"" | "1" | "2" | "3">("");
  const [filteredCount,  setFilteredCount]  = useState<number | null>(null);
  const [countLoading,   setCountLoading]   = useState(false);

  const hasFilters = !!(filterMarket || filterCategory || filterTier);

  // Fetch filtered count whenever filters change
  useEffect(() => {
    if (!hasFilters) { setFilteredCount(null); return; }
    setCountLoading(true);
    const filters: CallFilters = {};
    if (filterMarket)   filters.market   = filterMarket;
    if (filterCategory) filters.category = filterCategory;
    if (filterTier)     filters.tier     = parseInt(filterTier) as 1 | 2 | 3;
    fetchFilteredCount(filters)
      .then(n => setFilteredCount(n))
      .finally(() => setCountLoading(false));
  }, [filterMarket, filterCategory, filterTier, hasFilters]);

  function clearFilters() {
    setFilterMarket(""); setFilterCategory(""); setFilterTier("");
    setFilteredCount(null);
  }

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
      const filters: CallFilters = {};
      if (filterMarket)   filters.market   = filterMarket;
      if (filterCategory) filters.category = filterCategory;
      if (filterTier)     filters.tier     = parseInt(filterTier) as 1 | 2 | 3;
      const res = await launchCalls(limit, filters);
      if (res.ok) showNotice("ok", `Queued ${res.queued ?? 0} calls — Alex is dialing.`);
      else showNotice("error", res.error ?? "Failed to launch calls.");
    });
  }

  // ── Derived bot stats ──────────────────────────────────────────────────
  const hotLeads    = followUps.filter(f => f.interest_level === "hot");
  const warmLeads   = followUps.filter(f => f.interest_level === "warm");
  const bookedCount = followUps.filter(f => f.booked_followup).length;
  const mockupCount = followUps.filter(f => f.mockup_requested).length;
  const newCount    = parseInt(stats.new_count ?? "0");

  const byTier = {
    starter: followUps.filter(f => f.interested_tier === "starter"),
    plus:    followUps.filter(f => f.interested_tier === "plus"),
    elite:   followUps.filter(f => f.interested_tier === "elite"),
  };

  const hotAndWarm = [...hotLeads, ...warmLeads];

  // ── Call log derived stats ─────────────────────────────────────────────
  const needsFollowUp = callLogs.filter(l => l.booked_followup || l.interest_level === "hot" || l.interest_level === "warm");
  const rejected      = callLogs.filter(l => l.outcome === "no_answer" || l.outcome === "busy");
  const answered      = callLogs.filter(l => l.outcome === "answered");

  function outcomeColor(outcome: string) {
    if (outcome === "answered") return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    if (outcome === "no_answer") return "bg-slate-500/15 text-slate-400 border-slate-500/30";
    if (outcome === "busy")      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    return "bg-red-500/15 text-red-400 border-red-500/30";
  }
  function outcomeLabel(outcome: string) {
    if (outcome === "answered")  return "Answered";
    if (outcome === "no_answer") return "No Answer";
    if (outcome === "busy")      return "Busy";
    if (outcome === "failed")    return "Failed";
    return outcome;
  }

  return (
    <div className="space-y-6">

      {/* ── Tab nav ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "dashboard"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("call-log")}
          className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
            activeTab === "call-log"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Call Log
          {callLogs.length > 0 && (
            <Badge className="bg-muted border text-muted-foreground text-[9px] ml-0.5">{callLogs.length}</Badge>
          )}
          {needsFollowUp.length > 0 && (
            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[9px]">
              {needsFollowUp.length} follow-up
            </Badge>
          )}
        </button>
      </div>

      {activeTab === "call-log" && (
        <div className="space-y-4">
          {/* ── Call log summary cards ──────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total calls"   value={callLogs.length}      icon={PhoneCall}     />
            <StatCard label="Answered"      value={answered.length}      icon={CheckCheck}    className="border-emerald-500/30" />
            <StatCard label="No answer / busy" value={rejected.length}   icon={VoicemailIcon} />
            <StatCard label="Need follow-up" value={needsFollowUp.length} icon={AlertCircle}  className="border-amber-500/30" />
          </div>

          {/* ── Follow-up priority list ──────────────────────────────────── */}
          {needsFollowUp.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Needs Follow-Up ({needsFollowUp.length})
              </h2>
              <div className="overflow-x-auto rounded-lg border border-amber-500/30">
                <table className="w-full text-sm">
                  <thead className="border-b bg-amber-500/5">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Business</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Phone</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Heat</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Tier</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Stage</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Contact</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Next Step</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Called</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {needsFollowUp.map((log, i) => {
                      const isHot = log.interest_level === "hot";
                      const tierCfg = log.interested_tier ? TIER_CONFIG[log.interested_tier as keyof typeof TIER_CONFIG] : null;
                      return (
                        <tr key={i} className={`hover:bg-muted/20 border-l-2 ${isHot ? "border-l-orange-500/60" : "border-l-amber-400/50"}`}>
                          <td className="px-3 py-2.5 font-medium max-w-[160px]">
                            <span className="block truncate">{log.company_name ?? log.lead_name ?? "—"}</span>
                            {log.industry && <span className="block text-[10px] text-muted-foreground">{log.industry}</span>}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{log.to_number}</td>
                          <td className="px-3 py-2.5">
                            <div className="flex flex-col gap-0.5">
                              {log.interest_level && (
                                <Badge className={`text-[10px] border w-fit ${isHot ? "text-orange-400 bg-orange-500/10 border-orange-500/30" : "text-amber-400 bg-amber-500/10 border-amber-500/30"}`}>
                                  {isHot ? "🔥 Hot" : "♨ Warm"}
                                </Badge>
                              )}
                              {log.booked_followup && <span className="text-[9px] text-emerald-400">✓ booked</span>}
                              {log.mockup_requested && <span className="text-[9px] text-sky-400">✦ mockup</span>}
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-xs">
                            {tierCfg ? <span className={`font-medium ${tierCfg.color}`}>{tierCfg.icon} {tierCfg.label}</span> : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground">{log.stage_reached ?? "—"}</td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground">
                            {log.contact_method ? `${log.contact_method}: ${log.contact_detail ?? "—"}` : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[200px]">
                            <span className="block truncate font-medium text-foreground">{log.next_action ?? "Follow up within 24h"}</span>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(log.created_at)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Full call log ────────────────────────────────────────────── */}
          <div>
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-widest">All Calls</h2>
            {callLogs.length === 0 ? (
              <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground border-dashed">
                <PhoneOff className="h-10 w-10 opacity-20" />
                <p className="text-sm font-medium">No calls logged yet</p>
                <p className="text-xs opacity-70">Launch calls from the Dashboard tab — logs appear here after each call.</p>
              </Card>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Outcome</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Business</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Phone</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Duration</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Stage</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Next Step</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Product</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {callLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="flex flex-col gap-0.5">
                            <Badge className={`text-[10px] border w-fit ${outcomeColor(log.outcome)}`}>
                              {outcomeLabel(log.outcome)}
                            </Badge>
                            {log.interest_level === "hot"  && <span className="text-[9px] text-orange-400">🔥 hot</span>}
                            {log.interest_level === "warm" && <span className="text-[9px] text-amber-400">♨ warm</span>}
                            {log.booked_followup && <span className="text-[9px] text-emerald-400">✓ booked</span>}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-medium max-w-[160px]">
                          <span className="block truncate">{log.company_name ?? log.lead_name ?? "—"}</span>
                          {log.industry && <span className="block text-[10px] text-muted-foreground">{log.industry}</span>}
                        </td>
                        <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{log.to_number}</td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                          {log.duration_seconds > 0 ? `${log.duration_seconds}s` : "—"}
                        </td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground">{log.stage_reached ?? "—"}</td>
                        <td className="px-3 py-2.5 text-xs max-w-[200px]">
                          <span className="block truncate text-muted-foreground">{log.next_action ?? "—"}</span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[180px]">
                          <span className="block truncate">{log.recommended_product ?? "—"}</span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "dashboard" && (
        <>
      <div className="rounded-lg border bg-card">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm hover:bg-muted/40 transition-colors"
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            Call Filters
            {hasFilters && (
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                Active
              </Badge>
            )}
            {hasFilters && filteredCount !== null && (
              <span className="text-[11px] text-muted-foreground">
                {countLoading ? "…" : `${filteredCount} matched`}
              </span>
            )}
          </span>
          {showFilters ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showFilters && (
          <div className="border-t px-4 py-3 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Market / Country */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Market / Country</label>
                <select
                  value={filterMarket}
                  onChange={e => setFilterMarket(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {MARKET_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Category / Pain Point */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category / Pain Point</label>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {CATEGORY_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Tier */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tier</label>
                <select
                  value={filterTier}
                  onChange={e => setFilterTier(e.target.value as "" | "1" | "2" | "3")}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">All Tiers</option>
                  <option value="1">Tier 1 — Priority</option>
                  <option value="2">Tier 2 — Standard</option>
                  <option value="3">Tier 3 — Low</option>
                </select>
              </div>
            </div>

            {hasFilters && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" /> Clear filters
                </button>
                {filteredCount !== null && (
                  <span className="text-xs text-muted-foreground">
                    — bot will call <span className="font-semibold text-foreground">{filteredCount}</span> matched leads
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Action controls ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => handleCalls(10)}
          disabled={calling || (hasFilters ? filteredCount === 0 : newCount === 0)}
          className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white"
        >
          {calling ? <Loader2 className="h-4 w-4 animate-spin" /> : <PhoneCall className="h-4 w-4" />}
          {calling ? "Alex is dialing…" : `Launch 10 Calls${hasFilters ? " (filtered)" : ""}`}
        </Button>
        {(hasFilters ? (filteredCount ?? 0) : newCount) > 10 && (
          <Button
            onClick={() => handleCalls(Math.min(hasFilters ? (filteredCount ?? 50) : newCount, 50))}
            disabled={calling}
            variant="outline"
            className="gap-2"
          >
            <Zap className="h-4 w-4" /> Launch {Math.min(hasFilters ? (filteredCount ?? 50) : newCount, 50)}{hasFilters ? " (filtered)" : ""}
          </Button>
        )}
        <Button onClick={handleScrape} disabled={scraping} variant="outline" className="gap-2">
          {scraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {scraping ? "Scraping…" : "Run Scraper"}
        </Button>
        {notice && (
          <span className={`text-sm font-medium ${notice.type === "ok" ? "text-emerald-500" : "text-red-400"}`}>
            {notice.msg}
          </span>
        )}
      </div>

      {/* ── Performance stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Calls made"      value={stats.called_count ?? 0} icon={PhoneCall}    className="border-sky-500/30" />
        <StatCard label="In queue"        value={stats.new_count ?? 0}    icon={Clock}        />
        <StatCard label="Booked call-back" value={bookedCount}            icon={CalendarCheck} className="border-emerald-500/30" sub="requested follow-up" />
        <StatCard label="Mockup requests" value={mockupCount}             icon={MessageSquare} className="border-amber-500/30" />
        <StatCard label="Hot leads"       value={hotLeads.length}         icon={Flame}        className="border-orange-500/30" />
        <StatCard label="Pipeline value"  value={stats.revenue_potential ?? "—"} icon={TrendingUp} className="border-violet-500/30" sub="new leads only" />
      </div>

      {/* ── Tier pipeline ─────────────────────────────────────────────────── */}
      {(byTier.starter.length + byTier.plus.length + byTier.elite.length) > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-widest">Tier Pipeline</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(["starter", "plus", "elite"] as const).map(tier => {
              const cfg = TIER_CONFIG[tier];
              const items = byTier[tier];
              if (items.length === 0) return null;
              return (
                <Card key={tier} className={`p-4 border ${cfg.bg}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{cfg.icon}</span>
                    <span className={`font-bold text-sm ${cfg.color}`}>{cfg.label}</span>
                    <span className={`ml-auto text-2xl font-bold ${cfg.color}`}>{items.length}</span>
                  </div>
                  <div className="space-y-1">
                    {items.slice(0, 3).map((f, i) => (
                      <div key={i} className="text-[11px] text-muted-foreground truncate">
                        {f.business_name ?? f.phone}
                        {f.booked_followup && <span className="ml-1 text-emerald-400">✓ booked</span>}
                      </div>
                    ))}
                    {items.length > 3 && <div className="text-[10px] text-muted-foreground">+{items.length - 3} more</div>}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Follow-up queue ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Follow-up Queue</h2>
          {bookedCount > 0 && (
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
              {bookedCount} booked
            </Badge>
          )}
        </div>

        {hotAndWarm.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground border-dashed">
            <PhoneOff className="h-10 w-10 opacity-20" />
            <div>
              <p className="text-sm font-medium">No follow-ups yet</p>
              <p className="text-xs mt-1 opacity-70">After Alex completes calls, warm/hot leads appear here with tier, services, and next actions.</p>
            </div>
          </Card>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Heat</th>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Business</th>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Phone</th>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Tier</th>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Services</th>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Stage</th>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Contact</th>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Next</th>
                  <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {hotAndWarm.map((fu, i) => {
                  const isHot = fu.interest_level === "hot";
                  const tierCfg = fu.interested_tier ? TIER_CONFIG[fu.interested_tier] : null;
                  return (
                    <tr key={i} className={`hover:bg-muted/20 transition-colors border-l-2 ${isHot ? "border-l-orange-500/60" : "border-l-amber-500/40"}`}>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col gap-0.5">
                          <Badge className={`text-[10px] border w-fit ${isHot ? "text-orange-400 bg-orange-500/10 border-orange-500/30" : "text-amber-400 bg-amber-500/10 border-amber-500/30"}`}>
                            {isHot ? "🔥 Hot" : "♨ Warm"}
                          </Badge>
                          {fu.booked_followup && <span className="text-[9px] text-emerald-400">✓ booked</span>}
                          {fu.mockup_requested && <span className="text-[9px] text-sky-400">✦ mockup</span>}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-medium max-w-[160px]">
                        <span className="block truncate">{fu.business_name ?? "Unknown"}</span>
                        {fu.industry && <span className="block text-[10px] text-muted-foreground">{fu.industry}</span>}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground whitespace-nowrap">{fu.phone}</td>
                      <td className="px-3 py-2.5">
                        {tierCfg ? (
                          <span className={`text-xs font-medium ${tierCfg.color}`}>
                            {tierCfg.icon} {tierCfg.label}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2.5 max-w-[140px]">
                        <ServiceTags services={fu.interested_services} />
                      </td>
                      <td className="px-3 py-2.5 text-xs">
                        {fu.stage_reached ? (
                          <span className="text-muted-foreground">{fu.stage_reached}</span>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-xs">
                        {fu.contact_method ? (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="h-3 w-3 shrink-0" />
                            {fu.contact_method}: {fu.contact_detail ?? "—"}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[180px]">
                        <span className="block truncate">{fu.next_action ?? "Follow up within 24h"}</span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(fu.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Cold call queue (collapsed) ───────────────────────────────────── */}
      <div className="rounded-lg border bg-card">
        <button
          onClick={() => setShowLeadsQueue(!showLeadsQueue)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm hover:bg-muted/40 transition-colors"
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <Database className="h-4 w-4" />
            Cold Call Queue
            <Badge className="bg-muted border text-muted-foreground text-[10px]">{stats.new_count ?? 0} ready</Badge>
            <Badge className="bg-muted border text-muted-foreground text-[10px]">{stats.total ?? 0} total</Badge>
          </span>
          {showLeadsQueue ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showLeadsQueue && (
          <div className="border-t">
            {leads.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                No leads in queue. Run the scraper to populate.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Business</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Phone</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Product</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Status</th>
                      <th className="px-3 py-2.5 text-left font-medium text-xs text-muted-foreground">Added</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {leads.slice(0, 100).map(lead => (
                      <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-3 py-2 font-medium max-w-[200px]">
                          <span className="block truncate">{lead.business_name ?? "—"}</span>
                        </td>
                        <td className="px-3 py-2 font-mono text-xs text-muted-foreground whitespace-nowrap">{lead.phone ?? "—"}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground max-w-[200px]">
                          <span className="block truncate">{lead.recommended_product ?? "—"}</span>
                        </td>
                        <td className="px-3 py-2">
                          <Badge className={`text-[10px] text-white ${
                            lead.status === "called" ? "bg-emerald-600" :
                            lead.status === "dnc"    ? "bg-red-600" : "bg-sky-600"
                          }`}>{lead.status}</Badge>
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">{fmtDate(lead.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {leads.length > 100 && (
                  <p className="px-4 py-2 text-xs text-muted-foreground border-t">Showing 100 of {leads.length} leads</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      </>)}
    </div>
  );
}
