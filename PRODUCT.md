# Palateo

<!-- impeccable:product-schema 1 -->

## Platform and stack

Web app and public waitlist, using existing vanilla HTML, CSS and JavaScript. Hosted on Vercel (`palateo-app`, team `palateo`); Supabase supplies authentication, profiles, taste preferences, activity and saved places. Resend sends existing transactional email; Sentry supplies bounded, scrubbed error reporting.

## Users and jobs

People choosing cafés and restaurants based on cuisine, budget, dietary preference, mood, spice, occasion and travel range. The initial launch focus is Ahmedabad and Vadodara; the existing beta catalogue also exposes other Indian cities. Catalogue availability and prices are snapshots, not live guarantees.

## Confirmed workflow

Sign in, accept the existing policy consent, answer eight taste questions, see ranked places and estimated percentage matches. Like, pass and visit shape the estimates; clicking the same feedback again undoes it. Saving keeps a shortlist. Reopening restores the account and its cloud profile. Quiz onboarding must never require a bank account, card access or Plaid.

## Brand commitment

The user explicitly chose Zestmaps as the reference for the whole frontend, palette, UI/UX and waitlist on 9 October 2026. Keep Palateo's own branding, content and backend. This replaces the earlier cream/green visual contract.

## Constraints and truth

- Preserve ownership checks, RLS, session persistence, validation and error handling.
- No service-role, mail or monitoring secrets in public files.
- Matches are heuristic estimates, not measured prediction accuracy.
- Area-overview maps are approximate; external restaurant Directions links provide navigation.
- Waitlist previews are illustrative and must not impersonate a visitor's personalized results.
- Public launch signup accepts Ahmedabad, Vadodara or Other, with explicit email consent.
- Free services and existing dependencies only; no new paid integration.
- Native labels, keyboard focus, readable contrast, compact mobile quiz and reduced motion.

## Operator

Aayush Mittal; public contact palateo.com@gmail.com. Existing legal policies retain the supplied address and consent handling.

## Open evidence

Recommendation quality is covered by deterministic regression checks but has not been calibrated against a real-world user outcome dataset. Physical iOS/Android hardware and full assistive-technology coverage remain unverified.
