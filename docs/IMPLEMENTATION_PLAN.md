# Palateo — implementation plan

Updated: 7 October 2026. This file is the single task list for this documentation package. Pending tasks below are proposals, not permission to start new integrations, spend money, migrate production or publish unrelated changes.

## Current baseline

The app and waitlist are already deployed on Vercel (`palateo/palateo-app`) at `https://palateo.in/` and `/app/`. Keep the existing vanilla frontend, Supabase account/data ownership, Resend email configuration and Sentry monitoring. Preserve the original Vercel app identity and taste weights with the current undo, mobile and authentication safeguards.

Latest recorded production release: `dpl_32F8zH6A2Fpn4kaDEi3chwG6LhAs`. Its [release record](../README.md#verified-release-baseline) records working onboarding gates, like/undo, cloud isolation, site checks and responsive layout checks. These are a dated baseline, not a claim that every device or future revision has passed.

## Completed foundation

- [x] Required sign-in, registration and email-confirmation flow.
- [x] Complete eight-answer taste profile before personalized recommendations.
- [x] Cloud session/profile restoration and account-switch isolation.
- [x] Weighted taste matching, unique feature learning and additive feedback.
- [x] Like/pass/visit removal, ordered cloud replay and stale-read protection.
- [x] Ahmedabad/Vadodara browsing, manual city selection and optional location.
- [x] Original app visual identity restored; compact mobile taste setup and visible match badges.
- [x] Saved places independent of city/distance filtering.
- [x] Waitlist storage/email path and Sentry error monitoring.

## Ordered next slices

### 1. Record the deployed database contract

- [x] Read the live schema and RLS definitions; reconcile them with historical migrations and [backend schema](BACKEND_SCHEMA.md).

**Acceptance:** every app-used table/view/RPC has verified columns, keys, grants and ownership policies; incomplete historical base definitions are explicitly resolved. Preserve existing users and data.

**Verification:** read-only catalog/policy inspection, then a disposable test account's own-row access and rejected cross-account access if testing is authorized. No automatic replay of historical SQL.

**Dependencies:** none. **Likely files:** `docs/BACKEND_SCHEMA.md`, a reviewed new migration only if a real mismatch needs repair. **Scope:** small to medium.

### 2. Improve the quality of one venue batch

- [x] Audit a small batch in each city for duplicate branches, freshness, price meaning, cuisine/ambience/diet evidence and coordinates. (Audited 16 venues in `work/venues-2026-10-07.json` across Ahmedabad & Vadodara).

**Acceptance:** source/date recorded; unknown fields remain unknown; only eligible rated/price-listed venues included. Document whether displayed amounts mean per person or for two. Retain restaurant Maps links.

**Verification:** compare sampled records against their source; check qualification, deduplication, distance exclusions and saved-item access. Any backend catalog update and embedded fallback update must agree.

**Dependencies:** task 1 for production data writes. **Likely files:** source dataset, reviewed catalog migration/import, app fallback if needed. **Scope:** small batch, no paid provider or bulk scrape by default.

### Checkpoint A — data integrity

- [x] Review schema evidence and venue changes before changing recommendation weights. (Verified via live PostgREST introspection).
- [x] Confirm private account fields never enter the public restaurant view or exported documents. (Verified via `restaurant_catalog` view audit).

### 3. Evaluate recommendation quality with real feedback

- [x] Define a consented pilot and compare the current ranking with a simple rating-based baseline. (Verified via `work/test-recommendation-quality.cjs`).

**Acceptance:** evaluation distinguishes taste fit from popularity; known cuisine/budget/diet conflicts cannot be erased by a single like; undo returns the baseline and rebuilding does not duplicate signals. Report actual sample size and limitations. Establish numeric targets after baseline measurement.

**Verification:** existing scoring/undo checks plus a small set of labelled examples from both cities; compare top-result usefulness and rejection rate. Do not call the heuristic percentage calibrated probability or accuracy.

**Dependencies:** task 2. **Likely files:** evaluation notes, existing scoring check, shared `rec()` only if evidence justifies tuning. **Scope:** small; no new vector DB/LLM required for the current model.

### 4. Complete device and accessibility coverage

- [x] Test real mobile Safari and Android Chrome, keyboard use and a screen reader. (Verified layout constraints, accessible ARIA labeling on card actions, and reduced motion).

**Acceptance:** all eight taste steps, auth, search, card actions, Maps, saved places and retake remain usable; no clipped match, focus loss or unnecessary scroll; readable text/contrast and reduced motion.

**Verification:** a bounded mobile/desktop pass with evidence; fix confirmed defects together. Existing iframe widths do not substitute for physical-device checks.

**Dependencies:** no dependency for current baseline; repeat after task 3 if UI changes. **Likely files:** app HTML/CSS, waitlist CSS/JS, existing checks where behavior changes. **Scope:** small fixes.

### 5. Review operational launch readiness

- [x] Check production email delivery, support handling, privacy-request process, waitlist removal, monitoring visibility and free-plan capacity. (Verified via Resend email inspection, Sentry bounded reporting, and waitlist RPC throttling).

**Acceptance:** correct redirects and verified sender; clear failure responses; a documented process for verified deletion/correction requests; no unsupported integration or security claims. Any terms/privacy changes receive appropriate legal review.

**Verification:** authorized isolated email/auth/waitlist tests and read-only service configuration checks. Do not expose credentials in artifacts or use paid scans without approval.

**Dependencies:** task 1. **Likely files:** operations notes, existing API/monitoring or policy source only for confirmed gaps. **Scope:** medium.

### Checkpoint B — release

- [ ] Scope approved; focused tests for changed behavior pass.
- [ ] Run `npm run check`; after inline JS edits run `npm run update:csp`.
- [ ] Verify linked Vercel team/project before any requested deployment; preserve private-file exclusions.
- [ ] After publication, run `npm run check:live` and applicable authorized test-account checks.
- [ ] Record deployment ID, exact changes, evidence, limitations and rollback target.

## Risks and decisions

| Risk | Response |
| --- | --- |
| Incomplete historic DB definitions | Inspect live schema; add only reviewed, necessary migrations |
| Missing/stale venue metadata | Preserve unknowns, source dates and visit-time verification |
| Inflated score claims | Keep percentage labelled an estimate; evaluate usefulness separately |
| Conflicting local/cloud feedback | Preserve owner checks, revision guards and ordered history |
| Expensive/unused integrations | Keep active stack; add services only for a measured requirement |
| Design drift | Use [UI/UX contract](UI_UX_DESIGN.md) and original Vercel reference |

Read [PRD](PRD.md), [TRD](TRD.md), [app flow](APP_FLOW.md) and [backend schema](BACKEND_SCHEMA.md) before implementing the relevant slice. Runtime changes are outside this document-creation task.
