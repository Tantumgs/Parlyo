/* Parlyo service worker — только оболочка для установки приложения. */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  /* сеть как обычно; обработчик нужен для установки PWA */
});
