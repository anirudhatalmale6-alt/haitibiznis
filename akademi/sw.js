/* LajanMaker Academy offline (8 Nov 2026) - keeps the offline page and Practice Mode openable with NO signal.
   Lesson videos/PDFs are NOT here: the page stores them in IndexedDB (other workers on this site delete
   caches they do not own when they update). Everything else under /akademi/ (the exam, the certificate)
   goes straight to the network, untouched. */
var SHELL = 'lma-shell-v3';
var FILES = ['/akademi/offline/', '/akademi/offline/index.html', '/akademi/offline/manifest.webmanifest',
  '/akademi/offline/gid.html', '/akademi/offline/icon-192.png', '/akademi/offline/icon-512.png', '/akademi/pratik/', '/akademi/pratik/index.html', '/favicon.ico'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) { return Promise.all(FILES.map(function (u) { return c.add(u).catch(function () {}); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {   /* only OUR old versions - never anybody else's cache */
    return Promise.all(ks.filter(function (k) { return k.indexOf('lma-shell-') === 0 && k !== SHELL; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
function ours(u) {
  return (u.pathname.indexOf('/akademi/offline/') === 0 && u.pathname.indexOf('/akademi/offline/v/') !== 0) || u.pathname.indexOf('/akademi/pratik/') === 0 || u.pathname === '/favicon.ico';
}
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var u = new URL(e.request.url);
  if (u.origin !== location.origin || !ours(u)) return;
  /* network first (fresh when online), but never wait more than 4 s on a weak signal; then the saved copy */
  e.respondWith(new Promise(function (resolve) {
    var done = false;
    var fallback = function () { if (done) return; caches.match(e.request, { ignoreSearch: true }).then(function (r) { if (r && !done) { done = true; resolve(r); } }); };
    var timer = setTimeout(fallback, 4000);
    fetch(e.request).then(function (r) {
      if (r && r.ok) { var c2 = r.clone(); caches.open(SHELL).then(function (c) { c.put(e.request, c2); }); }
      if (!done) { done = true; clearTimeout(timer); resolve(r); }
    }).catch(function () {
      clearTimeout(timer);
      caches.match(e.request, { ignoreSearch: true }).then(function (r) { if (!done) { done = true; resolve(r || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } })); } });
    });
  }));
});
