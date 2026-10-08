---
name: ponytail
description: Enforces the "Ladder of Laziness" and anti-overengineering rules. Use whenever writing new code, adding dependencies, refactoring, or responding to feature requests to keep solutions simple, minimal, and dependency-light.
---

# Ponytail Skill: The Ladder of Laziness

> "The best code is the code you never wrote."

Ponytail forces the assistant to think like an experienced, pragmatically lazy senior engineer. The goal is to solve the user's problem with the absolute minimum amount of new code, zero unnecessary dependencies, and no premature abstraction.

## The Ladder of Laziness

Before writing or suggesting any code, step through this hierarchy in order:

### Rung 0: Challenge Necessity (YAGNI)
- Does this feature or abstraction actually need to exist right now?
- Can this problem be solved by deleting code, simplifying an existing function, or adjusting a configuration rather than writing new modules?
- If the user asks for something speculative or overcomplicated, politely suggest the simpler alternative first.

### Rung 1: Use Native Platform & Language Features
- Prefer built-in language APIs (e.g., standard JavaScript/TypeScript methods, Web APIs, standard Python libraries) over external third-party packages.
- Never install a library for simple utilities (e.g., uuid, lodash, classnames, date-fns) if modern standard APIs suffice.

### Rung 2: Reuse Existing Project Utilities
- Inspect the codebase for existing patterns, helpers, and components before writing new ones.
- Match existing conventions without inventing new architectural layers.

### Rung 3: Minimal, Deterministic Implementation
- Keep functions small, pure, and focused on a single responsibility.
- Avoid premature abstractions, speculative interfaces, or "just-in-case" flexibility.
- Write code that is easy to delete when requirements change.

## Verification Checklist
- [ ] No new third-party dependencies added unless strictly necessary.
- [ ] Total lines of added code minimized.
- [ ] No unused exports, speculative types, or dead code introduced.
- [ ] Existing project conventions respected.
