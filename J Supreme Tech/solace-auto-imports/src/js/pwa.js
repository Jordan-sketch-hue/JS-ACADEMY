/**
 * Solace Auto Imports — PWA install prompt + update toast.
 *
 * Vanilla JS equivalent of the React pwa-install / pwa-update components.
 * Drop this as a module script at end of <body> on every page.
 *
 * Features:
 *   1. Registers /sw.js in production.
 *   2. Floating "Install App" button (bottom-left).
 *   3. One-click install via beforeinstallprompt (Chrome/Edge Android/Desktop).
 *   4. Step-by-step modal for iOS Safari, non-Chrome Android, Firefox.
 *   5. Auto-prompts once per session, then stays quiet.
 *   6. "New version available" toast with Update button.
 */

const BRAND = "#1E3A5F";
const GOLD = "#C8A900";
const APP = "Solace Auto Imports";
const DOMAIN = "solace-auto-imports.vercel.app";
const ICON = "/icon-192.png";
const SESSION_KEY = "sai-install-shown";

/* ── utils ───────────────────────────────────────────────────────────── */

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith("android-app://")
  );
}

function detect() {
  const ua = navigator.userAgent;
  const isIOS =
    (/iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
    !window.MSStream;
  const isAndroid = /Android/.test(ua);
  const isFirefox = /Firefox|FxiOS/.test(ua);
  const isChromium = /Chrome\//.test(ua) || /Edg\//.test(ua);
  const isSafari = /Safari/.test(ua) && !isChromium && !isFirefox;
  return {
    os: isIOS ? "ios" : isAndroid ? "android" : "desktop",
    browser: isFirefox
      ? "firefox"
      : isChromium
      ? "chromium"
      : isSafari
      ? "safari"
      : "other",
  };
}

/* ── SW registration ─────────────────────────────────────────────────── */

let waitingSW = null;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});

  // Update toast: watch for a new SW entering "installed" state
  navigator.serviceWorker
    .getRegistration("/sw.js")
    .then(async (reg) => {
      if (!reg) reg = await navigator.serviceWorker.register("/sw.js");

      function watchInstalling(sw) {
        sw.addEventListener("statechange", () => {
          if (sw.state === "installed" && navigator.serviceWorker.controller) {
            waitingSW = sw;
            showUpdateToast();
          }
        });
      }

      if (reg.waiting) {
        waitingSW = reg.waiting;
        showUpdateToast();
        return;
      }
      if (reg.installing) watchInstalling(reg.installing);
      reg.addEventListener("updatefound", () => {
        if (reg.installing) watchInstalling(reg.installing);
      });

      // Poll for updates every 60 s
      setInterval(() => {
        navigator.serviceWorker
          .getRegistration("/sw.js")
          .then((r) => r && r.update())
          .catch(() => {});
      }, 60_000);
    })
    .catch(() => {});

  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!reloading) {
      reloading = true;
      window.location.reload();
    }
  });
}

/* Install prompt removed — no app available for this site */

/* ── Update toast ────────────────────────────────────────────────────── */

function showUpdateToast() {
  if (document.getElementById("pwa-update-toast")) return;
  const toast = document.createElement("div");
  toast.id = "pwa-update-toast";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `
    <span style="flex:1;line-height:1.4;padding-right:4px;">🔄 New version available</span>
    <button id="pwa-update-btn" style="
      background:linear-gradient(90deg,#102a47,${BRAND});color:#fff;border:none;
      border-radius:9px;padding:7px 14px;font-size:13px;font-weight:700;
      cursor:pointer;white-space:nowrap;flex-shrink:0;
    ">Update</button>
    <button id="pwa-update-dismiss" aria-label="Dismiss" style="
      background:none;border:none;color:#64748b;cursor:pointer;
      font-size:17px;line-height:1;padding:2px 4px;flex-shrink:0;
    ">✕</button>`;
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "200",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#0f172a",
    color: "#fff",
    borderRadius: "14px",
    padding: "12px 14px 12px 16px",
    boxShadow: "0 16px 48px -10px rgba(0,0,0,0.55)",
    fontSize: "13.5px",
    fontWeight: "600",
    maxWidth: "310px",
    border: `1px solid ${GOLD}55`,
  });
  document.body.appendChild(toast);
  document.getElementById("pwa-update-btn")?.addEventListener("click", () => {
    if (waitingSW) waitingSW.postMessage("SKIP_WAITING");
  });
  document.getElementById("pwa-update-dismiss")?.addEventListener("click", () => toast.remove());
}
