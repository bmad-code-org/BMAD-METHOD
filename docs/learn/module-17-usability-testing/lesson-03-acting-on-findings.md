# Module 17: Usability Testing

## Lesson 3: Acting on Findings

**Turning observations into design improvements**

---

## Review the Recordings

Don't process findings from memory. Watch the recordings.

On the second viewing, you see what you missed. The hesitation you didn't notice. The comment you brushed past. The pattern across multiple users that wasn't visible during any single session.

### What to Look For

**Patterns** — Did multiple users struggle at the same point? That's a design problem, not a user problem.

**Surprises** — Did users do something you didn't expect? They found a path you didn't design for, or ignored the path you did.

**Quotes** — Exact words users said. "I don't know what this means" is more powerful than "users found the label confusing."

**Completion** — Did they finish the task? How long did it take? Did they need to backtrack?

### Timestamp Key Moments

As you review, note timestamps for:

- First confusion point
- Misclicks or wrong paths
- Moments of hesitation (3+ seconds)
- Verbal reactions ("Oh!", "Hmm...", "Wait...")
- Task abandonment
- Successful completion

These timestamps become your evidence when presenting findings.

---

## Document the Findings

For each usability issue, document:

```markdown
## Finding: [Short description]

**Severity:** Critical | Major | Minor
**Observed in:** [# of # participants]
**Task:** [Which task triggered this]
**Timestamp:** [Recording reference]

### What happened
[Describe the behavior — what the user did, not what they should have done]

### Why it matters
[Connect to persona, driving force, or business goal]

### Root cause
[What in the design caused this? Be specific — page, element, interaction]

### Recommendation
[What to change in the specification]
```

### Example

```markdown
## Finding: Users don't see the registration CTA

**Severity:** Critical
**Observed in:** 4 of 5 participants
**Task:** "You want to create an account. Go ahead."
**Timestamp:** P1 0:23, P2 0:31, P3 0:18, P4 0:45

### What happened
Users scrolled past the registration button. Three looked at the
navigation menu first. One tried clicking the logo. Only after
20-40 seconds did they find the CTA below the fold.

### Why it matters
Felix needs simple paths with no hunting (driving force: efficiency).
If the primary action is hidden, first-time users will bounce.

### Root cause
Page P01 (landing): The CTA "Create Free Account" sits below a
large hero image. Visual hierarchy prioritizes the image over
the action.

### Recommendation
Move CTA above the fold. Increase visual weight — larger button,
contrasting color, or positioned within the hero section instead
of below it. Update spec P01 section 3.
```

---

## Connect to Your Design System

Usability findings don't exist in isolation. They connect back to everything you've built:

### Trace to Specifications

Every finding should point to a specific page, element, or interaction in your specs. If you can't point to the spec, the finding is too vague.

> "Users were confused" → **Too vague**
> "Users didn't see the CTA on P01 because it's below the fold" → **Actionable**

### Trace to Trigger Maps

Your trigger maps describe the driving forces behind user actions. When testing reveals problems, check if the driving force was addressed:

> Finding: Users abandon at step 2 of registration.
> Trigger map says: Felix is motivated by speed — "I want this done fast."
> Connection: Step 2 feels unnecessary. Can we combine steps 1 and 2?

### Trace to Personas

Does the finding affect all users, or is it persona-specific?

> Finding works for tech-savvy users but fails for the less technical persona → Different fix needed than a universal change.

---

## Prioritize What to Fix

Not every finding needs immediate action.

### Critical

Users **cannot complete the task.** The flow is broken.

- Fix before next test round
- Update spec immediately
- Rebuild in next agentic session

### Major

Users **complete the task but with significant difficulty.** Hesitation, confusion, wrong paths.

- Fix in current iteration
- Update spec
- May need design rethinking, not just tweaks

### Minor

Users **notice something but it doesn't block them.** Small friction, slightly confusing labels.

- Fix when convenient
- Log for future reference
- Sometimes resolves itself when major issues are fixed

### Not a Problem

Users did something unexpected but it **worked fine.** Their path was different from what you designed, but the outcome was correct.

- Document it — you learned something about user behavior
- Consider if the "designed" path is actually needed
- Don't fix what isn't broken

---

## Update Your Specifications

This is where the cycle closes. Findings become spec changes.

```markdown
## Spec Update Log: Usability Round 1

### P01 Landing Page
- **Changed:** CTA moved from below hero to within hero section
  - Reason: 4/5 users missed it below the fold
  - Finding: "Users don't see the registration CTA"

### P02 Signup Form
- **Changed:** Combined steps 1 and 2 into single form
  - Reason: 3/5 users hesitated at step transition
  - Finding: "Step 2 feels unnecessary"

### P03 Welcome Screen
- **No changes.** All users navigated successfully.
```

Update the spec. Then rebuild. Then test again.

---

## The Iterate Cycle

```
Round 1: Test prototype
  → 3 critical, 2 major findings
  → Update specs → Rebuild

Round 2: Test updated prototype
  → 0 critical, 1 major, 2 minor findings
  → Update specs → Rebuild

Round 3: Test refined prototype
  → 0 critical, 0 major, 1 minor finding
  → Ship it
```

Each round should have fewer and less severe findings. If severity increases between rounds, something went wrong in the redesign.

**Two to three rounds** is typical for a critical flow. One round is enough for simpler features.

---

## Presenting Findings

Sometimes you need to convince stakeholders that changes are necessary.

### Use Evidence, Not Opinion

- **Weak:** "I think the CTA should be bigger"
- **Strong:** "4 of 5 test participants couldn't find the CTA within 30 seconds. Here are the recordings."

### Show, Don't Tell

Play the relevant 30 seconds of recording. Seeing a real user struggle is more persuasive than any report.

### Connect to Business Impact

- "Users can't find the registration button → fewer signups → less revenue"
- "Users abandon at step 2 → 60% drop-off in the funnel"

---

## The Freya Method

Freya helps structure your findings:

> "You found 5 issues. Let me help prioritize. Finding #1 blocks the primary task for 4 of 5 users — that's critical. Findings #3 and #4 might resolve themselves once #1 is fixed."

> "This finding connects to the trigger map: Felix's driving force is efficiency. The three-step process contradicts that. Recommend consolidating."

> "Update spec P01 section 3 based on finding #1. I'll note the change in the spec update log."

---

## What's Next

In the tutorial, you'll plan a usability test for one of your flows and walk through the complete process.

---

**[Continue to Tutorial: Plan Your Usability Test →](tutorial-17.md)**

---

[← Back to Lesson 2](lesson-02-test-results.md) | [Back to Module Overview](module-17-usability-testing-overview.md)

*Part of Module 17: Usability Testing*
