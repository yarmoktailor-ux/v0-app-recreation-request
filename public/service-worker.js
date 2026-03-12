const CACHE_NAME = 'tailoring-app-v1';
const urlsToCache = [
  '/',
  '/offline.html',
  '/manifest.json'
];

// تثبيت Service Worker والبدء بتخزين الملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache).catch(() => {
          // إذا فشل التخزين، نتابع على أي حال
          return Promise.resolve();
        });
      })
      .catch(() => {
        // تجاهل الأخطاء في مرحلة install
        return Promise.resolve();
      })
  );
  self.skipWaiting();
});

// تنشيط Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استراتيجية Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الطلبات غير GET
  if (request.method !== 'GET') {
    return;
  }

  // تجاهل الطلبات الخارجية (من domains أخرى)
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // تخزين الاستجابة الناجحة
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // عند فشل الشبكة، استرجع من الـ cache
        return caches.match(request)
          .then((response) => {
            if (response) {
              return response;
            }
            // إذا لم يكن موجود في الـ cache، أرجع صفحة offline
            if (request.destination === 'document') {
              return caches.match('/offline.html').catch(() => {
                return new Response('التطبيق غير متاح حالياً', {
                  status: 503,
                  statusText: 'Service Unavailable',
                });
              });
            }
          })
          .catch(() => {
            return new Response('خطأ في تحميل الصفحة', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
  );
});

// معالجة الرسائل من التطبيق
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
