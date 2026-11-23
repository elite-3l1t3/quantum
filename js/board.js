/* Тэргүүлэгчид: бүх цагийн үзэлт / like, мөн 7 хоногийн шилдэг (top_week RPC) */
const LB_TABS=[['week','bolt','7 хоног'],['views','eye','Үзэлт'],['likes','heart','Like'],['new','spark','Шинэчлэгдсэн']];
const sGet=k=>{try{const c=JSON.parse(localStorage[k]||'null');return c&&Date.now()-c.t<3e5?c.r:null}catch{return null}};
const sSet=(k,r)=>{try{localStorage[k]=JSON.stringify({t:Date.now(),r})}catch{}};
async function lbFetch(by,n){
 const key='lb4_'+by+n,c=sGet(key);if(c)return c;
 let rows=[];
 if(by=='new'){const r=await sb.rpc('new_pages',{p_limit:n});if(r.error){console.warn('new_pages',r.error.message);return null}rows=r.data||[]}
 else if(by=='week'){const r=await sb.rpc('top_week',{p_limit:n});if(r.error){console.warn('top_week',r.error.message);return null}rows=(r.data||[]).map(x=>({...x,week:x.n}))}
 else rows=(await sb.from('profiles').select('bid,username,display_name,avatar_url,views,likes').not('username','is',null).order(by,{ascending:false}).limit(n)).data||[];
 sSet(key,rows);return rows;
}
/* "3 цагийн өмнө" гэх мэт */
const ago=t=>{const s=(Date.now()-new Date(t).getTime())/1e3;if(!(s>=0))return'';if(s<60)return'Дөнгөж сая';if(s<3600)return Math.floor(s/60)+' мин өмнө';if(s<86400)return Math.floor(s/3600)+' цагийн өмнө';if(s<2592e3)return Math.floor(s/86400)+' өдрийн өмнө';return new Date(t).toLocaleDateString()};
const lbVal=(p,by)=>by=='new'?(p.edited_at?[ic('clock',16),ago(p.edited_at)]:[ic('eye',16),p.views]):by=='week'?[ic('eye',16),p.week]:[ic(by=='views'?'eye':'heart',16),p[by]];
const lbRowsHTML=(rows,by)=>(rows||[]).map((p,i)=>{const v=lbVal(p,by);return`<a class="row lbr" href="/${e(p.username)}"><b class="rk r${i+1}">${i+1}</b>${av(p)}<span class="nm2">${e(p.display_name||p.username)} <small class="mu">@${e(p.username)}</small></span><b class="val">${v[0]}${v[1]??0}</b></a>`}).join('')||'<p class="mu" style="text-align:center;padding:14px">Одоогоор хуудас алга.</p>';
const lbTabsHTML=by=>`<div class="lbt" role="tablist">${LB_TABS.map(t=>`<button type="button" class="${by==t[0]?'on':''}" data-by="${t[0]}">${ic(t[1],18)}<span>${t[2]}</span></button>`).join('')}</div>`;
async function board(v,by){
 const auto=!by;by=LB_TABS.some(t=>t[0]==by)?by:'week';
 let rows=await lbFetch(by,50);
 if(rows==null||(auto&&by=='week'&&!rows.length)){by='views';rows=await lbFetch('views',50)}
 v.innerHTML=`<div class="dash"><h1 class="sec2" style="margin:12px 0 6px">Тэргүүлэгчид</h1><p class="mu" style="text-align:center">${by=='new'?'Сүүлийн үед агуулгаа шинэчилсэн хуудсууд.':by=='week'?'Сүүлийн 7 хоногт хамгийн их үзэгдсэн хуудсууд.':'Бүх цагийн хамгийн олон үзэлттэй, хамгийн их таалагдсан хуудсууд.'}</p>${lbTabsHTML(by)}<button type="button" class="g" data-search="1" style="width:100%;margin-bottom:12px;justify-content:flex-start;gap:10px">${ic('search',18)}<span>Хүн хайх…</span></button><div class="cd">${lbRowsHTML(rows,by)}</div></div>`;
 v.querySelectorAll('[data-by]').forEach(b=>b.onclick=()=>board(v,b.dataset.by));
}
