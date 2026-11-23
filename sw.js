const CACHE_NAME = 'persuratan-subdit5-v5';
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap'
];

/* Install: Precache aset statis dan langsung skip waiting */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const results = await Promise.allSettled(
        STATIC_ASSETS.map((asset) => cache.add(asset).catch((err) => console.warn(`Gagal mem-precache aset ${asset}:`, err)))
      );
      return results;
    })
  );
  self.skipWaiting();
});

/* Activate: Bersihkan seluruh cache versi lama dan klaim kontrol klien */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

/* Fetch Routing */
self.addEventListener('fetch', (event) => {
  const reqUrl = event.request.url;

  // 1. Lewatkan panggilan API Google Apps Script langsung ke jaringan
  if (reqUrl.includes('script.google.com') || reqUrl.includes('google.com/macros')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Navigasi Dokumen HTML: Gunakan Network-First agar pembaruan rilis segera tampil di perangkat mobile
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone).catch(() => {}));
          }
          return networkResponse;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // 3. Aset Statis Lainnya (Font, CDN CSS, Gambar): Cache-First dengan fallback jaringan
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone).catch(() => {}));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
