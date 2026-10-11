# Palateo

This is the canonical Codex project for the current Palateo app and waitlist.

- Production: https://palateo.in/
- App: https://palateo.in/app/
- Editable source: `src/` ([folder guide](docs/ARCHITECTURE.md))
- Generated deployment: `work/palateo_cloudflare_pages/`
- Database migration history: `supabase/migrations/`
- Restaurant source data: `data/` and `work/venues-2026-10-07.json`
- Verification scripts: `work/check-*.cjs`
- Local responsive preview: `npm run preview:mobile`
- Release records and screenshots: `outputs/` (local only)

The frontend is vanilla HTML/CSS/JavaScript. Supabase provides authentication and data storage; Vercel hosts the frontend and waitlist API. The Vercel project remains `palateo-app` in the `palateo` team, linked to `palateo.in` and `www.palateo.in`. No new Vercel project or database was created for this Codex folder move.

## Checks

Run `npm run build` after editing source; it assembles the app and updates CSP. Run `npm run check` (Node.js required; no package install needed) and `npm run update:csp` before publishing. These commands build first. Live account and site checks need network access and the existing local test credentials.

## Publish

Run `npm run build` from the project root. Then, from `work/palateo_cloudflare_pages`, run `vercel deploy --prod --scope palateo` after authenticating with your existing Vercel account. Check the linked project before deploying. Environment and credential files are ignored by Git and Vercel; never publish or commit them.

Historical SQL is retained for review. Do not rerun migrations automatically or modify existing user data during a frontend release.

## Product and development documents

Created from the six-document structure shown in [the referenced reel](https://www.instagram.com/reel/DYMsCRLz8Ik/), adapted to the actual Palateo project. Read the relevant document before a change; current implementation and proposed work are distinguished.

1. [Product requirements (PRD)](docs/PRD.md)
2. [Technical requirements (TRD)](docs/TRD.md)
3. [UI/UX design](docs/UI_UX_DESIGN.md)
4. [App flow](docs/APP_FLOW.md)
5. [Backend schema](docs/BACKEND_SCHEMA.md)
6. [Implementation plan and task list](docs/IMPLEMENTATION_PLAN.md)

These documents are project files, outside the deployable directory. They contain no private credentials and do not change the live app.

## Edit with Antigravity or Google AI Studio

Repository: https://github.com/inovatist699/Expert-palateo

Open this repository's root folder in Antigravity, or use Google AI Studio Build's **Import from GitHub** option. Read the six documents above, and retain the existing vanilla frontend, Supabase ownership checks and recommendation behavior.

Edit the app in `src/app/`, `src/features/`, `src/services/`, `src/models/`, `src/shared/ui/` and `src/styles/`. The waitlist is in `src/waitlist/`, and its API is in `src/server/api/`. See [architecture and build instructions](docs/ARCHITECTURE.md). When importing this repository into Vercel, select **Other** and use **Root Directory: `work/palateo_cloudflare_pages`**. Build and include generated files before pushing to a static Git deployment. Use the existing `palateo/palateo-app` project for production; pushing this repository alone does not update `palateo.in` until Git deployment is configured or the existing CLI workflow is run.

Private `.env*` files, `.vercel` account/project files, test credentials, local outputs, ZIP archives and external scan-verification tokens are excluded. Authorized service credentials stay in the existing provider environment settings. A fresh clone does not include private test-account credentials or recreate the preexisting Supabase schema; see the backend document before database work.

## Verified release baseline

On 9 October 2026, deployment `dpl_BbAtKnmAjDR2sPEVhExBmLdMcvCh` published the user-selected Zestmaps-inspired app and waitlist to https://palateo.in/. The eight-question taste quiz, existing Supabase integration and reversible feedback remain connected. The layout reference includes Zest's official App Store screenshots; no verified UI video walkthrough was available in the inspected sources.

Recorded checks passed for onboarding/account isolation, feedback races and undo, recovery/email cooldown, waitlist, Sentry, live CSP/private-file protection and Supabase account-data isolation. The real browser check on the public domain completed all eight quiz steps, restored the session on reopening and changed a test venue **67% → 74% → 67%** for like then undo. App and waitlist layout checks covered 320, 375 and 1440px without page overflow or JavaScript runtime errors.

Read [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md), [the design brief](docs/ZEST_REDESIGN_BRIEF.md) and [UI/UX design](docs/UI_UX_DESIGN.md) before further frontend changes. Physical-device Safari, full screen-reader compliance and recommendation accuracy against a labelled satisfaction dataset remain unverified. Screenshots and detailed execution records are local-only in `outputs/`.
