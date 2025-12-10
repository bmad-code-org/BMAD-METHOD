# Step 6.6: Continue with Next Flow

## Your Task

While BMad builds the current flow, start designing the next complete testable flow.

---

## Parallel Work Strategy

**The key to fast delivery:**

```
Week 1: Design Flow 1
Week 2: Handoff Flow 1 → BMad builds Flow 1
        Design Flow 2
Week 3: Handoff Flow 2 → BMad builds Flow 2
        Test Flow 1 (Phase 7)
        Design Flow 3
Week 4: Handoff Flow 3 → BMad builds Flow 3
        Test Flow 2 (Phase 7)
        Design Flow 4
```

**You're never waiting! Always working!**

---

## Return to Phase 4-5

### Identify Next Flow

**What's the next most valuable flow to design?**

**Prioritization criteria:**

1. **User value:** What solves the biggest user problem?
2. **Business value:** What delivers the most ROI?
3. **Dependencies:** What needs to be built next?
4. **Risk:** What's the riskiest to validate early?

**Example prioritization:**

```
✅ Flow 1: Login & Onboarding (DONE - in development)
→ Flow 2: Morning Dog Care (NEXT - highest user value)
   Flow 3: Calendar View (Later - lower priority)
   Flow 4: Family Chat (Later - nice to have)
```

---

### Phase 4: UX Design

**Design scenarios for the next flow:**

1. **Identify trigger moment**
   - What brings user to this flow?
   - What are they trying to accomplish?

2. **Design scenarios**
   - Entry point
   - User actions
   - System responses
   - Exit point

3. **Create specifications**
   - `C-Scenarios/XX-scenario-name/`
   - Frontend specifications
   - Backend specifications
   - Data specifications

4. **Document user flows**
   - Happy path
   - Error states
   - Edge cases

**Goal:** Complete testable flow that delivers value

---

### Phase 5: Design System

**Define components for this flow:**

1. **Identify needed components**
   - What UI elements are needed?
   - Can we reuse existing components?
   - What new components are needed?

2. **Define new components**
   - `D-Design-System/03-Atomic-Components/`
   - Component specifications
   - States and variants
   - Usage guidelines

3. **Update design tokens**
   - Colors
   - Typography
   - Spacing
   - Any new tokens needed

**Goal:** All components defined and ready

---

## When to Return to Phase 6

**Return to Phase 6 when:**

- ✅ All scenarios for next flow are specified
- ✅ All components for next flow are defined
- ✅ Flow is testable end-to-end
- ✅ Flow delivers business value
- ✅ Flow delivers user value
- ✅ No blockers or dependencies

**Then repeat Phase 6:**

- 6.1: Detect completion
- 6.2: Create Design Delivery
- 6.3: Create Test Scenario
- 6.4: Handoff Dialog
- 6.5: Hand Off to BMad
- 6.6: Continue (you are here!)

---

## Managing Multiple Flows

### Track Your Work

**Create a simple tracker:**

```markdown
# Design Deliveries Tracker

## DD-001: Login & Onboarding

- Status: In Development (BMad)
- Handed off: 2024-12-09
- Expected completion: 2024-12-30
- Next: Validation (Phase 7)

## DD-002: Morning Dog Care

- Status: In Design (WDS)
- Phase: 4 (UX Design)
- Progress: 3/5 scenarios complete
- Expected handoff: 2024-12-16

## DD-003: Calendar View

- Status: Not Started
- Priority: Medium
- Planned start: 2024-12-20

## DD-004: Family Chat

- Status: Not Started
- Priority: Low
- Planned start: TBD
```

---

### Communication with BMad

**Keep BMad informed:**

```
Weekly Update to BMad Architect:

"Hey Architect!

Progress update:

DD-001 (Login & Onboarding):
- You're building this
- I'm available for questions
- On track for validation 2024-12-30?

DD-002 (Morning Dog Care):
- I'm designing this now
- 3/5 scenarios complete
- Expected handoff: 2024-12-16
- 2 weeks after DD-001 handoff

DD-003 (Calendar View):
- Next in queue
- Will start after DD-002 handoff

Questions or blockers on DD-001?"
```

---

## Balancing Design and Validation

**As flows complete, you'll be doing both:**

### Week 3 Example

**Monday-Tuesday:**

- Test DD-001 (Phase 7)
- Create issues if needed

**Wednesday-Friday:**

- Design DD-003 scenarios
- Define DD-003 components

**This is the steady state!**

---

## Continuous Improvement

**Learn from each cycle:**

### After Each Handoff

**Reflect:**

- What went well?
- What was unclear?
- What questions did BMad ask?
- How can I improve next delivery?

**Update templates:**

- Add missing fields
- Clarify confusing sections
- Improve examples

**Update process:**

- Streamline handoff dialog
- Better test scenarios
- Clearer specifications

---

## Iteration Cadence

**Typical cadence:**

```
Week 1-2: Design DD-001
Week 2: Handoff DD-001
Week 2-4: BMad builds DD-001
Week 3-4: Design DD-002
Week 4: Handoff DD-002
Week 4-6: BMad builds DD-002
Week 5: Test DD-001 (Phase 7)
Week 5-6: Design DD-003
Week 6: Handoff DD-003
Week 6-8: BMad builds DD-003
Week 7: Test DD-002 (Phase 7)
Week 7-8: Design DD-004
```

**Continuous flow!**

---

## When to Pause

**You might pause designing if:**

### BMad is Blocked

```
BMad: "I'm blocked on DD-001. Need design clarification."

You: "Let me help! Pausing DD-002 design to unblock you."
```

**Priority: Unblock BMad first!**

---

### Too Many Flows in Progress

```
In Progress:
- DD-001: In development
- DD-002: In development
- DD-003: In development
- DD-004: Ready for handoff

You: "Let me pause and let BMad catch up. I'll focus on
      validation instead of new design."
```

**Don't overwhelm the team!**

---

### Validation Backlog

```
Waiting for Validation:
- DD-001: Complete, needs testing
- DD-002: Complete, needs testing
- DD-003: Complete, needs testing

You: "Pause new design. Focus on validation backlog."
```

**Validation is critical!**

---

## Success Metrics

✅ Next flow identified and prioritized
✅ Returned to Phase 4-5 (UX Design & Design System)
✅ Parallel work happening (design + development)
✅ Communication with BMad maintained
✅ Tracker updated
✅ Continuous improvement mindset

---

## Failure Modes

❌ Waiting for BMad instead of designing next flow
❌ Designing too many flows ahead (overwhelming BMad)
❌ Not prioritizing validation when flows complete
❌ Losing track of multiple flows
❌ Not learning from each cycle
❌ Disappearing after handoff

---

## The Rhythm

**Once you find your rhythm:**

```
Design → Handoff → Build → Test → Ship
    ↓
Design → Handoff → Build → Test → Ship
    ↓
Design → Handoff → Build → Test → Ship
    ↓
(Repeat until product is complete)
```

**This is the WDS ↔ BMad workflow in action!**

---

## Completion

**Phase 6 is complete when:**

- ✅ Design Delivery created and handed off
- ✅ BMad is building the flow
- ✅ You've started designing the next flow

**Return to Phase 6 when next flow is ready for handoff!**

---

## Next Steps

**You have three paths:**

### Path 1: Continue Designing (Most Common)

```
[D] Return to Phase 4-5 to design next flow
```

---

### Path 2: Validation Needed

```
[V] Go to Phase 7 if a flow is ready for validation
```

---

### Path 3: All Flows Complete

```
[C] All flows designed and handed off!
    Wait for validations, then ship! 🚀
```

---

## The Big Picture

**You've completed the Phase 6 cycle!**

```
Phase 6.1: Detect Completion ✅
Phase 6.2: Create Delivery ✅
Phase 6.3: Create Test Scenario ✅
Phase 6.4: Handoff Dialog ✅
Phase 6.5: Hand Off to BMad ✅
Phase 6.6: Continue ✅ (you are here!)

→ Return to Phase 4-5 and repeat!
```

---

**Keep the momentum going! Design → Handoff → Build → Test → Ship!** 🚀✨
