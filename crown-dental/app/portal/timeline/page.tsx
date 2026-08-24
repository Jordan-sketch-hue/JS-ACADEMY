"use client";
import { useState } from "react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const events: { date: string; type: string; icon: string; color: string; title: string; detail: string; provider: string | null; photo: boolean; fee: number | null }[] = [];

const colorMap: Record<string, string> = {
  gold: "bg-gradient-to-br from-gold-deep to-gold",
  teal: "bg-teal",
  ink:  "bg-ink-2",
};

export default function TimelinePage() {
  const [toast, setToast] = useState<string | null>(null);
  const totalSpend = events.reduce((s, e) => s + (e.fee ?? 0), 0);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <main className="min-h-screen bg-surface">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <header className="border-b border-line bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link href="/portal" className="text-sm text-slate hover:text-gold-deep transition-colors">Overview</Link>
          <span className="text-sm font-semibold text-ink border-b-2 border-gold-deep pb-0.5">My journey</span>
          <Link href="/portal/family" className="text-sm text-slate hover:text-gold-deep transition-colors">Family</Link>
          <Link href="/portal/messages" className="text-sm text-slate hover:text-gold-deep transition-colors">Messages</Link>
        </nav>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold">
          <Icons.User className="h-4 w-4 text-white" strokeWidth={1.5} />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-ink">Your dental journey</h1>
            <p className="text-sm text-slate mt-1">{events.length > 0 ? `${events.length} visits · $${totalSpend.toLocaleString()} invested in your smile` : "No visit history yet"}</p>
          </div>
          <button onClick={() => flash("Shareable link copied to clipboard.")} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate hover:border-gold/40 hover:text-ink transition-colors">
            <Icons.Share2 className="h-4 w-4" /> Share
          </button>
        </div>

        {/* Score banner */}
        <div className="card bg-white p-5 shadow-card flex items-center gap-5">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <svg viewBox="0 0 56 56" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#E5E9F0" strokeWidth="5"/>
              <circle cx="28" cy="28" r="24" fill="none" stroke="#C9A96E" strokeWidth="5"
                strokeDasharray={`${(87/100)*150.8} 150.8`} strokeLinecap="round"/>
            </svg>
            <span className="text-lg font-bold text-gold-deep z-10">87</span>
          </div>
          <div>
            <p className="font-semibold text-ink">Crown Score™ — 87 / 100</p>
            <p className="text-xs text-slate mt-0.5">Excellent · up 12 points since your implant was completed</p>
            <div className="flex gap-2 mt-2">
              <span className="rounded-full bg-teal/10 text-teal text-[11px] font-semibold px-2 py-0.5">Low risk</span>
              <span className="rounded-full bg-gold/10 text-gold-deep text-[11px] font-semibold px-2 py-0.5">SRP pending</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center card bg-white shadow-card">
            <Icons.History className="h-10 w-10 text-mist mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-ink">No visit history yet</p>
            <p className="mt-1 text-sm text-slate max-w-xs">Your dental journey will be recorded here once your practice system is connected.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-line" />
            <div className="space-y-0">
              {events.map((e, i) => {
                const I = (Icons as any)[e.icon] ?? Icons.Circle;
                return (
                  <div key={i} className="relative pl-16 pb-8 last:pb-0">
                    <div className={`absolute left-2.5 top-0 flex h-7 w-7 items-center justify-center rounded-full text-white text-xs ${colorMap[e.color]}`}>
                      <I className="h-3.5 w-3.5" />
                    </div>
                    <div className="card bg-white p-4 shadow-card hover:shadow-card-hover transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gold-deep">{e.date}</p>
                          <p className="text-sm font-semibold text-ink mt-0.5">{e.title}</p>
                          <p className="text-xs text-slate mt-1 leading-relaxed">{e.detail}</p>
                          {e.provider && <p className="text-xs text-mist mt-1">{e.provider}</p>}
                        </div>
                        <div className="shrink-0 text-right">
                          {e.fee && <p className="text-sm font-semibold text-ink">${e.fee.toLocaleString()}</p>}
                          {e.type === "milestone" && <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold-deep block mt-1">Milestone</span>}
                        </div>
                      </div>
                      {e.photo && (
                        <div className="mt-3 flex gap-2">
                          <div className="h-14 w-20 rounded-lg bg-surface border border-line flex items-center justify-center text-mist">
                            <Icons.Camera className="h-4 w-4" />
                          </div>
                          <div className="h-14 w-20 rounded-lg bg-surface border border-line flex items-center justify-center text-mist">
                            <Icons.Camera className="h-4 w-4" />
                          </div>
                          <button onClick={() => flash("Opening photo gallery for this visit.")} className="flex h-14 w-20 items-center justify-center rounded-lg bg-gold/5 border border-gold/20 text-xs text-gold-deep font-semibold hover:bg-gold/10 transition-colors">+ Photos</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
