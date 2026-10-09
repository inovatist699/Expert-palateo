# MEMORY: Palateo Knowledge Base & Baseline State

## 1. Verified Release Baseline (9 October 2026)
- **Deployment ID**: `dpl_BbAtKnmAjDR2sPEVhExBmLdMcvCh`
- **Live URLs**:
  - Landing / Waitlist: `https://palateo.in/`
  - Web App: `https://palateo.in/app/`
- **Core Functionality Tested & Passing**:
  - 8-question taste quiz with session persistence.
  - Supabase authentication & account-level data isolation.
  - Reversible feedback loop: Like -> Venue recommendation score increases (e.g. 67% -> 74%), Undo -> reverts cleanly (74% -> 67%).
  - Error recovery, cooldowns, Sentry telemetry, and strict CSP protection.
  - Mobile layouts (320px, 375px, 1440px) verified free of horizontal overflows and JS runtime exceptions.

## 2. Technology Stack & Hosting
- **Frontend**: Vanilla HTML5, modern CSS, modular JavaScript (no heavy frontend framework like React/Next.js).
- **Backend & Auth**: Supabase (PostgreSQL with Row Level Security, email auth).
- **Deploy Target**: Vercel (`palateo-app` project, `palateo` team scope) serving `work/palateo_cloudflare_pages/`.

## 3. Strict Development Rules
- **No Secrets in Git**: `.env*` files, local credential caches, and private tokens must never be committed.
- **CSP Invariant**: Any script change inside `work/palateo_cloudflare_pages/app/index.html` requires `npm run update:csp` so sha256 script hashes match the HTTP Content-Security-Policy header.
- **Database Safety**: Never run arbitrary migration rollbacks or mutate existing production records directly.
