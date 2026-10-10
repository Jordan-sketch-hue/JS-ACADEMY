"use client";

import { useUiStore } from "@/stores/ui-store";
import { useWorkspace } from "@/components/app/workspace-context";
import type { Todo } from "@/lib/data/todos";
import type { CrmClientRecord, CrmLeadRecord } from "@/lib/data/crm-records";
import { mergeTodoIntoLocalStorage } from "@/lib/storage/local-tasks-storage";
import { mergeCrmDealIntoLocalStorage } from "@/lib/storage/local-crm-storage";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, ContactRound, Sparkles, Zap } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { JarvisMessageBody } from "@/components/app/jarvis-message-body";
import { cn } from "@/lib/utils";
import type { LeadStage } from "@/lib/data/seed";

type ChatMessage = { role: "assistant" | "user"; text: string };

const inputSelectClass =
  "flex h-9 w-full rounded-md border border-input bg-background/40 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const starter: ChatMessage[] = [
  {
    role: "assistant",
    text: 'I’m **Jarvis AI** — workspace help, research, news context, strategy, and creative workflows.\n\n**Save to Tasks / CRM:** use **Add task** / **Add client** or quick-action lines (“add task: …”, “add client Acme …”). Free-form chat does not write to your database.\n\n**Research mode** (toggle below) gives longer, structured answers for general questions.\n\nShortcut: ⌘⇧A / Ctrl+Shift+A.',
  },
];

type ActionsResponse =
  | { matched: false; message?: string }
  | {
      matched: true;
      intent: string;
      result: { ok: boolean; summary: string };
      localTaskSync?: { todo: Todo };
      localCrmSync?: { client: CrmClientRecord; lead: CrmLeadRecord };
    };

const CRM_STAGES: LeadStage[] = ["cold", "warm", "negotiation", "closed", "lost"];

export function AiAssistantPanel() {
  const router = useRouter();
  const open = useUiStore((s) => s.aiPanelOpen);
  const setOpen = useUiStore((s) => s.setAiPanelOpen);
  const { ownerId, persistLocally } = useWorkspace();
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(starter);
  const [sending, setSending] = useState(false);
  const [researchMode, setResearchMode] = useState(false);

  const [capture, setCapture] = useState<null | "task" | "client">(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskLane, setTaskLane] = useState<"" | "tech" | "marketing" | "trading">("");
  const [taskDue, setTaskDue] = useState("");
  const [taskNotes, setTaskNotes] = useState("");

  const [crmBusiness, setCrmBusiness] = useState("");
  const [crmContact, setCrmContact] = useState("");
  const [crmEmail, setCrmEmail] = useState("");
  const [crmPhone, setCrmPhone] = useState("");
  const [crmStage, setCrmStage] = useState<LeadStage>("cold");
  const [crmNotes, setCrmNotes] = useState("");

  const scrollMessagesToEnd = useCallback(() => {
    const el = messagesScrollRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = el.scrollHeight;
    if (reduceMotion) {
      el.scrollTop = top;
      return;
    }
    el.scrollTo({ top, behavior: "smooth" });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollMessagesToEnd();
      });
    });
    return () => cancelAnimationFrame(id);
  }, [open, messages, scrollMessagesToEnd]);

  const persistFromAction = useCallback(
    (data: Extract<ActionsResponse, { matched: true }>) => {
      if (persistLocally && data.result.ok) {
        if (data.localTaskSync?.todo) {
          mergeTodoIntoLocalStorage(ownerId, data.localTaskSync.todo);
        }
        if (data.localCrmSync) {
          mergeCrmDealIntoLocalStorage(
            ownerId,
            data.localCrmSync.client,
            data.localCrmSync.lead,
          );
        }
      }
      if (data.result.ok) router.refresh();
    },
    [ownerId, persistLocally, router],
  );

  const runQuickAction = useCallback(
    async (
      body: Record<string, unknown>,
      chatHistoryForFallback?: { role: string; content: string }[],
      opts?: { prependUserMessage?: string },
    ) => {
      if (sending) return { ok: false as const };
      setSending(true);
      const prepend = opts?.prependUserMessage?.trim();
      if (prepend) {
        setMessages((m) => [...m, { role: "user", text: prepend }]);
      }
      try {
        const res = await fetch("/api/v1/ai/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify(body),
        });
        if (res.status === 401) {
          setMessages((m) => [
            ...m,
            { role: "assistant", text: "You need to be signed in to run quick actions." },
          ]);
          return { ok: false as const };
        }
        if (!res.ok) {
          let detail = res.statusText || `HTTP ${res.status}`;
          try {
            const errJson = (await res.json()) as { error?: string };
            if (typeof errJson.error === "string" && errJson.error) detail = errJson.error;
          } catch {
            /* ignore */
          }
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              text: `Quick action failed (${res.status}): ${detail}`,
            },
          ]);
          return { ok: false as const };
        }
        const data = (await res.json()) as ActionsResponse;
        if ("matched" in data && data.matched && data.result) {
          persistFromAction(data);
          setMessages((m) => [...m, { role: "assistant", text: data.result.summary }]);
          return { ok: data.result.ok as boolean };
        }
        if ("matched" in data && !data.matched && chatHistoryForFallback) {
          const chatRes = await fetch("/api/v1/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
              messages: chatHistoryForFallback,
              researchMode,
            }),
          });
          let chatJson: { reply?: string; error?: string } = {};
          try {
            chatJson = (await chatRes.json()) as { reply?: string; error?: string };
          } catch {
            /* ignore */
          }
          const reply = chatJson.reply?.trim();
          if (chatRes.ok && reply) {
            setMessages((m) => [...m, { role: "assistant", text: reply }]);
            return { ok: true as const };
          }
          if (chatRes.status === 501) {
            setMessages((m) => [
              ...m,
              {
                role: "assistant",
                text: "Quick actions didn’t match this message, and **chat mode isn’t on** yet. Add **OPENAI_API_KEY** to your server env (e.g. Vercel), redeploy, then try again. Use **Add task** / **Add client** here, or phrases like “add task: …”. See **Need to know** for more.",
              },
            ]);
            return { ok: false as const };
          }
          const chatErr =
            chatJson.error?.trim() ||
            (chatRes.ok ? "Empty model reply." : `Chat failed (${chatRes.status}).`);
          setMessages((m) => [
            ...m,
            {
              role: "assistant",
              text: `${chatErr} Try **Add task** / **Add client**, a quick-action phrase, or check **Need to know** for setup.`,
            },
          ]);
          return { ok: false as const };
        }
        setMessages((m) => [
          ...m,
          { role: "assistant", text: "Unexpected response from actions endpoint." },
        ]);
        return { ok: false as const };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error";
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: `Could not reach quick actions: ${msg}. If this persists, refresh the page and try again.`,
          },
        ]);
        return { ok: false as const };
      } finally {
        setSending(false);
      }
    },
    [persistFromAction, researchMode, sending],
  );

  const send = async () => {
    if (!input.trim() || sending) return;
    const userText = input.trim();
    setInput("");
    const prior = messages;
    const chatHistoryPayload = [...prior, { role: "user" as const, text: userText }].map((row) => ({
      role: row.role,
      content: row.text,
    }));
    await runQuickAction({ message: userText }, chatHistoryPayload, { prependUserMessage: userText });
  };

  const submitTaskForm = async () => {
    const payload: Record<string, unknown> = {
      kind: "todo",
      title: taskTitle.trim() || "New task",
    };
    if (taskLane) payload.laneHint = taskLane;
    if (taskDue.trim()) payload.due_date = taskDue.trim();
    if (taskNotes.trim()) payload.notes = taskNotes.trim();
    const r = await runQuickAction(payload);
    if (r.ok) {
      setTaskTitle("");
      setTaskLane("");
      setTaskDue("");
      setTaskNotes("");
      setCapture(null);
    }
  };

  const quickAddTask = async () => {
    await runQuickAction({ kind: "todo", title: "New task" });
  };

  const submitClientForm = async () => {
    const payload: Record<string, unknown> = {
      kind: "crm_add",
      business_name: crmBusiness.trim(),
      stage: crmStage,
    };
    if (crmContact.trim()) payload.contact_name = crmContact.trim();
    if (crmEmail.trim()) payload.email = crmEmail.trim();
    if (crmPhone.trim()) payload.phone = crmPhone.trim();
    if (crmNotes.trim()) payload.notes = crmNotes.trim();
    const r = await runQuickAction(payload);
    if (r.ok) {
      setCrmBusiness("");
      setCrmContact("");
      setCrmEmail("");
      setCrmPhone("");
      setCrmStage("cold");
      setCrmNotes("");
      setCapture(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex h-full max-h-svh w-full flex-col gap-3 overflow-hidden p-4 sm:max-w-md">
        <SheetHeader className="shrink-0 space-y-2 text-left">
          <SheetTitle className="flex items-center gap-2 font-jarvis text-xl font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-primary" />
            Jarvis AI
          </SheetTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Workspace + general research. Press{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">⌘⇧A</kbd>{" "}
            <span className="whitespace-nowrap">(Ctrl+Shift+A)</span> anywhere.
          </p>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-border accent-primary"
              checked={researchMode}
              onChange={(e) => setResearchMode(e.target.checked)}
              disabled={sending}
            />
            Research mode (longer answers for news, trends, and general questions)
          </label>
        </SheetHeader>
        <div
          ref={messagesScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain rounded-lg border border-border/60 bg-background/30 p-3 shadow-inner scroll-smooth"
          aria-label="Conversation"
        >
          <div className="flex flex-col gap-3 pr-1">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "assistant"
                    ? "rounded-xl border border-border/50 bg-card/60 px-3 py-3 shadow-sm sm:px-4 sm:py-3.5"
                    : "ml-4 rounded-xl bg-primary/15 px-3 py-2.5 text-sm leading-relaxed text-primary-foreground sm:ml-5 sm:px-4 sm:py-3"
                }
              >
                {m.role === "assistant" ? <JarvisMessageBody text={m.text} /> : m.text}
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 space-y-3 rounded-xl border border-border/60 bg-muted/20 p-3 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Quick create
            </p>
            {capture ? (
              <button
                type="button"
                className="text-[11px] font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => setCapture(null)}
                disabled={sending}
              >
                Close form
              </button>
            ) : null}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              size="sm"
              variant={capture === "task" ? "default" : "outline"}
              disabled={sending}
              className="h-10 flex-col gap-0.5 px-1 py-2 text-[11px] leading-tight sm:flex-row sm:text-xs"
              aria-pressed={capture === "task"}
              onClick={() =>
                setCapture((c) => {
                  if (c === "task") return null;
                  return "task";
                })
              }
            >
              <ClipboardList className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
              <span>Task</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant={capture === "client" ? "default" : "outline"}
              disabled={sending}
              className="h-10 flex-col gap-0.5 px-1 py-2 text-[11px] leading-tight sm:flex-row sm:text-xs"
              aria-pressed={capture === "client"}
              onClick={() =>
                setCapture((c) => {
                  if (c === "client") return null;
                  return "client";
                })
              }
            >
              <ContactRound className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
              <span>Client</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={sending}
              className="h-10 flex-col gap-0.5 px-1 py-2 text-[11px] leading-tight sm:flex-row sm:text-xs"
              title='Creates "New task" immediately'
              onClick={() => void quickAddTask()}
            >
              <Zap className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
              <span>Instant</span>
            </Button>
          </div>

          {capture === "task" && (
            <div className="space-y-3 rounded-lg border border-border/50 bg-background/50 p-3 ring-1 ring-primary/10">
              <div className="space-y-1">
                <Label htmlFor="jarvis-task-title">Title</Label>
                <Input
                  id="jarvis-task-title"
                  placeholder="Optional — leave blank for “New task”"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  disabled={sending}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="jarvis-task-lane">Lane</Label>
                  <select
                    id="jarvis-task-lane"
                    className={cn(inputSelectClass)}
                    value={taskLane}
                    onChange={(e) =>
                      setTaskLane(
                        e.target.value as "" | "tech" | "marketing" | "trading",
                      )
                    }
                    disabled={sending}
                  >
                    <option value="">Default (Tech)</option>
                    <option value="tech">Tech</option>
                    <option value="marketing">Marketing</option>
                    <option value="trading">Trading</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="jarvis-task-due">Due</Label>
                  <Input
                    id="jarvis-task-due"
                    type="date"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    disabled={sending}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="jarvis-task-notes">Notes</Label>
                <Textarea
                  id="jarvis-task-notes"
                  rows={2}
                  placeholder="Optional"
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  disabled={sending}
                />
              </div>
              <Button
                className="w-full"
                type="button"
                disabled={sending}
                onClick={() => void submitTaskForm()}
              >
                {sending ? "Saving…" : "Save task"}
              </Button>
            </div>
          )}

          {capture === "client" && (
            <div className="space-y-3 rounded-lg border border-border/50 bg-background/50 p-3 ring-1 ring-primary/10">
              <div className="space-y-1">
                <Label htmlFor="jarvis-crm-business">Company / project</Label>
                <Input
                  id="jarvis-crm-business"
                  placeholder="Optional — we’ll infer from email if empty"
                  value={crmBusiness}
                  onChange={(e) => setCrmBusiness(e.target.value)}
                  disabled={sending}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="jarvis-crm-contact">Contact</Label>
                  <Input
                    id="jarvis-crm-contact"
                    value={crmContact}
                    onChange={(e) => setCrmContact(e.target.value)}
                    disabled={sending}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="jarvis-crm-stage">Stage</Label>
                  <select
                    id="jarvis-crm-stage"
                    className={inputSelectClass}
                    value={crmStage}
                    onChange={(e) => setCrmStage(e.target.value as LeadStage)}
                    disabled={sending}
                  >
                    {CRM_STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="jarvis-crm-email">Email</Label>
                  <Input
                    id="jarvis-crm-email"
                    type="email"
                    autoComplete="email"
                    value={crmEmail}
                    onChange={(e) => setCrmEmail(e.target.value)}
                    disabled={sending}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="jarvis-crm-phone">Phone</Label>
                  <Input
                    id="jarvis-crm-phone"
                    type="tel"
                    value={crmPhone}
                    onChange={(e) => setCrmPhone(e.target.value)}
                    disabled={sending}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="jarvis-crm-notes">Notes</Label>
                <Textarea
                  id="jarvis-crm-notes"
                  rows={2}
                  placeholder="Optional"
                  value={crmNotes}
                  onChange={(e) => setCrmNotes(e.target.value)}
                  disabled={sending}
                />
              </div>
              <Button
                className="w-full"
                type="button"
                disabled={sending}
                onClick={() => void submitClientForm()}
              >
                {sending ? "Saving…" : "Save to CRM"}
              </Button>
            </div>
          )}
        </div>

        <div className="shrink-0 space-y-2 border-t border-border/40 pt-3">
          <Textarea
            placeholder="add task: follow up with Acme — or ask Jarvis anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            disabled={sending}
            className="min-h-[5rem] resize-y"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
          />
          <Button className="w-full" onClick={() => void send()} disabled={sending || !input.trim()}>
            {sending ? "Sending…" : "Send"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
