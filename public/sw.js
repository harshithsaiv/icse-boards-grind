// Service Worker for ICSE Boards Grind PWA
const CACHE_NAME = "icse-grind-v1";
const OFFLINE_URL = "/offline.html";

// Install event - cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/manifest.json",
        "/icons/icon-192x192.svg",
      ]);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  let data = {
    title: "ICSE Boards Grind",
    body: "Time to study!",
    icon: "/icons/icon-192x192.svg",
    badge: "/icons/icon-192x192.svg",
    tag: "study-reminder",
    data: { url: "/dashboard" },
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      data: data.data,
      vibrate: [200, 100, 200],
      actions: [
        { action: "open", title: "Open App" },
        { action: "dismiss", title: "Dismiss" },
      ],
      requireInteraction: true,
    })
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const urlToOpen = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync for scheduled notifications
self.addEventListener("sync", (event) => {
  if (event.tag === "check-schedule") {
    event.waitUntil(checkScheduleAndNotify());
  }
});

// Periodic background sync (if supported)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "study-reminder") {
    event.waitUntil(checkScheduleAndNotify());
  }
});

async function checkScheduleAndNotify() {
  // This will be triggered by the periodic sync
  // The actual logic is handled by the client-side code
  console.log("Background sync: checking schedule");
}
