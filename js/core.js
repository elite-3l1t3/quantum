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
const av=p=>cu(p.avatar_url)?`<img class="av" loading="lazy" alt="" src="${e(p.avatar_url)}">`:`<span class="av">${e((p.display_name||p.username||'?')[0].toUpperCase())}</span>`;
const DEMO={id:null,bid:1,username:'a',display_name:'Bold',bio:'Сайн байна уу! Би Болд. Миний бүх холбоос энд байгаа.',accent:'#e2b858',views:12840,likes:964,role:'user',badges:['verified','staff'],links:[{label:'Facebook',url:'https://facebook.com',icon:'facebook'},{label:'Instagram',url:'https://instagram.com',icon:'instagram'},{label:'TikTok',url:'https://tiktok.com',icon:'tiktok'},{label:'YouTube',url:'https://youtube.com',icon:'youtube'},{label:'Discord',url:'https://discord.com',icon:'discord'},{label:'Telegram',url:'https://telegram.org',icon:'telegram'},{label:'Spotify',url:'https://spotify.com',icon:'spotify'}],theme:{set:true,loc:'Улаанбаатар',tw:true,op:.92,r:24,bfx:'ember',cc:'#121214',bgc:'#09090a',tc:'#f4efe6',ic:'#2a2a2e',pic:'text',grad:true,tl:true,gs:true,gb:true,fx:'sparkle'}};
const toast=m=>{if([...document.querySelectorAll('.toast')].some(x=>x.textContent==m))return;const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),6000)};
const NOISE=/ResizeObserver|Script error|AbortError|The play\(\) request|play\(\) failed|NotAllowedError|The user aborted|Load failed|NetworkError when attempting|Failed to fetch/i;
addEventListener('error',x=>{if(!x.message||NOISE.test(x.message))return;console.error(x.error||x.message);toast('Алдаа: '+x.message)});
addEventListener('unhandledrejection',x=>{const r=x.reason,m=(r&&r.message)||String(r||'');if((r&&r.name=='AbortError')||NOISE.test(m))return;console.error(r);toast('Алдаа: '+m)});
let me=null,user=null,aud=null;
const bc=u=>(typeof PL!='undefined'&&PL[platFor(u)]||[])[1]||'#e2b858';
const go=p=>{location.href=p};
const ERR={taken:'Энэ нэр аль хэдийн авагдсан байна',invalid:'Нэр 3-20 тэмдэгт байх ба зөвхөн a-z, 0-9, _ ашиглана',cooldown:'Нэрээ 7 хоногт нэг л удаа солино',banned:'Таньд эрх алга',closed:'Бүртгэл одоогоор түр хаалттай байна',rate:'Хэт олон оролдлого хийлээ. Хэдэн секундийн дараа дахин оролдоно уу.',young:'Бүртгэл үүсгэж чадсангүй. Дахин оролдоно уу.',full:'Өнөөдрийн бүртгэлийн хязгаар дүүрсэн. Маргааш дахин оролдоно уу.',none:'Хуудас олдсонгүй',self:'Өөрийн хуудсыг мэдэгдэх боломжгүй',dup:'Та энэ хуудсыг аль хэдийн мэдэгдсэн байна',short:'Дор хаяж 10 тэмдэгт бичнэ үү',open:'Таны хүсэлт шалгагдаж байна',wait:'24 цагт нэг удаа хүсэлт илгээнэ',max:'Хүсэлтийн хязгаар дууссан',notbanned:'Таны бүртгэл хориглогдоогүй байна'};

async function loadMe(){
 const{data:{session}}=await sb.auth.getSession();user=session?.user||null;me=null;
 if(!user)return;
 const q=()=>sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
 const r0=await q();if(r0.error&&r0.status>=500)throw Error('db');me=r0.data;
 if(!me){const r=await sb.rpc('ensure_profile');me=(await q()).data;if(!me){const m=(r.error&&r.error.message)||'';toast(/registration_closed/.test(m)?'Бүртгэл одоогоор түр хаалттай байна.':/daily_limit/.test(m)?ERR.full:r.data=='rate'?ERR.rate:m?'Профайл үүссэнгүй: '+m:'Профайл үүссэнгүй. SQL файлуудыг ажиллуулсан эсэхээ шалгана уу.');return}}
 if(!me.username&&localStorage.pending){const u=localStorage.pending;localStorage.removeItem('pending');const{data}=await sb.rpc('claim_username',{u});if(data&&data!='ok')toast(ERR[data]||String(data));me=(await q()).data}
}
const LGN={mn:'MN',en:'EN',ru:'RU'};
const bar=()=>`<nav><b><a href="/" aria-label="biof">biof</a></b><button class="lgs g" id="lgs" type="button" aria-label="Хэл">${ic('globe',16)}<span>${LGN[localStorage.lang||'mn']||'MN'}</span></button>${me?`<a href="/settings"><button type="button" class="pnl">${ic('home',16)}<span>Миний самбар</span></button></a>`:'<button class="lg" type="button">Нэвтрэх</button>'}<button class="mnb g" id="mnb" type="button" aria-label="Цэс" aria-expanded="false">${ic('menu',20)}</button></nav>${me&&me.banned?'<div class="bad">Таны бүртгэлийг хориглосон байна.</div>':''}`;
const foot=()=>`<footer><div class="fnav"><a href="/tos">Үйлчилгээний нөхцөл</a><a href="/privacy">Нууцлалын бодлого</a><a href="/status">Статус</a><a href="/#support">Дэмжих</a></div><p>© biof · Bio Flex</p></footer>`;

/* Нэвтрэх: Discord эсвэл имэйл рүү очих код */
const discordLogin=()=>sb.auth.signInWithOAuth({provider:'discord',options:{redirectTo:location.origin+'/'}});
const authErr=(m,st)=>{m=String(m||'');
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
 const ways=lbl=>`<button type="button" class="dc lgdc">${plat('discord',24)}Discord-оор ${lbl}</button><div class="or">эсвэл имэйлээр</div><input class="dli" id="lem" type="email" inputmode="email" autocomplete="email" maxlength="120" placeholder="name@mail.com" value="${e(email)}"><button type="button" id="lsend">${ic('arrow',16)}Имэйл рүү код авах</button>`;
 const step1=()=>{
  const sign=M=='signup';
  d.innerHTML=`<div class="dlg lgbox" role="dialog" aria-modal="true"><button class="g mnx lgx" type="button" aria-label="Хаах">${ic('x',18)}</button>${tabs()}${sign?`${steps(0)}<h3>biof хуудсаа үүсгэе</h3><p class="mu">Эхлээд хаягаа сонго. Дараа нь Discord эсвэл имэйлээ баталгаажуулна. Нууц үг хэрэггүй.</p><div class="lgu"><span>biof.site/</span><input id="lun" maxlength="20" placeholder="таны нэр" autocomplete="off" autocapitalize="none" spellcheck="false" value="${e(un)}"></div><small class="lgst mu" id="lst">Зөвхөн a-z, 0-9, _ (3-20 тэмдэгт)</small><div id="lw" class="lgw">${ways('үргэлжлүүлэх')}</div>`:`<div class="dlgi">${ic('user',26)}</div><h3>Тавтай морил!</h3><p class="mu">Бүртгэлтэй Discord эсвэл имэйлээрээ нэвтэрнэ үү.</p>${ways('нэвтрэх')}<p class="mu lgm2">Бүртгэлгүй юу? <a href="#" data-m="signup">Бүртгүүлэх</a></p>`}</div>`;
  d.querySelector('.lgdc').onclick=()=>{if(sign&&!pend())return;d.querySelector('.lgdc').disabled=true;discordLogin()};
  const i=d.querySelector('#lem');i.onkeydown=ev=>{if(ev.key=='Enter')send()};d.querySelector('#lsend').onclick=send;
  const u=d.querySelector('#lun');
  if(u){u.oninput=()=>{u.value=u.value.toLowerCase().replace(/[^a-z0-9_]/g,'');un=u.value;unOk=null;chkUn()};chkUn();setTimeout(()=>(un?i:u).focus(),60)}else setTimeout(()=>i.focus(),60);
 };
 const setSt=(c,t)=>{const s=d.querySelector('#lst');if(s){s.className='lgst '+c;s.innerHTML=t}const w=d.querySelector('#lw');if(w)w.classList.toggle('off',unOk!==true)};
 const chkUn=()=>{clearTimeout(ut);
  if(!/^[a-z0-9_]{3,20}$/.test(un)){unOk=false;setSt('mu',un?'3-20 тэмдэгт, зөвхөн a-z, 0-9, _':'Зөвхөн a-z, 0-9, _ (3-20 тэмдэгт)');return}
  setSt('mu','Шалгаж байна…');
  ut=setTimeout(async()=>{const q=un,{data}=await sb.rpc('username_status',{u:q});if(q!=un)return;unOk=data=='available';setSt(unOk?'okk':'bad2',unOk?ic('check',14)+' biof.site/'+e(q)+' сул байна':e(ERR[data]||'Энэ нэрийг авах боломжгүй'))},350)};
 const pend=()=>{if(unOk!==true){toast(un?'Өөр нэр сонгоно уу':'Эхлээд хаягаа сонгоно уу');const u=d.querySelector('#lun');u&&u.focus();return false}localStorage.pending=un;return true};
 const send=async()=>{
  if(M=='signup'&&!d.querySelector('#lcode')&&!pend())return;
  const i=d.querySelector('#lem');email=(i?i.value:email).trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){toast('Имэйл хаягаа зөв бичнэ үү');i&&i.focus();return}
  if(!cool('otp',3000))return;
  const b=d.querySelector('#lsend,#lres');const bt=b&&b.innerHTML;if(b){b.disabled=true;b.innerHTML='<span class="spin sm"></span>Илгээж байна…'}
  const{error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:M=='signup',emailRedirectTo:location.origin+'/'}});
  if(error){console.warn('OTP алдаа:',error.status,error.code,error.message);
   if(M=='login'&&/signups not allowed|not found|user_not_found|otp_disabled/i.test(error.message+' '+(error.code||''))){toast('Энэ имэйлээр бүртгэл алга. "Бүртгүүлэх" таб руу орно уу.');M='signup';step1();return}
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
