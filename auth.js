// Хэрэглэгчийн бүртгэл, премиум эрх, хадгалсан аяллууд (Supabase)
(function () {
  const cfg = window.APP_CONFIG || {};
  const configured = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
  const sb = configured ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

  const state = { user: null, profile: null, ready: !configured };
  const listeners = [];
  const emit = () => listeners.forEach(f => { try { f(state) } catch (e) { console.error(e) } });

  async function loadProfile() {
    if (!sb || !state.user) { state.profile = null; return }
    const { data, error } = await sb.from('profiles')
      .select('id,email,premium_until').eq('id', state.user.id).maybeSingle();
    if (error) console.warn('profile:', error.message);
    state.profile = data || null;
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
    premiumUntil() {
      const u = state.profile && state.profile.premium_until;
      return u ? new Date(u) : null;
    },
    signInGoogle() {
      return sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirect() } });
    },
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
    deleteTrip(id) { return sb.from('trips').delete().eq('id', id) }
  };

  if (sb) {
    sb.auth.onAuthStateChange((event, session) => {
      state.user = session ? session.user : null;
      // Supabase-ийн callback дотор шууд await хийвэл гацах тул дараагийн эргэлтэд ачаална
      setTimeout(async () => { await loadProfile(); state.ready = true; emit() }, 0);
    });
  }

  window.Auth = Auth;
})();
