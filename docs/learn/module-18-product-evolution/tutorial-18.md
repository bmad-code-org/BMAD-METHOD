# Tutorial 18: Evolve Your Product

**Hands-on guide to running a complete evolution cycle**

---

## Overview

This tutorial walks you through a product evolution cycle — from receiving user feedback to closing the Design Log with a verified change.

**Time:** 20-30 minutes
**Prerequisites:** Understanding of WDS workflow (Modules 4-17)
**Agent:** Freya
**What you'll practice:** The complete evolution cycle using the Product Evolution Design Log

---

## The Change Request

You've received this feedback from usability testing (Module 17):

> "3 of 5 users hesitated at the password field. They didn't know the full requirements until they submitted and got an error. One user tried three times before getting it right."

Your task: fix this using the evolution cycle.

---

## Step 1: Connect to Strategy (3 min)

### Trace the feedback

**You say to the agent:**
> "We have usability feedback about password requirements. Help me connect this to our Trigger Map."

**The agent analyzes:**
> "Looking at your Trigger Map...
>
> Persona: Felix — values speed and efficiency
> Driving force: 'Don't waste my time with unclear processes'
> Business goal: Reduce signup abandonment (currently 15% drop-off at password step)
>
> This directly opposes Felix's core driving force. Proceed."

### Apply the Whiteport Rule

Is this worth showing to 5 users and 1 domain expert? Yes — the problem was found by testing with users. The fix should be verified the same way.

---

## Step 2: Create the Evolution Design Log (5 min)

**You say:**
> "Create a Design Log for this evolution. Type: feature modification. Context: password field requirements are hidden until error."

**The agent creates:**

```markdown
# Design Log: Password Requirements Clarity

## Meta
- Date: 2026-03-15
- Type: Feature modification
- Input: Usability test findings (Round 1)
- Agent: Freya
- Branch: fix/password-requirements
- Status: In Progress

## Context
Current: Password field shows "At least 8 characters" as helper text.
Full requirements (8+ chars, 1 number, 1 letter) only appear as error
messages after submission.

Problem: Users don't know requirements until they fail. 3/5 users
hesitated. 1 user needed 3 attempts.

Trigger Map: Felix — efficiency driving force.
Business: 15% drop-off at password step.

## Scope
Change: Show full requirements upfront before user types.
Keep: Strength indicator, blur validation, error styling.
Don't touch: Email field, form layout, submission flow.

## Tasks
1. [ ] Review current spec P02-signup-form.md
2. [ ] Update spec with new requirements display
3. [ ] Implement the change
4. [ ] Verify with Puppeteer
5. [ ] Verify unchanged functionality
6. [ ] Quick guerrilla test
7. [ ] Close dialog

## Requirements
- Must not change form layout or other fields
- Requirements text must be clear without jargon
- Must maintain WCAG AA compliance
- Spec updated before implementation

## Test Protocol
- [ ] Helper text shows full requirements
- [ ] Requirements visible before user types
- [ ] Blur validation still triggers correctly
- [ ] Error messages still appear on invalid input
- [ ] Strength indicator still works
- [ ] Email field unchanged
- [ ] Touch targets maintained
```

**Review the dialog.** Does it cover everything? Adjust before proceeding.

---

## Step 3: Review and Update Spec (5 min)

### Read current specification

**The agent reads P02-signup-form.md:**
> "Current password field spec:
> - Label: 'Password'
> - Helper text: 'At least 8 characters'
> - Validation: On blur — 8+ chars, 1 number, 1 letter
> - Error: 'Password must be at least 8 characters with a number and letter'
> - Strength indicator: Appears on typing"

### Update the specification

**You say:**
> "Update the spec: helper text should read '8+ characters, including a number and letter'. Requirements visible at all times, not just on error. Add changelog entry."

**The agent updates P02-signup-form.md:**

```markdown
#### Password Field (v1.2)
- Label: "Password"
- Helper text: "8+ characters, including a number and letter"
- Requirements: Shown below field at all times
- Validation: On blur — check 8+ chars, 1 number, 1 letter
- Error: Red border + "Password must be at least 8 characters
  with a number and letter"
- Strength indicator: Appears on typing
```

```markdown
### Changelog
#### v1.2 (2026-03-15)
- Changed: Password helper text shows full requirements upfront
- Reason: Usability testing — 3/5 users confused by hidden requirements
- Connection: Felix — efficiency driving force
```

**The agent logs:**
> "Tasks 1 and 2 complete. Spec updated to v1.2."

---

## Step 4: Implement and Verify (5 min)

### Build the change

**You say:**
> "Implement the spec change. Then verify with Puppeteer."

**The agent builds:**
> "Updating password field component..."
> "Helper text changed from 'At least 8 characters' to '8+ characters, including a number and letter'..."
> "Requirements now render on page load instead of on error..."

### Agent verifies with Puppeteer

> "Opening signup form at localhost:3000/signup..."
> "Helper text: '8+ characters, including a number and letter' — matches spec v1.2. ✓"
> "Requirements visible before typing — confirmed. ✓"
> "Entering 'short', blurring... error message appears. ✓"
> "Entering valid password... strength indicator appears. ✓"
> "Checking email field... unchanged. ✓"
> "Touch target on submit button: 48px. ✓"
> "6 of 6 criteria pass."

**You evaluate:** Does it look right? Does the helper text feel clear? Is the visual hierarchy maintained?

---

## Step 5: Quick Usability Check (5 min)

### Guerrilla test

Grab someone nearby. Don't explain anything. Just say:

> "Can you create an account on this?"

Watch what happens at the password field. Do they hesitate? Do they read the requirements? Do they get it right the first time?

**Result:**
> User entered password on first attempt without hesitation. Read the requirements text, typed a valid password. Done.

Compare to the original finding: 3 of 5 hesitated, 1 needed 3 attempts.

One guerrilla test isn't statistically significant — but combined with the original finding, it confirms the direction is right.

---

## Step 6: Close the Dialog (3 min)

### Commit and document

**The agent commits:**
> "Show password requirements upfront per spec v1.2"

**Close the Design Log:**

```markdown
## Meta
- Status: Complete

## Summary
Updated password field to show requirements upfront.
Spec updated to v1.2. Puppeteer verified 6/6 criteria.
Guerrilla test confirmed improvement.

## Log
### Step 1: Review spec (completed)
- Read P02-signup-form.md v1.1
- Identified: requirements hidden until error

### Step 2: Update spec (completed)
- Helper text: "8+ characters, including a number and letter"
- Requirements visible at all times
- Changelog entry added with reason and connection

### Step 3: Implement (completed)
- Updated helper text component
- Requirements render on page load
- Commit: "Show password requirements upfront per spec v1.2"

### Step 4: Verify (completed)
- Puppeteer: 6/6 criteria pass
- Helper text matches, requirements visible, validation works,
  strength indicator works, email field unchanged

### Step 5: Test (completed)
- Guerrilla test: user completed password on first attempt
- Original problem: 3/5 hesitated, 1 needed 3 attempts
```

---

## What You've Practiced

The complete evolution cycle:

1. **Connected** feedback to Trigger Map and business goal
2. **Created** an Evolution Design Log with context
3. **Updated** the specification before touching code
4. **Built** from the updated spec
5. **Verified** with Puppeteer during development
6. **Tested** with a quick guerrilla session
7. **Documented** everything in the Design Log

Same WDS process. Smaller scope. Full discipline.

---

## You've Completed the WDS Course!

**Congratulations.** You've learned the full methodology:

1. **Strategy** — Product Brief, Trigger Map, Platform Requirements
2. **Design** — Scenarios, Sketches, Storyboards, Specifications, Components, Design System
3. **Build** — Agentic Development, Visual Design, Design Delivery
4. **Validate** — Usability Testing
5. **Evolve** — Product Evolution

Whether you're starting from a blank page or improving a live product, the process is the same. The scope changes. The discipline doesn't.

**You are the linchpin.**

---

## What's Next?

- **Apply to a real project** — The only way to truly learn is to do
- **Join the community** — [Discord](https://discord.gg/whiteport)
- **Contribute** — WDS is open source
- **Teach others** — Spread creative discipline

---

**[← Back to Lesson 2](lesson-02-update-spec-project-code.md)** | **[← Back to Module Overview](module-18-product-evolution-overview.md)** | **[Back to Course Overview](../00-course-overview/00-course-overview.md)**

---

*Created by Mårten Angner and the Whiteport team*
*Part of Module 18: Product Evolution*
