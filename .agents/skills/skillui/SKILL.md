---
name: skillui
description: Reverse-engineers frontend design systems from live websites, git repositories, or local directories. Extracts color tokens, typography scales, spacing units, CSS animations, and component patterns into a structured design system and SKILL.md. Use when inspecting, replicating, or extracting UI designs from target URLs or codebases.
---

# SkillUI: Frontend Design System Reverse Engineering

SkillUI crawls live web targets, cloned git repositories, or local source directories to reverse-engineer their complete frontend design systems via static analysis and browser instrumentation—with zero external AI dependencies or API keys required.

## Core Capabilities

### 1. Live Website Design Reverse Engineering
Extract color palettes, typography scales, layout spacing, CSS keyframe animations, and DOM component patterns directly from any public web URL.

- **Standard Mode (Fast Static Analysis)**:
  Parses HTML and linked stylesheets without spinning up a browser.
  ```bash
  skillui.cmd --url https://target-site.com --out ./design-systems/target
  # or via npm script:
  npm run skillui -- --url https://target-site.com --out ./design-systems/target
  ```

- **Ultra Mode (Cinematic & Visual Extraction via Playwright)**:
  Uses Playwright to capture scroll journeys, hover/focus interaction diffs, computed `@keyframes`, and full-page screenshots across multiple pages.
  ```bash
  skillui.cmd --url https://target-site.com --mode ultra --screens 5 --out ./design-systems/target
  ```

### 2. Local Codebase & Directory Scanning
Scans an existing local project (`.css`, `.scss`, `.ts`, `.tsx`, `.js`, `.jsx`, Tailwind configs) to extract established design tokens and CSS variables.
```bash
skillui.cmd --dir ./src --out ./design-systems/local
```

### 3. Git Repository Extraction
Clones and analyzes any public GitHub/Git repository directly into an isolated design spec:
```bash
skillui.cmd --repo https://github.com/org/repo --out ./design-systems/repo
```

---

## Output Artifacts & Structure

When executed, SkillUI produces a structured output folder containing:
- **`DESIGN.md`**: Human-readable design system specification (hex/oklch colors, typography scale, spacing matrix, border radii, shadows).
- **`SKILL.md`**: Agent-ready instruction set that teaches coding models the target site's visual constraints and component tokens.
- **`CLAUDE.md`**: Claude Code project steering instructions tailored to the extracted design language.
- **`<project>.skill`**: Packaged bundle for AI agent skill registries and drag-and-drop loading.
- **`screenshots/`** (Ultra mode): Visual proof captures of viewport journeys and states.

---

## Agent Stack Integration

SkillUI feeds extracted design tokens directly into Palateo's frontend engineering pipeline:
1. **Extraction**: Run `skillui.cmd --url <url>` to capture reference tokens into `./design-systems/<name>/`.
2. **Review**: Audit tokens with `taste` (anti-slop calibration) and `impeccable` (visual hierarchy).
3. **Synthesis**: Adapt interactive components into Palateo's vanilla HTML/CSS/JS architecture using `twentyfirst-dev` and `componentry`.
4. **Verification**: Verify mobile viewport rendering (375px/390px) via `playwright` and `npm run check`.
