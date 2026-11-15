// biof: 7 хоног бүрийн тайлан имэйл. GitHub Actions (digest.yml) ажиллуулна.
// Шаардлагатай GitHub Secrets: SB_SERVICE (Supabase service_role key), RESEND_KEY (Resend API key).
// Аль нэг нь байхгүй бол юу ч илгээхгүй гарна. service_role key-г КОДОНД ХЭЗЭЭ Ч БҮҮ БИЧ.
const SB = 'https://zyrpzoqdoorekspavocs.supabase.co';
const { SB_SERVICE, RESEND_KEY } = process.env;
const MAX = Math.min(95, +process.env.DIGEST_MAX || 40); // Resend үнэгүй: өдөрт 100 (нэвтрэх кодтой хамт)
if (!SB_SERVICE || !RESEND_KEY) { console.log('SB_SERVICE эсвэл RESEND_KEY secret алга — алгаслаа.'); process.exit(0); }
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Шинэ sb_secret_ түлхүүрийг зөвхөн apikey толгойд; хуучин service_role (JWT) түлхүүрийг Authorization-д ч явуулна
const H = { apikey: SB_SERVICE, 'Content-Type': 'application/json', ...(SB_SERVICE.startsWith('sb_') ? {} : { Authorization: 'Bearer ' + SB_SERVICE }) };
const r = await fetch(`${SB}/rest/v1/rpc/digest_rows`, { method: 'POST', headers: H, body: JSON.stringify({ p_limit: MAX }) });
if (!r.ok) { console.error('digest_rows', r.status, await r.text()); process.exit(1); }
const rows = (await r.json()).filter(x => x.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.email));
if (!rows.length) { console.log('Тайлан авах хүн алга'); process.exit(0); }
const diff = (a, b) => b ? Math.round((a - b) / b * 100) : (a ? 100 : 0);
const mail = x => {
  const d = diff(x.wk, x.prev), url = `https://biof.site/${x.username}`;
  return `<!doctype html><html lang="mn"><body style="margin:0;background:#0b0b0c;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0c;padding:28px 12px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#151517;border:1px solid #2b2b30;border-radius:20px;font-family:Arial,Helvetica,sans-serif;color:#f4efe6;">
<tr><td style="padding:26px 26px 6px;text-align:center;"><img src="https://biof.site/icon-192.png" width="44" height="44" alt="biof" style="display:block;margin:0 auto;border-radius:12px;border:0;"><h1 style="margin:14px 0 4px;font-size:20px;">Сайн уу, ${esc(x.display_name)}!</h1><p style="margin:0;color:#a5a099;font-size:14px;">Таны хуудасны энэ 7 хоногийн тайлан</p></td></tr>
<tr><td style="padding:18px 26px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="text-align:center;background:#0b0b0c;border:1px solid #2b2b30;border-radius:14px;padding:14px;"><div style="font-size:30px;font-weight:800;color:#e2b858;">${x.wk}</div><div style="font-size:12px;color:#a5a099;">7 хоногийн үзэлт</div><div style="font-size:12px;color:${d >= 0 ? '#5fd38a' : '#ff8a70'};margin-top:4px;">${d >= 0 ? '▲' : '▼'} ${Math.abs(d)}% өмнөх 7 хоногоос</div></td>
<td width="10"></td><td style="text-align:center;background:#0b0b0c;border:1px solid #2b2b30;border-radius:14px;padding:14px;"><div style="font-size:30px;font-weight:800;color:#f4efe6;">${x.likes}</div><div style="font-size:12px;color:#a5a099;">Нийт like</div><div style="font-size:12px;color:#a5a099;margin-top:4px;">${x.views} нийт үзэлт</div></td></tr></table></td></tr>
<tr><td style="padding:0 26px 22px;text-align:center;"><a href="${url}" style="display:inline-block;background:#e2b858;color:#1a1205;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:12px;">Хуудсаа үзэх</a><p style="margin:14px 0 0;font-size:12px;color:#7d786f;">Найзуудтайгаа хуваалцаад илүү олон үзэлт аваарай: <a href="${url}" style="color:#e2b858;">biof.site/${esc(x.username)}</a></p></td></tr>
<tr><td style="padding:14px 26px;border-top:1px solid #2b2b30;text-align:center;font-size:11px;color:#7d786f;">Энэ тайланг авахаа болих бол: biof.site/settings → Миний мэдээлэл → "7 хоног бүрийн тайлан"-г унтраана уу.</td></tr></table></td></tr></table></body></html>`;
};
const batch = rows.map(x => ({ from: 'biof <support@biof.site>', to: [x.email], subject: `biof: энэ 7 хоногт ${x.wk} үзэлт`, html: mail(x) }));
const s = await fetch('https://api.resend.com/emails/batch', { method: 'POST', headers: { Authorization: 'Bearer ' + RESEND_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(batch) });
console.log('Resend', s.status, (await s.text()).slice(0, 300));
if (!s.ok) process.exit(1);
console.log(`Илгээсэн: ${batch.length}`);
