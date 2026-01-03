# Step 8.3: Design Update

## Your Task

Design the incremental improvement - not a complete redesign, but a targeted update.

---

## Before You Start

**Ensure you have:**

- ✅ Completed step 8.2 (context gathered)
- ✅ Root cause identified
- ✅ Hypothesis formed
- ✅ Clear scope defined

---

## Kaizen Principle: Small, Focused Changes

**Remember:**

- ❌ Complete redesign
- ✅ Targeted improvement
- ❌ Change everything
- ✅ Change one thing well
- ❌ Big bang release
- ✅ Incremental update

---

## Design Process

### 1. Define What's Changing vs What's Staying

**Create:** `C-Scenarios/XX-update-name/change-scope.md`

```markdown
# Change Scope: [Update Name]

## What's Changing

### Screen/Feature: [Name]

**Changes:**

- [ ] Copy/messaging
- [ ] Visual hierarchy
- [ ] Component usage
- [ ] User flow
- [ ] Interaction pattern
- [ ] Data structure

**Specific changes:**

1. [Specific change 1]
2. [Specific change 2]
3. [Specific change 3]

---

## What's Staying

**Unchanged:**

- ✓ Brand colors
- ✓ Typography
- ✓ Core layout structure
- ✓ Navigation pattern
- ✓ Tech stack
- ✓ Data model

**Rationale:**
[Why are we keeping these unchanged?]

Example:
"Brand colors and typography are fixed by brand guidelines.
Core layout structure works well and changing it would
require extensive development. We're focusing on content
and interaction improvements only."
```

---

### 2. Create Update Specifications

**For each screen/feature being updated:**

**File:** `C-Scenarios/XX-update-name/Frontend/specifications.md`

```markdown
# Frontend Specification: [Screen Name] UPDATE

**Type:** Incremental Update
**Version:** v2.0
**Previous Version:** v1.0 (see: archive/v1.0-specifications.md)

---

## Change Summary

**What's different from v1.0?**

1. [Change 1]: [Brief description]
2. [Change 2]: [Brief description]
3. [Change 3]: [Brief description]

---

## Updated Screen Structure

### Before (v1.0)
```

[Describe old structure]

```

### After (v2.0)
```

[Describe new structure]

```

---

## Component Changes

### New Components
- [Component name]: [Purpose]

### Modified Components
- [Component name]: [What changed?]

### Removed Components
- [Component name]: [Why removed?]

### Unchanged Components
- [Component name]: [Still used as-is]

---

## Interaction Changes

### Before (v1.0)
1. User does X
2. System responds Y
3. User sees Z

### After (v2.0)
1. User does X
2. **NEW:** System shows guidance
3. System responds Y
4. **NEW:** System celebrates success
5. User sees Z

---

## Copy Changes

### Before (v1.0)
"[Old copy]"

### After (v2.0)
"[New copy]"

**Rationale:** [Why this change?]

---

## Visual Changes

### Before (v1.0)
- Hierarchy: [Description]
- Emphasis: [Description]
- Spacing: [Description]

### After (v2.0)
- Hierarchy: [What changed?]
- Emphasis: [What changed?]
- Spacing: [What changed?]

---

## Success Metrics

**How will we measure if this update works?**

- Metric 1: [Before] → [Target]
- Metric 2: [Before] → [Target]
- Metric 3: [Before] → [Target]

**Measurement period:** 2 weeks after release
```

---

### 3. Design New/Modified Components

**If you need new components:**

**File:** `D-Design-System/03-Atomic-Components/[Category]/[Component-Name].md`

```markdown
# Component: [Name]

**ID:** [cmp-XXX]
**Type:** [Button | Input | Card | etc.]
**Status:** New (for Update DD-XXX)
**Version:** 1.0

---

## Purpose

**Why this component?**

Example:
"Inline tooltip to guide users through Feature X on first use.
Needed because analytics show 40% drop-off due to confusion."

---

## Specifications

[Standard component spec format]

---

## Usage

**Where used:**

- Screen X: [Context]
- Screen Y: [Context]

**When shown:**

- First time user sees Feature X
- Can be dismissed
- Doesn't show again after dismissal
```

---

### 4. Update Existing Scenarios

**If modifying existing scenarios:**

**File:** `C-Scenarios/XX-existing-scenario/Frontend/specifications-v2.md`

```markdown
# Frontend Specification: [Scenario Name] v2.0

**Previous Version:** v1.0
**Changes:** [Summary of changes]
**Reason:** [Why we're updating]

---

## What Changed

### Change 1: [Name]

- **Before:** [Description]
- **After:** [Description]
- **Rationale:** [Why?]

### Change 2: [Name]

- **Before:** [Description]
- **After:** [Description]
- **Rationale:** [Why?]

---

## Updated Specification

[Full updated specification]

---

## Migration Notes

**For developers:**

- [What needs to change in code?]
- [Any breaking changes?]
- [Backward compatibility?]
```

---

### 5. Create Before/After Comparison

**Visual documentation of the change:**

**File:** `C-Scenarios/XX-update-name/before-after.md`

```markdown
# Before/After: [Update Name]

## Before (v1.0)

**Screenshot/Description:**
[What it looked like before]

**User Experience:**

- User sees: [Description]
- User feels: [Description]
- Problem: [What was wrong?]

**Metrics:**

- Usage: 15%
- Drop-off: 40%
- Satisfaction: 3.2/5

---

## After (v2.0)

**Screenshot/Description:**
[What it looks like after]

**User Experience:**

- User sees: [Description]
- User feels: [Description]
- Improvement: [What's better?]

**Expected Metrics:**

- Usage: 60% (target)
- Drop-off: 10% (target)
- Satisfaction: 4.5/5 (target)

---

## Key Changes

1. **[Change 1]**
   - Before: [Description]
   - After: [Description]
   - Impact: [Expected improvement]

2. **[Change 2]**
   - Before: [Description]
   - After: [Description]
   - Impact: [Expected improvement]

3. **[Change 3]**
   - Before: [Description]
   - After: [Description]
   - Impact: [Expected improvement]
```

---

## Design Validation

**Before moving forward, validate your design:**

### Self-Review Checklist

- [ ] Does this solve the root cause?
- [ ] Is this the smallest change that could work?
- [ ] Does this align with existing design system?
- [ ] Is this technically feasible?
- [ ] Can we measure the impact?
- [ ] Does this create new problems?
- [ ] Have we considered edge cases?

---

### Hypothesis Validation

```markdown
# Hypothesis Validation: [Update Name]

## Hypothesis

[What do we believe will happen?]

Example:
"If we add inline onboarding to Feature X, usage will
increase from 15% to 60% because users will understand
how to use it."

## Assumptions

1. [Assumption 1]
2. [Assumption 2]
3. [Assumption 3]

## Risks

1. [Risk 1]: [Mitigation]
2. [Risk 2]: [Mitigation]

## Success Criteria

- [Metric 1]: [Current] → [Target]
- [Metric 2]: [Current] → [Target]
- [Timeframe]: 2 weeks after release

## Failure Criteria

If after 2 weeks:

- [Metric 1] < [Threshold]: Rollback or iterate
- [Metric 2] < [Threshold]: Rollback or iterate
```

---

## Next Step

After designing the update:

```
[C] Continue to step-8.4-create-delivery.md
```

---

## Success Metrics

✅ Change scope clearly defined
✅ Update specifications created
✅ New/modified components designed
✅ Before/after comparison documented
✅ Hypothesis validated
✅ Self-review complete
✅ Smallest effective change identified

---

## Failure Modes

❌ Scope creep (changing too much)
❌ Not documenting what's staying the same
❌ No before/after comparison
❌ Can't measure impact
❌ Creating new problems
❌ Not validating hypothesis

---

## Tips

### DO ✅

**Be surgical:**

- Change only what's necessary
- Keep scope tight
- One improvement at a time

**Be clear:**

- Document what's changing
- Document what's staying
- Show before/after

**Be measurable:**

- Define success metrics
- Set realistic targets
- Plan measurement

### DON'T ❌

**Don't scope creep:**

- "While we're at it..." ❌
- Stay focused ✅

**Don't redesign:**

- Complete overhaul ❌
- Targeted improvement ✅

**Don't guess:**

- Use data to validate
- Test hypotheses
- Measure impact

---

**Remember:** Kaizen is about small, focused improvements that compound over time!
