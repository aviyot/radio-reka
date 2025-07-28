const CACHE_NAME = "radio-reka-v0.3.0";
const STATIC_CACHE = "static-v0.3.0";
const DYNAMIC_CACHE = "dynamic-v0.3.0";

// URLs to cache on install
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/img/icons/android-chrome-192x192.png",
  "/img/icons/android-chrome-512x512.png",
  "/img/icons/apple-icon-180x180.png",
  "/img/icons/favicon-32x32.png",
  "/img/icons/favicon-16x16.png",
  "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap",
  "https://fonts.gstatic.com/s/heebo/v23/NGS6v5_NC0k9P_Hiukt2b_s.woff2",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Installed successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Install failed", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activated successfully");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external audio/video streams
  if (
    url.hostname.includes("streamtheworld.com") ||
    url.hostname.includes("omny.fm")
  ) {
    return;
  }

  // Handle static assets
  if (
    STATIC_ASSETS.includes(request.url) ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Handle HTML pages and API calls
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        // Serve from cache but update in background
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
          })
          .catch(() => {
            // Network failed, cached version is still valid
          });

        return response;
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed and not in cache
          if (request.destination === "document") {
            return caches.match("/");
          }
        });
    })
  );
});

// Background sync for offline functionality
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Service Worker: Background sync triggered");
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "תכנית חדשה ברדיו רקע",
      icon: "/img/icons/android-chrome-192x192.png",
      badge: "/img/icons/android-chrome-192x192.png",
      dir: "rtl",
      lang: "he",
      tag: "radio-reka-notification",
      renotify: true,
      requireInteraction: false,
      actions: [
        {
          action: "listen",
          title: "האזן עכשיו",
        },
        {
          action: "close",
          title: "סגור",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "רדיו רקע", options)
    );
  }
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "listen") {
    event.waitUntil(clients.openWindow("/?live=true"));
  } else if (event.action === "close") {
    // Just close the notification
    return;
  } else {
    // Default click action
    event.waitUntil(clients.openWindow("/"));
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync any pending data when connection is restored
    console.log("Service Worker: Performing background sync");
  } catch (error) {
    console.error("Service Worker: Background sync failed", error);
  }
}

// Message handling from main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Periodic background sync (for browsers that support it)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "radio-update") {
    event.waitUntil(doPeriodicSync());
  }
});

async function doPeriodicSync() {
  try {
    console.log("Service Worker: Periodic sync triggered");
    // Check for updates, refresh cache if needed

    // Update static assets if needed
    const cache = await caches.open(STATIC_CACHE);
    const cachedAssets = await cache.keys();

    for (const asset of STATIC_ASSETS) {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
        }
      } catch (error) {
        console.warn("Service Worker: Failed to update asset", asset, error);
      }
    }
  } catch (error) {
    console.error("Service Worker: Periodic sync failed", error);
  }
}

// Handle app shortcuts
self.addEventListener("appinstalled", (event) => {
  console.log("Service Worker: App installed successfully");
});

// Handle beforeinstallprompt for custom install experience
self.addEventListener("beforeinstallprompt", (event) => {
  console.log("Service Worker: Before install prompt");
});
