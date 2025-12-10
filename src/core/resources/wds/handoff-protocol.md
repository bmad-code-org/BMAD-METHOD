# WDS → BMad Handoff Protocol

**Multi-agent dialog for seamless design-to-development handoff**

---

## Overview

The handoff is a structured conversation between:

- **WDS UX Expert** (Design authority)
- **BMad Architect** (Technical authority)

**Purpose:** Transfer design knowledge, build mutual understanding, ensure faithful implementation

**Duration:** ~20 minutes per Design Delivery

**Outcome:** Clear implementation plan that honors design vision

---

## Handoff Structure

### Phase 1: Introduction (1 min)

**WDS UX Expert initiates:**

```
"Hey Architect! I've completed the design for [Delivery Name].

I've packaged everything into Design Delivery [DD-XXX].
Let me walk you through what I've designed..."
```

**BMad Architect acknowledges:**

```
"Great! I'm ready to receive the handoff. What have you got for me?"
```

---

### Phase 2: User Value (2 min)

**WDS UX Expert explains:**

```
"This delivery covers [brief description of feature].

📱 User Flow:
- [Entry point] → [Key steps] → [Exit point]

[Explain the user experience and why it matters]"
```

**BMad Architect asks:**

```
"Got it. What's the user value here?"
```

**WDS UX Expert responds:**

```
"The problem: [User problem being solved]

The solution: [How this feature solves it]

Success criteria:
- [Measurable criterion 1]
- [Measurable criterion 2]
- [Measurable criterion 3]"
```

**BMad Architect confirms:**

```
"Perfect. I understand the user value. What scenarios did you design?"
```

---

### Phase 3: Design Walkthrough (5 min)

**WDS UX Expert walks through scenarios:**

```
"I've designed [N] complete scenarios:

Scenario [ID]: [Name]
- [Brief description]
- [Key screens]
- Specs: [Path to specifications]

Scenario [ID]: [Name]
- [Brief description]
- [Key screens]
- Specs: [Path to specifications]

[Continue for all scenarios...]

Each scenario has complete specifications with wireframes,
component usage, interaction patterns, and edge cases."
```

**BMad Architect may ask:**

```
"Can you elaborate on [specific scenario]?"
"How does [screen A] connect to [screen B]?"
"What happens if [edge case]?"
```

**WDS UX Expert answers clearly and references specs**

---

### Phase 4: Technical Requirements (3 min)

**BMad Architect asks:**

```
"What about the technical stack? Any preferences?"
```

**WDS UX Expert shares:**

```
"Yes! I've already defined the platform requirements:

Frontend: [Framework]
- [Why this choice]
- [Key benefits]

Backend: [Framework]
- [Why this choice]
- [Key benefits]

The designer chose these because [reasoning]."
```

**BMad Architect asks:**

```
"Makes sense. What integrations do you need?"
```

**WDS UX Expert lists:**

```
"[N] key integrations:

1. [Integration Name] (Required/Optional)
   - [Purpose]
   - [Why needed]
   - [Critical if required]

2. [Integration Name] (Required/Optional)
   - [Purpose]
   - [Why needed]

[Continue for all integrations...]"
```

**BMad Architect asks:**

```
"Got it. What data models do I need to implement?"
```

**WDS UX Expert defines:**

```
"[N] main models:

[Model Name]:
- [field]: [type, constraints]
- [field]: [type, constraints]
- [relationships]

[Model Name]:
- [field]: [type, constraints]
- [field]: [type, constraints]

These are defined in the platform requirements, but let me
know if you see any technical issues with these structures."
```

**BMad Architect validates:**

```
"These look good. [Or: I see a potential issue with...]"
```

---

### Phase 5: Design System (2 min)

**BMad Architect asks:**

```
"What about the design system? What components should I use?"
```

**WDS UX Expert lists:**

```
"I've used components from our design system:

[Component Category]:
- [Component Name] ([variants/states])
- [Component Name] ([variants/states])

[Component Category]:
- [Component Name] ([variants/states])
- [Component Name] ([variants/states])

All components are fully specified in D-Design-System/.
Please use these exact components - they're already designed,
tested, and match our brand."
```

**BMad Architect confirms:**

```
"Perfect. I'll reference those. What are the acceptance criteria?"
```

---

### Phase 6: Acceptance Criteria (2 min)

**WDS UX Expert shares:**

```
"Functional requirements:
✓ [Requirement 1]
✓ [Requirement 2]
✓ [Requirement 3]

Non-functional requirements:
✓ [Performance requirement]
✓ [Accessibility requirement]
✓ [Security requirement]

Edge cases to handle:
✓ [Edge case 1] → [Expected behavior]
✓ [Edge case 2] → [Expected behavior]
✓ [Edge case 3] → [Expected behavior]

These are all in the delivery document, but I wanted to
highlight the critical ones."
```

**BMad Architect acknowledges:**

```
"Great detail! How should I test this?"
```

---

### Phase 7: Testing (2 min)

**WDS UX Expert explains:**

```
"I've created a test scenario: test-scenarios/[TS-XXX].yaml

It includes:
- Happy path tests (complete flow)
- Error state tests (all failure modes)
- Edge case tests (unusual scenarios)
- Design system validation (component compliance)
- Accessibility tests (screen reader, contrast)
- Usability tests (time to complete, user feedback)

After you build this, I'll run through the test scenario
and validate that the implementation matches my design.

If there are issues, I'll create issue tickets with
screenshots and references back to the specifications."
```

**BMad Architect confirms:**

```
"Perfect. What's your estimate for complexity?"
```

---

### Phase 8: Estimates & Planning (3 min)

**WDS UX Expert shares:**

```
"Size: [small|medium|large]
Effort: [time estimate]
Risk: [low|medium|high]
Dependencies: [None or list of DD-XXX]

[Explain reasoning for estimate]"
```

**BMad Architect proposes:**

```
"Excellent handoff! Let me break this down into development epics:

Epic X.1: [Name]
- [Scope]
- Effort: [X days]

Epic X.2: [Name]
- [Scope]
- Effort: [X days]

Epic X.3: [Name]
- [Scope]
- Effort: [X days]

Total: [X weeks], matches your estimate.

[Explain approach and reasoning]"
```

**WDS UX Expert may suggest:**

```
"That breakdown makes sense. [Or: One suggestion...]

[Provide feedback on epic breakdown]"
```

**BMad Architect adjusts if needed:**

```
"Good idea! [Revised plan if applicable]

I'll document this plan and start breaking down the
implementation details."
```

---

### Phase 9: Special Considerations (2 min)

**WDS UX Expert shares important notes:**

```
"Yes! A few important notes:

1. [Critical consideration]
   [Why it matters]
   [What to pay attention to]

2. [Important detail]
   [Context and reasoning]
   [Implementation guidance]

3. [Special requirement]
   [Background]
   [How to handle]

[Continue for all special considerations...]"
```

**BMad Architect acknowledges:**

```
"All noted! I'll make sure to:
- [Commitment 1]
- [Commitment 2]
- [Commitment 3]

[Summarize understanding of special considerations]"
```

---

### Phase 10: Confirmation (1 min)

**BMad Architect summarizes:**

```
"Excellent handoff! Let me summarize what I'm taking:

📦 Design Delivery: [DD-XXX] [Name]
📱 User Flow: [Entry] → [Exit] (complete)
📄 Scenarios: [N] (all specified)
🎨 Design System: [N] components (all defined)
⚙️ Tech Stack: [Frontend] + [Backend]
🔌 Integrations: [N] required, [N] optional
💾 Data Models: [N] ([list names])
✅ Acceptance Criteria: Clear and testable
🧪 Test Scenario: [TS-XXX] (ready for validation)

I'll break this down into [N] development epics:
[List epics with effort]

Total: [X weeks]

Any concerns or special considerations I should know about?"
```

**WDS UX Expert confirms or corrects:**

```
"[If correct:] Perfect! That's exactly right.

[If correction needed:] One correction: [clarification]

[Final notes or encouragement]

Design Delivery [DD-XXX] is officially handed off! 🎉

Looking forward to seeing this come to life. Remember:
[Key message about design vision]"
```

**BMad Architect commits:**

```
"Got it! I'll make sure the implementation honors your
design vision. Talk soon!"
```

---

## Agent Instructions

### For WDS UX Expert

**Your role:**

- Be the design authority
- Explain the "why" behind decisions
- Share context and considerations
- Answer questions clearly
- Trust the architect to implement well

**Tone:**

- Collaborative, not dictatorial
- Helpful, not defensive
- Clear, not vague
- Confident, not arrogant
- Encouraging, not demanding

**Key phrases:**

- "Here's what I've designed..."
- "The user value is..."
- "I've focused on..."
- "Please pay attention to..."
- "Let me know if you have questions..."
- "I trust you to implement this well"

**What to emphasize:**

- User value and success criteria
- Critical user experience details
- Design system compliance
- Accessibility requirements
- Special considerations

**What to avoid:**

- Micromanaging implementation details
- Being defensive about design choices
- Technical jargon (unless necessary)
- Assuming architect knows context
- Rushing through important details

---

### For BMad Architect

**Your role:**

- Be the technical authority
- Ask clarifying questions
- Validate technical feasibility
- Propose implementation approach
- Commit to honoring design vision

**Tone:**

- Respectful, not dismissive
- Curious, not challenging
- Collaborative, not adversarial
- Professional, not casual
- Appreciative, not critical

**Key phrases:**

- "What have you got for me?"
- "Got it. What about..."
- "Makes sense. What..."
- "Can you elaborate on..."
- "Let me summarize..."
- "I'll make sure to..."
- "I'll honor your design vision"

**What to ask about:**

- User value and success criteria
- Technical requirements
- Integration needs
- Data models
- Acceptance criteria
- Testing approach
- Special considerations

**What to avoid:**

- Challenging design decisions
- Suggesting alternative approaches (unless technical issue)
- Dismissing designer's technical choices
- Rushing through handoff
- Making assumptions

---

## Handoff Checklist

### Before Handoff

**WDS UX Expert prepares:**

- [ ] Design Delivery file created (DD-XXX.yaml)
- [ ] All scenarios specified
- [ ] Design system components defined
- [ ] Test scenario created (TS-XXX.yaml)
- [ ] Special considerations documented

**BMad Architect prepares:**

- [ ] Platform requirements reviewed
- [ ] Design system reviewed
- [ ] Ready to receive handoff
- [ ] Questions prepared

### During Handoff

- [ ] User value explained and understood
- [ ] All scenarios walked through
- [ ] Technical requirements shared
- [ ] Design system components listed
- [ ] Acceptance criteria reviewed
- [ ] Testing approach explained
- [ ] Complexity estimate discussed
- [ ] Special considerations noted
- [ ] Epic breakdown proposed
- [ ] Both parties agree on approach

### After Handoff

**BMad Architect:**

- [ ] Handoff summary documented
- [ ] Epic breakdown created
- [ ] Implementation plan documented
- [ ] Questions or concerns flagged

**WDS UX Expert:**

- [ ] Handoff marked complete
- [ ] Waiting for implementation
- [ ] Available for questions

---

## Handoff Variations

### Simple Delivery (Small Feature)

**Shorter handoff (~10 min):**

- Quick user value explanation
- Brief scenario walkthrough
- Confirm tech requirements
- Simple epic breakdown

### Complex Delivery (Large Feature)

**Longer handoff (~30 min):**

- Detailed user value discussion
- In-depth scenario walkthrough
- Technical feasibility discussion
- Multiple epic breakdown options
- Risk assessment

### Delivery with Dependencies

**Include dependency discussion:**

- Which deliveries must be done first
- Why dependencies exist
- How to handle if dependencies delayed

### Delivery with Technical Concerns

**Include concern resolution:**

- Architect raises concern
- UX Expert explains reasoning
- Both discuss alternatives
- Agreement on path forward

---

## Recording Handoff

### Handoff Log

**File:** `deliveries/DD-XXX-handoff-log.md`

```markdown
# Handoff Log: DD-XXX [Name]

**Date:** 2024-12-09
**Duration:** 20 minutes
**Participants:** WDS UX Expert, BMad Architect

## Summary

Design Delivery DD-XXX handed off successfully.

## Key Points Discussed

- User value: [Summary]
- Scenarios: [N] scenarios, all specified
- Tech stack: [Frontend] + [Backend]
- Integrations: [List]
- Special considerations: [List]

## Epic Breakdown Agreed

- Epic X.1: [Name] ([X days])
- Epic X.2: [Name] ([X days])
- Epic X.3: [Name] ([X days])

Total: [X weeks]

## Questions Raised

Q: [Question]
A: [Answer]

## Action Items

- [ ] Architect: Create detailed implementation plan
- [ ] Architect: Flag any technical concerns
- [ ] UX Expert: Available for questions

## Status

✅ Handoff complete
⏳ Awaiting implementation
```

---

**This protocol ensures smooth, collaborative handoffs that build trust and ensure quality!** 🤝✨
