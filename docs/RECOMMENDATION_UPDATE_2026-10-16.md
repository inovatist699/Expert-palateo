# Shared recommendation update — 16 October 2026

Web and Android use the same recommendation source, account data and backend contract. No database migration or API change is required; older installed apps remain compatible.

- Dietary, pure-vegetarian and travel-range eligibility still run before ranking.
- Passed venues disappear from suggestions. Palate → Passed places → Show again reverses the pass; saved places remain saved.
- Affordable alternatives rank above otherwise equivalent over-budget venues.
- Learning ignores generic venue labels, bases confidence on related feedback and refreshes when catalogue evidence changes.
- The current Popular view exposes pure-veg filtering, nearest sorting, distances, reasons and pass controls. It preserves the selected order throughout the results.

Validation: recommendation fixtures, catalogue cache invalidation, account isolation, exact undo, mobile-width browser interaction, account deletion, CSP, both build outputs and dependency audits. Build isolation checks shared inline logic equality. Native CI and signed-artifact verification remain required for release.

Scores are estimates, not calibrated probabilities or a measured real-world accuracy improvement. Dietary results depend on catalogue evidence; confirm details with the venue. Android users need the matching APK update until Play publishing is configured.
