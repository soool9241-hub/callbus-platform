// ============================================================
// 버스고 - Service Worker for Push Notifications
// ============================================================

const CACHE_NAME = 'busgo-notification-v1';
const ICON_CACHE_URLS = [
  '/favicon.ico',
];

// Install event - cache app icon for offline notification display
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ICON_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Push event - show notification
self.addEventListener('push', (event) => {
  let data = {
    title: '버스고',
    body: '새로운 알림이 있습니다.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    url: '/',
    tag: 'busgo-notification',
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/favicon.ico',
    badge: data.badge || '/favicon.ico',
    tag: data.tag || 'busgo-notification',
    renotify: true,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      timestamp: Date.now(),
    },
    actions: [
      {
        action: 'open',
        title: '확인하기',
      },
      {
        action: 'close',
        title: '닫기',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click - open relevant page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const url = event.notification.data?.url || '/';

  if (action === 'close') {
    return;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If there's already an open window, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            url: url,
          });
          return;
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  // Track notification dismissal (can be used for analytics)
  const data = event.notification.data;
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'NOTIFICATION_CLOSE',
        url: data?.url,
        timestamp: data?.timestamp,
      });
    });
  });
});
