"use client";

import { useState } from "react";
import { useReveal } from "../../lib/useReveal";

interface Props {
  heading?: string;
  subline?: string;
  services?: string[];
  budgetOptions?: string[];
  onSubmit?: (data: QuoteData) => Promise<void>;
}

export interface QuoteData {
  name: string; email: string; phone: string;
  service: string; budget: string; details: string;
}

export function QuoteForm({
  heading = "Request a Quote",
  subline,
  services = ["Consultation"],
  budgetOptions = ["Under $500", "$500–$1,000", "$1,000–$5,000", "$5,000+"],
  onSubmit,
}: Props) {
  const wrapRef = useReveal<HTMLDivElement>({ threshold: 0.1 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState<QuoteData>({ name: "", email: "", phone: "", service: services[0] ?? "", budget: budgetOptions[0] ?? "", details: "" });

  const set = (k: keyof QuoteData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try { await onSubmit?.(form); setStatus("success"); }
    catch { setStatus("error"); }
  };

  const inputCls = "w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors";
  const labelCls = "block text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-1";

  return (
    <section id="quote" className="py-20 px-6 bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-2xl">
        <div ref={wrapRef} data-reveal className="animate-up">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
            {subline && <p className="mt-2 text-sm text-[var(--text-muted)]">{subline}</p>}
          </div>

          {status === "success" ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center">
              <p className="text-xl font-bold text-[var(--text-primary)]">Quote Request Received</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">We&apos;ll prepare your estimate within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>Name *</label><input required type="text" value={form.name} onChange={set("name")} className={inputCls} placeholder="Your name" /></div>
                <div><label className={labelCls}>Email *</label><input required type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@example.com" /></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelCls}>Phone</label><input type="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+1 876 000 0000" /></div>
                <div><label className={labelCls}>Service *</label><select required value={form.service} onChange={set("service")} className={inputCls}>{services.map(s => <option key={s}>{s}</option>)}</select></div>
              </div>
              <div><label className={labelCls}>Budget Range</label><select value={form.budget} onChange={set("budget")} className={inputCls}>{budgetOptions.map(b => <option key={b}>{b}</option>)}</select></div>
              <div><label className={labelCls}>Project Details *</label><textarea required rows={4} value={form.details} onChange={set("details")} className={inputCls} placeholder="Describe what you need…" /></div>
              {status === "error" && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
              <button type="submit" disabled={status === "loading"} className="w-full rounded-[var(--radius)] bg-[var(--accent)] py-3 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity disabled:opacity-60">
                {status === "loading" ? "Submitting…" : "Request Quote"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
