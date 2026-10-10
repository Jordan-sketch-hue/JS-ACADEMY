import { getServiceSupabase } from "@/lib/supabase/admin";
import type { TaskLaneInsight } from "@/lib/data/seed";
import { buildTodoLaneInsights } from "@/lib/data/todo-lanes";

export type TodoCategory = {
  id: string;
  owner_clerk_id: string;
  name: string;
  color: string | null;
  sort_order: number;
  created_at: string;
};

export type Todo = {
  id: string;
  owner_clerk_id: string;
  category_id: string | null;
  title: string;
  notes: string | null;
  done: boolean;
  due_date: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
};

export type CreateTodoResult =
  | { ok: true; todo: Todo }
  | { ok: false; error: string };

export type CreateTodoCategoryResult =
  | { ok: true; category: TodoCategory }
  | { ok: false; error: string };

export type ListTodoCategoriesOutcome = {
  categories: TodoCategory[];
  /** When Supabase is on but listing failed (network, RLS, missing table, etc.). */
  loadError: string | null;
};

function formatSupabaseNetworkError(message: string): string {
  if (
    !/fetch failed|failed to fetch|networkerror|econnrefused|enotfound|eai_again|etimedout/i.test(
      message,
    )
  ) {
    return message;
  }
  return `${message} — Could not reach Supabase from this server. Use the HTTPS REST “Project URL” from Supabase → Settings → API (not a postgres:// string). Confirm SUPABASE_SERVICE_ROLE_KEY matches that same project, the project is not paused, and Production env vars are saved on Vercel. VPNs/firewalls can block outbound HTTPS.`;
}

/** True when the error is likely transport/DNS (not SQL/RLS). Used to fall back to browser storage for tasks. */
export function isSupabaseTransportFailureMessage(message: string | null | undefined): boolean {
  if (!message) return false;
  return /fetch failed|failed to fetch|networkerror|econnrefused|enotfound|eai_again|etimedout|aborted|the user aborted/i.test(
    message,
  );
}

/** Default lanes for new workspaces; you can add custom categories anytime. */
export const DEFAULT_TASK_CATEGORY_SPECS = [
  { name: "Tech", color: "hsl(263 70% 58%)", sort_order: 0 },
  { name: "Marketing", color: "hsl(340 82% 52%)", sort_order: 1 },
  { name: "Trading", color: "hsl(187 85% 45%)", sort_order: 2 },
] as const;

type MemBucket = {
  categories: TodoCategory[];
  todos: Todo[];
};

const mem = new Map<string, MemBucket>();

function iso(d = new Date()) {
  return d.toISOString();
}

function seedMem(owner: string): MemBucket {
  const now = iso();
  const categories: TodoCategory[] = DEFAULT_TASK_CATEGORY_SPECS.map((spec) => ({
    id: crypto.randomUUID(),
    owner_clerk_id: owner,
    name: spec.name,
    color: spec.color,
    sort_order: spec.sort_order,
    created_at: now,
  }));
  return { categories, todos: [] };
}

function bucket(owner: string): MemBucket {
  let b = mem.get(owner);
  if (!b) {
    b = seedMem(owner);
    mem.set(owner, b);
  }
  return b;
}

async function ensureSupabaseDefaultCategories(ownerClerkId: string): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  try {
    const { count, error: countErr } = await sb
      .from("todo_categories")
      .select("id", { count: "exact", head: true })
      .eq("owner_clerk_id", ownerClerkId);
    if (countErr || (count ?? 0) > 0) return;
    const rows = DEFAULT_TASK_CATEGORY_SPECS.map((spec) => ({
      owner_clerk_id: ownerClerkId,
      name: spec.name,
      color: spec.color,
      sort_order: spec.sort_order,
    }));
    await sb.from("todo_categories").insert(rows);
  } catch {
    /* ignore */
  }
}

export async function listTodoCategories(
  ownerClerkId: string,
): Promise<ListTodoCategoriesOutcome> {
  const sb = getServiceSupabase();
  if (!sb) {
    return {
      categories: bucket(ownerClerkId).categories
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
      loadError: null,
    };
  }
  await ensureSupabaseDefaultCategories(ownerClerkId);
  try {
    const { data, error } = await sb
      .from("todo_categories")
      .select("id,owner_clerk_id,name,color,sort_order,created_at")
      .eq("owner_clerk_id", ownerClerkId)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) {
      const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
      const msg = (error as { message?: string }).message ?? "Could not load categories.";
      const hint =
        /relation|does not exist|schema cache/i.test(msg) || code === "42P01"
          ? " Run the SQL in supabase/migrations in your project’s SQL editor (tables todo_categories + todos)."
          : "";
      const rls =
        /permission denied|42501|row-level security/i.test(msg) || code === "42501"
          ? " Service role should bypass RLS; confirm you did not set FORCE ROW LEVEL SECURITY on these tables."
          : "";
      return { categories: [], loadError: `${msg}${hint}${rls}` };
    }
    return { categories: (data ?? []) as TodoCategory[], loadError: null };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "Unknown error";
    return { categories: [], loadError: formatSupabaseNetworkError(raw) };
  }
}

export async function listTodos(
  ownerClerkId: string,
  categoryId?: string | null,
): Promise<Todo[]> {
  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(ownerClerkId);
    let rows = b.todos.slice();
    if (categoryId) rows = rows.filter((t) => t.category_id === categoryId);
    return rows.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (b.created_at || "").localeCompare(a.created_at || "");
    });
  }
  try {
    let q = sb
      .from("todos")
      .select("id,owner_clerk_id,category_id,title,notes,done,due_date,priority,created_at,updated_at")
      .eq("owner_clerk_id", ownerClerkId);
    if (categoryId) q = q.eq("category_id", categoryId);
    const { data, error } = await q
      .order("done", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Todo[];
  } catch {
    return [];
  }
}

export async function getTodoLaneInsights(ownerClerkId: string): Promise<TaskLaneInsight[]> {
  const [catOut, todos] = await Promise.all([
    listTodoCategories(ownerClerkId),
    listTodos(ownerClerkId),
  ]);
  return buildTodoLaneInsights(catOut.categories, todos);
}

export async function createTodoCategory(
  ownerClerkId: string,
  input: { name: string; color?: string | null; sort_order?: number },
): Promise<CreateTodoCategoryResult> {
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Name is required." };
  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(ownerClerkId);
    const row: TodoCategory = {
      id: crypto.randomUUID(),
      owner_clerk_id: ownerClerkId,
      name,
      color: input.color?.trim() || null,
      sort_order: input.sort_order ?? b.categories.length,
      created_at: iso(),
    };
    b.categories.push(row);
    return { ok: true, category: row };
  }
  try {
    const { data, error } = await sb
      .from("todo_categories")
      .insert({
        owner_clerk_id: ownerClerkId,
        name,
        color: input.color?.trim() || null,
        sort_order: input.sort_order ?? 100,
      })
      .select("id,owner_clerk_id,name,color,sort_order,created_at")
      .single();

    if (error) {
      const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
      const msg = (error as { message?: string }).message ?? "Could not save category.";
      const hint =
        /relation|does not exist|schema cache/i.test(msg) || code === "42P01"
          ? " Run the SQL in supabase/migrations for your project (todo_categories + todos), then try again."
          : "";
      const rls =
        /permission denied|42501|row-level security/i.test(msg) || code === "42501"
          ? " Check RLS policies on todo_categories for the role you are using (service role should bypass RLS unless FORCE ROW LEVEL SECURITY is set)."
          : "";
      const dup =
        /unique|duplicate|23505/i.test(msg) || code === "23505"
          ? " A category with this name may already exist for your workspace."
          : "";
      return { ok: false, error: `${msg}${hint}${rls}${dup}` };
    }
    if (!data) return { ok: false, error: "No row returned from database." };
    return { ok: true, category: data as TodoCategory };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: formatSupabaseNetworkError(raw) };
  }
}

export async function createTodo(
  ownerClerkId: string,
  input: {
    title: string;
    notes?: string | null;
    category_id?: string | null;
    due_date?: string | null;
    priority?: number;
  },
): Promise<CreateTodoResult> {
  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required." };
  const priority = Math.min(4, Math.max(1, input.priority ?? 2));
  const categoryId =
    input.category_id && String(input.category_id).trim() !== ""
      ? String(input.category_id).trim()
      : null;

  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(ownerClerkId);
    const now = iso();
    const row: Todo = {
      id: crypto.randomUUID(),
      owner_clerk_id: ownerClerkId,
      category_id: categoryId,
      title,
      notes: input.notes?.trim() || null,
      done: false,
      due_date: input.due_date || null,
      priority,
      created_at: now,
      updated_at: now,
    };
    b.todos.unshift(row);
    return { ok: true, todo: row };
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let catForInsert: string | null = null;
  if (categoryId) {
    if (!UUID_RE.test(categoryId)) {
      return { ok: false, error: "Choose a category from the list." };
    }
    catForInsert = categoryId;
  }

  try {
    const { data, error } = await sb
      .from("todos")
      .insert({
        owner_clerk_id: ownerClerkId,
        category_id: catForInsert,
        title,
        notes: input.notes?.trim() || null,
        due_date: input.due_date || null,
        priority,
      })
      .select("id,owner_clerk_id,category_id,title,notes,done,due_date,priority,created_at,updated_at")
      .single();

    if (error) {
      const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
      const msg = (error as { message?: string }).message ?? "Could not save task.";
      const hint =
        /relation|does not exist|schema cache/i.test(msg) || code === "42P01"
          ? " Run the SQL in supabase/migrations for your project (todo_categories + todos), then try again."
          : "";
      const fk =
        /foreign key|23503/i.test(msg) || code === "23503"
          ? " Pick a category from the list, or open “All” — the category id may be invalid."
          : "";
      return { ok: false, error: `${msg}${hint}${fk}` };
    }
    if (!data) return { ok: false, error: "No row returned from database." };
    return { ok: true, todo: data as Todo };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: formatSupabaseNetworkError(raw) };
  }
}

export async function updateTodo(
  ownerClerkId: string,
  todoId: string,
  patch: {
    title?: string;
    notes?: string | null;
    category_id?: string | null;
    due_date?: string | null;
    priority?: number;
  },
): Promise<CreateTodoResult> {
  const updates: {
    title?: string;
    notes?: string | null;
    category_id?: string | null;
    due_date?: string | null;
    priority?: number;
  } = {};

  if (patch.title !== undefined) {
    const t = patch.title.trim();
    if (!t) return { ok: false, error: "Title is required." };
    updates.title = t;
  }
  if (patch.notes !== undefined) {
    updates.notes = patch.notes?.trim() || null;
  }
  if (patch.category_id !== undefined) {
    const cat =
      patch.category_id && String(patch.category_id).trim() !== ""
        ? String(patch.category_id).trim()
        : null;
    updates.category_id = cat;
  }
  if (patch.due_date !== undefined) {
    updates.due_date = patch.due_date || null;
  }
  if (patch.priority !== undefined) {
    updates.priority = Math.min(4, Math.max(1, patch.priority));
  }

  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(ownerClerkId);
    const t = b.todos.find((x) => x.id === todoId);
    if (!t || t.owner_clerk_id !== ownerClerkId) {
      return { ok: false, error: "Task not found." };
    }
    if (updates.title !== undefined) t.title = updates.title;
    if (updates.notes !== undefined) t.notes = updates.notes;
    if (updates.category_id !== undefined) t.category_id = updates.category_id;
    if (updates.due_date !== undefined) t.due_date = updates.due_date;
    if (updates.priority !== undefined) t.priority = updates.priority;
    t.updated_at = iso();
    return { ok: true, todo: t };
  }

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (updates.category_id !== undefined && updates.category_id !== null) {
    if (!UUID_RE.test(updates.category_id)) {
      return { ok: false, error: "Choose a category from the list." };
    }
  }

  try {
    const { data, error } = await sb
      .from("todos")
      .update(updates)
      .eq("id", todoId)
      .eq("owner_clerk_id", ownerClerkId)
      .select("id,owner_clerk_id,category_id,title,notes,done,due_date,priority,created_at,updated_at")
      .single();

    if (error) {
      const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
      const msg = (error as { message?: string }).message ?? "Could not save task.";
      const fk =
        /foreign key|23503/i.test(msg) || code === "23503"
          ? " Pick a category from the list — the category id may be invalid."
          : "";
      return { ok: false, error: `${msg}${fk}` };
    }
    if (!data) return { ok: false, error: "Task not found." };
    return { ok: true, todo: data as Todo };
  } catch (e) {
    const raw = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: formatSupabaseNetworkError(raw) };
  }
}

export async function toggleTodoDone(ownerClerkId: string, todoId: string): Promise<Todo | null> {
  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(ownerClerkId);
    const t = b.todos.find((x) => x.id === todoId);
    if (!t || t.owner_clerk_id !== ownerClerkId) return null;
    t.done = !t.done;
    t.updated_at = iso();
    return t;
  }
  try {
    const cur = await sb
      .from("todos")
      .select("done")
      .eq("id", todoId)
      .eq("owner_clerk_id", ownerClerkId)
      .single();
    if (cur.error || cur.data == null) return null;
    const next = !cur.data.done;
    const { data, error } = await sb
      .from("todos")
      .update({ done: next })
      .eq("id", todoId)
      .eq("owner_clerk_id", ownerClerkId)
      .select("id,owner_clerk_id,category_id,title,notes,done,due_date,priority,created_at,updated_at")
      .single();
    if (error || !data) return null;
    return data as Todo;
  } catch {
    return null;
  }
}

export async function deleteTodo(ownerClerkId: string, todoId: string): Promise<boolean> {
  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(ownerClerkId);
    const i = b.todos.findIndex((x) => x.id === todoId && x.owner_clerk_id === ownerClerkId);
    if (i === -1) return false;
    b.todos.splice(i, 1);
    return true;
  }
  try {
    const { error } = await sb.from("todos").delete().eq("id", todoId).eq("owner_clerk_id", ownerClerkId);
    return !error;
  } catch {
    return false;
  }
}

export async function createReminderNotification(
  ownerClerkId: string,
  body: string,
): Promise<{ id: string; todo?: Todo } | null> {
  const text = body.trim();
  if (!text) return null;
  const sb = getServiceSupabase();
  if (!sb) {
    const r = await createTodo(ownerClerkId, {
      title: `[Reminder] ${text}`,
      notes: "Reminder (Supabase not configured — stored as a task).",
      category_id: null,
      priority: 2,
    });
    return r.ok ? { id: r.todo.id, todo: r.todo } : null;
  }
  try {
    const { data, error } = await sb
      .from("notifications")
      .insert({
        owner_clerk_id: ownerClerkId,
        title: "Reminder",
        body: text,
        type: "reminder",
      })
      .select("id")
      .single();
    if (error || !data) return null;
    return { id: data.id as string };
  } catch {
    return null;
  }
}
