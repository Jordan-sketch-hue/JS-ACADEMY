"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { appointments } from "@/lib/data";
import { BookingModal, type BookedAppointment } from "@/components/BookingModal";

const patientIdMap: Record<string, string> = {};

const noShowRisk: Record<string, { level: "Low" | "Medium" | "High"; reason: string }> = {};

const riskStyle = {
  Low:    "bg-teal/10 text-teal border-teal/20",
  Medium: "bg-gold/15 text-gold-deep border-gold/30",
  High:   "bg-alert/10 text-alert border-alert/20",
};

const hours = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"];
const chairs = ["Op 1","Op 2","Op 3","Hygiene 1","Hygiene 2"];

const BASE = new Date(2026, 6, 2);

const daySeeds: Record<number, typeof appointments> = {};

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function fmt(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function SchedulePage() {
  const [offset, setOffset] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookPrefill, setBookPrefill] = useState<{ time?: string; chair?: string; patient?: string }>({});
  const [newBookings, setNewBookings] = useState<BookedAppointment[]>([]);

  const currentDate = addDays(BASE, offset);
  const isBase = offset === 0;
  const dayAppts = isBase ? appointments : (daySeeds[offset] ?? []);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function openBooking(prefill: { time?: string; chair?: string; patient?: string } = {}) {
    setBookPrefill(prefill);
    setShowBooking(true);
  }

  function handleBooked(appt: BookedAppointment) {
    setNewBookings(prev => [...prev, appt]);
    flash(`Booked: ${appt.patient} · ${appt.time} · ${appt.chair} · ${appt.procedure}`);
  }

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm animate-in slide-in-from-top-2 duration-200">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Schedule — {fmt(currentDate)}</h1>
        <div className="flex gap-2">
          <button onClick={() => setOffset(o => o - 1)} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate shadow-card hover:border-gold/40 transition-colors">
            <Icons.ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <button onClick={() => setOffset(0)} className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${isBase ? "border-gold/40 bg-gold/5 text-gold-deep" : "border-line bg-white text-slate hover:border-gold/40"}`}>
            Today
          </button>
          <button onClick={() => setOffset(o => o + 1)} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate shadow-card hover:border-gold/40 transition-colors">
            Next <Icons.ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={() => openBooking()} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.Plus className="h-4 w-4" /> Book
          </button>
        </div>
      </div>

      <div className="card overflow-hidden bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[700px]">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th className="w-16 px-4 py-3 text-left font-semibold text-mist">Time</th>
                {chairs.map((c) => (
                  <th key={c} className="px-3 py-3 text-center text-xs font-semibold text-ink">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {hours.map((h) => {
                const slotAppts = dayAppts.filter((a) => a.start === h);
                return (
                  <tr key={h} className="hover:bg-surface/60 transition-colors">
                    <td className="px-4 py-4 font-mono text-mist">{h}</td>
                    {chairs.map((c) => {
                      const appt = slotAppts.find((a) => a.chair === c);
                      return (
                        <td key={c} className="px-2 py-2">
                          {appt ? (
                            <div className={`rounded-xl p-2.5 transition-shadow hover:shadow-card ${
                              appt.status === "in-chair" ? "border border-gold/40 bg-gold/8"
                              : appt.status === "completed" ? "border border-line bg-surface"
                              : "border border-line bg-white shadow-card"
                            }`}>
                              <div className="flex items-center justify-between gap-1">
                                <Link href={`/platform/patients/${patientIdMap[appt.patient] ?? "search"}`} className="font-semibold text-ink truncate text-xs hover:text-gold-deep transition-colors">{appt.patient}</Link>
                                {noShowRisk[appt.patient] && (
                                  <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[9px] font-bold ${riskStyle[noShowRisk[appt.patient].level]}`}>
                                    {noShowRisk[appt.patient].level}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate truncate mt-0.5 text-[10px]">{appt.procedure}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-[10px] font-semibold ${
                                  appt.status === "in-chair" ? "text-gold-deep"
                                  : appt.status === "completed" ? "text-mist" : "text-teal"
                                }`}>{appt.status}</span>
                                <Link href={`/platform/clinical?pid=${patientIdMap[appt.patient] ?? "p5"}`} className="text-[9px] text-mist hover:text-ink border border-line rounded px-1 py-0.5 transition-colors">Chart</Link>
                              </div>
                            </div>
                          ) : (
                            <div onClick={() => openBooking({ time: h, chair: c })} className="h-14 rounded-xl border border-dashed border-line flex items-center justify-center text-mist hover:border-gold/40 hover:bg-gold/5 cursor-pointer transition-colors">
                              <Icons.Plus className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card bg-white shadow-card overflow-hidden">
        <div className="border-b border-line px-5 py-3 flex items-center gap-2">
          <Icons.TrendingDown className="h-4 w-4 text-alert" />
          <span className="text-sm font-semibold text-ink">No-show predictor</span>
          <span className="ml-auto text-xs text-mist">Crown AI</span>
        </div>
        <div className="divide-y divide-line">
          {Object.keys(noShowRisk).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <p className="font-semibold text-ink">No appointments loaded</p>
              <p className="mt-1 text-sm text-slate">No-show risk scores appear once your schedule is connected.</p>
            </div>
          ) : (
            Object.entries(noShowRisk).map(([name, r]) => (
              <div key={name} className="flex items-center gap-4 px-5 py-3">
                <span className={`w-14 shrink-0 rounded border px-1.5 py-0.5 text-center text-[10px] font-bold ${riskStyle[r.level]}`}>{r.level}</span>
                <Link href={`/platform/patients/${patientIdMap[name] ?? "search"}`} className="text-sm font-medium text-ink hover:text-gold-deep transition-colors w-36 shrink-0">{name}</Link>
                <span className="text-xs text-slate">{r.reason}</span>
                {r.level === "High" && (
                  <button onClick={() => flash(`Calling ${name}…`)} className="ml-auto shrink-0 rounded-lg border border-alert/30 bg-alert/5 px-3 py-1 text-xs font-semibold text-alert hover:bg-alert/10 transition-colors">Call now</button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* New booked appointments (added this session) */}
      {newBookings.length > 0 && (
        <div className="card bg-white shadow-card overflow-hidden">
          <div className="border-b border-line px-5 py-3 flex items-center gap-2">
            <Icons.CheckCircle2 className="h-4 w-4 text-teal" />
            <span className="text-sm font-semibold text-ink">Newly Booked Today</span>
            <span className="ml-auto text-xs text-slate">{newBookings.length} appointment{newBookings.length > 1 ? "s" : ""}</span>
          </div>
          <div className="divide-y divide-line">
            {newBookings.map((b, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-12 shrink-0">
                  <p className="text-sm font-semibold text-ink">{b.time}</p>
                  <p className="text-[11px] text-mist">{b.duration}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{b.patient}</p>
                  <p className="text-xs text-slate">{b.procedure} · {b.provider} · {b.chair}</p>
                </div>
                <span className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-teal/10 text-teal">confirmed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showBooking && (
        <BookingModal
          prefill={bookPrefill}
          onClose={() => setShowBooking(false)}
          onBooked={handleBooked}
        />
      )}
    </div>
  );
}

