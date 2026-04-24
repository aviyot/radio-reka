// גרסה מסונכרנת עם package.json
const APP_VERSION = "0.7.0";
const CACHE_NAME = `radio-reka-${APP_VERSION}`;
const STATIC_CACHE = `static-${APP_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${APP_VERSION}`;

// URLs to cache on install
// הסרתי מכאן את הפונטים החיצוניים כדי למנוע שגיאות CORS בהתקנה
// הם יישמרו אוטומטית כשהמשתמש יגלוש (Runtime Caching)
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/img/icons/android-chrome-192x192.png",
  "/img/icons/android-chrome-512x512.png",
  "/img/icons/apple-icon-180x180.png",
  "/img/icons/favicon-32x32.png",
  "/img/icons/favicon-16x16.png",
];

// Install
self.addEventListener("install", (event) => {
  console.log("[SW] Installing version:", APP_VERSION);
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      console.log("[SW] Caching static assets...");

      const promises = STATIC_ASSETS.map(async (url) => {
        try {
          // מנסים להביא את הקובץ
          const req = new Request(url, { cache: "reload" });
          const response = await fetch(req);

          if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
          }

          return cache.put(url, response);
        } catch (error) {
          console.warn(`[SW] נכשל בטעינת קובץ לקאש: ${url}`, error);
        }
      });

      return Promise.all(promises);
    }),
  );
});

// Activate
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating version:", APP_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // מוחק כל קאש ישן ששייך לאפליקציה הזו
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            (cacheName.startsWith("radio-reka") ||
              cacheName.startsWith("static-") ||
              cacheName.startsWith("dynamic-"))
          ) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch Handler
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // --- תיקון קריטי: סינון פרוטוקולים ---
  // מתעלם מכל מה שהוא לא http/https (כמו chrome-extension://)
  if (!url.protocol.startsWith("http")) return;

  // 1. התעלם מבקשות שאינן GET
  if (request.method !== "GET") return;

  // 2. התעלם מסטרימינג של אודיו
  if (
    url.hostname.includes("streamtheworld.com") ||
    url.hostname.includes("omny.fm") ||
    url.pathname.endsWith(".mp3") ||
    url.pathname.endsWith(".aac")
  ) {
    return;
  }

  // 3. אסטרטגיה לדפים (Navigation) - Network First
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches
            .open(DYNAMIC_CACHE)
            .then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match("/") || caches.match(request)),
    );
    return;
  }

  // 4. אסטרטגיה לקבצים סטטיים (תמונות, פונטים) - Cache First
  if (
    STATIC_ASSETS.includes(url.pathname) ||
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          // שומרים בקאש רק אם התשובה תקינה (וגם סטטוס 0 לפונטים זה בסדר ברמת Runtime)
          if (
            networkResponse.ok ||
            (networkResponse.status === 0 && networkResponse.type === "opaque")
          ) {
            const responseClone = networkResponse.clone();
            caches
              .open(STATIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      }),
    );
    return;
  }

  // 5. ברירת מחדל
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request)),
  );
});

// Background Sync
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("[SW] Background sync triggered");
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
