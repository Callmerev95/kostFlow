
// Fungsi untuk convert VAPID Key ke format yang dimengerti browser
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUserToPush() {
  // 1. Cek apakah browser mendukung push
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push messaging is not supported");
    return null;
  }

  // 2. Tunggu Service Worker siap
  const registration = await navigator.serviceWorker.ready;

  // 3. Minta izin ke user
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission not granted for notifications");
  }

  // 4. Daftarkan user ke Push Server browser
  const subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    ),
  };

  const subscription = await registration.pushManager.subscribe(subscribeOptions);

  // Subscription disimpan di supabase
  return JSON.stringify(subscription);
}