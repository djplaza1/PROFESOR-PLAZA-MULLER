/* Müller — Service Worker ligero: red primero para HTML/JSON, caché para el resto */
const CACHE = 'muller-sw-v1';
const PRECACHE_URLS = ['./', './index.html', './manifest.json', './b1-b2-database.json'];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match('./index.html') || caches.match(req))
        );
        return;
    }
    if (
        url.origin === self.location.origin &&
        (url.pathname.endsWith('b1-b2-database.json') || url.pathname.endsWith('index.html'))
    ) {
        event.respondWith(
            fetch(req)
                .then((res) => {
                    const copy = res.clone();
                    if (res.ok) caches.open(CACHE).then((c) => c.put(req, copy));
                    return res;
                })
                .catch(() => caches.match(req))
        );
        return;
    }
    event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
