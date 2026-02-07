
import webpush from "web-push";

// Konfigurasi Kunci Rahasia (Server Side Only)
webpush.setVapidDetails(
  "mailto:rev@kostflow.com", // Ganti dengan email lo
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendNotification(subscriptionJson: string, title: string, body: string) {
  try {
    const subscription = JSON.parse(subscriptionJson);

    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body,
        url: "/dashboard/transactions" // URL tujuan saat notif di-klik
      })
    );

    return { success: true };
  } catch (error) {
    console.error("Gagal kirim push notification:", error);
    return { success: false };
  }
}
