"use client"
import { useState, useCallback } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Props {
  onClose: () => void
}

type Step = "auth" | "newsletter" | "done"

export default function AuthModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>("auth")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [prefs, setPrefs] = useState({ optin_alerts: true, optin_promos: true, optin_coupons: true })
  const [subLoading, setSubLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (err) { setError(err.message); setGoogleLoading(false) }
    // Page navigates away — modal unmounts naturally
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setStep("newsletter")
  }

  const toggle = useCallback((key: keyof typeof prefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }))
  }, [])

  async function handleSubscribe() {
    setSubLoading(true)
    const region = localStorage.getItem("my_region") ?? "JM"
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email || "google-user@placeholder", region, ...prefs }),
    })
    setSubLoading(false)
    setStep("done")
    setTimeout(onClose, 2000)
  }

  return (
    <>
      <style>{`
        .am-overlay{position:fixed;inset:0;z-index:9500;background:rgba(10,10,10,.7);display:flex;align-items:center;justify-content:center;padding:24px;animation:amFade .2s ease}
        @keyframes amFade{from{opacity:0}to{opacity:1}}
        .am-card{background:#fff;width:100%;max-width:420px;padding:40px 36px;position:relative;animation:amUp .25s ease}
        @keyframes amUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
        .am-close{position:absolute;top:16px;right:18px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--border);line-height:1}
        .am-close:hover{color:var(--ink)}
        .am-eyebrow{font-family:var(--font-stamp);font-size:9px;letter-spacing:.22em;color:var(--gold);margin-bottom:12px}
        .am-title{font-family:var(--font-serif);font-size:clamp(22px,3.5vw,30px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:8px}
        .am-sub{font-size:13px;color:var(--ink-muted);margin-bottom:28px;line-height:1.6}
        .am-google{width:100%;padding:14px 16px;background:#fff;color:#3c4043;border:1.5px solid var(--border);font-family:var(--font-sans);font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:border-color .2s,box-shadow .2s;margin-bottom:20px}
        .am-google:hover{border-color:#4285f4;box-shadow:0 1px 6px rgba(66,133,244,.2)}
        .am-google:disabled{opacity:.5;cursor:not-allowed}
        .am-or{display:flex;align-items:center;gap:12px;margin-bottom:20px;font-size:11px;color:var(--border);letter-spacing:.08em;text-transform:uppercase}
        .am-or::before,.am-or::after{content:"";flex:1;height:1px;background:var(--border)}
        .am-row{display:flex;gap:8px}
        .am-input{flex:1;padding:13px 14px;border:1.5px solid var(--border);font-size:13px;font-family:var(--font-sans);color:var(--ink);background:#fff;outline:none;transition:border-color .2s}
        .am-input:focus{border-color:var(--gold)}
        .am-submit{padding:13px 20px;background:var(--ink);color:#fff;border:none;font-family:var(--font-stamp);font-size:12px;letter-spacing:.14em;cursor:pointer;white-space:nowrap;transition:background .2s}
        .am-submit:hover{background:var(--gold);color:var(--ink)}
        .am-submit:disabled{opacity:.5;cursor:not-allowed}
        .am-error{font-size:12px;color:#c0392b;margin-top:8px}
        .am-toggle-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--surface)}
        .am-toggle-row:last-of-type{border-bottom:none}
        .am-toggle-label{font-size:13px;color:var(--ink);line-height:1.4}
        .am-toggle-desc{font-size:11px;color:var(--ink-muted);margin-top:2px}
        .am-toggle{width:40px;height:22px;background:var(--border);border:none;cursor:pointer;position:relative;border-radius:11px;transition:background .2s;flex-shrink:0}
        .am-toggle.on{background:var(--gold)}
        .am-toggle::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;background:#fff;border-radius:50%;transition:left .2s}
        .am-toggle.on::after{left:21px}
        .am-done{text-align:center;padding:16px 0}
        .am-done-icon{font-size:40px;margin-bottom:16px}
        .am-done-title{font-family:var(--font-serif);font-size:22px;font-weight:900;color:var(--ink);margin-bottom:8px}
        .am-done-sub{font-size:13px;color:var(--ink-muted);line-height:1.6}
        .am-btn-full{width:100%;padding:15px;background:var(--ink);color:#fff;border:none;font-family:var(--font-stamp);font-size:13px;letter-spacing:.16em;cursor:pointer;margin-top:24px;transition:background .2s}
        .am-btn-full:hover{background:var(--gold);color:var(--ink)}
        .am-btn-full:disabled{opacity:.5;cursor:not-allowed}
        .am-skip{text-align:center;margin-top:16px;font-size:12px;color:var(--border);cursor:pointer;text-decoration:underline}
        @media(max-width:480px){.am-card{padding:32px 24px}}
      `}</style>

      <div className="am-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="am-card">
          <button className="am-close" onClick={onClose} aria-label="Close">×</button>

          {step === "auth" && (
            <>
              <p className="am-eyebrow">Mine &amp; Yours Shop</p>
              <h2 className="am-title">Get Exclusive Deals</h2>
              <p className="am-sub">Create a free account to unlock monthly coupons, restock alerts, and members-only promos.</p>

              <button className="am-google" onClick={handleGoogle} disabled={googleLoading}>
                <svg width="17" height="17" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.7 2.3 30.2 0 24 0 14.7 0 6.8 5.4 2.9 13.3l7.9 6.1C12.6 13.1 17.9 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/><path fill="#FBBC05" d="M10.8 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.3-6.2z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.1 0-11.3-3.6-13.2-8.9l-8.3 6.2C6.8 42.6 14.7 48 24 48z"/></svg>
                {googleLoading ? "Redirecting..." : "Continue with Google"}
              </button>

              <div className="am-or">or use email</div>

              <form onSubmit={handleMagicLink}>
                <div className="am-row">
                  <input className="am-input" type="email" placeholder="Your email address" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    autoComplete="email" />
                  <button className="am-submit" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Link"}
                  </button>
                </div>
                {error && <p className="am-error">{error}</p>}
              </form>
              <p style={{ fontSize:11, color:"var(--border)", marginTop:16, textAlign:"center", lineHeight:1.5 }}>
                We&apos;ll send a magic link — no password needed. Already have an account? <a href="/account/login" style={{ color:"var(--gold)" }}>Sign in</a>
              </p>
            </>
          )}

          {step === "newsletter" && (
            <>
              <p className="am-eyebrow">Almost There</p>
              <h2 className="am-title">What Would You Like?</h2>
              <p className="am-sub">Magic link sent to <strong>{email}</strong>. While you wait — choose what you want from us:</p>

              {([ ["optin_alerts", "Restock Alerts", "Be first to know when sold-out items are back"],
                  ["optin_promos", "Members Promos", "Flash sales and member-only discounts"],
                  ["optin_coupons", "Monthly Coupons", "One coupon code every month, no spam"] ] as [keyof typeof prefs, string, string][])
                .map(([key, label, desc]) => (
                <div key={key} className="am-toggle-row">
                  <div>
                    <div className="am-toggle-label">{label}</div>
                    <div className="am-toggle-desc">{desc}</div>
                  </div>
                  <button className={`am-toggle${prefs[key] ? " on" : ""}`} onClick={() => toggle(key)} aria-pressed={prefs[key]} />
                </div>
              ))}

              <button className="am-btn-full" onClick={handleSubscribe} disabled={subLoading}>
                {subLoading ? "Saving..." : "Save Preferences"}
              </button>
              <p className="am-skip" onClick={onClose}>Skip for now</p>
            </>
          )}

          {step === "done" && (
            <div className="am-done">
              <div className="am-done-icon">✓</div>
              <div className="am-done-title">You&apos;re In</div>
              <p className="am-done-sub">Check your email for the sign-in link. Your preferences are saved.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
