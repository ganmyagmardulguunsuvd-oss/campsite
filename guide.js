// «Хаашаа явах вэ?» — зургаар сонгож аялал санал болгох (#7) ба үнэгүй ухаалаг туслах (#15-ийн түр хувилбар).
// app.js-ийн дараа ачаалагдана.

// ---------- Газрын төрлүүд: аймаг бүрийн оноо (0–3) ----------
const CATS = {
  forest:  { n: 'Ой мод, уул', i: '🌲', who: '🌲 Ойн хүн', re: /(^|\s)ой[\s,н]|тайга|БЦГ|Тэрэлж|хан уул|Хөгнө|Бурхан Халдун|Богд уул/i,
    w: { tov: 3, selenge: 2, bulgan: 3, khuvsgul: 3, arkhangai: 2, khentii: 3, zavkhan: 2, uvurkhangai: 2, orkhon: 1, darkhan: 1, govisumber: 1 } },
  lake:    { n: 'Нуур, гол', i: '🌊', who: '🌊 Нуурын хүн', re: /нуур|(^|\s)гол|мөрөн|усан сан|хүрхрээ/i,
    w: { khuvsgul: 3, arkhangai: 3, uvs: 3, khovd: 3, bayanulgii: 2, zavkhan: 2, bayankhongor: 2, dornod: 2, selenge: 2, sukhbaatar: 1, khentii: 1, govialtai: 1, uvurkhangai: 1 } },
  desert:  { n: 'Элсэн манхан, говь', i: '🏜️', who: '🐪 Говийн адал явдалт', re: /элс|говь|манхан|Баянзаг|суварга|Хэрмэн цав|Ёлын ам/i,
    w: { umnugovi: 3, dundgovi: 3, dornogovi: 2, bulgan: 2, uvs: 2, bayankhongor: 2, govialtai: 2, sukhbaatar: 2, govisumber: 1, khovd: 1 } },
  steppe:  { n: 'Тал, хангайн хөндий', i: '🐎', who: '🐎 Тал нутгийн хүн', re: /(^|\s)тал|хөндий|Тайхар/i,
    w: { arkhangai: 3, uvurkhangai: 3, dornod: 3, khentii: 2, bulgan: 2, tov: 2, sukhbaatar: 2, govisumber: 2, darkhan: 1, zavkhan: 1 } },
  snow:    { n: 'Мөнх цаст оргил', i: '🏔️', who: '🏔️ Оргилын анчин', re: /оргил|мөсөн|мөнх цаст|Таван Богд|Отгонтэнгэр|Сутай|Цамбагарав|Хархираа/i,
    w: { bayanulgii: 3, khovd: 2, uvs: 2, zavkhan: 2, govialtai: 2 } },
  history: { n: 'Түүх, соёл, хийд', i: '📜', who: '📜 Түүхч аялагч', re: /хийд|музей|хөшөө|туурь|балгас|хэрэм|Хархорум|дурсгал|агуй|Чингис|Шамбал/i,
    w: { uvurkhangai: 3, selenge: 3, khentii: 3, dornogovi: 3, tov: 2, dornod: 2, khuvsgul: 1, orkhon: 1, bulgan: 1, arkhangai: 1, khovd: 1 } },
  hotspring: { n: 'Рашаан, амралт', i: '♨️', who: '♨️ Амрах дуртай', re: /рашаан|сувилал/i,
    w: { arkhangai: 3, uvurkhangai: 2, bayankhongor: 2, zavkhan: 1, uvs: 1 } },
  nomad:   { n: 'Нүүдэлчин соёл, амьтан', i: '🦅', who: '🦅 Нүүдэлчин сэтгэлт', re: /Цаатан|бүргэд|тахь|зээр|тэмээ|Хустай|айл/i,
    w: { bayanulgii: 3, khuvsgul: 3, umnugovi: 2, tov: 2, dornod: 2, arkhangai: 1 } }
};
// Зургууд: Wikimedia Commons-ийн чөлөөт лицензтэй зураг. Зохиогч, лицензийг Commons-оос шууд татаж дор нь заана.
// Зураг ачаалагдахгүй бол дүрс (emoji) харагдана. Дараа нь өөрсдийн зургаар солиход src-г шууд бичиж болно.
const CAT_FILES = {
  forest: 'HuvsgulAutumn.jpg', lake: 'Lake Khövsgöl, Mongolia.jpg', desert: 'Khongoryn Els sand dunes.jpg',
  steppe: 'Nomadic herders of Mongolia (25156748707).jpg', snow: 'Tavan Bogd Mountains.jpg', history: 'Holy wall (48984667297).jpg',
  hotspring: 'Shagrljuut hot spring resort of Mongolia.jpg', nomad: 'Kazakh Eagle Hunter with Golden Eagle in Bayan Olgii region, Mongolia.jpg'
};
const CAT_PHOTO = {};
let catPhotoLoading = null;
function loadCatPhotos() {
  if (catPhotoLoading) return catPhotoLoading;
  try { const c = JSON.parse(localStorage.getItem('cs_cat_photos2') || 'null'); if (c && Date.now() - c.t < 7 * 864e5) { Object.assign(CAT_PHOTO, c.p); return catPhotoLoading = Promise.resolve() } } catch (e) { }
  const strip = h => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640&titles=' +
    encodeURIComponent(Object.values(CAT_FILES).map(f => 'File:' + f).join('|'));
  return catPhotoLoading = fetch(url).then(r => r.json()).then(j => {
    const byTitle = {};
    Object.values((j.query && j.query.pages) || {}).forEach(pg => { const ii = pg.imageinfo && pg.imageinfo[0]; if (ii) byTitle[pg.title.replace(/^File:/, '')] = ii });
    const norm = s => s.replace(/_/g, ' ').normalize('NFC');
    Object.entries(CAT_FILES).forEach(([c, f]) => {
      const ii = byTitle[norm(f)] || Object.entries(byTitle).find(([t]) => norm(t) === norm(f))?.[1]; if (!ii) return;
      const m = ii.extmetadata || {};
      CAT_PHOTO[c] = { src: ii.thumburl || ii.url, page: ii.descriptionurl, by: strip(m.Artist && m.Artist.value).slice(0, 60) || 'Wikimedia Commons', lic: strip(m.LicenseShortName && m.LicenseShortName.value) || 'Commons' };
    });
    try { localStorage.setItem('cs_cat_photos2', JSON.stringify({ t: Date.now(), p: CAT_PHOTO })) } catch (e) { }
  }).catch(e => console.warn('photos', e));
}
const QUIZ_STEPS = [['forest', 'lake', 'desert', 'steppe', 'snow'], ['history', 'hotspring', 'nomad']];

// ---------- Санал гаргах хөдөлгүүр ----------
const CAR_L = { sedan: 9, '4x4': 13, none: 0 };
function aimagFit(a, p) {
  const se = p.season || curSeason();
  const carOk = x => p.car !== 'sedan' || x[3] === 'car';
  const good = a.p.filter(x => carOk(x) && inSeason(x, se));
  let s = 0;
  const cats = p.cats.length ? p.cats : Object.keys(CATS);
  cats.forEach(c => { s += (CATS[c].w[a.id] || 0) * (p.cats.length ? 1 : 0.35) });
  s += Math.min(good.length, 4) * 0.35;
  if (!good.length) s -= 3;
  if (p.car === 'none' && !(a.rail || a.air) && a.km > 500) s -= 2;
  if (p.kids && a.km > 700) s -= 1;
  if (eventsFor(a, se).some(e => e.a !== '*')) s += 0.8;
  if (p.must && p.must.includes(a.id)) s += 6;
  return { s, good };
}
function tripOf(ids, p) {
  const perday = +($('#perday') && $('#perday').value) || 400, ret = true;
  let rest = ids.map(byId), cur = UB, out = [];
  while (rest.length) { rest.sort((x, y) => road(cur, x) - road(cur, y)); cur = rest.shift(); out.push(cur) }
  let km = 0, drive = 0, prev = UB;
  const legs = [...out, ...(ret ? [UB] : [])];
  legs.forEach(x => { const d = road(prev, x); km += d; drive += d <= perday * 1.25 ? 1 : Math.ceil(d / perday); prev = x });
  // Ойр аймгийн буцах замыг үзэх өдрийн оройд багтаана
  if (out.length === 1 && out[0].km <= 250) drive -= 1;
  const fits = out.map(a => aimagFit(a, p));
  const sMin = out.length, sMax = fits.reduce((n, f) => n + (f.good.length >= 4 ? 2 : 1), 0);
  let sight = sMax;
  if (p.days) sight = Math.max(sMin, Math.min(sMax, p.days - drive));
  return { route: out, km, drive, days: Math.max(1, drive + sight), fits, sd: sight === sMin ? '1' : 'auto' };
}
function suggest(p, n = 3) {
  const pool = A.filter(a => !p.region || a.reg === p.region || (p.must || []).includes(a.id));
  const base = Object.fromEntries(pool.map(a => [a.id, aimagFit(a, p).s]));
  const top = pool.slice().sort((x, y) => base[y.id] - base[x.id]).slice(0, 12).map(a => a.id);
  (p.must || []).forEach(id => { if (!top.includes(id)) top.push(id) });
  const cands = [];
  const maxSize = p.car === 'none' ? 2 : 3;
  for (let i = 0; i < top.length; i++) {
    cands.push([top[i]]);
    for (let j = i + 1; j < top.length; j++) {
      if (maxSize >= 2) cands.push([top[i], top[j]]);
      if (maxSize >= 3) for (let k = j + 1; k < top.length; k++) cands.push([top[i], top[j], top[k]]);
    }
  }
  const L = CAR_L[p.car] ?? 13, price = +($('#price') && $('#price').value) || 3600;
  const scored = [];
  for (const ids of cands) {
    if (p.must && p.must.length && !p.must.every(m => ids.includes(m))) continue;
    const t = tripOf(ids, p);
    t.fuel = Math.round(t.km * L / 100 * price / 1000) * 1000;
    if (p.days && t.days > p.days) continue;
    if (p.budget && L && t.fuel > p.budget) continue;
    if (p.car === 'none' && t.km > 1600 && !t.route.every(a => a.air)) continue;
    const fit = t.fits.reduce((s, f) => s + f.s, 0);
    // Нэмэлт аймаг бүр оноогоо «зарах» ёстой
    const weakest = Math.min(...t.fits.map(f => f.s));
    let score = fit - t.drive * 0.9 - (ids.length > 1 && weakest < 1.5 ? 2 : 0);
    if (p.days) score -= Math.max(0, p.days - t.days) * 0.35;
    t.score = score; t.ids = ids;
    scored.push(t);
  }
  scored.sort((a, b) => b.score - a.score);
  const picked = [];
  for (const t of scored) {
    const set = new Set(t.ids);
    if (picked.some(q => { const inter = q.ids.filter(x => set.has(x)).length; return inter / new Set([...q.ids, ...t.ids]).size >= 0.5 })) continue;
    picked.push(t); if (picked.length >= n) break;
  }
  return picked;
}
function themeOf(t, p) {
  const cats = p.cats.length ? p.cats : Object.keys(CATS);
  let best = cats[0], bv = -1;
  cats.forEach(c => { const v = t.route.reduce((s, a) => s + (CATS[c].w[a.id] || 0), 0); if (v > bv) { bv = v; best = c } });
  return best;
}
function highlights(t, p) {
  const cats = p.cats.length ? p.cats : null, out = [];
  t.route.forEach((a, i) => t.fits[i].good.forEach(x => {
    const txt = x[0] + ' ' + x[1];
    if (!cats || cats.some(c => CATS[c].re.test(txt))) out.push(`${x[0]} <small>(${a.n})</small>`);
  }));
  if (!out.length) t.route.forEach((a, i) => t.fits[i].good.slice(0, 2).forEach(x => out.push(`${x[0]} <small>(${a.n})</small>`)));
  return out.slice(0, 5);
}
function suggestionCard(t, p, i) {
  const th = CATS[themeOf(t, p)], hl = highlights(t, p), ppl = p.people || 1;
  return `<div class="sg-card">
    <div class="sg-head"><span class="sg-n">${i + 1}</span><div><b>${th.i} ${t.route.map(a => a.n).join(' → ')}</b>
      <div class="sg-meta">${t.days} өдөр · ~${fmt(t.km)} км${t.fuel ? ` · шатахуун ~${fmt(t.fuel)}₮${ppl > 1 ? ` (нэг хүнд ~${fmt(Math.round(t.fuel / ppl / 1000) * 1000)}₮)` : ''}` : ''}</div></div></div>
    ${hl.length ? `<ul class="sg-hl">${hl.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
    <button class="btn wide" onclick='applySuggestion(${JSON.stringify(t.ids)},${JSON.stringify({ car: p.car, season: p.season || null, sd: t.sd })})'>🗺️ Энэ маршрутаар төлөвлөх</button>
  </div>`;
}
function applySuggestion(ids, o) {
  sel = ids.filter(id => A.some(a => a.id === id)); save();
  if (o && o.car === 'sedan') $('#car').value = '9'; else if (o && o.car === '4x4') $('#car').value = '13';
  if (o && o.season) $('#season').value = o.season;
  if (o && o.sd) $('#sdays').value = o.sd;
  $('#ret').checked = true;
  if (window.onCarChangeFuel) onCarChangeFuel();
  if (location.hash && location.hash !== '#') location.hash = '';
  render();
  setTimeout(() => { const pb = $('#planbox'); if (pb) pb.scrollIntoView({ behavior: 'smooth' }) }, 120);
  toast('🗺️ Маршрут бэлэн боллоо');
}

// ---------- Зургаар сонгох тест ----------
const Q = { step: 0, cats: [], days: null, people: 2, season: null, car: '4x4', budget: null };
function photoCard(c, on) {
  const ph = CAT_PHOTO[c] || {}, C = CATS[c];
  return `<button type="button" class="qz-card ${on ? 'on' : ''}" onclick="qzToggle('${c}')" aria-pressed="${on}">
    <span class="qz-img" ${ph.src ? `style="background-image:url('${esc(ph.src)}')"` : ''}>${ph.src ? '' : `<span class="qz-emoji">${C.i}</span>`}</span>
    <span class="qz-lbl">${C.i} ${C.n}</span><span class="qz-check">✓</span></button>`;
}
function credits(cs) {
  const list = cs.map(c => CAT_PHOTO[c]).filter(x => x && x.src && x.by);
  return list.length ? `<p class="note qz-credit">Зураг: ${list.map(x => `<a href="${esc(x.page)}" target="_blank" rel="noopener">${esc(x.by)}</a> (${esc(x.lic)})`).join(' · ')} — Wikimedia Commons</p>` : '';
}
function chipRow(key, opts) {
  return `<div class="qz-chips">${opts.map(([v, l]) => `<button type="button" class="chip ${String(Q[key]) === String(v) ? 'on' : ''}" onclick="qzSet('${key}',${JSON.stringify(v).replace(/"/g, '&quot;')})">${l}</button>`).join('')}</div>`;
}
function renderQuiz() {
  const el = $('#view'); if (!el) return;
  if (!catPhotoLoading) loadCatPhotos().then(() => { if (location.hash.startsWith('#guide') && Q.step < 2) renderQuiz() });
  let body;
  if (Q.step < 2) {
    const cs = QUIZ_STEPS[Q.step];
    body = `<h2>🎯 Хаашаа явахаа мэдэхгүй байна уу?</h2>
      <p class="qz-q">${Q.step === 0 ? '1/3. Аль нь илүү таалагдаж байна? <small>(хэдийг ч сонгож болно)</small>' : '2/3. Аялалдаа юу мэдэрмээр байна? <small>(сонгохгүй ч болно)</small>'}</p>
      <div class="qz-grid">${cs.map(c => photoCard(c, Q.cats.includes(c))).join('')}</div>
      ${credits(cs)}
      <div class="qz-nav">${Q.step ? '<button class="btn ghost" onclick="qzGo(-1)">← Буцах</button>' : '<button class="btn ghost" onclick="qzRandom()">🎲 Санамсаргүй аялал</button>'}
      <button class="btn" onclick="qzGo(1)">Дараах →</button></div>`;
  } else if (Q.step === 2) {
    body = `<h2>🎯 Хаашаа явах вэ?</h2><p class="qz-q">3/3. Аяллынхаа талаар</p>
      <div class="qz-form">
        <label>Хэдэн хоног?</label>${chipRow('days', [[3, '2–3 хоног'], [5, '4–5 хоног'], [8, '6–8 хоног'], [14, '9+ хоног'], [null, 'Хамаагүй']])}
        <label>Хэдэн хүн?</label>${chipRow('people', [[1, '1'], [2, '2'], [4, '3–4'], [6, '5+']])}
        <label>Хэзээ?</label>${chipRow('season', [[null, 'Удахгүй'], ['summer', '☀️ Зун'], ['autumn', '🍂 Намар'], ['winter', '❄️ Өвөл'], ['spring', '🌱 Хавар']])}
        <label>Ямар машинаар?</label>${chipRow('car', [['sedan', '🚗 Суудлын'], ['4x4', '🚙 Жийп / 4x4'], ['none', '🚌 Машингүй']])}
        <label>Шатахууны төсөв</label>${chipRow('budget', [[300000, '300 мянга хүртэл'], [600000, '600 мянга хүртэл'], [1000000, '1 сая хүртэл'], [null, 'Хамаагүй']])}
      </div>
      <div class="qz-nav"><button class="btn ghost" onclick="qzGo(-1)">← Буцах</button><button class="btn" onclick="qzGo(1)">✨ Санал харах</button></div>`;
  } else {
    const p = { cats: Q.cats, days: Q.days, people: Q.people, season: Q.season, car: Q.car, budget: Q.car === 'none' ? null : Q.budget };
    const res = suggest(p);
    const main = Q.cats.length ? CATS[Q.cats[0]] : null;
    window._qzWho = main ? main.who : '🧭 Бүх юмыг үзэх дуртай аялагч';
    body = `<h2>✨ Танд санал болгох аялал</h2>
      <div class="qz-who">Таны аяллын төрөл: <b>${window._qzWho}</b> <button class="copy" onclick="qzShare()">📤 Хуваалцах</button></div>
      ${res.length ? `<div class="sg-list">${res.map((t, i) => suggestionCard(t, p, i)).join('')}</div>`
        : '<div class="warn">Энэ нөхцөлд тохирох маршрут олдсонгүй. Хоног эсвэл төсвөө нэмээд үзээрэй.</div>'}
      <p class="note">Хоног, зай, шатахуун ойролцоо тооцоо. «Энэ маршрутаар төлөвлөх» дарахад өдөр бүрийн хөтөлбөр гарна.</p>
      <div class="qz-nav"><button class="btn ghost" onclick="qzReset()">↺ Дахин эхлэх</button><button class="btn ghost" onclick="qzRandom()">🎲 Санамсаргүй аялал</button></div>`;
  }
  el.innerHTML = `<section class="card qz">${body}</section>`;
}
function qzToggle(c) { Q.cats = Q.cats.includes(c) ? Q.cats.filter(x => x !== c) : [...Q.cats, c]; renderQuiz() }
function qzSet(k, v) { Q[k] = v; renderQuiz() }
function qzGo(d) {
  if (d > 0 && Q.step === 0 && !Q.cats.some(c => QUIZ_STEPS[0].includes(c))) { toast('Дор хаяж нэг зураг сонгоорой'); return }
  Q.step = Math.max(0, Math.min(3, Q.step + d)); renderQuiz(); window.scrollTo({ top: 0, behavior: 'smooth' });
}
function qzReset() { Object.assign(Q, { step: 0, cats: [], days: null, people: 2, season: null, car: '4x4', budget: null }); renderQuiz() }
function qzRandom() {
  const keys = Object.keys(CATS), pick = keys.sort(() => Math.random() - .5).slice(0, 2);
  Object.assign(Q, { step: 3, cats: pick, days: [3, 5, 8][Math.floor(Math.random() * 3)] });
  renderQuiz(); toast('🎲 ' + pick.map(c => CATS[c].n).join(' + '));
}
function qzShare() {
  const url = location.origin + location.pathname + '#guide';
  const txt = `Миний аяллын төрөл: ${window._qzWho}! Чиний аяллын төрөл юу вэ? 👉`;
  if (navigator.share) navigator.share({ text: txt, url }).catch(() => {}); else copyText(txt + ' ' + url);
}

// ---------- Үнэгүй ухаалаг туслах (бичсэн хүсэлтийг ойлгож маршрут санал болгох) ----------
const HELPER = { msgs: [] };
const KW = {
  lake: /нуур|\sгол[\sдын]|голын|мөрөн|загас|усанд орох|далай/i, forest: /\sой[\sдн]|\sойтой|\sмод|тайга|хангай|сэрүүн/i, desert: /элс|говь|манхан|тэмээ|цөл/i,
  steppe: /\sтал[\sдын]|\sталд|хөндий|морь/i, snow: /оргил|мөсөн|мөнх цас|цаст|авир/i,
  history: /түүх|хийд|музей|хөшөө|туурь|чингис|соёл|сүм/i, hotspring: /рашаан|халуун ус|сувилал|спа\b/i,
  nomad: /бүргэд|цаа буга|цаатан|нүүдэл|малчин|айлд|тахь/i
};
function parseRequest(t) {
  const s = ' ' + t.toLowerCase() + ' ', p = { cats: [], must: [] };
  let m;
  if ((m = s.match(/(\d{1,2})\s*(?:-|–|аас|оос)?\s*(?:\d{1,2}\s*)?(хоног|өдөр|шөнө)/))) p.days = +m[1] + (m[2] === 'шөнө' ? 1 : 0);
  else if (/долоо хоног/.test(s)) p.days = 7; else if (/амралтын өдөр|бямба|weekend/.test(s)) p.days = 2;
  if ((m = s.match(/(\d{1,2})\s*(хүн)/))) p.people = +m[1];
  if (/гэр бүл|хүүхэд/.test(s)) { p.kids = /хүүхэд/.test(s); p.people = p.people || 4 }
  Object.keys(KW).forEach(c => { if (KW[c].test(s)) p.cats.push(c) });
  if (/өвөл|өвлийн|цас/.test(s)) p.season = 'winter'; else if (/хавар/.test(s)) p.season = 'spring';
  else if (/намар/.test(s)) p.season = 'autumn'; else if (/зун|наадам/.test(s)) p.season = 'summer';
  if ((m = s.match(/(\d{1,2})\s*(?:-р|дугаар)?\s*сар/))) p.season = monthSeason(+m[1]);
  if (/суудлын|седан|приус|prius|жижиг машин/.test(s)) p.car = 'sedan';
  else if (/жийп|4x4|4х4|ланд|офф|offroad|хүнд зам/.test(s)) p.car = '4x4';
  else if (/машингүй|автобус|галт тэрэг|онгоц|нийтийн тээвр/.test(s)) p.car = 'none';
  if ((m = s.match(/(\d+(?:[.,]\d+)?)\s*(сая|мянга|мянган|k|₮|төгрөг)/))) {
    const v = parseFloat(m[1].replace(',', '.')); p.budget = m[2] === 'сая' ? v * 1e6 : /мянга|k/.test(m[2]) ? v * 1e3 : v;
    if (p.budget < 20000) delete p.budget;
  }
  const flat = s.replace(/-/g, '');
  A.forEach(a => {
    const nm = a.n.toLowerCase().replace(/-/g, '');
    const re = nm === 'төв' ? /\sтөв(\s|д\s|ийн|\b)/ : new RegExp('\\s' + nm);
    if (re.test(flat)) p.must.push(a.id);
  });
  if (/баруун/.test(s)) p.region = 'Баруун бүс'; else if (/зүүн/.test(s)) p.region = 'Зүүн бүс'; else if (/говь|өмнө/.test(s) && !p.must.length) p.region = null;
  if (/ойр|ойрхон|ойрын/.test(s) && !p.days) p.days = 3;
  return p;
}
function understood(p) {
  const bits = [];
  if (p.days) bits.push(`${p.days} хоног`);
  if (p.people) bits.push(`${p.people} хүн`);
  if (p.cats.length) bits.push(p.cats.map(c => CATS[c].i + ' ' + CATS[c].n.toLowerCase()).join(', '));
  if (p.must.length) bits.push(p.must.map(id => byId(id).n).join(', '));
  if (p.season) bits.push(SEASONS[p.season].i + ' ' + SEASONS[p.season].n.toLowerCase());
  if (p.car) bits.push({ sedan: '🚗 суудлын машин', '4x4': '🚙 жийп', none: '🚌 машингүй' }[p.car]);
  if (p.budget) bits.push(`төсөв ${fmt(p.budget)}₮`);
  if (p.region) bits.push(p.region.toLowerCase());
  return bits;
}
function helperAnswer(text) {
  const p = parseRequest(text);
  p.car = p.car || '4x4';
  const bits = understood(p);
  if (!p.cats.length && !p.must.length && !p.days && !p.season) {
    return `Ямар аялал хүсэж байгаагаа арай дэлгэрэнгүй бичээрэй. Жишээ нь хэдэн хоног, ямар газар (нуур, говь, ой, түүхэн газар), ямар машинтай, хэзээ гэх мэт.
      <div class="hp-sugg">${['3 хоног нуур үзмээр байна', 'Говь руу 5 хоног жийптэй', 'Өвөл хаашаа явах вэ?', 'Гэр бүлээрээ 4 хоног рашаан'].map(x => `<button class="chip" onclick="helperAsk(this.textContent)">${x}</button>`).join('')}</div>`;
  }
  const res = suggest(p);
  const head = `Ойлгосноор: <b>${bits.join(' · ')}</b>.`;
  if (!res.length) return `${head}<br>Энэ нөхцөлд багтах маршрут олдсонгүй 😕 Хоногоо нэмэх эсвэл төсвөө өөрчлөөд дахин бичээрэй.`;
  const tip = p.season === 'winter' ? '<p class="note">❄️ Өвөл хүйтэн, зам мөстэй. Хоёр машинаар явж, дулаан хувцас авч яваарай.</p>'
    : p.car === 'sedan' ? '<p class="note">🚗 Суудлын машинд тохирох газруудыг л сонгосон. Шороон зам руу орох газрууд хасагдсан.</p>' : '';
  return `${head} Танд ${res.length} санал байна:<div class="sg-list">${res.map((t, i) => suggestionCard(t, p, i)).join('')}</div>${tip}`;
}
function renderHelper() {
  const el = $('#view'); if (!el) return;
  el.innerHTML = `<section class="card hp">
    <h2>💬 Аяллын туслах</h2>
    <p class="note" style="margin-top:-6px">Ямар аялал хүсэж байгаагаа энгийнээр бичээрэй. Жишээ нь: «Гэр бүлээрээ 4 хоног, суудлын машинтай нуур үзмээр байна».</p>
    <div class="hp-log" id="hpLog">${HELPER.msgs.length ? HELPER.msgs.map(m => `<div class="hp-msg ${m.r}">${m.h}</div>`).join('') :
      `<div class="hp-msg bot">Сайн байна уу! 👋 Би 21 аймгийн мэдээлэл дээр тулгуурлан танд маршрут санал болгоно. Юу сонирхож байна?
       <div class="hp-sugg">${['3 хоног нуур үзмээр байна', 'Говь руу 5 хоног жийптэй', 'Өвөл хаашаа явах вэ?', 'Гэр бүлээрээ 4 хоног рашаан', 'Түүхэн газрууд 2 хоног'].map(x => `<button class="chip" onclick="helperAsk(this.textContent)">${x}</button>`).join('')}</div></div>`}</div>
    <form class="hp-form" onsubmit="event.preventDefault();helperAsk($('#hpIn').value)">
      <input class="field" id="hpIn" maxlength="300" placeholder="Жишээ: 5 хоног, говь, тэмээ унамаар байна" autocomplete="off">
      <button class="btn" type="submit">Илгээх</button></form>
    <p class="note">Энэ туслах таны бичсэн үгнээс хоног, газрын төрөл, улирал, машин, төсвийг таньж сайтын өгөгдлөөс маршрут санал болгоно.</p>
  </section>`;
  const log = $('#hpLog'); log.scrollTop = log.scrollHeight;
}
function helperAsk(t) {
  t = String(t || '').trim(); if (!t) return;
  HELPER.msgs.push({ r: 'me', h: esc(t) }, { r: 'bot', h: helperAnswer(t) });
  if (HELPER.msgs.length > 30) HELPER.msgs.splice(0, HELPER.msgs.length - 30);
  renderHelper();
  const i = $('#hpIn'); if (i) i.focus();
}
