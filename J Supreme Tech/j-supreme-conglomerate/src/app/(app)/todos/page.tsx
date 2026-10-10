import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { requireOwnerClerkId } from "@/lib/session";
import type { Todo, TodoCategory } from "@/lib/data/todos";
import {
  isSupabaseTransportFailureMessage,
  listTodoCategories,
  listTodos,
} from "@/lib/data/todos";
import { TodosClient } from "@/components/todos/todos-client";

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<{ lane?: string }>;
}) {
  const owner = await requireOwnerClerkId();
  const params = await searchParams;
  const initialLaneId = params.lane ?? null;

  let persistLocally = !isSupabasePersistenceEnabled();
  let categories: TodoCategory[] = [];
  let todos: Todo[] = [];
  let categoriesLoadError: string | null = null;

  if (!persistLocally) {
    const [catOut, todoRows] = await Promise.all([
      listTodoCategories(owner),
      listTodos(owner),
    ]);
    categories = catOut.categories;
    categoriesLoadError = catOut.loadError;
    todos = todoRows;

    if (categoriesLoadError && isSupabaseTransportFailureMessage(categoriesLoadError)) {
      persistLocally = true;
      categoriesLoadError = `${categoriesLoadError} Tasks on this device are using browser storage until Supabase responds. Data syncs to the cloud again automatically once the connection is fixed.`;
      categories = [];
      todos = [];
    }
  }

  return (
    <TodosClient
      initialCategories={categories}
      initialTodos={todos}
      ownerId={owner}
      persistLocally={persistLocally}
      categoriesLoadError={categoriesLoadError}
      initialLaneId={initialLaneId}
    />
  );
}