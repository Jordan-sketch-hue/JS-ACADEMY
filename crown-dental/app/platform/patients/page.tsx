"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { patients } from "@/lib/data";

const crownScore: Record<string, number> = {
  p1: 87, p2: 72, p3: 91, p4: 58, p5: 64, p6: 80, p7: 74, p8: 61,
};
const scoreColor = (s: number) =>
  s >= 80 ? "text-teal" : s >= 65 ? "text-gold-deep" : "text-alert";

const riskPill: Record<string, string> = {
  low:      "bg-teal/10 text-teal",
  moderate: "bg-gold/15 text-gold-deep",
  high:     "bg-alert/10 text-alert",
};

const PLANS = ["Crown Care+", "PPO — Delta", "PPO — Cigna", "Self-pay", "HMO"];
const PROVIDERS: string[] = [];

export default function PatientsPage() {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [patientList, setPatientList] = useState<any[]>(patients);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", dob: "", phone: "", email: "", plan: "Crown Care+", provider: "" });

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function addPatient() {
    if (!form.name.trim()) return;
    const id = `p${patientList.length + 1}`;
    setPatientList(prev => [...prev, {
      id, name: form.name.trim(), age: "—", dob: form.dob, phone: form.phone,
      email: form.email, plan: form.plan, provider: form.provider,
      lastVisit: "New", nextDue: "TBD", risk: "low", balance: 0, ltv: 0, tags: ["New Patient"],
    }]);
    setForm({ name: "", dob: "", phone: "", email: "", plan: "Crown Care+", provider: "" });
    setShowNew(false);
    flash(`New patient "${form.name.trim()}" added to records.`);
  }

  const filtered = query.trim()
    ? patientList.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.plan.toLowerCase().includes(query.toLowerCase()) ||
        (p.tags ?? []).some((t: string) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : patientList;

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Patient Records</h1>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm shadow-card focus-within:border-gold/40 transition-colors">
            <Icons.Search className="h-4 w-4 text-mist shrink-0" />
            <input
              type="text"
              placeholder="Search patients…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-sm text-ink placeholder:text-mist outline-none w-44"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-mist hover:text-ink">
                <Icons.X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button onClick={() => setShowNew(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.UserPlus className="h-4 w-4" /> New patient
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Active patients",      v: patientList.length > 0 ? String(patientList.length) : "—", i: "Users",         c: "text-ink" },
          { l: "High-risk",            v: "—",      i: "AlertTriangle", c: "text-alert" },
          { l: "Overdue recall",       v: "—",      i: "CalendarX",     c: "text-gold-deep" },
          { l: "Outstanding balance",  v: "—",      i: "Banknote",      c: "text-ink" },
        ].map((s) => {
          const I = (Icons as any)[s.i] ?? Icons.Circle;
          return (
            <div key={s.l} className="card bg-white rounded-xl p-4 shadow-card flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface">
                <I className={`h-5 w-5 ${s.c}`} />
              </div>
              <div>
                <p className="text-xs text-slate">{s.l}</p>
                <p className="text-xl font-semibold text-ink">{s.v}</p>
              </div>
            </div>
          );
        })}
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.UserPlus className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">New Patient</span>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate mb-1.5">Full name <span className="text-alert">*</span></label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    placeholder="e.g. Jordan Smith"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Date of birth</label>
                  <input type="date" value={form.dob} onChange={e => setForm(f => ({...f, dob: e.target.value}))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                    placeholder="(876) 555-0000"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder="patient@email.com"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Insurance plan</label>
                  <select value={form.plan} onChange={e => setForm(f => ({...f, plan: e.target.value}))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                    {PLANS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Assign provider</label>
                  <select value={form.provider} onChange={e => setForm(f => ({...f, provider: e.target.value}))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                    {PROVIDERS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowNew(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={addPatient} disabled={!form.name.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Add Patient</button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden bg-white shadow-card">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate">
            <Icons.SearchX className="h-8 w-8 mb-3 text-mist" />
            <p className="text-sm">No patients match &ldquo;{query}&rdquo;</p>
            <button onClick={() => setQuery("")} className="mt-2 text-xs text-gold-deep hover:underline">Clear search</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface">
                {["Patient","Age","Last Visit","Next Due","Crown Score™","Risk","Balance","LTV","Plan","Tags",""].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-mist">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface transition-colors cursor-pointer">
                  <td className="px-4 py-3.5">
                    <Link href={`/platform/patients/${p.id}`} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold text-xs font-bold text-white">
                        {p.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-ink hover:text-gold-deep transition-colors">{p.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-slate">{p.age}</td>
                  <td className="px-4 py-3.5 text-slate">{p.lastVisit}</td>
                  <td className={`px-4 py-3.5 font-medium ${p.nextDue === "Overdue" ? "text-alert" : "text-slate"}`}>{p.nextDue}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-bold ${scoreColor(crownScore[p.id] ?? 0)}`}>{crownScore[p.id] ?? "—"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${riskPill[p.risk]}`}>{p.risk}</span>
                  </td>
                  <td className={`px-4 py-3.5 font-semibold ${p.balance > 0 ? "text-alert" : "text-teal"}`}>
                    {p.balance > 0 ? `$${p.balance}` : "Clear"}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-ink">${p.ltv.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-xs text-slate">{p.plan}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t: string) => (
                        <span key={t} className="rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] text-slate">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/platform/patients/${p.id}`} className="rounded-lg border border-line bg-white px-3 py-1 text-xs font-medium text-ink hover:bg-surface hover:border-gold/40 transition-colors">
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
