# CLAUDE.md: Palateo Coding Guide & Instructions

## Project Overview
Palateo is a taste-first restaurant curation and recommendation platform (production: https://palateo.in/).
- **App Source**: `src/app/`, `src/features/`, `src/services/`, `src/models/`, `src/shared/ui/`, `src/styles/` (Vanilla HTML/CSS/JavaScript; see `docs/ARCHITECTURE.md`)
- **Waitlist & API**: `src/waitlist/`, `src/server/api/`
- **Generated deployment**: `work/palateo_cloudflare_pages/`; do not edit generated files directly
- **Database & Auth**: Supabase (`supabase/migrations/`, `docs/BACKEND_SCHEMA.md`)
- **Hosting**: Vercel (project `palateo-app`, team `palateo`)

---

## Essential Commands

```bash
# Run local verification test suite (Node.js required, zero extra npm installs)
npm run check

# Build source and update Content Security Policy (MANDATORY after changing app JS)
npm run update:csp

# Launch local mobile taste preview
npm run preview:mobile

# Run live account & endpoint checks
npm run check:live
```

---

## Coding Protocols & Architecture Rules

1. **Vanilla Frontend Simplicity**:
   - The app frontend is vanilla HTML/CSS/JS. Do not introduce bloated npm build pipelines, Webpack, or Vite unless explicitly instructed.
   - Keep JavaScript clean, performant, and scoped.
2. **CSP Integrity**:
   - Edit source under `src/`, then run `npm run update:csp`. The dependency-free build assembles the original shared-scope script order and updates the Vercel SHA-256 script hash. Keep the ordered `src/app/manifest.json` intact unless dependency changes require an update.
3. **Supabase & Security**:
   - Maintain Row Level Security (RLS) and ownership checks.
   - Never expose service role keys in client code.
   - Check `docs/BACKEND_SCHEMA.md` before altering database queries or data models.
4. **Autonomous Engineering Cycle**:
   - **Explore**: Inspect relevant files before writing code.
   - **Plan**: Formulate atomic 2–3 step micro-plans.
   - **Act**: Apply targeted, surgical modifications.
   - **Verify**: Always run `npm run check` and verify the result before declaring completion.
5. **Git & Commit Hygiene**:
   - Keep git diffs minimal. Never leave dead code, `console.log` noise, or uncommented temporary code.
