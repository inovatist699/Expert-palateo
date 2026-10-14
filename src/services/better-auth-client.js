/* ============================================================================
   PALATEO BETTER AUTH & RAILWAY BACKEND CLIENT
   Framework-agnostic, zero-dependency client connector for Better Auth.
   Connects to Railway backend with fallback to Supabase or offline storage.
   ============================================================================ */

let palateoRailwayUrl = typeof window !== 'undefined'
  ? (window.PALATEO_API_URL || window.localStorage?.getItem('palateo_backend_url') || '')
  : '';

let betterAuthToken = null;
let betterAuthSession = null;

function getRailwayUrl() {
  return palateoRailwayUrl || (typeof window !== 'undefined' ? window.PALATEO_API_URL || window.localStorage?.getItem('palateo_backend_url') || '' : '');
}

function setRailwayUrl(url) {
  palateoRailwayUrl = url ? String(url).replace(/\/+$/, '') : '';
  if (typeof window !== 'undefined' && window.localStorage) {
    if (palateoRailwayUrl) {
      window.localStorage.setItem('palateo_backend_url', palateoRailwayUrl);
    } else {
      window.localStorage.removeItem('palateo_backend_url');
    }
  }
}

function isRailwayActive() {
  return Boolean(getRailwayUrl() && state.backendType === 'railway');
}

/**
 * Standard HTTP fetcher for Railway API with credentials & Bearer authorization
 */
async function railwayFetch(endpoint, options = {}) {
  const base = getRailwayUrl();
  if (!base) throw new Error('Railway backend URL is not configured.');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add stored token if present
  const token = betterAuthToken || (typeof window !== 'undefined' ? window.localStorage?.getItem('better_auth_token') : null);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${base}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || errorBody.error || `HTTP error ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.code = errorBody.code;
    throw err;
  }

  return response.json().catch(() => ({ ok: true }));
}

/**
 * Normalize Better Auth user into Palateo currentUser format
 */
function normalizeBetterAuthUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name || user.display_name || user.email?.split('@')[0],
    user_metadata: {
      full_name: user.name || user.display_name || user.email?.split('@')[0],
      name: user.name || user.display_name || user.email?.split('@')[0],
      phone: user.phone || null,
      palateo_legal_version: user.palateo_legal_version || null,
      palateo_legal_accepted_at: user.palateo_legal_accepted_at || null,
      palateo_privacy_consent: user.palateo_privacy_consent === true
    }
  };
}

/**
 * Better Auth sign up
 */
async function betterAuthSignUp(name, phone, email, password, consent) {
  const metadata = legalMetadata(consent);
  const data = await railwayFetch('/api/auth/sign-up/email', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      name,
      phone: phone || null,
      onboarding_completed: false,
      ...metadata
    })
  });

  if (data.token) {
    betterAuthToken = data.token;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('better_auth_token', data.token);
    }
  }

  const user = normalizeBetterAuthUser(data.user);
  betterAuthSession = { user, token: data.token };
  useAccount(user);
  state.backendConnected = true;
  state.backendType = 'railway';
  state.userId = user.id;
  state.profile = { name, phone: phone || '', email };
  persist();

  return user;
}

/**
 * Better Auth sign in
 */
async function betterAuthSignIn(email, password) {
  const data = await railwayFetch('/api/auth/sign-in/email', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password
    })
  });

  if (data.token) {
    betterAuthToken = data.token;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('better_auth_token', data.token);
    }
  }

  const user = normalizeBetterAuthUser(data.user);
  betterAuthSession = { user, token: data.token };
  useAccount(user);
  state.backendConnected = true;
  state.backendType = 'railway';
  state.userId = user.id;

  const profile = {
    name: user.user_metadata?.full_name || email.split('@')[0],
    phone: user.user_metadata?.phone || '',
    email: user.email
  };
  state.profile = profile;
  persist();

  return user;
}

/**
 * Better Auth sign out
 */
async function betterAuthSignOut() {
  try {
    await railwayFetch('/api/auth/sign-out', { method: 'POST' });
  } catch (e) {
    console.warn('Railway sign out error:', e);
  } finally {
    betterAuthToken = null;
    betterAuthSession = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('better_auth_token');
    }
    useAccount(null);
    state.backendConnected = false;
    persist();
  }
}

/**
 * Retrieve active Better Auth session
 */
async function betterAuthGetSession() {
  try {
    const data = await railwayFetch('/api/auth/get-session', { method: 'GET' });
    if (data?.user) {
      const user = normalizeBetterAuthUser(data.user);
      betterAuthSession = { user, session: data.session };
      return user;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Load cloud state from Railway backend (/api/user/state)
 */
async function loadRailwayCloudState() {
  if (!currentUser) return false;
  try {
    const data = await railwayFetch('/api/user/state', { method: 'GET' });
    const { profile, taste, saves, interactions } = data;

    if (profile) {
      state.profile = {
        name: profile.display_name || currentUser.name || '',
        phone: profile.phone || '',
        email: profile.email || currentUser.email || '',
        photo: profile.profile_photo_url || '',
        bio: profile.bio || ''
      };
    }

    if (taste && !state.retakeInProgress) {
      state.confidence = Number(taste.confidence || state.confidence || 82);
      const a = {};
      const tCuisines = typeof taste.cuisines === 'string' ? JSON.parse(taste.cuisines) : (taste.cuisines || {});
      const tAmbience = typeof taste.ambience === 'string' ? JSON.parse(taste.ambience) : (taste.ambience || {});
      const tOccasions = typeof taste.occasions === 'string' ? JSON.parse(taste.occasions) : (taste.occasions || {});
      const tPriorities = typeof taste.priorities === 'string' ? JSON.parse(taste.priorities) : (taste.priorities || {});

      if (tCuisines.primary) a.cuisine = tCuisines.primary;
      if (Array.isArray(tCuisines.favorites)) a.cuisines = tCuisines.favorites.filter(x => Object.hasOwn(cuisineAliases, x));
      if (taste.spice_level) a.spice = taste.spice_level;
      if (taste.budget) a.budget = taste.budget;
      if (tAmbience.primary) a.mood = tAmbience.primary;
      if (Array.isArray(tAmbience.favorites)) a.vibes = tAmbience.favorites.filter(x => ['quiet', 'lively', 'date', 'family'].includes(x));
      if (tOccasions.primary) a.occasion = tOccasions.primary;
      if (tPriorities.primary) a.priority = tPriorities.primary;
      if (tPriorities.dietary_preference) a.diet = tPriorities.dietary_preference;
      if (taste.max_distance_km === null) a.distance = 'any';
      else if (taste.max_distance_km !== undefined) a.distance = String(taste.max_distance_km);

      if (hasTasteAnswers(a)) {
        state.answers = a;
        state.onboarded = true;
        state.ai = state.ai || { likes: 0, dislikes: 0, visits: 0, signals: {} };
        state.ai.signals = typeof taste.taste_vector === 'string' ? JSON.parse(taste.taste_vector) : (taste.taste_vector || state.ai.signals || {});
      }
    }

    if (Array.isArray(saves)) {
      state.cloudSaves = saves;
      if (dbCatalog.length) {
        const ids = new Set(saves);
        const localOnly = state.saves.filter(id => !dbCatalog.some(r => r.id === id));
        state.saves = [...new Set([...dbCatalog.filter(r => ids.has(r.dbId)).map(r => r.id), ...localOnly])];
      }
    }

    if (Array.isArray(interactions) && dbCatalog.length) {
      const byDb = new Map(dbCatalog.map(r => [r.dbId, r]));
      for (const r of dbCatalog) delete state.feedback[r.id];
      for (const row of interactions) {
        const r = byDb.get(row.restaurant_id);
        const meta = typeof row.metadata === 'string' ? JSON.parse(row.metadata) : (row.metadata || {});
        if (r && ['like', 'dislike', 'visited'].includes(row.type)) {
          if (meta.removed === true) delete state.feedback[r.id];
          else state.feedback[r.id] = row.type;
        }
      }
    }

    rebuildLearning();
    persist();
    return true;
  } catch (error) {
    console.warn('[Railway] Cloud load error:', error);
    return false;
  }
}

/**
 * Connect Palateo to a Railway backend service with Better Auth
 */
async function connectRailway(url) {
  const targetUrl = url || prompt('Enter your Railway Backend URL (e.g. https://palateo-backend.up.railway.app):', getRailwayUrl() || 'http://localhost:3000');
  if (!targetUrl) return null;

  setRailwayUrl(targetUrl);
  state.backendType = 'railway';
  persist();

  try {
    const health = await railwayFetch('/health');
    console.log('[Railway] Connected to backend:', health);

    const user = await betterAuthGetSession();
    if (user) {
      useAccount(user);
      state.backendConnected = true;
      persist();
      await loadRailwayCloudState();
      updateMode();
      toast('Railway + Better Auth connected ✓');
      return user;
    } else {
      updateMode();
      showAuth('login', 'Connected to Railway. Sign in with Better Auth to continue.');
      return null;
    }
  } catch (error) {
    console.error('[Railway] Connection failed:', error);
    toast(`Could not connect to Railway backend at ${targetUrl}`);
    return null;
  }
}

// Attach to Palateo runtime global
if (typeof window !== 'undefined') {
  window.Palateo = window.Palateo || {};
  window.Palateo.connectRailway = connectRailway;
  window.Palateo.getRailwayUrl = getRailwayUrl;
  window.Palateo.setRailwayUrl = setRailwayUrl;
}
