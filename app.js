const SB_URL='https://zyrpzoqdoorekspavocs.supabase.co', SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cnB6b3Fkb29yZWtzcGF2b2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODk4OTIsImV4cCI6MjEwODE2NTg5Mn0.ilCd_6g1W7G4S9N3iYXBRwjOEqgYInysBLcH6h233as';
const sb=supabase.createClient(SB_URL,SB_KEY);
const $=s=>document.querySelector(s), app=$('#app');
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^https?:\/\//i.test(u||'')?u:'#';
const cu=u=>/^https?:\/\/[^\s"'()\\]+$/i.test(u||'')?u:'';
const av=p=>cu(p.avatar_url)?`<img class="av" loading="lazy" alt="" src="${e(p.avatar_url)}">`:'<span class="av"></span>';
const bdg=p=>[...(p.role=='admin'?['Admin']:[]),...(p.bid<=100?['OG']:[]),...(p.views>=1000?['1K+ views']:[]),...(p.likes>=50?['50+ likes']:[]),...(p.badges||[])];
const toast=m=>{const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),6000)};
addEventListener('error',x=>toast('Алдаа: '+x.message));
addEventListener('unhandledrejection',x=>toast('Алдаа: '+(x.reason?.message||x.reason)));
let me=null,user=null,aud=null;
const BR={'instagram.com':'#e1306c','tiktok.com':'#25f4ee','youtube.com':'#ff0000','youtu.be':'#ff0000','twitter.com':'#1d9bf0','x.com':'#e7e7e7','github.com':'#9aa0a6','discord.gg':'#5865f2','discord.com':'#5865f2','twitch.tv':'#9146ff','spotify.com':'#1db954','t.me':'#2aabee','facebook.com':'#1877f2','snapchat.com':'#fffc00'};
const bc=u=>{try{return BR[new URL(u).hostname.replace(/^www\./,'')]||'#e8a317'}catch{return '#e8a317'}};
const login=()=>sb.auth.signInWithOAuth({provider:'discord',options:{redirectTo:location.origin+'/'}});
const go=p=>{location.href=p};
const ERR={taken:'Энэ нэр авсан байна',invalid:'2-20 тэмдэгт (a-z, 0-9, _)',cooldown:'7 хоногт 1 удаа солино',banned:'Эрх байхгүй'};

async function loadMe(){
 const{data:{session}}=await sb.auth.getSession();user=session?.user||null;me=null;
 if(!user)return;
 {const r=await sb.rpc('ensure_profile');if(r.error)toast('ensure_profile: '+r.error.message)}
 const q=()=>sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
 me=(await q()).data;
 if(!me)toast('Профайл үүссэнгүй. update.sql ажилласан эсэхээ шалгана уу.');
 if(me&&!me.username&&localStorage.pending){const u=localStorage.pending;localStorage.removeItem('pending');await sb.rpc('claim_username',{u});me=(await q()).data}
}
const bar=()=>`<nav><b><a href="/" data-n>biof</a></b><a href="/leaderboard" data-n>Leaderboard</a>${me?`${me.role=='admin'?'<a href="/admin" data-n>Admin</a>':''}<a href="/settings" data-n>#${me.bid} ${e(me.username||'профайл')}</a>`:'<button onclick="login()">Discord-оор нэвтрэх</button>'}</nav>${me?.banned?'<div class="bad">Таны хаяг ban хийгдсэн байна.</div>':''}`;

async function route(){
 document.body.style.backgroundImage='';document.querySelectorAll('.bgv,#ent').forEach(x=>x.remove());if(aud){aud.pause();aud=null}document.documentElement.style.setProperty('--a','#e8a317');document.title='biof';
 const p=decodeURIComponent(location.pathname.slice(1)).toLowerCase().replace(/\/$/,'').replace(/\.html$/,'');
 const P=document.body.dataset.p;
 app.innerHTML=bar()+'<div class="w" id="v"></div>';const v=$('#v');
 try{ if(P=='home')await home(v);else if(P=='board')await board(v,'views');else if(P=='settings')await settings(v);else if(P=='admin')await admin(v);else await profile(v,p)}
 catch(x){v.innerHTML='<div class="card">Алдаа гарлаа: '+e(x.message)+'</div>'}
}

async function home(v){
 const F=[['Дуу ба видео','Background music, mp4 background, click-to-enter дэлгэц'],['Эффект','Typewriter bio, өнгө, хайрцгийн opacity ба радиус'],['Badge ба #bId','OG, Verified, 1K views зэрэг'],['Leaderboard','View болон like-аар эрэмбэлнэ'],['Линкүүд','Брэнд өнгөтэй, хязгааргүй линк'],['Хурдан','Хөнгөн, lag-гүй, утас ба компьютер дээр']];
 v.innerHTML=`<section class="hero"><h1>Нэг линк.<br>Бүх чинь.</h1><p>Линк, дуу, видео background, badge, view, like бүгд нэг хуудсанд. Discord-оор нэвтэрнэ.</p><div class="claim"><span>biof.site/</span><input id="n" maxlength="20" placeholder="username" autocomplete="off"><button id="b">${me?.username?'Хуудас руу':'Нэр авах'}</button></div><p class="st" id="s"></p></section><div class="feats">${F.map((f,i)=>`<div style="animation-delay:${i*60}ms"><b>${f[0]}</b><small>${f[1]}</small></div>`).join('')}</div><h3 class="sec">Шилдэг профайлууд</h3><div class="tops" id="top"></div><p class="st" id="cnt" style="text-align:center;color:var(--m);margin-top:18px"></p>`;
 let t;const n=$('#n');
 n.oninput=()=>{n.value=n.value.toLowerCase().replace(/[^a-z0-9_]/g,'');clearTimeout(t);
  t=setTimeout(async()=>{if(!n.value)return $('#s').textContent='';const{data}=await sb.rpc('username_status',{u:n.value});$('#s').textContent=data=='available'?'✓ Боломжтой':ERR[data]||''},250)};
 $('#b').onclick=async()=>{
  if(me?.username)return go('/'+me.username);
  if(!n.value)return;
  if(!user){localStorage.pending=n.value;return login()}
  const{data}=await sb.rpc('claim_username',{u:n.value});
  if(data!='ok')return $('#s').textContent=ERR[data]||data;
  await loadMe();go('/'+n.value)};
 const[a,c]=await Promise.all([sb.from('profiles').select('bid,username,display_name,avatar_url,views').not('username','is',null).order('views',{ascending:false}).limit(6),sb.from('profiles').select('id',{count:'exact',head:true}).not('username','is',null)]);
 if($('#top'))$('#top').innerHTML=(a.data||[]).map(p=>`<a href="/${e(p.username)}" data-n>${av(p)}<span>${e(p.display_name||p.username)}</span><small style="color:var(--m)">${p.views}</small></a>`).join('');
 if($('#cnt')&&c.count!=null)$('#cnt').textContent=c.count+' профайл үүсгэгдсэн';
}

function nf(v,name){
 document.title='404 · biof';const ok=/^[a-z0-9_]{2,20}$/.test(name);
 v.innerHTML=`<div class="nf"><div class="big">404</div><h2>Ийм хуудас алга</h2><p style="color:var(--m);margin-top:8px">${ok?`<b>biof.site/${e(name)}</b> сул байж магадгүй.`:'Холбоос буруу байна.'}</p><div class="act" style="margin-top:18px">${ok?'<button id="cl">Энэ нэрийг авах</button>':''}<a href="/" data-n><button class="g">Нүүр хуудас</button></a></div></div>`;
 if(ok)$('#cl').onclick=async()=>{
  if(!user){localStorage.pending=name;return login()}
  const{data}=await sb.rpc('claim_username',{u:name});
  if(data=='ok'){await loadMe();go('/'+name)}else alert(ERR[data]||data)};
}

async function profile(v,name){
 const{data:p}=await sb.from('profiles').select('*').eq('username',name).maybeSingle();
 if(!p)return nf(v,name);
 const t=p.theme||{},k=(x,a,b,d)=>Math.min(b,Math.max(a,+x||d)),hx=x=>/^#[0-9a-f]{6}$/i.test(x||'');
 document.title=(p.display_name||p.username)+' · biof';
 if(hx(p.accent))document.documentElement.style.setProperty('--a',p.accent);
 if(cu(p.bg_url))document.body.style.backgroundImage=`url(${p.bg_url})`;
 if(cu(t.video)){const d=document.createElement('video');Object.assign(d,{src:t.video,muted:true,loop:true,autoplay:true,playsInline:true,className:'bgv'});document.body.prepend(d)}
 let liked=false;if(me)liked=!!(await sb.from('likes').select('user_id').eq('profile_id',p.id).maybeSingle()).data;
 v.innerHTML=`<div class="card" style="background:rgba(33,26,16,${k(t.op,.2,1,.93)});border-radius:${k(t.r,0,40,20)}px;color:${hx(t.tc)?t.tc:'#f6ead2'}">${av(p)}<h2 style="margin-top:8px">${e(p.display_name||p.username)}</h2><div style="color:var(--m)">@${e(p.username)} · #${p.bid}${t.loc?' · '+e(t.loc):''}</div><div>${bdg(p).map(b=>`<span class="bd">${e(b)}</span>`).join('')}</div><p id="bio" style="margin:10px 0;white-space:pre-line">${t.tw?'':e(p.bio)}</p>${(p.links||[]).slice(0,12).map(l=>`<a class="lk" style="--bc:${bc(l.url)}" target="_blank" rel="noopener nofollow" href="${e(safe(l.url))}"><i></i>${e(l.label)}</a>`).join('')}<div class="act"><span>👁 ${p.views}</span><button id="lk" class="${liked?'':'g'}">♥ <span id="lc">${p.likes}</span></button><button class="g" id="sh">Хуулах</button></div>${cu(t.music)?'<div class="act"><button class="g" id="mp">❚❚</button><input type="range" id="vol" min="0" max="1" step=".05" value=".5" style="width:110px;margin:0"></div>':''}</div>`;
 if(t.tw){const el=$('#bio'),s=p.bio||'';let i=0;const iv=setInterval(()=>{el.textContent=s.slice(0,++i);if(i>=s.length)clearInterval(iv)},40)}
 let lc=+p.likes;
 $('#lk').onclick=async()=>{
  if(!user)return login();
  const{data}=await sb.rpc('toggle_like',{pid:p.id});if(data==null)return;
  lc+=data?1:-1;$('#lc').textContent=lc;$('#lk').className=(data?'':'g')+' pop'};
 $('#sh').onclick=()=>{navigator.clipboard?.writeText(location.href);$('#sh').textContent='Хуулсан ✓'};
 if(cu(t.music)){aud=new Audio(t.music);aud.loop=true;aud.volume=.5;
  $('#mp').onclick=()=>{aud.paused?aud.play():aud.pause();$('#mp').textContent=aud.paused?'▶':'❚❚'};
  $('#vol').oninput=ev=>{aud.volume=ev.target.value}}
 if(t.enter||cu(t.music)){const d=document.createElement('div');d.id='ent';d.className='ent';d.textContent=t.enter||'Click to enter';
  d.onclick=()=>{d.remove();$('.bgv')?.play();aud?.play().catch(()=>{})};document.body.append(d)}
 if(!me||me.id!=p.id){const vid=localStorage.vid||(localStorage.vid=crypto.randomUUID());sb.rpc('add_view',{pid:p.id,v:vid})}
}

async function board(v,by){
 const{data}=await sb.from('profiles').select('bid,username,display_name,avatar_url,views,likes').not('username','is',null).order(by,{ascending:false}).limit(50);
 v.innerHTML=`<div class="card" style="max-width:600px"><div style="display:flex;gap:8px;margin-bottom:8px"><button id="bv" class="${by=='views'?'':'g'}">Views</button><button id="bl" class="${by=='likes'?'':'g'}">Likes</button></div>${(data||[]).map((p,i)=>`<a class="row" href="/${e(p.username)}" data-n><b style="width:26px">${i+1}</b>${av(p)}<span style="flex:1">${e(p.display_name||p.username)} <small style="color:var(--m)">#${p.bid}</small></span><b>${p[by]}</b></a>`).join('')}</div>`;
 $('#bv').onclick=()=>board(v,'views');$('#bl').onclick=()=>board(v,'likes');
}

const shrink=(f,max)=>new Promise((ok,no)=>{if(f.type=='image/gif')return ok(f);const i=new Image();i.onload=()=>{const r=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*r);c.height=Math.round(i.height*r);c.getContext('2d').drawImage(i,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no(Error('Зураг уншигдсангүй')),'image/webp',.85)};i.onerror=()=>no(Error('Зураг биш байна'));i.src=URL.createObjectURL(f)});
async function up(kind,f){
 const T={avatar:'image',bg:'image',video:'video',music:'audio'}[kind],lim={image:12,video:15,audio:10}[T];
 if(!f.type.startsWith(T))throw Error('Буруу төрлийн файл');
 if(f.size>lim*1048576)throw Error('Файл '+lim+'MB-аас бага байх ёстой');
 let body=f,ct=f.type,ext=(f.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,4)||'bin';
 if(T=='image'&&f.type!='image/gif'){body=await shrink(f,kind=='avatar'?512:1920);ct='image/webp';ext='webp'}
 const path=me.id+'/'+kind+'.'+ext;
 const{error}=await sb.storage.from('media').upload(path,body,{upsert:true,contentType:ct,cacheControl:'3600'});
 if(error)throw error;
 return sb.storage.from('media').getPublicUrl(path).data.publicUrl+'?v='+Date.now();
}
function settings(v){
 if(!me)return v.innerHTML='<div class="card"><p>Эхлээд нэвтэрнэ үү.</p><br><button onclick="login()">Discord-оор нэвтрэх</button></div>';
 const t=me.theme||{},cur={avatar:me.avatar_url||'',bg:me.bg_url||'',video:t.video||'',music:t.music||''};
 const L=(me.links||[]).map(l=>`${l.label} | ${l.url}`).join('\n');
 const fu=(k,lab,acc)=>`<label>${lab}</label><div class="fu"><input type="file" data-k="${k}" accept="${acc}"><button class="g" type="button" data-x="${k}">Устгах</button></div><small id="s_${k}" style="color:var(--m)">${cur[k]?'✓ Оруулсан':'Файл сонгоогүй'}</small><br><br>`;
 const TB=[['p','Профайл'],['l','Төрх'],['m','Медиа'],['k','Линк']];
 v.innerHTML=`<div class="card" style="text-align:left;max-width:560px"><h2>#${me.bid} Тохиргоо</h2>
 <div class="tabs">${TB.map((x,i)=>`<button class="g${i?'':' on'}" data-t="${x[0]}">${x[1]}</button>`).join('')}</div>
 <div class="tab" data-t="p"><label>Username (7 хоногт 1 удаа солино)</label><input id="un" maxlength="20" value="${e(me.username||'')}">
 <label>Нэр</label><input id="dn" maxlength="40" value="${e(me.display_name)}">
 <label>Bio</label><textarea id="bi" rows="3" maxlength="200">${e(me.bio)}</textarea>
 <label>Байршил</label><input id="lc" maxlength="30" value="${e(t.loc)}">
 <label>Click-to-enter текст</label><input id="en" maxlength="40" value="${e(t.enter)}"></div>
 <div class="tab" data-t="l" hidden><label>Accent өнгө</label><input id="ac" type="color" value="${e(me.accent||'#e8a317')}">
 <label>Текстийн өнгө</label><input id="tc" type="color" value="${e(t.tc||'#f6ead2')}">
 <label>Хайрцгийн opacity</label><input id="op" type="range" min=".3" max="1" step=".05" value="${e(t.op||.93)}">
 <label>Хайрцгийн булан</label><input id="rd" type="range" min="0" max="40" value="${e(t.r??20)}">
 <label><input id="tw" type="checkbox" style="width:auto;margin-right:8px" ${t.tw?'checked':''}>Bio-г typewriter-ээр бичих</label></div>
 <div class="tab" data-t="m" hidden>${fu('avatar','Avatar (зураг эсвэл gif)','image/*')}${fu('bg','Background зураг','image/*')}${fu('video','Background видео (mp4/webm, 15MB хүртэл)','video/mp4,video/webm')}${fu('music','Дуу (mp3, 10MB хүртэл)','audio/*')}</div>
 <div class="tab" data-t="k" hidden><label>Линкүүд (мөр бүр: Нэр | https://url)</label><textarea id="ls" rows="7">${e(L)}</textarea></div>
 <p id="ms" style="min-height:22px"></p><button id="sv">Хадгалах</button> <button class="g" id="lo">Гарах</button></div>`;
 const tb=[...v.querySelectorAll('.tabs button')];
 tb.forEach(b=>b.onclick=()=>{tb.forEach(x=>x.classList.toggle('on',x==b));v.querySelectorAll('.tab').forEach(x=>x.hidden=x.dataset.t!=b.dataset.t)});
 v.querySelectorAll('input[type=file]').forEach(i=>i.onchange=async()=>{
  const k=i.dataset.k,s=$('#s_'+k),f=i.files[0];if(!f)return;
  s.textContent='Хуулж байна…';
  try{cur[k]=await up(k,f);s.textContent='✓ Орлоо. Хадгалах дарна уу'}catch(x){s.textContent='Алдаа: '+(x.message||x)}});
 v.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{cur[b.dataset.x]='';$('#s_'+b.dataset.x).textContent='Устгагдана. Хадгалах дарна уу'});
 $('#lo').onclick=async()=>{await sb.auth.signOut();go('/')};
 $('#sv').onclick=async()=>{
  const un=$('#un').value.trim().toLowerCase();
  if(un&&un!=me.username){const{data}=await sb.rpc('claim_username',{u:un});if(data!='ok')return $('#ms').textContent=ERR[data]||data}
  const links=$('#ls').value.split('\n').map(x=>x.split('|').map(s=>s.trim())).filter(a=>a[0]&&/^https?:\/\//i.test(a[1]||'')).slice(0,12).map(a=>({label:a[0].slice(0,40),url:a[1]}));
  const theme={loc:$('#lc').value,enter:$('#en').value,video:cur.video,music:cur.music,tc:$('#tc').value,op:+$('#op').value,r:+$('#rd').value,tw:$('#tw').checked};
  const{error}=await sb.from('profiles').update({display_name:$('#dn').value,bio:$('#bi').value,avatar_url:cur.avatar||null,bg_url:cur.bg||null,accent:$('#ac').value,links,theme}).eq('id',me.id);
  if(error)return $('#ms').textContent=error.message;
  await loadMe();$('#ms').textContent='Хадгаллаа ✓';
 };
}

async function admin(v){
 if(me?.role!='admin')return v.innerHTML='<div class="card">Эрх байхгүй</div>';
 const{data}=await sb.from('profiles').select('bid,username,display_name,role,banned,badges,views,likes').order('bid').limit(500);
 v.innerHTML=`<div class="card" style="max-width:760px;text-align:left"><h2>Admin</h2><br><input id="q" placeholder="Хайх: username эсвэл #bid">
 <div style="display:flex;gap:6px;margin-bottom:10px"><input id="ru" style="margin:0" placeholder="username"><button id="rs">Taken</button><button class="g" id="rr">Available</button></div><div id="list"></div></div>`;
 const act=async(a,t,val)=>{const{data:d,error}=await sb.rpc('admin_act',{act:a,target:t,val:val??''});alert(error?error.message:(ERR[d]||d));admin(v)};
 const draw=()=>{const q=$('#q').value.toLowerCase().replace('#','');
  $('#list').innerHTML=data.filter(p=>!q||(p.username||'').includes(q)||String(p.bid)==q).map(p=>`<div class="row" style="flex-wrap:wrap"><b>#${p.bid}</b><span style="flex:1">${e(p.username||'—')} ${p.banned?'<span class="bad">BAN</span>':''} <small style="color:var(--m)">${p.views}👁 ${p.likes}♥</small></span>
  <button class="g" data-a="${p.banned?'unban':'ban'}" data-b="${p.bid}">${p.banned?'Unban':'Ban'}</button><button class="g" data-a="rename" data-b="${p.bid}">Нэр</button><button class="g" data-a="free" data-b="${p.bid}">Free</button><button class="g" data-a="badges" data-b="${p.bid}">Badge</button></div>`).join('')};
 draw();$('#q').oninput=draw;
 $('#list').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const a=b.dataset.a,t=+b.dataset.b;
  if(a=='rename'){const x=prompt('Шинэ username');if(x)act(a,t,x)}
  else if(a=='badges'){const x=prompt('Badge-үүд таслалаар (жишээ: verified,staff)');if(x!==null)act(a,t,x)}
  else if(a=='ban'){const x=prompt('Шалтгаан');if(x!==null)act(a,t,x)}
  else act(a,t)};
 $('#rs').onclick=()=>$('#ru').value&&act('reserve',0,$('#ru').value);
 $('#rr').onclick=()=>$('#ru').value&&act('release',0,$('#ru').value);
}

sb.auth.onAuthStateChange((_,s)=>{if((s?.user?.id||null)!==(user?.id||null))setTimeout(async()=>{await loadMe();route()},0)});
loadMe().then(route);
