const sel=(id,cur,o)=>`<select id="${id}">${o.map(x=>`<option value="${x[0]}"${cur==x[0]?' selected':''}>${x[1]}</option>`).join('')}</select>`;
const shrink=(f,max)=>new Promise((ok,no)=>{if(f.type=='image/gif')return ok(f);const i=new Image();i.onload=()=>{const r=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*r);c.height=Math.round(i.height*r);c.getContext('2d').drawImage(i,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no(Error('Зураг уншигдсангүй')),'image/webp',.85)};i.onerror=()=>no(Error('Зураг биш байна'));i.src=URL.createObjectURL(f)});
async function up(kind,f){
 const T={avatar:'image',bg:'image',video:'video',music:'audio'}[kind],lim={image:12,video:8,audio:5}[T];
 if(!f.type.startsWith(T))throw Error('Буруу төрлийн файл');
 if(f.size>lim*1048576)throw Error('Файл '+lim+'MB-аас бага байх ёстой');
 let body=f,ct=f.type,ext=(f.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,4)||'bin';
 if(T=='image'&&f.type!='image/gif'){body=await shrink(f,kind=='avatar'?512:1920);ct='image/webp';ext='webp'}
 const path=me.id+'/'+kind+'.'+ext;
 const{error}=await sb.storage.from('media').upload(path,body,{upsert:true,contentType:ct,cacheControl:'31536000'});
 if(error)throw error;
 return sb.storage.from('media').getPublicUrl(path).data.publicUrl+'?v='+Date.now();
}
