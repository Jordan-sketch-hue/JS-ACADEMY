"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";

function getCompletedGuides(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem("crown-guides-v1") || "{}"); } catch { return {}; }
}

// Map module id → guide key (matches guides.ts keys)
const moduleGuideKey: Record<string, string> = {
  m1: "dashboard", m2: "schedule", m3: "patients", m4: "clinical",
  m5: "billing",   m6: "communications", m7: "analytics", m8: "ai-agent",
};

const modules = [
  {
    id: "m1",
    chapter: "Getting started",
    title: "Welcome to Crown Dental OS",
    duration: "4 min",
    icon: "Crown",
    color: "gold",
    href: "/platform",
    tags: ["Overview"],
    desc: "A high-level tour of the Crown platform — dashboard, sidebar navigation, and how all modules connect to build your practice's day.",
    steps: [
      "Sign in and personalise your dashboard",
      "Explore the sidebar and understand each module",
      "Set up your clinic locations and chair names",
      "Configure your provider list and working hours",
    ],
  },
  {
    id: "m2",
    chapter: "Scheduling",
    title: "Booking & schedule management",
    duration: "6 min",
    icon: "CalendarClock",
    color: "teal",
    href: "/platform/schedule",
    tags: ["Schedule", "AI"],
    desc: "Learn how Crown AI handles cancellations, waitlist backfill, and no-show prediction so your chairs stay full without manual effort.",
    steps: [
      "Navigate the daily schedule grid",
      "Book a new appointment manually",
      "Understand Crown AI waitlist backfill",
      "Read no-show risk scores and when to call",
    ],
  },
  {
    id: "m3",
    chapter: "Patients",
    title: "Patient records & clinical chart",
    duration: "8 min",
    icon: "Users",
    color: "ink",
    href: "/platform/patients",
    tags: ["Patients", "Clinical"],
    desc: "Everything in the patient record: medical history, perio snapshots, appointment timeline, treatment plans, and how to open the live clinical chart.",
    steps: [
      "Search and filter the patient list",
      "Open a patient record and review the header card",
      "Read the medical history, allergies, and meds panel",
      "Open the clinical chart from the patient detail page",
    ],
  },
  {
    id: "m4",
    chapter: "Clinical",
    title: "Clinical charting & treatment plans",
    duration: "10 min",
    icon: "Stethoscope",
    color: "violet",
    href: "/platform/clinical",
    tags: ["Clinical", "Treatment"],
    desc: "Voice charting, AI-assisted treatment plan drafting, perio scoring, and how to link procedures to billing in a single flow.",
    steps: [
      "Switch between patients in the clinical module",
      "Review procedure notes and fee breakdown",
      "Add a procedure to the treatment plan",
      "Check patient medications and allergy alerts",
    ],
  },
  {
    id: "m5",
    chapter: "Revenue cycle",
    title: "Billing & insurance",
    duration: "7 min",
    icon: "CreditCard",
    color: "gold",
    href: "/platform/billing",
    tags: ["Billing", "Insurance"],
    desc: "Follow an invoice from procedure to payment — insurance claims, co-pay collection, and the overdue alerts Crown sends automatically.",
    steps: [
      "Review the open invoices dashboard",
      "Understand the insurance breakdown column",
      "Collect a patient payment from the invoice detail",
      "Read the claims queue and pre-authorisation panel",
    ],
  },
  {
    id: "m6",
    chapter: "Communications",
    title: "Messaging & automations",
    duration: "5 min",
    icon: "MessageSquare",
    color: "teal",
    href: "/platform/communications",
    tags: ["Comms", "Automation"],
    desc: "Unified inbox for SMS, email, and phone logs. Learn how to reply to patients and how Crown's automation workflows send reminders without staff effort.",
    steps: [
      "Switch between Inbox, SMS, Email, and Phone Logs",
      "Click a thread to view the full conversation",
      "Reply from the compose bar",
      "Browse the Automations tab and toggle workflows on or off",
    ],
  },
  {
    id: "m7",
    chapter: "Intelligence",
    title: "Analytics, reports & Revenue Pulse",
    duration: "6 min",
    icon: "LineChart",
    color: "violet",
    href: "/platform/analytics",
    tags: ["Analytics", "Revenue"],
    desc: "Production vs. collections charts, provider scorecards, no-show trends, and the Revenue Pulse live ticker — all the numbers that run a healthy practice.",
    steps: [
      "Open the Analytics module and read the KPI strip",
      "Compare production vs. collections vs. target",
      "Filter by location, provider, or date range",
      "View Revenue Pulse for a real-time revenue breakdown",
    ],
  },
  {
    id: "m8",
    chapter: "Crown AI",
    title: "Crown AI — your autonomous front desk",
    duration: "9 min",
    icon: "Sparkles",
    color: "gold",
    href: "/platform/ai-agent",
    tags: ["AI", "Automation"],
    desc: "Crown AI handles scheduling calls, recall campaigns, eligibility checks, and treatment plan drafts around the clock. This module explains what it does, and when to review its work.",
    steps: [
      "Open the Crown AI module and read the live action feed",
      "Understand which tasks are fully autonomous vs. need review",
      "Set your AI confidence threshold in Settings",
      "Manually trigger a recall wave or waitlist fill",
    ],
  },
];

const colorAccent: Record<string, { bg: string; text: string; dot: string }> = {
  gold:   { bg: "bg-gold/10",    text: "text-gold-deep",  dot: "bg-gold" },
  teal:   { bg: "bg-teal/10",    text: "text-teal",       dot: "bg-teal" },
  ink:    { bg: "bg-surface",    text: "text-ink",        dot: "bg-ink" },
  violet: { bg: "bg-[#8B5CF6]/10", text: "text-[#8B5CF6]", dot: "bg-[#8B5CF6]" },
};

export default function TrainingPage() {
  const [activeId, setActiveId] = useState<string>("m1");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setCompleted(getCompletedGuides());
    const onStorage = () => setCompleted(getCompletedGuides());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const [toast, setToast] = useState<string | null>(null);
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const completedCount = modules.filter(m => completed[moduleGuideKey[m.id]]).length;
  const progressPct = Math.round((completedCount / modules.length) * 100);

  const active = modules.find((m) => m.id === activeId) ?? modules[0];
  const I_active = (Icons as any)[active.icon] ?? Icons.Circle;
  const accentA = colorAccent[active.color];

  const chapters = Array.from(new Set(modules.map((m) => m.chapter)));

  return (
    <div className="flex h-full relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm animate-in slide-in-from-top-2 duration-200">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      {/* Sidebar — module list */}
      <aside className="w-64 shrink-0 border-r border-line bg-white flex flex-col">
        <div className="border-b border-line px-4 py-4 space-y-2">
          <h2 className="font-semibold text-ink text-sm">Training Center</h2>
          <p className="text-xs text-slate">{modules.length} modules · ~55 min total</p>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-mist">Your progress</span>
              <span className="text-[10px] font-semibold text-gold-deep">{completedCount}/{modules.length} done</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
              <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-3">
          {chapters.map((ch) => (
            <div key={ch} className="mb-1">
              <p className="px-4 pb-1 pt-2 text-[10px] uppercase tracking-widest text-mist font-semibold">{ch}</p>
              {modules.filter((m) => m.chapter === ch).map((m) => {
                const Im = (Icons as any)[m.icon] ?? Icons.Circle;
                const acc = colorAccent[m.color];
                const isActive = m.id === activeId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveId(m.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isActive ? "bg-surface border-r-2 border-gold" : "hover:bg-surface/60"
                    }`}
                  >
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${acc.bg}`}>
                      <Im className={`h-3.5 w-3.5 ${acc.text}`} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-medium truncate ${isActive ? "text-ink" : "text-slate"}`}>{m.title}</p>
                      <p className="text-[10px] text-mist">{m.duration}</p>
                    </div>
                    {completed[moduleGuideKey[m.id]] && (
                      <Icons.CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-teal" strokeWidth={1.5} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accentA.bg}`}>
              <I_active className={`h-6 w-6 ${accentA.text}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-mist">{active.chapter}</p>
              <h1 className="text-xl font-semibold text-ink mt-0.5">{active.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Icons.Clock className="h-3.5 w-3.5 text-mist" strokeWidth={1.5} />
                <span className="text-xs text-slate">{active.duration}</span>
                {active.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] text-slate">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <Link
            href={active.href}
            className="shrink-0 gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            <Icons.ExternalLink className="h-4 w-4" /> Open in Crown
          </Link>
        </div>

        {/* Video placeholder */}
        <div
          className="card bg-ink overflow-hidden shadow-card-hover aspect-video flex flex-col items-center justify-center gap-4 relative cursor-pointer group"
          onClick={() => flash("Video player coming soon — use 'Open in Crown' to follow along live.")}
          role="button"
          aria-label={`Play ${active.title} walkthrough`}
        >
          <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${active.color === "gold" ? "from-gold to-transparent" : active.color === "teal" ? "from-teal to-transparent" : "from-[#8B5CF6] to-transparent"}`} />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
            <Icons.Play className="h-7 w-7 text-white ml-1" strokeWidth={1.5} />
          </div>
          <p className="relative text-white/70 text-sm">{active.title} · {active.duration} walkthrough</p>
          <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/10 rounded-full">
            <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${Math.round((modules.findIndex(m => m.id === activeId) / modules.length) * 100)}%` }} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          {/* Steps */}
          <div className="card bg-white p-6 shadow-card space-y-4">
            <h3 className="font-semibold text-ink">What you'll learn</h3>
            <p className="text-sm text-slate leading-relaxed">{active.desc}</p>
            <div className="space-y-2.5 pt-2">
              {active.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${accentA.dot}`}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-ink leading-snug">{step}</p>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-line flex items-center justify-between">
              <Link href={active.href} className="text-xs font-semibold text-gold-deep hover:underline flex items-center gap-1.5">
                <Icons.ArrowRight className="h-3.5 w-3.5" /> Go to {active.chapter} now
              </Link>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const idx = modules.findIndex((m) => m.id === activeId);
                    if (idx > 0) setActiveId(modules[idx - 1].id);
                  }}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:bg-surface transition-colors disabled:opacity-40"
                  disabled={activeId === modules[0].id}
                >
                  ← Prev
                </button>
                <button
                  onClick={() => {
                    const idx = modules.findIndex((m) => m.id === activeId);
                    if (idx < modules.length - 1) setActiveId(modules[idx + 1].id);
                  }}
                  className="gold-btn rounded-lg px-3 py-1.5 text-xs"
                  disabled={activeId === modules[modules.length - 1].id}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* All modules mini-list */}
          <div className="card bg-white shadow-card overflow-hidden">
            <div className="border-b border-line px-4 py-3">
              <p className="text-xs font-semibold text-ink">All modules</p>
            </div>
            <div className="divide-y divide-line">
              {modules.map((m, i) => {
                const Im = (Icons as any)[m.icon] ?? Icons.Circle;
                const acc = colorAccent[m.color];
                const isActive = m.id === activeId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveId(m.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isActive ? "bg-gold/5" : "hover:bg-surface"}`}
                  >
                    <span className="text-[10px] text-mist w-4 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${acc.bg}`}>
                      <Im className={`h-3 w-3 ${acc.text}`} strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs truncate ${isActive ? "font-semibold text-ink" : "text-slate"}`}>{m.title}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-mist">{m.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Crown AI quick-tip banner */}
        <div className="card bg-white p-4 shadow-card flex items-center gap-4 border-gold/20">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/10">
            <Icons.Sparkles className="h-4 w-4 text-gold-deep" />
          </div>
          <p className="text-sm text-slate flex-1">
            <span className="font-semibold text-ink">Tip: </span>
            Every Crown module has a live <span className="font-semibold text-ink">Crown AI</span> panel — look for the{" "}
            <span className="inline-flex items-center gap-0.5 rounded-full bg-teal/10 px-1.5 py-0.5 text-[10px] font-bold text-teal">● Live</span>{" "}
            badge to see what the AI did in the last hour.
          </p>
          <Link href="/platform/ai-agent" className="shrink-0 rounded-lg border border-gold/30 bg-gold/5 px-3 py-1.5 text-xs font-semibold text-gold-deep hover:bg-gold/10 transition-colors">
            Open Crown AI
          </Link>
        </div>
      </div>
    </div>
  );
}
