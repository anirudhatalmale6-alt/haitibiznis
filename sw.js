/* HaitiBiznis homepage — self-destructing service worker.
   A previous cache-first worker could serve stale pages on flaky connections.
   This version purges ALL caches, unregisters itself, and reloads open tabs so
   the device always loads the live site fresh from the network from now on.
   No fetch handler => every request goes straight to the network. */
self.addEventListener('install', function () { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(function (c) { try { c.navigate(c.url); } catch (err) {} });
    } catch (err) {}
  })());
});
