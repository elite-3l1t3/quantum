async function admin(v){
 if(me?.role!='admin')return v.innerHTML='<div class="card">Таньд эрх алга</div>';
 const{data}=await sb.from('profiles').select('bid,username,display_name,role,banned,approved,badges,views,likes').order('bid').limit(500);
 v.innerHTML=`<div class="card" style="max-width:760px;text-align:left"><h2>Admin</h2><div class="act" style="justify-content:flex-start;margin:10px 0"><button id="op">Сайтыг нээх (бүгдийг идэвхжүүлэх)</button><button class="g" id="cl">Хүлээлгийн горимд оруулах</button></div><input id="q" placeholder="Нэр эсвэл #дугаараар хайх">
 <div style="display:flex;gap:6px;margin-bottom:10px"><input id="ru" style="margin:0" placeholder="нэр"><button id="rs">Нөөцлөх</button><button class="g" id="rr">Чөлөөлөх</button></div><div id="list"></div></div>`;
 const act=async(a,t,val)=>{const{data:d,error}=await sb.rpc('admin_act',{act:a,target:t,val:val??''});alert(error?error.message:(ERR[d]||d));admin(v)};
 const draw=()=>{const q=$('#q').value.toLowerCase().replace('#','');
  $('#list').innerHTML=data.filter(p=>!q||(p.username||'').includes(q)||String(p.bid)==q).map(p=>`<div class="row" style="flex-wrap:wrap"><b>#${p.bid}</b><span style="flex:1">${e(p.username||'—')} ${p.banned?'<span class="bad">ХААСАН</span>':''}${p.approved?'':'<span class="bd">ХҮЛЭЭЖ БУЙ</span>'} <small style="color:var(--m)">${ic('eye',13)} ${p.views} ${ic('heart',13)} ${p.likes}</small></span>
  ${p.approved?'':`<button data-a="approve" data-b="${p.bid}">Зөвшөөрөх</button>`}<button class="g" data-a="${p.banned?'unban':'ban'}" data-b="${p.bid}">${p.banned?'Нээх':'Хаах'}</button><button class="g" data-a="rename" data-b="${p.bid}">Нэр солих</button><button class="g" data-a="free" data-b="${p.bid}">Нэр чөлөөлөх</button><button class="g" data-a="badges" data-b="${p.bid}">Тэмдэг</button></div>`).join('')};
 draw();$('#q').oninput=draw;
 $('#list').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const a=b.dataset.a,t=+b.dataset.b;
  if(a=='rename'){const x=prompt('Шинэ нэр');if(x)act(a,t,x)}
  else if(a=='badges'){const x=prompt('Тэмдгүүдийг таслалаар тусгаарлан бичнэ үү (жишээ: verified,staff)');if(x!==null)act(a,t,x)}
  else if(a=='ban'){const x=prompt('Хаасан шалтгаан');if(x!==null)act(a,t,x)}
  else act(a,t)};
 $('#op').onclick=()=>confirm('Бүх хэрэглэгчийн хуудсыг нээх үү?')&&act('open',0,'');$('#cl').onclick=()=>act('close',0,'');
 $('#rs').onclick=()=>$('#ru').value&&act('reserve',0,$('#ru').value);
 $('#rr').onclick=()=>$('#ru').value&&act('release',0,$('#ru').value);
}
