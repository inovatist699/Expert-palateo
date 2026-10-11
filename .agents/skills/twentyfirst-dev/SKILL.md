---
name: twentyfirst-dev
description: 21st.dev Design Engineer Component Registry integration. Use when searching, adapting, or building animated UI components, Magic UI effects, Aceternity UI patterns, Agent Elements (tool cards, message bubbles, streaming indicators), or modern shadcn themes.
---

# 21st.dev Component Registry & Design Engineering Skill

[21st.dev](https://21st.dev) is the premier community registry for design engineers. It provides interactive, animated components, Magic UI, Aceternity UI, and specialized Agent Elements.

## Core Capabilities & Libraries

### 1. Magic UI & Interactive Effects
- **Visual Effects**: Border beam animations, shimmer buttons, animated gradient texts, ripple circles, and particle backgrounds.
- **Data & Text Reveals**: Word pull-up animations, typing effects, number tickers, and blur fades.
- **Interactive Cards**: Bento grids, tilt cards, spotlight borders, and magnetic buttons.

### 2. Agent Elements (AI UI)
Specialized components for AI agent interfaces and assistant tooling:
- **Tool Cards**: Collapsible cards displaying tool name, runtime status, arguments, and return payloads.
- **Streaming Indicators**: Smooth pulsing dots, thought spinners, and skeleton loaders.
- **Action Confirmations**: Interactive approval pills, diff view panels, and execution badges.

### 3. Workflow & Usage

#### Searching & Discovery
When asked to build or enhance a component:
1. Identify the desired visual interaction (e.g. "bento grid", "border beam", "shimmer button", "restaurant badge").
2. Reference the standard component structure from [21st.dev](https://21st.dev).
3. CLI exploration (if running outside sandbox): `npx @21st-dev/cli@latest install <component-name>`

#### Adaptation to Project Stack
- **React / Next.js**: Direct implementation using Tailwind CSS + `framer-motion` / `lucide-react`.
- **Vanilla HTML / CSS / JS (e.g. Palateo app)**:
  - Extract the core CSS animation keyframes and pseudo-element styles (e.g., CSS `@keyframes shimmer`, conic gradients for border beams).
  - Use vanilla DOM manipulation and custom data attributes (`data-state="active"`).
  - Ensure zero external runtime dependencies are introduced unless necessary.

## Craft Guidelines
- Always pair 21st.dev components with the `taste` and `impeccable` skills: calibrate visual density, avoid overly flashy effects, and respect `prefers-reduced-motion`.
