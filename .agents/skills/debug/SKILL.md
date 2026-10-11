---
name: debug
description: Systematic debugging, root-cause analysis (RCA), and error isolation skill. Use when troubleshooting application bugs, test failures, unhandled exceptions, network timeouts, or unexpected state mutations.
---

# Systematic Debugging & Root-Cause Analysis (RCA) Protocol

Never apply speculative patches or guess at fixes. Follow a disciplined 4-stage debugging methodology.

## 4-Stage Debugging Methodology

### Stage 1: Reproduce
- Create a minimal reproduction command or script (e.g. Node test script, curl invocation, Playwright test).
- Confirm the exact failure condition and capture the complete stack trace and error payload.

### Stage 2: Isolate
- Trace backwards from the point of failure:
  1. What was the exact input argument/payload?
  2. What line threw the exception or returned an invalid value?
  3. Which function or module passed that input?
- Formulate a testable hypothesis: *"The function fails because `data.venue_id` is undefined when user is anonymous."*

### Stage 3: Surgical Fix
- Fix the problem at the root source rather than patching downstream symptoms.
- Ensure the fix doesn't break contracts with other callers.
- Verify that types, null checks, and error boundaries are properly in place.

### Stage 4: Verification & Regression Prevention
- Run the reproduction script to prove the bug is resolved.
- Run project-wide checks (in Palateo: `npm run check` and `npm run update:csp`).
- Add an automated regression test or assertion to ensure the bug cannot recur.
