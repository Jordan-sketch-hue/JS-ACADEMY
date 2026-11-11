"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const KEY = "myshop_age_verified"

export function useAgeVerified() {
  if (typeof window === "undefined") return false
  try { return localStorage.getItem(KEY) === "yes" } catch { return false }
}

export default function AgeGate({ onVerified }: { onVerified?: () => void }) {
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "yes") setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  function confirm() {
    try { localStorage.setItem(KEY, "yes") } catch {}
    setVisible(false)
    onVerified?.()
  }

  function deny() {
    router.push("/shop")
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ag-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px}
        .ag-card{background:#0D0D0D;border:1px solid rgba(200,168,75,0.35);max-width:440px;width:100%;padding:48px 40px;text-align:center}
        .ag-divider{width:36px;height:1px;background:var(--gold);display:block;margin:0 auto 28px}
        .ag-actions{display:flex;gap:12px;margin-top:32px}
        .ag-yes{flex:1;background:var(--gold);color:#111;font-family:var(--font-sans);font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:14px;border:none;cursor:pointer;transition:all .2s}
        .ag-yes:hover{background:#E8C86A}
        .ag-no{flex:1;background:transparent;color:rgba(255,255,255,0.4);font-family:var(--font-sans);font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:14px;border:1px solid rgba(255,255,255,0.15);cursor:pointer;transition:all .2s}
        .ag-no:hover{border-color:rgba(255,255,255,0.4);color:rgba(255,255,255,0.7)}
      ` }} />
      <div className="ag-backdrop">
        <div className="ag-card">
          <span className="stamp" style={{ display:"block", marginBottom:20 }}>Adults Only</span>
          <span className="ag-divider" />
          <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(22px,4vw,30px)", fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:16 }}>
            Are You 18 or Older?
          </h2>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:13, lineHeight:1.8 }}>
            This section contains products intended for adults only. By entering, you confirm you are 18 years of age or older.
          </p>
          <div className="ag-actions">
            <button className="ag-yes" onClick={confirm}>Yes, I&apos;m 18+</button>
            <button className="ag-no" onClick={deny}>No, Go Back</button>
          </div>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:10, marginTop:20, letterSpacing:".06em" }}>
            By entering you accept our terms of use. This site does not sell to minors.
          </p>
        </div>
      </div>
    </>
  )
}