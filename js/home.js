async function home(v){
 let st=null;try{st=JSON.parse(sessionStorage.st||'null')}catch{}
 if(!st||Date.now()-st.t>6e4){st={...((await sb.rpc('site_stats')).data||{}),t:Date.now()};sessionStorage.st=JSON.stringify(st)}
 const open=!!st.open,closed=st.reg===false&&!me,hint='Зөвхөн англи жижиг үсэг, тоо, _ ашиглана.';
 const F=[['link','Бүх холбоос нэг дор','Instagram, YouTube, TikTok зэрэг холбоосоо нэг хуудсанд тавина.'],['image','Өөрийн дүр төрх','Өнгө, дэвсгэр зураг, видеогоо өөрөө сонгоно.'],['music','Дуу тавина','Хуудсыг нээхэд таны сонгосон дуу эгшиглэнэ.'],['badge','Тэмдэг авна','Идэвхтэй байх тусам тэмдэг (badge) авна.'],['eye','Хэн үзснийг мэднэ','Хуудсыг хэдэн хүн үзэж, хэдэн хүн таалагдсаныг харна.'],['sliders','Утсан дээр ч сайхан','Утас, компьютер аль алинд нь ойлгомжтой ажиллана.']];
 const STEP=[['Discord-оор нэвтэр','Нууц үг, имэйл хэрэггүй. Нэг товчоор орно.'],['Нэрээ ав','Жишээ нь biof.site/болд гэх мэт өөрийн хаягаа сонгоно.'],[open?'Хуудсаа чимээрэй':'Нээгдэхийг хүлээ',open?'Холбоос, зураг, дуугаа нэмээрэй.':'Сайт нээгдмэгц хуудсаа чимж эхэлнэ. Таны нэр таных хэвээр үлдэнэ.']];
 const Q=[['biof гэж юу вэ?','Өөрийн гэсэн нэг хуудас үүсгэдэг сайт. Хуудсан дээрээ холбоос, зураг, дуугаа тавиад хүмүүст нэг хаягаар явуулна.'],['Яаж нэвтрэх вэ?','Discord-оороо нэвтэрнэ. Шинэ нууц үг санах шаардлагагүй.'],['Хүлээлгийн жагсаалт гэж юу вэ?','Сайт одоохондоо нээгдээгүй байна. Одооноос нэрээ авч үлдээд, нээгдэх үед хуудсаа ашиглана.'],['Нэрээ солих боломжтой юу?','Боломжтой, гэхдээ 7 хоногт нэг л удаа.']];
 const W=['Холбоос','Дуу','Видео','Тэмдэг','Өнгө','Зураг','Discord'];
 const label=me?.username?(me.approved?'Миний хуудас':'Миний байдал'):'Нэрээ авах';
 v.innerHTML=`<section class="h2"><div class="h2l"><span class="pill">${closed?'Бүртгэл хаалттай':open?'Нээлттэй':'Удахгүй нээгдэнэ'}</span><h1>Өөрийн хуудсаа<br>үүсгээрэй</h1><p>Instagram, YouTube, Discord зэрэг бүх холбоосоо нэг хаяг дээр цуглуулна. Жишээ нь <b>biof.site/болд</b></p>
 ${closed?`<div class="closed">${ic('x',18)}<span>Одоогоор шинэ бүртгэл авахгүй байна. Бүртгэлтэй бол нэвтэрч болно.</span></div>`:''}<div class="claim"><span>biof.site/</span><input id="n"${closed?' disabled':''} maxlength="20" placeholder="таны нэр" autocomplete="off" autocapitalize="none" spellcheck="false"><button id="b"${closed?' disabled':''}>${label}</button></div><p class="st mu" id="s">${hint}</p>
 ${user?'':`<div class="or">эсвэл</div><button class="dc lg" type="button">${plat('discord',26)}${closed?'Бүртгэлтэй бол нэвтрэх':'Discord-оор нэвтрэх'}</button>`}
 <div class="meta"><span class="chip">${st.waiting??0} хүн хүлээж байна</span><span class="chip">${st.live??0} хуудас идэвхтэй</span><a class="tpl" href="/tutorial">Заавар унших ${ic('arrow',14)}</a></div></div>
 <a class="h2r" href="/a" aria-label="Жишээ хуудас"><div class="pv back"></div><div class="pv front"><span class="av">Б</span><div style="font-weight:800;font-size:20px;margin-top:8px">Болд</div><small class="mu">@bold · #12</small><div style="margin:10px 0"><span class="bd">${ic('badge',14)}Баталгаажсан</span></div>${['discord','instagram','youtube','github'].map(k=>`<span class="pl">${plat(k,30)}${PL[k][0]}</span>`).join('')}<small class="mu" style="display:block;margin-top:12px">Жишээ хуудас харах ${ic('arrow',14)}</small></div></a></section>
 <div class="mq"><div>${[...W,...W].map(x=>`<span>${x}</span>`).join('')}</div></div>
 <h2 class="sec2 rv">Яаж ажилладаг вэ?</h2><div class="w-narrow">${STEP.map((s,i)=>`<div class="stp rv"><em>${i+1}</em><div><b>${s[0]}</b><small>${s[1]}</small></div></div>`).join('')}</div>
 <h2 class="sec2 rv">Юу хийж болох вэ?</h2><div class="g3">${F.map(f=>`<div class="f2 rv"><span class="fi">${ic(f[0],24)}</span><b>${f[1]}</b><small>${f[2]}</small></div>`).join('')}</div>
 <h2 class="sec2 rv">Түгээмэл асуултууд</h2><div class="w-narrow">${Q.map(q=>`<details class="fq rv"><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join('')}</div>
 <div class="cta rv"><h2>Одоо нэрээ аваарай</h2><p class="mu" style="margin-bottom:18px">Таны нэрийг өөр хүн авчихаагүй байгаа үед шууд аваарай.</p><button id="cta"${closed?' disabled':''}>Нэрээ авах</button></div>`;
 let t;const n=v.querySelector('#n'),S=v.querySelector('#s');
 n.oninput=()=>{n.value=n.value.toLowerCase().replace(/[^a-z0-9_]/g,'');clearTimeout(t);
  t=setTimeout(async()=>{if(!n.value){S.className='st mu';S.textContent=hint;return}
   const{data}=await sb.rpc('username_status',{u:n.value});S.className='st '+(data=='available'?'okk':'bad2');
   S.innerHTML=data=='available'?ic('check',16)+' Энэ нэр сул байна':e(ERR[data]||'')},250)};
 n.onkeydown=ev=>{if(ev.key=='Enter')v.querySelector('#b').click()};
 v.querySelector('#b').onclick=async()=>{
  if(me?.username)return go(me.approved?'/'+me.username:'/settings');
  if(!n.value){n.focus();return}
  if(!user){localStorage.pending=n.value;return login()}
  const{data}=await sb.rpc('claim_username',{u:n.value});
  if(data!='ok'){S.className='st bad2';S.textContent=ERR[data]||String(data);return}
  await loadMe();go(me?.approved?'/'+n.value:'/settings')};
 v.querySelector('#cta').onclick=()=>{scrollTo({top:0,behavior:'smooth'});n.focus({preventScroll:true})};
 const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12}):null;
 v.querySelectorAll('.rv').forEach(x=>io?io.observe(x):x.classList.add('in'));
}
