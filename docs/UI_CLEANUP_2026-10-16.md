# UI cleanup — 16 October 2026

Confirmed obsolete runtime code removed:
- Replaced restaurant-card and discovery/community renderers; the current implementations now live in their owning feature files.
- Taste controls that were inserted then removed on every home render, their event listeners and dedicated CSS.
- Illustrative SVG map themes/projection, old map bounds, obsolete 3D/zoom state and controller; the active street-map renderer remains.
- Replaced local-only action/quiz completion implementations; events call the current account-aware handlers directly, preserving the public Palateo API.
- A stale details-page patch that targeted removed markup and threw on opening a restaurant. The current details page already owns the visited/directions controls.

Validation: full regression suite, CSP, mobile build, build isolation/shared-logic equality, responsive entry UI, dietary/pass/undo/saved browser tests, account deletion and zero-vulnerability dependency audits. A deterministic browser comparison confirmed unchanged visible content for home, discover, community, saved, profile and Ask; map pins/preview/close/zoom were exercised with a mock map provider. The details-open regression is retained in work/check-diet-browser.cjs.

Active shared styles, backend/authentication, provider routing and native capabilities remain. Historical developer scripts were not treated as production runtime. No database migration or API contract change is required. Physical Android/GPS and live map-provider rendering still require device verification.
