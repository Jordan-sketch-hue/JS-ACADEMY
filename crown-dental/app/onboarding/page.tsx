import Link from "next/link";
import * as Icons from "lucide-react";
import { Logo } from "@/components/Logo";

const steps = [
  { n: 1, label: "Practice info",    icon: "Building2",    done: true  },
  { n: 2, label: "Team & providers", icon: "Users",        done: true  },
  { n: 3, label: "Insurance setup",  icon: "FileText",     done: false, active: true },
  { n: 4, label: "AI configuration", icon: "Bot",          done: false },
  { n: 5, label: "Launch",           icon: "Rocket",       done: false },
];

const plans = [
  { id: "delta",   name: "Delta Dental",  logo: "D" },
  { id: "cigna",   name: "Cigna Dental",  logo: "C" },
  { id: "bcbs",    name: "BCBS",          logo: "B" },
  { id: "aetna",   name: "Aetna",         logo: "A" },
  { id: "united",  name: "United HC",     logo: "U" },
  { id: "guardian",name: "Guardian",      logo: "G" },
];

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="border-b border-line bg-white px-6 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2 text-xs text-mist">
          <Icons.ShieldCheck className="h-3.5 w-3.5 text-teal" />
          HIPAA-secure setup
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Stepper sidebar */}
        <aside className="w-64 shrink-0 border-r border-line bg-white p-6 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-mist mb-4">Setup progress</p>
          {steps.map((s) => {
            const I = (Icons as any)[s.icon] ?? Icons.Circle;
            return (
              <div key={s.n} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${s.active ? "bg-gold/8 border border-gold/30" : ""}`}>
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  s.done ? "bg-teal text-white" : s.active ? "bg-gold text-white" : "bg-surface text-mist border border-line"
                }`}>
                  {s.done ? <Icons.Check className="h-3.5 w-3.5" /> : s.n}
                </div>
                <div>
                  <p className={`text-sm font-medium ${s.active ? "text-ink" : s.done ? "text-slate" : "text-mist"}`}>{s.label}</p>
                </div>
              </div>
            );
          })}

          <div className="pt-4 mt-4 border-t border-line">
            <div className="h-1.5 overflow-hidden rounded-full bg-surface">
              <div className="h-full w-2/5 rounded-full bg-gold" />
            </div>
            <p className="mt-1.5 text-xs text-slate">Step 3 of 5 · ~4 min left</p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-8 max-w-2xl">
          <div className="mb-7">
            <span className="eyebrow">Step 3</span>
            <h1 className="section-heading mt-2 text-2xl">Connect your insurance payers</h1>
            <p className="mt-2 text-sm text-slate">Crown auto-verifies eligibility and scrubs claims for every payer you add. Select all that apply.</p>
          </div>

          {/* Payer grid */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {plans.map((p) => (
              <label key={p.id} className="relative cursor-pointer">
                <input type="checkbox" className="peer sr-only" defaultChecked={["delta","cigna"].includes(p.id)} />
                <div className="card bg-white p-4 flex items-center gap-3 rounded-xl shadow-card peer-checked:border-gold/60 peer-checked:bg-gold/5 transition-all hover:shadow-card-hover">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink text-xs font-bold text-white">{p.logo}</div>
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                  <Icons.Check className="ml-auto h-4 w-4 text-gold-deep opacity-0 peer-checked:opacity-100 hidden" />
                </div>
                <div className="absolute top-2 right-2 hidden peer-checked:block">
                  <Icons.CheckCircle2 className="h-4 w-4 text-teal" />
                </div>
              </label>
            ))}
          </div>

          {/* Clearinghouse */}
          <div className="card bg-white p-5 shadow-card mb-6">
            <p className="text-sm font-semibold text-ink mb-3">Clearinghouse connection</p>
            <div className="grid grid-cols-2 gap-3">
              {["Availity", "Change Healthcare", "Waystar", "Claim.MD"].map((c) => (
                <label key={c} className="flex items-center gap-2.5 rounded-lg border border-line bg-surface p-3 cursor-pointer hover:border-gold/40 transition-colors">
                  <input type="radio" name="ch" defaultChecked={c === "Availity"} className="accent-gold-deep" />
                  <span className="text-sm text-ink">{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="rounded-full border border-line px-5 py-2.5 text-sm text-slate hover:bg-surface transition-colors">
              ← Back
            </button>
            <Link href="/platform" className="gold-btn rounded-full px-6 py-2.5 text-sm shadow-gold transition hover:shadow-lg">
              Save & continue →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
