# Phase 6: Design Deliveries Workflow

**Package complete testable flows and hand off to development**

---

## Purpose

Phase 6 is where you package complete testable flows and hand off to development.

**This is an iterative phase** - you'll repeat it for each complete flow you design.

---

## Workflow Architecture

This uses **micro-file architecture** for disciplined execution:

- Each step is a self-contained file with embedded rules
- Sequential progression with user control at each step
- You NEVER proceed to a step file if the current step file indicates the user must approve and indicate continuation

---

## Phase 6 Micro-Steps

```
Phase 6.1: Detect Epic Completion
    ↓ (Is flow complete and testable?)
Phase 6.2: Create Design Delivery
    ↓ (Package into DD-XXX.yaml)
Phase 6.3: Create Test Scenario
    ↓ (Define validation tests)
Phase 6.4: Handoff Dialog
    ↓ (20-30 min with BMad Architect)
Phase 6.5: Hand Off to BMad
    ↓ (Mark as in_development)
Phase 6.6: Continue with Next Flow
    ↓ (Return to Phase 4-5)
```

---

## Execution

Load and execute `steps/step-6.1-detect-completion.md` to begin the workflow.

**Note:** Each step will guide you to the next step when ready.

---

## Templates

- `templates/design-delivery.template.yaml`
- `templates/test-scenario.template.yaml`

---

## Resources

- `src/core/resources/wds/design-delivery-spec.md`
- `src/core/resources/wds/handoff-protocol.md`
- `src/core/resources/wds/integration-guide.md`

---

**Phase 6 is where design becomes development! Package, handoff, and keep moving!** 📦✨
