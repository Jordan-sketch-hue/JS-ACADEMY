"use client";
import { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { appointments } from "@/lib/data";

const providers: { name: string; initials: string; production: number; goal: number; pts: number }[] = [];
const chairs: { name: string; util: number }[] = [];

function Ticker({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const step = value / 40;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, value);
      setDisplay(Math.round(cur));
      if (cur >= value) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [value]);
  return <>{prefix}{display.toLocaleString()}</>;
}

export default function PulsePage() {
  const [tv, setTv] = useState(false);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const production = 84200 + tick * 47;
  const goal = 105000;
  const pct = Math.min((production / goal) * 100, 100);
  const collections = Math.round(production * 0.962);

  const base = (
    <div className={`${tv ? "min-h-screen bg-ink text-white p-8 space-y-8" : "p-6 space-y-5"}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${tv ? "text-white text-3xl" : "text-ink"}`}>
            Revenue Pulse {tv && <span className="ml-3 text-lg text-gold font-normal">Crown Kingston · Live</span>}
          </h1>
          {!tv && <p className="text-xs text-slate mt-1">Real-time production · auto-refreshes every 3s</p>}
        </div>
        <button onClick={() => setTv(!tv)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tv ? "bg-white/10 text-white hover:bg-white/20" : "border border-line bg-white text-slate hover:bg-surface"}`}>
          {tv ? <><Icons.Minimize2 className="h-4 w-4" /> Exit TV</> : <><Icons.Tv2 className="h-4 w-4" /> TV mode</>}
        </button>
      </div>

      {/* Main production meter */}
      <div className={`rounded-2xl p-6 ${tv ? "bg-white/5 border border-white/10" : "card bg-white shadow-card"}`}>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${tv ? "text-white/50" : "text-mist"}`}>Production MTD</p>
            <p className={`font-semibold ${tv ? "text-white text-5xl" : "text-ink text-4xl"}`}>
              $<Ticker value={production} />
            </p>
          </div>
          <div className="text-right">
            <p className={`text-xs ${tv ? "text-white/50" : "text-mist"}`}>Goal</p>
            <p className={`text-xl font-semibold ${tv ? "text-white/70" : "text-ink"}`}>${goal.toLocaleString()}</p>
            <p className={`text-sm font-bold ${pct >= 100 ? "text-teal" : pct > 75 ? "text-gold-deep" : "text-alert"}`}>{pct.toFixed(1)}%</p>
          </div>
        </div>
        <div className={`h-4 overflow-hidden rounded-full ${tv ? "bg-white/10" : "bg-surface"}`}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: pct >= 100 ? "#0D9488" : "linear-gradient(to right, #B8953F, #C9A96E)" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${tv ? "text-white/50" : "text-mist"}`}>$0</span>
          <span className={`text-xs ${tv ? "text-white/50" : "text-mist"}`}>${goal.toLocaleString()}</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { l: "Collections", v: `$${collections.toLocaleString()}`, color: "text-teal" },
          { l: "Remaining to goal", v: `$${Math.max(0, goal - production).toLocaleString()}`, color: tv ? "text-gold" : "text-gold-deep" },
          { l: "Avg ticket", v: "$1,040", color: tv ? "text-white" : "text-ink" },
          { l: "Appointments left", v: String(appointments.filter(a => a.status === "confirmed" || a.status === "checked-in").length), color: tv ? "text-white" : "text-ink" },
        ].map((k) => (
          <div key={k.l} className={`rounded-xl p-4 ${tv ? "bg-white/5 border border-white/10" : "card bg-white shadow-card"}`}>
            <p className={`text-xs ${tv ? "text-white/50" : "text-mist"}`}>{k.l}</p>
            <p className={`text-2xl font-semibold mt-1 ${k.color}`}>{k.v}</p>
          </div>
        ))}
      </div>

      <div className={`grid gap-5 ${tv ? "grid-cols-2" : "lg:grid-cols-2"}`}>
        {/* Provider leaderboard */}
        <div className={`rounded-xl overflow-hidden ${tv ? "bg-white/5 border border-white/10" : "card bg-white shadow-card"}`}>
          <div className={`flex items-center gap-2 px-5 py-4 border-b ${tv ? "border-white/10" : "border-line"}`}>
            <Icons.Trophy className={`h-4 w-4 ${tv ? "text-gold" : "text-gold-deep"}`} />
            <span className={`font-semibold text-sm ${tv ? "text-white" : "text-ink"}`}>Provider leaderboard</span>
          </div>
          <div className="divide-y divide-white/5 p-0">
            {providers.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-10 px-5 text-center ${tv ? "text-white/40" : "text-mist"}`}>
                <Icons.Users className="h-7 w-7 mb-2" strokeWidth={1.5} />
                <p className="text-xs">No provider data yet</p>
              </div>
            ) : (
              [...providers].sort((a, b) => b.production - a.production).map((p, i) => {
                const pct = Math.min((p.production / p.goal) * 100, 100);
                return (
                  <div key={p.name} className="flex items-center gap-4 px-5 py-4">
                    <span className={`text-lg font-bold w-6 ${i === 0 ? "text-gold" : tv ? "text-white/40" : "text-mist"}`}>{i + 1}</span>
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${i === 0 ? "bg-gradient-to-br from-gold-deep to-gold" : "bg-ink-2"}`}>{p.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${tv ? "text-white" : "text-ink"}`}>{p.name}</p>
                      <div className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${tv ? "bg-white/10" : "bg-surface"}`}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 100 ? "#0D9488" : "#C9A96E" }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-semibold ${tv ? "text-white" : "text-ink"}`}>${p.production.toLocaleString()}</p>
                      <p className={`text-xs ${pct >= 100 ? "text-teal" : tv ? "text-white/40" : "text-mist"}`}>{pct.toFixed(0)}%</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chair utilization */}
        <div className={`rounded-xl overflow-hidden ${tv ? "bg-white/5 border border-white/10" : "card bg-white shadow-card"}`}>
          <div className={`flex items-center gap-2 px-5 py-4 border-b ${tv ? "border-white/10" : "border-line"}`}>
            <Icons.LayoutGrid className={`h-4 w-4 ${tv ? "text-gold" : "text-gold-deep"}`} />
            <span className={`font-semibold text-sm ${tv ? "text-white" : "text-ink"}`}>Chair utilization</span>
          </div>
          <div className="p-5 space-y-4">
            {chairs.length === 0 ? (
              <div className={`flex flex-col items-center justify-center py-8 text-center ${tv ? "text-white/40" : "text-mist"}`}>
                <Icons.LayoutGrid className="h-7 w-7 mb-2" strokeWidth={1.5} />
                <p className="text-xs">No chair data yet</p>
              </div>
            ) : (
              chairs.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className={`text-sm ${tv ? "text-white" : "text-ink"}`}>{c.name}</span>
                    <span className={`text-sm font-semibold ${c.util === 100 ? "text-teal" : c.util < 70 ? "text-alert" : tv ? "text-gold" : "text-gold-deep"}`}>{c.util}%</span>
                  </div>
                  <div className={`h-2.5 overflow-hidden rounded-full ${tv ? "bg-white/10" : "bg-surface"}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${c.util}%`, background: c.util === 100 ? "#0D9488" : c.util < 70 ? "#EF4444" : "#C9A96E" }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return base;
}
