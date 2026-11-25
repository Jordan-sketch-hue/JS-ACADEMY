"use client";

import { useState } from "react";
import { useReveal, useRevealChildren } from "../../lib/useReveal";

interface Props {
  heading?: string;
  subline?: string;
  phone?: string;
  email?: string;
  address?: string;
  onSubmit?: (data: ContactData) => Promise<void>;
}

export interface ContactData { name: string; email: string; phone: string; subject: string; message: string; }

export function ContactForm({ heading = "Get in Touch", subline, phone, email, address, onSubmit }: Props) {
  const headingRef = useReveal<HTMLDivElement>({ threshold: 0.2 });
  const fieldsRef  = useRevealChildren<HTMLDivElement>(".form-field", { threshold: 0.1 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState<ContactData>({ name: "", email: "", phone: "", subject: "", message: "" });

  const set = (k: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
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
    <section id="contact" className="py-20 px-6 bg-[var(--bg)]">
      <div className="mx-auto max-w-6xl grid gap-12 lg:grid-cols-2 items-start">

        {/* Info panel */}
        <div ref={headingRef} data-reveal className="animate-left">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{heading}</h2>
          {subline && <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">{subline}</p>}

          <dl className="mt-8 space-y-4">
            {phone && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Phone</dt>
                <dd><a href={`tel:${phone}`} className="text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">{phone}</a></dd>
              </div>
            )}
            {email && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Email</dt>
                <dd><a href={`mailto:${email}`} className="text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">{email}</a></dd>
              </div>
            )}
            {address && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Address</dt>
                <dd className="text-sm text-[var(--text-primary)] whitespace-pre-line">{address}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Form */}
        {status === "success" ? (
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] p-10 text-center">
            <p className="text-xl font-bold text-[var(--text-primary)]">Message Sent</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">We&apos;ll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div ref={fieldsRef} className="space-y-4">
              <div data-reveal className="form-field animate-up" style={{ "--i": 0 } as React.CSSProperties}>
                <label className={labelCls}>Name *</label>
                <input required type="text" value={form.name} onChange={set("name")} className={inputCls} placeholder="Your name" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div data-reveal className="form-field animate-up" style={{ "--i": 1 } as React.CSSProperties}>
                  <label className={labelCls}>Email *</label>
                  <input required type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@example.com" />
                </div>
                <div data-reveal className="form-field animate-up" style={{ "--i": 2 } as React.CSSProperties}>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder="+1 876 000 0000" />
                </div>
              </div>
              <div data-reveal className="form-field animate-up" style={{ "--i": 3 } as React.CSSProperties}>
                <label className={labelCls}>Subject</label>
                <input type="text" value={form.subject} onChange={set("subject")} className={inputCls} placeholder="How can we help?" />
              </div>
              <div data-reveal className="form-field animate-up" style={{ "--i": 4 } as React.CSSProperties}>
                <label className={labelCls}>Message *</label>
                <textarea required rows={5} value={form.message} onChange={set("message")} className={inputCls} placeholder="Tell us more…" />
              </div>
              {status === "error" && <p className="text-xs text-red-500">Something went wrong. Please try again.</p>}
              <div data-reveal className="form-field animate-up" style={{ "--i": 5 } as React.CSSProperties}>
                <button type="submit" disabled={status === "loading"} className="w-full rounded-[var(--radius)] bg-[var(--accent)] py-3 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity disabled:opacity-60">
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
