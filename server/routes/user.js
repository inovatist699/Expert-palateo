import express from 'express';
import { getAuthUser } from '../auth.js';
import { pool, memStore } from '../db.js';

const router = express.Router();

// Middleware: Require authentication
async function requireAuth(req, res, next) {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Sign in required.' });
  }
  req.user = user;
  next();
}

/**
 * GET /api/user/state
 * Single-trip hydration endpoint for user profile, taste profile, saves, and interactions
 */
router.get('/state', requireAuth, async (req, res) => {
  const userId = req.user.id;

  try {
    if (pool) {
      const [profileRes, tasteRes, savesRes, interactionsRes] = await Promise.all([
        pool.query('SELECT * FROM public.profiles WHERE id = $1', [userId]),
        pool.query('SELECT * FROM public.taste_profiles WHERE user_id = $1', [userId]),
        pool.query('SELECT restaurant_id FROM public.saved_restaurants WHERE user_id = $1 ORDER BY restaurant_id', [userId]),
        pool.query('SELECT restaurant_id, type, metadata, created_at FROM public.interactions WHERE user_id = $1 ORDER BY created_at ASC, id ASC', [userId])
      ]);

      const profile = profileRes.rows[0] || {
        id: userId,
        display_name: req.user.name || req.user.display_name || req.user.email?.split('@')[0],
        email: req.user.email,
        phone: req.user.phone || null,
        onboarding_completed: req.user.onboarding_completed || false
      };

      const taste = tasteRes.rows[0] || null;
      const saves = savesRes.rows.map(r => r.restaurant_id);
      const interactions = interactionsRes.rows;

      return res.json({ profile, taste, saves, interactions });
    } else {
      // In-memory fallback
      const profile = memStore.profiles.get(userId) || {
        id: userId,
        display_name: req.user.name || req.user.email?.split('@')[0],
        email: req.user.email,
        phone: req.user.phone || null,
        onboarding_completed: req.user.onboarding_completed || false
      };

      const taste = memStore.tasteProfiles.get(userId) || null;
      const saves = Array.from(memStore.savedRestaurants.entries())
        .filter(([k]) => k.startsWith(`${userId}:`))
        .map(([, v]) => v);
      const interactions = memStore.interactions.filter(i => i.user_id === userId);

      return res.json({ profile, taste, saves, interactions });
    }
  } catch (error) {
    console.error('[API /user/state] error:', error);
    return res.status(500).json({ error: 'Failed to load user state' });
  }
});

/**
 * GET /api/user/profile
 */
router.get('/profile', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM public.profiles WHERE id = $1', [userId]);
      if (result.rows.length) return res.json(result.rows[0]);
    } else if (memStore.profiles.has(userId)) {
      return res.json(memStore.profiles.get(userId));
    }

    return res.json({
      id: userId,
      display_name: req.user.name || req.user.email?.split('@')[0],
      email: req.user.email,
      phone: req.user.phone || null,
      onboarding_completed: req.user.onboarding_completed || false
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/user/profile
 */
router.put('/profile', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { display_name, phone, profile_photo_url, bio, onboarding_completed } = req.body;

  try {
    if (pool) {
      const q = `
        INSERT INTO public.profiles (id, display_name, phone, email, profile_photo_url, bio, onboarding_completed, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        ON CONFLICT (id) DO UPDATE SET
          display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
          phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
          profile_photo_url = COALESCE(EXCLUDED.profile_photo_url, public.profiles.profile_photo_url),
          bio = COALESCE(EXCLUDED.bio, public.profiles.bio),
          onboarding_completed = COALESCE(EXCLUDED.onboarding_completed, public.profiles.onboarding_completed),
          updated_at = NOW()
        RETURNING *;
      `;
      const result = await pool.query(q, [
        userId,
        display_name || req.user.name,
        phone || req.user.phone || null,
        req.user.email,
        profile_photo_url || null,
        bio || null,
        onboarding_completed ?? false
      ]);
      return res.json(result.rows[0]);
    } else {
      const current = memStore.profiles.get(userId) || {};
      const updated = {
        ...current,
        id: userId,
        display_name: display_name || current.display_name || req.user.name,
        phone: phone || current.phone || req.user.phone || null,
        email: req.user.email,
        profile_photo_url: profile_photo_url || current.profile_photo_url || null,
        bio: bio || current.bio || null,
        onboarding_completed: onboarding_completed ?? current.onboarding_completed ?? false,
        updated_at: new Date().toISOString()
      };
      memStore.profiles.set(userId, updated);
      return res.json(updated);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/user/taste
 */
router.get('/taste', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    if (pool) {
      const result = await pool.query('SELECT * FROM public.taste_profiles WHERE user_id = $1', [userId]);
      return res.json(result.rows[0] || null);
    }
    return res.json(memStore.tasteProfiles.get(userId) || null);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/user/taste
 */
router.put('/taste', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const {
    cuisines,
    spice_level,
    budget,
    ambience,
    occasions,
    priorities,
    max_distance_km,
    confidence,
    taste_vector
  } = req.body;

  try {
    if (pool) {
      const q = `
        INSERT INTO public.taste_profiles (
          user_id, cuisines, spice_level, budget, ambience, occasions, priorities,
          max_distance_km, confidence, taste_vector, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
          cuisines = EXCLUDED.cuisines,
          spice_level = EXCLUDED.spice_level,
          budget = EXCLUDED.budget,
          ambience = EXCLUDED.ambience,
          occasions = EXCLUDED.occasions,
          priorities = EXCLUDED.priorities,
          max_distance_km = EXCLUDED.max_distance_km,
          confidence = EXCLUDED.confidence,
          taste_vector = EXCLUDED.taste_vector,
          updated_at = NOW()
        RETURNING *;
      `;
      const result = await pool.query(q, [
        userId,
        JSON.stringify(cuisines || {}),
        spice_level || null,
        budget || null,
        JSON.stringify(ambience || {}),
        JSON.stringify(occasions || {}),
        JSON.stringify(priorities || {}),
        max_distance_km ?? null,
        confidence ?? 82,
        JSON.stringify(taste_vector || {})
      ]);

      // Also set onboarding_completed = true on profiles
      await pool.query(
        'UPDATE public.profiles SET onboarding_completed = TRUE, updated_at = NOW() WHERE id = $1',
        [userId]
      );

      return res.json({ ok: true, data: result.rows[0] });
    } else {
      const record = {
        user_id: userId,
        cuisines: cuisines || {},
        spice_level: spice_level || null,
        budget: budget || null,
        ambience: ambience || {},
        occasions: occasions || {},
        priorities: priorities || {},
        max_distance_km: max_distance_km ?? null,
        confidence: confidence ?? 82,
        taste_vector: taste_vector || {},
        updated_at: new Date().toISOString()
      };
      memStore.tasteProfiles.set(userId, record);
      const prof = memStore.profiles.get(userId) || { id: userId };
      prof.onboarding_completed = true;
      memStore.profiles.set(userId, prof);
      return res.json({ ok: true, data: record });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/user/saves
 */
router.get('/saves', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    if (pool) {
      const result = await pool.query(
        'SELECT restaurant_id FROM public.saved_restaurants WHERE user_id = $1 ORDER BY restaurant_id',
        [userId]
      );
      return res.json(result.rows.map(r => r.restaurant_id));
    }
    const saves = Array.from(memStore.savedRestaurants.entries())
      .filter(([k]) => k.startsWith(`${userId}:`))
      .map(([, v]) => v);
    return res.json(saves);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/saves
 */
router.post('/saves', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { restaurant_id } = req.body;
  if (!restaurant_id) return res.status(400).json({ error: 'restaurant_id required' });

  try {
    if (pool) {
      await pool.query(
        'INSERT INTO public.saved_restaurants (user_id, restaurant_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, restaurant_id]
      );
    } else {
      memStore.savedRestaurants.set(`${userId}:${restaurant_id}`, restaurant_id);
    }
    return res.json({ ok: true, saved: true, restaurant_id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/user/saves
 */
router.delete('/saves', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { restaurant_id } = req.body;
  if (!restaurant_id) return res.status(400).json({ error: 'restaurant_id required' });

  try {
    if (pool) {
      await pool.query(
        'DELETE FROM public.saved_restaurants WHERE user_id = $1 AND restaurant_id = $2',
        [userId, restaurant_id]
      );
    } else {
      memStore.savedRestaurants.delete(`${userId}:${restaurant_id}`);
    }
    return res.json({ ok: true, saved: false, restaurant_id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/user/interactions
 */
router.get('/interactions', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    if (pool) {
      const result = await pool.query(
        'SELECT restaurant_id, type, metadata, created_at FROM public.interactions WHERE user_id = $1 ORDER BY created_at ASC, id ASC',
        [userId]
      );
      return res.json(result.rows);
    }
    return res.json(memStore.interactions.filter(i => i.user_id === userId));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/interactions
 */
router.post('/interactions', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { restaurant_id, type, source, metadata } = req.body;
  if (!restaurant_id || !type) return res.status(400).json({ error: 'restaurant_id and type required' });

  try {
    if (pool) {
      await pool.query(
        'INSERT INTO public.interactions (user_id, restaurant_id, type, source, metadata) VALUES ($1, $2, $3, $4, $5)',
        [userId, restaurant_id, type, source || 'palateo_v5', JSON.stringify(metadata || {})]
      );
    } else {
      memStore.interactions.push({
        user_id: userId,
        restaurant_id,
        type,
        source: source || 'palateo_v5',
        metadata: metadata || {},
        created_at: new Date().toISOString()
      });
    }
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/user/events
 */
router.post('/events', requireAuth, async (req, res) => {
  const userId = req.user.id;
  const { event_name, metadata } = req.body;
  if (!event_name) return res.status(400).json({ error: 'event_name required' });

  try {
    if (pool) {
      await pool.query(
        'INSERT INTO public.app_events (user_id, event_name, metadata) VALUES ($1, $2, $3)',
        [userId, event_name, JSON.stringify(metadata || {})]
      );
    } else {
      memStore.events.push({
        user_id: userId,
        event_name,
        metadata: metadata || {},
        created_at: new Date().toISOString()
      });
    }
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
