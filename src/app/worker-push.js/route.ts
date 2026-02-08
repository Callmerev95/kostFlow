import { NextResponse } from "next/server";

export async function GET() {
  const workerCode = `
    // 1. Memaksa Service Worker baru langsung aktif tanpa menunggu tab ditutup
    self.addEventListener("install", () => {
      self.skipWaiting();
    });

    // 2. Memastikan Service Worker langsung mengambil kendali halaman segera setelah aktif
    self.addEventListener("activate", (event) => {
      event.waitUntil(clients.claim());
    });

    self.addEventListener("push", (event) => {
      let data = {};
      try {
        data = event.data ? event.data.json() : {};
      } catch (e) {
        console.error("[Service Worker] Push data error:", e);
      }

      const title = data.title || "KostFlow Update";
      const options = {
        body: data.body || "Ada pembaruan penting untuk Anda.",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        tag: "kostflow-urgent", // Mengelompokkan notif agar tidak menumpuk
        renotify: true,        // Tetap getar/bunyi meskipun tag-nya sama
        requireInteraction: true, // Notifikasi tidak akan hilang sampai diklik/swipe user
        vibrate: [200, 100, 200],
        data: {
          url: data.url || "/dashboard",
        },
      };

      event.waitUntil(self.registration.showNotification(title, options));
    });

    self.addEventListener("notificationclick", (event) => {
      event.notification.close();
      event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
          for (const client of clientList) {
            if (client.url === event.notification.data.url && "focus" in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
          }
        })
      );
    });
  `;

  return new NextResponse(workerCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Service-Worker-Allowed": "/",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
