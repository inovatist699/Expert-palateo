import pg from 'pg';
import dotenv from 'dotenv';
import {readFileSync} from 'node:fs';
dotenv.config();

const { Pool } = pg;

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL environment variable is required to run migrations.');
    console.log('Provide your Railway PostgreSQL connection string, for example:');
    console.log('DATABASE_URL=postgresql://postgres:password@host:port/railway npm run migrate');
    process.exit(1);
  }

  console.log('[Migration] Connecting to Railway PostgreSQL...');
  const pool = new Pool({
    connectionString,
    ssl: process.env.PGSSLMODE === 'disable' ? false : process.env.NODE_ENV === 'production' ? {rejectUnauthorized:true} : false
  });

  const sql = `
    BEGIN;

    -- =========================================================================
    -- BETTER AUTH CORE TABLES
    -- =========================================================================

    CREATE TABLE IF NOT EXISTS public."user" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
      "image" TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "phone" TEXT,
      "onboarding_completed" BOOLEAN DEFAULT FALSE,
      "display_name" TEXT,
      "bio" TEXT
    );

    CREATE TABLE IF NOT EXISTS public."session" (
      "id" TEXT PRIMARY KEY,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "token" TEXT NOT NULL UNIQUE,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public."account" (
      "id" TEXT PRIMARY KEY,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" TIMESTAMPTZ,
      "refreshTokenExpiresAt" TIMESTAMPTZ,
      "scope" TEXT,
      "password" TEXT,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public."verification" (
      "id" TEXT PRIMARY KEY,
      "identifier" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "createdAt" TIMESTAMPTZ DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ DEFAULT NOW()
    );

    -- =========================================================================
    -- PALATEO DOMAIN TABLES
    -- =========================================================================

    CREATE TABLE IF NOT EXISTS public.profiles (
      id TEXT PRIMARY KEY,
      display_name TEXT,
      phone TEXT,
      email TEXT,
      profile_photo_url TEXT,
      bio TEXT,
      onboarding_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.taste_profiles (
      user_id TEXT PRIMARY KEY REFERENCES public."user"("id") ON DELETE CASCADE,
      cuisines JSONB DEFAULT '{}'::jsonb,
      spice_level TEXT,
      budget TEXT,
      ambience JSONB DEFAULT '{}'::jsonb,
      occasions JSONB DEFAULT '{}'::jsonb,
      priorities JSONB DEFAULT '{}'::jsonb,
      max_distance_km NUMERIC,
      confidence NUMERIC DEFAULT 82,
      taste_vector JSONB DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.saved_restaurants (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE,
      restaurant_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, restaurant_id)
    );

    CREATE TABLE IF NOT EXISTS public.interactions (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE,
      restaurant_id TEXT NOT NULL,
      type TEXT NOT NULL,
      source TEXT DEFAULT 'palateo_v5',
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.connections (
      id BIGSERIAL PRIMARY KEY,
      requester_id TEXT NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE,
      recipient_id TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(requester_id, recipient_id)
    );

    CREATE TABLE IF NOT EXISTS public.app_events (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES public."user"("id") ON DELETE CASCADE,
      event_name TEXT NOT NULL,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.launch_waitlist (
      id BIGSERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      city TEXT NOT NULL,
      consent BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.restaurant_catalog (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      area TEXT,
      address TEXT,
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      rating NUMERIC,
      review_count INTEGER,
      price TEXT,
      price_display TEXT,
      tags TEXT[],
      cuisines TEXT[],
      ambience_tags TEXT[],
      occasion_tags TEXT[],
      spice_profile TEXT,
      dietary_options TEXT[],
      photos TEXT[],
      external_place_id TEXT,
      external_provider TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_betterauth_session_user ON public."session"("userId");
    CREATE INDEX IF NOT EXISTS idx_betterauth_account_user ON public."account"("userId");
    CREATE INDEX IF NOT EXISTS idx_saved_restaurants_user ON public.saved_restaurants(user_id);
    CREATE INDEX IF NOT EXISTS idx_interactions_user_created ON public.interactions(user_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_app_events_user ON public.app_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_restaurant_city ON public.restaurant_catalog(city);

    ${readFileSync(new URL('../account-deletion.sql',import.meta.url),'utf8')}
    COMMIT;
  `;

  try {
    await pool.query(sql);
    console.log('✓ Better Auth and Palateo tables successfully migrated to Railway PostgreSQL!');
  } catch (err) {
    await pool.query('ROLLBACK;');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
