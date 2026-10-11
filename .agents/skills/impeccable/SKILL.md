---
name: impeccable
description: The Impeccable Design Language & Anti-AI Tells Framework by Paul Bakaus. Use when designing, auditing, polishing, or critiquing UI components and web pages. Flags generic AI design tells and enforces high-craft design vocabularies (/polish, /audit, /critique, /bolder, /quieter, /distill, /harden).
---

# Impeccable Design Language & Anti-AI Framework

[Impeccable](https://impeccable.style) by Paul Bakaus bridges the gap between AI-generated code and professional design craft. It eliminates "AI design tells" and provides a structured command vocabulary for refining interfaces.

## 1. Flag & Eliminate AI Tells
Before shipping any frontend surface, audit against common AI design mistakes:
- ❌ **Gratuitous Gradients**: Repetitive purple-to-indigo or blue gradients without brand rationale.
- ❌ **Shadow Soup**: Fuzzy, dark drop-shadows on floating cards. Replace with subtle 1px borders (4–8% opacity) and crisp surface elevation.
- ❌ **Pill Badge Overload**: Neon pill tags scattered across every card.
- ❌ **Generic Typography**: Relying on uncalibrated default fonts without distinct letter-spacing (`tracking-tight`), line heights, or weights.
- ❌ **Cookie-Cutter Hero Grids**: Centered floating hero with generic CTA buttons.

## 2. Impeccable Command Vocabulary
Adopt the perspective and techniques of these commands when instructed or performing UI work:

- **`/audit`**: Deep technical design review.
  - Check WCAG AA contrast ratios (especially text on muted surfaces).
  - Test fluid responsiveness across 375px (mobile), 768px (tablet), and 1280px (desktop).
  - Verify touch targets are at least 44x44px.

- **`/critique`**: UX & hierarchy analysis.
  - Does the user know what to look at first? (Primary CTA vs. secondary actions).
  - Is the visual hierarchy clear without relying on heavy colors?
  - Does the interface feel intentional, calm, and trustworthy?

- **`/polish`**: Final production sheen.
  - Calibrate micro-interactions (150ms–200ms snappy transitions).
  - Add explicit `:focus-visible`, `:hover`, and `:active` states.
  - Align icon baselines with typography; ensure uniform border radii.

- **`/bolder` vs. `/quieter`**:
  - `/bolder`: Increase contrast, strengthen typography weight, introduce sharp accents when a screen feels too timid or washed out.
  - `/quieter`: Soften borders, reduce saturation, increase whitespace when a screen feels loud, cluttered, or chaotic.

- **`/distill`**:
  - Remove decorative noise. Strip components down to their functional core.

- **`/harden`**:
  - Edge cases: Truncation for long user names/venue titles (`text-ellipsis`, `overflow-hidden`).
  - Empty states, network loading skeletons, error states, and offline feedback.
