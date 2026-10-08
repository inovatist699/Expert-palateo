---
name: getshitdone
description: Spec-driven, high-velocity execution framework (GSD). Use when planning features, executing complex multi-step tasks, or debugging to maintain strict focus, break work into atomic milestones, and verify each step without context drift.
---

# Get Shit Done (GSD) Framework

GSD is an action-oriented execution engine designed for high-velocity software engineering. It prevents analysis paralysis and context rot by enforcing Goal-Backward planning, atomic micro-plans, and immediate verification loops.

## Core Operational Principles

1. **Goal-Backward Thinking**: Start from the finished, verified state. What must be true, tested, and running for this task to be declared done?
2. **Plans-as-Prompts**: Maintain clear, atomic execution plans. Avoid massive monolithic diffs.
3. **No Fluff**: Strip out conversational filler. Communicate through concrete diffs, commands, and verification logs.

## Execution Phases

### Phase 1: Context & Gap Analysis
- Inspect existing files, configuration, and dependencies.
- Pinpoint the exact delta between current state and desired goal.
- Identify edge cases or blockers before touching code.

### Phase 2: Atomic Execution Plan
Draft a concise plan with 2–4 sequential steps:
```markdown
- [ ] Step 1: <Concrete action & targeted file>
- [ ] Step 2: <Integration or logic wiring>
- [ ] Step 3: <Automated test or runtime verification>
```

### Phase 3: Focused Implementation
- Execute one step at a time.
- Verify changes after each step (run type check, unit tests, or build command).
- If an error occurs, diagnose the root cause immediately rather than piling on workarounds.

### Phase 4: Verification & Delivery
- Confirm end-to-end functionality.
- Provide a crisp summary:
  1. What was created/modified.
  2. How it was verified.
  3. Immediate next step or testing guidance.
