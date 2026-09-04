"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";

const staff: { id: string; name: string; role: string; status: string; patients: number; nextAppt: string; avatar: string; color: string }[] = [];

const statusLabel: Record<string, { label: string; cls: string }> = {
  "in-chair": { label: "In Chair",  cls: "bg-gold/10 text-gold-deep" },
  "available": { label: "Available", cls: "bg-teal/10 text-teal" },
  "break":     { label: "On Break",  cls: "bg-slate/10 text-slate" },
};

const roles = ["All", "Dentist", "Oral Surgeon", "Hygienist", "Receptionist", "Treatment Coord."];

export default function StaffPage() {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState<string | null>(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffList, setStaffList] = useState(staff);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Dentist");

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function addStaff() {
    if (!newName.trim()) return;
    const initials = newName.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setStaffList(prev => [...prev, {
      id: `s${prev.length + 1}`, name: newName.trim(), role: newRole,
      status: "available", patients: 0, nextAppt: "—", avatar: initials, color: "bg-surface text-slate",
    }]);
    setNewName(""); setNewRole("Dentist");
    setShowAddStaff(false);
    flash(`${newName.trim()} added to staff.`);
  }

  const visible = roleFilter === "All" ? staffList : staffList.filter(s => s.role === roleFilter);

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Staff</h1>
          <p className="mt-1 text-sm text-slate">
            {staffList.filter(s => s.status === "in-chair").length} in chair ·{" "}
            {staffList.filter(s => s.status === "available").length} available ·{" "}
            {staff.filter(s => s.status === "break").length} on break
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView("grid")} className={`rounded-lg p-2 border transition-colors ${view === "grid" ? "border-gold/40 text-gold-deep bg-gold/5" : "border-line text-slate hover:text-ink"}`}>
            <Icons.LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button onClick={() => setView("list")} className={`rounded-lg p-2 border transition-colors ${view === "list" ? "border-gold/40 text-gold-deep bg-gold/5" : "border-line text-slate hover:text-ink"}`}>
            <Icons.List className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button onClick={() => setShowAddStaff(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.UserPlus className="h-4 w-4" /> Add Staff
          </button>
        </div>
      </div>

      {/* Role filter */}
      <div className="flex gap-2 flex-wrap">
        {roles.map(r => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              roleFilter === r ? "bg-ink text-white" : "bg-surface border border-line text-slate hover:border-gold/40 hover:text-ink"
            }`}>
            {r}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center card bg-white shadow-card">
          <Icons.Users className="h-10 w-10 text-mist mb-3" strokeWidth={1.5} />
          <p className="font-semibold text-ink">No staff members yet</p>
          <p className="mt-1 text-sm text-slate">Add staff using the button above, or connect your PMS to sync your team.</p>
        </div>
      )}

      {visible.length > 0 && view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(member => {
            const st = statusLabel[member.status];
            return (
              <div key={member.id} className="card bg-white p-5 shadow-card space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${member.color}`}>
                      {member.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{member.name}</p>
                      <p className="text-xs text-slate">{member.role}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${st.cls}`}>{st.label}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="text-mist">Patients today</p>
                    <p className="font-semibold text-ink mt-0.5">{member.patients}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-mist">Next appt</p>
                    <p className="font-semibold text-ink mt-0.5">{member.nextAppt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => router.push("/platform/schedule")} className="flex-1 rounded-lg border border-line py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">
                    Schedule
                  </button>
                  <button onClick={() => router.push("/platform/communications")} className="flex-1 rounded-lg border border-line py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">
                    Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : visible.length > 0 ? (
        <div className="card overflow-hidden bg-white shadow-card">
          <div className="divide-y divide-line">
            {visible.map(member => {
              const st = statusLabel[member.status];
              return (
                <div key={member.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold shrink-0 ${member.color}`}>
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink">{member.name}</p>
                    <p className="text-xs text-slate">{member.role} · {member.patients} patients today · Next: {member.nextAppt}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${st.cls}`}>{st.label}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => router.push("/platform/schedule")} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">Schedule</button>
                    <button onClick={() => router.push("/platform/communications")} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">Message</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Schedule overview */}
      <div className="card bg-white p-5 shadow-card">
        <h3 className="text-sm font-semibold text-ink mb-4">Today&rsquo;s Coverage</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Chairs Staffed", value: "4 / 6", icon: "Armchair" },
            { label: "Hours Scheduled", value: "38h",   icon: "Clock" },
            { label: "Overtime Risk",   value: "None",  icon: "AlertCircle" },
          ].map(s => {
            const I = (Icons as any)[s.icon];
            return (
              <div key={s.label} className="text-center rounded-xl bg-surface p-4 border border-line">
                <I className="h-5 w-5 text-gold-deep mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-lg font-bold text-ink">{s.value}</p>
                <p className="text-xs text-slate mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowAddStaff(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.UserPlus className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">Add Staff Member</span>
              </div>
              <button onClick={() => setShowAddStaff(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Full name <span className="text-alert">*</span></label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Dr. Sarah Kim"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Role <span className="text-alert">*</span></label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {["Dentist","Oral Surgeon","Hygienist","Receptionist","Treatment Coord.","Office Manager"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowAddStaff(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={addStaff} disabled={!newName.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Add Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
