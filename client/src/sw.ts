/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event: PushEvent) => {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data?.text()}"`);

  const title = "Push Test";
  const options = {
    body: "Yay it works.",
    icon: "/logo_small.png",
    badge: "/logo_small.png",
  };

  try {
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (error) {
    console.error("[Service Worker] Error showing notification:", error);
  }
});
