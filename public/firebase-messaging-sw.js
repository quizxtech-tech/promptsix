// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyAL3athVSFVTrhh3wmnZW0LymCKc_WaYEE",
  authDomain: "promptland-850af.firebaseapp.com",
  projectId: "promptland-850af",
  storageBucket: "promptland-850af.firebasestorage.app",
  messagingSenderId: "139651428467",
  appId: "1:139651428467:web:edab8008d0059fc029fa06",
  measurementId: "G-XMEVN4E8QF"
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});


// ========================================
// PWA Caching (Added for Install Button)
// ========================================

const CACHE_NAME = 'promptland-v1';

// Install event - skip caching specific URLs during install
// They'll be cached dynamically on first visit via fetch handler
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    self.skipWaiting().then(() => {
      console.log('[ServiceWorker] Installed successfully');
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[ServiceWorker] Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache when offline, fetch from network when online
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome extensions and external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone and cache successful responses
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache (offline support)
        return caches.match(event.request);
      })
  );
});

// Handle notification clicks (redirect to app)
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});