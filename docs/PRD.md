# PRD: Palateo local food discovery

**Status:** Draft planning baseline · **Owner:** Aayush Mittal · **Updated:** 7 October 2026

## User value and problem

Palateo helps people in Ahmedabad and Vadodara find cafés and restaurants that fit their taste, budget and occasion, understand why a place appears, and keep a shortlist for later. Eight taste answers and reversible feedback shape recommendations; optional location narrows travel range. This is the proposed user promise, not a measured claim about recommendation accuracy.

The hypothesis is that generic ratings leave people comparing places that do not match their preferences. The implementation demonstrates the workflow; no interview dataset, adoption baseline or satisfaction study is supplied. Aayush should validate the hypothesis with at least five problem interviews before committing significant additional scope.

## Current product baseline

- `/` is a public, free waitlist collecting email, city and affirmative launch-email consent. Joining does not create an app account or verify email ownership.
- `/app/` requires Supabase email/password authentication, email confirmation, current legal acceptance and all eight valid taste answers before personalised scores appear.
- Home, Discover, Saved, Profile and illustrative People screens exist. Recommendations use weighted preferences and feedback; percentages are estimates, not measured AI accuracy.
- Manual Ahmedabad/Vadodara selection, optional browser location, reversible like/pass/visited, saves and external Google Maps directions exist.
- The original Vercel identity remains `palateo/palateo-app`; the deployment source retains its historical `palateo_cloudflare_pages` directory name.

## Goals and proposed measurement

These are discovery targets for approval, not achieved results. Baselines are unknown; measurement must distinguish waitlist subscribers, verified accounts and completed taste profiles.

| Hypothesis | Proposed metric and target | Owner / window |
|---|---|---|
| Setup is understandable | At least 4 of 5 research participants complete setup without help | Aayush / next 2 weeks |
| Recommendations help a decision | At least 3 of 5 identify a relevant venue and explain its fit | Aayush / next 2 weeks |
| Shortlisting supports return use | Establish completed-profile-to-save and 7-day return baselines before setting growth targets | Aayush / first 30 days of an opted-in pilot |

## Scope and acceptance criteria

1. **As a newcomer, I can request updates or create an account.** Invalid waitlist inputs show actionable errors; failed submission permits retry. A signup without a session shows confirmation instructions and cannot enter personalised discovery. Existing accounts missing current consent receive the acceptance gate.
2. **As a diner, I can build and revise my palate.** All eight choices—mood, cuisine, diet, budget, spice, occasion, priority and distance—must be valid. Incomplete or retaken profiles show setup instead of scores; match explanations remain visible and unknown venue attributes remain unknown.
3. **As a diner, I can control recommendations.** Repeating the active feedback action undoes it; another action replaces it. Ordered cloud history restores the final state. Feedback failure retains local pending state with clear messaging; failed cloud saves restore the prior shortlist.
4. **As a traveller, I can control city and range.** Denied location allows manual city browsing. Finite distance applies only with location and excludes venues lacking valid coordinates. Saved venues remain accessible across city/range changes.
5. **As an account holder, I can request privacy help.** Contact links explain ownership verification and distinguish sign-out from deletion.

## Delivery boundaries and next decisions

Keep the service free and work within the existing budget; add no paid model, maps, booking or infrastructure dependency without an agreed cost cap. Preserve the cream/green original app identity and accessible mobile interactions. Live social profiles, shared collections, bookings, payments and paid AI guides are deferred pending evidence.

Privacy requests currently use manual email handling. A future deletion workflow should verify ownership, identify account and waitlist scope separately, remove eligible cloud data, explain retention/backups and confirm completion; self-service deletion is not shipped. Operator/contact: Aayush Mittal, 937, GIDC Makarpura, Vadodara; palateo.com@gmail.com. The documents do not establish legal compliance.

Sources: [README](../README.md), [app source](../work/palateo_cloudflare_pages/app/index.html), [privacy](../work/palateo_cloudflare_pages/privacy/index.html), [terms](../work/palateo_cloudflare_pages/terms/index.html), [restoration record](../README.md#verified-release-baseline). Next: [App flow](APP_FLOW.md).
