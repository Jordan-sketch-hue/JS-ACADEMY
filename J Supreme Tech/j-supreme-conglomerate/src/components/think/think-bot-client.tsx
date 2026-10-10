"use client";

import { useState, useRef, useEffect } from "react";
import { Brain, Send, Trash2, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Should I raise prices for my retainer clients?",
  "What's the fastest path to $10K MRR for Supreme Suite?",
  "Should I focus on product or sales right now?",
  "How do I decide whether to take on a new client?",
  "What's the biggest risk in my business I'm ignoring?",
];

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^#{1,3}\s+(.+)$/gm, '<p class="font-semibold text-foreground mt-3 mb-1">$1</p>')
    .replace(/^[-•]\s+(.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>')
    .replace(/\n\n/g, '<br class="mb-2" />')
    .replace(/\n/g, "<br />");
}

export function ThinkBotClient() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setError(null);

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/think", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Think Bot unavailable.");
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100svh-56px)] flex-col">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3 sm:px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-foreground">Think Bot</h1>
          <p className="text-[10px] text-muted-foreground">Structured reasoning · First-principles thinking</p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto text-muted-foreground"
            onClick={() => { setMessages([]); setError(null); }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {empty ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg">
              <Brain className="h-8 w-8" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">What do you want to think through?</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                Decisions, strategies, ideas — Think Bot breaks it down with structured reasoning.
              </p>
            </div>
            <div className="grid gap-2 w-full max-w-md">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-border/60 bg-card px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground ml-8 self-end"
                    : "bg-card border border-border/60 self-start",
                )}
              >
                {m.role === "assistant" ? (
                  <div
                    className="prose-sm prose-invert leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(m.content) }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            ))}
            {loading && (
              <div className="bg-card border border-border/60 rounded-xl px-4 py-3 self-start flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking…
              </div>
            )}
            {error && (
              <p className="text-xs text-destructive text-center">{error}</p>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* input */}
      <div className="border-t border-border/60 p-3 sm:p-4">
        <div className="max-w-2xl mx-auto flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="What do you want to think through? (Enter to send)"
            className="resize-none min-h-[44px] max-h-[140px] text-sm"
            rows={1}
            disabled={loading}
          />
          <Button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            size="icon"
            className="shrink-0 h-11 w-11 bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
