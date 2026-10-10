import type { Todo, TodoCategory } from "@/lib/data/todos";
import { DEFAULT_TASK_CATEGORY_SPECS } from "@/lib/data/todos";

export const LOCAL_TASKS_CHANGED = "j-supreme-local-tasks-changed";

export type LocalTaskBundle = { categories: TodoCategory[]; todos: Todo[] };

export function localTasksStorageKey(ownerId: string) {
  return `j-supreme:tasks:v1:${ownerId}`;
}

export function loadLocalTaskBundle(ownerId: string): LocalTaskBundle | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(localTasksStorageKey(ownerId));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as LocalTaskBundle;
    if (!parsed?.categories?.length || !Array.isArray(parsed.todos)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function seedLocalTaskBundle(ownerId: string): LocalTaskBundle {
  const now = new Date().toISOString();
  const categories: TodoCategory[] = DEFAULT_TASK_CATEGORY_SPECS.map((spec) => ({
    id: crypto.randomUUID(),
    owner_clerk_id: ownerId,
    name: spec.name,
    color: spec.color,
    sort_order: spec.sort_order,
    created_at: now,
  }));
  return { categories, todos: [] };
}

export function loadOrSeedLocalTaskBundle(ownerId: string): LocalTaskBundle {
  const existing = loadLocalTaskBundle(ownerId);
  if (existing) return existing;
  const bundle = seedLocalTaskBundle(ownerId);
  saveLocalTaskBundle(ownerId, bundle);
  return bundle;
}

export function persistLocalTaskBundleQuiet(ownerId: string, bundle: LocalTaskBundle) {
  if (typeof window === "undefined") return;
  localStorage.setItem(localTasksStorageKey(ownerId), JSON.stringify(bundle));
}

export function saveLocalTaskBundle(ownerId: string, bundle: LocalTaskBundle) {
  persistLocalTaskBundleQuiet(ownerId, bundle);
  window.dispatchEvent(new Event(LOCAL_TASKS_CHANGED));
}

export function mergeTodoIntoLocalStorage(ownerId: string, todo: Todo) {
  const bundle = loadOrSeedLocalTaskBundle(ownerId);
  const rest = bundle.todos.filter((t) => t.id !== todo.id);
  bundle.todos = [todo, ...rest];
  saveLocalTaskBundle(ownerId, bundle);
}
