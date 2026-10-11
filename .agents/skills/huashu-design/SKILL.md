---
name: huashu-design
description: HTML-native design and prototype engineering skill. Employs 20 encoded design philosophies and a 5-dimension review system to produce publication-grade, self-contained HTML/CSS visual layouts, slides, and interactive UI prototypes.
---

# HuaShu Design: HTML-Native Visual Prototype Engineering

HuaShu Design is an agent-agnostic, HTML-native design system focused on producing publication-quality prototypes, interactive presentation surfaces, and responsive visual interfaces directly in clean HTML/CSS.

## The 5-Dimension Review System

Before outputting or finalizing any HuaShu interface, audit across 5 dimensions:

1. **Composition & Spatial Rhythm**:
   - Establish a deliberate 8pt or 4pt baseline grid.
   - Balance positive space (content) with negative space (margins and leading).
2. **Typographic Authority**:
   - Limit font scale jumps to harmonious ratios (Major Third 1.25 or Perfect Fourth 1.333).
   - Ensure line length stays between 45–75 characters per line for optimal readability.
3. **Chromatic Restraint**:
   - Restrict the primary palette to 1 background, 1 surface, 2 text tones, and 1 intentional accent color.
   - Avoid decorative multi-color chaos.
4. **Motion Grace**:
   - Employ ease-out transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) under 250ms.
   - Every movement must communicate state change, entrance, or spatial continuity.
5. **Architectural Purity**:
   - Keep prototypes fully self-contained where possible (semantic HTML, scoped CSS variables).
   - Zero unnecessary JavaScript bloat or unneeded external libraries.

## Implementation Pattern (Self-Contained Taste Cards)
```html
<div class="taste-card" data-vibe="editorial">
  <div class="taste-card__header">
    <span class="taste-card__badge">Curator's Pick</span>
    <span class="taste-card__rating">9.4</span>
  </div>
  <h3 class="taste-card__title">The Artisan Bistro</h3>
  <p class="taste-card__desc">Wood-fired culinary experiments in the heart of Indiranagar.</p>
</div>
```
