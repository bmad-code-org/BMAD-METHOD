# Context Templates

Templates for gathering context in Phase 8 (Ongoing Development).

---

## Limited Project Brief Template

**File:** `A-Project-Brief/limited-brief.md`

```markdown
# Limited Project Brief: [Product Name]

**Type:** Existing Product Improvement
**Date:** 2024-12-09
**Designer:** [Your name]

---

## Strategic Challenge

**Problem:**
[What specific problem are we solving?]

Example:
"User onboarding has 60% drop-off rate. Users don't understand
the family concept and abandon during setup."

**Impact:**
[Why does this matter?]

Example:
"- 60% of new users never reach the dashboard
- Acquisition cost is wasted on users who drop off
- Growth is limited by poor onboarding
- Estimated revenue loss: $50K/month"

**Root Cause:**
[Why is this happening?]

Example:
"- 'Family' concept is unclear (Swedish cultural context)
- Too many steps feel like homework
- No sense of progress or achievement
- Value proposition not clear upfront"

---

## Why WDS Designer?

**Why bring in a linchpin designer now?**

Example:
"We need expert UX design to:
- Understand user psychology and motivation
- Redesign onboarding flow for clarity
- Balance business goals with user needs
- Improve completion rates to 80%+"

---

## Scope

**What are we changing?**

Example:
"Redesign onboarding flow (4 screens):
- Welcome screen (update copy and visuals)
- Family setup (simplify and clarify concept)
- Dog addition (make it optional for MVP)
- Success state (add celebration and next steps)"

**What are we NOT changing?**

Example:
"- Tech stack: React Native + Supabase (already built)
- Brand: Colors and logo are fixed
- Other features: Only touch onboarding
- Timeline: 2 weeks to design + implement"

---

## Success Criteria

**How will we measure success?**

Example:
"- Onboarding completion rate > 80% (from 40%)
- Time to complete < 2 minutes
- User satisfaction score > 4.5/5
- 30-day retention > 60%"

---

## Constraints

**What can't we change?**

Example:
"- Tech stack: React Native + Supabase
- Brand: Colors, logo, typography fixed
- Timeline: 2 weeks total
- Budget: No additional development resources
- Scope: Only onboarding, don't touch dashboard"

---

## Timeline

**Week 1:** Design + Specifications
**Week 2:** Implementation + Validation

---

## Stakeholders

**Product Manager:** [Name]
**Developer:** [Name]
**Designer (WDS):** [Your name]
```

---

## Improvement Opportunity Template

**File:** `improvements/IMP-XXX-description.md`

```markdown
# Improvement: [Short Description]

**ID:** IMP-XXX
**Type:** [Feature Enhancement | Bug Fix | Performance | UX Improvement]
**Priority:** [High | Medium | Low]
**Status:** Identified
**Date:** 2024-12-09

---

## Opportunity

**What are we improving?**

Example:
"Feature X has low engagement (15% usage) and high drop-off (40%).
User feedback indicates confusion about how to use it."

**Why does this matter?**

Example:
"Feature X is a core value proposition. Low usage means users
aren't getting full value from the product. This impacts
retention and satisfaction."

---

## Data

**Analytics:**
- Feature X usage: 15% (target: 60%)
- Drop-off at Feature X: 40%
- Time spent: 30 seconds (too short)

**User Feedback:**
- "I don't understand how to use Feature X" (12 mentions)
- "Feature X seems broken" (3 mentions)

**Hypothesis:**
Users don't understand how to use Feature X because there's
no onboarding or guidance.

---

## Proposed Solution

**What will we change?**

Example:
"Add inline onboarding to Feature X:
- Tooltip on first use explaining purpose
- Step-by-step guide for first action
- Success celebration when completed
- Help button for future reference"

**Expected Impact:**
- Feature X usage: 15% → 60%
- Drop-off: 40% → 10%
- User satisfaction: +1.5 points

---

## Effort Estimate

**Design:** 1 day
**Implementation:** 1 day
**Testing:** 0.5 days
**Total:** 2.5 days

---

## Success Metrics

**How will we measure success?**
- Feature X usage > 60% (within 2 weeks)
- Drop-off < 10%
- User feedback mentions decrease
- Support tickets about Feature X decrease

---

## Timeline

**Week 1:** Design + Implement + Test
**Week 2:** Monitor impact

---

## Next Steps

1. Design inline onboarding (Step 8.3)
2. Create Design Delivery (Step 8.4)
3. Hand off to BMad (Step 8.5)
4. Validate implementation (Step 8.6)
5. Monitor impact (Step 8.7)
```

---

## First Impressions Template

```markdown
# First Impressions: [Product Name]

**Date:** 2024-12-09
**Context:** First-time user, no prior knowledge

## Onboarding

- Step 1: [What happened? How did it feel?]
- Step 2: [What happened? How did it feel?]
- Confusion points: [Where was I confused?]
- Delights: [What felt great?]

## Core Features

- Feature X: [Experience]
- Feature Y: [Experience]

## Overall Impression

[What's your gut feeling about this product?]
```

---

## Focused Trigger Map Template

**File:** `B-Trigger-Map/focused-trigger-map.md`

```markdown
# Focused Trigger Map: [Challenge Name]

**Context:** Existing product improvement
**Focus:** [Specific feature/flow you're improving]

---

## Trigger Moment

**When does this happen?**

Example:
"User completes signup and reaches dashboard for first time"

---

## Current Experience

**What happens now?**

Example:
"1. Welcome screen (confusing value prop)
2. Family setup (unclear what 'family' means)
3. Dog addition (forced, feels like homework)
4. 60% drop off before reaching dashboard"

---

## Desired Outcome

**What should happen?**

Example:
"User understands value, completes setup smoothly,
reaches dashboard feeling confident and excited"

---

## Barriers

**What's preventing the desired outcome?**

Example:
"- Unclear value proposition
- 'Family' concept is confusing (cultural context)
- Forced dog addition feels like work
- No sense of progress or achievement
- No celebration of completion"

---

## Solution Focus

**What will we change to remove barriers?**

Example:
"- Clarify value prop on welcome screen
- Simplify family concept explanation
- Make dog addition optional
- Add progress indicators
- Add celebration on completion"
```

---

## Analytics Deep Dive Template

```markdown
# Analytics: Feature X Improvement

**Date Range:** Last 30 days
**Focus:** Feature X engagement

## Usage Metrics

- Users who saw Feature X: 1,200
- Users who used Feature X: 180 (15%)
- Users who completed action: 90 (7.5%)
- Drop-off point: Step 2 (40% drop off)

## User Segments

- New users: 10% usage
- Returning users: 20% usage
- Power users: 60% usage

## Insight

New and returning users struggle with Feature X.
Power users understand it. Suggests onboarding gap.
```

---

## User Feedback Analysis Template

```markdown
# User Feedback: Feature X

**Date Range:** Last 30 days
**Total Mentions:** 24

## Themes

### Confusion (12 mentions)
- "I don't understand how to use Feature X"
- "Feature X seems broken"
- "What is Feature X for?"

### Requests (8 mentions)
- "Can Feature X do Y?"
- "Wish Feature X had Z"

### Praise (4 mentions)
- "Once I figured it out, Feature X is great!"
- "Feature X saves me time"

## Insight

Users who figure out Feature X love it.
But most users never figure it out.
Onboarding is the problem.
```

---

## Context Synthesis Template

```markdown
# Context Synthesis: [Improvement Name]

## What We Know

1. [Key insight from analytics]
2. [Key insight from user feedback]
3. [Key insight from competitive analysis]
4. [Key insight from original design]

## Root Cause

[Why is this problem happening?]

## Hypothesis

[What do we believe will solve it?]

## Validation Plan

[How will we know if we're right?]
```
