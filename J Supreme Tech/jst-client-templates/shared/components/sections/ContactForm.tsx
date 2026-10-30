/**
 * ContactForm — submits lead data to Supabase ct_leads table.
 * Sends slug as clientId for reliable lookup.
 */
"use client";
import { useState } from "react";
import { Button } from "@shared/components/ui/Button";
import type { ClientConfig } from "@shared/types/config";

interface Props { config: ClientConfig; slug: string; }
interface FormState { name: string; phone: string; email: string; message: string; }
interface Errors { name?: string; phone?: string; message?: string; }

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Name is required";
  if (!f.phone.trim()) e.phone = "Phone is required";
  if (!f.message.trim()) e.message = "Message is required";
  return e;
}

export function ContactForm({ config, slug }: Props) {
  const [form, setForm] = useState<FormState>({ name: "", phone: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, clientId: slug }),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputCls = "w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";
  const errCls = "mt-1 text-xs text-red-500";

  if (status === "success") {
    return (
      <section id="contact" className="py-20 px-6 bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-2xl font-bold text-[var(--text-primary)]">Message received!</p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            We will get back to you shortly. You can also reach us directly at{" "}
            <a href={`tel:${config.contact.phone}`} className="text-[var(--accent)] font-semibold">{config.contact.phone}</a>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 px-6 bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-xl">
        <h2 className="mb-8 text-3xl font-bold text-[var(--text-primary)]">Get in Touch</h2>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <input type="text" placeholder="Your name *" value={form.name} onChange={set("name")} className={inputCls} />
            {errors.name && <p className={errCls}>{errors.name}</p>}
          </div>
          <div>
            <input type="tel" placeholder="Phone number *" value={form.phone} onChange={set("phone")} className={inputCls} />
            {errors.phone && <p className={errCls}>{errors.phone}</p>}
          </div>
          <div>
            <input type="email" placeholder="Email (optional)" value={form.email} onChange={set("email")} className={inputCls} />
          </div>
          <div>
            <textarea placeholder="Message *" rows={4} value={form.message} onChange={set("message")} className={inputCls} />
            {errors.message && <p className={errCls}>{errors.message}</p>}
          </div>
          <Button type="submit" variant="primary" size="lg" disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Sending..." : "Send Message"}
          </Button>
          {status === "error" && (
            <p className="text-center text-sm text-red-500">Something went wrong. Please try again or call us directly.</p>
          )}
        </form>
        <div className="mt-6 space-y-1 text-sm text-[var(--text-secondary)]">
          {config.contact.address && <p>📍 {config.contact.address}</p>}
          <p>📞 <a href={`tel:${config.contact.phone}`} className="text-[var(--accent)]">{config.contact.phone}</a></p>
          {config.contact.email && <p>✉️ <a href={`mailto:${config.contact.email}`} className="text-[var(--accent)]">{config.contact.email}</a></p>}
        </div>
      </div>
    </section>
  );
}
