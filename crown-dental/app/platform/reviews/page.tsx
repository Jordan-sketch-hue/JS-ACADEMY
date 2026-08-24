"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const reviews: { id: string; patient: string; rating: number; date: string; platform: string; text: string; replied: boolean }[] = [];

const platforms: Record<string, string> = {
  Google:   "bg-blue-50 text-blue-700",
  Yelp:     "bg-red-50 text-red-600",
  Facebook: "bg-indigo-50 text-indigo-700",
};

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Icons.Star key={i} className={`h-3.5 w-3.5 ${i <= n ? "text-gold-deep fill-gold-deep" : "text-line"}`} strokeWidth={1.5} />
      ))}
    </div>
  );
}

const PATIENTS: string[] = [];

export default function ReviewsPage() {
  const [replied, setReplied] = useState<Set<string>>(new Set());
  const [replyOpen, setReplyOpen] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showRequest, setShowRequest] = useState(false);
  const [requestPatient, setRequestPatient] = useState(PATIENTS[0] ?? "");
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

  function submitReply(id: string) {
    setReplied(prev => new Set([...prev, id]));
    setReplyOpen(null);
    setReplyText("");
  }

  function sendReviewRequest() {
    setShowRequest(false);
    flash(`Review request sent to ${requestPatient} via SMS.`);
  }

  return (
    <div className="p-6 space-y-6">
      {showRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowRequest(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink">Request Review</span>
              <button onClick={() => setShowRequest(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Select patient</label>
                <select value={requestPatient} onChange={e => setRequestPatient(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {PATIENTS.length === 0 ? (
                    <option value="">No patients loaded</option>
                  ) : (
                    PATIENTS.map(p => <option key={p}>{p}</option>)
                  )}
                </select>
              </div>
              <p className="text-xs text-slate">An SMS will be sent with a direct link to leave a Google review.</p>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowRequest(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={sendReviewRequest} disabled={!requestPatient} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Send Request</button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Reviews</h1>
          <p className="mt-1 text-sm text-slate">{reviews.length} reviews · {avg} avg rating</p>
        </div>
        <button onClick={() => setShowRequest(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.Send className="h-4 w-4" /> Request Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center card bg-white shadow-card rounded-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
            <Icons.Star className="h-7 w-7 text-mist" strokeWidth={1.5} />
          </div>
          <p className="font-semibold text-ink">No reviews yet</p>
          <p className="mt-1 text-sm text-slate">Reviews will appear here once connected to your practice system. Use the button above to request reviews from patients.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Avg Rating",       value: avg,   icon: "Star",          color: "text-gold-deep" },
              { label: "Total Reviews",    value: String(reviews.length), icon: "MessageSquare", color: "text-ink" },
              { label: "Response Rate",    value: reviews.length > 0 ? `${Math.round((replied.size / reviews.length) * 100)}%` : "—", icon: "Reply", color: "text-teal" },
              { label: "Awaiting Reply",   value: String(reviews.filter(r => !replied.has(r.id)).length), icon: "Clock", color: "text-slate" },
            ].map(s => {
              const I = (Icons as any)[s.icon];
              return (
                <div key={s.label} className="card bg-white p-4 shadow-card">
                  <div className="flex items-center gap-2 mb-2">
                    <I className={`h-4 w-4 ${s.color}`} strokeWidth={1.5} />
                    <p className="text-xs text-slate">{s.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-ink">{s.value}</p>
                </div>
              );
            })}
          </div>

          <div className="card bg-white p-5 shadow-card">
            <h3 className="text-sm font-semibold text-ink mb-4">Rating Breakdown</h3>
            <div className="space-y-2">
              {[5,4,3,2,1].map(star => {
                const count = reviews.filter(r => r.rating === star).length;
                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12 shrink-0">
                      <span className="text-xs text-ink font-medium">{star}</span>
                      <Icons.Star className="h-3 w-3 text-gold-deep fill-gold-deep" />
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
                      <div className="h-full rounded-full bg-gold-deep transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-slate w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="card bg-white p-5 shadow-card space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <p className="text-sm font-semibold text-ink">{review.patient}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${platforms[review.platform]}`}>{review.platform}</span>
                      {replied.has(review.id) && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-teal/10 text-teal">Replied</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars n={review.rating} />
                      <span className="text-[11px] text-mist">{review.date}</span>
                    </div>
                  </div>
                  {!replied.has(review.id) && (
                    <button onClick={() => setReplyOpen(replyOpen === review.id ? null : review.id)} className="gold-btn rounded-lg px-3 py-1.5 text-xs shrink-0">
                      Reply
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                {replyOpen === review.id && (
                  <div className="space-y-2 border-t border-line pt-3">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a professional reply..." rows={3}
                      className="w-full rounded-lg border border-line px-3 py-2 text-sm text-ink placeholder:text-mist focus:outline-none focus:border-gold/50 resize-none" />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setReplyOpen(null); setReplyText(""); }} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:text-ink transition-colors">Cancel</button>
                      <button onClick={() => submitReply(review.id)} disabled={!replyText.trim()} className="gold-btn rounded-lg px-4 py-1.5 text-xs disabled:opacity-40">Post Reply</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
