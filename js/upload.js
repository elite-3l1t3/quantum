const shrink=(f,max,type='image/webp')=>new Promise((ok,no)=>{
 if(f.type=='image/gif'&&type=='image/webp')return ok(f);
 const i=new Image(),u=URL.createObjectURL(f);
 i.onload=()=>{URL.revokeObjectURL(u);const r=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(i.width*r));c.height=Math.max(1,Math.round(i.height*r));c.getContext('2d').drawImage(i,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no(Error('Зураг уншигдсангүй')),type,.78)};
 i.onerror=()=>{URL.revokeObjectURL(u);no(Error('Энэ файл зураг биш байна'))};
 i.src=u});
const pathOf=u=>((u||'').split('/media/')[1]||'').split('?')[0];
async function up(kind,f){
 const T={avatar:'image',bg:'image',video:'video',music:'audio',cursor:'image'}[kind],lim={image:5,video:4,audio:3}[T];
 if(!f.type.startsWith(T))throw Error('Буруу төрлийн файл сонгосон байна');
 if(f.size>lim*1048576)throw Error('Файл '+lim+'MB-аас хэтэрсэн байна');
 let body=f,ct=f.type,ext=(f.name.split('.').pop()||'bin').toLowerCase().replace(/[^a-z0-9]/g,'').slice(0,4)||'bin';
 if(T=='image'){
  if(kind=='cursor'){body=await shrink(f,64,'image/png');ct='image/png';ext='png'}
  else if(f.type!='image/gif'){body=await shrink(f,kind=='avatar'?256:1280);ct='image/webp';ext='webp'}}
 const path=me.id+'/'+kind+'.'+ext;
 const{error}=await sb.storage.from('media').upload(path,body,{upsert:true,contentType:ct,cacheControl:'31536000'});
 if(error)throw error;
 return sb.storage.from('media').getPublicUrl(path).data.publicUrl+'?v='+Date.now();
}
