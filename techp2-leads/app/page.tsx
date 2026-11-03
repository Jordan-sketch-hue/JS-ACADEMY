"use client";
import { useEffect, useState, useCallback } from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { PullIndicator } from "@/components/PullIndicator";
import { supabase, Lead, FollowUp } from "@/lib/supabase";
import Link from "next/link";
import {
  Users, Bell, TrendingUp, MapPin, Phone, Plus,
  Calendar, CheckCircle, AlertCircle, Wheat, Hammer, Sun, Moon
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const PARISHES = ["St. Ann", "Portland", "St. Mary", "St. Thomas"];

export default function Dashboard() {
  const { theme, toggle } = useTheme();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [l, f] = await Promise.all([
      supabase.from("tp2_leads").select("*").order("created_at", { ascending: false }),
      supabase
        .from("tp2_follow_ups")
        .select("*, tp2_leads(business_name,phone,parish)")
        .eq("completed", false)
        .lte("due_date", new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0])
        .order("due_date"),
    ]);
    if (l.data) setLeads(l.data);
    if (f.data) setFollowUps(f.data as any);
    setLoading(false);
  }, []);

  const { refreshing, pullDelta, threshold } = usePullToRefresh(load);

  useEffect(() => {
    load();
    const ch = supabase.channel("realtime-dashboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "tp2_leads" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "tp2_follow_ups" }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const stats = {
    total: leads.length,
    converted: leads.filter(l => l.is_converted).length,
    followUp: leads.filter(l => l.follow_up_required).length,
    agri: leads.filter(l => l.category === "Agriculture" || l.category === "Both").length,
    hardware: leads.filter(l => l.category === "Hardware" || l.category === "Both").length,
    byParish: PARISHES.map(p => ({ parish: p, count: leads.filter(l => l.parish === p).length })),
    byStatus: ["New","Contacted","Interested","Converted","Cold"].map(s => ({
      status: s, count: leads.filter(l => l.status === s).length
    })),
  };

  const today = new Date().toISOString().split("T")[0];
  const overdueCount = followUps.filter(f => f.due_date < today).length;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-[#C9930C] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[#888] text-sm">Loading CRM...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--surface, #0a0a0a)", color: "var(--text, #f0f0f0)" }}>
      <PullIndicator delta={pullDelta} threshold={threshold} refreshing={refreshing} />
      {/* Header */}
      <header className="border-b safe-top sticky top-0 z-40" style={{ background: "var(--surface-2, #111)", borderColor: "var(--border, #2a2a2a)" }}>
        <div className="px-4 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <p className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase">Agri-H Leads</p>
            <h1 className="font-bold text-lg leading-none" style={{ color: "var(--text, #f0f0f0)" }}>Agriculture & Hardware</h1>
          </div>
          <div className="flex items-center gap-3">
            {overdueCount > 0 && (
              <Link href="/followups" className="relative">
                <Bell className="w-5 h-5 text-[#f59e0b]" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {overdueCount}
                </span>
              </Link>
            )}
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg transition-fast"
              style={{ color: "var(--text-dim, #888)", background: "var(--surface-3, #222)" }}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              href="/leads/new"
              className="flex items-center gap-1.5 bg-[#C9930C] text-black text-sm font-semibold px-3 py-1.5 rounded-lg"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Leads", value: stats.total, icon: Users, color: "#C9930C" },
            { label: "Converted", value: stats.converted, icon: TrendingUp, color: "#22c55e" },
            { label: "Follow Ups", value: stats.followUp, icon: Calendar, color: "#f59e0b" },
            { label: "Overdue", value: overdueCount, icon: AlertCircle, color: "#ef4444" },
          ].map(s => (
            <div key={s.label} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
                <span className="text-2xl font-bold text-white">{s.value}</span>
              </div>
              <p className="text-[#888] text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-950 rounded-lg flex items-center justify-center">
              <Wheat className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">{stats.agri}</p>
              <p className="text-[#888] text-xs">Agriculture</p>
            </div>
          </div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center">
              <Hammer className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">{stats.hardware}</p>
              <p className="text-[#888] text-xs">Hardware</p>
            </div>
          </div>
        </div>

        {/* Parish breakdown */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
          <h2 className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase mb-3">
            <MapPin className="w-3.5 h-3.5 inline mr-1" />Leads by Parish
          </h2>
          <div className="space-y-2">
            {stats.byParish.map(({ parish, count }) => (
              <div key={parish} className="flex items-center gap-3">
                <span className="text-[#888] text-sm w-24">{parish}</span>
                <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9930C] rounded-full transition-all"
                    style={{ width: stats.total ? `${(count / stats.total) * 100}%` : "0%" }}
                  />
                </div>
                <span className="text-white text-sm font-semibold w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming follow-ups */}
        {followUps.length > 0 && (
          <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase">
                <Calendar className="w-3.5 h-3.5 inline mr-1" />Upcoming Follow-ups
              </h2>
              <Link href="/followups" className="text-[#888] text-xs hover:text-[#C9930C]">View all →</Link>
            </div>
            <div className="space-y-2">
              {followUps.slice(0, 5).map(f => {
                const lead = (f as any).leads;
                const isOverdue = f.due_date < today;
                return (
                  <Link
                    key={f.id}
                    href={`/leads/${f.lead_id}`}
                    className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-fast"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{lead?.business_name}</p>
                      <p className="text-[#888] text-xs">{f.task_type} · {lead?.parish}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${isOverdue ? "text-red-400" : "text-[#f59e0b]"}`}>
                        {isOverdue ? "OVERDUE" : f.due_date}
                      </p>
                      {lead?.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={e => e.stopPropagation()}
                          className="text-[#C9930C] text-xs hover:underline flex items-center gap-1 justify-end mt-0.5"
                        >
                          <Phone className="w-3 h-3" />{lead.phone}
                        </a>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "All Leads", href: "/leads", icon: Users },
            { label: "Follow-ups", href: "/followups", icon: Calendar },
            { label: "Contracts", href: "/contracts", icon: CheckCircle },
            { label: "AI Assistant", href: "/ai", icon: TrendingUp },
          ].map(n => (
            <Link
              key={n.href}
              href={n.href}
              className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 flex flex-col items-center gap-2 hover:border-[#C9930C] transition-fast group"
            >
              <n.icon className="w-5 h-5 text-[#888] group-hover:text-[#C9930C]" />
              <span className="text-[#888] text-xs group-hover:text-white text-center">{n.label}</span>
            </Link>
          ))}
        </div>
      </main>

      {/* Bottom nav */}
      <BottomNav />
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#2a2a2a] safe-bottom z-40">
      <div className="flex items-center justify-around px-2 py-2 max-w-6xl mx-auto">
        {[
          { label: "Home", href: "/", icon: TrendingUp },
          { label: "Leads", href: "/leads", icon: Users },
          { label: "Follow-up", href: "/followups", icon: Calendar },
          { label: "Contracts", href: "/contracts", icon: CheckCircle },
          { label: "AI", href: "/ai", icon: AlertCircle },
        ].map(n => (
          <Link
            key={n.href}
            href={n.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg hover:bg-[#1a1a1a] transition-fast"
          >
            <n.icon className="w-5 h-5 text-[#888]" />
            <span className="text-[10px] text-[#888]">{n.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}