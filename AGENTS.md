# Agent Guidelines & Intelligence Stack: Palateo

This repository is configured with a modular agent stack combining **Agency Agents**, **Ponytail**, **GetShitDone (GSD)**, **Taste**, and **Graphify**.

---

## 1. Agency Agents (`.agents/agency-agents`)
The specialized agent roster from [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) is integrated into this workspace under `.agents/agency-agents/`.

When handling tasks matching specific disciplines, adopt the perspective, rigor, and workflows of the corresponding persona:
- **Engineering / Tech Lead**: Focus on architecture, correctness, security, and scalability.
- **Frontend / UI Specialist**: Focus on user experience, responsive layout, component reusability, and interaction design.
- **QA / Test Engineer**: Proactively write edge-case tests, verify assertions, and prevent regression bugs.
- **Product / Strategy**: Validate user journeys, requirements completeness, and acceptance criteria.

---

## 2. Active Skills & Execution Rules

### 🛋️ Ponytail (`skills/ponytail`)
- **Ladder of Laziness**: Never over-engineer. Challenge the need for new code (YAGNI).
- Rely on native platform capabilities and existing utilities before introducing new libraries.
- The best code is minimal, readable, and easy to delete.

### ⚡ GetShitDone (`skills/getshitdone`)
- **Bias for Action**: Formulate Goal-Backward micro-plans (2–4 atomic steps).
- Maintain tight execution loops: write code -> verify locally -> confirm functionality.
- Strip away boilerplate conversational chatter; deliver working implementations.

### 🎨 Taste (`skills/taste`)
- **Anti-Slop Design**: Avoid generic AI templates, purposeless gradients, and floating drop-shadow soup.
- Apply calibrated density, crisp 1px borders, purposeful typography hierarchy, and deliberate micro-interactions.

### 🕸️ Graphify (`skills/graphify`)
- **Structural Mapping**: Map call hierarchies, imports, exports, and schema relationships before major refactors.
- Produce Mermaid diagrams to visualize module boundaries and state flow.
- Perform blast-radius analysis before altering shared data contracts.
