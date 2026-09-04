"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

type Role = "All staff" | "Front desk" | "Providers" | "Hygienists";
const roles: Role[] = ["All staff", "Front desk", "Providers", "Hygienists"];

const sections: Record<Role, { icon: string; color: string; title: string; items: string[] }[]> = {
  "All staff": [
    {
      icon: "CalendarClock", color: "text-gold-deep", title: "Today's schedule",
      items: [
        "No appointments loaded yet — connect your PMS to see today's schedule here.",
      ],
    },
    {
      icon: "Bot", color: "text-teal", title: "Crown AI overnight actions",
      items: [
        "No actions yet — Crown AI will report overnight activity here once your practice is connected.",
      ],
    },
  ],
  "Front desk": [
    {
      icon: "Users", color: "text-gold-deep", title: "Check-in order",
      items: ["No appointments loaded yet."],
    },
    {
      icon: "CreditCard", color: "text-ink-3", title: "Outstanding balances",
      items: ["No balance data loaded yet."],
    },
  ],
  "Providers": [
    {
      icon: "Stethoscope", color: "text-gold-deep", title: "Your patients today",
      items: ["No appointments loaded yet."],
    },
    {
      icon: "FlaskConical", color: "text-teal", title: "Lab cases",
      items: ["No lab cases pending."],
    },
  ],
  "Hygienists": [
    {
      icon: "HeartPulse", color: "text-gold-deep", title: "Hygiene chair today",
      items: ["No hygiene appointments loaded yet."],
    },
    {
      icon: "ClipboardList", color: "text-teal", title: "Periodontal flags",
      items: ["No perio flags to review."],
    },
  ],
};

export default function HuddlePage() {
  const [role, setRole] = useState<Role>("All staff");
  const [printed, setPrinted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Morning Huddle</h1>
          <p className="mt-1 text-sm text-slate">Crown AI daily briefing — connect your PMS to load live data.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setPrinted(true); flash("Huddle sheet printed."); }} disabled={printed}
            className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate shadow-card hover:border-gold/40 transition-colors disabled:opacity-60">
            <Icons.Printer className="h-4 w-4" /> {printed ? "Printed" : "Print"}
          </button>
        </div>
      </div>

      {/* Role filter */}
      <div className="flex gap-2 flex-wrap">
        {roles.map((r) => (
          <button key={r} onClick={() => setRole(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              role === r ? "bg-ink text-white" : "bg-surface text-slate hover:bg-line"
            }`}>
            {r}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections[role].map((sec) => {
          const I = (Icons as any)[sec.icon] ?? Icons.Circle;
          return (
            <div key={sec.title} className="card bg-white shadow-card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
                <I className={`h-4 w-4 ${sec.color}`} strokeWidth={1.5} />
                <span className="font-semibold text-sm text-ink">{sec.title}</span>
              </div>
              <ul className="divide-y divide-line">
                {sec.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 px-5 py-3.5">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-deep mt-2" />
                    <span className="text-sm text-slate leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
