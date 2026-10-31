"use client";
import { useState, useEffect } from "react";

export interface Staff { id: string; name: string; role: string | null; phone: string | null; email: string | null; schedule: string | null; active: boolean; created_at: string; }
interface Props { staff: Staff[]; clientId?: string; accentColor?: string; }

export function StaffModule({ staff: initial, clientId, accentColor = "#111" }: Props) {
  const [staff, setStaff] = useState<StaffMember[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(/api/ct/staff?clientId=).then(r=>r.json()).then(j=>{ if (j.data) setStaff(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name:"", role:"", phone:"", email:"", schedule:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/staff", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form }) });
    const json = await res.json();
    if (json.ok && json.data) { setStaff(p=>[json.data,...p]); setForm({ name:"", role:"", phone:"", email:"", schedule:"" }); setShowAdd(false); }
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Add Staff</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp} />
          <input placeholder="Role / position" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={inp} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inp} />
          <input placeholder="Schedule (e.g. Mon-Fri 9-5)" value={form.schedule} onChange={e=>setForm(f=>({...f,schedule:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {staff.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No staff added yet.</p> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {staff.filter(s=>s.active).map(s=>(
            <div key={s.id} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:16 }}>
              <p style={{ fontWeight:700, margin:0, fontSize:15 }}>{s.name}</p>
              {s.role && <p style={{ margin:"4px 0 0", fontSize:13, color:accentColor, fontWeight:600 }}>{s.role}</p>}
              {s.phone && <p style={{ margin:"6px 0 0", fontSize:13, color:"#6b7280" }}>{s.phone}</p>}
              {s.email && <p style={{ margin:"2px 0 0", fontSize:13, color:"#6b7280" }}>{s.email}</p>}
              {s.schedule && <p style={{ margin:"6px 0 0", fontSize:12, color:"#9ca3af" }}>{s.schedule}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}