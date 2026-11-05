async function nf(v,name){
 document.body.classList.remove('prof');chrome();document.title='404 · biof';
 const ok=/^[a-z0-9_]{2,20}$/.test(name);
 if(ok){
  const b=(await sb.rpc('ban_info',{u:name})).data;
  if(b){document.title='biof';v.innerHTML=`<div class="nf"><span class="bnic">${ic('shield',44)}</span><h2>Энэ хэрэглэгчийг хориглосон</h2><p class="mu" style="margin-top:8px"><b>@${e(name)}</b></p><p class="mu" style="margin-top:6px">Дүрэм зөрчсөн тул хуудас, зураг, дуу болон бүх мэдээллийг нь бүр мөсөн устгасан.</p><div class="act" style="margin-top:18px"><a href="/"><button class="g">Нүүр хуудас</button></a></div></div>`;return}
 }
 v.innerHTML=`<div class="nf"><div class="big">404</div><h2>Хуудас олдсонгүй</h2><p class="mu" style="margin-top:8px">${ok?`<b>biof.site/${e(name)}</b> нэр сул байж болзошгүй.`:'Хаяг буруу байна.'}</p><div class="act" style="margin-top:18px">${ok?'<button id="cl">Энэ нэрийг авах</button>':''}<a href="/"><button class="g">Нүүр хуудас</button></a></div></div>`;
 if(ok)$('#cl').onclick=async()=>{
  if(!user){localStorage.pending=name;return login()}
  if(!cool('claim',2000))return;
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
 if(demo)chrome();
 const k=skin(p),t=k.t,R=document.body.style;
 k.vars.split(';').forEach(s=>{const j=s.indexOf(':');R.setProperty(s.slice(0,j),s.slice(j+1))});
 document.title=p.display_name||p.username;
 const fav=document.querySelector('link[rel=icon]');if(fav)fav.href=cu(p.avatar_url)||'data:,';
 R.backgroundColor=k.bgc;
 if(cu(p.bg_url))R.backgroundImage=`url(${p.bg_url})`;
 if(cu(t.cursor)){R.cursor=`url(${t.cursor}) 0 0,auto`;document.body.classList.add('ucur')}
 if(cu(t.video)&&!(navigator.connection&&navigator.connection.saveData)){const d=document.createElement('video');Object.assign(d,{src:t.video,muted:true,loop:true,autoplay:true,playsInline:true,className:'bgv'});d.setAttribute('controlsList','nodownload');d.disablePictureInPicture=true;document.body.prepend(d)}
 if(['snow','ember'].includes(t.bfx))fxp(t.bfx);
 if(t.anim){const full=document.title+' ';let i=0;window.TT=setInterval(()=>{document.title=full.slice(i)+full.slice(0,i);i=(i+1)%full.length},400)}
 let liked=false;if(me&&!demo)liked=!!(await sb.from('likes').select('user_id').eq('profile_id',p.id).maybeSingle()).data;
 const own=!!(me&&me.id==p.id);
 v.innerHTML=cardHTML(p,{liked,demo,own});
 v.querySelectorAll('a.lk').forEach(a=>a.onclick=ev=>{ev.preventDefault();linkGo(a.getAttribute('href'))});
 if(demo){
  v.insertAdjacentHTML('beforeend',`<div class="demo-tools"><h3>${ic('sliders',20)}Загвар сонгоод үз</h3><p class="mu">Доорх өнгөнүүдээс сонгоход энэ хуудас шууд өөрчлөгдөнө. Өөрийн хуудсанд ч ингэж сонгоно.</p><div class="pre">${PRE.map(x=>`<button type="button" class="ps" data-dp="${x[0]}" aria-label="${x[1]}"><i style="--s1:${x[2].bgc};--s2:${x[2].ac};--s3:${x[2].cc}"></i><span>${x[1]}</span></button>`).join('')}</div></div>`);
  v.querySelectorAll('[data-dp]').forEach(b=>b.onclick=()=>{const x=PRE.find(y=>y[0]==b.dataset.dp);DEMO.accent=x[2].ac;Object.assign(DEMO.theme,{tc:x[2].tc,bgc:x[2].bgc,cc:x[2].cc,ic:x[2].ic});route()});
 }
 if(!demo){const w=document.createElement('a');w.className='wm';w.href='/';w.textContent='biof';w.style.color=k.tc;document.body.append(w)}
 if(p.presence_id)presence(v.querySelector('#pres'),p.presence_id);
 if(t.tw){const el=v.querySelector('#bio'),s=p.bio||'';let i=0;const iv=setInterval(()=>{if(!el||!el.isConnected){clearInterval(iv);return}el.textContent=s.slice(0,++i);if(i>=s.length)clearInterval(iv)},40)}
 if(t.tl){const c=v.querySelector('#pcard');if(c)tilt(c)}
 let lc=+p.likes;
 $('#lk').onclick=async()=>{
  if(demo){lc+=$('#lk').classList.contains('g')?1:-1;$('#lc').textContent=lc;$('#lk').classList.toggle('g');return}
  if(!user)return login();
  if(!cool('like',700))return;
  const{data}=await sb.rpc('toggle_like',{pid:p.id});if(data==null)return toast(ERR.rate);
  lc+=data?1:-1;$('#lc').textContent=lc;$('#lk').className=(data?'':'g')+' pop'};
 $('#sh').onclick=()=>{navigator.clipboard?.writeText(location.href);$('#sh').innerHTML=ic('check',16)+'Хуулагдлаа'};
 const jp=v.querySelector('#jp');if(jp)jp.onclick=()=>savePageJpg(v.querySelector('#pcard')||v,p.username);
 const rp=v.querySelector('#rp');
 if(rp)rp.onclick=async()=>{
  const why=await dlg({icon:'flag',title:'Хуудсыг мэдэгдэх',body:'Яагаад мэдэгдэж байна вэ?',input:{placeholder:'жишээ: хууль бус, хуурамч, дарамт'},ok:'Мэдэгдэх'});
  if(!why||!cool('report',5000))return;
  const{data}=await sb.rpc('report_profile',{p_pid:p.id,p_reason:why});
  toast(data=='ok'?'Мэдэгдсэнд баярлалаа. Админ шалгана.':(ERR[data]||'Алдаа гарлаа'))};
 if(cu(t.music)){
  aud=new Audio();aud.preload='none';aud.src=t.music;aud.loop=true;aud.volume=.5;
  const setI=()=>{const b=v.querySelector('#mp');if(b)b.innerHTML=ic(aud&&!aud.paused?'pause':'play',18)};
  aud.addEventListener('play',setI);aud.addEventListener('pause',setI);
  $('#mp').onclick=()=>{aud.paused?aud.play().catch(()=>{}):aud.pause()};
  const vs=v.querySelector('#vol');if(vs)vs.oninput=ev=>{aud.volume=ev.target.value}}
 if(t.enter||cu(t.music)){const d=document.createElement('div');d.id='ent';d.className='ent';d.style.background=k.bgc;d.style.color=k.tc;d.textContent=t.enter||'Орохын тулд дарна уу';
  d.onclick=()=>{d.remove();const bv=document.querySelector('.bgv');if(bv)bv.play();if(aud)aud.play().catch(()=>{})};document.body.append(d)}
 if(!demo){
  const vid=localStorage.vid||(localStorage.vid=crypto.randomUUID());
  sb.rpc('add_view',{pid:p.id,v:vid}).then(r=>{
   if(r.error){console.warn('add_view',r.error.message);if(me&&me.role=='admin')toast('Үзэлт: '+r.error.message);return}
   if(r.data!=null){const n=v.querySelector('#vn');if(n)n.textContent=r.data}});
 }
}
