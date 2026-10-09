# App and waitlist redesign — 9 October 2026

Current app UI reference: the user-selected TasteTrail India Google AI Studio project. Current color reference: the user-supplied LightBlue/Moonstone/Saffron/Gunmetal palette image. App mode: Operate. Public waitlist mode: Persuade. This file keeps its existing name so links remain valid.

The palette now coordinates both app and waitlist. Both illustrative maps adopt LightBlue and Moonstone while retaining their geometry and pin behavior. Palateo identity, vanilla HTML/CSS/JavaScript and Supabase contracts remain in place.

## Direction contract

**THESIS:** Help users find a place, understand its estimated taste fit and refine the next recommendation with reversible feedback.

**OWN-WORLD:** Four supplied brand colors: LightBlue `#c3e7f1`, Moonstone `#519cab`, Saffron `#ffc64f`, Gunmetal `#20373b`. App background is LightBlue with pale cards `#edf7fa`, soft blue `#dbeef4`, Gunmetal copy and dark Moonstone `#315e68` metadata. Primary/selected controls and match badges use Saffron/Gunmetal. App navigation and photo overlays retain dark Gunmetal. Public hero/quiz/join are light; how/FAQ/footer and signup form use Gunmetal. App Plus Jakarta Sans and public Asap Condensed/DM Sans remain unchanged. Maps use LightBlue, pale blocks, white paths and Moonstone river/pins. Derived error/success colors retain semantic status.

**STORY:** Visitors understand taste-first discovery and enter the beta quiz or join launch updates. Signed-in users complete eight taste questions, browse real venue records, open full place details/About, save a place and calibrate preferences with venue or general dish feedback.

**FIRST VIEWPORT:** Public introduction keeps its quiz CTA and illustrative phone preview. App presents city controls, approximate map and a photo recommendation rail. Mobile quiz shows one question, compact choices and Continue. The place page leads with photo, Back/Save and the numerical estimate.

**INTERACTIONS:** Card-body, title and photo entry opens full place details while nested controls retain their actions. Pin selection synchronizes the rail without vertical page movement. Cuisine/vibe chips allow multiple selections; spice adds a labelled three-stop slider. The taste studio and place pages use live reversible Love/Pass dish choices, editable history and immediate score changes. Browser History/Back restoration passed final confirmation, including exact title focus and navigation across Home and Saved origins.

**LEARNING AND TRUTH:** General flavour examples are not verified venue menu items. Related cuisine/tag feedback contributes a bounded ±8 aggregate adjustment; unrelated cuisines contribute zero. Explain estimates and missing catalogue detail. Keep menu/hours unverified and external Directions as navigation.

**PERSISTENCE:** Reuse favorite arrays and dish-feedback fields inside existing Supabase taste-profile JSON. Queue writes with account/revision guards, retain pending local changes, show accurate cloud-failure text and offer Retry cloud sync. Preserve sign-in, consent, saves, venue feedback, location handling and account isolation.

**REFERENCE EVIDENCE:** TasteTrail is Android Kotlin/Compose. Its map/discovery/detail source was inspected in the correct AI Studio account. Its native preview container failed to start, so a running prototype and its backend/AI claims were not verified. Earlier Zest App Store study and map correction remain historical evidence. [Reference notes](../outputs/tastetrail-reference-2026-10-09.md) describe that source study.

**FORM:** User-pinned TasteTrail adaptation, implemented through existing native web controls. The supplied palette replaces prior map hues while retaining the illustrative map geometry and selection behavior. No generated comparison comp, framework, dependency, migration, paid integration or production deployment is required.

**FINISH:** Keep current tokens and component previews in [DESIGN.md](../DESIGN.md) and its sidecar, interaction/evidence limits in [UI/UX design](UI_UX_DESIGN.md), and local preview available before deployment. Impeccable context/detector loading failed with `cache_directory_failed`; no successful detector verdict is claimed.

## Acceptance

- Existing sign-in, consent, eight-question completion and cloud reopening remain usable.
- Cuisine/vibe multi-selection and spice slider preserve valid answers, native labels and visible state.
- Full card-click details show an accurate About fallback, available metadata, match factors, Save, Directions and reversible feedback.
- Dish examples are explicitly general; live updates stay reversible, bounded and persisted in existing JSON.
- Pending dish changes survive cloud failure; status stays honest and Retry cloud sync can complete the queued save.
- Both surfaces use the supplied four-color palette with readable derived neutrals; map geometry and existing type/layout remain accurate.
- 320px, 375px and 1440px layouts remain usable without page overflow, with reachable controls and visible keyboard focus.
- The user sees the local preview before any deployment.

## Validation status

The final supplied-palette browser pass verified computed text contrast for app account/navigation/quiz controls and selected chips, plus public actions, supporting copy and email fields. Place feedback restored 75% → 82% → 75%; dish feedback restored 88% → 91% → 88% after cloud reopening and undo. History navigation, session restoration and 320px/375px/1440px layouts passed with no page overflow or runtime errors. The /design-preview gallery now includes four color swatches and seven screens. This documentation merge used source inspection and supplied evidence; it ran no browser, test or account action.

The latest palette passed source checks, including contrast checks, and the browser confirmation above. Map controls use Gunmetal text/dark borders and Saffron active state.

No production deployment has occurred for this adaptation. Native device behavior, full screen-reader compliance, verified menus/hours and recommendation accuracy are not established by these checks.



