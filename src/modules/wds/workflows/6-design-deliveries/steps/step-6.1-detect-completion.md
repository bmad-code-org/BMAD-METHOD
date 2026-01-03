# Step 6.1: Detect Epic Completion

## Your Task

Check if you have a complete testable flow ready for handoff.

---

## Completion Checklist

**Review your work from Phase 4-5:**

### Phase 4: UX Design Complete?

- [ ] All scenarios for this flow are specified
- [ ] Each scenario has complete specifications
- [ ] User flows are documented
- [ ] Interactions are defined
- [ ] Error states are designed

**Location:** `C-Scenarios/XX-scenario-name/`

---

### Phase 5: Design System Complete?

- [ ] All components for this flow are defined
- [ ] Design tokens are documented
- [ ] Component specifications are complete
- [ ] Usage guidelines are clear
- [ ] States and variants are defined

**Location:** `D-Design-System/03-Atomic-Components/`

---

### Flow Completeness

- [ ] **Flow is testable:** Entry point → Exit point, complete
- [ ] **Flow delivers business value:** Measurable business outcome
- [ ] **Flow delivers user value:** Solves user problem
- [ ] **No blockers:** All dependencies resolved
- [ ] **No unknowns:** All design decisions made

---

## Example: Login & Onboarding Flow

```
✓ Scenario 01: Welcome screen (complete)
✓ Scenario 02: Login (complete)
✓ Scenario 03: Signup (complete)
✓ Scenario 04: Family setup (complete)

✓ Components: Button, Input, Card (all defined)
✓ Design tokens: Colors, Typography, Spacing (documented)

✓ Testable: App open → Dashboard (complete flow)
✓ Business value: Users can access the app
✓ User value: Easy onboarding experience
✓ No blockers: All technical requirements clear

→ Ready for Phase 6.2!
```

---

## Decision Point

**Is your flow complete and ready for handoff?**

### ✅ YES - Flow is Complete

**Proceed to Phase 6.2:**

```
[C] Continue to step-6.2-create-delivery.md
```

---

### ❌ NO - Flow is Not Complete

**What's missing?**

**If scenarios are incomplete:**

- Return to Phase 4: UX Design
- Complete missing scenarios
- Return to this step when done

**If components are incomplete:**

- Return to Phase 5: Design System
- Define missing components
- Return to this step when done

**If flow is not testable:**

- Identify missing pieces
- Complete the flow
- Return to this step when done

---

## Success Metrics

✅ All scenarios for this flow are specified
✅ All components for this flow are defined
✅ Flow is testable end-to-end
✅ Flow delivers measurable value
✅ No blockers or unknowns
✅ User confirmed readiness to proceed

---

## Failure Modes

❌ Proceeding with incomplete scenarios
❌ Missing component definitions
❌ Flow has gaps or unknowns
❌ Dependencies not resolved
❌ Design decisions not finalized

---

## Next Step

After confirming completion, load `./step-6.2-create-delivery.md` to create the Design Delivery.

**Remember:** Do NOT proceed until the flow is truly complete!
