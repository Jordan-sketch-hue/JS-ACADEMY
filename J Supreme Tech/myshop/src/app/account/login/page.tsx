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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
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
        .auth-error{background:#fff0f0;border:1px solid #f5c6c6;color:#c0392b;padding:12px 16px;font-size:13px;margin-bottom:20px}
        .auth-link{text-align:center;margin-top:28px;font-size:13px;color:var(--ink-muted)}
        .auth-link a{color:var(--gold);font-weight:600;text-decoration:none}
        .auth-divider{height:1px;background:var(--border);margin:32px 0;position:relative}
        .auth-divider::after{content:"Mine & Yours Shop";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--surface);padding:0 12px;font-family:var(--font-serif);font-size:12px;color:var(--border);font-style:italic}
        .auth-forgot{float:right;font-size:11px;color:var(--gold);font-weight:600;text-decoration:none;letter-spacing:.04em}
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <p className="auth-eyebrow">Premium Curated Store · Jamaica</p>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-sub">Sign in to your Mine &amp; Yours Shop account to continue shopping.</p>

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

          <div className="auth-divider" />
          <p className="auth-link">New to Mine &amp; Yours Shop? <Link href="/account/signup">Create an account</Link></p>
          <p style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "var(--border)" }}>
            Need help? Call <a href="tel:+16582182282" style={{ color: "var(--gold)" }}>(658) 218-2282</a>
          </p>
        </div>
      </div>
    </>
  )
}
