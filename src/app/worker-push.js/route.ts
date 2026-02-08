import { NextResponse } from "next/server";

/**
 * API Route ini bertindak sebagai "Pabrik Script" virtual.
 * Alih-alih mengandalkan file fisik di folder public yang sering dihapus library PWA,
 */
export async function GET() {
  const workerCode = `
    self.addEventListener("push", (event) => {
      console.log("[Service Worker] Push Received.");
      const data = event.data ? event.data.json() : {};
      
      const title = data.title || "KostFlow Update";
      const options = {
        body: data.body || "Ada informasi baru untuk Anda.",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [100, 50, 100],
        data: {
          url: data.url || "/dashboard",
        },
      };

      event.waitUntil(self.registration.showNotification(title, options));
    });

    self.addEventListener("notificationclick", (event) => {
      console.log("[Service Worker] Notification click Received.");
      event.notification.close();

      event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
          // Jika tab sudah terbuka, fokus ke tab tersebut
          for (const client of clientList) {
            if (client.url === event.notification.data.url && "focus" in client) {
              return client.focus();
            }
          }
          // Jika belum ada tab terbuka, buka tab baru
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
