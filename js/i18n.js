/* Хэл: үндсэн нь Монгол. English, Русский сонгож болно. Монгол текстийг толь бичгээр орчуулна. */
const LANG=localStorage.lang||'mn';
const I18N=[
['Тэргүүлэгчид','Leaderboard','Лидеры'],['Заавар','Guide','Гид'],['Жишээ хуудас','Example page','Пример'],['Статус','Status','Статус'],
['Миний самбар','My panel','Моя панель'],['Админ самбар','Admin panel','Админ-панель'],['Discord-оор нэвтрэх','Log in with Discord','Войти через Discord'],
['Таны эрхийг хаасан байна.','Your access has been blocked.','Ваш доступ заблокирован.'],
['Үйлчилгээний нөхцөл','Terms of Service','Условия использования'],['Нууцлалын бодлого','Privacy Policy','Политика конфиденциальности'],['Дэмжих','Support','Поддержать'],
['Нээлттэй','Open','Открыто'],['Удахгүй нээгдэнэ','Opening soon','Скоро открытие'],['Бүртгэл хаалттай','Registration closed','Регистрация закрыта'],
['Өөрийн хуудсаа','Create your','Создайте'],['үүсгээрэй','own page','свою страницу'],
['Instagram, YouTube, Discord зэрэг бүх холбоосоо нэг хаяг дээр цуглуулна. Жишээ нь','Collect all your links (Instagram, YouTube, Discord) at one address. For example','Соберите все ваши ссылки (Instagram, YouTube, Discord) по одному адресу. Например'],
['Одоогоор шинэ бүртгэл авахгүй байна. Бүртгэлтэй бол нэвтэрч болно.','New sign-ups are closed for now. If you already have an account, you can log in.','Новые регистрации пока закрыты. Если аккаунт уже есть, можно войти.'],
['Нэрээ авах','Get my name','Занять имя'],['Миний хуудас','My page','Моя страница'],['Хүлээлгийн төлөв','Waitlist status','Статус ожидания'],['эсвэл','or','или'],
['Бүртгэлтэй бол нэвтрэх','Log in if registered','Войти, если есть аккаунт'],['таны нэр','your name','ваше имя'],
['Зөвхөн англи жижиг үсэг, тоо, _ ашиглана (3-20 тэмдэгт).','Only lowercase English letters, numbers and _ (3-20 characters).','Только строчные латинские буквы, цифры и _ (3-20 символов).'],
['Энэ нэр сул байна','This name is available','Это имя свободно'],['хүн хүлээж байна','people waiting','человек ждут'],['хуудас идэвхтэй','active pages','активных страниц'],
['Заавар унших','Read the guide','Читать гид'],['Яаж ажилладаг вэ?','How does it work?','Как это работает?'],['Юу хийж болох вэ?','What can you do?','Что можно делать?'],
['Шилдэг хуудсууд','Top pages','Лучшие страницы'],['Түгээмэл асуултууд','FAQ','Частые вопросы'],['Одоо нэрээ аваарай','Get your name now','Займите имя прямо сейчас'],
['Таны нэрийг өөр хүн авчихаагүй байгаа үед шууд аваарай.','Grab it before someone else does.','Займите, пока его не взял кто-то другой.'],
['Discord-оор нэвтэр','Log in with Discord','Войдите через Discord'],['Нууц үг, имэйл хэрэггүй. Нэг товчоор орно.','No password or email needed. One tap and you are in.','Не нужны ни пароль, ни почта. Один клик.'],
['Нэрээ ав','Pick your name','Выберите имя'],['Жишээ нь biof.site/bold гэх мэт өөрийн хаягаа сонгоно.','Choose your own address, like biof.site/bold.','Выберите свой адрес, например biof.site/bold.'],
['Хуудсаа чимээрэй','Decorate your page','Оформите страницу'],['Холбоос, зураг, дуугаа нэмээрэй. Хажууд нь урьдчилан харах хэсэг байгаа.','Add links, pictures and music. A live preview sits next to it.','Добавьте ссылки, фото и музыку. Рядом есть предпросмотр.'],
['Нээгдэхийг хүлээ','Wait for the opening','Дождитесь открытия'],['Сайт нээгдмэгц хуудсаа чимж эхэлнэ. Таны нэр таных хэвээр үлдэнэ.','Once the site opens you can decorate your page. Your name stays yours.','Когда сайт откроется, вы сможете оформить страницу. Имя останется за вами.'],
['Бүх холбоос нэг дор','All links in one place','Все ссылки в одном месте'],['Instagram, YouTube, TikTok зэрэг холбоосоо нэг хуудсанд тавина.','Put Instagram, YouTube, TikTok and more on a single page.','Разместите Instagram, YouTube, TikTok и другие ссылки на одной странице.'],
['Өөрийн дүр төрх','Your own style','Ваш стиль'],['Өнгө, дэвсгэр зураг, видеогоо өөрөө сонгоно.','Pick your colors, background picture or video.','Выберите цвета, фоновое фото или видео.'],
['Дуу тавина','Add music','Добавьте музыку'],['Хуудсыг нээхэд таны сонгосон дуу эгшиглэнэ.','Your chosen song plays when the page opens.','При открытии страницы играет выбранная вами песня.'],
['Тэмдэг авна','Earn badges','Получайте значки'],['Идэвхтэй байх тусам тэмдэг (badge) авна.','The more active you are, the more badges you earn.','Чем вы активнее, тем больше значков получаете.'],
['Хэн үзснийг мэднэ','See your views','Следите за просмотрами'],['Хуудсыг хэдэн хүн үзэж, хэдэн хүн таалагдсаныг харна.','See how many people viewed and liked your page.','Смотрите, сколько людей посетили и оценили вашу страницу.'],
['Утсан дээр ч сайхан','Great on phones too','Отлично и на телефоне'],['Утас, компьютер аль алинд нь ойлгомжтой ажиллана.','Works clearly on phones and computers.','Одинаково удобно на телефоне и компьютере.'],
['biof гэж юу вэ?','What is biof?','Что такое biof?'],['biof нь Bio Flex гэсэн утгатай. Өөрийн гэсэн нэг хуудас үүсгэдэг сайт. Хуудсан дээрээ холбоос, зураг, дуугаа тавиад хүмүүст нэг хаягаар явуулна.','biof stands for Bio Flex. It is a site where you build your own page with links, pictures and music, and share it with one address.','biof означает Bio Flex. Это сайт, где вы создаёте свою страницу со ссылками, фото и музыкой и делитесь ею по одному адресу.'],
['Яаж нэвтрэх вэ?','How do I log in?','Как войти?'],['Discord-оороо нэвтэрнэ. Шинэ нууц үг санах шаардлагагүй.','Log in with Discord. No new password to remember.','Войдите через Discord. Новый пароль запоминать не нужно.'],
['Нэрээ солих боломжтой юу?','Can I change my name?','Можно ли сменить имя?'],['Боломжтой, гэхдээ 7 хоногт нэг л удаа.','Yes, but only once every 7 days.','Можно, но только раз в 7 дней.'],
['Яагаад миний Discord акаунтыг хүлээж авахгүй байна вэ?','Why is my Discord account not accepted?','Почему мой аккаунт Discord не принимается?'],['Спам, ботоос хамгаалахын тулд маш шинэхэн (7 хоногоос бага настай) Discord акаунтыг түр хүлээж авдаггүй.','To protect against spam and bots we do not accept very new Discord accounts (under 7 days old) for now.','Для защиты от спама и ботов мы пока не принимаем очень новые аккаунты Discord (младше 7 дней).'],
['Системийн төлөв','System status','Состояние системы'],['Бүх систем хэвийн ажиллаж байна','All systems are running normally','Все системы работают нормально'],['Шууд','Live','В прямом эфире'],
['Нийт бүртгэл','Total sign-ups','Всего регистраций'],['Хаасан сэжигтэй хүсэлт','Blocked suspicious requests','Заблокировано подозрительных запросов'],['Идэвхтэй хуудас','Active pages','Активные страницы'],['Хариу өгөх хугацаа (мс)','Response time (ms)','Время ответа (мс)'],
['Өнөөдөр шинэ бүртгэл','New today','Новых сегодня'],['Хаасан хэрэглэгч','Banned users','Заблокированные'],['Вэб сайт','Website','Сайт'],['Өгөгдлийн сан','Database','База данных'],['Нэвтрэлт','Login','Вход'],['Файл хадгалалт','File storage','Хранилище файлов'],
['Хэвийн','Normal','Норма'],['Удаан','Slow','Медленно'],['Саатсан','Down','Сбой'],['Түр хаалттай','Temporarily closed','Временно закрыто'],['Сүүлд шинэчлэгдсэн','Last updated','Обновлено'],
['Надад кофе авч өгөөрэй','Buy me a coffee','Угостите меня кофе'],['biof-ийг үнэгүй байлгахад туслаарай. Дэмжлэг нь сайн дурын, баярлалаа!','Help keep biof free. Support is voluntary, thank you!','Помогите сохранить biof бесплатным. Поддержка добровольная, спасибо!'],['Monpay данс','Monpay account','Счёт Monpay'],['Хуулах','Copy','Копировать'],['Хуулагдлаа','Copied','Скопировано'],
['Нүүр','Home','Главная'],['Чимэх','Customize','Оформить'],['Холбоосууд','Links','Ссылки'],['Миний мэдээлэл','My info','Мои данные'],['Тэмдгүүд','Badges','Значки'],
['Заавар эхлүүлэх','Start the guide','Начать гид'],['Хуудсаа үзэх','View my page','Посмотреть страницу'],['Юу хийх вэ?','What to do?','Что делать?'],['Хуудсаа чимэх','Decorate my page','Оформить страницу'],['Холбоос нэмэх','Add links','Добавить ссылки'],
['Зураг, өнгө, дуу сонгоно','Pick pictures, colors, music','Выберите фото, цвета, музыку'],['Instagram, YouTube гэх мэт','Instagram, YouTube and more','Instagram, YouTube и другое'],['Нэр, хаяг, Discord','Name, address, Discord','Имя, адрес, Discord'],['Авсан тэмдгүүдээ хар','See your badges','Смотрите свои значки'],
['Миний статистик','My stats','Моя статистика'],['Нийт үзэлт','Total views','Всего просмотров'],['Нийт like','Total likes','Всего лайков'],['Таны bid','Your bid','Ваш bid'],['Тэмдэг','Badges','Значки'],['Сүүлийн 14 өдрийн үзэлт','Views in the last 14 days','Просмотры за 14 дней'],
['Хадгалах','Save','Сохранить'],['Буцаах','Undo','Отменить'],['Хадгалаагүй өөрчлөлт байна!','You have unsaved changes!','Есть несохранённые изменения!'],['Хуудсаа бэлдэх','Get your page ready','Подготовьте страницу'],
['Доорх алхмуудыг дуусгавал хуудас чинь бэлэн болно.','Finish the steps below and your page is ready.','Выполните шаги ниже, и страница будет готова.'],['Гайхалтай! Хуудас чинь бүрэн бэлэн боллоо.','Great! Your page is fully ready.','Отлично! Ваша страница полностью готова.'],
['Профайл зураг сонгох','Choose a profile picture','Выберите аватар'],['Өөрийнхөө тухай бичих','Write about yourself','Напишите о себе'],['Эхний холбоосоо нэмэх','Add your first link','Добавьте первую ссылку'],['Өнгө, загвараа сонгох','Choose colors and a style','Выберите цвета и стиль'],['Хуудсаа хуваалцах','Share your page','Поделитесь страницей'],
['Хуудасныхаа холбоосыг хуулах','Copy my page link','Скопировать ссылку на страницу'],['Урьдчилан харах','Preview','Предпросмотр'],['Хаах','Close','Закрыть'],['Файл оруулах','Upload files','Загрузка файлов'],['Ерөнхий тохиргоо','General settings','Основные настройки'],['Өнгө','Colors','Цвета'],['Бусад','Other','Другое'],
['Бэлэн загвар','Ready-made themes','Готовые темы'],['Үндсэн мэдээлэл','Basic info','Основная информация'],['Системээс гарах','Log out','Выйти'],['Таны тэмдгүүд','Your badges','Ваши значки'],['Таны bid','Your bid','Ваш bid'],
['Заавар эхэллээ','Guide started','Гид начат'],['Алгасах','Skip','Пропустить'],['Буцах','Back','Назад'],['Дараах','Next','Далее'],['Дуусгах','Finish','Завершить'],
['Тавтай морил!','Welcome!','Добро пожаловать!'],['Би чамд хуудсаа хэрхэн хийхийг алхам алхмаар үзүүлье.','I will show you step by step how to build your page.','Я покажу шаг за шагом, как сделать страницу.'],
['Эндээс эхэл','Start here','Начните здесь'],['Эдгээр таб бүр өөр хэсэг рүү аваачна.','Each tab takes you to a different part.','Каждая вкладка ведёт в свой раздел.'],
['Профайл зураг, дэвсгэр, дуугаа энд оруулна. Файлаа сонгоход л болно.','Add your picture, background and music here. Just choose a file.','Добавьте здесь аватар, фон и музыку. Достаточно выбрать файл.'],['Өнгөө нэг товшоод сольж болно.','Change the colors with one tap.','Меняйте цвета одним касанием.'],
['Instagram, TikTok гэх мэт платформоо дарж хаягаа оруулна.','Tap a platform like Instagram or TikTok and enter your address.','Нажмите платформу (Instagram, TikTok) и введите адрес.'],['Хуудас чинь ингэж харагдана','This is how your page looks','Так выглядит ваша страница'],
['Энд хийсэн бүх зүйл шууд харагдана. Хамгийн сүүлд "Хадгалах" товчийг дарна.','Everything you change shows up here instantly. Finally press "Save".','Все изменения видны сразу. В конце нажмите «Сохранить».'],['Баяр хүргэе!','Congratulations!','Поздравляем!'],['Заавар дууслаа. Даалгавруудаа биелүүлээд XP цуглуул!','The guide is done. Finish the quests and collect XP!','Гид завершён. Выполняйте задания и копите XP!'],
['Линк хуулах','Copy link','Копировать ссылку'],['Орохын тулд дарна уу','Tap to enter','Нажмите, чтобы войти'],['Өөрийн хуудсаа үүсгэх','Create my own page','Создать свою страницу'],
['Гадны холбоос руу орох гэж байна','You are about to open an external link','Вы переходите по внешней ссылке'],['Үргэлжлүүлэх','Continue','Продолжить'],['Болих','Cancel','Отмена'],['Тийм','Yes','Да'],
['Энэ холбоосыг хуудасны эзэн оруулсан. Итгэлтэй байна уу?','The page owner added this link. Are you sure?','Эту ссылку добавил владелец страницы. Вы уверены?'],['HTTPS — шифрлэгдсэн, аюулгүй холболт','HTTPS — encrypted, safe connection','HTTPS — зашифрованное, безопасное соединение'],['HTTP — шифрлэгдээгүй, аюултай байж болно','HTTP — not encrypted, may be unsafe','HTTP — не зашифровано, может быть небезопасно'],
['Хуудсыг мэдэгдэх','Report this page','Пожаловаться на страницу'],['Яагаад мэдэгдэж байна вэ?','Why are you reporting it?','Почему вы жалуетесь?'],['Мэдэгдэх','Report','Пожаловаться'],
['Энэ хэрэглэгчийг хориглосон','This user has been banned','Этот пользователь заблокирован'],['Дүрэм зөрчсөн тул хуудас, зураг, дуу болон бүх мэдээллийг нь бүр мөсөн устгасан.','Because of rule violations, the page, pictures, music and all data were permanently deleted.','За нарушение правил страница, фото, музыка и все данные удалены навсегда.'],
['Нүүр хуудас','Home page','Главная страница'],['Хуудас олдсонгүй','Page not found','Страница не найдена'],['Энэ нэрийг авах','Get this name','Занять это имя'],['Хаяг буруу байна.','The address is invalid.','Неверный адрес.'],
['Хэт олон оролдлого хийлээ. Хэдэн секундийн дараа дахин оролдоно уу.','Too many attempts. Please try again in a few seconds.','Слишком много попыток. Повторите через несколько секунд.'],
['Энэ нэр аль хэдийн авагдсан байна','This name is already taken','Это имя уже занято'],['Нэр 3-20 тэмдэгт байх ба зөвхөн a-z, 0-9, _ ашиглана','Name must be 3-20 characters: a-z, 0-9, _ only','Имя: 3-20 символов, только a-z, 0-9, _'],['Нэрээ 7 хоногт нэг л удаа солино','You can change your name once every 7 days','Имя можно менять раз в 7 дней'],
['Бүртгэл одоогоор хаалттай байна','Registration is currently closed','Регистрация сейчас закрыта'],['Таны Discord акаунт хэт шинэ байна. Хэдэн хоногийн дараа дахин оролдоно уу.','Your Discord account is too new. Try again in a few days.','Ваш аккаунт Discord слишком новый. Попробуйте через несколько дней.'],['Өнөөдрийн бүртгэлийн хязгаар дүүрсэн. Маргааш дахин оролдоно уу.','Today\'s sign-up limit is full. Try again tomorrow.','Лимит регистраций на сегодня исчерпан. Попробуйте завтра.'],
['Тэргүүлэгчид','Leaderboard','Лидеры'],['Хамгийн олон үзэлттэй, хамгийн их таалагдсан хуудснууд.','The most viewed and most liked pages.','Самые просматриваемые и любимые страницы.'],['Үзэлт','Views','Просмотры'],
['Гүйцэтгэх','Do it','Выполнить'],['Даалгавар биелэв! +20 XP','Quest complete! +20 XP','Задание выполнено! +20 XP'],['Заавар дууслаа! +20 XP авлаа','Guide finished! You got +20 XP','Гид пройден! Вы получили +20 XP'],
['Админ','Admin','Админ'],['Тойм','Overview','Обзор'],['Хэрэглэгчид','Users','Пользователи'],['Мэдэгдлүүд','Reports','Жалобы'],['Аюулгүй байдал','Security','Безопасность'],['Сайтын удирдлага','Site controls','Управление сайтом'],
['Хориглосон','Banned','Заблокирован'],['Зөвшөөрөх','Approve','Одобрить'],['Нэр солих','Rename','Сменить имя'],['Нэр чөлөөлөх','Free the name','Освободить имя'],['Нээх','Unban','Разблокировать'],['Шийдсэн','Resolved','Решено'],['Үзэх','View','Открыть'],
['Хөтчийн таб дээрх нэр хөдөлнө','The browser tab title moves','Название вкладки движется'],['Цэс','Menu','Меню'],['Таны bid','Your bid','Ваш bid'],['Тэмдэг ба #bid','Badges and #bid','Значки и #bid'],
['Тэргүүлэгчид','Leaderboard','Лидеры'],['Бүгдийг харах','See all','Смотреть все'],['өнөөдөр шинэ','new today','новых сегодня'],
['JPG болгон татах','Download as JPG','Скачать как JPG'],['JPG татах','Download JPG','Скачать JPG'],['JPG зураг татагдлаа','JPG image downloaded','JPG-изображение скачано'],
['Бүртгэл устгах','Delete account','Удаление аккаунта'],['Бүртгэлээ устгах','Delete my account','Удалить мой аккаунт'],['Бүртгэлээ устгах уу?','Delete your account?','Удалить аккаунт?'],['Бүртгэл устгагдлаа','Account deleted','Аккаунт удалён'],
['Бүртгэлээ устгавал хуудас, зураг, дуу, холбоос, үзэлт, like бүгд бүр мөсөн устна. Буцаах боломжгүй.','If you delete your account, your page, pictures, music, links, views and likes are deleted forever. This cannot be undone.','При удалении аккаунта страница, фото, музыка, ссылки, просмотры и лайки удаляются навсегда. Отменить нельзя.'],
['Өөрийн URL оруулах','Use my own URL','Ввести свой URL'],['ID-аар оруулах','Use ID instead','Ввести по ID'],['Буруу ID','Invalid ID','Неверный ID'],
['Одоогоор холбоос алга.','No links yet.','Пока нет ссылок.'],['Хамгийн ихдээ 12 холбоос нэмнэ','You can add up to 12 links','Максимум 12 ссылок'],
['Тэмдэг олгох','Give badges','Выдать значки'],['Олгох','Give','Выдать'],['Авах','Remove','Забрать'],['bid-ийн мужид олгох','Give by bid range','Выдать по диапазону bid'],
['Нэг өнгийн дүрс','Single-color icons','Одноцветные значки'],['Нүүр','Home','Главная'],['Нэр эсвэл bid-ээр хайх','Search by name or bid','Поиск по имени или bid'],
['Нэрээ авах','Get my name','Занять имя'],['Хаалттай','Closed','Закрыто'],['Хориглох','Ban','Заблокировать'],['Хориглосон','Banned','Заблокирован'],
['Нэвтэрч эхлэх','Log in to start','Войти и начать'],['Хэрэглэгч олдсонгүй.','No users found.','Пользователи не найдены.'],
['Хэл','Language','Язык']
];
if(LANG!='mn'){
 const IX=LANG=='ru'?2:1,M=new Map();I18N.forEach(r=>M.set(r[0],r[IX]));
 const T=s=>{const k=s.trim();const v=M.get(k);return v?s.replace(k,v):s};
 const AT=['placeholder','aria-label','title','data-d'];
 const walk=n=>{
  if(n.nodeType==3){const t=T(n.nodeValue);if(t!==n.nodeValue)n.nodeValue=t;return}
  if(n.nodeType!=1||n.tagName=='SCRIPT'||n.tagName=='STYLE')return;
  AT.forEach(a=>{if(n.hasAttribute(a)){const o=n.getAttribute(a),v=T(o);if(v!==o)n.setAttribute(a,v)}});
  n.childNodes.forEach(walk);
 };
 let q=0;
 const mo=new MutationObserver(()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;mo.disconnect();walk(document.body);document.title=T(document.title);mo.observe(document.body,{childList:true,subtree:true})})});
 document.documentElement.lang=LANG;
 walk(document.body);mo.observe(document.body,{childList:true,subtree:true});
}
