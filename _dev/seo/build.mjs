// biof SEO: тэргүүлэгчид + баталгаажсан хэрэглэгчдийн хуудсыг жинхэнэ HTML (/<нэр>/index.html) болгон үүсгэнэ.
// GitHub Pages нь /нэр хаягийг 404 статустай буцаадаг тул Google индексэлдэггүй байсан; энэ файлууд 200 статустай.
// Ажиллуулах: node _dev/seo/build.mjs   (GitHub Actions 6 цаг тутам автоматаар)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const SB = 'https://zyrpzoqdoorekspavocs.supabase.co';
const KEY = process.env.SB_ANON || fs.readFileSync(path.join(ROOT, 'js/core.js'), 'utf8').match(/SB_KEY='([^']+)'/)[1];
const SITE = 'https://biof.site';
const TOP = +process.env.SEO_TOP || 500;
const MAN = path.join(ROOT, '_dev/seo/pages.json');
const MEDIA = SB + '/storage/v1/object/public/media/';

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const okImg = u => typeof u === 'string' && (u.startsWith(MEDIA) || u.startsWith('https://cdn.discordapp.com/')) && /^https:\/\/[^\s"'<>()\\]+$/.test(u) ? u : '';
const okUrl = u => typeof u === 'string' && /^https?:\/\/[^\s"'<>]+$/i.test(u) ? u : '';

async function get(q) {
  const r = await fetch(`${SB}/rest/v1/${q}`, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY } });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
  return r.json();
}

const cols = 'select=id,bid,username,display_name,bio,avatar_url,links,badges,role,views,likes,theme';
const [top, ver] = await Promise.all([
  get(`profiles?${cols}&username=not.is.null&order=views.desc&limit=${TOP}`),
  get(`profiles?${cols}&username=not.is.null&badges=cs.%7Bverified%7D&limit=500`).catch(() => [])
]);
const seen = new Set(), users = [];
for (const p of [...top, ...ver]) {
  if (!p.username || seen.has(p.username) || !/^[a-z0-9_]{2,20}$/.test(p.username)) continue;
  if (p.theme && p.theme.noidx) continue;
  seen.add(p.username); users.push(p);
}

const prev = fs.existsSync(MAN) ? JSON.parse(fs.readFileSync(MAN, 'utf8')) : {};
const PM = Array.isArray(prev) ? Object.fromEntries(prev.map(n => [n, ''])) : prev; // {нэр: lastmod}
const old = Object.keys(PM);
// Сайтын жинхэнэ файл/хавтастай давхцах нэрийг алгасна
const own = new Set(fs.readdirSync(ROOT).filter(n => !old.includes(n)).map(n => n.replace(/\.html$/, '').toLowerCase()));
const list = users.filter(p => !own.has(p.username));

const base = fs.readFileSync(path.join(ROOT, '404.html'), 'utf8');
const today = new Date().toISOString().slice(0, 10);

function page(p) {
  const name = p.display_name || p.username, url = `${SITE}/${p.username}/`;
  const bio = (p.bio || '').replace(/\s+/g, ' ').trim();
  const desc = (bio ? bio + ' — ' : '') + `${name} (@${p.username}) хуудас biof дээр. Бүх холбоос нэг дор.`;
  const img = okImg(p.avatar_url) || `${SITE}/og.png`;
  const links = (Array.isArray(p.links) ? p.links : []).filter(l => okUrl(l && l.url) && !/^mailto:/i.test(l.url)).slice(0, 12);
  const title = `${name} (@${p.username}) · biof`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'ProfilePage', url, name: title,
    mainEntity: { '@type': 'Person', name, alternateName: '@' + p.username, description: bio || undefined, image: img, url, sameAs: links.filter(l => /^https:/i.test(l.url)).map(l => l.url) }
  };
  const head = `<title>${esc(title)}</title><meta name="description" content="${esc(desc.slice(0, 300))}"><link rel="canonical" href="${url}">` +
    `<meta property="og:type" content="profile"><meta property="og:site_name" content="biof"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc.slice(0, 300))}"><meta property="og:url" content="${url}"><meta property="og:image" content="${esc(img)}"><meta property="profile:username" content="${esc(p.username)}">` +
    `<meta name="twitter:card" content="summary"><script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
  const body = `<div id="app"><noscript><main class="seo"><img class="av" src="${esc(img)}" alt="${esc(name)}" width="96" height="96"><h1>${esc(name)}</h1><p>@${esc(p.username)} · biof.site/${esc(p.username)}</p>${bio ? `<p>${esc(bio)}</p>` : ''}<ul>${links.map(l => `<li><a href="${esc(l.url)}" rel="nofollow noopener">${esc(l.label || l.url)}</a></li>`).join('')}</ul><p><a href="/">biof — бүх холбоосоо нэг хаяг дээр</a></p></main></noscript></div>`;
  return base
    .replace(/<title>[^<]*<\/title>/, head)
    .replace(/<meta name="description"[^>]*>/, '')
    .replace('<div id="app"></div>', body);
}

const LM = {};
for (const p of list) {
  const dir = path.join(ROOT, p.username), f = path.join(dir, 'index.html'), html = page(p);
  const same = fs.existsSync(f) && fs.readFileSync(f, 'utf8') === html;
  LM[p.username] = same && PM[p.username] ? PM[p.username] : today;
  if (!same) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(f, html); }
}
const now = new Set(list.map(p => p.username));
for (const n of old) if (!now.has(n) && /^[a-z0-9_]{2,20}$/.test(n)) fs.rmSync(path.join(ROOT, n), { recursive: true, force: true });
fs.writeFileSync(MAN, JSON.stringify(Object.fromEntries(Object.keys(LM).sort().map(k => [k, LM[k]]))));

// Хуучин хувилбарын нүүр/тэргүүлэгчдийн жагсаалтыг арилгана (хүмүүст харагдаж байсан)
for (const f of ['index.html', 'leaderboard.html']) {
  const fp = path.join(ROOT, f), s0 = fs.readFileSync(fp, 'utf8');
  if (s0.includes('<!--SEO-->')) fs.writeFileSync(fp, s0.replace(/<!--SEO-->[\s\S]*?<!--\/SEO-->/, '<div id="app"></div>'));
}

const stat = [['/', '1.0', 'daily'], ['/leaderboard', '0.8', 'daily'], ['/a', '0.6', 'monthly'], ['/tutorial', '0.5', 'monthly'], ['/status', '0.3', 'hourly'], ['/tos', '0.2', 'yearly'], ['/privacy', '0.2', 'yearly']];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  stat.map(([u, pr, cf]) => `  <url><loc>${SITE}${u}</loc><lastmod>2026-11-14</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`).join('\n') + '\n' +
  list.map(p => `  <url><loc>${SITE}/${p.username}/</loc><lastmod>${LM[p.username]}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`SEO: ${list.length} хуудас үүслээ, ${old.filter(n => !now.has(n)).length} устлаа`);
