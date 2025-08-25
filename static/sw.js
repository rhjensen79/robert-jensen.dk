// Enhanced Service Worker for performance optimization
const CACHE_NAME = 'robert-jensen-performance-v4';
const CRITICAL_CACHE = 'critical-v4';
const STATIC_CACHE = 'static-v4';
const IMAGE_CACHE = 'images-v4';
const API_CACHE = 'api-v4';

// Critical resources for immediate loading
const CRITICAL_URLS = [
  '/',
  '/css/performance.css',
  '/css/fontawesome-minimal.css', 
  '/css/mobile-optimizations.css',
  '/images/profile.webp',
  '/favicons/favicon.ico'
];

// Static assets that can be cached aggressively
const STATIC_URLS = [
  '/manifest.json',
  '/robots.txt'
];

// Max ages for different resource types (in milliseconds)
const CACHE_DURATIONS = {
  html: 1000 * 60 * 60, // 1 hour
  static: 1000 * 60 * 60 * 24 * 30, // 30 days  
  images: 1000 * 60 * 60 * 24 * 30, // 30 days
  api: 1000 * 60 * 5 // 5 minutes
};

// Install event - cache critical resources immediately
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CRITICAL_CACHE).then(cache => cache.addAll(CRITICAL_URLS)),
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_URLS))
    ]).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const validCaches = [CRITICAL_CACHE, STATIC_CACHE, IMAGE_CACHE, API_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!validCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine cache strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if (pathname.match(/\.(webp|jpg|jpeg|png|gif|svg|ico)$/i)) {
    return { cache: IMAGE_CACHE, duration: CACHE_DURATIONS.images, strategy: 'cache-first' };
  } else if (pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/i)) {
    return { cache: STATIC_CACHE, duration: CACHE_DURATIONS.static, strategy: 'cache-first' };
  } else if (pathname.match(/\.(html)$/i) || pathname.endsWith('/')) {
    return { cache: CRITICAL_CACHE, duration: CACHE_DURATIONS.html, strategy: 'stale-while-revalidate' };
  } else {
    return { cache: API_CACHE, duration: CACHE_DURATIONS.api, strategy: 'network-first' };
  }
}

// Check if cached response is still fresh
function isFresh(response, maxAge) {
  if (!response) return false;
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const date = new Date(dateHeader);
  return (Date.now() - date.getTime()) < maxAge;
}

// Enhanced fetch event with smart caching strategies
self.addEventListener('fetch', event => {
  // Only handle GET requests from same origin
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  const strategy = getCacheStrategy(event.request);

  switch (strategy.strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(event.request, strategy));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(event.request, strategy));
      break;
    case 'network-first':
      event.respondWith(networkFirst(event.request, strategy));
      break;
  }
});

// Cache-first strategy for static assets
async function cacheFirst(request, strategy) {
  const cache = await caches.open(strategy.cache);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && isFresh(cachedResponse, strategy.duration)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate for HTML pages
async function staleWhileRevalidate(request, strategy) {
  const cache = await caches.open(strategy.cache);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.status === 200) {
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);

  return cachedResponse || await fetchPromise || new Response('Offline', { status: 503 });
}

// Network-first for API requests
async function networkFirst(request, strategy) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(strategy.cache);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(strategy.cache);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}