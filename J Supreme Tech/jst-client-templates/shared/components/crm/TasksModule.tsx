"use client";
import { useState } from "react";

export interface Task { id: string; title: string; status: string; assigned_to: string | null; due_at: string | null; created_at: string; }
interface Props { tasks: Task[]; clientId?: string; accentColor?: string; }

const STATUS_CYCLE: Record<string, string> = { todo: "in_progress", in_progress: "done", done: "todo" };
const STATUS_LABEL: Record<string, string> = { todo: "To Do", in_progress: "In Progress", done: "Done" };
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  todo: { bg: "#f3f4f6", color: "#374151" },
  in_progress: { bg: "#fef3c7", color: "#92400e" },
  done: { bg: "#dcfce7", color: "#166534" },
};

export function TasksModule({ tasks: initial, clientId, accentColor = "#111" }: Props) {
  const [tasks, setTasks] = useState(initial);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", assignedTo: "", dueAt: "" });
  const [filter, setFilter] = useState("all");

  const filtered = tasks
    .filter(t => filter === "all" || t.status === filter)
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || (t.assigned_to ?? "").toLowerCase().includes(search.toLowerCase()));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    const res = await fetch("/api/ct/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId, title: form.title, assignedTo: form.assignedTo || null, dueAt: form.dueAt || null }) });
    const json = await res.json();
    if (json.ok && json.data) { setTasks(prev => [json.data, ...prev]); setForm({ title: "", assignedTo: "", dueAt: "" }); setShowAdd(false); }
    setSaving(false);
  }

  async function cycleStatus(t: Task) {
    const next = STATUS_CYCLE[t.status] ?? "todo";
    const res = await fetch("/api/ct/tasks", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: t.id, status: next }) });
    const json = await res.json();
    if (json.ok && json.data) setTasks(prev => prev.map(x => x.id === t.id ? json.data : x));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this task?")) return;
    const res = await fetch("/api/ct/tasks", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const json = await res.json();
    if (json.ok) setTasks(prev => prev.filter(t => t.id !== id));
  }

  const inp = { padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 14, width: "100%" };
  const counts = { all: tasks.length, todo: tasks.filter(t => t.status === "todo").length, in_progress: tasks.filter(t => t.status === "in_progress").length, done: tasks.filter(t => t.status === "done").length };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." style={{ ...inp, flex: "1 1 180px" }} />
        {(["all","todo","in_progress","done"] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "2px solid", borderColor: filter === s ? accentColor : "#e5e7eb", background: filter === s ? accentColor : "transparent", color: filter === s ? "#fff" : "#6b7280", flexShrink: 0 }}>
            {s === "all" ? "All" : STATUS_LABEL[s]} ({counts[s]})
          </button>
        ))}
        {clientId && <button onClick={() => setShowAdd(!showAdd)} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>+ Add</button>}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <input required placeholder="Task title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={{ ...inp, gridColumn: "1/-1" }} />
          <input placeholder="Assign to" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} style={inp} />
          <input type="date" value={form.dueAt} onChange={e => setForm(f => ({ ...f, dueAt: e.target.value }))} style={inp} />
          <div style={{ gridColumn: "1/-1", display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>No tasks here.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(t => {
            const st = STATUS_STYLE[t.status] ?? STATUS_STYLE.todo;
            const isOverdue = t.due_at && t.status !== "done" && new Date(t.due_at) < new Date();
            return (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, flexWrap: "wrap" }}>
                <button title="Click to advance status" onClick={() => cycleStatus(t)} style={{ background: st.bg, color: st.color, border: "none", borderRadius: 999, padding: "4px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {STATUS_LABEL[t.status] ?? t.status}
                </button>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14, minWidth: 120 }}>{t.title}</span>
                {t.assigned_to && <span style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>@{t.assigned_to}</span>}
                {t.due_at && <span style={{ fontSize: 12, color: isOverdue ? "#dc2626" : "#9ca3af", fontWeight: isOverdue ? 700 : 400, whiteSpace: "nowrap" }}>{isOverdue ? "⚠ " : ""}{new Date(t.due_at).toLocaleDateString()}</span>}
                <button onClick={() => handleDelete(t.id)} style={{ background: "none", border: "1px solid #fee2e2", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", color: "#dc2626", fontWeight: 600, flexShrink: 0 }}>Del</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}