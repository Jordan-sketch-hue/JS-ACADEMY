"use client";
import { useEffect, useState } from "react";

type BIP = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const APP = "J Supreme";
const BRAND = "#6366F1";
const DOMAIN = "j-supreme-conglomerate.vercel.app";
const ICON = "/icon-192.png";
const INSTALLED_KEY = "jsc-install-installed"; // set once installed → keeps install UI hidden

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.startsWith("android-app://")
  );
}

function detect(): { os: "ios" | "android" | "desktop"; browser: "chromium" | "safari" | "firefox" | "other" } {
  if (typeof navigator === "undefined") return { os: "desktop", browser: "chromium" };
  const ua = navigator.userAgent;
  const ios = (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) && !(window as unknown as { MSStream?: unknown }).MSStream;
  const android = /Android/.test(ua);
  const ff = /Firefox|FxiOS/.test(ua);
  const chromium = /Chrome\//.test(ua) || /Edg\//.test(ua);
  const safari = /Safari/.test(ua) && !chromium && !ff;
  return {
    os: ios ? "ios" : android ? "android" : "desktop",
    browser: ff ? "firefox" : chromium ? "chromium" : safari ? "safari" : "other",
  };
}

export default function PwaInstall() {
  const [deferred, setDeferred] = useState<BIP | null>(null);
  const [installed, setInstalled] = useState(false);
  const [open, setOpen] = useState(false);
  const [env, setEnv] = useState<ReturnType<typeof detect>>({ os: "desktop", browser: "chromium" });

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    setEnv(detect());
    try { if (localStorage.getItem(INSTALLED_KEY)) setInstalled(true); } catch {}
    if (isStandalone()) { setInstalled(true); return; }

    const onBIP = (e: Event) => { e.preventDefault(); setDeferred(e as BIP); setInstalled(false); try { localStorage.removeItem(INSTALLED_KEY); } catch {} };
    const onInstalled = () => { setInstalled(true); setOpen(false); try { localStorage.setItem(INSTALLED_KEY, "1"); } catch {} };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);


    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) { setOpen(true); return; }
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") { setInstalled(true); setOpen(false); }
    setDeferred(null);
  };

  const oneClick = !!deferred;
  // Chrome/Edge fire beforeinstallprompt only when the app is installable and
  // NOT already installed — requiring it there hides the install UI for users
  // who already have the app. Safari/iOS/Firefox never fire it → keep showing.
  if (installed || (env.browser === "chromium" && !oneClick)) return null;

  return (
    <>
      <button
        onClick={() => (oneClick ? install() : setOpen(true))}
        aria-label={`Install the ${APP} app`}
        className="no-print fixed z-[85] bottom-5 left-5 inline-flex items-center gap-2 rounded-full pl-3.5 pr-4 py-2.5 text-white text-sm font-bold border hover:-translate-y-0.5 transition-all"
        style={{ background: "#0E0F12", borderColor: BRAND, boxShadow: "0 12px 34px -10px rgba(0,0,0,.6)" }}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full text-white text-base leading-none" style={{ background: BRAND }}>⤓</span>
        Install App
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/55 backdrop-blur-sm"
          role="dialog" aria-modal="true" aria-label={`Install ${APP}`}
          onClick={() => setOpen(false)}
        >
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-1.5" style={{ background: BRAND }} />
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ICON} alt="" width={56} height={56} className="rounded-2xl shrink-0 ring-1 ring-slate-200" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Install {APP}</h2>
                  <p className="text-sm text-slate-500 mt-1">One tap from your home screen — full-screen, works offline, no app store.</p>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close" className="shrink-0 p-1.5 -mt-1 -mr-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-2xl leading-none">×</button>
              </div>

              <div className="mt-4 flex items-center gap-2.5 rounded-2xl px-3.5 py-3 border" style={{ background: `${BRAND}14`, borderColor: `${BRAND}33`, color: "#0f172a" }}>
                <span aria-hidden className="text-lg leading-none">📱💻</span>
                <p className="text-[13px] font-semibold leading-snug">Installs on <strong>all your devices</strong> — your computer <em>and</em> your phone. On iPhone &amp; Android, open <strong>{DOMAIN}</strong> and add it to your home screen too.</p>
              </div>

              {oneClick && (
                <button onClick={install} className="mt-4 w-full rounded-xl py-3.5 font-bold text-white hover:scale-[1.02] transition-transform" style={{ background: BRAND, boxShadow: `0 12px 30px -10px ${BRAND}b3` }}>
                  Install now — one tap
                </button>
              )}

              <div className="mt-4 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-4 text-sm text-slate-700 leading-relaxed">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: BRAND }}>{oneClick ? "Prefer to do it manually?" : "How to install"}</p>
                {env.os === "ios" && <p>Tap the <strong>Share</strong> icon in Safari, then <strong>Add to Home Screen</strong>.</p>}
                {env.os === "android" && !oneClick && <p>Open Chrome&apos;s <strong>⋮ menu</strong>, then <strong>Add to Home screen</strong> / <strong>Install app</strong>.</p>}
                {env.os === "android" && oneClick && <p>Tap <strong>Install now</strong> above, or use Chrome&apos;s <strong>⋮ menu → Add to Home screen</strong>.</p>}
                {env.os === "desktop" && env.browser === "chromium" && <p>Click the <strong>install icon</strong> at the right of the address bar{oneClick ? " (or the button above)" : ""}, then <strong>Install</strong>.</p>}
                {env.os === "desktop" && env.browser === "safari" && <p>In Safari, choose <strong>File → Add to Dock…</strong></p>}
                {env.os === "desktop" && (env.browser === "firefox" || env.browser === "other") && <p>Open <strong>{DOMAIN}</strong> in <strong>Chrome</strong> or <strong>Edge</strong>, then click the install icon in the address bar.</p>}
              </div>

              <button onClick={() => setOpen(false)} className="mt-4 w-full text-center text-sm text-slate-400 hover:text-slate-600">Maybe later</button>
              <button onClick={() => { try { localStorage.setItem(INSTALLED_KEY, "1"); } catch {} setInstalled(true); setOpen(false); }} className="mt-1 w-full text-center text-xs text-slate-300 hover:text-slate-500 transition">Already installed? Don&apos;t show this again</button>
              <button onClick={() => { try { localStorage.setItem(INSTALLED_KEY, "1"); } catch {} setInstalled(true); setOpen(false); }} className="mt-1 w-full text-center text-xs text-slate-300 hover:text-slate-500 transition">Already installed? Don&apos;t show this again</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
