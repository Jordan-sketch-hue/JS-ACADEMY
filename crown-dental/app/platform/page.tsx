"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { AnimatedKPICard } from "@/components/AnimatedKPI";
import { ProcedureBar } from "@/components/ProcedureBar";
import { kpis, appointments, aiActions, waitlist, revenueSeries, procedureMix } from "@/lib/data";
import { BookingModal } from "@/components/BookingModal";

const patientIdMap: Record<string, string> = {};

const statusPill: Record<string, string> = {
  completed:    "bg-slate/10 text-slate",
  "checked-in": "bg-teal/10 text-teal",
  "in-chair":   "bg-gold/15 text-gold-deep font-semibold",
  confirmed:    "bg-surface text-ink border border-line",
  "no-show":    "bg-red-50 text-red-500",
};

const channelIcon: Record<string, string> = {
  "ai-agent": "Bot", app: "Smartphone", web: "Globe2", phone: "Phone",
};

const quickActions = [
  { href: "/platform/huddle",        icon: "Sunrise",        label: "Morning Huddle",  sub: "AI digest ready"   },
  { href: "/platform/communications",icon: "MessageSquare",  label: "Messages",        sub: "Inbox"             },
  { href: "/platform/pulse",          icon: "Activity",       label: "Revenue Pulse",   sub: "Live view"         },
  { href: "/platform/compliance",    icon: "ShieldCheck",    label: "Compliance",      sub: "Track items"       },
  { href: "/platform/referrals",     icon: "ArrowRightLeft", label: "Referrals",       sub: "Manage referrals"  },
  { href: "/platform/forms",         icon: "ClipboardList",  label: "Intake Forms",    sub: "Patient forms"     },
];

export default function PlatformPage() {
  const [showBooking, setShowBooking] = useState(false);
  const [bookPrefill, setBookPrefill] = useState<{ patient?: string }>({});
  const [bookedNames, setBookedNames] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function openWaitlistBooking(name: string) {
    setBookPrefill({ patient: name });
    setShowBooking(true);
  }

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm animate-in slide-in-from-top-2 duration-200">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Good morning</h1>
          <p className="mt-1 text-sm text-slate">Connect your PMS to load today&apos;s schedule and live KPIs.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/platform/schedule" className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-ink shadow-card hover:shadow-card-hover hover:border-gold/30 transition-all">
            <Icons.Plus className="h-4 w-4" strokeWidth={1.5} /> New appointment
          </Link>
          <Link href="/platform/automation" className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.Sparkles className="h-4 w-4" strokeWidth={1.5} /> AI actions
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div data-guide="quick-actions" className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {quickActions.map((q, i) => {
          const I = (Icons as any)[q.icon] ?? Icons.Circle;
          return (
            <Link
              key={q.href}
              href={q.href}
              className="card bg-white p-4 shadow-card hover:shadow-card-hover hover:border-gold/30 hover:-translate-y-0.5 transition-all flex items-center gap-3 rounded-xl fade-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface">
                <I className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink truncate">{q.label}</p>
                <p className="text-[10px] text-slate truncate">{q.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* KPIs */}
      <div data-guide="kpi-row" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.length === 0 ? (
          <div className="col-span-4 flex flex-col items-center justify-center py-12 text-center card bg-white shadow-card rounded-xl">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface">
              <Icons.BarChart3 className="h-6 w-6 text-mist" strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-ink">Connect your PMS to see live KPIs</p>
            <p className="mt-1 text-sm text-slate">Production, utilization, and collections appear here once connected.</p>
          </div>
        ) : (
          kpis.map((k, i) => (
            <div key={k.label} className="fade-up" style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}>
              <AnimatedKPICard item={k} />
            </div>
          ))
        )}
      </div>

      {/* Main grid */}
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        {/* Schedule */}
        <div data-guide="schedule-panel" className="card overflow-hidden bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <Icons.CalendarClock className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
              <span className="font-semibold text-ink">Today&apos;s Schedule</span>
            </div>
            <span className="text-xs text-slate">{appointments.length} appointments</span>
          </div>
          <div className="divide-y divide-line">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                  <Icons.CalendarOff className="h-7 w-7 text-mist" strokeWidth={1.5} />
                </div>
                <p className="font-semibold text-ink">No appointments scheduled today</p>
                <p className="mt-1 text-sm text-slate">Data will appear here once connected to your practice system.</p>
              </div>
            ) : (
              appointments.map((a) => {
                const CI = (Icons as any)[channelIcon[a.channel]] ?? Icons.Globe2;
                const isInChair = a.status === "in-chair";
                return (
                  <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface transition-colors">
                    <div className="w-12 shrink-0">
                      <p className="text-sm font-semibold text-ink">{a.start}</p>
                      <p className="text-[11px] text-mist">{a.duration}m</p>
                    </div>
                    <div className="relative flex items-center">
                      <div className={`h-8 w-1 rounded-full ${isInChair ? "bg-gold" : a.status === "checked-in" ? "bg-teal" : "bg-line"}`} />
                      {isInChair && (
                        <span className="absolute left-0.5 top-1/2 -translate-y-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-gold/50 animate-ping" />
                      )}
                    </div>
                    <Link href={`/platform/patients/${patientIdMap[a.patient] ?? "search"}`} className="flex-1 min-w-0 hover:text-gold-deep transition-colors">
                      <p className="truncate text-sm font-medium text-ink">{a.patient}</p>
                      <p className="truncate text-xs text-slate">{a.procedure} · {a.provider} · {a.chair}</p>
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                      {isInChair ? (
                        <span className="pulse-ring relative inline-flex items-center rounded-full bg-gold/15 px-2.5 py-0.5 text-[11px] font-semibold text-gold-deep">in chair</span>
                      ) : (
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] ${statusPill[a.status]}`}>{a.status.replace("-", " ")}</span>
                      )}
                      {a.value > 0 && <span className="text-xs font-semibold text-ink">${a.value.toLocaleString()}</span>}
                      <Link href={`/platform/clinical?pid=${patientIdMap[a.patient] ?? "search"}`} className="rounded border border-line px-2 py-0.5 text-[10px] text-slate hover:border-gold/40 hover:text-ink transition-colors">Chart</Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="border-t border-line px-5 py-3">
            <Link href="/platform/schedule" className="text-xs font-semibold text-gold-deep hover:underline">View full schedule →</Link>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* AI Actions */}
          <div data-guide="ai-feed" className="card overflow-hidden bg-white shadow-card">
            <div className="ai-thinking flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-ink">
                  <Icons.Bot className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
                </div>
                <span className="font-semibold text-ink">AI Actions</span>
              </div>
              <span className="status-live">
                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                Live
              </span>
            </div>
            <div className="divide-y divide-line">
              {aiActions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface">
                    <Icons.Bot className="h-6 w-6 text-mist" strokeWidth={1.5} />
                  </div>
                  <p className="font-semibold text-ink">Crown AI is ready</p>
                  <p className="mt-1 text-sm text-slate">No actions yet — actions appear once your practice is connected.</p>
                </div>
              ) : (
                aiActions.map((a) => (
                  <div key={a.id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink">{a.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate">{a.detail}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        a.tone === "teal" || a.tone === "aqua" ? "bg-teal/10 text-teal" :
                        a.tone === "violet" ? "bg-gold/10 text-gold-deep" :
                        "bg-gold/15 text-gold-deep"
                      }`}>{a.tag}</span>
                    </div>
                    <p className="mt-1.5 text-[10px] text-mist">{a.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Waitlist */}
          <div data-guide="waitlist" className="card overflow-hidden bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.ClipboardList className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">Waitlist</span>
              </div>
              <span className="text-xs text-slate">{waitlist.length} waiting</span>
            </div>
            <div className="divide-y divide-line">
              {waitlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <p className="font-semibold text-ink">Waitlist is clear</p>
                  <p className="mt-1 text-sm text-slate">No patients on the waitlist right now.</p>
                </div>
              ) : (
                waitlist.map((w) => (
                  <div key={w.name} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{w.name}</p>
                      <p className="text-xs text-slate">{w.want} · {w.flex}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-semibold text-ink">${w.value}</span>
                      {bookedNames.has(w.name) ? (
                        <span className="flex items-center gap-1 rounded-lg bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
                          <Icons.Check className="h-3 w-3" /> Booked
                        </span>
                      ) : (
                        <button onClick={() => openWaitlistBooking(w.name)} className="rounded-lg bg-gold/10 px-2.5 py-1 text-[11px] font-semibold text-gold-deep hover:bg-gold/20 transition-colors">Book</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Procedure Mix */}
          {procedureMix.length > 0 && (
            <div className="card bg-white p-5 shadow-card">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-mist">Procedure Mix (MTD)</p>
              <div className="space-y-3.5">
                {procedureMix.map((p) => (
                  <ProcedureBar key={p.name} name={p.name} value={p.value} color={p.color} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showBooking && (
        <BookingModal
          prefill={bookPrefill}
          onClose={() => setShowBooking(false)}
          onBooked={(appt) => {
            setBookedNames(prev => new Set([...prev, appt.patient]));
            setShowBooking(false);
            flash(`Booked: ${appt.patient} · ${appt.procedure} · ${appt.time} · ${appt.chair}`);
          }}
        />
      )}

      {/* Revenue chart */}
      {revenueSeries.length > 0 && (
        <div className="card bg-white p-5 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-ink">Production vs Collections vs Target</h3>
              <p className="mt-0.5 text-xs text-slate">Last 7 months — All locations</p>
            </div>
            <div className="flex items-center gap-5 text-xs text-slate">
              <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-sm inline-block bg-gold" /> Production</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-sm inline-block bg-teal/60" /> Collections</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-5 rounded-sm border border-dashed border-mist inline-block" /> Target</span>
            </div>
          </div>
          <div className="flex h-44 items-end justify-between gap-2">
            {revenueSeries.map((r, i) => (
              <div key={r.m} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex w-full items-end gap-0.5 h-36">
                  <div className="flex-1 rounded-t bg-gold/70 bar-spring origin-bottom" style={{ height: `${(r.production / 420) * 100}%`, animationDelay: `${i * 60}ms` }} />
                  <div className="flex-1 rounded-t bg-teal/40 bar-spring origin-bottom" style={{ height: `${(r.collections / 420) * 100}%`, animationDelay: `${i * 60 + 30}ms` }} />
                  <div className="absolute inset-x-0 border-t-2 border-dashed border-mist/50" style={{ bottom: `${(r.target / 420) * 100}%` }} />
                </div>
                <span className="text-[10px] text-mist">{r.m}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
