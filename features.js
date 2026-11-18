// Нэмэлт боломжууд: шатахууны үнэ (#1), цаг агаар (#5), «Би энд байна» (#9),
// газрын домог, түүх (#14), айл буудал (#13). app.js-ийн дараа ачаалагдана.

// ================= 1. Шатахууны төрөл, үнэ =================
const FUEL_DEFAULT = [
  { code: 'a80', name: 'А-80', price: 3000 },
  { code: 'ai92', name: 'АИ-92', price: 3300 },
  { code: 'ai92e', name: 'АИ-92 Евро-5', price: 3700 },
  { code: 'ai95', name: 'АИ-95', price: 4200 },
  { code: 'ai98', name: 'АИ-98', price: 4800 },
  { code: 'diesel', name: 'Дизель', price: 3700 },
  { code: 'lpg', name: 'Шингэн хий (LPG)', price: 1600 }
];
let FUEL = FUEL_DEFAULT.slice(), FUEL_UPD = null, fuelTouched = false;
const CAR_FUEL = { '6': 'ai92', '9': 'ai92', '13': 'ai92', '11': 'diesel' };

async function loadFuel() {
  try {
    if (window.Auth && Auth.configured) {
      const { data } = await Auth.fuelPrices();
      if (data && data.length) {
        FUEL = data;
        FUEL_UPD = data.reduce((m, f) => (!m || f.updated_at > m ? f.updated_at : m), null);
        renderFuel(); render();
      }
    }
  } catch (e) { console.warn('fuel', e) }
}
function renderFuel() {
  const sel = $('#fuel'); if (!sel) return;
  const cur = sel.value || CAR_FUEL[$('#car').value] || 'ai92';
  sel.innerHTML = FUEL.map(f => `<option value="${f.code}">${esc(f.name)} — ${fmt(f.price)}₮</option>`).join('') + '<option value="custom">Өөрөө оруулах</option>';
  sel.value = FUEL.some(f => f.code === cur) || cur === 'custom' ? cur : 'ai92';
  applyFuel(false);
}
function applyFuel(user) {
  const sel = $('#fuel'), f = FUEL.find(x => x.code === sel.value), note = $('#fuelNote');
  if (user) fuelTouched = true;
  if (f) { $('#price').value = f.price; $('#price').readOnly = true }
  else $('#price').readOnly = false;
  if (note) note.textContent = f ? (FUEL_UPD ? `Шинэчилсэн: ${new Date(FUEL_UPD).toLocaleDateString()}` : 'Ойролцоо үнэ') : 'Үнээ оруулна уу';
  if (user) render();
}
function onCarChangeFuel() {
  if (fuelTouched) return;
  const s = CAR_FUEL[$('#car').value];
  if (s && $('#fuel') && $('#fuel').value !== s) { $('#fuel').value = s; applyFuel(false); render() }
}

// ================= 2. Цаг агаар (Open-Meteo) =================
const WX = {};
const WMO = c => c === 0 ? ['☀️', 'Цэлмэг'] : c <= 2 ? ['🌤️', 'Багавтар үүлтэй'] : c === 3 ? ['☁️', 'Үүлэрхэг'] : c <= 48 ? ['🌫️', 'Манан'] :
  c <= 57 ? ['🌦️', 'Шиврээ'] : c <= 67 ? ['🌧️', 'Бороо'] : c <= 77 ? ['❄️', 'Цас'] : c <= 82 ? ['🌧️', 'Аадар бороо'] : c <= 86 ? ['🌨️', 'Цасан шуурга'] : ['⛈️', 'Аянга цахилгаан'];
function wxGet(p) {
  const key = p.lat.toFixed(2) + ',' + p.lng.toFixed(2);
  if (!WX[key]) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}` +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max' +
      '&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto&forecast_days=16&wind_speed_unit=ms';
    WX[key] = fetch(url).then(r => r.ok ? r.json() : null).catch(() => null);
  }
  return WX[key];
}
function wxWarn(mx, mn, pr, wd, code) {
  const w = [];
  if (wd >= 15) w.push('💨 Хүчтэй салхи / шороон шуурга');
  if (mn <= -30) w.push('🥶 Маш хүйтэн');
  if (mx >= 35) w.push('🥵 Халуун — ус их уу');
  if (pr >= 20 && code < 70) w.push('🌊 Аадар бороо — гол үерлэх эрсдэл');
  if (pr >= 8 && code >= 71 && code <= 86) w.push('❄️ Их цас — зам гулгаатай');
  return w;
}
function dayPlace(d) {
  if (d.type === 'home') return UB;
  return A.find(a => a.c === d.sleepAt) || (d.sleepAt === 'Улаанбаатар' ? UB : null);
}
async function wxFillPlan() {
  const start = $('#start') && $('#start').value;
  const hint = $('#wxHint');
  const slots = document.querySelectorAll('.wx[data-day]');
  if (!slots.length) { if (hint) hint.textContent = ''; return }
  if (!start) { if (hint) hint.textContent = '🌤️ Гарах өдрөө сонговол өдөр бүрийн цаг агаарын урьдчилсан мэдээ энд гарна.'; return }
  const d0 = new Date(start + 'T00:00:00'), today = new Date(); today.setHours(0, 0, 0, 0);
  const off = Math.round((d0 - today) / 864e5);
  if (off > 15) { if (hint) hint.textContent = `🌤️ Цаг агаарын урьдчилсан мэдээ аялалаас 16 хоногийн өмнөөс гарна (${off - 15} хоногийн дараа).`; return }
  if (hint) hint.textContent = '';
  for (const el of slots) {
    const i = +el.dataset.day, d = lastPlan[i]; if (!d) continue;
    const p = dayPlace(d); if (!p) continue;
    const idx = off + i; if (idx < 0 || idx > 15) continue;
    const j = await wxGet(p); if (!j || !j.daily || !el.isConnected) continue;
    const D = j.daily, c = D.weather_code[idx], [ic, tx] = WMO(c);
    const mx = Math.round(D.temperature_2m_max[idx]), mn = Math.round(D.temperature_2m_min[idx]), pr = D.precipitation_sum[idx] || 0, wd = Math.round(D.wind_speed_10m_max[idx] || 0);
    const warn = wxWarn(mx, mn, pr, wd, c);
    el.innerHTML = `${ic} <b>${p.c || p.n}:</b> ${tx}, ${mx > 0 ? '+' : ''}${mx}° / ${mn > 0 ? '+' : ''}${mn}°, салхи ${wd} м/с${pr >= 1 ? `, ${Math.round(pr)} мм` : ''}` +
      (warn.length ? `<div class="wx-warn">${warn.join(' · ')}</div>` : '');
  }
}
async function wxFillNow() {
  for (const el of document.querySelectorAll('.wx-now[data-a]')) {
    const a = A.find(x => x.id === el.dataset.a); if (!a) continue;
    const j = await wxGet(a); if (!j || !j.current || !el.isConnected) continue;
    const [ic, tx] = WMO(j.current.weather_code), t = Math.round(j.current.temperature_2m);
    el.innerHTML = ` · ${ic} Одоо ${t > 0 ? '+' : ''}${t}° ${tx.toLowerCase()}`;
  }
}

// ================= 3. «Би энд байна» =================
function shareLocation() {
  if (!navigator.geolocation) { openModal('<h3>📍 Байршил</h3><p>Таны хөтөч байршил тогтоохыг дэмжихгүй байна.</p>'); return }
  openModal('<h3>📍 Байршил тогтоож байна…</h3><p class="note">Утасны GPS асаалттай эсэхийг шалгана уу. Интернэтгүй үед ч GPS ажилладаг.</p>');
  navigator.geolocation.getCurrentPosition(pos => {
    const la = pos.coords.latitude.toFixed(5), lo = pos.coords.longitude.toFixed(5), acc = Math.round(pos.coords.accuracy);
    const time = new Date().toLocaleString();
    const link = `https://maps.google.com/?q=${la},${lo}`;
    const txt = `📍 Би энд байна (${time})\nКоординат: ${la}, ${lo} (±${acc} м)\n${link}`;
    window._locTxt = txt;
    openModal(`<h3>📍 Таны байршил</h3>
      <div class="loc-box"><b>${la}, ${lo}</b><br><small>±${acc} м нарийвчлал · ${esc(time)}</small></div>
      <div class="loc-btns">
        ${navigator.share ? '<button class="btn wide" onclick="navigator.share({text:window._locTxt}).catch(()=>{})">📤 Илгээх (Messenger, Viber…)</button>' : ''}
        <a class="btn wide ghost" href="sms:?&body=${encodeURIComponent(txt)}">✉️ SMS-ээр илгээх</a>
        <button class="btn wide ghost" onclick="copyText(window._locTxt,this)">📋 Хуулах</button>
        <a class="btn wide ghost" href="${link}" target="_blank" rel="noopener">🗺️ Газрын зурагт харах</a>
      </div>
      <p class="note">Интернэт байхгүй бол SMS-ээр илгээнэ. Яаралтай үед 105, 103 руу залгаад энэ координатыг хэлээрэй.</p>`);
  }, err => {
    openModal(`<h3>📍 Байршил олдсонгүй</h3><p>${err.code === 1 ? 'Байршил ашиглах зөвшөөрөл өгөөгүй байна. Хөтчийн тохиргооноос зөвшөөрнө үү.' : 'GPS дохио сул байна. Ил задгай газар гараад дахин оролдоно уу.'}</p>
      <button class="btn wide" onclick="shareLocation()">Дахин оролдох</button>`);
  }, { enableHighAccuracy: true, timeout: 25000, maximumAge: 60000 });
}

// ================= 4. Газрын домог, түүх =================
const LEGENDS = {
  'Тайхар чулуу': 'Домогт өгүүлснээр эрт урьд цагт энэ нутагт хүн мал хорлодог аварга могой байжээ. Нэгэн хүчит баатар асар том хадыг өргөн шидэж могойг дарсан нь өнөөгийн Тайхар чулуу гэдэг. Хадан дээр эртний бичээсүүд бий тул сэвтээж, шинээр бичиж болохгүй.',
  'Тэрхийн Цагаан нуур, Хорго тогоо': 'Домогт эрт цагт нэгэн өвгөн эмгэн худгаасаа ус аваад амыг нь таглахаа мартсанаас ус халин бүхэл хөндийг үерлүүлжээ. Нэгэн баатар ойролцоох уулын оройг сумаар тасдаж худгийн аманд унагаснаар ус тогтсон бөгөөд тэр орой өнөөдөр нуурын арал болон үлдсэн гэдэг. Нуурын зүүн талын Хорго бол мянга мянган жилийн өмнө дэлбэрсэн галт уулын тогоо юм.',
  'Хархорум ба Эрдэнэ Зуу хийд': 'Их Монгол Улсын нийслэл Хархорумыг 13-р зуунд байгуулж, Өгөдэй хааны үед хэрэмлэн барьжээ. Хотын туурин дээрх чулуунаас ашиглан 1586 онд Абтай сайн хан Эрдэнэ Зуу хийдийг байгуулсан бөгөөд 108 суврагатай хэрмээрээ алдартай. Хийдийн ойролцоох эртний яст мэлхий хөшөөнүүд нь Хархорум хотын хилийн тэмдэг байсан гэж үздэг.',
  'Орхоны хүрхрээ (Улаан цутгалан)': 'Энэ хүрхрээ олон мянган жилийн өмнө галт уулын дэлбэрэлт, газар хөдлөлтийн улмаас газар хагарснаар үүссэн гэж үздэг. Бороотой зуны сард хамгийн их устай байдаг бол хуурай жилүүдэд урсгал нь бараг тасарч ч болно. Хүрхрээний доогуур хавцлаар явганаар бууж болно, гулгаатай тул болгоомжтой байгаарай.',
  'Төвхөн хийд': 'Өндөр гэгээн Занабазар 17-р зуунд энэ уулын оройд хийдээ байгуулж, бурхны шүтээн урласан гэдэг. Соёмбо үсгийг энд зохиосон гэж ярьдаг. Хийдийн орчим «эхийн хэвлий» гэж нэрлэдэг нарийн агуйгаар мөлхөн гарвал нүгэл арилна гэсэн итгэл бий.',
  'Амарбаясгалант хийд': 'Энэ хийдийг 18-р зууны эхээр Манжийн хааны зарлигаар Өндөр гэгээн Занабазарыг хүндэтгэн барьжээ. 1930-аад оны хэлмэгдүүлэлтийн үед олон хийд сүйдсэн ч Амарбаясгалант харьцангуй бүрэн бүтэн үлдсэн цөөн хийдийн нэг юм. Ивэн голын хөндийн үзэсгэлэнтэй орчинд оршдог.',
  'Ёлын ам': 'Хавцлын нэр нь энд үүрлэдэг ёл буюу сахалт тас шувуунаас гаралтай. Нарийн хавцалд нар тусдаггүй тул өвлийн мөс зуны эхэн хүртэл, зарим жил зуны турш хайлдаггүй байжээ. Сүүлийн жилүүдэд мөс эрт хайлах болсон нь уур амьсгалын өөрчлөлттэй холбоотой гэж үздэг.',
  'Хонгорын элс': 'Хонгорын элсийг «Дуут манхан» гэж нэрлэдэг. Салхи салхилах эсвэл хүн манхнаас гулсаж буухад элс нисэх онгоцны хөдөлгүүр мэт гүнгэнэсэн чимээ гаргадаг. Элсний бэлээр Хонгорын гол урсдаг тул говийн дунд ногоон бүс тогтдог.',
  'Баянзаг (Улаан эрэг)': '1920-иод онд Америкийн судлаач Рой Чэпмэн Эндрюсийн экспедиц энд үлэг гүрвэлийн өндгийг дэлхийд анх удаа олж, дэлхий дахинд алдаршуулжээ. Нар жаргахад улаан хадан эрэг гал мэт гэрэлтдэг тул гадаадынхан «Flaming Cliffs» гэж нэрлэдэг. Нэр нь энд ургадаг заг модноос гаралтай.',
  'Цагаан суварга': 'Олон сая жилийн өмнө энэ нутаг далайн ёроол байсан гэж үздэг. Салхи, бороонд элэгдсэн өнгө алаг шохойн хадан эрэг нь холоос эртний хот, суваргын туурь мэт харагддаг тул ийм нэр авчээ. Хадны ирмэг нурамтгай тул захаар нь бүү яв.',
  'Хамарын хийд, Шамбалын орон': 'Хамарын хийдийг 19-р зууны эхээр Говийн догшин ноён хутагт, яруу найрагч Данзанравжаа байгуулжээ. Хийдийн ойролцоох «Шамбалын орон»-ыг олон хүн газрын энергийн төв гэж үзэж, ялангуяа шинэ жилийн өглөө нар угтахаар ирдэг. Данзанравжаагийн бясалгадаг байсан агуйнууд ч ойр бий.',
  'Бурхан Халдун уул': '«Монголын нууц товчоо»-нд өгүүлснээр залуу Тэмүжин дайснаасаа энэ ууланд нуугдаж аврагдсаны дараа уулыг тахиж, үр сад минь мөнхөд тахих болтугай гэж тангарагласан. Өнөө хүртэл Монголын төрийн тахилгат уул бөгөөд ЮНЕСКО-ийн дэлхийн өвд бүртгэгдсэн. Уламжлалаар эмэгтэйчүүд оргилд гардаггүй.',
  'Дэлүүн Болдог (Дадал)': '«Монголын нууц товчоо»-нд Тэмүжин Онон мөрний Дэлүүн болдогт мэндэлсэн гэж өгүүлдэг. Яг хаана байсан талаар судлаачдын санал зөрдөг бөгөөд Хэнтий аймгийн Дадал сум бол хамгийн алдартай хувилбар нь юм. Энд Чингис хааны мэндэлсэн газрын дурсгалын хөшөө бий.',
  'Хөх нуур (Хар зүрхний)': 'Залуу Тэмүжинийг Хар зүрхний Хөх нуурын хөвөөнд хаан ширээнд өргөмжилсөн гэж үздэг. Үүнээс хойш тэрээр Монгол аймгуудыг нэгтгэх замдаа гарчээ. Нуурын орчимд энэ үйл явдлын дурсгалд хөшөө, овоо байдаг.',
  'Чингис хааны морьт хөшөө': 'Домогт өгүүлснээр Чингис хаан Цонжин Болдогт алтан ташуур олсныг сайн ёрын бэлгэ гэж үзжээ. Энэ газарт 2008 онд 40 метр өндөр морьт хөшөө босгосон бөгөөд морины толгойн хэсэгт гарч эргэн тойрныг харж болно.',
  'Хустайн байгалийн цогцолборт газар': 'Тахь буюу Пржевальскийн адуу 20-р зуунд байгальдаа бүрмөсөн устах шахсан. 1990-ээд оноос эхлэн Европын амьтны хүрээлэнгүүдээс авчирч Хустайд нутагшуулснаар өнөөдөр байгальдаа чөлөөтэй амьдарч байна. Тахийг ихэвчлэн өглөө эрт, орой ус уухаар бууж ирэхэд харж болно.',
  'Уушигийн өвөр (буган хөшөө)': 'Энд 3000 гаруй жилийн өмнөх хүрэл зэвсгийн үеийн буган хөшөөнүүд бий. Хөшөөн дээр тэнгэр өөд нисэх мэт сийлсэн буга нь нас барагсдын сүнсийг тэнгэрт хүргэнэ гэсэн бэлгэдэлтэй гэж судлаачид үздэг. Хөшөөнд гар хүрч, авирч болохгүй.',
  'Отгонтэнгэр уул': 'Отгонтэнгэр бол Хангайн нурууны хамгийн өндөр оргил бөгөөд Монголын төрийн тахилгат уул юм. Мөнх цастай оргилыг ард түмэн эрт дээр үеэс шүтэн тахидаг. Уламжлалаар эмэгтэйчүүд оргилд гардаггүй, мөн уулын нэрийг шууд дуудахгүй «Хайрхан» гэж хүндэтгэн нэрлэдэг.',
  'Шилийн Богд уул': 'Шилийн Богд бол унтарсан галт уул бөгөөд оргилоос нар мандахыг угтах нь хамгийн гайхалтай. Уламжлалаар эрэгтэйчүүд үүрээр оргилд гарч уулаа тахьдаг бол эмэгтэйчүүд оргилд гардаггүй. Хилийн бүсэд ойр тул хилийн зөвшөөрөл шаардлагатай эсэхийг урьдчилан лавлаарай.',
  'Дарьганга, Алтан Овоо': 'Алтан Овоо бол Дарьгангын ард түмний тахилгат уул юм. Уламжлалаар зөвхөн эрэгтэйчүүд оргилд гарч тахидаг. Дарьганга нутагт эртний хүн чулуунууд, Ганга нуур, Молцог элс зэрэг үзэсгэлэнт газар олон бий.',
  'Хөвсгөл нуур': 'Хөвсгөл нуурыг «Монголын хөх сувд» гэж нэрлэдэг. Нуурын ус Эг голоор дамжин Сэлэнгэ мөрөнд, улмаар Байгал нуурт цутгадаг. Ус нь маш тунгалаг, хүйтэн бөгөөд өвөл зузаан мөсөөр хучигддаг тул мөсний баяр болдог.',
  'Увс нуур': 'Увс бол Монголын хамгийн том талбайтай нуур бөгөөд давстай. Увс нуурын хотгор нь өндөр уул, тайга, тал, элсэн цөл бүгдийг нэг дор агуулдаг ховор газар тул ЮНЕСКО-ийн дэлхийн өвд бүртгэгдсэн.',
  'Алтай Таван Богдын БЦГ': 'Таван Богд нь Хүйтэн, Найрамдал, Малчин, Бүргэд, Өлгий гэсэн таван оргилоос бүрддэг. Хүйтэн оргил бол Монголын хамгийн өндөр цэг юм. Оргилын бэлээс эхлэх Потанины мөсөн гол нь Монголын хамгийн том мөсөн гол.',
  'Хөгнө Тарнын БЦГ (Хөгнө хан уул)': 'Хөгнө хан ууланд 17-р зуунд Эрдэнэ хамбын хийд байгуулагдсан бөгөөд 1680-аад оны дайнд сүйдсэн гэж ярьдаг. Хожим сэргээн босгосон. Ой, хад, тал, элс бүгд нэг дор оршдог тул «Бяцхан Монгол» гэж ч нэрлэдэг.'
};
let speakingBtn = null;
function decorateLegends() {
  document.querySelectorAll('.place h4').forEach(h => {
    const k = h.textContent.trim(), box = h.parentElement;
    if (!LEGENDS[k] || box.querySelector('.leg')) return;
    const div = document.createElement('div'); div.className = 'leg';
    div.innerHTML = `<button type="button" class="leg-btn">📜 Домог, түүх</button><div class="leg-body" hidden><p>${esc(LEGENDS[k])}</p>
      <button type="button" class="copy leg-play">▶ Сонсох</button><small class="note"> Аман яриа, түүхийг товчлов.</small></div>`;
    div.querySelector('.leg-btn').onclick = () => { const b = div.querySelector('.leg-body'); b.hidden = !b.hidden };
    div.querySelector('.leg-play').onclick = e => speakLegend(k, e.currentTarget);
    box.insertBefore(div, box.querySelector('.tags'));
  });
}
function speakLegend(k, btn) {
  const s = window.speechSynthesis;
  if (!s) { toast('Таны хөтөч дуу уншихыг дэмжихгүй байна'); return }
  if (s.speaking) { s.cancel(); if (speakingBtn) speakingBtn.textContent = '▶ Сонсох'; if (speakingBtn === btn) { speakingBtn = null; return } }
  const u = new SpeechSynthesisUtterance(LEGENDS[k]);
  const vs = s.getVoices(), mn = vs.find(v => /^mn/i.test(v.lang)), ru = vs.find(v => /^ru/i.test(v.lang));
  if (mn) { u.voice = mn; u.lang = mn.lang }
  else if (ru) { u.voice = ru; u.lang = ru.lang; toast('Монгол дуу хоолой олдсонгүй — орос дуудлагаар уншиж байна') }
  else { u.lang = 'mn-MN'; toast('Таны төхөөрөмжид монгол дуу хоолой суугаагүй байж магадгүй') }
  u.rate = 0.95;
  u.onend = u.onerror = () => { btn.textContent = '▶ Сонсох'; if (speakingBtn === btn) speakingBtn = null };
  speakingBtn = btn; btn.textContent = '⏹ Зогсоох'; s.speak(u);
}
if (window.speechSynthesis) speechSynthesis.getVoices();

// ================= 5. Айл буудал, нутгийн бүтээгдэхүүн =================
const HS_OFFERS = [['stay', '🛏️ Айлд хонох'], ['airag', '🥛 Айраг'], ['dairy', '🧀 Ааруул, цагаан идээ'], ['meat', '🥩 Мах, борц'], ['craft', '🧶 Ноос, гар урлал'], ['horse', '🐎 Морь, тэмээ унах']];
const HS = {};
TABS.splice(2, 0, ['homestay', '🐎 Айл буудал']);
const _tabBody = tabBody;
tabBody = function (a, t) {
  if (t === 'homestay') return `<div class="hs-list" data-a="${a.id}"><p class="note">Ачаалж байна…</p></div>
    <button class="btn ghost" onclick="openHsForm('${a.id}')">➕ Айл санал болгох</button>
    <p class="note">Малчин айлд хонох, айраг, ааруул, гар урлал авах боломжтой айлуудыг аялагчид санал болгож, бид шалгаж нийтэлдэг. Очихоосоо өмнө утсаар урьдчилан тохиролцоорой.</p>`;
  return _tabBody(a, t);
};
async function fillHomestays() {
  const els = document.querySelectorAll('.hs-list[data-a]'); if (!els.length) return;
  if (!window.Auth || !Auth.configured) { els.forEach(e => e.innerHTML = '<p class="note">Одоогоор ажиллахгүй байна.</p>'); return }
  for (const el of els) {
    const id = el.dataset.a;
    if (!HS[id]) HS[id] = Auth.listHomestays(id).then(r => r.data || []).catch(() => []);
    const rows = (await HS[id]).filter(r => r.status === 'approved');
    if (!el.isConnected) continue;
    el.innerHTML = rows.length ? `<div class="places">${rows.map(r => `<div class="place"><h4>${esc(r.name)}</h4>
      <p>${r.soum ? esc(r.soum) + ' сум. ' : ''}${esc(r.note || '')}</p>
      <div class="tags">${(r.offers || []).map(o => `<span class="tag car">${(HS_OFFERS.find(x => x[0] === o) || [, o])[1]}</span>`).join('')}${r.season ? `<span class="tag">🗓️ ${esc(r.season)}</span>` : ''}</div>
      <div class="links" style="margin-top:8px">${r.phone ? `<a href="tel:${esc(r.phone.replace(/[^0-9+]/g, ''))}">📞 ${esc(r.phone)}</a>` : ''}${r.fb ? `<a href="${esc(r.fb)}" target="_blank" rel="noopener nofollow">Facebook</a>` : ''}</div></div>`).join('')}</div>`
      : '<p class="note">Энэ аймагт одоогоор бүртгэлтэй айл алга. Мэддэг айл байвал доорх товчоор санал болгоорой.</p>';
  }
}
function openHsForm(aid) {
  const a = A.find(x => x.id === aid);
  if (!Auth.configured) return;
  if (!Auth.user) { openLogin(); toast('Айл санал болгохын тулд нэвтэрнэ үү'); return }
  openModal(`<h3>🐎 Айл санал болгох — ${a.n}</h3>
    <form onsubmit="submitHs(event,'${aid}')">
      <input class="field" id="hsName" maxlength="100" required placeholder="Айлын / газрын нэр (жишээ нь: Бат-Эрдэнийн айл)">
      <input class="field" id="hsSoum" maxlength="60" placeholder="Сум, газрын нэр">
      <input class="field" id="hsPhone" maxlength="40" placeholder="Утас">
      <input class="field" id="hsFb" maxlength="300" placeholder="Facebook холбоос (заавал биш)">
      <div class="hs-offers">${HS_OFFERS.map(([k, l]) => `<label><input type="checkbox" value="${k}"> ${l}</label>`).join('')}</div>
      <input class="field" id="hsSeason" maxlength="60" placeholder="Хэзээ байдаг вэ (жишээ нь: 6–9 сар, зусланд)">
      <textarea class="field" id="hsNote" rows="3" maxlength="600" placeholder="Тайлбар: хаана байдаг, яаж очих, үнэ гэх мэт"></textarea>
      <label class="check" style="font-size:13.5px;display:flex;gap:6px;align-items:flex-start"><input type="checkbox" id="hsConsent" required> Энэ айлын зөвшөөрөлтэйгөөр тэдний мэдээллийг (утас г.м.) нийтэд харуулахаар оруулж байна.</label>
      <div id="hsErr" class="note" style="color:var(--red)"></div>
      <button class="btn wide" type="submit" id="hsBtn">Илгээх</button>
    </form><p class="note">Бид шалгаж баталсны дараа нийтлэгдэнэ.</p>`);
}
async function submitHs(e, aid) {
  e.preventDefault();
  const fb = $('#hsFb').value.trim();
  if (fb && !/^https?:\/\//i.test(fb)) { $('#hsErr').textContent = 'Facebook холбоос https://-ээр эхлэх ёстой.'; return }
  const row = {
    aimag: aid, name: $('#hsName').value.trim(), soum: $('#hsSoum').value.trim() || null, phone: $('#hsPhone').value.trim() || null, fb: fb || null,
    offers: [...document.querySelectorAll('.hs-offers input:checked')].map(i => i.value),
    season: $('#hsSeason').value.trim() || null, note: $('#hsNote').value.trim() || null, consent: $('#hsConsent').checked
  };
  $('#hsBtn').disabled = true;
  const { error } = await Auth.submitHomestay(row);
  if (error) { $('#hsBtn').disabled = false; $('#hsErr').textContent = 'Илгээж чадсангүй: ' + error.message; return }
  delete HS[aid];
  $('#modalBody').innerHTML = '<h3>🙏 Баярлалаа!</h3><p>Санал тань хүлээн авагдлаа. Шалгаж баталсны дараа нийтлэгдэнэ.</p><button class="btn wide" onclick="closeModal()">Хаах</button>';
}

// ================= Холболт =================
function afterRender() {
  wxFillPlan(); wxFillNow(); decorateLegends(); fillHomestays();
}
(function initFeatures() {
  const car = $('#car'), fuel = $('#fuel');
  if (fuel) fuel.addEventListener('change', () => applyFuel(true));
  if (car) car.addEventListener('change', onCarChangeFuel);
  renderFuel();
  render();
  loadFuel();
})();
