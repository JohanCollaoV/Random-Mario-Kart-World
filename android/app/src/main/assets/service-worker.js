/*
  Proposed service worker improvements:
  - Avoid caching "/" since when served under a subpath that could be wrong.
  - Cache core shell files (index, manifest, icons).
  - Add dynamic caching for fetched resources (images, etc.) so the app can work
    better offline after first visit.

  Note: service workers require serving via http(s). Use a local server like:
    python3 -m http.server 8000
  to test registration and offline behavior.
*/

const CACHE_NAME = 'randomizador-cache-v4';
const PRECACHE_ASSETS = [
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/data.js',
  'js/app.js',
  'js/sw-register.js',
  'assets/images/icons/icon-192.png',
  'assets/images/icons/icon-512.png',
  'assets/images/backgrounds/backgroundfinal.png',
  'assets/images/logos/kdu-logo_alt.png',
  'assets/images/logos/logokdu.textwhite.png',
  'assets/images/logos/marioaniversario.trim.png',
  'assets/images/tracks/mcflurry.png',
  'assets/fonts/FredokaOne-Regular.woff2',
  'assets/fonts/PressStart2P-Regular.woff2'
];

// Add all images from /pistas/ to the precache list
const pistas = [
  "Aldea Arbórea.png",
  "Bazar Shy Guy.png",
  "Sabana Salpicante.png",
  "Fábrica de Toad.png",
  "Ciudad Salina.png",
  "Senda Arco Iris.png",
  "Cascadas Cheep Cheep.png",
  "Circuito Mario.png",
  "Jungla Dino Dino.png",
  "Caverna Ósea.png",
  "Templo del Bloque.png",
  "Puerto Espacial DK.png",
  "DK Alpino.png",
  "Cielos Helados.png",
  "Estadio Peach.png",
  "Ciudad Corona.png",
  "Circuito Mario Bros.png",
  "Playa de Peach.png",
  "Mirador Estelar.png",
  "Monte Chocolate.png",
  "Pradera Mu-Mu.png",
  "Cine Boo.png",
  "Galéon de Wario.png",
  "Cañón Ferroviario.png",
  "Gruta Diente de León.png",
  "Fortaleza Aérea.png",
  "Desierto Sol-Sol.png",
  "Playa Koopa.png",
  "Estadio Wario.png",
  "Castillo Bowser.png"
];

pistas.forEach(f => PRECACHE_ASSETS.push(`assets/images/tracks/${encodeURIComponent(f)}`));

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Clean up old caches if any
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  // For fonts and images use cache-first strategy
  if(req.destination === 'font' || req.destination === 'image'){
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(networkRes => {
        if(networkRes && networkRes.status === 200 && req.method === 'GET'){
          caches.open(CACHE_NAME).then(cache => cache.put(req, networkRes.clone()));
        }
        return networkRes;
      }).catch(()=> caches.match('assets/images/icons/icon-512.png'))
    );
    return;
  }

  // For navigation requests (HTML) use network-first with cache fallback
  if(req.mode === 'navigate'){
    event.respondWith(
      fetch(req).then(res => {
        if(res.status === 200){
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return res;
        }
        throw new Error('non-200');
      }).catch(()=> caches.match('index.html').then(r => r || caches.match('/')))
    );
    return;
  }

  // Default: try cache, otherwise network
  event.respondWith(caches.match(req).then(res => res || fetch(req)));
});
