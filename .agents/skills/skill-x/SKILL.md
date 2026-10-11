---
name: skill-x
description: Dynamic agent skill runner and meta-skill manager (SkillX). Use when discovering, dynamically loading, or composing agent skills on the fly to solve specialized, domain-specific programming challenges.
---

# SkillX: Dynamic Agent Skill Orchestrator

SkillX provides meta-capabilities for agents to discover, fetch, inject, and compose specialized `SKILL.md` workflows on demand.

## Core Capabilities

### 1. Dynamic Skill Resolution
When a task requires capabilities outside the baseline instructions:
1. **Identify Gap**: Determine the missing procedure or domain specification.
2. **Search Registry**: Scan local `.agents/skills/` and global `~/.gemini/config/skills/` directories.
3. **Progressive Injection**: Read only the targeted `SKILL.md` content into context when needed, preserving token budget.

### 2. Composition & Chaining
SkillX enables combining multiple specialized skills into a unified execution pipeline:
- *Example (New Feature Pipeline)*:
  `ralph-loop` (iterative persistence) + `ui-ux-pro-max` (design layout) + `claude-code` (surgical implementation) + `coderabbit` (pre-commit review).

### 3. Skill Health & Linting
Ensure loaded skills maintain structural integrity:
- Valid YAML frontmatter block.
- Actionable steps with verification criteria.
- Zero duplicate or conflicting command triggers.
