const SB_URL='https://zyrpzoqdoorekspavocs.supabase.co', SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cnB6b3Fkb29yZWtzcGF2b2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODk4OTIsImV4cCI6MjEwODE2NTg5Mn0.ilCd_6g1W7G4S9N3iYXBRwjOEqgYInysBLcH6h233as';
if(!window.supabase){document.getElementById('app').innerHTML='<p style="padding:40px;text-align:center">Supabase ачаалагдсангүй. Интернэтээ шалгаад дахин оролдоно уу.</p>';throw Error('supabase missing')}
const sb=supabase.createClient(SB_URL,SB_KEY);
const $=s=>document.querySelector(s), app=$('#app');
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^(https?:\/\/|mailto:)/i.test(u||'')?u:'#';
const OKH=[SB_URL+'/storage/v1/object/public/media/','https://cdn.discordapp.com/'];
const cu=u=>OKH.some(x=>(u||'').startsWith(x))&&/^https?:\/\/[^\s"'()\\]+$/i.test(u)?u:'';
const av=p=>cu(p.avatar_url)?`<img class="av" loading="lazy" alt="" src="${e(p.avatar_url)}">`:`<span class="av">${e((p.display_name||p.username||'?')[0].toUpperCase())}</span>`;
const DEMO={id:null,bid:1,username:'a',display_name:'biof жишээ',bio:'Энэ бол жишээ хуудас. Өөрийнхөө хуудсыг ингэж гоё болгоорой.',accent:'#e8a317',views:1280,likes:64,role:'user',badges:['verified'],links:[{label:'Discord',url:'https://discord.com'},{label:'Instagram',url:'https://instagram.com'},{label:'YouTube',url:'https://youtube.com'},{label:'GitHub',url:'https://github.com'}],theme:{loc:'Улаанбаатар',tw:true,op:.93,r:20,bfx:'ember'}};
const toast=m=>{if([...document.querySelectorAll('.toast')].some(x=>x.textContent==m))return;const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),6000)};
addEventListener('error',x=>toast('Алдаа: '+x.message));
addEventListener('unhandledrejection',x=>toast('Алдаа: '+(x.reason?.message||x.reason)));
let me=null,user=null,aud=null;
const bc=u=>(typeof PL!='undefined'&&PL[platFor(u)]||[])[1]||'#e8a317';
const login=()=>sb.auth.signInWithOAuth({provider:'discord',options:{redirectTo:location.origin+'/'}});
const go=p=>{location.href=p};
const ERR={taken:'Энэ нэр аль хэдийн авагдсан байна',invalid:'Нэр 2-20 тэмдэгт байх ба зөвхөн a-z, 0-9, _ ашиглана',cooldown:'Нэрээ 7 хоногт нэг л удаа солино',banned:'Таньд эрх алга'};

async function loadMe(){
 const{data:{session}}=await sb.auth.getSession();user=session?.user||null;me=null;
 if(!user)return;
 const q=()=>sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
 me=(await q()).data;
 if(!me){const r=await sb.rpc('ensure_profile');if(r.error)toast('ensure_profile: '+r.error.message);me=(await q()).data}
 if(!me)return toast('Профайл үүссэнгүй. SQL файлуудыг ажиллуулсан эсэхээ шалгана уу.');
 if(!me.username&&localStorage.pending){const u=localStorage.pending;localStorage.removeItem('pending');await sb.rpc('claim_username',{u});me=(await q()).data}
}
const bar=()=>`<nav><b><a href="/" data-n>biof</a></b><a href="/a">Жишээ</a>${me?`${me.role=='admin'?'<a href="/admin" data-n>Admin</a>':''}<a href="/settings" data-n>#${me.bid} ${e(me.username||'хуудас')}</a>`:'<button class="lg">Discord-оор нэвтрэх</button>'}</nav>${me?.banned?'<div class="bad">Таны эрхийг хаасан байна.</div>':''}`;


document.addEventListener('click',ev=>{if(ev.target.closest('.lg'))login()});

const chrome=()=>{if(!document.querySelector('nav')){app.insertAdjacentHTML('afterbegin',bar());app.insertAdjacentHTML('beforeend','<footer><a href="/tos">Үйлчилгээний нөхцөл</a> · <a href="/privacy">Нууцлалын бодлого</a> · © biof</footer>')}};
