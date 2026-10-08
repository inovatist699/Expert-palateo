# Agent Guidelines & Intelligence Stack: Palateo

This repository is configured with an integrated modular agent stack combining **Agency Agents**, **Ponytail**, **GetShitDone (GSD)**, **Taste**, **Graphify**, **Componentry**, **Manus**, **Impeccable**, **21st.dev**, **Claude Code**, **Ralph Loop**, **CodeRabbit**, **Playwright**, **UI/UX Pro Max**, **HuaShu Design**, **Claude SEO**, **SkillX**, **Stitch**, **Unified Design**, **Systematic Debug**, and **Roo Code**.

---

## 1. Agency Agents (`.agents/agency-agents`)
The specialized agent roster from [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) is integrated into this workspace under `.agents/agency-agents/`.

Adopt the perspective and workflows of the corresponding persona when tackling domain-specific tasks:
- **Engineering / Tech Lead**: Architecture, correctness, security, and scalability.
- **Frontend / UI Specialist**: User experience, responsive layout, component reusability, and interaction design.
- **QA / Test Engineer**: Edge-case tests, automated assertions, and regression prevention.
- **Product / Strategy**: User journeys, requirements completeness, and acceptance criteria.

---

## 2. Engineering Execution & Autonomous Protocols

### 💻 Claude Code Protocol (`skills/claude-code`, `CLAUDE.md`)
- **4-Step Engineering Cycle**: Explore (read first) -> Plan (goal-backward) -> Act (surgical diffs) -> Verify (mandatory proof).
- **Verification Gates**: Always run `npm run check` and `npm run update:csp` after modifications.
- **Commands**: Follow `/test`, `/bug`, `/review`, and `/commit` workflows.

### 🔄 Ralph Loop (`skills/ralph-loop`)
- **Iterative Persistence**: Treat filesystem and Git as durable memory to eliminate LLM context degradation.
- Run discrete, single-task work units followed by automated verification and milestone commits.

### 🤖 Roo Code (`skills/roo-code`)
- **Operational Modes**: Operate under explicit modes with strict boundaries:
  - `Architect Mode` (system design, schemas, PRDs)
  - `Code Mode` (implementation, refactoring)
  - `Debug Mode` (RCA, error traces)
  - `Test Mode` (assertions, coverage)
  - `Ask Mode` (read-only Q&A)

### 🛋️ Ponytail (`skills/ponytail`)
- **Ladder of Laziness**: Challenge the need for new code (YAGNI). Rely on native platform capabilities before introducing new libraries. The best code is minimal and easy to delete.

### ⚡ GetShitDone (`skills/getshitdone`)
- **Bias for Action**: Formulate Goal-Backward micro-plans (2–4 atomic steps). Maintain tight execution loops: write code -> verify locally -> deliver working outcomes.

### 🕸️ Graphify (`skills/graphify`)
- **Structural Mapping**: Map call hierarchies, imports, exports, and schema relationships before major refactors. Produce Mermaid diagrams for complex architectures.

---

## 3. Quality Assurance, Debugging & Code Review

### 🐇 CodeRabbit (`skills/coderabbit`)
- **Autonomous PR & Code Audit**: Line-by-line critique across Correctness, Security (Supabase RLS/Secrets), Performance, and Clean Architecture.

### 🐞 Systematic Debug (`skills/debug`)
- **4-Stage RCA Protocol**: Reproduce with minimal script -> Isolate root cause in call stack -> Apply surgical fix -> Verify and prevent regression.

### 🎭 Playwright (`skills/playwright`)
- **Browser Automation & Responsive Auditing**: Cross-browser DOM verification, mobile viewport testing (375px/390px), screenshot visual checks, and console error assertions.

---

## 4. UI/UX Design, Components & Anti-AI Craft

### 🎨 Taste (`skills/taste`)
- **Anti-Slop Design**: Avoid generic AI templates, purposeless gradients, and floating drop-shadow soup. Apply calibrated density, crisp 1px borders, and deliberate typography hierarchy.

### 💎 Impeccable (`skills/impeccable`)
- **Design Craft & Anti-AI Tells**: Use command vocabularies: `/audit` (a11y/perf/responsive), `/critique` (UX hierarchy), `/polish` (final sheen), `/bolder` / `/quieter` (visual volume), and `/harden` (edge cases/errors).

### 🚀 21st.dev (`skills/twentyfirst-dev`)
- **Design Engineering Registry**: Adapt animated components, Magic UI, and Agent Elements into Palateo's vanilla HTML/CSS/JS architecture.

### ✨ Componentry (`skills/componentry`)
- **Interactive UI & Motion**: Production-ready animated UI patterns from [componentry.dev](https://componentry.dev). Maintain 60fps hardware-accelerated animations and respect `prefers-reduced-motion`.

### 🌟 UI/UX Pro Max (`skills/ui-ux-pro-max`)
- **Design Intelligence**: Leverage 161 industry reasoning rules, 67 UI style archetypes, typography pairings, and conversion-optimized mobile layout patterns.

### 📜 HuaShu Design (`skills/huashu-design`)
- **HTML-Native Prototypes**: Self-contained semantic HTML/CSS visual layouts, baseline grid rhythm, and 5-dimension design reviews.

### 🧵 Stitch (`skills/stitch`)
- **AI Design-to-Code**: Translate natural-language design visions and wireframe sketches into clean, scoped HTML/CSS and Tailwind tokens.

### 📐 Unified Design (`skills/design`)
- **Design System Tokens**: Enforce standardized spacing scales, border radii, color contrast minimums (WCAG AA), and component anatomy.

---

## 5. SEO, Search & Generative Visibility

### 🔍 Claude SEO (`skills/claude-seo`)
- **Technical SEO & GEO**: Structured data (JSON-LD Restaurant/Organization schemas), OpenGraph cards, Core Web Vitals optimization, and Generative Engine Optimization (Answer Engine readiness).

---

## 6. Autonomous Cloud & Skill Orchestration

### 🤖 Manus Bridge (`skills/manus`)
- **Cloud Delegation**: Delegate long-running background tasks (dataset crawls, competitor audits, cloud testing) to [manus.im](https://manus.im). Two-way GitHub sync with `inovatist699/Expert-palateo`.

### 🧭 SkillX (`skills/skill-x`) & Awesome Skills (`skills/awesome-skills`)
- **Dynamic Resolution**: Dynamically locate, compose, and mount community skills into unified execution pipelines on demand.
