"use client";

import { useState } from "react";
import { useReveal } from "../../lib/useReveal";

interface Props {
  heading?: string;
  subline?: string;
  ctaLabel?: string;
  tags?: string[];
  onSubmit?: (data: LeadData) => Promise<void>;
}

export interface LeadData { name: string; email: string; phone: string; interest: string; }

export function LeadCaptureForm({
  heading = "Let’s Talk",
  subline,
  ctaLabel = "Get a Free Quote",
  tags = [],
  onSubmit,
}: Props) {
  const wrapRef = useReveal<HTMLDivElement>({ threshold: 0.15 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [form, setForm] = useState<LeadData>({ name: "", email: "", phone: "", interest: "" });

  const set = (k: keyof LeadData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try { await onSubmit?.(form); setStatus("success"); }
    catch { setStatus("error"); }
  };

  const inputCls = "w-full rounded-[var(--radius)] border border-[var(--border)] bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--accent)] transition-colors";

  return (
    <section id="lead" className="py-20 px-6 bg-[var(--accent)]">
      <div className="mx-auto max-w-2xl text-center">
        <div ref={wrapRef} data-reveal className="animate-up">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">{heading}</h2>
          {subline && <p className="mt-3 text-sm text-white/70">{subline}</p>}

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {tags.map(t => (
                <span key={t} className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  {t}
                </span>
              ))}
            </div>
          )}

          {status === "success" ? (
            <div className="mt-10 rounded-[var(--radius-lg)] border border-white/20 bg-white/10 p-8">
              <p className="text-xl font-bold text-white">You&apos;re on the list!</p>
              <p className="mt-2 text-sm text-white/70">We&apos;ll be in touch very soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input required type="text" placeholder="Your name" value={form.name} onChange={set("name")} className={inputCls} />
                <input required type="email" placeholder="Email address" value={form.email} onChange={set("email")} className={inputCls} />
              </div>
              <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={set("phone")} className={inputCls} />
              <input type="text" placeholder="What are you interested in?" value={form.interest} onChange={set("interest")} className={inputCls} />
              {status === "error" && <p className="text-xs text-red-200">Something went wrong. Please try again.</p>}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-[var(--radius)] bg-white py-3.5 text-sm font-black uppercase tracking-widest text-[var(--accent)] hover:bg-white/90 transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : ctaLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
