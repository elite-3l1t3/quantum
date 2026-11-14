/* Тэргүүлэгчид: бүх цагийн үзэлт / like, мөн 7 хоногийн шилдэг (top_week RPC) */
const LB_TABS=[['week','bolt','7 хоног'],['views','eye','Үзэлт'],['likes','heart','Like']];
const sGet=k=>{try{const c=JSON.parse(sessionStorage[k]||'null');return c&&Date.now()-c.t<6e4?c.r:null}catch{return null}};
const sSet=(k,r)=>{try{sessionStorage[k]=JSON.stringify({t:Date.now(),r})}catch{}};
async function lbFetch(by,n){
 const key='lb3_'+by+n,c=sGet(key);if(c)return c;
 let rows=[];
 if(by=='week'){const r=await sb.rpc('top_week',{p_limit:n});if(r.error){console.warn('top_week',r.error.message);return null}rows=(r.data||[]).map(x=>({...x,week:x.n}))}
 else rows=(await sb.from('profiles').select('bid,username,display_name,avatar_url,views,likes').not('username','is',null).order(by,{ascending:false}).limit(n)).data||[];
 sSet(key,rows);return rows;
}
const lbVal=(p,by)=>by=='week'?[ic('eye',16),p.week]:[ic(by=='views'?'eye':'heart',16),p[by]];
const lbRowsHTML=(rows,by)=>(rows||[]).map((p,i)=>{const v=lbVal(p,by);return`<a class="row lbr" href="/${e(p.username)}"><b class="rk r${i+1}">${i+1}</b>${av(p)}<span class="nm2">${e(p.display_name||p.username)} <small class="mu">@${e(p.username)}</small></span><b class="val">${v[0]}${v[1]??0}</b></a>`}).join('')||'<p class="mu" style="text-align:center;padding:14px">Одоогоор хуудас алга.</p>';
const lbTabsHTML=by=>`<div class="lbt" role="tablist">${LB_TABS.map(t=>`<button type="button" class="${by==t[0]?'on':''}" data-by="${t[0]}">${ic(t[1],18)}<span>${t[2]}</span></button>`).join('')}</div>`;
async function board(v,by){
 const auto=!by;by=LB_TABS.some(t=>t[0]==by)?by:'week';
 let rows=await lbFetch(by,50);
 if(rows==null||(auto&&by=='week'&&!rows.length)){by='views';rows=await lbFetch('views',50)}
 v.innerHTML=`<div class="dash"><h1 class="sec2" style="margin:12px 0 6px">Тэргүүлэгчид</h1><p class="mu" style="text-align:center">${by=='week'?'Сүүлийн 7 хоногт хамгийн их үзэгдсэн хуудсууд.':'Бүх цагийн хамгийн олон үзэлттэй, хамгийн их таалагдсан хуудсууд.'}</p>${lbTabsHTML(by)}<div class="cd">${lbRowsHTML(rows,by)}</div></div>`;
 v.querySelectorAll('[data-by]').forEach(b=>b.onclick=()=>board(v,b.dataset.by));
}
