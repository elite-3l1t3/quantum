async function home(v){
 let st=null;try{st=JSON.parse(sessionStorage.st||'null')}catch{}
 if(!st||Date.now()-st.t>6e4){st={...((await sb.rpc('site_stats')).data||{}),t:Date.now()};sessionStorage.st=JSON.stringify(st)}
 const F=[['Дуу ба видео','Background music, mp4 background, click-to-enter дэлгэц'],['Эффект','Typewriter bio, өнгө, хайрцгийн opacity ба радиус'],['Badge ба #bId','OG, Verified, 1K views зэрэг'],['Файл upload','Avatar, background, видео, дууг шууд файлаас оруул'],['Линкүүд','Брэнд өнгөтэй, олон линк'],['Хурдан','Хөнгөн, lag-гүй, утас ба компьютер дээр']];
 const STEP=[['Discord-оор нэвтэр','Нэг товшилтоор, нууц үг хэрэггүй.'],['Username-аа нөөцөл','biof.site/нэр — хамгийн сайхан нэрээ түрүүлж ав.'],[st.open?'Хуудсаа тохируул':'Release хүлээ',st.open?'Зураг, дуу, видео, линкээ нэм.':'Нээгдмэгц хуудас чинь шууд идэвхжиж, тохируулж эхэлнэ.']];
 const Q=[['Waitlist гэж юу вэ?','Нээлтээс өмнө хүмүүс username-аа нөөцөлдөг жагсаалт. Admin release хийхэд хуудаснууд нээгдэнэ.'],['Яагаад зөвхөн Discord?','Нууц үг, имэйл шаардахгүй, хурдан бөгөөд аюулгүй нэвтрэхийн тулд.'],['Username-аа солиж болох уу?','Болно, 7 хоногт нэг удаа.'],['Хуудас дээрээ юу оруулж болох вэ?','Линк, bio, avatar, background зураг эсвэл видео, дуу, өнгө болон эффектүүд.']];
 const W=['Линк','Дуу','Видео','Badge','#bId','Файл upload','Typewriter','Template','Discord'];
 const label=me?.username?(me.approved?'Хуудас руу':'Миний төлөв'):'Нэр авах';
 v.innerHTML=`<section class="h2"><div class="h2l"><span class="pill">${st.open?'Нээлттэй':'Waitlist'}</span><h1>Нэг линк.<br>Бүх чинь.</h1><p>${st.open?'Линк, дуу, видео, badge нэг хуудсанд. Discord-оор нэвтэрнэ.':'Нээлтийн өмнө username-аа нөөцөл. Release болмогц хуудас чинь шууд нээгдэнэ.'}</p><div class="claim"><span>biof.site/</span><input id="n" maxlength="20" placeholder="username" autocomplete="off"><button id="b">${label}</button></div><p class="st" id="s"></p><div class="meta"><span class="chip">${st.waiting??0} хүлээж байна</span><span class="chip">${st.live??0} хуудас</span><a class="tpl" href="/a">Template харах →</a></div></div><a class="h2r" href="/a" aria-label="Template"><div class="pv back"></div><div class="pv front"><span class="av">B</span><div style="font-weight:800;font-size:20px;margin-top:8px">biof template</div><small style="color:var(--m)">@a · #1</small><div style="margin:8px 0"><span class="bd">Verified</span><span class="bd">OG</span></div><span class="pl" style="--bc:#5865f2"><i></i>Discord</span><span class="pl" style="--bc:#e1306c"><i></i>Instagram</span><span class="pl" style="--bc:#ff0000"><i></i>YouTube</span><span class="pl" style="--bc:#9aa0a6"><i></i>GitHub</span></div></a></section>
 <div class="mq"><div>${[...W,...W].map(x=>`<span>${x}</span>`).join('')}</div></div>
 <h2 class="sec2 rv">Юу байдаг вэ</h2><div class="g3">${F.map((f,i)=>`<div class="f2 rv"><em>0${i+1}</em><b>${f[0]}</b><small>${f[1]}</small></div>`).join('')}</div>
 <h2 class="sec2 rv">Хэрхэн эхлэх вэ</h2><div class="w-narrow">${STEP.map((s,i)=>`<div class="stp rv"><em>${i+1}</em><div><b>${s[0]}</b><small>${s[1]}</small></div></div>`).join('')}</div>
 <h2 class="sec2 rv">Түгээмэл асуулт</h2><div class="w-narrow">${Q.map(q=>`<details class="fq rv"><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join('')}</div>
 <div class="cta rv"><h2>Нэрээ түрүүлж ав.</h2><button id="cta">Username авах</button></div>`;
 let t;const n=v.querySelector('#n'),S=v.querySelector('#s');
 n.oninput=()=>{n.value=n.value.toLowerCase().replace(/[^a-z0-9_]/g,'');clearTimeout(t);
  t=setTimeout(async()=>{if(!n.value)return S.textContent='';const{data}=await sb.rpc('username_status',{u:n.value});S.textContent=data=='available'?'✓ Боломжтой':ERR[data]||''},250)};
 v.querySelector('#b').onclick=async()=>{
  if(me?.username)return go(me.approved?'/'+me.username:'/settings');
  if(!n.value)return;
  if(!user){localStorage.pending=n.value;return login()}
  const{data}=await sb.rpc('claim_username',{u:n.value});
  if(data!='ok')return S.textContent=ERR[data]||data;
  await loadMe();go(me?.approved?'/'+n.value:'/settings')};
 v.querySelector('#cta').onclick=()=>{scrollTo({top:0,behavior:'smooth'});n.focus({preventScroll:true})};
 const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12}):null;
 v.querySelectorAll('.rv').forEach(x=>io?io.observe(x):x.classList.add('in'));
}
