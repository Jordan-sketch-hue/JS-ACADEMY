"use client";

import { useState } from "react";
import { useReveal } from "../../lib/useReveal";

interface Props {
  heading?: string;
  subline?: string;
  services?: string[];
  onSubmit?: (data: BookingData) => Promise<void>;
}

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string;
}

const TIMES = [
  "9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM",
];

export function BookingWidget({
  heading = "Book an Appointment",
  subline,
  services = ["Consultation"],
  onSubmit,
}: Props) {
  const wrapRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState<BookingData>({
    name: "", email: "", phone: "", service: services[0] ?? "", date: "", time: "", notes: "",
  });

  const set = (k: keyof BookingData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await onSubmit?.(form);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const inputCls = "w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors";

  return (
    <section id="booking" className="py-20 px-6 bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-2xl">
        <div ref={wrapRef} data-reveal className="animate-up">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
            {subline && <p className="mt-2 text-sm text-[var(--text-muted)]">{subline}</p>}
          </div>

          {status === "success" ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">Booking Received</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">We&apos;ll confirm your appointment shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Name *</label>
                  <input required type="text" value={form.name} onChange={set("name")} className={inputCls} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Email *</label>
                  <input required type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@example.com" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Phone</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+1 876 000 0000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Service *</label>
                  <select required value={form.service} onChange={set("service")} className={inputCls}>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Date *</label>
                  <input required type="date" value={form.date} onChange={set("date")} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Time *</label>
                  <select required value={form.time} onChange={set("time")} className={inputCls}>
                    <option value="">Select time</option>
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wide">Notes</label>
                <textarea rows={3} value={form.notes} onChange={set("notes")} className={inputCls} placeholder="Anything we should know?" />
              </div>

              {status === "error" && (
                <p className="text-xs text-red-500">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-[var(--radius)] bg-[var(--accent)] py-3 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {status === "loading" ? "Booking…" : "Confirm Booking"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
