# Palateo — UI/UX design

Updated: 9 October 2026. Current local-preview contract for the TasteTrail app adaptation and coordinated public waitlist.

## Visual reference and boundaries

The app UI adapts TasteTrail India in Google AI Studio. The latest user-supplied palette image sets LightBlue `#c3e7f1`, Moonstone `#519cab`, Saffron `#ffc64f` and Gunmetal `#20373b` across both app and waitlist. This supersedes earlier palette choices. The app keeps Plus Jakarta Sans, and the public page keeps Asap Condensed/DM Sans. Both illustrative maps now use LightBlue/Moonstone with their existing geometry and pin behavior.

TasteTrail is an Android Kotlin/Compose project. Its map/discovery/detail source was inspected in the correct AI Studio account; the native preview container failed to start. Source patterns informed the web adaptation, without verifying a running native app or its AI/backend claims. [Reference notes](../outputs/tastetrail-reference-2026-10-09.md) record that earlier source study and map correction; their earlier palette/evidence description is historical and does not supersede this contract.

[DESIGN.md](../DESIGN.md) records current source tokens. [.impeccable/design.json](../.impeccable/design.json) extends them with component previews. [The redesign brief](ZEST_REDESIGN_BRIEF.md) records scope and acceptance. App mode is Operate; public mode is Persuade.

## App and public foundations

| Element | Current source / requirement |
| --- | --- |
| App typography | Plus Jakarta Sans headings, controls and body with system fallbacks |
| App background/surfaces | LightBlue `#c3e7f1`, pale card `#edf7fa`, soft blue `#dbeef4` |
| App text/border | Gunmetal `#20373b`, muted dark Moonstone `#315e68`, line `#93bec8`, control line `#315e68` |
| App action/selection | Saffron `#ffc64f` + Gunmetal text; hover `#ffe0a1`; Moonstone `#519cab` supporting detail |
| App focus | Gunmetal on light surfaces, LightBlue on dark navigation, Saffron on hero controls |
| Public typography/palette | Asap Condensed/DM Sans; LightBlue hero/quiz/join, Gunmetal how/FAQ/footer and signup form, Saffron actions |
| Illustrative map | LightBlue `#c3e7f1`, pale blocks `#d7edf3`, white paths, Moonstone `#519cab` river, Gunmetal labels and Moonstone/Gunmetal pins |
| App layout | Map-first home/photo rail; two desktop list columns, one mobile column; full place page; taste studio |
| Public layout | Existing 1160px container, paired sections stacked below 720px |
| Estimate | Numeric heuristic match with explanation; color supplements the number |
| Media | Venue photos where available, honest placeholders on failure; public phone remains illustrative |

## Screen requirements

### Sign-in and consent

Keep labelled email/password fields, loading/error states, registration, recovery and confirmation resend. Registration keeps name, phone, email and password. Explain confirmation requirements if signup returns no session.

Keep policy choices separate with links and decline/sign-out handling. Under-18 guidance remains parental knowledge and permission; no implemented parental-verification claim exists. Existing Supabase sessions, account ownership and RLS remain in force. Account changes clear account-scoped local preferences.

### Eight-question taste setup

Ask one question at a time: mood/vibe, cuisine, diet, budget, spice, occasion, priority and distance. All options use compact wrapping chips. Cuisine and vibe allow multiple independent choices with a visible check and `aria-pressed`; the first selected value remains the primary answer for existing consumers. Continue becomes disabled when the current selection is empty.

Spice adds a labelled native three-stop range: mild, medium and hot. Its value and `aria-valuetext` stay synchronized with the chips, including the existing “Depends on the dish” option. Preserve Back, progress, saved step, heading focus on step changes and in-place selection focus. The final action saves the profile and opens matches.

The flow remains eight questions and uses existing backend contracts. There is no bank, card or Plaid onboarding.

### Home and discovery

Home opens on an approximate area map with floating Map/Full list and Search controls, then a horizontal rail of ranked venue photos. Pins use catalogue coordinates; the roads/blocks are illustrative. Pin selection synchronizes the relevant rail card without scrolling the page vertically. External Directions handles navigation.

Discovery retains city, search, cuisine/type filters and match/rating/name sorting. Venue cards show media, name, available rating and price, numeric estimate, short fit reason, expandable explanation and actions. Like/pass/visit stays reversible; repeating a selected action removes it. Save and Directions remain connected. Interaction updates preserve reading position.

A click on the card's non-interactive area opens full details. Native photo and title buttons provide keyboard entry; nested feedback/save/map/summary controls keep their own behavior. The existing map sheet remains available for compact map context.

### Full place page and About

Show a photo hero, Back, Save, estimate, rating/review count/source where available, price and tags. Group the match explanation with individual fit/conflict/limited-detail factors. Copy states that the percentage is an estimate from the quiz, dish preferences and place feedback.

About uses the existing venue description or a factual fallback from name, area and listed cuisines. Display atmosphere and dietary information only when present; otherwise show the missing-data caveat. Address and Get directions remain available. Hours and current menu stay explicitly unverified.

Show up to three cuisine-related flavour examples with Love it/Pass and explicit undo states, then place Like/Not for me/I visited. The examples are not confirmed menu items at that venue. If cuisine detail is insufficient, direct the user to the taste studio.

The source implements Back and browser History navigation to restore origin, page scroll, rail position and keyboard focus. The final browser confirmation passed exact title-focus restoration for Back/Forward and the Home → place A → Saved → place B → Back/Forward sequence.

### Taste studio and live dish calibration

Show actual quiz answers, place counts, saves, learned signals, retake and privacy contacts. The calibration deck presents one general taste example, description, active preference count, Love it/Pass, Skip, undo last feedback and an editable rated list. Vegetarian profiles exclude non-vegetarian examples.

Feedback immediately recalculates displayed estimates on the current screen. Clicking the same selected choice removes it; switching Love/Pass replaces it. The deck advances after an active rating, Skip moves to the next example, and rated examples remain editable. Focus stays on the new dish heading or the edited feedback button as appropriate.

Learning uses existing cuisine/tag similarity: unrelated cuisine contributes zero; related cuisine affinity is 0.7, or 1 when a specific tag also matches. The aggregate dish adjustment is `8 × signed affinity / (1 + total affinity)`, capped at ±8 score points. This is a bounded heuristic, with no verified menu-level model or measured prediction-accuracy claim.

### Existing JSON persistence and failure states

Persist cuisine favorites in `taste_profiles.cuisines.favorites`, vibe favorites in `ambience.favorites` and validated dish feedback in `priorities.dish_feedback`. Keep the existing primary answers, dietary preference and priority fields. No migration or new dependency is required.

Dish writes share the existing feedback queue. Account and revision guards keep older requests from reporting success for newer state. Local dish preferences persist immediately and remain pending after failure. Status text distinguishes saving, account-saved and device-only failure; Retry cloud sync is available until success. Cloud loading preserves locally pending dish changes.

Saved-place failure restores the previous shortlist. Venue feedback remains local with honest cloud-failure status. Location denial leaves manual city browsing available; distance filtering requires location and explains exclusions with unknown coordinates. Missing metadata must not generate claims.

### Saved, community and public waitlist

Saved places remain available across city/distance changes, with an actionable empty state. Community sample profiles remain illustrative. Their percentages do not represent genuine user matches.

Public quiz links open the existing beta flow. The phone/map and sample quiz stay labelled illustrative. Signup keeps the existing API, email, Ahmedabad/Vadodara/Other selection, explicit email consent, validation, loading, success/failure text and transactional email failure isolation. Keep policy links, keyboard focus, reduced motion and the public pause control.

## Responsive and accessible behavior

- Preserve usable layouts at 320px, 375px and 1440px, wrapping names/addresses and bounded chip/rail scrolling.
- Keep native buttons, inputs, selects and details with persistent labels, pressed states, progress information and live status.
- Keep app actions at approximately 44–48px minimum height; public primary actions remain 54px desktop / 50px mobile.
- Reserve space for mobile navigation and safe-area padding, including place actions, calibration status and toasts.
- Keep visible focus on dark surfaces and the light map; respect reduced motion.

## Evidence and limits

Previous Zestmaps/map-correction passes inspected app/public layouts at 320px, 375px and 1440px. Those captures and the earlier 67% → 74% → 67% venue-feedback result document the earlier implementation phase.

The final supplied-palette browser pass checked app account/navigation/quiz actions and selected chips, plus public actions, supporting copy and email-field text contrast. Layouts at 320px, 375px and 1440px had no page overflow or runtime errors. Reversible place feedback showed 75% → 82% → 75%; dish feedback showed 88% → 91% → 88% after cloud restoration and undo. History navigation, title focus and session restoration passed. The local /design-preview gallery includes the four supplied swatches and seven screens: home, full About, cuisines, spice, calibration, profile and waitlist. These results establish observed UI/persistence behavior, not recommendation accuracy.

The new palette source checks and browser contrast confirmation passed. The final map toolbar uses Gunmetal text and borders with Saffron active controls on the light map.

This documentation pass read current source and reference notes. It did not run browsers, tests or account actions. Impeccable context/detector loading previously failed with `cache_directory_failed`; source tokens were extracted manually, with no successful detector verdict claimed. TasteTrail's native preview did not run.

The user requested a local preview before deployment. This adaptation has not been deployed. Browser evidence does not establish full screen-reader compliance, physical Android/iOS behavior, verified menus/hours or calibrated recommendation accuracy.

See [app flow](APP_FLOW.md), [product requirements](PRD.md), [implementation plan](IMPLEMENTATION_PLAN.md) and [PRODUCT.md](../PRODUCT.md). Current runtime source: `work/palateo_cloudflare_pages/app/index.html`, `app/theme.css`, public `index.html`, `waitlist.css` and `waitlist.js`.



