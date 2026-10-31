async function admin(v){
 if(!me||me.role!='admin')return v.innerHTML='<div class="card">Таньд эрх алга</div>';
 const N=25;let q='',pg=0,t;
 const sr=(await sb.from('site').select('*').maybeSingle()).data||{};
 v.innerHTML=`<div class="dash"><h1 class="sec2" style="margin:12px 0">Админ</h1>
 <div class="cd"><h3>Сайтын удирдлага</h3><p class="mu" style="margin-bottom:12px">Одоо: ${sr.open?'сайт нээлттэй':'хүлээлгийн горим'} · бүртгэл ${sr.reg_open===false?'хаалттай':'нээлттэй'} · файл оруулалт ${sr.uploads_open===false?'хаалттай':'нээлттэй'}</p>
 <div class="act" style="justify-content:flex-start"><button id="op">Сайтыг нээх</button><button class="g" id="cl">Хүлээлгийн горим</button><button class="g" id="rc">Бүртгэл хаах</button><button class="g" id="ro">Бүртгэл нээх</button><button class="g" id="uc">Файл оруулалт хаах</button><button class="g" id="uo">Файл оруулалт нээх</button></div>
 <div class="fl" style="margin-top:16px"><label>Discord акаунтын доод нас (хоногоор)</label><div class="act" style="justify-content:flex-start"><input id="ma" type="number" min="0" max="365" style="width:110px;margin:0" value="${sr.min_age_days??7}"><button class="g" id="mab">Хадгалах</button></div></div>
 <div class="fl"><label>Өдөрт шинээр бүртгүүлэх дээд хязгаар</label><div class="act" style="justify-content:flex-start"><input id="dc" type="number" min="1" max="5000" style="width:110px;margin:0" value="${sr.daily_cap??300}"><button class="g" id="dcb">Хадгалах</button></div></div>
 <div class="fl"><label>Нэр нөөцлөх эсвэл чөлөөлөх</label><div class="act" style="justify-content:flex-start"><input id="ru" placeholder="нэр" style="width:150px;margin:0"><button id="rs">Нөөцлөх</button><button class="g" id="rr">Чөлөөлөх</button></div></div></div>
 <div class="cd" style="margin-top:14px"><h3>${ic('flag',20)}Мэдэгдлүүд</h3><div id="rps"></div></div>
 <div class="cd" style="margin-top:14px"><h3>Хэрэглэгчид</h3><input id="q" placeholder="Нэр эсвэл #дугаараар хайх" style="margin-top:10px"><div id="list"></div><div class="act"><button class="g" id="pv">Өмнөх</button><span class="mu" id="pgn"></span><button class="g" id="nx">Дараах</button></div></div></div>`;
 const Q=s=>v.querySelector(s);
 const loadList=async()=>{
  let r=sb.from('profiles').select('bid,username,display_name,role,banned,approved,views,likes').order('bid').range(pg*N,pg*N+N-1);
  const c=q.replace(/[^a-zA-Z0-9_ёөүа-яЁӨҮА-Я .-]/g,'');
  if(c){const n=c.replace('#','');r=/^\d+$/.test(n)?r.eq('bid',+n):r.or('username.ilike.%'+c+'%,display_name.ilike.%'+c+'%')}
  const{data}=await r;const L=data||[];
  Q('#list').innerHTML=L.map(p=>`<div class="row" style="flex-wrap:wrap"><b>#${p.bid}</b><span style="flex:1">${e(p.username||'—')} ${p.banned?'<span class="bad">ХААСАН</span>':''}${p.approved?'':'<span class="bd">ХҮЛЭЭЖ БУЙ</span>'} <small class="mu">${ic('eye',13)} ${p.views} ${ic('heart',13)} ${p.likes}</small></span>${p.approved?'':`<button data-a="approve" data-b="${p.bid}">Зөвшөөрөх</button>`}<button class="g" data-a="${p.banned?'unban':'ban'}" data-b="${p.bid}">${p.banned?'Нээх':'Хаах'}</button><button class="g" data-a="rename" data-b="${p.bid}">Нэр солих</button><button class="g" data-a="free" data-b="${p.bid}">Нэр чөлөөлөх</button><button class="g" data-a="badges" data-b="${p.bid}">Тэмдэг</button></div>`).join('')||'<p class="mu" style="margin:12px 0">Хэрэглэгч олдсонгүй.</p>';
  Q('#pgn').textContent='Хуудас '+(pg+1);Q('#pv').disabled=pg==0;Q('#nx').disabled=L.length<N;
 };
 const loadRep=async()=>{
  const{data}=await sb.from('reports').select('id,reason,created_at,profiles(username,bid)').eq('done',false).order('id',{ascending:false}).limit(20);
  Q('#rps').innerHTML=(data||[]).map(r=>`<div class="row" style="flex-wrap:wrap"><span style="flex:1"><b>${e(r.profiles?r.profiles.username||('#'+r.profiles.bid):'—')}</b> <small class="mu">${e(r.reason)}</small></span>${r.profiles&&r.profiles.username?`<a href="/${e(r.profiles.username)}" target="_blank"><button class="g">Үзэх</button></a>`:''}<button class="g" data-rd="${r.id}">Шийдсэн</button></div>`).join('')||'<p class="mu">Шинэ мэдэгдэл алга.</p>';
 };
 const act=async(a,t0,val)=>{const{data:d,error}=await sb.rpc('admin_act',{act:a,target:t0,val:val??''});toast(error?error.message:(ERR[d]||(d=='ok'?'Амжилттай':d)));if(!error){loadList();loadRep()}};
 Q('#list').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const a=b.dataset.a,t0=+b.dataset.b;
  if(a=='rename'){const x=prompt('Шинэ нэр');if(x)act(a,t0,x)}
  else if(a=='badges'){const x=prompt('Тэмдгүүдийг таслалаар тусгаарлан бичнэ үү (жишээ: verified,staff)');if(x!==null)act(a,t0,x)}
  else if(a=='ban'){const x=prompt('Хаасан шалтгаан');if(x!==null)act(a,t0,x)}
  else act(a,t0)};
 Q('#rps').onclick=ev=>{const b=ev.target.closest('[data-rd]');if(b)act('report_done',+b.dataset.rd)};
 Q('#q').oninput=ev=>{clearTimeout(t);t=setTimeout(()=>{q=ev.target.value.trim();pg=0;loadList()},300)};
 Q('#pv').onclick=()=>{if(pg>0){pg--;loadList()}};Q('#nx').onclick=()=>{pg++;loadList()};
 Q('#op').onclick=()=>confirm('Бүх хэрэглэгчийн хуудсыг нээх үү?')&&act('open',0,'');
 Q('#cl').onclick=()=>act('close',0,'');Q('#rc').onclick=()=>act('reg_close',0,'');Q('#ro').onclick=()=>act('reg_open',0,'');
 Q('#uc').onclick=()=>act('uploads_close',0,'');Q('#uo').onclick=()=>act('uploads_open',0,'');
 Q('#mab').onclick=()=>act('min_age',0,Q('#ma').value);Q('#dcb').onclick=()=>act('daily_cap',0,Q('#dc').value);
 Q('#rs').onclick=()=>Q('#ru').value&&act('reserve',0,Q('#ru').value);Q('#rr').onclick=()=>Q('#ru').value&&act('release',0,Q('#ru').value);
 loadList();loadRep();
}
