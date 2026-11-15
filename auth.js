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
      .select('id,email,premium_until,trial_used_at').eq('id', state.user.id).maybeSingle();
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
