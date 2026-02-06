# Design Templates

Templates for designing incremental updates in Phase 8.

---

## Change Scope Template

**File:** `C-Scenarios/XX-update-name/change-scope.md`

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

## Update Specification Template

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
[Describe old structure]

### After (v2.0)
[Describe new structure]

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

## New Component Template

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

## Before/After Comparison Template

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

## Hypothesis Validation Template

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

## Design Self-Review Checklist

- [ ] Does this solve the root cause?
- [ ] Is this the smallest change that could work?
- [ ] Does this align with existing design system?
- [ ] Is this technically feasible?
- [ ] Can we measure the impact?
- [ ] Does this create new problems?
- [ ] Have we considered edge cases?
