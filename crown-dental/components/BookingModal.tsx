"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

export interface BookedAppointment {
  patient: string;
  date: string;
  time: string;
  chair: string;
  procedure: string;
  provider: string;
  duration: string;
}

interface BookingModalProps {
  prefill?: { time?: string; chair?: string; patient?: string };
  onClose: () => void;
  onBooked: (appt: BookedAppointment) => void;
}

const PATIENTS: string[] = [];
const TIMES = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00",
];
const CHAIRS = ["Op 1", "Op 2", "Op 3", "Hygiene 1", "Hygiene 2"];
const PROVIDERS: string[] = [];
const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "90 min", "120 min"];

export function BookingModal({ prefill, onClose, onBooked }: BookingModalProps) {
  const [patient, setPatient]     = useState(prefill?.patient ?? "");
  const [date, setDate]           = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime]           = useState(prefill?.time ?? "");
  const [chair, setChair]         = useState(prefill?.chair ?? "");
  const [procedure, setProcedure] = useState("");
  const [provider, setProvider]   = useState("");
  const [duration, setDuration]   = useState("60 min");

  const valid = !!(patient && date && time && chair && procedure && provider);

  function submit() {
    if (!valid) return;
    onBooked({ patient, date, time, chair, procedure, provider, duration });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <Icons.CalendarPlus className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
            <span className="font-semibold text-ink">New Appointment</span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-mist hover:text-ink transition-colors">
            <Icons.X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Patient */}
          <div>
            <label className="block text-xs font-semibold text-slate mb-1.5">
              Patient <span className="text-alert">*</span>
            </label>
            <select
              value={patient}
              onChange={(e) => setPatient(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
            >
              <option value="">Select patient…</option>
              {PATIENTS.map((p) => <option key={p}>{p}</option>)}
              <option value="Walk-in (new)">Walk-in (new patient)</option>
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate mb-1.5">
                Date <span className="text-alert">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate mb-1.5">
                Time <span className="text-alert">*</span>
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
              >
                <option value="">Select…</option>
                {TIMES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Chair + Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate mb-1.5">
                Operatory <span className="text-alert">*</span>
              </label>
              <select
                value={chair}
                onChange={(e) => setChair(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
              >
                <option value="">Select…</option>
                {CHAIRS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate mb-1.5">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
              >
                {DURATIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Procedure */}
          <div>
            <label className="block text-xs font-semibold text-slate mb-1.5">
              Procedure <span className="text-alert">*</span>
            </label>
            <input
              type="text"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              placeholder="e.g. Crown seat #14, Hygiene, Exam + X-rays…"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
            />
          </div>

          {/* Provider */}
          <div>
            <label className="block text-xs font-semibold text-slate mb-1.5">
              Provider <span className="text-alert">*</span>
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
            >
              <option value="">Assign provider…</option>
              {PROVIDERS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate mb-1.5">Notes (optional)</label>
            <textarea
              rows={2}
              placeholder="Any special instructions or pre-appointment notes…"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-line px-5 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!valid}
            className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
