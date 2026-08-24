"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Logo } from "@/components/Logo";

const upcoming: { date: string; time: string; proc: string; provider: string; loc: string }[] = [];
const docs: { name: string; date: string; signed: boolean }[] = [];
const messages: { from: string; text: string; time: string; unread: boolean }[] = [];

export default function PatientPortalPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [confirmedAppts, setConfirmedAppts] = useState<Set<number>>(new Set());
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestNote, setRequestNote] = useState("");

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function confirmAppt(i: number, proc: string) {
    setConfirmedAppts(prev => new Set([...prev, i]));
    flash(`${proc} confirmed. We'll see you then!`);
  }

  function submitRequest() {
    setShowRequestForm(false);
    setRequestNote("");
    flash("Appointment request sent to Crown Kingston. We'll be in touch within 24 hours.");
  }

  return (
    <main className="min-h-screen bg-surface">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      {/* Nav */}
      <header className="border-b border-line bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Logo />
        <nav className="hidden md:flex items-center gap-4">
          <span className="text-sm font-semibold text-ink border-b-2 border-gold-deep pb-0.5">Overview</span>
          <Link href="/portal/timeline" className="text-sm text-slate hover:text-gold-deep transition-colors">My journey</Link>
          <Link href="/portal/messages" className="relative text-sm text-slate hover:text-gold-deep transition-colors">
            Messages
            <span className="absolute -top-1 -right-3 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-white">1</span>
          </Link>
          <Link href="/portal/family" className="text-sm text-slate hover:text-gold-deep transition-colors">Family</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={() => flash("No new notifications.")} className="relative p-2 rounded-lg border border-line bg-white text-slate hover:text-ink">
            <Icons.Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold text-xs font-bold text-white">
              <Icons.User className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink">My Account</p>
              <p className="text-[10px] text-slate">Crown Care+ member</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome */}
        <div className="card bg-white p-6 shadow-card flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-deep to-gold">
            <Icons.User className="h-7 w-7 text-white" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-ink">Good morning</h1>
            <p className="mt-0.5 text-sm text-slate">Crown Care+ · No outstanding balance</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate">Next visit</p>
            <p className="text-sm font-semibold text-ink">{upcoming[0]?.date ?? "—"}</p>
            <p className="text-xs text-gold-deep">{upcoming[0]?.time ?? "No upcoming visits"}</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Upcoming appointments */}
          <div className="card bg-white shadow-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line px-5 py-4">
              <Icons.CalendarClock className="h-4 w-4 text-gold-deep" />
              <span className="font-semibold text-ink">Upcoming appointments</span>
            </div>
            <div className="divide-y divide-line">
              {upcoming.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Icons.CalendarOff className="h-7 w-7 text-mist mb-2" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-ink">No upcoming appointments</p>
                  <p className="text-xs text-slate mt-0.5">Request one below and we&apos;ll be in touch.</p>
                </div>
              ) : (
                upcoming.map((a, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-gold-deep">{a.date} · {a.time}</p>
                        <p className="mt-0.5 text-sm font-medium text-ink">{a.proc}</p>
                        <p className="text-xs text-slate">{a.provider} · {a.loc}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <button onClick={() => flash(`Reschedule request sent for ${a.proc}.`)} className="rounded-lg border border-line bg-surface px-2.5 py-1 text-[11px] text-slate hover:border-gold/40 transition-colors">Reschedule</button>
                        {confirmedAppts.has(i) ? (
                          <span className="flex items-center gap-1 rounded-lg bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal">
                            <Icons.CheckCircle2 className="h-3 w-3" /> Confirmed
                          </span>
                        ) : (
                          <button onClick={() => confirmAppt(i, a.proc)} className="rounded-lg bg-teal/10 px-2.5 py-1 text-[11px] font-semibold text-teal hover:bg-teal/20 transition-colors">Confirm</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div className="px-5 py-3">
                {showRequestForm ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-ink">Request an appointment</p>
                    <textarea
                      value={requestNote}
                      onChange={e => setRequestNote(e.target.value)}
                      rows={3}
                      placeholder="Describe what you need (procedure, urgency, preferred times)…"
                      className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setShowRequestForm(false)} className="flex-1 rounded-lg border border-line py-1.5 text-xs text-slate hover:bg-surface">Cancel</button>
                      <button onClick={submitRequest} disabled={!requestNote.trim()} className="flex-1 gold-btn rounded-lg py-1.5 text-xs disabled:opacity-40">Send Request</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowRequestForm(true)} className="flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:underline">
                    <Icons.Plus className="h-3.5 w-3.5" /> Request an appointment
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="card bg-white shadow-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-line px-5 py-4">
              <Icons.MessageSquare className="h-4 w-4 text-gold-deep" />
              <span className="font-semibold text-ink">Messages</span>
              {messages.filter(m => m.unread).length > 0 && (
                <span className="ml-auto rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold-deep">{messages.filter(m => m.unread).length} new</span>
              )}
            </div>
            <div className="divide-y divide-line">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Icons.MessageSquare className="h-7 w-7 text-mist mb-2" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-ink">No messages yet</p>
                  <p className="text-xs text-slate mt-0.5">Messages from your care team will appear here.</p>
                </div>
              ) : (
                messages.map((m, i) => (
                  <Link key={i} href="/portal/messages" className={`flex items-start gap-3 px-5 py-3.5 hover:bg-surface transition-colors ${m.unread ? "bg-gold/3" : ""}`}>
                    {m.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />}
                    {!m.unread && <span className="mt-1.5 h-1.5 w-1.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink">{m.from}</p>
                      <p className="text-xs text-slate truncate">{m.text}</p>
                    </div>
                    <span className="shrink-0 text-[10px] text-mist">{m.time}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="card bg-white shadow-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Icons.FolderOpen className="h-4 w-4 text-gold-deep" />
            <span className="font-semibold text-ink">Documents & consent forms</span>
          </div>
          <div className="divide-y divide-line">
            {docs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Icons.FolderOpen className="h-7 w-7 text-mist mb-2" strokeWidth={1.5} />
                <p className="text-sm font-medium text-ink">No documents yet</p>
                <p className="text-xs text-slate mt-0.5">Your consent forms and documents will appear here.</p>
              </div>
            ) : (
              docs.map((d) => (
                <div key={d.name} className="flex items-center gap-4 px-5 py-3.5">
                  <Icons.FileText className="h-4 w-4 shrink-0 text-slate" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{d.name}</p>
                    <p className="text-xs text-slate">{d.date}</p>
                  </div>
                  {d.signed
                    ? <span className="flex items-center gap-1 text-xs font-semibold text-teal"><Icons.CheckCircle2 className="h-3.5 w-3.5" /> Signed</span>
                    : <button onClick={() => flash(`Opening "${d.name}" for signature.`)} className="gold-btn rounded-lg px-3 py-1.5 text-xs">Sign now</button>
                  }
                </div>
              ))
            )}
          </div>
        </div>

        {/* Telehealth */}
        <div className="card bg-ink p-6 shadow-card-hover flex items-center gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/20">
            <Icons.Video className="h-6 w-6 text-gold" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Virtual consultation available</h3>
            <p className="text-sm text-white/60 mt-0.5">Talk to your care team about your treatment plan from anywhere — no commute needed.</p>
          </div>
          <button onClick={() => flash("Video call with Dr. Chen booked for next availability.")} className="shrink-0 gold-btn rounded-full px-5 py-2.5 text-sm shadow-gold">
            Book video call
          </button>
        </div>
      </div>
    </main>
  );
}
