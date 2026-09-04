"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";

const patientIdMap: Record<string, string> = {};

const PATIENTS: string[] = [];
const LABS = ["Ivoclar Digital","3M Oral Care","Nobel Biocare","Glidewell","Patterson Dental","Dentsply Sirona","Danaher Labs"];

const initialCases: { id: string; patient: string; lab: string; item: string; sent: string; due: string; status: string; urgent: boolean }[] = [];

const statusStyle: Record<string, string> = {
  "In fabrication": "bg-gold/15 text-gold-deep",
  "Ready to seat":  "bg-teal/10 text-teal",
  "Shipped":        "bg-ink/8 text-ink",
  "Delivered":      "bg-surface text-slate border border-line",
};

export default function LabsPage() {
  const [caseList, setCaseList] = useState(initialCases);
  const [toast, setToast] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ patient: "", lab: LABS[0], item: "", sentDate: new Date().toISOString().slice(0,10), dueDate: "", urgent: false });

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function addCase() {
    if (!form.patient || !form.item || !form.dueDate) return;
    const id = `LC-${222 + caseList.length}`;
    const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setCaseList(prev => [{
      id, patient: form.patient, lab: form.lab, item: form.item,
      sent: fmtDate(form.sentDate), due: fmtDate(form.dueDate),
      status: "In fabrication", urgent: form.urgent,
    }, ...prev]);
    setForm({ patient: "", lab: LABS[0], item: "", sentDate: new Date().toISOString().slice(0,10), dueDate: "", urgent: false });
    setShowNew(false);
    flash(`Lab case ${id} created "" sent to ${form.lab}.`);
  }

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Lab Cases</h1>
        <button onClick={() => setShowNew(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.Plus className="h-4 w-4" /> New lab case
        </button>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.FlaskConical className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">New Lab Case</span>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Patient <span className="text-alert">*</span></label>
                <select value={form.patient} onChange={e => setForm(f => ({...f, patient: e.target.value}))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  <option value="">Select patient...</option>
                  {PATIENTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Lab <span className="text-alert">*</span></label>
                <select value={form.lab} onChange={e => setForm(f => ({...f, lab: e.target.value}))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {LABS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Item / Description <span className="text-alert">*</span></label>
                <input type="text" value={form.item} onChange={e => setForm(f => ({...f, item: e.target.value}))}
                  placeholder="e.g. PFM Crown #14, Night guard..."
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Date sent</label>
                  <input type="date" value={form.sentDate} onChange={e => setForm(f => ({...f, sentDate: e.target.value}))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Due date <span className="text-alert">*</span></label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(f => ({...f, dueDate: e.target.value}))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.urgent} onChange={e => setForm(f => ({...f, urgent: e.target.checked}))}
                  className="h-4 w-4 rounded border-line accent-gold-deep" />
                <span className="text-sm text-slate">Mark as urgent</span>
              </label>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowNew(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={addCase} disabled={!form.patient || !form.item || !form.dueDate} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Create Case</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Active cases",   v: String(caseList.filter(c => c.status !== "Delivered").length), i: "FlaskConical" },
          { l: "Due this week",  v: "3",  i: "Clock" },
          { l: "Ready to seat",  v: String(caseList.filter(c => c.status === "Ready to seat").length), i: "CheckCircle2" },
          { l: "Avg turnaround", v: "6d", i: "CalendarClock" },
        ].map((s) => {
          const I = (Icons as any)[s.i] ?? Icons.Circle;
          return (
            <div key={s.l} className="card bg-white rounded-xl p-4 shadow-card flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface"><I className="h-5 w-5 text-gold-deep" /></div>
              <div><p className="text-xs text-slate">{s.l}</p><p className="text-xl font-semibold text-ink">{s.v}</p></div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              {["Case ID","Patient","Lab","Item","Sent","Due","Status",""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {caseList.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                      <Icons.FlaskConical className="h-7 w-7 text-mist" strokeWidth={1.5} />
                    </div>
                    <p className="font-semibold text-ink">No lab cases</p>
                    <p className="mt-1 text-sm text-slate">Data will appear here once connected to your practice system.</p>
                  </div>
                </td>
              </tr>
            ) : (
              caseList.map((c) => (
                <tr key={c.id} className="hover:bg-surface transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-mist">{c.id}</td>
                  <td className="px-5 py-3 font-medium text-ink">
                    <div className="flex items-center gap-2">
                      {c.urgent && <span className="h-1.5 w-1.5 rounded-full bg-alert" />}
                      {c.patient}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate">{c.lab}</td>
                  <td className="px-5 py-3 text-slate">{c.item}</td>
                  <td className="px-5 py-3 text-mist">{c.sent}</td>
                  <td className={`px-5 py-3 font-medium ${c.status === "Ready to seat" ? "text-teal" : "text-slate"}`}>{c.due}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Link href={`/platform/patients/${patientIdMap[c.patient] ?? "search"}`} className="rounded-lg border border-line px-3 py-1 text-xs text-ink hover:bg-surface hover:border-gold/40 transition-colors">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

