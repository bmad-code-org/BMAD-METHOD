# Handoff Dialog Scripts

Detailed conversation scripts for each phase of the handoff dialog.

---

## Phase 1: Introduction (2 min)

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

---

## Phase 2: User Value (3 min)

**You say:**
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

---

## Phase 3: Scenario Walkthrough (8 min)

**You say:**
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

**Show:** Excalidraw sketches, Scenario specifications, User flow diagrams

---

## Phase 4: Technical Requirements (4 min)

**You say:**
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

---

## Phase 5: Design System Components (3 min)

**You say:**
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

---

## Phase 6: Acceptance Criteria (3 min)

**You say:**
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

## Phase 7: Testing Approach (2 min)

**You say:**
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

## Phase 8: Complexity Estimate (2 min)

**You say:**
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

---

## Phase 9: Special Considerations (2 min)

**You say:**
```
"Special considerations:

- [Important note 1]
- [Important note 2]
- [Potential gotcha]
- [Critical requirement]

Questions or concerns?"
```

---

## Phase 10: Confirmation & Next Steps (1 min)

**You say:**
```
"So to confirm:
- You have DD-XXX.yaml (Design Delivery)
- You have TS-XXX.yaml (Test Scenario)
- You have all scenario specs in C-Scenarios/
- You have all component specs in D-Design-System/
- You'll break this into [number] epics
- Estimated [time] to implement
- You'll notify me when ready for validation

Anything else you need?"
```

---

## Handoff Log Template

File: `deliveries/DD-XXX-handoff-log.md`

```markdown
# Handoff Log: DD-XXX

**Date:** [Date]
**Duration:** [Duration] minutes
**Participants:**
- WDS UX Expert: [Your name]
- BMad Architect: [Architect name]

## Key Points Discussed

- User value and success criteria
- Complete scenario walkthrough
- Technical requirements confirmed
- Design system components reviewed
- Acceptance criteria agreed
- Testing approach explained
- Complexity estimate aligned

## Epic Breakdown Agreed

1. Epic 1: [Name] ([time])
2. Epic 2: [Name] ([time])

**Total:** [time estimate]

## Questions & Answers

Q: "[Question]"
A: "[Answer]"

## Action Items

- [ ] Architect: Create architecture document
- [ ] Architect: Break down into dev stories
- [ ] Architect: Notify designer when ready for validation
- [ ] Designer: Start designing next flow

## Status

**Handoff:** Complete ✅
**Delivery Status:** in_development
**Next Touch Point:** Designer validation (Phase 7)
```
