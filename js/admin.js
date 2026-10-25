async function admin(v){
 if(me?.role!='admin')return v.innerHTML='<div class="card">Эрх байхгүй</div>';
 const{data}=await sb.from('profiles').select('bid,username,display_name,role,banned,approved,badges,views,likes').order('bid').limit(500);
 v.innerHTML=`<div class="card" style="max-width:760px;text-align:left"><h2>Admin</h2><div class="act" style="justify-content:flex-start;margin:10px 0"><button id="op">Site release (бүгдийг нээх)</button><button class="g" id="cl">Waitlist болгох</button></div><input id="q" placeholder="Хайх: username эсвэл #bid">
 <div style="display:flex;gap:6px;margin-bottom:10px"><input id="ru" style="margin:0" placeholder="username"><button id="rs">Taken</button><button class="g" id="rr">Available</button></div><div id="list"></div></div>`;
 const act=async(a,t,val)=>{const{data:d,error}=await sb.rpc('admin_act',{act:a,target:t,val:val??''});alert(error?error.message:(ERR[d]||d));admin(v)};
 const draw=()=>{const q=$('#q').value.toLowerCase().replace('#','');
  $('#list').innerHTML=data.filter(p=>!q||(p.username||'').includes(q)||String(p.bid)==q).map(p=>`<div class="row" style="flex-wrap:wrap"><b>#${p.bid}</b><span style="flex:1">${e(p.username||'—')} ${p.banned?'<span class="bad">BAN</span>':''}${p.approved?'':'<span class="bd">WAIT</span>'} <small style="color:var(--m)">${p.views}👁 ${p.likes}♥</small></span>
  ${p.approved?'':`<button data-a="approve" data-b="${p.bid}">Approve</button>`}<button class="g" data-a="${p.banned?'unban':'ban'}" data-b="${p.bid}">${p.banned?'Unban':'Ban'}</button><button class="g" data-a="rename" data-b="${p.bid}">Нэр</button><button class="g" data-a="free" data-b="${p.bid}">Free</button><button class="g" data-a="badges" data-b="${p.bid}">Badge</button></div>`).join('')};
 draw();$('#q').oninput=draw;
 $('#list').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const a=b.dataset.a,t=+b.dataset.b;
  if(a=='rename'){const x=prompt('Шинэ username');if(x)act(a,t,x)}
  else if(a=='badges'){const x=prompt('Badge-үүд таслалаар (жишээ: verified,staff)');if(x!==null)act(a,t,x)}
  else if(a=='ban'){const x=prompt('Шалтгаан');if(x!==null)act(a,t,x)}
  else act(a,t)};
 $('#op').onclick=()=>confirm('Бүх хүнийг нээх үү?')&&act('open',0,'');$('#cl').onclick=()=>act('close',0,'');
 $('#rs').onclick=()=>$('#ru').value&&act('reserve',0,$('#ru').value);
 $('#rr').onclick=()=>$('#ru').value&&act('release',0,$('#ru').value);
}
