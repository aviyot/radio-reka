// גרסה ידנית - שנה את המספר הזה רק כשאתה רוצה לכפות עדכון אצל כולם!
const APP_VERSION = "v1.0.1"; // עדכנתי גרסה כדי שתראה את הלוגים החדשים
const CACHE_NAME = `radio-reka-${APP_VERSION}`;
const STATIC_CACHE = `static-${APP_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${APP_VERSION}`;

// URLs to cache on install
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  // שים לב: אם אחד הקבצים האלו לא קיים בתיקיית public אצלך, הוא ייכשל
  "/img/icons/android-chrome-192x192.png",
  "/img/icons/android-chrome-512x512.png",
  "/img/icons/apple-icon-180x180.png",
  "/img/icons/favicon-32x32.png",
  "/img/icons/favicon-16x16.png",
  "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700&display=swap",
  "https://fonts.gstatic.com/s/heebo/v23/NGS6v5_NC0k9P_Hiukt2b_s.woff2",
];

// Install
self.addEventListener("install", (event) => {
  console.log("[SW] Installing version:", APP_VERSION);
  self.skipWaiting(); // השתלטות מיידית

  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      console.log("[SW] Caching static assets...");

      // שינוי קריטי: במקום addAll שקורס אם קובץ אחד חסר,
      // אנחנו עוברים אחד אחד ובודקים מי נכשל
      const promises = STATIC_ASSETS.map(async (url) => {
        try {
          const req = new Request(url, { mode: "no-cors" }); // no-cors חשוב לפונטים חיצוניים לפעמים
          const response = await fetch(req);

          if (!response.ok) {
            throw new Error(`Status: ${response.status}`);
          }

          return cache.put(url, response);
        } catch (error) {
          console.warn(`[SW] נכשל בטעינת קובץ לקאש: ${url}`, error);
          // אנחנו לא זורקים שגיאה כדי שה-SW ימשיך להתקין את שאר הקבצים!
        }
      });

      return Promise.all(promises);
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
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            (cacheName.startsWith("radio-reka") ||
              cacheName.startsWith("static-"))
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
  if (
    url.hostname.includes("streamtheworld.com") ||
    url.hostname.includes("omny.fm") ||
    url.pathname.endsWith(".mp3") ||
    url.pathname.endsWith(".aac")
  ) {
    return; // תן לרשת לטפל בזה ישירות
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

// Background Sync & Push
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
