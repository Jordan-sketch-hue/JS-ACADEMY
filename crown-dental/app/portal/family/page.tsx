"use client";
import { useState } from "react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

const members: { name: string; initials: string; role: string; age: number; nextAppt: string | null; nextProc: string | null; risk: string; balance: number; recall: string; plan: string }[] = [];

const riskStyle: Record<string, string> = {
  low:      "bg-teal/10 text-teal",
  moderate: "bg-gold/15 text-gold-deep",
  high:     "bg-alert/10 text-alert",
};
const recallStyle: Record<string, { badge: string; label: string }> = {
  ok:         { badge: "bg-teal/10 text-teal",     label: "Recall OK" },
  "due-soon": { badge: "bg-gold/15 text-gold-deep", label: "Due soon" },
  overdue:    { badge: "bg-alert/10 text-alert",    label: "Overdue"  },
};

export default function FamilyPage() {
  const [toast, setToast] = useState<string | null>(null);

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
          <Link href="/portal" className="text-sm text-slate hover:text-gold-deep transition-colors">My records</Link>
          <span className="text-sm font-semibold text-ink border-b-2 border-gold-deep pb-0.5">Family</span>
          <Link href="/portal/messages" className="text-sm text-slate hover:text-gold-deep transition-colors">Messages</Link>
        </nav>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold">
            <Icons.User className="h-4 w-4 text-white" strokeWidth={1.5} />
          </div>
          <p className="text-xs font-semibold text-ink">My Account</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-ink">Family</h1>
            <p className="text-sm text-slate mt-1">{members.length > 0 ? `${members.length} member${members.length !== 1 ? "s" : ""} · Crown Care+ plan` : "No family members linked yet"}</p>
          </div>
          <button onClick={() => flash("Booking group appointment for all Bennett family members.")} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.CalendarPlus className="h-4 w-4" /> Book for everyone
          </button>
        </div>

        {members.filter(m => m.recall === "overdue").map(m => (
          <div key={m.name} className="flex items-start gap-3 rounded-xl border border-alert/30 bg-alert/5 p-4">
            <Icons.AlertTriangle className="h-4 w-4 shrink-0 text-alert mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{m.name} is overdue for recall</p>
              <p className="text-xs text-slate mt-0.5">Last cleaning was more than 6 months ago. Book soon to stay on track.</p>
            </div>
            <button onClick={() => flash(`Booking appointment for ${m.name}. Available slots loading…`)} className="shrink-0 gold-btn rounded-lg px-3 py-1.5 text-xs">Book now</button>
          </div>
        ))}

        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center card bg-white shadow-card">
            <Icons.Users className="h-10 w-10 text-mist mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-ink">No family members linked</p>
            <p className="mt-1 text-sm text-slate max-w-xs">Family members will appear here once your practice system is connected.</p>
          </div>
        ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {members.map((m) => (
            <div key={m.name} className="card bg-white p-5 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-deep to-gold text-sm font-bold text-white">{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-ink">{m.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${riskStyle[m.risk]}`}>{m.risk} risk</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${recallStyle[m.recall].badge}`}>{recallStyle[m.recall].label}</span>
                  </div>
                  <p className="text-xs text-slate mt-0.5">{m.role} · {m.plan}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-surface p-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-mist">Next appointment</p>
                  <p className={`text-sm font-medium mt-0.5 ${m.nextAppt ? "text-ink" : "text-mist"}`}>{m.nextAppt ?? "Not scheduled"}</p>
                  {m.nextProc && <p className="text-xs text-slate">{m.nextProc}</p>}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-mist">Balance</p>
                  <p className={`text-sm font-semibold mt-0.5 ${m.balance > 0 ? "text-alert" : "text-teal"}`}>{m.balance > 0 ? `$${m.balance}` : "Clear"}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                {m.nextAppt ? (
                  <button onClick={() => flash(`Rescheduling ${m.name}'s appointment.`)} className="flex-1 rounded-lg border border-line py-2 text-xs text-slate hover:bg-surface hover:border-gold/40 transition-colors">Reschedule</button>
                ) : (
                  <button onClick={() => flash(`Booking appointment for ${m.name}.`)} className="flex-1 gold-btn rounded-lg py-2 text-xs">Book appointment</button>
                )}
                <button onClick={() => flash(`Opening ${m.name}'s dental records.`)} className="flex-1 rounded-lg border border-line py-2 text-xs text-slate hover:bg-surface hover:border-gold/40 transition-colors">View records</button>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="card bg-ink p-6 shadow-card-hover flex items-center gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/20">
            <Icons.CalendarCheck2 className="h-6 w-6 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Book the whole family in one visit</h3>
            <p className="text-sm text-white/60 mt-0.5">Crown Kingston can run back-to-back appointments so you only make one trip. Perfect for school holidays.</p>
          </div>
          <button onClick={() => flash("Opening family scheduling calendar.")} className="shrink-0 gold-btn rounded-full px-5 py-2.5 text-sm shadow-gold">Schedule family block</button>
        </div>
      </div>
    </main>
  );
}
