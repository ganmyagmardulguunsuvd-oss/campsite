// Хэрэглэгчдийн хэсэг: цэс ба хуудаснууд, @нэр, замын мэдээ (#11), кемп (#6), аяллын түүх (#8).
// app.js, features.js, guide.js-ийн дараа ачаалагдана.

// ================= Нийтлэг =================
const aimagName = id => (A.find(a => a.id === id) || { n: id }).n;
const SITE_URL = () => location.origin + location.pathname;
function ago(t) {
  const m = Math.round((Date.now() - new Date(t)) / 6e4);
  if (m < 2) return 'саяхан'; if (m < 60) return `${m} минутын өмнө`;
  const h = Math.round(m / 60); if (h < 24) return `${h} цагийн өмнө`;
  const d = Math.round(h / 24); if (d < 31) return `${d} өдрийн өмнө`;
  return new Date(t).toLocaleDateString();
}
const safeUrl = u => /^https?:\/\//i.test(u || '') ? esc(u) : '#';
function needUser(msg) {
  if (!window.Auth || !Auth.configured) { toast('Одоогоор ажиллахгүй байна'); return false }
  if (!Auth.user) { openLogin(); toast(msg || 'Эхлээд нэвтэрнэ үү'); return false }
  return true;
}
function needUsername(then, msg) {
  if (!needUser(msg)) return false;
  if (Auth.username) return true;
  window._afterUsername = then; openUsernameForm(); return false;
}
function openUsernameForm() {
  const sug = (Auth.user.email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '').slice(0, 20);
  openModal(`<h3>👤 Хэрэглэгчийн нэрээ сонгоно уу</h3>
    <p class="note" style="margin-top:0">Таны түүх, сэтгэгдэл, мэдээлэл <b>@нэр</b>-ээр харагдана. Имэйл тань нууц хэвээр үлдэнэ.</p>
    <form onsubmit="saveUsername(event)"><div class="un-row"><span>@</span><input class="field" id="unIn" maxlength="20" value="${esc(sug.length >= 3 ? sug : '')}" placeholder="жишээ: bat_aylagch" autocomplete="off" required></div>
    <div class="note">Латин жижиг үсэг, тоо, «_» «.» — 3–20 тэмдэгт. <b>Дараа нь солих боломжгүй.</b></div>
    <div id="unMsg" class="note" style="color:var(--red)"></div>
    <button class="btn wide" type="submit" id="unBtn">Хадгалах</button></form>`);
}
async function saveUsername(e) {
  e.preventDefault();
  const v = $('#unIn').value.trim().toLowerCase(), m = $('#unMsg');
  if (!/^[a-z0-9_.]{3,20}$/.test(v)) { m.textContent = 'Зөвхөн латин жижиг үсэг (a–z), тоо, «_», «.» ашиглана. 3–20 тэмдэгт.'; return }
  $('#unBtn').disabled = true;
  const { error } = await Auth.setUsername(v);
  $('#unBtn').disabled = false;
  if (error) { m.textContent = /TAKEN/.test(error.message) ? 'Энэ нэрийг өөр хүн авсан байна. Өөр нэр сонгоно уу.' : /SET/.test(error.message) ? 'Та нэрээ аль хэдийн сонгосон байна.' : error.message; return }
  closeModal(); toast('✅ @' + v + ' — тавтай морил!');
  const f = window._afterUsername; window._afterUsername = null; if (typeof f === 'function') f();
}
function reportItem(type, id) {
  if (!needUser('Мэдээлэхийн тулд нэвтэрнэ үү')) return;
  openModal(`<h3>🚩 Мэдээлэх</h3><form onsubmit="sendReport(event,'${type}','${id}')">
    <select class="field" id="rpWhy"><option>Спам, зар сурталчилгаа</option><option>Буруу, хуурамч мэдээлэл</option><option>Доромжилсон, зохисгүй агуулга</option><option>Хүний хувийн мэдээлэл</option><option>Зохиогчийн эрх зөрчсөн зураг</option><option>Бусад</option></select>
    <input class="field" id="rpNote" maxlength="200" placeholder="Нэмэлт тайлбар (заавал биш)">
    <button class="btn wide" type="submit">Илгээх</button></form>`);
}
async function sendReport(e, type, id) {
  e.preventDefault();
  const { error } = await Auth.report(type, id, ($('#rpWhy').value + ' ' + $('#rpNote').value).trim());
  closeModal(); toast(error ? 'Алдаа: ' + error.message : '🙏 Баярлалаа, бид шалгана');
}
// Зургийг шахаж, GPS зэрэг мета өгөгдлийг арилгана (canvas-аар дахин зурахад EXIF устдаг)
function compressImage(file, max = 1600, q = 0.82) {
  return new Promise((res, rej) => {
    if (!/^image\//.test(file.type)) return rej(new Error('Зөвхөн зураг оруулна уу'));
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      c.toBlob(b => b ? res(b) : rej(new Error('Зураг хөрвүүлж чадсангүй')), 'image/jpeg', q);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Зургийг уншиж чадсангүй (HEIC бол JPG болгоод оруулна уу)')) };
    img.src = url;
  });
}
async function uploadPhoto(file, folder) {
  const blob = await compressImage(file);
  if (blob.size > 2 * 1024 * 1024) throw new Error('Зураг хэт том байна');
  const { data, error } = await Auth.upload(blob, folder);
  if (error) throw error;
  return data;
}
function aimagOptions(selId, any) {
  return (any ? `<option value="">${any}</option>` : '') + REGIONS.map(r => `<optgroup label="${r}">${A.filter(a => a.reg === r).map(a => `<option value="${a.id}" ${a.id === selId ? 'selected' : ''}>${a.n}</option>`).join('')}</optgroup>`).join('');
}
function getGPS(btn, cb) {
  if (!navigator.geolocation) { toast('Байршил тогтоох боломжгүй'); return }
  const o = btn.textContent; btn.textContent = '📍 Тогтоож байна…'; btn.disabled = true;
  navigator.geolocation.getCurrentPosition(p => { btn.disabled = false; btn.textContent = `📍 ${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)} ✓`; cb(p.coords.latitude, p.coords.longitude) },
    () => { btn.disabled = false; btn.textContent = o; toast('Байршил олдсонгүй') }, { enableHighAccuracy: true, timeout: 20000 });
}

// ================= Цэс ба хуудас солих =================
const VIEWS = {};
function router() {
  const h = decodeURIComponent(location.hash.slice(1)), [name, arg] = h.split('/');
  const planner = $('#planner'), view = $('#view');
  document.querySelectorAll('.topnav a').forEach(a => a.classList.toggle('on', (a.getAttribute('href').slice(1) || 'plan') === ((VIEWS[name] && name) || 'plan') ||
    (a.getAttribute('href') === '#stories' && ['story', 'write', 'u', 'mine'].includes(name)) || (a.getAttribute('href') === '#camps' && name === 'camp')));
  if (!VIEWS[name]) { if (view.hidden) return; view.hidden = true; planner.hidden = false; view.innerHTML = ''; return }
  planner.hidden = true; view.hidden = false;
  view.innerHTML = '<div class="card empty">Ачаалж байна…</div>';
  if (!['guide', 'helper'].includes(name) && !(window.Auth && Auth.configured)) { view.innerHTML = '<div class="card empty">Энэ хэсэг одоогоор ажиллахгүй байна.</div>'; return }
  window.scrollTo({ top: 0 });
  Promise.resolve(VIEWS[name](arg)).catch(e => { view.innerHTML = `<div class="card empty">Алдаа гарлаа: ${esc(e.message || e)}</div>` });
}
VIEWS.guide = () => renderQuiz();
VIEWS.helper = () => renderHelper();
window.addEventListener('hashchange', router);

// ================= Замын мэдээ (#11) =================
const ROAD_KINDS = { flood: ['🌊', 'Үер, гол халисан'], bridge: ['🌉', 'Гүүр эвдэрсэн'], mud: ['🟤', 'Шавар, намаг'], snow: ['❄️', 'Цас, мөс, шуурга'],
  closed: ['⛔', 'Зам хаалттай'], nofuel: ['⛽', 'Шатахуун дууссан'], works: ['🚧', 'Засвар, тойруу зам'], other: ['⚠️', 'Бусад'] };
let ROADS = null, ROAD_VOTES = {};
async function loadRoads(force) {
  if (!window.Auth || !Auth.configured) return [];
  if (ROADS && !force) return ROADS;
  const { data } = await Auth.listRoads(); ROADS = data || [];
  ROAD_VOTES = {}; const v = await Auth.myRoadVotes(); (v.data || []).forEach(x => ROAD_VOTES[x.report_id] = x.vote);
  return ROADS;
}
const roadsFor = id => (ROADS || []).filter(r => r.aimag === id);
function roadCard(r, showAimag) {
  const [ic, lb] = ROAD_KINDS[r.kind] || ROAD_KINDS.other, old = Date.now() - new Date(r.last_confirmed_at) > 3 * 864e5, my = ROAD_VOTES[r.id];
  return `<div class="road ${old ? 'old' : ''}" data-id="${r.id}">
    <div class="road-h"><span class="road-ic">${ic}</span><div><b>${lb}</b> — ${esc(r.place)}${showAimag ? ` <span class="tag">${aimagName(r.aimag)}</span>` : ''}
      <div class="road-meta">${ago(r.created_at)}${r.author ? ' · @' + esc(r.author) : ''}${r.confirms ? ` · 👍 ${r.confirms} хүн баталсан` : ''}${old ? ' · <i>хуучирсан байж магадгүй</i>' : ''}</div></div></div>
    ${r.note ? `<p>${esc(r.note)}</p>` : ''}
    <div class="road-act"><button class="copy ${my === 'still' ? 'on' : ''}" onclick="roadVote('${r.id}','still')">👍 Одоо ч байна</button>
      <button class="copy ${my === 'gone' ? 'on' : ''}" onclick="roadVote('${r.id}','gone')">✅ Арилсан</button>
      ${r.lat ? `<a class="copy" href="https://maps.google.com/?q=${r.lat},${r.lng}" target="_blank" rel="noopener">🗺️ Байршил</a>` : ''}
      ${Auth.user && r.user_id === Auth.user.id ? `<button class="copy" onclick="roadDelete('${r.id}')">🗑️</button>` : `<button class="copy" title="Мэдээлэх" onclick="reportItem('road','${r.id}')">🚩</button>`}</div></div>`;
}
function roadWarnHtml(route) {
  if (!ROADS || !route.length) return '';
  const rs = route.flatMap(a => roadsFor(a.id)); if (!rs.length) return '';
  return `<div class="warn road-warn">🚧 <b>Замын мэдээ</b> <small>(аялагчдын мэдээлсэн)</small><ul>${rs.slice(0, 5).map(r => `<li>${ROAD_KINDS[r.kind][0]} <b>${aimagName(r.aimag)}</b> — ${esc(r.place)}: ${ROAD_KINDS[r.kind][1].toLowerCase()} <small>(${ago(r.last_confirmed_at)})</small></li>`).join('')}</ul>
    <a href="#roads">Бүх замын мэдээ →</a></div>`;
}
async function roadVote(id, v) {
  if (!needUser('Санал өгөхийн тулд нэвтэрнэ үү')) return;
  const { data, error } = await Auth.voteRoad(id, v);
  if (error) { toast('Алдаа: ' + error.message); return }
  ROAD_VOTES[id] = v; const r = ROADS.find(x => x.id === id); if (r) { r.confirms = data.confirms; r.resolved = data.resolved; if (v === 'still') r.last_confirmed_at = new Date().toISOString() }
  if (data.resolved >= 2 && data.resolved > data.confirms) ROADS = ROADS.filter(x => x.id !== id);
  toast(v === 'still' ? '👍 Баярлалаа!' : '✅ Баярлалаа! Хангалттай хүн баталбал жагсаалтаас хасагдана');
  refreshRoadsUI();
}
async function roadDelete(id) {
  if (!confirm('Энэ мэдээллийг устгах уу?')) return;
  const { error } = await Auth.deleteRoad(id); if (error) { toast(error.message); return }
  ROADS = ROADS.filter(x => x.id !== id); refreshRoadsUI();
}
function refreshRoadsUI() { if (location.hash.startsWith('#roads')) VIEWS.roads(location.hash.split('/')[1]); else render() }
function openRoadForm(aid) {
  if (!needUser('Замын мэдээ оруулахын тулд нэвтэрнэ үү')) return;
  window._roadGPS = null;
  openModal(`<h3>🚧 Замын нөхцөл мэдээлэх</h3>
    <form onsubmit="submitRoad(event)">
      <select class="field" id="rdAimag" required>${aimagOptions(aid, 'Аймаг сонгох')}</select>
      <div class="rd-kinds">${Object.entries(ROAD_KINDS).map(([k, [ic, lb]], i) => `<label><input type="radio" name="rdKind" value="${k}" ${i ? '' : 'checked'}><span>${ic} ${lb}</span></label>`).join('')}</div>
      <input class="field" id="rdPlace" maxlength="120" required placeholder="Хаана? (жишээ: Хатгал–Жанхайн зам, Их голын гарам)">
      <textarea class="field" id="rdNote" rows="2" maxlength="400" placeholder="Дэлгэрэнгүй (тойруу зам, ямар машин гарч байна г.м.)"></textarea>
      <button type="button" class="btn ghost wide" onclick="getGPS(this,(a,b)=>window._roadGPS=[a,b])">📍 Одоогийн байршлаа хавсаргах</button>
      <div id="rdErr" class="note" style="color:var(--red)"></div>
      <button class="btn wide" type="submit" id="rdBtn" style="margin-top:8px">Мэдээлэх</button></form>
    <p class="note">Мэдээлэл 10 хоногийн дараа эсвэл бусад аялагч «Арилсан» гэж баталбал автоматаар алга болно.</p>`);
}
async function submitRoad(e) {
  e.preventDefault();
  const g = window._roadGPS;
  const row = { aimag: $('#rdAimag').value, kind: document.querySelector('input[name=rdKind]:checked').value, place: $('#rdPlace').value.trim(), note: $('#rdNote').value.trim() || null, lat: g ? g[0] : null, lng: g ? g[1] : null };
  if (!row.aimag) { $('#rdErr').textContent = 'Аймгаа сонгоно уу'; return }
  $('#rdBtn').disabled = true;
  const { data, error } = await Auth.addRoad(row);
  if (error) { $('#rdBtn').disabled = false; $('#rdErr').textContent = /row-level/i.test(error.message) ? 'Өдөрт 10-аас олон мэдээлэл оруулах боломжгүй.' : 'Алдаа: ' + error.message; return }
  (ROADS = ROADS || []).unshift(data);
  closeModal(); toast('🙏 Баярлалаа! Бусад аялагчдад тус болно'); refreshRoadsUI();
}
VIEWS.roads = async (aid) => {
  await loadRoads(true);
  const list = aid ? roadsFor(aid) : ROADS;
  $('#view').innerHTML = `<section class="card">
    <div class="vh"><h2>🚧 Замын мэдээ</h2><button class="btn" onclick="openRoadForm('${aid || ''}')">➕ Мэдээлэх</button></div>
    <p class="note" style="margin-top:-6px">Аялагчдын сүүлийн 10 хоногт мэдээлсэн үер, эвдэрсэн гүүр, шавар, хаалттай зам, шатахуун дууссан станц. Явахаасаа өмнө шалгаарай.</p>
    <select class="field" style="max-width:280px" onchange="location.hash='roads'+(this.value?'/'+this.value:'')">${aimagOptions(aid, 'Бүх аймаг')}</select>
    <div class="roads">${list.length ? list.map(r => roadCard(r, true)).join('') : '<div class="empty">Одоогоор мэдээлэл алга. Замдаа саад таарвал мэдээлээрэй — бусад аялагчдад тус болно.</div>'}</div>
  </section>`;
};

// ================= Кемп, амралтын газар (#6) =================
const CAMP_SERVICES = [['ger', '🛖 Гэр'], ['cabin', '🏠 Байшин'], ['tent', '⛺ Майхны талбай'], ['shower', '🚿 Шүршүүр'], ['toilet', '🚻 Суурин 00'], ['food', '🍽️ Хоол'],
  ['power', '🔌 Цахилгаан'], ['wifi', '📶 Wi-Fi'], ['horse', '🐎 Морь'], ['camel', '🐫 Тэмээ'], ['sauna', '🧖 Саун / рашаан'], ['parking', '🅿️ Зогсоол'], ['kids', '🧒 Хүүхдэд ээлтэй'], ['winter', '❄️ Өвөл ажилладаг']];
const SVC = Object.fromEntries(CAMP_SERVICES);
let CAMPS = null;
async function loadCamps(force) {
  if (!window.Auth || !Auth.configured) return [];
  if (CAMPS && !force) return CAMPS;
  const { data } = await Auth.listCamps(); CAMPS = data || []; return CAMPS;
}
const campsFor = id => (CAMPS || []).filter(c => c.aimag === id);
const stars = r => '★★★★★'.slice(0, Math.round(r)) + '☆☆☆☆☆'.slice(0, 5 - Math.round(r));
function campLinks(c) {
  return `${c.phone ? `<a href="tel:${esc(c.phone.replace(/[^0-9+]/g, ''))}">📞 ${esc(c.phone)}</a>` : ''}${c.fb ? `<a href="${safeUrl(c.fb)}" target="_blank" rel="noopener nofollow">Facebook</a>` : ''}${c.ig ? `<a href="${safeUrl(c.ig)}" target="_blank" rel="noopener nofollow">Instagram</a>` : ''}${c.web ? `<a href="${safeUrl(c.web)}" target="_blank" rel="noopener nofollow">Вэбсайт</a>` : ''}
    <a href="${c.lat ? `https://maps.google.com/?q=${c.lat},${c.lng}` : gm(c.name + ' ' + aimagName(c.aimag) + ' Mongolia')}" target="_blank" rel="noopener">🗺️ Байршил</a>`;
}
function campCard(c) {
  return `<div class="camp ${c.featured ? 'feat' : ''}">
    ${c.photo ? `<a href="#camp/${c.id}" class="camp-ph" style="background-image:url('${safeUrl(c.photo)}')"></a>` : ''}
    <div class="camp-b"><h4><a href="#camp/${c.id}">${esc(c.name)}</a>${c.verified ? ' <span class="vbadge" title="Эзэмшигч нь баталгаажсан">✓ Баталгаажсан</span>' : ''}${c.featured ? ' <span class="fbadge">Онцлох</span>' : ''}</h4>
    <div class="camp-m">${c.reviews ? `<span class="stars">${stars(c.rating)}</span> ${(+c.rating).toFixed(1)} (${c.reviews}) · ` : ''}${aimagName(c.aimag)}${c.soum ? ', ' + esc(c.soum) : ''}${c.near ? ' · ' + esc(c.near) : ''}</div>
    ${c.description ? `<p>${esc(c.description.length > 160 ? c.description.slice(0, 160) + '…' : c.description)}</p>` : ''}
    <div class="tags">${c.price ? `<span class="tag x4">💰 ${esc(c.price)}</span>` : ''}${c.season ? `<span class="tag">🗓️ ${esc(c.season)}</span>` : ''}${(c.services || []).slice(0, 6).map(s => `<span class="tag car">${SVC[s] || esc(s)}</span>`).join('')}</div>
    <div class="links">${campLinks(c)}</div></div></div>`;
}
// Хөтөлбөрийн «Хоноглох» хэсэгт бодит кемп санал болгоно
function campFor(s, g) {
  const list = campsFor(s.id); if (!list.length) return null;
  const key = g && g.length ? g[0][0].split(/[ ,(]/)[0] : '';
  const m = (key && list.find(c => (c.near || '').includes(key) || (c.name || '').includes(key))) || list[0];
  return `<a href="#camp/${m.id}"><b>${esc(m.name)}</b></a>${m.verified ? ' ✓' : ''}${m.phone ? ` · 📞 <a href="tel:${esc(m.phone.replace(/[^0-9+]/g, ''))}">${esc(m.phone)}</a>` : ''}${list.length > 1 ? ` <small>· өөр ${list.length - 1} кемп «Амралт, кемп» хэсэгт</small>` : ''}`;
}
function openCampForm(aid) {
  if (!needUser('Кемп бүртгүүлэхийн тулд нэвтэрнэ үү')) return;
  window._campPhoto = null; window._campGPS = null;
  const a = A.find(x => x.id === aid);
  openModal(`<h3>🏕️ Кемп, амралтын газар бүртгүүлэх</h3>
    <form onsubmit="submitCamp(event)">
      <div class="seg"><label><input type="radio" name="cpOwner" value="1" checked> Би энэ газрын эзэн / ажилтан</label><label><input type="radio" name="cpOwner" value="0"> Аялагч — санал болгож байна</label></div>
      <input class="field" id="cpName" maxlength="120" required placeholder="Кемпийн нэр *">
      <select class="field" id="cpAimag" required onchange="cpNearOpts()">${aimagOptions(aid, 'Аймаг сонгох *')}</select>
      <input class="field" id="cpSoum" maxlength="60" placeholder="Сум">
      <select class="field" id="cpNear"></select>
      <textarea class="field" id="cpDesc" rows="3" maxlength="1000" placeholder="Товч танилцуулга"></textarea>
      <input class="field" id="cpPhone" maxlength="40" placeholder="Утас">
      <input class="field" id="cpFb" maxlength="300" placeholder="Facebook пэйж / группийн холбоос (https://…)">
      <input class="field" id="cpIg" maxlength="300" placeholder="Instagram (https://…)">
      <input class="field" id="cpWeb" maxlength="300" placeholder="Вэбсайт (https://…)">
      <div class="two"><input class="field" id="cpPrice" maxlength="80" placeholder="Үнэ (жишээ: 60–90 мянга/хүн)"><input class="field" id="cpSeason" maxlength="60" placeholder="Ажиллах үе (6–9 сар)"></div>
      <input class="field" id="cpCap" type="number" min="1" max="5000" placeholder="Багтаамж (хүн)">
      <div class="hs-offers">${CAMP_SERVICES.map(([k, l]) => `<label><input type="checkbox" value="${k}"> ${l}</label>`).join('')}</div>
      <label class="btn ghost wide file-btn">📷 Нэг зураг нэмэх<input type="file" accept="image/*" hidden onchange="cpPhotoPick(this)"></label><div id="cpPhPrev"></div>
      <button type="button" class="btn ghost wide" style="margin-top:8px" onclick="getGPS(this,(a,b)=>window._campGPS=[a,b])">📍 Би яг одоо энэ газарт байна — байршил хавсаргах</button>
      <label class="check" style="font-size:13.5px;display:flex;gap:6px;align-items:flex-start;margin-top:10px"><input type="checkbox" id="cpConsent" required> Оруулсан мэдээлэл үнэн зөв бөгөөд нийтэд харуулах зөвшөөрөлтэй (эсвэл аль хэдийн нийтэд ил) байна.</label>
      <div id="cpErr" class="note" style="color:var(--red)"></div>
      <button class="btn wide" type="submit" id="cpBtn">Илгээх</button></form>
    <p class="note">Бид шалгаж баталсны дараа нийтлэгдэнэ. Эзэмшигч болохоо баталгаажуулсан кемпэд «✓ Баталгаажсан» тэмдэг тавигдана.</p>`);
  cpNearOpts();
}
function cpNearOpts() {
  const a = A.find(x => x.id === $('#cpAimag').value), s = $('#cpNear'); if (!s) return;
  s.innerHTML = '<option value="">Ойролцоох үзэх газар (заавал биш)</option>' + (a ? a.p.map(p => `<option>${esc(p[0])}</option>`).join('') + `<option>${esc(a.c)} хот</option>` : '');
}
async function cpPhotoPick(inp) {
  const f = inp.files[0]; if (!f) return;
  $('#cpPhPrev').innerHTML = '<p class="note">Зураг оруулж байна…</p>';
  try { window._campPhoto = await uploadPhoto(f, 'camps'); $('#cpPhPrev').innerHTML = `<img src="${esc(window._campPhoto)}" class="prev-img" alt="">` }
  catch (e) { $('#cpPhPrev').innerHTML = `<p class="note" style="color:var(--red)">${esc(e.message)}</p>` }
}
async function submitCamp(e) {
  e.preventDefault();
  const url = id => { const v = $(id).value.trim(); return v || null }, g = window._campGPS;
  const row = {
    aimag: $('#cpAimag').value, name: $('#cpName').value.trim(), soum: url('#cpSoum'), near: url('#cpNear'), description: url('#cpDesc'),
    phone: url('#cpPhone'), fb: url('#cpFb'), ig: url('#cpIg'), web: url('#cpWeb'), price: url('#cpPrice'), season: url('#cpSeason'),
    capacity: +$('#cpCap').value || null, services: [...document.querySelectorAll('#modalBody .hs-offers input:checked')].map(i => i.value),
    photo: window._campPhoto || null, lat: g ? g[0] : null, lng: g ? g[1] : null, is_owner: document.querySelector('input[name=cpOwner]:checked').value === '1'
  };
  for (const k of ['fb', 'ig', 'web']) if (row[k] && !/^https?:\/\//i.test(row[k])) { $('#cpErr').textContent = 'Холбоос https://-ээр эхлэх ёстой.'; return }
  if (!row.aimag) { $('#cpErr').textContent = 'Аймгаа сонгоно уу.'; return }
  $('#cpBtn').disabled = true;
  const { error } = await Auth.submitCamp(row);
  if (error) { $('#cpBtn').disabled = false; $('#cpErr').textContent = 'Илгээж чадсангүй: ' + error.message; return }
  $('#modalBody').innerHTML = `<h3>🙏 Баярлалаа!</h3><p>Кемпийн мэдээлэл хүлээн авагдлаа. Шалгаж баталсны дараа нийтлэгдэнэ.</p>${row.is_owner ? '<p class="note">«✓ Баталгаажсан» тэмдэг авахын тулд кемпийнхээ Facebook пэйжээс бидэнд мессеж бичиж эзэмшигч гэдгээ баталгаажуулаарай.</p>' : ''}<button class="btn wide" onclick="closeModal()">Хаах</button>`;
}
VIEWS.camps = async (aid) => {
  await loadCamps(true);
  const q = (window._campQ || '').toLowerCase(), svc = window._campSvc || '';
  const list = (aid ? campsFor(aid) : CAMPS).filter(c => (!q || (c.name + ' ' + (c.near || '') + ' ' + (c.soum || '')).toLowerCase().includes(q)) && (!svc || (c.services || []).includes(svc)));
  $('#view').innerHTML = `<section class="card">
    <div class="vh"><h2>🏕️ Кемп, амралтын газрууд</h2><button class="btn" onclick="openCampForm('${aid || ''}')">➕ Кемп бүртгүүлэх</button></div>
    <div class="filters"><select class="field" onchange="location.hash='camps'+(this.value?'/'+this.value:'')">${aimagOptions(aid, 'Бүх аймаг')}</select>
      <input class="field" placeholder="🔍 Нэрээр хайх" value="${esc(window._campQ || '')}" oninput="window._campQ=this.value;clearTimeout(window._cqT);window._cqT=setTimeout(()=>VIEWS.camps('${aid || ''}'),300)">
      <select class="field" onchange="window._campSvc=this.value;VIEWS.camps('${aid || ''}')"><option value="">Бүх үйлчилгээ</option>${CAMP_SERVICES.map(([k, l]) => `<option value="${k}" ${k === svc ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
    <div class="camps">${list.length ? list.map(campCard).join('') : `<div class="empty">${CAMPS.length ? 'Хайлтад тохирох кемп олдсонгүй.' : 'Одоогоор бүртгэлтэй кемп алга.'} Кемпийн эзэн эсвэл очиж байсан аялагч бол бүртгүүлээрэй!</div>`}</div>
  </section>`;
  if (q) { const i = document.querySelector('.filters input'); i.focus(); i.setSelectionRange(i.value.length, i.value.length) }
};
VIEWS.camp = async (id) => {
  await loadCamps();
  let c = CAMPS.find(x => x.id === id);
  if (!c) { await loadCamps(true); c = CAMPS.find(x => x.id === id) }
  if (!c) { $('#view').innerHTML = '<div class="card empty">Кемп олдсонгүй. <a href="#camps">Бүх кемп →</a></div>'; return }
  const { data: rv } = await Auth.listReviews(id);
  const mine = Auth.user && (rv || []).find(r => r.user_id === Auth.user.id);
  $('#view').innerHTML = `<section class="card camp-page">
    <p><a href="#camps/${c.aimag}">← ${aimagName(c.aimag)} аймгийн кемпүүд</a></p>
    ${c.photo ? `<img class="camp-hero" src="${safeUrl(c.photo)}" alt="">` : ''}
    <h2 style="display:block">${esc(c.name)} ${c.verified ? '<span class="vbadge">✓ Баталгаажсан</span>' : ''}</h2>
    <div class="camp-m">${c.reviews ? `<span class="stars">${stars(c.rating)}</span> ${(+c.rating).toFixed(1)} · ${c.reviews} үнэлгээ · ` : ''}${aimagName(c.aimag)}${c.soum ? ', ' + esc(c.soum) + ' сум' : ''}${c.near ? ' · ' + esc(c.near) + ' орчим' : ''}</div>
    ${c.description ? `<p style="white-space:pre-wrap">${esc(c.description)}</p>` : ''}
    <div class="tags">${c.price ? `<span class="tag x4">💰 ${esc(c.price)}</span>` : ''}${c.season ? `<span class="tag">🗓️ ${esc(c.season)}</span>` : ''}${c.capacity ? `<span class="tag">👥 ${c.capacity} хүн</span>` : ''}${(c.services || []).map(s => `<span class="tag car">${SVC[s] || esc(s)}</span>`).join('')}</div>
    <div class="links">${campLinks(c)}</div>
    <p class="note">Үнэ, ажиллах эсэхийг очихоосоо өмнө утсаар лавлаарай. <a href="#" onclick="reportItem('camp','${c.id}');return false">🚩 Мэдээлэл буруу байна</a></p>
    <h3>⭐ Үнэлгээ, сэтгэгдэл</h3>
    ${mine ? '' : `<form class="rv-form" onsubmit="submitReview(event,'${c.id}')"><div class="rate" id="rvRate">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-n="${n}" onclick="rvPick(${n})">☆</button>`).join('')}</div>
      <textarea class="field" id="rvBody" rows="2" maxlength="800" placeholder="Таны сэтгэгдэл (заавал биш)"></textarea><button class="btn" type="submit">Үнэлэх</button></form>`}
    <div class="rvs">${(rv || []).length ? rv.map(r => `<div class="rv"><b>@${esc(r.author || '?')}</b> <span class="stars">${stars(r.rating)}</span> <small>${ago(r.created_at)}</small>
      ${r.body ? `<p>${esc(r.body)}</p>` : ''}${Auth.user && r.user_id === Auth.user.id ? `<button class="copy" onclick="delReview('${r.id}','${c.id}')">Устгах</button>` : `<button class="copy" onclick="reportItem('review','${r.id}')">🚩</button>`}</div>`).join('') : '<p class="note">Одоогоор үнэлгээ алга. Очиж байсан бол анхны үнэлгээг өгөөрэй!</p>'}</div>
  </section>`;
};
function rvPick(n) { window._rv = n; document.querySelectorAll('#rvRate button').forEach(b => b.textContent = +b.dataset.n <= n ? '★' : '☆') }
async function submitReview(e, id) {
  e.preventDefault();
  if (!needUsername(() => VIEWS.camp(id), 'Үнэлэхийн тулд нэвтэрнэ үү')) return;
  if (!window._rv) { toast('Одоор үнэлнэ үү'); return }
  const { error } = await Auth.addReview(id, window._rv, $('#rvBody').value.trim());
  if (error) { toast(/duplicate|unique/i.test(error.message) ? 'Та аль хэдийн үнэлсэн байна' : 'Алдаа: ' + error.message); return }
  window._rv = 0; toast('⭐ Баярлалаа!'); await loadCamps(true); VIEWS.camp(id);
}
async function delReview(rid, cid) { const { error } = await Auth.deleteReview(rid); if (error) toast(error.message); else { await loadCamps(true); VIEWS.camp(cid) } }

// ================= Аяллын түүх, блог (#8) =================
const IMG_TOKEN = /\[зураг (\d{1,2})\]/g;
function storyCard(s, mine) {
  const st = { draft: ['📝 Ноорог', ''], pending: ['⏳ Шалгагдаж байна', 'pending'], rejected: ['✕ Татгалзсан', 'rejected'], approved: ['', ''] }[s.status] || ['', ''];
  return `<a class="story" href="#${mine && s.status !== 'approved' ? 'write' : 'story'}/${s.id}">
    <span class="story-cv" ${s.cover ? `style="background-image:url('${safeUrl(s.cover)}')"` : ''}>${s.cover ? '' : '📖'}</span>
    <span class="story-b"><b>${esc(s.title)}</b>
      <small>${s.author ? '@' + esc(s.author) + ' · ' : ''}${new Date(s.created_at).toLocaleDateString()}${s.days ? ` · ${s.days} хоног` : ''}</small>
      ${s.excerpt ? `<span class="story-ex">${esc(s.excerpt.replace(IMG_TOKEN, '').replace(/\s+/g, ' ').slice(0, 140))}…</span>` : ''}
      <span class="story-f">${(s.aimags || []).slice(0, 3).map(id => `<span class="tag">${aimagName(id)}</span>`).join('')}${s.status === 'approved' ? `<span>❤️ ${s.likes}</span><span>💬 ${s.comments}</span>` : `<span class="st ${st[1]}">${st[0]}</span>`}</span></span></a>`;
}
VIEWS.stories = async (aid) => {
  const { data, error } = await Auth.listStories({ aimag: aid || null });
  if (error) throw error;
  $('#view').innerHTML = `<section class="card">
    <div class="vh"><h2>📖 Аяллын түүхүүд</h2><div style="display:flex;gap:8px;flex-wrap:wrap">${Auth.user ? '<a class="btn ghost" href="#mine">Миний түүхүүд</a>' : ''}<a class="btn" href="#write">✍️ Түүх бичих</a></div></div>
    <p class="note" style="margin-top:-6px">Аялагчдын өөрсдийн бичсэн тэмдэглэл, зураг, маршрут. Түүх бүрийн маршрутаар шууд аялал төлөвлөж болно.</p>
    <select class="field" style="max-width:280px" onchange="location.hash='stories'+(this.value?'/'+this.value:'')">${aimagOptions(aid, 'Бүх аймаг')}</select>
    <div class="stories">${(data || []).length ? data.map(s => storyCard(s)).join('') : `<div class="empty">${aid ? aimagName(aid) + ' аймгийн' : 'Одоогоор'} нийтлэгдсэн түүх алга. Анхны түүхийг та бичээрэй! ✍️</div>`}</div>
  </section>`;
};
VIEWS.mine = async () => {
  if (!Auth.user) { $('#view').innerHTML = '<div class="card empty">Нэвтэрнэ үү. <button class="btn" onclick="openLogin()">Нэвтрэх</button></div>'; return }
  const { data } = await Auth.listStories({ mine: true });
  $('#view').innerHTML = `<section class="card"><p><a href="#stories">← Бүх түүх</a></p>
    <div class="vh"><h2>Миний түүхүүд ${Auth.username ? `<small>@${esc(Auth.username)}</small>` : ''}</h2><a class="btn" href="#write">✍️ Шинэ түүх</a></div>
    <div class="stories">${(data || []).length ? data.map(s => storyCard(s, true)).join('') : '<div class="empty">Та одоогоор түүх бичээгүй байна.</div>'}</div></section>`;
};
VIEWS.u = async (name) => {
  const { data } = await Auth.listStories({ author: (name || '').toLowerCase() });
  $('#view').innerHTML = `<section class="card"><p><a href="#stories">← Бүх түүх</a></p><h2>👤 @${esc(name)}</h2>
    <div class="stories">${(data || []).length ? data.map(s => storyCard(s)).join('') : '<div class="empty">Нийтлэгдсэн түүх алга.</div>'}</div></section>`;
};
function storyBody(s) {
  const used = new Set(), imgs = s.images || [];
  const fig = n => { const u = imgs[n - 1]; if (!u) return ''; used.add(n); return `<figure><img src="${safeUrl(u)}" alt="" loading="lazy"></figure>` };
  const html = String(s.body).split(/\n{2,}/).map(par => {
    par = par.trim(); if (!par) return '';
    const only = par.match(/^\[зураг (\d{1,2})\]$/); if (only) return fig(+only[1]);
    let head = '';
    if (/^##\s/.test(par)) { const nl = par.indexOf('\n'); head = `<h3>${esc((nl < 0 ? par : par.slice(0, nl)).replace(/^##\s*/, ''))}</h3>`; par = nl < 0 ? '' : par.slice(nl + 1).trim(); if (!par) return head }
    return head + '<p>' + esc(par).replace(/\n/g, '<br>').replace(IMG_TOKEN, (_, n) => '</p>' + fig(+n) + '<p>') + '</p>';
  }).join('').replace(/<p><\/p>/g, '');
  const rest = imgs.map((u, i) => used.has(i + 1) ? '' : `<a href="${safeUrl(u)}" target="_blank" rel="noopener"><img src="${safeUrl(u)}" alt="" loading="lazy"></a>`).join('');
  return html + (rest ? `<div class="gallery">${rest}</div>` : '');
}
VIEWS.story = async (id) => {
  const { data: s, error } = await Auth.getStory(id);
  if (error) throw error;
  if (!s) { $('#view').innerHTML = '<div class="card empty">Түүх олдсонгүй эсвэл хараахан нийтлэгдээгүй байна. <a href="#stories">Бүх түүх →</a></div>'; return }
  const [{ data: cm }, liked] = await Promise.all([Auth.listComments(id), Auth.likedStory(id)]);
  const own = Auth.user && s.user_id === Auth.user.id, rt = s.route && s.route.sel && s.route.sel.length;
  window._story = s;
  $('#view').innerHTML = `<article class="card story-page">
    <p><a href="#stories">← Бүх түүх</a>${s.status !== 'approved' ? ` · <span class="st pending">${s.status === 'draft' ? 'Ноорог' : s.status === 'rejected' ? 'Татгалзсан' : 'Шалгагдаж байна'}</span>` : ''}</p>
    ${s.cover ? `<img class="story-hero" src="${safeUrl(s.cover)}" alt="">` : ''}
    <h1>${esc(s.title)}</h1>
    <div class="story-meta"><a href="#u/${esc(s.author || '')}">@${esc(s.author || '')}</a> · ${new Date(s.created_at).toLocaleDateString()}
      ${(s.aimags || []).map(a => `<a class="tag" href="#stories/${a}">${aimagName(a)}</a>`).join(' ')}</div>
    <div class="story-facts">${s.days ? `<span>🗓️ ${s.days} хоног</span>` : ''}${s.cost ? `<span>💰 ~${fmt(s.cost)}₮</span>` : ''}${s.car ? `<span>🚗 ${esc(s.car)}</span>` : ''}</div>
    ${rt ? `<div class="story-route">🗺️ Маршрут: <b>${s.route.sel.map(aimagName).join(' → ')}</b> <button class="btn" onclick="useStoryRoute()">Энэ маршрутаар төлөвлөх</button></div>` : ''}
    <div class="story-body">${storyBody(s)}</div>
    <div class="story-act">${s.status === 'approved' ? `<button class="copy ${liked ? 'on' : ''}" id="likeBtn" onclick="toggleLike('${s.id}')">${liked ? '❤️' : '🤍'} <span>${s.likes}</span></button>` : ''}
      <button class="copy" onclick="shareStory()">📤 Хуваалцах</button>
      ${own ? `<a class="copy" href="#write/${s.id}">✏️ Засах</a><button class="copy" onclick="delStory('${s.id}')">🗑️ Устгах</button>` : `<button class="copy" onclick="reportItem('story','${s.id}')">🚩 Мэдээлэх</button>`}</div>
    ${s.status === 'approved' ? `<h3>💬 Сэтгэгдэл (${(cm || []).length})</h3>
    <div class="cms">${(cm || []).map(c => `<div class="cm"><b><a href="#u/${esc(c.author || '')}">@${esc(c.author || '')}</a></b> <small>${ago(c.created_at)}</small><p>${esc(c.body)}</p>
      ${Auth.user && c.user_id === Auth.user.id ? `<button class="copy" onclick="delComment('${c.id}','${s.id}')">Устгах</button>` : `<button class="copy" onclick="reportItem('comment','${c.id}')">🚩</button>`}</div>`).join('') || '<p class="note">Анхны сэтгэгдлийг та бичээрэй.</p>'}</div>
    <form class="cm-form" onsubmit="addComment(event,'${s.id}')"><textarea class="field" id="cmIn" rows="2" maxlength="1000" placeholder="Сэтгэгдэл бичих…" required></textarea><button class="btn" type="submit">Илгээх</button></form>` : ''}
  </article>`;
};
function useStoryRoute() {
  const p = (window._story && window._story.route) || {};
  sel = (p.sel || []).filter(id => A.some(a => a.id === id));
  [['car', p.car], ['perday', p.perday], ['sdays', p.sdays], ['season', p.season]].forEach(([id, v]) => { if (v != null && v !== '') $('#' + id).value = v });
  $('#ret').checked = p.ret !== false; save(); location.hash = ''; render();
  setTimeout(() => $('#planbox').scrollIntoView({ behavior: 'smooth' }), 120); toast('🗺️ Маршрут нээгдлээ');
}
async function toggleLike(id) {
  if (!needUser('Лайк дарахын тулд нэвтэрнэ үү')) return;
  const b = $('#likeBtn'), on = b.classList.contains('on'), n = +b.querySelector('span').textContent;
  b.disabled = true;
  const { error } = on ? await Auth.unlike(id) : await Auth.like(id);
  b.disabled = false;
  if (error && !/duplicate/i.test(error.message)) { toast(error.message); return }
  b.classList.toggle('on', !on); b.innerHTML = `${on ? '🤍' : '❤️'} <span>${Math.max(0, n + (on ? -1 : 1))}</span>`;
}
function shareStory() {
  const s = window._story, url = SITE_URL() + '#story/' + s.id;
  if (navigator.share) navigator.share({ title: s.title, text: s.title + ' — Монгол аялал', url }).catch(() => {}); else copyText(url);
}
async function addComment(e, id) {
  e.preventDefault();
  if (!needUsername(() => VIEWS.story(id), 'Сэтгэгдэл бичихийн тулд нэвтэрнэ үү')) return;
  const body = $('#cmIn').value.trim(); if (!body) return;
  const { error } = await Auth.addComment(id, body);
  if (error) { toast(/row-level/i.test(error.message) ? 'Хэт олон сэтгэгдэл бичлээ, түр хүлээнэ үү' : error.message); return }
  VIEWS.story(id);
}
async function delComment(cid, sid) { const { error } = await Auth.deleteComment(cid); if (error) toast(error.message); else VIEWS.story(sid) }
async function delStory(id) {
  if (!confirm('Энэ түүхийг бүр мөсөн устгах уу?')) return;
  const { error } = await Auth.deleteStory(id); if (error) { toast(error.message); return }
  toast('Устгалаа'); location.hash = 'mine';
}
// --- Түүх бичих ---
const WR = { id: null, images: [], cover: null, aimags: [], route: null };
VIEWS.write = async (id) => {
  if (!Auth.configured) throw new Error('Одоогоор ажиллахгүй');
  if (!Auth.user) { $('#view').innerHTML = '<div class="card empty">Түүх бичихийн тулд нэвтэрнэ үү.<br><br><button class="btn" onclick="openLogin()">Нэвтрэх / Бүртгүүлэх</button></div>'; return }
  if (!Auth.username) { $('#view').innerHTML = '<div class="card empty">Эхлээд хэрэглэгчийн нэрээ сонгоно уу.<br><br><button class="btn" onclick="needUsername(()=>VIEWS.write(\'' + (id || '') + '\'))">@нэр сонгох</button></div>'; needUsername(() => VIEWS.write(id)); return }
  let s = null;
  if (id) { const r = await Auth.getStory(id); s = r.data; if (!s || s.user_id !== Auth.user.id) { $('#view').innerHTML = '<div class="card empty">Түүх олдсонгүй.</div>'; return } }
  else { try { s = JSON.parse(localStorage.getItem('cs_story_draft') || 'null') } catch (e) { } }
  Object.assign(WR, { id: id || null, images: (s && s.images) || [], cover: (s && s.cover) || null, aimags: (s && s.aimags) || [...sel], route: (s && s.route) || null });
  const cur = order();
  $('#view').innerHTML = `<section class="card write">
    <p><a href="#${id ? 'story/' + id : 'stories'}">← Буцах</a></p>
    <h2>✍️ ${id ? 'Түүх засах' : 'Аяллын түүх бичих'}</h2>
    ${s && s.status === 'rejected' && s.admin_note ? `<div class="warn">Татгалзсан шалтгаан: ${esc(s.admin_note)}</div>` : ''}
    <input class="field big" id="wTitle" maxlength="120" placeholder="Гарчиг (жишээ: Хөвсгөлийн 5 хоног хүүхдүүдтэйгээ)" value="${esc((s && s.title) || '')}">
    <div class="w-cover" id="wCover">${WR.cover ? `<img src="${safeUrl(WR.cover)}" alt="">` : ''}<label class="btn ghost file-btn">🖼️ ${WR.cover ? 'Нүүр зураг солих' : 'Нүүр зураг нэмэх'}<input type="file" accept="image/*" hidden onchange="wCoverPick(this)"></label></div>
    <label class="w-l">Очсон аймгууд</label>
    <div class="chips w-aim">${A.map(a => `<button type="button" class="chip ${WR.aimags.includes(a.id) ? 'on' : ''}" data-id="${a.id}" onclick="this.classList.toggle('on')">${a.n}</button>`).join('')}</div>
    <div class="two"><input class="field" id="wDays" type="number" min="1" max="60" placeholder="Хэдэн хоног" value="${(s && s.days) || ''}">
      <input class="field" id="wCost" type="number" min="0" step="10000" placeholder="Нийт зардал (₮, заавал биш)" value="${(s && s.cost) || ''}"></div>
    <input class="field" id="wCar" maxlength="60" placeholder="Машин (жишээ: Prius 30, Land Cruiser)" value="${esc((s && s.car) || '')}">
    <label class="w-l">Түүх</label>
    <div class="w-tools"><label class="copy file-btn">📷 Зураг оруулах<input type="file" accept="image/*" multiple hidden onchange="wImgPick(this)"></label><span class="note" style="margin:0">Курсор байгаа газарт <b>[зураг 1]</b> гэж орно. Хоосон мөрөөр догол мөр тусгаарлана. <b>## </b>-ээр эхэлбэл дэд гарчиг.</span></div>
    <textarea class="field" id="wBody" rows="14" maxlength="20000" placeholder="Аяллаа хэрхэн өнгөрүүлсэн бэ? Зам, кемп, хоол, зөвлөгөө…">${esc((s && s.body) || '')}</textarea>
    <div class="w-imgs" id="wImgs"></div>
    <label class="check w-route"><input type="checkbox" id="wRoute" ${WR.route || cur.length ? 'checked' : ''} ${WR.route || cur.length ? '' : 'disabled'}> 🗺️ Маршрут хавсаргах: <b>${WR.route && WR.route.sel ? WR.route.sel.map(aimagName).join(' → ') : cur.length ? cur.map(a => a.n).join(' → ') : '(Төлөвлөгчөөс аймаг сонгоогүй байна)'}</b></label>
    <div id="wErr" class="note" style="color:var(--red)"></div>
    <div class="qz-nav"><button class="btn ghost" onclick="wSave('draft')">💾 Ноорог хадгалах</button><button class="btn" onclick="wSave('pending')">📤 Нийтлэх</button></div>
    <p class="note">Бид шалгаж баталсны дараа бүх хүнд харагдана. Бусдын зураг, хувийн мэдээлэл (утас, машины дугаар) бүү оруулаарай.</p>
  </section>`;
  wImgsRender();
  if (!id) $('#wBody').addEventListener('input', wLocal);
};
function wLocal() {
  clearTimeout(wLocal.t); wLocal.t = setTimeout(() => { try { localStorage.setItem('cs_story_draft', JSON.stringify({ title: $('#wTitle').value, body: $('#wBody').value, images: WR.images, cover: WR.cover, aimags: wAimags() })) } catch (e) { } }, 600);
}
const wAimags = () => [...document.querySelectorAll('.w-aim .chip.on')].map(b => b.dataset.id);
function wImgsRender() {
  $('#wImgs').innerHTML = WR.images.map((u, i) => `<div class="w-img"><img src="${safeUrl(u)}" alt=""><span>[зураг ${i + 1}]</span><button type="button" onclick="wImgDel(${i})" title="Хасах">×</button></div>`).join('');
}
async function wCoverPick(inp) {
  const f = inp.files[0]; if (!f) return;
  toast('Зураг оруулж байна…');
  try { WR.cover = await uploadPhoto(f, 'stories'); const c = $('#wCover'); c.querySelector('img') ? c.querySelector('img').src = WR.cover : c.insertAdjacentHTML('afterbegin', `<img src="${esc(WR.cover)}" alt="">`); wLocal() }
  catch (e) { toast(e.message) }
}
async function wImgPick(inp) {
  const files = [...inp.files]; inp.value = '';
  for (const f of files) {
    if (WR.images.length >= 12) { toast('Хамгийн ихдээ 12 зураг'); break }
    toast('Зураг оруулж байна…');
    try {
      const u = await uploadPhoto(f, 'stories'); WR.images.push(u);
      const ta = $('#wBody'), pos = ta.selectionStart ?? ta.value.length, tok = `\n\n[зураг ${WR.images.length}]\n\n`;
      ta.value = ta.value.slice(0, pos) + tok + ta.value.slice(pos); ta.selectionStart = ta.selectionEnd = pos + tok.length;
      wImgsRender(); wLocal();
    } catch (e) { toast(e.message); break }
  }
}
function wImgDel(i) {
  const ta = $('#wBody'), n = i + 1;
  ta.value = ta.value.replace(new RegExp(`\\n*\\[зураг ${n}\\]\\n*`, 'g'), '\n\n').replace(IMG_TOKEN, (m, k) => +k > n ? `[зураг ${+k - 1}]` : m);
  WR.images.splice(i, 1); wImgsRender(); wLocal();
}
async function wSave(status) {
  const title = $('#wTitle').value.trim(), body = $('#wBody').value.trim(), err = $('#wErr');
  if (title.length < 3) { err.textContent = 'Гарчгаа бичнэ үү.'; return }
  if (body.replace(IMG_TOKEN, '').trim().length < 20) { err.textContent = 'Түүхээ арай дэлгэрэнгүй бичээрэй (20+ тэмдэгт).'; return }
  const cur = order();
  const route = $('#wRoute').checked ? (WR.route || (cur.length ? { ...tripPayload(), sel: cur.map(a => a.id) } : null)) : null;
  const row = { title, body, cover: WR.cover, images: WR.images, aimags: wAimags(), route, days: +$('#wDays').value || null, cost: +$('#wCost').value || null, car: $('#wCar').value.trim() || null, status };
  err.textContent = '';
  document.querySelectorAll('.write .qz-nav button').forEach(b => b.disabled = true);
  const { data, error } = await Auth.saveStory(row, WR.id);
  document.querySelectorAll('.write .qz-nav button').forEach(b => b.disabled = false);
  if (error) { err.textContent = /USERNAME/.test(error.message) ? 'Хэрэглэгчийн нэрээ сонгоно уу.' : 'Хадгалж чадсангүй: ' + error.message; return }
  try { localStorage.removeItem('cs_story_draft') } catch (e) { }
  if (status === 'draft') { toast('💾 Ноорог хадгалагдлаа'); WR.id = data.id; history.replaceState(null, '', '#write/' + data.id); return }
  openModal('<h3>📤 Илгээлээ!</h3><p>Таны түүх шалгагдаж байна. Батлагдсаны дараа «Аяллын түүхүүд» хэсэгт бүх хүнд харагдана.</p><button class="btn wide" onclick="closeModal()">Ойлголоо</button>');
  location.hash = 'mine';
}

// ================= Төлөвлөгчтэй холбох =================
TABS.push(['roads', '🚧 Замын мэдээ']);
const _tabBody2 = tabBody;
tabBody = function (a, t) {
  if (t === 'roads') return `<div class="roads">${ROADS === null ? '<p class="note">Ачаалж байна…</p>' : roadsFor(a.id).length ? roadsFor(a.id).map(r => roadCard(r)).join('') : '<p class="note">Сүүлийн 10 хоногт энэ аймгаас замын мэдээ ирээгүй байна.</p>'}</div>
    <button class="btn ghost" onclick="openRoadForm('${a.id}')">➕ Замын нөхцөл мэдээлэх</button>`;
  let html = _tabBody2(a, t);
  if (t === 'camps') {
    const cs = campsFor(a.id);
    html = `${cs.length ? `<div class="camps">${cs.slice(0, 6).map(campCard).join('')}</div>${cs.length > 6 ? `<p><a href="#camps/${a.id}">Бүх ${cs.length} кемп →</a></p>` : ''}` : ''}
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin:${cs.length ? '10px' : '0'} 0 12px"><button class="btn ghost" onclick="openCampForm('${a.id}')">➕ Кемп бүртгүүлэх / санал болгох</button><a class="btn ghost" href="#camps/${a.id}">🏕️ Кемпийн жагсаалт</a></div>
      ${cs.length ? '<h4 style="margin:8px 0 6px">Бусад мэдээлэл</h4>' : ''}${html}`;
  }
  if (t === 'places') html += `<p style="margin-top:10px"><a href="#stories/${a.id}">📖 ${a.n} аймгийн аяллын түүхүүд →</a></p>`;
  return html;
};
(async function initCommunity() {
  router();
  if (!window.Auth || !Auth.configured) return;
  await Promise.all([loadRoads(), loadCamps()]).catch(e => console.warn('community', e));
  if ($('#planner') && !$('#planner').hidden) render();
  // Нэвтрэх үед өөрийн санал (👍/✅)-ыг ачаална; нэр сонгоогүй хэрэглэгчид түүх бичих үед асууна
  Auth.onChange(() => { if (Auth.ready && Auth.user) Auth.myRoadVotes().then(v => { ROAD_VOTES = {}; (v.data || []).forEach(x => ROAD_VOTES[x.report_id] = x.vote) }) });
})();
