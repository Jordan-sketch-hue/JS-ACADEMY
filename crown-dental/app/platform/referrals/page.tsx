"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const initialReferrals: { id: string; patient: string; initials: string; to: string; specialty: string; reason: string; sent: string; status: string; updated: string }[] = [];

const statusStyle: Record<string, string> = {
  Pending:    "bg-gold/15 text-gold-deep",
  Accepted:   "bg-teal/10 text-teal",
  "In review":"bg-ink-3/10 text-ink-3",
  Completed:  "bg-surface text-slate border border-line",
};

const records = [
  { name: "Perio chart — Jun 2026",    type: "Clinical",  checked: true  },
  { name: "CBCT scan — Jan 2026",       type: "Imaging",   checked: true  },
  { name: "Treatment plan — implant",   type: "TX Plan",   checked: true  },
  { name: "Health history form",        type: "Medical",   checked: false },
  { name: "Insurance verification",     type: "Insurance", checked: false },
];

const allPatients: string[] = [];

const specialties = ["Oral Surgery", "Orthodontics", "Periodontics", "Endodontics", "Prosthodontics", "Pediatric Dentistry"];

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState(initialReferrals);
  const [composing, setComposing] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const [statusPicker, setStatusPicker] = useState(false);
  const [form, setForm] = useState({ patient: allPatients[0] ?? "", specialty: specialties[0], to: "", reason: "" });

  const active = referrals.find(r => r.id === selected);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function sendReferral() {
    if (!form.to.trim() || !form.reason.trim()) { flash("Please fill in the specialist and reason fields."); return; }
    const next = `REF-0${42 + referrals.length - 3}`;
    const initials = form.patient.split(" ").map(n => n[0]).join("").slice(0, 2);
    setReferrals(prev => [{
      id: next,
      patient: form.patient,
      initials,
      to: form.to.trim(),
      specialty: form.specialty,
      reason: form.reason.trim(),
      sent: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      status: "Pending",
      updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }, ...prev]);
    setSelected(next);
    setForm({ patient: allPatients[0], specialty: specialties[0], to: "", reason: "" });
    setComposing(false);
    flash(`Referral sent — ${form.patient} → ${form.specialty}.`);
  }

  function updateStatus(newStatus: string) {
    setReferrals(prev => prev.map(r => r.id === selected
      ? { ...r, status: newStatus, updated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }) }
      : r));
    setStatusPicker(false);
    flash(`Status updated to "${newStatus}".`);
  }

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Specialist Referrals</h1>
        <button onClick={() => setComposing(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.Send className="h-4 w-4" /> New referral
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Active referrals", v: String(referrals.filter(r => r.status !== "Completed").length), i: "ArrowRightLeft" },
          { l: "Awaiting response",v: String(referrals.filter(r => r.status === "Pending").length),   i: "Clock" },
          { l: "Completed (90d)",  v: String(referrals.filter(r => r.status === "Completed").length + 11), i: "CheckCircle2" },
          { l: "Avg response time",v: "2.4d", i: "Timer" },
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

      <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
        <div className="card bg-white shadow-card overflow-hidden">
          <div className="border-b border-line px-5 py-4 flex items-center gap-2">
            <Icons.ArrowRightLeft className="h-4 w-4 text-gold-deep" />
            <span className="font-semibold text-ink text-sm">All referrals</span>
          </div>
          <div className="divide-y divide-line">
            {referrals.map((r) => (
              <button key={r.id} onClick={() => setSelected(r.id)}
                className={`w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-surface transition-colors ${r.id === selected ? "bg-gold/5 border-l-2 border-l-gold" : ""}`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-deep to-gold text-xs font-bold text-white">{r.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 justify-between">
                    <p className="text-sm font-semibold text-ink">{r.patient}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[r.status] ?? "bg-surface text-slate"}`}>{r.status}</span>
                  </div>
                  <p className="text-xs text-slate mt-0.5 truncate">{r.to}</p>
                  <p className="text-[11px] text-mist mt-0.5">{r.reason} · Sent {r.sent}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {composing ? (
          <div className="card bg-white shadow-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink text-sm">New referral</span>
              <button onClick={() => setComposing(false)} className="text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1.5">Patient</label>
                <select value={form.patient} onChange={e => setForm(f => ({ ...f, patient: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {allPatients.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink block mb-1.5">Specialty</label>
                <select value={form.specialty} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {specialties.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink block mb-1.5">Referring to <span className="text-alert">*</span></label>
                <input value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))}
                  placeholder="Specialist name & practice"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink block mb-1.5">Reason for referral <span className="text-alert">*</span></label>
                <textarea rows={3} value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Clinical reason, urgency, specific request..."
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink block mb-2">Attach records</label>
                <div className="space-y-2">
                  {records.map((rec) => (
                    <label key={rec.name} className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 cursor-pointer hover:border-gold/40 transition-colors">
                      <input type="checkbox" defaultChecked={rec.checked} className="accent-gold-deep" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-ink">{rec.name}</p>
                      </div>
                      <span className="text-[10px] text-mist">{rec.type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setComposing(false)} className="flex-1 rounded-lg border border-line py-2.5 text-sm text-slate hover:bg-surface transition-colors">Cancel</button>
                <button onClick={sendReferral} className="flex-1 gold-btn rounded-lg py-2.5 text-sm shadow-gold">Send referral</button>
              </div>
            </div>
          </div>
        ) : active ? (
          <div className="card bg-white shadow-card overflow-hidden">
            <div className="border-b border-line px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink text-sm">{active.id}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle[active.status] ?? ""}`}>{active.status}</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-deep to-gold text-sm font-bold text-white">{active.initials}</div>
                <div><p className="font-semibold text-ink">{active.patient}</p><p className="text-xs text-slate">{active.specialty}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-surface p-3">
                <div><p className="text-[10px] text-mist uppercase tracking-wider">Sent</p><p className="text-sm font-medium text-ink">{active.sent}</p></div>
                <div><p className="text-[10px] text-mist uppercase tracking-wider">Updated</p><p className="text-sm font-medium text-ink">{active.updated}</p></div>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-xs font-semibold text-slate mb-1">Referring to</p>
                <p className="text-sm font-medium text-ink">{active.to}</p>
              </div>
              <div className="rounded-xl border border-line p-4">
                <p className="text-xs font-semibold text-slate mb-1">Reason</p>
                <p className="text-sm text-slate">{active.reason}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate mb-3">Status timeline</p>
                <div className="space-y-3">
                  {[
                    { label: "Referral sent", date: active.sent, done: true },
                    { label: "Specialist acknowledged", date: active.status !== "Pending" ? active.updated : null, done: active.status !== "Pending" },
                    { label: "Appointment scheduled", date: null, done: active.status === "Completed" },
                    { label: "Report received", date: null, done: active.status === "Completed" },
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${step.done ? "bg-teal text-white" : "bg-surface border border-line text-mist"}`}>
                        {step.done ? <Icons.Check className="h-3 w-3" /> : i + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${step.done ? "text-ink" : "text-mist"}`}>{step.label}</p>
                        {step.date && <p className="text-xs text-slate">{step.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 relative">
                <button onClick={() => flash(`Message sent to specialist at ${active.to}.`)} className="flex-1 rounded-lg border border-line py-2 text-xs text-slate hover:bg-surface transition-colors">Message specialist</button>
                <div className="flex-1 relative">
                  <button onClick={() => setStatusPicker(p => !p)} className="w-full gold-btn rounded-lg py-2 text-xs">Update status ▾</button>
                  {statusPicker && (
                    <div className="absolute bottom-full mb-1 right-0 w-44 rounded-xl border border-line bg-white shadow-xl overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2 duration-150">
                      {["Pending","Accepted","In review","Completed"].map(s => (
                        <button key={s} onClick={() => updateStatus(s)}
                          className="block w-full px-4 py-2.5 text-left text-sm hover:bg-surface transition-colors text-ink">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
