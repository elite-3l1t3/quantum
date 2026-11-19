/* Алхам алхмаар заавар: гэрэлтүүлсэн хэсэг + сум. Бөмбөлөг ҮРГЭЛЖ дэлгэц дотор байна (гацахгүй).
   Товчлуур: → / Enter = дараах, ← = буцах, Esc = алгасах */
function startTour(steps){
 document.querySelectorAll('.tour').forEach(x=>x.remove());
 let i=0,tk=0;
 const ov=document.createElement('div');ov.className='tour';
 ov.innerHTML='<div class="spot"></div><div class="tbub" role="dialog" aria-live="polite"><div class="tbh"><span class="tmas">'+ic('spark',22)+'</span><span class="tnum"></span><button type="button" class="g tx" data-k="skip" aria-label="Хаах">'+ic('x',14)+'</button></div><h3></h3><p></p><div class="tdots"></div><div class="act tba"><button type="button" class="g" data-k="skip">Алгасах</button><button type="button" class="g" data-k="back">Буцах</button><button type="button" data-k="next">Дараах</button></div></div>';
 document.body.append(ov);
 const sp=ov.querySelector('.spot'),bb=ov.querySelector('.tbub'),q=s=>document.querySelector(s);
 const vis=el=>{if(!el)return false;const r=el.getBoundingClientRect();return r.width>0&&r.height>0};
 const center=()=>{sp.style.cssText='left:50%;top:50%;width:0;height:0;opacity:0';bb.classList.remove('abv','nar');bb.style.cssText='left:50%;top:50%;transform:translate(-50%,-50%)'};
 const target=s=>{let el=s.sel?q(s.sel):null;if(!vis(el)&&s.alt)el=q(s.alt);return vis(el)?el:null};
 const put=el=>{
  const r=el.getBoundingClientRect(),pad=8,H=innerHeight,W=innerWidth;
  const top0=Math.max(4,r.top-pad),bot0=Math.min(H-4,r.bottom+pad);
  sp.style.cssText='left:'+Math.max(4,r.left-pad)+'px;top:'+top0+'px;width:'+Math.min(W-8,r.width+pad*2)+'px;height:'+Math.max(0,bot0-top0)+'px';
  const bh=bb.offsetHeight,bw=bb.offsetWidth;
  let top,abv=false,nar=true;
  if(bot0+14+bh<=H-10)top=bot0+14;
  else if(top0-14-bh>=10){top=top0-14-bh;abv=true}
  else{top=H-bh-10;nar=false}
  top=Math.max(10,Math.min(H-bh-10,top));
  const left=Math.min(W-bw-10,Math.max(10,r.left+r.width/2-bw/2));
  bb.style.cssText='left:'+left+'px;top:'+top+'px;transform:none';
  bb.classList.toggle('abv',abv);bb.classList.toggle('nar',!nar);
  bb.style.setProperty('--ax',Math.max(24,Math.min(bw-24,r.left+r.width/2-left))+'px');
 };
 const place=(noScroll)=>{
  const s=steps[i],el=target(s),my=++tk;
  if(!el){center();return}
  if(noScroll===true){put(el);return}
  const r=el.getBoundingClientRect();
  const big=r.height>innerHeight*.6;
  if(big?(r.top<70||r.top>innerHeight*.35):(r.top<70||r.bottom>innerHeight-40)){
   scrollTo({top:scrollY+r.top-(big?80:(innerHeight-r.height)/2),behavior:'auto'});
  }
  requestAnimationFrame(()=>{if(my==tk)put(el)});
  setTimeout(()=>{if(my==tk&&ov.isConnected)put(el)},250);
 };
 const show=()=>{
  const s=steps[i];
  if(s.tab){const tb=q('.tabs2 button[data-t="'+s.tab+'"]');if(tb&&!tb.classList.contains('on'))tb.click()}
  if(s.open){const b=q(s.open);if(b&&vis(b))b.click()}
  bb.querySelector('.tnum').textContent=(i+1)+' / '+steps.length;
  bb.querySelector('h3').textContent=s.t;bb.querySelector('p').textContent=s.x;
  bb.querySelector('.tdots').innerHTML=steps.map((_,j)=>'<i class="'+(j==i?'on':j<i?'dn':'')+'"></i>').join('');
  bb.querySelector('[data-k=back]').style.visibility=i?'visible':'hidden';
  bb.querySelector('[data-k=next]').textContent=i==steps.length-1?'Дуусгах':'Дараах';
  bb.classList.remove('pop');void bb.offsetWidth;bb.classList.add('pop');
  setTimeout(place,60);
 };
 let rt=0;const rz=()=>{clearTimeout(rt);rt=setTimeout(()=>place(true),60)};
 const kd=ev=>{if(ev.key=='Escape')end(false);else if(ev.key=='ArrowRight'||ev.key=='Enter'){ev.preventDefault();next()}else if(ev.key=='ArrowLeft')back()};
 const end=done=>{if(!ov.isConnected)return;ov.remove();const pv=q('#pvside.show');if(pv)pv.classList.remove('show');
  removeEventListener('resize',rz);removeEventListener('scroll',rz);document.removeEventListener('keydown',kd);localStorage.tourSeen=1;
  if(done){if(!localStorage.toured)toast('Заавар дууслаа! +20 XP авлаа');localStorage.toured=1;if(typeof updPrev=='function')updPrev()}};
 const next=()=>{if(i==steps.length-1)end(true);else{i++;show()}};
 const back=()=>{if(i>0){i--;show()}};
 addEventListener('resize',rz);addEventListener('scroll',rz,{passive:true});document.addEventListener('keydown',kd);
 ov.onclick=ev=>{const b=ev.target.closest('[data-k]');if(!b)return;const a=b.dataset.k;if(a=='skip')end(false);else if(a=='back')back();else next()};
 show();
}
