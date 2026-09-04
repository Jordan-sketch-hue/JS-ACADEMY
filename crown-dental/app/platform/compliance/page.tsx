"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const CATEGORIES = ["OSHA","HIPAA","Imaging","License","Infection","Safety","Training"];

const initialItems: { cat: string; name: string; due: string; daysLeft: number; status: string; assignee: string; notes: string }[] = [];

const statusStyle: Record<string, { pill: string; bar: string; icon: string }> = {
  ok:   { pill: "bg-teal/10 text-teal",    bar: "bg-teal",  icon: "CheckCircle2" },
  warn: { pill: "bg-gold/15 text-gold-deep",bar: "bg-gold", icon: "AlertTriangle" },
  red:  { pill: "bg-alert/10 text-alert",  bar: "bg-alert", icon: "XCircle" },
};

const catColor: Record<string, string> = {
  OSHA:      "bg-ink/8 text-ink",
  HIPAA:     "bg-gold/10 text-gold-deep",
  Imaging:   "bg-teal/10 text-teal",
  License:   "bg-surface text-slate border border-line",
  Infection: "bg-surface text-slate border border-line",
  Safety:    "bg-surface text-slate border border-line",
  Training:  "bg-surface text-slate border border-line",
};

export default function CompliancePage() {
  const [items, setItems] = useState(initialItems);
  const [toast, setToast] = useState<string | null>(null);
  const [remindedSet, setRemindedSet] = useState<Set<string>>(new Set());
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", cat: "OSHA", assignee: "", dueDate: "", notes: "" });
  const [editItem, setEditItem] = useState<typeof initialItems[0] | null>(null);
  const [editNotes, setEditNotes] = useState("");

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function openEditItem(item: typeof initialItems[0]) { setEditItem(item); setEditNotes(item.notes); }
  function saveEditItem() {
    if (!editItem) return;
    setItems(prev => prev.map(i => i.name === editItem.name ? { ...i, notes: editNotes } : i));
    setEditItem(null);
    flash("Compliance record updated.");
  }

  function remind(name: string, assignee: string) {
    setRemindedSet(prev => new Set([...prev, name]));
    flash(`Reminder sent to ${assignee}.`);
  }

  function addDeadline() {
    if (!form.name.trim() || !form.dueDate || !form.assignee.trim()) return;
    const due = new Date(form.dueDate);
    const today = new Date();
    const daysLeft = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const status = daysLeft < 0 ? "red" : daysLeft < 30 ? "warn" : "ok";
    setItems(prev => [{
      cat: form.cat, name: form.name.trim(), assignee: form.assignee.trim(),
      due: due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      daysLeft, status, notes: form.notes.trim(),
    }, ...prev]);
    setForm({ name: "", cat: "OSHA", assignee: "", dueDate: "", notes: "" });
    setShowNew(false);
    flash(`Compliance deadline "${form.name.trim()}" added.`);
  }

  const red  = items.filter(i => i.status === "red").length;
  const warn = items.filter(i => i.status === "warn").length;
  const ok   = items.filter(i => i.status === "ok").length;

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setEditItem(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink">Edit Compliance Record</span>
              <button onClick={() => setEditItem(null)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate mb-1">Requirement</p>
                <p className="text-sm text-ink">{editItem.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate mb-1">Assignee</p>
                <p className="text-sm text-slate">{editItem.assignee}</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Notes</label>
                <textarea rows={3} value={editNotes} onChange={e => setEditNotes(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-gold/60 focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setEditItem(null)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={saveEditItem} className="flex-1 gold-btn rounded-xl py-2.5 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.ShieldCheck className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">Add Compliance Deadline</span>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Item name <span className="text-alert">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Sterilizer spore test"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Category</label>
                  <select value={form.cat} onChange={e => setForm(f => ({...f, cat: e.target.value}))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Due date <span className="text-alert">*</span></label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(f => ({...f, dueDate: e.target.value}))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Assigned to <span className="text-alert">*</span></label>
                <input type="text" value={form.assignee} onChange={e => setForm(f => ({...f, assignee: e.target.value}))}
                  placeholder="e.g. Dr. Chen, All staff"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Notes</label>
                <input type="text" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                  placeholder="Optional instructions or links"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowNew(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={addDeadline} disabled={!form.name.trim() || !form.dueDate || !form.assignee.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Add Deadline</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Compliance Calendar</h1>
        <button onClick={() => setShowNew(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.Plus className="h-4 w-4" /> Add deadline
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "On track",    v: String(ok),          c: "text-teal",     i: "CheckCircle2" },
          { l: "Due soon",    v: String(warn),         c: "text-gold-deep",i: "AlertTriangle" },
          { l: "Overdue",     v: String(red),          c: "text-alert",    i: "XCircle" },
          { l: "Total items", v: String(items.length), c: "text-ink",      i: "ClipboardList" },
        ].map((s) => {
          const I = (Icons as any)[s.i] ?? Icons.Circle;
          return (
            <div key={s.l} className="card bg-white rounded-xl p-4 shadow-card flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface"><I className={`h-5 w-5 ${s.c}`} /></div>
              <div><p className="text-xs text-slate">{s.l}</p><p className="text-xl font-semibold text-ink">{s.v}</p></div>
            </div>
          );
        })}
      </div>

      {red > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-alert/30 bg-alert/5 p-4">
          <Icons.XCircle className="h-4 w-4 shrink-0 text-alert mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-ink">{red} overdue item{red > 1 ? "s" : ""} — action required</p>
            <p className="text-xs text-slate mt-0.5">Lisa Torres&apos; RDH license expired Jun 30. She cannot legally perform hygiene procedures until renewed.</p>
          </div>
          <button onClick={() => flash("Compliance alert sent to all assignees.")} className="shrink-0 gold-btn rounded-lg px-3 py-1.5 text-xs">Send alert</button>
        </div>
      )}

      <div className="card bg-white shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              {["Status","Item","Category","Due date","Days left","Assigned to",""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {[...items].sort((a, b) => a.daysLeft - b.daysLeft).map((item) => {
              const s = statusStyle[item.status];
              const I = (Icons as any)[s.icon];
              const reminded = remindedSet.has(item.name);
              return (
                <tr key={item.name} className="hover:bg-surface transition-colors">
                  <td className="px-5 py-3.5">
                    <I className={`h-4 w-4 ${item.status === "ok" ? "text-teal" : item.status === "warn" ? "text-gold-deep" : "text-alert"}`} />
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-slate mt-0.5">{item.notes}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${catColor[item.cat] ?? "bg-surface text-slate"}`}>{item.cat}</span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-ink">{item.due}</td>
                  <td className={`px-5 py-3.5 font-semibold ${item.daysLeft < 0 ? "text-alert" : item.daysLeft < 30 ? "text-gold-deep" : "text-teal"}`}>
                    {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)}d overdue` : `${item.daysLeft}d`}
                  </td>
                  <td className="px-5 py-3.5 text-slate">{item.assignee}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      <button onClick={() => openEditItem(item)} className="rounded-lg border border-line px-2.5 py-1 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">Edit</button>
                      {reminded ? (
                        <span className="flex items-center gap-1 rounded-lg bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
                          <Icons.Check className="h-3 w-3" /> Sent
                        </span>
                      ) : (
                        <button onClick={() => remind(item.name, item.assignee)} className="rounded-lg border border-line px-2.5 py-1 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">Remind</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
