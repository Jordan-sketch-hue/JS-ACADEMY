import type { TaskLaneInsight } from "@/lib/data/seed";
import type { Todo, TodoCategory } from "@/lib/data/todos";

const CORE_LANE_ORDER = ["Tech", "Marketing", "Trading"] as const;

export function buildTodoLaneInsights(
  cats: TodoCategory[],
  todos: Todo[],
): TaskLaneInsight[] {
  const byCat = new Map<string, { open: number; done: number }>();
  for (const c of cats) {
    byCat.set(c.id, { open: 0, done: 0 });
  }
  for (const t of todos) {
    if (!t.category_id) continue;
    const slot = byCat.get(t.category_id);
    if (!slot) continue;
    if (t.done) slot.done++;
    else slot.open++;
  }
  const rows: TaskLaneInsight[] = cats.map((c) => {
    const s = byCat.get(c.id) ?? { open: 0, done: 0 };
    return {
      categoryId: c.id,
      name: c.name,
      color: c.color,
      open: s.open,
      done: s.done,
      total: s.open + s.done,
    };
  });
  const coreLaneRank = (name: string) => {
    const idx = CORE_LANE_ORDER.findIndex((n) => n === name);
    return idx === -1 ? 999 : idx;
  };
  return rows.sort((a, b) => {
    const d = coreLaneRank(a.name) - coreLaneRank(b.name);
    if (d !== 0) return d;
    return a.name.localeCompare(b.name);
  });
}
