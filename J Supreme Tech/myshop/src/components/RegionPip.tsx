"use client"
import { useEffect, useState } from "react"

type Region = "JM" | "US" | null

export default function RegionPip() {
  const [region, setRegion] = useState<Region>(null)
  const [detected, setDetected] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Already chosen — skip
    const stored = localStorage.getItem("my_region") as Region
    if (stored) return

    // Detect via Vercel edge header (free, no API key)
    fetch("/api/region")
      .then(r => r.json())
      .then(({ region: r, country }) => {
        setDetected(country)
        // Auto-confirm if clearly JM or US; show pip for ambiguous
        if (r === "JM" || r === "US") {
          setTimeout(() => setVisible(true), 1800)
        }
      })
      .catch(() => {/* silent fail */})
  }, [])

  function choose(r: Region) {
    if (!r) return
    localStorage.setItem("my_region", r)
    setRegion(r)
    setVisible(false)
    // Notify CurrencyContext
    window.dispatchEvent(new CustomEvent("region-set", { detail: r }))
  }

  function dismiss() {
    setDismissed(true)
    setVisible(false)
  }

  if (!visible || dismissed) return null

  const isJM = detected === "JM"
  const isUS = detected === "US"
  const confirmed = isJM ? "Jamaica" : isUS ? "United States" : null

  return (
    <>
      <style>{`
        .region-pip{position:fixed;bottom:0;left:0;right:0;z-index:9000;background:var(--ink);color:#fff;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;animation:pipSlide .35s ease}
        @keyframes pipSlide{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .pip-text{font-size:13px;line-height:1.5;flex:1;min-width:200px}
        .pip-text strong{color:var(--gold)}
        .pip-actions{display:flex;align-items:center;gap:10px;flex-shrink:0}
        .pip-btn{padding:9px 18px;font-family:var(--font-stamp);font-size:11px;letter-spacing:.16em;cursor:pointer;border:none;transition:background .2s}
        .pip-btn-primary{background:var(--gold);color:var(--ink)}
        .pip-btn-primary:hover{background:#d4a830}
        .pip-btn-alt{background:transparent;color:rgba(255,255,255,.7);border:1px solid rgba(255,255,255,.25)}
        .pip-btn-alt:hover{color:#fff;border-color:#fff}
        .pip-close{background:none;border:none;color:rgba(255,255,255,.4);font-size:18px;cursor:pointer;padding:4px 8px;line-height:1}
        .pip-close:hover{color:#fff}
        @media(max-width:600px){.region-pip{flex-direction:column;align-items:flex-start}.pip-actions{width:100%}.pip-btn{flex:1;text-align:center}}
      `}</style>

      <div className="region-pip" role="dialog" aria-label="Confirm your region">
        <p className="pip-text">
          {confirmed
            ? <>We noticed you&apos;re shopping from <strong>{confirmed}</strong> — confirm to see the right prices.</>
            : <>Where are you shopping from? We&apos;ll show you the right prices.</>}
        </p>
        <div className="pip-actions">
          <button className="pip-btn pip-btn-primary" onClick={() => choose("JM")}>
            🇯🇲 Jamaica (JMD)
          </button>
          <button className="pip-btn pip-btn-alt" onClick={() => choose("US")}>
            🇺🇸 United States (USD)
          </button>
          <button className="pip-close" onClick={dismiss} aria-label="Dismiss">×</button>
        </div>
      </div>
    </>
  )
}
