/* biof service worker: хурдан ачаалал + апп (PWA) + офлайн.
   - HTML: эхлээд сүлжээ (шинэчлэл шууд харагдана), 4 сек хариугүй/офлайн бол хадгалсан хувилбар.
   - ?v= хувилбартай JS/CSS, фонт, платформын дүрс: кэшээс (хурдан).
   - Supabase Storage-ийн ЗУРАГ: кэшээс (?v=timestamp тул өөрчлөгддөггүй) → Supabase egress квот хэмнэнэ.
   - Supabase API (rest/auth/rpc), видео/дуу (Range хүсэлт): огт кэшлэхгүй. */
const SWV = 'biof-sw-20';
const STATIC = SWV + '-static', PAGES = SWV + '-pages', MEDIA = 'biof-media-v1';
const SB = 'https://zyrpzoqdoorekspavocs.supabase.co';
const MEDIA_MAX = 120;

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(PAGES).then(c => c.addAll(['/', '/404.html', '/settings', '/leaderboard', '/favicon.svg', '/icon-192.png'])).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== STATIC && k !== PAGES && k !== MEDIA).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const timeout = (p, ms) => new Promise((ok, no) => { const t = setTimeout(() => no(Error('timeout')), ms); p.then(r => { clearTimeout(t); ok(r) }, e => { clearTimeout(t); no(e) }) });
async function trim(name, max) { const c = await caches.open(name), k = await c.keys(); for (let i = 0; i < k.length - max; i++) await c.delete(k[i]); }

async function page(req) {
  const c = await caches.open(PAGES), url = new URL(req.url);
  try {
    const r = await timeout(fetch(req), 4000);
    if (r && (r.ok || r.status === 404) && r.type === 'basic') c.put(url.pathname.replace(/\/$/, '') || '/', r.clone());
    return r;
  } catch (e) {
    return (await c.match(url.pathname.replace(/\/$/, '') || '/')) || (await c.match('/404.html')) || (await c.match('/')) || Response.error();
  }
}
async function cacheFirst(req, name, max) {
  const c = await caches.open(name), hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r && (r.ok || r.type === 'opaque')) { c.put(req, r.clone()); if (max) trim(name, max); }
  return r;
}
async function swr(req, name) {
  const c = await caches.open(name), hit = await c.match(req);
  const net = fetch(req).then(r => { if (r && r.ok) c.put(req, r.clone()); return r }).catch(() => hit);
  return hit || net;
}

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  try {
    if (url.origin === location.origin) {
      if (req.mode === 'navigate') return ev.respondWith(page(req));
      if (url.pathname === '/sw.js') return;
      if (url.searchParams.has('v') || url.pathname.startsWith('/js/vendor/')) return ev.respondWith(cacheFirst(req, STATIC));
      if (/\.(png|svg|ico|webmanifest|css|js)$/.test(url.pathname)) return ev.respondWith(swr(req, STATIC));
      return;
    }
    if (url.origin === SB) {
      if (url.pathname.startsWith('/storage/v1/object/public/media/') && req.destination === 'image') return ev.respondWith(cacheFirst(req, MEDIA, MEDIA_MAX));
      return;
    }
    if (url.hostname === 'fonts.gstatic.com' || (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/simple-icons@'))) return ev.respondWith(cacheFirst(req, STATIC));
    if (url.hostname === 'fonts.googleapis.com') return ev.respondWith(swr(req, STATIC));
  } catch (e) { /* алдаа гарвал хөтөч өөрөө ачаална */ }
});
