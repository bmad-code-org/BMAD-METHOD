# {DATE} {Bug Name} — Bug Fix

## Meta

| Field | Value |
|-------|-------|
| **Date** | {YYYY-MM-DD} |
| **Type** | 🐛 Bug Fix |
| **Agent** | {Agent name} |
| **Issue** | {Brief description} |
| **Reported By** | {Who reported} |
| **Priority** | {Critical / High / Medium / Low} |
| **Status** | Not Started |

---

## Purpose

Fix: {One sentence description of the bug}

---

## Bug Details

### Symptoms

{What the user sees / what's happening wrong}

### Expected Behavior

{What should happen instead}

### Steps to Reproduce

1. {Step 1}
2. {Step 2}
3. {Step 3}
4. **Result:** {What happens}
5. **Expected:** {What should happen}

### Environment

- **Browser/Device:** {e.g., Chrome 120, iPhone 14}
- **OS:** {e.g., macOS, iOS 17}
- **User Type:** {e.g., Authenticated, Admin}

### Evidence

- Screenshot: {path or description}
- Console errors: {if any}
- Network issues: {if any}

---

## Setup Context

### Relevant Files

| File | Purpose | Likely Cause? |
|------|---------|---------------|
| `{path/to/file}` | {What it does} | {Yes/No/Maybe} |

### Related Code

```typescript
// Suspected problematic code
{code snippet if known}
```

---

## Investigation

### Hypotheses

1. **{Hypothesis 1}** — {Why you think this might be the cause}
2. **{Hypothesis 2}** — {Alternative explanation}

### Investigation Steps

- [ ] Reproduce the issue locally
- [ ] Check console for errors
- [ ] Review recent changes to related files
- [ ] Add debugging/logging
- [ ] Identify root cause

---

## Steps Overview

| # | Step | Status | Notes |
|---|------|--------|-------|
| 1 | [Reproduce Issue](steps/01-reproduce.md) | 🔲 | |
| 2 | [Identify Root Cause](steps/02-investigate.md) | 🔲 | |
| 3 | [Implement Fix](steps/03-fix.md) | 🔲 | |
| 4 | [Test Fix](steps/04-test.md) | 🔲 | |
| 5 | [Verify No Regression](steps/05-verify.md) | 🔲 | |

---

## The Fix

### Root Cause

{Discovered root cause — fill in after investigation}

### Solution

{Description of the fix — fill in after implementing}

### Files Changed

| File | Change |
|------|--------|
| `{path}` | {What was changed} |

---

## Testing

### Verification Steps

1. {How to verify the fix works}
2. {Step 2}
3. {Expected result}

### Regression Testing

- [ ] Original bug is fixed
- [ ] Related functionality still works
- [ ] No new console errors
- [ ] Other states/flows unaffected

---

## Progress Log

### {YYYY-MM-DD}

- Created bug fix dialog
- Initial investigation

<!--
### {YYYY-MM-DD}
- Reproduced issue
- Identified root cause: {description}
- Implemented fix
- Verified fix works
-->

---

## Learnings

<!--
What can we learn to prevent similar bugs?
-->

- {Pattern that caused this}
- {How to prevent in future}

---

_Bug Fix Dialog — WDS Agent Dialog Workflow_
