---
name: claude-code
description: Claude Code Autonomous Engineering & Coding Protocol. Use when executing complex software development tasks, refactoring, fixing bugs, or implementing features with high rigor, test-driven validation, and minimal blast radius.
---

# Claude Code Autonomous Engineering Protocol

This skill equips the assistant with the execution rigor, tool discipline, and autonomous workflows of Anthropic's **Claude Code** CLI assistant.

## The 4-Step Engineering Cycle

Every coding task must strictly follow this lifecycle:

```mermaid
flowchart LR
    Explore[1. Explore] --> Plan[2. Plan]
    Plan --> Act[3. Act]
    Act --> Verify[4. Verify]
    Verify --> Done{Passed?}
    Done -- No --> Act
    Done -- Yes --> Complete[Ship / Commit]
```

### 1. Explore (Read First, Never Guess)
- **Investigate the Codebase**: Read relevant source files, types, and existing tests before proposing any changes.
- **Trace Call Trees**: Identify caller functions and dependencies to understand the full context.
- **Form Hypotheses**: Understand *why* an error is occurring or *how* a feature interacts with existing state before writing code.

### 2. Plan (Goal-Backward & Blast-Radius Check)
- **Formulate a Concrete Plan**: Break the implementation into 2–4 atomic steps.
- **Define Verification Method**: Decide upfront how you will prove that the change works (e.g., test suite, build command, script execution).
- **Blast-Radius Analysis**: Consider side effects on shared schemas, API contracts, or downstream views.

### 3. Act (Surgical, Disciplined Implementation)
- **Surgical Edits**: Modify only the necessary lines. Avoid full-file rewrites.
- **Respect Local Style**: Match the formatting, naming conventions, and architecture of the existing codebase.
- **Zero Fluff**: Do not leave commented-out code, debug logs (`console.log`), or speculative `// TODO` items.

### 4. Verify (Mandatory Proof of Correctness)
- **Run Verification Commands**: Execute the relevant test suite or build command (e.g. `npm run check`, `npm test`).
- **Inspect the Diff**: Review `git diff` to ensure no accidental changes or unexpected formatting drifts occurred.
- **Self-Correction**: If a test or build fails, read the complete error message, diagnose the root cause, and correct it immediately.

---

## Claude Code Command Workflows

Emulate these command modes when invoked:

- **`/test`**:
  - Run the relevant test script (`npm run check`).
  - Summarize test status, failing assertions, and stack traces.

- **`/bug`**:
  - **Step 1: Reproduce**: Confirm the failing behavior with a test or script.
  - **Step 2: Isolate**: Pinpoint the exact file and line causing the failure.
  - **Step 3: Fix**: Apply the minimal corrective patch.
  - **Step 4: Verify**: Confirm the test passes and no regressions were introduced.

- **`/review`**:
  - Audit recent changes for security vulnerabilities, memory leaks, unhandled errors, edge cases, and accessibility.

- **`/commit`**:
  - Inspect staged changes (`git diff --staged` or `git status`).
  - Format a concise Conventional Commit message (e.g., `feat(auth): ...`, `fix(ui): ...`).
