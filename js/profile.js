const banHTML=(name,adm)=>`<div class="nf"><span class="bnic">${ic('shield',44)}</span><h2>Энэ хэрэглэгчийг хориглосон</h2><p class="mu" style="margin-top:8px"><b>@${e(name)}</b></p><p class="mu" style="margin-top:6px">Дүрэм зөрчсөн тул энэ хуудсыг хаасан байна.</p>${adm?'<p class="mu" style="margin-top:6px">(Та админ тул харж байна. Хоригийг админ самбараас цуцална.)</p>':''}<div class="act" style="margin-top:18px"><a href="/"><button class="g">Нүүр хуудас</button></a>${adm?'<a href="/admin"><button>Админ самбар</button></a>':''}</div></div>`;
const hidHTML=name=>`<div class="nf"><span class="bnic">${ic('eye',44)}</span><h2>Энэ хуудас түр нуугдсан</h2><p class="mu" style="margin-top:8px"><b>@${e(name)}</b></p><p class="mu" style="margin-top:6px">Олон хүн мэдэгдсэн тул админ шалгаж байна. Шалгалт дуусмагц дахин нээгдэж магадгүй.</p><div class="act" style="margin-top:18px"><a href="/"><button class="g">Нүүр хуудас</button></a></div></div>`;
async function nf(v,name){
 document.body.classList.remove('prof');chrome();document.title='404 · biof';
 const ok=/^[a-z0-9_]{2,20}$/.test(name);
 if(ok){
  let st=null;const r=await sb.rpc('page_info',{u:name});
  if(r.error){const b=(await sb.rpc('ban_info',{u:name})).data;if(b)st='banned'}else st=r.data;
  if(st=='banned'){document.title='biof';v.innerHTML=banHTML(name);return}
  if(st=='hidden'){document.title='biof';v.innerHTML=hidHTML(name);return}
 }
 v.innerHTML=`<div class="nf"><div class="big">404</div><h2>Хуудас олдсонгүй</h2><p class="mu" style="margin-top:8px">${ok?`<b>biof.site/${e(name)}</b> нэр сул байж болзошгүй.`:'Хаяг буруу байна.'}</p><div class="act" style="margin-top:18px">${ok?'<button id="cl">Энэ нэрийг авах</button>':''}<a href="/"><button class="g">Нүүр хуудас</button></a></div></div>`;
 if(ok)$('#cl').onclick=async()=>{
  if(!user){localStorage.pending=name;return login('signup',name)}
  if(me&&me.banned)return toast(ERR.banned);
  if(!cool('claim',2000))return;
  const{data}=await sb.rpc('claim_username',{u:name});
  if(data=='ok'){await loadMe();go('/'+name)}else toast(ERR[data]||String(data))};
}
async function reportDlg(p){
 const r=await dlg({icon:'flag',title:'Хуудсыг мэдэгдэх',ok:'Мэдэгдэх',wide:true,
  html:`<p class="mu" style="margin-bottom:10px">@${e(p.username)} хуудсанд юу буруу байна вэ?</p>${optsHTML('rc',RCAT,'')}<textarea class="dli" id="rpn" rows="2" maxlength="300" placeholder="Нэмэлт тайлбар (заавал биш)"></textarea>`,
  collect:d=>{const c=d.querySelector('input[name=rc]:checked');if(!c){toast('Шалтгаанаа сонгоно уу');return undefined}const n=d.querySelector('#rpn').value.trim();if(c.value=='other'&&n.length<5){toast('"Бусад" бол тайлбар бичнэ үү');return undefined}return{cat:c.value,note:n}}});
 if(!r||!cool('report',5000))return;
 let{data,error}=await sb.rpc('flag_profile',{p_pid:p.id,p_cat:r.cat,p_note:r.note});
 if(error&&/flag_profile/.test(error.message||'')){const lbl=(RCAT.find(x=>x[0]==r.cat)||[])[1];({data,error}=await sb.rpc('report_profile',{p_pid:p.id,p_reason:(lbl+(r.note?': '+r.note:'')).slice(0,300)}))}
 toast(error?'Алдаа: '+error.message:data=='ok'?'Мэдэгдсэнд баярлалаа. Админ шалгана.':(ERR[data]||'Алдаа гарлаа'));
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
function fxp(kind){
 const d=document.createElement('div');d.className='fxp '+kind;
 d.innerHTML=Array.from({length:22},(_,i)=>`<i style="left:${(i*37+11)%100}%;--d:${6+(i*7)%9}s;--w:${(i*13)%10}s;--s:${3+(i*5)%5}px"></i>`).join('');
 document.body.append(d);
}
/* 3D хөдөлгөөн: хулгана/хуруу чиглэсэн газар руу хазайна. Дарсан газартаа түгжигдэж үлдэнэ (дахин дарвал суллагдана) */
function tilt(c){
 let f=0,lock=null;
 const pos=ev=>{const r=c.getBoundingClientRect();return[(ev.clientX-r.left)/r.width-.5,(ev.clientY-r.top)/r.height-.5]};
 const apply=(x,y)=>{if(f)return;f=requestAnimationFrame(()=>{f=0;c.style.transform='perspective(800px) rotateY('+(x*18)+'deg) rotateX('+(-y*18)+'deg) scale(1.02)'})};
 const free=()=>{lock=null;c.classList.remove('tlock');c.style.transform=''};
 c.addEventListener('pointermove',ev=>{if(lock)return;const q=pos(ev);apply(q[0],q[1])});
 c.addEventListener('pointerdown',ev=>{
  if(ev.target.closest('a,button,input'))return;
  const q=pos(ev);
  if(lock&&Math.hypot(q[0]-lock[0],q[1]-lock[1])<.12){free();return}
  lock=q;c.classList.add('tlock');apply(q[0],q[1]);
 });
 c.addEventListener('pointerleave',()=>{if(!lock)c.style.transform=''});
 document.addEventListener('pointerdown',ev=>{if(lock&&!c.contains(ev.target))free()},true);
 if(window.DeviceOrientationEvent&&matchMedia('(hover:none)').matches){
  const on=()=>addEventListener('deviceorientation',ev=>{if(lock||ev.gamma==null)return;apply(Math.max(-.5,Math.min(.5,ev.gamma/50)),Math.max(-.5,Math.min(.5,(ev.beta-45)/50)))},{passive:true});
  if(typeof DeviceOrientationEvent.requestPermission=='function'){
   document.addEventListener('click',()=>{DeviceOrientationEvent.requestPermission().then(s=>{if(s=='granted')on()}).catch(()=>{})},{once:true});
  }else on();
 }
}
async function profile(v,name){
 const demo=name=='a';
 const p=demo?DEMO:(await sb.from('profiles').select('*').eq('username',name).maybeSingle()).data;
 if(!p)return nf(v,name);
 const own=!!(me&&me.id==p.id),adm=!!(me&&me.role=='admin');
 if(p.banned){document.body.classList.remove('prof');chrome();document.title='biof';v.innerHTML=banHTML(p.username,adm);return}
 if(p.hidden&&!own&&!adm){document.body.classList.remove('prof');chrome();document.title='biof';v.innerHTML=hidHTML(p.username);return}
 if(demo)chrome();
 const k=skin(p),t=k.t,R=document.body.style;
 k.vars.split(';').forEach(s=>{const j=s.indexOf(':');R.setProperty(s.slice(0,j),s.slice(j+1))});
 document.title=(p.display_name&&p.display_name!=p.username?p.display_name+' (@'+p.username+')':'@'+p.username)+(demo?' · biof':'');
 if(cu(p.avatar_url))document.querySelectorAll('link[rel=icon]').forEach(l=>{l.href=p.avatar_url;l.removeAttribute('type');l.removeAttribute('sizes')});
 R.backgroundColor=k.bgc;
 if(cu(p.bg_url)&&!cu(t.video)){const d=document.createElement('div');d.className='bgv bgi';d.style.backgroundImage=`url("${p.bg_url}")`;d.style.backgroundPosition=bgPos(t);document.body.prepend(d)}
 if(cu(t.cursor)){R.cursor=`url(${t.cursor}) 0 0,auto`;document.body.classList.add('ucur')}
 if(cu(t.video)&&!(navigator.connection&&navigator.connection.saveData)){const d=document.createElement('video');Object.assign(d,{src:t.video,muted:true,loop:true,autoplay:true,playsInline:true,className:'bgv'});d.setAttribute('controlsList','nodownload');d.setAttribute('playsinline','');d.style.objectPosition=bgPos(t);d.disablePictureInPicture=true;if(cu(p.bg_url))d.poster=p.bg_url;document.body.prepend(d)}
 if(['snow','ember'].includes(t.bfx))fxp(t.bfx);
 if(t.anim){const full=document.title+' ';let i=0;window.TT=setInterval(()=>{document.title=full.slice(i)+full.slice(0,i);i=(i+1)%full.length},400)}
 let liked=false;if(me&&!demo)liked=!!(await sb.from('likes').select('user_id').eq('profile_id',p.id).eq('user_id',me.id).maybeSingle()).data;
 v.innerHTML=cardHTML(p,{liked,demo,own});
 if(p.hidden)v.insertAdjacentHTML('afterbegin',`<div class="tip warn hbx">${ic('alert',18)}<span>${own?'Таны хуудас олон мэдэгдэл авсан тул нийтэд түр нуугдсан байна. Админ шалгаад шийднэ.':'Энэ хуудас нийтэд нуугдсан (олон мэдэгдэл). Админ самбараас шийднэ үү.'}</span></div>`);
 v.querySelectorAll('a.lk').forEach(a=>a.onclick=ev=>{ev.preventDefault();linkGo(a.getAttribute('href'))});
 v.querySelectorAll('[data-emb]').forEach(d=>{const go=()=>{const f=document.createElement('iframe');f.src=d.dataset.emb;f.title=d.getAttribute('aria-label')||'';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.allowFullscreen=true;f.loading='lazy';f.referrerPolicy='strict-origin-when-cross-origin';if(+d.dataset.h)f.style.height=d.dataset.h+'px';d.replaceChildren(f);d.classList.add('on');d.removeAttribute('role');d.onclick=d.onkeydown=null;if(aud&&!aud.paused)aud.pause()};d.onclick=go;d.onkeydown=ev=>{if(ev.key=='Enter'||ev.key==' '){ev.preventDefault();go()}}});
 if(demo){
  v.insertAdjacentHTML('beforeend',`<div class="demo-tools"><h3>${ic('sliders',20)}Загвар сонгоод үз</h3><p class="mu">Доорх өнгөнүүдээс сонгоход энэ хуудас шууд өөрчлөгдөнө. Өөрийн хуудсанд ч ингэж сонгоно.</p><div class="pre">${PRE.map(x=>`<button type="button" class="ps" data-dp="${x[0]}" aria-label="${x[1]}"><i style="--s1:${x[2].bgc};--s2:${x[2].ac};--s3:${x[2].cc}"></i><span>${x[1]}</span></button>`).join('')}</div></div>`);
  v.querySelectorAll('[data-dp]').forEach(b=>b.onclick=()=>{const x=PRE.find(y=>y[0]==b.dataset.dp);DEMO.accent=x[2].ac;Object.assign(DEMO.theme,{tc:x[2].tc,bgc:x[2].bgc,cc:x[2].cc,ic:x[2].ic});route()});
 }
 if(!demo){const w=document.createElement('a');w.className='wm';w.href='/';w.textContent='biof';w.style.color=k.tc;document.body.append(w)}
 if(PRESENCE_ON&&p.presence_id)presence(v.querySelector('#pres'),p.presence_id);
 if(t.tw){const el=v.querySelector('#bio'),s=p.bio||'';let i=0;const iv=setInterval(()=>{if(!el||!el.isConnected){clearInterval(iv);return}el.textContent=s.slice(0,++i);if(i>=s.length)clearInterval(iv)},40)}
 if(t.tl){const c=v.querySelector('#pcard');if(c)tilt(c)}
 let lc=+p.likes;
 $('#lk').onclick=async()=>{
  if(demo){lc+=$('#lk').classList.contains('g')?1:-1;$('#lc').textContent=lc;$('#lk').classList.toggle('g');return}
  if(!user)return login();
  if(!cool('like',700))return;
  const{data}=await sb.rpc('toggle_like',{pid:p.id});if(data==null)return toast(ERR.rate);
  lc+=data?1:-1;$('#lc').textContent=lc;$('#lk').className=(data?'':'g')+' pop'};
 $('#sh').onclick=()=>{try{navigator.clipboard.writeText(location.origin+'/'+p.username)}catch{}$('#sh').innerHTML=ic('check',16)+'Хуулагдлаа';setTimeout(()=>{const b=$('#sh');if(b)b.innerHTML=ic('copy',16)+'Линк хуулах'},2000)};
 const rp=v.querySelector('#rp');if(rp)rp.onclick=()=>reportDlg(p);
 if(cu(t.music)){
  aud=new Audio();aud.preload='none';aud.src=t.music;aud.loop=true;aud.volume=.5;
  const setI=()=>{const b=v.querySelector('#mp');if(b)b.innerHTML=ic(aud&&!aud.paused?'pause':'play',18)};
  aud.addEventListener('play',setI);aud.addEventListener('pause',setI);
  $('#mp').onclick=()=>{aud.paused?aud.play().catch(()=>{}):aud.pause()};
  const vs=v.querySelector('#vol');if(vs)vs.oninput=ev=>{aud.volume=ev.target.value}}
 if(t.enter||cu(t.music)){const d=document.createElement('div');d.id='ent';d.className='ent';d.style.background=k.bgc;d.style.color=k.tc;d.textContent=t.enter||'Орохын тулд дарна уу';
  d.onclick=()=>{d.remove();const bv=document.querySelector('video.bgv');if(bv)bv.play().catch(()=>{});if(aud)aud.play().catch(()=>{})};document.body.append(d)}
 if(!demo){
  let vid=localStorage.vid;if(!vid){const r=crypto.getRandomValues(new Uint8Array(16));r[6]=r[6]&15|64;r[8]=r[8]&63|128;const h=[...r].map(x=>x.toString(16).padStart(2,'0')).join('');vid=localStorage.vid=h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)}
  sb.rpc('add_view',{pid:p.id,v:vid}).then(r=>{
   if(r.error){console.warn('add_view',r.error.message);if(me&&me.role=='admin')toast('Үзэлт: '+r.error.message);return}
   if(r.data!=null){const n=v.querySelector('#vn');if(n)n.textContent=r.data}});
 }
}
