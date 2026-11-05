async function board(v,by){
 const key='lb_'+by;let rows=null;
 try{const c=JSON.parse(sessionStorage[key]||'null');if(c&&Date.now()-c.t<6e4)rows=c.r}catch{}
 if(!rows){rows=(await sb.from('profiles').select('bid,username,display_name,avatar_url,views,likes').not('username','is',null).order(by,{ascending:false}).limit(50)).data||[];sessionStorage[key]=JSON.stringify({t:Date.now(),r:rows})}
 v.innerHTML=`<div class="dash"><h1 class="sec2" style="margin:12px 0 6px">Тэргүүлэгчид</h1><p class="mu" style="text-align:center">Хамгийн олон үзэлттэй, хамгийн их таалагдсан хуудснууд.</p><div class="tabs2" style="justify-content:center;margin-top:14px"><button type="button" class="${by=='views'?'on':''}" data-by="views">${ic('eye',18)}<span>Үзэлт</span></button><button type="button" class="${by=='likes'?'on':''}" data-by="likes">${ic('heart',18)}<span>Like</span></button></div><div class="cd">${rows.map((p,i)=>`<a class="row lbr" href="/${e(p.username)}"><b class="rk r${i+1}">${i+1}</b>${av(p)}<span class="nm2">${e(p.display_name||p.username)} <small class="mu">#${p.bid}</small></span><b class="val">${ic(by=='views'?'eye':'heart',16)}${p[by]}</b></a>`).join('')||'<p class="mu" style="text-align:center">Одоогоор хуудас алга.</p>'}</div></div>`;
 v.querySelectorAll('[data-by]').forEach(b=>b.onclick=()=>board(v,b.dataset.by));
}
