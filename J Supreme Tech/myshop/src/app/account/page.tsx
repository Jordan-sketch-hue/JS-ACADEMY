"use client"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/account/login"); return }
      setUser(user)
      setLoading(false)
    })
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>Loading...</p>
    </div>
  )

  const name = user?.user_metadata?.full_name ?? user?.email ?? "Shopper"

  return (
    <>
      <style>{`
        .acct-wrap{max-width:900px;margin:0 auto;padding:60px 24px 80px}
        .acct-eyebrow{font-family:var(--font-stamp);font-size:10px;letter-spacing:.22em;color:var(--gold);margin-bottom:12px}
        .acct-title{font-family:var(--font-serif);font-size:clamp(28px,4vw,40px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:4px}
        .acct-sub{font-size:14px;color:var(--ink-muted);margin-bottom:48px}
        .acct-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px;margin-bottom:40px}
        .acct-card{border:1.5px solid var(--border);padding:28px 24px;text-decoration:none;color:var(--ink);transition:border-color .2s,box-shadow .2s;display:block}
        .acct-card:hover{border-color:var(--gold);box-shadow:0 4px 24px rgba(0,0,0,0.06)}
        .acct-card-icon{font-size:24px;margin-bottom:12px}
        .acct-card-title{font-family:var(--font-serif);font-size:16px;font-weight:700;margin-bottom:4px}
        .acct-card-desc{font-size:12px;color:var(--ink-muted);line-height:1.6}
        .acct-signout{background:none;border:1.5px solid var(--border);padding:12px 24px;font-family:var(--font-stamp);font-size:12px;letter-spacing:.14em;color:var(--ink-muted);cursor:pointer;transition:all .2s}
        .acct-signout:hover{border-color:var(--ink);color:var(--ink)}
        @media(max-width:600px){.acct-grid{grid-template-columns:1fr}}
      `}</style>

      <div className="acct-wrap">
        <p className="acct-eyebrow">My Account</p>
        <h1 className="acct-title">Hello, {name.split(" ")[0]}.</h1>
        <p className="acct-sub">{user?.email}</p>

        <div className="acct-grid">
          <Link href="/shop" className="acct-card">
            <div className="acct-card-icon">🛍</div>
            <p className="acct-card-title">Shop Now</p>
            <p className="acct-card-desc">Browse our curated collection of premium products.</p>
          </Link>
          <Link href="/cart" className="acct-card">
            <div className="acct-card-icon">🛒</div>
            <p className="acct-card-title">My Cart</p>
            <p className="acct-card-desc">View and manage the items in your cart.</p>
          </Link>
          <div className="acct-card" style={{ cursor: "default" }}>
            <div className="acct-card-icon">📦</div>
            <p className="acct-card-title">My Orders</p>
            <p className="acct-card-desc">Order history coming soon.</p>
          </div>
        </div>

        <button className="acct-signout" onClick={handleSignOut}>Sign Out</button>
      </div>
    </>
  )
}
