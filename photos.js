// Аймаг, газрын зураг (#3): Wikimedia Commons-ийн чөлөөт зураг + аялагчдын өөрсдийн зураг.
// community.js-ийн дараа ачаалагдана.

// ---------- Commons: аймаг бүрт хайх үгс (эхнийх нь хангалттай олдохгүй бол дараагийнхыг) ----------
const CM_Q = {
  tov: ['Gorkhi-Terelj National Park', 'Töv Province Mongolia'], selenge: ['Selenge Province', 'Amarbayasgalant Monastery'],
  darkhan: ['Darkhan Mongolia', 'Darkhan-Uul'], orkhon: ['Erdenet Mongolia', 'Orkhon Province'],
  bulgan: ['Bulgan Province Mongolia', 'Khögnö Khan', 'Elsen Tasarkhai'], uvurkhangai: ['Orkhon Valley', 'Övörkhangai landscape', 'Erdene Zuu'],
  arkhangai: ['Arkhangai landscape', 'Terkhiin Tsagaan Lake'], khuvsgul: ['Lake Khövsgöl', 'Khövsgöl Province'],
  zavkhan: ['Zavkhan Province', 'Otgontenger', 'Uliastai'], govialtai: ['Govi-Altai Province', 'Altai Mongolia'],
  uvs: ['Uvs Province', 'Uvs Lake', 'Ulaangom'], khovd: ['Khovd Province', 'Khar-Us Lake'],
  bayanulgii: ['Bayan-Ölgii Province', 'Tavan Bogd', 'Ölgii'], bayankhongor: ['Bayankhongor Province', 'Orog Lake'],
  umnugovi: ['Ömnögovi landscape', 'Khongoryn Els', 'Yolyn Am'], dundgovi: ['Dundgovi Province', 'Baga Gazriin Chuluu', 'Tsagaan Suvarga'],
  dornogovi: ['Dornogovi Province', 'Khamar Monastery', 'Sainshand'], govisumber: ['Govisümber', 'Choir Mongolia'],
  khentii: ['Khentii Province', 'Khentii Mountains', 'Chinggis Khaan Mongolia city'], sukhbaatar: ['Sükhbaatar Province', 'Dariganga', 'Shiliin Bogd'],
  dornod: ['Dornod Province', 'Buir Lake', 'Choibalsan']
};
const CM = {};
const stripHtml = h => String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
async function cmSearch(q) {
  const u = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=12' +
    '&gsrsearch=' + encodeURIComponent(q + ' filetype:bitmap -map -flag -coat -logo') + '&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=640';
  const j = await fetch(u).then(r => r.json());
  return Object.values((j.query && j.query.pages) || {}).sort((a, b) => a.index - b.index).map(p => {
    const ii = p.imageinfo && p.imageinfo[0]; if (!ii) return null;
    const m = ii.extmetadata || {}, t = p.title.replace(/^File:/, '');
    if (/map|flag|coat|logo|seal|svg|locator|diagram|stamp|banknote|plan\b/i.test(t) || ii.width < 900 || ii.width < ii.height * 0.9) return null;
    return { src: ii.thumburl, full: ii.url, page: ii.descriptionurl, by: stripHtml(m.Artist && m.Artist.value).slice(0, 50) || 'Wikimedia Commons', lic: stripHtml(m.LicenseShortName && m.LicenseShortName.value) || 'Commons', title: t };
  }).filter(Boolean);
}
function commonsPhotos(aid) {
  if (CM[aid]) return CM[aid];
  try { const c = JSON.parse(localStorage.getItem('cs_cm_' + aid) || 'null'); if (c && Date.now() - c.t < 7 * 864e5) return CM[aid] = Promise.resolve(c.p) } catch (e) { }
  return CM[aid] = (async () => {
    let out = [];
    for (const q of CM_Q[aid] || []) {
      try { (await cmSearch(q)).forEach(x => { if (!out.some(y => y.title === x.title)) out.push(x) }) } catch (e) { }
      if (out.length >= 8) break;
    }
    out = out.slice(0, 8);
    try { localStorage.setItem('cs_cm_' + aid, JSON.stringify({ t: Date.now(), p: out })) } catch (e) { }
    return out;
  })();
}

// ---------- Аялагчдын зураг ----------
const UPH = {};
function userPhotos(aid, force) {
  if (!window.Auth || !Auth.configured) return Promise.resolve([]);
  if (!UPH[aid] || force) UPH[aid] = Auth.listPhotos({ aimag: aid, limit: 24, sort: 'top' }).then(r => r.data || []).catch(() => []);
  return UPH[aid];
}
const PH = {};  // id -> мөр (lightbox-д)
function thumbHtml(p, user) {
  const k = user ? 'u' + p.id : 'c' + Math.random().toString(36).slice(2, 9);
  PH[k] = { ...p, user };
  return `<button type="button" class="ph" onclick="openPhoto('${k}')" style="background-image:url('${safeUrl(user ? p.url : p.src)}')">
    ${user ? `<span class="ph-by">@${esc(p.author || '')}${p.likes ? ` · ❤️ ${p.likes}` : ''}</span>` : ''}</button>`;
}
async function fillPhotoTabs() {
  for (const el of document.querySelectorAll('.ph-wrap[data-a]')) {
    const aid = el.dataset.a;
    const [up, cm] = await Promise.all([userPhotos(aid), commonsPhotos(aid)]);
    if (!el.isConnected) continue;
    el.innerHTML = `${up.length ? `<h4 class="ph-h">📷 Аялагчдын зураг</h4><div class="ph-grid">${up.map(p => thumbHtml(p, true)).join('')}</div>` : ''}
      ${cm.length ? `<h4 class="ph-h">🏞️ ${aimagName(aid)} — зургууд <small>(Wikimedia Commons)</small></h4><div class="ph-grid">${cm.map(p => thumbHtml(p, false)).join('')}</div>` : ''}
      ${!up.length && !cm.length ? '<p class="note">Одоогоор зураг алга.</p>' : ''}`;
  }
}
async function openPhoto(k) {
  const p = PH[k]; if (!p) return;
  if (!p.user) {
    openModal(`<div class="lb"><img src="${safeUrl(p.full || p.src)}" alt=""><p class="note">Зураг: <a href="${safeUrl(p.page)}" target="_blank" rel="noopener">${esc(p.by)}</a> · ${esc(p.lic)} · Wikimedia Commons</p></div>`);
    $('#modal .modal-box').classList.add('wide'); return;
  }
  const liked = (await Auth.likedPhotos([p.id])).has(p.id), own = Auth.user && p.user_id === Auth.user.id;
  openModal(`<div class="lb"><img src="${safeUrl(p.url)}" alt="">
    <div class="lb-m"><b><a href="#photos/${p.aimag}" onclick="closeModal()">${aimagName(p.aimag)}</a>${p.place ? ' · ' + esc(p.place) : ''}</b>
      ${p.caption ? `<p>${esc(p.caption)}</p>` : ''}
      <small>📷 @${esc(p.author || '')} · ${ago(p.created_at)}${p.status !== 'approved' ? ' · <span class="st pending">Шалгагдаж байна</span>' : ''}</small></div>
    <div class="road-act">${p.status === 'approved' ? `<button class="copy ${liked ? 'on' : ''}" id="phLike" onclick="likePhotoBtn('${k}')">${liked ? '❤️' : '🤍'} <span>${p.likes}</span></button>` : ''}
      ${own ? `<button class="copy" onclick="delPhoto('${p.id}','${p.aimag}')">🗑️ Устгах</button>` : `<button class="copy" onclick="reportItem('photo','${p.id}')">🚩 Мэдээлэх</button>`}</div></div>`);
  $('#modal .modal-box').classList.add('wide');
}
async function likePhotoBtn(k) {
  if (!needUser('Лайк дарахын тулд нэвтэрнэ үү')) return;
  const p = PH[k], b = $('#phLike'), on = b.classList.contains('on');
  b.disabled = true;
  const { error } = on ? await Auth.unlikePhoto(p.id) : await Auth.likePhoto(p.id);
  b.disabled = false;
  if (error && !/duplicate/i.test(error.message)) { toast(error.message); return }
  p.likes = Math.max(0, p.likes + (on ? -1 : 1)); b.classList.toggle('on', !on); b.innerHTML = `${on ? '🤍' : '❤️'} <span>${p.likes}</span>`;
  delete UPH[p.aimag];
}
async function delPhoto(id, aid) {
  if (!confirm('Энэ зургийг устгах уу?')) return;
  const { error } = await Auth.deletePhoto(id); if (error) { toast(error.message); return }
  closeModal(); toast('Устгалаа'); delete UPH[aid]; refreshPhotos(aid);
}
function refreshPhotos(aid) { if (location.hash.startsWith('#photos')) VIEWS.photos(location.hash.split('/')[1]); else fillPhotoTabs() }
function openPhotoForm(aid) {
  if (!needUsername(() => openPhotoForm(aid), 'Зураг оруулахын тулд нэвтэрнэ үү')) return;
  window._phFile = null;
  openModal(`<h3>📷 Зураг оруулах</h3>
    <form onsubmit="submitPhoto(event)">
      <label class="btn ghost wide file-btn">🖼️ Зураг сонгох<input type="file" accept="image/*" hidden onchange="phPick(this)"></label>
      <div id="phPrev"></div>
      <select class="field" id="phAimag" required onchange="phPlaces()">${aimagOptions(aid, 'Аймаг сонгох *')}</select>
      <select class="field" id="phPlace"></select>
      <input class="field" id="phCap" maxlength="300" placeholder="Тайлбар (заавал биш) — жишээ: Нар жаргах үеэр">
      <label class="check" style="font-size:13.5px;display:flex;gap:6px;align-items:flex-start"><input type="checkbox" id="phOwn" required> Энэ зургийг <b>би өөрөө авсан</b>, нийтлэх эрхтэй. Хүмүүсийн нүүр, машины дугаар тод харагдахгүй.</label>
      <div id="phErr" class="note" style="color:var(--red)"></div>
      <button class="btn wide" type="submit" id="phBtn">Оруулах</button></form>
    <p class="note">Зургийн байршлын (GPS) мэдээллийг автоматаар арилгана. Бид шалгаж баталсны дараа нийтлэгдэнэ.</p>`);
  phPlaces();
}
function phPlaces() {
  const a = A.find(x => x.id === $('#phAimag').value), s = $('#phPlace');
  s.innerHTML = '<option value="">Аль газар вэ? (заавал биш)</option>' + (a ? a.p.map(p => `<option>${esc(p[0])}</option>`).join('') + `<option>${esc(a.c)} хот</option>` : '');
}
function phPick(inp) {
  const f = inp.files[0]; if (!f) return; window._phFile = f;
  const u = URL.createObjectURL(f); $('#phPrev').innerHTML = `<img src="${u}" class="prev-img" alt="">`;
}
async function submitPhoto(e) {
  e.preventDefault();
  const err = $('#phErr'), aid = $('#phAimag').value;
  if (!window._phFile) { err.textContent = 'Зургаа сонгоно уу.'; return }
  if (!aid) { err.textContent = 'Аймгаа сонгоно уу.'; return }
  $('#phBtn').disabled = true; $('#phBtn').textContent = 'Оруулж байна…';
  try {
    const url = await uploadPhoto(window._phFile, 'photos');
    const { error } = await Auth.addPhoto({ aimag: aid, place: $('#phPlace').value || null, caption: $('#phCap').value.trim() || null, url });
    if (error) throw error;
    $('#modalBody').innerHTML = '<h3>🙏 Баярлалаа!</h3><p>Зураг тань хүлээн авагдлаа. Шалгаж баталсны дараа бүх хүнд харагдана.</p><button class="btn wide" onclick="closeModal()">Хаах</button>';
    delete UPH[aid]; refreshPhotos(aid);
  } catch (x) {
    $('#phBtn').disabled = false; $('#phBtn').textContent = 'Оруулах';
    err.textContent = /row-level/i.test(x.message || '') ? 'Өдөрт 20-оос олон зураг оруулах боломжгүй.' : /USERNAME/.test(x.message || '') ? 'Хэрэглэгчийн нэрээ сонгоно уу.' : 'Алдаа: ' + (x.message || x);
  }
}
VIEWS.photos = async (aid) => {
  const m = new Date(); m.setDate(1); m.setHours(0, 0, 0, 0);
  const [best, recent, cm] = await Promise.all([
    Auth.listPhotos({ aimag: aid || null, sort: 'top', since: m.toISOString(), limit: 6 }).then(r => (r.data || []).filter(p => p.likes > 0)),
    Auth.listPhotos({ aimag: aid || null, limit: 60 }).then(r => r.data || []),
    aid ? commonsPhotos(aid) : Promise.resolve([])]);
  const mine = Auth.user ? (await Auth.listPhotos({ mine: true, limit: 50 })).data || [] : [];
  const pending = mine.filter(p => p.status === 'pending');
  $('#view').innerHTML = `<section class="card">
    <div class="vh"><h2>📷 Аялагчдын зургууд</h2><button class="btn" onclick="openPhotoForm('${aid || ''}')">➕ Зураг оруулах</button></div>
    <p class="note" style="margin-top:-6px">Аялагчдын өөрсдийн авсан зураг. Таалагдсан зурагтаа ❤️ дараарай — сар бүрийн хамгийн их лайктай зураг «Сарын шилдэг» болно.</p>
    <select class="field" style="max-width:280px" onchange="location.hash='photos'+(this.value?'/'+this.value:'')">${aimagOptions(aid, 'Бүх аймаг')}</select>
    ${pending.length ? `<div class="warn">⏳ Таны ${pending.length} зураг шалгагдаж байна.</div>` : ''}
    ${best.length ? `<h3 class="ph-h">🏆 ${m.getMonth() + 1}-р сарын шилдэг</h3><div class="ph-grid best">${best.map(p => thumbHtml(p, true)).join('')}</div>` : ''}
    <h3 class="ph-h">🆕 Шинэ зургууд</h3>
    ${recent.length ? `<div class="ph-grid">${recent.map(p => thumbHtml(p, true)).join('')}</div>` : `<div class="empty">${aid ? aimagName(aid) + ' аймгаас' : 'Одоогоор'} аялагчдын зураг алга. Анхны зургийг та оруулаарай! 📷</div>`}
    ${cm.length ? `<h3 class="ph-h">🏞️ ${aimagName(aid)} — Wikimedia Commons</h3><div class="ph-grid">${cm.map(p => thumbHtml(p, false)).join('')}</div>` : ''}
  </section>`;
};

// ---------- Төлөвлөгчтэй холбох ----------
TABS.splice(1, 0, ['photos', '📷 Зураг']);
const _tabBody3 = tabBody;
tabBody = function (a, t) {
  if (t === 'photos') return `<div class="ph-wrap" data-a="${a.id}"><p class="note">Зураг ачаалж байна…</p></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn ghost" onclick="openPhotoForm('${a.id}')">➕ Өөрийн зургаа оруулах</button><a class="btn ghost" href="#photos/${a.id}">Бүх зураг →</a></div>`;
  return _tabBody3(a, t);
};
const _afterRender3 = afterRender;
afterRender = function () { _afterRender3(); fillPhotoTabs() };
if (location.hash.startsWith('#photos')) router();
