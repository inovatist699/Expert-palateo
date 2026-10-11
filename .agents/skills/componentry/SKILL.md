---
name: componentry
description: Animated, production-ready UI component integration from componentry.dev. Use when designing, building, or styling interactive UI elements, animations (Framer Motion / CSS transitions), micro-interactions, cards, and modal components.
---

# Componentry (componentry.dev) Integration Skill

[Componentry](https://componentry.dev) provides high-craft, production-ready animated UI components with support for responsive layouts, light/dark modes, accessibility, and smooth micro-interactions.

## Core Capabilities & UI Patterns

### 1. Interactive Animated Components
- **Card Transitions & Reveals**: Smooth hover-lift, subtle border luminescence, and content expansion.
- **Scroll & Velocity Effects**: Tactile scroll animations, smooth fades, and spring-physics entry transitions.
- **Micro-Interactions**: Ripple feedback, tactile button depressions, and animated status pills/badges.
- **Overlays & Dialogs**: Spring-animated bottom sheets, drawer transitions, and backdrop blurs (`backdrop-blur-md`).

### 2. Implementation Workflows

#### For React / Next.js Environments
- Follow the copy-paste and CLI patterns from [componentry.dev](https://componentry.dev).
- Dependencies: React, Tailwind CSS, TypeScript, and `framer-motion`.
- Maintain clean props interfaces, accessible ARIA roles, and keyboard navigation.

#### For Vanilla HTML / CSS / JavaScript Environments (e.g., Palateo App)
- Transpile/adapt the CSS keyframes and spring transitions into native CSS custom properties.
- Use native Web Animation API (`element.animate()`) or hardware-accelerated CSS transforms (`translate3d`, `scale`) for 60fps performance without bundle bloat.
- Preserve the exact easing curves (e.g. `cubic-bezier(0.16, 1, 0.3, 1)`) and timing tokens defined by Componentry.

## Best Practices
1. **Performance**: Always prefer `transform` and `opacity` properties to prevent layout reflows and jank.
2. **Accessibility**: Ensure all animated components respect `prefers-reduced-motion` media queries:
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```
3. **Taste Alignment**: Combine with the `taste` skill to maintain restrained density, crisp 1px borders, and deliberate typography hierarchy.
