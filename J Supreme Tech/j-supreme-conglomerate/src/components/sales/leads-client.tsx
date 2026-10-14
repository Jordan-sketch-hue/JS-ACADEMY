"use client";

import { useState, useTransition } from "react";
import { Database, Phone, RefreshCw, Play, Globe, CheckCircle, Clock, Ban, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LeadRow, LeadsStats } from "@/app/(app)/sales/leads/actions";
import { runScraper, launchCalls } from "@/app/(app)/sales/leads/actions";

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

function StatCard({ label, value, icon: Icon, className = "" }: { label: string; value: string | number; icon: any; className?: string }) {
  return (
    <Card className={`flex items-center gap-3 p-4 ${className}`}>
      <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
      </div>
    </Card>
  );
}

export function LeadsClient({ initialStats, initialLeads }: { initialStats: LeadsStats; initialLeads: LeadRow[] }) {
  const [stats, setStats] = useState(initialStats);
  const [leads, setLeads] = useState(initialLeads);
  const [notice, setNotice] = useState<{ type: "ok" | "error"; msg: string } | null>(null);
  const [scraping, startScrape] = useTransition();
  const [calling, startCall] = useTransition();

  function showNotice(type: "ok" | "error", msg: string) {
    setNotice({ type, msg });
    setTimeout(() => setNotice(null), 6000);
  }

  function handleScrape() {
    startScrape(async () => {
      const res = await runScraper();
      if (res.ok) showNotice("ok", res.message ?? "Scraper started — new leads will appear within ~2 minutes.");
      else showNotice("error", res.error ?? "Scraper failed to start.");
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

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total leads" value={stats.total ?? 0} icon={Database} />
        <StatCard label="New / ready" value={stats.new_count ?? 0} icon={Clock} className="border-sky-500/30" />
        <StatCard label="Called" value={stats.called_count ?? 0} icon={CheckCircle} className="border-emerald-500/30" />
        <StatCard label="DNC" value={stats.dnc_count ?? 0} icon={Ban} className="border-red-500/20" />
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
          {calling ? "Launching…" : `Launch 10 Calls`}
        </Button>
        {newCount > 10 && (
          <Button
            onClick={() => handleCalls(Math.min(newCount, 50))}
            disabled={calling}
            variant="outline"
            className="gap-2"
          >
            <Phone className="h-4 w-4" /> Launch {Math.min(newCount, 50)} Calls
          </Button>
        )}
        {notice && (
          <span className={`text-sm ${notice.type === "ok" ? "text-emerald-500" : "text-red-400"}`}>
            {notice.msg}
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Scraper pulls businesses without websites from OpenStreetMap (free, no API key). Twilio must be upgraded from trial to call real leads.
      </p>

      {/* Leads table */}
      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
          <Database className="h-10 w-10 opacity-30" />
          <p className="text-sm">No leads yet. Click Run Scraper to populate from OpenStreetMap.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-xs text-muted-foreground">Business</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs text-muted-foreground">Phone</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs text-muted-foreground">Category</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs text-muted-foreground">Product</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs text-muted-foreground">Site</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs text-muted-foreground">Added</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((lead) => {
                const s = STATUS_BADGE[lead.status] ?? { label: lead.status, class: "bg-muted" };
                return (
                  <tr key={lead.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-2.5 font-medium max-w-[200px] truncate">{lead.business_name ?? "—"}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{lead.phone ?? "—"}</td>
                    <td className="px-4 py-2.5 capitalize text-muted-foreground">{(lead.category ?? "").replace(/_/g, " ")}</td>
                    <td className="px-4 py-2.5 text-xs max-w-[180px] truncate">{lead.recommended_product ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      {lead.has_website
                        ? <Globe className="h-3.5 w-3.5 text-amber-500" title="Has website" />
                        : <Globe className="h-3.5 w-3.5 text-emerald-500 line-through opacity-50" title="No website — hot lead" />}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge className={`text-[10px] text-white ${s.class}`}>{s.label}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{fmtDate(lead.created_at)}</td>
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
