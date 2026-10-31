"use client";
import { useState, useEffect } from "react";

export interface Warranty { id: string; customer_name: string; customer_phone: string | null; product_name: string; serial_number: string | null; purchase_date: string | null; expiry_date: string | null; status: string; notes: string | null; created_at: string; }
interface Props { warranties?: Warranty[]; clientId?: string; accentColor?: string; }

export function WarrantiesModule({ warranties: initial, clientId, accentColor = "#111" }: Props) {
  const [warranties, setWarranties] = useState<Warranty[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(/api/ct/warranties?clientId=).then(r=>r.json()).then(j=>{ if (j.data) setWarranties(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customer_name:"", customer_phone:"", product_name:"", serial_number:"", purchase_date:"", expiry_date:"", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/warranties", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form }) });
    const json = await res.json();
    if (json.ok && json.data) { setWarranties(p=>[json.data,...p]); setForm({ customer_name:"", customer_phone:"", product_name:"", serial_number:"", purchase_date:"", expiry_date:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const isExpired = (d: string | null) => d ? new Date(d) < new Date() : false;

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Add Warranty</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Customer name" value={form.customer_name} onChange={e=>setForm(f=>({...f,customer_name:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.customer_phone} onChange={e=>setForm(f=>({...f,customer_phone:e.target.value}))} style={inp} />
          <input required placeholder="Product name" value={form.product_name} onChange={e=>setForm(f=>({...f,product_name:e.target.value}))} style={inp} />
          <input placeholder="Serial / receipt number" value={form.serial_number} onChange={e=>setForm(f=>({...f,serial_number:e.target.value}))} style={inp} />
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Purchase date</label><input type="date" value={form.purchase_date} onChange={e=>setForm(f=>({...f,purchase_date:e.target.value}))} style={inp} /></div>
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Expiry date</label><input type="date" value={form.expiry_date} onChange={e=>setForm(f=>({...f,expiry_date:e.target.value}))} style={inp} /></div>
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {warranties.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No warranties registered.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Customer","Product","Serial","Purchase Date","Expiry","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{warranties.map(w=>(
              <tr key={w.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{w.customer_name}</td>
                <td style={{ padding:"10px 12px" }}>{w.product_name}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280", fontFamily:"monospace", fontSize:12 }}>{w.serial_number||"—"}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{w.purchase_date||"—"}</td>
                <td style={{ padding:"10px 12px", color: isExpired(w.expiry_date)?"#ef4444":"#6b7280" }}>{w.expiry_date||"—"}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background: isExpired(w.expiry_date)?"#fee2e2":"#dcfce7", color: isExpired(w.expiry_date)?"#991b1b":"#166534", borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{isExpired(w.expiry_date)?"Expired":"Active"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}