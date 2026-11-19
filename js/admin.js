async function purgeFiles(uid){
 try{const b=sb.storage.from('media'),{data}=await b.list(uid,{limit:100});if(data&&data.length)await b.remove(data.map(f=>uid+'/'+f.name))}catch(x){console.warn('purge',x)}
}
/* Тэмдэг сонгогч: бэлэн товчнууд дээр дарж олныг нь зэрэг сонгоно. Өөр нэртэй тэмдэг ч нэмж болно. */
const BINFO=k=>{const b=BADGES.find(x=>x[0]==k);return b?[b[1],b[4]]:[k,'star']};
function bpHTML(cur){
 const all=[...new Set([...MANUAL,...(cur||[]).map(x=>String(x).toLowerCase())])];
 return`<div class="bpk">${all.map(k=>{const[l,i]=BINFO(k);return`<button type="button" class="bpi${(cur||[]).some(x=>String(x).toLowerCase()==k)?' on':''}" data-bk="${e(k)}">${ic(i,15)}<span>${e(l)}</span></button>`}).join('')}<span class="bpa"><input class="bpn" maxlength="24" placeholder="Өөр тэмдэг…" autocomplete="off"><button type="button" class="g bpp" aria-label="Нэмэх">${ic('plus',15)}</button></span></div>`;
}
function bpWire(root){
 root.addEventListener('click',ev=>{
  const b=ev.target.closest('.bpi');if(b){b.classList.toggle('on');return}
  const p=ev.target.closest('.bpp');if(p){const box=p.closest('.bpk'),i=box.querySelector('.bpn'),k=i.value.trim().toLowerCase().replace(/[^a-z0-9_\-ёөүа-я]/g,'').slice(0,24);if(!k)return;
   if(!box.querySelector('.bpi[data-bk="'+k+'"]'))box.querySelector('.bpa').insertAdjacentHTML('beforebegin',`<button type="button" class="bpi on" data-bk="${e(k)}">${ic('star',15)}<span>${e(k)}</span></button>`);else box.querySelector('.bpi[data-bk="'+k+'"]').classList.add('on');i.value=''}});
 root.addEventListener('keydown',ev=>{if(ev.key=='Enter'&&ev.target.classList.contains('bpn')){ev.preventDefault();ev.stopPropagation();ev.target.nextElementSibling.click()}});
}
const bpGet=root=>[...root.querySelectorAll('.bpi.on')].map(b=>b.dataset.bk);
async function admin(v){
 if(!me||!['admin','moderator'].includes(me.role))return v.innerHTML='<div class="card">Таньд эрх алга</div>';
 const isA=me.role=='admin';
 const N=25;let q='',pg=0,t,rows={};const sel=new Set();
 const[sr0,ss]=await Promise.all([sb.from('site').select('*').maybeSingle(),getStatus().catch(()=>({d:null}))]);
 const sr=sr0.data||{},d=ss.d||{};
 const TB=[['o','Тойм','chart',1],['u','Хэрэглэгчид','user',1],['g','Тэмдэг олгох','badge',1],['r','Мэдэгдлүүд','flag',0],['p','Давж заалдах','shield',0],['v','Баталгаажуулалт','badge',0],['l',isA?'Үйлдлийн түүх':'Миний үйлдлүүд','pulse',0],['s','Аюулгүй байдал','lock',1]].filter(x=>isA||!x[3]);
 const stat=(n,l)=>`<div><b>${n??'–'}</b><span>${l}</span></div>`;
 v.innerHTML=`<div class="dash"><h1 class="sec2" style="margin:12px 0">${isA?'Админ самбар':'Модератор самбар'}</h1>${isA?'':`<div class="tip">${ic('shield',18)}<span>Модератор: мэдэгдэл, давж заалдах, баталгаажуулалтыг шийднэ. Таны хориг өгөгдлийг устгахгүй (түр хорих) бөгөөд бүх үйлдэл админд харагдана. Өдөрт 15 хориг хүртэл.</span></div>`}<div class="tabs2">${TB.map((x,i)=>`<button type="button" class="${i?'':'on'}" data-t="${x[0]}">${ic(x[2],18)}<span>${x[1]}</span><em class="cn" data-cn="${x[0]}"></em></button>`).join('')}</div>
 <section data-s="o"><div class="cd"><div class="stg">${stat(d.total,'Нийт бүртгэл')}${stat(d.today,'Өнөөдөр шинэ бүртгэл')}${stat(d.live,'Идэвхтэй хуудас')}${stat(d.banned,'Хаасан хэрэглэгч')}</div><div class="stg" style="margin-top:10px">${stat(d.blocked,'Хаасан сэжигтэй хүсэлт')}${stat(sr.reg_open===false?'Түр хаалттай':'Хэвийн','Бүртгэл')}${stat(sr.uploads_open===false?'Түр хаалттай':'Хэвийн','Файл оруулалт')}${stat(sr.daily_cap??300,'Өдрийн дээд бүртгэл')}</div></div>
 <div class="cd" style="margin-top:14px" id="usgw" data-only="o"><h3>${ic('chart',20)}Supabase үнэгүй эрхийн хэрэглээ</h3><div class="usg" id="usg"><p class="mu">Ачаалж байна…</p></div></div><div class="cd" style="margin-top:14px"><h3>${ic('bolt',20)}Сайтын мэдэгдэл</h3><p class="mu" style="margin:6px 0 8px">Нүүр хуудас болон самбарын дээд талд бүх хүнд харагдана (300 тэмдэгт). Хоосон хадгалбал арилна.</p><textarea id="ntx" rows="2" maxlength="300" placeholder="Жишээ: Маргааш 10:00-д засвар хийнэ."></textarea><div class="act" style="justify-content:flex-start"><button id="nts">Хадгалах</button><button class="g" id="ntc">Арилгах</button></div></div></section>
 <section data-s="u" hidden><div class="cd"><input id="q" placeholder="Нэр эсвэл bid-ээр хайх"><div id="list"></div><div class="act"><button class="g" id="pv">Өмнөх</button><span class="mu" id="pgn"></span><button class="g" id="nx">Дараах</button></div></div>
 <div class="cd bulk" id="bk" style="margin-top:14px" hidden><div class="act" style="justify-content:space-between"><b id="bkn"></b><button class="g" type="button" id="bkc">Сонголт цуцлах</button></div><p class="mu" style="margin:6px 0 8px">Олгох эсвэл авах тэмдгүүдээ сонгоно уу (олныг зэрэг сонгож болно):</p><div id="bkp">${bpHTML([])}</div><div class="act" style="justify-content:flex-start;margin-top:10px"><button id="bka">${ic('plus',16)}Олгох</button><button class="g" id="bkr">${ic('x',16)}Авах</button></div></div></section>
 <section data-s="g" hidden><div class="cd"><h3>${ic('badge',20)}bid-ийн мужид олгох</h3><p class="mu" style="margin:6px 0 12px">Жишээ нь анхны 100 хэрэглэгчид "OG" тэмдэг: 1-ээс 100 хүртэл.</p><div class="act" style="justify-content:flex-start"><input id="rf" type="number" min="1" placeholder="Эхлэх bid" style="width:130px;margin:0"><input id="rt" type="number" min="1" placeholder="Дуусах bid" style="width:130px;margin:0"></div><p class="mu" style="margin:12px 0 8px">Тэмдгүүд:</p><div id="rgp">${bpHTML([])}</div><div class="act" style="justify-content:flex-start;margin-top:10px"><button id="rga">${ic('plus',16)}Олгох</button><button class="g" id="rgr">${ic('x',16)}Авах</button></div></div>
 <div class="cd" style="margin-top:14px"><h3>${ic('user',20)}Хэрэглэгчдийг сонгож олгох</h3><p class="mu" style="margin-top:6px">"Хэрэглэгчид" таб дээр хүмүүсийн өмнөх нүдийг чагтлахад доор нь олон тэмдэг зэрэг олгох хэсэг гарч ирнэ.</p></div></section>
 <section data-s="r" hidden><div class="cd"><p class="mu" style="margin-bottom:8px">${ic('alert',14)} Нэвтэрсэн <b>${sr.flag_hide??5}</b> өөр хүн 3 хоногт мэдэгдвэл хуудас автоматаар <b>түр нуугдана</b> (устгахгүй, хорихгүй). Та шалгаад "Ил гаргах" эсвэл "Хориглох"-г сонгоно.</p><div id="rps"></div></div></section>
 <section data-s="p" hidden><div class="cd"><div id="aps"></div></div></section>
 <section data-s="v" hidden><div class="cd"><div id="vrs"></div></div></section>
 <section data-s="l" hidden><div class="cd"><div id="lgs"></div></div></section>
 <section data-s="s" hidden><div class="cd">
 <div class="fl"><label>Өдөрт шинээр бүртгүүлэх дээд хязгаар (ботоос хамгаална)</label><div class="act" style="justify-content:flex-start"><input id="dc" type="number" min="1" max="5000" style="width:110px;margin:0" value="${sr.daily_cap??300}"><button class="g" id="dcb">Хадгалах</button></div></div>
 <div class="fl"><label>Автоматаар нуух босго (өөр өөр мэдэгдэгчийн тоо)</label><div class="act" style="justify-content:flex-start"><input id="fh" type="number" min="2" max="1000" style="width:110px;margin:0" value="${sr.flag_hide??5}"><button class="g" id="fhb">Хадгалах</button></div></div>
 <div class="fl"><label>Нэр нөөцлөх эсвэл чөлөөлөх</label><div class="act" style="justify-content:flex-start"><input id="ru" placeholder="нэр" style="width:150px;margin:0"><button id="rs">Нөөцлөх</button><button class="g" id="rr">Чөлөөлөх</button></div></div>
 <div class="fl"><label>Яаралтай үед (бот довтолгоо г.м.)</label><div class="act" style="justify-content:flex-start"><button class="g" id="rc">Бүртгэл түр хаах</button><button id="ro">Бүртгэл нээх</button><button class="g" id="uc">Файл оруулалт хаах</button><button id="uo">Файл оруулалт нээх</button></div></div></div></section></div>`;
 const Q=s=>v.querySelector(s);
 const tbs=[...v.querySelectorAll('.tabs2 button')];
 tbs.forEach(b=>b.onclick=()=>{tbs.forEach(x=>x.classList.toggle('on',x==b));v.querySelectorAll('section[data-s]').forEach(x=>x.hidden=x.dataset.s!=b.dataset.t)});
 tbs[0].click();
 const cnt=(k,n)=>{const x=Q('[data-cn="'+k+'"]');if(x)x.textContent=n?n:''};
 bpWire(Q('#bkp'));bpWire(Q('#rgp'));
 const bulkUi=()=>{Q('#bk').hidden=!sel.size;Q('#bkn').textContent=sel.size+' хэрэглэгч сонгосон'};
 const loadList=async()=>{
  let r=sb.from('profiles').select('id,bid,username,display_name,role,banned,hidden,views,likes,badges').order('bid').range(pg*N,pg*N+N-1);
  const c=q.replace(/[^a-zA-Z0-9_ёөүа-яЁӨҮА-Я .-]/g,'');
  if(c){const n=c.replace('#','');r=/^\d+$/.test(n)?r.eq('bid',+n):r.or('username.ilike.%'+c+'%,display_name.ilike.%'+c+'%')}
  const{data,error}=await r;if(error)toast(error.message);const L=data||[];rows={};L.forEach(p=>rows[p.bid]=p);
  Q('#list').innerHTML=L.map(p=>`<div class="row" style="flex-wrap:wrap"><label class="chk"><input type="checkbox" data-sel="${p.bid}" ${sel.has(p.bid)?'checked':''}><i></i></label><b>#${p.bid}</b><span style="flex:1;min-width:140px">${p.username?`<a href="/${e(p.username)}" target="_blank">${e(p.username)}</a>`:'—'} ${p.role=='admin'?'<span class="tag">Админ</span>':p.role=='moderator'?'<span class="tag ok">Модератор</span>':''}${p.banned?'<span class="tag bad">Хориглосон</span>':''}${p.hidden?'<span class="tag warn">Нуугдсан</span>':''} <small class="mu">${ic('eye',13)} ${p.views} ${ic('heart',13)} ${p.likes}</small><span class="bds sm">${(p.badges||[]).map(x=>`<span class="bd">${ic(BINFO(String(x).toLowerCase())[1],12)}${e(BINFO(String(x).toLowerCase())[0])}</span>`).join('')}</span></span><button class="g" data-a="${p.banned?'unban':'ban'}" data-b="${p.bid}">${p.banned?'Хориг цуцлах':'Хориглох'}</button><button class="g" data-a="badges" data-b="${p.bid}">${ic('badge',14)}Тэмдэг</button><button class="g" data-a="rename" data-b="${p.bid}">Нэр солих</button>${p.role=='admin'||p.banned?'':`<button class="g" data-a="${p.role=='moderator'?'unmod':'mkmod'}" data-b="${p.bid}">${ic('shield',14)}${p.role=='moderator'?'Модератор хасах':'Модератор болгох'}</button>`}${p.banned?`<button class="g dng2" data-a="purge" data-b="${p.bid}">Өгөгдлийг устгах</button>`:''}<button class="g" data-a="free" data-b="${p.bid}">Нэр чөлөөлөх</button></div>`).join('')||'<p class="mu" style="margin:12px 0">Хэрэглэгч олдсонгүй.</p>';
  Q('#pgn').textContent='Хуудас '+(pg+1);Q('#pv').disabled=pg==0;Q('#nx').disabled=L.length<N;
 };
 const RL=Object.fromEntries(RCAT.map(x=>[x[0],x[1]]));
 const loadRep=async()=>{
  const{data,error}=await sb.from('flags').select('id,profile_id,cat,note,reporter,created_at,profiles(username,bid,hidden,banned)').eq('done',false).order('id',{ascending:false}).limit(200);
  if(error){Q('#rps').innerHTML='<p class="mu">Мэдэгдэл ачаалагдсангүй: '+e(error.message)+'. v8.sql ажиллуулсан эсэхээ шалгана уу.</p>';return}
  const G=new Map();(data||[]).forEach(r=>{const g=G.get(r.profile_id)||{p:r.profiles,id:r.profile_id,L:[],who:new Set()};g.L.push(r);if(r.reporter)g.who.add(r.reporter);G.set(r.profile_id,g)});
  const A=[...G.values()].sort((a,b)=>b.who.size-a.who.size||b.L.length-a.L.length);cnt('r',A.length);
  Q('#rps').innerHTML=A.map(g=>{const p=g.p||{},cats={};g.L.forEach(r=>cats[r.cat]=(cats[r.cat]||0)+1);
   return`<div class="rep"><div class="act" style="justify-content:flex-start"><b>${p.username?e(p.username):'#'+(p.bid||'?')}</b>${p.hidden?'<span class="tag warn">Нуугдсан</span>':''}${p.banned?'<span class="tag bad">Хориглосон</span>':''}<span class="mu" style="margin-left:auto">${g.L.length} мэдэгдэл · ${g.who.size} нэвтэрсэн хүн</span></div><div class="bds sm">${Object.entries(cats).map(([c,n])=>`<span class="bd">${e(RL[c]||c)} ×${n}</span>`).join('')}</div>${g.L.filter(r=>r.note).slice(0,4).map(r=>`<p class="mu sel" style="font-size:13px">“${e(r.note)}”</p>`).join('')}<div class="act" style="justify-content:flex-start;margin-top:8px">${p.username?`<a href="/${e(p.username)}" target="_blank"><button class="g">${ic('eye',14)}Үзэх</button></a>`:''}${p.hidden?`<button data-fx="unhide" data-p="${g.id}">Ил гаргах</button>`:`<button class="g" data-fx="hide" data-p="${g.id}">Нуух</button>`}${p.banned?'':`<button class="g dng2" data-fban="${p.bid}" data-p="${g.id}">${isA?'Хориглох':'Түр хориглох'}</button>`}<button class="g" data-fx="flags_done" data-p="${g.id}">${ic('check',14)}Шийдсэн</button></div></div>`}).join('')||'<p class="mu">Шинэ мэдэгдэл алга.</p>';
 };
 const loadAp=async()=>{
  const{data,error}=await sb.from('appeals').select('id,user_id,body,created_at,profiles(username,bid)').eq('status','open').order('id').limit(50);
  if(error){Q('#aps').innerHTML='<p class="mu">Ачаалагдсангүй: '+e(error.message)+'. v8.sql ажиллуулсан эсэхээ шалгана уу.</p>';return}
  const L=data||[];cnt('p',L.length);
  let R={};if(L.length){const r=await sb.from('profile_private').select('id,ban_reason').in('id',L.map(x=>x.user_id));(r.data||[]).forEach(x=>R[x.id]=x.ban_reason)}
  Q('#aps').innerHTML=L.map(a=>`<div class="rep"><div class="act" style="justify-content:flex-start"><b>${e(a.profiles?(a.profiles.username||'#'+a.profiles.bid):'—')}</b><span class="mu" style="margin-left:auto">${new Date(a.created_at).toLocaleString()}</span></div><small class="mu">Хоригийн шалтгаан: ${e(R[a.user_id]||'—')}</small><p class="sel" style="margin:8px 0;white-space:pre-line">${e(a.body)}</p><div class="act" style="justify-content:flex-start"><button data-ap="appeal_ok" data-i="${a.id}">${ic('check',14)}Зөвшөөрөх (хориг цуцлах)</button><button class="g dng2" data-ap="appeal_no" data-i="${a.id}">${ic('x',14)}Татгалзах</button></div></div>`).join('')||'<p class="mu">Шинэ хүсэлт алга.</p>';
 };
 const act=async(a,t0,val)=>{
  const{data:r,error}=await sb.rpc('admin_act',{act:a,target:t0,val:val??''});
  toast(error?error.message:(ERR[r]||(r=='ok'?'Амжилттай':r)));
  if(!error&&r=='ok'){loadList();loadRep()}
  return!error&&r=='ok';
 };
 const MERR={denied:'Энэ үйлдлийг хийх эрхгүй',self:'Өөртөө хийх боломжгүй',own:'Өөрийн хорьсон хүний хүсэлтийг өөр хүн шийднэ',limit:'Өнөөдрийн хязгаар дууслаа',note:'Шалтгаан бичнэ үү',rate:ERR.rate,none:'Олдсонгүй (аль хэдийн шийдэгдсэн байж магадгүй)'};
 const mod=async(a,pid,id,note)=>{
  const{data:r,error}=await sb.rpc('mod_act',{p_act:a,p_pid:pid||null,p_note:note||'',p_id:id??null});
  toast(error?error.message:(r=='ok'?'Амжилттай':(MERR[r]||ERR[r]||r)));
  if(!error&&r=='ok'){loadRep();loadAp();loadVr();loadLog();if(isA)loadList()}
 };
 const mod2=async(a,pid)=>{const{data:r,error}=await sb.rpc('admin_mod',{p_act:a,p_pid:pid,p_id:null});toast(error?error.message:r=='ok'?'Амжилттай':(ERR[r]||r));if(!error&&r=='ok')loadList()};
 const banFlow=async(bid,uid)=>{
  const x=await dlg({icon:'shield',danger:true,title:'Хэрэглэгчийг хориглох',body:'Нэрнээс бусад бүх мэдээлэл (зураг, дуу, видео, холбоос, үзэлт, like) бүр мөсөн устна. Хэрэглэгч давж заалдах хүсэлт илгээж болно.',input:{placeholder:'Шалтгаан (хэрэглэгчид харагдана)'},ok:'Хориглох'});
  if(x===null)return;
  if(await act('ban',bid,x||'Дүрэм зөрчсөн')&&uid){await purgeFiles(uid);await sb.rpc('admin_mod',{p_act:'flags_done',p_pid:uid,p_id:null});loadRep()}
 };
 const multi=async(list,fn)=>{let n=0;for(const b of list){const{data,error}=await fn(b);if(error){toast(error.message);return}n=Math.max(n,+data||0)}return n};
 const bulk=async(rm)=>{
  const B=bpGet(Q('#bkp'));if(!B.length||!sel.size)return toast('Хэрэглэгч болон тэмдгээ сонгоно уу');
  const n=await multi(B,b=>sb.rpc('admin_badge_bulk',{p_bids:[...sel],p_badge:b,p_remove:rm}));
  if(n!=null){toast((rm?'Авлаа: ':'Олголоо: ')+B.map(k=>BINFO(k)[0]).join(', ')+' → '+n+' хэрэглэгч');loadList()}
 };
 const range=async(rm)=>{
  const f=+Q('#rf').value,tt=+Q('#rt').value,B=bpGet(Q('#rgp'));if(!f||!tt||!B.length)return toast('Муж болон тэмдгээ сонгоно уу');
  if(tt<f)return toast('Дуусах bid эхлэхээс их байх ёстой');
  const n=await multi(B,b=>sb.rpc('admin_badge_range',{p_from:f,p_to:tt,p_badge:b,p_remove:rm}));
  if(n!=null)toast((rm?'Авлаа: ':'Олголоо: ')+B.map(k=>BINFO(k)[0]).join(', ')+' → '+n+' хэрэглэгч');
 };
 Q('#list').onchange=ev=>{const c=ev.target.closest('[data-sel]');if(!c)return;const n=+c.dataset.sel;c.checked?sel.add(n):sel.delete(n);bulkUi()};
 Q('#bkc').onclick=()=>{sel.clear();Q('#list').querySelectorAll('[data-sel]').forEach(c=>c.checked=false);bulkUi()};
 Q('#list').onclick=async ev=>{const b=ev.target.closest('button');if(!b)return;const a=b.dataset.a,t0=+b.dataset.b,p=rows[t0];
  if(a=='rename'){const x=await dlg({icon:'user',title:'Шинэ нэр',input:{placeholder:'нэр'},ok:'Солих'});if(x)act(a,t0,x)}
  else if(a=='badges'){
   const x=await dlg({icon:'badge',title:'Тэмдэг олгох',wide:true,html:`<p class="mu" style="margin-bottom:10px">${e(p&&p.username||'#'+t0)} — дарж сонгоно уу. Олныг зэрэг сонгож болно.</p>${bpHTML(p&&p.badges||[])}`,wire:bpWire,collect:bpGet,ok:'Хадгалах'});
   if(x)act(a,t0,x.join(','))}
  else if(a=='ban')banFlow(t0,p&&p.id);
  else if(a=='mkmod'||a=='unmod'){if(a=='mkmod'&&!(await dlg({icon:'shield',title:'Модератор болгох уу?',body:(p.username||'#'+t0)+' мэдэгдэл, давж заалдах, баталгаажуулалтыг шийдэх эрхтэй болно. Тэр хүний бүх үйлдэл "Үйлдлийн түүх" дээр харагдана.',ok:'Тийм'})))return;mod2(a=='mkmod'?'set_mod':'unset_mod',p.id)}
  else if(a=='purge'){if(await dlg({icon:'trash',danger:true,title:'Өгөгдлийг бүрмөсөн устгах уу?',body:'Түр хориглогдсон хэрэглэгчийн зураг, холбоос, үзэлт зэрэг бүх мэдээлэл устна. Буцаах боломжгүй.',ok:'Устгах'})&&await act('ban',t0,'Дүрэм зөрчсөн')&&p)await purgeFiles(p.id)}
  else if(a)act(a,t0)};
 const suspend=async pid=>{const x=await dlg({icon:'shield',danger:true,title:'Түр хориглох',body:'Хуудас нийтэд харагдахгүй болж, хэрэглэгч тохиргоо хийж чадахгүй. Өгөгдөл устахгүй — админ шалгаад шийднэ. Хэрэглэгч давж заалдаж болно.',input:{placeholder:'Шалтгаан (заавал, хэрэглэгчид харагдана)'},ok:'Хориглох'});if(x===null)return;if(x.length<3)return toast(MERR.note);mod('suspend',pid,null,x)};
 Q('#rps').onclick=ev=>{const b=ev.target.closest('[data-fx]');if(b){mod(b.dataset.fx,b.dataset.p);return}const f=ev.target.closest('[data-fban]');if(f){isA?banFlow(+f.dataset.fban,f.dataset.p):suspend(f.dataset.p)}};
 Q('#aps').onclick=async ev=>{const b=ev.target.closest('[data-ap]');if(!b)return;if(b.dataset.ap=='appeal_ok'&&!(await dlg({icon:'check',title:'Хоригийг цуцлах уу?',body:'Хэрэглэгч дахин нэвтэрч, хуудсаа шинээр тохируулах боломжтой болно. (Устгагдсан зураг, холбоос сэргэхгүй.)',ok:'Цуцлах'})))return;mod(b.dataset.ap,null,+b.dataset.i)};
 Q('#vrs').onclick=async ev=>{const b=ev.target.closest('[data-vr]');if(b){if(b.dataset.vr=='verify_ok'){if(!(await dlg({icon:'badge',title:'Баталгаажуулах уу?',body:'Хэрэглэгчид "Баталгаажсан" тэмдэг автоматаар олгогдоно.',ok:'Баталгаажуулах'})))return;mod('verify_ok',null,+b.dataset.i)}else{const x=await dlg({icon:'x',title:'Татгалзах',input:{placeholder:'Шалтгаан (хэрэглэгчид харагдана)'},ok:'Татгалзах'});if(x!==null)mod('verify_no',null,+b.dataset.i,x)}return}const l=ev.target.closest('[data-pf]');if(l){ev.preventDefault();linkGo(l.dataset.pf)}};
 Q('#q').oninput=ev=>{clearTimeout(t);t=setTimeout(()=>{q=ev.target.value.trim();pg=0;loadList()},300)};
 Q('#pv').onclick=()=>{if(pg>0){pg--;loadList()}};Q('#nx').onclick=()=>{pg++;loadList()};
 Q('#bka').onclick=()=>bulk(false);Q('#bkr').onclick=()=>bulk(true);Q('#rga').onclick=()=>range(false);Q('#rgr').onclick=()=>range(true);
 Q('#rc').onclick=async()=>{if(await dlg({icon:'alert',danger:true,title:'Бүртгэл түр хаах уу?',body:'Шинэ хүн бүртгүүлэх боломжгүй болно. Бүртгэлтэй хүмүүс хэвийн нэвтэрнэ.',ok:'Хаах'}))act('reg_close',0,'')};
 Q('#ro').onclick=()=>act('reg_open',0,'');
 Q('#uc').onclick=()=>act('uploads_close',0,'');Q('#uo').onclick=()=>act('uploads_open',0,'');
 Q('#dcb').onclick=()=>act('daily_cap',0,Q('#dc').value);
 Q('#fhb').onclick=()=>mod('flag_hide',null,+Q('#fh').value||5);
 Q('#rs').onclick=()=>Q('#ru').value&&act('reserve',0,Q('#ru').value);Q('#rr').onclick=()=>Q('#ru').value&&act('release',0,Q('#ru').value);
 const VST={open:'Шинэ',accepted:'Зөвшөөрсөн',rejected:'Татгалзсан'};
 async function loadVr(){
  const{data,error}=await sb.from('verify_req').select('id,user_id,proof,note,created_at,profiles(username,bid,avatar_url,views)').eq('status','open').order('id').limit(50);
  if(error){Q('#vrs').innerHTML='<p class="mu">Ачаалагдсангүй: '+e(error.message)+'. v9.sql ажиллуулсан эсэхээ шалгана уу.</p>';return}
  const L=data||[];cnt('v',L.length);
  Q('#vrs').innerHTML=L.map(r=>{const p=r.profiles||{},pf=safe(r.proof);return`<div class="rep"><div class="act" style="justify-content:flex-start">${av(p)}<b>${e(p.username||'#'+p.bid)}</b><small class="mu">${ic('eye',12)} ${p.views||0}</small><span class="mu" style="margin-left:auto">${new Date(r.created_at).toLocaleDateString()}</span></div><p style="margin:8px 0 4px">${ic('link',14)} <a href="#" data-pf="${e(pf)}" class="sel" style="color:var(--a);word-break:break-all">${e(r.proof)}</a></p>${r.note?`<p class="mu sel" style="white-space:pre-line">${e(r.note)}</p>`:''}<div class="act" style="justify-content:flex-start;margin-top:8px">${p.username?`<a href="/${e(p.username)}" target="_blank"><button class="g">${ic('eye',14)}Хуудас</button></a>`:''}<button data-vr="verify_ok" data-i="${r.id}">${ic('check',14)}Баталгаажуулах</button><button class="g dng2" data-vr="verify_no" data-i="${r.id}">${ic('x',14)}Татгалзах</button></div></div>`}).join('')||'<p class="mu">Шинэ хүсэлт алга.</p>';
 }
 const ACTN={hide:'Нуусан',unhide:'Ил гаргасан',flags_done:'Мэдэгдэл шийдсэн',suspend:'Түр хорьсон',appeal_ok:'Давж заалдах зөвшөөрсөн',appeal_no:'Давж заалдах татгалзсан',verify_ok:'Баталгаажуулсан',verify_no:'Баталгаажуулалт татгалзсан',tpl_hide:'Загвар нуусан',tpl_show:'Загвар сэргээсэн',set_mod:'Модератор болгосон',notice:'Сайтын мэдэгдэл',unset_mod:'Модератор хассан',flag_hide:'Нуух босго өөрчилсөн'};
 async function loadLog(){
  let q=sb.from('mod_log').select('id,actor,act,target,ref,note,at').order('id',{ascending:false}).limit(60);if(!isA)q=q.eq('actor',me.id);
  const{data,error}=await q;if(error){Q('#lgs').innerHTML='<p class="mu">Ачаалагдсангүй: '+e(error.message)+'</p>';return}
  const L=data||[],ids=[...new Set(L.flatMap(x=>[x.actor,x.target]).filter(Boolean))];const U={};
  if(ids.length){const r=await sb.from('profiles').select('id,username,bid,role').in('id',ids);(r.data||[]).forEach(p=>U[p.id]=p)}
  const nm=id=>{const p=U[id];return p?e(p.username||'#'+p.bid):'—'};
  Q('#lgs').innerHTML=L.map(x=>`<div class="row" style="flex-wrap:wrap"><small class="mu" style="min-width:120px">${new Date(x.at).toLocaleString()}</small><b>${nm(x.actor)}${U[x.actor]&&U[x.actor].role=='moderator'?' <span class="tag ok">мод</span>':''}</b><span>${e(ACTN[x.act]||x.act)}</span>${x.target?`<span class="mu">→ ${nm(x.target)}</span>`:''}${x.note?`<small class="mu sel" style="flex-basis:100%">“${e(x.note)}”</small>`:''}</div>`).join('')||'<p class="mu">Үйлдэл алга.</p>';
 }
 async function loadUsage(){
  const el=Q('#usg');if(!el)return;const{data:u,error}=await sb.rpc('admin_usage');
  if(error||!u){el.innerHTML='<p class="mu">Ачаалагдсангүй'+(error?': '+e(error.message)+' (v11.sql ажиллуулна уу)':'')+'</p>';return}
  const MBb=1048576,row=(l,v,max,fmt)=>{const p=Math.min(100,v/max*100);return`<div><div class="ub"><b>${l}</b><span class="mu">${fmt(v)} / ${fmt(max)} (${p.toFixed(1)}%)</span></div><div class="pbar ${p>=90?'bad':p>=75?'warn':''}"><i style="width:${p}%"></i></div></div>`};
  const mb=v=>(v/MBb).toFixed(v<10*MBb?1:0)+'MB',n=v=>Number(v).toLocaleString();
  const warn=u.db_bytes>400*MBb||u.storage_bytes>800*MBb||u.mau>40000;
  el.innerHTML=row('Өгөгдлийн сан',u.db_bytes,500*MBb,mb)+row('Файл хадгалалт ('+n(u.storage_files)+' файл)',u.storage_bytes,1024*MBb,mb)+row('Сарын идэвхтэй хэрэглэгч (MAU)',u.mau,50000,n)+`<div class="stg">${stat(n(u.users),'Нийт хэрэглэгч')}${stat(n(u.today),'Өнөөдөр шинэ')}${stat(n(u.week),'7 хоногт шинэ')}${stat(n(u.flags_open),'Шийдээгүй мэдэгдэл')}</div>${warn?`<div class="tip warn">${ic('alert',16)}<span>Хязгаарт ойртож байна. Файл оруулалтыг түр хааж эсвэл Supabase Pro руу шилжихийг бодоорой.</span></div>`:''}<small class="mu">Resend имэйл: өдөрт 100, сард 3000 (нэвтрэх код + 7 хоногийн тайлан хамт тоологдоно).</small>`;
 }
 if(isA)loadUsage();
 if(isA){sb.from('site_content').select('body').eq('k','notice').maybeSingle().then(r=>{const x=Q('#ntx');if(x&&r.data)x.value=r.data.body||''},()=>{});
  const setN=async b=>{const{data,error}=await sb.rpc('admin_set_notice',{p_body:b});toast(error?error.message+' (v13.sql)':data=='ok'?(b?'Мэдэгдэл нийтлэгдлээ':'Мэдэгдэл арилгалаа'):data);try{sessionStorage.removeItem('ntc')}catch{}};
  Q('#nts').onclick=()=>setN(Q('#ntx').value.trim());Q('#ntc').onclick=()=>{Q('#ntx').value='';setN('')}}
 if(isA)loadList();loadRep();loadAp();loadVr();loadLog();
}
