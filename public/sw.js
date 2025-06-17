const CACHE_NAME = 'bara-v1-cache'
const urlsToCache = [
  '/',
  '/inbox',
  '/today',
  '/upcoming',
  '/projects',
  '/tags',
  '/manifest.json'
]

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  )
})

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch with offline-first strategy for app shell
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
    // Network-first for API calls
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          return caches.match(event.request)
        })
    )
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response
          }
          return fetch(event.request).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
            return response
          })
        })
    )
  }
})

// Background sync for task updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks())
  }
})

async function syncTasks() {
  // Placeholder for background sync logic
  // Would sync pending task updates when coming back online
  console.log('Background sync: Tasks')
}