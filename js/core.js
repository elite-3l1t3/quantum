window.__v=window.__v||{};window.__v.core=9;
if(window.top!==window.self){try{window.top.location=window.self.location}catch{}document.documentElement.style.display='none'}
const SB_URL='https://zyrpzoqdoorekspavocs.supabase.co', SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cnB6b3Fkb29yZWtzcGF2b2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODk4OTIsImV4cCI6MjEwODE2NTg5Mn0.ilCd_6g1W7G4S9N3iYXBRwjOEqgYInysBLcH6h233as';
/* Өгөгдлийн сан (Supabase) унтарсан / холбогдохгүй үед харуулах засварын хуудас. Өөр ямар ч файлаас хамаарахгүй. */
function downPage(why){
 const a=document.getElementById('app');if(!a)return;
 document.body.classList.remove('prof');document.body.style.cssText='';document.title='Засвартай · biof';
 let n=30;
 a.innerHTML=`<div class="w"><div class="dwn"><div class="dwi"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/></svg></div><h1>Түр засвартай байна</h1><p class="mu">${why=='cdn'?'Сайтын нэг хэсэг ачаалагдсангүй. Интернэт холболтоо шалгаад дахин оролдоно уу.':'Өгөгдлийн сан түр хугацаанд идэвхгүй байна. Таны мэдээлэл аюулгүй хадгалагдаж байгаа. Бид удахгүй хэвийн болгоно.'}</p><div class="dws"><div class="srow"><span class="dot ok"></span><b>Вэб сайт</b><em class="ok">Хэвийн</em></div><div class="srow"><span class="dot down"></span><b>${why=='cdn'?'Сангийн холболт':'Өгөгдлийн сан'}</b><em class="down">Саатсан</em></div><div class="srow"><span class="dot down"></span><b>Нэвтрэлт, хуудсууд</b><em class="down">Түр зогссон</em></div></div><p class="mu" style="margin:14px 0">Автоматаар дахин шалгана: <b id="dwn">${n}</b> сек</p><div class="act"><button type="button" id="dwr">Одоо дахин шалгах</button><a href="/status"><button type="button" class="g">Статус хуудас</button></a></div></div></div>`;
 clearInterval(window.DWN);
 window.DWN=setInterval(()=>{n--;const el=document.getElementById('dwn');if(el)el.textContent=Math.max(0,n);if(n<=0){clearInterval(window.DWN);location.reload()}},1000);
 const b=document.getElementById('dwr');if(b)b.onclick=()=>location.reload();
}
if(!window.supabase){downPage('cdn');throw Error('supabase missing')}
const sb=supabase.createClient(SB_URL,SB_KEY);
/* Сервер амьд эсэхийг шалгах (5xx, 540 paused, сүлжээний алдаа, 9 сек хариугүй бол унтарсан гэж үзнэ) */
async function health(){
 const one=async()=>{const c=new AbortController(),t=setTimeout(()=>c.abort(),9000);
  try{const r=await fetch(SB_URL+'/rest/v1/site?select=id&limit=1',{headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY},signal:c.signal,cache:'no-store'});return r.status<500}
  catch{return false}finally{clearTimeout(t)}};
 return await one()||await one();
}
const $=s=>document.querySelector(s), app=$('#app');
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^(https?:\/\/|mailto:)/i.test(u||'')?u:'#';
const MEDIA=SB_URL+'/storage/v1/object/public/media/';
const OKH=[MEDIA,'https://cdn.discordapp.com/'];
const cu=u=>OKH.some(x=>(u||'').startsWith(x))&&/^https?:\/\/[^\s"'()\\]+$/i.test(u)?u:'';
/* Холбоосын өөрийн дүрс: links[].img = "lk_xxxxxxxx.webp?v=..." (эзэмшигчийн хавтсанд) */
const LKIMG=/^lk_[a-z0-9]{8}\.(webp|png|jpg|gif)(\?v=\d{1,15})?$/;
const limg=(p,l)=>l&&l.img&&p&&p.id&&LKIMG.test(l.img)?MEDIA+p.id+'/'+l.img:'';
const canIco=p=>!!p&&(p.role=='admin'||(p.badges||[]).some(x=>String(x).toLowerCase()=='verified'));
/* Discord төлөв (Lanyard) түр засвартай. Засвар дуусвал true болго. */
const PRESENCE_ON=false;
const av=p=>cu(p.avatar_url)?`<img class="av" loading="lazy" decoding="async" alt="" src="${e(p.avatar_url)}">`:`<span class="av">${e((p.display_name||p.username||'?')[0].toUpperCase())}</span>`;
const DEMO={id:null,bid:1,username:'a',display_name:'Bold',bio:'Сайн байна уу! Би Болд — дизайнер, хөгжимд дуртай. Миний бүх холбоос энд байна 👇',accent:'#e2b858',views:12840,likes:964,role:'user',badges:['verified','staff'],
 links:[{label:'Instagram',url:'https://instagram.com',icon:'instagram',hl:1,ds:'Өдөр бүр шинэ зураг'},{label:'TikTok',url:'https://tiktok.com',icon:'tiktok',ds:'Богино бичлэгүүд'},{label:'YouTube',url:'https://youtube.com',icon:'youtube',ds:'Дуу, клип'},{label:'Spotify',url:'https://spotify.com',icon:'spotify'},{label:'Discord',url:'https://discord.com',icon:'discord'},{label:'Portfolio',url:'https://biof.site',icon:'web',ds:'Дизайны ажлууд'}],
 theme:{set:true,loc:'Улаанбаатар',st:'Шинэ дуугаа бичиж байна 🎧',tz:'Asia/Ulaanbaatar',ab:{job:'Дизайнер',sch:'МУИС',gm:'Minecraft'},cd:{t:'Шинэ дуу гарахад',at:new Date(Date.now()+864e5*12).toISOString().slice(0,11)+'20:00'},tw:true,op:.9,r:26,bfx:'ember',cc:'#141416',bgc:'#0a0908',bgg:{a:'#3a2a0c',b:'#0b0b12',d:160},tc:'#f6f0e4',ic:'#2c2a24',pic:'brand',grad:true,tl:true,gs:true,gb:true,fx:'sparkle',frame:'gold',lan:'up',lh:'lift',noad:true}};
const toast=m=>{if([...document.querySelectorAll('.toast')].some(x=>x.textContent==m))return;const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),6000)};
const NOISE=/[Tt]ransition was (aborted|skipped)|ViewTransition|ResizeObserver|Script error|AbortError|The play\(\) request|play\(\) failed|NotAllowedError|The user aborted|Load failed|NetworkError when attempting|Failed to fetch/i;
addEventListener('error',x=>{if(!x.message||NOISE.test(x.message))return;console.error(x.error||x.message);toast('Алдаа: '+x.message)});
addEventListener('unhandledrejection',x=>{const r=x.reason,m=(r&&r.message)||String(r||'');if((r&&r.name=='AbortError')||NOISE.test(m))return;console.error(r);toast('Алдаа: '+m)});
let me=null,user=null,aud=null;
const bc=u=>(typeof PL!='undefined'&&PL[platFor(u)]||[])[1]||'#e2b858';
const go=p=>{location.href=p};
const ERR={taken:'Энэ нэр аль хэдийн авагдсан байна',invalid:'Нэр 3-20 тэмдэгт байх ба зөвхөн a-z, 0-9, _ ашиглана',cooldown:'Нэрээ 7 хоногт нэг л удаа солино',banned:'Таньд эрх алга',closed:'Бүртгэл одоогоор түр хаалттай байна',rate:'Хэт олон оролдлого хийлээ. Хэдэн секундийн дараа дахин оролдоно уу.',young:'Бүртгэл үүсгэж чадсангүй. Дахин оролдоно уу.',full:'Өнөөдрийн бүртгэлийн хязгаар дүүрсэн. Маргааш дахин оролдоно уу.',none:'Хуудас олдсонгүй',self:'Өөрийн хуудсыг мэдэгдэх боломжгүй',dup:'Та энэ хуудсыг аль хэдийн мэдэгдсэн байна',short:'Дор хаяж 10 тэмдэгт бичнэ үү',open:'Таны хүсэлт шалгагдаж байна',wait:'24 цагт нэг удаа хүсэлт илгээнэ',max:'Хүсэлтийн хязгаар дууссан',notbanned:'Таны бүртгэл хориглогдоогүй байна'};

try{const r=new URLSearchParams(location.search).get('ref');if(r&&/^[a-z0-9_]{3,20}$/i.test(r)){localStorage.ref=r.toLowerCase();const u=new URL(location.href);u.searchParams.delete('ref');history.replaceState(0,'',u.pathname+u.search+u.hash)}}catch{}
async function loadMe(){
 const{data:{session}}=await sb.auth.getSession();user=session?.user||null;me=null;
 if(!user)return;
 const q=()=>sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
 const r0=await q();if(r0.error&&r0.status>=500)throw Error('db');me=r0.data;
 if(!me){const r=await sb.rpc('ensure_profile');me=(await q()).data;if(!me){const m=(r.error&&r.error.message)||'';toast(/registration_closed/.test(m)?'Бүртгэл одоогоор түр хаалттай байна.':/daily_limit/.test(m)?ERR.full:r.data=='rate'?ERR.rate:r.data=='unconfirmed'?'Имэйлээ баталгаажуулна уу (кодоо оруулна уу).':r.data=='email_closed'?'Имэйлээр бүртгүүлэх түр хаалттай байна. Discord-оор нэвтэрнэ үү.':m?'Профайл үүссэнгүй: '+m:'Профайл үүссэнгүй. SQL файлуудыг ажиллуулсан эсэхээ шалгана уу.');return}}
 if(!me.username&&localStorage.pending){const u=localStorage.pending;localStorage.removeItem('pending');const{data}=await sb.rpc('claim_username',{u});if(data&&data!='ok')toast(ERR[data]||String(data));me=(await q()).data}
 if(me&&me.username&&localStorage.ref&&!me.banned){const{data,error}=await sb.rpc('use_ref',{p_ref:localStorage.ref});if(!error&&!['later','rate'].includes(data))localStorage.removeItem('ref');if(data=='ok'){toast('Урилгаар нэгдсэн тул "Найз" тэмдэг авлаа!');me=(await q()).data||me}}
}
const LGN={mn:'MN',en:'EN',ru:'RU'};
/* Үйлчилгээний нөхцөл / Нууцлалын бодлогын хувилбар. Баримтыг өөрчлөх бүрд нэмэгдүүлж, TERMS_CHANGES-д товч бичнэ. */
const TERMS_VER=2,TERMS_DATE='2026-11-20';
const TERMS_CHANGES=['Бүртгүүлэхэд зөвшөөрлөө чагтлах ба таны зөвшөөрлийг (огноо, хувилбар) хадгална','Мэдээлэл Монголоос гадуурх серверт (Supabase) хадгалагддаг тухай','16 хүрээгүй бол эцэг эх, асран хамгаалагчийн зөвшөөрөл','Мэдээлэл алдагдвал мэдэгдэх, таны эрх, хэрхэн гомдол гаргах'];
/* Нэвтэрсэн хэрэглэгч шинэ нөхцөлийг зөвшөөрөөгүй бол асууна (хуулийн шаардлага). SQL (v14) байхгүй бол асуухгүй. */
/* Зөвшөөрлийн чагт дутуу бол цонхон дотроо улаан анхааруулга (toast цонхны ард нуугдахгүй) */
function cnErr(root){
 const l=root.querySelector('.cns');if(!l)return;
 let m=root.querySelector('.cnerr');if(!m){m=document.createElement('div');m.className='cnerr';m.setAttribute('role','alert');m.innerHTML=ic('alert',16)+'<span>Үргэлжлүүлэхийн тулд дээрх нүдийг чагтлана уу</span>';l.after(m);
  const c=l.querySelector('input');if(c)c.addEventListener('change',()=>{if(c.checked){m.hidden=true;l.classList.remove('bad')}})}
 m.hidden=false;l.classList.add('bad');l.classList.remove('shk');void l.offsetWidth;l.classList.add('shk');
 const c=l.querySelector('input');if(c)c.focus({preventScroll:true});m.scrollIntoView({block:'nearest',behavior:'smooth'});
}
/* Хэрэглэгчийн нэргүй (шинэ) хүнд хуудасны хаяг сонгуулна. Нөхцөлийн цонх нээлттэй бол хаагдахыг хүлээнэ. */
async function nameCheck(){
 if(!me||me.username||me.banned||document.querySelector('.ndlg')||document.body.dataset.p=='doc')return;
 if(document.querySelector('.tdlg,.lgd,.tour')){setTimeout(()=>nameCheck(),900);return}
 try{if(sessionStorage.nameLater)return}catch{}
 const d=document.createElement('div');d.className='dlgb ndlg';let ok=false,t=0;
 const sug=String((user&&user.user_metadata&&(user.user_metadata.user_name||user.user_metadata.name||user.user_metadata.full_name))||(user&&user.email||'').split('@')[0]||'').toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20);
 d.innerHTML=`<div class="dlg lgbox" role="dialog" aria-modal="true" aria-labelledby="ndt"><div class="dlgi">${ic('user',26)}</div><h3 id="ndt">Хуудасныхаа хаягийг сонгоорой</h3><p class="mu">Таны хуудасны хаяг: <b>biof.site/таны-нэр</b>. Энэ хаягаар найзууд чинь хуудсыг тань олно.</p><div class="lgu"><span>biof.site/</span><input id="nun" maxlength="20" placeholder="таны нэр" autocomplete="off" autocapitalize="none" spellcheck="false" value="${e(sug.length>=3?sug:'')}"></div><small class="lgst mu" id="nst">Зөвхөн англи жижиг үсэг, тоо, _ (3-20 тэмдэгт)</small><div class="act dla"><button type="button" class="g" id="nlt">Дараа</button><button type="button" id="nok" disabled>Энэ нэрийг авах</button></div><small class="mu" style="display:block;margin-top:10px">Нэрээ 7 хоногт нэг удаа сольж болно.</small></div>`;
 document.body.append(d);
 const i=d.querySelector('#nun'),st=d.querySelector('#nst'),b=d.querySelector('#nok');
 const set=(c,h)=>{st.className='lgst '+c;st.innerHTML=h;b.disabled=!ok};
 const chk=()=>{clearTimeout(t);ok=false;const u=i.value;
  if(!/^[a-z0-9_]{3,20}$/.test(u)){set('mu',u?'3-20 тэмдэгт, зөвхөн a-z, 0-9, _':'Зөвхөн англи жижиг үсэг, тоо, _ (3-20 тэмдэгт)');return}
  set('mu','Шалгаж байна…');
  t=setTimeout(async()=>{const{data}=await sb.rpc('username_status',{u});if(u!=i.value)return;ok=data=='available';set(ok?'okk':'bad2',ok?ic('check',14)+' biof.site/'+e(u)+' сул байна':e(ERR[data]||'Энэ нэрийг авах боломжгүй'))},350)};
 i.oninput=()=>{i.value=i.value.toLowerCase().replace(/[^a-z0-9_]/g,'');chk()};
 i.onkeydown=ev=>{if(ev.key=='Enter'&&!b.disabled)b.click()};
 d.querySelector('#nlt').onclick=()=>{try{sessionStorage.nameLater=1}catch{}d.classList.add('out');setTimeout(()=>d.remove(),180);toast('Хаягаа дараа нь "Миний самбар → Миний мэдээлэл" хэсгээс сонгож болно.')};
 b.onclick=async()=>{if(!ok||!cool('claim',1500))return;b.disabled=true;b.innerHTML='<span class="spin sm"></span>Хадгалж байна…';
  const{data,error}=await sb.rpc('claim_username',{u:i.value});
  if(error||data!='ok'){ok=false;set('bad2',e(error?error.message:(ERR[data]||String(data))));b.textContent='Энэ нэрийг авах';return}
  d.remove();await loadMe();toast('Баяр хүргэе! Таны хаяг: biof.site/'+me.username);if(typeof route=='function')route()};
 chk();setTimeout(()=>i.focus(),80);
}
async function termsCheck(){
 if(!me||me.banned||document.querySelector('.tdlg'))return;
 const r=await Promise.resolve(sb.from('profile_private').select('consent_ver').eq('id',me.id).maybeSingle()).catch(()=>({error:1}));
 if(!r||r.error)return;
 const cur=(r.data&&r.data.consent_ver)||0;if(cur>=TERMS_VER)return;
 if(+localStorage.consent>=TERMS_VER){const a=await sb.rpc('accept_terms',{p_ver:TERMS_VER});if(!a.error&&a.data=='ok')return}
 const d=document.createElement('div');d.className='dlgb tdlg';
 d.innerHTML=`<div class="dlg" role="dialog" aria-modal="true"><div class="dlgi">${ic('lock',26)}</div><h3>${cur?'Нөхцөл шинэчлэгдлээ':'Нөхцөлийг зөвшөөрнө үү'}</h3><p class="mu">${TERMS_DATE}-ны өөрчлөлт:</p><ul class="ins">${TERMS_CHANGES.map(x=>`<li>${e(x)}</li>`).join('')}</ul><p class="mu"><a href="/tos" target="_blank">Үйлчилгээний нөхцөл</a> · <a href="/privacy" target="_blank">Нууцлалын бодлого</a></p><label class="cns"><input type="checkbox" id="tcn"><span>Би 13-аас дээш настай бөгөөд шинэчлэгдсэн нөхцөл, нууцлалын бодлогыг уншиж зөвшөөрч байна.</span></label><div class="act dla"><button type="button" class="g" id="tno">Гарах</button><button type="button" id="tok">Зөвшөөрөх</button></div></div>`;
 document.body.append(d);
 d.querySelector('#tno').onclick=async()=>{await sb.auth.signOut();try{localStorage.removeItem('consent')}catch{}go('/')};
 d.querySelector('#tok').onclick=async()=>{if(!d.querySelector('#tcn').checked)return cnErr(d);const a=await sb.rpc('accept_terms',{p_ver:TERMS_VER});if(a.error||a.data!='ok')return toast('Алдаа гарлаа. Дахин оролдоно уу.');try{localStorage.consent=TERMS_VER}catch{}d.remove();toast('Баярлалаа!')};
}
const bar=()=>`<nav><b><a href="/" aria-label="biof">biof</a></b><button class="g srb" id="srb" type="button" aria-label="Хайх" title="Хайх">${ic('search',18)}</button><button class="lgs g" id="lgs" type="button" aria-label="Хэл">${ic('globe',16)}<span>${LGN[localStorage.lang||'mn']||'MN'}</span></button>${me?`<a href="/settings"><button type="button" class="pnl">${ic('home',16)}<span>Миний самбар</span></button></a>`:'<button class="lg" type="button">Нэвтрэх</button>'}<button class="mnb g" id="mnb" type="button" aria-label="Цэс" aria-expanded="false">${ic('menu',20)}</button></nav>${me&&me.banned?'<div class="bad">Таны бүртгэлийг хориглосон байна.</div>':''}`;
const foot=()=>`<footer><div class="fnav"><a href="/tos">Үйлчилгээний нөхцөл</a><a href="/privacy">Нууцлалын бодлого</a><a href="/updates">Шинэчлэлт</a></div><p>© biof · Bio Flex</p></footer>`;

/* Нэвтрэх: Discord эсвэл имэйл рүү очих код */
const discordLogin=()=>sb.auth.signInWithOAuth({provider:'discord',options:{redirectTo:location.origin+'/'}});
/* Нэвтрэх сонголт (админ имэйлийг хааж болно, v15.sql). 1 мин кэш. ?email=1 бол хаалттай үед ч бүртгэлтэй имэйлээр нэвтэрч болно */
let AOPT=null,AOPT_T=0;
async function authOpts(){if(AOPT&&Date.now()-AOPT_T<6e4)return AOPT;try{const r=await Promise.race([sb.rpc('auth_opts'),new Promise(ok=>setTimeout(()=>ok({}),2500))]);if(r&&r.data&&typeof r.data=='object'){AOPT=r.data;AOPT_T=Date.now()}}catch{}return AOPT||{email:true}}
const emailOn=()=>!(AOPT&&AOPT.email===false)||/[?&]email=1\b/.test(location.search);
const authErr=(m,st)=>{m=String(m||'');
 if(AOPT&&AOPT.email===false&&/Database error|email_closed/i.test(m))return'Имэйлээр бүртгүүлэх түр хаалттай байна. Discord-оор нэвтэрнэ үү.';
 if(/Error sending (magic link|confirmation|recovery|email)/i.test(m)||/smtp/i.test(m))return'Имэйл илгээж чадсангүй. Сайтын имэйл (SMTP) тохиргоо буруу байна — админд хэлнэ үү.';
 if(/after \d+ seconds|rate limit|too many/i.test(m)||st==429)return'Хэт олон удаа оролдлоо. Түр хүлээгээд дахин оролдоно уу.';
 if(/registration_closed|daily_limit/i.test(m))return'Одоогоор шинэ бүртгэл авах боломжгүй байна (өдрийн хязгаар эсвэл түр хаалттай).';
 if(/Database error/i.test(m))return'Бүртгэл үүсгэхэд өгөгдлийн сангийн алдаа гарлаа. Админд хэлнэ үү (v8.sql ажиллуулсан эсэх).';
 if(/signups not allowed|Email signups are disabled|provider is not enabled|email_provider_disabled/i.test(m))return'Имэйлээр бүртгүүлэх түр боломжгүй байна. Discord-оор нэвтэрнэ үү.';
 if(/expired|invalid.*(otp|token)|token.*invalid/i.test(m))return'Код буруу эсвэл хугацаа нь дууссан байна.';
 if(/invalid.*email|unable to validate email/i.test(m))return'Имэйл хаяг буруу байна.';
 if(/fetch|network/i.test(m))return'Сүлжээний алдаа. Интернэтээ шалгана уу.';
 return m||'Алдаа гарлаа';};
/* Нэвтрэх / бүртгүүлэх цонх. mode: 'login' | 'signup'. name: урьдчилан бөглөх хэрэглэгчийн нэр */
function login(mode,name){
 if(document.querySelector('.lgd'))return;
 const d=document.createElement('div');d.className='dlgb lgd';
 let M=mode=='signup'?'signup':'login',email='',un=String(name||localStorage.pending||'').toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20),unOk=null,left=0,tm=0,ut=0;
 const close=()=>{clearInterval(tm);clearTimeout(ut);d.classList.add('out');setTimeout(()=>d.remove(),180);document.removeEventListener('keydown',kd)};
 const kd=ev=>{if(ev.key=='Escape')close()};
 const tabs=()=>`<div class="lgt" role="tablist"><button type="button" class="${M=='signup'?'on':''}" data-m="signup">Бүртгүүлэх</button><button type="button" class="${M=='login'?'on':''}" data-m="login">Нэвтрэх</button></div>`;
 const steps=n=>`<ol class="lgs2">${['Нэр сонгох','Баталгаажуулах','Бэлэн'].map((x,i)=>`<li class="${i<n?'dn':i==n?'on':''}"><i>${i<n?ic('check',12,3):i+1}</i>${x}</li>`).join('')}</ol>`;
 const cns=()=>`<label class="cns"><input type="checkbox" id="lcn"><span>Би 13-аас дээш настай (16 хүрээгүй бол эцэг эх, асран хамгаалагчийн зөвшөөрөлтэй) бөгөөд <a href="/tos" target="_blank">Үйлчилгээний нөхцөл</a>, <a href="/privacy" target="_blank">Нууцлалын бодлого</a>-ыг уншиж зөвшөөрч, мэдээллээ гадаадын сервер (Supabase) дээр хадгалахыг зөвшөөрч байна.</span></label>`;
 const okC=()=>{const c=d.querySelector('#lcn');if(c&&c.checked){try{localStorage.consent=TERMS_VER}catch{}return true}cnErr(d);return false};
 const ways=lbl=>`${M=='signup'?cns():''}<button type="button" class="dc lgdc">${plat('discord',24)}Discord-оор ${lbl}</button>${emailOn()?'':`<div class="emoff">${ic('shield',16)}<span>Имэйлээр нэвтрэх, бүртгүүлэх түр хаалттай байна. Discord-оор нэвтэрнэ үү.</span></div>`}`+(emailOn()?`<div class="or">эсвэл имэйлээр</div><input class="dli" id="lem" type="email" inputmode="email" autocomplete="email" maxlength="120" placeholder="name@mail.com" value="${e(email)}"><button type="button" id="lsend">${ic('arrow',16)}Имэйл рүү код авах</button>`:'');
 const step1=()=>{
  const sign=M=='signup';
  d.innerHTML=`<div class="dlg lgbox" role="dialog" aria-modal="true"><button class="g mnx lgx" type="button" aria-label="Хаах">${ic('x',18)}</button>${tabs()}${sign?`${steps(0)}<h3>biof хуудсаа үүсгэе</h3><p class="mu">Эхлээд хаягаа сонго. Дараа нь Discord эсвэл имэйлээ баталгаажуулна. Нууц үг хэрэггүй.</p><div class="lgu"><span>biof.site/</span><input id="lun" maxlength="20" placeholder="таны нэр" autocomplete="off" autocapitalize="none" spellcheck="false" value="${e(un)}"></div><small class="lgst mu" id="lst">Зөвхөн a-z, 0-9, _ (3-20 тэмдэгт)</small><div id="lw" class="lgw">${ways('үргэлжлүүлэх')}</div>`:`<div class="dlgi">${ic('user',26)}</div><h3>Тавтай морил!</h3><p class="mu">Discord эсвэл имэйлээрээ нэвтэрнэ үү. Шинэ имэйл бол автоматаар бүртгэнэ.</p>${ways('нэвтрэх')}<p class="mu lgm2">Бүртгэлгүй юу? <a href="#" data-m="signup">Бүртгүүлэх</a></p><p class="mu lgm2 lgl">Нэвтэрснээр та <a href="/tos" target="_blank">Үйлчилгээний нөхцөл</a>-ийг хүлээн зөвшөөрнө. Зөвшөөрөл өгөөгүй бол нэвтэрсний дараа асууна.</p>`}</div>`;
  d.querySelector('.lgdc').onclick=()=>{if(sign&&!pend())return;if(sign&&!okC())return;d.querySelector('.lgdc').disabled=true;discordLogin()};
  const i=d.querySelector('#lem');if(i){i.onkeydown=ev=>{if(ev.key=='Enter')send()};d.querySelector('#lsend').onclick=send}
  const u=d.querySelector('#lun');
  if(u){u.oninput=()=>{u.value=u.value.toLowerCase().replace(/[^a-z0-9_]/g,'');un=u.value;unOk=null;chkUn()};chkUn();setTimeout(()=>(un&&i?i:u).focus(),60)}else if(i)setTimeout(()=>i.focus(),60);
 };
 const setSt=(c,t)=>{const s=d.querySelector('#lst');if(s){s.className='lgst '+c;s.innerHTML=t}const w=d.querySelector('#lw');if(w)w.classList.toggle('off',unOk!==true)};
 const chkUn=()=>{clearTimeout(ut);
  if(!/^[a-z0-9_]{3,20}$/.test(un)){unOk=false;setSt('mu',un?'3-20 тэмдэгт, зөвхөн a-z, 0-9, _':'Зөвхөн a-z, 0-9, _ (3-20 тэмдэгт)');return}
  setSt('mu','Шалгаж байна…');
  ut=setTimeout(async()=>{const q=un,{data}=await sb.rpc('username_status',{u:q});if(q!=un)return;unOk=data=='available';setSt(unOk?'okk':'bad2',unOk?ic('check',14)+' biof.site/'+e(q)+' сул байна':e(ERR[data]||'Энэ нэрийг авах боломжгүй'))},350)};
 const pend=()=>{if(unOk!==true){toast(un?'Өөр нэр сонгоно уу':'Эхлээд хаягаа сонгоно уу');const u=d.querySelector('#lun');u&&u.focus();return false}localStorage.pending=un;return true};
 const send=async()=>{
  if(!emailOn()){toast('Имэйлээр нэвтрэх түр хаалттай байна. Discord-оор нэвтэрнэ үү.');return}
  if(M=='signup'&&!d.querySelector('#lcode')&&!pend())return;
  if(M=='signup'&&!d.querySelector('#lcode')&&!okC())return;
  const i=d.querySelector('#lem');email=(i?i.value:email).trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){toast('Имэйл хаягаа зөв бичнэ үү');i&&i.focus();return}
  if(!cool('otp',3000))return;
  const b=d.querySelector('#lsend,#lres');const bt=b&&b.innerHTML;if(b){b.disabled=true;b.innerHTML='<span class="spin sm"></span>Илгээж байна…'}
  const{error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:location.origin+'/'}});
  if(error){console.warn('OTP алдаа:',error.status,error.code,error.message);
   toast(authErr(error.message,error.status));if(b){b.disabled=false;b.innerHTML=bt}return}
  step2()};
 const step2=()=>{
  d.innerHTML=`<div class="dlg lgbox" role="dialog" aria-modal="true"><button class="g mnx lgx" type="button" aria-label="Хаах">${ic('x',18)}</button>${M=='signup'?steps(1):`<div class="dlgi">${ic('lock',26)}</div>`}<h3>Имэйлээ шалгана уу</h3><p class="mu"><b>${e(email)}</b> хаяг руу код илгээлээ. Ирэхгүй бол Spam хавтсаа шалгаарай.</p><input class="dli otp" id="lcode" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="Код"><button type="button" id="lver">${ic('check',16)}Баталгаажуулах</button><div class="act" style="margin-top:6px"><button type="button" class="g" id="lback">Буцах</button><button type="button" class="g" id="lres" disabled>Код дахин илгээх</button></div></div>`;
  const c=d.querySelector('#lcode');setTimeout(()=>c.focus(),60);
  let at=0;c.oninput=ev=>{c.value=c.value.replace(/\D/g,'').slice(0,10);clearTimeout(at);if(c.value.length>=6)at=setTimeout(verify,ev.inputType=='insertFromPaste'||c.value.length>=8?150:1200)};
  c.onkeydown=ev=>{if(ev.key=='Enter')verify()};
  d.querySelector('#lver').onclick=verify;d.querySelector('#lback').onclick=step1;d.querySelector('#lres').onclick=send;
  left=60;clearInterval(tm);tm=setInterval(()=>{left--;const r=d.querySelector('#lres');if(!r){clearInterval(tm);return}if(left<=0){clearInterval(tm);r.disabled=false;r.textContent='Код дахин илгээх'}else r.textContent='Дахин илгээх ('+left+')'},1000)};
 const verify=async()=>{
  const c=d.querySelector('#lcode'),token=(c&&c.value||'').trim();
  if(!/^\d{6,10}$/.test(token)){toast('Имэйлд ирсэн кодоо бүтэн оруулна уу');return}
  const b=d.querySelector('#lver');if(!b||b.disabled)return;b.disabled=true;b.innerHTML='<span class="spin sm"></span>Шалгаж байна…';
  const{error}=await sb.auth.verifyOtp({email,token,type:'email'});
  if(error){console.warn('Код шалгах алдаа:',error.status,error.code,error.message);toast(authErr(error.message,error.status));b.disabled=false;b.innerHTML=ic('check',16)+'Баталгаажуулах';c.select();return}
  close();toast(M=='signup'?'Бүртгэл амжилттай! Хуудсаа тохируулцгаая.':'Амжилттай нэвтэрлээ');
  if(M=='signup')setTimeout(()=>{if(location.pathname!='/settings')go('/settings')},900)};
 d.onclick=ev=>{if(ev.target==d||ev.target.closest('.lgx'))return close();const m=ev.target.closest('[data-m]');if(m){ev.preventDefault();if(m.dataset.m!=M){M=m.dataset.m;step1()}}};
 document.addEventListener('keydown',kd);document.body.append(d);step1();
 const em0=emailOn();authOpts().then(()=>{if(d.isConnected&&emailOn()!=em0&&!d.querySelector('#lcode'))step1()});
}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('.lg');if(b)login(b.dataset.mode,b.dataset.name)});

const chrome=()=>{if(!document.querySelector('nav')){app.insertAdjacentHTML('afterbegin',bar());app.insertAdjacentHTML('beforeend',foot())}};

async function getStatus(){
 const t0=performance.now(),r=await Promise.race([sb.rpc('site_status'),new Promise(ok=>setTimeout(()=>ok({data:null,error:{message:'timeout'}}),10000))]);
 return{d:r.data,ms:Math.round(performance.now()-t0),err:r.error};
}

const cool=(k,ms)=>{const n=Date.now();if(cool.t[k]&&n-cool.t[k]<ms)return false;cool.t[k]=n;return true};cool.t={};

/* Хориглогдсон хэрэглэгчид харагдах дэлгэц + давж заалдах хүсэлт */
const APST={open:['Шалгагдаж байна','slow'],accepted:['Зөвшөөрсөн','ok'],rejected:['Татгалзсан','down']};
async function banPage(v){
 const[pr,ap]=await Promise.all([sb.from('profile_private').select('ban_reason').eq('id',me.id).maybeSingle(),sb.from('appeals').select('id,body,status,created_at').eq('user_id',me.id).order('id',{ascending:false}).limit(5)]);
 const reason=(pr.data&&pr.data.ban_reason)||'Дүрэм зөрчсөн',L=ap.data||[],open=L.find(x=>x.status=='open');
 v.innerHTML=`<div class="dash"><div class="cd banbox"><span class="bnic">${ic('shield',44)}</span><h2>Таны бүртгэлийг хориглосон байна</h2><p class="mu" style="margin-top:6px">${me.username?'@'+e(me.username)+' · ':''}#${me.bid}</p><div class="bnr"><small class="mu">Шалтгаан</small><b>${e(reason)}</b></div><p class="mu">Хориглогдсон үед хуудас тань нийтэд харагдахгүй, тохиргоо хийх боломжгүй.</p></div>
 <h2 class="sh">Давж заалдах</h2><div class="cd">${open?`<p>${ic('pulse',16)} Таны хүсэлт админд очсон. Хариуг энд харна.</p>`:`<p class="mu" style="margin-bottom:10px">Алдаатай хориглосон гэж бодож байвал юу болсныг тайлбарлаж бичнэ үү. Админ шалгаад шийднэ.</p><textarea id="apb" rows="4" maxlength="1000" placeholder="Жишээ нь: Миний хуудсанд ... байсан нь буруу ойлголт байсан. Цаашид дүрмээ мөрдөнө."></textarea><div class="act" style="justify-content:flex-end"><small class="mu" id="apn" style="margin-right:auto">0 / 1000</small><button type="button" id="aps">${ic('arrow',16)}Илгээх</button></div>`}
 ${L.length?`<div class="apl">${L.map(a=>`<div class="row"><span style="flex:1"><small class="mu">${new Date(a.created_at).toLocaleDateString()}</small><br>${e(a.body.slice(0,140))}${a.body.length>140?'…':''}</span><em class="stt ${(APST[a.status]||APST.open)[1]}">${(APST[a.status]||APST.open)[0]}</em></div>`).join('')}</div>`:''}</div>
 <div class="act" style="margin-top:16px"><a href="/tos"><button type="button" class="g">Үйлчилгээний нөхцөл</button></a><button type="button" class="g" id="blo">${ic('logout',16)}Гарах</button></div></div>`;
 v.querySelector('#blo').onclick=async()=>{await sb.auth.signOut();go('/')};
 const t=v.querySelector('#apb');
 if(t){t.oninput=()=>{v.querySelector('#apn').textContent=t.value.length+' / 1000'};
  v.querySelector('#aps').onclick=async()=>{
   if(t.value.trim().length<10)return toast(ERR.short);
   if(!cool('appeal',4000))return;
   const{data,error}=await sb.rpc('submit_appeal',{p_body:t.value});
   if(error)return toast(error.message);
   if(data=='ok'){toast('Хүсэлт илгээгдлээ. Админ шалгана.');banPage(v)}else toast(ERR[data]||String(data))}}
}
