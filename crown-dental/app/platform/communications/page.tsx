"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";

const tabs = ["Inbox", "SMS", "Email", "Phone Logs", "Automations"] as const;
type Tab = typeof tabs[number];

const messages: { id: number; type: string; from: string; preview: string; time: string; unread: boolean; channel: string }[] = [];

const automations = [
  { name: "Appointment Reminder — 48hr", trigger: "48h before appointment", status: "active", sent: 1240, opened: "94%" },
  { name: "Recall — 6-Month Hygiene", trigger: "180 days since last visit", status: "active", sent: 432, opened: "61%" },
  { name: "Missed Appointment Follow-up", trigger: "No-show recorded", status: "active", sent: 87, opened: "72%" },
  { name: "Review Request", trigger: "Appointment completed", status: "active", sent: 310, opened: "48%" },
  { name: "Birthday Message", trigger: "Patient birthday", status: "paused", sent: 156, opened: "88%" },
  { name: "Payment Reminder — 30 days", trigger: "Invoice 30 days overdue", status: "active", sent: 62, opened: "55%" },
];

const channelIcon: Record<string, any> = {
  SMS:   Icons.MessageSquare,
  Email: Icons.Mail,
  Phone: Icons.Phone,
};

const threads: Record<number, { sender: boolean; text: string; time: string }[]> = {};

export default function CommunicationsPage() {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("Inbox");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [compose, setCompose] = useState("");
  const [threadMap, setThreadMap] = useState(threads);
  const [autoStatuses, setAutoStatuses] = useState<Record<string, boolean>>(
    Object.fromEntries(automations.map(a => [a.name, a.status === "active"]))
  );
  const [showCompose, setShowCompose] = useState(false);
  const [newMsgTo, setNewMsgTo] = useState("");
  const [newMsgText, setNewMsgText] = useState("");
  const PATIENTS: string[] = [];

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  const unread = messages.filter((m) => m.unread).length;
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  function sendMessage() {
    if (!compose.trim() || !selected) return;
    const now = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    setThreadMap(prev => ({
      ...prev,
      [selected.id]: [...(prev[selected.id] ?? []), { sender: true, text: compose.trim(), time: now }]
    }));
    setCompose("");
    flash(`Message sent to ${selected.from}.`);
  }

  function sendNewMessage() {
    if (!newMsgText.trim()) return;
    flash(`Message sent to ${newMsgTo}.`);
    setNewMsgText("");
    setShowCompose(false);
  }

  return (
    <div className="flex h-full">
      {/* New Message Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowCompose(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink">New Message</span>
              <button onClick={() => setShowCompose(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">To</label>
                <select value={newMsgTo} onChange={e => setNewMsgTo(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {PATIENTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Message</label>
                <textarea value={newMsgText} onChange={e => setNewMsgText(e.target.value)} rows={4}
                  placeholder="Type your message…"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none resize-none" />
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowCompose(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={sendNewMessage} disabled={!newMsgText.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Send</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      {/* Left panel */}
      <div data-guide="thread-list" className="flex w-72 shrink-0 flex-col border-r border-line bg-white">
        <div className="border-b border-line px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink">Communications</h2>
            <button data-guide="new-msg-btn" onClick={() => setShowCompose(true)} className="gold-btn rounded-lg p-1.5">
              <Icons.Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  active === t ? "bg-ink text-white" : "bg-surface text-slate hover:text-ink"
                }`}
              >
                {t}{t === "Inbox" && unread > 0 && ` (${unread})`}
              </button>
            ))}
          </div>
        </div>

        {active !== "Automations" ? (
          <div className="flex-1 overflow-y-auto divide-y divide-line">
            {messages
              .filter((m) => active === "Inbox" || m.channel === active.replace("Phone Logs", "Phone"))
              .map((msg) => {
                const Icon = channelIcon[msg.channel] ?? Icons.MessageSquare;
                return (
                  <div key={msg.id} onClick={() => setSelectedId(msg.id)} className={`flex cursor-pointer gap-3 px-4 py-3.5 hover:bg-surface transition-colors ${msg.unread ? "bg-gold/3" : ""} ${selectedId === msg.id ? "bg-surface border-l-2 border-gold" : ""}`}>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface">
                      <Icon className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-sm truncate ${msg.unread ? "font-semibold text-ink" : "text-ink"}`}>{msg.from}</p>
                        <span className="shrink-0 text-[10px] text-mist">{msg.time}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-slate">{msg.preview}</p>
                      {msg.unread && <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gold" />}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div data-guide="automation-panel" className="flex-1 overflow-y-auto divide-y divide-line">
            {automations.map((a) => (
              <div key={a.name} className="px-4 py-3.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-ink truncate">{a.name}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${a.status === "active" ? "bg-teal/10 text-teal" : "bg-surface text-slate"}`}>
                    {a.status}
                  </span>
                </div>
                <p className="mt-0.5 text-[10px] text-slate">{a.trigger}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: compose area or automations detail */}
      <div className="flex flex-1 flex-col">
        {active !== "Automations" ? (
          <>
            {/* Conversation thread */}
            {selected ? (
              <>
                <div className="border-b border-line bg-white px-5 py-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
                    <span className="text-xs font-bold text-gold-deep">{selected.from.split(" ").map(w => w[0]).join("")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{selected.from}</p>
                    <p className="text-[10px] text-slate">{selected.channel} · {selected.time}</p>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {(threadMap[selected.id] ?? []).map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender
                          ? "bg-ink text-white rounded-br-sm"
                          : "bg-surface border border-line text-ink rounded-bl-sm"
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`mt-1 text-[10px] ${msg.sender ? "text-white/60" : "text-mist"}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
                    <Icons.MessageSquare className="h-7 w-7 text-gold-deep" strokeWidth={1.5} />
                  </div>
                  <p className="font-semibold text-ink">Select a conversation</p>
                  <p className="mt-1 text-sm text-slate">Choose a message from the left to view the thread.</p>
                </div>
              </div>
            )}
            {/* Compose bar */}
            <div data-guide="compose-area" className="border-t border-line bg-white p-4">
              <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                <input
                  value={compose}
                  onChange={e => setCompose(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={selected ? `Reply to ${selected.from}…` : "Select a conversation to reply…"}
                  disabled={!selected}
                  className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-mist disabled:opacity-50"
                />
                <div className="flex items-center gap-2">
                  <button className="text-mist hover:text-ink transition-colors"><Icons.Paperclip className="h-4 w-4" strokeWidth={1.5} /></button>
                  <button onClick={sendMessage} disabled={!compose.trim() || !selected} className="gold-btn rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 disabled:opacity-40">
                    <Icons.Send className="h-3.5 w-3.5" /> Send
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Automations detail */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-ink">Automation Workflows</h3>
              <button onClick={() => router.push("/platform/automation")} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
                <Icons.Plus className="h-4 w-4" /> New Workflow
              </button>
            </div>
            <div className="space-y-3">
              {automations.map((a) => (
                <div key={a.name} className="card bg-white p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{a.name}</p>
                      <p className="mt-0.5 text-xs text-slate">Trigger: {a.trigger}</p>
                    </div>
                    <button onClick={() => setAutoStatuses(prev => ({ ...prev, [a.name]: !prev[a.name] }))}
                      className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${autoStatuses[a.name] ? "bg-teal" : "bg-mist/30"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${autoStatuses[a.name] ? "translate-x-4" : ""}`} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-6 text-xs text-slate">
                    <span><strong className="text-ink">{a.sent.toLocaleString()}</strong> sent</span>
                    <span><strong className="text-teal">{a.opened}</strong> opened</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
