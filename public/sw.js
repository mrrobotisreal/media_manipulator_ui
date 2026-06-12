// Self-destroying service worker — cleanup for the old Vite app.
//
// The previous (Vite + vite-plugin-pwa / Workbox) version of this site
// registered a service worker at /sw.js that precached the entire SPA. After
// the migration to Next.js we no longer ship a service worker, but the old one
// stays *registered and controlling* in every returning visitor's browser. It
// keeps intercepting requests and serving its stale precache — the
// pre-migration favicon and an old route table that 404s newer tool pages.
// Hard refresh does not fix this; only replacing/unregistering the worker does.
//
// Serving this file at the same /sw.js URL means the browser's periodic update
// check picks it up, installs it, and this version tears everything down:
// deletes all Cache Storage entries, unregisters itself, and reloads open tabs
// onto the live site. After it activates once, the origin is service-worker
// free again.
//
// Keep this file in place until telemetry shows no clients are still controlled
// by a service worker; only then is it safe to delete (a plain 404 on /sw.js is
// harmless once no browser has the old worker registered).

self.addEventListener('install', () => {
  // Don't wait for old tabs to close — take over as soon as possible.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Delete every cache the old Workbox precache/runtime created.
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));

      // 2. Unregister this worker so the origin is no longer SW-controlled.
      await self.registration.unregister();

      // 3. Reload any open tabs so they drop the cached app and fetch the
      //    real Next.js site from the network.
      const clients = await self.clients.matchAll({ type: 'window' });
      await Promise.all(
        clients.map((client) => ('navigate' in client ? client.navigate(client.url) : null)),
      );
    })(),
  );
});
