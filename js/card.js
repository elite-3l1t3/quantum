const hx=x=>/^#[0-9a-f]{6}$/i.test(x||'');
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',');
const lum=h=>{const[a,b,c]=rgb(h).split(',').map(Number);return(.299*a+.587*b+.114*c)/255};
const clampN=(x,a,b,d)=>Math.min(b,Math.max(a,+x||d));
function skin(p){
 const t=p.theme||{},ac=t.set&&hx(p.accent)?p.accent:'#ffffff',cc=hx(t.cc)?t.cc:'#141414',lt=lum(cc)>.6;
 return{t,ac,cc,lt,bgc:hx(t.bgc)?t.bgc:'#0a0a0a',tc:hx(t.tc)?t.tc:(lt?'#111111':'#f5f5f5'),
  vars:`--a:${ac};--ao:${lum(ac)>.55?'#111':'#fff'};--ic:${hx(t.ic)?t.ic:'#2a2a2a'};--i:${lt?'rgba(0,0,0,.06)':'rgba(255,255,255,.07)'};--l:${lt?'rgba(0,0,0,.12)':'rgba(255,255,255,.12)'};--m:${lt?'rgba(0,0,0,.55)':'rgba(255,255,255,.6)'}`};
}
function cardHTML(p,o){
 o=o||{};
 const k=skin(p),t=k.t,op=clampN(t.op,.2,1,.93),bl=clampN(t.bl,0,20,0);
 const sh={circle:'50%',round:'22%',square:'6%'}[t.sh]||'50%',ls=['outline','pill'].includes(t.ls)?'ls-'+t.ls:'';
 const fx=['glow','sparkle'].includes(t.fx)?' fx-'+t.fx:(t.gn?' fx-glow':'');
 const cls=['pc',ls,t.mono?'mono':'',t.swap?'swp':'',t.gs?'gl-s':'',t.gb?'gl-b':''].join(' ');
 const bg=t.grad?`linear-gradient(160deg,rgba(${rgb(k.ac)},.28),rgba(${rgb(k.cc)},${op}) 70%)`:`rgba(${rgb(k.cc)},${op})`;
 const links=(p.links||[]).slice(0,12).map(l=>{const key=PL[l.icon]?l.icon:platFor(l.url);return`<a class="lk" style="--bc:${PL[key][1]}" target="_blank" rel="noopener nofollow" href="${e(safe(l.url))}">${plat(key,34)}<span>${e(l.label)}</span></a>`}).join('');
 const acts=o.pv?'':`<button id="lk" class="${o.liked?'':'g'}">${icf('heart',16)}<span id="lc">${p.likes}</span></button><button class="g" id="sh">${ic('copy',16)}Линк хуулах</button>${o.demo?'':`<button class="g" id="rp" aria-label="Мэдэгдэх">${ic('flag',16)}</button>`}`;
 const mus=!o.pv&&cu(t.music)?`<div class="act"><button class="g" id="mp" aria-label="Дуу">${ic('pause',18)}</button>${t.vol?'<input type="range" id="vol" min="0" max="1" step=".05" value=".5" style="width:120px;margin:0">':''}</div>`:'';
 return`<div class="card ${cls}" id="pcard" style="background:${bg};border-radius:${clampN(t.r,0,40,20)}px;color:${k.tc};--ar:${sh}${bl?`;backdrop-filter:blur(${bl}px);-webkit-backdrop-filter:blur(${bl}px)`:''}">${av(p)}<h2 class="nm${fx}" style="margin-top:10px">${e(p.display_name||p.username)}</h2><div class="mu">@${e(p.username)} · #${p.bid}</div>${t.loc?`<div class="mu loc">${ic('pin',14)}${e(t.loc)}</div>`:''}${p.presence_id&&!o.pv?'<div class="pres" id="pres"></div>':''}<div class="bds">${bdg(p).map(b=>`<span class="bd">${ic(b[1],14)}${e(b[0])}</span>`).join('')}</div>${p.bio?`<p id="bio" style="margin:12px 0;white-space:pre-line">${t.tw&&!o.pv?'':e(p.bio)}</p>`:''}${links}<div class="act"><span class="chip">${ic('eye',16)}<span id="vn">${p.views}</span></span>${acts}</div>${o.demo?'<div class="act"><a href="/"><button>Өөрийн хуудсаа үүсгэх</button></a></div>':''}${mus}</div>`;
}
