// Service Worker for mobile-optimized caching
const CACHE_NAME = 'robert-jensen-mobile-v2';
const MOBILE_CRITICAL_URLS = [
  '/css/performance.min.css',
  '/scss/main.min.css',
  '/fontawesome/css/fontawesome.min.css',
  '/js/anatole-header.min.js',
  '/images/profile.jpg',
  '/favicons/favicon.ico'
];

const MOBILE_OPTIONAL_URLS = [
  '/css/markupHighlight.min.css',
  '/fontawesome/css/solid.min.css',
  '/js/anatole-theme-switcher.min.js'
];

// Install event - prioritize mobile resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache critical resources first for mobile performance
        return cache.addAll(MOBILE_CRITICAL_URLS)
          .then(() => {
            // Add optional resources in background (don't block install)
            MOBILE_OPTIONAL_URLS.forEach(url => {
              cache.add(url).catch(() => {
                // Fail silently for optional resources
                console.log(`Optional resource failed to cache: ${url}`);
              });
            });
          });
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

        // Cache images, CSS, JS, and fonts with mobile-first strategy
        if (event.request.url.match(/\.(jpg|jpeg|png|webp|gif|css|js|woff|woff2|ttf|eot)$/i)) {
          const responseToCache = response.clone();
          
          // Priority caching for mobile performance
          caches.open(CACHE_NAME).then(cache => {
            // Cache smaller images immediately for mobile
            if (event.request.url.match(/\.(webp|jpg|jpeg|png)$/i)) {
              // Check if it's a mobile-optimized image (smaller dimensions in URL)
              if (event.request.url.match(/_(280|480|640)x?\d*\.(webp|jpg|jpeg|png)$/i) ||
                  event.request.url.includes('profile')) {
                cache.put(event.request, responseToCache);
              }
            } else {
              // Cache all other static resources
              cache.put(event.request, responseToCache);
            }
          });
        }

        return response;
      });
    })
  );
});