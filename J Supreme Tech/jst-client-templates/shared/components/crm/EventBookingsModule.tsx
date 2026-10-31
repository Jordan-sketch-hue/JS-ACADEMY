"use client";
import { useState, useEffect } from "react";

export interface EventBooking { id: string; event_name: string; client_name: string; client_phone: string | null; event_date: string | null; event_time: string | null; location: string | null; package: string | null; guest_count: number | null; deposit_amount: number; total_amount: number; currency: string; status: string; notes: string | null; created_at: string; }
interface Props { bookings?: EventBooking[]; clientId?: string; accentColor?: string; currency?: string; }

export function EventBookingsModule({ bookings: initial, clientId, accentColor = "#111", currency = "JMD" }: Props) {
  const [bookings, setBookings] = useState<EventBooking[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(`/api/ct/event-bookings?clientId=${clientId}`).then(r=>r.json()).then(j=>{ if (j.data) setBookings(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ event_name:"", client_name:"", client_phone:"", event_date:"", event_time:"", location:"", package:"", guest_count:"", deposit_amount:"", total_amount:"", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/event-bookings", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form, guest_count:Number(form.guest_count)||null, deposit_amount:Number(form.deposit_amount)||0, total_amount:Number(form.total_amount)||0, currency }) });
    const json = await res.json();
    if (json.ok && json.data) { setBookings(p=>[json.data,...p]); setForm({ event_name:"", client_name:"", client_phone:"", event_date:"", event_time:"", location:"", package:"", guest_count:"", deposit_amount:"", total_amount:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const sc = (s:string) => ({ inquiry:"#f3f4f6", confirmed:"#dcfce7", deposit_paid:"#dbeafe", completed:"#f0fdf4", cancelled:"#fee2e2" }[s]||"#f3f4f6");
  const stc = (s:string) => ({ inquiry:"#374151", confirmed:"#166534", deposit_paid:"#1e40af", completed:"#14532d", cancelled:"#991b1b" }[s]||"#374151");

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ New Booking</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Event name" value={form.event_name} onChange={e=>setForm(f=>({...f,event_name:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <input required placeholder="Client name" value={form.client_name} onChange={e=>setForm(f=>({...f,client_name:e.target.value}))} style={inp} />
          <input placeholder="Client phone" value={form.client_phone} onChange={e=>setForm(f=>({...f,client_phone:e.target.value}))} style={inp} />
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Event date</label><input type="date" value={form.event_date} onChange={e=>setForm(f=>({...f,event_date:e.target.value}))} style={inp} /></div>
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Event time</label><input type="time" value={form.event_time} onChange={e=>setForm(f=>({...f,event_time:e.target.value}))} style={inp} /></div>
          <input placeholder="Location / venue" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} style={inp} />
          <input placeholder="Package name" value={form.package} onChange={e=>setForm(f=>({...f,package:e.target.value}))} style={inp} />
          <input type="number" placeholder="Guest count" value={form.guest_count} onChange={e=>setForm(f=>({...f,guest_count:e.target.value}))} style={inp} />
          <input type="number" placeholder={`Deposit (${currency})`} value={form.deposit_amount} onChange={e=>setForm(f=>({...f,deposit_amount:e.target.value}))} style={inp} />
          <input type="number" placeholder={`Total (${currency})`} value={form.total_amount} onChange={e=>setForm(f=>({...f,total_amount:e.target.value}))} style={inp} />
          <textarea placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} rows={2} style={{ ...inp, gridColumn:"1/-1", resize:"vertical" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {bookings.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No event bookings yet.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Event","Client","Date","Location","Package","Guests","Deposit","Total","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{bookings.map(b=>(
              <tr key={b.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{b.event_name}</td>
                <td style={{ padding:"10px 12px" }}>{b.client_name}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{b.event_date||"—"} {b.event_time||""}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{b.location||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{b.package||"—"}</td>
                <td style={{ padding:"10px 12px", textAlign:"center" }}>{b.guest_count||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{b.currency} {b.deposit_amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px", fontWeight:600 }}>{b.currency} {b.total_amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:sc(b.status), color:stc(b.status), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{b.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}