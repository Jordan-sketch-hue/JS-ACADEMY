"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as Icons from "lucide-react";
import { BookingModal } from "@/components/BookingModal";

const patients: Record<string, any> = {};

const riskStyle: Record<string, string> = {
  low:      "bg-teal/10 text-teal",
  moderate: "bg-gold/15 text-gold-deep",
  high:     "bg-alert/10 text-alert",
};

const txStatus: Record<string, string> = {
  Completed: "text-teal",
  Pending:   "text-gold-deep",
  Today:     "text-teal font-semibold",
  Proposed:  "text-slate",
};

const apptStatus: Record<string, string> = {
  completed:  "bg-surface text-slate border border-line",
  "in-chair": "bg-gold/15 text-gold-deep",
  "checked-in": "bg-teal/10 text-teal",
  confirmed:  "bg-teal/10 text-teal",
};

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const p = patients[id];
  const [toast, setToast] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  function handleBooked(appt: { patient: string; time: string; chair: string; procedure: string }) {
    flash(`Booked: ${appt.patient} · ${appt.procedure} · ${appt.time} · ${appt.chair}`);
  }

  if (!p) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 text-slate">
        <Icons.UserX className="h-10 w-10 mb-3 text-mist" />
        <p className="font-semibold text-ink">Patient not found</p>
        <p className="mt-1 text-sm text-slate">Connect your PMS to load patient records.</p>
        <Link href="/platform/patients" className="mt-3 text-xs text-gold-deep hover:underline">← Back to patients</Link>
      </div>
    );
  }

  const maxPerio = Math.max(...p.perio);

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate">
        <Link href="/platform/patients" className="hover:text-gold-deep transition-colors">Patients</Link>
        <Icons.ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink font-medium">{p.name}</span>
      </div>

      {/* Header card */}
      <div className="card bg-white p-6 shadow-card">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-deep to-gold text-xl font-bold text-white">
            {p.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-ink">{p.name}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${riskStyle[p.risk]}`}>{p.risk} risk</span>
              {p.tags.map((t: string) => (
                <span key={t} className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-slate">{t}</span>
              ))}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate">
              <span>DOB {p.dob} · Age {p.age}</span>
              <span className="flex items-center gap-1.5"><Icons.Phone className="h-3.5 w-3.5" />{p.phone}</span>
              <span className="flex items-center gap-1.5"><Icons.Mail className="h-3.5 w-3.5" />{p.email}</span>
              <span className="flex items-center gap-1.5"><Icons.MapPin className="h-3.5 w-3.5" />{p.address}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <p className="text-xs text-slate">LTV</p>
              <p className="text-lg font-semibold text-ink">${p.ltv.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate">Balance</p>
              <p className={`text-base font-semibold ${p.balance > 0 ? "text-alert" : "text-teal"}`}>{p.balance > 0 ? `$${p.balance}` : "Clear"}</p>
            </div>
            <div className="flex gap-2 mt-1 flex-wrap">
              <Link href="/platform/communications" className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">
                <Icons.MessageSquare className="h-3.5 w-3.5" /> Message
              </Link>
              <button onClick={() => setShowBooking(true)} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">
                <Icons.CalendarPlus className="h-3.5 w-3.5" /> Book
              </button>
              <Link href={`/platform/clinical?pid=${id}`} className="gold-btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs">
                <Icons.Stethoscope className="h-3.5 w-3.5" /> Open clinical chart
              </Link>
            </div>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="mt-5 grid grid-cols-4 gap-px bg-line rounded-xl overflow-hidden">
          {[
            { l: "Plan",        v: p.plan },
            { l: "Provider",    v: p.provider },
            { l: "Last visit",  v: p.lastVisit },
            { l: "Next due",    v: p.nextDue },
          ].map((s) => (
            <div key={s.l} className="bg-surface px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-mist">{s.l}</p>
              <p className={`text-sm font-medium mt-0.5 ${s.v === "Overdue" ? "text-alert" : "text-ink"}`}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left col */}
        <div className="space-y-4">
          {/* Medical */}
          <div className="card bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-ink mb-3 flex items-center gap-2"><Icons.HeartPulse className="h-4 w-4 text-gold-deep" />Medical history</p>
            {p.conditions.length > 0 ? (
              <ul className="space-y-1.5 mb-3">
                {p.conditions.map((c: string) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-slate"><Icons.Circle className="h-1.5 w-1.5 mt-1.5 shrink-0 fill-gold-deep text-gold-deep" />{c}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-mist mb-3">No conditions on file.</p>}
            {p.meds.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate mb-1">Medications</p>
                {p.meds.map((m: string) => (
                  <p key={m} className="text-xs text-slate">{m}</p>
                ))}
              </div>
            )}
            {p.allergies.length > 0 && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-alert/30 bg-alert/5 px-3 py-2">
                <Icons.AlertTriangle className="h-3.5 w-3.5 text-alert shrink-0" />
                <span className="text-xs font-semibold text-alert">{p.allergies.join(", ")}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="card bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-ink mb-3 flex items-center gap-2"><Icons.StickyNote className="h-4 w-4 text-gold-deep" />Provider notes</p>
            <p className="text-sm text-slate leading-relaxed">{p.notes}</p>
          </div>
        </div>

        {/* Middle col — appointments */}
        <div className="card bg-white shadow-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Icons.CalendarClock className="h-4 w-4 text-gold-deep" />
            <span className="font-semibold text-ink text-sm">Appointment history</span>
          </div>
          <div className="divide-y divide-line">
            {p.appointments.map((a: any, i: number) => (
              <div key={i} className="px-5 py-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gold-deep font-semibold">{a.date}</p>
                    <p className="text-sm font-medium text-ink mt-0.5">{a.proc}</p>
                    <p className="text-xs text-slate">{a.provider}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${apptStatus[a.status] ?? "bg-surface text-slate"}`}>{a.status.replace("-"," ")}</span>
                    <span className="text-xs font-semibold text-ink">${a.fee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-line px-5 py-3">
            <button onClick={() => setShowBooking(true)} className="flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:underline">
              <Icons.Plus className="h-3.5 w-3.5" /> Schedule new appointment
            </button>
          </div>
        </div>

        {/* Right col — treatment plan */}
        <div className="space-y-4">
          <div className="card bg-white shadow-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line px-5 py-4">
              <Icons.ClipboardList className="h-4 w-4 text-gold-deep" />
              <span className="font-semibold text-ink text-sm">Treatment plan</span>
              <button onClick={() => { window.location.href = "/platform/treatment-plans"; }} className="ml-auto text-xs text-gold-deep hover:underline">+ Add procedure</button>
            </div>
            <div className="divide-y divide-line">
              {p.tx.map((t: any) => (
                <div key={t.code} className="px-5 py-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-mono text-mist">{t.code}</p>
                      <p className="text-sm font-medium text-ink">{t.desc}</p>
                      <p className="text-xs text-slate mt-0.5">Ins: ${t.ins} · Pt: ${t.pt}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs ${txStatus[t.status] ?? "text-slate"}`}>{t.status}</p>
                      <p className="text-sm font-semibold text-ink">${t.fee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mini perio chart */}
          <div className="card bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-ink mb-3 flex items-center gap-2"><Icons.Activity className="h-4 w-4 text-gold-deep" />Perio snapshot</p>
            <div className="flex items-end gap-0.5 h-14">
              {p.perio.map((v: number, i: number) => (
                <div
                  key={i}
                  className={`flex-1 rounded-sm ${v >= 30 ? "bg-alert" : v >= 20 ? "bg-gold" : "bg-teal/60"}`}
                  style={{ height: `${(v / maxPerio) * 100}%` }}
                />
              ))}
            </div>
            <p className="text-[10px] text-mist mt-2">24-point pocket depth chart · max {maxPerio}mm</p>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          prefill={{ patient: p.name }}
          onClose={() => setShowBooking(false)}
          onBooked={handleBooked}
        />
      )}
    </div>
  );
}
