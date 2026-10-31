"use client";
import { useState, useEffect } from "react";

export interface Supplier { id: string; supplier_name: string; contact_name: string | null; phone: string | null; email: string | null; lead_time_days: number | null; payment_terms: string | null; notes: string | null; active: boolean; created_at: string; }
interface Props { suppliers?: Supplier[]; clientId?: string; accentColor?: string; }

export function SuppliersModule({ suppliers: initial, clientId, accentColor = "#111" }: Props) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(/api/ct/suppliers?clientId=).then(r=>r.json()).then(j=>{ if (j.data) setSuppliers(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ supplier_name:"", contact_name:"", phone:"", email:"", lead_time_days:"", payment_terms:"", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/suppliers", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form, lead_time_days:Number(form.lead_time_days)||null }) });
    const json = await res.json();
    if (json.ok && json.data) { setSuppliers(p=>[json.data,...p]); setForm({ supplier_name:"", contact_name:"", phone:"", email:"", lead_time_days:"", payment_terms:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Add Supplier</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Supplier name" value={form.supplier_name} onChange={e=>setForm(f=>({...f,supplier_name:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <input placeholder="Contact name" value={form.contact_name} onChange={e=>setForm(f=>({...f,contact_name:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={inp} />
          <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inp} />
          <input type="number" placeholder="Lead time (days)" value={form.lead_time_days} onChange={e=>setForm(f=>({...f,lead_time_days:e.target.value}))} style={inp} />
          <input placeholder="Payment terms (e.g. Net 30)" value={form.payment_terms} onChange={e=>setForm(f=>({...f,payment_terms:e.target.value}))} style={inp} />
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {suppliers.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No suppliers yet.</p> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
          {suppliers.map(s=>(
            <div key={s.id} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:10, padding:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <p style={{ fontWeight:700, fontSize:15, margin:0 }}>{s.supplier_name}</p>
                <span style={{ background:s.active?"#dcfce7":"#f3f4f6", color:s.active?"#166534":"#6b7280", borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{s.active?"Active":"Inactive"}</span>
              </div>
              {s.contact_name && <p style={{ margin:"0 0 4px", fontSize:13, color:"#374151" }}>{s.contact_name}</p>}
              {s.phone && <p style={{ margin:"0 0 2px", fontSize:13, color:"#6b7280" }}>📞 {s.phone}</p>}
              {s.email && <p style={{ margin:"0 0 2px", fontSize:13, color:"#6b7280" }}>✉ {s.email}</p>}
              {s.lead_time_days && <p style={{ margin:"0 0 2px", fontSize:13, color:"#6b7280" }}>⏱ {s.lead_time_days}d lead time</p>}
              {s.payment_terms && <p style={{ margin:"0 0 2px", fontSize:13, color:"#6b7280" }}>{s.payment_terms}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}