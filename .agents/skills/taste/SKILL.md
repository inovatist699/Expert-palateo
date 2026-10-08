---
name: taste
description: The Anti-Slop Frontend & UX Design Framework. Use whenever designing, building, or reviewing user interfaces, web pages, components, CSS/Tailwind styles, or typography to prevent generic AI templates and enforce distinct, premium aesthetic standards.
---

# Taste: The Anti-Slop Frontend Framework

AI agents default to generic, uninspired design patterns: purple/indigo gradients, floating cards with heavy blurred drop-shadows, centered generic hero sections, and washed-out gray text. The **Taste** framework breaks these habits by enforcing intentional design decisions.

## The 4 Design Dials

Before generating UI, calibrate these four parameters according to the project's identity:

1. **Design Personality**:
   - *Technical / Developer-Focused*: High density, monospaced accents, crisp 1px borders, subtle dark mode contrast, muted indicators.
   - *Editorial / Content-Rich*: Elegant serif/sans pairings, deliberate whitespace, generous leading, strong hierarchy.
   - *Minimalist / Product*: Clean layout grids, tight focus states, understated buttons, zero visual clutter.
   - *Brutalist / Expressive*: High contrast, sharp edges, bold typography, tactile borders.

2. **Visual Density**:
   - Avoid empty sprawling cards that waste screen estate.
   - Use intentional padding: 8px–12px for dense tools/dashboards, 16px–24px for narrative/content blocks.

3. **Color & Elevation**:
   - **No gratuitous gradients**: Use purposeful solid or subtle duotone surface colors.
   - **Borders over shadows**: Prefer subtle `border` (e.g. `border-neutral-200 dark:border-neutral-800` or 4–8% alpha) over fuzzy drop-shadows.
   - Use multi-layer background surfaces (`bg-background`, `bg-card`, `bg-muted`) to create depth.

4. **Typography & Hierarchy**:
   - Use tight letter-spacing for large titles (`tracking-tight` or `-0.02em`).
   - Limit font sizes in a single view to 4 well-defined scales (e.g., 28px title, 16px section, 14px body, 12px metadata).
   - Ensure secondary text remains readable (WCAG AA minimum contrast).

## Interactive Polish
- **Transitions**: Keep animations fast and functional (150ms–200ms ease-out). No sluggish bouncing elements.
- **Micro-States**: Every clickable element MUST have explicit `:hover`, `:active`, and `:focus-visible` states.
- **Form Controls**: Crisp borders, clear placeholder contrast, explicit error and focus rings.
