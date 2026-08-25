"use client";

import { useState } from "react";
import { Send, Check, MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const whatsappHref = (() => {
    const lines = [
      "Hi Ship 2 Door JA! 👋",
      name && `Name: ${name}`,
      phone && `Phone: ${phone}`,
      message && `\n${message}`,
    ].filter(Boolean);
    return `${site.contact.whatsappHref}?text=${encodeURIComponent(lines.join("\n"))}`;
  })();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = await res.json();
      setStatus(data.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-navy placeholder:text-slate-400 outline-none transition-colors focus:border-sky focus:ring-2 focus:ring-sky/30";

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-emerald-50 p-8 text-center ring-1 ring-emerald-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-xl font-bold text-navy">Message sent!</h3>
        <p className="mt-2 text-slate-600">
          Thanks {name.split(" ")[0] || "there"} — we'll get back to you shortly. Check your
          inbox for a confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy">Your name</label>
          <input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Brown" className={field} />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy">Email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-navy">Phone / WhatsApp <span className="font-normal text-slate-400">(optional)</span></label>
        <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="876-000-0000" className={field} />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-navy">How can we help?</label>
        <textarea id="message" required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="I want to ship a package from Amazon — roughly 6 lb. What's my rate?" className={field} />
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700 ring-1 ring-amber-200">
          We couldn't send that just now — please try again, or reach us on WhatsApp below.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky px-6 py-3.5 text-base font-bold text-navy-deep shadow-lg shadow-sky/30 transition-all hover:bg-sky-light active:scale-[0.98] disabled:opacity-60"
        >
          <Send className="h-5 w-5" />
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-6 py-3.5 text-base font-bold text-navy transition-colors hover:bg-slate-200"
        >
          <MessageCircle className="h-5 w-5" /> WhatsApp
        </a>
      </div>
      <p className="text-xs text-slate-400">
        We'll reply by email or WhatsApp. Prefer email directly?{" "}
        <a href={site.contact.emailHref} className="font-semibold text-blue underline">{site.contact.email}</a>
      </p>
    </form>
  );
}
