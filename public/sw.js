// גרסה ידנית - שנה את המספר הזה רק כשאתה רוצה לכפות עדכון אצל כולם!
const APP_VERSION = "v1.0.0";
const CACHE_NAME = `radio-reka-${APP_VERSION}`;
const STATIC_CACHE = `static-${APP_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${APP_VERSION}`;

// URLs to cache on install
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/img/icons/android-chrome-192x192.png",
  "/img/icons/android-chrome-512x512.png",
  "/img/icons/apple-icon-180x180.png",
  "/img/icons/favicon-32x32.png",
  "/img/icons/favicon-16x16.png",
  // הוספת פונטים לקאש זה מצוין
  "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap",
  "https://fonts.gstatic.com/s/heebo/v23/NGS6v5_NC0k9P_Hiukt2b_s.woff2",
];

// Install
self.addEventListener("install", (event) => {
  console.log("[SW] Installing version:", APP_VERSION);
  self.skipWaiting(); // השתלטות מיידית

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    }),
  );
});

// Activate - Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating version:", APP_VERSION);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            (cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName.startsWith("radio-reka")) ||
            cacheName.startsWith("static-")
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

  // 1. התעלם מבקשות שאינן GET
  if (request.method !== "GET") return;

  // 2. התעלם מסטרימינג של אודיו (קריטי לרדיו!)
  // אנחנו לא רוצים לשמור את השידור החי בקאש
  if (
    url.hostname.includes("streamtheworld.com") ||
    url.hostname.includes("omny.fm") ||
    url.pathname.endsWith(".mp3") ||
    url.pathname.endsWith(".aac")
  ) {
    return; // תן לרשת לטפל בזה ישירות
  }

  // 3. אסטרטגיה לדפים (Navigation) - Network First
  // נסה להביא את האתר העדכני. נכשלת? תביא מהקאש.
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
  // אלו דברים שלא משתנים הרבה, אז נביא מהר מהקאש
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
          if (networkResponse.ok) {
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

  // 5. ברירת מחדל לשאר הדברים
  event.respondWith(
    caches.match(request).then((response) => response || fetch(request)),
  );
});

// Background Sync & Push (השארתי את הקוד המצוין שלך)
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("[SW] Background sync triggered");
    // כאן תוסיף את הלוגיקה שלך אם צריך
  }
});

// טיפול בהודעות לדילוג על המתנה (מהכפתור רענן)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
