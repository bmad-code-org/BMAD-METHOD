# Module 18: Product Evolution

## Lesson 1: The Evolution Cycle

**Running WDS in miniature for every change**

---

## One Change, Full Discipline

A product evolution change — whether it's a new feature, a modification, a fix, or an optimization — follows the same WDS process you've learned throughout this course. The difference is scope. Instead of building a whole product, you're improving one part of it.

The Product Evolution Design Log organizes this cycle. It's the same Design Log from Module 14, with one addition: **context** — what exists today and why it needs to change.

---

## Step 1: Receive and Connect

### Something triggers the change

Changes come from:
- **User feedback** — "The password requirements aren't clear"
- **Usability testing** — "3 of 5 users couldn't find the settings page"
- **Analytics** — "40% drop-off at step 2 of checkout"
- **Business need** — "We need to support a new payment method"
- **Bug report** — "Error message shows wrong text on mobile"

### Connect to the Trigger Map

Before doing anything else, trace the change to your strategy:

- **Which persona** does this serve?
- **Which driving force** does it address?
- **Which business goal** does it advance?

If it doesn't connect, apply the Whiteport Rule: if it's not worth showing to 5 users and 1 domain expert, it shouldn't be built.

> Change: "Users report password requirements unclear"
> Persona: Felix — wants quick, frictionless onboarding
> Driving force: Efficiency — don't waste my time
> Business goal: Reduce signup abandonment

Connected. Proceed.

---

## Step 2: Start the Design Log

Create the dialog with context about what exists and what needs to change:

```markdown
# Design Log: Password Requirements Clarity

## Meta
- Date: 2026-03-15
- Type: Feature modification
- Input: User feedback + usability test findings
- Agent: Freya
- Branch: fix/password-requirements
- Status: In Progress

## Context
Current state: Password field shows "At least 8 characters" as helper
text. Full requirements only appear as error messages after the user
submits a password that doesn't meet them.

Problem: Users don't know the requirements until they fail.
3 of 5 usability test participants hesitated at the password field.

Trigger Map: Felix — efficiency driving force.
Business: Signup funnel shows 15% drop-off at password step.

## Scope
Change: Show password requirements upfront, before the user types.
Keep: Password strength indicator, validation behavior.
Don't touch: Other form fields, submission flow.
```

The context section is what makes evolution dialogs different from greenfield. You're not starting from nothing — you're describing what's there and what needs to be different.

---

## Step 3: Review and Update the Specification

### Read the current spec

Before changing anything, read the existing specification for the affected page or flow. Understand what was designed and why.

> "Current spec P02-signup-form.md says:
> Password field helper text: 'At least 8 characters'
> Validation: On blur, check 8+ chars, 1 number, 1 letter
> Error: 'Password must be at least 8 characters with a number and letter'"

### Update the specification

Make the change in the spec first. The spec is the source of truth.

```markdown
#### Password Field (updated v1.2)
- Helper text: "8+ characters, including a number and letter"
- Requirements: Shown below field at all times (not just on error)
- Validation: On blur (unchanged)
- Strength indicator: Appears on typing (unchanged)
```

### Add to the changelog

```markdown
### v1.2 (2026-03-15)
- Changed: Password helper text shows full requirements upfront
- Reason: User feedback — 3/5 users confused by hidden requirements
- Connection: Felix — efficiency driving force
```

---

## Step 4: Build the Change

The agent implements from the updated spec — exactly as in Module 14.

### Tasks in the Design Log:

```markdown
## Tasks
1. [x] Review current specification
2. [x] Update specification with change
3. [ ] Implement helper text update
4. [ ] Agent verifies against updated spec (Puppeteer)
5. [ ] Verify unchanged functionality still works
6. [ ] Update design system if needed
```

### The agent builds and verifies:

> "Updating password field helper text..."
> "Opening signup form at localhost:3000/signup..."
> "Helper text reads '8+ characters, including a number and letter' — matches updated spec. ✓"
> "Requirements visible before typing — confirmed. ✓"
> "Entering short password, blurring... error message appears correctly. ✓"
> "Strength indicator still functions on typing. ✓"
> "Email field unchanged — verified. ✓"

Build, verify, evaluate — same loop, smaller scope.

---

## Step 5: Test

### Functional testing

The agent verifies with Puppeteer during development (Module 14). By the time you finish building, functional testing is already done.

### Usability testing

Apply the Whiteport Rule. Is this change worth showing to 5 users?

For a password requirements update — probably yes, because the original problem came from usability testing. You want to verify the fix actually works. But you might run a quick guerrilla test instead of a full session.

For a color fix or typo correction — probably no. Functional verification is enough.

---

## Step 6: Deliver and Document

### Create the delivery

For changes that go through development review, create a DD (Module 16). For small changes you implement yourself, document in the Design Log.

### Close the dialog

```markdown
## Meta
- Status: Complete

## Summary
Updated password field to show requirements upfront.
Spec updated to v1.2. All tests passing.
One guerrilla test confirmed improvement.

## Log
### Step 1: Review spec (completed)
- Current spec clear but requirements hidden until error
- Identified gap between spec intent and user experience

### Step 2: Update spec (completed)
- Helper text now includes full requirements
- Changelog updated with reason and connection

### Step 3: Implement (completed)
- Updated helper text component
- Requirements now render on page load
- Commit: "Show password requirements upfront per spec v1.2"

### Step 4: Verify (completed)
- Puppeteer confirmed: text matches, requirements visible,
  validation still works, other fields unchanged

### Step 5: Test (completed)
- Guerrilla test: 1 user completed signup without hesitation
  at password field (previously 3/5 hesitated)
```

---

## The Cycle Scales

The same cycle works for everything:

| Change Size | What You Do |
|-------------|-------------|
| **Typo fix** | Check spec → Fix → Verify → Commit |
| **Small modification** | Connect → Update spec → Build → Verify → Document |
| **New feature** | Full WDS cycle: Trigger map → Scenario → Spec → Build → Test → Deliver |
| **Major redesign** | Full WDS cycle with sketching, storyboarding, and formal usability testing |

Small changes skip steps. Large changes use every step. The discipline is the same — you just apply as much process as the change requires.

---

## Avoiding Spec Drift

Over time, specs and reality can diverge. This is the biggest risk in brownfield development.

### Prevention

- **Update specs with every change.** No exceptions.
- **Version your specs.** Changelogs show what changed and why.
- **Let the agent verify.** Puppeteer catches drift automatically.

### Recovery

If specs are already out of date:

1. Audit the current implementation
2. Update specs to match reality
3. Document intentional differences
4. Resume the evolution cycle from there

This is normal in brownfield. Don't feel guilty — just fix it and move forward.

---

## What's Next

In the next lesson, you'll learn the discipline of updating specifications before touching code — and how the agent projects those changes into the codebase.

---

**[Continue to Lesson 2: Update the Spec — Project the Code →](lesson-02-update-spec-project-code.md)**

---

[← Back to Module Overview](module-18-product-evolution-overview.md)

*Part of Module 18: Product Evolution*
