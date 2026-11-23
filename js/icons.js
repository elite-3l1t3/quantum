window.__v=window.__v||{};window.__v.icons=9;
const P={
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
redo:'<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
cal:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
dice:'<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/>',
drop:'<path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z"/>',
card2:'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16.2c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4M15 10h3M15 13.5h3"/>',
story:'<rect x="6" y="2.5" width="12" height="19" rx="3"/><circle cx="12" cy="9" r="2.5"/><path d="M9 15h6M10 18h4"/>',
eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
heart:'<path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
upload:'<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.6"/><path d="m21 16-5-5-9 9"/>',
music:'<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',
cursor:'<path d="m5 3 14 8-6 1.8L10.5 19z"/>',
play:'<path d="M7 4.5v15l12-7.5z"/>',
pause:'<path d="M8 5v14M16 5v14"/>',
copy:'<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
pin:'<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
text:'<path d="M5 20 12 4l7 16M8 14h8"/>',
spark:'<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/><path d="M19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8z"/>',
trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
up:'<path d="m6 15 6-6 6 6"/>',
down:'<path d="m6 9 6 6 6-6"/>',
arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
shield:'<path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6z"/>',
badge:'<path d="M12 3l2.4 1.8 3 .1 1 2.8 2.3 1.9-.9 2.9.9 2.9-2.3 1.9-1 2.8-3 .1L12 21l-2.4-1.8-3-.1-1-2.8L3.3 14.4l.9-2.9-.9-2.9 2.3-1.9 1-2.8 3-.1z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
logout:'<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',download:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6M10 17h4"/>',lock:'<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',unlock:'<rect x="5" y="11" width="14" height="9" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',alert:'<path d="M12 4 3 20h18z"/><path d="M12 10v4M12 17v.5"/>',coffee:'<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h2a2.5 2.5 0 0 1 0 5h-2M8 3v3M12 3v3"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',home:'<path d="M4 11 12 4l8 7v9H5z"/><path d="M10 20v-6h4v6"/>',chart:'<path d="M5 20V10M12 20V4M19 20v-7"/>',pulse:'<path d="M3 12h4l2-6 4 12 2-6h6"/>',bolt:'<path d="M13 3 5 14h6l-1 7 8-11h-6z"/>',flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',plus:'<path d="M12 5v14M5 12h14"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',bank:'<path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',qr:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2"/>',share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',phone:'<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',cake:'<path d="M4 21h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2zM4 16c2 1.3 4 1.3 6 0s4-1.3 6 0 3 1.3 4 0M12 12V8M12 5.5v.5"/>',work:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',school:'<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',game:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 12.5h4M9 10.5v4M15.5 12h.01M18 13.5h.01"/>',users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2 .6 3.5 2.6 3.5 6"/>'};
const ic=(n,s=20,w=1.8)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const icf=(n,s=20)=>ic(n,s).replace('fill="none"','fill="currentColor"');
const PL={discord:['Discord','#5865F2','Dc'],youtube:['YouTube','#FF0033'],instagram:['Instagram','#E1306C'],x:['X','#16181c'],tiktok:['TikTok','#141414','Tt'],telegram:['Telegram','#229ED9'],spotify:['Spotify','#1DB954'],soundcloud:['SoundCloud','#FF5500','Sc'],github:['GitHub','#24292f','Gh'],twitch:['Twitch','#9146FF','Tw'],snapchat:['Snapchat','#FFFC00','Sn'],facebook:['Facebook','#1877F2','f'],reddit:['Reddit','#FF4500','Rd'],linkedin:['LinkedIn','#0A66C2','in'],steam:['Steam','#1b2838','St'],paypal:['PayPal','#003087','Pp'],pinterest:['Pinterest','#E60023','Pi'],threads:['Threads','#141414','@'],bluesky:['Bluesky','#1185FE','Bs'],vk:['VK','#0077FF','VK'],patreon:['Patreon','#FF424D','Pa'],kofi:['Ko-fi','#FF5E5B','Kf'],roblox:['Roblox','#2b2f36','Rb'],xbox:['Xbox','#107C10','Xb'],playstation:['PlayStation','#003791','PS'],applemusic:['Apple Music','#FA243C','Am'],gitlab:['GitLab','#E24329','Gl'],email:['Имэйл','#4b5563'],web:['Вэб хуудас','#4b5563'],bank:['Данс','#e2b858']};
const GL={
discord:'<path d="M6.5 7.2C8 6.4 9.7 6 12 6s4 .4 5.5 1.2c1.3 2 2 4.2 2.2 6.8-1.2 1-2.6 1.6-4 1.9l-.8-1.3c.4-.2.8-.4 1.2-.7-3 1.3-6.4 1.3-9.4 0 .4.3.8.5 1.2.7l-.8 1.3c-1.4-.3-2.8-.9-4-1.9.2-2.6.9-4.8 2.2-6.8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="9.3" cy="11.8" r="1.1" fill="currentColor"/><circle cx="14.7" cy="11.8" r="1.1" fill="currentColor"/>',
youtube:'<rect x="3" y="6" width="18" height="12" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10.5 9.5v5l4.3-2.5z" fill="currentColor"/>',
instagram:'<rect x="5" y="5" width="14" height="14" rx="4.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.3" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16.3" cy="7.7" r="1" fill="currentColor"/>',
x:'<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>',
telegram:'<path d="M20 5 4 11.5l5 2 2 5.5 2.6-3.4 4.4 3.4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
spotify:'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7.5 10c3.2-1 6.8-.7 9.5 1M8 12.8c2.8-.8 5.6-.5 8 .9M8.6 15.4c2.3-.6 4.5-.4 6.4.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/>',
email:'<rect x="4" y="6" width="16" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m5 8 7 5 7-5" fill="none" stroke="currentColor" stroke-width="1.8"/>',
bank:'<path d="M3 10 12 4l9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
web:'<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" fill="none" stroke="currentColor" stroke-width="1.6"/>'};
const SI=['discord','youtube','instagram','x','tiktok','telegram','spotify','soundcloud','github','twitch','snapchat','facebook','reddit','linkedin','steam','paypal','pinterest','threads','bluesky','vk','patreon','kofi','roblox','xbox','playstation','applemusic','gitlab'];
const PLORD=['facebook','instagram','tiktok','youtube','discord','telegram','x','spotify','snapchat','twitch','github','linkedin','reddit','threads','pinterest','steam','soundcloud','paypal','patreon','kofi','bluesky','vk','roblox','xbox','playstation','applemusic','gitlab','email'];
/* Платформын дүрс: дэвсгэргүй, зөвхөн дүрс (өнгө нь --pic эсвэл текстийн өнгө). img = өөрийн оруулсан дүрс */
const SIU=k=>'https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/'+k+'.svg';
const plat=(k,s=36,img,col)=>{
 const d=PL[k]||PL.web,w=Math.round(s*.74),st=`width:${s}px;height:${s}px${col?';color:'+col:''}`;
 if(img)return`<span class="pt pti" style="${st}"><img src="${e(img)}" alt="" draggable="false" loading="lazy"></span>`;
 const m=d[2],g=GL[k]||`<text x="12" y="16.2" text-anchor="middle" font-size="${m&&m.length>1?10:13}" font-weight="800" fill="currentColor" font-family="system-ui,sans-serif">${m||''}</text>`;
 const si=SI.includes(k)?`<i class="sim" style="width:${w}px;height:${w}px;-webkit-mask-image:url(${SIU(k)});mask-image:url(${SIU(k)})"></i><img class="si" src="${SIU(k)}" crossorigin="anonymous" alt="" width="1" height="1" draggable="false">`:'';
 return`<span class="pt" style="${st}"><svg viewBox="0 0 24 24" width="${w}" height="${w}">${g}</svg>${si}</span>`};
const HOST={'discord.gg':'discord','discord.com':'discord','youtube.com':'youtube','youtu.be':'youtube','instagram.com':'instagram','x.com':'x','twitter.com':'x','tiktok.com':'tiktok','t.me':'telegram','telegram.me':'telegram','open.spotify.com':'spotify','spotify.com':'spotify','soundcloud.com':'soundcloud','github.com':'github','twitch.tv':'twitch','snapchat.com':'snapchat','facebook.com':'facebook','fb.com':'facebook','reddit.com':'reddit','linkedin.com':'linkedin','steamcommunity.com':'steam','paypal.me':'paypal','paypal.com':'paypal','pinterest.com':'pinterest','threads.net':'threads','bsky.app':'bluesky','vk.com':'vk','patreon.com':'patreon','ko-fi.com':'kofi','roblox.com':'roblox','gitlab.com':'gitlab','music.apple.com':'applemusic'};
const platFor=u=>{if(/^mailto:/i.test(u||''))return'email';try{return HOST[new URL(u).hostname.replace(/^www\./,'')]||'web'}catch{return'web'}};
const has=(p,k)=>(p.badges||[]).some(x=>String(x).toLowerCase()==k);
const BADGES=[
['admin','Админ','Сайтын удирдагч',p=>p.role=='admin','shield'],
['mod','Модератор','biof-ийн модератор',p=>p.role=='moderator','shield'],
['og','OG','Анхны 100 хэрэглэгчийн нэг',p=>p.bid<=100||has(p,'og'),'star'],
['verified','Баталгаажсан','Админ баталгаажуулсан бүртгэл. Платформын дүрсээ өөрчилж болно.',p=>has(p,'verified'),'badge'],
['staff','Баг','biof багийн гишүүн',p=>has(p,'staff'),'user'],
['partner','Хамтрагч','biof-ийн хамтрагч',p=>has(p,'partner'),'link'],
['creator','Бүтээгч','Контент бүтээгч',p=>has(p,'creator'),'spark'],
['supporter','Дэмжигч','biof-ийг дэмжсэн',p=>has(p,'supporter'),'coffee'],
['vip','VIP','Онцгой хэрэглэгч',p=>has(p,'vip'),'trophy'],
['bughunter','Алдаа олсон','Сайтын алдаа олж мэдэгдсэн',p=>has(p,'bughunter'),'bolt'],
['friend','Найз','Найзаа урьсан эсвэл урилгаар нэгдсэн',p=>has(p,'friend'),'heart'],
['inviter','5+ найз','5-аас олон найз урьсан',p=>(p.invites||0)>=5,'user'],
['fol10','10 дагагч','10 хүн дагасан',p=>(p.followers||0)>=10,'users'],
['fol100','100 дагагч','100 хүн дагасан',p=>(p.followers||0)>=100,'users'],
['views','1K үзэлт','Хуудас 1000 удаа үзэгдэх',p=>p.views>=1000,'eye'],
['likes','50 like','Хуудас 50 like авах',p=>p.likes>=50,'heart']];
/* Админ гараар олгож болох тэмдгүүд */
const MANUAL=['verified','staff','partner','creator','supporter','vip','bughunter','og'];
const bdg=p=>[...BADGES.filter(b=>b[3](p)).map(b=>[b[1],b[4],b[2]]),...(p.badges||[]).filter(x=>!BADGES.some(b=>b[0]==String(x).toLowerCase())).map(x=>[String(x),'star','Админ олгосон тэмдэг'])];

/* Холбоосын загвар: хэрэглэгч зөвхөн ID/нэрээ бичнэ, бусдыг нь систем бөглөнө */
const TPL={
roblox:['https://www.roblox.com/users/{id}/profile','Roblox ID (тоо)','3601979038',/^\d{1,20}$/],
instagram:['https://instagram.com/{id}','Хэрэглэгчийн нэр','bold.mn',/^[A-Za-z0-9_.]{1,30}$/],
tiktok:['https://www.tiktok.com/@{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_.]{1,30}$/],
youtube:['https://www.youtube.com/@{id}','Сувгийн нэр','boldtv',/^[A-Za-z0-9_.\-]{1,40}$/],
facebook:['https://facebook.com/{id}','Хуудас эсвэл хэрэглэгчийн нэр','bold.mn',/^[A-Za-z0-9.\-]{1,60}$/],
discord:['https://discord.gg/{id}','Серверийн урилгын код','abcDE123',/^[A-Za-z0-9\-]{2,30}$/],
telegram:['https://t.me/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_]{3,32}$/],
x:['https://x.com/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_]{1,15}$/],
github:['https://github.com/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9\-]{1,39}$/],
twitch:['https://www.twitch.tv/{id}','Сувгийн нэр','bold',/^[A-Za-z0-9_]{3,25}$/],
snapchat:['https://www.snapchat.com/add/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_.\-]{3,30}$/],
reddit:['https://www.reddit.com/user/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_\-]{3,24}$/],
linkedin:['https://www.linkedin.com/in/{id}','Профайлын нэр','bold-bat',/^[A-Za-z0-9_\-%]{3,60}$/],
steam:['https://steamcommunity.com/id/{id}','Steam нэр','bold',/^[A-Za-z0-9_\-]{2,32}$/],
spotify:['https://open.spotify.com/user/{id}','Spotify хэрэглэгчийн ID','31abc',/^[A-Za-z0-9_.\-]{2,40}$/],
soundcloud:['https://soundcloud.com/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_\-]{2,40}$/],
pinterest:['https://www.pinterest.com/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_]{3,30}$/],
threads:['https://www.threads.net/@{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_.]{1,30}$/],
paypal:['https://paypal.me/{id}','PayPal.me нэр','bold',/^[A-Za-z0-9]{1,20}$/],
patreon:['https://www.patreon.com/{id}','Хуудасны нэр','bold',/^[A-Za-z0-9_]{1,40}$/],
kofi:['https://ko-fi.com/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_]{1,40}$/],
bluesky:['https://bsky.app/profile/{id}','Хаяг','bold.bsky.social',/^[A-Za-z0-9_.\-]{3,60}$/],
vk:['https://vk.com/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_.]{3,32}$/],
gitlab:['https://gitlab.com/{id}','Хэрэглэгчийн нэр','bold',/^[A-Za-z0-9_.\-]{2,40}$/],
xbox:['https://account.xbox.com/profile?gamertag={id}','Gamertag','Bold Player',/^[A-Za-z0-9 #]{1,20}$/],
playstation:['https://psnprofiles.com/{id}','PSN ID','bold_mn',/^[A-Za-z0-9_\-]{3,16}$/]};
/* Хэрэглэгч бүтэн URL эсвэл @нэр хуулбал ID-г нь салгаж авна */
function idFrom(k,raw){
 const s=String(raw||'').trim(),t=TPL[k];if(!t||!s)return s.replace(/^@/,'');
 if(/^(https?:\/\/|www\.|m\.)/i.test(s)||/^[a-z0-9-]+\.[a-z]{2,}(\/|$)/i.test(s)){
  try{
   const u=new URL(/^https?:/i.test(s)?s:'https://'+s),q=u.searchParams;
   if(q.get('gamertag'))return q.get('gamertag');
   if(k=='facebook'&&q.get('id'))return q.get('id');
   const seg=u.pathname.split('/').filter(Boolean).map(x=>{try{return decodeURIComponent(x)}catch{return x}});
   if(k=='discord'&&seg[0]=='invite')return seg[1]||'';
   const tp=new URL(t[0].replace('{id}','__ID__')).pathname.split('/').filter(Boolean),i=tp.findIndex(x=>x.includes('__ID__'));
   if(i>=0&&seg[i]!=null){const pre=tp[i].split('__ID__')[0];let v=seg[i];if(pre&&v.startsWith(pre))v=v.slice(pre.length);return v}
   if(seg.length)return seg[seg.length-1].replace(/^@/,'');
  }catch{}
 }
 return s.replace(/^@/,'');
}
/* Мэдэгдлийн бэлэн сонголтууд */
const RCAT=[['fake','Хуурамч / бусдын дүр эсгэсэн','user','Өөр хүн, байгууллагын нэрийг ашигласан'],['harass','Дарамт, доромжлол','alert','Хэн нэгнийг дарамталж, заналхийлсэн'],['adult','Насанд хүрэгчдийн агуулга','eye','18+ зураг, бичлэг'],['spam','Спам / луйвар','link','Хууран мэхлэх, хортой холбоос'],['hate','Үзэн ядалт','flag','Үндэс, шашин, хүйсээр ялгаварласан'],['illegal','Хууль бус үйлдэл','shield','Хууль зөрчсөн бараа, үйлчилгээ'],['other','Бусад','spark','Доор тайлбарлана уу']];

/* Фонтууд (бүгд кирилл үсэгтэй). Хуудсанд зөвхөн сонгосон фонт ачаалагдана. */
const FONTS={def:['Үндсэн',''],inter:['Inter','Inter:wght@400;700;800'],mont:['Montserrat','Montserrat:wght@400;700;800'],play:['Playfair Display','Playfair+Display:wght@500;700'],comf:['Comfortaa','Comfortaa:wght@400;700'],rubik:['Rubik','Rubik:wght@400;700;800'],mono:['JetBrains Mono','JetBrains+Mono:wght@400;700'],pixel:['Press Start 2P','Press+Start+2P'],lob:['Lobster','Lobster']};
const fontCss=k=>FONTS[k]&&FONTS[k][1]?`'${FONTS[k][0]}',system-ui,sans-serif`:'';
function loadFont(k){const f=FONTS[k];if(!f||!f[1]||document.querySelector('link[data-font="'+k+'"]'))return;const l=document.createElement('link');l.rel='stylesheet';l.dataset.font=k;l.href='https://fonts.googleapis.com/css2?family='+f[1]+'&display=swap';document.head.append(l)}
/* Бэлэн бүтэн загварууд: өнгө, фонт, булан, холбоосын хэлбэр, эффект бүгд */
const TBASE={tc:'#f5f5f5',bgc:'#0a0a0a',cc:'#141414',op:.93,bl:0,r:20,sh:'circle',fx:'none',ls:'fill',bfx:'none',grad:false,gn:false,gs:false,gb:false,swap:false,pic:'text',font:'def'};
const PAGE_TPL=[
['minimal','Minimal','#111111',{tc:'#111111',bgc:'#f4f4f5',cc:'#ffffff',op:1,r:14,ls:'outline',font:'inter'}],
['neon','Neon','#a855f7',{tc:'#f0e9ff',bgc:'#05010d',cc:'#0d0620',op:.86,r:18,fx:'glow',gn:true,gs:true,gb:true,grad:true,font:'mont',pic:'brand'}],
['glass','Glass','#7dd3fc',{tc:'#ffffff',bgc:'#0b1220',cc:'#1e293b',op:.35,bl:14,r:26,ls:'pill',font:'rubik'}],
['retro','Retro','#ff6ec7',{tc:'#ffe66d',bgc:'#1a1033',cc:'#2b1d52',op:1,r:0,ls:'outline',sh:'square',font:'pixel'}],
['luxury','Luxury','#d4af37',{tc:'#f3e7c9',bgc:'#0a0806',cc:'#15110b',op:.95,r:22,ls:'outline',fx:'sparkle',grad:true,bfx:'ember',font:'play'}],
['soft','Soft','#f472b6',{tc:'#4a3040',bgc:'#fdf2f8',cc:'#ffffff',op:.94,r:30,ls:'pill',grad:true,font:'comf',pic:'brand'}]];
/* Видео/дуу хуудсан дээр тоглуулах: YouTube, Spotify, SoundCloud */
function embInfo(u){
 u=String(u||'').trim();let m;
 if((m=u.match(/^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i)))return{k:'youtube',id:m[1],src:'https://www.youtube-nocookie.com/embed/'+m[1]+'?autoplay=1&rel=0',thumb:'https://i.ytimg.com/vi/'+m[1]+'/hqdefault.jpg',h:0};
 if((m=u.match(/^https:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]{10,40})/i)))return{k:'spotify',id:m[2],src:'https://open.spotify.com/embed/'+m[1].toLowerCase()+'/'+m[2],h:/track|episode/i.test(m[1])?152:352};
 if(/^https:\/\/(?:www\.|m\.)?soundcloud\.com\/[\w-]+\/(?:sets\/)?[\w-]+/i.test(u))return{k:'soundcloud',src:'https://w.soundcloud.com/player/?url='+encodeURIComponent(u.split('?')[0])+'&auto_play=true&visual=false&show_comments=false',h:166};
 return null;
}

/* Профайл зургийн хүрээ. v=1 бол зөвхөн баталгаажсан хэрэглэгчид (сервер ч шалгана) */
const FRAMES=[['none','Байхгүй',0],['gold','Алт',0],['silver','Мөнгө',0],['neon','Неон',0],['fire','Гал',1],['ice','Мөс',1],['sakura','Сакура',1],['galaxy','Галактик',1]];
/* Нэрний эффект */
const NAMEFX=[['none','Байхгүй'],['glow','Гэрэлтэх'],['sparkle','Гялбаа'],['rainbow','Солонго'],['neon','Неон анивчих'],['glitch','Glitch'],['type','Бичигдэх']];
/* Хөдөлгөөнт дэвсгэр */
const BGFX=[['none','Байхгүй'],['snow','Цас'],['ember','Оч'],['bubbles','Бөмбөлөг'],['stars','Од'],['rain','Бороо'],['hearts','Зүрх'],['matrix','Matrix']];

/* Банк / хэтэвч ("Данс" холбоос): дарахад дансны дугаар хуулагдана */
const BANKS=[['khan','Хаан банк'],['golomt','Голомт банк'],['tdb','Худалдаа хөгжлийн банк'],['state','Төрийн банк'],['xac','Хас банк'],['capitron','Капитрон банк'],['bogd','Богд банк'],['mbank','М банк'],['arig','Ариг банк'],['monpay','Monpay'],['socialpay','SocialPay'],['most','Мост мони'],['ckbank','Чингис хаан банк'],['other','Бусад']];
const bankName=k=>(BANKS.find(b=>b[0]==k)||BANKS[BANKS.length-1])[1];
/* Банкны тэмдэг (SVG): брэндийн өнгөтэй, бөөрөнхий дөрвөлжин + товчилсон нэр. [өнгө1, өнгө2, бичвэр, үсгийн хэмжээ]
   Албан ёсны лого биш — банкийг ялгаж таниулах энгийн тэмдэг. */
const BANKMARK={khan:['#16a55a','#05612c','KHAN',10.5],golomt:['#2f68cf','#123478','G',21],socialpay:['#3b82f6','#1747c2','SP',15],tdb:['#1858c0','#0a2a66','TDB',12.5],state:['#de3348','#8d0f22','SB',15],xac:['#f7a21b','#1d8a4a','XAC',12.5],capitron:['#3550a6','#172453','C',21],bogd:['#d1aa2c','#76590e','B',21],mbank:['#8f63f7','#5520b8','M',21],arig:['#f04848','#94181b','A',21],monpay:['#ff9530','#e35400','mp',17],most:['#f5486a','#b8103a','MM',14],ckbank:['#18917f','#0a4842','CK',15]};
/* Албан ёсны тэмдэг (банкуудын өөрсдийн сайтаас авсан лого, зөвхөн банкийг таниулах зорилгоор). Байхгүй бол дээрх өнгөт тэмдэг. */
const BANKLOGO={khan:'khan.png',golomt:'golomt.svg',bogd:'bogd.svg',monpay:'monpay.svg',arig:'arig.svg',tdb:'tdb.png',state:'state.png',xac:'xac.png',most:'most.png',socialpay:'socialpay.png',capitron:'capitron.png',mbank:'mbank.png',ckbank:'ckbank.png'},BANKFULL={capitron:1};
let BKN=0;
function bankSvg(k,s=36){
 if(BANKLOGO[k])return`<span class="pt bkm bko${BANKFULL[k]?' bkf':''}" style="width:${s}px;height:${s}px"><img src="/img/banks/${BANKLOGO[k]}" alt="" width="${s}" height="${s}" loading="lazy" decoding="async" draggable="false"></span>`;
 const m=BANKMARK[k];if(!m)return plat('bank',s);
 const id='bkg'+(++BKN),y=(20+m[3]*.355).toFixed(1);
 return`<span class="pt bkm" style="width:${s}px;height:${s}px"><svg width="${s}" height="${s}" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${m[0]}"/><stop offset="1" stop-color="${m[1]}"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#${id})"/><path d="M0 11A11 11 0 0 1 11 0h18a11 11 0 0 1 11 11v3.5C27 20 13 20 0 14.5z" fill="#fff" opacity=".14"/><text x="20" y="${y}" text-anchor="middle" font-family="'Bricolage Grotesque',Arial,sans-serif" font-weight="800" font-size="${m[3]}"${m[2].length>2?' letter-spacing="-.3"':''} fill="#fff">${m[2]}</text></svg></span>`;
}

/* Хулганы мөр (профайл дээр, зөвхөн хулгана/тачпад) */
const TRAILS=[['none','Байхгүй'],['sparkle','Гялбаа'],['hearts','Зүрх'],['stars','Од'],['bubbles','Бөмбөлөг']];
