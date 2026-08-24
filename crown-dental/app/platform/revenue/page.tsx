"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { revenueSeries } from "@/lib/data";

const patientIdMap: Record<string, string> = {};

const claims: { id: string; patient: string; code: string; amount: number; status: string; payer: string; filed: string; paid: string }[] = [];

const claimPill: Record<string, string> = {
  Paid:      "bg-teal/10 text-teal",
  Pending:   "bg-gold/15 text-gold-deep",
  Denied:    "bg-alert/10 text-alert",
  Submitted: "bg-ink/8 text-ink",
};

export default function RevenuePage() {
  const [toast, setToast] = useState<string | null>(null);
  const [claimList, setClaimList] = useState(claims);
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function submitPendingClaims() {
    const pendingCount = claimList.filter(c => c.status === "Pending").length;
    setClaimList(prev => prev.map(c => c.status === "Pending" ? { ...c, status: "Submitted" } : c));
    flash(`${pendingCount} claim${pendingCount > 1 ? "s" : ""} submitted to insurers.`);
  }

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Revenue Cycle</h1>
        <div className="flex gap-2">
          <button onClick={() => {
            const content = `Crown Dental OS — Revenue Cycle Report\nExported: ${new Date().toLocaleString()}\n\nMonthly Recurring Revenue: $3,840\nOutstanding AR: $14,280\nAvg Collection Rate: 91.2%\nCrown Care+ Members: 48 active\n\nThis report was generated from Crown Dental OS demo data.`;
            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "crown-revenue-report.txt"; a.click(); URL.revokeObjectURL(url);
            flash("Revenue cycle report downloaded.");
          }} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate shadow-card hover:border-gold/40 transition-colors">
            <Icons.Download className="h-4 w-4" /> Export
          </button>
          <button onClick={submitPendingClaims} disabled={!claimList.some(c => c.status === "Pending")} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-50">
            <Icons.Send className="h-4 w-4" /> Submit claims
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Collections rate", v: "98.6%", d: "+2.4% vs last mo", i: "TrendingUp",   good: true },
          { l: "A/R > 90 days",    v: "$3,210", d: "−18% vs last mo", i: "AlertCircle",  good: true },
          { l: "Denial rate",      v: "1.2%",   d: "−0.8% vs last mo", i: "ShieldCheck", good: true },
          { l: "Days in A/R",      v: "14.3",   d: "−2.1 days",        i: "Clock",       good: true },
        ].map((s) => {
          const I = (Icons as any)[s.i] ?? Icons.Circle;
          return (
            <div key={s.l} className="card bg-white rounded-xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate">{s.l}</span>
                <I className="h-4 w-4 text-gold-deep" />
              </div>
              <p className="text-3xl font-semibold text-ink">{s.v}</p>
              <p className="mt-1 text-xs text-teal">{s.d}</p>
            </div>
          );
        })}
      </div>

      {/* Claims table */}
      <div className="card overflow-hidden bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <Icons.FileText className="h-4 w-4 text-gold-deep" />
            <span className="font-semibold text-ink">Claims</span>
          </div>
          <div className="flex items-center gap-2">
            {claimList.filter(c => c.status === "Pending").length > 0 && (
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-gold-deep">{claimList.filter(c => c.status === "Pending").length} pending</span>
            )}
            {claimList.filter(c => c.status === "Submitted").length > 0 && (
              <span className="rounded-full bg-ink/8 px-2 py-0.5 text-[11px] font-semibold text-ink">{claimList.filter(c => c.status === "Submitted").length} submitted</span>
            )}
            {claimList.filter(c => c.status === "Denied").length > 0 && (
              <span className="rounded-full bg-alert/10 px-2 py-0.5 text-[11px] font-semibold text-alert">{claimList.filter(c => c.status === "Denied").length} denied</span>
            )}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              {["Claim ID","Patient","Code","Amount","Payer","Filed","Paid","Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {claimList.map((c) => (
              <tr key={c.id} className="hover:bg-surface transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-mist">{c.id}</td>
                <td className="px-5 py-3 font-medium text-ink">{c.patient}</td>
                <td className="px-5 py-3 font-mono text-xs font-semibold text-teal">{c.code}</td>
                <td className="px-5 py-3 font-semibold text-ink">${c.amount.toLocaleString()}</td>
                <td className="px-5 py-3 text-slate">{c.payer}</td>
                <td className="px-5 py-3 text-slate">{c.filed}</td>
                <td className="px-5 py-3 text-slate">{c.paid}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${claimPill[c.status]}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {claimList.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface">
                    <Icons.FileText className="h-5 w-5 text-mist" />
                  </div>
                  <p className="font-semibold text-ink">No claims yet</p>
                  <p className="mt-1 text-xs text-slate">Claims will appear here once your billing integration is connected.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* In-house plan */}
      <div className="card bg-white p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Icons.CreditCard className="h-5 w-5 text-gold-deep" />
          <h3 className="font-semibold text-ink">Crown Care+ In-House Plan</h3>
          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold-deep">48 active members</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { l: "MRR from plans", v: "$3,840" },
            { l: "Avg member LTV",  v: "$2,200" },
            { l: "Utilization",     v: "67%" },
          ].map((s) => (
            <div key={s.l} className="card-sm rounded-xl p-4">
              <p className="text-xs text-slate">{s.l}</p>
              <p className="mt-1 text-2xl font-semibold text-ink">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
