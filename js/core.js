const SB_URL='https://zyrpzoqdoorekspavocs.supabase.co', SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5cnB6b3Fkb29yZWtzcGF2b2NzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1ODk4OTIsImV4cCI6MjEwODE2NTg5Mn0.ilCd_6g1W7G4S9N3iYXBRwjOEqgYInysBLcH6h233as';
if(!window.supabase){document.getElementById('app').innerHTML='<p style="padding:40px;text-align:center">Supabase ачаалагдсангүй. Интернэтээ шалгаад дахин оролдоно уу.</p>';throw Error('supabase missing')}
const sb=supabase.createClient(SB_URL,SB_KEY);
const $=s=>document.querySelector(s), app=$('#app');
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>/^https?:\/\//i.test(u||'')?u:'#';
const OKH=[SB_URL+'/storage/v1/object/public/media/','https://cdn.discordapp.com/'];
const cu=u=>OKH.some(x=>(u||'').startsWith(x))&&/^https?:\/\/[^\s"'()\\]+$/i.test(u)?u:'';
const av=p=>cu(p.avatar_url)?`<img class="av" loading="lazy" alt="" src="${e(p.avatar_url)}">`:`<span class="av">${e((p.display_name||p.username||'?')[0].toUpperCase())}</span>`;
const bdg=p=>[...(p.role=='admin'?['Admin']:[]),...(p.bid<=100?['OG']:[]),...(p.views>=1000?['1K+ views']:[]),...(p.likes>=50?['50+ likes']:[]),...(p.badges||[])];
const DEMO={id:null,bid:1,username:'a',display_name:'biof template',bio:'Нэг линк. Бүх чинь. Энэ бол жишээ хуудас, өөрийнхөө хуудсыг ингэж чимээрэй.',accent:'#e8a317',views:1280,likes:64,role:'user',badges:['Template','Verified'],links:[{label:'Discord',url:'https://discord.com'},{label:'Instagram',url:'https://instagram.com'},{label:'YouTube',url:'https://youtube.com'},{label:'GitHub',url:'https://github.com'}],theme:{loc:'Улаанбаатар',tw:true,op:.93,r:20}};
const toast=m=>{if([...document.querySelectorAll('.toast')].some(x=>x.textContent==m))return;const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.append(d);setTimeout(()=>d.remove(),6000)};
addEventListener('error',x=>toast('Алдаа: '+x.message));
addEventListener('unhandledrejection',x=>toast('Алдаа: '+(x.reason?.message||x.reason)));
let me=null,user=null,aud=null;
const BR={'instagram.com':'#e1306c','tiktok.com':'#25f4ee','youtube.com':'#ff0000','youtu.be':'#ff0000','twitter.com':'#1d9bf0','x.com':'#e7e7e7','github.com':'#9aa0a6','discord.gg':'#5865f2','discord.com':'#5865f2','twitch.tv':'#9146ff','spotify.com':'#1db954','t.me':'#2aabee','facebook.com':'#1877f2','snapchat.com':'#fffc00'};
const bc=u=>{try{return BR[new URL(u).hostname.replace(/^www\./,'')]||'#e8a317'}catch{return '#e8a317'}};
const login=()=>sb.auth.signInWithOAuth({provider:'discord',options:{redirectTo:location.origin+'/'}});
const go=p=>{location.href=p};
const ERR={taken:'Энэ нэр авсан байна',invalid:'2-20 тэмдэгт (a-z, 0-9, _)',cooldown:'7 хоногт 1 удаа солино',banned:'Эрх байхгүй'};

async function loadMe(){
 const{data:{session}}=await sb.auth.getSession();user=session?.user||null;me=null;
 if(!user)return;
 const q=()=>sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
 me=(await q()).data;
 if(!me){const r=await sb.rpc('ensure_profile');if(r.error)toast('ensure_profile: '+r.error.message);me=(await q()).data}
 if(!me)return toast('Профайл үүссэнгүй. SQL файлуудыг ажиллуулсан эсэхээ шалгана уу.');
 if(!me.username&&localStorage.pending){const u=localStorage.pending;localStorage.removeItem('pending');await sb.rpc('claim_username',{u});me=(await q()).data}
}
const bar=()=>`<nav><b><a href="/" data-n>biof</a></b><a href="/a" data-n>Template</a>${me?`${me.role=='admin'?'<a href="/admin" data-n>Admin</a>':''}<a href="/settings" data-n>#${me.bid} ${e(me.username||'профайл')}</a>`:'<button class="lg">Discord-оор нэвтрэх</button>'}</nav>${me?.banned?'<div class="bad">Таны хаяг ban хийгдсэн байна.</div>':''}`;


document.addEventListener('click',ev=>{if(ev.target.closest('.lg'))login()});
