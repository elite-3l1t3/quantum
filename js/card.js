const hx=x=>/^#[0-9a-f]{6}$/i.test(x||'');
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',');
const lum=h=>{const[a,b,c]=rgb(h).split(',').map(Number);return(.299*a+.587*b+.114*c)/255};
const PRE=[['dark','Харанхуй',{ac:'#ffffff',tc:'#f5f5f5',bgc:'#0a0a0a',cc:'#141414',ic:'#2a2a2a'}],['blue','Цэнхэр',{ac:'#3b82f6',tc:'#eef4ff',bgc:'#060b16',cc:'#0d1424',ic:'#1d2a4a'}],['purple','Нил ягаан',{ac:'#a855f7',tc:'#f5eeff',bgc:'#0d0716',cc:'#170f26',ic:'#2c1d4a'}],['pink','Ягаан',{ac:'#ec4899',tc:'#fff0f7',bgc:'#14070f',cc:'#220e19',ic:'#4a1d36'}],['red','Улаан',{ac:'#ef4444',tc:'#fff1f1',bgc:'#120606',cc:'#1f0d0d',ic:'#4a1d1d'}],['green','Ногоон',{ac:'#22c55e',tc:'#effff4',bgc:'#06120a',cc:'#0d1f13',ic:'#1d4a2c'}],['yellow','Шар',{ac:'#f5b301',tc:'#fff7e0',bgc:'#14100a',cc:'#211a10',ic:'#3a2d18'}],['light','Цагаан',{ac:'#111111',tc:'#111111',bgc:'#f4f4f5',cc:'#ffffff',ic:'#e4e4e7'}]];
const clampN=(x,a,b,d)=>Math.min(b,Math.max(a,+x||d));
/* v18: холбоосын хөдөлгөөн, хуваарь, эзний цаг */
const LANS=[['none','Байхгүй'],['up','Доороос гарч ирэх'],['zoom','Томорч гарах'],['slide','Хажуунаас орж ирэх'],['blur','Бүдгэрлээс тодрох']];
const LHS=[['none','Энгийн'],['lift','Дээш хөөрөх'],['shine','Гялалзах'],['wiggle','Сэгсрэх'],['press','Дарагдах']];
const DTRX=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const lkOn=l=>{const n=Date.now(),f=DTRX.test(l.sf||'')?Date.parse(l.sf):NaN,u=DTRX.test(l.su||'')?Date.parse(l.su):NaN;return!(f>n)&&!(u<=n)};
const tzOk=z=>{if(typeof z!='string'||!/^[A-Za-z][A-Za-z0-9_+\-]*(\/[A-Za-z0-9_+\-]+){0,2}$/.test(z)||z.length>40)return false;try{new Intl.DateTimeFormat('en',{timeZone:z});return true}catch{return false}};
const tzNow=z=>{try{return new Intl.DateTimeFormat('en-GB',{timeZone:z,hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())}catch{return''}};
const tzCity=z=>String(z).split('/').pop().replace(/_/g,' ');
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
 const sh={circle:'50%',round:'22%',square:'6%'}[t.sh]||'50%',ls=['outline','pill','icons'].includes(t.ls)?'ls-'+t.ls:'',icons=t.ls=='icons';
 const fx=NAMEFX.some(x=>x[0]==t.fx&&x[0]!='none')?' fx-'+t.fx:(t.gn?' fx-glow':'');
 const F=FRAMES.find(x=>x[0]==t.frame),fr=F&&F[0]!='none'&&(!F[2]||canIco(p))?F[0]:'';
 const nm=p.display_name||p.username,typ=t.fx=='type'&&!o.pv;
 const cls=['pc',ls,t.lay=='clean'?'lay-clean':'',t.al=='left'?'al-left':'',t.swap?'swp':'',t.gs?'gl-s':'',t.gb?'gl-b':'',LANS.some(x=>x[0]==t.lan&&x[0]!='none')?'lan-'+t.lan+(o.pv&&!o.lanPlay?'':' go'):'',LHS.some(x=>x[0]==t.lh&&x[0]!='none')?'lh-'+t.lh:''].join(' ');
 const bg=t.grad?`linear-gradient(160deg,rgba(${rgb(k.ac)},.28),rgba(${rgb(k.cc)},${op}) 70%)`:`rgba(${rgb(k.cc)},${op})`;
 const LL=(p.links||[]).filter(l=>o.pv||lkOn(l)).slice(0,12),isReg=l=>l.icon!='bank'&&!l.emb,mk=(l,ix)=>{const si=`--i:${ix||0}`;if(l.icon=='bank'){const acc=String(l.acc||'').replace(/[^0-9A-Za-z\- ]/g,'').slice(0,34);if(!acc)return'';return`<button type="button" class="lk bnk" style="${si}" data-acc="${e(acc)}" data-hold="${e(String(l.holder||'').slice(0,40))}" data-bank="${e(bankName(l.bank))}">${plat('bank',34,'',t.swap?'':icoCol(t,'bank',k))}<span>${e(l.label||bankName(l.bank))}<small class="bac">${e(bankName(l.bank))} · ${e(acc)}</small></span><em class="lp">${ic('copy',14)}</em></button>`}if(l.emb){const x=embInfo(l.url);if(!x)return'';return embHTML(x,l,o.pv).replace('<div class="emb ','<div style="'+si+'" class="emb ')}const key=PL[l.icon]?l.icon:platFor(l.url),url=upU(l.url||''),im=limg(p,l);const sch=!!(DTRX.test(l.sf||'')||DTRX.test(l.su||'')),off=sch&&!lkOn(l);return`<a class="lk${l.hl?' hl':''}${off?' off':''}" title="${e(l.label)}" style="--bc:${PL[key][1]};${si}" target="_blank" rel="noopener nofollow" href="${e(safe(url))}">${plat(key,34,im,t.swap?'':icoCol(t,key,k))}<span>${e(l.label)}${l.hl?'<small class="hlt">Онцлох</small>':''}${o.pv&&sch?`<small class="sct">${ic('cal',10)}${off?'Нуугдсан':'Хуваарьтай'}</small>`:''}${l.ds&&!icons?`<small class="lds">${e(String(l.ds).slice(0,60))}</small>`:''}</span>${key!='web'?'':/^https:\/\//i.test(url)?`<em class="lp ok" title="HTTPS">${ic('lock',14)}</em>`:/^http:\/\//i.test(url)?`<em class="lp bad" title="HTTP">${ic('alert',14)}</em>`:''}</a>`};
 const links=icons?`<div class="lki">${LL.filter(isReg).map(mk).join('')}</div>${LL.filter(l=>!isReg(l)).map(mk).join('')}`:LL.map(mk).join('');
 const acts=o.pv?'':`<button id="lk" class="${o.liked?'':'g'}" aria-label="Like">${icf('heart',16)}<span id="lc">${p.likes}</span></button>${o.demo||o.own||p.followers==null?'':`<button id="fw" class="${o.following?'g':''}" aria-label="Дагах">${ic(o.following?'check':'plus',16)}<span>${o.following?'Дагаж байна':'Дагах'}</span></button>`}<button class="g" id="sh">${ic('share',16)}Хуваалцах</button><button class="g" id="qrb" aria-label="QR код" title="QR код">${ic('qr',16)}</button>${o.demo||o.own?'':`<button class="g" id="rp" aria-label="Мэдэгдэх" title="Мэдэгдэх">${ic('flag',16)}</button>`}`;
 const mus=!o.pv&&cu(t.music)?`<div class="act mus"><button class="g" id="mp" aria-label="Дуу">${ic('pause',18)}</button>${t.mt?`<span class="mti"><span>${ic('music',14)} ${e(String(t.mt).slice(0,50))}</span></span>`:''}${t.vol?'<input type="range" id="vol" min="0" max="1" step=".05" value=".5" style="width:120px;margin:0">':''}</div>`:'';
 const ff=fontCss(t.font);if(ff&&typeof document!='undefined')loadFont(t.font);
 return`<div class="card ${cls}" id="pcard" style="background:${bg};${ff?`font-family:${ff};`:''}border-radius:${clampN(t.r,0,40,20)}px;color:${k.tc};--ar:${sh}${bl?`;backdrop-filter:blur(${bl}px);-webkit-backdrop-filter:blur(${bl}px)`:''}">${fr?`<span class="avw fr-${fr}">${av(p)}</span>`:av(p)}<h2 class="nm${fx}" style="margin-top:10px" data-t="${e(nm)}"${typ?` data-full="${e(nm)}"`:''}>${typ?'':e(nm)}</h2>${t.st?`<div class="stt2">${e(String(t.st).slice(0,60))}</div>`:''}<div class="mu">@${e(p.username)} · #${p.bid}</div>${t.loc?`<div class="mu loc">${ic('pin',14)}${e(t.loc)}</div>`:''}${t.tz&&tzOk(t.tz)?`<div class="mu loc tzc" title="${e(t.tz)}">${ic('clock',14)}<b data-tz="${e(t.tz)}">${tzNow(t.tz)}</b><span>· ${e(tzCity(t.tz))}</span></div>`:''}${PRESENCE_ON&&p.presence_id&&!o.pv?'<div class="pres" id="pres"></div>':''}<div class="bds">${bdg(p).map(b=>`<span class="bd" tabindex="0" data-d="${e(b[2]||'')}">${ic(b[1],14)}${e(b[0])}</span>`).join('')}</div>${p.bio?`<p id="bio" class="sel" style="margin:12px 0;white-space:pre-line">${t.tw&&!o.pv?'':e(p.bio)}</p>`:''}${links}${aboutHTML(t.ab)}${cdHTML(t.cd)}<div class="act">${t.hv?'':`<span class="chip">${ic('eye',16)}<span id="vn">${p.views}</span></span>`}${p.followers?`<span class="chip" title="Дагагч">${ic('users',16)}<span id="fc">${p.followers}</span></span>`:''}${acts}</div>${o.demo?'<div class="act"><a href="/"><button>Өөрийн хуудсаа үүсгэх</button></a></div>':''}${mus}</div>`;
}
/* Видео/дуу: эхлээд зураг/товч л харагдана (хурдан), дарахад тоглуулагч ачаалагдана */
function embHTML(x,l,pv){
 const lbl=e(l.label||(PL[x.k]||[''])[0]);
 const inner=x.k=='youtube'?`<img src="${x.thumb}" alt="" loading="lazy"><span class="emp">${icf('play',26)}</span>`:`<span class="emi">${plat(x.k,40)}</span><span class="emt"><b>${lbl}</b><small>${x.k=='spotify'?'Spotify':'SoundCloud'} · Тоглуулахын тулд дарна уу</small></span><span class="emp sm">${icf('play',18)}</span>`;
 return`<div class="emb emb-${x.k}" ${pv?'':`role="button" tabindex="0" data-emb="${e(x.src)}" data-h="${x.h}"`} aria-label="${lbl}">${inner}</div>${x.k=='youtube'&&l.label?`<div class="emc">${lbl}</div>`:''}`;
}
/* "Миний тухай": ажил, сургууль, дуртай тоглоом */
function aboutHTML(ab){
 if(!ab||typeof ab!='object')return'';
 const L=[ab.job?['work',ab.job]:null,ab.sch?['school',ab.sch]:null,ab.gm?['game',ab.gm]:null].filter(Boolean);
 return L.length?`<div class="abt">${L.map(x=>`<span class="abc">${ic(x[0],14)}${e(String(x[1]).slice(0,40))}</span>`).join('')}</div>`:'';
}
/* Тоолуур (countdown): theme.cd = {t:'Гарчиг', at:'YYYY-MM-DDTHH:MM'} */
function cdParts(at){const d=new Date(at).getTime()-Date.now();if(!(d>0))return null;const s=Math.floor(d/1000);return[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60]}
function cdInner(at){const q=cdParts(at);return q?q.map((n,i)=>`<span><b>${String(n).padStart(i?2:1,'0')}</b><small>${['өдөр','цаг','мин','сек'][i]}</small></span>`).join(''):'<span><b>Боллоо!</b></span>'}
function cdHTML(cd){
 if(!cd||typeof cd!='object'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(cd.at||''))return'';
 return`<div class="cdn" data-at="${e(cd.at)}">${cd.t?`<div class="cdt">${e(String(cd.t).slice(0,30))}</div>`:''}<div class="cdv">${cdInner(cd.at)}</div></div>`;
}
/* Градиент дэвсгэр: theme.bgg = {a:'#hex', b:'#hex', d:градус} */
const bgGrad=t=>{const g=t&&t.bgg;if(!g||!hx(g.a)||!hx(g.b))return'';const d=Math.round(clampN(g.d,0,360,135));return`linear-gradient(${d}deg,${g.a},${g.b})`};
