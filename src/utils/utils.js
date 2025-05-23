function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

async function unsubscribePush() {
  const registration = await navigator.serviceWorker.ready;
  console.log("unsub");
  const subscription = await registration.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe(); // ⬅️ Ini yang penting
    console.log("✅ Push subscription di-unsubscribe");
  } else {
    console.log("ℹ️ Tidak ada subscription aktif");
  }
}

function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charsLength = chars.length;

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }

  return result;
}


export { urlBase64ToUint8Array, unsubscribePush, generateRandomString };
