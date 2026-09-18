/* AXIOM service worker — app shell cache, network-first for everything else */
const CACHE = "axiom-v1.7.0";
const SHELL = [
  "/", "/index.html", "/lexevo.html", "/style.css",
  "/app.js", "/agentkit.js", "/stack.js", "/train.js", "/zip.js",
  "/designkit.js", "/blocks.js", "/brands.js", "/integrations.js",
  "/pages.js", "/media.js", "/quality.js",
  "/grade.js", "/imagine.js", "/studio.js", "/canvas.js", "/social.js", "/reels.js", "/campaign.js",
  "/neural.js", "/neuralui.js", "/router.js",
  "/favicon.svg", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png",
];

self.addEventListener("install", (e) => {
  // Pre-cache shell but DO NOT skipWaiting — page will prompt user to update
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

// Page sends SKIP_WAITING when user clicks "Install Update"
self.addEventListener("message", (e) => {
  if (e.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return; // API always live

  // network-first, cache fallback — the agent needs fresh code but must work offline
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && url.origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((m) => m || caches.match("/index.html")))
  );
});
