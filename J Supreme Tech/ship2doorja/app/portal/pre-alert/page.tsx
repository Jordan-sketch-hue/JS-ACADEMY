"use client";

import { useState } from "react";
import { Bell, Check, Send } from "lucide-react";
import { site } from "@/lib/site";
import { me } from "@/lib/demo-data";

export default function PreAlertPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ store: "", desc: "", tracking: "", value: "", weight: "" });

  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-navy placeholder:text-slate-400 outline-none transition-colors focus:border-sky focus:ring-2 focus:ring-sky/30";

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200/80 sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-navy">Pre-alert received!</h1>
        <p className="mx-auto mt-2 max-w-sm text-slate-500">
          We'll watch for your {form.desc || "package"} from {form.store || "the store"} and
          notify you the moment it lands at our U.S. warehouse.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ store: "", desc: "", tracking: "", value: "", weight: "" }); }}
          className="mt-6 rounded-xl bg-sky px-5 py-3 text-sm font-bold text-navy-deep hover:bg-sky-light"
        >
          Pre-alert another package
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-gradient text-white">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">Pre-alert a package</h1>
          <p className="text-slate-500">Tell us what's coming so we can match it the second it arrives.</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          // Notify ops + send the customer a confirmation (best-effort).
          fetch("/api/pre-alert", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: me.name, email: me.email, ...form }),
          }).catch(() => {});
        }}
        className="mt-7 space-y-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200/80 sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy">Store</label>
            <input required value={form.store} onChange={set("store")} placeholder="Amazon" className={field} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy">U.S. tracking #</label>
            <input value={form.tracking} onChange={set("tracking")} placeholder="1Z999AA10123456784" className={field} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy">What is it?</label>
          <input required value={form.desc} onChange={set("desc")} placeholder="Wireless headphones" className={field} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy">Declared value (US$)</label>
            <input value={form.value} onChange={set("value")} placeholder="120" className={field} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy">Est. weight (lb)</label>
            <input value={form.weight} onChange={set("weight")} placeholder="2" className={field} />
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky px-6 py-3.5 text-base font-bold text-navy-deep shadow-lg shadow-sky/30 transition-colors hover:bg-sky-light">
            <Bell className="h-5 w-5" /> Submit pre-alert
          </button>
          <a
            href={site.contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3.5 text-base font-bold text-navy transition-colors hover:bg-slate-200"
          >
            <Send className="h-5 w-5" /> Send via WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
}
