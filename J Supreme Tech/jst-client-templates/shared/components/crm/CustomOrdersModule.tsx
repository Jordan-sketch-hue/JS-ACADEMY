"use client";
import { useState, useEffect } from "react";

export interface CustomOrder { id: string; customer_name: string; customer_phone: string | null; order_details: string | null; dimensions: string | null; materials: string | null; deposit_amount: number; deposit_paid: boolean; total_amount: number; currency: string; status: string; due_date: string | null; notes: string | null; created_at: string; }
interface Props { orders?: CustomOrder[]; clientId?: string; accentColor?: string; currency?: string; }

const STATUSES = ["pending","confirmed","in_progress","ready","delivered","cancelled"];

export function CustomOrdersModule({ orders: initial, clientId, accentColor = "#111", currency = "JMD" }: Props) {
  const [orders, setOrders] = useState<CustomOrder[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(`/api/ct/custom-orders?clientId=${clientId}`).then(r=>r.json()).then(j=>{ if (j.data) setOrders(j.data); });
  }, [clientId]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customer_name:"", customer_phone:"", order_details:"", dimensions:"", materials:"", deposit_amount:"", total_amount:"", due_date:"", notes:"" });

  const filtered = orders.filter(o => o.customer_name.toLowerCase().includes(search.toLowerCase()));
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    const res = await fetch("/api/ct/custom-orders", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ clientId, ...form, deposit_amount: Number(form.deposit_amount)||0, total_amount: Number(form.total_amount)||0, currency }) });
    const json = await res.json();
    if (json.ok && json.data) { setOrders(p => [json.data, ...p]); setForm({ customer_name:"", customer_phone:"", order_details:"", dimensions:"", materials:"", deposit_amount:"", total_amount:"", due_date:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const statusColor = (s:string) => ({ pending:"#fef3c7", confirmed:"#dbeafe", in_progress:"#ede9fe", ready:"#dcfce7", delivered:"#f0fdf4", cancelled:"#fee2e2" }[s] || "#f3f4f6");
  const statusText = (s:string) => ({ pending:"#92400e", confirmed:"#1e40af", in_progress:"#5b21b6", ready:"#166534", delivered:"#14532d", cancelled:"#991b1b" }[s] || "#374151");

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." style={{ ...inp, flex:1 }} />
        {clientId && <button onClick={() => setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer", flexShrink:0 }}>+ Add Order</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Customer name" value={form.customer_name} onChange={e => setForm(f=>({...f,customer_name:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.customer_phone} onChange={e => setForm(f=>({...f,customer_phone:e.target.value}))} style={inp} />
          <input placeholder="Order details" value={form.order_details} onChange={e => setForm(f=>({...f,order_details:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <input placeholder="Dimensions (e.g. 6ft x 3ft)" value={form.dimensions} onChange={e => setForm(f=>({...f,dimensions:e.target.value}))} style={inp} />
          <input placeholder="Materials / fabric / finish" value={form.materials} onChange={e => setForm(f=>({...f,materials:e.target.value}))} style={inp} />
          <input type="number" placeholder={`Deposit (${currency})`} value={form.deposit_amount} onChange={e => setForm(f=>({...f,deposit_amount:e.target.value}))} style={inp} />
          <input type="number" placeholder={`Total (${currency})`} value={form.total_amount} onChange={e => setForm(f=>({...f,total_amount:e.target.value}))} style={inp} />
          <input type="date" placeholder="Due date" value={form.due_date} onChange={e => setForm(f=>({...f,due_date:e.target.value}))} style={inp} />
          <input placeholder="Notes" value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {filtered.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No custom orders yet.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Customer","Phone","Details","Dimensions","Deposit","Total","Due","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{filtered.map(o=>(
              <tr key={o.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{o.customer_name}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{o.customer_phone||"—"}</td>
                <td style={{ padding:"10px 12px", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.order_details||"—"}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{o.dimensions||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{o.currency} {o.deposit_amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px", fontWeight:600 }}>{o.currency} {o.total_amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{o.due_date||"—"}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:statusColor(o.status), color:statusText(o.status), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{o.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}