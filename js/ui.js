/* Дундын UI: custom цонх, холбоос баталгаажуулалт, тэмдгийн тайлбар, click эффект, курсор, цэс, хамгаалалт, хэл, JPG */
function dlg(o){
 return new Promise(res=>{
  const d=document.createElement('div');d.className='dlgb';
  d.innerHTML=`<div class="dlg${o.wide?' wide':''}" role="dialog" aria-modal="true">${o.icon===false?'':`<div class="dlgi${o.danger?' risk':''}">${ic(o.icon||'spark',26)}</div>`}<h3>${e(o.title||'')}</h3>${o.html||(o.body?`<p class="mu">${e(o.body)}</p>`:'')}${o.input?`<input class="dli" maxlength="${o.input.max||300}" placeholder="${e(o.input.placeholder||'')}" value="${e(o.input.value||'')}" autocomplete="off">`:''}<div class="act dla"><button type="button" class="g" data-r="0">${e(o.cancel||'Болих')}</button><button type="button" class="${o.danger?'dng':''}" data-r="1">${e(o.ok||'Тийм')}</button></div></div>`;
  const no=o.input||o.collect?null:false;
  /* collect(d) нь утга буцаана; undefined буцаавал цонх хаагдахгүй (шалгалт) */
  const ok=()=>{const v=o.collect?o.collect(d):(o.input?d.querySelector('.dli').value.trim():true);if(v!==undefined)done(v)};
  const done=v=>{d.classList.add('out');setTimeout(()=>d.remove(),180);document.removeEventListener('keydown',kd);res(v)};
  const kd=ev=>{if(ev.key=='Escape')done(no);else if(ev.key=='Enter'&&o.input&&document.activeElement&&document.activeElement.classList.contains('dli'))ok()};
  d.onclick=ev=>{if(ev.target==d){done(no);return}const b=ev.target.closest('[data-r]');if(b){if(b.dataset.r=='1')ok();else done(no)}};
  document.addEventListener('keydown',kd);document.body.append(d);
  if(o.wire)o.wire(d);
  const i=d.querySelector('.dli');if(i)setTimeout(()=>i.focus(),60);
 });
}
/* Сонголтын жагсаалт (radio) */
const optsHTML=(name,L,cur)=>`<div class="opts">${L.map(x=>`<label class="opt"><input type="radio" name="${name}" value="${e(x[0])}"${x[0]==cur?' checked':''}><span>${x[2]?ic(x[2],18):''}<b>${e(x[1])}</b>${x[3]?`<small>${e(x[3])}</small>`:''}</span></label>`).join('')}</div>`;
/* Гадны холбоос: баталгаажсан (мэдэгдэж буй платформын https) холбоосыг асуухгүй нээнэ */
async function linkGo(url){
 let host='',https=false,mail=false,trusted=false;
 try{
  if(/^mailto:/i.test(url)){mail=true;host=url.slice(7)}
  else{const u=new URL(url);host=u.hostname;https=u.protocol=='https:';trusted=https&&!!HOST[host.replace(/^www\./,'')]}
 }catch{}
 if(trusted){window.open(url,'_blank','noopener,noreferrer');return}
 const ok=await dlg({icon:mail?'link':(https?'lock':'alert'),danger:!https&&!mail,title:'Гадны холбоос руу орох гэж байна',
  html:`<div class="lkc ${https||mail?'safe':'risk'}"><b>${e(host)}</b><span>${mail?ic('link',16)+' Имэйл илгээх холбоос':https?ic('lock',16)+' HTTPS — шифрлэгдсэн, аюулгүй холболт':ic('alert',16)+' HTTP — шифрлэгдээгүй, аюултай байж болно'}</span></div><p class="mu">Энэ холбоосыг хуудасны эзэн оруулсан. Итгэлтэй байна уу?</p>`,ok:'Үргэлжлүүлэх',cancel:'Болих'});
 if(ok)window.open(url,'_blank','noopener,noreferrer');
}
/* Тэмдгийн тайлбар: дарахад гарна; тэр тэмдгийг дахин эсвэл өөр газар дарахад, гүйлгэхэд, Esc-д хаагдана */
let tipT=0,lpT=0,tipEl=null,lpAt=0;
function hideTip(){clearTimeout(tipT);const t=document.querySelector('.tip2');if(t)t.remove();if(tipEl)tipEl.removeAttribute('aria-describedby');tipEl=null}
function showTip(el){
 hideTip();
 const d=document.createElement('div');d.className='tip2';d.id='tip2';d.setAttribute('role','tooltip');d.textContent=el.dataset.d||'';document.body.append(d);
 const r=el.getBoundingClientRect(),w=d.offsetWidth,h=d.offsetHeight;
 d.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';
 d.style.top=(r.top-h-10<8?r.bottom+10:r.top-h-10)+'px';
 tipEl=el;el.setAttribute('aria-describedby','tip2');tipT=setTimeout(hideTip,8000);
}
document.addEventListener('click',ev=>{
 const b=ev.target.closest&&ev.target.closest('.bd[data-d]');
 if(b){if(Date.now()-lpAt<700)return;if(tipEl===b&&document.querySelector('.tip2'))hideTip();else showTip(b);return}
 if(tipEl)hideTip();
});
document.addEventListener('pointerdown',ev=>{const b=ev.target.closest&&ev.target.closest('.bd[data-d]');if(b&&ev.pointerType!='mouse'){clearTimeout(lpT);lpT=setTimeout(()=>{if(tipEl!==b){showTip(b);lpAt=Date.now()}},450)}},{passive:true});
document.addEventListener('keydown',ev=>{if(ev.key=='Escape'&&tipEl)hideTip();else if((ev.key=='Enter'||ev.key==' ')&&ev.target.matches&&ev.target.matches('.bd[data-d]')){ev.preventDefault();tipEl===ev.target?hideTip():showTip(ev.target)}});
addEventListener('scroll',()=>{if(tipEl)hideTip()},{passive:true});
['pointerup','pointercancel','pointermove'].forEach(t=>document.addEventListener(t,()=>clearTimeout(lpT),{passive:true}));
/* Click хийсэн газар эффект (тусдаа хайрцагт тул утсан дээр хуудас хөдлөхгүй) + курсор */
(function(){
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const box=document.createElement('div');box.className='ripc';document.body.append(box);
 document.addEventListener('pointerdown',ev=>{const r=document.createElement('i');r.className='rip';r.style.left=ev.clientX+'px';r.style.top=ev.clientY+'px';box.append(r);setTimeout(()=>r.remove(),700)},{passive:true});
 let c=null,x=0,y=0,f=0;
 addEventListener('pointermove',ev=>{
  if(ev.pointerType=='touch')return;
  if(document.body.classList.contains('ucur')){if(c)c.classList.remove('show');return}
  if(!c){c=document.createElement('i');c.className='cur';box.append(c)}
  x=ev.clientX;y=ev.clientY;
  if(f)return;
  f=requestAnimationFrame(()=>{f=0;c.style.transform='translate3d('+x+'px,'+y+'px,0)';c.classList.add('show');const t=ev.target;c.classList.toggle('cbig',!!(t&&t.closest&&t.closest('a,button,.dz,.pb,.fqh,.bd,.tile')))});
 },{passive:true});
 document.addEventListener('mouseleave',()=>{if(c)c.classList.remove('show')});
})();
/* Зураг, бичлэг татахаас сэргийлэх (бүрэн хамгаалалт биш, зөвхөн саад) */
document.addEventListener('contextmenu',ev=>{const t=ev.target;if(t.closest&&t.closest('img,video,.av,.bgv,.pt,.lk')&&!t.closest('input,textarea'))ev.preventDefault()});
document.addEventListener('dragstart',ev=>{if(ev.target.closest&&ev.target.closest('img,video'))ev.preventDefault()});
/* Гурван зураасан цэс */
function menuItems(){
 const L=[['/','home','Нүүр'],['#search','search','Хүн хайх'],['/leaderboard','trophy','Тэргүүлэгчид'],['/updates','bolt','Шинэчлэлт'],['/tutorial','spark','Заавар'],['/a','eye','Жишээ хуудас'],['/status','pulse','Статус'],['/#support','coffee','Дэмжих']];
 if(typeof me!='undefined'&&me){L.unshift(['/settings','user','Миний самбар']);if(me.role=='admin')L.splice(1,0,['/admin','shield','Админ самбар']);else if(me.role=='moderator')L.splice(1,0,['/admin','shield','Модератор самбар'])}
 if(!matchMedia('(display-mode: standalone)').matches)L.push(['#install','phone','Апп суулгах']);
 L.push(['/tos','link','Үйлчилгээний нөхцөл'],['/privacy','lock','Нууцлалын бодлого']);
 return L;
}
function closeMenu(){document.querySelectorAll('.mnu,.mnbk').forEach(x=>{x.classList.add('out');setTimeout(()=>x.remove(),200)});const b=document.getElementById('mnb');if(b)b.setAttribute('aria-expanded','false')}
document.addEventListener('click',ev=>{
 const b=ev.target.closest&&ev.target.closest('#mnb');
 if(b){
  if(document.querySelector('.mnu')){closeMenu();return}
  const k=document.createElement('div');k.className='mnbk';
  const m=document.createElement('div');m.className='mnu';
  m.innerHTML=`<div class="mnh"><b>biof</b><span class="mu">Bio Flex</span><button class="g mnx" type="button" aria-label="Хаах">${ic('x',18)}</button></div>`+menuItems().map((x,i)=>`<a href="${x[0]}"${x[0]=='#search'?' data-search="1"':x[0]=='#install'?' data-install="1"':''} style="--i:${i}">${ic(x[1],20)}<span>${x[2]}</span>${x[0]=='/updates'&&typeof updNew=='function'&&updNew()?'<i class="mdot"></i>':''}</a>`).join('');
  document.body.append(k,m);b.setAttribute('aria-expanded','true');return;
 }
 if(ev.target.closest&&(ev.target.closest('.mnbk')||ev.target.closest('.mnx')||ev.target.closest('.mnu a')))closeMenu();
});
document.addEventListener('keydown',ev=>{if(ev.key=='Escape')closeMenu()});
/* Хэл сонгох цэс */
document.addEventListener('click',ev=>{
 const old=document.querySelector('.lgm');
 const b=ev.target.closest&&ev.target.closest('#lgs');
 if(old){old.remove();if(b)return}
 if(b){
  const r=b.getBoundingClientRect(),m=document.createElement('div');m.className='lgm';
  m.innerHTML=[['mn','Монгол'],['en','English'],['ru','Русский']].map(x=>`<button type="button" data-l="${x[0]}" class="${(localStorage.lang||'mn')==x[0]?'on':''}">${x[1]}</button>`).join('');
  m.style.top=(r.bottom+8)+'px';m.style.left=Math.max(8,Math.min(innerWidth-150,r.right-140))+'px';
  m.onclick=e2=>{const l=e2.target.closest('[data-l]');if(l){localStorage.lang=l.dataset.l;location.reload()}};
  document.body.append(m);
 }
});
/* Дэмжлэг: данс хуулах */
const ACC='MN620050099106666308';
const supportHTML=()=>`<div class="sup rv" id="support"><span class="cup">${ic('coffee',34)}</span><div class="supb"><h3>Надад кофе авч өгөөрэй</h3><p class="mu">biof-ийг үнэгүй байлгахад туслаарай. Дэмжлэг нь сайн дурын, баярлалаа!</p><div class="acc"><div><small class="mu">Monpay данс</small><code>${ACC}</code></div><button class="g" type="button" data-cpy="1">${ic('copy',16)}Хуулах</button></div><button type="button" class="wide2" data-bkd="1">${ic('bank',18)}Банкны аппаар шилжүүлэх</button></div></div>`;
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-cpy]');if(!b)return;try{navigator.clipboard.writeText(ACC)}catch{}b.innerHTML=ic('check',16)+'Хуулагдлаа';toast('Данс хуулагдлаа. Баярлалаа!');setTimeout(()=>{b.innerHTML=ic('copy',16)+'Хуулах'},2200)});
/* Load/error: жинхэнэ платформын логог CDN-ээс авна, олдохгүй бол тэмдэглэгээ үлдэнэ */
document.addEventListener('load',ev=>{const t=ev.target;if(t&&t.classList&&t.classList.contains('si')&&t.parentNode)t.parentNode.classList.add('ok')},true);
document.addEventListener('error',ev=>{const t=ev.target;if(t&&t.classList&&t.classList.contains('si'))t.remove()},true);

/* Хэрэглэгч хайх (нэр эсвэл @хаяг) */
async function searchUsers(q){
 q=String(q||'').trim().replace(/^@/,'');if(q.length<2)return[];
 const r=await sb.rpc('search_users',{q});
 if(!r.error)return r.data||[];
 const c=q.toLowerCase().replace(/[^a-z0-9_ёөүа-я .-]/gi,'');if(c.length<2)return[];
 const f=await sb.from('profiles').select('bid,username,display_name,avatar_url,views,badges').not('username','is',null).or('username.ilike.'+c+'%,display_name.ilike.%'+c+'%').order('views',{ascending:false}).limit(12);
 return(f.data||[]).map(p=>({...p,verified:(p.badges||[]).some(x=>String(x).toLowerCase()=='verified')}));
}
const srRow=p=>`<a href="/${e(p.username)}">${av(p)}<span><b>${e(p.display_name||p.username)}${p.verified?` <span class="vb">${ic('badge',15)}</span>`:''}</b><small>@${e(p.username)} · ${ic('eye',12)} ${p.views||0}</small></span></a>`;
function searchDlg(){
 if(document.querySelector('.srd'))return;
 const d=document.createElement('div');d.className='dlgb srd';
 d.innerHTML=`<div class="dlg" role="dialog" aria-modal="true"><h3>Хүн хайх</h3><div class="sri">${ic('search',18)}<input id="srq" maxlength="30" placeholder="Нэр эсвэл @хаяг" autocomplete="off" autocapitalize="none" spellcheck="false"></div><div class="srl" id="srl"><p class="mu" style="text-align:center;padding:10px">Дор хаяж 2 үсэг бичнэ үү</p></div><div class="act"><button type="button" class="g" data-x="1">Хаах</button></div></div>`;
 const close=()=>{d.classList.add('out');setTimeout(()=>d.remove(),180);document.removeEventListener('keydown',kd)};
 const kd=ev=>{if(ev.key=='Escape')close()};
 d.onclick=ev=>{if(ev.target==d||ev.target.closest('[data-x]'))close()};
 document.addEventListener('keydown',kd);document.body.append(d);
 const i=d.querySelector('#srq'),L=d.querySelector('#srl');let t=0,n=0;
 i.oninput=()=>{clearTimeout(t);const q=i.value;if(q.trim().replace(/^@/,'').length<2){L.innerHTML='<p class="mu" style="text-align:center;padding:10px">Дор хаяж 2 үсэг бичнэ үү</p>';return}
  L.innerHTML='<p class="mu" style="text-align:center;padding:10px">Хайж байна…</p>';
  t=setTimeout(async()=>{const my=++n,R=await searchUsers(q).catch(()=>[]);if(my!=n||!L.isConnected)return;L.innerHTML=R.map(srRow).join('')||'<p class="mu" style="text-align:center;padding:10px">Олдсонгүй</p>'},300)};
 i.onkeydown=ev=>{if(ev.key=='Enter'){const a=L.querySelector('a');if(a)location.href=a.href}};
 setTimeout(()=>i.focus(),60);
}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('#srb,[data-search]');if(b){ev.preventDefault();searchDlg()}});

/* Апп суулгах: Android/Chrome дээр шууд, iPhone дээр заавар */
async function installApp(){
 if(window.BIP){const p=window.BIP;window.BIP=null;p.prompt();try{const r=await p.userChoice;if(r&&r.outcome=='accepted')toast('Суулгаж байна…')}catch{}return}
 const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 dlg({icon:'phone',title:'biof-ийг апп болгох',ok:'Ойлголоо',cancel:'Хаах',html:ios?`<ol class="ins"><li>Safari-ийн доод талын <b>Хуваалцах</b> товчийг дарна</li><li><b>Add to Home Screen</b> (Нүүр дэлгэцэд нэмэх)-г сонгоно</li><li><b>Add</b> дарна. Ингээд biof апп шиг нээгдэнэ.</li></ol>`:`<ol class="ins"><li>Хөтчийн цэс (<b>⋮</b>)-ийг нээнэ</li><li><b>Install app</b> эсвэл <b>Add to Home screen</b>-г сонгоно</li><li>Ингээд biof дэлгэцэн дээр апп болж харагдана, илүү хурдан нээгдэнэ.</li></ol>`});
}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-install]');if(b){ev.preventDefault();installApp()}});
/* Хуваалцах: утсан дээр системийн хуваалцах цонх, үгүй бол хуулна */
async function shareUrl(url,title){
 if(navigator.share&&matchMedia('(pointer:coarse)').matches){try{await navigator.share({title:title||'biof',url});return true}catch(x){if(x&&x.name=='AbortError')return false}}
 try{await navigator.clipboard.writeText(url);toast('Холбоос хуулагдлаа')}catch{toast(url)}return true;
}
/* QR код (сайт дээрээ хадгалсан qrcode-generator, хэрэгтэй үед л ачаална) */
let QRL=null;
const loadQR=()=>QRL||(QRL=new Promise((ok,no)=>{if(window.qrcode)return ok(window.qrcode);const x=document.createElement('script');x.src='/js/vendor/qrcode.js?v=1.4.4';x.onload=()=>window.qrcode?ok(window.qrcode):no(Error('qr'));x.onerror=()=>{QRL=null;no(Error('QR ачаалагдсангүй'))};document.head.append(x)}));
async function qrCanvas(text,size,fg,bg){
 const Q=await loadQR(),q=Q(0,'Q');q.addData(text);q.make();
 const n=q.getModuleCount(),pad=4,cell=Math.floor(size/(n+pad*2)),S=cell*(n+pad*2),c=document.createElement('canvas');c.width=c.height=S;
 const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,S,S);x.fillStyle=fg;
 const eye=(r,cc)=>(r<7&&cc<7)||(r<7&&cc>=n-7)||(r>=n-7&&cc<7);
 const rr=(X,Y,w,h,rad)=>{x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,rad):x.rect(X,Y,w,h);x.fill()};
 for(let r=0;r<n;r++)for(let cc=0;cc<n;cc++)if(q.isDark(r,cc)&&!eye(r,cc))x.fillRect((cc+pad)*cell,(r+pad)*cell,cell,cell);
 const ey=(r,cc)=>{const X=(cc+pad)*cell,Y=(r+pad)*cell;x.fillStyle=fg;x.beginPath();x.roundRect?x.roundRect(X,Y,cell*7,cell*7,cell*.6):x.rect(X,Y,cell*7,cell*7);x.fill();x.fillStyle=bg;x.beginPath();x.roundRect?x.roundRect(X+cell,Y+cell,cell*5,cell*5,cell*.4):x.rect(X+cell,Y+cell,cell*5,cell*5);x.fill();x.fillStyle=fg;x.beginPath();x.roundRect?x.roundRect(X+cell*2,Y+cell*2,cell*3,cell*3,cell*.3):x.rect(X+cell*2,Y+cell*2,cell*3,cell*3);x.fill()};
 ey(0,0);ey(0,n-7);ey(n-7,0);
 return c;
}
async function qrDlg(url,name,fg){
 const L=h=>{const v=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));return(.299*v[0]+.587*v[1]+.114*v[2])/255};
 fg=/^#[0-9a-f]{6}$/i.test(fg||'')&&L(fg)<.5?fg:'#111111';
 let c;try{c=await qrCanvas(url,600,fg,'#ffffff')}catch(x){return toast(x.message||'QR алдаа')}
 const u=c.toDataURL('image/png');
 const r=await dlg({icon:'qr',title:'QR код',ok:'PNG татах',cancel:'Хаах',html:`<div class="qrw"><img src="${u}" alt="QR" width="240" height="240"></div><p class="mu sel" style="margin-top:8px">${e(url.replace(/^https?:\/\//,''))}</p><p class="mu" style="font-size:12px">Утасны камераар уншуулахад таны хуудас нээгдэнэ. Story, нэрийн хуудсандаа ашиглаарай.</p>`});
 if(r){const a=document.createElement('a');a.href=u;a.download='biof-'+(name||'qr')+'-qr.png';document.body.append(a);a.click();a.remove()}
}

/* Сайтын мэдэгдэл (админ бичнэ). 5 мин кэш, хаасныг дахин харуулахгүй */
async function showNotice(el){
 if(!el)return;let b=null;
 try{const c=JSON.parse(sessionStorage.ntc||'null');if(c&&Date.now()-c.t<3e5)b=c.b}catch{}
 if(b==null){const r=await Promise.resolve(sb.from('site_content').select('body').eq('k','notice').maybeSingle()).catch(()=>({}));b=(r&&r.data&&r.data.body)||'';try{sessionStorage.ntc=JSON.stringify({t:Date.now(),b})}catch{}}
 b=String(b||'').trim();if(!b||!el.isConnected)return;
 let h=0;for(const ch of b)h=(h*31+ch.charCodeAt(0))|0;if(localStorage.nd==String(h))return;
 el.insertAdjacentHTML('afterbegin',`<div class="ntc">${ic('bolt',18)}<span class="sel">${e(b)}</span><button type="button" class="g" aria-label="Хаах">${ic('x',14)}</button></div>`);
 const n=el.querySelector('.ntc');n.querySelector('button').onclick=()=>{localStorage.nd=String(h);n.remove()};
}

/* Хажуу тийш гүйлгэх табууд: хулганы дугуйгаар гүйлгэх, сонгосон табыг харагдуулах, сүүдэр */
(function(){
 const upd=t=>{const o=t.scrollWidth>t.clientWidth+2;t.classList.toggle('ovf',o);t.classList.toggle('end',o&&t.scrollLeft+t.clientWidth>=t.scrollWidth-4)};
 document.addEventListener('wheel',ev=>{const t=ev.target.closest&&ev.target.closest('.tabs2,.tabs3,.lbt');if(!t||t.scrollWidth<=t.clientWidth+2||Math.abs(ev.deltaX)>Math.abs(ev.deltaY))return;ev.preventDefault();t.scrollLeft+=ev.deltaY;upd(t)},{passive:false});
 document.addEventListener('scroll',ev=>{const t=ev.target;if(t&&t.classList&&t.classList.contains('tabs2'))upd(t)},true);
 document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('.tabs2 button');if(b&&b.parentElement.scrollWidth>b.parentElement.clientWidth+2)b.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'})});
 new MutationObserver(()=>document.querySelectorAll('.tabs2').forEach(upd)).observe(document.documentElement,{childList:true,subtree:true});
 addEventListener('resize',()=>document.querySelectorAll('.tabs2').forEach(upd),{passive:true});
})();
/* Хурдан шилжилт: холбоос дээр хулгана очиход хуудсыг урьдчилан ачаална (нэг удаа) */
(function(){
 const done=new Set();
 const pf=ev=>{const a=ev.target.closest&&ev.target.closest('a[href^="/"]');if(!a||a.target=='_blank')return;const u=a.getAttribute('href').split('#')[0];if(!u||done.has(u)||u==location.pathname||done.size>20)return;done.add(u);const l=document.createElement('link');l.rel='prefetch';l.href=u;document.head.append(l)};
 document.addEventListener('pointerover',pf,{passive:true});document.addEventListener('touchstart',pf,{passive:true});
})();
/* Нүүр хуудсан дээр байхдаа "/#support" г.м. холбоос дарвал (hash өөрчлөгдөөгүй ч) тэр хэсэг рүү гүйлгэнэ */
document.addEventListener('click',ev=>{
 const a=ev.target.closest&&ev.target.closest('a[href^="/#"]');if(!a||ev.ctrlKey||ev.metaKey||ev.shiftKey)return;
 if(location.pathname!='/'||document.body.dataset.p!='home')return;
 ev.preventDefault();if(typeof closeMenu=='function')closeMenu();
 const h=a.getAttribute('href').slice(1);if(location.hash!=h)history.replaceState(null,'',h);dispatchEvent(new HashChangeEvent('hashchange'));
});

/* Банкны апп сонгох: дансыг хуулж, сонгосон банкны аппыг нээнэ (QPay-д хэрэглэгддэг схем).
   Апп нээгдээгүй бол (суулгаагүй г.м.) хуулсан дансаа аппдаа буулгахыг зааж өгнө. */
const BAPPS=[['khan','Хаан банк','khanbank','#0a8f3c','ХБ'],['golomt','SocialPay (Голомт)','socialpay-payment','#1f4fb5','SP'],['tdb','ХХБ (TDB)','tdbbank','#0b3a8c','TDB'],['state','Төрийн банк','statebank','#c8102e','ТБ'],['xac','Хас банк','xacbank','#f08a00','ХАС'],['monpay','Monpay','monpay','#ff6a00','MP'],['most','Мост мони','most','#e4002b','ММ'],['capitron','Капитрон банк','capitronbank','#23336e','КБ'],['bogd','Богд банк','bogdbank','#a8841c','ББ'],['mbank','М банк','mbank','#6d28d9','М'],['arig','Ариг банк','arigbank','#d71920','АБ'],['ckbank','Чингис хаан банк','ckbank','#0f5c55','ЧХБ']];
const isPhone=()=>matchMedia('(pointer:coarse)').matches&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
async function cpyTxt(t){try{await navigator.clipboard.writeText(t);return true}catch{try{const x=document.createElement('textarea');x.value=t;x.style.cssText='position:fixed;opacity:0';document.body.append(x);x.select();const ok=document.execCommand('copy');x.remove();return ok}catch{return false}}}
function bankDlg(o){
 const acc=String(o.acc||''),raw=acc.replace(/\s/g,''),ph=isPhone();
 dlg({icon:'bank',title:o.title||'Мөнгө шилжүүлэх',ok:'Хаах',cancel:'Хуулах',wide:false,
  html:`<div class="bnkd"><small class="mu">${e(o.bank||'')}</small><b class="sel">${e(acc)}</b>${o.holder?`<span class="sel">${e(o.holder)}</span>`:''}</div>${ph?`<p class="mu bkh">Банкны аппаа сонговол данс автоматаар хуулагдаж, апп нээгдэнэ. Аппдаа "Хүлээн авагчийн данс" хэсэгт буулгана (paste).</p><div class="bkg">${BAPPS.map(b=>`<button type="button" class="bka" data-bk="${b[0]}" style="--bk:${b[3]}"><i>${e(b[4])}</i><span>${e(b[1])}</span></button>`).join('')}</div>`:`<p class="mu bkh">Утаснаасаа орвол банкны аппаа сонгоод шууд нээж болно.</p>`}<p class="mu" style="font-size:12px;margin-top:8px">Шилжүүлэхийн өмнө хүлээн авагчийн нэрийг заавал шалгаарай.</p>`,
  wire:d=>{
   const cancel=d.querySelector('[data-r="0"]');if(cancel){cancel.innerHTML=ic('copy',16)+'Хуулах';cancel.onclick=async ev=>{ev.stopPropagation();const ok=await cpyTxt(raw);cancel.innerHTML=ic('check',16)+(ok?'Хуулагдлаа':'Хуулж чадсангүй');toast(ok?'Дансны дугаар хуулагдлаа':'Хуулж чадсангүй. Дугаарыг гараар хуулна уу.')}}
   d.querySelectorAll('[data-bk]').forEach(b=>b.onclick=async ev=>{ev.stopPropagation();const B=BAPPS.find(x=>x[0]==b.dataset.bk);if(!B)return;
    const ok=await cpyTxt(raw);toast((ok?'Данс хуулагдлаа. ':'')+B[1]+' апп нээгдэж байна…');
    let hid=false;const vh=()=>{if(document.hidden)hid=true};document.addEventListener('visibilitychange',vh);
    setTimeout(()=>{location.href=B[2]+'://q'},120);
    setTimeout(()=>{document.removeEventListener('visibilitychange',vh);if(!hid&&!document.hidden)toast(B[1]+' апп нээгдсэнгүй бол аппаа өөрөө нээгээд хуулсан дансаа буулгана уу.')},2200)});
  }});
}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-bkd]');if(!b)return;bankDlg({acc:ACC,bank:'Monpay данс (IBAN)',holder:'biof',title:'biof-ийг дэмжих'})});
