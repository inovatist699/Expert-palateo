---
name: coderabbit
description: Automated AI code review, PR analysis, and security auditing inspired by CodeRabbit.ai. Use before submitting changes, creating PRs, or reviewing git diffs to detect bugs, security flaws, performance bottlenecks, and style deviations.
---

# CodeRabbit: Autonomous Code Review & PR Audit

Emulates the multi-dimensional code review process of **CodeRabbit** directly in your local environment.

## Review Dimensions

When evaluating code or git diffs, inspect across four distinct axes:

### 1. High-Level Summary & Walkthrough
- Provide a 2–3 sentence executive summary of the changes.
- Output a change classification table (e.g. `Features`, `Bug Fixes`, `Refactoring`, `Tests`).

### 2. Correctness & Logical Flaws
- **Null / Undefined checks**: Are optional fields safely accessed?
- **Off-by-one errors & boundary checks**: Array indexing, loops, range validations.
- **State mutations & race conditions**: Asynchronous operations, unhandled Promise rejections.

### 3. Security & Data Protection
- **Secrets & Credentials**: Flag any committed `.env`, API keys, tokens, or private credentials.
- **Injection & Sanitization**: Ensure user inputs in SQL, HTML, or shell commands are properly escaped or parameterized.
- **Auth & Access Control**: Verify user ID ownership checks and Supabase RLS compliance.

### 4. Performance & Clean Code
- Eliminate unnecessary re-renders, unindexed queries, or blocking loops.
- Adhere to the **Ponytail** rule: no bloated dependencies or premature abstractions.

## Output Format
Deliver review comments using structured markdown:
- **Severity**: `[Critical]`, `[Warning]`, or `[Suggestion]`
- **Location**: `path/to/file:line`
- **Rationale**: Clear explanation of the risk.
- **Actionable Fix**: Provide the exact drop-in code snippet.
