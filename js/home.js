async function home(v){
 const cache=(k,ttl,f)=>{let c=null;try{c=JSON.parse(sessionStorage[k]||'null')}catch{}return c&&c.r!==undefined&&Date.now()-c.t<ttl?Promise.resolve(c.r):f().then(r=>{try{sessionStorage[k]=JSON.stringify({t:Date.now(),r})}catch{}return r})};
 const[st,top,ss]=await Promise.all([
  cache('st2',6e4,async()=>(await sb.rpc('site_stats')).data||{}),
  cache('top2',12e4,async()=>(await sb.from('profiles').select('bid,username,display_name,avatar_url,views').not('username','is',null).order('views',{ascending:false}).limit(8)).data||[]),
  getStatus().catch(()=>({d:null,ms:0}))]);
 const open=!!(st&&st.open),closed=!!st&&st.reg===false&&!me,hint='Зөвхөн англи жижиг үсэг, тоо, _ ашиглана (3-20 тэмдэгт).',top2=Array.isArray(top)?top:[];
 const F=[['link','Бүх холбоос нэг дор','Instagram, YouTube, TikTok зэрэг холбоосоо нэг хуудсанд тавина.'],['image','Өөрийн дүр төрх','Өнгө, дэвсгэр зураг, видеогоо өөрөө сонгоно.'],['music','Дуу тавина','Хуудсыг нээхэд таны сонгосон дуу эгшиглэнэ.'],['badge','Тэмдэг авна','Идэвхтэй байх тусам тэмдэг (badge) авна.'],['eye','Хэн үзснийг мэднэ','Хуудсыг хэдэн хүн үзэж, хэдэн хүн таалагдсаныг харна.'],['sliders','Утсан дээр ч сайхан','Утас, компьютер аль алинд нь ойлгомжтой ажиллана.']];
 const STEP=[['Discord-оор нэвтэр','Нууц үг, имэйл хэрэггүй. Нэг товчоор орно.'],['Нэрээ ав','Жишээ нь biof.site/bold гэх мэт өөрийн хаягаа сонгоно.'],[open?'Хуудсаа чимээрэй':'Нээгдэхийг хүлээ',open?'Холбоос, зураг, дуугаа нэмээрэй. Хажууд нь урьдчилан харах хэсэг байгаа.':'Сайт нээгдмэгц хуудсаа чимж эхэлнэ. Таны нэр таных хэвээр үлдэнэ.']];
 const Q=[['biof гэж юу вэ?','biof нь Bio Flex гэсэн утгатай. Өөрийн гэсэн нэг хуудас үүсгэдэг сайт. Хуудсан дээрээ холбоос, зураг, дуугаа тавиад хүмүүст нэг хаягаар явуулна.'],['Яаж нэвтрэх вэ?','Discord-оороо нэвтэрнэ. Шинэ нууц үг санах шаардлагагүй.'],['Нэрээ солих боломжтой юу?','Боломжтой, гэхдээ 7 хоногт нэг л удаа.'],['Яагаад миний Discord акаунтыг хүлээж авахгүй байна вэ?','Спам, ботоос хамгаалахын тулд маш шинэхэн (7 хоногоос бага настай) Discord акаунтыг түр хүлээж авдаггүй.']];
 const W=['Холбоос','Дуу','Видео','Тэмдэг','Өнгө','Зураг','Discord'];
 const label=me?.username?(me.approved?'Миний хуудас':'Хүлээлгийн төлөв'):'Нэрээ авах';
 v.innerHTML=`<section class="h2"><div class="h2l"><span class="pill">${closed?'Бүртгэл хаалттай':open?'Нээлттэй':'Удахгүй нээгдэнэ'}</span><h1>Өөрийн хуудсаа<br>үүсгээрэй</h1><p>Instagram, YouTube, Discord зэрэг бүх холбоосоо нэг хаяг дээр цуглуулна. Жишээ нь <b>biof.site/bold</b></p>
 ${closed?`<div class="closed">${ic('x',18)}<span>Одоогоор шинэ бүртгэл авахгүй байна. Бүртгэлтэй бол нэвтэрч болно.</span></div>`:''}<div class="claim"><span>biof.site/</span><input id="n" maxlength="20" placeholder="таны нэр" autocomplete="off" autocapitalize="none" spellcheck="false"${closed?' disabled':''}><button id="b"${closed?' disabled':''}>${label}</button></div><p class="st mu" id="s">${hint}</p>
 ${user?'':`<div class="or">эсвэл</div><button class="dc lg" type="button">${plat('discord',26)}${closed?'Бүртгэлтэй бол нэвтрэх':'Discord-оор нэвтрэх'}</button>`}
 <div class="meta"><span class="chip"><b class="cnt" data-n="${(st&&st.waiting)||0}">0</b> хүн хүлээж байна</span><span class="chip"><b class="cnt" data-n="${(st&&st.live)||0}">0</b> хуудас идэвхтэй</span><a class="tpl" href="/tutorial">Заавар унших ${ic('arrow',14)}</a></div></div>
 <a class="h2r" href="/a" aria-label="Жишээ хуудас"><div class="pv back"></div><div class="pv front"><span class="av" id="hav">B</span><div style="font-weight:800;font-size:20px;margin-top:8px" id="hnm">Bold</div><small class="mu" id="hn">@bold · #12</small><div style="margin:10px 0"><span class="bd">${ic('badge',14)}Баталгаажсан</span></div>${['facebook','instagram','youtube','discord'].map(k=>`<span class="pl">${plat(k,30)}${PL[k][0]}</span>`).join('')}<small class="mu" style="display:block;margin-top:12px">Жишээ хуудас харах ${ic('arrow',14)}</small></div></a></section>
 <div class="stbar rv" id="stb"><a class="live" href="/status"><i></i>Шууд</a><div class="sg"><div><b data-s="total">–</b><span>Нийт бүртгэл</span></div><div><b data-s="blocked">–</b><span>Хаасан сэжигтэй хүсэлт</span></div><div><b data-s="live">–</b><span>Идэвхтэй хуудас</span></div><div><b data-s="ms">–</b><span>Хариу өгөх хугацаа (мс)</span></div></div></div>
 <div class="mq"><div>${[...W,...W].map(x=>`<span>${x}</span>`).join('')}</div></div>
 <h2 class="sec2 rv">Яаж ажилладаг вэ?</h2><div class="w-narrow">${STEP.map((s,i)=>`<div class="stp rv"><em>${i+1}</em><div><b>${s[0]}</b><small>${s[1]}</small></div></div>`).join('')}</div>
 <h2 class="sec2 rv">Юу хийж болох вэ?</h2><div class="g3">${F.map(f=>`<div class="f2 rv"><span class="fi">${ic(f[0],24)}</span><b>${f[1]}</b><small>${f[2]}</small></div>`).join('')}</div>
 ${top2.length>=3?`<h2 class="sec2 rv">Шилдэг хуудсууд</h2><div class="tops rv">${top2.map(p=>`<a href="/${e(p.username)}">${av(p)}<span>${e(p.display_name||p.username)}</span><small class="mu">${ic('eye',12)} ${p.views}</small></a>`).join('')}</div>`:''}
 <h2 class="sec2 rv">Түгээмэл асуултууд</h2><div class="w-narrow">${Q.map((q,i)=>`<div class="fq rv"><button class="fqh" type="button" aria-expanded="false"><span>${q[0]}</span><i class="fqi">${ic('plus',18)}</i></button><div class="fqb"><div><p>${q[1]}</p></div></div></div>`).join('')}</div>
 <div class="w-narrow" style="margin-top:34px">${supportHTML()}</div>
 <div class="cta rv"><h2>Одоо нэрээ аваарай</h2><p class="mu" style="margin-bottom:18px">Таны нэрийг өөр хүн авчихаагүй байгаа үед шууд аваарай.</p><button id="cta"${closed?' disabled':''}>Нэрээ авах</button></div>`;
 let t;const n=v.querySelector('#n'),S=v.querySelector('#s');
 n.oninput=()=>{n.value=n.value.toLowerCase().replace(/[^a-z0-9_]/g,'');clearTimeout(t);
  const x=n.value,a=v.querySelector('#hav'),b=v.querySelector('#hnm'),c=v.querySelector('#hn');
  if(a)a.textContent=(x||'b')[0].toUpperCase();if(b)b.textContent=x?x[0].toUpperCase()+x.slice(1):'Bold';if(c)c.textContent='@'+(x||'bold')+' · #12';
  t=setTimeout(async()=>{if(!n.value){S.className='st mu';S.textContent=hint;return}
   const{data}=await sb.rpc('username_status',{u:n.value});S.className='st '+(data=='available'?'okk':'bad2');
   S.innerHTML=data=='available'?ic('check',16)+' Энэ нэр сул байна':e(ERR[data]||'')},300)};
 n.onkeydown=ev=>{if(ev.key=='Enter')v.querySelector('#b').click()};
 v.querySelector('#b').onclick=async()=>{
  if(me?.username)return go(me.approved?'/'+me.username:'/settings');
  if(!n.value){n.focus();return}
  if(!user){localStorage.pending=n.value;return login()}
  const{data}=await sb.rpc('claim_username',{u:n.value});
  if(data!='ok'){S.className='st bad2';S.textContent=ERR[data]||String(data);return}
  await loadMe();go(me?.approved?'/'+n.value:'/settings')};
 v.querySelector('#cta').onclick=()=>{scrollTo({top:0,behavior:'smooth'});n.focus({preventScroll:true})};
 v.querySelectorAll('.fqh').forEach(b=>b.onclick=()=>{const f=b.parentNode,o=f.classList.toggle('open');b.setAttribute('aria-expanded',o)});
 const num=(el,to)=>{const t0=performance.now();const f=tt=>{const p=Math.min(1,(tt-t0)/900);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 v.querySelectorAll('.cnt').forEach(el=>num(el,+el.dataset.n||0));
 const paint=(s,ms,first)=>{const d=s||{};[['total',d.total],['blocked',d.blocked],['live',d.live],['ms',ms]].forEach(x=>{const el=v.querySelector('[data-s="'+x[0]+'"]');if(!el)return;if(x[1]==null){el.textContent='–';return}first?num(el,+x[1]):el.textContent=x[1]})};
 paint(ss.d,ss.ms,true);
 window.PI=setInterval(async()=>{if(document.hidden)return;try{const r=await getStatus();if(r.d)paint(r.d,r.ms,false)}catch{}},20000);
 const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12}):null;
 v.querySelectorAll('.rv').forEach(x=>io?io.observe(x):x.classList.add('in'));
}
