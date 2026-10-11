---
name: design
description: Comprehensive UI/UX and Visual Design System skill. Use when creating design systems, establishing color and typography tokens, structuring responsive component layouts, and enforcing UI consistency across the application.
---

# Unified Design System & UI Craft Skill

A foundational skill providing structured design tokens, component anatomy guidelines, and visual hierarchy standards.

## 1. Design Token Architecture

Maintain a consistent design token hierarchy across the project:

### Spacing Scale
- `2xs: 2px`, `xs: 4px`, `sm: 8px`, `md: 12px`, `base: 16px`, `lg: 24px`, `xl: 32px`, `2xl: 48px`

### Radii Scale
- `sm: 4px` (inner chips/tags), `md: 8px` (buttons, inputs), `lg: 12px` (cards), `full: 9999px` (pills, avatars)

### Elevation & Borders
- Prefer 1px borders with calibrated alpha (`rgba(0, 0, 0, 0.08)` on light, `rgba(255, 255, 255, 0.12)` on dark) over heavy diffuse shadows.

## 2. Component Anatomy Standards
Every interactive component must adhere to standard anatomy:
1. **Container**: Explicit boundaries, predictable box model, overflow handling.
2. **Label / Icon**: Baseline aligned with typography; fixed aspect ratio on icons.
3. **State Feedback**: Hover, Active, Focus-Visible, Disabled, Loading.

## 3. Review Checklist
- [ ] Contrast ratio meets WCAG AA (4.5:1 text, 3:1 graphical controls).
- [ ] Responsive behavior tested on small viewports (<390px).
- [ ] No visual clipping or horizontal scrollbar leaks.
