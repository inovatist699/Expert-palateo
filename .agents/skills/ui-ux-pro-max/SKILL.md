---
name: ui-ux-pro-max
description: Advanced UI/UX design intelligence database. Provides 161 industry reasoning rules, 67 UI styles (Minimalist, Brutalist, Neo-morphism, Glass, Editorial), 57 typography pairings, and conversion-optimized layout heuristics for web and mobile apps.
---

# UI/UX Pro Max: Professional Design Intelligence System

UI/UX Pro Max provides expert-level design reasoning rules, visual systems, and conversion-rate optimization (CRO) heuristics.

## 1. Visual Style Selection & Rules

Calibrate the UI style to match the user's brand identity:

| Style Archetype | Primary Characteristics | Ideal Use Cases |
| :--- | :--- | :--- |
| **Editorial / Taste** | Elegant serif titles, high-contrast monochrome, generous line height, subtle dividers | Curated media, restaurant guides, culinary apps |
| **Clean Technical** | Monospaced accents, crisp 1px borders (`border-neutral-200/800`), dense tables, status badges | Dashboards, developer tools, admin portals |
| **Tactile Minimalist** | Soft neutral backgrounds, 8–12px radius, micro-elevations, restrained primary accents | Consumer mobile apps, waitlists, onboarding |
| **Neo-Brutalist** | Bold solid borders (2px black), high-saturation accent pops, drop shadows with zero blur | Creative agencies, lifestyle, youth culture |

## 2. Typography & Hierarchy Heuristics

1. **Heading vs. Body Harmony**:
   - Pair an expressive display typeface (e.g. Playfair, Instrument Serif, Syne) with a clean geometric sans (Inter, Plus Jakarta Sans, Geist) for body copy.
2. **Negative Tracking**: Apply `-0.02em` to `-0.03em` letter-spacing on font sizes > 24px to prevent loose visual weight.
3. **Contrast Minimums**:
   - Primary text: Minimum 7:1 contrast on surface backgrounds.
   - Secondary / muted text: Minimum 4.5:1 contrast (WCAG AA). Never use faint grey text that fails readability.

## 3. Layout, Spacing & Conversion Optimization

- **Above the Fold Hierarchy**: The core value proposition and primary action must be readable in < 5 seconds.
- **Progressive Disclosure**: Break complex forms into single-concept steps (e.g., taste onboarding: Vibe → Dietary → Location).
- **Sticky Actions**: On mobile viewports, pin primary action buttons to the bottom sheet with adequate thumb-zone spacing (minimum 48px height, 16px bottom padding safe-area).
- **State Feedback**: Provide distinct visual feedback for Default, Hover, Active, Disabled, Loading (with skeleton or spinner), and Error states.
