"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";

const initialTeam: { name: string; role: string; type: string; npi: string | null; pts: number | null; prod: string | null; status: string; avatar: string }[] = [];

const typeColor: Record<string, string> = {
  Provider: "bg-gold/10 text-gold-deep",
  Clinical: "bg-teal/10 text-teal",
  Admin:    "bg-surface text-slate border border-line",
};

const ROLES = ["Lead Dentist","Orthodontist","Dental Hygienist","Associate Dentist","Treatment Coord.","Front Desk","Office Manager"];
const TYPES = ["Provider","Clinical","Admin"] as const;

export default function TeamPage() {
  const router = useRouter();
  const [team, setTeam] = useState(initialTeam);
  const [toast, setToast] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: ROLES[0], type: "Admin" as typeof TYPES[number] });
  const [editMember, setEditMember] = useState<typeof initialTeam[0] | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "", status: "" });

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function invite() {
    if (!inviteForm.name || !inviteForm.email) return;
    const initials = inviteForm.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    setTeam(prev => [...prev, { name: inviteForm.name, role: inviteForm.role, type: inviteForm.type, npi: null, pts: null, prod: null, status: "Invited", avatar: initials }]);
    setShowInvite(false);
    setInviteForm({ name: "", email: "", role: ROLES[0], type: "Admin" });
    flash(`Invite sent to ${inviteForm.email}.`);
  }

  function openEdit(m: typeof initialTeam[0]) {
    setEditMember(m);
    setEditForm({ name: m.name, role: m.role, status: m.status });
  }

  function saveEdit() {
    if (!editMember) return;
    setTeam(prev => prev.map(m => m.name === editMember.name ? { ...m, name: editForm.name, role: editForm.role, status: editForm.status } : m));
    setEditMember(null);
    flash("Profile updated.");
  }

  return (
    <div className="p-6 space-y-5">
      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowInvite(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink">Invite Team Member</span>
              <button onClick={() => setShowInvite(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              {[{ label: "Full name", key: "name", type: "text" }, { label: "Email address", key: "email", type: "email" }].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate mb-1.5">{label} <span className="text-alert">*</span></label>
                  <input type={type} value={(inviteForm as any)[key]} onChange={e => setInviteForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Role</label>
                <select value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Type</label>
                <div className="flex gap-2">
                  {TYPES.map(t => (
                    <button key={t} onClick={() => setInviteForm(f => ({ ...f, type: t }))}
                      className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors ${inviteForm.type === t ? "border-gold/60 bg-gold/5 text-gold-deep" : "border-line text-slate hover:bg-surface"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowInvite(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={invite} disabled={!inviteForm.name || !inviteForm.email} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Send Invite</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setEditMember(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink">Edit Profile — {editMember.name}</span>
              <button onClick={() => setEditMember(null)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Full name</label>
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Role</label>
                <select value={editForm.role} onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Status</label>
                <select value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {["Active","On leave","Inactive","Invited"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setEditMember(null)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={saveEdit} className="flex-1 gold-btn rounded-xl py-2.5 text-sm">Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Team</h1>
        <button onClick={() => setShowInvite(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.UserPlus className="h-4 w-4" /> Invite member
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Total members",     v: String(team.length), i: "Users" },
          { l: "Providers",         v: String(team.filter(m => m.type === "Provider").length), i: "Stethoscope" },
          { l: "MTD production",    v: "$151k", i: "TrendingUp" },
          { l: "Avg pts / provider",v: "198",   i: "HeartPulse" },
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {team.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
              <Icons.Users className="h-7 w-7 text-mist" strokeWidth={1.5} />
            </div>
            <p className="font-semibold text-ink">No team members yet</p>
            <p className="mt-1 text-sm text-slate">Invite your first team member to get started.</p>
          </div>
        )}
        {team.map((m) => (
          <div key={m.name} className="card bg-white p-5 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-deep to-gold text-sm font-bold text-white">{m.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink truncate">{m.name}</p>
                  {m.status !== "Active" && <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${m.status === "On leave" ? "bg-alert/10 text-alert" : m.status === "Invited" ? "bg-gold/10 text-gold-deep" : "bg-surface text-mist"}`}>{m.status}</span>}
                </div>
                <p className="text-xs text-slate">{m.role}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColor[m.type]}`}>{m.type}</span>
            </div>
            {m.prod ? (
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-surface p-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-mist">Patients</p>
                  <p className="text-sm font-semibold text-ink">{m.pts}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-mist">MTD Production</p>
                  <p className="text-sm font-semibold text-ink">{m.prod}</p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-surface p-3">
                <p className="text-[10px] uppercase tracking-wider text-mist">Role</p>
                <p className="text-xs text-slate mt-0.5">Administrative — no production metrics</p>
              </div>
            )}
            {m.npi && <p className="mt-2 text-[11px] text-mist">NPI: {m.npi}</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(m)} className="flex-1 rounded-lg border border-line py-1.5 text-xs text-slate hover:bg-surface hover:border-gold/40 transition-colors">Edit</button>
              <button onClick={() => router.push("/platform/schedule")} className="flex-1 rounded-lg border border-line py-1.5 text-xs text-slate hover:bg-surface hover:border-gold/40 transition-colors">Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
