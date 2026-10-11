# TOOLS & OPERATIONAL SCRIPTS: Palateo

This document specifies the tools, test commands, scripts, and deployment routines available in the Palateo workspace for OpenClaw agents.

---

## 1. Quality & Verification Gates

### Run All Standard Checks
Runs JavaScript linting, CSP checks, schema checks, and repository verification:
```bash
npm run check
# or directly:
node scripts/build.cjs
node work/check-all.cjs
```

### Update Content Security Policy (CSP)
Mandatory after modifying app JavaScript source under `src/`:
```bash
npm run update:csp
# or directly:
node scripts/build.cjs
node work/check-taste-onboarding.cjs --update-csp
```

### Live Public Domain Check
Runs network verification on the production URL (`https://palateo.in`):
```bash
npm run check:live
# or directly:
node work/check-palateo-live.cjs
```

### Mobile Responsive Preview Server
Builds source, then serves local preview on port `8771` to inspect responsive layouts:
```bash
npm run preview:mobile
# or directly:
node scripts/build.cjs
node work/preview-mobile-taste.cjs
```

---

## 2. Directory Layout & Architecture

- **Editable frontend**: `src/app/`, `src/features/`, `src/models/`, `src/services/`, `src/shared/ui/`, `src/styles/`
- **Waitlist & marketing**: `src/waitlist/`
- **API functions**: `src/server/api/`
- **Generated deployment**: `work/palateo_cloudflare_pages/`
- **Architecture and Graphify source map**: `docs/ARCHITECTURE.md`, `graphify-out/modular-source/`
- **Database Migrations**: `supabase/migrations/`
- **Venue & Taste Data**: `data/` and `work/venues-2026-10-07.json`
- **Verification Suites**: `work/check-*.cjs`
- **Product & Tech Specs**: `docs/` (`PRD.md`, `TRD.md`, `UI_UX_DESIGN.md`, `APP_FLOW.md`, `BACKEND_SCHEMA.md`, `IMPLEMENTATION_PLAN.md`)

---

## 3. Production Deployment Commands

Production is hosted on Vercel (`palateo-app` under the `palateo` team):
```bash
cd work/palateo_cloudflare_pages
vercel deploy --prod --scope palateo
```
*(Requires authenticated Vercel CLI session. Never run without passing verification checks first.)*

---

## 4. OpenClaw CLI Commands

### Agent Management
```bash
# Register this workspace as the palateo agent
openclaw agents add palateo --workspace "c:\Users\Aayush\Documents\ChatGPT\Palateo"

# List all registered agents
openclaw agents list

# Set default workspace globally
openclaw config set agents.defaults.workspace "c:\Users\Aayush\Documents\ChatGPT\Palateo"
```

### Gateway & Diagnostics
```bash
# Check OpenClaw health and configuration
openclaw doctor

# Inspect running gateway status
openclaw gateway status

# Restart gateway to reload workspace changes
openclaw gateway restart
```
