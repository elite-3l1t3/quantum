/* Шинэчлэлт: шинэ боломж, засвар, аюулгүй байдал. Өгөгдлийн сан ашиглахгүй (квот 0).
   Шинэ хувилбар гаргах бүрд ЭХЭНД нь нэмнэ. [төрөл, mn, en, ru]; төрөл: new | fix | sec | legal */
const UPDATES=[
{d:'2026-11-20',v:'v16',t:['Илүү гоё хуудас, 3 хэл','Nicer pages, 3 languages','Красивее страницы, 3 языка'],i:[
 ['new','Градиент дэвсгэр, хайрцаггүй хэлбэр, текстийг зүүн тийш байрлуулах','Gradient backgrounds, card-less layout, left alignment','Градиентный фон, режим без карточки, выравнивание влево'],
 ['new','Холбоосыг зөвхөн дүрсээр эгнүүлэх, холбоос бүрт тайлбар','Icon-only link row and link descriptions','Ссылки-иконки в ряд и описания ссылок'],
 ['new','Дууны нэр тоглуулагчийн хажууд харагдана','Song title next to the music player','Название песни рядом с плеером'],
 ['new','"Шинэчлэлт" хуудас (энэ хуудас)','This "Updates" page','Страница «Обновления»'],
 ['fix','Англи, Орос хэл дээр 450 гаруй текст орчуулагдлаа','Over 450 texts translated to English and Russian','Переведено более 450 строк на английский и русский'],
 ['legal','Бүртгүүлэхдээ нөхцөл зөвшөөрөх, нөхцөл шинэчлэгдэхэд мэдэгдэх; Нөхцөл, Нууцлалын бодлого 3 хэлээр','Consent at signup, notice when terms change; Terms and Privacy in 3 languages','Согласие при регистрации, уведомление об изменении условий; Условия и Политика на 3 языках']]},
{d:'2026-11-19',v:'v15',t:['Статус, тоолуур, онцлох холбоос','Status, countdown, featured link','Статус, отсчёт, выделенная ссылка'],i:[
 ['new','Статус, тоолуур, онцлох холбоос, үзэлтийг нуух, хулганы мөр, like-д конфетти','Status, countdown, featured link, hide views, cursor trail, like confetti','Статус, отсчёт, выделенная ссылка, скрытие просмотров, след курсора, конфетти'],
 ['new','Сайтын мэдэгдэл, тэргүүлэгчдэд "Шинэ" таб, 10/100 дагагчийн тэмдэг','Site announcements, "New" leaderboard tab, 10/100 follower badges','Объявления, вкладка «Новые», значки 10/100 подписчиков'],
 ['sec','Баталгаажаагүй имэйлд профайл үүсгэхгүй; имэйл бүртгэлтэй эсэхийг илчлэхгүй','No profiles for unconfirmed emails; no email enumeration','Нет профилей для неподтверждённых email; email не раскрывается'],
 ['sec','IP хаягийг зөвхөн хэш хэлбэрээр хадгална','IP addresses are stored only as hashes','IP-адреса хранятся только в виде хэша'],
 ['fix','Төрсөн огноо хасагдсан','Birthday field removed','Поле дня рождения удалено']]},
{d:'2026-11-19',v:'v13',t:['Апп ба хурд','App and speed','Приложение и скорость'],i:[
 ['new','Апп болгон суулгах, илүү хурдан ачаалал','Install as an app, faster loading','Установка как приложение, быстрая загрузка'],
 ['new','Данс холбоос, QR код, дагах, холбоос дарсан тоо, хуваалцах','Bank links, QR codes, follow, link click stats, share','Счета, QR-коды, подписки, клики по ссылкам, «Поделиться»'],
 ['fix','Курсорын цагираг товч дээр үсэрдэг алдаа, tour явахад scroll түгжигддэг алдаа','Cursor ring jump on buttons; scroll lock during the guide','Прыжок кольца курсора; блокировка прокрутки во время гида']]},
{d:'2026-11-15',v:'v12',t:['Эффектүүд ба MP3','Effects and MP3','Эффекты и MP3'],i:[
 ['new','Хөдөлгөөнт дэвсгэр, нэрний эффект, профайл зургийн хүрээ','Animated backgrounds, name effects, avatar frames','Анимированный фон, эффекты имени, рамки аватара'],
 ['new','Видеоноос дууг MP3 болгох, хүн хайх, найз урих, 7 хоногийн имэйл тайлан','Video to MP3, people search, invites, weekly email report','Видео в MP3, поиск людей, приглашения, еженедельный отчёт'],
 ['sec','Скриптүүдийг сайтаасаа ачаалдаг болсон (CDN-ээс хамааралгүй)','Scripts are now served from biof itself (no CDN dependency)','Скрипты загружаются с самого biof (без CDN)']]},
{d:'2026-11-14',v:'v10',t:['Модератор, загвар, SEO','Moderators, templates, SEO','Модераторы, шаблоны, SEO'],i:[
 ['new','Модератор, баталгаажсан тэмдэг хүсэх, нийтийн загварууд, YouTube/Spotify/SoundCloud','Moderators, verification requests, community templates, YouTube/Spotify/SoundCloud','Модераторы, заявки на подтверждение, шаблоны, YouTube/Spotify/SoundCloud'],
 ['new','Google хайлтад хуудсууд гарч, лого харагдана','Pages and logo now appear in Google search','Страницы и логотип появляются в Google'],
 ['fix','Мэдэгдэх (report) ажиллахгүй байсан алдаа','Reporting did not work','Не работали жалобы']]},
{d:'2026-11-14',v:'v9',t:['Имэйл нэвтрэлт','Email login','Вход по email'],i:[
 ['new','Имэйлээр бүртгүүлэх, профайл зураг тайрах, автомат шахалт','Email signup, avatar cropping, automatic compression','Регистрация по email, обрезка аватара, автосжатие'],
 ['new','Давж заалдах, мэдэгдлийн сонголт, олноор тэмдэг олгох','Appeals, report categories, bulk badges','Апелляции, категории жалоб, массовые значки'],
 ['fix','Хадгалахад нүүр рүү үсэрдэг алдаа, гацдаг заавар','Jumping to home after saving; stuck guide','Переход на главную после сохранения; зависание гида']]}
];
const UTAG={new:['Шинэ','New','Новое','spark'],fix:['Засвар','Fix','Исправление','check'],sec:['Аюулгүй байдал','Security','Безопасность','shield'],legal:['Хууль, нууцлал','Legal','Право','lock']};
function updates(v){
 const L=typeof LANG!='undefined'?LANG:'mn',X=L=='en'?1:L=='ru'?2:0,xi=X+1;
 try{localStorage.updSeen=UPDATES[0].d+UPDATES[0].v}catch{}
 v.innerHTML=`<div class="dash upd"><h1 class="sec2" style="margin:12px 0 6px">${['Шинэчлэлт','Updates','Обновления'][X]}</h1><p class="mu" style="text-align:center;margin-bottom:18px">${['biof-д юу шинээр нэмэгдэж, юу засагдсаныг эндээс харна.','See what is new and what got fixed on biof.','Что нового и что исправлено в biof.'][X]}</p>${UPDATES.map(u=>`<div class="cd upc"><div class="uph"><b>${e(u.t[X])}</b><small class="mu">${e(u.v)} · ${e(u.d)}</small></div><ul class="upl">${u.i.map(r=>`<li><span class="ut ut-${r[0]}">${ic(UTAG[r[0]][3],13)}${UTAG[r[0]][X]}</span><span class="sel">${e(r[xi])}</span></li>`).join('')}</ul></div>`).join('')}</div>`;
}
/* Цэсэнд "шинэ" цэг: сүүлд үзсэнээс хойш шинэчлэлт гарсан бол */
const updNew=()=>{try{return localStorage.updSeen!=UPDATES[0].d+UPDATES[0].v}catch{return false}};
