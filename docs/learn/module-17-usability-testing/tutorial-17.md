# Tutorial 17: Plan Your Usability Test

**Hands-on guide to preparing and running a usability test session**

---

## Overview

This tutorial walks you through planning a usability test for one of your flows. You'll define tasks, recruit participants, run a session, and document findings.

**Time:** 30 minutes for planning, 20 minutes per test session
**Prerequisites:** A working prototype (Module 14) or delivered implementation (Module 16)
**Agent:** Freya
**What you'll create:** Test plan, observation notes, and findings document

---

## Before You Start

**You'll need:**

- A working prototype or implementation of one flow
- Access to 1-3 people who roughly match your personas
- A way to record (phone camera, screen recording, or video call)

**Freya will help you:**

- Define good test tasks
- Prepare the session structure
- Analyze findings afterward
- Connect findings to specs and trigger maps

---

## Step 1: Choose the Flow (5 min)

Pick one flow to test. Not the whole product — one flow.

**Good choices:**
- The primary user journey (signup, onboarding, first action)
- A flow you're uncertain about
- A flow with many interaction steps

**You say to Freya:**
> "I want to plan a usability test for the user registration flow. Help me define test tasks."

**Freya responds:**
> "Good choice — registration is the first impression. Let's define tasks that test the complete journey without leading the participant."

---

## Step 2: Define Tasks (5 min)

Write 3-5 tasks. Each task should:
- Describe a goal, not a path
- Be something a real user would actually need to do
- Be completable in 2-5 minutes

**Freya suggests:**

```markdown
## Test Tasks: User Registration Flow

### Task 1: Create an account
"You've heard about [product name] and want to try it.
Go ahead and create an account."

### Task 2: Understand what you signed up for
"You just created your account. What can you do now?
Take a look around."

### Task 3: Find your account settings
"You want to change your email notification preferences.
See if you can find where to do that."
```

**Review the tasks.** Are they realistic? Do they avoid leading the user? Adjust if needed.

---

## Step 3: Prepare the Session (5 min)

### Create a session template:

```markdown
# Usability Test Session

## Flow: User Registration
## Date: [Date]
## Participant: [Name or P1, P2, etc.]
## Location: [Their home / office / remote]
## Recording: [Yes/No, method]

## Introduction Script
"Thanks for helping me test this. I'm testing the design,
not you — there are no wrong answers. Please think out loud
as you go. I won't be able to help during the tasks."

## Tasks
1. Create an account
2. Understand what you signed up for
3. Find account settings

## Observation Notes
[To be filled during session]

## Post-Session Questions
- What stood out to you?
- Was anything confusing or unexpected?
- If you could change one thing, what would it be?
```

### Recruit participants:

Send a message to 3-5 people:

> "Hi! I'm working on a product and would love 20 minutes of your time to try it out. No preparation needed — just use it and tell me what you think. Available this week?"

---

## Step 4: Run the Session (20 min per participant)

### Start recording.

### Read the introduction script.

### Give Task 1. Observe silently.

Take notes:

```markdown
## Observation Notes — P1

### Task 1: Create an account
- 0:00 — Looks at the page, scrolls down
- 0:12 — Scrolls back up, looking for something
- 0:18 — "Where do I sign up?"
- 0:23 — Finds button, clicks it
- 0:35 — Fills in email quickly
- 0:42 — Pauses at password field, reads helper text
- 0:55 — Submits form
- 1:02 — "Oh, it worked. That was easy."
- Completed: Yes
- Time: 1:02
- Issues: Didn't see CTA immediately (18 seconds searching)
```

### Give Task 2. Observe.

### Give Task 3. Observe.

### Ask post-session questions. Note answers.

### Stop recording. Thank them.

---

## Step 5: Review and Analyze (15 min)

### Watch the recording

After all sessions are done, review the recordings. Look for patterns.

**You say to Freya:**
> "I tested the registration flow with 3 participants. Here are my observation notes. Help me identify patterns and create findings."

### Freya analyzes:

> "Pattern 1: All three participants took 15-20 seconds to find the registration button. This is a critical visibility issue — the CTA is below the fold."

> "Pattern 2: Two participants hesitated at the password field. They weren't sure about the requirements. The helper text says '8+ characters' but they expected to see the full requirements before typing."

> "Participant 3 completed everything smoothly — they match the tech-savvy persona. The issues appear persona-specific: less tech-comfortable users struggled more."

---

## Step 6: Document Findings (10 min)

### Create the findings document:

```markdown
# Usability Findings: User Registration Flow
## Test Date: 2026-02-15
## Participants: 3
## Method: Contextual think-aloud

## Finding 1: Registration CTA not visible
**Severity:** Critical
**Observed in:** 3 of 3 participants
**Task:** Create an account
**Timestamps:** P1 0:18, P2 0:22, P3 0:08

### What happened
All participants scrolled or searched before finding the
registration button. Average time to find: 16 seconds.

### Root cause
P01 landing page: CTA is below the hero image.
Visual hierarchy prioritizes imagery over action.

### Recommendation
Move CTA into hero section. Update spec P01 section 3.

---

## Finding 2: Password requirements unclear
**Severity:** Major
**Observed in:** 2 of 3 participants
**Task:** Create an account
**Timestamps:** P1 0:42, P2 0:38

### What happened
Users paused at password field. Helper text says "8+ characters"
but users expected to see full requirements (uppercase, number, etc.)
before typing.

### Root cause
P02 signup form: Helper text is minimal. Requirements only
appear as error messages after the user types a password
that doesn't meet them.

### Recommendation
Show full password requirements below the field from the start.
Update spec P02 section 4.

---

## Summary
- 1 critical finding (CTA visibility)
- 1 major finding (password clarity)
- 0 minor findings
- Next step: Update specs, rebuild, test again
```

---

## Step 7: Update Specs and Plan Next Round (5 min)

### Update specifications:

Based on findings, update the relevant page specs. Document what changed and why.

### Plan the next test:

> "After rebuilding with these changes, I'll test again with 3 new participants to verify the fixes work."

---

## What You've Created

- **Test plan** with defined tasks and session structure
- **Observation notes** from real user sessions
- **Findings document** with severity, evidence, and recommendations
- **Spec updates** based on evidence, not opinion
- **Plan for next round** of testing

---

## Tips for Success

**DO:**

- Test on the user's own device in their own environment
- Record every session
- Observe silently during tasks
- Process findings the same day
- Connect findings to specs and personas

**DON'T:**

- Help the user when they struggle
- Test with people who've seen the design before
- Skip the recording
- Wait a week to process findings (you'll forget details)
- Change the design based on one user's opinion

---

## You've Completed Module 17!

**You can now plan and run usability tests.** You've learned to:
- Define tasks that reveal real usability issues
- Observe without guiding
- Record and review sessions
- Document findings with evidence
- Connect findings back to specifications
- Plan iterative test rounds

---

## Next Module

**[Module 18: Product Evolution →](../module-18-product-evolution/module-18-product-evolution-overview.md)**

Products don't end at launch. Learn how to evolve them.

---

[← Back to Lesson 3](lesson-03-acting-on-findings.md) | [Back to Module Overview](module-17-usability-testing-overview.md)

*Part of Module 17: Usability Testing*
