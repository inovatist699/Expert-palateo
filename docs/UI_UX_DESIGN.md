# Palateo — UI/UX design

Updated: 7 October 2026. Current design contract for the app and waitlist.

## Visual reference and boundaries

The approved app identity is the original [Vercel app](https://palateocloudflarepages.vercel.app/), refined for [the domain app](https://palateo.in/app/). Preserve its cream surfaces, green accents, rounded cards, clear percentage badges and familiar navigation. The latest visual reference and checks are in [the restoration release record](../README.md#verified-release-baseline).

The public waitlist at `/` is a separate marketing surface. Its animated plate, floating elements and display typography should not replace the working app's controls or layout. Keep waitlist previews identifiable as illustrative, not actual results for a visitor.

## App foundations

| Element | Current implementation / requirement |
| --- | --- |
| Typography | Inter with system sans fallbacks; existing font setup, no new dependency required |
| Surfaces | Warm neutral background, white cards, pale green selection states |
| Main text | `--ink: #141816` |
| Brand | `--green: #145c45`, `--green2: #1e805d` |
| Palette details | `--soft: #e9f4ef`, `--line: #e4e7e3`; local variants exist |
| Hero | Cream gradient; dark green gradient for the palate summary |
| Layout | Home: two columns on desktop, one on mobile; bounded app width |
| Match | Rectangular badge showing actual restaurant score; color supplements the number |
| Venue media | Compact thumbnail; safe existing image or honest placeholder |
| Tags | Short pill labels; wrap rather than widen the page |

Keep related content close together. Reserve vertical space for useful content, not empty image panels or oversized banners. Long addresses and venue names must wrap without pushing match badges outside cards. Avoid adding decorative animation to the discovery task.

## Screen requirements

### Sign-in and consent

Show labelled email/password fields, clear submit/loading/error states, registration, password recovery and confirmation resend. Registration asks for name, phone, email and password in the existing flow. Explain confirmation requirements when signup returns no session; do not imply the user is logged in.

Show legal choices separately, with accessible policy links and an option to decline/sign out. Preserve current policy text; legal compliance cannot be inferred from screen design. The current under-18 guidance is parental knowledge and permission, not an implemented parental-verification system.

### Taste setup

Ask one of eight questions at a time: mood, cuisine, diet, budget, spice, occasion, priority and distance. Show step/progress, a concise hint, two-column choices, Back and Continue/Build my palate. Continue stays disabled until the current answer is valid.

Picking a choice updates its pressed/selected state in place, retaining focus and scroll. Moving between questions focuses the question heading. Keep the small-screen flow compact; do not restore the large repeated introductory hero on each step.

### Home and discovery

Home shows four ranked venues and a real top restaurant match with its name. This percentage is a heuristic estimate, not prediction accuracy. The bar uses the same number as the matching venue. Discovery exposes city, search, cuisine/type filters and match/rating/name sorting.

Every venue card shows name, location, available rating and price, match score, short "Why it fits" text, expandable explanation and actions. Like, pass and visit show their selected state. Clicking the same rating again removes it; use explicit "Undo like"/"Undo pass" wording. Save and restaurant Maps links remain available. Preserve reading position after rating or saving.

### Saved, palate and community

Saved places remain available across city/distance changes. Empty states provide an action to discover places. The palate page displays answers, learned signals, interaction counts, retake and privacy contacts. Sample community profiles stay labelled illustrative; their displayed percentages are not genuine user matches.

## Responsive and accessible behavior

- Verify narrow screens starting at 320px; badges, action labels and navigation must remain usable.
- Use native buttons, inputs, selects and details. Labels, keyboard focus, `aria-pressed`, progress information and live status text must survive refinements.
- Keep primary touch targets approximately 44–48px or larger. Do not rely only on color or hover.
- Respect reduced motion; the waitlist also exposes a pause control.
- Check actual contrast and keyboard/screen-reader behavior when changing styles. Existing visual checks are not proof of full accessibility compliance.

## Failure and empty states

Missing venue metadata must not produce invented claims. Location denial leaves manual city browsing usable; a radius filter only applies with location. Explain when unknown coordinates exclude places. Show cloud failures honestly: retain local ratings, restore the previous saved shortlist on save failure, and allow retry without falsely showing success.

See [app flow](APP_FLOW.md), [product requirements](PRD.md) and [implementation plan](IMPLEMENTATION_PLAN.md). Runtime source: `work/palateo_cloudflare_pages/app/index.html`, `index.html`, `waitlist.css` and `waitlist.js`.
