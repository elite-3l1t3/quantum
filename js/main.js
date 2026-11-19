const V='18';const T0=document.title;
const NEED={home:['board','home'],settings:['card','upload','tour','settings'],admin:['admin'],board:['board'],tutorial:['tutorial'],status:['status'],profile:['card','profile']};
const PROBE={card:'cardHTML',upload:'up',tour:'startTour',settings:'settings',home:'home',profile:'profile',admin:'admin',board:'board',tutorial:'tutorial',status:'statusPage'};
const loadJs=s=>new Promise((ok,no)=>{const x=document.createElement('script');x.src='/js/'+s+'.js?v='+V;x.onload=ok;x.onerror=()=>no(Error('Файл олдсонгүй: /js/'+s+'.js. GitHub дээр js хавтас руу оруулсан эсэхээ шалгана уу.'));document.head.append(x)});
async function ensure(P){for(const s of NEED[P]||[]){if(typeof window[PROBE[s]]!='function')await loadJs(s);if(typeof window[PROBE[s]]!='function')throw Error('/js/'+s+'.js ачаалагдсангүй')}}
let DOWN=false;
async function doRoute(){
 if(window.RC)window.RC.abort();window.RC=new AbortController();
 document.body.style.cssText='';clearInterval(window.TT);clearInterval(window.CDI);clearInterval(window.PI);clearInterval(window.PJ);
 document.querySelectorAll('.cft,.fxp,.bgv,#ent,.wm,.tour,.tip2,.lgm,.mnu,.mnbk,.dlgb,.hbn').forEach(x=>x.remove());
 if(aud){aud.pause();aud=null}
 document.documentElement.style.setProperty('--a','#e2b858');document.documentElement.style.removeProperty('--ic');document.title=T0;
 document.body.classList.toggle('prof',document.body.dataset.p=='profile');document.body.classList.remove('ucur');
 const p=decodeURIComponent(location.pathname.slice(1)).toLowerCase().replace(/\/$/,'').replace(/\.html$/,'');
 const P=document.body.dataset.p,FT=foot();
 if(DOWN&&P!='status'&&P!='doc'){downPage('db');return}
 if(P=='doc'){window.DOC=window.DOC||app.innerHTML;app.innerHTML=bar()+DOC+FT;return}
 app.innerHTML=(P=='profile'?'':bar())+'<div class="w" id="v"></div>'+(P=='profile'?'':FT);
 const v=$('#v');v.innerHTML='<div class="card sk"></div>';
 try{
  if(me&&me.banned&&['home','settings','admin','tutorial'].includes(P)){await banPage(v);return}
  await ensure(P);
  if(P=='home')await home(v);else if(P=='settings')await settings(v);else if(P=='admin')await admin(v);else if(P=='board')await board(v);else if(P=='tutorial')await tutorial(v);else if(P=='status')await statusPage(v);else await profile(v,p);
 }catch(x){
  if(P!='status'&&!(await health())){DOWN=true;downPage('db');return}
  v.innerHTML='<div class="card">Алдаа гарлаа: '+e(x.message)+'<br><br><button type="button">Дахин ачаалах</button></div>';
  const b=v.querySelector("button");if(b)b.onclick=()=>location.reload()
 }
}
let q=Promise.resolve();
const route=()=>q=q.then(doRoute).catch(x=>toast('Алдаа: '+(x.message||x)));
let ready=false;
sb.auth.onAuthStateChange((_,s)=>{if(ready&&(s?.user?.id||null)!==(user?.id||null))setTimeout(async()=>{try{await loadMe()}catch{}route()},0)});
if(!document.querySelector('link[rel=icon]'))document.head.insertAdjacentHTML('beforeend','<link rel="icon" href="/favicon.svg">');
if(/error_description/.test(location.hash+location.search)){
 const m=decodeURIComponent((location.hash+location.search).match(/error_description=([^&]*)/)?.[1]||'').replace(/\+/g,' ');
 toast(/registration_closed|daily_limit|Database error/i.test(m)?'Одоогоор шинэ бүртгэл авах боломжгүй байна. Маргааш дахин оролдоно уу.':'Нэвтэрч чадсангүй: '+(m||'алдаа'));history.replaceState(0,'',location.pathname)}
/* Эхлэл: сервер амьд эсэх ба хэрэглэгчийг зэрэг шалгана. Сервер унтарсан бол засварын хуудас. */
if(document.body.dataset.p!='doc')app.innerHTML='<div class="w"><div class="card sk"></div></div>';
(async()=>{
 const P0=document.body.dataset.p,tmo=(p,ms)=>Promise.race([p,new Promise((_,no)=>setTimeout(()=>no(Error('timeout')),ms))]);
 /* Хурдан эхлэл: хэрэглэгчийг ачаалмагц хуудсаа зурна. Сервер шалгалт ард нь зэрэг явна. */
 const hp=P0=='doc'?Promise.resolve(true):health();
 const lm=await tmo(loadMe(),15000).then(()=>null,x=>x);
 if(lm){const h=await hp;if(!h&&P0!='status')DOWN=true;else if(lm.message!='timeout')console.warn('loadMe',lm)}
 ready=true;route();
 if(!lm)hp.then(h=>{if(!h&&P0!='status'&&P0!='doc'&&!DOWN){DOWN=true;downPage('db')}});
})();
/* Апп (PWA): service worker бүртгэх, суулгах товч */
if('serviceWorker' in navigator&&location.protocol=='https:')addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
addEventListener('beforeinstallprompt',ev=>{ev.preventDefault();window.BIP=ev;document.documentElement.classList.add('can-install')});
addEventListener('appinstalled',()=>{window.BIP=null;document.documentElement.classList.remove('can-install');toast('biof апп суулаа!')});
