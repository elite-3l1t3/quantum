async function home(v){
 const cache=(k,ttl,f)=>{let c=null;try{c=JSON.parse(sessionStorage[k]||'null')}catch{}return c&&c.r!==undefined&&Date.now()-c.t<ttl?Promise.resolve(c.r):f().then(r=>{try{sessionStorage[k]=JSON.stringify({t:Date.now(),r})}catch{}return r})};
 const[st,top,ss]=await Promise.all([
  cache('st2',6e4,async()=>(await sb.rpc('site_stats')).data||{}),
  lbFetch('week',10).then(r=>r&&r.length?['week',r]:lbFetch('views',10).then(x=>['views',x||[]])).catch(()=>['views',[]]),
  getStatus().catch(()=>({d:null,ms:0}))]);
 const closed=!!st&&st.reg===false&&!me,hint='Зөвхөн англи жижиг үсэг, тоо, _ ашиглана (3-20 тэмдэгт).';
 const F=[['link','Бүх холбоос нэг дор','Instagram, YouTube, TikTok-оо нэг хуудсанд цуглуулна.'],['image','Өөрийн загвар','Өнгө, зураг, видеог өөрөө сонгож хуудсаа чимнэ.'],['music','Дуу тавих','Хүн таны хуудсыг нээхэд таны сонгосон дуу тоглоно.'],['badge','Тэмдэг цуглуулах','Идэвхтэй байх тусам шинэ тэмдэг авна.'],['eye','Статистик','Хуудсыг тань хэдэн хүн үзэж, like дарсныг харна.'],['sliders','Утсанд тохиромжтой','Утас, компьютер аль алин дээр сайхан харагдана.']];
 const STEP=[['Нэвтрэх','Discord эсвэл имэйлээр орно. Имэйл сонговол код ирнэ — нууц үг хэрэггүй.'],['Хаягаа сонгох','Жишээ нь biof.site/bold гэх мэт өөрийн хаягийг авна.'],['Хуудсаа чимэх','Холбоос, зураг, дуугаа нэмнэ. Өөрчлөлт бүр хажууд шууд харагдана.']];
 const Q=[['biof гэж юу вэ?','biof нь Bio Flex гэсэн утгатай. Өөрийн гэсэн нэг хуудас үүсгэдэг сайт. Хуудсан дээрээ холбоос, зураг, дуугаа тавиад хүмүүст нэг хаягаар явуулна.'],['Яаж нэвтрэх вэ?','Discord-оороо эсвэл имэйлээрээ нэвтэрнэ. Имэйл сонговол таны хаяг руу 6 оронтой код очно. Нууц үг санах шаардлагагүй.'],['Нэрээ солих боломжтой юу?','Боломжтой, гэхдээ 7 хоногт нэг л удаа.'],['Шинэ Discord акаунтаар бүртгүүлж болох уу?','Болно. Акаунт хэр удаан болсон нь хамаагүй.'],['Хуудсыг минь буруу хориглосон бол?','Нэвтэрмэгц "Давж заалдах" хэсэг гарч ирнэ. Тэнд юу болсныг бичээд илгээвэл админ шалгана.']];
 const W=['Холбоос','Дуу','Видео','Тэмдэг','Өнгө','Зураг','Discord'];
 const label=me?.username?'Миний хуудас':'Нэрээ авах';
 v.innerHTML=`<section class="h2"><div class="h2l">${closed?'<span class="pill">Бүртгэл түр хаалттай</span>':''}<h1>Өөрийн хуудсаа<br>үүсгээрэй</h1><p>Instagram, YouTube, Discord зэрэг бүх холбоосоо нэг хаяг дээр цуглуулна. Жишээ нь <b>biof.site/bold</b></p>
 ${closed?`<div class="closed">${ic('x',18)}<span>Одоогоор шинэ бүртгэл авахгүй байна. Бүртгэлтэй бол нэвтэрч болно.</span></div>`:''}<div class="claim"><span>biof.site/</span><input id="n" maxlength="20" placeholder="таны нэр" autocomplete="off" autocapitalize="none" spellcheck="false"${closed?' disabled':''}><button id="b"${closed?' disabled':''}>${label}</button></div><p class="st mu" id="s">${hint}</p>
 ${user?'':`<div class="or">эсвэл</div><button class="dc lg" data-mode="signup" type="button">${ic('user',22)}${closed?'Бүртгэлтэй бол нэвтрэх':'Нэвтрэх / Бүртгүүлэх'}</button>`}
 <div class="meta"><span class="chip"><b class="cnt" data-n="${(st&&st.live)||0}">0</b> хуудас идэвхтэй</span><span class="chip"><b class="cnt" data-n="${(ss.d&&ss.d.today)||0}">0</b> өнөөдөр шинэ</span><a class="tpl" href="/tutorial">Заавар унших ${ic('arrow',14)}</a></div></div>
 <a class="h2r" href="/a" aria-label="Жишээ хуудас"><div class="pv back"></div><div class="pv front"><span class="av" id="hav">B</span><div style="font-weight:800;font-size:20px;margin-top:8px" id="hnm">Bold</div><small class="mu" id="hn">@bold · #12</small><div style="margin:10px 0"><span class="bd">${ic('badge',14)}Баталгаажсан</span></div>${['facebook','instagram','youtube','discord'].map(k=>`<span class="pl">${plat(k,30)}${PL[k][0]}</span>`).join('')}<small class="mu" style="display:block;margin-top:12px">Жишээ хуудас харах ${ic('arrow',14)}</small></div></a></section>
 <div class="mq"><div>${[...W,...W].map(x=>`<span>${x}</span>`).join('')}</div></div>
 <h2 class="sec2 rv">Яаж ажилладаг вэ?</h2><div class="w-narrow">${STEP.map((s,i)=>`<div class="stp rv"><em>${i+1}</em><div><b>${s[0]}</b><small>${s[1]}</small></div></div>`).join('')}</div>
 <h2 class="sec2 rv">Юу хийж болох вэ?</h2><div class="g3">${F.map(f=>`<div class="f2 rv"><span class="fi">${ic(f[0],24)}</span><b>${f[1]}</b><small>${f[2]}</small></div>`).join('')}</div>
 <h2 class="sec2 rv">Тэргүүлэгчид</h2><div class="cd rv lbh" id="lbx"></div>
 <h2 class="sec2 rv">Түгээмэл асуултууд</h2><div class="w-narrow">${Q.map((q,i)=>`<div class="fq rv"><button class="fqh" type="button" aria-expanded="false"><span>${q[0]}</span><i class="fqi">${ic('plus',18)}</i></button><div class="fqb"><div><p>${q[1]}</p></div></div></div>`).join('')}</div>
 <div class="w-narrow" style="margin-top:34px">${supportHTML()}</div>
 <div class="cta rv"><h2>Одоо нэрээ аваарай</h2><p class="mu" style="margin-bottom:18px">Таны нэрийг өөр хүн авчихаагүй байгаа үед шууд аваарай.</p><button id="cta"${closed?' disabled':''}>Нэрээ авах</button></div>`;
 showNotice(v);
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
  if(!cool('claim',2000))return;
  if(!user){localStorage.pending=n.value;return login('signup',n.value)}
  const{data}=await sb.rpc('claim_username',{u:n.value});
  if(data!='ok'){S.className='st bad2';S.textContent=ERR[data]||String(data);return}
  await loadMe();go(me?.approved?'/'+n.value:'/settings')};
 v.querySelector('#cta').onclick=()=>{scrollTo({top:0,behavior:'smooth'});n.focus({preventScroll:true})};
 const drawLb=(by,rows)=>{const x=v.querySelector('#lbx');if(!x)return;x.innerHTML=`${lbTabsHTML(by)}${lbRowsHTML(rows,by)}<div class="act"><a href="/leaderboard"><button class="g" type="button">Бүгдийг харах ${ic('arrow',14)}</button></a></div>`;x.querySelectorAll('[data-by]').forEach(b=>b.onclick=async()=>drawLb(b.dataset.by,(await lbFetch(b.dataset.by,10))||[]))};
 drawLb(top[0],top[1]);
 v.querySelectorAll('.fqh').forEach(b=>b.onclick=()=>{const f=b.parentNode,o=f.classList.toggle('open');b.setAttribute('aria-expanded',o)});
 const num=(el,to)=>{const t0=performance.now();const f=tt=>{const p=Math.min(1,(tt-t0)/900);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
 v.querySelectorAll('.cnt').forEach(el=>num(el,+el.dataset.n||0));
 const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12}):null;
 v.querySelectorAll('.rv').forEach(x=>io?io.observe(x):x.classList.add('in'));
 /* /#support гэх мэт хэсэг рүү (өөр хуудаснаас ирсэн ч) зөөлөн гүйлгэнэ */
 const toHash=()=>{const h=decodeURIComponent(location.hash.slice(1));if(!/^[a-z0-9_-]{2,30}$/i.test(h))return;const el=document.getElementById(h);if(!el)return;el.classList.add('in');requestAnimationFrame(()=>el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'center'}));el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')};
 toHash();addEventListener('hashchange',toHash,{signal:window.RC?window.RC.signal:undefined});
}
