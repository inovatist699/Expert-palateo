# Graph Report - Palateo  (2026-10-09)

## Corpus Check
- Corpus is ~25,436 words - fits in a single context window. You may not need a graph.

## Summary
- 225 nodes · 465 edges · 24 communities (17 shown, 7 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.85)
- Token cost: 16,500 input · 3,400 output

## Community Hubs (Navigation)
- Account Gates and Session
- Catalogue and State
- Waitlist Form and Motion
- Taste and Feedback Sync
- Live Auth and Page Checks
- Recommendation Checks
- Monitoring Checks
- Taste Onboarding Checks
- Waitlist API and Checks
- Home and Map Rendering
- Account Launch Checks
- Live Auth Email Checks
- Shared Restaurant Cards
- Check Runner
- Palate Profile Rendering
- Ranking and Features
- Landing Quiz Demo
- CSP Hash Update
- App Logo Reveal
- Venue Normalization and Photos
- Landing Asset References
- Live Check Command
- Mobile Preview Command

## God Nodes (most connected - your core abstractions)
1. `app-inline.js` - 114 edges
2. `go()` - 28 edges
3. `persist()` - 21 edges
4. `toast()` - 15 edges
5. `home()` - 15 edges
6. `initV5()` - 15 edges
7. `esc()` - 14 edges
8. `onboard()` - 14 edges
9. `signUpV5()` - 13 edges
10. `signInV5()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `app-inline.js` --references--> `Global CSP: self, explicit app inline script hash, jsdelivr; script-src-attr none`  [EXTRACTED]
  work/palateo_cloudflare_pages/app/index.html → work/palateo_cloudflare_pages/vercel.json
- `npm run update:csp: work/check-taste-onboarding.cjs --update-csp` --references--> `Global CSP: self, explicit app inline script hash, jsdelivr; script-src-attr none`  [EXTRACTED]
  package.json → work/palateo_cloudflare_pages/vercel.json
- `#motion-toggle aria-pressed motion pause control` --conceptually_related_to--> `CSS --rx/--ry and .motion-ready .reveal.visible .motion-paused; prefers-reduced-motion`  [INFERRED]
  work/palateo_cloudflare_pages/index.html → work/palateo_cloudflare_pages/waitlist.css
- `CSS --rx/--ry and .motion-ready .reveal.visible .motion-paused; prefers-reduced-motion` --references--> `.reveal content sections`  [EXTRACTED]
  work/palateo_cloudflare_pages/waitlist.css → work/palateo_cloudflare_pages/index.html
- `CSS --rx/--ry and .motion-ready .reveal.visible .motion-paused; prefers-reduced-motion` --references--> `.scene animated preview`  [EXTRACTED]
  work/palateo_cloudflare_pages/waitlist.css → work/palateo_cloudflare_pages/index.html

## Import Cycles
- None detected.

## Communities (24 total, 7 thin omitted)

### Community 0 - "Account Gates and Session"
Cohesion: 0.13
Nodes (42): acceptLegalConsent(), authErrorMessage(), closeAuth(), connectBackend(), consentControls(), ensureBackend(), finish(), follow() (+34 more)

### Community 1 - "Catalogue and State"
Cohesion: 0.09
Nodes (22): app-inline.js, allMetroVenues, authStorageRequest(), catalog, CITY_MAP_BOUNDS, CITY_MAP_THEMES, cityCenters, curatedAdditions (+14 more)

### Community 2 - "Waitlist Form and Motion"
Cohesion: 0.12
Nodes (13): #city name=city required select with metropolitan cities, Required name=consent privacy checkbox, #email name=email type=email required maxlength=254, #form-status role=status aria-live=polite, #motion-toggle aria-pressed motion pause control, .reveal content sections, .scene animated preview, #waitlist-form (+5 more)

### Community 3 - "Taste and Feedback Sync"
Cohesion: 0.20
Nodes (15): activeRestaurant(), finishV5(), hasTasteAnswers(), hasTasteProfile(), learn(), maps(), mapsV5(), rate() (+7 more)

### Community 4 - "Live Auth and Page Checks"
Cohesion: 0.18
Nodes (7): fs, html, path, assert, crypto, fs, path

### Community 5 - "Recommendation Checks"
Cohesion: 0.17
Nodes (9): assert, context, dir, fs, html, nodes, path, script (+1 more)

### Community 6 - "Monitoring Checks"
Cohesion: 0.17
Nodes (11): assert, captures, context, event, fs, handler, path, root (+3 more)

### Community 7 - "Taste Onboarding Checks"
Cohesion: 0.17
Nodes (10): assert, context, crypto, dir, fs, html, nodes, path (+2 more)

### Community 8 - "Waitlist API and Checks"
Cohesion: 0.20
Nodes (7): assert, call(), fs, handler, path, root, {randomUUID}

### Community 9 - "Home and Map Rendering"
Cohesion: 0.27
Nodes (11): calculateArchetype(), esc(), home(), loadMoreHome(), personCard(), photo(), projectCoords(), renderZestMapSvg() (+3 more)

### Community 10 - "Account Launch Checks"
Cohesion: 0.20
Nodes (8): assert, crypto, file, fs, headers, html, path, root

### Community 11 - "Live Auth Email Checks"
Cohesion: 0.25
Nodes (5): assert, fs, html, path, root

### Community 12 - "Shared Restaurant Cards"
Cohesion: 0.38
Nodes (7): card(), cityName(), discover(), drawDiscover(), filter(), setDiscoverCuisine(), travelRangeNote()

### Community 13 - "Check Runner"
Cohesion: 0.33
Nodes (4): npm run check: work/check-all.cjs, path, scripts, { spawnSync }

### Community 14 - "Palate Profile Rendering"
Cohesion: 0.40
Nodes (6): dietLabel(), displayPrice(), feedbackCount(), price(), profile(), summaryChips()

### Community 15 - "Ranking and Features"
Cohesion: 0.67
Nodes (3): ranked(), rec(), restaurantFeatures()

### Community 16 - "Landing Quiz Demo"
Cohesion: 0.67
Nodes (3): #interactiveQuizWidget, .quiz-pill-group data-group and .quiz-pill data-spice/data-vibe/data-city, #archetypeName #archetypeDesc #matchedVenueName #matchedVenueArea

## Knowledge Gaps
- **90 isolated node(s):** `{ spawnSync }`, `path`, `scripts`, `fs`, `path` (+85 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 107 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `go()` connect `Account Gates and Session` to `Home and Map Rendering`, `Taste and Feedback Sync`, `Shared Restaurant Cards`, `Palate Profile Rendering`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `app-inline.js` (e.g. with `connectBackend()` and `ensureBackend()`) actually correct?**
  _`app-inline.js` has 8 INFERRED edges - model-reasoned connections that need verification._
- **What connects `{ spawnSync }`, `path`, `scripts` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Account Gates and Session` be split into smaller, more focused modules?**
  _Cohesion score 0.13472706155632985 - nodes in this community are weakly interconnected._
- **Why does `home()` connect `Home and Map Rendering` to `Shared Restaurant Cards`, `Palate Profile Rendering`, `Ranking and Features`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `go()` (e.g. with `discover()` and `home()`) actually correct?**
  _`go()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Should `Catalogue and State` be split into smaller, more focused modules?**
  _Cohesion score 0.08547008547008547 - nodes in this community are weakly interconnected._
## Scope and limitations

This is a bounded source snapshot before frontend redesign. App inline JavaScript was extracted to a virtual sidecar and remapped to original HTML source lines. Source line positions can shift after redesign. Semantic token counts are subagent estimates, not API billing. No paid model API was used.

Graph health: 40 parallel relationship edges share directed endpoints (for example contains plus calls); the DiGraph visualization collapses them. Full 505-edge extraction is retained in extraction.json; there are no dangling or missing endpoints, exact duplicates, or self-loops. Vendor Sentry internals, private .env files, .agents, docs, data and generated outputs were excluded.
