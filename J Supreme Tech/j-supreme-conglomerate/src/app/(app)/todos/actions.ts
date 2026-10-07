"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  createTodo,
  createTodoCategory,
  deleteTodo,
  toggleTodoDone,
  updateTodo,
} from "@/lib/data/todos";

export async function createTodoAction(input: {
  title: string;
  notes?: string | null;
  category_id?: string | null;
  due_date?: string | null;
  priority?: number;
}) {
  const owner = await requireOwnerClerkId();
  const result = await createTodo(owner, {
    title: input.title,
    notes: input.notes ?? null,
    category_id: input.category_id || null,
    due_date: input.due_date || null,
    priority: input.priority ?? 2,
  });
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/todos");
  revalidatePath("/dashboard");
  return { ok: true as const, todo: result.todo };
}

export async function createTodoCategoryAction(input: {
  name: string;
  color?: string | null;
}) {
  const owner = await requireOwnerClerkId();
  const result = await createTodoCategory(owner, {
    name: input.name,
    color: input.color ?? null,
  });
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/todos");
  revalidatePath("/dashboard");
  return { ok: true as const, category: result.category };
}

export async function updateTodoAction(
  todoId: string,
  patch: {
    title?: string;
    notes?: string | null;
    category_id?: string | null;
    due_date?: string | null;
    priority?: number;
  },
) {
  const owner = await requireOwnerClerkId();
  const result = await updateTodo(owner, todoId, patch);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/todos");
  revalidatePath("/dashboard");
  return { ok: true as const, todo: result.todo };
}

export async function toggleTodoAction(todoId: string) {
  const owner = await requireOwnerClerkId();
  const row = await toggleTodoDone(owner, todoId);
  revalidatePath("/todos");
  revalidatePath("/dashboard");
  return row;
}

export async function deleteTodoAction(todoId: string) {
  const owner = await requireOwnerClerkId();
  const ok = await deleteTodo(owner, todoId);
  revalidatePath("/todos");
  revalidatePath("/dashboard");
  return ok;
}
