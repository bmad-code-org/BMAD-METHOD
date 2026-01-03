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

## Handoff Dialog Structure

### Phase 1: Introduction (2 min)

**You say:**

```
"Hey Architect! I've completed the design for [Flow Name].
 I'd like to walk you through Design Delivery DD-XXX.

 This delivery includes:
 - [Number] scenarios
 - [Number] components
 - Complete test scenarios

 Ready for the walkthrough?"
```

**Architect responds:**

```
"Absolutely! Let's go through it."
```

---

### Phase 2: User Value (3 min)

**Explain the user value:**

```
"First, let me explain what problem we're solving:

Problem:
[Describe the user problem]

Solution:
[Describe how this flow solves it]

Success Criteria:
- [Metric 1]
- [Metric 2]
- [Metric 3]

This is critical because [business value]."
```

**Questions to answer:**

- Why does this flow matter?
- What business value does it deliver?
- How will we measure success?

---

### Phase 3: Scenario Walkthrough (8 min)

**Walk through each scenario:**

```
"Let me walk you through the user flow:

Scenario 1: [Name]
- User starts at: [Entry point]
- User action: [What they do]
- System response: [What happens]
- User sees: [What's displayed]
- Design reference: C-Scenarios/XX-name/

[Repeat for each scenario]

The complete flow is:
[Entry point] → [Step 1] → [Step 2] → [Exit point]"
```

**Show:**

- Excalidraw sketches (if available)
- Scenario specifications
- User flow diagrams

**Architect may ask:**

- "What happens if [edge case]?"
- "How does this integrate with [existing feature]?"
- "What's the data flow here?"

**Answer clearly and reference specifications!**

---

### Phase 4: Technical Requirements (4 min)

**Review technical requirements:**

```
"Technical requirements:

Platform:
- Frontend: [Framework + version]
- Backend: [Framework + version]
- Database: [Database + version]

Integrations:
- [Integration 1]: [Purpose]
- [Integration 2]: [Purpose]

Data Models:
- [Model 1]: [Fields]
- [Model 2]: [Fields]

Performance:
- [Requirement 1]
- [Requirement 2]

Security:
- [Requirement 1]
- [Requirement 2]"
```

**Architect may ask:**

- "Why this tech stack?"
- "Are there any constraints?"
- "What about [technical concern]?"

**Answer:** Reference `platform-requirements.yaml` if needed!

---

### Phase 5: Design System Components (3 min)

**Review components:**

```
"Design system components used:

Button:
- Primary variant: [Usage]
- Secondary variant: [Usage]
- Specs: D-Design-System/.../Buttons/

Input:
- Text variant: [Usage]
- Email variant: [Usage]
- Password variant: [Usage]
- Specs: D-Design-System/.../Inputs/

[List all components]

All components follow our design tokens:
- Colors: tokens/colors.json
- Typography: tokens/typography.json
- Spacing: tokens/spacing.json"
```

**Architect may ask:**

- "Do these components already exist?"
- "Any new components needed?"
- "What about [specific state]?"

**Answer:** Reference component specifications!

---

### Phase 6: Acceptance Criteria (3 min)

**Review acceptance criteria:**

```
"Acceptance criteria:

Functional:
- [Criterion 1]
- [Criterion 2]
- [Criterion 3]

Non-Functional:
- [Criterion 1]
- [Criterion 2]

Edge Cases:
- [Case 1]
- [Case 2]

All criteria are testable and defined in TS-XXX.yaml"
```

---

### Phase 7: Testing Approach (2 min)

**Explain testing:**

```
"Testing approach:

I've created test scenario TS-XXX which includes:
- Happy path tests ([number] tests)
- Error state tests ([number] tests)
- Edge case tests ([number] tests)
- Design system validation
- Accessibility tests

When you're done implementing, I'll:
1. Run these test scenarios
2. Create issues if problems found
3. Iterate with you until approved
4. Sign off when quality meets standards"
```

---

### Phase 8: Complexity Estimate (2 min)

**Discuss complexity:**

```
"My complexity estimate:

Size: [Small/Medium/Large]
Effort: [Time estimate]
Risk: [Low/Medium/High]

Dependencies:
- [Dependency 1]
- [Dependency 2]

Assumptions:
- [Assumption 1]
- [Assumption 2]

Does this align with your technical assessment?"
```

**Architect responds with their estimate:**

```
"I'll break this into [number] epics:
- Epic 1: [Name] ([time])
- Epic 2: [Name] ([time])
- Epic 3: [Name] ([time])

Total: [time estimate]"
```

**Discuss any discrepancies!**

---

### Phase 9: Special Considerations (2 min)

**Highlight anything special:**

```
"Special considerations:

- [Important note 1]
- [Important note 2]
- [Potential gotcha]
- [Critical requirement]

Questions or concerns?"
```

**Architect may raise:**

- Technical challenges
- Integration concerns
- Timeline issues
- Resource needs

**Discuss and resolve!**

---

### Phase 10: Confirmation & Next Steps (1 min)

**Confirm handoff:**

```
You: "So to confirm:
- You have DD-XXX.yaml (Design Delivery)
- You have TS-XXX.yaml (Test Scenario)
- You have all scenario specs in C-Scenarios/
- You have all component specs in D-Design-System/
- You'll break this into [number] epics
- Estimated [time] to implement
- You'll notify me when ready for validation

Anything else you need?"

Architect: "All set! I'll start architecture design and
            break this down into epics. I'll notify you
            when implementation is complete and ready
            for your validation."

You: "Perfect! I'll start designing the next flow while
      you build this one. Thanks!"
```

---

## Document the Handoff

**Create handoff log:** `deliveries/DD-XXX-handoff-log.md`

```markdown
# Handoff Log: DD-XXX

**Date:** 2024-12-09
**Duration:** 25 minutes
**Participants:**

- WDS UX Expert: [Your name]
- BMad Architect: Winston

## Key Points Discussed

- User value and success criteria
- Complete scenario walkthrough
- Technical requirements confirmed
- Design system components reviewed
- Acceptance criteria agreed
- Testing approach explained
- Complexity estimate aligned

## Epic Breakdown Agreed

1. Epic 1: Authentication & Session Management (1 week)
2. Epic 2: Onboarding UI & Flow (1 week)
3. Epic 3: Family Setup & Data Models (0.5 week)
4. Epic 4: Error Handling & Edge Cases (0.5 week)

**Total:** 3 weeks

## Questions & Answers

Q: "How do we handle session persistence?"
A: "Use Supabase Auth SDK, 30-day expiration"

Q: "What if user closes app mid-onboarding?"
A: "Save progress, resume at last incomplete step"

## Action Items

- [ ] Architect: Create architecture document
- [ ] Architect: Break down into dev stories
- [ ] Architect: Notify designer when ready for validation
- [ ] Designer: Start designing next flow (DD-002)

## Status

**Handoff:** Complete ✅
**Delivery Status:** in_development
**Next Touch Point:** Designer validation (Phase 7)
```

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
