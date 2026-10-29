const TUT0=[{t:'Discord-оор нэвтэр',x:'Нүүр хуудсан дээрх "Discord-оор нэвтрэх" товчийг дарна.'},{t:'Нэрээ ав',x:'Өөрийн хаяг болгох нэрээ бичээд "Нэрээ авах" товчийг дарна. Зөвхөн англи жижиг үсэг, тоо, _ ашиглана.'},{t:'Хуудсаа тохируул',x:'Тохируулга хэсэгт профайл зураг, дэвсгэр, дуугаа оруулна. Өнгөө бэлэн загвараас сонгоно.'},{t:'Холбоосоо нэм',x:'"Холбоосууд" таб дээр Instagram, YouTube зэрэг платформоо сонгоод хаягаа оруулна.'},{t:'Хадгалаад хуваалц',x:'Доор гарч ирэх "Хадгалах" товчийг дараад biof.site/нэр хаягаа найзуудтайгаа хуваалцана.'}];
async function tutorial(v){
 const r=await sb.from('site_content').select('body').eq('k','tutorial').maybeSingle();
 let steps=TUT0;
 try{const j=JSON.parse((r.data&&r.data.body)||'');if(Array.isArray(j)&&j.length)steps=j.filter(s=>s&&s.t).slice(0,12)}catch{}
 const adm=me&&me.role=='admin';
 v.innerHTML=`<div class="dash"><h1 class="sec2" style="margin:12px 0 6px">Заавар</h1><p class="mu" style="text-align:center;margin-bottom:18px">Эхлэхэд туслах богино заавар.</p>${steps.map((s,i)=>`<div class="stp"><em>${i+1}</em><div><b>${e(s.t)}</b><small>${e(s.x||'')}</small></div></div>`).join('')}${adm?`<div class="act"><button class="g" type="button" id="te">${ic('text',18)}Заавар засах</button></div>`:''}<div id="ted"></div></div>`;
 if(adm)v.querySelector('#te').onclick=()=>tutEdit(v,steps);
}
function tutEdit(v,steps){
 const L=steps.map(s=>({t:s.t||'',x:s.x||''})),box=v.querySelector('#ted');
 const draw=()=>{box.innerHTML=`<div class="cd" style="margin-top:16px"><h3>Заавар засах</h3><p class="mu" style="margin-bottom:8px">Та сайтын анхны админ тул бусад хүмүүст зориулсан зааврыг энд бичнэ.</p>${L.map((s,i)=>`<div class="lr"><div class="lf"><input data-i="${i}" data-f="t" maxlength="80" placeholder="Гарчиг" value="${e(s.t)}"><textarea data-i="${i}" data-f="x" maxlength="600" rows="2" placeholder="Тайлбар">${e(s.x)}</textarea></div><div class="la"><button type="button" data-mv="${i}" data-d="-1" aria-label="Дээш">${ic('up',16)}</button><button type="button" data-mv="${i}" data-d="1" aria-label="Доош">${ic('down',16)}</button><button type="button" class="dg" data-del="${i}" aria-label="Устгах">${ic('trash',16)}</button></div></div>`).join('')}<div class="act" style="margin-top:14px"><button class="g" type="button" id="ta">${ic('plus',18)}Алхам нэмэх</button><button type="button" id="ts">Хадгалах</button></div></div>`};
 draw();
 box.oninput=ev=>{const i=ev.target.dataset.i;if(i!=null)L[i][ev.target.dataset.f]=ev.target.value};
 box.onclick=async ev=>{
  const m=ev.target.closest('[data-mv]'),d=ev.target.closest('[data-del]');
  if(m){const i=+m.dataset.mv,j=i+ +m.dataset.d;if(j>=0&&j<L.length){[L[i],L[j]]=[L[j],L[i]];draw()}}
  else if(d){L.splice(+d.dataset.del,1);draw()}
  else if(ev.target.closest('#ta')){if(L.length<12){L.push({t:'',x:''});draw()}}
  else if(ev.target.closest('#ts')){
   const body=JSON.stringify(L.filter(s=>s.t.trim()).map(s=>({t:s.t.trim().slice(0,80),x:s.x.trim().slice(0,600)})));
   const{data,error}=await sb.rpc('admin_set_tutorial',{p_body:body});
   if(error||data!='ok')toast(error?error.message:'Заавар хэт урт байна');else{toast('Заавар хадгалагдлаа');tutorial(v)}}};
}
