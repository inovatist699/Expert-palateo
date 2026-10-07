# Palateo technical requirements

**Baseline: 7 October 2026.** You use this document to maintain the current Ahmedabad/Vadodara matching app and launch waitlist. It describes the inspected source, rather than a proposed replacement stack. See [backend contracts](BACKEND_SCHEMA.md), [README](../README.md), and the [restoration record](../README.md#verified-release-baseline).

## System boundary and stack

You deploy `work/palateo_cloudflare_pages/` to the existing Vercel project. Despite the folder name, the current host is Vercel. The public landing page and `/app/` use vanilla HTML, CSS, and JavaScript; the app keeps its main logic inline in [app/index.html](../work/palateo_cloudflare_pages/app/index.html). There is no frontend compilation step in the workspace package scripts.

| Responsibility | Current implementation |
| --- | --- |
| Authentication and storage | Supabase Auth, Postgres, and PostgREST; browser SDK 2.117.2 |
| Hosting and server endpoint | Vercel static files and `/api/waitlist` |
| Venue directions | External restaurant Google Maps links; dormant Leaflet/OSM helpers remain |
| Welcome email | Resend, conditional on server environment configuration |
| Error reporting | Sentry browser bundle 11.4.0; bounded server envelopes |
| Personalization | Local weighted rules and feedback features |

Clerk, Pinecone, Upstash, PostHog, and an LLM recommendation service are historical ideas without active integrations evidenced in the inspected runtime source. Paid services or upgrades require separate authorization.

## Account and catalogue flow

You must sign in and accept the current legal version before completing eight taste questions: mood, cuisine, diet, budget, spice, occasion, priority, and distance. Signup supports email confirmation; password recovery uses Supabase. Consent version, timestamp, and privacy choice live in Auth user metadata. These UI checks do not replace database authorization.

The browser persists its session through IndexedDB and localStorage, and stores application preferences in localStorage. Changing accounts resets the local profile, answers, saves, feedback, and follows. Authenticated cloud requests use owner IDs; database access also depends on grants and row level security.

You read public venues through `restaurant_catalog`, normalize them, and merge them with embedded catalogues. Database rows take precedence during city/name deduplication. Recommendations require a complete account-owned taste profile. Eligible venues have a positive rating at most five, a listed price, and pass exclusion rules for closed venues, institutional dining, certain retail listings, and named chains.

Distance uses a straight-line calculation when you allow location access and choose a numeric range; rows without valid coordinates are excluded then. Without location, you browse the selected city. Saved venues resolve independently of city and travel filters, but still require venue eligibility.

## Matching behavior

`rec()` computes a weighted mean of available preference factors, then starts with `55 + 36 × weightedMean`. Missing information is generally neutral or omitted. Generic Restaurant/Fast food/Food court labels do not establish a known cuisine mismatch.

| Factor | Weight | Matching rule |
| --- | --- | --- |
| Cuisine | 24 | Match +1; known mismatch −0.7 |
| Budget | 20 | Same band +1; adjacent −0.15; larger gap −0.8 |
| Dietary options | 22 | Match +1; known conflict −1; unknown 0 |
| Ambience | 14, or 20 for ambience priority | Match +1; known mismatch −0.55 |
| Occasion | 12 | Match +1; known mismatch −0.6 |
| Spice | 8 | Match +1; mismatch −0.65; “depends” omitted |
| Unique/value priority | 8 | Conditional feature/value factor |

Food priority adds `(rating − 4) × 2`. Review counts add 1.5 at 100 or more, or 0.75 at 30–99. A deterministic novelty term contributes an adjustment from zero to less than 1.35. These are heuristic adjustments, not calibrated probabilities.

Learning rebuilds from current feedback using unique, lowercase, trimmed cuisine/tag/ambience/occasion features: like +1, pass −1.5, visited +2. Each feature contributes a bounded learned adjustment; the aggregate is limited to ±6. The venue’s own contribution is subtracted before shared learning, preventing double counting.

The baseline is bounded to 1–96. Direct feedback then adds **like +7, pass −18, visited +4**, before rounding and bounding to 1–99. Tapping the active action again removes it and rebuilds learning. Saves maintain your shortlist rather than changing taste signals. Legacy `confidence` stores answer completeness; the Home summary uses a real top venue match.

## Synchronization and failures

Feedback updates immediately, then enters a serial cloud queue. Owner checks reject stale account results; answer-reference and feedback-revision checks protect newer local changes from cloud loads. Interaction replay follows timestamp/ID order and recognizes undo metadata. Unsynced feedback remains local. Save failures restore the previous shortlist; embedded venues without database IDs remain device-only.

The [waitlist endpoint](../work/palateo_cloudflare_pages/api/waitlist.js) validates POST JSON, origin when supplied, a 2 KB body limit, email, allowed city, consent, and honeypot. It calls a narrow database RPC, then conditionally claims and sends a welcome email. Storage success survives email failure. See the backend document for status codes and database budgets.

## Operations and limitations

You update the inline-script CSP hash when changing app JavaScript; [vercel.json](../work/palateo_cloudflare_pages/vercel.json) sets CSP and other response headers. [monitoring.js](../work/palateo_cloudflare_pages/monitoring.js) disables tracing, replay, automatic sessions, and breadcrumbs, and sanitizes error events with a five-event page cap.

Retain historical SQL and inspect the live schema before database work. Base app table definitions are incomplete locally, and this documentation pass did not introspect production or apply migrations. The restoration record reports prior verification; no runtime checks were performed for these documents. Recommendation accuracy, complete venue freshness, physical-device Safari behavior, cross-device conflict resolution, and security are not guaranteed. Community profiles remain samples; deletion and privacy requests use the existing contact process.
