/* Файл оруулах: лимитээс том бол автоматаар шахна (зураг → webp/jpeg, видео → webm, дуу → opus/webm),
   профайл зургийг тайрч байрлуулах (crop), дэвсгэрийг утас/компьютер дээр хэрхэн харагдахыг үзүүлэх. */
const MB=1048576,LIM={image:5*MB,video:4*MB,audio:3*MB},HARD={image:40*MB,video:200*MB,audio:80*MB};
let WEBP=null;
const canWebp=()=>{if(WEBP==null){try{const c=document.createElement('canvas');c.width=c.height=1;WEBP=c.toDataURL('image/webp').startsWith('data:image/webp')}catch{WEBP=false}}return WEBP};
const loadImg=f=>new Promise((ok,no)=>{const i=new Image(),u=URL.createObjectURL(f);i.onload=()=>{URL.revokeObjectURL(u);ok(i)};i.onerror=()=>{URL.revokeObjectURL(u);no(Error('Энэ файл зураг биш эсвэл гэмтсэн байна'))};i.src=u});
const toBlob=(c,type,q)=>new Promise((ok,no)=>c.toBlob(b=>b?ok(b):no(Error('Зураг хадгалж чадсангүй')),type,q));
/* Хуучин нэр (бусад кодонд ашиглагддаг) */
const shrink=async(f,max,type='image/webp',q=.8)=>{
 const i=await loadImg(f),r=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');
 c.width=Math.max(1,Math.round(i.width*r));c.height=Math.max(1,Math.round(i.height*r));c.getContext('2d').drawImage(i,0,0,c.width,c.height);
 if(type=='image/webp'&&!canWebp())type='image/jpeg';
 return toBlob(c,type,q);
};
const imgType=()=>canWebp()?'image/webp':'image/jpeg';
/* Зургийг лимитэд багтах хүртэл чанар, хэмжээг бууруулна */
async function fitImage(src,max,lim){
 let q=.82,m=max,b=await shrink(src,m,imgType(),q);
 for(let n=0;b.size>lim&&n<10;n++){if(q>.5)q-=.1;else m=Math.round(m*.8);b=await shrink(src,m,imgType(),q)}
 if(b.size>lim)throw Error('Зургийг хангалттай шахаж чадсангүй. Өөр зураг сонгоно уу.');
 return b;
}
const pathOf=u=>((u||'').split('/media/')[1]||'').split('?')[0];
const extOf=t=>({'image/webp':'webp','image/jpeg':'jpg','image/png':'png','image/gif':'gif','video/webm':'webm','video/mp4':'mp4','audio/webm':'webm','audio/ogg':'ogg','audio/mpeg':'mp3','audio/mp4':'m4a','audio/x-m4a':'m4a','audio/aac':'aac','audio/wav':'wav','audio/x-wav':'wav'})[(t||'').split(';')[0]];
/* Supabase Storage руу хуулах. body нь Blob, kind = avatar|bg|video|music|cursor|lk */
async function putFile(kind,body,ct){
 ct=(ct||body.type||'application/octet-stream').split(';')[0];
 const ext=extOf(ct)||'bin',name=kind=='lk'?'lk_'+Math.random().toString(36).slice(2,10).padEnd(8,'0')+'.'+ext:kind+'.'+ext;
 const path=me.id+'/'+name;
 const{error}=await sb.storage.from('media').upload(path,body,{upsert:true,contentType:ct,cacheControl:'31536000'});
 if(error)throw error;
 return{url:sb.storage.from('media').getPublicUrl(path).data.publicUrl+'?v='+Date.now(),name};
}
/* Хуучин up(): файлыг шалгаж, шаардлагатай бол шахаад хуулна. onp(0..1) явц */
async function up(kind,f,onp,raw){
 const T={avatar:'image',bg:'image',video:'video',music:'audio',cursor:'image',lk:'image'}[kind];
 if(!f||!f.type.startsWith(T))throw Error('Буруу төрлийн файл сонгосон байна');
 if(f.size>HARD[T])throw Error('Файл хэт том байна ('+Math.round(f.size/MB)+'MB). '+Math.round(HARD[T]/MB)+'MB-аас бага файл сонгоно уу.');
 let body=f,ct=f.type;
 if(T=='image'){
  if(raw&&f.size<=LIM.image){body=f}
  else if(kind=='cursor'){body=await shrink(f,32,'image/png');ct='image/png'}
  else if(f.type=='image/gif'&&f.size<=LIM.image&&kind!='lk'){body=f}
  else{body=await fitImage(f,kind=='avatar'?512:kind=='lk'?128:1920,LIM.image);ct=body.type;if(f.type=='image/gif')toast('GIF хэт том байсан тул хөдөлгөөнгүй зураг болгож шахлаа')}
 }else if(T=='video'){
  if(f.size>LIM.video||!/^video\/(mp4|webm)$/.test(f.type)){toast('Видео том байна. Автоматаар шахаж байна, түр хүлээнэ үү…');body=await packVideo(f,LIM.video,onp);ct=body.type}
 }else if(T=='audio'){
  if(f.size>LIM.audio){toast('Дуу том байна. Автоматаар шахаж байна…');body=await packAudio(f,LIM.audio,onp);ct=body.type}
 }
 if(body.size>LIM[T])throw Error('Шахсан ч гэсэн '+Math.round(LIM[T]/MB)+'MB-аас хэтэрлээ. Богино эсвэл жижиг файл сонгоно уу.');
 return(await putFile(kind,body,ct)).url;
}
/* ---------- Видео шахах: canvas + MediaRecorder (бодит хугацаанд, ≤45 сек) ---------- */
async function packVideo(f,lim,onp){
 if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream)throw Error('Таны хөтөч видео шахаж чадахгүй. 4MB-аас бага mp4/webm видео сонгоно уу.');
 const mt=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4;codecs=avc1','video/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
 if(!mt)throw Error('Таны хөтөч видео шахаж чадахгүй. Жижиг видео сонгоно уу.');
 const v=document.createElement('video'),u=URL.createObjectURL(f);
 Object.assign(v,{muted:true,playsInline:true,preload:'auto',src:u});v.setAttribute('playsinline','');
 v.style.cssText='position:fixed;left:-10px;top:0;width:2px;height:2px;opacity:0;pointer-events:none';document.body.append(v);
 try{
  await new Promise((ok,no)=>{v.onloadedmetadata=ok;v.onerror=()=>no(Error('Видео уншигдсангүй. mp4 эсвэл webm файл сонгоно уу.'))});
  const D=isFinite(v.duration)&&v.duration>0?v.duration:45,dur=Math.min(D,45);
  if(D>45)toast('Видео урт тул эхний 45 секундийг авна');
  let tries=0,out=null;
  for(const[maxSide,k]of[[960,.86],[720,.6],[540,.42]]){
   tries++;
   const sc=Math.min(1,maxSide/Math.max(v.videoWidth||maxSide,v.videoHeight||maxSide)),w=Math.max(2,Math.round((v.videoWidth||640)*sc/2)*2),h=Math.max(2,Math.round((v.videoHeight||360)*sc/2)*2);
   const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
   const bps=Math.max(200e3,Math.min(2.5e6,Math.floor(lim*8*k/dur)));
   const st=c.captureStream(30),rec=new MediaRecorder(st,{mimeType:mt,videoBitsPerSecond:bps}),ch=[];
   rec.ondataavailable=ev=>{if(ev.data&&ev.data.size)ch.push(ev.data)};
   const stopped=new Promise(ok=>rec.onstop=ok);
   v.currentTime=0;await new Promise(ok=>{if(v.readyState>=2&&v.currentTime==0)ok();else{v.onseeked=ok;setTimeout(ok,1500)}});
   rec.start(500);await v.play();
   await new Promise(ok=>{
    const step=()=>{x.drawImage(v,0,0,w,h);if(onp)onp(Math.min(.99,v.currentTime/dur));
     if(v.ended||v.currentTime>=dur){ok();return}
     v.requestVideoFrameCallback?v.requestVideoFrameCallback(step):requestAnimationFrame(step)};
    step();v.onended=ok});
   v.pause();rec.stop();await stopped;st.getTracks().forEach(t=>t.stop());
   out=new Blob(ch,{type:mt.split(';')[0]});
   if(out.size<=lim)break;
  }
  if(!out||out.size>lim)throw Error('Видеог хангалттай шахаж чадсангүй. Богино видео сонгоно уу.');
  return out;
 }finally{v.remove();URL.revokeObjectURL(u)}
}
/* ---------- Дуу шахах: WebCodecs Opus + WebM (хурдан). Боломжгүй бол MediaRecorder (бодит хугацаанд). ---------- */
const E8=a=>new Uint8Array(a);
const eid=n=>{const b=[];while(n>0){b.unshift(n&255);n=Math.floor(n/256)}return b};
const esz=n=>{for(let l=1;l<=8;l++){if(n<Math.pow(2,7*l)-1){const b=new Array(l);let x=n;for(let i=l-1;i>=0;i--){b[i]=x&255;x=Math.floor(x/256)}b[0]|=1<<(8-l);return b}}throw Error('size')};
const euint=n=>{const b=eid(n);return b.length?b:[0]};
const ef64=n=>{const a=new DataView(new ArrayBuffer(8));a.setFloat64(0,n);return[...new Uint8Array(a.buffer)]};
const estr=s=>[...new TextEncoder().encode(s)];
const cat=parts=>{let n=0;parts.forEach(p=>n+=p.length);const o=new Uint8Array(n);let i=0;parts.forEach(p=>{o.set(p,i);i+=p.length});return o};
const el=(id,data)=>{const d=data instanceof Uint8Array?data:E8(data);return cat([E8(eid(id)),E8(esz(d.length)),d])};
function webmOpus(frames,durMs,head,ch){
 const hdr=el(0x1A45DFA3,cat([el(0x4286,euint(1)),el(0x42F7,euint(1)),el(0x42F2,euint(4)),el(0x42F3,euint(8)),el(0x4282,estr('webm')),el(0x4287,euint(4)),el(0x4285,euint(2))]));
 const info=el(0x1549A966,cat([el(0x2AD7B1,euint(1e6)),el(0x4D80,estr('biof')),el(0x5741,estr('biof')),el(0x4489,ef64(durMs))]));
 const audio=el(0xE1,cat([el(0xB5,ef64(48000)),el(0x9F,euint(ch))]));
 const tracks=el(0x1654AE6B,el(0xAE,cat([el(0xD7,euint(1)),el(0x73C5,euint(1)),el(0x83,euint(2)),el(0x86,estr('A_OPUS')),el(0x63A2,head),el(0x56AA,euint(6500000)),el(0x56BB,euint(80000000)),audio])));
 const cl=[];let i=0;
 while(i<frames.length){
  const t0=Math.round(frames[i].ts/1000),blocks=[el(0xE7,euint(t0))];
  while(i<frames.length){const rel=Math.round(frames[i].ts/1000)-t0;if(rel>30000)break;
   blocks.push(el(0xA3,cat([E8([0x81,(rel>>8)&255,rel&255,0x80]),frames[i].d])));i++}
  cl.push(el(0x1F43B675,cat(blocks)));
 }
 return new Blob([hdr,el(0x18538067,cat([info,tracks,...cl]))],{type:'audio/webm'});
}
function opusHead(ch){const b=new Uint8Array(19),dv=new DataView(b.buffer);b.set(new TextEncoder().encode('OpusHead'));b[8]=1;b[9]=ch;dv.setUint16(10,312,true);dv.setUint32(12,48000,true);dv.setInt16(16,0,true);b[18]=0;return b}
async function decodeTo48k(f){
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error('Таны хөтөч дуу шахаж чадахгүй. 3MB-аас бага дуу сонгоно уу.');
 const ac=new AC(),ab=await f.arrayBuffer();
 const buf=await new Promise((ok,no)=>{const p=ac.decodeAudioData(ab,ok,()=>no(Error('Дууны файл уншигдсангүй')));if(p&&p.catch)p.catch(()=>{})});
 ac.close&&ac.close().catch(()=>{});
 return buf;
}
async function packAudio(f,lim,onp){
 const buf=await decodeTo48k(f);
 let dur=buf.duration;const ch=Math.min(2,buf.numberOfChannels||1);
 const minB=40000,maxB=128000;
 if(dur*minB/8>lim*.94){dur=Math.floor(lim*.94*8/minB);toast('Дуу урт тул эхний '+Math.round(dur/60)+' минутыг авна')}
 const bitrate=Math.max(minB,Math.min(maxB,Math.floor(lim*.94*8/dur/1000)*1000));
 const OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext;
 const len=Math.ceil(dur*48000),oc=new OAC(ch,len,48000),src=oc.createBufferSource();src.buffer=buf;src.connect(oc.destination);src.start(0);
 const pcm=await oc.startRendering();if(onp)onp(.15);
 const cfg={codec:'opus',sampleRate:48000,numberOfChannels:ch,bitrate};
 let fast=typeof AudioEncoder=='function'&&typeof AudioData=='function';
 if(fast){try{fast=!!(await AudioEncoder.isConfigSupported(cfg)).supported}catch{fast=false}}
 if(!fast)return packAudioRT(pcm,ch,bitrate,lim,onp);
 const frames=[];let head=null,err=null;
 const enc=new AudioEncoder({output:(c,m)=>{const d=new Uint8Array(c.byteLength);c.copyTo(d);frames.push({ts:c.timestamp,d});if(!head&&m&&m.decoderConfig&&m.decoderConfig.description){const x=m.decoderConfig.description;head=new Uint8Array(x.buffer?x.buffer.slice(x.byteOffset||0,(x.byteOffset||0)+x.byteLength):x)}},error:x=>err=x});
 enc.configure(cfg);
 const N=4800,chs=[...Array(ch)].map((_,i)=>pcm.getChannelData(i));
 for(let s=0;s<len;s+=N){
  const n=Math.min(N,len-s),data=new Float32Array(n*ch);
  for(let c=0;c<ch;c++)data.set(chs[c].subarray(s,s+n),c*n);
  enc.encode(new AudioData({format:'f32-planar',sampleRate:48000,numberOfFrames:n,numberOfChannels:ch,timestamp:Math.round(s/48*1000),data}));
  if(s%(N*50)==0){if(onp)onp(.15+.8*s/len);await new Promise(r=>setTimeout(r,0))}
  if(err)throw err;
 }
 await enc.flush();enc.close();if(err)throw err;
 if(!head||head.length<19||String.fromCharCode(...head.slice(0,8))!='OpusHead')head=opusHead(ch);
 const out=webmOpus(frames,dur*1000,head,ch);
 if(out.size>lim)throw Error('Дууг хангалттай шахаж чадсангүй. Богино дуу сонгоно уу.');
 return out;
}
async function packAudioRT(pcm,ch,bitrate,lim,onp){
 const mt=window.MediaRecorder&&['audio/webm;codecs=opus','audio/ogg;codecs=opus','audio/mp4'].find(t=>MediaRecorder.isTypeSupported(t));
 if(!mt)throw Error('Таны хөтөч дуу шахаж чадахгүй. 3MB-аас бага дуу сонгоно уу.');
 const AC=window.AudioContext||window.webkitAudioContext,ac=new AC({sampleRate:48000}),dst=ac.createMediaStreamDestination(),s=ac.createBufferSource();
 s.buffer=pcm;s.connect(dst);
 const rec=new MediaRecorder(dst.stream,{mimeType:mt,audioBitsPerSecond:bitrate}),chs=[];rec.ondataavailable=ev=>ev.data.size&&chs.push(ev.data);
 const done=new Promise(ok=>rec.onstop=ok);
 toast('Таны хөтөч удаан аргаар шахна ('+Math.round(pcm.duration)+' сек). Энэ цонхыг бүү хаагаарай.');
 rec.start(1000);s.start();const t0=ac.currentTime;
 const iv=setInterval(()=>onp&&onp(Math.min(.99,(ac.currentTime-t0)/pcm.duration)),500);
 await new Promise(ok=>s.onended=ok);clearInterval(iv);rec.stop();await done;ac.close().catch(()=>{});
 const out=new Blob(chs,{type:mt.split(';')[0]});
 if(out.size>lim)throw Error('Дууг хангалттай шахаж чадсангүй. Богино дуу сонгоно уу.');
 return out;
}
/* ---------- Профайл зураг тайрах (чирж байрлуулах, томруулах) ---------- */
async function cropDlg(f,o){
 o=o||{};const out=o.out||512,round=o.shape!='square';
 const img=await loadImg(f);
 let z=1,ox=0,oy=0,V=0,base=1;
 const draw=c=>{const x=c.getContext('2d'),r=c.width/V;x.clearRect(0,0,c.width,c.height);x.drawImage(img,ox*r,oy*r,img.width*base*z*r,img.height*base*z*r)};
 const clamp=()=>{const w=img.width*base*z,h=img.height*base*z;ox=Math.min(0,Math.max(V-w,ox));oy=Math.min(0,Math.max(V-h,oy))};
 let cv=null;
 const res=await dlg({icon:false,wide:true,title:o.title||'Зургаа тааруулах',ok:'Хадгалах',
  html:`<p class="mu" style="margin-bottom:10px">Зургаа чирж байрлуулаад, доорх гулсуураар томруулна уу.</p><div class="crw"><canvas class="crc"></canvas><i class="crm${round?' rnd':''}"></i></div><div class="crz">${ic('image',16)}<input type="range" class="crr" min="1" max="4" step=".01" value="1">${ic('image',22)}</div>`,
  wire:d=>{
   const w=d.querySelector('.crw');cv=d.querySelector('.crc');
   V=Math.min(320,innerWidth-80);w.style.width=w.style.height=V+'px';
   const dpr=Math.min(2,devicePixelRatio||1);cv.width=cv.height=Math.round(V*dpr);cv.style.width=cv.style.height=V+'px';
   base=Math.max(V/img.width,V/img.height);ox=(V-img.width*base)/2;oy=(V-img.height*base)/2;draw(cv);
   const rr=d.querySelector('.crr');
   const zoomTo=(nz,cx=V/2,cy=V/2)=>{nz=Math.min(4,Math.max(1,nz));const k=nz/z;ox=cx-(cx-ox)*k;oy=cy-(cy-oy)*k;z=nz;clamp();rr.value=z;draw(cv)};
   rr.oninput=()=>zoomTo(+rr.value);
   const pts=new Map();let pd=0;
   w.addEventListener('pointerdown',ev=>{w.setPointerCapture(ev.pointerId);pts.set(ev.pointerId,[ev.clientX,ev.clientY])});
   w.addEventListener('pointermove',ev=>{if(!pts.has(ev.pointerId))return;const p0=pts.get(ev.pointerId);
    if(pts.size==1){ox+=ev.clientX-p0[0];oy+=ev.clientY-p0[1];clamp();draw(cv)}
    pts.set(ev.pointerId,[ev.clientX,ev.clientY]);
    if(pts.size==2){const[a,b]=[...pts.values()],dd=Math.hypot(a[0]-b[0],a[1]-b[1]),r=w.getBoundingClientRect();if(pd)zoomTo(z*dd/pd,(a[0]+b[0])/2-r.left,(a[1]+b[1])/2-r.top);pd=dd}});
   const upH=ev=>{pts.delete(ev.pointerId);if(pts.size<2)pd=0};
   w.addEventListener('pointerup',upH);w.addEventListener('pointercancel',upH);
   w.addEventListener('wheel',ev=>{ev.preventDefault();const r=w.getBoundingClientRect();zoomTo(z*(ev.deltaY<0?1.08:1/1.08),ev.clientX-r.left,ev.clientY-r.top)},{passive:false});
  },
  collect:()=>true});
 if(!res)return null;
 const c=document.createElement('canvas');c.width=c.height=out;
 const x=c.getContext('2d'),r=out/V;x.imageSmoothingQuality='high';x.drawImage(img,ox*r,oy*r,img.width*base*z*r,img.height*base*z*r);
 return toBlob(c,imgType(),.88);
}
/* ---------- Дэвсгэр: утас ба компьютер дээр хэрхэн харагдахыг үзүүлж, байрлалыг чирж тохируулна ---------- */
async function bgDlg(url,isVid,pos){
 let[px,py]=(/^(\d{1,3})% (\d{1,3})%$/.exec(pos||'')||[0,50,50]).slice(1).map(Number);
 const media=c=>isVid?`<video class="bgm ${c}" src="${e(url)}" muted loop autoplay playsinline></video>`:`<div class="bgm ${c}" style="background-image:url('${e(url)}')"></div>`;
 const frame=(k,lbl,icn)=>`<div class="bgf ${k}"><div class="bgs">${media('m-'+k)}<i class="bgc"></i></div><small class="mu">${ic(icn,14)}${lbl}</small></div>`;
 const res=await dlg({icon:false,wide:true,title:'Дэвсгэр ингэж харагдана',ok:'Хадгалах',cancel:'Болих',
  html:`<p class="mu" style="margin-bottom:12px">Зургийг чирж аль хэсэг нь харагдахыг тохируулна уу. Утас, компьютер хоёр өөр хэлбэртэй тул захын хэсэг нь тайрагдана.</p><div class="bgw">${frame('pc','Компьютер','image')}${frame('ph','Утас','user')}</div><div class="act"><button type="button" class="g" id="bgr">Голлуулах</button></div>`,
  wire:d=>{
   const apply=()=>d.querySelectorAll('.bgm').forEach(m=>{const v=px+'% '+py+'%';if(isVid)m.style.objectPosition=v;else m.style.backgroundPosition=v});
   apply();
   d.querySelectorAll('.bgs').forEach(s=>{let st=null;
    s.addEventListener('pointerdown',ev=>{s.setPointerCapture(ev.pointerId);st=[ev.clientX,ev.clientY,px,py]});
    s.addEventListener('pointermove',ev=>{if(!st)return;const r=s.getBoundingClientRect();px=Math.round(Math.min(100,Math.max(0,st[2]-(ev.clientX-st[0])/r.width*100)));py=Math.round(Math.min(100,Math.max(0,st[3]-(ev.clientY-st[1])/r.height*100)));apply()});
    const end=()=>st=null;s.addEventListener('pointerup',end);s.addEventListener('pointercancel',end)});
   d.querySelector('#bgr').onclick=()=>{px=50;py=50;apply()};
  },
  collect:()=>px+'% '+py+'%'});
 return res||null;
}
/* select helper (хуучин) */
const sel=(id,opts,v)=>`<select id="${id}">${opts.map(o=>`<option value="${o[0]}"${o[0]==v?' selected':''}>${o[1]}</option>`).join('')}</select>`;
