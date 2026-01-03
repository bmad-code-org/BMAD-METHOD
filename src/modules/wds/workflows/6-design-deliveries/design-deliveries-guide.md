# Phase 6: Design Deliveries

**Package complete testable flows and hand off to development**

---

## Purpose

Phase 6 is where you package complete testable flows and hand off to development.

**This is an iterative phase** - you'll repeat it for each complete flow you design.

---

## Phase 6 Micro-Steps Overview

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

## When to Enter Phase 6

**After completing ONE complete testable user flow:**

✅ **Phase 4 Complete:** All scenarios for this flow are specified
✅ **Phase 5 Complete:** All components for this flow are defined
✅ **Flow is testable:** Entry point → Exit point, complete
✅ **Flow delivers value:** Business value + User value
✅ **Ready for development:** No blockers or dependencies

**Example:**

```
Flow: Login & Onboarding
✓ Scenario 01: Welcome screen
✓ Scenario 02: Login
✓ Scenario 03: Signup
✓ Scenario 04: Family setup
✓ Components: Button, Input, Card
✓ Testable: App open → Dashboard
✓ Value: Users can access the app
→ Ready for Phase 6!
```

---

## Phase 6 Micro-Steps

### Phase 6.1: Detect Epic Completion

**Check if you have a complete testable flow:**

- ✅ All scenarios for this flow are specified
- ✅ All components for this flow are defined
- ✅ Flow is testable (entry → exit)
- ✅ Flow delivers business value
- ✅ Flow delivers user value
- ✅ No blockers or dependencies

**If YES:** Proceed to Phase 6.2
**If NO:** Return to Phase 4-5 and continue designing

---

### Phase 6.2: Create Design Delivery

**File:** `deliveries/DD-XXX-name.yaml`

**Use template:** `templates/design-delivery.template.yaml`

**Include:**

- All scenarios for this flow
- Technical requirements
- Design system components used
- Acceptance criteria
- Testing guidance
- Complexity estimate

**Example:**

```yaml
delivery:
  id: 'DD-001'
  name: 'Login & Onboarding Flow'
  status: 'ready'
  priority: 'high'

design_artifacts:
  scenarios:
    - id: '01-welcome'
      path: 'C-Scenarios/01-welcome-screen/'
    - id: '02-login'
      path: 'C-Scenarios/02-login/'
    # ... etc

user_value:
  problem: 'Users need to access the app securely'
  solution: 'Streamlined onboarding with family setup'
  success_criteria:
    - 'User completes signup in under 2 minutes'
    - '90% completion rate'
```

---

### Phase 6.3: Create Test Scenario

**File:** `test-scenarios/TS-XXX-name.yaml`

**Use template:** `templates/test-scenario.template.yaml`

**Include:**

- Happy path tests
- Error state tests
- Edge case tests
- Design system validation
- Accessibility tests
- Usability tests

**Example:**

```yaml
test_scenario:
  id: 'TS-001'
  name: 'Login & Onboarding Testing'
  delivery_id: 'DD-001'

happy_path:
  - id: 'HP-001'
    name: 'New User Complete Onboarding'
    steps:
      - action: 'Open app'
        expected: 'Welcome screen appears'
        design_ref: 'C-Scenarios/01-welcome/Frontend/specifications.md'
      # ... etc
```

---

### Phase 6.4: Handoff Dialog

**Initiate conversation with BMad Architect**

**Duration:** 20-30 minutes

**Protocol:** See `src/core/resources/wds/handoff-protocol.md`

**Topics to cover:**

1. User value and success criteria
2. Scenario walkthrough
3. Technical requirements
4. Design system components
5. Acceptance criteria
6. Testing approach
7. Complexity estimate
8. Special considerations
9. Implementation planning
10. Confirmation

**Example:**

```
WDS UX Expert: "Hey Architect! I've completed the design for
                Login & Onboarding. Let me walk you through
                Design Delivery DD-001..."

[20-minute structured conversation]

BMad Architect: "Handoff complete! I'll break this down into
                 4 development epics. Total: 3 weeks."

WDS UX Expert: "Perfect! I'll start designing the next flow
                while you build this one."
```

---

### Phase 6.5: Hand Off to BMad

**Mark delivery as handed off:**

Update delivery status:

```yaml
delivery:
  status: 'in_development'
  handed_off_at: '2024-12-09T11:00:00Z'
  assigned_to: 'bmad-architect'
```

**BMad receives:**

- Design Delivery (DD-XXX.yaml)
- All scenario specifications
- Design system components
- Test scenario (TS-XXX.yaml)

**BMad starts:**

- Architecture design
- Epic breakdown
- Implementation

---

### Phase 6.6: Continue with Next Flow

**While BMad builds this flow, you design the next one!**

**Return to Phase 4:**

- Design next complete testable flow
- Create specifications
- Define components

**Then return to Phase 6:**

- Create next Design Delivery
- Hand off to BMad
- Repeat

**Parallel work:**

```
Week 1: Design Flow 1
Week 2: Handoff Flow 1 → BMad builds Flow 1
        Design Flow 2
Week 3: Handoff Flow 2 → BMad builds Flow 2
        Design Flow 3
        Test Flow 1 (Phase 7)
Week 4: Handoff Flow 3 → BMad builds Flow 3
        Test Flow 2 (Phase 7)
        Design Flow 4
```

---

## Deliverables

### Design Delivery File

**Location:** `deliveries/DD-XXX-name.yaml`

**Contents:**

- Delivery metadata (id, name, status, priority)
- User value (problem, solution, success criteria)
- Design artifacts (scenarios, flows, components)
- Technical requirements (platform, integrations, data models)
- Acceptance criteria (functional, non-functional, edge cases)
- Testing guidance (user testing, QA testing)
- Complexity estimate (size, effort, risk, dependencies)

---

### Test Scenario File

**Location:** `test-scenarios/TS-XXX-name.yaml`

**Contents:**

- Test metadata (id, name, delivery_id, status)
- Test objectives
- Happy path tests
- Error state tests
- Edge case tests
- Design system validation
- Accessibility tests
- Usability tests
- Performance tests
- Sign-off criteria

---

### Handoff Log

**Location:** `deliveries/DD-XXX-handoff-log.md`

**Contents:**

- Handoff date and duration
- Participants
- Key points discussed
- Epic breakdown agreed
- Questions and answers
- Action items
- Status

---

## Quality Checklist

### Before Creating Delivery

- [ ] All scenarios for this flow are specified
- [ ] All components for this flow are defined
- [ ] Flow is complete (entry → exit)
- [ ] Flow is testable end-to-end
- [ ] Flow delivers business value
- [ ] Flow delivers user value
- [ ] No blockers or dependencies
- [ ] Technical requirements are clear

### Design Delivery Complete

- [ ] Delivery file created (DD-XXX.yaml)
- [ ] All required fields filled
- [ ] Scenarios referenced correctly
- [ ] Components listed accurately
- [ ] Acceptance criteria are clear
- [ ] Testing guidance is complete
- [ ] Complexity estimate is realistic

### Test Scenario Complete

- [ ] Test scenario file created (TS-XXX.yaml)
- [ ] Happy path tests cover full flow
- [ ] Error states are tested
- [ ] Edge cases are covered
- [ ] Design system validation included
- [ ] Accessibility tests included
- [ ] Sign-off criteria are clear

### Handoff Complete

- [ ] Handoff dialog completed
- [ ] BMad Architect understands design
- [ ] Epic breakdown agreed upon
- [ ] Questions answered
- [ ] Special considerations noted
- [ ] Handoff log documented
- [ ] Delivery marked as "in_development"

---

## Common Patterns

### Pattern 1: First Delivery (MVP)

**Goal:** Get to testing as fast as possible

**Approach:**

1. Design the most critical user flow first
2. Example: Login & Onboarding (users must access app)
3. Keep it simple and focused
4. Hand off quickly
5. Learn from testing

---

### Pattern 2: Incremental Value

**Goal:** Deliver value incrementally

**Approach:**

1. Each delivery adds new value
2. Example: DD-001 (Login) → DD-002 (Core Feature) → DD-003 (Enhancement)
3. Users see progress
4. Business sees ROI
5. Team stays motivated

---

### Pattern 3: Parallel Streams

**Goal:** Maximize throughput

**Approach:**

1. Designer designs Flow 2 while BMad builds Flow 1
2. Designer designs Flow 3 while BMad builds Flow 2
3. Designer tests Flow 1 while designing Flow 4
4. Continuous flow of work
5. No waiting or blocking

---

## Tips for Success

### DO ✅

**Design complete flows:**

- Entry point to exit point
- All scenarios specified
- All components defined
- Testable end-to-end

**Deliver value:**

- Business value (ROI, metrics)
- User value (solves problem)
- Testable (can validate)
- Ready (no blockers)

**Communicate clearly:**

- Handoff dialog is crucial
- Answer all questions
- Document decisions
- Stay available

**Iterate fast:**

- Don't design everything at once
- Get to testing quickly
- Learn from real users
- Adjust based on feedback

### DON'T ❌

**Don't wait:**

- Don't design all flows before handing off
- Don't wait for perfection
- Don't block development

**Don't over-design:**

- Don't add unnecessary features
- Don't gold-plate
- Don't lose focus on value

**Don't under-specify:**

- Don't leave gaps in specifications
- Don't assume BMad will figure it out
- Don't skip edge cases

**Don't disappear:**

- Don't hand off and vanish
- Don't ignore questions
- Don't skip validation (Phase 7)

---

## Next Steps

**After Phase 6:**

1. **BMad builds the flow** (Architecture → Implementation)
2. **You design the next flow** (Return to Phase 4-5)
3. **BMad notifies when ready** (Feature complete)
4. **You validate** (Phase 7: Testing)
5. **Iterate if needed** (Fix issues, retest)
6. **Sign off** (When quality meets standards)
7. **Repeat** (Next delivery)

---

## Resources

**Templates:**

- `templates/design-delivery.template.yaml`
- `templates/test-scenario.template.yaml`

**Specifications:**

- `src/core/resources/wds/design-delivery-spec.md`
- `src/core/resources/wds/handoff-protocol.md`
- `src/core/resources/wds/integration-guide.md`

**Examples:**

- See `WDS-V6-CONVERSION-ROADMAP.md` for integration details

---

**Phase 6 is where design becomes development! Package, handoff, and keep moving!** 📦✨
