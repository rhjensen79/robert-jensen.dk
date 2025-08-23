// Service Worker for caching optimization
const CACHE_NAME = 'robert-jensen-v1';
const STATIC_CACHE_URLS = [
  '/css/performance.min.css',
  '/scss/main.min.css',
  '/css/markupHighlight.min.css',
  '/fontawesome/css/fontawesome.min.css',
  '/fontawesome/css/solid.min.css',
  '/js/anatole-header.min.js',
  '/js/anatole-theme-switcher.min.js',
  '/images/profile.jpg',
  '/favicons/favicon.ico'
];

// Install event - cache static resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip non-local requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version if available
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request).then(response => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cache images, CSS, JS, and fonts for future requests
        if (event.request.url.match(/\.(jpg|jpeg|png|webp|gif|css|js|woff|woff2|ttf|eot)$/i)) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }

        return response;
      });
    })
  );
});