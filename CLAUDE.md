# CLAUDE.md: Palateo Coding Guide & Instructions

## Project Overview
Palateo is a taste-first restaurant curation and recommendation platform (production: https://palateo.in/).
- **App Source**: `work/palateo_cloudflare_pages/app/index.html` (Vanilla HTML/CSS/JavaScript)
- **Waitlist & API**: `work/palateo_cloudflare_pages/`
- **Database & Auth**: Supabase (`supabase/migrations/`, `docs/BACKEND_SCHEMA.md`)
- **Hosting**: Vercel (project `palateo-app`, team `palateo`)

---

## Essential Commands

```bash
# Run local verification test suite (Node.js required, zero extra npm installs)
npm run check

# Update Content Security Policy (MANDATORY after modifying inline JS in app/index.html)
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
   - If inline `<script>` tags in `work/palateo_cloudflare_pages/app/index.html` are modified, you MUST immediately run `npm run update:csp` so the Vercel/Cloudflare headers reflect the correct SHA-256 script hashes.
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
