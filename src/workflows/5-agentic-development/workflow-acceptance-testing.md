---
name: acceptance-testing
description: Design and run acceptance tests from specification criteria
---

# [T] Acceptance Testing — Design & Run Tests from Spec Criteria

**Goal:** Validate that implementation matches design specifications through structured testing.

**When to use:** Implementation is complete (prototype or production), ready for validation against specs.

---

## INITIALIZATION

### Agent Dialog Gate

1. Check for pending testing dialogs
2. If none, suggest creating one with test target
3. Load dialog context (which delivery/feature to test)

---

## STEPS

Execute steps in `./steps-t/`:

| Step | File | Purpose |
|------|------|---------|
| 01 | step-01-prepare.md | Gather materials, set up environment |
| 02 | step-02-execute.md | Run all test categories |
| 03 | step-03-document-issues.md | Create issue tickets |
| 04 | step-04-report.md | Compile test report |
| 05 | step-05-iterate.md | Iterate fixes or approve |

**Reference data:**
- `./data/testing-guide.md`
- `./data/test-result-templates.md`
- `./data/issue-templates.md`

---

## AFTER COMPLETION

1. Update design log
2. If approved, suggest handover (Phase 4 [H]) or next iteration
3. Return to activity menu
