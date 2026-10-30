"use client";
import { useState } from "react";

interface Task { id: string; title: string; due?: string; priority: "high" | "medium" | "low"; done: boolean; }

export function TasksModule({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTitle, setNewTitle] = useState("");

  const toggle = (id: string) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const add = () => {
    if (!newTitle.trim()) return;
    setTasks((prev) => [...prev, { id: Date.now().toString(), title: newTitle.trim(), priority: "medium", done: false }]);
    setNewTitle("");
  };

  const priorityColor = { high: "#fee2e2", medium: "#fef9c3", low: "#d1fae5" };
  const priorityText = { high: "#991b1b", medium: "#713f12", low: "#065f46" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Add task */}
      <div style={{ display: "flex", gap: 10, background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 }}>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task..." style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 8, padding: "8px 12px", fontSize: 14 }} />
        <button onClick={add} style={{ padding: "8px 18px", borderRadius: 8, background: "#111", color: "#fff", border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Add</button>
      </div>

      {tasks.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 40, textAlign: "center", color: "#9ca3af" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 600 }}>No tasks — add one above</div>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: "1px solid #f3f4f6" }}>
              <input type="checkbox" checked={task.done} onChange={() => toggle(task.id)} style={{ width: 16, height: 16, cursor: "pointer" }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "#111", textDecoration: task.done ? "line-through" : "none", opacity: task.done ? 0.4 : 1 }}>{task.title}</span>
              {task.due && <span style={{ fontSize: 12, color: "#9ca3af" }}>{task.due}</span>}
              <span style={{ padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: priorityColor[task.priority], color: priorityText[task.priority] }}>{task.priority}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
