// ============================================================
// NGFT Flight Tool - Service Worker V1.6
// ============================================================
// Strategy:
// - App shell: network-first with cache fallback
//   (ensures updates propagate immediately when online)
// - Airtable API: network-only (never cache)
// - External CDN: cache-first (stable content)
// - Emergency pages: network-only
// ============================================================

const CACHE_VERSION = 'ngft-v1.7.3';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// INSTALL: pre-cache app shell, activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[SW] Pre-cache failed:', err);
      });
    })
  );
  self.skipWaiting();
});

// ACTIVATE: clean up old caches, take control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// MESSAGE: allow app to request skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// FETCH: routing strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Airtable API: never cache
  if (url.hostname === 'api.airtable.com') return;

  // Emergency export page: always fresh
  if (url.pathname.endsWith('/emergency-export.html')) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('Offline', { status: 503 }))
    );
    return;
  }

  // Same-origin: NETWORK-FIRST with cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
        })
    );
    return;
  }

  // External CDN: cache-first
  if (url.hostname === 'cdnjs.cloudflare.com') {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return res;
        });
      })
    );
  }
});
