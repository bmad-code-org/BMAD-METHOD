# Step 8.4: Create Design Delivery

## Your Task

Package your incremental improvement as a Design Delivery (DD-XXX) for BMad.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 8.3 (update designed)
- ✅ Update specifications created
- ✅ Change scope documented
- ✅ Before/after comparison ready

---

## Design Delivery Format

**IMPORTANT:** All design work uses Design Deliveries (DD-XXX), whether it's:

- ✅ Complete new user flows (large scope)
- ✅ Incremental improvements (small scope)

**The format is the same - only the scope and content differ!**

| Scope | Description | Effort |
|-------|-------------|--------|
| **Large** (New Flows) | Multiple scenarios, complete user flow | Weeks |
| **Small** (Improvements) | Targeted changes, focused improvement | Days |

---

## Create Design Delivery File

**File:** `deliveries/DD-XXX-description.yaml`

**Numbering:** Continue from last DD number (use leading zeros)

**See:** [substeps/delivery-templates.md](substeps/delivery-templates.md) for complete Design Delivery template

---

## Key Sections in DD File

| Section | Purpose |
|---------|---------|
| **improvement** | Summary, problem, solution, expected impact |
| **changes** | Screens affected, components new/modified/unchanged |
| **design_artifacts** | Links to specifications, components |
| **technical_requirements** | Frontend, backend, data, integrations |
| **acceptance_criteria** | Testable criteria with verification |
| **metrics** | Baseline, targets, measurement period, rollback criteria |
| **effort** | Design, frontend, backend, testing estimates |
| **timeline** | Key dates from design to measurement |

---

## Create Test Scenario

**File:** `test-scenarios/TS-XXX-description.yaml`

**Simplified for incremental improvements:**

**See:** [substeps/delivery-templates.md](substeps/delivery-templates.md) for Test Scenario template

Key focus areas:
- New functionality (what changed)
- Regression testing (what should stay the same)
- Edge cases specific to the update
- Accessibility

---

## Next Step

After creating the delivery:

```
[C] Continue to step-8.5-hand-off.md
```

---

## Success Metrics

✅ Design Delivery file created
✅ Change scope clearly defined
✅ All artifacts referenced
✅ Acceptance criteria defined
✅ Metrics and targets set
✅ Test scenario created
✅ Rollback criteria defined

---

## Failure Modes

❌ Vague change description
❌ Missing artifacts
❌ No success metrics
❌ No rollback criteria
❌ Scope too large
❌ No before/after comparison

---

**Remember:** Design Deliveries (small scope) are focused, measurable improvements!
