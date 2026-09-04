"use client";
import { useState } from "react";
import * as Icons from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

type Message = { side: "practice" | "patient"; text: string; time: string };
type Thread = { id: string; from: string; avatar: string; unread: number; messages: Message[] };

const initialThreads: Thread[] = [];

export default function PortalMessagesPage() {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  const active = threads.find((t) => t.id === activeId) ?? threads[0] ?? null;

  function selectThread(id: string) {
    setActiveId(id);
    setThreads((prev) => prev.map((t) => t.id === id ? { ...t, unread: 0 } : t));
  }

  function send() {
    if (!reply.trim()) return;
    const msg: Message = { side: "patient", text: reply.trim(), time: "Just now" };
    setThreads((prev) => prev.map((t) => t.id === activeId ? { ...t, messages: [...t.messages, msg] } : t));
    setReply("");
  }

  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-line bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link href="/portal" className="text-sm text-slate hover:text-gold-deep transition-colors">Overview</Link>
          <Link href="/portal/timeline" className="text-sm text-slate hover:text-gold-deep transition-colors">My journey</Link>
          <span className="text-sm font-semibold text-ink border-b-2 border-gold-deep pb-0.5">Messages</span>
          <Link href="/portal/family" className="text-sm text-slate hover:text-gold-deep transition-colors">Family</Link>
        </nav>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold">
          <Icons.User className="h-4 w-4 text-white" strokeWidth={1.5} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Icons.Inbox className="h-12 w-12 text-mist mb-4" strokeWidth={1.5} />
            <p className="font-semibold text-ink text-lg">Your inbox is empty</p>
            <p className="mt-2 text-sm text-slate max-w-sm">Messages from your care team will appear here once your practice system is connected.</p>
          </div>
        ) : (
          <div className="flex gap-5 h-[calc(100vh-160px)]">
            {/* Thread list */}
            <div className="w-64 shrink-0 flex flex-col bg-white rounded-2xl border border-line shadow-card overflow-hidden">
              <div className="border-b border-line px-4 py-3.5">
                <p className="text-sm font-semibold text-ink">Inbox</p>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-line">
                {threads.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => selectThread(t.id)}
                    className={`flex items-start gap-3 px-4 py-3.5 cursor-pointer transition-colors ${t.id === activeId ? "bg-gold/5 border-l-2 border-l-gold-deep" : "hover:bg-surface"}`}
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.avatar === "AI" ? "bg-ink-2" : "bg-gradient-to-br from-gold-deep to-gold"}`}>
                      {t.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${t.unread > 0 ? "font-bold text-ink" : "font-semibold text-ink"}`}>{t.from}</p>
                        {t.unread > 0 && <span className="shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white">{t.unread}</span>}
                      </div>
                      <p className="text-[11px] text-slate truncate mt-0.5">{t.messages[t.messages.length - 1].text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thread view */}
            {active && (
              <div className="flex-1 flex flex-col bg-white rounded-2xl border border-line shadow-card overflow-hidden">
                <div className="border-b border-line px-5 py-3.5 flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${active.avatar === "AI" ? "bg-ink-2" : "bg-gradient-to-br from-gold-deep to-gold"}`}>
                    {active.avatar}
                  </div>
                  <p className="text-sm font-semibold text-ink">{active.from}</p>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-surface">
                  {active.messages.map((m, i) => (
                    <div key={i} className={`flex ${m.side === "patient" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-sm rounded-2xl px-4 py-2.5 ${m.side === "patient" ? "bg-gold-deep text-white rounded-br-sm" : "bg-white border border-line text-ink rounded-bl-sm shadow-card"}`}>
                        <p className="text-sm leading-relaxed">{m.text}</p>
                        <p className={`text-[10px] mt-1 ${m.side === "patient" ? "text-white/60" : "text-mist"}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-line p-4">
                  <div className="flex items-end gap-3">
                    <textarea
                      rows={2}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                      placeholder={`Reply to ${active.from}…`}
                      className="flex-1 resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none"
                    />
                    <button onClick={send} disabled={!reply.trim()} className="gold-btn flex h-10 w-10 items-center justify-center rounded-xl shadow-gold disabled:opacity-40 disabled:cursor-not-allowed">
                      <Icons.Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
