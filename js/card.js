const hx=x=>/^#[0-9a-f]{6}$/i.test(x||'');
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',');
const lum=h=>{const[a,b,c]=rgb(h).split(',').map(Number);return(.299*a+.587*b+.114*c)/255};
const PRE=[['dark','Харанхуй',{ac:'#ffffff',tc:'#f5f5f5',bgc:'#0a0a0a',cc:'#141414',ic:'#2a2a2a'}],['blue','Цэнхэр',{ac:'#3b82f6',tc:'#eef4ff',bgc:'#060b16',cc:'#0d1424',ic:'#1d2a4a'}],['purple','Нил ягаан',{ac:'#a855f7',tc:'#f5eeff',bgc:'#0d0716',cc:'#170f26',ic:'#2c1d4a'}],['pink','Ягаан',{ac:'#ec4899',tc:'#fff0f7',bgc:'#14070f',cc:'#220e19',ic:'#4a1d36'}],['red','Улаан',{ac:'#ef4444',tc:'#fff1f1',bgc:'#120606',cc:'#1f0d0d',ic:'#4a1d1d'}],['green','Ногоон',{ac:'#22c55e',tc:'#effff4',bgc:'#06120a',cc:'#0d1f13',ic:'#1d4a2c'}],['yellow','Шар',{ac:'#f5b301',tc:'#fff7e0',bgc:'#14100a',cc:'#211a10',ic:'#3a2d18'}],['light','Цагаан',{ac:'#111111',tc:'#111111',bgc:'#f4f4f5',cc:'#ffffff',ic:'#e4e4e7'}]];
const clampN=(x,a,b,d)=>Math.min(b,Math.max(a,+x||d));
function skin(p){
 const t=p.theme||{},ac=t.set&&hx(p.accent)?p.accent:'#ffffff',cc=hx(t.cc)?t.cc:'#141414',lt=lum(cc)>.6;
 return{t,ac,cc,lt,bgc:hx(t.bgc)?t.bgc:'#0a0a0a',tc:hx(t.tc)?t.tc:(lt?'#111111':'#f5f5f5'),
  vars:`--a:${ac};--ao:${lum(ac)>.55?'#111':'#fff'};--ic:${hx(t.ic)?t.ic:'#2a2a2a'};--i:${lt?'rgba(0,0,0,.06)':'rgba(255,255,255,.07)'};--l:${lt?'rgba(0,0,0,.12)':'rgba(255,255,255,.12)'};--m:${lt?'rgba(0,0,0,.55)':'rgba(255,255,255,.6)'}`};
}
/* Мэдэгдэж буй платформын http холбоосыг https болгоно */
const upU=u=>{try{const x=new URL(u);if(x.protocol=='http:'&&HOST[x.hostname.replace(/^www\.|^m\./,'')]){x.protocol='https:';return x.href}}catch{}return u};
/* Дүрсний өнгө: theme.pic = 'text' (текстийн өнгө) | 'brand' (брэндийн өнгө) | '#hex' */
function icoCol(t,key,k){
 const pic=t.pic;
 if(hx(pic))return pic;
 if(pic=='brand'){const c=(PL[key]||PL.web)[1],l=lum(c);if((!k.lt&&l<.22)||(k.lt&&l>.85))return'';return c}
 return'';
}
const bgPos=t=>/^\d{1,3}% \d{1,3}%$/.test(t.bgp||'')?t.bgp:'50% 50%';
function cardHTML(p,o){
 o=o||{};
 const k=skin(p),t=k.t,op=clampN(t.op,.2,1,.93),bl=clampN(t.bl,0,20,0);
 const sh={circle:'50%',round:'22%',square:'6%'}[t.sh]||'50%',ls=['outline','pill'].includes(t.ls)?'ls-'+t.ls:'';
 const fx=NAMEFX.some(x=>x[0]==t.fx&&x[0]!='none')?' fx-'+t.fx:(t.gn?' fx-glow':'');
 const F=FRAMES.find(x=>x[0]==t.frame),fr=F&&F[0]!='none'&&(!F[2]||canIco(p))?F[0]:'';
 const nm=p.display_name||p.username,typ=t.fx=='type'&&!o.pv;
 const cls=['pc',ls,t.swap?'swp':'',t.gs?'gl-s':'',t.gb?'gl-b':''].join(' ');
 const bg=t.grad?`linear-gradient(160deg,rgba(${rgb(k.ac)},.28),rgba(${rgb(k.cc)},${op}) 70%)`:`rgba(${rgb(k.cc)},${op})`;
 const links=(p.links||[]).slice(0,12).map(l=>{if(l.emb){const x=embInfo(l.url);if(!x)return'';return embHTML(x,l,o.pv)}const key=PL[l.icon]?l.icon:platFor(l.url),url=upU(l.url||''),im=limg(p,l);return`<a class="lk" style="--bc:${PL[key][1]}" target="_blank" rel="noopener nofollow" href="${e(safe(url))}">${plat(key,34,im,t.swap?'':icoCol(t,key,k))}<span>${e(l.label)}</span>${/^https:\/\//i.test(url)?`<em class="lp ok" title="HTTPS">${ic('lock',14)}</em>`:/^http:\/\//i.test(url)?`<em class="lp bad" title="HTTP">${ic('alert',14)}</em>`:''}</a>`}).join('');
 const acts=o.pv?'':`<button id="lk" class="${o.liked?'':'g'}">${icf('heart',16)}<span id="lc">${p.likes}</span></button><button class="g" id="sh">${ic('copy',16)}Линк хуулах</button>${o.demo||o.own?'':`<button class="g" id="rp" aria-label="Мэдэгдэх" title="Мэдэгдэх">${ic('flag',16)}</button>`}`;
 const mus=!o.pv&&cu(t.music)?`<div class="act"><button class="g" id="mp" aria-label="Дуу">${ic('pause',18)}</button>${t.vol?'<input type="range" id="vol" min="0" max="1" step=".05" value=".5" style="width:120px;margin:0">':''}</div>`:'';
 const ff=fontCss(t.font);if(ff&&typeof document!='undefined')loadFont(t.font);
 return`<div class="card ${cls}" id="pcard" style="background:${bg};${ff?`font-family:${ff};`:''}border-radius:${clampN(t.r,0,40,20)}px;color:${k.tc};--ar:${sh}${bl?`;backdrop-filter:blur(${bl}px);-webkit-backdrop-filter:blur(${bl}px)`:''}">${fr?`<span class="avw fr-${fr}">${av(p)}</span>`:av(p)}<h2 class="nm${fx}" style="margin-top:10px" data-t="${e(nm)}"${typ?` data-full="${e(nm)}"`:''}>${typ?'':e(nm)}</h2><div class="mu">@${e(p.username)} · #${p.bid}</div>${t.loc?`<div class="mu loc">${ic('pin',14)}${e(t.loc)}</div>`:''}${PRESENCE_ON&&p.presence_id&&!o.pv?'<div class="pres" id="pres"></div>':''}<div class="bds">${bdg(p).map(b=>`<span class="bd" tabindex="0" data-d="${e(b[2]||'')}">${ic(b[1],14)}${e(b[0])}</span>`).join('')}</div>${p.bio?`<p id="bio" class="sel" style="margin:12px 0;white-space:pre-line">${t.tw&&!o.pv?'':e(p.bio)}</p>`:''}${links}<div class="act"><span class="chip">${ic('eye',16)}<span id="vn">${p.views}</span></span>${acts}</div>${o.demo?'<div class="act"><a href="/"><button>Өөрийн хуудсаа үүсгэх</button></a></div>':''}${mus}</div>`;
}
/* Видео/дуу: эхлээд зураг/товч л харагдана (хурдан), дарахад тоглуулагч ачаалагдана */
function embHTML(x,l,pv){
 const lbl=e(l.label||(PL[x.k]||[''])[0]);
 const inner=x.k=='youtube'?`<img src="${x.thumb}" alt="" loading="lazy"><span class="emp">${icf('play',26)}</span>`:`<span class="emi">${plat(x.k,40)}</span><span class="emt"><b>${lbl}</b><small>${x.k=='spotify'?'Spotify':'SoundCloud'} · Тоглуулахын тулд дарна уу</small></span><span class="emp sm">${icf('play',18)}</span>`;
 return`<div class="emb emb-${x.k}" ${pv?'':`role="button" tabindex="0" data-emb="${e(x.src)}" data-h="${x.h}"`} aria-label="${lbl}">${inner}</div>${x.k=='youtube'&&l.label?`<div class="emc">${lbl}</div>`:''}`;
}
