const SB_URL='https://zyrpzoqdoorekspavocs.supabase.co', SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cnB6b3Fkb29yZWtzcGF2b2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODk4OTIsImV4cCI6MjEwODE2NTg5Mn0.ilCd_6g1W7G4S9N3iYXBRwjOEqgYInysBLcH6h233as';
if(!window.supabase){document.getElementById('app').innerHTML='<p style="padding:40px;text-align:center">Supabase ачаалагдсангүй. Интернэтээ шалгаад дахин оролдоно уу.</p>';throw Error('supabase missing')}
const sb=supabase.createClient(SB_URL,SB_KEY);
const $=s=>document.querySelector(s), app=$('#app');
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^(https?:\/\/|mailto:)/i.test(u||'')?u:'#';
const OKH=[SB_URL+'/storage/v1/object/public/media/','https://cdn.discordapp.com/'];
const cu=u=>OKH.some(x=>(u||'').startsWith(x))&&/^https?:\/\/[^\s"'()\\]+$/i.test(u)?u:'';
const av=p=>cu(p.avatar_url)?`<img class="av" loading="lazy" alt="" src="${e(p.avatar_url)}">`:`<span class="av">${e((p.display_name||p.username||'?')[0].toUpperCase())}</span>`;
const DEMO={id:null,bid:1,username:'a',display_name:'Bold',bio:'Сайн байна уу! Би Болд. Миний бүх холбоос энд байгаа.',accent:'#e2b858',views:12840,likes:964,role:'user',badges:['verified','staff'],links:[{label:'Facebook',url:'https://facebook.com',icon:'facebook'},{label:'Instagram',url:'https://instagram.com',icon:'instagram'},{label:'TikTok',url:'https://tiktok.com',icon:'tiktok'},{label:'YouTube',url:'https://youtube.com',icon:'youtube'},{label:'Discord',url:'https://discord.com',icon:'discord'},{label:'Telegram',url:'https://telegram.org',icon:'telegram'},{label:'Spotify',url:'https://spotify.com',icon:'spotify'}],theme:{set:true,loc:'Улаанбаатар',tw:true,op:.92,r:24,bfx:'ember',cc:'#121214',bgc:'#09090a',tc:'#f4efe6',ic:'#2a2a2e',grad:true,tl:true,gs:true,gb:true,fx:'sparkle'}};
const toast=m=>{if([...document.querySelectorAll('.toast')].some(x=>x.textContent==m))return;const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),6000)};
addEventListener('error',x=>{if(!/ResizeObserver|Script error/.test(x.message||''))toast('Алдаа: '+x.message)});
addEventListener('unhandledrejection',x=>{if(x.reason&&x.reason.name=='AbortError')return;toast('Алдаа: '+(x.reason?.message||x.reason))});
let me=null,user=null,aud=null;
const bc=u=>(typeof PL!='undefined'&&PL[platFor(u)]||[])[1]||'#e2b858';
const login=()=>sb.auth.signInWithOAuth({provider:'discord',options:{redirectTo:location.origin+'/'}});
const go=p=>{location.href=p};
const ERR={taken:'Энэ нэр аль хэдийн авагдсан байна',invalid:'Нэр 3-20 тэмдэгт байх ба зөвхөн a-z, 0-9, _ ашиглана',cooldown:'Нэрээ 7 хоногт нэг л удаа солино',banned:'Таньд эрх алга',closed:'Бүртгэл одоогоор хаалттай байна',rate:'Хэт олон оролдлого хийлээ. Хэдэн секундийн дараа дахин оролдоно уу.',young:'Таны Discord акаунт хэт шинэ байна. Хэдэн хоногийн дараа дахин оролдоно уу.',full:'Өнөөдрийн бүртгэлийн хязгаар дүүрсэн. Маргааш дахин оролдоно уу.',none:'Хуудас олдсонгүй'};

async function loadMe(){
 const{data:{session}}=await sb.auth.getSession();user=session?.user||null;me=null;
 if(!user)return;
 const q=()=>sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
 me=(await q()).data;
 if(!me){const r=await sb.rpc('ensure_profile');me=(await q()).data;if(!me){toast(r.error&&/registration_closed/.test(r.error.message)?'Бүртгэл одоогоор хаалттай байна.':r.error&&/account_too_new/.test(r.error.message)?ERR.young:r.error&&/daily_limit/.test(r.error.message)?ERR.full:r.error?'ensure_profile: '+r.error.message:'Профайл үүссэнгүй. SQL файлуудыг ажиллуулсан эсэхээ шалгана уу.');return}}
 if(!me.username&&localStorage.pending){const u=localStorage.pending;localStorage.removeItem('pending');await sb.rpc('claim_username',{u});me=(await q()).data}
}
const LGN={mn:'MN',en:'EN',ru:'RU'};
const bar=()=>`<nav><b><a href="/" aria-label="biof">biof</a></b><div class="nls"><a class="nl" href="/leaderboard">Тэргүүлэгчид</a><a class="nl" href="/tutorial">Заавар</a><a class="nl" href="/a">Жишээ хуудас</a><a class="nl" href="/status">Статус</a></div><button class="lgs g" id="lgs" type="button" aria-label="Хэл">${ic('globe',16)}<span>${LGN[localStorage.lang||'mn']||'MN'}</span></button>${me?`${me.role=='admin'?'<a href="/admin"><button class="g" type="button">Админ самбар</button></a>':''}<a href="/settings"><button type="button">${ic('home',16)}Миний самбар</button></a>`:'<button class="lg" type="button">Discord-оор нэвтрэх</button>'}</nav>${me&&me.banned?'<div class="bad">Таны эрхийг хаасан байна.</div>':''}`;
const foot=()=>`<footer><div class="fnav"><a href="/tos">Үйлчилгээний нөхцөл</a><a href="/privacy">Нууцлалын бодлого</a><a href="/status">Статус</a><a href="/#support">Дэмжих</a></div><p>© biof · Bio Flex</p></footer>`;


document.addEventListener('click',ev=>{if(ev.target.closest('.lg'))login()});

const chrome=()=>{if(!document.querySelector('nav')){app.insertAdjacentHTML('afterbegin',bar());app.insertAdjacentHTML('beforeend',foot())}};

async function getStatus(){
 const t0=performance.now(),r=await sb.rpc('site_status');
 return{d:r.data,ms:Math.round(performance.now()-t0),err:r.error};
}
