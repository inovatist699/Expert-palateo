# Palateo Backend & Authentication: Railway + Better Auth

This guide explains how to connect and deploy Palateo's backend with **Better Auth** and **Railway**.

---

## 1. Architecture Overview

- **Auth Engine**: [Better Auth](https://better-auth.com) — modern, TypeScript/ESM, framework-agnostic auth with native session management, email/password, CSRF protection, and Bearer token support.
- **Backend Service**: Dedicated Node.js + Express backend (`server/index.js`) providing:
  - Better Auth endpoints at `/api/auth/*`
  - Hydration and taste profile synchronization at `/api/user/*`
  - Restaurant catalog queries at `/api/catalog`
  - Waitlist signups at `/api/waitlist`
  - Palo AI culinary companion endpoint at `/api/palo`
  - Railway health checks at `/health`
- **Database**: PostgreSQL on Railway (via `DATABASE_URL`), with fallback in-memory stores for offline local preview.
- **Frontend Connector**: `src/services/better-auth-client.js` integrates seamlessly with Palateo's HTML/JS frontend shell.

---

## 2. Seeded Account Credentials

As configured:
- **Email**: `palateo@gmail.com` (or shorthand `palateo@gmail`)
- **Password**: `Palateo@1234`
- **Role**: Founder / Admin with onboarding already complete

On server startup, this account is automatically initialized if it does not already exist.

---

## 3. Deploying to Railway (Step-by-Step)

### Step 1: Create a Railway Project
1. Log in to [railway.app](https://railway.app).
2. Click **New Project** -> **Provision PostgreSQL**.
3. Railway will provision a managed PostgreSQL database and inject the `DATABASE_URL` variable.

### Step 2: Deploy the Palateo Backend Service
1. In the same Railway project, click **New** -> **GitHub Repo** -> select your `Palateo` repository (or run `railway up` via Railway CLI).
2. Railway reads `railway.json` or `Dockerfile`:
   - **Start Command**: `node server/index.js`
   - **Healthcheck Path**: `/health`

### Step 3: Set Environment Variables on Railway
In your Railway backend service settings, add the following variables:

| Variable | Value | Description |
|---|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Auto-linked from Railway Postgres |
| `BETTER_AUTH_SECRET` | *(Generate a 32+ char random string)* | Encryption secret for sessions & tokens |
| `BETTER_AUTH_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` | Your Railway public URL (e.g. `https://palateo-backend.up.railway.app`) |
| `PORT` | `3000` | Injected by Railway automatically |
| `NODE_ENV` | `production` | Production mode |
| `RESEND_API_KEY` | *(Optional)* | For transactional emails |

### Step 4: Run Database Migrations
Once the database is linked, run the migration script either from Railway's CLI or locally with your Railway connection string:

```bash
npm run server:migrate
```

This creates all Better Auth tables (`user`, `session`, `account`, `verification`) and Palateo domain tables (`profiles`, `taste_profiles`, `saved_restaurants`, `interactions`, `app_events`, `launch_waitlist`, `restaurant_catalog`).

---

## 4. Connecting the Frontend to Railway

In the Palateo web app, you can switch between backends or connect Railway in any of the following ways:

### Option A: Via Browser Console
Open Developer Tools in the browser and run:
```javascript
Palateo.connectRailway("https://palateo-backend.up.railway.app");
```
(Or locally: `Palateo.connectRailway("http://localhost:3000");`)

### Option B: Automatic Environment Injection
Set `window.PALATEO_API_URL = "https://palateo-backend.up.railway.app"` or save it to `localStorage.setItem('palateo_backend_url', 'https://palateo-backend.up.railway.app')`.

### Option C: Sign In Prompt
When Railway is active, the sign-in modal displays `Palateo cloud · Railway (Better Auth)` and connects directly to Better Auth endpoints.

---

## 5. Local Development Commands

```bash
# Start backend server locally (port 3000)
npm run server:start

# Start backend server in watch mode
npm run server:dev

# Run full repository check suites (including Better Auth & Railway)
npm run check

# Rebuild frontend bundle and regenerate CSP
npm run build
```
