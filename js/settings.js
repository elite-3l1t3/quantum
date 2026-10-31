let S=null,busy={};
const TABS=[['c','Тохируулга','sliders'],['l','Холбоосууд','link'],['a','Данс','user'],['b','Тэмдгүүд','badge']];
const DZ={bg:['Дэвсгэр','image','image/*,video/mp4,video/webm','Зураг эсвэл видео (4MB хүртэл)'],music:['Дуу','music','audio/*','mp3, ogg (3MB хүртэл)'],avatar:['Профайл зураг','user','image/*','jpg, png, gif, webp (5MB хүртэл)'],cursor:['Курсор','cursor','image/png,image/webp,image/gif','Жижиг зураг, 64px болгон багасгана']};
const ip=(l,k,i,ph,m)=>`<div class="fl"><label>${l}</label><div class="ipw">${ic(i,18)}<input data-k="${k}" maxlength="${m||60}" placeholder="${ph||''}" autocomplete="off"></div></div>`;
const sl=(l,k,o)=>`<div class="fl"><label>${l}</label><select data-k="${k}">${o.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></div>`;
const tg=(l,k,h)=>`<div class="tgr"><div><b>${l}</b>${h?`<small>${h}</small>`:''}</div><label class="sw2"><input type="checkbox" data-k="${k}"><i></i></label></div>`;
const cp=(l,k)=>`<div class="fl"><label>${l}</label><div class="cpk"><input type="color" data-k="${k}"><span data-o="${k}"></span></div></div>`;
const rg=(l,k,a,b,s,u,h)=>`<div class="fl"><label>${l}: <b data-o="${k}"></b>${u}</label><input type="range" data-k="${k}" min="${a}" max="${b}" step="${s}">${h?`<small>${h}</small>`:''}</div>`;
const dzW=k=>`<div class="dzw"><label class="dzl">${DZ[k][0]}</label><div class="dz" data-dz="${k}"></div><input type="file" hidden data-f="${k}" accept="${DZ[k][2]}"></div>`;
const normUrl=(u,k)=>{u=(u||'').trim();if(!u)return'';if(/^(https?:\/\/|mailto:)/i.test(u))return u;if(k=='email'||/^[^\s@\/]+@[^\s@\/]+\.[^\s@\/]+$/.test(u))return'mailto:'+u;return'https://'+u.replace(/^\/+/,'')};
const mark=()=>{const b=document.getElementById('sbar');if(b){b.hidden=false;window.onbeforeunload=ev=>{ev.preventDefault();ev.returnValue=''}}updPrev()};
function fromMe(){
 const t=me.theme||{};
 return{un:me.username||'',dn:me.display_name||'',bi:me.bio||'',pr:!!me.presence_id,loc:t.loc||'',en:t.enter||'',
  ac:t.set?(me.accent||'#ffffff'):'#ffffff',tc:t.tc||'#f5f5f5',bgc:t.bgc||'#0a0a0a',cc:t.cc||'#141414',ic:t.ic||'#2a2a2a',
  op:Math.round((t.op??.93)*100),bl:t.bl||0,r:t.r??20,sh:t.sh||'circle',fx:t.fx||'none',ls:t.ls||'fill',bfx:t.bfx||'none',
  tw:!!t.tw,tl:!!t.tl,grad:!!t.grad,mono:!!t.mono,anim:!!t.anim,swap:!!t.swap,vol:!!t.vol,disc:!!t.disc,gn:!!t.gn,gs:!!t.gs,gb:!!t.gb,
  as:{avatar:me.avatar_url||'',bg:me.bg_url||'',video:t.video||'',music:t.music||'',cursor:t.cursor||''},
  links:(me.links||[]).map(l=>({label:l.label||'',url:l.url||'',icon:PL[l.icon]?l.icon:platFor(l.url)})),trash:[]};
}
function dzHTML(k){
 const[,icn,,hint]=DZ[k],cur=k=='bg'?(S.as.bg||S.as.video):S.as[k],u=cu(cur);
 if(busy[k])return'<div class="spin"></div><b>Хуулж байна, түр хүлээнэ үү…</b>';
 if(u){const pv=k=='music'?`<span class="pvi">${ic('music',30)}</span>`:(k=='bg'&&S.as.video?`<video src="${e(u)}" muted playsinline></video>`:`<img src="${e(u)}" alt="">`);
  return`${pv}<div class="dzb"><span class="dbtn">${ic('upload',16)}Солих</span><span class="dbtn x" data-rm="${k}">${ic('trash',16)}Устгах</span></div>`}
 return`${ic(icn,38)}<b>Файл оруулахын тулд дарна уу</b><small>${hint}</small>`;
}
const paint=k=>{const d=document.querySelector('.dz[data-dz="'+k+'"]');if(d)d.innerHTML=dzHTML(k)};
const trashIf=u=>{if(u)S.trash.push(u)};
function setAs(k,url){const o=S.as[k];if(o&&pathOf(o)!=pathOf(url))S.trash.push(o);S.as[k]=url}
async function handle(k,f){
 const kind=k=='bg'?(f.type.startsWith('video')?'video':'bg'):k;
 busy[k]=1;paint(k);
 try{
  const url=await up(kind,f);
  if(k=='bg'){const o=kind=='bg'?'video':'bg';trashIf(S.as[o]);S.as[o]='';setAs(kind,url)}else setAs(k,url);
  mark();
 }catch(x){toast(/row-level security|exceeded|too large|payload/i.test(x.message||'')?'Хадгалах зай дүүрсэн эсвэл файлын лимит хэтэрсэн байна':(x.message||String(x)))}
 busy[k]=0;paint(k);
}
function rm(k){
 if(k=='bg'){trashIf(S.as.bg);trashIf(S.as.video);S.as.bg='';S.as.video=''}else{trashIf(S.as[k]);S.as[k]=''}
 mark();paint(k);
}
function paintLinks(){
 const L=document.getElementById('llist');if(!L)return;
 L.innerHTML=S.links.map((l,i)=>`<div class="lr">${plat(l.icon,42)}<div class="lf"><input data-li="${i}" data-lf="label" maxlength="40" placeholder="Нэр" value="${e(l.label)}"><input data-li="${i}" data-lf="url" placeholder="${l.icon=='email'?'name@mail.com':'https://...'}" value="${e(l.url)}"></div><div class="la"><button type="button" data-mv="${i}" data-d="-1" aria-label="Дээш">${ic('up',16)}</button><button type="button" data-mv="${i}" data-d="1" aria-label="Доош">${ic('down',16)}</button><button type="button" class="dg" data-del="${i}" aria-label="Устгах">${ic('trash',16)}</button></div></div>`).join('')||'<p class="mu" style="text-align:center;margin-top:16px">Одоогоор холбоос алга.</p>';
}
const PRE=[['dark','Харанхуй',{ac:'#ffffff',tc:'#f5f5f5',bgc:'#0a0a0a',cc:'#141414',ic:'#2a2a2a'}],['blue','Цэнхэр',{ac:'#3b82f6',tc:'#eef4ff',bgc:'#060b16',cc:'#0d1424',ic:'#1d2a4a'}],['purple','Нил ягаан',{ac:'#a855f7',tc:'#f5eeff',bgc:'#0d0716',cc:'#170f26',ic:'#2c1d4a'}],['pink','Ягаан',{ac:'#ec4899',tc:'#fff0f7',bgc:'#14070f',cc:'#220e19',ic:'#4a1d36'}],['red','Улаан',{ac:'#ef4444',tc:'#fff1f1',bgc:'#120606',cc:'#1f0d0d',ic:'#4a1d1d'}],['green','Ногоон',{ac:'#22c55e',tc:'#effff4',bgc:'#06120a',cc:'#0d1f13',ic:'#1d4a2c'}],['yellow','Шар',{ac:'#f5b301',tc:'#fff7e0',bgc:'#14100a',cc:'#211a10',ic:'#3a2d18'}],['light','Цагаан',{ac:'#111111',tc:'#111111',bgc:'#f4f4f5',cc:'#ffffff',ic:'#e4e4e7'}]];
const preH=()=>`<div class="fl"><label>Бэлэн загвар</label><div class="pre">${PRE.map(p=>`<button type="button" class="ps" data-pre="${p[0]}" aria-label="${p[1]}"><i style="--s1:${p[2].bgc};--s2:${p[2].ac};--s3:${p[2].cc}"></i><span>${p[1]}</span></button>`).join('')}</div><small>Загвар сонговол өнгөнүүд автоматаар солигдоно. Дараа нь доороос өөрөөр засаж болно.</small></div>`;
const secC=()=>`<h2 class="sh">Файл оруулах</h2><div class="cd">${['bg','music','avatar','cursor'].map(dzW).join('')}</div>
<h2 class="sh">Ерөнхий тохиргоо</h2><div class="cd">
${ip('Тайлбар (bio)','bi','text','Өөрийнхөө тухай товч бичнэ үү',200)}${ip('Байршил','loc','pin','Жишээ нь: Улаанбаатар',30)}${ip('Орох дэлгэцийн бичвэр','en','spark','Орохын тулд дарна уу',40)}
${sl('Дэвсгэрийн эффект','bfx',[['none','Байхгүй'],['snow','Цас'],['ember','Оч']])}${sl('Нэрний эффект','fx',[['none','Байхгүй'],['glow','Гэрэлтэх'],['sparkle','Гялбаа']])}
${sl('Профайл зургийн хэлбэр','sh',[['circle','Дугуй'],['round','Зөөлөн дөрвөлжин'],['square','Дөрвөлжин']])}${sl('Холбоосын загвар','ls',[['fill','Дүүрэн'],['outline','Хүрээтэй'],['pill','Дугуйрсан']])}
${rg('Хайрцгийн тунгалаг байдал','op',20,100,5,'%')}${rg('Хайрцгийн бүдгэрүүлэлт','bl',0,20,1,'px','Утсан дээр удаан ажиллаж болзошгүй')}${rg('Булангийн дугуйрал','r',0,40,1,'px')}
${tg('Нэрэнд гэрэл нэмэх','gn')}${tg('Холбоосуудад гэрэл нэмэх','gs')}${tg('Тэмдгүүдэд гэрэл нэмэх','gb')}</div>
<h2 class="sh">Өнгө</h2><div class="cd">${preH()}${cp('Гол өнгө','ac')}${cp('Текстийн өнгө','tc')}${cp('Дэвсгэрийн өнгө','bgc')}${cp('Хайрцгийн өнгө','cc')}${cp('Дүрсний өнгө','ic')}${tg('Градиент ашиглах','grad','Хайрцгийг гол өнгөөр зөөлөн сүүдэрлэнэ')}</div>
<h2 class="sh">Бусад</h2><div class="cd">${tg('Нэг өнгийн дүрс','mono','Холбоосын дүрсийг нэг өнгөөр харуулна')}${tg('Хөдөлгөөнт гарчиг','anim','Хөтчийн таб дээрх нэр хөдөлнө')}${tg('Өнгө сольж харуулах','swap','Холбоосыг гол өнгөөр дүүргэнэ')}${tg('Дууны хяналт','vol','Дууны түвшин тохируулагч гаргана')}${tg('Discord зургаа ашиглах','disc','Профайл зураг нь таны Discord зураг болно')}${tg('Бичигдэх bio','tw','Тайлбар үсэг үсгээр бичигдэнэ')}${tg('3D хөдөлгөөн','tl','Зөвхөн компьютер дээр ажиллана')}</div>`;
const secL=()=>`<div class="cd"><h3>${ic('link',20)}Холбоосоо нэмэх</h3><p class="mu">Платформоо сонгоод хаягаа оруулна уу.</p><div class="pgrid">${Object.keys(PL).filter(k=>k!='web').map(k=>`<button type="button" class="pb" data-add="${k}">${plat(k,44)}<span>${PL[k][0]}</span></button>`).join('')}</div><button type="button" class="wide" data-add="web">${plat('web',36)}<span><b>Өөрийн холбоос нэмэх</b><small>Дурын хаяг, өөрөө нэр өгч болно</small></span></button></div><div id="llist"></div>`;
const secA=()=>`<h2 class="sh">Үндсэн мэдээлэл</h2><div class="cd">${ip('Хэрэглэгчийн нэр','un','user','username',20)}<small class="mu">Нэрээ 7 хоногт нэг л удаа солино. Зөвхөн a-z, 0-9, _ ашиглана.</small><br><br>${ip('Харагдах нэр','dn','text','Таны нэр',40)}<div class="fl"><label>Таны дугаар</label><div class="ipw">${ic('badge',18)}<span style="padding:13px 0">#${me.bid}</span></div></div></div>
<h2 class="sh">Discord</h2><div class="cd">${tg('Discord төлөвөө харуулах','pr','Онлайн эсвэл идэвхтэй байгаагаа хуудсан дээрээ харуулна. discord.gg/lanyard серверт нэгдсэн байх шаардлагатай.')}</div>
<h2 class="sh">Гарах</h2><div class="cd"><button class="g" type="button" id="lo">${ic('logout',18)}Системээс гарах</button></div>`;
const secB=()=>`<h2 class="sh">Таны тэмдгүүд</h2>${BADGES.map(b=>{const on=b[3](me);return`<div class="br${on?' on':''}"><span class="bi">${ic(b[4],26)}</span><div><b>${b[1]}</b><small>${b[2]}</small></div>${on?`<span class="ok">${ic('check',20)}</span>`:''}</div>`}).join('')}`;
function refresh(root){
 root.querySelectorAll('[data-k]').forEach(el=>{
  const k=el.dataset.k,o=root.querySelector('[data-o="'+k+'"]');
  if(el.type=='checkbox')el.checked=!!S[k];else el.value=S[k];
  if(o)o.textContent=el.value});
}
function bindAll(root){
 refresh(root);
 root.querySelectorAll('[data-k]').forEach(el=>{
  const k=el.dataset.k,o=root.querySelector('[data-o="'+k+'"]');
  el.addEventListener('input',()=>{
   if(['ac','tc','bgc','cc','ic'].includes(k))S.tchg=true;
   if(k=='un')el.value=el.value.toLowerCase().replace(/[^a-z0-9_]/g,'');
   S[k]=el.type=='checkbox'?el.checked:el.type=='range'?+el.value:el.value;
   if(o)o.textContent=el.value;mark()});
 });
}
function wireDz(root){
 Object.keys(DZ).forEach(k=>{
  const d=root.querySelector('.dz[data-dz="'+k+'"]'),f=root.querySelector('[data-f="'+k+'"]');paint(k);
  d.onclick=ev=>{if(ev.target.closest('[data-rm]')){rm(k);return}if(!busy[k])f.click()};
  f.onchange=()=>{if(f.files[0])handle(k,f.files[0]);f.value=''};
  d.ondragover=ev=>{ev.preventDefault();d.classList.add('over')};
  d.ondragleave=()=>d.classList.remove('over');
  d.ondrop=ev=>{ev.preventDefault();d.classList.remove('over');const x=ev.dataTransfer.files[0];if(x&&!busy[k])handle(k,x)};
 });
}
async function save(v){
 const sv=document.getElementById('sv');sv.disabled=true;
 try{
  const un=S.un.trim().toLowerCase();
  if(un&&un!=me.username){const{data}=await sb.rpc('claim_username',{u:un});if(data!='ok'){toast(ERR[data]||String(data));return}}
  const links=S.links.map(l=>({label:(l.label.trim()||PL[l.icon][0]).slice(0,40),url:normUrl(l.url,l.icon),icon:l.icon})).filter(l=>safe(l.url)!='#').slice(0,12);
  const theme=themeObj();
  const dav=user&&user.user_metadata&&user.user_metadata.avatar_url,avatar=S.disc&&dav?dav:S.as.avatar;
  const{error}=await sb.from('profiles').update({display_name:S.dn.slice(0,40),bio:S.bi.slice(0,200),avatar_url:avatar||null,bg_url:S.as.bg||null,accent:S.ac,links,theme}).eq('id',me.id);
  if(error)throw error;
  await sb.rpc('set_presence',{p_on:S.pr});
  const keep=new Set(Object.values(S.as).map(pathOf)),del=[...new Set(S.trash.map(pathOf))].filter(p=>p&&!keep.has(p));
  if(del.length)await sb.storage.from('media').remove(del);
  window.onbeforeunload=null;await loadMe();toast('Амжилттай хадгаллаа');settings(v);
 }catch(x){toast(x.message||String(x))}
 finally{const b=document.getElementById('sv');if(b)b.disabled=false}
}
function settings(v){
 if(!me)return v.innerHTML='<div class="card"><p>Эхлээд нэвтэрнэ үү.</p><br><button class="lg">Discord-оор нэвтрэх</button></div>';
 if(!me.approved){
  v.innerHTML=`<div class="card"><span class="pill">Хүлээлгийн жагсаалт</span><h2 style="margin:6px 0">#${me.bid} · biof.site/${e(me.username||'—')}</h2><p class="mu">${me.username?'Таны нэр нөөцлөгдлөө. Сайт нээгдмэгц хуудсаа тохируулж эхэлнэ.':'Эхлээд хэрэглэгчийн нэрээ сонгоно уу.'}</p><div class="act"><a href="/tutorial"><button class="g" type="button">Заавар үзэх</button></a>${me.username?'':'<a href="/"><button>Нэрээ авах</button></a>'}<button class="g" id="lo">${ic('logout',18)}Гарах</button></div></div>`;
  document.getElementById('lo').onclick=async()=>{await sb.auth.signOut();go('/')};return}
 S=fromMe();busy={};window.onbeforeunload=null;
 v.innerHTML=`<div class="dashw"><div class="dash"><div class="tabs2">${TABS.map((t,i)=>`<button type="button" class="${i?'':'on'}" data-t="${t[0]}">${ic(t[2],18)}<span>${t[1]}</span></button>`).join('')}</div>
 ${me.username?`<a class="tpl" href="/${e(me.username)}">biof.site/${e(me.username)} ${ic('arrow',16)}</a>`:''}
 ${localStorage.tipx?'':'<div class="tip" id="tip">'+ic('spark',18)+'<span>Шинээр орж ирсэн үү? <a href="/tutorial">Заавар үзэх</a></span><button class="g" type="button" id="tx" aria-label="Хаах">'+ic('x',14)+'</button></div>'}<section data-s="c"><div class="cd" id="ck"></div>${secC()}</section><section data-s="l" hidden>${secL()}</section><section data-s="a" hidden>${secA()}</section><section data-s="b" hidden>${secB()}</section>
 <div class="sbar" id="sbar" hidden><b>Хадгалаагүй өөрчлөлт байна!</b><button class="g" type="button" id="rs">Буцаах</button><button type="button" id="sv">Хадгалах</button></div></div><aside class="pvside" id="pvside"><button class="g pvx" type="button" id="pvx">${ic('x',16)}Хаах</button><div class="pvl">Урьдчилан харах</div><div class="pvw" id="pvw"></div></aside></div>`;
 bindAll(v);wireDz(v);paintLinks();updPrev();
 const tx=v.querySelector('#tx');if(tx)tx.onclick=()=>{localStorage.tipx=1;const t0=v.querySelector('#tip');if(t0)t0.remove()};
 v.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>{const p=PRE.find(x=>x[0]==b.dataset.pre);Object.assign(S,p[2]);S.tchg=true;refresh(v);mark()});
 const tb=[...v.querySelectorAll('.tabs2 button')];
 tb.forEach(b=>b.onclick=()=>{tb.forEach(x=>x.classList.toggle('on',x==b));v.querySelectorAll('section[data-s]').forEach(x=>x.hidden=x.dataset.s!=b.dataset.t)});
 v.querySelector('.tabs2').insertAdjacentHTML('beforeend','<button type="button" class="pvb" id="pvb">'+ic('eye',18)+'<span>Урьдчилан харах</span></button>');
 document.getElementById('pvb').onclick=()=>document.getElementById('pvside').classList.add('show');
 document.getElementById('pvx').onclick=()=>document.getElementById('pvside').classList.remove('show');
 document.getElementById('ck').onclick=ev=>{if(ev.target.closest('#cks')){try{navigator.clipboard.writeText(location.origin+'/'+me.username)}catch{}localStorage.shared=1;toast('Холбоос хуулагдлаа');updPrev()}};
 v.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{
  if(S.links.length>=12)return toast('Хамгийн ихдээ 12 холбоос нэмнэ');
  const k=b.dataset.add;S.links.push({icon:k,label:k=='web'?'':PL[k][0],url:''});paintLinks();mark();
  setTimeout(()=>{const a=document.querySelectorAll('#llist input[data-lf=url]');a[a.length-1]?.focus()},60)});
 const L=document.getElementById('llist');
 L.oninput=ev=>{const i=ev.target.dataset.li;if(i!=null){S.links[i][ev.target.dataset.lf]=ev.target.value;mark()}};
 L.onclick=ev=>{
  const m=ev.target.closest('[data-mv]'),d=ev.target.closest('[data-del]');
  if(m){const i=+m.dataset.mv,j=i+ +m.dataset.d;if(j>=0&&j<S.links.length){[S.links[i],S.links[j]]=[S.links[j],S.links[i]];paintLinks();mark()}}
  else if(d){S.links.splice(+d.dataset.del,1);paintLinks();mark()}};
 document.getElementById('lo').onclick=async()=>{await sb.auth.signOut();go('/')};
 document.getElementById('rs').onclick=()=>{window.onbeforeunload=null;settings(v)};
 document.getElementById('sv').onclick=()=>save(v);
}

const themeObj=()=>({loc:S.loc,enter:S.en,video:S.as.video,music:S.as.music,cursor:S.as.cursor,tc:S.tc,bgc:S.bgc,cc:S.cc,ic:S.ic,set:true,op:S.op/100,bl:S.bl,r:S.r,sh:S.sh,fx:S.fx,ls:S.ls,bfx:S.bfx,tw:S.tw,tl:S.tl,grad:S.grad,mono:S.mono,anim:S.anim,swap:S.swap,vol:S.vol,gn:S.gn,gs:S.gs,gb:S.gb,disc:S.disc});
function pObj(){
 const dav=user&&user.user_metadata&&user.user_metadata.avatar_url;
 return{username:S.un||'username',display_name:S.dn||S.un||'Нэр',bid:me.bid,bio:S.bi,avatar_url:S.disc&&dav?dav:S.as.avatar,bg_url:S.as.bg,accent:S.ac,
  links:S.links.filter(l=>l.url.trim()).map(l=>({label:l.label||PL[l.icon][0],url:normUrl(l.url,l.icon),icon:l.icon})),
  badges:me.badges,role:me.role,views:me.views,likes:me.likes,presence_id:null,theme:themeObj()};
}
function ckHTML(){
 const it=[['Профайл зураг сонгох',!!(S.as.avatar||S.disc)],['Өөрийнхөө тухай бичих',!!S.bi.trim()],['Эхний холбоосоо нэмэх',S.links.some(l=>l.url.trim())],['Өнгө, загвараа сонгох',!!(me.theme&&me.theme.set)||!!S.tchg],['Хуудсаа хуваалцах',!!localStorage.shared]];
 const n=it.filter(x=>x[1]).length;
 return`<h3>${ic('spark',20)}Хуудсаа бэлдэх</h3><p class="mu">${n==5?'Гайхалтай! Хуудас чинь бүрэн бэлэн боллоо.':'Доорх алхмуудыг дуусгавал хуудас чинь бэлэн болно.'}</p><div class="pbar"><i style="width:${n*20}%"></i></div><ul class="ckl">${it.map(x=>`<li class="${x[1]?'on':''}"><span>${x[1]?ic('check',14,2.4):''}</span>${x[0]}</li>`).join('')}</ul>${me.username?`<button type="button" class="g" id="cks">${ic('copy',16)}Хуудасныхаа холбоосыг хуулах</button>`:''}`;
}
let pvf=0;
function updPrev(){
 if(pvf||!S)return;
 pvf=requestAnimationFrame(()=>{
  pvf=0;
  const ck=document.getElementById('ck');if(ck)ck.innerHTML=ckHTML();
  const pw=document.getElementById('pvw');if(!pw)return;
  const p=pObj(),k=skin(p),bg=cu(S.as.bg);
  pw.style.cssText=k.vars+';background-color:'+k.bgc+(bg?';background-image:url('+bg+')':'');
  pw.innerHTML=cardHTML(p,{pv:1});
 });
}
