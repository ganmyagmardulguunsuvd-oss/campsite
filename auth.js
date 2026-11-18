// Хэрэглэгчийн бүртгэл, премиум эрх, хадгалсан аяллууд (Supabase)
(function () {
  const cfg = window.APP_CONFIG || {};
  const configured = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
  const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

  const state = { user: null, profile: null, pending: null, recovery: false, ready: !configured };
  const listeners = [];
  const emit = () => listeners.forEach(f => { try { f(state) } catch (e) { console.error(e) } });

  async function loadProfile() {
    if (!sb || !state.user) { state.profile = null; state.pending = null; return }
    const { data, error } = await sb.from('profiles')
      .select('id,email,premium_until,trial_used_at,username').eq('id', state.user.id).maybeSingle();
    if (error) console.warn('profile:', error.message);
    state.profile = data || null;
    const r = await sb.from('payment_requests').select('id,ref_code,amount,status,created_at')
      .eq('user_id', state.user.id).eq('status', 'pending').maybeSingle();
    state.pending = (r && r.data) || null;
  }

  const redirect = () => location.origin + location.pathname;

  const Auth = {
    configured,
    onChange(f) { listeners.push(f) },
    get user() { return state.user },
    get ready() { return state.ready },
    isPremium() {
      if (!configured) return !!cfg.DEMO_PREMIUM;
      const u = state.profile && state.profile.premium_until;
      return !!u && new Date(u) > new Date();
    },
    trialAvailable() { return !!(state.user && state.profile && !state.profile.trial_used_at) },
    isTrial() {
      const p = state.profile;
      if (!p || !p.trial_used_at || !p.premium_until || !Auth.isPremium()) return false;
      return new Date(p.premium_until) - new Date(p.trial_used_at) <= 86400000 + 60000;
    },
    async startTrial() { const r = await sb.rpc('start_trial'); await loadProfile(); emit(); return r },
    premiumUntil() {
      const u = state.profile && state.profile.premium_until;
      return u ? new Date(u) : null;
    },
    signInGoogle() {
      return sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirect() } });
    },
    get username() { return (state.profile && state.profile.username) || null },
    async setUsername(name) { const r = await sb.rpc('set_username', { p_name: name }); if (!r.error) await loadProfile(); emit(); return r },
    verifySignupCode(email, token) { return sb.auth.verifyOtp({ email, token, type: 'signup' }) },
    resendSignupCode(email) { return sb.auth.resend({ type: 'signup', email, options: { emailRedirectTo: redirect() } }) },
    signUpPassword(email, password) {
      return sb.auth.signUp({ email, password, options: { emailRedirectTo: redirect() } });
    },
    signInPassword(email, password) { return sb.auth.signInWithPassword({ email, password }) },
    resetPassword(email) { return sb.auth.resetPasswordForEmail(email, { redirectTo: redirect() }) },
    async updatePassword(password) { const r = await sb.auth.updateUser({ password }); if (!r.error) state.recovery = false; return r },
    get recovery() { return state.recovery },
    signInEmail(email) {
      return sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect() } });
    },
    async signOut() { await sb.auth.signOut() },
    async refresh() { await loadProfile(); emit() },

    // Аяллууд — RLS-ээр зөвхөн өөрийнх нь харагдана, зөвхөн премиум хэрэглэгч хадгална
    saveTrip(name, payload) {
      return sb.from('trips').insert({ name, payload }).select('id,name,payload,created_at').single();
    },
    listTrips() {
      return sb.from('trips').select('id,name,payload,created_at').order('created_at', { ascending: false });
    },
    deleteTrip(id) { return sb.from('trips').delete().eq('id', id) },

    // Төлбөр — хэрэглэгч
    get pending() { return state.pending },
    refCode() { return state.user ? 'CS-' + state.user.id.replace(/-/g, '').slice(0, 6).toUpperCase() : '' },
    createRequest(payer_name, note, amount) {
      return sb.from('payment_requests').insert({ payer_name, note: note || null, amount })
        .select('id,ref_code,amount,status,created_at').single();
    },
    myRequests() {
      return sb.from('payment_requests').select('*').eq('user_id', state.user.id)
        .order('created_at', { ascending: false }).limit(10);
    },

    // Санал хүсэлт
    sendFeedback(f) {
      const row = { kind: f.kind, message: f.message, name: f.name || null, contact: f.contact || null, page: (location.pathname + location.hash).slice(0, 300) };
      if (state.user) row.user_id = state.user.id; else row.user_id = null;
      return sb.from('feedback').insert(row);
    },
    listFeedback(status) {
      let q = sb.from('feedback').select('*').order('created_at', { ascending: false }).limit(300);
      if (status) q = q.eq('status', status);
      return q;
    },
    countNewFeedback() { return sb.from('feedback').select('id', { count: 'exact', head: true }).eq('status', 'new') },
    setFeedbackStatus(id, status) { return sb.from('feedback').update({ status }).eq('id', id) },

    // Шатахууны үнэ
    fuelPrices() { return sb.from('fuel_prices').select('code,name,price,sort,updated_at').order('sort') },
    updateFuel(code, price) { return sb.from('fuel_prices').update({ price, updated_at: new Date().toISOString() }).eq('code', code) },

    // Айл буудал
    listHomestays(aimag) { return sb.from('homestays').select('*').eq('aimag', aimag).order('created_at', { ascending: false }) },
    listHomestaysAdmin(status) {
      let q = sb.from('homestays').select('*').order('created_at', { ascending: false }).limit(300);
      if (status) q = q.eq('status', status);
      return q;
    },
    countPendingHomestays() { return sb.from('homestays').select('id', { count: 'exact', head: true }).eq('status', 'pending') },
    submitHomestay(row) { return sb.from('homestays').insert({ ...row, submitted_by: state.user.id }) },
    setHomestayStatus(id, status) { return sb.from('homestays').update({ status }).eq('id', id) },
    deleteHomestay(id) { return sb.from('homestays').delete().eq('id', id) },

    // Зураг оруулах (storage: media/<user_id>/...)
    async upload(blob, folder) {
      const path = `${state.user.id}/${folder}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      const { error } = await sb.storage.from('media').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000', upsert: false });
      if (error) return { error };
      return { data: sb.storage.from('media').getPublicUrl(path).data.publicUrl };
    },
    report(target_type, target_id, reason) { return sb.from('reports').insert({ target_type, target_id, reason: reason || null }) },

    // Замын мэдээ (#11)
    listRoads() { return sb.from('road_reports').select('*').order('last_confirmed_at', { ascending: false }).limit(300) },
    addRoad(row) { return sb.from('road_reports').insert(row).select('*').single() },
    voteRoad(id, vote) { return sb.rpc('vote_road', { p_id: id, p_vote: vote }) },
    myRoadVotes() { return state.user ? sb.from('road_votes').select('report_id,vote').eq('user_id', state.user.id) : Promise.resolve({ data: [] }) },
    deleteRoad(id) { return sb.from('road_reports').delete().eq('id', id) },
    hideRoad(id, hidden) { return sb.from('road_reports').update({ hidden }).eq('id', id) },

    // Аяллын түүх (#8)
    async listStories(o = {}) {
      const r = await Auth._listStories(o, 'excerpt');
      return r.error && /excerpt/.test(r.error.message) ? Auth._listStories(o, 'body') : r;  // 07_excerpt.sql ажиллуулаагүй үед
    },
    _listStories(o, ex) {
      let q = sb.from('stories').select('id,author,title,cover,aimags,days,cost,likes,comments,status,created_at,' + ex)
        .order('created_at', { ascending: false }).limit(o.limit || 60);
      if (o.mine) q = q.eq('user_id', state.user.id); else if (!o.admin) q = q.eq('status', 'approved');
      if (o.status) q = q.eq('status', o.status);
      if (o.author) q = q.eq('author', o.author);
      if (o.aimag) q = q.contains('aimags', [o.aimag]);
      return q;
    },
    getStory(id) { return sb.from('stories').select('*').eq('id', id).maybeSingle() },
    saveStory(row, id) {
      row = { ...row, updated_at: new Date().toISOString() };
      return id ? sb.from('stories').update(row).eq('id', id).select('id,status').single()
        : sb.from('stories').insert(row).select('id,status').single();
    },
    deleteStory(id) { return sb.from('stories').delete().eq('id', id) },
    setStoryStatus(id, status, admin_note) { return sb.from('stories').update({ status, admin_note: admin_note || null }).eq('id', id) },
    async likedStory(id) { if (!state.user) return false; const { data } = await sb.from('story_likes').select('story_id').eq('story_id', id).eq('user_id', state.user.id).maybeSingle(); return !!data },
    like(id) { return sb.from('story_likes').insert({ story_id: id }) },
    unlike(id) { return sb.from('story_likes').delete().eq('story_id', id).eq('user_id', state.user.id) },
    listComments(id) { return sb.from('story_comments').select('*').eq('story_id', id).order('created_at').limit(300) },
    addComment(story_id, body) { return sb.from('story_comments').insert({ story_id, body }).select('*').single() },
    deleteComment(id) { return sb.from('story_comments').delete().eq('id', id) },
    hideComment(id) { return sb.from('story_comments').update({ hidden: true }).eq('id', id) },

    // Кемп (#6)
    listCamps() { return sb.from('camps').select('*').eq('status', 'approved').order('featured', { ascending: false }).order('rating', { ascending: false }).limit(1000) },
    listCampsAdmin(status) { let q = sb.from('camps').select('*').order('created_at', { ascending: false }).limit(300); if (status) q = q.eq('status', status); return q },
    submitCamp(row) { return sb.from('camps').insert({ ...row, submitted_by: state.user.id }) },
    updateCamp(id, patch) { return sb.from('camps').update(patch).eq('id', id) },
    deleteCamp(id) { return sb.from('camps').delete().eq('id', id) },
    listReviews(camp_id) { return sb.from('camp_reviews').select('*').eq('camp_id', camp_id).order('created_at', { ascending: false }).limit(100) },
    addReview(camp_id, rating, body) { return sb.from('camp_reviews').insert({ camp_id, rating, body: body || null }) },
    deleteReview(id) { return sb.from('camp_reviews').delete().eq('id', id) },
    hideReview(id) { return sb.from('camp_reviews').update({ hidden: true }).eq('id', id) },

    // Админ: шинэ зүйлсийн тоо, мэдээлэл
    adminCounts() { return sb.rpc('admin_counts') },
    listReports(status) { let q = sb.from('reports').select('*').order('created_at', { ascending: false }).limit(300); if (status) q = q.eq('status', status); return q },
    setReportStatus(id, status) { return sb.from('reports').update({ status }).eq('id', id) },

    // Админ
    async isAdmin() { if (!sb || !state.user) return false; const { data } = await sb.rpc('is_admin'); return !!data },
    listRequests(status) {
      let q = sb.from('payment_requests').select('*').order('created_at', { ascending: false }).limit(300);
      if (status) q = q.eq('status', status);
      return q;
    },
    listPremium() {
      return sb.from('profiles').select('email,premium_until,created_at')
        .gt('premium_until', new Date().toISOString()).order('premium_until', { ascending: true }).limit(300);
    },
    approve(id, days) { return sb.rpc('approve_payment', { req_id: id, p_days: days }) },
    reject(id, reason) { return sb.rpc('reject_payment', { req_id: id, reason }) },
    grantByEmail(email, days) { return sb.rpc('grant_premium_by_email', { p_email: email, p_days: days }) },
    stats() { return sb.rpc('admin_stats') }
  };

  if (sb) {
    sb.auth.onAuthStateChange((event, session) => {
      state.user = session ? session.user : null;
      if (event === 'PASSWORD_RECOVERY') state.recovery = true;
      // Supabase-ийн callback дотор шууд await хийвэл гацах тул дараагийн эргэлтэд ачаална
      setTimeout(async () => { await loadProfile(); state.ready = true; emit() }, 0);
    });
  }

  window.Auth = Auth;
})();
