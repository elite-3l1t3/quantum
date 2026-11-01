/* Roblox тоглоомын заавар шиг: гэрэлтүүлсэн хэсэг + сум + алхам алхмаар */
function startTour(steps){
 let i=0;
 const ov=document.createElement('div');ov.className='tour';
 ov.innerHTML='<div class="spot"></div><div class="tbub"><div class="tbh"><span class="tmas">'+ic('spark',22)+'</span><span class="tnum"></span></div><h3></h3><p></p><div class="act tba"><button type="button" class="g" data-k="skip">Алгасах</button><button type="button" class="g" data-k="back">Буцах</button><button type="button" data-k="next">Дараах</button></div></div>';
 document.body.append(ov);
 const sp=ov.querySelector('.spot'),bb=ov.querySelector('.tbub'),q=s=>document.querySelector(s);
 const center=()=>{sp.style.cssText='left:50%;top:50%;width:0;height:0';bb.style.cssText='left:50%;top:50%;transform:translate(-50%,-50%)'};
 const place=s=>{
  let el=s.sel?q(s.sel):null;
  if(el&&!el.getBoundingClientRect().width&&s.alt)el=q(s.alt);
  if(!el||!el.getBoundingClientRect().width){center();return}
  el.scrollIntoView({block:'center',behavior:'smooth'});
  setTimeout(()=>{
   const r=el.getBoundingClientRect(),pad=8;
   sp.style.cssText='left:'+(r.left-pad)+'px;top:'+(r.top-pad)+'px;width:'+(r.width+pad*2)+'px;height:'+(r.height+pad*2)+'px';
   const bh=bb.offsetHeight,bw=bb.offsetWidth;let top=r.bottom+pad+14;
   if(top+bh>innerHeight-10)top=Math.max(10,r.top-bh-pad-14);
   const left=Math.min(innerWidth-bw-10,Math.max(10,r.left+r.width/2-bw/2));
   bb.style.cssText='left:'+left+'px;top:'+top+'px;transform:none';
  },380);
 };
 const show=()=>{
  const s=steps[i];
  if(s.tab){const tb=q('.tabs2 button[data-t="'+s.tab+'"]');if(tb)tb.click()}
  bb.querySelector('.tnum').textContent=(i+1)+' / '+steps.length;
  bb.querySelector('h3').textContent=s.t;bb.querySelector('p').textContent=s.x;
  bb.querySelector('[data-k=back]').style.visibility=i?'visible':'hidden';
  bb.querySelector('[data-k=next]').textContent=i==steps.length-1?'Дуусгах':'Дараах';
  bb.classList.remove('pop');void bb.offsetWidth;bb.classList.add('pop');
  setTimeout(()=>place(s),70);
 };
 const rz=()=>place(steps[i]);
 const end=done=>{ov.remove();removeEventListener('resize',rz);localStorage.tourSeen=1;if(done){localStorage.toured=1;toast('Заавар дууслаа! +20 XP авлаа');if(typeof updPrev=='function')updPrev()}};
 addEventListener('resize',rz);
 ov.onclick=ev=>{const b=ev.target.closest('[data-k]');if(!b)return;const a=b.dataset.k;
  if(a=='skip')end(false);else if(a=='back'){if(i>0){i--;show()}}else if(i==steps.length-1)end(true);else{i++;show()}};
 show();
}
