"use client";
import { useState, useEffect } from "react";

export interface Project { id: string; project_name: string; client_contact: string | null; client_phone: string | null; brief: string | null; deliverables: string | null; start_date: string | null; deadline: string | null; budget: number; currency: string; stage: string; revision_count: number; approved: boolean; notes: string | null; created_at: string; }
interface Props { projects?: Project[]; clientId?: string; accentColor?: string; currency?: string; }

export function ProjectsModule({ projects: initial, clientId, accentColor = "#111", currency = "JMD" }: Props) {
  const [projects, setProjects] = useState<Project[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(`/api/ct/projects?clientId=${clientId}`).then(r=>r.json()).then(j=>{ if (j.data) setProjects(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ project_name:"", client_contact:"", client_phone:"", brief:"", deliverables:"", start_date:"", deadline:"", budget:"", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/projects", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form, budget:Number(form.budget)||0, currency }) });
    const json = await res.json();
    if (json.ok && json.data) { setProjects(p=>[json.data,...p]); setForm({ project_name:"", client_contact:"", client_phone:"", brief:"", deliverables:"", start_date:"", deadline:"", budget:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const stages = ["briefing","in_progress","review","revisions","approved","delivered"];
  const sc = (s:string) => ({ briefing:"#dbeafe", in_progress:"#fef3c7", review:"#ede9fe", revisions:"#fee2e2", approved:"#dcfce7", delivered:"#f0fdf4" }[s]||"#f3f4f6");
  const stc = (s:string) => ({ briefing:"#1e40af", in_progress:"#92400e", review:"#5b21b6", revisions:"#991b1b", approved:"#166534", delivered:"#14532d" }[s]||"#374151");

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ New Project</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Project name" value={form.project_name} onChange={e=>setForm(f=>({...f,project_name:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <input placeholder="Client / contact name" value={form.client_contact} onChange={e=>setForm(f=>({...f,client_contact:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.client_phone} onChange={e=>setForm(f=>({...f,client_phone:e.target.value}))} style={inp} />
          <textarea placeholder="Brief / scope" value={form.brief} onChange={e=>setForm(f=>({...f,brief:e.target.value}))} rows={2} style={{ ...inp, gridColumn:"1/-1", resize:"vertical" }} />
          <textarea placeholder="Deliverables" value={form.deliverables} onChange={e=>setForm(f=>({...f,deliverables:e.target.value}))} rows={2} style={{ ...inp, gridColumn:"1/-1", resize:"vertical" }} />
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Start date</label><input type="date" value={form.start_date} onChange={e=>setForm(f=>({...f,start_date:e.target.value}))} style={inp} /></div>
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Deadline</label><input type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} style={inp} /></div>
          <input type="number" placeholder={`Budget (${currency})`} value={form.budget} onChange={e=>setForm(f=>({...f,budget:e.target.value}))} style={inp} />
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={inp} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {projects.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No projects yet.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Project","Contact","Deadline","Budget","Revisions","Stage"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{projects.map(p=>(
              <tr key={p.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{p.project_name}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{p.client_contact||"—"}</td>
                <td style={{ padding:"10px 12px", color: p.deadline && new Date(p.deadline)<new Date() && p.stage!=="delivered"?"#ef4444":"#6b7280" }}>{p.deadline||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{p.currency} {p.budget.toLocaleString()}</td>
                <td style={{ padding:"10px 12px", textAlign:"center" }}>{p.revision_count}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:sc(p.stage), color:stc(p.stage), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{p.stage}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}