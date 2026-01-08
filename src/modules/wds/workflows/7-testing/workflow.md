# Phase 7: Testing (Designer Validation) Workflow

**Validate implementation matches design vision and quality standards**

---

## Purpose

Phase 7 is where you validate that BMad's implementation matches your design specifications and meets quality standards.

**This is Touch Point 3:** BMad → WDS (BMad requests validation)

---

## Workflow Architecture

This uses **micro-file architecture** for disciplined execution:

- Each step is a self-contained file with embedded rules
- Sequential progression with user control at each step
- Iterative testing until approved

---

## Phase 7 Micro-Steps

```
Phase 7.1: Receive Notification
    ↓ (BMad notifies feature complete)
Phase 7.2: Prepare for Testing
    ↓ (Gather materials, set up environment)
Phase 7.3: Run Test Scenarios
    ↓ (Happy path, errors, edge cases, design system, accessibility)
Phase 7.4: Create Issues
    ↓ (Document problems found)
Phase 7.5: Create Test Report
    ↓ (Summarize results)
Phase 7.6: Send to BMad
    ↓ (Notify developer of issues)
Phase 7.7: Iterate or Approve
    ↓ (Retest after fixes OR sign off)
```

---

## When to Enter Phase 7

**After BMad notifies you:**

```
BMad Developer: "Feature complete: DD-001 Login & Onboarding

                 Build: v0.1.0-beta.1
                 Device: Staging environment

                 Ready for designer validation.
                 Test scenario: test-scenarios/TS-001.yaml"
```

---

## Execution

Load and execute `steps/step-7.1-receive-notification.md` to begin the workflow.

**Note:** Each step will guide you to the next step when ready.

---

## Resources

- Test Scenario: `test-scenarios/TS-XXX.yaml`
- Design Delivery: `deliveries/DD-XXX.yaml`
- Scenario Specs: `C-Scenarios/`
- Design System: `D-Design-System/`

---

**Phase 7 is where you ensure quality! Test thoroughly, communicate clearly, and sign off with confidence!** ✅✨
