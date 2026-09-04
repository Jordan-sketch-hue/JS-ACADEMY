"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const FORM_TYPES = ["Intake", "Clinical", "Consent", "Review", "Admin"];

const initialForms = [
  { id: "f1", name: "New Patient Intake",           type: "Intake",   responses: 142, lastUsed: "Today",     status: "active", fields: 18 },
  { id: "f2", name: "Medical History Update",        type: "Clinical", responses: 89,  lastUsed: "Yesterday", status: "active", fields: 24 },
  { id: "f3", name: "Treatment Consent — Implant",   type: "Consent",  responses: 31,  lastUsed: "Jun 30",    status: "active", fields: 8  },
  { id: "f4", name: "HIPAA Authorization",           type: "Consent",  responses: 204, lastUsed: "Today",     status: "active", fields: 6  },
  { id: "f5", name: "Post-Visit Satisfaction",       type: "Review",   responses: 67,  lastUsed: "Jul 1",     status: "active", fields: 5  },
  { id: "f6", name: "Insurance Verification",        type: "Admin",    responses: 0,   lastUsed: "Never",     status: "draft",  fields: 12 },
];

const typeColors: Record<string, string> = {
  Intake:   "bg-teal/10 text-teal",
  Clinical: "bg-gold/10 text-gold-deep",
  Consent:  "bg-ink/8 text-ink",
  Review:   "bg-purple-50 text-purple-700",
  Admin:    "bg-slate/10 text-slate",
};

export default function FormsPage() {
  const [formList, setFormList] = useState(initialForms);
  const [tab, setTab] = useState<"all" | "drafts">("all");
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", type: "Intake", fields: "6" });
  const [previewForm, setPreviewForm] = useState<typeof initialForms[0] | null>(null);
  const [editForm, setEditForm] = useState<typeof initialForms[0] | null>(null);
  const [editName, setEditName] = useState("");

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function openEditForm(f: typeof initialForms[0]) { setEditForm(f); setEditName(f.name); }
  function saveEditForm() {
    if (!editForm || !editName.trim()) return;
    setFormList(prev => prev.map(f => f.id === editForm.id ? { ...f, name: editName.trim() } : f));
    setEditForm(null);
    flash("Form updated.");
  }

  function send(id: string, name: string) {
    setSentMap(prev => ({ ...prev, [id]: true }));
    flash(`"${name}" sent to patient via SMS.`);
    setTimeout(() => setSentMap(prev => ({ ...prev, [id]: false })), 4000);
  }

  function createForm() {
    if (!newForm.name.trim()) return;
    const id = `f${formList.length + 1}`;
    setFormList(prev => [...prev, {
      id, name: newForm.name.trim(), type: newForm.type,
      responses: 0, lastUsed: "Never", status: "draft", fields: Number(newForm.fields) || 6,
    }]);
    setNewForm({ name: "", type: "Intake", fields: "6" });
    setShowNew(false);
    flash(`Form "${newForm.name.trim()}" created as a draft.`);
  }

  const visible = tab === "drafts" ? formList.filter(f => f.status === "draft") : formList;

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      {previewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setPreviewForm(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="font-semibold text-ink">{previewForm.name}</p>
                <p className="text-xs text-slate mt-0.5">{previewForm.fields} fields · {previewForm.type}</p>
              </div>
              <button onClick={() => setPreviewForm(null)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div className="rounded-xl bg-surface p-4 space-y-3">
                {Array.from({ length: Math.min(previewForm.fields, 5) }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-3 w-24 rounded bg-line" />
                    <div className="h-8 w-full rounded-lg border border-line bg-white" />
                  </div>
                ))}
                {previewForm.fields > 5 && <p className="text-xs text-mist text-center">+ {previewForm.fields - 5} more fields</p>}
              </div>
              <p className="text-xs text-slate text-center">{previewForm.responses} responses · Last used {previewForm.lastUsed}</p>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setPreviewForm(null)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Close</button>
              <button onClick={() => { setPreviewForm(null); flash(`"${previewForm.name}" sent to patient via SMS.`); }} className="flex-1 gold-btn rounded-xl py-2.5 text-sm">Send to Patient</button>
            </div>
          </div>
        </div>
      )}

      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setEditForm(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink">Edit Form</span>
              <button onClick={() => setEditForm(null)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Form name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate mb-0.5">Type</p>
                <p className="text-sm text-slate">{editForm.type} · {editForm.fields} fields</p>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setEditForm(null)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={saveEditForm} disabled={!editName.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Save</button>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.FilePlus className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">New Form</span>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Form name <span className="text-alert">*</span></label>
                <input type="text" value={newForm.name} onChange={e => setNewForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Pediatric Health History"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Type</label>
                <select value={newForm.type} onChange={e => setNewForm(f => ({...f, type: e.target.value}))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {FORM_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Number of fields</label>
                <input type="number" value={newForm.fields} onChange={e => setNewForm(f => ({...f, fields: e.target.value}))}
                  min={1} max={50}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowNew(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={createForm} disabled={!newForm.name.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Create Form</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Digital Forms</h1>
          <p className="mt-1 text-sm text-slate">
            {formList.filter(f => f.status === "active").length} active forms ·{" "}
            {formList.reduce((s, f) => s + f.responses, 0).toLocaleString()} total submissions
          </p>
        </div>
        <button onClick={() => setShowNew(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.Plus className="h-4 w-4" /> New Form
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Completion Rate",  value: "91%",  icon: "CheckCircle2", color: "text-teal" },
          { label: "Avg Fill Time",    value: "3.2m", icon: "Timer",        color: "text-gold-deep" },
          { label: "Sent This Month",  value: "318",  icon: "Send",         color: "text-ink" },
          { label: "Pending Response", value: "14",   icon: "Clock",        color: "text-slate" },
        ].map(s => {
          const I = (Icons as any)[s.icon];
          return (
            <div key={s.label} className="card bg-white p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <I className={`h-4 w-4 ${s.color}`} strokeWidth={1.5} />
                <p className="text-xs text-slate">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-ink">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-1 border-b border-line">
        {(["all", "drafts"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-gold-deep text-gold-deep" : "border-transparent text-slate hover:text-ink"
            }`}>
            {t === "all" ? "All Forms" : "Drafts"}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden bg-white shadow-card">
        <div className="divide-y divide-line">
          {visible.map(form => (
            <div key={form.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-line shrink-0">
                <Icons.FileText className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <p className="text-sm font-semibold text-ink">{form.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColors[form.type]}`}>{form.type}</span>
                  {form.status === "draft" && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-yellow-50 text-yellow-700">Draft</span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate">{form.fields} fields · {form.responses} responses · Last used {form.lastUsed}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setPreviewForm(form)} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">
                  Preview
                </button>
                <button onClick={() => openEditForm(form)} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">
                  Edit
                </button>
                {sentMap[form.id] ? (
                  <span className="flex items-center gap-1 rounded-lg bg-teal/10 px-3 py-1.5 text-[11px] font-semibold text-teal">
                    <Icons.Check className="h-3 w-3" /> Sent
                  </span>
                ) : (
                  <button onClick={() => send(form.id, form.name)} className="gold-btn rounded-lg px-3 py-1.5 text-xs">
                    Send
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-white p-5 shadow-card">
        <h3 className="text-sm font-semibold text-ink mb-4">Send Channels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: "MessageSquare", label: "SMS Link",   sub: "Delivered via text" },
            { icon: "Mail",          label: "Email Link", sub: "Branded email" },
            { icon: "Tablet",        label: "Kiosk Mode", sub: "In-office tablet" },
          ].map(c => {
            const I = (Icons as any)[c.icon];
            return (
              <div key={c.label} className="flex items-center gap-3 rounded-xl border border-line p-4 hover:border-gold/40 cursor-pointer transition-colors group">
                <I className="h-5 w-5 text-gold-deep shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-ink">{c.label}</p>
                  <p className="text-xs text-slate">{c.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
