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
function fxp(kind){
 const d=document.createElement('div');d.className='fxp '+kind;
 d.innerHTML=Array.from({length:22},(_,i)=>`<i style="left:${(i*37+11)%100}%;--d:${6+(i*7)%9}s;--w:${(i*13)%10}s;--s:${3+(i*5)%5}px"></i>`).join('');
 document.body.append(d);
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
 if(cu(t.cursor))R.cursor=`url(${t.cursor}) 0 0,auto`;
 if(cu(t.video)&&!(navigator.connection&&navigator.connection.saveData)){const d=document.createElement('video');Object.assign(d,{src:t.video,muted:true,loop:true,autoplay:true,playsInline:true,className:'bgv'});document.body.prepend(d)}
 if(['snow','ember'].includes(t.bfx))fxp(t.bfx);
 if(t.anim){const full=document.title+' ';let i=0;window.TT=setInterval(()=>{document.title=full.slice(i)+full.slice(0,i);i=(i+1)%full.length},400)}
 let liked=false;if(me&&!demo)liked=!!(await sb.from('likes').select('user_id').eq('profile_id',p.id).maybeSingle()).data;
 v.innerHTML=cardHTML(p,{liked,demo});
 if(!demo){const w=document.createElement('a');w.className='wm';w.href='/';w.textContent='biof';w.style.color=k.tc;document.body.append(w)}
 if(p.presence_id)presence(v.querySelector('#pres'),p.presence_id);
 if(t.tw){const el=v.querySelector('#bio'),s=p.bio||'';let i=0;const iv=setInterval(()=>{if(!el||!el.isConnected){clearInterval(iv);return}el.textContent=s.slice(0,++i);if(i>=s.length)clearInterval(iv)},40)}
 if(t.tl&&matchMedia('(hover:hover)').matches){const c=v.querySelector('#pcard');let f=0;
  c.onpointermove=ev=>{if(f)return;f=requestAnimationFrame(()=>{f=0;const r=c.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;c.style.transform=`perspective(800px) rotateY(${x*10}deg) rotateX(${-y*10}deg)`})};
  c.onpointerleave=()=>{c.style.transform=''}}
 let lc=+p.likes;
 $('#lk').onclick=async()=>{
  if(demo){lc+=$('#lk').classList.contains('g')?1:-1;$('#lc').textContent=lc;$('#lk').classList.toggle('g');return}
  if(!user)return login();
  const{data}=await sb.rpc('toggle_like',{pid:p.id});if(data==null)return toast(ERR.rate);
  lc+=data?1:-1;$('#lc').textContent=lc;$('#lk').className=(data?'':'g')+' pop'};
 $('#sh').onclick=()=>{navigator.clipboard?.writeText(location.href);$('#sh').innerHTML=ic('check',16)+'Хуулагдлаа'};
 const rp=v.querySelector('#rp');
 if(rp)rp.onclick=async()=>{const why=prompt('Яагаад мэдэгдэж байна вэ? (жишээ: хууль бус, хуурамч, дарамт)');if(!why)return;const{data}=await sb.rpc('report_profile',{p_pid:p.id,p_reason:why});toast(data=='ok'?'Мэдэгдсэнд баярлалаа. Админ шалгана.':(ERR[data]||'Алдаа гарлаа'))};
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
