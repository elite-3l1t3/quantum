function nf(v,name){
 document.title='404 · biof';const ok=/^[a-z0-9_]{2,20}$/.test(name);
 v.innerHTML=`<div class="nf"><div class="big">404</div><h2>Ийм хуудас алга</h2><p style="color:var(--m);margin-top:8px">${ok?`<b>biof.site/${e(name)}</b> сул байж магадгүй.`:'Холбоос буруу байна.'}</p><div class="act" style="margin-top:18px">${ok?'<button id="cl">Энэ нэрийг авах</button>':''}<a href="/" data-n><button class="g">Нүүр хуудас</button></a></div></div>`;
 if(ok)$('#cl').onclick=async()=>{
  if(!user){localStorage.pending=name;return login()}
  const{data}=await sb.rpc('claim_username',{u:name});
  if(data=='ok'){await loadMe();go('/'+name)}else alert(ERR[data]||data)};
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
async function profile(v,name){
 const demo=name=='a';
 const p=demo?DEMO:(await sb.from('profiles').select('*').eq('username',name).maybeSingle()).data;
 if(!p)return nf(v,name);
 const t=p.theme||{},k=(x,a,b,d)=>Math.min(b,Math.max(a,+x||d)),hx=x=>/^#[0-9a-f]{6}$/i.test(x||'');
 const sh={circle:'50%',round:'22%',square:'6%'}[t.sh]||'50%',ls=['outline','pill'].includes(t.ls)?' ls-'+t.ls:'',fx=['glow','sparkle'].includes(t.fx)?' fx-'+t.fx:'';
 document.title=(p.display_name||p.username)+' · biof';
 if(hx(p.accent))document.documentElement.style.setProperty('--a',p.accent);
 if(cu(p.bg_url))document.body.style.backgroundImage=`url(${p.bg_url})`;
 if(cu(t.video)){const d=document.createElement('video');Object.assign(d,{src:t.video,muted:true,loop:true,autoplay:true,playsInline:true,className:'bgv'});document.body.prepend(d)}
 let liked=false;if(me&&!demo)liked=!!(await sb.from('likes').select('user_id').eq('profile_id',p.id).maybeSingle()).data;
 v.innerHTML=`<div class="card pc${ls}" id="pcard" style="background:rgba(33,26,16,${k(t.op,.2,1,.93)});border-radius:${k(t.r,0,40,20)}px;color:${hx(t.tc)?t.tc:'#f6ead2'};--ar:${sh}">${av(p)}<h2 class="nm${fx}" style="margin-top:8px">${e(p.display_name||p.username)}</h2><div style="color:var(--m)">@${e(p.username)} · #${p.bid}${t.loc?' · '+e(t.loc):''}</div>${p.presence_id?'<div class="pres" id="pres"></div>':''}<div>${bdg(p).map(b=>`<span class="bd">${e(b)}</span>`).join('')}</div><p id="bio" style="margin:10px 0;white-space:pre-line">${t.tw?'':e(p.bio)}</p>${(p.links||[]).slice(0,12).map(l=>`<a class="lk" style="--bc:${bc(l.url)}" target="_blank" rel="noopener nofollow" href="${e(safe(l.url))}"><i></i>${e(l.label)}</a>`).join('')}<div class="act"><span class="chip">👁 ${p.views}</span><button id="lk" class="${liked?'':'g'}">♥ <span id="lc">${p.likes}</span></button><button class="g" id="sh">Хуулах</button></div>${demo?'<div class="act"><a href="/"><button>Өөрийн хуудсаа үүсгэх</button></a></div>':''}${cu(t.music)?'<div class="act"><button class="g" id="mp">❚❚</button><input type="range" id="vol" min="0" max="1" step=".05" value=".5" style="width:110px;margin:0"></div>':''}</div>`;
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
 $('#sh').onclick=()=>{navigator.clipboard?.writeText(location.href);$('#sh').textContent='Хуулсан ✓'};
 if(cu(t.music)){aud=new Audio(t.music);aud.loop=true;aud.volume=.5;
  $('#mp').onclick=()=>{aud.paused?aud.play():aud.pause();$('#mp').textContent=aud.paused?'▶':'❚❚'};
  $('#vol').oninput=ev=>{aud.volume=ev.target.value}}
 if(t.enter||cu(t.music)){const d=document.createElement('div');d.id='ent';d.className='ent';d.textContent=t.enter||'Click to enter';
  d.onclick=()=>{d.remove();$('.bgv')?.play();aud?.play().catch(()=>{})};document.body.append(d)}
 if(!demo&&(!me||me.id!=p.id)){const lk='v_'+p.id;if(Date.now()-(+localStorage[lk]||0)>216e5){localStorage[lk]=Date.now();const vid=localStorage.vid||(localStorage.vid=crypto.randomUUID());sb.rpc('add_view',{pid:p.id,v:vid})}}
}
