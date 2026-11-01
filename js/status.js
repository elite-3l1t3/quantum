async function pingAuth(){
 const t0=performance.now();
 try{const r=await fetch(SB_URL+'/auth/v1/health',{headers:{apikey:SB_KEY}});return{ok:r.ok,ms:Math.round(performance.now()-t0)}}
 catch{return{ok:false,ms:0}}
}
const stLabel=(ok,ms)=>!ok?['down','Саатсан']:ms>1500?['slow','Удаан']:['ok','Хэвийн'];
async function statusPage(v){
 v.innerHTML=`<div class="dash"><h1 class="sec2" style="margin:12px 0 6px">Системийн төлөв</h1><div class="cd" id="so"></div><div class="cd" id="sc" style="margin-top:14px"></div><div class="cd" id="ss" style="margin-top:14px"></div></div>`;
 const hist=[];let last=Date.now();
 const spark=()=>{const m=Math.max(200,...hist),pts=hist.map((x,i)=>(i/(Math.max(1,hist.length-1))*100).toFixed(1)+','+(40-x/m*36).toFixed(1)).join(' ');return`<svg class="spk" viewBox="0 0 100 44" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg>`};
 const tick=async()=>{
  const[s,a]=await Promise.all([getStatus().catch(()=>({d:null,ms:0,err:1})),pingAuth()]);
  const db=stLabel(!!s.d&&!s.err,s.ms),au=stLabel(a.ok,a.ms),d=s.d||{};
  hist.push(s.ms||0);if(hist.length>24)hist.shift();last=Date.now();
  const all=db[0]=='ok'&&au[0]=='ok';
  const row=(n,l,ms)=>`<div class="srow"><span class="dot ${l[0]}"></span><b>${n}</b><span class="mu">${ms!=null?ms+' мс':''}</span><em class="${l[0]}">${l[1]}</em></div>`;
  v.querySelector('#so').innerHTML=`<div class="big2 ${all?'ok':'bad2'}"><span class="live"><i></i>Шууд</span><h3>${all?'Бүх систем хэвийн ажиллаж байна':'Зарим үйлчилгээ удаан байна'}</h3><small class="mu">Сүүлд шинэчлэгдсэн: <span id="ago">0</span> сек өмнө</small></div>`;
  v.querySelector('#sc').innerHTML=row('Вэб сайт',['ok','Хэвийн'],null)+row('Өгөгдлийн сан',db,s.ms)+row('Нэвтрэлт',au,a.ms)+row('Файл хадгалалт',d.uploads===false?['slow','Түр хаалттай']:['ok','Хэвийн'],null)+`<div class="spw">${spark()}</div>`;
  v.querySelector('#ss').innerHTML=`<div class="stg">${[['total','Нийт бүртгэл'],['today','Өнөөдөр шинэ бүртгэл'],['live','Идэвхтэй хуудас'],['blocked','Хаасан сэжигтэй хүсэлт']].map(x=>`<div><b>${d[x[0]]??'–'}</b><span>${x[1]}</span></div>`).join('')}</div>`;
 };
 await tick();
 window.PI=setInterval(()=>{if(!document.hidden)tick()},15000);
 window.PJ=setInterval(()=>{const el=v.querySelector('#ago');if(el)el.textContent=Math.round((Date.now()-last)/1000)},1000);
}
