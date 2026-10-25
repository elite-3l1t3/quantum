function settings(v){
 if(!me)return v.innerHTML='<div class="card"><p>Эхлээд нэвтэрнэ үү.</p><br><button class="lg">Discord-оор нэвтрэх</button></div>';
 if(!me.approved){v.innerHTML=`<div class="card"><span class="pill">Waitlist</span><h2 style="margin:6px 0">#${me.bid} · biof.site/${e(me.username||'—')}</h2><p style="color:var(--m)">${me.username?'Таны username нөөцлөгдлөө. Release болмогц хуудсаа тохируулж эхэлнэ.':'Эхлээд username-аа сонгоно уу.'}</p><div class="act">${me.username?'':'<a href="/"><button>Нэр авах</button></a>'}<button class="g" id="lo">Гарах</button></div></div>`;$('#lo').onclick=async()=>{await sb.auth.signOut();go('/')};return}
 const t=me.theme||{},cur={avatar:me.avatar_url||'',bg:me.bg_url||'',video:t.video||'',music:t.music||''};
 const L=(me.links||[]).map(l=>`${l.label} | ${l.url}`).join('\n');
 const fu=(k,lab,acc)=>`<label>${lab}</label><div class="fu"><input type="file" data-k="${k}" accept="${acc}"><button class="g" type="button" data-x="${k}">Устгах</button></div><small id="s_${k}" style="color:var(--m)">${cur[k]?'✓ Оруулсан':'Файл сонгоогүй'}</small><br><br>`;
 const TB=[['p','Профайл'],['l','Төрх'],['m','Медиа'],['k','Линк']];
 v.innerHTML=`<div class="card" style="text-align:left;max-width:560px"><h2>#${me.bid} Тохиргоо</h2>${me.username?`<a class="tpl" href="/${e(me.username)}">biof.site/${e(me.username)} →</a>`:''}
 <div class="tabs">${TB.map((x,i)=>`<button class="g${i?'':' on'}" data-t="${x[0]}">${x[1]}</button>`).join('')}</div>
 <div class="tab" data-t="p"><label>Username (7 хоногт 1 удаа солино)</label><input id="un" maxlength="20" value="${e(me.username||'')}">
 <label>Нэр</label><input id="dn" maxlength="40" value="${e(me.display_name)}">
 <label>Bio</label><textarea id="bi" rows="3" maxlength="200">${e(me.bio)}</textarea>
 <label>Байршил</label><input id="lc" maxlength="30" value="${e(t.loc)}">
 <label>Click-to-enter текст</label><input id="en" maxlength="40" value="${e(t.enter)}"><label><input id="pr" type="checkbox" style="width:auto;margin-right:8px" ${me.presence_id?'checked':''}>Discord төлөв харуулах (discord.gg/lanyard серверт нэгдсэн байх ёстой)</label></div>
 <div class="tab" data-t="l" hidden><label>Accent өнгө</label><input id="ac" type="color" value="${e(me.accent||'#e8a317')}">
 <label>Текстийн өнгө</label><input id="tc" type="color" value="${e(t.tc||'#f6ead2')}">
 <label>Хайрцгийн opacity</label><input id="op" type="range" min=".3" max="1" step=".05" value="${e(t.op||.93)}">
 <label>Хайрцгийн булан</label><input id="rd" type="range" min="0" max="40" value="${e(t.r??20)}">
 <label><input id="tw" type="checkbox" style="width:auto;margin-right:8px" ${t.tw?'checked':''}>Bio-г typewriter-ээр бичих</label><label style="display:block;margin-top:10px">Avatar хэлбэр</label>${sel('sh',t.sh||'circle',[['circle','Дугуй'],['round','Булангаар'],['square','Дөрвөлжин']])}<label>Нэрний эффект</label>${sel('fx',t.fx||'none',[['none','Байхгүй'],['glow','Гэрэлтэх'],['sparkle','Гялбаа']])}<label>Линкийн загвар</label>${sel('lsx',t.ls||'fill',[['fill','Дүүрэн'],['outline','Хүрээтэй'],['pill','Дугуй']])}<label><input id="tl" type="checkbox" style="width:auto;margin-right:8px" ${t.tl?'checked':''}>3D tilt (компьютер дээр)</label><br><br><button class="g" type="button" id="tpl">Template ашиглах (/a)</button></div>
 <div class="tab" data-t="m" hidden>${fu('avatar','Avatar (зураг эсвэл gif)','image/*')}${fu('bg','Background зураг','image/*')}${fu('video','Background видео (mp4/webm, 8MB хүртэл)','video/mp4,video/webm')}${fu('music','Дуу (mp3, 5MB хүртэл)','audio/*')}</div>
 <div class="tab" data-t="k" hidden><label>Линкүүд (мөр бүр: Нэр | https://url)</label><textarea id="ls" rows="7">${e(L)}</textarea></div>
 <p id="ms" style="min-height:22px"></p><button id="sv">Хадгалах</button> <button class="g" id="lo">Гарах</button></div>`;
 const tb=[...v.querySelectorAll('.tabs button')];
 tb.forEach(b=>b.onclick=()=>{tb.forEach(x=>x.classList.toggle('on',x==b));v.querySelectorAll('.tab').forEach(x=>x.hidden=x.dataset.t!=b.dataset.t)});
 v.querySelectorAll('input[type=file]').forEach(i=>i.onchange=async()=>{
  const k=i.dataset.k,s=$('#s_'+k),f=i.files[0];if(!f)return;
  s.textContent='Хуулж байна…';
  try{cur[k]=await up(k,f);s.textContent='✓ Орлоо. Хадгалах дарна уу'}catch(x){s.textContent='Алдаа: '+(x.message||x)}});
 v.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>{cur[b.dataset.x]='';$('#s_'+b.dataset.x).textContent='Устгагдана. Хадгалах дарна уу'});
 $('#tpl').onclick=()=>{$('#ac').value='#e8a317';$('#tc').value='#f6ead2';$('#op').value=.93;$('#rd').value=20;$('#tw').checked=true;$('#ms').textContent='Template орлоо. Хадгалах дарна уу'};
 $('#lo').onclick=async()=>{await sb.auth.signOut();go('/')};
 $('#sv').onclick=async()=>{
  const un=$('#un').value.trim().toLowerCase();
  if(un&&un!=me.username){const{data}=await sb.rpc('claim_username',{u:un});if(data!='ok')return $('#ms').textContent=ERR[data]||data}
  const links=$('#ls').value.split('\n').map(x=>x.split('|').map(s=>s.trim())).filter(a=>a[0]&&/^https?:\/\//i.test(a[1]||'')).slice(0,12).map(a=>({label:a[0].slice(0,40),url:a[1]}));
  const theme={loc:$('#lc').value,enter:$('#en').value,video:cur.video,music:cur.music,tc:$('#tc').value,op:+$('#op').value,r:+$('#rd').value,tw:$('#tw').checked,sh:$('#sh').value,fx:$('#fx').value,ls:$('#lsx').value,tl:$('#tl').checked};
  const{error}=await sb.from('profiles').update({display_name:$('#dn').value,bio:$('#bi').value,avatar_url:cur.avatar||null,bg_url:cur.bg||null,accent:$('#ac').value,links,theme}).eq('id',me.id);
  if(error)return $('#ms').textContent=error.message;
  await sb.rpc('set_presence',{p_on:$('#pr').checked});await loadMe();$('#ms').textContent='Хадгаллаа ✓';
 };
}
