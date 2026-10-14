# Source architecture

Open `C:/Users/Aayush/Documents/ChatGPT/Palateo` in Codex. Edit `src/`, then run `npm run build`. The build writes the existing Vercel deployment directory, `work/palateo_cloudflare_pages/`, and updates the app's CSP hash. No package installation is required.

Web and Android use separate build outputs and CI workflows. `npm run mobile:build` assembles shared source into ignored `mobile/.web-build/` and packages `mobile/www/` without accessing the web deployment directory. `npm run check:builds` verifies this isolation. Release policy and the scheduled maintenance agent are documented in `docs/MAINTENANCE.md`.

## Folder responsibilities

```text
Palateo/
  src/
    app/                  HTML shell, ordered manifest, navigation, wiring, startup
    core/                 Shared application state
    models/               Cities, people and venue data/eligibility
    features/
      auth/               Sign in, signup, consent, recovery and session listener
      quiz/               Questions, onboarding controller and cloud sync
      calibration/        Dish preferences, scoring and feedback controls
      recommendations/    Match engine, reversible feedback and serial sync
      location/           City selection and device location
      map/                Street-map rendering and map controls
      place/              Restaurant details and return navigation
      home/ discover/     Recommendation and discovery views
      saved/ people/      Saved places and sample community views
      profile/            Personal taste profile
    services/             Supabase, storage, repositories, interactions, monitoring
    shared/ui/            Restaurant cards, display helpers and logo animation
    styles/               CSS in its original cascade order, plus final theme
    waitlist/             Public landing page, styles and signup controller
    server/api/           Vercel waitlist endpoint
    legal/                Privacy and terms pages
    pages/                Founder page
    resources/public/     Logo, social image, robots, sitemap and pinned Sentry vendor
  config/vercel.json      Public deployment/security header configuration
  scripts/build.cjs       Dependency-free source assembly
  supabase/migrations/    Existing database migration history
  work/                   Existing verification tools and generated deployment
  graphify-out/
    modular-source/       Current source graph, visual explorer and health report
  docs/                   Product, architecture and operational references
```

## iOS organization principles

This is a web implementation of the separation Apple describes in [App organization](https://developer.apple.com/documentation/swiftui/app-organization) and [Managing model data](https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app). Apple does not prescribe one universal folder layout. Here, app composition belongs in `app/`, model data in `models/` and `core/`, views/controllers in `features/`, reusable presentation in `shared/ui/`, and external I/O in `services/`.

The shared web runtime is packaged by Capacitor in mobile/ios and mobile/android. Run npm run mobile:sync before native compilation; mobile/README.md describes CI, signing and release checks.

## Build contract

`src/app/manifest.json` declares script order, inline style slots and explicit public asset destinations. `src/app/shell.html` is the page markup; its placeholders are filled by `scripts/build.cjs`. The assembled script is syntax checked, its browser-normalized SHA-256 is inserted into CSP, and only the listed public files are copied. Private `.env*`, `.vercel` account configuration, outputs and database migrations are never copied from source.

The JavaScript files are ordered **shared-scope fragments**, not independent ES modules. Existing declaration order, function overrides and event bindings are preserved exactly. In particular, `app/legacy-actions.js`, `app/wiring.js` and `features/auth/listener.js` still participate in startup. Do not reorder or remove fragments without tracing their dependencies and running checks. Further conversion to ES modules would be a separate behavior-sensitive refactor.

The initial build was byte-identical to the 11 October release app. The 14 copied public resources also matched their source files exactly. Keeping the compiled output bundled retains the current CSP and deployment behavior; the editable files are now separated.

## Start here when editing

| Change | First files |
| --- | --- |
| Signup/login/session | `features/auth/controller.js`, `service.js`, `listener.js`; `services/supabase-client.js` |
| Quiz or diet options | `features/quiz/questions.js`, `controller.js`; `features/recommendations/engine.js` |
| Match percentages or like undo | `features/recommendations/engine.js`, `feedback.js`, `sync.js` |
| Dish calibration | `features/calibration/model.js`, `controller.js` |
| Map and restaurant details | `features/map/views.js`; `features/place/controller.js`, `views.js` |
| Palette/layout | `styles/theme.css`, relevant earlier style fragment, feature view |
| Waitlist/email storage | `waitlist/controller.js`; `server/api/waitlist.js` |
| Data and ownership | `services/user-repository.js`, `catalog-repository.js`; backend schema and migration history |

Paths in this table are relative to `src/`.

## Commands and publishing

```sh
npm run build          # Assemble source and regenerate CSP
npm run check          # Build, then run the existing six regression suites
npm run update:csp     # Build, then independently verify/update CSP
npm run preview:mobile # Build, then serve the existing local preview on port 8771
npm run check:live     # Build, then run authorized live checks
```

For the current manual Vercel workflow, build from this root before deploying `work/palateo_cloudflare_pages/` to the existing `palateo/palateo-app` project. The deployment folder name is historical; hosting remains Vercel. A static Git deployment rooted in that folder uses the committed generated files, so build and include them with any source change before pushing. Do not edit generated files directly: rebuilding replaces them. Do not automatically rerun SQL during a frontend build or deploy.

## Graphify evidence and limits

The historical root graph helped trace authentication, quiz, home and recommendations before splitting; its old line numbers are retained only as historical evidence. The fresh [modular-source graph report](../graphify-out/modular-source/GRAPH_REPORT.md) indexes 54 first-party JavaScript/build files, with 218 nodes and 231 edges. The [interactive explorer](../graphify-out/modular-source/graph.html) and [raw extraction](../graphify-out/modular-source/extraction.json) are local development artifacts.

The health report has no dangling/missing endpoints or self-loops. It identifies six same-endpoint relation variants that can be collapsed by Graphify's simple graph representation; the raw extraction retains those records. `app/compatibility.js` and `app/wiring.js` contain assignments/configuration rather than symbols and are not fully modeled. Runtime wiring and shared global dependencies still require reading the ordered manifest and source. This graph is an architecture aid, not a security certification.
