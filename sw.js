// ============================================================
// NGFT Flight Tool - Service Worker
// ============================================================
// Strategy:
// - App shell (HTML, icons, manifest): cache-first, network fallback
// - Airtable API: network-only (never cache API responses — they change)
// - External CDN (JSZip): cache-first, network fallback (rarely changes)
// ============================================================

const CACHE_VERSION = 'ngft-v1.5.0';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// Install: pre-cache app shell
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

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Fetch: routing strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle GET
  if (event.request.method !== 'GET') return;

  // Airtable API: never cache (always fresh or fail)
  if (url.hostname === 'api.airtable.com') {
    return; // let it go to network directly
  }

  // Same-origin app shell: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((res) => {
          // Cache successful responses for next time
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
          }
          return res;
        }).catch(() => {
          // Offline fallback: return the index.html for navigations
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
    return;
  }

  // External resources (CDN for JSZip, etc.): cache-first
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
