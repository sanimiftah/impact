// Enhanced Service Worker for IMPACT Platform PWA
const CACHE_NAME = 'impact-v2.0.0';
const STATIC_CACHE = 'impact-static-v2.0.0';
const DYNAMIC_CACHE = 'impact-dynamic-v2.0.0';
const IMAGES_CACHE = 'impact-images-v2.0.0';

// Core app files to cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/seedboard.html',
  '/dashboard_enhanced.html',
  '/skillmatch.html',
  '/teamspace_new.html',
  '/impactlog_new.html',
  '/opencall_new.html',
  '/output.css',
  '/animations.css',
  '/firebase-config.js',
  '/impact-data-layer.js',
  '/ui-components.js',
  '/advanced-features.js',
  '/advanced-analytics.js',
  '/pwa-features.js',
  '/manifest.json'
];

// External resources
const EXTERNAL_RESOURCES = [
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
];

// Install event - Cache core files
self.addEventListener('install', (event) => {
  console.log('📦 SW: Installing enhanced service worker v2.0.0');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📁 SW: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      // Cache external resources
      caches.open(IMAGES_CACHE).then((cache) => {
        console.log('🖼️ SW: Caching external images');
        return cache.addAll(EXTERNAL_RESOURCES);
      })
    ]).then(() => {
      console.log('✅ SW: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 SW: Activating enhanced service worker');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      const deletePromises = cacheNames.map((cacheName) => {
        if (cacheName !== STATIC_CACHE && 
            cacheName !== DYNAMIC_CACHE && 
            cacheName !== IMAGES_CACHE) {
          console.log('🗑️ SW: Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        }
      });
      
      return Promise.all(deletePromises);
    }).then(() => {
      console.log('✅ SW: Activation complete');
      return self.clients.claim();
    })
  );
});

// Enhanced fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle different request types
  if (request.method !== 'GET') {
    return; // Don't cache non-GET requests
  }
  
  // Strategy for different resource types
  if (url.origin === location.origin) {
    // Same-origin requests - Network first with cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (url.hostname.includes('unsplash.com')) {
    // Images - Cache first with network fallback
    event.respondWith(cacheFirstStrategy(request, IMAGES_CACHE));
  } else if (url.hostname.includes('googleapis.com') || url.hostname.includes('firebaseio.com')) {
    // Firebase/Google APIs - Network only
    event.respondWith(networkOnlyStrategy(request));
  } else {
    // Other external resources - Stale while revalidate
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
  }
});

// Network first strategy (good for dynamic content)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 SW: Network failed, trying cache for:', request.url);
    
    // Try static cache first, then dynamic cache
    const staticResponse = await caches.match(request, { cacheName: STATIC_CACHE });
    if (staticResponse) return staticResponse;
    
    const dynamicResponse = await caches.match(request, { cacheName: DYNAMIC_CACHE });
    if (dynamicResponse) return dynamicResponse;
    
    // Return offline fallback for HTML pages
    if (request.headers.get('accept').includes('text/html')) {
      return caches.match('/index.html');
    }
    
    throw error;
  }
}

// Cache first strategy (good for images and static assets)
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request, { cacheName });
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🖼️ SW: Failed to load image:', request.url);
    throw error;
  }
}

// Network only strategy (for API calls that shouldn't be cached)
async function networkOnlyStrategy(request) {
  return fetch(request);
}

// Stale while revalidate strategy (serves cache immediately, updates in background)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request, { cacheName });
  
  const networkPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(cacheName);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => {
    console.log('🌐 SW: Network failed for:', request.url);
  });
  
  return cachedResponse || networkPromise;
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📬 SW: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/manifest.json',
    badge: '/manifest.json',
    tag: 'impact-notification',
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/manifest.json'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      timestamp: Date.now(),
      url: '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('IMPACT Platform', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 SW: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 SW: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync logic here
      syncOfflineData()
    );
  }
});

// Sync offline data when connection is restored
async function syncOfflineData() {
  try {
    // Check if we have pending data to sync
    const pendingData = await getStoredSyncData();
    
    if (pendingData.length > 0) {
      console.log('🔄 SW: Syncing', pendingData.length, 'offline items');
      
      for (const item of pendingData) {
        try {
          await fetch(item.url, {
            method: item.method,
            body: item.data,
            headers: item.headers
          });
          
          // Remove synced item from storage
          await removeSyncData(item.id);
        } catch (error) {
          console.error('❌ SW: Sync failed for item:', item.id, error);
        }
      }
    }
  } catch (error) {
    console.error('❌ SW: Background sync failed:', error);
  }
}

// Helper functions for sync data management
async function getStoredSyncData() {
  // Implementation depends on your storage choice
  // This is a placeholder
  return [];
}

async function removeSyncData(id) {
  // Implementation depends on your storage choice
  // This is a placeholder
  console.log('Removing sync data:', id);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New activity in your IMPACT community!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('IMPACT Community', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Helper function to sync offline data
async function syncOfflineData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    // Implement offline data synchronization logic here
    console.log('Syncing offline data...');
  } catch (error) {
    console.error('Error syncing offline data:', error);
  }
}
