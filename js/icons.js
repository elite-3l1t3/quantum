const P={
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
logout:'<path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3M16 8l4 4-4 4M20 12H9"/>'};
const ic=(n,s=20,w=1.8)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const icf=(n,s=20)=>ic(n,s).replace('fill="none"','fill="currentColor"');
const PL={discord:['Discord','#5865F2','Dc'],youtube:['YouTube','#FF0033'],instagram:['Instagram','#E1306C'],x:['X','#16181c'],tiktok:['TikTok','#141414','Tt'],telegram:['Telegram','#229ED9'],spotify:['Spotify','#1DB954'],soundcloud:['SoundCloud','#FF5500','Sc'],github:['GitHub','#24292f','Gh'],twitch:['Twitch','#9146FF','Tw'],snapchat:['Snapchat','#FFFC00','Sn'],facebook:['Facebook','#1877F2','f'],reddit:['Reddit','#FF4500','Rd'],linkedin:['LinkedIn','#0A66C2','in'],steam:['Steam','#1b2838','St'],paypal:['PayPal','#003087','Pp'],pinterest:['Pinterest','#E60023','Pi'],threads:['Threads','#141414','@'],bluesky:['Bluesky','#1185FE','Bs'],vk:['VK','#0077FF','VK'],patreon:['Patreon','#FF424D','Pa'],kofi:['Ko-fi','#FF5E5B','Kf'],roblox:['Roblox','#2b2f36','Rb'],xbox:['Xbox','#107C10','Xb'],playstation:['PlayStation','#003791','PS'],applemusic:['Apple Music','#FA243C','Am'],gitlab:['GitLab','#E24329','Gl'],email:['Имэйл','#4b5563'],web:['Вэб хуудас','#4b5563']};
const GL={
discord:'<path d="M6.5 7.2C8 6.4 9.7 6 12 6s4 .4 5.5 1.2c1.3 2 2 4.2 2.2 6.8-1.2 1-2.6 1.6-4 1.9l-.8-1.3c.4-.2.8-.4 1.2-.7-3 1.3-6.4 1.3-9.4 0 .4.3.8.5 1.2.7l-.8 1.3c-1.4-.3-2.8-.9-4-1.9.2-2.6.9-4.8 2.2-6.8z" fill="#fff"/><circle cx="9.2" cy="11.8" r="1.2" fill="#5865F2"/><circle cx="14.8" cy="11.8" r="1.2" fill="#5865F2"/>',
youtube:'<rect x="3" y="6" width="18" height="12" rx="4" fill="#fff"/><path d="M10.5 9.5v5l4.3-2.5z" fill="#FF0033"/>',
instagram:'<rect x="5" y="5" width="14" height="14" rx="4.5" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="16.3" cy="7.7" r="1" fill="#fff"/>',
x:'<path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/>',
telegram:'<path d="M20 5 4 11.5l5 2 2 5.5 2.6-3.4 4.4 3.4z" fill="#fff"/>',
spotify:'<circle cx="12" cy="12" r="8.5" fill="#fff"/><path d="M7.5 10c3.2-1 6.8-.7 9.5 1M8 12.8c2.8-.8 5.6-.5 8 .9M8.6 15.4c2.3-.6 4.5-.4 6.4.7" stroke="#1DB954" stroke-width="1.6" stroke-linecap="round" fill="none"/>',
email:'<rect x="4" y="6" width="16" height="12" rx="3" fill="none" stroke="#fff" stroke-width="1.8"/><path d="m5 8 7 5 7-5" fill="none" stroke="#fff" stroke-width="1.8"/>',
web:'<circle cx="12" cy="12" r="8" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" fill="none" stroke="#fff" stroke-width="1.6"/>'};
const plat=(k,s=36)=>{const d=PL[k]||PL.web,m=d[2],fg=k=='snapchat'?'#111':'#fff',g=GL[k]||`<text x="12" y="16.2" text-anchor="middle" font-size="${m&&m.length>1?10:13}" font-weight="800" fill="${fg}" font-family="system-ui,sans-serif">${m||''}</text>`;
 return `<span class="pt" style="--pc:${d[1]};width:${s}px;height:${s}px"><svg viewBox="0 0 24 24" width="${Math.round(s*.62)}" height="${Math.round(s*.62)}">${g}</svg></span>`};
const HOST={'discord.gg':'discord','discord.com':'discord','youtube.com':'youtube','youtu.be':'youtube','instagram.com':'instagram','x.com':'x','twitter.com':'x','tiktok.com':'tiktok','t.me':'telegram','telegram.me':'telegram','open.spotify.com':'spotify','spotify.com':'spotify','soundcloud.com':'soundcloud','github.com':'github','twitch.tv':'twitch','snapchat.com':'snapchat','facebook.com':'facebook','fb.com':'facebook','reddit.com':'reddit','linkedin.com':'linkedin','steamcommunity.com':'steam','paypal.me':'paypal','paypal.com':'paypal','pinterest.com':'pinterest','threads.net':'threads','bsky.app':'bluesky','vk.com':'vk','patreon.com':'patreon','ko-fi.com':'kofi','roblox.com':'roblox','gitlab.com':'gitlab','music.apple.com':'applemusic'};
const platFor=u=>{if(/^mailto:/i.test(u||''))return'email';try{return HOST[new URL(u).hostname.replace(/^www\./,'')]||'web'}catch{return'web'}};
const has=(p,k)=>(p.badges||[]).some(x=>String(x).toLowerCase()==k);
const BADGES=[
['admin','Админ','Сайтын удирдагч',p=>p.role=='admin','shield'],
['og','OG','Анхны 100 хэрэглэгчийн нэг байх',p=>p.bid<=100,'star'],
['verified','Баталгаажсан','Админ баталгаажуулсан бүртгэл',p=>has(p,'verified'),'badge'],
['staff','Баг','biof багийн гишүүн',p=>has(p,'staff'),'user'],
['views','1K үзэлт','Хуудас 1000 удаа үзэгдэх',p=>p.views>=1000,'eye'],
['likes','50 like','Хуудас 50 like авах',p=>p.likes>=50,'heart']];
const bdg=p=>[...BADGES.filter(b=>b[3](p)).map(b=>[b[1],b[4]]),...(p.badges||[]).filter(x=>!BADGES.some(b=>b[0]==String(x).toLowerCase())).map(x=>[String(x),'star'])];
