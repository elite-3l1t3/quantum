/* Дундын UI: custom цонх, холбоос баталгаажуулалт, тэмдгийн тайлбар, click эффект, курсор, цэс, хамгаалалт, хэл, JPG */
function dlg(o){
 return new Promise(res=>{
  const d=document.createElement('div');d.className='dlgb';
  d.innerHTML=`<div class="dlg" role="dialog" aria-modal="true"><div class="dlgi${o.danger?' risk':''}">${ic(o.icon||'spark',26)}</div><h3>${e(o.title||'')}</h3>${o.html||(o.body?`<p class="mu">${e(o.body)}</p>`:'')}${o.input?`<input class="dli" maxlength="${o.input.max||300}" placeholder="${e(o.input.placeholder||'')}" value="${e(o.input.value||'')}" autocomplete="off">`:''}<div class="act dla"><button type="button" class="g" data-r="0">${e(o.cancel||'Болих')}</button><button type="button" class="${o.danger?'dng':''}" data-r="1">${e(o.ok||'Тийм')}</button></div></div>`;
  const ok=()=>done(o.input?d.querySelector('.dli').value.trim():true);
  const done=v=>{d.classList.add('out');setTimeout(()=>d.remove(),180);document.removeEventListener('keydown',kd);res(v)};
  const kd=ev=>{if(ev.key=='Escape')done(o.input?null:false);else if(ev.key=='Enter'&&o.input&&document.activeElement&&document.activeElement.classList.contains('dli'))ok()};
  d.onclick=ev=>{if(ev.target==d){done(o.input?null:false);return}const b=ev.target.closest('[data-r]');if(b){if(b.dataset.r=='1')ok();else done(o.input?null:false)}};
  document.addEventListener('keydown',kd);document.body.append(d);
  const i=d.querySelector('.dli');if(i)setTimeout(()=>i.focus(),60);
 });
}
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
/* Тэмдгийн тайлбар: дарахад болон удаан дарахад */
let tipT=0,lpT=0;
function showTip(el){
 const old=document.querySelector('.tip2');if(old)old.remove();
 const d=document.createElement('div');d.className='tip2';d.textContent=el.dataset.d||'';document.body.append(d);
 const r=el.getBoundingClientRect(),w=d.offsetWidth,h=d.offsetHeight;
 d.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';
 d.style.top=(r.top-h-10<8?r.bottom+10:r.top-h-10)+'px';
 clearTimeout(tipT);tipT=setTimeout(()=>d.remove(),2800);
}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('.bd[data-d]');if(b)showTip(b)});
document.addEventListener('pointerdown',ev=>{const b=ev.target.closest&&ev.target.closest('.bd[data-d]');if(b){clearTimeout(lpT);lpT=setTimeout(()=>showTip(b),450)}},{passive:true});
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
  f=requestAnimationFrame(()=>{f=0;c.style.transform='translate3d('+x+'px,'+y+'px,0)';c.classList.add('show');const t=ev.target;c.classList.toggle('big',!!(t&&t.closest&&t.closest('a,button,.dz,.pb,.fqh,.bd,.tile')))});
 },{passive:true});
 document.addEventListener('mouseleave',()=>{if(c)c.classList.remove('show')});
})();
/* Зураг, бичлэг татахаас сэргийлэх (бүрэн хамгаалалт биш, зөвхөн саад) */
document.addEventListener('contextmenu',ev=>{const t=ev.target;if(t.closest&&t.closest('img,video,.av,.card,.bgv,.pt')&&!t.closest('input,textarea'))ev.preventDefault()});
document.addEventListener('dragstart',ev=>{if(ev.target.closest&&ev.target.closest('img,video'))ev.preventDefault()});
/* Гурван зураасан цэс */
function menuItems(){
 const L=[['/','home','Нүүр'],['/leaderboard','trophy','Тэргүүлэгчид'],['/tutorial','spark','Заавар'],['/a','eye','Жишээ хуудас'],['/status','pulse','Статус'],['/#support','coffee','Дэмжих']];
 if(typeof me!='undefined'&&me){L.unshift(['/settings','user','Миний самбар']);if(me.role=='admin')L.splice(1,0,['/admin','shield','Админ самбар'])}
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
  m.innerHTML=`<div class="mnh"><b>biof</b><span class="mu">Bio Flex</span><button class="g mnx" type="button" aria-label="Хаах">${ic('x',18)}</button></div>`+menuItems().map((x,i)=>`<a href="${x[0]}" style="--i:${i}">${ic(x[1],20)}<span>${x[2]}</span></a>`).join('');
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
const supportHTML=()=>`<div class="sup rv" id="support"><span class="cup">${ic('coffee',34)}</span><div class="supb"><h3>Надад кофе авч өгөөрэй</h3><p class="mu">biof-ийг үнэгүй байлгахад туслаарай. Дэмжлэг нь сайн дурын, баярлалаа!</p><div class="acc"><div><small class="mu">Monpay данс</small><code>${ACC}</code></div><button class="g" type="button" data-cpy="1">${ic('copy',16)}Хуулах</button></div></div></div>`;
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-cpy]');if(!b)return;try{navigator.clipboard.writeText(ACC)}catch{}b.innerHTML=ic('check',16)+'Хуулагдлаа';toast('Данс хуулагдлаа. Баярлалаа!');setTimeout(()=>{b.innerHTML=ic('copy',16)+'Хуулах'},2200)});
/* Хуудсыг JPG зураг болгон татах (html2canvas-ийг хэрэгтэй үед л ачаална) */
async function savePageJpg(el,name){
 try{
  if(!window.html2canvas)await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';s.onload=ok;s.onerror=()=>no(Error('Зураг үүсгэгч ачаалагдсангүй'));document.head.append(s)});
  const bg=getComputedStyle(document.body).backgroundColor||'#0a0a0a';
  const cv=await html2canvas(el,{backgroundColor:bg,scale:2,useCORS:true,logging:false,ignoreElements:n=>!!(n.classList&&(n.classList.contains('rip')||n.classList.contains('cur')||n.classList.contains('wm')||n.classList.contains('ripc')))});
  const a=document.createElement('a');a.href=cv.toDataURL('image/jpeg',.92);a.download=(name||'biof')+'.jpg';document.body.append(a);a.click();a.remove();
  toast('JPG зураг татагдлаа');
 }catch(x){toast('JPG татаж чадсангүй: '+(x.message||x))}
}
/* Load/error: жинхэнэ платформын логог CDN-ээс авна, олдохгүй бол тэмдэглэгээ үлдэнэ */
document.addEventListener('load',ev=>{const t=ev.target;if(t&&t.classList&&t.classList.contains('si'))t.parentNode.classList.add('ok')},true);
document.addEventListener('error',ev=>{const t=ev.target;if(t&&t.classList&&t.classList.contains('si'))t.remove()},true);
