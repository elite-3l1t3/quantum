async function doRoute(){
 document.body.style.cssText='';clearInterval(window.TT);document.querySelectorAll('.fxp').forEach(x=>x.remove());document.querySelectorAll('.bgv,#ent,.wm').forEach(x=>x.remove());if(aud){aud.pause();aud=null}document.documentElement.style.setProperty('--a','#e2b858');document.documentElement.style.removeProperty('--ic');document.title='biof';document.body.classList.toggle('prof',document.body.dataset.p=='profile');
 const p=decodeURIComponent(location.pathname.slice(1)).toLowerCase().replace(/\/$/,'').replace(/\.html$/,'');
 const P=document.body.dataset.p;
 const FT='<footer><a href="/tos">Үйлчилгээний нөхцөл</a> · <a href="/privacy">Нууцлалын бодлого</a> · © biof</footer>';
 if(P=='doc'){window.DOC=window.DOC||app.innerHTML;app.innerHTML=bar()+DOC+FT;return}
 app.innerHTML=(P=='profile'?'':bar())+'<div class="w" id="v"></div>'+(P=='profile'?'':FT);const v=$('#v');v.innerHTML='<div class="card sk"></div>';
 try{ if(P=='home')await home(v);else if(P=='settings')await settings(v);else if(P=='admin')await admin(v);else if(P=='board')await board(v,'views');else if(P=='tutorial')await tutorial(v);else await profile(v,p)}
 catch(x){v.innerHTML='<div class="card">Алдаа гарлаа: '+e(x.message)+'</div>'}
}

let q=Promise.resolve();
const route=()=>q=q.then(doRoute).catch(x=>toast('Алдаа: '+(x.message||x)));
let ready=false;
sb.auth.onAuthStateChange((_,s)=>{if(ready&&(s?.user?.id||null)!==(user?.id||null))setTimeout(async()=>{await loadMe();route()},0)});
document.head.insertAdjacentHTML('beforeend','<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%278%27 fill=%27%23e2b858%27/%3E%3Ctext x=%2716%27 y=%2723%27 font-size=%2720%27 font-weight=%27800%27 text-anchor=%27middle%27 fill=%27%2314100a%27%3Eb%3C/text%3E%3C/svg%3E">');
if(/error_description/.test(location.hash+location.search)){toast('Нэвтэрч чадсангүй. Бүртгэл хаалттай байж магадгүй.');history.replaceState(0,'',location.pathname)}
loadMe().then(()=>{ready=true;route()});
