"use client";
import { useState } from "react";
import * as Icons from "lucide-react";
import { clinics as allClinics } from "@/lib/data";
import { useGuideActive } from "@/components/GuideContext";

const providers: { name: string; prod: number; goal: number; apts: number; accept: number }[] = [];

const PERIOD_MULTIPLIER: Record<string, number> = {
  "This month":   1,
  "Last 30 days": 0.95,
  "This year":    12,
};

export default function AnalyticsPage() {
  const guideActive = useGuideActive();
  const clinics = guideActive ? allClinics : [];
  const [toast, setToast] = useState<string | null>(null);
  const [period, setPeriod] = useState("This month");
  const mult = PERIOD_MULTIPLIER[period] ?? 1;
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Practice Intelligence</h1>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={e => { setPeriod(e.target.value); flash(`Period: ${e.target.value}`); }}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-slate shadow-card focus:outline-none focus:border-gold/40"
          >
            <option>This month</option>
            <option>Last 30 days</option>
            <option>This year</option>
          </select>
          <button onClick={() => {
            const baseProds = [62140,38200,142000,98600,72040];
            const rows = ["Clinic,Production,Collections"];
            clinics.forEach((c, i) => rows.push(`${c},${Math.round(baseProds[i] * mult)},${Math.round(baseProds[i] * mult * 0.91)}`));
            const blob = new Blob([rows.join("\n")], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = `crown-analytics-${period.replace(/\s/g,"-")}.csv`; a.click();
            URL.revokeObjectURL(url);
            flash("Analytics report exported as CSV.");
          }} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate shadow-card hover:border-gold/40 transition-colors">
            <Icons.Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* DSO roll-up */}
      <div className="card overflow-hidden bg-white shadow-card">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <Icons.Building2 className="h-4 w-4 text-gold-deep" />
          <span className="font-semibold text-ink">DSO Roll-Up — All Locations</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface">
                {["Location","Region","Chairs","Production MTD","Utilization","No-Show","Net Collect"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {clinics.map((c, i) => {
                const baseProd = [62140,38200,142000,98600,72040][i];
                const prod = Math.round(baseProd * mult);
                const util = [91,85,94,88,96][i];
                return (
                  <tr key={c.id} className="hover:bg-surface transition-colors">
                    <td className="px-5 py-3 font-semibold text-ink">{c.name}</td>
                    <td className="px-5 py-3 text-slate">{c.region}</td>
                    <td className="px-5 py-3 text-slate">{c.chairs}</td>
                    <td className="px-5 py-3 font-semibold text-ink">${prod.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface">
                          <div className="h-full rounded-full bg-gold" style={{ width: `${util}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gold-deep">{util}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-teal font-medium">{[1.8,2.4,1.2,2.0,1.5][i]}%</td>
                    <td className="px-5 py-3 text-teal font-medium">{[98.6,97.2,99.1,98.0,97.8][i]}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider scorecards */}
      <div>
        <h3 className="text-sm font-semibold text-ink mb-3">Provider Scorecards — Crown Kingston</h3>
        {providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-line bg-white">
            <Icons.Users className="h-8 w-8 text-mist mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-ink">No providers configured</p>
            <p className="mt-1 text-sm text-slate">Provider scorecards will appear once your practice system is connected.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {providers.map((p) => {
              const pct = Math.min(100, Math.round((p.prod / p.goal) * 100));
              const over = pct >= 100;
              return (
                <div key={p.name} className="card bg-white p-5 shadow-card">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold text-xs font-bold text-white">
                      {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{p.name}</p>
                      <p className="text-xs text-slate">{p.apts} appointments</p>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-slate">Production</span>
                        <span className={`font-semibold ${over ? "text-teal" : "text-ink"}`}>
                          ${p.prod.toLocaleString()} / ${p.goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                        <div
                          className={`h-full rounded-full ${over ? "bg-teal" : "bg-gold"}`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate">Case acceptance</span>
                      <span className="font-semibold text-ink">{p.accept}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recall & sources */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="card bg-white p-5 shadow-card">
          <h3 className="text-sm font-semibold text-ink mb-4">Recall Effectiveness</h3>
          <div className="space-y-3">
            {(guideActive ? [
              { l: "Recall rate",           v: "68%",     b: 68, c: "bg-gold" },
              { l: "Patients contacted",    v: "312",     b: 80, c: "bg-teal/60" },
              { l: "Booked from recall",    v: "212",     b: 68, c: "bg-gold-deep" },
              { l: "Revenue from recall",   v: "$38,400", b: 85, c: "bg-teal" },
            ] : []).map((r) => (
              <div key={r.l}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate">{r.l}</span>
                  <span className="font-semibold text-ink">{r.v}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                  <div className={`h-full rounded-full ${r.c}`} style={{ width: `${r.b}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card bg-white p-5 shadow-card">
          <h3 className="text-sm font-semibold text-ink mb-4">New Patient Sources</h3>
          {guideActive ? (
            <div className="space-y-3">
              {[
                { l: "AI Agent (voice/chat)", v: 42, c: "bg-gold" },
                { l: "Referral",              v: 28, c: "bg-ink-3/40" },
                { l: "Google / organic",      v: 18, c: "bg-teal/60" },
                { l: "Walk-in",               v:  8, c: "bg-gold-light" },
                { l: "Social media",          v:  4, c: "bg-mist/50" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate">{s.l}</span>
                    <span className="font-semibold text-ink">{s.v}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className={`h-full rounded-full ${s.c}`} style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="font-semibold text-ink">No data yet</p>
              <p className="mt-1 text-xs text-slate">Source breakdown appears once your practice is connected.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
