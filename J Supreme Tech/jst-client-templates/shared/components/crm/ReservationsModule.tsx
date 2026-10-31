"use client";
import { useState, useEffect } from "react";

export interface Reservation { id: string; guest_name: string; guest_phone: string | null; guest_count: number; date: string; time: string | null; table_number: string | null; package: string | null; deposit_amount: number; status: string; notes: string | null; currency: string; created_at: string; }
interface Props { reservations?: Reservation[]; clientId?: string; accentColor?: string; currency?: string; label?: string; }

export function ReservationsModule({ reservations: initial, clientId, accentColor = "#111", currency = "JMD", label = "Reservation" }: Props) {
  const [items, setItems] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ guest_name:"", guest_phone:"", guest_count:"1", date:"", time:"", table_number:"", package:"", deposit_amount:"", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/reservations", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form, guest_count:Number(form.guest_count)||1, deposit_amount:Number(form.deposit_amount)||0, currency }) });
    const json = await res.json();
    if (json.ok && json.data) { setItems(p=>[json.data,...p]); setForm({ guest_name:"", guest_phone:"", guest_count:"1", date:"", time:"", table_number:"", package:"", deposit_amount:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const sc = (s:string) => ({ confirmed:"#dcfce7", pending:"#fef3c7", cancelled:"#fee2e2", completed:"#f0fdf4", waitlist:"#ede9fe" }[s]||"#f3f4f6");
  const stc = (s:string) => ({ confirmed:"#166534", pending:"#92400e", cancelled:"#991b1b", completed:"#14532d", waitlist:"#5b21b6" }[s]||"#374151");

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ New {label}</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Guest / customer name" value={form.guest_name} onChange={e=>setForm(f=>({...f,guest_name:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.guest_phone} onChange={e=>setForm(f=>({...f,guest_phone:e.target.value}))} style={inp} />
          <input type="number" min="1" placeholder="Party size" value={form.guest_count} onChange={e=>setForm(f=>({...f,guest_count:e.target.value}))} style={inp} />
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Date *</label><input required type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={inp} /></div>
          <input placeholder="Time (e.g. 7:00 PM)" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={inp} />
          <input placeholder="Table / area" value={form.table_number} onChange={e=>setForm(f=>({...f,table_number:e.target.value}))} style={inp} />
          <input placeholder="Package" value={form.package} onChange={e=>setForm(f=>({...f,package:e.target.value}))} style={inp} />
          <input type="number" placeholder={`Deposit (${currency})`} value={form.deposit_amount} onChange={e=>setForm(f=>({...f,deposit_amount:e.target.value}))} style={inp} />
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {items.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No {label.toLowerCase()}s yet.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Guest","Phone","Date","Time","Party","Package","Deposit","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{items.map(r=>(
              <tr key={r.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{r.guest_name}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{r.guest_phone||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{r.date}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{r.time||"—"}</td>
                <td style={{ padding:"10px 12px", textAlign:"center" }}>{r.guest_count}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{r.package||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{r.currency} {r.deposit_amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:sc(r.status), color:stc(r.status), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{r.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}