// Service worker — PWA install + web push notifications.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {
  // Passthrough — no caching for Clerk-authed dynamic routes.
});

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "J Supreme", body: event.data.text() };
  }
  const {
    title = "J Supreme Conglomerate",
    body = "",
    url = "/jarvis/whatsapp",
    icon = "/icon-192.png",
    badge = "/icon-192.png",
    tag,
    urgent = false,
  } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      data: { url },
      tag: tag || "jsc-push",
      renotify: !!tag,
      requireInteraction: urgent,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/jarvis/whatsapp";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.registration.scope) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
