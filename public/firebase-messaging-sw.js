// public/firebase-messaging-sw.js

self.addEventListener("install", (e) => {
  console.log("[FCM SW] Install");
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("[FCM SW] Activate");
});

self.addEventListener("push", (event) => {
  if (!event.data) {
    console.error("[FCM SW] Push event has no data.");
    return;
  }

  const data = event.data.json();
  console.log("[FCM SW] Push received:", data);

  const unreadCount = Number(data.data?.unread_count || 0);
  const clickAction = data.data?.click_action || "/";

  const notificationPromise = self.registration.showNotification(
    data.notification.title,
    {
      body: data.notification.body,
      image: data.notification?.image,
      icon: data.notification.icon || "/logo-192x192.png", // fallback icon
      badge: data.notification.badge || "/logo-192x192.png",
      data: { click_action: clickAction },
    },
  );

  const updateBadgePromise =
    "setAppBadge" in navigator
      ? navigator.setAppBadge(unreadCount).catch(console.error)
      : Promise.resolve();

  const postMessagePromise = self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clients) =>
      clients.forEach((client) =>
        client.postMessage({ type: "updateBadge", count: unreadCount }),
      ),
    );

  event.waitUntil(
    Promise.all([notificationPromise, updateBadgePromise, postMessagePromise]),
  );
});

self.addEventListener("notificationclick", (event) => {
  const clickURL = event.notification.data?.click_action;

  event.notification.close();

  if (!clickURL) {
    return;
  }

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === clickURL && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(clickURL);
        }
      }),
  );
});
