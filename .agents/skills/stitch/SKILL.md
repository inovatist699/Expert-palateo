---
name: stitch
description: AI-powered UI design-to-code generation and prototyping (Google Stitch / UI Stitch). Use when converting natural-language design prompts, vibe-coding requests, or visual sketches into clean HTML/CSS, Tailwind, and reactive components.
---

# Stitch: AI Design-to-Code & Vibe Prototyping

Stitch translates high-level design vision, aesthetic prompts, and wireframe descriptions into functional, production-ready frontend code.

## Core Capabilities

### 1. Intent-to-Layout Translation
When given a design brief or aesthetic description (e.g. "a moody, editorial restaurant card for Palateo"):
1. **Deconstruct Components**: Identify header, media container, badge row, typography stack, and action buttons.
2. **Apply Design Tokens**: Use consistent CSS custom properties or Tailwind utility tokens.
3. **Generate Clean Markup**: Structure semantic elements (`<article>`, `<header>`, `<main>`, `<button>`).

### 2. Rapid Prototyping Patterns
- **Responsive Stacking**: Fluid flexbox and CSS grid layouts that transition cleanly across screen widths.
- **Glass & Surface Nuance**: Subtle borders (`border-white/10 dark:border-black/10`), surface elevation, and soft backdrop filters.
- **Micro-Interactions**: Built-in state indicators (`data-active`, `:hover`, `:focus-visible`).

### 3. Vibe Coding Guardrails
- **No Incomplete Placeholders**: Avoid dead `href="#"` or unclickable stub controls. Provide working interaction scripts where possible.
- **Zero Style Leakage**: Scope CSS rules to component classes or use utility classes to avoid breaking global styles.
