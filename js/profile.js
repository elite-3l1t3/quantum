function nf(v,name){
 document.body.classList.remove('prof');chrome();document.title='404 · biof';const ok=/^[a-z0-9_]{2,20}$/.test(name);
 v.innerHTML=`<div class="nf"><div class="big">404</div><h2>Хуудас олдсонгүй</h2><p class="mu" style="margin-top:8px">${ok?`<b>biof.site/${e(name)}</b> нэр сул байж болзошгүй.`:'Хаяг буруу байна.'}</p><div class="act" style="margin-top:18px">${ok?'<button id="cl">Энэ нэрийг авах</button>':''}<a href="/"><button class="g">Нүүр хуудас</button></a></div></div>`;
 if(ok)$('#cl').onclick=async()=>{
  if(!user){localStorage.pending=name;return login()}
  const{data}=await sb.rpc('claim_username',{u:name});
  if(data=='ok'){await loadMe();go('/'+name)}else toast(ERR[data]||String(data))};
}
const PS={online:'#3ba55d',idle:'#faa61a',dnd:'#ed4245',offline:'#747f8d'};
async function presence(el,id){
 try{
  const j=await(await fetch('https://api.lanyard.rest/v1/users/'+encodeURIComponent(id))).json();
  if(!j.success||!el.isConnected)return;
  const d=j.data,A=d.activities||[],a=A.find(x=>x.type!=4),c=A.find(x=>x.type==4);
  el.innerHTML=`<i style="background:${PS[d.discord_status]||PS.offline}"></i>${e(a?.name||c?.state||d.discord_status)}`;
 }catch{}
}
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)).join(',');
const lum=h=>{const[a,b,c]=rgb(h).split(',').map(Number);return(.299*a+.587*b+.114*c)/255};
function fxp(kind){
 const d=document.createElement('div');d.className='fxp '+kind;
 d.innerHTML=Array.from({length:22},(_,i)=>`<i style="left:${(i*37+11)%100}%;--d:${6+(i*7)%9}s;--w:${(i*13)%10}s;--s:${3+(i*5)%5}px"></i>`).join('');
 document.body.append(d);
}
async function profile(v,name){
 const demo=name=='a';
 const p=demo?DEMO:(await sb.from('profiles').select('*').eq('username',name).maybeSingle()).data;
 if(!p)return nf(v,name);
 const t=p.theme||{},k=(x,a,b,d)=>Math.min(b,Math.max(a,+x||d)),hx=x=>/^#[0-9a-f]{6}$/i.test(x||'');
 if(demo)chrome();
 const op=k(t.op,.2,1,.93),bl=k(t.bl,0,20,0),ac=t.set&&hx(p.accent)?p.accent:'#ffffff',cc=hx(t.cc)?t.cc:'#141414',lt=lum(cc)>.6,R=document.body.style;
 const sh={circle:'50%',round:'22%',square:'6%'}[t.sh]||'50%',ls=['outline','pill'].includes(t.ls)?'ls-'+t.ls:'';
 const fx=['glow','sparkle'].includes(t.fx)?' fx-'+t.fx:(t.gn?' fx-glow':'');
 const cls=['pc',ls,t.mono?'mono':'',t.swap?'swp':'',t.gs?'gl-s':'',t.gb?'gl-b':''].join(' ');
 const bg=t.grad?`linear-gradient(160deg,rgba(${rgb(ac)},.28),rgba(${rgb(cc)},${op}) 70%)`:`rgba(${rgb(cc)},${op})`;
 document.title=p.display_name||p.username;
 R.setProperty('--a',ac);R.setProperty('--ao',lum(ac)>.55?'#111':'#fff');R.setProperty('--ic',hx(t.ic)?t.ic:'#2a2a2a');
 R.setProperty('--i',lt?'rgba(0,0,0,.06)':'rgba(255,255,255,.07)');R.setProperty('--l',lt?'rgba(0,0,0,.12)':'rgba(255,255,255,.12)');R.setProperty('--m',lt?'rgba(0,0,0,.55)':'rgba(255,255,255,.6)');
 const fav=document.querySelector('link[rel=icon]');if(fav)fav.href=cu(p.avatar_url)||'data:,';
 if(hx(t.bgc))document.body.style.backgroundColor=t.bgc;
 if(cu(p.bg_url))document.body.style.backgroundImage=`url(${p.bg_url})`;
 if(cu(t.cursor))document.body.style.cursor=`url(${t.cursor}) 0 0,auto`;
 if(cu(t.video)){const d=document.createElement('video');Object.assign(d,{src:t.video,muted:true,loop:true,autoplay:true,playsInline:true,className:'bgv'});document.body.prepend(d)}
 if(['snow','ember'].includes(t.bfx))fxp(t.bfx);
 if(t.anim){const full=document.title+' ';let i=0;window.TT=setInterval(()=>{document.title=full.slice(i)+full.slice(0,i);i=(i+1)%full.length},400)}
 let liked=false;if(me&&!demo)liked=!!(await sb.from('likes').select('user_id').eq('profile_id',p.id).maybeSingle()).data;
 const links=(p.links||[]).slice(0,12).map(l=>{const key=PL[l.icon]?l.icon:platFor(l.url);return`<a class="lk" style="--bc:${PL[key][1]}" target="_blank" rel="noopener nofollow" href="${e(safe(l.url))}">${plat(key,34)}<span>${e(l.label)}</span></a>`}).join('');
 v.innerHTML=`<div class="card ${cls}" id="pcard" style="background:${bg};border-radius:${k(t.r,0,40,20)}px;color:${hx(t.tc)?t.tc:(lt?'#111':'#f5f5f5')};--ar:${sh}${bl?`;backdrop-filter:blur(${bl}px);-webkit-backdrop-filter:blur(${bl}px)`:''}">${av(p)}<h2 class="nm${fx}" style="margin-top:10px">${e(p.display_name||p.username)}</h2><div class="mu">@${e(p.username)} · #${p.bid}</div>${t.loc?`<div class="mu loc">${ic('pin',14)}${e(t.loc)}</div>`:''}${p.presence_id?'<div class="pres" id="pres"></div>':''}<div class="bds">${bdg(p).map(b=>`<span class="bd">${ic(b[1],14)}${e(b[0])}</span>`).join('')}</div><p id="bio" style="margin:12px 0;white-space:pre-line">${t.tw?'':e(p.bio)}</p>${links}<div class="act"><span class="chip">${ic('eye',16)}${p.views}</span><button id="lk" class="${liked?'':'g'}">${icf('heart',16)}<span id="lc">${p.likes}</span></button><button class="g" id="sh">${ic('copy',16)}Линк хуулах</button></div>${demo?'<div class="act"><a href="/"><button>Өөрийн хуудсаа үүсгэх</button></a></div>':''}${cu(t.music)?`<div class="act"><button class="g" id="mp" aria-label="Дуу">${ic('pause',18)}</button>${t.vol?'<input type="range" id="vol" min="0" max="1" step=".05" value=".5" style="width:120px;margin:0">':''}</div>`:''}</div>`;
 if(p.presence_id)presence(v.querySelector('#pres'),p.presence_id);
 if(t.tw){const el=v.querySelector('#bio'),s=p.bio||'';let i=0;const iv=setInterval(()=>{if(!el||!el.isConnected){clearInterval(iv);return}el.textContent=s.slice(0,++i);if(i>=s.length)clearInterval(iv)},40)}
 if(t.tl&&matchMedia('(hover:hover)').matches){const c=v.querySelector('#pcard');let f=0;
  c.onpointermove=ev=>{if(f)return;f=requestAnimationFrame(()=>{f=0;const r=c.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`})};
  c.onpointerleave=()=>{c.style.transform=''}}
 let lc=+p.likes;
 $('#lk').onclick=async()=>{
  if(demo){lc+=$('#lk').classList.contains('g')?1:-1;$('#lc').textContent=lc;$('#lk').classList.toggle('g');return}
  if(!user)return login();
  const{data}=await sb.rpc('toggle_like',{pid:p.id});if(data==null)return;
  lc+=data?1:-1;$('#lc').textContent=lc;$('#lk').className=(data?'':'g')+' pop'};
 $('#sh').onclick=()=>{navigator.clipboard?.writeText(location.href);$('#sh').innerHTML=ic('check',16)+'Хуулагдлаа'};
 if(cu(t.music)){
  aud=new Audio(t.music);aud.loop=true;aud.volume=.5;
  const setI=()=>{const b=v.querySelector('#mp');if(b)b.innerHTML=ic(aud&&!aud.paused?'pause':'play',18)};
  aud.addEventListener('play',setI);aud.addEventListener('pause',setI);
  $('#mp').onclick=()=>{aud.paused?aud.play().catch(()=>{}):aud.pause()};
  const vs=v.querySelector('#vol');if(vs)vs.oninput=ev=>{aud.volume=ev.target.value}}
 if(t.enter||cu(t.music)){const d=document.createElement('div');d.id='ent';d.className='ent';d.style.background=hx(t.bgc)?t.bgc:'#0a0a0a';d.style.color=hx(t.tc)?t.tc:'#f5f5f5';d.textContent=t.enter||'Орохын тулд дарна уу';
  d.onclick=()=>{d.remove();const bv=document.querySelector('.bgv');if(bv)bv.play();if(aud)aud.play().catch(()=>{})};document.body.append(d)}
 if(!demo&&(!me||me.id!=p.id)){const lk='v_'+p.id;if(Date.now()-(+localStorage[lk]||0)>216e5){localStorage[lk]=Date.now();const vid=localStorage.vid||(localStorage.vid=crypto.randomUUID());sb.rpc('add_view',{pid:p.id,v:vid})}}
}
