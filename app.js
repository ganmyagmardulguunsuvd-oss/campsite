const UB={n:'Улаанбаатар',lat:47.918,lng:106.917};
// p: [нэр, тайлбар, зай, 'car'|'4x4', улирал]
const A=[
{id:'tov',n:'Төв',c:'Зуунмод',lat:47.707,lng:106.953,km:43,reg:'Төвийн бүс',bus:'Драгон',rail:false,air:false,
 road:'УБ-аас ойр, гол чиглэлүүд хатуу хучилттай. Тэрэлж, Хустай руу засмал болон сайн шороон зам.',
 p:[['Горхи-Тэрэлжийн БЦГ','Мэлхий хад, Арьяабал бясалгалын төв, Тэрэлж гол. Нэг өдрийн аялалд хамгийн тохиромжтой.','УБ-аас ~70 км','car','Жилийн турш'],
    ['Чингис хааны морьт хөшөө','Цонжин Болдогт байрлах 40 м өндөр хөшөө, музей.','УБ-аас ~54 км','car','Жилийн турш'],
    ['Хустайн байгалийн цогцолборт газар','Тахь (Пржевальскийн адуу)-г байгальд нь харах боломжтой.','УБ-аас ~100 км','car','5–10 сар'],
    ['Манзуширын хийдийн туурь','Богд хан уулын өвөрт, ойн дундах хийдийн туурь, музей.','Зуунмодоос ~6 км','car','5–10 сар']],
 camps:['Тэрэлжийн хөндий (олон амралтын газар, гэр бааз)','Хустайн жуулчны бааз','Гүнгалуут, Сэргэлэн орчмын кемпүүд']},
{id:'selenge',n:'Сэлэнгэ',c:'Сүхбаатар',lat:50.231,lng:106.208,km:311,reg:'Төвийн бүс',bus:'Драгон',rail:true,air:false,
 road:'УБ–Дархан–Сүхбаатар засмал. Амарбаясгалант руу сүүлийн хэсэг шороон.',
 p:[['Амарбаясгалант хийд','XVIII зууны Монголын хамгийн том, бүрэн бүтэн үлдсэн хийдийн нэг. Ивэн голын хөндийд.','Дарханаас ~110 км','car','5–9 сар'],
    ['Сэлэнгэ мөрөн','Монголын хамгийн их устай гол. Загасчлал, эргийн кемп.','Аймгийн нутагт','car','6–9 сар'],
    ['Алтанбулаг','Оросын хилийн боомт, түүхэн Хиагт хотын дэргэд.','Сүхбаатараас ~25 км','car','Жилийн турш']],
 camps:['Амарбаясгалант хийдийн орчмын гэр кемп','Сэлэнгэ, Орхон голын эргийн амралтын газрууд']},
{id:'darkhan',n:'Дархан-Уул',c:'Дархан',lat:49.465,lng:105.974,km:219,reg:'Төвийн бүс',bus:'Драгон',rail:true,air:false,
 road:'УБ–Дархан бүхэлдээ засмал, 3 цаг орчим.',
 p:[['Дархан хот','Монголын томоохон хотуудын нэг. Музей, цэцэрлэгт хүрээлэн. Хойд чиглэлийн аялалд буудаллах тохиромжтой цэг.','Аймгийн төв','car','Жилийн турш'],
    ['Шарын голын хөндий','Тал хээр, голын эрэг. Амралтын өдрийн богино аялалд.','Дарханаас ~60 км','car','6–9 сар']],
 camps:['Дархан хотын зочид буудлууд','Хараа, Шарын голын эргийн амралтын газрууд']},
{id:'orkhon',n:'Орхон',c:'Эрдэнэт',lat:49.028,lng:104.044,km:371,reg:'Хангайн бүс',bus:'Драгон',rail:true,air:false,
 road:'УБ–Дархан–Эрдэнэт засмал.',
 p:[['Эрдэнэтийн уурхайн харах цэг','Азийн томоохон зэс-молибдений уурхайн нэг.','Хотын захад','car','Жилийн турш'],
    ['Найрамдлын хөшөө, хотын музей','Эрдэнэт хотын түүх, уурхайн музей.','Хотод','car','Жилийн турш']],
 camps:['Эрдэнэт хотын зочид буудлууд','Булган руу явах замын амралтын газрууд']},
{id:'bulgan',n:'Булган',c:'Булган',lat:48.812,lng:103.534,km:318,reg:'Хангайн бүс',bus:'Драгон',rail:false,air:false,
 road:'Аймгийн төв хүртэл засмал. Хөгнө хан, Уран тогоо руу шороон зам.',
 p:[['Хөгнө Тарнын БЦГ (Хөгнө хан уул)','Ой, хад, Эрдэнэ хамбын хийд. Элсэн тасархайтай ойрхон тул хамт үзэхэд тохиромжтой.','УБ-аас ~280 км','car','5–10 сар'],
    ['Элсэн тасархай (Монгол элс)','УБ–Хархорумын замын дагуух 80 гаруй км урт элсэн манхан.','УБ-аас ~280 км','car','5–10 сар'],
    ['Уран тогоо–Тулга уул','Унтарсан галт уулын тогоо, ой, байгалийн цогцолбор.','Булган хотоос ~60 км','4x4','6–9 сар'],
    ['Хар бухын балгас','Хиданы үеийн хотын туурь, музей.','Аймгийн нутагт','4x4','6–9 сар']],
 camps:['Хөгнө хан, Элсэн тасархайн орчмын гэр кемп (олон)','Уран тогоо орчим']},
{id:'uvurkhangai',n:'Өвөрхангай',c:'Арвайхээр',lat:46.263,lng:102.775,km:430,reg:'Хангайн бүс',bus:'Драгон',rail:false,air:false,
 road:'Аймгийн төв, Хархорум хүртэл засмал. Орхоны хүрхрээ, Төвхөн руу шороон зам (4x4).',
 p:[['Хархорум ба Эрдэнэ Зуу хийд','Их Монгол улсын нийслэлийн туурь, 1586 оны Эрдэнэ Зуу хийд, Хархорум музей.','УБ-аас ~370 км','car','Жилийн турш'],
    ['Орхоны хүрхрээ (Улаан цутгалан)','~20 м өндөр хүрхрээ, Орхоны хөндий (ЮНЕСКО).','Хархорумаас ~120 км','4x4','6–9 сар'],
    ['Төвхөн хийд','Уулын оройн хийд, Занабазарын бүтээл туурвисан газар. Сүүлийн хэсгийг явганаар.','Хархорумаас ~60 км','4x4','6–9 сар'],
    ['Хужиртын рашаан','Рашаан сувилал, Орхоны хөндийн аялалд дамжих цэг.','Хархорумаас ~50 км','car','6–9 сар']],
 camps:['Хархорум хот орчмын гэр кемп, зочид буудлууд (олон)','Орхоны хүрхрээний орчмын кемп','Хужирт орчим']},
{id:'arkhangai',n:'Архангай',c:'Цэцэрлэг',lat:47.475,lng:101.454,km:453,reg:'Хангайн бүс',bus:'Драгон',rail:false,air:false,
 road:'УБ–Цэцэрлэг засмал. Цэцэрлэгээс Тариат (Тэрхийн Цагаан нуур) хүртэл засмал.',
 p:[['Тэрхийн Цагаан нуур, Хорго тогоо','Галт уулын тогоо, цэнгэг нуур, хар хад. Архангайн хамгийн алдартай газар.','Цэцэрлэгээс ~175 км','car','6–9 сар'],
    ['Тайхар чулуу','Тал дунд ганцаар сүндэрлэх том хад, домогтой.','Цэцэрлэгээс ~25 км','car','5–10 сар'],
    ['Цэнхэрийн халуун рашаан','Байгалийн халуун рашаан, усан бассейнтай кемпүүд.','Цэцэрлэгээс ~50 км','4x4','Жилийн турш'],
    ['Чулуутын хавцал','Гүн хавцал, хадны зураг.','Тайхар чулуунаас цааш','4x4','6–9 сар'],
    ['Өгий нуур','Шувуу ажиглах, загасчлах. УБ–Цэцэрлэгийн замаас ойрхон.','Цэцэрлэг рүү замд','car','6–9 сар'],
    ['Зая гэгээний хүрээ (музей)','Цэцэрлэг хот дахь хийд, музей.','Хотод','car','Жилийн турш']],
 camps:['Тэрхийн Цагаан нуурын эргийн кемпүүд (олон)','Цэнхэрийн рашааны кемпүүд','Өгий нуурын эрэг']},
{id:'khuvsgul',n:'Хөвсгөл',c:'Мөрөн',lat:49.638,lng:100.162,km:671,reg:'Хангайн бүс',bus:'Драгон',rail:false,air:true,
 road:'УБ–Мөрөн–Хатгал засмал. Нуурын баруун, зүүн эрэг дагуу шороон зам.',
 p:[['Хөвсгөл нуур','"Монголын хөх сувд". Хатгал тосгоноос эхлэн эрэг дагуу кемп. Өвөл мөсний баяр болдог.','Мөрөнөөс ~100 км','car','6–8 сар, 2–3 сар (мөс)'],
    ['Уушигийн өвөр (буган хөшөө)','3000 гаруй жилийн өмнөх буган хөшөөнүүд.','Мөрөнөөс ~20 км','car','5–10 сар'],
    ['Дархадын хотгор, Цаатан','Цаа буга маллагч цаатнууд. Хүрэх нь хэцүү, морь эсвэл 4x4.','Мөрөнөөс 300+ км','4x4','7–8 сар']],
 camps:['Хатгал тосгон ба нуурын баруун эрэг (Жанхай, Тойлогт орчим)','Нуурын зүүн эрэг (Ханх руу)']},
{id:'zavkhan',n:'Завхан',c:'Улиастай',lat:47.742,lng:96.844,km:984,reg:'Баруун бүс',bus:'Драгон',rail:false,air:true,
 road:'Аймгийн төв хүртэл засмал. Отгонтэнгэр, нууруудад шороон зам. УБ-аас 2 өдөр.',
 p:[['Отгонтэнгэр уул','Монголын тахилгат уул, мөнх цаст оргил, Хөх нуур.','Улиастайгаас ~100 км','4x4','7–8 сар'],
    ['Тэлмэн нуур','Давстай том нуур, шувуудын амьдрах орчин.','Аймгийн хойд хэсэгт','4x4','6–9 сар'],
    ['Улаагчны Хар нуур','Уулс, элсний дунд орших цэнгэг нуур.','Аймгийн баруун хойд хэсэгт','4x4','6–9 сар'],
    ['Жавхлант толгой','Улиастай хотын дээрх харах цэг, Чигэстэй гол.','Хотод','car','Жилийн турш']],
 camps:['Улиастай хотын зочид буудлууд','Отгонтэнгэрийн орчмын рашаан, кемп']},
{id:'govialtai',n:'Говь-Алтай',c:'Алтай',lat:46.372,lng:96.258,km:1001,reg:'Баруун бүс',bus:'Драгон',rail:false,air:true,
 road:'Аймгийн төв хүртэл засмал (Баянхонгороор дамжина). Уулс руу 4x4. УБ-аас 2 өдөр.',
 p:[['Эж Хайрхан уул','Говийн дундах хадат уул, ховор амьтан, тахилгат газар.','Алтайгаас ~150 км','4x4','5–9 сар'],
    ['Сутай хайрхан','Мөнх цаст оргил, Ховдын хилд.','Алтайгаас ~150 км','4x4','7–8 сар'],
    ['Хасагт хайрхан','Тахилгат уул, ой, булаг.','Алтайгаас ~100 км','4x4','6–9 сар'],
    ['Тайширын усан сан','Усан цахилгаан станцын усан сан, зуны амралт.','Алтайгаас ~70 км','car','6–8 сар']],
 camps:['Алтай хотын зочид буудлууд','Говь, уулын бүсэд майхан, айл буудал']},
{id:'uvs',n:'Увс',c:'Улаангом',lat:49.981,lng:92.067,km:1336,reg:'Баруун бүс',bus:'Драгон',rail:false,air:true,
 road:'Аймгийн төв хүртэл засмал (Завхан, Тосонцэнгэлээр). УБ-аас 2–3 өдөр. Нуурууд руу шороон.',
 p:[['Увс нуур','Монголын хамгийн том нуур (ЮНЕСКО-гийн Увс нуурын хотгор).','Улаангомоос ~30 км','car','6–9 сар'],
    ['Хяргас нуур','Давстай нуур, загас, шувуу. Хойд эрэгт рашаантай.','Улаангомоос ~110 км','car','6–9 сар'],
    ['Ачит нуур','Цэнгэг нуур, Баян-Өлгийн хилд, загасчлал.','Улаангомоос ~90 км','4x4','6–9 сар'],
    ['Хархираа-Түргэний нуруу','Мөнх цаст уулс, хадны зураг, хүрхрээ.','Улаангомоос ~40 км','4x4','7–8 сар'],
    ['Алтан элс','Дэлхийн хамгийн хойд элсэн цөлийн нэг.','Аймгийн зүүн хойд хэсэгт','4x4','6–9 сар']],
 camps:['Хяргас нуурын кемп','Улаангом хотын зочид буудлууд','Хархираагийн аманд майхан']},
{id:'khovd',n:'Ховд',c:'Ховд',lat:48.006,lng:91.641,km:1425,reg:'Баруун бүс',bus:'Драгон',rail:false,air:true,
 road:'Аймгийн төв хүртэл засмал. УБ-аас 2–3 өдөр. Нуур, уул руу шороон зам.',
 p:[['Хар-Ус нуур','Шувуудын диваажин, Хар-Ус нуурын БЦГ.','Ховдоос ~40 км','car','6–9 сар'],
    ['Хар нуур','Элс, уулс хүрээлсэн цэнгэг нуур.','Ховдоос ~130 км','4x4','6–9 сар'],
    ['Цэнхэрийн агуй','Чулуун зэвсгийн үеийн хадны зурагтай агуй.','Манхан сум, Ховдоос ~100 км','4x4','6–9 сар'],
    ['Цамбагарав уул','Мөнх цаст оргил, Баян-Өлгийн хилд.','Ховдоос ~120 км','4x4','7–8 сар'],
    ['Сангийн хэрэм','Манжийн үеийн хэрмийн туурь, Ховд хотод.','Хотод','car','Жилийн турш']],
 camps:['Ховд хотын зочид буудлууд','Хар-Ус нуурын эрэг','Хар нуурын эрэгт майхан']},
{id:'bayanulgii',n:'Баян-Өлгий',c:'Өлгий',lat:48.968,lng:89.962,km:1636,reg:'Баруун бүс',bus:'Драгон',rail:false,air:true,
 road:'Аймгийн төв хүртэл засмал (Ховдоор). УБ-аас 3 өдөр орчим, онгоцоор явбал амар. Таван Богд руу 4x4.',
 p:[['Алтай Таван Богдын БЦГ','Монголын хамгийн өндөр оргил Хүйтэн (4374 м), Потанины мөсөн гол. Хилийн бүс тул зөвшөөрөл лавла.','Өлгийгөөс ~180 км','4x4','7–8 сар'],
    ['Хотон, Хурган нуур','Алтайн нурууны үзэсгэлэнт цэнгэг нуурууд.','Өлгийгөөс ~150 км','4x4','6–9 сар'],
    ['Толбо нуур','Өлгий–Ховдын замын ойролцоох цэнгэг нуур.','Өлгийгөөс ~50 км','car','6–9 сар'],
    ['Бүргэдийн баяр','Казах бүргэдчдийн уламжлалт наадам.','Өлгий орчим','car','9–10 сар']],
 camps:['Өлгий хотын зочид буудлууд','Казах айлд буудаллах','Толбо, Хотон нуурын эргийн майхан кемп']},
{id:'bayankhongor',n:'Баянхонгор',c:'Баянхонгор',lat:46.194,lng:100.718,km:630,reg:'Хангайн бүс',bus:'Драгон',rail:false,air:true,
 road:'УБ–Арвайхээр–Баянхонгор засмал. Говийн хэсэг, нуурууд руу шороон.',
 p:[['Орог нуур','Ихбогд уулын бэлд орших нуур, говь ба уулын хослол.','Баянхонгороос ~120 км','4x4','6–9 сар'],
    ['Бөөн Цагаан нуур','Шувуудын амьдрах орчин, говийн том нуур.','Баянхонгороос ~150 км','4x4','6–9 сар'],
    ['Шаргалжуутын рашаан','Халуун, хүйтэн рашаан, сувилал.','Баянхонгороос ~55 км','car','Жилийн турш'],
    ['Цагаан агуй','Хүн амьдарч байсан эртний агуй.','Аймгийн өмнөд хэсэгт','4x4','5–9 сар']],
 camps:['Шаргалжуутын сувилал','Баянхонгор хотын зочид буудлууд','Нуурын эрэгт майхан']},
{id:'umnugovi',n:'Өмнөговь',c:'Даланзадгад',lat:43.571,lng:104.425,km:553,reg:'Говийн бүс',bus:'Драгон',rail:false,air:true,
 road:'УБ–Мандалговь–Даланзадгад засмал. Хонгорын элс, Баянзаг руу шороон (сайн суудлын машин ч хүрдэг ч 4x4 зөвлөнө).',
 p:[['Ёлын ам','Зуны дунд ч мөстэй байдаг хавцал, Говийн гурван сайханы БЦГ.','Даланзадгадаас ~45 км','car','5–9 сар'],
    ['Хонгорын элс','~100 км урт, 300 м хүртэл өндөр "дуут манхан". Тэмээ унах.','Даланзадгадаас ~180 км','4x4','5–10 сар'],
    ['Баянзаг (Улаан эрэг)','Үлэг гүрвэлийн өндөг олдсон алдарт улаан хадан эрэг. Нар жаргах үед гоё.','Даланзадгадаас ~100 км','4x4','5–10 сар'],
    ['Хэрмэн цав','Говийн гүн дэх улаан хавцал. Алс, хүнгүй газар — хамт явах машинтай яв.','Даланзадгадаас ~300 км','4x4','5–9 сар']],
 camps:['Ёлын амны орчмын гэр кемп (олон)','Хонгорын элсний кемпүүд','Баянзагийн орчмын кемпүүд']},
{id:'dundgovi',n:'Дундговь',c:'Мандалговь',lat:45.763,lng:106.270,km:260,reg:'Говийн бүс',bus:'Драгон',rail:false,air:false,
 road:'УБ–Мандалговь засмал. Хадат газрууд руу шороон.',
 p:[['Цагаан суварга','Өнгө алаг шохойн хаданцар эрэг, "говийн цайз".','Мандалговиос ~120 км','4x4','5–10 сар'],
    ['Бага Газрын чулуу','Хадат уул, булаг, хийдийн туурь. УБ-аас амралтын өдөр явахад тохиромжтой.','Мандалговиос ~100 км','car','5–10 сар'],
    ['Их Газрын чулуу','Боржин чулуун хадат уулс, тахилгат газар.','Мандалговиос ~70 км','4x4','5–10 сар'],
    ['Улаан суварга','Улаан өнгийн элэгдлийн хадат эрэг.','Цагаан суваргатай ойрхон','4x4','5–10 сар']],
 camps:['Бага Газрын чулууны кемп','Цагаан суварга орчмын кемп','Их Газрын чулууны орчмын кемп']},
{id:'dornogovi',n:'Дорноговь',c:'Сайншанд',lat:44.892,lng:110.140,km:463,reg:'Говийн бүс',bus:'Баянзүрх',rail:true,air:false,
 road:'УБ–Чойр–Сайншанд–Замын-Үүд засмал. Галт тэргээр явахад тохиромжтой.',
 p:[['Хамарын хийд, Шамбалын орон','Догшин ноён хутагт Данзанравжаагийн байгуулсан хийд, энергийн төв гэж алдартай.','Сайншандаас ~40 км','car','Жилийн турш'],
    ['Данзанравжаагийн музей','Сайншанд хотод.','Хотод','car','Жилийн турш'],
    ['Замын-Үүд','Хятадын хилийн боомт хот.','Сайншандаас ~220 км','car','Жилийн турш']],
 camps:['Хамарын хийдийн орчмын гэр кемп','Сайншанд хотын зочид буудлууд']},
{id:'govisumber',n:'Говьсүмбэр',c:'Чойр',lat:46.361,lng:108.361,km:230,reg:'Төвийн бүс',bus:'Баянзүрх',rail:true,air:false,
 road:'УБ–Чойр засмал. Галт тэргээр ч хүрнэ.',
 p:[['Чойрын Богд уул','Хадат уул, хийдийн туурь, ховор ургамал.','Чойроос ~20 км','car','5–10 сар'],
    ['Шивээговийн тал','Говь, тал хээрийн уулзвар нутаг.','Аймгийн нутагт','car','5–10 сар']],
 camps:['Чойр хотын зочид буудлууд','Богд уулын орчимд майхан']},
{id:'khentii',n:'Хэнтий',c:'Чингис хот',lat:47.316,lng:110.656,km:331,reg:'Зүүн бүс',bus:'Баянзүрх',rail:false,air:false,
 road:'УБ–Чингис хот засмал. Бурхан Халдун, Дадал руу шороон замтай хэсэг бий.',
 p:[['Хөх нуур (Хар зүрхний)','Тэмүжин хаан ширээнд суусан гэж үздэг түүхэн газар.','Чингис хотоос ~200 км','4x4','6–9 сар'],
    ['Бурхан Халдун уул','Хан Хэнтийн ДЦГ, Монголын тахилгат уул (ЮНЕСКО).','Аймгийн баруун хойд хэсэгт','4x4','6–8 сар'],
    ['Дэлүүн Болдог (Дадал)','Чингис хааны төрсөн газар гэж үздэг, Онон голын сав.','Чингис хотоос ~250 км','4x4','6–9 сар'],
    ['Чингис хотын музей','Аймгийн төв дэх түүхийн музей.','Хотод','car','Жилийн турш']],
 camps:['Дадал сумын гэр кемпүүд','Хэрлэн, Онон голын эрэг','Чингис хотын зочид буудлууд']},
{id:'sukhbaatar',n:'Сүхбаатар',c:'Баруун-Урт',lat:46.681,lng:113.280,km:560,reg:'Зүүн бүс',bus:'Баянзүрх',rail:false,air:false,
 road:'УБ–Баруун-Урт засмал. Дарьганга, Шилийн Богд руу шороон.',
 p:[['Шилийн Богд уул','Унтарсан галт уул, нар мандах нь гоё. Хилийн бүсэд ойр.','Баруун-Уртаас ~250 км','4x4','6–9 сар'],
    ['Дарьганга, Алтан Овоо','Тахилгат Алтан Овоо, хүн чулуу, Дарьгангын элс.','Баруун-Уртаас ~180 км','4x4','6–9 сар'],
    ['Ганга нуур','Хун шувууд ирдэг нуур, элсэн манхны дэргэд.','Дарьгангаас ~15 км','4x4','6–9 сар']],
 camps:['Дарьганга, Ганга нуурын орчмын кемп','Баруун-Урт хотын зочид буудлууд']},
{id:'dornod',n:'Дорнод',c:'Чойбалсан',lat:48.071,lng:114.535,km:655,reg:'Зүүн бүс',bus:'Баянзүрх',rail:false,air:true,
 road:'УБ–Чингис хот–Чойбалсан засмал. Буйр нуур, Халх гол руу урт шороон зам (4x4).',
 p:[['Буйр нуур','Монголын зүүн хязгаарын том нуур, загасчлал. Хилийн бүс.','Чойбалсангаас ~280 км','4x4','6–9 сар'],
    ['Халх голын дурсгал','1939 оны Халх голын тулалдааны дурсгалт газрууд, Сүмбэр сум.','Чойбалсангаас ~350 км','4x4','6–9 сар'],
    ['Мэнэнгийн тал','Цагаан зээрийн сүрэг нүүдэллэдэг өргөн тал.','Аймгийн өмнөд хэсэгт','4x4','5–9 сар'],
    ['Хэрлэн Барс хот','Хиданы үеийн хотын туурь.','Чойбалсангаас ~90 км','4x4','5–9 сар']],
 camps:['Буйр нуурын эргийн кемп','Чойбалсан хотын зочид буудлууд']}
];
const REGIONS=['Төвийн бүс','Хангайн бүс','Говийн бүс','Баруун бүс','Зүүн бүс'];
// Говийн бүс нь албан ёсоор Төвийн бүсэд багтдаг ч аялалд ойлгомжтой байлгах үүднээс тусад нь харуулав.

let sel=[];
try{sel=JSON.parse(localStorage.getItem('mn_trip_sel')||'[]').filter(id=>A.some(a=>a.id===id))}catch(e){}
const tabState={};
const $=s=>document.querySelector(s);
const byId=id=>A.find(a=>a.id===id);
const gm=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const fmt=n=>Math.round(n).toLocaleString('en-US').replace(/,/g,' ');

function hav(a,b){const R=6371,t=Math.PI/180;const dLa=(b.lat-a.lat)*t,dLo=(b.lng-a.lng)*t;
 const x=Math.sin(dLa/2)**2+Math.cos(a.lat*t)*Math.cos(b.lat*t)*Math.sin(dLo/2)**2;return 2*R*Math.asin(Math.sqrt(x))}
function road(a,b){ if(a===UB) return b.km; if(b===UB) return a.km; return Math.round(hav(a,b)*1.3/10)*10 }

function renderChips(){
 $('#regions').innerHTML=REGIONS.map(r=>`<div class="region"><h3>${r}</h3><div class="chips">${
  A.filter(a=>a.reg===r).sort((x,y)=>x.km-y.km).map(a=>`<button class="chip ${sel.includes(a.id)?'on':''}" onclick="toggle('${a.id}')">${a.n} <small>${a.km} км</small></button>`).join('')
 }</div></div>`).join('');
}
function toggle(id){ sel=sel.includes(id)?sel.filter(x=>x!==id):[...sel,id]; save(); render() }
function clearSel(){ sel=[]; save(); render() }
function save(){ try{localStorage.setItem('mn_trip_sel',JSON.stringify(sel))}catch(e){} }

function order(){
 // ойрын хөршийн аргаар дараалал гаргана, дараа нь 2-opt-оор сайжруулна
 let rest=sel.map(byId), cur=UB, out=[];
 while(rest.length){ rest.sort((x,y)=>road(cur,x)-road(cur,y)); cur=rest.shift(); out.push(cur) }
 const ret=$('#ret').checked;
 const total=r=>{let s=0,p=UB;r.forEach(x=>{s+=road(p,x);p=x}); if(ret) s+=road(p,UB); return s};
 let improved=true;
 while(improved&&out.length>2){improved=false;
  for(let i=0;i<out.length-1;i++)for(let j=i+1;j<out.length;j++){
   const t=[...out.slice(0,i),...out.slice(i,j+1).reverse(),...out.slice(j+1)];
   if(total(t)<total(out)-1){out=t;improved=true}
  }}
 return out;
}

const W=900,H=450,K=40,COS=Math.cos(47*Math.PI/180);
const px=p=>[(p.lng-87.3)*COS*K*1.0+12,(52.3-p.lat)*K];
const BORDER=[[87.75,49.17],[88.8,49.5],[90.7,50.3],[92.2,50.8],[94.25,50.48],[95.8,49.98],[97.26,49.73],[98.23,50.42],[97.83,51.0],[98.86,52.05],[100.0,51.73],[101.0,51.4],[102.07,51.26],[102.25,50.51],[103.68,50.09],[104.62,50.28],[105.89,50.41],[106.89,50.27],[107.87,49.79],[108.47,49.28],[109.4,49.29],[110.66,49.13],[111.58,49.38],[112.9,49.54],[114.36,50.25],[114.96,50.14],[115.49,49.81],[116.68,49.89],[116.19,49.13],[115.49,48.14],[115.74,47.73],[116.31,47.85],[117.3,47.7],[118.06,48.07],[118.87,47.75],[119.77,47.05],[119.66,46.69],[118.87,46.81],[117.42,46.67],[116.72,46.39],[115.99,45.73],[114.46,45.34],[113.46,44.81],[112.44,45.01],[111.87,45.1],[111.35,44.46],[111.67,44.07],[111.83,43.74],[111.13,43.41],[110.41,42.87],[109.24,42.52],[107.74,42.48],[106.13,42.13],[104.96,41.6],[104.52,41.91],[103.31,41.91],[101.83,42.52],[100.85,42.66],[99.52,42.52],[97.45,42.75],[96.35,42.73],[95.76,43.32],[95.31,44.24],[94.69,44.35],[93.48,44.98],[92.13,45.12],[90.95,45.29],[90.59,45.72],[90.97,46.89],[90.28,47.69],[88.85,48.07],[88.01,48.6]];

function renderMap(route){
 const ret=$('#ret').checked;
 const border=BORDER.map(([lng,lat])=>px({lng,lat}).map(v=>v.toFixed(1)).join(',')).join(' ');
 let pts=[UB,...route]; if(ret&&route.length) pts.push(UB);
 const line=route.length?`<polyline points="${pts.map(p=>px(p).join(',')).join(' ')}" fill="none" stroke="#d9731f" stroke-width="3.5" stroke-linejoin="round" stroke-dasharray="${ret?'':'0'}" opacity=".9"/>`:'';
 const dots=A.map(a=>{const [x,y]=px(a);const i=route.indexOf(a);const on=i>=0;
  return `<g style="cursor:pointer" onclick="toggle('${a.id}')"><title>${a.n} — ${a.c}</title>
   <circle cx="${x}" cy="${y}" r="${on?13:6}" fill="${on?'#d9731f':'#1d4e89'}" stroke="#fff" stroke-width="2"/>
   ${on?`<text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="12" font-weight="600" fill="#fff">${i+1}</text>`:''}
   <text x="${x}" y="${y+(on?27:18)}" text-anchor="middle" font-size="${on?15:13}" font-weight="${on?600:400}" fill="${on?'#9a4a0b':'#374151'}" paint-order="stroke" stroke="#fffdf8" stroke-width="3">${a.n}</text></g>`}).join('');
 const [ux,uy]=px(UB);
 $('#svgbox').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Монголын газрын зураг">
  <polygon points="${border}" fill="#efe4cc" stroke="#c9b48a" stroke-width="2"/>
  ${line}${dots}
  <g><rect x="${ux-9}" y="${uy-9}" width="18" height="18" rx="4" fill="#c0392b" stroke="#fff" stroke-width="2"/>
  <text x="${ux}" y="${uy-14}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#c0392b" paint-order="stroke" stroke="#fffdf8" stroke-width="3">Улаанбаатар</text></g>
 </svg><p class="note">Цэг дээр дарж аймаг нэмж/хасч болно. Зураг схемчилсэн.</p>`;
}

function renderSummary(route){
 if(!route.length){$('#summary').innerHTML='<div class="empty">Дээрээс аймгаа сонгоход маршрут, зай, шатахууны зардал энд гарна.</div>';return}
 const ret=$('#ret').checked, L=+$('#car').value, price=+$('#price').value||0, perday=+$('#perday').value||400;
 let legs=[],p=UB,sum=0;
 route.forEach(a=>{const d=road(p,a);legs.push([p,a,d]);sum+=d;p=a});
 if(ret){const d=road(p,UB);legs.push([p,UB,d]);sum+=d}
 const liters=sum*L/100, cost=liters*price, hours=sum/60;
 const days=buildPlan(route).length;
 const need4=route.filter(a=>a.p.some(x=>x[3]==='4x4'));
 $('#summary').innerHTML=`
  <div class="stats">
   <div class="stat"><b>${fmt(sum)} км</b><span>Нийт зай (ойролцоо)</span></div>
   <div class="stat"><b>~${Math.round(hours)} цаг</b><span>Жолоодох хугацаа (~60 км/ц)</span></div>
   <div class="stat warm"><b>${fmt(cost)} ₮</b><span>Шатахуун: ~${fmt(liters)} литр</span></div>
   <div class="stat warm"><b>${days} өдөр</b><span>Хөтөлбөрийн урт (доор дэлгэрэнгүй)</span></div>
  </div>
  <ul class="legs">${legs.map(([a,b,d],i)=>`<li><span class="dot">${i+1}</span>${a.c||a.n} → ${b.c||b.n}<span class="km">${a===UB||b===UB?'':'~'}${fmt(d)} км · ~${(d/60).toFixed(1)} ц</span></li>`).join('')}</ul>
  ${need4.length?`<div class="warn">🚙 <b>${need4.map(a=>a.n).join(', ')}</b>-ийн зарим газар руу шороон, хүнд зам байна. Тэдгээрийг үзэх бол 4x4 машин, нөөц дугуй, шатахуунтай яваарай.</div>`:''}
  ${route.some(a=>a.km>900)?`<div class="warn">🛣️ Баруун аймгууд руу УБ-аас 2–3 өдөр явдаг. Хугацаа бага бол нэг тийш нь онгоцоор нисэх боломжийг харгалзаарай.</div>`:''}
  <p class="note">Аймаг хоорондын зай нь ойролцоо тооцоо. Шатахууны үнэ, машины зарцуулалтыг дээрээс өөрчилж болно.</p>`;
}

const TABS=[['places','🏞️ Үзэсгэлэнт газар'],['camps','🏕️ Амралт, кемп'],['shop','🛒 Дэлгүүр'],['gas','⛽ Шатахуун'],['help','🏥 Эмнэлэг, цагдаа'],['car','🚗 Машин, тээвэр']];

function tabBody(a,t){
 const where=`${a.c}, ${a.n}`;
 if(t==='places') return `<div class="places">${a.p.map(([n,d,dist,car,season])=>`
   <div class="place"><h4>${n}</h4><p>${d}</p>
   <div class="tags"><span class="tag">📍 ${dist}</span><span class="tag ${car==='car'?'car':'x4'}">${car==='car'?'Суудлын машин хүрнэ':'4x4 хэрэгтэй'}</span><span class="tag">🗓️ ${season}</span></div>
   <div style="margin-top:8px"><a href="${gm(n+' '+a.n+' Mongolia')}" target="_blank" rel="noopener">Газрын зурагт харах →</a></div></div>`).join('')}</div>`;
 if(t==='camps') return `<ul class="info-list">${a.camps.map(c=>`<li>${c}</li>`).join('')}</ul>
   <div class="links">${a.p.slice(0,3).map(x=>`<a href="${gm('жуулчны бааз '+x[0])}" target="_blank" rel="noopener">${x[0]} орчмын кемп</a>`).join('')}
   <a href="${gm('ger camp near '+a.c+' Mongolia')}" target="_blank" rel="noopener">${a.c} орчмын кемп</a>
   <a href="${gm('зочид буудал '+where)}" target="_blank" rel="noopener">${a.c} — зочид буудал</a></div>
   <p class="note">Зуны оргил үед (7-р сар, Наадмын үе) кемпүүд дүүрдэг тул урьдчилж захиалаарай.</p>`;
 if(t==='shop') return `<ul class="info-list">
   <li>${a.c} хотод аймгийн төвийн <b>зах</b>, <b>их дэлгүүр</b>, сүлжээ супермаркет, эмийн сан байдаг.</li>
   <li>Хүнс, ус, нөөц зүйлсээ аймгийн төвөөс бүрэн аваарай. Сумын төвд жижиг дэлгүүр л байна.</li>
   <li>Алслагдсан газар бэлэн мөнгө авч яв. Сумын дэлгүүрт карт, QR төлбөр уншихгүй байх тохиолдол бий.</li></ul>
   <div class="links"><a href="${gm('худалдааны төв '+where)}" target="_blank" rel="noopener">Худалдааны төв</a>
   <a href="${gm('supermarket '+a.c+' Mongolia')}" target="_blank" rel="noopener">Супермаркет</a>
   <a href="${gm('зах '+where)}" target="_blank" rel="noopener">Зах</a>
   <a href="${gm('эмийн сан '+where)}" target="_blank" rel="noopener">Эмийн сан</a>
   <a href="${gm('ATM '+a.c+' Mongolia')}" target="_blank" rel="noopener">АТМ, банк</a></div>`;
 if(t==='gas') return `<ul class="info-list">
   <li>Гол замын дагуу болон ${a.c} хотод <b>Петровис, Шунхлай, Магнай трейд, Сод Монгол</b> зэрэг сүлжээ станцууд ажилладаг.</li>
   <li>${a.km>900?'<b>Баруун бүсэд станц хоорондын зай хол.</b> Аймаг, сумын төв бүрт сав дүүргэж, 20 л нөөцтэй яв.':a.reg==='Говийн бүс'?'<b>Говьд станц цөөн.</b> Даланзадгад, Мандалговь зэрэг төвөөс гарахдаа заавал дүүргэ.':'Шороон замаар үзэх газар руу явахын өмнө сав дүүргэ.'}</li>
   <li>Сумын төвийн станцад дизель, өндөр октантай бензин дуусах тохиолдол гардаг.</li></ul>
   <div class="links"><a href="${gm('шатахуун түгээх станц '+where)}" target="_blank" rel="noopener">${a.c} — шатахуун станц</a>
   <a href="${gm('gas station '+a.c+' Mongolia')}" target="_blank" rel="noopener">Gas station (англиар)</a>
   <a href="${gm('засварын газар '+where)}" target="_blank" rel="noopener">Авто засвар</a>
   <a href="${gm('дугуй засвар '+where)}" target="_blank" rel="noopener">Дугуй засвар</a></div>`;
 if(t==='help') return `<div class="sos-grid" style="margin-bottom:10px">
   <div class="sos-num"><b>101</b><span>Гал</span></div><div class="sos-num"><b>102</b><span>Цагдаа</span></div>
   <div class="sos-num"><b>103</b><span>Түргэн</span></div><div class="sos-num"><b>105</b><span>Онцгой байдал</span></div></div>
   <ul class="info-list">
   <li><b>Эмнэлэг:</b> ${a.c} хотод аймгийн Нэгдсэн эмнэлэг (эсвэл бүсийн оношилгоо эмчилгээний төв). Сум бүрт <b>сумын эрүүл мэндийн төв</b> бий.</li>
   <li><b>Цагдаа:</b> ${a.n} аймгийн Цагдаагийн газар. Сум бүрт хэсгийн байцаагч ажилладаг.</li>
   <li><b>Онцгой байдал:</b> ${a.n} аймгийн Онцгой байдлын газар. Үер, гал, төөрөлтийн үед 105.</li></ul>
   <div class="links"><a href="${gm('нэгдсэн эмнэлэг '+where)}" target="_blank" rel="noopener">🏥 Эмнэлэг</a>
   <a href="${gm('цагдаагийн газар '+where)}" target="_blank" rel="noopener">👮 Цагдаа</a>
   <a href="${gm('онцгой байдлын газар '+where)}" target="_blank" rel="noopener">🚒 Онцгой байдал</a>
   <a href="${gm('эмийн сан '+where)}" target="_blank" rel="noopener">💊 Эмийн сан</a>
   <a href="#sos" onclick="goSOS();return false">Нөхцөл байдал бүрийн заавар →</a></div>`;
 if(t==='car') return `<ul class="info-list">
   <li><b>УБ-аас зай:</b> ${a.km} км, ~${Math.round(a.km/60)} цаг жолоодлого.</li>
   <li><b>Зам:</b> ${a.road}</li>
   <li><b>Машин:</b> ${a.p.some(x=>x[3]==='4x4')?'Аймгийн төв хүртэл суудлын машин хангалттай. Зарим үзэх газар руу 4x4 зөвлөнө.':'Суудлын машинаар явахад хангалттай.'}</li>
   <li><b>Автобус:</b> ${a.bus} ${a.bus==='Драгон'?'автобусны төвөөс':'авто вокзалаас'} хөдөлдөг (<a href="https://eticket.transdep.mn" target="_blank" rel="noopener">eticket.transdep.mn</a>).</li>
   ${a.rail?'<li><b>Галт тэрэг:</b> явдаг (<a href="https://www.ubtz.mn" target="_blank" rel="noopener">ubtz.mn</a>).</li>':''}
   ${a.air?'<li><b>Онгоц:</b> дотоод нислэг байдаг. Хуваарь улирлаас хамаарна.</li>':''}
   <li><b>Аймгийн төвд:</b> такси, жолоочтой машин түрээслэх боломжтой. Алс газар руу орон нутгийн жолоочтой явах нь аюулгүй.</li></ul>
   <div class="links"><a href="${gm('Ulaanbaatar to '+a.c+' Mongolia')}" target="_blank" rel="noopener">Замын чиглэл харах</a>
   <a href="${gm('машин түрээс '+where)}" target="_blank" rel="noopener">Машин түрээс</a></div>`;
}

function renderDetails(route){
 if(!route.length){$('#details').innerHTML='';return}
 $('#details').innerHTML=route.map((a,i)=>{const t=tabState[a.id]||'places';
  return `<div class="card aimag" id="a-${a.id}">
   <div class="aimag-head"><span class="dot" style="width:30px;height:30px;font-size:14px">${i+1}</span><h3>${a.n} аймаг</h3>
   <span class="meta">Төв: ${a.c} · УБ-аас ${a.km} км · ${a.reg}</span></div>
   <div class="tabs">${TABS.map(([k,l])=>`<button class="tab ${k===t?'on':''}" onclick="setTab('${a.id}','${k}')">${l}</button>`).join('')}</div>
   <div>${tabBody(a,t)}</div></div>`}).join('');
}
function setTab(id,t){tabState[id]=t;renderDetails(order())}
function goSOS(){const s=$('#sos');s.scrollIntoView({behavior:'smooth'});s.classList.remove('hl');void s.offsetWidth;s.classList.add('hl')}

// ---------- Өдөр бүрийн хөтөлбөр ----------
const WD=['Ням','Даваа','Мягмар','Лхагва','Пүрэв','Баасан','Бямба'];
const hm=h=>{h=Math.min(h,23.5);const H=Math.floor(h),M=Math.round((h-H)*2)*30;return String(H+(M===60?1:0)).padStart(2,'0')+':'+(M===60?'00':String(M).padStart(2,'0'))};
const nm=p=>p===UB?'Улаанбаатар':p.c;

function midStop(a,b,f,skip){
 const pt={lat:a.lat+(b.lat-a.lat)*f,lng:a.lng+(b.lng-a.lng)*f};
 let best=null,bd=1e9;
 A.forEach(x=>{if(skip.includes(x))return;const d=hav(pt,x);if(d<bd){bd=d;best=x}});
 return bd<140?best:null;
}

const VIA={khovd:['uvurkhangai','bayankhongor','govialtai'],bayanulgii:['uvurkhangai','bayankhongor','govialtai','khovd'],
 govialtai:['uvurkhangai','bayankhongor'],bayankhongor:['uvurkhangai'],zavkhan:['arkhangai'],uvs:['arkhangai'],
 khuvsgul:['bulgan'],dornod:['khentii'],sukhbaatar:['khentii'],umnugovi:['dundgovi'],dornogovi:['govisumber']};

function buildPlan(route){
 const perday=+$('#perday').value||400, is4=$('#car').value==='13', ret=$('#ret').checked, sd=$('#sdays').value;
 const days=[]; let prev=UB;
 const stops=[...route]; if(ret&&route.length) stops.push(UB);
 stops.forEach(s=>{
  const d=road(prev,s);
  const n=d<=perday*1.25?1:Math.ceil(d/perday);
  // УБ-аас алс аймаг руу явах бодит гол замын дагуух хотууд
  let chain=[]; if(prev===UB&&VIA[s.id]) chain=VIA[s.id].map(byId); else if(s===UB&&VIA[prev.id]) chain=VIA[prev.id].map(byId).reverse();
  let cum=[],acc=0,pp=prev; chain.forEach(c=>{acc+=road(pp,c);cum.push([c,acc]);pp=c});
  let pos=0;
  for(let k=1;k<=n;k++){
   const last=k===n; let mid=null, end=last?d:Math.round(d*k/n);
   if(!last){
    const target=d*k/n; let best=null,bd=1e9;
    cum.forEach(([c,x])=>{if(Math.abs(x-target)<bd&&x>pos&&x<d){bd=Math.abs(x-target);best=[c,x]}});
    if(best&&bd<160){mid=best[0];end=Math.round(best[1])}
    else if(!chain.length) mid=midStop(prev,s,k/n,[prev,s]);
   }
   const seg=Math.round(end-pos); pos=end;
   const from=k===1?nm(prev):days[days.length-1].sleepAt;
   const lab=x=>x.c===x.n?x.c:x.c+' ('+x.n+')';
   const to=last?nm(s):(mid?lab(mid):'замын дагуух сумын төв');
   const arr=8+seg/60+1;
   const items=[[8,`Хөдлөх: <b>${from}</b>. Гарахаасаа өмнө шатахуун дүүргэх`],
                [seg/60>4.5?12.5:8+seg/120,'Замдаа өдрийн хоол, амралт'],
                [arr,`Хүрэх: <b>${to}</b>`]];
   days.push({type:s===UB&&last?'home':'drive',title:`${from} → ${to}`,km:seg,items,
     sleepAt:last?nm(s):(mid?mid.c:'Замын дагуух сумын төв'),
     sleep:last?(s===UB?'Гэртээ 🏠':`${s.c} хотын зочид буудал эсвэл ойрын кемп`):(mid?`${lab(mid)} хотын зочид буудал`:'Замын дагуух сумын төвийн буудал')});
  }
  if(s!==UB){
   const ok=s.p.filter(p=>is4||p[3]==='car'), skipped=is4?[]:s.p.filter(p=>p[3]!=='car');
   let nd=sd==='auto'?(ok.length>=4?2:1)+(s.km>900?1:0):+sd;
   nd=Math.max(1,Math.min(nd,Math.max(1,ok.length)));
   const groups=Array.from({length:nd},()=>[]);
   ok.forEach((p,i)=>groups[Math.floor(i*nd/ok.length)].push(p));
   groups.forEach((g,gi)=>{
    const slots=[[8.5,'Өглөөний цай, аймгийн төвөөс хүнс, ус авах']];
    let t=9.5;
    g.forEach(p=>{slots.push([t,`<b>${p[0]}</b> <small>· ${p[2]} · ${p[3]==='car'?'суудлын машин хүрнэ':'4x4'}</small>`,p]);t+=g.length>2?2.5:3.5});
    if(!g.length) slots.push([10,`${s.c} хотоор зугаалах, амрах`]);
    slots.push([Math.max(t,18),'Оройн хоол, амралт']);
    const key=g.length?g[0][0].split(/[ ,(]/)[0]:'';
    const camp=(key&&s.camps.find(c=>c.includes(key)))||s.camps[0];
    days.push({type:'sight',title:`${s.n}: ${g.length?g.map(p=>p[0]).join(', '):'амралтын өдөр'}`,km:0,items:slots,
      sleep:camp,sleepAt:s.c,skipped:gi===0?skipped:[]});
   });
  }
  prev=s;
 });
 return days;
}

function dayLabel(i){
 const v=$('#start').value; if(!v) return `${i+1}-р өдөр`;
 const d=new Date(v+'T00:00:00'); d.setDate(d.getDate()+i);
 return `${i+1}-р өдөр · ${d.getMonth()+1}/${d.getDate()} ${WD[d.getDay()]}`;
}

let lastPlan=[];
const isPro=()=>!!(window.Auth&&Auth.isPremium());

function dayCard(d,i){
 return `<div class="day ${d.type}">
   <div class="day-head"><span class="day-no">${dayLabel(i)}</span><span class="day-title">${d.type==='sight'?'🏞️ ':d.type==='home'?'🏠 ':'🚗 '}${d.title}</span>
   <span class="day-km">${d.km?`${fmt(d.km)} км · ~${(d.km/60).toFixed(1)} ц жолоодлого`:'Үзэх газрын өдөр'}</span></div>
   <div class="day-body">
    ${d.items.map(([t,x,p])=>`<div class="slot"><span class="t">${hm(t)}</span><span class="x">${x}${p?` · <a href="${gm(p[0]+' Mongolia')}" target="_blank" rel="noopener">зураг</a>`:''}</span></div>`).join('')}
    ${d.skipped&&d.skipped.length?`<div class="skipped">⚠️ Суудлын машинтай тул хасагдсан (4x4 хэрэгтэй): ${d.skipped.map(p=>p[0]).join(', ')}</div>`:''}
    <div class="sleep">🛏️ <b>Хоноглох:</b> ${d.sleep}</div>
   </div></div>`;
}

function renderPlan(route){
 lastPlan=buildPlan(route);
 const pro=isPro();
 $('#copyBtn').style.display=route.length&&pro?'':'none';
 $('#saveBtn').style.display=route.length&&pro&&window.Auth&&Auth.configured?'':'none';
 $('#pdfBtn').style.display=route.length?'':'none';
 $('#pdfBtn').textContent=pro?'🖨️ PDF / Хэвлэх':'🔒 PDF / Хэвлэх';
 $('#copyFallback').style.display='none';
 if(!route.length){$('#plan').innerHTML='<div class="empty">Аймгаа сонгоход өдөр бүрийн хөтөлбөр энд гарна.</div>';return}
 const cards=lastPlan.map(dayCard);
 const note='<p class="note">Цагийн хуваарь ойролцоо. Шороон замд хурд 30–40 км/ц болж буурдаг тул үзэх газар руу явах хугацааг нөөцтэй төлөвлөөрэй.</p>';
 if(pro){$('#plan').innerHTML=`<div class="days">${cards.join('')}</div>${note}`;return}
 const cfg=window.APP_CONFIG||{};
 $('#plan').innerHTML=`<div class="days">${cards[0]}</div>
  ${lastPlan.length>1?`<div class="locked"><div class="days blur" aria-hidden="true">${cards.slice(1,3).join('')}</div>
   <div class="paywall"><div class="paywall-box">
    <h3>🔒 Бүтэн хөтөлбөр — Премиум</h3>
    <div class="price">${fmt(cfg.PREMIUM_PRICE||9900)}₮ <small>/ ${cfg.PREMIUM_DAYS||30} хоног</small></div>
    <ul><li>${lastPlan.length} өдрийн бүтэн хөтөлбөр, цагийн хуваарьтай</li><li>Аяллаа хадгалж, дараа нь нээх</li><li>Хөтөлбөрөө хуулж, найзуудтайгаа хуваалцах</li></ul>
    <button class="btn wide" onclick="openPremium()">Премиум авах</button>
    ${trialBtn()}
   </div></div></div>`:''}
  <p class="note">Эхний өдрийн хөтөлбөр үнэгүй. Маршрут, зардал, аймгийн мэдээлэл, яаралтай тусламжийн хэсэг бүгд үнэгүй.</p>`;
}

// ---------- Бүртгэл, модаль ----------
function openModal(html){$('#modalBody').innerHTML=html;$('#modal').classList.add('open')}
function closeModal(){$('#modal').classList.remove('open')}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2600)}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function renderAcct(){
 const el=$('#acct'); if(!el) return;
 if(!window.Auth||!Auth.configured){el.innerHTML='<span class="badge">Демо горим</span>';return}
 if(!Auth.ready){el.innerHTML='';return}
 const u=Auth.user;
 if(!u){el.innerHTML='<button class="solid" onclick="openLogin()">Нэвтрэх</button>';return}
 const pro=Auth.isPremium(), until=Auth.premiumUntil();
 el.innerHTML=`<span class="who">${esc(u.email||'')}</span>
  ${pro?`<span class="badge pro" title="${until?until.toLocaleString():''} хүртэл">${Auth.isTrial()?'🎁 Туршилт':'★ Премиум'}</span>`:Auth.pending?'<button onclick="openPremium()">⏳ Шалгагдаж байна</button>':'<span class="badge">Үнэгүй</span>'}
  ${pro?'<button onclick="openTrips()">Миний аяллууд</button>':Auth.pending?'':'<button class="solid" onclick="openPremium()">Премиум</button>'}
  <button onclick="Auth.signOut()">Гарах</button>`;
}

const authErr=m=>{
 if(/Invalid login credentials/i.test(m)) return 'Имэйл эсвэл нууц үг буруу байна.';
 if(/already registered|already been registered/i.test(m)) return 'Энэ имэйл бүртгэлтэй байна. «Нэвтрэх» хэсгээр орно уу.';
 if(/Email not confirmed/i.test(m)) return 'Имэйл баталгаажаагүй байна. Имэйлээ шалгана уу.';
 if(/at least 6|Password should/i.test(m)) return 'Нууц үг хамгийн багадаа 6 тэмдэгт байна.';
 if(/rate limit|too many/i.test(m)) return 'Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.';
 if(/valid email|invalid format/i.test(m)) return 'Имэйл хаяг буруу байна.';
 return m;
};
function openLogin(mode){
 if(!Auth.configured){openModal('<h3>Нэвтрэх</h3><p>Supabase тохируулаагүй байна. <code>config.js</code> файлд SUPABASE_URL, SUPABASE_ANON_KEY-г оруулна уу.</p>');return}
 mode=mode||'login';
 if(mode==='reset'){
  openModal(`<h3>Нууц үг сэргээх</h3>
   <form onsubmit="doReset(event)"><input class="field" type="email" id="authEmail" placeholder="таны@имэйл.mn" required>
   <button class="btn wide" type="submit">Сэргээх холбоос илгээх</button></form>
   <p class="note"><a href="#" onclick="openLogin('login');return false">← Нэвтрэх рүү буцах</a></p>`);
  return;
 }
 if(mode==='magic'){
  openModal(`<h3>Имэйлээр нэвтрэх</h3>
   <form onsubmit="emailLogin(event)"><input class="field" type="email" id="loginEmail" placeholder="таны@имэйл.mn" required>
   <button class="btn wide" type="submit">Нэвтрэх холбоос илгээх</button></form>
   <p class="note">Имэйлд ирсэн холбоос дээр дарахад нэвтэрнэ. <a href="#" onclick="openLogin('login');return false">← Буцах</a></p>`);
  return;
 }
 const reg=mode==='signup';
 openModal(`<div class="tabs" style="margin-bottom:14px">
   <button class="tab ${reg?'':'on'}" onclick="openLogin('login')">Нэвтрэх</button>
   <button class="tab ${reg?'on':''}" onclick="openLogin('signup')">Бүртгүүлэх</button></div>
  <form onsubmit="pwAuth(event,${reg})">
   <input class="field" type="email" id="authEmail" placeholder="Имэйл" autocomplete="email" required>
   <input class="field" type="password" id="authPass" placeholder="Нууц үг (6+ тэмдэгт)" minlength="6" autocomplete="${reg?'new-password':'current-password'}" required>
   ${reg?'<input class="field" type="password" id="authPass2" placeholder="Нууц үгээ давтах" minlength="6" autocomplete="new-password" required>':''}
   <div id="authMsg" class="note" style="color:var(--red);min-height:0"></div>
   <button class="btn wide" type="submit" id="authBtn">${reg?'Бүртгүүлэх':'Нэвтрэх'}</button>
  </form>
  <p class="note" style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">
   ${reg?'':'<a href="#" onclick="openLogin(\'reset\');return false">Нууц үгээ мартсан?</a>'}
   <a href="#" onclick="openLogin('magic');return false">Нууц үггүйгээр имэйлээр нэвтрэх</a></p>`);
}
async function pwAuth(e,reg){
 e.preventDefault();
 const email=$('#authEmail').value.trim(), pass=$('#authPass').value, msg=$('#authMsg'), btn=$('#authBtn');
 msg.textContent='';
 if(reg&&pass!==$('#authPass2').value){msg.textContent='Нууц үг таарахгүй байна.';return}
 btn.disabled=true;
 const {data,error}=reg?await Auth.signUpPassword(email,pass):await Auth.signInPassword(email,pass);
 btn.disabled=false;
 if(error){msg.textContent=authErr(error.message);return}
 if(reg&&!data.session){$('#modalBody').innerHTML=`<h3>📩 Имэйлээ баталгаажуулна уу</h3><p><b>${esc(email)}</b> руу баталгаажуулах холбоос илгээлээ.</p>`;return}
 closeModal();toast(reg?'🎉 Тавтай морил! Бүртгэл үүслээ':'Амжилттай нэвтэрлээ');
}
async function doReset(e){
 e.preventDefault();
 const email=$('#authEmail').value.trim();
 const {error}=await Auth.resetPassword(email);
 $('#modalBody').innerHTML=error?`<h3>Алдаа</h3><p>${esc(authErr(error.message))}</p>`:`<h3>📩 Имэйлээ шалгаарай</h3><p><b>${esc(email)}</b> руу нууц үг сэргээх холбоос илгээлээ. Холбоос дээр дарсны дараа шинэ нууц үгээ оруулна.</p>`;
}
function openNewPassword(){
 openModal(`<h3>Шинэ нууц үг тохируулах</h3>
  <form onsubmit="saveNewPassword(event)">
   <input class="field" type="password" id="np1" placeholder="Шинэ нууц үг (6+ тэмдэгт)" minlength="6" autocomplete="new-password" required>
   <input class="field" type="password" id="np2" placeholder="Давтах" minlength="6" autocomplete="new-password" required>
   <div id="npMsg" class="note" style="color:var(--red)"></div>
   <button class="btn wide" type="submit">Хадгалах</button></form>`);
}
async function saveNewPassword(e){
 e.preventDefault();
 if($('#np1').value!==$('#np2').value){$('#npMsg').textContent='Нууц үг таарахгүй байна.';return}
 const {error}=await Auth.updatePassword($('#np1').value);
 if(error){$('#npMsg').textContent=authErr(error.message);return}
 closeModal();toast('✅ Нууц үг шинэчлэгдлээ');
}
async function emailLogin(e){
 e.preventDefault();
 const email=$('#loginEmail').value.trim(); if(!email) return;
 const {error}=await Auth.signInEmail(email);
 $('#modalBody').innerHTML=error?`<h3>Алдаа гарлаа</h3><p>${esc(authErr(error.message))}</p>`:`<h3>📩 Имэйлээ шалгаарай</h3><p><b>${esc(email)}</b> хаяг руу нэвтрэх холбоос илгээлээ. Spam хавтсаа ч шалгаарай.</p>`;
}

function copyText(txt,btn){
 const done=()=>{if(btn){const o=btn.textContent;btn.textContent='✅';setTimeout(()=>btn.textContent=o,1200)}};
 try{navigator.clipboard.writeText(txt).then(done,()=>toast('Хуулж чадсангүй — гараар хуулна уу'))}catch(e){toast('Хуулж чадсангүй — гараар хуулна уу')}
}
function payRow(label,val){
 if(!val) return '';
 return `<div class="pay-row"><span>${label}</span><b>${esc(val)}</b><button type="button" class="copy" data-v="${esc(val)}" onclick="copyText(this.dataset.v,this)">Хуулах</button></div>`;
}
function openPremium(){
 if(!Auth.configured){openModal('<h3>Премиум</h3><p>Демо горимд байна. Премиумыг туршиж харах бол <code>config.js</code>-д <code>DEMO_PREMIUM: true</code> болгоно уу.</p>');return}
 if(!Auth.user){openLogin();return}
 const cfg=window.APP_CONFIG||{}, price=cfg.PREMIUM_PRICE||9900, days=cfg.PREMIUM_DAYS||30;
 if(Auth.isPremium()&&!Auth.pending){
  const u=Auth.premiumUntil();
  openModal(`<h3>★ Та премиум эрхтэй</h3><p>${u?`<b>${u.toLocaleDateString()}</b> хүртэл хүчинтэй.`:''}</p><p class="note">Хугацаагаа сунгах бол дахин төлбөр төлж хүсэлт илгээж болно.</p>
   <button class="btn wide" onclick="openPayForm()">Хугацаа сунгах</button>`);
  return;
 }
 if(Auth.pending){
  const p=Auth.pending;
  openModal(`<h3>⏳ Таны төлбөр шалгагдаж байна</h3>
   <p>Гүйлгээний утга: <b>${esc(p.ref_code)}</b> · ${fmt(p.amount)}₮<br><small class="note">${new Date(p.created_at).toLocaleString()}</small></p>
   <p class="note">Бид дансны хуулгатай тулгаад премиум эрхийг тань нээнэ. Ихэвчлэн хэдэн цагийн дотор.${cfg.CONTACT?` Асуух зүйл байвал: <b>${esc(cfg.CONTACT)}</b>`:''}</p>
   <button class="btn ghost wide" onclick="checkStatus()">Төлөвөө шалгах</button>`);
  return;
 }
 openPayForm();
}
function openPayForm(){
 const cfg=window.APP_CONFIG||{}, price=cfg.PREMIUM_PRICE||9900, days=cfg.PREMIUM_DAYS||30, ref=Auth.refCode();
 const hasBank=cfg.BANK_ACCOUNT||cfg.BANK_QR_IMAGE;
 openModal(`<h3>★ Премиум эрх</h3>
  <div class="price">${fmt(price)}₮ <small>/ ${days} хоног</small></div>
  <ul class="info-list" style="margin:10px 0 14px"><li>Өдөр бүрийн бүтэн хөтөлбөр</li><li>Аяллаа хадгалах, дахин нээх</li><li>Хөтөлбөр хуулж хуваалцах</li><li>PDF болгож хадгалах, хэвлэх</li></ul>
  ${Auth.trialAvailable()?`<div class="trial-box">🎁 Эхлээд үнэгүй туршаад үзэх үү? ${trialBtn()}</div>`:''}
  ${hasBank?`
  <div class="pay-box">
   <div class="pay-step">1. Дараах данс руу <b>${fmt(price)}₮</b> шилжүүлнэ</div>
   ${cfg.BANK_QR_IMAGE?`<div class="qr"><a href="${esc(cfg.BANK_QR_IMAGE)}" target="_blank" rel="noopener" title="Томоор харах"><img src="${esc(cfg.BANK_QR_IMAGE)}" alt="Төлбөрийн QR"></a>
    <small><b>${esc(cfg.BANK_NAME||'Банкны')}</b> аппаар уншуулна</small>
    <a class="copy qr-save" href="${esc(cfg.BANK_QR_IMAGE)}" download="campsite-tulbur-qr.png">📥 QR зураг хадгалах</a>
    <small class="qr-tip">🏦 <b>Өөр банкны</b> апп QR-ыг уншихгүй бол доорх <b>дансны дугаар</b> руу энгийн шилжүүлгээр шилжүүлнэ.<br>📱 Утсаараа үзэж байгаа бол QR-ыг хадгалаад аппын <b>QR уншуулах → Зургаас</b> хэсгээс сонгоно.</small></div>`:''}
   ${payRow('Банк',cfg.BANK_NAME)}${payRow('Данс',cfg.BANK_ACCOUNT)}${payRow('Хүлээн авагч',cfg.BANK_HOLDER)}
   <div class="pay-row ref"><span>Гүйлгээний утга</span><b>${ref}</b><button type="button" class="copy" onclick="copyText('${ref}',this)">Хуулах</button></div>
   <p class="note" style="margin:6px 0 0">⚠️ Гүйлгээний утгад заавал <b>${ref}</b> гэж бичнэ үү. Үүгээр таны төлбөрийг танина.</p>
  </div>
  <form onsubmit="submitPay(event)" class="pay-box">
   <div class="pay-step">2. Шилжүүлсний дараа мэдэгдэнэ</div>
   <input class="field" id="payName" maxlength="100" placeholder="Шилжүүлсэн дансны эзэмшигчийн нэр" required>
   <input class="field" id="payNote" maxlength="300" placeholder="Нэмэлт тайлбар (заавал биш)">
   <button class="btn wide" type="submit" id="payBtn">Төлсөн — шалгуулах</button>
  </form>`:`<div class="warn">Төлбөрийн данс хараахан тохируулагдаагүй байна.${cfg.CONTACT?` Холбогдох: <b>${esc(cfg.CONTACT)}</b>`:''}</div>`}
  ${cfg.CONTACT&&hasBank?`<p class="note">Асуух зүйл байвал: <b>${esc(cfg.CONTACT)}</b></p>`:''}`);
}
async function submitPay(e){
 e.preventDefault();
 const cfg=window.APP_CONFIG||{}, btn=$('#payBtn');
 const name=$('#payName').value.trim(), note=$('#payNote').value.trim();
 if(!name) return;
 btn.disabled=true; btn.textContent='Илгээж байна…';
 const {error}=await Auth.createRequest(name,note,cfg.PREMIUM_PRICE||9900);
 if(error){
  btn.disabled=false; btn.textContent='Төлсөн — шалгуулах';
  toast(/duplicate|unique/i.test(error.message)?'Танд шалгагдаж буй хүсэлт аль хэдийн байна':'Алдаа: '+error.message);
  return;
 }
 await Auth.refresh();
 openPremium();
}
async function checkStatus(){
 await Auth.refresh();
 if(Auth.isPremium()&&!Auth.pending){closeModal();toast('🎉 Премиум эрх нээгдлээ!');render();return}
 if(!Auth.pending){
  const {data}=await Auth.myRequests();
  const last=data&&data[0];
  if(last&&last.status==='rejected'){openModal(`<h3>Хүсэлт батлагдсангүй</h3><p>${esc(last.admin_note||'Төлбөр олдсонгүй.')}</p><button class="btn wide" onclick="openPayForm()">Дахин илгээх</button>`);return}
 }
 toast('Одоогоор шалгагдаж байна');
}

function tripPayload(){return{sel,car:$('#car').value,price:$('#price').value,perday:$('#perday').value,sdays:$('#sdays').value,start:$('#start').value,ret:$('#ret').checked}}
async function saveTrip(){
 if(!Auth.user){openLogin();return}
 if(!sel.length) return;
 const name=order().map(a=>a.n).join(' → ')+($('#start').value?` (${$('#start').value})`:'');
 const {error}=await Auth.saveTrip(name,tripPayload());
 toast(error?'Хадгалж чадсангүй: '+error.message:'✅ Аялал хадгалагдлаа');
}
async function openTrips(){
 openModal('<h3>Миний аяллууд</h3><p class="note">Ачаалж байна…</p>');
 const {data,error}=await Auth.listTrips();
 if(error){$('#modalBody').innerHTML=`<h3>Миний аяллууд</h3><p>${esc(error.message)}</p>`;return}
 window._trips=data||[];
 $('#modalBody').innerHTML='<h3>Миний аяллууд</h3>'+(data&&data.length?data.map((t,i)=>`<div class="trip-row"><div class="tn">${esc(t.name)}<small>${new Date(t.created_at).toLocaleDateString()}</small></div>
  <button onclick="loadTrip(${i})">Нээх</button><button onclick="loadTrip(${i});setTimeout(printPlan,400)">PDF</button><button onclick="delTrip('${t.id}')">Устгах</button></div>`).join(''):'<p class="note">Хадгалсан аялал алга. Маршрутаа гаргаад «💾 Аяллаа хадгалах» дарна уу.</p>');
}
function loadTrip(i){
 const p=window._trips[i].payload||{};
 sel=(p.sel||[]).filter(id=>A.some(a=>a.id===id));
 [['car',p.car],['price',p.price],['perday',p.perday],['sdays',p.sdays],['start',p.start]].forEach(([id,v])=>{if(v!=null&&v!=='')$('#'+id).value=v});
 $('#ret').checked=p.ret!==false;
 save();closeModal();render();toast('Аялал нээгдлээ');
 $('#planbox').scrollIntoView({behavior:'smooth'});
}
async function delTrip(id){
 const {error}=await Auth.deleteTrip(id);
 if(error){toast(error.message);return}
 openTrips();
}

function copyPlan(){
 const strip=s=>s.replace(/<[^>]+>/g,'');
 const txt='МОНГОЛ АЯЛЛЫН ХӨТӨЛБӨР\n\n'+lastPlan.map((d,i)=>
  `${dayLabel(i)} — ${d.title}${d.km?` (${d.km} км)`:''}\n`+d.items.map(([t,x])=>`  ${hm(t)}  ${strip(x)}`).join('\n')+`\n  Хоноглох: ${d.sleep}`).join('\n\n')
  +'\n\nЯаралтай: 101 гал · 102 цагдаа · 103 түргэн · 105 онцгой байдал';
 const fb=()=>{const ta=$('#copyFallback');ta.value=txt;ta.style.display='block';ta.select()};
 try{navigator.clipboard.writeText(txt).then(()=>{$('#copyBtn').textContent='✅ Хуулагдлаа';setTimeout(()=>$('#copyBtn').textContent='📋 Хөтөлбөр хуулах',1800)},fb)}catch(e){fb()}
}

// ---------- Санал хүсэлт, холбогдох ----------
const FB_KINDS=[['idea','💡 Санал'],['bug','🐞 Алдаа мэдээлэх'],['place','📍 Газар нэмүүлэх'],['other','✉️ Бусад']];
function openFeedback(kind){
 if(!window.Auth||!Auth.configured){openModal('<h3>Санал хүсэлт</h3><p>Одоогоор ажиллахгүй байна.</p>');return}
 kind=kind||'idea';
 const u=Auth.user;
 openModal(`<h3>💬 Санал хүсэлт</h3>
  <form onsubmit="sendFeedback(event)">
   <div class="tabs" id="fbKinds">${FB_KINDS.map(([k,l])=>`<button type="button" class="tab ${k===kind?'on':''}" data-k="${k}" onclick="pickFbKind(this)">${l}</button>`).join('')}</div>
   <textarea class="field" id="fbMsg" rows="5" maxlength="2000" minlength="3" required placeholder="Юу гэж бодож байна? Аль аймаг, ямар газар гэдгийг дэлгэрэнгүй бичвэл илүү тус болно."></textarea>
   <input class="field" id="fbName" maxlength="100" placeholder="Нэр (заавал биш)">
   <input class="field" id="fbContact" maxlength="150" placeholder="Утас эсвэл имэйл — хариу авах бол (заавал биш)" value="${u?esc(u.email||''):''}">
   <div id="fbErr" class="note" style="color:var(--red)"></div>
   <button class="btn wide" type="submit" id="fbBtn">Илгээх</button>
  </form>`);
 $('#modalBody').dataset.kind=kind;
}
function pickFbKind(b){document.querySelectorAll('#fbKinds .tab').forEach(x=>x.classList.toggle('on',x===b));$('#modalBody').dataset.kind=b.dataset.k}
async function sendFeedback(e){
 e.preventDefault();
 const msg=$('#fbMsg').value.trim(); if(msg.length<3){$('#fbErr').textContent='Дор хаяж хэдэн үг бичнэ үү.';return}
 const btn=$('#fbBtn'); btn.disabled=true; btn.textContent='Илгээж байна…';
 const {error}=await Auth.sendFeedback({kind:$('#modalBody').dataset.kind||'idea',message:msg,name:$('#fbName').value.trim(),contact:$('#fbContact').value.trim()});
 if(error){btn.disabled=false;btn.textContent='Илгээх';$('#fbErr').textContent='Илгээж чадсангүй: '+error.message;return}
 $('#modalBody').innerHTML='<h3>🙏 Баярлалаа!</h3><p>Таны санал хүсэлт хүлээн авагдлаа. Сайтаа сайжруулахад ашиглана.</p><button class="btn wide" onclick="closeModal()">Хаах</button>';
}
// ---------- 1 өдрийн туршилт ----------
let wantTrial=false;
function trialBtn(){
 if(!window.Auth||!Auth.configured) return '';
 if(Auth.user&&!Auth.trialAvailable()) return '';
 return `<button class="btn ghost wide trial-btn" onclick="startTrial()">🎁 1 өдөр үнэгүй турших</button>`;
}
async function startTrial(){
 if(!Auth.user){wantTrial=true;openLogin('signup');toast('Бүртгүүлсний дараа туршилт автоматаар нээгдэнэ');return}
 if(!Auth.trialAvailable()){toast('Туршилтын эрхээ аль хэдийн ашигласан байна');return}
 const {error}=await Auth.startTrial();
 if(error){toast(error.message);return}
 closeModal();toast('🎁 24 цагийн премиум нээгдлээ! Бүтэн хөтөлбөрөө үзээрэй');
 const pb=$('#planbox'); if(pb&&order().length) pb.scrollIntoView({behavior:'smooth'});
}

// ---------- PDF / Хэвлэх ----------
function printPlan(){
 const route=order(); if(!route.length) return;
 if(!isPro()){openPremium();return}
 const plan=buildPlan(route), ret=$('#ret').checked, L=+$('#car').value, price=+$('#price').value||0;
 let p=UB,sum=0,legs=[]; route.forEach(a=>{const d=road(p,a);legs.push([p,a,d]);sum+=d;p=a}); if(ret){const d=road(p,UB);legs.push([p,UB,d]);sum+=d}
 const liters=sum*L/100, carTxt=$('#car').selectedOptions[0].textContent;
 const start=$('#start').value, today=new Date().toLocaleDateString();
 const svg=$('#svgbox svg'); 
 const aimagInfo=route.map(a=>{
  const is4=$('#car').value==='13';
  return `<section class="pr-aimag"><h3>${a.n} аймаг <small>· Төв: ${a.c} · УБ-аас ${a.km} км</small></h3>
   <table class="pr-tbl"><tr><th>Үзэх газар</th><th>Зай</th><th>Машин</th><th>Улирал</th></tr>
   ${a.p.map(x=>`<tr${!is4&&x[3]!=='car'?' class="dim"':''}><td><b>${x[0]}</b><br><small>${x[1]}</small></td><td>${x[2]}</td><td>${x[3]==='car'?'Суудлын':'4x4'}</td><td>${x[4]}</td></tr>`).join('')}</table>
   <p><b>Хоноглох:</b> ${a.camps.join('; ')}</p>
   <p><b>Зам:</b> ${a.road}</p>
   <p><b>Эмнэлэг:</b> ${a.c} — аймгийн Нэгдсэн эмнэлэг; сум бүрт сумын эрүүл мэндийн төв. <b>Цагдаа:</b> ${a.n} аймгийн Цагдаагийн газар.</p></section>`}).join('');
 $('#printArea').innerHTML=`
  <div class="pr-head"><div><h1>🏕️ Монгол аяллын хөтөлбөр</h1>
   <div class="pr-route">${['Улаанбаатар',...route.map(a=>a.c+' ('+a.n+')'),...(ret?['Улаанбаатар']:[])].join(' → ')}</div></div>
   <div class="pr-meta">${start?`Гарах өдөр: <b>${start}</b><br>`:''}Бэлтгэсэн: ${today}<br>by Dulguunsuvd Ganmyagmar</div></div>
  <div class="pr-stats"><div><b>${fmt(sum)} км</b>Нийт зай</div><div><b>~${Math.round(sum/60)} цаг</b>Жолоодлого</div><div><b>~${fmt(liters)} л · ${fmt(liters*price)}₮</b>Шатахуун (${carTxt.split('(')[0].trim()})</div><div><b>${plan.length} өдөр</b>Хөтөлбөр</div></div>
  <div class="pr-two">${svg?`<div class="pr-map">${svg.outerHTML}</div>`:''}
   <ol class="pr-legs">${legs.map(([a,b,d])=>`<li>${a.c||a.n} → ${b.c||b.n} <span>${a===UB||b===UB?'':'~'}${fmt(d)} км</span></li>`).join('')}</ol></div>
  <h2>Өдөр бүрийн хөтөлбөр</h2>
  <div class="days">${plan.map(dayCard).join('')}</div>
  <h2>Аймгийн мэдээлэл</h2>${aimagInfo}
  <h2>Яаралтай үед</h2>
  <div class="pr-sos"><div><b>101</b>Гал</div><div><b>102</b>Цагдаа</div><div><b>103</b>Түргэн тусламж</div><div><b>105</b>Онцгой байдал</div></div>
  <ul class="pr-check"><li>☐ Нөөц дугуй, домкрат, трос, компрессор</li><li>☐ Иргэний ба жолооны үнэмлэх, даатгал</li><li>☐ Ус (хүнд өдөрт 3 л), хуурай хүнс, дулаан хувцас</li><li>☐ Power bank, офлайн газрын зураг</li><li>☐ Анхны тусламжийн цүнх</li><li>☐ Маршрут, буцах өдрөө гэр бүлдээ хэлсэн</li></ul>
  <div class="pr-foot">Монгол аялал · ${location.host}${location.pathname} · by Dulguunsuvd Ganmyagmar — Зай, цаг ойролцоо утга.</div>`;
 const done=()=>{document.body.classList.remove('printing');window.removeEventListener('afterprint',done)};
 window.addEventListener('afterprint',done);
 document.body.classList.add('printing');
 const t=document.title; document.title='Монгол-аялал-'+route.map(a=>a.n).join('-');
 setTimeout(()=>{window.print();document.title=t;setTimeout(done,1500)},150);
}

function renderFooter(){
 const cfg=window.APP_CONFIG||{}, el=$('#footContact'); if(!el) return;
 const items=[];
 if(cfg.CONTACT){
  const c=String(cfg.CONTACT).trim(), digits=c.replace(/[^0-9+]/g,'');
  items.push(/^[0-9 +-]+$/.test(c)?`<li>📞 <a href="tel:${esc(digits)}">${esc(c)}</a></li>`:/^https?:/.test(c)?`<li>🔗 <a href="${esc(c)}" target="_blank" rel="noopener">${esc(c.replace(/^https?:\/\//,''))}</a></li>`:`<li>📞 ${esc(c)}</li>`);
 }
 items.push('<li>💬 <a href="#" onclick="openFeedback();return false">Санал хүсэлт илгээх</a></li>');
 items.push('<li>🆘 <a href="#sos" onclick="goSOS();return false">Яаралтай тусламж</a></li>');
 el.innerHTML=items.join('');
 const y=$('#yr'); if(y) y.textContent=new Date().getFullYear();
}

function render(){renderChips();const r=order();renderMap(r);renderSummary(r);renderPlan(r);renderDetails(r);renderAcct()}
if(window.Auth) Auth.onChange(()=>{render();if(Auth.recovery)openNewPassword();if(wantTrial&&Auth.user&&Auth.ready){wantTrial=false;startTrial()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
['car','price','perday','ret','sdays','start'].forEach(id=>$('#'+id).addEventListener('input',render));
render();renderFooter();
