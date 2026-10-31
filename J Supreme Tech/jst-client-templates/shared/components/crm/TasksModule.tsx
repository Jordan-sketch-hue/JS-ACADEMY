"use client";
import { useState } from "react";

export interface Task { id: string; title: string; due_at: string | null; status: string; created_at: string; }
interface Props { tasks: Task[]; clientId?: string; accentColor?: string; }

export function TasksModule({ tasks: initial, clientId, accentColor = "#111" }: Props) {
  const [tasks, setTasks] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", dueAt: "", assignedTo: "" });

  const open = tasks.filter(t => t.status !== "done");
  const done = tasks.filter(t => t.status === "done");
  const overdue = open.filter(t => t.due_at && new Date(t.due_at) < new Date());

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    const res = await fetch("/api/ct/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId, title: form.title, dueAt: form.dueAt || null, assignedTo: form.assignedTo || null }) });
    const json = await res.json();
    if (json.ok && json.data) { setTasks(prev => [json.data, ...prev]); setForm({ title: "", dueAt: "", assignedTo: "" }); setShowAdd(false); }
    setSaving(false);
  }

  async function toggleDone(id: string, current: string) {
    const next = current === "done" ? "todo" : "done";
    await fetch("/api/ct/status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table: "ct_tasks", id, status: next }) });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: next } : t));
  }

  const inp = { padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 14, width: "100%" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        {overdue.length > 0 && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "8px 16px", fontSize: 14, color: "#991b1b" }}>{overdue.length} overdue</div>}
        {clientId && <button onClick={() => setShowAdd(!showAdd)} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", marginLeft: "auto" }}>+ Add</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <input required placeholder="Task title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ ...inp, gridColumn: "1/-1" }} />
          <input type="date" placeholder="Due date" value={form.dueAt} onChange={e => setForm(f => ({ ...f, dueAt: e.target.value }))} style={inp} />
          <input placeholder="Assigned to" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} style={inp} />
          <div style={{ gridColumn: "1/-1", display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {tasks.length === 0 ? <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>No tasks yet.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {tasks.map(t => {
            const isOverdue = t.due_at && new Date(t.due_at) < new Date() && t.status !== "done";
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", border: "1px solid #f3f4f6", borderRadius: 8, background: "#fff" }}>
                <button onClick={() => toggleDone(t.id, t.status)} style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${t.status === "done" ? "#22c55e" : accentColor}`, background: t.status === "done" ? "#22c55e" : "transparent", flexShrink: 0, cursor: "pointer" }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 500, textDecoration: t.status === "done" ? "line-through" : "none", color: t.status === "done" ? "#9ca3af" : "#111" }}>{t.title}</p>
                  {t.due_at && <p style={{ margin: 0, fontSize: 12, color: isOverdue ? "#ef4444" : "#9ca3af" }}>{isOverdue ? "Overdue: " : "Due: "}{new Date(t.due_at).toLocaleDateString()}</p>}
                </div>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>{t.status}</span>
              </div>
            );
          })}
        </div>
      )}
      <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 16 }}>{open.length} open · {done.length} done</p>
    </div>
  );
}