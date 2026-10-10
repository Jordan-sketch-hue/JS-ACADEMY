"use client";

import { useEffect, useRef, useState } from "react";

const GOLD = "#C8A900";
const POLL_MS = 60_000; // check every 60 s

export default function PwaUpdate() {
  const [show, setShow] = useState(false);
  const baselineRef = useRef<string | null>(null);

  // ── Version-polling mechanism ────────────────────────────────────────────
  // Fetches /api/v1/version (returns VERCEL_DEPLOYMENT_ID) and compares
  // against the value seen on first load. Works even when the SW file itself
  // hasn't changed — which is the case for `vercel --prod` deploys.
  useEffect(() => {
    let cancelled = false;

    async function fetchVersion(): Promise<string | null> {
      try {
        const res = await fetch("/api/v1/version", { cache: "no-store" });
        if (!res.ok) return null;
        const data = await res.json();
        return typeof data.v === "string" ? data.v : null;
      } catch {
        return null;
      }
    }

    async function init() {
      const v = await fetchVersion();
      if (cancelled || v === null || v === "dev") return;
      baselineRef.current = v;
    }

    async function poll() {
      if (baselineRef.current === null) return;
      const v = await fetchVersion();
      if (!cancelled && v !== null && v !== "dev" && v !== baselineRef.current) {
        setShow(true);
      }
    }

    init();
    const timer = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  // ── Service-worker mechanism (kept as secondary signal) ──────────────────
  // Fires when a new SW is installed and waiting — only triggers if sw.js
  // actually changes between deploys (currently it doesn't, but kept for
  // future use).
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;

    let reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!reloading) { reloading = true; window.location.reload(); }
    });

    function watchInstalling(sw: ServiceWorker) {
      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          setShow(true);
        }
      });
    }

    async function initSW() {
      const reg =
        (await navigator.serviceWorker.getRegistration("/sw.js")) ??
        (await navigator.serviceWorker.register("/sw.js"));
      if (reg.waiting) { setShow(true); return; }
      if (reg.installing) watchInstalling(reg.installing);
      reg.addEventListener("updatefound", () => {
        if (reg.installing) watchInstalling(reg.installing);
      });
    }

    initSW().catch(() => {});

    const timer = setInterval(() => {
      navigator.serviceWorker
        .getRegistration("/sw.js")
        .then((r) => r?.update())
        .catch(() => {});
    }, POLL_MS);

    return () => clearInterval(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="no-print"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#0f172a",
        color: "#fff",
        borderRadius: 14,
        padding: "12px 14px 12px 16px",
        boxShadow: "0 16px 48px -10px rgba(0,0,0,0.65)",
        fontSize: 13.5,
        fontWeight: 600,
        maxWidth: 310,
        border: `1px solid ${GOLD}66`,
      }}
    >
      <span style={{ flex: 1, lineHeight: 1.4, paddingRight: 2 }}>
        🔄 New version available
      </span>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: "linear-gradient(90deg,#1a4fd6,#2563eb)",
          color: "#fff",
          border: "none",
          borderRadius: 9,
          padding: "7px 14px",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Refresh
      </button>
      <button
        onClick={() => setShow(false)}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          fontSize: 17,
          lineHeight: 1,
          padding: "2px 4px",
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
