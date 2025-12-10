# Step 8.1: Identify Opportunity

## Your Task

Identify the strategic challenge or improvement opportunity you'll address in this Kaizen cycle.

---

## Two Contexts

This step works differently depending on your context:

### Context A: Existing Product Entry Point

You're joining an existing product to solve a strategic challenge

### Context B: Continuous Improvement (Post-Launch)

You're iterating on a live product based on data and feedback

---

## Context A: Existing Product Entry Point

### You're Brought In to Solve a Problem

**Typical scenarios:**

- Product has a critical UX issue (high drop-off, low engagement)
- New feature needs expert design
- Product needs strategic improvement
- Team needs a linchpin designer

**Example:**

```
Product Manager: "Our onboarding has 60% drop-off rate.
                  Users don't understand the family concept.
                  We need a designer to fix this."
```

---

### Understand the Strategic Challenge

**Ask these questions:**

1. **What's the problem?**
   - What specific issue are we solving?
   - What's broken or underperforming?
   - What metrics show the problem?

2. **Why now?**
   - Why is this a priority?
   - What's the business impact?
   - What happens if we don't fix it?

3. **What's the scope?**
   - Which screens/features are affected?
   - What can we change?
   - What must stay the same?

4. **What's success?**
   - How will we measure improvement?
   - What's the target metric?
   - When do we need results?

---

### Document the Challenge

**Create:** `A-Project-Brief/limited-brief.md`

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

## Context B: Continuous Improvement (Post-Launch)

### Your Product is Live

**You're monitoring performance and iterating based on data:**

```
Your product shipped 2 weeks ago.
Now you're in continuous improvement mode (Kaizen).
```

---

### Monitor Product Performance

**Gather data from multiple sources:**

### 1. Analytics

**Check key metrics:**

- User engagement (DAU, WAU, MAU)
- Feature usage (which features are used?)
- Drop-off points (where do users leave?)
- Conversion rates (are users completing goals?)
- Performance (load times, errors)

**Example:**

```
Analytics Dashboard:
- DAU: 1,200 users
- Feature X usage: 15% (low!)
- Feature Y usage: 78% (high!)
- Drop-off: 40% at Feature X
- Average session: 8 minutes
```

---

### 2. User Feedback

**Review feedback channels:**

- Support tickets
- App store reviews
- In-app feedback
- User interviews
- Social media mentions

**Example:**

```
Common feedback themes:
- "I don't understand how to use Feature X" (12 mentions)
- "Feature Y is amazing!" (8 mentions)
- "App is slow on older devices" (5 mentions)
- "Wish I could do Z" (4 mentions)
```

---

### 3. Team Insights

**Talk to your team:**

- What are developers noticing?
- What are support seeing?
- What are sales hearing?
- What are stakeholders concerned about?

---

### Identify Improvement Opportunity

**Use the Kaizen prioritization framework:**

### Priority = Impact × Effort × Learning

**Impact:** How much will this improve the product?

- High: Solves major user pain, improves key metric
- Medium: Improves experience, minor metric impact
- Low: Nice to have, minimal impact

**Effort:** How hard is this to implement?

- Low: 1-2 days
- Medium: 3-5 days
- High: 1-2 weeks

**Learning:** How much will we learn?

- High: Tests important hypothesis
- Medium: Validates assumption
- Low: Incremental improvement

**Example prioritization:**

```
Opportunity A: Improve Feature X onboarding
- Impact: High (40% drop-off, key feature)
- Effort: Low (2 days)
- Learning: High (tests hypothesis about confusion)
- Priority: HIGH ✅

Opportunity B: Add Feature Z
- Impact: Medium (nice to have)
- Effort: High (2 weeks)
- Learning: Low (not testing hypothesis)
- Priority: LOW

Opportunity C: Improve performance
- Impact: Medium (affects 20% of users)
- Effort: Medium (5 days)
- Learning: Medium (validates device issue)
- Priority: MEDIUM
```

---

### Document the Opportunity

**Create:** `improvements/IMP-XXX-description.md`

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

## Next Step

After identifying the opportunity:

```
[C] Continue to step-8.2-gather-context.md
```

---

## Success Metrics

✅ Strategic challenge or opportunity identified
✅ Problem clearly defined
✅ Impact quantified
✅ Scope defined
✅ Success criteria established
✅ Documented in limited brief or improvement file

---

## Failure Modes

❌ Vague problem definition
❌ No data to support priority
❌ Scope too large (not Kaizen)
❌ No success metrics
❌ Not understanding root cause

---

## Tips

### DO ✅

**Be specific:**

- Quantify the problem
- Use real data
- Define clear scope

**Be strategic:**

- Focus on high-impact changes
- Small, incremental improvements
- One improvement at a time

**Be data-driven:**

- Use analytics
- Listen to user feedback
- Test hypotheses

### DON'T ❌

**Don't be vague:**

- "Make it better" ❌
- "40% drop-off at onboarding" ✅

**Don't boil the ocean:**

- Complete redesign ❌
- Targeted improvement ✅

**Don't guess:**

- Use data to identify problems
- Validate with user feedback
- Test hypotheses

---

**Remember:** Kaizen is about small, strategic improvements that compound over time!
