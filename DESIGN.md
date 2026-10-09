---
name: Palateo
description: Taste-first discovery in the user-supplied LightBlue, Moonstone, Saffron and Gunmetal palette.
colors:
  light-blue: "#c3e7f1"
  moonstone: "#519cab"
  saffron: "#ffc64f"
  gunmetal: "#20373b"
  app-success: "#2f6251"
  control-line: "#315e68"
  app-background: "#c3e7f1"
  app-card: "#edf7fa"
  app-soft: "#dbeef4"
  app-action: "#ffc64f"
  app-action-hover: "#ffe0a1"
  app-selection: "#20373b"
  app-score: "#ffc64f"
  app-ink: "#20373b"
  app-muted: "#315e68"
  app-line: "#93bec8"
  action-ink: "#20373b"
  app-focus: "#20373b"
  app-saffron: "#ffc64f"
  app-danger: "#9b3f38"
  waitlist-action: "#ffc64f"
  waitlist-action-hover: "#ffe0a1"
  waitlist-focus: "#c3e7f1"
  waitlist-background: "#20373b"
  waitlist-section: "#20373b"
  waitlist-ink: "#edf7fa"
  waitlist-muted: "#c3e7f1"
  waitlist-action-ink: "#20373b"
  quiz-wash: "#c3e7f1"
  map-plane: "#c3e7f1"
  map-block: "#d7edf3"
  map-path: "#f8fff8"
  map-river: "#519cab"
  map-control: "#f6fffc"
  map-line: "#93bec8"
  map-ink: "#20373b"
typography:
  app-question:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  app-dialog-title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 750
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  app-copy:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  waitlist-body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  waitlist-mobile-heading:
    fontFamily: "Asap Condensed, sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.025em"
rounded:
  tag: "6px"
  waitlist-field: "7px"
  waitlist-control: "8px"
  app-control: "10px"
  app-choice: "12px"
  app-card: "14px"
  dialog: "16px"
  filter: "99px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "28px"
  waitlist-card: "36px"
components:
  app-button-primary:
    backgroundColor: "{colors.app-action}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.app-control}"
    padding: "12px 18px"
    height: "48px"
  app-button-primary-hover:
    backgroundColor: "{colors.app-action-hover}"
    textColor: "{colors.action-ink}"
  app-button-secondary:
    backgroundColor: "{colors.app-card}"
    textColor: "{colors.app-ink}"
    rounded: "{rounded.app-control}"
    padding: "12px 18px"
    height: "48px"
  waitlist-button-primary:
    backgroundColor: "{colors.waitlist-action}"
    textColor: "{colors.waitlist-action-ink}"
    rounded: "{rounded.waitlist-control}"
    padding: "15px 23px"
    height: "54px"
  waitlist-button-primary-hover:
    backgroundColor: "{colors.waitlist-action-hover}"
  app-field:
    backgroundColor: "{colors.app-card}"
    textColor: "{colors.app-ink}"
    rounded: "{rounded.app-control}"
    padding: "12px 14px"
    height: "48px"
  app-choice:
    backgroundColor: "{colors.app-soft}"
    textColor: "{colors.app-ink}"
    rounded: "{rounded.app-choice}"
    padding: "12px 16px"
    height: "48px"
  app-choice-selected:
    backgroundColor: "{colors.app-action}"
    textColor: "#20373b"
    rounded: "{rounded.app-choice}"
    padding: "11px 15px"
  app-tag:
    backgroundColor: "{colors.app-soft}"
    textColor: "{colors.app-muted}"
    rounded: "{rounded.tag}"
    padding: "4px 7px"
  app-card:
    backgroundColor: "{colors.app-card}"
    textColor: "{colors.app-ink}"
    rounded: "{rounded.app-card}"
    padding: "18px"
  app-nav:
    backgroundColor: "{colors.gunmetal}"
    textColor: "{colors.light-blue}"
---
# Design System: Palateo

## Overview

**Creative North Star: "Good taste. Great places."**

The app adapts TasteTrail India from Google AI Studio. The latest user-supplied palette image sets LightBlue, Moonstone, Saffron and Gunmetal across both app and public waitlist: light pages, pale cards, dark readable text and saffron actions. Palateo keeps its identity and working product. This palette supersedes earlier color directions. Both illustrative maps adopt LightBlue and Moonstone while preserving their geometry and interaction.

The app keeps matches, explanations and feedback close together. The full place page and taste studio expose the same recommendation state. Surface modes and acceptance criteria live in [the redesign brief](docs/ZEST_REDESIGN_BRIEF.md).

**Key Characteristics:**

- LightBlue pages and pale cards with Gunmetal text, Moonstone details and Saffron actions.
- Plus Jakarta Sans app headings and controls; Asap Condensed and DM Sans public typography.
- Map-first discovery, a photo rail, full place details and compact native quiz chips.
- Visible selection, reversible feedback and honest estimated matches.

Extracted from `work/palateo_cloudflare_pages/app/theme.css`, `app/index.html`, public `index.html` and `waitlist.css` on 9 October 2026. Frontmatter tokens record implemented values; height tokens describe minimum heights. Later CSS overrides determine the current app treatment. This is a local preview awaiting user review before deployment.

## Colors

Frontmatter is normative. The four named brand colors come from the user-supplied palette image. Derived light and dark neutrals support readable controls, metadata and statuses. The app, public page and map use coordinated roles.

### Primary

- **Saffron** (`saffron`, `app-action`, `waitlist-action`): primary and selected controls, visited-map status and numerical match badges, paired with Gunmetal text. The lighter hover is `#ffe0a1`.
- **Moonstone** (`moonstone`): map river, map pins and supporting brand detail. Its derived darker tone `#315e68` carries small copy, links and native range controls on light surfaces.

### Secondary

- **Gunmetal** (`gunmetal`, `app-selection`): app navigation, photo overlays and public how/FAQ/footer sections. Active app navigation and feedback choices use Saffron with Gunmetal text.
- **LightBlue** (`light-blue`, `quiz-wash`): page/map plane and public hero, quiz and join sections. Gunmetal form cards use LightBlue supporting copy.
- **Map LightBlue** (`map-plane`): illustrative geography with pale blue blocks, white paths, Moonstone river, Gunmetal labels and Moonstone/Gunmetal pins.

### Tertiary

- **Focus** (`app-focus`): Gunmetal outlines on light app surfaces; app navigation uses LightBlue and hero/form controls use Saffron on dark surfaces.
- **Error / Success** (`app-danger`, `app-success`): derived red `#9b3f38` and green `#2f6251` status tones. Explicit text carries failure/success meaning.

### Neutral

LightBlue (`app-background`), pale card (`app-card`) and soft blue (`app-soft`) layers establish hierarchy. Gunmetal (`app-ink`), dark Moonstone (`app-muted`) and blue borders (`app-line`) keep content readable. Control boundaries use `control-line`. Public dark sections use Gunmetal with light text.

The effective root is light. Legacy variable names such as `--green`, `--navy` and `--mint` remain implementation aliases; their names do not define the current palette. Primary/selected buttons use explicit Saffron overrides rather than the dark-Moonstone `--green` link value. Sidecar previews reflect effective rules, not superseded declarations.

**The Visible State Rule.** Selection and errors use text, pressed state or another visible cue as well as color.

## Typography

**App Heading and Body Font:** Plus Jakarta Sans with system sans-serif fallbacks.  
**Public Heading Font:** Asap Condensed with sans-serif fallbacks.  
**Public Body Font:** DM Sans with sans-serif fallbacks.

App heading overrides use weight 750 and tight tracking. Match numbers use tabular numerals. Legacy Asap declarations remain earlier in the app stylesheet; the current heading selectors override them with Plus Jakarta Sans.

### Hierarchy

- Quiz questions use 32px / 1.2 on desktop and 28px on mobile.
- The home recommendation heading uses 24px; its final override also takes precedence on mobile.
- Place titles use 32px desktop / 26px mobile; taste-studio titles end at 28px on mobile. Dialog titles use 36px / 1.12.
- Venue names wrap and use 18px desktop / 17px mobile in full lists, with smaller home-rail overrides.
- App body copy uses the copy role; hints, metadata and controls use compact 11–15px sizes with readable line heights.
- Public hero headings use `clamp(70px, 7.5vw, 96px)` with existing tablet/mobile overrides. Public section headings use `clamp(45px, 5vw, 64px)` and section-specific mobile values.

## Layout

The desktop app is bounded to 1180px with 32px side gutters. Home opens on an approximate area map with floating Map/Full list and Search controls, followed by a horizontal photo rail. Full list, discovery and saved views use two desktop columns and one below 840px. Mobile home spans the viewport around the map, with 16px recommendation gutters and safe-area-aware bottom navigation.

Quiz content is bounded to 640px. All choice groups wrap as compact chips; cuisine and vibe allow multiple selections. Spice adds a labelled native range input. One of eight questions appears at a time with Back and Continue. The full place page is bounded to 880px on desktop and fills mobile width; related dish examples and rating actions stack on mobile.

The public container stays bounded to 1160px with paired columns that stack at 720px. Filters and photo rails scroll within their own bounds; names and addresses wrap. The spacing scale records reused values rather than a strict global grid.

## Elevation & Depth

App cards, quiz choices, buttons and navigation use tonal layers and one-pixel borders without resting shadows or hover lift. The transient toast uses `0 8px 20px #0004`. The place hero keeps a dark Gunmetal photograph gradient and pale text for readability; it does not define a general surface gradient.

The public phone uses `22px 35px 50px #20373b5c` on desktop, with a smaller mobile shadow. The public quiz sample uses `12px 20px 35px #20373b15`. Quiz progress transitions over 0.2s; existing public button/phone motion retains its pause control and reduced-motion override.

**The Tonal Layer Rule.** App hierarchy comes from surface color and borders.

## Shapes

App cards use 14px corners, controls 10px, quiz chips 12px and dialogs/place heroes 16px. Metadata tags use 6px corners; filters and map view switches are pills. Public fields/controls retain 7px/8px corners. The public phone's 40px shell is an illustrative silhouette.

## Components

### Buttons

Primary app actions use Saffron and Gunmetal text, a 48px minimum height and compact padding. Venue, map and navigation actions retain at least 44px. Secondary controls use a pale card fill and dark control border. Selected dish and restaurant feedback uses Saffron, Gunmetal text and an explicit undo label. Disabled actions show reduced opacity. General keyboard focus uses a 3px Gunmetal outline offset 3px.

Public primary actions use Saffron and Gunmetal with a 54px desktop / 50px mobile minimum height. Public dark sections use LightBlue focus; the dark signup form uses Saffron focus, and light sections use Gunmetal.

### Chips and Taste Choices

Native quiz buttons expose `aria-pressed` and a visible check. Cuisine/vibe selections toggle independently; deselecting the last choice disables Continue. The selected 2px Gunmetal border uses adjusted padding to prevent movement. Step changes focus the question heading. Spice's range input maps three stops to mild, medium and hot; the existing “Depends on the dish” chip remains available.

Filter buttons and non-interactive metadata tags retain separate roles. Do not make tags act like controls.

### Cards / Containers

Clicking a card's non-interactive surface, photo or title opens its full place page; nested feedback, save, map and explanation controls keep their own actions. Keyboard users have native title/photo buttons. The place page groups photo, estimate, rating/price, match factors, About, available atmosphere/diet details, address, Directions and feedback. Missing hours/menu information stays explicitly unverified.

Home-rail photos use 155px desktop / 120px mobile / 110px narrow heights. Missing or failed media preserves an honest placeholder. The map retains a compact place sheet and synchronized photo rail; full details are available from venue card entry points.

### Inputs / Fields

Labelled native app fields use the card surface, warm border, visible focus and 48px minimum height. The spice input retains a persistent label, keyboard operation and `aria-valuetext`. Public signup keeps email/city labels, explicit consent, loading and status text. Placeholders never substitute for labels.

### Navigation

Desktop navigation uses a bounded dark group; mobile navigation stays fixed with icon/text labels and safe-area padding. Selected destinations use Saffron and Gunmetal; inactive navigation uses LightBlue on Gunmetal. The place page's Back and browser History preserve the origin, rail position and focus in the source implementation; confirmation evidence is recorded in the UI/UX document.

### Live Dish Calibration

The taste studio presents one general flavour example with Love it, Pass, Skip, active count, undo and an editable rated list. Place details present up to three related examples. These are not verified menu items. A click recalculates matches immediately; the same selected choice removes it. Vegetarian profiles filter out non-vegetarian examples.

Cuisine/tag affinity supplies an aggregate adjustment bounded to ±8 score points; unrelated cuisine contributes zero. Existing Supabase taste-profile JSON stores favorite cuisines/vibes and dish feedback. Writes queue with account/revision guards; pending local feedback is retained, cloud failures say so, and Retry cloud sync remains available. This heuristic is not measured recommendation accuracy.

### Match and Map

Keep the numerical estimate, explanation and actions together. Both maps use a LightBlue plane, pale blue blocks, white illustrative paths, Moonstone river and light controls. Their schematic geometry and pin behavior remain intact. Venue pins use actual catalogue coordinates within an approximate area overview; illustrated paths are not navigation data. Pin selection reveals its rail card without vertical page scrolling. Directions opens external navigation.

TasteTrail's Android Compose source informed the adaptation. Its native preview container failed to start; no running Android UI or prototype backend verification is claimed. See [reference notes](outputs/tastetrail-reference-2026-10-09.md).

## Do's and Don'ts

### Do

- Do use the four user-supplied colors across app and waitlist, with derived neutrals for readable controls.
- Do preserve Palateo branding, the eight-question quiz, auth, consent, saves and reversible venue feedback.
- Do retain native labels, pressed states, visible focus, reduced motion and readable mobile actions.
- Do identify dish examples, map geometry and public phone layouts as illustrative.
- Do keep local and cloud-save status accurate and offer retry after dish sync failures.

### Don't

- Don't restore superseded palettes or use low-contrast light text on light controls.
- Don't describe flavour examples as a venue's verified menu, or estimates as measured prediction accuracy.
- Don't infer live hours, availability or dietary safety from missing catalogue data.
- Don't add bank linking, a framework, dependencies, database migrations or deployment to reproduce the reference.



