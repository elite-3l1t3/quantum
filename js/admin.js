async function purgeFiles(uid){
 try{const b=sb.storage.from('media'),{data}=await b.list(uid,{limit:100});if(data&&data.length)await b.remove(data.map(f=>uid+'/'+f.name))}catch(x){console.warn('purge',x)}
}
async function admin(v){
 if(!me||me.role!='admin')return v.innerHTML='<div class="card">Таньд эрх алга</div>';
 const N=25;let q='',pg=0,t,rows={};const sel=new Set();
 const[sr0,ss]=await Promise.all([sb.from('site').select('*').maybeSingle(),getStatus().catch(()=>({d:null}))]);
 const sr=sr0.data||{},d=ss.d||{};
 const TB=[['o','Тойм','chart'],['u','Хэрэглэгчид','user'],['g','Тэмдэг олгох','badge'],['r','Мэдэгдлүүд','flag'],['s','Аюулгүй байдал','shield']];
 const stat=(n,l)=>`<div><b>${n??'–'}</b><span>${l}</span></div>`;
 v.innerHTML=`<div class="dash"><h1 class="sec2" style="margin:12px 0">Админ самбар</h1><div class="tabs2">${TB.map((x,i)=>`<button type="button" class="${i?'':'on'}" data-t="${x[0]}">${ic(x[2],18)}<span>${x[1]}</span></button>`).join('')}</div>
 <section data-s="o"><div class="cd"><div class="stg">${stat(d.total,'Нийт бүртгэл')}${stat(d.today,'Өнөөдөр шинэ бүртгэл')}${stat(d.live,'Идэвхтэй хуудас')}${stat(d.banned,'Хаасан хэрэглэгч')}</div><div class="stg" style="margin-top:10px">${stat(d.blocked,'Хаасан сэжигтэй хүсэлт')}${stat(sr.reg_open===false?'Хаалттай':'Нээлттэй','Бүртгэл')}${stat(sr.uploads_open===false?'Хаалттай':'Нээлттэй','Файл оруулалт')}${stat(sr.min_age_days??7,'Доод нас (хоног)')}</div></div>
 <div class="cd" style="margin-top:14px"><h3>Сайтын удирдлага</h3><div class="act" style="justify-content:flex-start;margin-top:10px"><button class="g" id="rc">Бүртгэл хаах</button><button id="ro">Бүртгэл нээх</button><button class="g" id="uc">Файл оруулалт хаах</button><button id="uo">Файл оруулалт нээх</button></div></div></section>
 <section data-s="u" hidden><div class="cd"><input id="q" placeholder="Нэр эсвэл bid-ээр хайх"><div id="list"></div><div class="act"><button class="g" id="pv">Өмнөх</button><span class="mu" id="pgn"></span><button class="g" id="nx">Дараах</button></div></div>
 <div class="cd bulk" id="bk" style="margin-top:14px" hidden><b id="bkn"></b><div class="act" style="justify-content:flex-start;margin-top:8px"><input id="bkb" placeholder="Тэмдгийн нэр (жишээ: verified)" style="flex:1;min-width:160px;margin:0"><button id="bka">Олгох</button><button class="g" id="bkr">Авах</button></div></div></section>
 <section data-s="g" hidden><div class="cd"><h3>${ic('badge',20)}bid-ийн мужид олгох</h3><p class="mu" style="margin:6px 0 12px">Жишээ нь анхны 100 хэрэглэгчид "og" тэмдэг олгох: 1-ээс 100 хүртэл.</p><div class="act" style="justify-content:flex-start"><input id="rf" type="number" min="1" placeholder="Эхлэх bid" style="width:130px;margin:0"><input id="rt" type="number" min="1" placeholder="Дуусах bid" style="width:130px;margin:0"><input id="rb" placeholder="Тэмдэг" style="width:150px;margin:0"></div><div class="act" style="justify-content:flex-start;margin-top:10px"><button id="rga">Олгох</button><button class="g" id="rgr">Авах</button></div></div></section>
 <section data-s="r" hidden><div class="cd"><div id="rps"></div></div></section>
 <section data-s="s" hidden><div class="cd"><div class="fl"><label>Discord акаунтын доод нас (хоногоор)</label><div class="act" style="justify-content:flex-start"><input id="ma" type="number" min="0" max="365" style="width:110px;margin:0" value="${sr.min_age_days??7}"><button class="g" id="mab">Хадгалах</button></div></div>
 <div class="fl"><label>Өдөрт шинээр бүртгүүлэх дээд хязгаар</label><div class="act" style="justify-content:flex-start"><input id="dc" type="number" min="1" max="5000" style="width:110px;margin:0" value="${sr.daily_cap??300}"><button class="g" id="dcb">Хадгалах</button></div></div>
 <div class="fl"><label>Нэр нөөцлөх эсвэл чөлөөлөх</label><div class="act" style="justify-content:flex-start"><input id="ru" placeholder="нэр" style="width:150px;margin:0"><button id="rs">Нөөцлөх</button><button class="g" id="rr">Чөлөөлөх</button></div></div></div></section></div>`;
 const Q=s=>v.querySelector(s);
 const tbs=[...v.querySelectorAll('.tabs2 button')];
 tbs.forEach(b=>b.onclick=()=>{tbs.forEach(x=>x.classList.toggle('on',x==b));v.querySelectorAll('section[data-s]').forEach(x=>x.hidden=x.dataset.s!=b.dataset.t)});
 const bulkUi=()=>{Q('#bk').hidden=!sel.size;Q('#bkn').textContent=sel.size+' хэрэглэгч сонгосон'};
 const loadList=async()=>{
  let r=sb.from('profiles').select('id,bid,username,display_name,role,banned,views,likes,badges').order('bid').range(pg*N,pg*N+N-1);
  const c=q.replace(/[^a-zA-Z0-9_ёөүа-яЁӨҮА-Я .-]/g,'');
  if(c){const n=c.replace('#','');r=/^\d+$/.test(n)?r.eq('bid',+n):r.or('username.ilike.%'+c+'%,display_name.ilike.%'+c+'%')}
  const{data}=await r;const L=data||[];rows={};L.forEach(p=>rows[p.bid]=p);
  Q('#list').innerHTML=L.map(p=>`<div class="row" style="flex-wrap:wrap"><label class="chk"><input type="checkbox" data-sel="${p.bid}" ${sel.has(p.bid)?'checked':''}><i></i></label><b>#${p.bid}</b><span style="flex:1">${e(p.username||'—')} ${p.banned?'<span class="bad">Хориглосон</span>':''} <small class="mu">${ic('eye',13)} ${p.views} ${ic('heart',13)} ${p.likes}${(p.badges||[]).length?' · '+e((p.badges||[]).join(', ')):''}</small></span><button class="g" data-a="${p.banned?'unban':'ban'}" data-b="${p.bid}">${p.banned?'Нээх':'Хориглох'}</button><button class="g" data-a="rename" data-b="${p.bid}">Нэр солих</button><button class="g" data-a="free" data-b="${p.bid}">Нэр чөлөөлөх</button><button class="g" data-a="badges" data-b="${p.bid}">Тэмдэг</button></div>`).join('')||'<p class="mu" style="margin:12px 0">Хэрэглэгч олдсонгүй.</p>';
  Q('#pgn').textContent='Хуудас '+(pg+1);Q('#pv').disabled=pg==0;Q('#nx').disabled=L.length<N;
 };
 const loadRep=async()=>{
  const{data}=await sb.from('reports').select('id,reason,created_at,profiles(username,bid)').eq('done',false).order('id',{ascending:false}).limit(20);
  Q('#rps').innerHTML=(data||[]).map(r=>`<div class="row" style="flex-wrap:wrap"><span style="flex:1"><b>${e(r.profiles?r.profiles.username||('#'+r.profiles.bid):'—')}</b> <small class="mu">${e(r.reason)}</small></span>${r.profiles&&r.profiles.username?`<a href="/${e(r.profiles.username)}" target="_blank"><button class="g">Үзэх</button></a>`:''}<button class="g" data-rd="${r.id}">Шийдсэн</button></div>`).join('')||'<p class="mu">Шинэ мэдэгдэл алга.</p>';
 };
 const act=async(a,t0,val)=>{
  const{data:r,error}=await sb.rpc('admin_act',{act:a,target:t0,val:val??''});
  toast(error?error.message:(ERR[r]||(r=='ok'?'Амжилттай':r)));
  if(!error&&r=='ok'){loadList();loadRep()}
  return!error&&r=='ok';
 };
 const bulk=async(rm)=>{
  const b=Q('#bkb').value.trim();if(!b||!sel.size)return toast('Тэмдгийн нэр бичиж, хэрэглэгч сонгоно уу');
  const{data,error}=await sb.rpc('admin_badge_bulk',{p_bids:[...sel],p_badge:b,p_remove:rm});
  toast(error?error.message:(rm?'Авлаа: ':'Олголоо: ')+data+' хэрэглэгч');if(!error)loadList();
 };
 const range=async(rm)=>{
  const f=+Q('#rf').value,tt=+Q('#rt').value,b=Q('#rb').value.trim();if(!f||!tt||!b)return toast('Бүх талбарыг бөглөнө үү');
  const{data,error}=await sb.rpc('admin_badge_range',{p_from:f,p_to:tt,p_badge:b,p_remove:rm});
  toast(error?error.message:(rm?'Авлаа: ':'Олголоо: ')+data+' хэрэглэгч');
 };
 Q('#list').onchange=ev=>{const c=ev.target.closest('[data-sel]');if(!c)return;const n=+c.dataset.sel;c.checked?sel.add(n):sel.delete(n);bulkUi()};
 Q('#list').onclick=async ev=>{const b=ev.target.closest('button');if(!b)return;const a=b.dataset.a,t0=+b.dataset.b;
  if(a=='rename'){const x=await dlg({icon:'user',title:'Шинэ нэр',input:{placeholder:'нэр'},ok:'Солих'});if(x)act(a,t0,x)}
  else if(a=='badges'){const x=await dlg({icon:'badge',title:'Тэмдэг олгох',body:'Тэмдгүүдийг таслалаар тусгаарлан бичнэ үү (жишээ: verified,staff)',input:{placeholder:'verified,staff'},ok:'Хадгалах'});if(x!==null)act(a,t0,x)}
  else if(a=='ban'){
   const x=await dlg({icon:'shield',danger:true,title:'Хэрэглэгчийг хориглох',body:'Нэрнээс бусад бүх мэдээлэл (зураг, дуу, видео, холбоос, үзэлт, like) бүр мөсөн устна. Буцаах боломжгүй.',input:{placeholder:'Шалтгаан (заавал биш)'},ok:'Хориглох'});
   if(x===null)return;
   const p=rows[t0];if(await act('ban',t0,x||'Дүрэм зөрчсөн')&&p)await purgeFiles(p.id);
  }
  else if(a)act(a,t0)};
 Q('#rps').onclick=ev=>{const b=ev.target.closest('[data-rd]');if(b)act('report_done',+b.dataset.rd)};
 Q('#q').oninput=ev=>{clearTimeout(t);t=setTimeout(()=>{q=ev.target.value.trim();pg=0;loadList()},300)};
 Q('#pv').onclick=()=>{if(pg>0){pg--;loadList()}};Q('#nx').onclick=()=>{pg++;loadList()};
 Q('#bka').onclick=()=>bulk(false);Q('#bkr').onclick=()=>bulk(true);Q('#rga').onclick=()=>range(false);Q('#rgr').onclick=()=>range(true);
 Q('#rc').onclick=()=>act('reg_close',0,'');Q('#ro').onclick=()=>act('reg_open',0,'');
 Q('#uc').onclick=()=>act('uploads_close',0,'');Q('#uo').onclick=()=>act('uploads_open',0,'');
 Q('#mab').onclick=()=>act('min_age',0,Q('#ma').value);Q('#dcb').onclick=()=>act('daily_cap',0,Q('#dc').value);
 Q('#rs').onclick=()=>Q('#ru').value&&act('reserve',0,Q('#ru').value);Q('#rr').onclick=()=>Q('#ru').value&&act('release',0,Q('#ru').value);
 loadList();loadRep();
}
