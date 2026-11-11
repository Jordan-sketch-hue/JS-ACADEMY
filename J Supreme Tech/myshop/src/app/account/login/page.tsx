"use client"
import { useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    setLoading(false)
    if (err) { setError(err.message); return }
    router.push("/account")
  }

  return (
    <>
      <style>{`
        .auth-wrap{min-height:calc(100vh - 160px);display:flex;align-items:center;justify-content:center;padding:48px 24px;background:var(--surface)}
        .auth-card{width:100%;max-width:440px}
        .auth-eyebrow{font-family:var(--font-stamp);font-size:10px;letter-spacing:.22em;color:var(--gold);margin-bottom:16px}
        .auth-title{font-family:var(--font-serif);font-size:clamp(28px,4vw,38px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:8px}
        .auth-sub{font-size:14px;color:var(--ink-muted);margin-bottom:36px;line-height:1.6}
        .auth-field{margin-bottom:20px}
        .auth-label{display:block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);margin-bottom:8px}
        .auth-input{width:100%;padding:14px 16px;border:1.5px solid var(--border);font-size:14px;font-family:var(--font-sans);color:var(--ink);background:#fff;outline:none;transition:border-color .2s;box-sizing:border-box}
        .auth-input:focus{border-color:var(--gold)}
        .auth-btn{width:100%;padding:16px;background:var(--ink);color:#fff;border:none;font-family:var(--font-stamp);font-size:14px;letter-spacing:.18em;cursor:pointer;transition:background .2s;margin-top:8px}
        .auth-btn:hover{background:var(--gold);color:var(--ink)}
        .auth-btn:disabled{opacity:.5;cursor:not-allowed}
        .auth-google{width:100%;padding:15px 16px;background:#fff;color:#3c4043;border:1.5px solid var(--border);font-family:var(--font-sans);font-size:14px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:border-color .2s,box-shadow .2s;margin-bottom:24px}
        .auth-google:hover{border-color:#4285f4;box-shadow:0 1px 6px rgba(66,133,244,.2)}
        .auth-google:disabled{opacity:.5;cursor:not-allowed}
        .auth-error{background:#fff0f0;border:1px solid #f5c6c6;color:#c0392b;padding:12px 16px;font-size:13px;margin-bottom:20px}
        .auth-link{text-align:center;margin-top:28px;font-size:13px;color:var(--ink-muted)}
        .auth-link a{color:var(--gold);font-weight:600;text-decoration:none}
        .auth-or{display:flex;align-items:center;gap:12px;margin-bottom:24px;font-size:11px;color:var(--border);letter-spacing:.1em;text-transform:uppercase}
        .auth-or::before,.auth-or::after{content:"";flex:1;height:1px;background:var(--border)}
        .auth-forgot{float:right;font-size:11px;color:var(--gold);font-weight:600;text-decoration:none;letter-spacing:.04em}
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <p className="auth-eyebrow">Premium Curated Store · Jamaica</p>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your Mine &amp; Yours Shop account.</p>

          <button className="auth-google" onClick={handleGoogle} disabled={googleLoading}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.7 2.3 30.2 0 24 0 14.7 0 6.8 5.4 2.9 13.3l7.9 6.1C12.6 13.1 17.9 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/><path fill="#FBBC05" d="M10.8 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.2.8-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l8.3-6.2z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6.1 0-11.3-3.6-13.2-8.9l-8.3 6.2C6.8 42.6 14.7 48 24 48z"/></svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <div className="auth-or">or</div>

          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email Address
                <a href="/account/forgot" className="auth-forgot">Forgot password?</a>
              </label>
              <input id="email" className="auth-input" type="email" placeholder="you@example.com" required
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input id="password" className="auth-input" type="password" placeholder="Your password" required
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="auth-link" style={{marginTop:24}}>New here? <Link href="/account/signup">Create an account</Link></p>
          <p style={{ textAlign:"center", marginTop:16, fontSize:11, color:"var(--border)" }}>
            Need help? Call <a href="tel:+16582182282" style={{ color:"var(--gold)" }}>(658) 218-2282</a>
          </p>
        </div>
      </div>
    </>
  )
}
