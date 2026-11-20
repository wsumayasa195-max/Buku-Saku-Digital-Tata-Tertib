/* Service worker: cangkang aplikasi tersedia offline. Data dari server (GAS) TIDAK di-cache di sini —
   data publik di-cache aplikasi lewat localStorage, data pribadi tidak pernah disimpan. */
const VERSI = 'bs-v2';
const CANGKANG = ['./', 'index.html', 'css/style.css', 'js/config.js', 'js/api.js', 'js/ui.js', 'js/app.js', 'js/pages-publik.js', 'js/pages-catatan.js', 'js/pages-data.js', 'js/pages-kontak.js', 'js/pages-admin.js', 'js/main.js', 'manifest.json', 'icons/icon.svg', 'icons/icon-192.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSI).then(function (c) { return c.addAll(CANGKANG); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSI; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return;            // GAS, Google Fonts, CDN → langsung ke jaringan
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(function (res) { const salin = res.clone(); caches.open(VERSI).then(function (c) { c.put('index.html', salin); }); return res; }).catch(function () { return caches.match('index.html'); })); return; }
  if (/\/js\/config\.js$/.test(u.pathname)) {                                  // alamat backend: jangan pernah basi
    e.respondWith(fetch(r, { cache: 'no-cache' }).then(function (res) { const salin = res.clone(); caches.open(VERSI).then(function (c) { c.put(r, salin); }); return res; }).catch(function () { return caches.match(r); })); return;
  }
  e.respondWith(caches.match(r).then(function (hit) {
    const jaringan = fetch(r).then(function (res) { if (res && res.ok) { const salin = res.clone(); caches.open(VERSI).then(function (c) { c.put(r, salin); }); } return res; }).catch(function () { return hit; });
    return hit || jaringan;
  }));
});
