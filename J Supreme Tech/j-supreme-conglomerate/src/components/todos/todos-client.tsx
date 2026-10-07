"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Todo, TodoCategory } from "@/lib/data/todos";
import {
  createTodoAction,
  createTodoCategoryAction,
  deleteTodoAction,
  toggleTodoAction,
  updateTodoAction,
} from "@/app/(app)/todos/actions";
import {
  LOCAL_TASKS_CHANGED,
  loadLocalTaskBundle,
  loadOrSeedLocalTaskBundle,
  persistLocalTaskBundleQuiet,
} from "@/lib/storage/local-tasks-storage";
import { CountSummary } from "@/components/shared/count-summary";
import { summarizeTodos } from "@/lib/data/workspace-counts";
import { ListChecks, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";

/** Radix Select value for tasks with no lane; maps to `category_id: null`. */
const TODO_CATEGORY_NONE = "__none__";

/** Render task notes with structured formatting when the content contains ☐ bullet markers. */
function NotesDisplay({ text }: { text: string }) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const hasChecklist = lines.some((l) => l.startsWith("☐") || l.startsWith("☑"));

  if (!hasChecklist) {
    return (
      <p className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground/90">{text}</p>
    );
  }

  const sections: { header: string | null; items: string[] }[] = [];
  let current: { header: string | null; items: string[] } = { header: null, items: [] };

  for (const line of lines) {
    if (line.startsWith("☐") || line.startsWith("☑")) {
      current.items.push(line.replace(/^[☐☑]\s*/, ""));
    } else {
      if (current.items.length > 0 || current.header !== null) {
        sections.push(current);
      }
      current = { header: line, items: [] };
    }
  }
  if (current.items.length > 0 || current.header !== null) sections.push(current);

  return (
    <div className="mt-2 space-y-2 text-xs text-muted-foreground/90">
      {sections.map((s, i) => (
        <div key={i}>
          {s.header && (
            <p className="mb-0.5 font-semibold uppercase tracking-wide text-[10px] text-muted-foreground/60">
              {s.header}
            </p>
          )}
          {s.items.length > 0 && (
            <ul className="space-y-0.5 pl-2">
              {s.items.map((item, j) => (
                <li key={j} className="flex items-start gap-1.5">
                  <span className="mt-px shrink-0 text-[10px] text-muted-foreground/40">☐</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

function resolveNewTodoCategoryId(
  raw: string,
  cats: TodoCategory[],
): string | null {
  if (!raw || raw === TODO_CATEGORY_NONE) return null;
  return cats.some((c) => c.id === raw) ? raw : null;
}

/** Resolve lane filter from URL deep link when the category exists in `cats`. */
function resolveLaneFilter(cats: TodoCategory[], laneId: string | null | undefined): string {
  if (!laneId || !cats.some((c) => c.id === laneId)) return "all";
  return laneId;
}

type Props = {
  initialCategories: TodoCategory[];
  initialTodos: Todo[];
  ownerId: string;
  persistLocally: boolean;
  /** Server could not load lanes from Supabase (network, missing tables, etc.). */
  categoriesLoadError?: string | null;
  /** Deep link: filter tasks to this lane when it exists in categories (after bundle load). */
  initialLaneId?: string | null;
};

export function TodosClient({
  initialCategories,
  initialTodos,
  ownerId,
  persistLocally,
  categoriesLoadError = null,
  initialLaneId = null,
}: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>(() =>
    resolveLaneFilter(initialCategories, initialLaneId),
  );
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newCategoryId, setNewCategoryId] = useState<string>(
    () => initialCategories[0]?.id ?? TODO_CATEGORY_NONE,
  );
  const [newDue, setNewDue] = useState("");
  const [newPriority, setNewPriority] = useState("2");
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [catCreating, setCatCreating] = useState(false);
  const [catDialogError, setCatDialogError] = useState<string | null>(null);

  const [categories, setCategories] = useState<TodoCategory[]>(initialCategories);
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [localStoreReady, setLocalStoreReady] = useState(!persistLocally);

  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<string>(TODO_CATEGORY_NONE);
  const [editDue, setEditDue] = useState("");
  const [editPriority, setEditPriority] = useState("2");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (persistLocally) return;
    setCategories(initialCategories);
    setTodos(initialTodos);
  }, [initialCategories, initialTodos, persistLocally]);

  useEffect(() => {
    if (!persistLocally) return;
    const b = loadOrSeedLocalTaskBundle(ownerId);
    setCategories(b.categories);
    setTodos(b.todos);
    setLocalStoreReady(true);
  }, [persistLocally, ownerId]);

  useEffect(() => {
    if (!persistLocally || !localStoreReady) return;
    persistLocalTaskBundleQuiet(ownerId, { categories, todos });
  }, [persistLocally, localStoreReady, ownerId, categories, todos]);

  useEffect(() => {
    if (!persistLocally) return;
    const onExternal = () => {
      const b = loadLocalTaskBundle(ownerId);
      if (b) {
        setCategories(b.categories);
        setTodos(b.todos);
      }
    };
    window.addEventListener(LOCAL_TASKS_CHANGED, onExternal);
    return () => window.removeEventListener(LOCAL_TASKS_CHANGED, onExternal);
  }, [persistLocally, ownerId]);

  useEffect(() => {
    if (!initialLaneId) return;
    if (categories.some((c) => c.id === initialLaneId)) {
      setFilter(initialLaneId);
    }
  }, [categories, initialLaneId]);

  useEffect(() => {
    if (categories.length === 0) return;
    setNewCategoryId((prev) => {
      if (prev === TODO_CATEGORY_NONE) return prev;
      if (prev && categories.some((c) => c.id === prev)) return prev;
      return TODO_CATEGORY_NONE;
    });
  }, [categories]);

  useEffect(() => {
    const focusNewTask = () => {
      if (typeof window === "undefined" || window.location.hash !== "#new-task") return;
      const card = document.getElementById("new-task");
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.requestAnimationFrame(() => {
        document.getElementById("todo-title")?.focus();
      });
    };
    focusNewTask();
    window.addEventListener("hashchange", focusNewTask);
    return () => window.removeEventListener("hashchange", focusNewTask);
  }, []);

  const filteredTodos = useMemo(() => {
    const base = filter === "all" ? todos : todos.filter((t) => t.category_id === filter);
    // Open before done, then newest first (by created_at). Avoids "recently finished"
    // jumping to the top via updated_at when a task is toggled done.
    return base.slice().sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (b.created_at || "").localeCompare(a.created_at || "");
    });
  }, [filter, todos]);

  const taskCounts = useMemo(() => summarizeTodos(todos), [todos]);

  const openByLane = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of todos) {
      if (t.done) continue;
      const key = t.category_id ?? "__none__";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return counts;
  }, [todos]);

  const refresh = () => router.refresh();
  const listScrollRef = useRef<HTMLDivElement>(null);

  const onCreateTodo = async () => {
    if (!newTitle.trim()) return;
    const cat = resolveNewTodoCategoryId(newCategoryId, categories);
    if (persistLocally) {
      const now = new Date().toISOString();
      const pr = Math.min(4, Math.max(1, Number(newPriority) || 2));
      const row: Todo = {
        id: crypto.randomUUID(),
        owner_clerk_id: ownerId,
        category_id: cat,
        title: newTitle.trim(),
        notes: newNotes.trim() || null,
        done: false,
        due_date: newDue || null,
        priority: pr,
        created_at: now,
        updated_at: now,
      };
      setTodos((prev) => [row, ...prev]);
      setFormError(null);
      setNewTitle("");
      setNewNotes("");
      setNewDue("");
      setNewPriority("2");
      setFilter("all");
      return;
    }
    const now = new Date().toISOString();
    const pr = Math.min(4, Math.max(1, Number(newPriority) || 2));
    const tempId = `temp_${crypto.randomUUID()}`;
    const optimisticRow: Todo = {
      id: tempId,
      owner_clerk_id: ownerId,
      category_id: cat,
      title: newTitle.trim(),
      notes: newNotes.trim() || null,
      done: false,
      due_date: newDue || null,
      priority: pr,
      created_at: now,
      updated_at: now,
    };
    setTodos((prev) => [optimisticRow, ...prev]);
    setFormError(null);
    setNewTitle("");
    setNewNotes("");
    setNewDue("");
    setNewPriority("2");
    setFilter("all");
    if (listScrollRef.current) listScrollRef.current.scrollTop = 0;
    const res = await createTodoAction({
      title: optimisticRow.title,
      notes: optimisticRow.notes,
      category_id: cat,
      due_date: newDue || null,
      priority: pr,
    });
    if (!res.ok) {
      setTodos((prev) => prev.filter((t) => t.id !== tempId));
      setFormError(res.error);
      return;
    }
    if (res.todo) {
      setTodos((prev) => prev.map((t) => t.id === tempId ? res.todo! : t));
    }
  };

  const onToggle = async (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, updated_at: new Date().toISOString() }
          : t,
      ),
    );
    if (persistLocally) return;
    await toggleTodoAction(id);
  };

  const openEdit = (t: Todo) => {
    setEditTodo(t);
    setEditTitle(t.title);
    setEditNotes(t.notes ?? "");
    setEditCategoryId(t.category_id ?? TODO_CATEGORY_NONE);
    setEditDue(t.due_date ?? "");
    setEditPriority(String(t.priority));
    setEditError(null);
  };

  const onSaveEdit = async () => {
    if (!editTodo) return;
    const id = editTodo.id;
    const title = editTitle.trim();
    if (!title) {
      setEditError("Title is required.");
      return;
    }
    const cat = resolveNewTodoCategoryId(editCategoryId, categories);
    const notes = editNotes.trim() || null;
    const due = editDue || null;
    const pr = Math.min(4, Math.max(1, Number(editPriority) || 2));

    if (persistLocally) {
      const now = new Date().toISOString();
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                title,
                notes,
                category_id: cat,
                due_date: due,
                priority: pr,
                updated_at: now,
              }
            : t,
        ),
      );
      setEditTodo(null);
      return;
    }

    setEditSaving(true);
    try {
      const res = await updateTodoAction(id, {
        title,
        notes,
        category_id: cat,
        due_date: due,
        priority: pr,
      });
      if (!res.ok) {
        setEditError(res.error);
        return;
      }
      setEditTodo(null);
      refresh();
    } finally {
      setEditSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (persistLocally) {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      return;
    }
    await deleteTodoAction(id);
    refresh();
  };

  const categoryLabel = (id: string | null) => {
    if (!id) return "—";
    return categories.find((c) => c.id === id)?.name ?? "—";
  };

  const categorySelectValue = useMemo(() => {
    if (categories.length === 0) return TODO_CATEGORY_NONE;
    if (newCategoryId === TODO_CATEGORY_NONE) return TODO_CATEGORY_NONE;
    if (newCategoryId && categories.some((c) => c.id === newCategoryId)) {
      return newCategoryId;
    }
    return TODO_CATEGORY_NONE;
  }, [categories, newCategoryId]);

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Choose <strong className="text-foreground">Tech</strong>,{" "}
            <strong className="text-foreground">Marketing</strong>, or{" "}
            <strong className="text-foreground">Trading</strong>, or create your own category. Use Jarvis AI for “add task …”, “remind …”, or “assign …”.
          </p>
          <CountSummary
            items={[
              { label: "open", value: taskCounts.open, emphasis: true },
              { label: "done", value: taskCounts.done },
              { label: "total", value: taskCounts.total },
              ...(taskCounts.uncategorized > 0
                ? [{ label: "no lane", value: taskCounts.uncategorized }]
                : []),
            ]}
          />
        </div>
      </div>

      {categoriesLoadError && (
        <p
          role="status"
          className={cn(
            "rounded-md border px-3 py-2 text-sm",
            persistLocally
              ? "border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-200"
              : "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          {persistLocally ? (
            <>
              <strong className="font-medium">Cloud unreachable — tasks saved in this browser.</strong>{" "}
              {categoriesLoadError}
            </>
          ) : (
            <>
              <strong className="font-medium">Could not load categories from Supabase.</strong>{" "}
              {categoriesLoadError}
            </>
          )}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="border-border/60 bg-card/50 shadow-none backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex flex-wrap items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-primary" />
              Your tasks
              <span className="text-xs font-normal text-muted-foreground">
                {filteredTodos.filter((t) => !t.done).length} open in view
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={filter} onValueChange={setFilter}>
              <div className="overflow-x-auto pb-1">
                <TabsList className="inline-flex min-h-9 w-max gap-1 bg-muted/30">
                  <TabsTrigger value="all" className="gap-1.5">
                    All
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {taskCounts.open}
                    </span>
                  </TabsTrigger>
                  {categories.map((c) => (
                    <TabsTrigger key={c.id} value={c.id} className="gap-2">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: c.color ?? "hsl(var(--primary))" }}
                        aria-hidden
                      />
                      {c.name}
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {openByLane.get(c.id) ?? 0}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <div ref={listScrollRef} className="mt-0 outline-none max-h-[62vh] overflow-y-auto pr-1" role="tabpanel">
                <Separator className="mb-4 bg-border/50" />
                <ul className="flex flex-col gap-2">
                  <AnimatePresence initial={false}>
                    {filteredTodos.length === 0 && (
                      <motion.li
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-lg border border-dashed border-border/60 bg-background/20 px-4 py-10 text-center text-sm text-muted-foreground"
                      >
                        No tasks in this view yet — add one on the right.
                      </motion.li>
                    )}
                    {filteredTodos.map((t) => (
                      <motion.li
                        key={t.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border border-border/50 bg-background/30 px-3 py-3 backdrop-blur-sm",
                          t.done && "opacity-60",
                        )}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-primary"
                          checked={t.done}
                          onChange={() => void onToggle(t.id)}
                          aria-label={t.done ? "Mark not done" : "Mark done"}
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-sm font-medium leading-snug",
                              t.done && "line-through",
                            )}
                          >
                            {t.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{categoryLabel(t.category_id)}</span>
                            {t.due_date && <span>Due {t.due_date}</span>}
                            <span>P{t.priority}</span>
                          </div>
                          {t.notes && (
                            <p className="mt-2 text-xs text-muted-foreground/90">{t.notes}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          aria-label="Edit task"
                          onClick={() => openEdit(t)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label="Delete task"
                          onClick={() => void onDelete(t.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card
            id="new-task"
            className="border-border/60 bg-card/50 shadow-none backdrop-blur-xl scroll-mt-24"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="h-4 w-4 text-primary" />
                New task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {persistLocally && !localStoreReady && (
                <p className="rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                  Loading saved tasks…
                </p>
              )}
              {formError && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {formError}
                </p>
              )}
              <div className="grid gap-2">
                <Label htmlFor="todo-title">Title</Label>
                <Input
                  id="todo-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="bg-background/40"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="todo-notes">Notes</Label>
                <Textarea
                  id="todo-notes"
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Optional context…"
                  className="bg-background/40"
                />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                {categories.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border/60 bg-muted/10 px-3 py-2 text-sm text-muted-foreground">
                    No lanes yet — task will be uncategorized. You can add a lane below anytime.
                  </p>
                ) : (
                  <Select
                    value={categorySelectValue}
                    onValueChange={(v) => setNewCategoryId(v)}
                  >
                    <SelectTrigger className="bg-background/40">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      <SelectItem value={TODO_CATEGORY_NONE}>Uncategorized</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ background: c.color ?? "hsl(var(--primary))" }}
                            />
                            {c.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={() => {
                    setCatDialogError(null);
                    setCatDialogOpen(true);
                  }}
                >
                  + Create new category…
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="todo-due">Due date</Label>
                  <Input
                    id="todo-due"
                    type="date"
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    className="bg-background/40"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select value={newPriority} onValueChange={setNewPriority}>
                    <SelectTrigger className="bg-background/40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">P1 — Critical</SelectItem>
                      <SelectItem value="2">P2 — High</SelectItem>
                      <SelectItem value="3">P3 — Normal</SelectItem>
                      <SelectItem value="4">P4 — Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                className="w-full text-primary-foreground shadow-sm hover:bg-primary/90"
                onClick={() => void onCreateTodo()}
                disabled={!newTitle.trim() || (persistLocally && !localStoreReady)}
              >
                Add task
              </Button>
            </CardContent>
          </Card>

          <Dialog
            open={editTodo !== null}
            onOpenChange={(open) => {
              if (!open) {
                setEditTodo(null);
                setEditError(null);
              }
            }}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit task</DialogTitle>
                <DialogDescription>
                  Update the title, notes, lane, due date, or priority.
                </DialogDescription>
              </DialogHeader>
              {editError && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {editError}
                </p>
              )}
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="bg-background/40"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    rows={4}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Optional context…"
                    className="bg-background/40"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select
                    value={
                      editCategoryId === TODO_CATEGORY_NONE ||
                      categories.some((c) => c.id === editCategoryId)
                        ? editCategoryId
                        : TODO_CATEGORY_NONE
                    }
                    onValueChange={(v) => setEditCategoryId(v)}
                  >
                    <SelectTrigger className="bg-background/40">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={4}>
                      <SelectItem value={TODO_CATEGORY_NONE}>Uncategorized</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          <span className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ background: c.color ?? "hsl(var(--primary))" }}
                            />
                            {c.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-due">Due date</Label>
                    <Input
                      id="edit-due"
                      type="date"
                      value={editDue}
                      onChange={(e) => setEditDue(e.target.value)}
                      className="bg-background/40"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Priority</Label>
                    <Select value={editPriority} onValueChange={setEditPriority}>
                      <SelectTrigger className="bg-background/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">P1 — Critical</SelectItem>
                        <SelectItem value="2">P2 — High</SelectItem>
                        <SelectItem value="3">P3 — Normal</SelectItem>
                        <SelectItem value="4">P4 — Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditTodo(null);
                    setEditError(null);
                  }}
                  disabled={editSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={editSaving || !editTitle.trim()}
                  onClick={() => void onSaveEdit()}
                >
                  {editSaving ? "Saving…" : "Save changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={catDialogOpen}
            onOpenChange={(open) => {
              setCatDialogOpen(open);
              if (!open) setCatDialogError(null);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>New category</DialogTitle>
                <DialogDescription>
                  Add a custom lane (e.g. Ops, Legal). Default lanes are{" "}
                  <strong className="text-foreground">Tech</strong>,{" "}
                  <strong className="text-foreground">Marketing</strong>, and{" "}
                  <strong className="text-foreground">Trading</strong> when you use cloud storage — they
                  appear automatically on first load.
                </DialogDescription>
              </DialogHeader>
              {catDialogError && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {catDialogError}
                </p>
              )}
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="new-cat-name">Name</Label>
                  <Input
                    id="new-cat-name"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Operations"
                    className="bg-background/40"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-cat-color">Color (optional)</Label>
                  <Input
                    id="new-cat-color"
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    placeholder="hsl(38 92% 50%) or leave blank"
                    className="bg-background/40"
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setCatDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={catCreating || !newCatName.trim()}
                  onClick={() => {
                    void (async () => {
                      const name = newCatName.trim();
                      if (!name) return;
                      if (persistLocally) {
                        const row: TodoCategory = {
                          id: crypto.randomUUID(),
                          owner_clerk_id: ownerId,
                          name,
                          color: newCatColor.trim() || null,
                          sort_order: categories.length,
                          created_at: new Date().toISOString(),
                        };
                        setCategories((prev) => [...prev, row]);
                        setNewCategoryId(row.id);
                        setNewCatName("");
                        setNewCatColor("");
                        setCatDialogOpen(false);
                        return;
                      }
                      setCatCreating(true);
                      try {
                        const res = await createTodoCategoryAction({
                          name,
                          color: newCatColor.trim() || null,
                        });
                        if (!res.ok) {
                          setCatDialogError(res.error);
                          return;
                        }
                        setNewCategoryId(res.category.id);
                        setNewCatName("");
                        setNewCatColor("");
                        setCatDialogOpen(false);
                        refresh();
                      } finally {
                        setCatCreating(false);
                      }
                    })();
                  }}
                >
                  {catCreating ? "Creating…" : "Create category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card className="border-primary/20 bg-primary/5 shadow-none backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Sparkles className="h-4 w-4 text-primary" />
                AI shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">add task</span> — creates a todo (e.g.{" "}
                <span className="font-mono text-[11px]">add task: call design</span>).
              </p>
              <p>
                <span className="font-medium text-foreground">remind</span> — reminder (e.g.{" "}
                <span className="font-mono text-[11px]">remind me to invoice Acme</span>).
              </p>
              <p>
                <span className="font-medium text-foreground">assign</span> — assignment capture (e.g.{" "}
                <span className="font-mono text-[11px]">assign to Sam: deploy checklist</span>).
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
