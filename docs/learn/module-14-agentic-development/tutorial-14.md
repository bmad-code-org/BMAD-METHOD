# Tutorial 14: Your First Agentic Session

**Hands-on guide to running a complete agentic development loop**

---

## Overview

This tutorial walks you through a complete agentic development session — creating a Design Log, building from specification, evaluating results, and handling a stuck moment.

**Time:** 45-60 minutes
**Prerequisites:** Design system completed (Module 13)
**Agent:** Freya
**What you'll create:** Working prototype with documented Design Log

---

## Before You Start

**You'll need:**

- A page specification from your project
- Your design tokens (if applicable)
- Access to your AI coding assistant

**The agent will help you:**

- Create the Design Log
- Build step by step
- Track decisions
- Handle problems

---

## Step 1: Start the Design Log (5 min)

### Give the agent your specification:

**You say:**
> "I want to build a working prototype of the signup form from spec P02-signup-form.md. Start by creating a Design Log with scope, tasks, requirements, and test protocol."

### The agent creates the dialog:

```markdown
# Design Log: Signup Form Prototype

## Meta
- Date: 2026-02-10
- Input: P02-signup-form.md
- Agent: Freya
- Status: In Progress

## Scope
Build the signup form as a working HTML/CSS prototype.
Includes: form layout, validation states, error states, loading state.
Excludes: backend integration, actual form submission.

## Tasks
1. [ ] Create form layout with all fields
2. [ ] Style with design tokens
3. [ ] Add validation behavior
4. [ ] Implement error states
5. [ ] Add loading state on submit
6. [ ] Responsive adjustments
7. [ ] Accessibility check

## Requirements
- Match specification P02 exactly
- Inter font, primary #0066FF
- Mobile-first, max-width 400px
- WCAG AA contrast compliance
- All states from spec must be present

## Test Protocol
- [ ] All text matches spec word-for-word
- [ ] Form renders correctly on mobile
- [ ] Tab navigation reaches all fields
- [ ] Error messages appear on blur
- [ ] Loading spinner shows on submit
- [ ] Touch targets 44px minimum
```

**Review the plan.** Does it cover everything? Adjust before proceeding.

---

## Step 2: Execute First Step (5 min)

### Build the form layout:

**The agent builds:**

```html
<div class="signup-form">
  <h1>Start in 2 minutes</h1>
  <p class="subheadline">No credit card required. Cancel anytime.</p>
  <form>
    <div class="form-field">
      <label for="email">Email</label>
      <input type="email" id="email" placeholder="you@example.com">
    </div>
    <div class="form-field">
      <label for="password">Password</label>
      <input type="password" id="password">
      <span class="helper">At least 8 characters</span>
    </div>
    <button type="submit">Create Free Account</button>
  </form>
  <p class="terms">By continuing, you agree to our Terms and Privacy Policy</p>
  <p class="login-link">Already have an account? Log in</p>
</div>
```

### The agent logs the step:

```markdown
## Log

### Step 1: Form layout (completed)
- Created semantic HTML form structure
- All elements from spec present
- Decision: Used form-field wrapper for consistent spacing
```

---

## Step 3: Evaluate and Give Feedback (5 min)

### Compare to spec:

**Check each element:**

| Element | Spec | Output | Status |
|---------|------|--------|--------|
| Headline | "Start in 2 minutes" | Match | Pass |
| Subheadline | "No credit card..." | Match | Pass |
| Email field | With placeholder | Present | Pass |
| Password field | With helper text | Present | Pass |
| Submit button | "Create Free Account" | Match | Pass |
| Terms text | Present | Present | Pass |
| Login link | Present | Present | Pass |

### Give feedback:

> "Layout looks correct. All elements match spec. One issue: the password field is missing the show/hide toggle from the spec. Add that before moving to step 2."

### Agent fixes and updates log:

```markdown
### Step 1: Form layout (completed, revised)
- Added password show/hide toggle
- All elements from spec now present
```

---

## Step 4: Continue Building (15 min)

### Execute steps 2-5:

Work through each step in the plan:

**Step 2: Styling**
> "Apply the design tokens. Primary #0066FF, Inter font, 16px base, 8px spacing scale."

**Evaluate:** Does it match the visual direction? Adjust tokens if needed.

**Step 3: Validation**
> "Add blur-based validation. Email: check format. Password: check 8+ characters."

**Evaluate:** Does validation trigger correctly? Are messages clear?

**Step 4: Error states**
> "Add error states per spec: red border, error message below field."

**Evaluate:** Do errors show and clear correctly?

**Step 5: Loading**
> "Add loading spinner on submit. Disable button and fields during load."

**Evaluate:** Is the loading state clear? Can the user still interact with anything they shouldn't?

---

## Step 5: Handle a Stuck Moment (5 min)

### A common issue:

The loading spinner shows, but the button text doesn't change. You ask the agent to fix it. It changes the button text but now the spinner disappears.

**Recognize the loop.** You've gone back and forth twice.

### Apply the strategy:

> "Let's approach this differently. I want both: the spinner AND the text 'Creating account...' inside the button. Here's the exact HTML I want:
>
> ```html
> <button disabled>
>   <span class="spinner"></span>
>   Creating account...
> </button>
> ```
>
> Make the spinner 16px, inline with the text, with 8px gap."

**Concrete example breaks the loop.**

---

## Step 6: Update the Plan (3 min)

### Review and adjust:

After building, your plan has evolved:

```markdown
## Tasks
1. [x] Create form layout with all fields
2. [x] Style with design tokens
3. [x] Add validation behavior
4. [x] Implement error states
5. [x] Add loading state on submit
6. [ ] Fix password toggle animation       ← ADDED (toggle feels sluggish)
7. [ ] Responsive adjustments
8. [ ] Accessibility check
```

New task emerged from building. That's normal.

---

## Step 7: Run the Test Protocol (5 min)

### Verify everything:

Go through the test protocol from the Design Log:

```markdown
## Test Protocol
- [x] All text matches spec word-for-word
- [x] Form renders correctly on mobile
- [x] Tab navigation reaches all fields
- [x] Error messages appear on blur
- [x] Loading spinner shows on submit
- [ ] Touch targets 44px minimum          ← ISSUE: Submit button is 40px
```

### Fix the issue:

> "Submit button touch target is 40px, needs to be 44px. Increase padding."

### Update log:

```markdown
### Test Protocol Check
- All pass except touch target on submit button
- Fixed: increased button padding from 12px to 14px (48px total height)
- All tests pass
```

---

## Step 8: Finalize the Dialog (5 min)

### Complete the Design Log:

```markdown
## Meta
- Date: 2026-02-10
- Input: P02-signup-form.md
- Agent: Freya
- Status: Complete

## Summary
Built working signup form prototype matching specification.
7 steps completed, 1 task added during development.
1 stuck moment resolved with concrete HTML example.
1 test failure fixed (touch target sizing).
All tests passing.
```

### Save the dialog:

```
docs/_progress/agent-experiences/
└── 2026-02-10-signup-form.md
```

---

## What You've Created

- **Working prototype** matching your specification
- **Complete Design Log** with plan, log, decisions, and test results
- **Reusable context** for future sessions or handoff

---

## Tips for Success

**DO:**

- Always start with a Design Log
- Evaluate after every step
- Give specific, numbered feedback
- Update the plan as you learn
- Log everything

**DON'T:**

- Jump in without a plan
- Let the agent build everything before reviewing
- Give vague feedback ("make it better")
- Fight the same issue more than 3 times
- Skip the test protocol

---

## You've Completed Module 14!

**You can now run agentic development sessions.** You know how to:
- Structure work with Design Logs
- Evaluate and give effective feedback
- Handle stuck moments
- Keep plans alive and updated

---

## Next Module

**[Module 15: Visual Design →](../module-15-visual-design/module-15-visual-design-overview.md)**

Add soul and visual polish to your prototypes.

---

[← Back to Lesson 5](lesson-05-git-discipline.md) | [Back to Module Overview](module-14-agentic-development-overview.md)

*Part of Module 14: Agentic Development*
