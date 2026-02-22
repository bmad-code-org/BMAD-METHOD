---
name: evolution
description: Add features to existing products through targeted changes
---

# [E] Evolution — Add Features to Existing Product

**Goal:** Incrementally add features to an existing product with minimal disruption.

**When to use:** Existing product needs new functionality. Changes should be targeted, not a complete rewrite.

---

## CORE PRINCIPLES

- **Backward compatible** — Existing functionality must keep working. Every change is verified against what already exists.
- **Feature flags if needed** — When a change is risky or requires staged rollout, use feature flags to decouple deployment from activation.
- **Incremental delivery** — Ship in small, verifiable increments. Each commit should leave the system in a working state.

---

## INITIALIZATION

### Agent Dialog Gate

1. Check for pending evolution dialogs
2. If none, suggest creating one
3. Load dialog context

### Essential Guides

- **[Execution Principles](data/guides/EXECUTION-PRINCIPLES.md)** — Document-first, plan-then-execute
- **[Session Protocol](data/guides/SESSION-PROTOCOL.md)** — Read dialog, verify plan, present status
- **[Inline Testing Guide](data/guides/INLINE-TESTING-GUIDE.md)** — Baseline capture before modifying existing features

---

## STEPS

Execute steps in `./steps-e/`:

| Step | File | Purpose |
|------|------|---------|
| 01 | step-01-scope-change.md | Define what changes vs what stays |
| 02 | step-02-analyze-impact.md | Analyze impact on existing code |
| 03 | step-03-plan-implementation.md | Plan incremental implementation |
| 04 | step-04-implement.md | Implement changes |
| 05 | step-05-verify-and-document.md | Verify, regression check, document |

**Flow:** 01 → 02 → 03 → 04 → 05

### Critical Rules

- **ALWAYS** map what is new vs what is modified vs what is untouched before coding
- **ALWAYS** capture baseline state of existing features before modifying them
- **ALWAYS** verify backward compatibility at each commit
- **ALWAYS** plan incremental commits — never one giant change
- **NEVER** break existing functionality to add new functionality
- **NEVER** skip impact analysis — surprises in production are expensive

---

## AFTER COMPLETION

1. Update design log
2. Suggest next action
3. Return to activity menu
