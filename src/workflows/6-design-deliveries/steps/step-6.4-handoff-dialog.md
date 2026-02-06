# Step 6.4: Handoff Dialog

## Your Task

Initiate a structured handoff conversation with the BMad Architect to transfer design knowledge and align on implementation.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 6.3 (Test Scenario created)
- ✅ Design Delivery file ready: `deliveries/DD-XXX-name.yaml`
- ✅ Test Scenario file ready: `test-scenarios/TS-XXX-name.yaml`
- ✅ 20-30 minutes available for focused conversation

---

## Handoff Protocol

**Full protocol:** `src/core/resources/wds/handoff-protocol.md`

**Duration:** 20-30 minutes

**Participants:**
- WDS UX Expert (you)
- BMad Architect

---

## Handoff Dialog Structure (10 Phases)

**See:** [substeps/handoff-dialog-scripts.md](substeps/handoff-dialog-scripts.md) for detailed conversation scripts

| Phase | Duration | Focus |
|-------|----------|-------|
| 1. Introduction | 2 min | Greet, state delivery ID, overview |
| 2. User Value | 3 min | Problem, solution, success criteria |
| 3. Scenario Walkthrough | 8 min | User flow, screens, specifications |
| 4. Technical Requirements | 4 min | Platform, integrations, data models |
| 5. Design System Components | 3 min | Components used, design tokens |
| 6. Acceptance Criteria | 3 min | Functional, non-functional, edge cases |
| 7. Testing Approach | 2 min | Test scenarios, validation process |
| 8. Complexity Estimate | 2 min | Size, effort, risk, dependencies |
| 9. Special Considerations | 2 min | Important notes, potential gotchas |
| 10. Confirmation | 1 min | Confirm understanding, next steps |

---

## Document the Handoff

After the dialog, create handoff log using template in substeps file.

**File:** `deliveries/DD-XXX-handoff-log.md`

---

## Update Delivery Status

**Update `deliveries/DD-XXX-name.yaml`:**

```yaml
delivery:
  status: 'in_development' # Changed from "ready"
  handed_off_at: '2024-12-09T12:30:00Z'
  assigned_to: 'bmad-architect'
  handoff_log: 'deliveries/DD-XXX-handoff-log.md'
```

---

## Next Step

After completing the handoff dialog:

```
[C] Continue to step-6.5-hand-off.md
```

---

## Success Metrics

✅ Handoff dialog completed (20-30 min)
✅ All 10 phases covered
✅ Architect understands design vision
✅ Epic breakdown agreed
✅ Questions answered
✅ Handoff log documented
✅ Delivery status updated

---

## Failure Modes

❌ Rushing through handoff (< 15 min)
❌ Skipping phases
❌ Not answering architect's questions
❌ No epic breakdown agreement
❌ Not documenting handoff
❌ Leaving architect confused

---

**Remember:** This handoff is critical! Take your time and ensure the architect fully understands the design!
