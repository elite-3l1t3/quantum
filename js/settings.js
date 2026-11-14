let S=null,busy={},curT='h';
const TABS=[['h','Нүүр','home'],['c','Чимэх','sliders'],['l','Холбоосууд','link'],['a','Миний мэдээлэл','user'],['b','Тэмдгүүд','badge']];
const DZ={bg:['Дэвсгэр','image','image/*,video/*','Зураг эсвэл видео. Том бол автоматаар шахна.'],music:['Дуу','music','audio/*','mp3, m4a, ogg. Том бол автоматаар шахна.'],avatar:['Профайл зураг','user','image/*','jpg, png, gif, webp. Сонгоод тайрч тааруулна.'],cursor:['Курсор','cursor','image/png,image/webp,image/gif','Жижиг зураг, 32px болгон багасгана']};
const ip=(l,k,i,ph,m)=>`<div class="fl"><label>${l}</label><div class="ipw">${ic(i,18)}<input data-k="${k}" maxlength="${m||60}" placeholder="${ph||''}" autocomplete="off"></div></div>`;
const sl=(l,k,o)=>`<div class="fl"><label>${l}</label><select data-k="${k}">${o.map(x=>`<option value="${x[0]}">${x[1]}</option>`).join('')}</select></div>`;
const tg=(l,k,h,dis)=>`<div class="tgr${dis?' dis':''}"><div><b>${l}</b>${h?`<small>${h}</small>`:''}</div><label class="sw2"><input type="checkbox" data-k="${k}"${dis?' disabled':''}><i></i></label></div>`;
const cp=(l,k)=>`<div class="fl" data-w="${k}"><label>${l}</label><div class="cpk"><input type="color" data-k="${k}"><span data-o="${k}"></span></div></div>`;
const rg=(l,k,a,b,s,u,h)=>`<div class="fl"><label>${l}: <b data-o="${k}"></b>${u}</label><input type="range" data-k="${k}" min="${a}" max="${b}" step="${s}">${h?`<small>${h}</small>`:''}</div>`;
const dzW=k=>`<div class="dzw"><label class="dzl">${DZ[k][0]}</label><div class="dz" data-dz="${k}"></div>${k=='bg'?'<div class="act dzx" id="bgpa"></div>':''}<input type="file" hidden data-f="${k}" accept="${DZ[k][2]}"></div>`;
const normUrl=(u,k)=>{u=(u||'').trim();if(!u)return'';if(/^(https?:\/\/|mailto:)/i.test(u))return u;if(k=='email'||/^[^\s@\/]+@[^\s@\/]+\.[^\s@\/]+$/.test(u))return'mailto:'+u.replace(/^mailto:/i,'');return'https://'+u.replace(/^\/+/,'')};
const mark=()=>{const b=document.getElementById('sbar');if(b){b.hidden=false;window.onbeforeunload=ev=>{ev.preventDefault();ev.returnValue=''}}updPrev()};
const dav=()=>user&&user.user_metadata&&user.user_metadata.avatar_url||'';
function fromMe(){
 const t=me.theme||{};
 return{un:me.username||'',dn:me.display_name||'',bi:me.bio||'',pr:!!me.presence_id,loc:t.loc||'',en:t.enter||'',
  ac:t.set?(me.accent||'#ffffff'):'#ffffff',tc:t.tc||'#f5f5f5',bgc:t.bgc||'#0a0a0a',cc:t.cc||'#141414',ic:t.ic||'#2a2a2a',
  picm:hx(t.pic)?'custom':(['brand','text'].includes(t.pic)?t.pic:'text'),pcc:hx(t.pic)?t.pic:'#ffffff',bgp:/^\d{1,3}% \d{1,3}%$/.test(t.bgp||'')?t.bgp:'50% 50%',
  op:Math.round((t.op??.93)*100),bl:t.bl||0,r:t.r??20,sh:t.sh||'circle',fx:t.fx||'none',ls:t.ls||'fill',bfx:t.bfx||'none',
  font:FONTS[t.font]?t.font:'def',idx:!t.noidx,tw:!!t.tw,tl:!!t.tl,grad:!!t.grad,mono:!!t.mono,anim:!!t.anim,swap:!!t.swap,vol:!!t.vol,disc:!!t.disc,gn:!!t.gn,gs:!!t.gs,gb:!!t.gb,
  as:{avatar:me.avatar_url||'',bg:me.bg_url||'',video:t.video||'',music:t.music||'',cursor:t.cursor||''},
  links:(me.links||[]).map(l=>{if(l.emb){const x=embInfo(l.url);return{label:l.label||'',url:l.url||'',icon:x?x.k:'youtube',id:'',mode:'emb',img:'',chk:''}}const k=PL[l.icon]?l.icon:platFor(l.url),T=TPL[k];let id=l.id||'',mode='url';
   if(T){if(!id)id=idFrom(k,l.url);if(T[3].test(String(id).replace(/^@/,'')))mode='id';else id=''}
   return{label:l.label||'',url:l.url||'',icon:k,id,mode,img:LKIMG.test(l.img||'')?l.img:'',chk:''}}),trash:[]};
}
function dzHTML(k){
 const[,icn,,hint]=DZ[k],cur=k=='bg'?(S.as.bg||S.as.video):S.as[k],u=cu(cur);
 if(busy[k])return`<div class="spin"></div><b>${busy[k].p>0?'Шахаж байна…':'Хуулж байна, түр хүлээнэ үү…'}</b><small class="pct">${busy[k].p>0?Math.round(busy[k].p*100)+'%':''}</small>`;
 if(u){const pv=k=='music'?`<span class="pvi">${ic('music',30)}</span>`:(k=='bg'&&S.as.video?`<video src="${e(u)}" muted playsinline></video>`:`<img src="${e(u)}" alt="">`);
  return`${pv}<div class="dzb"><span class="dbtn">${ic('upload',16)}Солих</span><span class="dbtn x" data-rm="${k}">${ic('trash',16)}Устгах</span></div>`}
 return`${ic(icn,38)}<b>Файл оруулахын тулд дарна уу</b><small>${hint}</small>`;
}
const paint=k=>{const d=document.querySelector('.dz[data-dz="'+k+'"]');if(d)d.innerHTML=dzHTML(k);
 if(k=='bg'){const a=document.getElementById('bgpa');if(a){const u=cu(S.as.bg||S.as.video);a.innerHTML=u&&!busy.bg?`<button type="button" class="g" id="bgpv">${ic('eye',16)}Утас, компьютер дээр харах</button>`:'';const b=document.getElementById('bgpv');if(b)b.onclick=async()=>{const pos=await bgDlg(u,!!S.as.video,S.bgp);if(pos&&pos!=S.bgp){S.bgp=pos;mark()}}}}};
const paintP=k=>{const d=document.querySelector('.dz[data-dz="'+k+'"] .pct');if(d&&busy[k])d.textContent=Math.round(busy[k].p*100)+'%';else paint(k)};
const trashIf=u=>{if(u)S.trash.push(u)};
function setAs(k,url){const o=S.as[k];if(o&&pathOf(o)!=pathOf(url))S.trash.push(o);S.as[k]=url}
async function handle(k,f){
 const kind=k=='bg'?(f.type.startsWith('video')?'video':'bg'):k;
 let raw=false;
 try{
  if(k=='avatar'&&f.type.startsWith('image/')){
   const gif=f.type=='image/gif'&&f.size<=LIM.image;
   const keep=gif&&await dlg({icon:'image',title:'Хөдөлгөөнтэй GIF',body:'GIF-ээ хэвээр нь (хөдөлгөөнтэй) үлдээх үү? Тайрвал хөдөлгөөнгүй зураг болно.',ok:'Хэвээр үлдээх',cancel:'Тайрч тааруулах'});
   if(!keep){const b=await cropDlg(f,{out:512,title:'Профайл зургаа тааруулах'});if(!b)return;f=new File([b],'avatar.'+(extOf(b.type)||'webp'),{type:b.type})}
   raw=true;
  }
  busy[k]={p:0};paint(k);
  const url=await up(kind,f,p=>{busy[k]={p};paintP(k)},raw);
  if(k=='bg'){const o=kind=='bg'?'video':'bg';trashIf(S.as[o]);S.as[o]='';setAs(kind,url)}else setAs(k,url);
  busy[k]=0;paint(k);mark();
  if(k=='bg'){const pos=await bgDlg(cu(url),kind=='video',S.bgp);if(pos&&pos!=S.bgp){S.bgp=pos;mark()}}
 }catch(x){toast(/row-level security|exceeded|too large|payload|maximum allowed/i.test(x.message||'')?'Хадгалах зай дүүрсэн, файл оруулалт түр хаалттай эсвэл файлын лимит хэтэрсэн байна':(x.message||String(x)))}
 finally{if(busy[k]){busy[k]=0;paint(k)}}
}
function rm(k){
 if(k=='bg'){trashIf(S.as.bg);trashIf(S.as.video);S.as.bg='';S.as.video=''}else{trashIf(S.as[k]);S.as[k]=''}
 mark();paint(k);
}
/* Өөрийн холбоосын сайт HTTPS дэмждэг эсэхийг шалгана (http ↔ https автоматаар засна) */
const PRB={};let prbOK=null;
const ping=(u,ms)=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);return fetch(u,{mode:'no-cors',credentials:'omit',cache:'no-store',redirect:'follow',referrerPolicy:'no-referrer',signal:c.signal}).then(()=>'ok',()=>c.signal.aborted?'slow':'fail').finally(()=>clearTimeout(t))};
async function probe(url){
 let u;try{u=new URL(url)}catch{return null}
 if(!/^https?:$/.test(u.protocol)||!u.hostname.includes('.'))return null;
 const h=u.hostname.toLowerCase();
 if(HOST[h.replace(/^www\.|^m\./,'')])return'https';
 if(PRB[h])return PRB[h];
 if(prbOK==null)prbOK=ping('https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/package.json',6000).then(r=>r=='ok');
 if(!(await prbOK))return null;
 const r=await ping('https://'+u.host+'/',7000);
 return PRB[h]=r=='ok'?'https':r=='fail'?'http':null;
}
const chkTxt=l=>l.chk=='https'?ic('lock',13)+' HTTPS — шифрлэгдсэн, аюулгүй':l.chk=='http'?ic('alert',13)+' HTTP — шифрлэлтгүй сайт':l.chk=='…'?'Сайтыг шалгаж байна…':l.chk=='?'?'Сайтыг шалгаж чадсангүй':e(linkUrl(l)||'');
const paintPv=i=>{const l=S.links[i],pv=document.querySelector('#llist [data-pv="'+i+'"]');if(!l||!pv)return;if(l.mode=='emb'){const x=embInfo(l.url);pv.className='pvu'+(x?' okk':l.url?' bad2':'');pv.innerHTML=x?ic('play',13)+' '+(PL[x.k][0])+' — хуудсан дээр шууд тоглоно':l.url?'Танигдсангүй. YouTube видео, Spotify дуу/плэйлист эсвэл SoundCloud дууны холбоос оруулна уу':'';return}pv.className='pvu'+(l.chk=='https'?' okk':l.chk=='http'?' bad2':'');pv.innerHTML=l.mode=='id'?(String(l.id||'').trim()?e(linkUrl(l)||'Буруу байна — зөвхөн нэр/ID-гаа бичнэ үү'):''):chkTxt(l)};
async function chk(i,quiet){
 const l=S.links[i];if(!l||l.mode=='id'||l.mode=='emb'||l.icon=='email')return;
 const u=normUrl(l.url,l.icon);if(!/^https?:\/\/[^\/\s]+\.[^\/\s]+/i.test(u)){l.chk='';paintPv(i);return}
 l.chk='…';paintPv(i);
 const r=await probe(u);if(S.links[i]!==l)return;
 if(r){const fx=u.replace(/^https?:/i,r+':');l.chk=r;if(fx!==l.url){l.url=fx;const inp=document.querySelector('#llist input[data-li="'+i+'"][data-lf="url"]');if(inp)inp.value=fx;if(!quiet&&fx.toLowerCase()!=u.toLowerCase())toast(r=='https'?'Энэ сайт HTTPS дэмждэг тул https:// болголоо':'Энэ сайт HTTPS дэмждэггүй тул http:// болголоо');mark()}}
 else l.chk='?';
 paintPv(i);
}
function linkRow(l,i){
 if(l.mode=='emb')return`<div class="lr emr"><div class="lic">${plat(l.icon,42)}</div><div class="lf"><input data-li="${i}" data-lf="label" maxlength="40" placeholder="Гарчиг (заавал биш)" value="${e(l.label)}"><input data-li="${i}" data-lf="url" inputmode="url" placeholder="YouTube, Spotify эсвэл SoundCloud холбоос" value="${e(l.url)}" autocomplete="off" autocapitalize="none" spellcheck="false"><small class="pvu" data-pv="${i}"></small></div><div class="la"><button type="button" data-mv="${i}" data-d="-1" aria-label="Дээш">${ic('up',16)}</button><button type="button" data-mv="${i}" data-d="1" aria-label="Доош">${ic('down',16)}</button><button type="button" class="dg" data-del="${i}" aria-label="Устгах">${ic('trash',16)}</button></div></div>`;
 const t=TPL[l.icon],idm=t&&l.mode=='id',pre=t?t[0].split('{id}')[0].replace(/^https?:\/\/(www\.)?/,''):'',suf=t?t[0].split('{id}')[1]:'';
 const im=limg({id:me.id},l),can=l.icon=='web'||canIco(me);
 const icon=`<div class="lic">${plat(l.icon,42,im)}${can?`<button type="button" class="lib" data-ico="${i}" title="Дүрс солих" aria-label="Дүрс солих">${ic('image',13)}</button>`:''}</div>`;
 const body=idm
  ?`<div class="ipw idw"><span class="pfx">${e(pre)}</span><input data-li="${i}" data-lf="id" maxlength="80" placeholder="${e(t[2])}" value="${e(l.id||'')}" autocomplete="off" autocapitalize="none" spellcheck="false"><span class="sfx">${e(suf)}</span></div><small class="mu">Зөвхөн ${e(t[1].toLowerCase())}-аа бичнэ. Жишээ: ${e(t[2])}</small><small class="pvu" data-pv="${i}"></small>`
  :`<input data-li="${i}" data-lf="url" inputmode="${l.icon=='email'?'email':'url'}" placeholder="${l.icon=='email'?'name@mail.com':'https://...'}" value="${e(l.url)}" autocomplete="off" autocapitalize="none" spellcheck="false"><small class="pvu" data-pv="${i}"></small>${t?`<button type="button" class="lnk" data-mode="${i}">Зөвхөн нэрээр оруулах</button>`:''}`;
 return`<div class="lr">${icon}<div class="lf"><input data-li="${i}" data-lf="label" maxlength="40" placeholder="Нэр" value="${e(l.label)}">${body}${l.img?`<button type="button" class="lnk" data-icx="${i}">Өөрийн дүрсийг арилгах</button>`:''}</div><div class="la"><button type="button" data-mv="${i}" data-d="-1" aria-label="Дээш">${ic('up',16)}</button><button type="button" data-mv="${i}" data-d="1" aria-label="Доош">${ic('down',16)}</button><button type="button" class="dg" data-del="${i}" aria-label="Устгах">${ic('trash',16)}</button></div></div>`;
}
function paintLinks(){
 const L=document.getElementById('llist');if(!L)return;
 L.innerHTML=S.links.map(linkRow).join('')||'<p class="mu" style="text-align:center;margin-top:16px">Одоогоор холбоос алга.</p>';S.links.forEach((_,i)=>paintPv(i));
}
const preH=()=>`<div class="fl"><label>Бэлэн загвар</label><div class="pre">${PRE.map(p=>`<button type="button" class="ps" data-pre="${p[0]}" aria-label="${p[1]}"><i style="--s1:${p[2].bgc};--s2:${p[2].ac};--s3:${p[2].cc}"></i><span>${p[1]}</span></button>`).join('')}</div><small>Загвар сонговол өнгөнүүд автоматаар солигдоно. Дараа нь доороос өөрөөр засаж болно.</small></div>`;
const secC=()=>`<h2 class="sh">Загварууд</h2><div class="cd" id="tplc"><p class="mu" style="margin-bottom:10px">Нэг товшоод өнгө, фонт, хэлбэр бүгд солигдоно. Дараа нь доороос өөрөө засаж болно.</p><div class="tabs3">${[['pre','Бэлэн'],['pop','Алдартай'],['new','Шинэ'],['fav','Дуртай'],...(canIco(me)?[['mine','Миний']]:[])].map((x,i)=>`<button type="button" class="${i?'':'on'}" data-tt="${x[0]}">${x[1]}</button>`).join('')}</div><div class="tplg" id="tplg"></div>${canIco(me)?`<button type="button" class="g" id="tplp" style="margin-top:12px">${ic('upload',16)}Одоогийн загвараа нийтлэх</button>`:'<small class="mu" style="display:block;margin-top:10px">Баталгаажсан хэрэглэгчид өөрийн загвараа бусдад нийтэлж болно.</small>'}</div>
<h2 class="sh">Файл оруулах</h2><div class="cd">${['bg','music','avatar','cursor'].map(dzW).join('')}</div>
<h2 class="sh">Ерөнхий тохиргоо</h2><div class="cd">
${ip('Тайлбар (bio)','bi','text','Өөрийнхөө тухай товч бичнэ үү',200)}${ip('Байршил','loc','pin','Жишээ нь: Улаанбаатар',30)}${ip('Орох дэлгэцийн бичвэр','en','spark','Орохын тулд дарна уу',40)}
${sl('Фонт','font',Object.keys(FONTS).map(k=>[k,FONTS[k][0]]))}${sl('Дэвсгэрийн эффект','bfx',[['none','Байхгүй'],['snow','Цас'],['ember','Оч']])}${sl('Нэрний эффект','fx',[['none','Байхгүй'],['glow','Гэрэлтэх'],['sparkle','Гялбаа']])}
${sl('Профайл зургийн хэлбэр','sh',[['circle','Дугуй'],['round','Зөөлөн дөрвөлжин'],['square','Дөрвөлжин']])}${sl('Холбоосын загвар','ls',[['fill','Дүүрэн'],['outline','Хүрээтэй'],['pill','Дугуйрсан']])}
${rg('Хайрцгийн тунгалаг байдал','op',20,100,5,'%')}${rg('Хайрцгийн бүдгэрүүлэлт','bl',0,20,1,'px','Утсан дээр удаан ажиллаж болзошгүй')}${rg('Булангийн дугуйрал','r',0,40,1,'px')}
${tg('Нэрэнд гэрэл нэмэх','gn')}${tg('Холбоосуудад гэрэл нэмэх','gs')}${tg('Тэмдгүүдэд гэрэл нэмэх','gb')}</div>
<h2 class="sh">Өнгө</h2><div class="cd">${preH()}${cp('Гол өнгө','ac')}${cp('Текстийн өнгө','tc')}${cp('Дэвсгэрийн өнгө','bgc')}${cp('Хайрцгийн өнгө','cc')}${sl('Дүрсний өнгө','picm',[['text','Текстийн өнгөтэй'],['brand','Платформын өөрийн өнгөтэй'],['custom','Өөрөө сонгох']])}${cp('Дүрсний өөрийн өнгө','pcc')}${tg('Градиент ашиглах','grad','Хайрцгийг гол өнгөөр зөөлөн сүүдэрлэнэ')}</div>
<h2 class="sh">Бусад</h2><div class="cd">${tg('Хөдөлгөөнт гарчиг','anim','Хөтчийн таб дээрх нэр хөдөлнө')}${tg('Өнгө сольж харуулах','swap','Холбоосыг гол өнгөөр дүүргэнэ')}${tg('Дууны хяналт','vol','Дууны түвшин тохируулагч гаргана')}${dav()?tg('Discord зургаа ашиглах','disc','Профайл зураг нь таны Discord зураг болно'):''}${tg('Бичигдэх bio','tw','Тайлбар үсэг үсгээр бичигдэнэ')}${tg('3D хөдөлгөөн','tl','Компьютер дээр хулганаар, утсан дээр хуруу болон гар утсаа хазайлгаж ажиллана')}</div>`;
const secL=()=>`<div class="cd"><h3>${ic('link',20)}Холбоосоо нэмэх</h3><p class="mu">Платформоо сонгоод зөвхөн нэр эсвэл ID-гаа бичнэ. Бүтэн холбоос хуулбал нэрийг нь өөрөө салгаж авна.${canIco(me)?' Та баталгаажсан тул дүрс бүрийг өөрийн зургаар сольж болно.':''}</p><div class="pgrid">${PLORD.filter(k=>PL[k]&&k!='web').map(k=>`<button type="button" class="pb" data-add="${k}">${plat(k,44)}<span>${PL[k][0]}</span></button>`).join('')}</div><button type="button" class="wide" data-add="web">${plat('web',36)}<span><b>Өөрийн холбоос нэмэх</b><small>Дурын хаяг, өөрөө нэр өгч болно</small></span></button><button type="button" class="wide" data-add="emb">${plat('youtube',36)}<span><b>Видео / дуу оруулах</b><small>YouTube, Spotify, SoundCloud — хуудсан дээр шууд тоглоно (3 хүртэл)</small></span></button></div><div id="llist"></div><input type="file" hidden id="lif" accept="image/*">`;
const secA=()=>`<h2 class="sh">Үндсэн мэдээлэл</h2><div class="cd">${ip('Хэрэглэгчийн нэр','un','user','username',20)}${user&&user.email?`<div class="fl"><label>Имэйл</label><div class="ipw">${ic('link',18)}<span class="sel" style="padding:13px 0">${e(user.email)}</span></div></div>`:''}<small class="mu">Нэрээ 7 хоногт нэг л удаа солино. Зөвхөн a-z, 0-9, _ ашиглана.</small><br><br>${ip('Харагдах нэр','dn','text','Таны нэр',40)}<div class="fl"><label>Таны bid</label><div class="ipw">${ic('badge',18)}<span style="padding:13px 0">#${me.bid}</span></div></div></div>
<h2 class="sh">Хайлт</h2><div class="cd">${tg('Google хайлтад харагдах','idx','Асаалттай үед таны хуудас тэргүүлэгчдэд орвол Google-ээр хайхад гарч болно.')}</div>
<h2 class="sh">Discord</h2><div class="cd">${PRESENCE_ON?tg('Discord төлөвөө харуулах','pr','Онлайн эсвэл идэвхтэй байгаагаа хуудсан дээрээ харуулна. discord.gg/lanyard серверт нэгдсэн байх шаардлагатай.'):`<div class="mnt">${ic('alert',18)}<div><b>Discord төлөв түр засвартай байна</b><small>Онлайн төлөв харуулах боломжийг сайжруулж байна. Удахгүй дахин нээгдэнэ.</small></div></div>`}</div>
<h2 class="sh">Бүртгэл устгах</h2><div class="cd dz2"><p class="mu" style="margin-bottom:12px">Бүртгэлээ устгавал хуудас, зураг, дуу, холбоос, үзэлт, like бүгд бүр мөсөн устна. Буцаах боломжгүй.</p><button class="g dng2" type="button" id="del">${ic('trash',18)}Бүртгэлээ устгах</button></div><h2 class="sh">Гарах</h2><div class="cd"><button class="g" type="button" id="lo">${ic('logout',18)}Системээс гарах</button></div>`;
const secB=()=>`<h2 class="sh">Баталгаажсан тэмдэг</h2><div class="cd" id="vrq"><p class="mu">Ачаалж байна…</p></div><h2 class="sh">Таны тэмдгүүд</h2>${BADGES.map(b=>{const on=b[3](me);return`<div class="br${on?' on':''}"><span class="bi">${ic(b[4],26)}</span><div><b>${b[1]}</b><small>${b[2]}</small></div>${on?`<span class="ok">${ic('check',20)}</span>`:''}</div>`}).join('')}`;
function refresh(root){
 root.querySelectorAll('[data-k]').forEach(el=>{
  const k=el.dataset.k,o=root.querySelector('[data-o="'+k+'"]');
  if(el.type=='checkbox')el.checked=!!S[k];else el.value=S[k];
  if(o)o.textContent=el.value});
 const pw=root.querySelector('[data-w="pcc"]');if(pw)pw.hidden=S.picm!='custom';
}
function bindAll(root){
 refresh(root);
 root.querySelectorAll('[data-k]').forEach(el=>{
  const k=el.dataset.k,o=root.querySelector('[data-o="'+k+'"]');
  el.addEventListener('input',()=>{
   if(['ac','tc','bgc','cc','pcc','picm'].includes(k))S.tchg=true;
   if(k=='un')el.value=el.value.toLowerCase().replace(/[^a-z0-9_]/g,'');
   S[k]=el.type=='checkbox'?el.checked:el.type=='range'?+el.value:el.value;
   if(k=='picm'){const pw=root.querySelector('[data-w="pcc"]');if(pw)pw.hidden=S.picm!='custom'}
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
 const sv=document.getElementById('sv');if(!sv||sv.disabled)return;sv.disabled=true;sv.innerHTML='<span class="spin sm"></span>Хадгалж байна…';
 try{
  if(Object.values(busy).some(Boolean))return toast('Файл хуулж дуусахыг хүлээнэ үү');
  const bad=S.links.find(l=>!linkUrl(l));
  if(bad){openTab('l');toast((bad.label||PL[bad.icon][0])+': '+(bad.mode=='id'?'нэр/ID буруу байна':'холбоос хоосон эсвэл буруу байна'));return}
  /* шалгаагүй өөрийн холбоосуудыг HTTPS эсэхээр шалгана (дээд тал нь ~8 сек) */
  const pend=S.links.map((l,i)=>l.mode!='id'&&l.icon!='email'&&!l.chk?chk(i,true):null).filter(Boolean);
  if(pend.length)await Promise.race([Promise.all(pend),new Promise(r=>setTimeout(r,8000))]);
  const un=S.un.trim().toLowerCase();
  if(un&&un!=me.username){const{data,error}=await sb.rpc('claim_username',{u:un});if(error)throw error;if(data!='ok'){openTab('a');toast(ERR[data]||String(data));return}}
  const ci=canIco(me);
  const links=S.links.map(l=>({label:(l.label.trim()||PL[l.icon][0]).slice(0,40),url:linkUrl(l),icon:l.icon,...(l.mode=='emb'?{emb:1}:{}),...(l.mode=='id'&&TPL[l.icon]&&l.id?{id:idFrom(l.icon,l.id).slice(0,60)}:{}),...(l.img&&(l.icon=='web'||ci)?{img:l.img}:{})})).filter(l=>safe(l.url)!='#').slice(0,12);
  const theme=themeObj(),avatar=S.disc&&dav()?dav():S.as.avatar;
  const{error}=await sb.from('profiles').update({display_name:S.dn.slice(0,40),bio:S.bi.slice(0,200),avatar_url:avatar||null,bg_url:S.as.bg||null,accent:S.ac,links,theme}).eq('id',me.id);
  if(error)throw error;
  if(PRESENCE_ON)await sb.rpc('set_presence',{p_on:S.pr});
  const keep=new Set([...Object.values(S.as).map(pathOf),...S.links.filter(l=>l.img).map(l=>me.id+'/'+l.img.split('?')[0])]);
  const del=[...new Set(S.trash.map(pathOf))].filter(p=>p&&!keep.has(p));
  if(del.length)await sb.storage.from('media').remove(del).catch(()=>{});
  window.onbeforeunload=null;
  const y=scrollY;await loadMe();
  if(!me)return go('/');
  settings(v,curT);scrollTo(0,y);toast('Амжилттай хадгаллаа');
 }catch(x){toast(/c_len|check constraint/i.test(x.message||'')?'Хэт урт мэдээлэл байна. Bio 200, нэр 40 тэмдэгтээс ихгүй, холбоос 12-оос ихгүй байна.':/c_media/.test(x.message||'')?'Зургийн хаяг зөвшөөрөгдөөгүй байна.':(x.message||String(x)))}
 finally{const b=document.getElementById('sv');if(b){b.disabled=false;b.textContent='Хадгалах'}}
}
function openTab(t){const b=document.querySelector('.tabs2 button[data-t="'+t+'"]');if(b)b.click()}
function settings(v,tab){
 if(!me)return v.innerHTML='<div class="card"><p>Эхлээд нэвтэрнэ үү.</p><br><button class="lg">Нэвтрэх</button></div>';
 S=fromMe();busy={};window.onbeforeunload=null;curT=TABS.some(t=>t[0]==tab)?tab:'h';
 v.innerHTML=`<div class="dashw"><div class="dash"><div class="tabs2">${TABS.map(t=>`<button type="button" class="${t[0]==curT?'on':''}" data-t="${t[0]}">${ic(t[2],18)}<span>${t[1]}</span></button>`).join('')}</div>
 ${me.username?`<a class="tpl" href="/${e(me.username)}">biof.site/${e(me.username)} ${ic('arrow',16)}</a>`:''}
 ${me.hidden?`<div class="tip warn">${ic('alert',18)}<span>Таны хуудас олон мэдэгдэл авсан тул түр нуугдсан байна. Админ шалгаад шийднэ. Дүрэм зөрчсөн зүйл байвал засна уу.</span></div>`:''}
 ${localStorage.tipx?'':'<div class="tip" id="tip">'+ic('spark',18)+'<span>Шинээр орж ирсэн үү? <a href="/tutorial">Заавар үзэх</a></span><button class="g" type="button" id="tx" aria-label="Хаах">'+ic('x',14)+'</button></div>'}${TABS.map(t=>`<section data-s="${t[0]}"${t[0]==curT?'':' hidden'}>${{h:secH,c:secC,l:secL,a:secA,b:secB}[t[0]]()}</section>`).join('')}
 <div class="sbar" id="sbar" hidden><b>Хадгалаагүй өөрчлөлт байна!</b><button class="g" type="button" id="rs">Буцаах</button><button type="button" id="sv">Хадгалах</button></div></div><aside class="pvside" id="pvside"><button class="g pvx" type="button" id="pvx">${ic('x',16)}Хаах</button><div class="pvl">Урьдчилан харах</div><div class="pvw" id="pvw"></div></aside></div>`;
 bindAll(v);wireDz(v);paintLinks();updPrev();homeInit(v);tplInit(v);loadVerify();
 const tx=v.querySelector('#tx');if(tx)tx.onclick=()=>{localStorage.tipx=1;const t0=v.querySelector('#tip');if(t0)t0.remove()};
 v.querySelectorAll('[data-pre]').forEach(b=>b.onclick=()=>{const p=PRE.find(x=>x[0]==b.dataset.pre);Object.assign(S,p[2]);S.tchg=true;refresh(v);mark()});
 const tb=[...v.querySelectorAll('.tabs2 button[data-t]')];
 tb.forEach(b=>b.onclick=()=>{curT=b.dataset.t;tb.forEach(x=>x.classList.toggle('on',x==b));v.querySelectorAll('section[data-s]').forEach(x=>x.hidden=x.dataset.s!=curT)});
 v.querySelector('.tabs2').insertAdjacentHTML('beforeend','<button type="button" class="pvb" id="pvb">'+ic('eye',18)+'<span>Урьдчилан харах</span></button>');
 document.getElementById('pvb').onclick=()=>document.getElementById('pvside').classList.add('show');
 document.getElementById('pvx').onclick=()=>document.getElementById('pvside').classList.remove('show');
 document.getElementById('ck').onclick=ev=>{if(ev.target.closest('#cks')){try{navigator.clipboard.writeText(location.origin+'/'+me.username)}catch{}localStorage.shared=1;toast('Холбоос хуулагдлаа');updPrev()}};
 v.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{
  if(S.links.length>=12)return toast('Хамгийн ихдээ 12 холбоос нэмнэ');
  const k=b.dataset.add;
  if(k=='emb'){if(S.links.filter(l=>l.mode=='emb').length>=3)return toast('Хамгийн ихдээ 3 видео/дуу оруулна');S.links.push({icon:'youtube',label:'',url:'',id:'',mode:'emb',img:'',chk:''})}
  else S.links.push({icon:k,label:k=='web'?'':PL[k][0],url:'',id:'',mode:TPL[k]?'id':'url',img:'',chk:''});paintLinks();mark();
  setTimeout(()=>{const a=document.querySelectorAll('#llist input[data-lf=url],#llist input[data-lf=id]');const x=a[a.length-1];if(x){x.focus();x.scrollIntoView({block:'center'})}},60)});
 const L=document.getElementById('llist'),LIF=document.getElementById('lif');let lt=0,lifI=-1;
 L.oninput=ev=>{const i=ev.target.dataset.li;if(i==null)return;const f=ev.target.dataset.lf,l=S.links[i];l[f]=ev.target.value;
  if(f=='id')paintPv(i);
  if(f=='url'&&l.mode=='emb'){const x=embInfo(l.url);if(x&&x.k!=l.icon){l.icon=x.k;const ic0=ev.target.closest('.lr').querySelector('.lic');if(ic0)ic0.innerHTML=plat(x.k,42)}paintPv(i)}
  else if(f=='url'){l.chk='';paintPv(i);clearTimeout(lt);lt=setTimeout(()=>chk(+i),900)}
  mark()};
 L.addEventListener('change',ev=>{const i=ev.target.dataset.li;if(i==null)return;const l=S.links[i];
  if(ev.target.dataset.lf=='id'){const id=idFrom(l.icon,ev.target.value);if(id!==ev.target.value){ev.target.value=id;l.id=id;paintPv(i);mark()}}
  if(ev.target.dataset.lf=='url'&&l.icon!='email'&&l.mode!='emb'){const n=normUrl(l.url,l.icon);if(n&&n!=l.url){l.url=n;ev.target.value=n}clearTimeout(lt);chk(+i)}});
 L.onclick=ev=>{
  const m=ev.target.closest('[data-mv]'),d=ev.target.closest('[data-del]'),md=ev.target.closest('[data-mode]'),ico=ev.target.closest('[data-ico]'),icx=ev.target.closest('[data-icx]');
  if(m){const i=+m.dataset.mv,j=i+ +m.dataset.d;if(j>=0&&j<S.links.length){[S.links[i],S.links[j]]=[S.links[j],S.links[i]];paintLinks();mark()}}
  else if(d){const l=S.links[+d.dataset.del];if(l.img)trashIf(MEDIA+me.id+'/'+l.img);S.links.splice(+d.dataset.del,1);paintLinks();mark()}
  else if(md){const l=S.links[+md.dataset.mode];l.id=idFrom(l.icon,l.url);l.mode='id';paintLinks();mark()}
  else if(ico){lifI=+ico.dataset.ico;LIF.click()}
  else if(icx){const l=S.links[+icx.dataset.icx];trashIf(MEDIA+me.id+'/'+l.img);l.img='';paintLinks();mark()}};
 LIF.onchange=async()=>{
  const f=LIF.files[0];LIF.value='';const l=S.links[lifI];if(!f||!l)return;
  try{
   if(!f.type.startsWith('image/'))throw Error('Зөвхөн зураг сонгоно уу');
   let b=f;if(!(f.type=='image/gif'&&f.size<=512*1024)){b=await cropDlg(f,{out:128,shape:'square',title:'Дүрсээ тааруулах'});if(!b)return}
   toast('Дүрс хуулж байна…');
   const url=await up('lk',new File([b],'lk.'+(extOf(b.type)||'webp'),{type:b.type}),null,true);
   if(l.img)trashIf(MEDIA+me.id+'/'+l.img);
   l.img=url.slice(url.lastIndexOf('/')+1);paintLinks();mark();
  }catch(x){toast(/row-level security/i.test(x.message||'')?'Файл оруулах эрхгүй эсвэл хязгаар дүүрсэн байна. v8.sql ажиллуулсан эсэхээ шалгана уу.':(x.message||String(x)))}};
 document.getElementById('lo').onclick=async()=>{await sb.auth.signOut();go('/')};
 document.getElementById('del').onclick=delAccount;
 document.getElementById('rs').onclick=()=>{window.onbeforeunload=null;const y=scrollY;settings(v,curT);scrollTo(0,y)};
 document.getElementById('sv').onclick=()=>save(v);
}
const themeObj=()=>({font:S.font,noidx:!S.idx,loc:S.loc,enter:S.en,video:S.as.video,music:S.as.music,cursor:S.as.cursor,tc:S.tc,bgc:S.bgc,cc:S.cc,ic:S.ic,pic:S.picm=='custom'?S.pcc:S.picm,bgp:S.bgp,set:true,op:S.op/100,bl:S.bl,r:S.r,sh:S.sh,fx:S.fx,ls:S.ls,bfx:S.bfx,tw:S.tw,tl:S.tl,grad:S.grad,mono:false,anim:S.anim,swap:S.swap,vol:S.vol,gn:S.gn,gs:S.gs,gb:S.gb,disc:S.disc});
function pObj(){
 return{id:me.id,username:S.un||'username',display_name:S.dn||S.un||'Нэр',bid:me.bid,bio:S.bi,avatar_url:S.disc&&dav()?dav():S.as.avatar,bg_url:S.as.bg,accent:S.ac,
  links:S.links.filter(l=>linkUrl(l)).map(l=>({label:l.label||(l.mode=='emb'?'':PL[l.icon][0]),url:linkUrl(l),icon:l.icon,img:l.img,emb:l.mode=='emb'?1:0})),
  badges:me.badges,role:me.role,views:me.views,likes:me.likes,presence_id:null,theme:themeObj()};
}
function ckHTML(){
 const it=ckItems();
 const n=it.filter(x=>x[1]).length;
 return`<h3>${ic('spark',20)}Хуудсаа бэлдэх</h3><p class="mu">${n==5?'Гайхалтай! Хуудас чинь бүрэн бэлэн боллоо.':'Доорх алхмуудыг дуусгавал хуудас чинь бэлэн болно.'}</p><div class="pbar"><i style="width:${n*20}%"></i></div><ul class="ckl">${it.map(x=>`<li class="${x[1]?'on':''}"><span>${x[1]?ic('check',14,2.4):''}</span>${x[0]}<em class="xpc">+20 XP</em></li>`).join('')}</ul>${me.username?`<button type="button" class="g" id="cks">${ic('copy',16)}Хуудасныхаа холбоосыг хуулах</button>`:''}`;
}
let pvf=0;
function updPrev(){
 if(pvf||!S)return;
 pvf=requestAnimationFrame(()=>{
  pvf=0;
  const ck=document.getElementById('ck');if(ck)ck.innerHTML=ckHTML();
  const xb=document.getElementById('xpb');if(xb)xb.innerHTML=xpHTML();
  const dn=ckItems().filter(x=>x[1]).length;if(S.xd!=null&&dn>S.xd)toast('Даалгавар биелэв! +20 XP');S.xd=dn;
  const pw=document.getElementById('pvw');if(!pw)return;
  const p=pObj(),k=skin(p),bg=cu(S.as.bg);
  pw.style.cssText=k.vars+';background-color:'+k.bgc+(bg?';background-image:url('+bg+');background-position:'+S.bgp:'');
  pw.innerHTML=cardHTML(p,{pv:1});
 });
}

const ckItems=()=>[['Профайл зураг сонгох',!!(S.as.avatar||(S.disc&&dav()))],['Өөрийнхөө тухай бичих',!!S.bi.trim()],['Эхний холбоосоо нэмэх',S.links.some(l=>linkUrl(l))],['Өнгө, загвараа сонгох',!!(me.theme&&me.theme.set)||!!S.tchg],['Хуудсаа хуваалцах',!!localStorage.shared]];
const xpNow=()=>ckItems().filter(x=>x[1]).length*20+(localStorage.toured?20:0);
function xpHTML(){
 const xp=xpNow(),lv=Math.floor(xp/40)+1,cur=xp%40;
 return`<div class="lvl"><div class="lv"><span>${ic('bolt',22)}</span><b>Түвшин ${lv}</b><small class="mu">${xp} XP</small></div><div class="pbar"><i style="width:${cur/40*100}%"></i></div><small class="mu">Дараагийн түвшин хүртэл ${40-cur} XP. Даалгавар биелүүлээд XP цуглуул!</small></div>`;
}
const TILES=[['c','image','Хуудсаа чимэх','Зураг, өнгө, дуу сонгоно'],['l','link','Холбоос нэмэх','Instagram, YouTube гэх мэт'],['a','user','Миний мэдээлэл','Нэр, хаяг, Discord'],['b','badge','Тэмдгүүд','Авсан тэмдгүүдээ хар']];
function secH(){
 return`<div class="cd hello"><h3>${ic('spark',20)}Сайн уу, ${e(me.display_name||me.username||'найз')}!</h3><p class="mu" style="margin:6px 0 14px">Энд хуудсаа гараараа чимнэ. Хэн ч ойлгохоор хялбар. Зүгээр л товчнуудыг дар.</p><div class="act" style="justify-content:flex-start"><button type="button" id="tourb">${ic('play',16)}Заавар эхлүүлэх</button>${me.username?`<a href="/${e(me.username)}" target="_blank"><button type="button" class="g">${ic('eye',16)}Хуудсаа үзэх</button></a>`:''}</div></div>
<div class="cd" id="xpb" style="margin-top:14px"></div>
<div class="cd" id="ck" style="margin-top:14px"></div>
<h2 class="sh">Юу хийх вэ?</h2><div class="tiles">${TILES.map(t=>`<button type="button" class="tile" data-go="${t[0]}"><span>${ic(t[1],26)}</span><b>${t[2]}</b><small>${t[3]}</small></button>`).join('')}</div>
<h2 class="sh">Миний статистик</h2><div class="cd" id="stt"><p class="mu">Ачаалж байна…</p></div>
${supportHTML()}`;
}
async function loadStats(){
 const el=document.getElementById('stt');if(!el)return;
 const from=new Date(Date.now()-13*864e5).toISOString().slice(0,10);
 const r=await sb.from('views_daily').select('day,n').eq('profile_id',me.id).gte('day',from).order('day');
 if(!el.isConnected)return;
 const m={};(r.data||[]).forEach(x=>m[x.day]=x.n);
 const days=[];for(let i=13;i>=0;i--){const d=new Date(Date.now()-i*864e5).toISOString().slice(0,10);days.push([d,m[d]||0])}
 const mx=Math.max(1,...days.map(x=>x[1]));
 el.innerHTML=`<div class="stg"><div><b>${me.views}</b><span>Нийт үзэлт</span></div><div><b>${me.likes}</b><span>Нийт like</span></div><div><b>#${me.bid}</b><span>Таны bid</span></div><div><b>${bdg(me).length}</b><span>Тэмдэг</span></div></div>${r.error?'<p class="mu">Статистик одоохондоо байхгүй.</p>':`<div class="chart">${days.map(x=>`<div class="bar" title="${x[0]}: ${x[1]}"><i style="height:${Math.max(4,x[1]/mx*100)}%"></i><small>${x[0].slice(8)}</small></div>`).join('')}</div><p class="mu" style="margin-top:8px">Сүүлийн 14 өдрийн үзэлт</p>`}`;
}
const TOUR=[
 {t:'Тавтай морил!',x:'Би чамд хуудсаа хэрхэн хийхийг алхам алхмаар үзүүлье. "Дараах" товчийг дарж үргэлжлүүлээрэй.'},
 {t:'Эндээс эхэл',x:'Эдгээр таб бүр өөр хэсэг рүү аваачна.',sel:'.tabs2',tab:'h'},
 {t:'Профайл зураг',x:'Энд дарж зургаа сонгоод, чирж тааруулна. Том файл автоматаар шахагдана.',sel:'.dz[data-dz="avatar"]',tab:'c'},
 {t:'Дэвсгэр',x:'Зураг эсвэл видео оруулна. Утас, компьютер дээр хэрхэн харагдахыг шууд үзүүлнэ.',sel:'.dz[data-dz="bg"]',tab:'c'},
 {t:'Бэлэн загвар',x:'Өнгөө нэг товшоод сольж болно.',sel:'.pre',tab:'c'},
 {t:'Холбоосоо нэм',x:'Платформоо дараад зөвхөн нэрээ бичнэ. Жишээ нь TikTok дээр зөвхөн "bold" гэж бичихэд хангалттай.',sel:'.pgrid',tab:'l'},
 {t:'Хуудас чинь ингэж харагдана',x:'Энд хийсэн бүх зүйл шууд харагдана. Хамгийн сүүлд доор гарч ирэх "Хадгалах" товчийг дарна.',sel:'#pvw',alt:'#pvb',tab:'c'},
 {t:'Баяр хүргэе!',x:'Заавар дууслаа. Даалгавруудаа биелүүлээд XP цуглуул!',tab:'h'}];
function homeInit(v){
 const xb=document.getElementById('xpb');if(xb)xb.innerHTML=xpHTML();
 v.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{openTab(b.dataset.go);scrollTo({top:0,behavior:'smooth'})});
 const tb=document.getElementById('tourb');if(tb)tb.onclick=()=>startTour(TOUR);
 loadStats();
 const tp=new URLSearchParams(location.search).get('tour');
 if(tp!=null)history.replaceState(0,'',location.pathname);
 if(!homeInit.done&&(tp==='1'||(!localStorage.tourSeen&&!localStorage.toured&&tp!=='0')))setTimeout(()=>{if(document.querySelector('.tabs2')&&!document.querySelector('.tour,.dlgb'))startTour(TOUR)},700);
 homeInit.done=1;
}

/* Холбоосын загвараас URL бүтээх (бүтэн холбоос хуулсан ч нэрийг нь салгана) */
function linkUrl(l){
 const t=TPL[l.icon];
 if(l.mode=='emb')return embInfo(normUrl(l.url))?normUrl(l.url):'';
 if(l.mode=='id'&&t){const id=idFrom(l.icon,l.id);return t[3].test(id)?t[0].replace('{id}',encodeURIComponent(id)):''}
 const u=normUrl(l.url,l.icon);
 if(l.icon=='email')return/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(u)?u:'';
 return/^https?:\/\/[^\/\s]+\.[^\/\s]{2,}/i.test(u)?u:'';
}
/* Бүртгэл бүрмөсөн устгах */
async function delAccount(){
 const ok=await dlg({icon:'trash',danger:true,title:'Бүртгэлээ устгах уу?',body:'Бүх мэдээлэл бүр мөсөн устна. Баталгаажуулахын тулд өөрийн нэрийг бичнэ үү: '+(me.username||'устгах'),input:{placeholder:me.username||'устгах'},ok:'Устгах'});
 if(!ok||ok!==(me.username||'устгах'))return ok===null?null:toast('Нэр таарсангүй');
 try{const b=sb.storage.from('media'),{data}=await b.list(me.id,{limit:100});if(data&&data.length)await b.remove(data.map(f=>me.id+'/'+f.name))}catch{}
 const{data,error}=await sb.rpc('delete_my_account');
 if(error||data!='ok'){toast(data=='admin'?'Админы бүртгэлийг устгах боломжгүй':data=='banned'?'Хаагдсан бүртгэлийг устгах боломжгүй':(ERR[data]||(error&&error.message)||'Алдаа гарлаа'));return}
 await sb.auth.signOut();toast('Бүртгэл устгагдлаа');setTimeout(()=>go('/'),800);
}

/* ---------- Хуудасны загварууд: бэлэн + хэрэглэгчдийн нийтэлсэн (verified) ---------- */
const TKEYS=['tc','bgc','cc','op','bl','r','sh','fx','ls','bfx','grad','gn','gs','gb','swap','pic','font','tw','tl'];
const oneOf=(x,L,d)=>L.includes(x)?x:d;
function applyTpl(v,theme,accent){
 const th={...TBASE,...(theme&&typeof theme=='object'?theme:{})},pic=th.pic;
 Object.assign(S,{ac:hx(accent)?accent:S.ac,tc:hx(th.tc)?th.tc:TBASE.tc,bgc:hx(th.bgc)?th.bgc:TBASE.bgc,cc:hx(th.cc)?th.cc:TBASE.cc,
  op:Math.round(clampN(th.op,.2,1,.93)*100),bl:clampN(th.bl,0,20,0),r:clampN(th.r,0,40,20),sh:oneOf(th.sh,['circle','round','square'],'circle'),
  fx:oneOf(th.fx,['none','glow','sparkle'],'none'),ls:oneOf(th.ls,['fill','outline','pill'],'fill'),bfx:oneOf(th.bfx,['none','snow','ember'],'none'),
  grad:!!th.grad,gn:!!th.gn,gs:!!th.gs,gb:!!th.gb,swap:!!th.swap,font:FONTS[th.font]?th.font:'def',
  picm:hx(pic)?'custom':oneOf(pic,['brand','text'],'text'),pcc:hx(pic)?pic:S.pcc,tchg:true});
 if('tw' in th)S.tw=!!th.tw;if('tl' in th)S.tl=!!th.tl;
 refresh(v);mark();
}
const tplTile=(x,kind,own)=>{
 const th={...TBASE,...(x.theme||{})},ff=fontCss(th.font),bg=hx(th.bgc)?th.bgc:'#0a0a0a',cc=hx(th.cc)?th.cc:'#141414',tc=hx(th.tc)?th.tc:'#fff',ac=hx(x.accent)?x.accent:'#fff';
 if(ff)loadFont(th.font);
 return`<div class="tpi"><div class="tpv" style="background:${bg}"><div class="tpc" style="background:${cc};color:${tc};border-radius:${Math.round(clampN(th.r,0,40,20)/2)}px${ff?';font-family:'+ff:''}"><i style="background:${ac}"></i><b>Aa</b><span style="border-color:${ac};border-radius:${th.ls=='pill'?99:Math.round(clampN(th.r,0,40,20)/3)}px;${th.ls=='outline'?'':'background:'+ac+'33'}"></span><span style="border-color:${ac};border-radius:${th.ls=='pill'?99:Math.round(clampN(th.r,0,40,20)/3)}px;${th.ls=='outline'?'':'background:'+ac+'33'}"></span></div></div><div class="tpm"><b>${e(x.name)}</b>${kind=='pre'?'<small class="mu">biof</small>':`<small class="mu">${x.owner?'@'+e(x.owner)+' · ':''}${x.uses||0} хэрэглэсэн</small>`}</div><div class="tpa"><button type="button" class="tuse" data-use="${kind}:${x.id}">Ашиглах</button>${kind=='pre'?'':`<button type="button" class="g tfv${x.fav?' on':''}" data-fav="${x.id}" aria-label="Дуртай">${icf('heart',14)}<span>${x.favs||0}</span></button>`}${own?`<button type="button" class="g" data-tdel="${x.id}" aria-label="Устгах">${ic('trash',14)}</button>`:''}</div></div>`;
};
let TPLD={};
async function tplLoad(kind){
 const g=document.getElementById('tplg');if(!g)return;
 if(kind=='pre'){g.innerHTML=PAGE_TPL.map(t=>tplTile({id:t[0],name:t[1],accent:t[2],theme:t[3]},'pre')).join('');return}
 g.innerHTML='<p class="mu">Ачаалж байна…</p>';
 const cols='id,name,theme,accent,uses,favs,owner,profiles!tpls_owner_fkey(username)';let r;
 if(kind=='fav'){r=await sb.from('tpl_favs').select('tpls('+cols+')').eq('user_id',me.id).limit(30);r={data:(r.data||[]).map(x=>x.tpls).filter(Boolean),error:r.error}}
 else{let q=sb.from('tpls').select(cols).limit(30);q=kind=='mine'?q.eq('owner',me.id).order('id',{ascending:false}):q.eq('hidden',false).order(kind=='pop'?'uses':'id',{ascending:false});r=await q}
 if(!g.isConnected)return;
 if(r.error){console.warn('tpls',r.error);g.innerHTML='<p class="mu">Загварууд ачаалагдсангүй: '+e(r.error.message||'')+'<br>(Админ: _dev/v10.sql-ийг Supabase дээр ажиллуулна уу)</p>';return}
 const fv=await sb.from('tpl_favs').select('tpl_id').eq('user_id',me.id);const F=new Set((fv.data||[]).map(x=>x.tpl_id));
 TPLD={};(r.data||[]).forEach(x=>{x.owner=x.profiles&&x.profiles.username;x.fav=F.has(x.id);TPLD[x.id]=x});
 const mod=me.role=='admin'||me.role=='moderator';
 g.innerHTML=(r.data||[]).map(x=>tplTile(x,kind,kind=='mine'||mod)).join('')||`<p class="mu">${kind=='fav'?'Дуртай загвар алга. Зүрхэн дээр дарж хадгалаарай.':kind=='mine'?'Та одоогоор загвар нийтлээгүй байна.':'Одоогоор нийтэлсэн загвар алга.'}</p>`;
}
function tplInit(v){
 const c=document.getElementById('tplc');if(!c)return;let cur='pre';
 c.querySelectorAll('[data-tt]').forEach(b=>b.onclick=()=>{cur=b.dataset.tt;c.querySelectorAll('[data-tt]').forEach(x=>x.classList.toggle('on',x==b));tplLoad(cur)});
 tplLoad('pre');
 c.addEventListener('click',async ev=>{
  const u=ev.target.closest('[data-use]'),f=ev.target.closest('[data-fav]'),d=ev.target.closest('[data-tdel]');
  if(u){const[k,id]=u.dataset.use.split(':');
   if(k=='pre'){const t=PAGE_TPL.find(x=>x[0]==id);if(t){applyTpl(v,t[3],t[2]);toast('"'+t[1]+'" загвар хэрэглэгдлээ. Хадгалахаа мартуузай!')}}
   else{const t=TPLD[id];if(t){applyTpl(v,t.theme,t.accent);sb.rpc('tpl_use',{p_id:+id}).then(()=>{},()=>{});toast('"'+t.name+'" загвар хэрэглэгдлээ. Хадгалахаа мартуузай!')}}}
  else if(f){if(!cool('fav',500))return;const{data}=await sb.rpc('tpl_fav',{p_id:+f.dataset.fav});if(data==null)return toast(ERR.rate);const n=f.querySelector('span');f.classList.toggle('on',data);n.textContent=Math.max(0,+n.textContent+(data?1:-1))}
  else if(d){if(!(await dlg({icon:'trash',danger:true,title:'Загварыг устгах уу?',ok:'Устгах'})))return;const{data,error}=await sb.rpc('tpl_delete',{p_id:+d.dataset.tdel});toast(error?error.message:data=='ok'?'Устгагдлаа':(ERR[data]||data));tplLoad(cur)}
 });
 const pb=document.getElementById('tplp');
 if(pb)pb.onclick=async()=>{
  const name=await dlg({icon:'upload',title:'Загвараа нийтлэх',body:'Таны одоогийн өнгө, фонт, хэлбэр бусдад загвар болж харагдана (зураг, дуу, видео ороогүй). Хамгийн ихдээ 5 загвар.',input:{placeholder:'Загварын нэр (жишээ: Night Gold)',max:30},ok:'Нийтлэх'});
  if(!name)return;if(name.length<2)return toast('Нэр хэт богино байна');
  const t=themeObj(),th={};TKEYS.forEach(k=>{if(t[k]!==undefined)th[k]=t[k]});
  const{data,error}=await sb.rpc('tpl_publish',{p_name:name,p_theme:th,p_accent:S.ac});
  toast(error?error.message:data=='ok'?'Загвар нийтлэгдлээ!':{verified:'Зөвхөн баталгаажсан хэрэглэгч нийтэлнэ',max:'Хамгийн ихдээ 5 загвар нийтэлнэ',name:'Нэр 2-30 тэмдэгт байна',rate:ERR.rate,invalid:'Загвар буруу байна'}[data]||String(data));
  if(data=='ok'){const m=c.querySelector('[data-tt="mine"]');if(m)m.click()}};
}
/* ---------- Баталгаажсан тэмдэг хүсэх ---------- */
const VERR={need:'Эхлээд нэр, профайл зураг, дор хаяж 1 холбоосоо хадгална уу',proof:'Нотлох холбоос https:// -ээр эхэлсэн байх ёстой',open:'Таны хүсэлт шалгагдаж байна',wait:'Татгалзсанаас хойш 14 хоногийн дараа дахин илгээнэ',already:'Та аль хэдийн баталгаажсан',denied:'Боломжгүй'};
async function loadVerify(){
 const el=document.getElementById('vrq');if(!el)return;
 if((me.badges||[]).some(x=>String(x).toLowerCase()=='verified')){el.innerHTML=`<div class="vok">${ic('badge',28)}<div><b>Та баталгаажсан хэрэглэгч!</b><small class="mu">Платформын дүрсээ өөрийн зургаар солих, загвараа нийтлэх боломжтой.</small></div></div>`;return}
 const r=await sb.from('verify_req').select('status,reply,created_at').eq('user_id',me.id).order('id',{ascending:false}).limit(1);
 if(!el.isConnected)return;
 const last=(r.data||[])[0],need=[['Хэрэглэгчийн нэр',!!me.username],['Профайл зураг',!!me.avatar_url],['Дор хаяж 1 холбоос',(me.links||[]).length>0]],ok=need.every(x=>x[1]);
 if(last&&last.status=='open'){el.innerHTML=`<div class="vok wait">${ic('pulse',24)}<div><b>Хүсэлт шалгагдаж байна</b><small class="mu">${new Date(last.created_at).toLocaleDateString()}-нд илгээсэн. Модератор удахгүй шийднэ.</small></div></div>`;return}
 el.innerHTML=`<p class="mu" style="margin-bottom:10px">Баталгаажсан тэмдэг нь таныг жинхэнэ хүн/брэнд гэдгийг харуулна. Мөн платформын дүрсээ солих, загвараа нийтлэх эрх нээгдэнэ.</p>${last&&last.status=='rejected'?`<div class="tip warn">${ic('alert',16)}<span>Өмнөх хүсэлт татгалзагдсан${last.reply?': '+e(last.reply):''}</span></div>`:''}<ul class="ckl">${need.map(x=>`<li class="${x[1]?'on':''}"><span>${x[1]?ic('check',14,2.4):''}</span>${x[0]}</li>`).join('')}</ul>
 <div class="fl"><label>Таныг нотлох холбоос</label><input id="vpf" maxlength="300" placeholder="https://instagram.com/таны_нэр" autocomplete="off" autocapitalize="none"${ok?'':' disabled'}><small>Таны нэртэй, олон дагагчтай сошиал хуудас. Тэр хуудасныхаа bio-д biof.site/${e(me.username||'нэр')} холбоосыг түр тавивал хурдан баталгаажна.</small></div>
 <div class="fl"><label>Нэмэлт тайлбар (заавал биш)</label><textarea id="vnt" rows="2" maxlength="500"${ok?'':' disabled'}></textarea></div><button type="button" id="vsb"${ok?'':' disabled'}>${ic('badge',16)}Хүсэлт илгээх</button>`;
 const b=document.getElementById('vsb');
 b.onclick=async()=>{
  let pf=document.getElementById('vpf').value.trim();if(pf&&!/^https?:\/\//i.test(pf))pf='https://'+pf;
  if(!/^https:\/\/\S{4,}$/.test(pf))return toast(VERR.proof);
  if(!cool('verify',4000))return;b.disabled=true;
  const{data,error}=await sb.rpc('request_verify',{p_proof:pf,p_note:document.getElementById('vnt').value});
  b.disabled=false;if(error)return toast(error.message);
  if(data=='ok'){toast('Хүсэлт илгээгдлээ!');loadVerify()}else toast(VERR[data]||String(data))};
}
