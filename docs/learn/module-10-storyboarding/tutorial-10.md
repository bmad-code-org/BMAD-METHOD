# Tutorial 10: Create Your Storyboards

**Hands-on guide to documenting transformations with Freya**

---

## Overview

This tutorial walks you through creating storyboards for the interactive elements in your page sketches.

**Time:** 30-40 minutes
**Prerequisites:** Conceptual sketches completed (Module 09)
**Agent:** Freya
**What you'll create:** Storyboard documentation for key interactive elements

---

## Before You Start

**You'll need:**

- Your page sketches from Module 09
- Understanding of what happens on each page
- Awareness of user interactions

**Freya will help you:**

- Identify what needs storyboarding
- Think through all states
- Document transitions clearly
- Connect each state to user needs

---

## Step 1: Identify Interactive Elements (5 min)

### Start with your first page:

**You say:**
> "Let's storyboard the signup form from S01-User-Registration. What elements need storyboards?"

**Freya analyzes:**
> "Looking at your signup form sketch, I see these interactive elements:
>
> 1. **Email field** — Focus, typing, validation
> 2. **Password field** — Focus, typing, strength indicator, show/hide
> 3. **Submit button** — Hover, click, loading, success/error
> 4. **Form overall** — Empty, filling, validating, submitting, error, success
>
> Which should we start with?"

### Prioritize:

**You respond:**
> "Let's start with the submit button since that's the main action."

---

## Step 2: Document Default State (3 min)

### Freya asks about keyframe 0:

> "What's the default state of the submit button when the page first loads?"

**You describe:**
> "Primary button, says 'Create Account', blue background, full width on mobile."

**Freya documents:**
```markdown
## Submit Button Storyboard

### Keyframe 0: Default State
- Label: "Create Account"
- Style: Primary (blue background, white text)
- Width: Full width on mobile, auto on desktop
- State: Enabled, clickable

**Why:** Clear call-to-action that matches landing page CTA for continuity
```

---

## Step 3: Map All States (10 min)

### Freya guides through each state:

> "What happens when the user hovers over the button?"

**You respond:**
> "It gets slightly darker, maybe a shadow appears."

**Freya documents and continues:**
```markdown
### Keyframe 1: Hover State
- Background: Darker blue
- Shadow: Subtle elevation
**Transition:** Mouse enters (instant)

**Why:** Confirms the button is interactive
```

> "And when they click?"

**You respond:**
> "Button presses down slightly, then shows a loading spinner."

**Freya continues:**
```markdown
### Keyframe 2: Active/Pressed
- Scale: 98% (pressed effect)
- Background: Even darker
**Transition:** Mouse down (instant)

**Why:** Physical feedback for click action

### Keyframe 3: Loading
- Label replaced with spinner
- Button disabled
- Background unchanged
**Transition:** Form submitted → appears after 100ms delay
**Duration:** Until server responds

**Why:** User knows their action is being processed
```

### Continue for remaining states:

> "What about success and error states?"

**You respond:**
> "Success: checkmark icon, green background, 'Done!' text, then redirect. Error: button returns to normal, error message appears above form."

---

## Step 4: Document Transitions (5 min)

### Freya clarifies transitions:

> "Let's be specific about transitions. When does the loading state appear — immediately on click or with a delay?"

**You respond:**
> "Small delay, maybe 100ms, so it doesn't flash if the server is fast."

**Freya asks:**
> "And the success state — how long is it visible before redirecting?"

**You respond:**
> "About 1.5 seconds. Long enough to register success, not so long it feels slow."

**Freya documents:**
```markdown
### Timing Summary
| Transition | Timing |
|------------|--------|
| Default → Hover | Instant |
| Hover → Active | Instant |
| Active → Loading | 100ms delay |
| Loading → Success | On server response |
| Success → Navigate | 1.5s delay |
| Loading → Error | On server error |
```

---

## Step 5: Add Error States (5 min)

### Freya ensures completeness:

> "We've covered the happy path. What happens when things go wrong?"

**You respond:**
> "If there's a validation error, the button should stay disabled until fields are fixed. If there's a server error, button goes back to normal and an error banner appears."

**Freya documents:**
```markdown
### Error States

#### Form Invalid
- Button remains disabled (grayed out)
- No hover or active states
**Transition:** Form becomes invalid (instant)
**Why:** Prevents submission of incomplete data

#### Server Error
- Button returns to default state
- Error banner appears above form
- Button text: "Try Again"
**Transition:** Server returns error
**Why:** Clear recovery path
```

---

## Step 6: Repeat for Other Elements (10 min)

### Move to next element:

**Freya:**
> "Submit button is complete. Next, let's storyboard the password field — it has the most states."

**Work through:**
- Default (empty)
- Focused (cursor in field)
- Typing (characters masked)
- Strength indicator states
- Show/hide password toggle
- Validation error
- Valid state

### Example password field storyboard:

```markdown
## Password Field Storyboard

### Keyframe 0: Default
- Empty field
- Label above: "Password"
- Placeholder: none (clean look)
- Eye icon: Closed state
- Strength indicator: Hidden

### Keyframe 1: Focused
- Border: Blue (focus ring)
- Cursor blinking in field
**Transition:** User clicks or tabs to field

### Keyframe 2: Typing (Weak)
- Characters masked as dots
- Strength indicator appears: 1/4 fill, red
- Text below: "Weak password"
**Transition:** User starts typing

### Keyframe 3: Typing (Medium)
- Strength indicator: 2/4 fill, orange
- Text: "Getting better"
**Transition:** Password meets some requirements

### Keyframe 4: Typing (Strong)
- Strength indicator: 4/4 fill, green
- Text: "Strong password" + checkmark
**Transition:** Password meets all requirements

### Keyframe 5: Password Visible
- Characters shown instead of dots
- Eye icon: Open state
**Transition:** User clicks eye icon
**Toggle:** Clicking again returns to masked
```

---

## Step 7: Document Form-Level States (5 min)

### Consider the form as a whole:

**Freya:**
> "Individual elements are storyboarded. Now let's document form-level states — how does the overall form behave?"

**Work through:**
- Empty form (just loaded)
- Partially filled
- All fields valid (submit enabled)
- Submitting (fields disabled)
- Server error (recovery state)

```markdown
## Form-Level Storyboard

### State: Empty
- All fields at default
- Submit button disabled
- No validation messages

### State: Partially Filled
- Some fields have content
- Validation shows on blur
- Submit remains disabled until all valid

### State: Ready to Submit
- All fields valid (green indicators)
- Submit button enabled
- User can proceed

### State: Submitting
- All fields disabled (grayed slightly)
- Submit button in loading state
- No new input allowed

### State: Error Recovery
- Fields re-enabled
- Error banner at top
- Last values preserved
- Submit button ready for retry
```

---

## Step 8: Review and Finalize (5 min)

### Freya presents complete storyboards:

> "Here's the complete storyboard documentation for the signup form:
>
> 1. **Submit Button** — 6 states documented
> 2. **Password Field** — 5 states + toggle
> 3. **Email Field** — 4 states
> 4. **Form-Level** — 5 states
>
> Anything missing?"

### Review checklist:

- [ ] All interactive elements covered
- [ ] Default states documented
- [ ] Error states included
- [ ] Success states included
- [ ] Transitions specified
- [ ] Timing noted where relevant
- [ ] "Why" explained for each state

---

## What You've Created

### Storyboard documentation for each page:

```
C-UX-Scenarios/
└── S01-User-Registration/
    ├── scenario-overview.md
    ├── 02-signup-form/
    │   ├── sketch.png
    │   ├── storyboard-submit-button.md
    │   ├── storyboard-password-field.md
    │   ├── storyboard-email-field.md
    │   └── storyboard-form-states.md
```

Or integrated into a single storyboards.md file per page.

---

## What Happens Next

### These storyboards become:

- **Specifications** (Module 11) — Full documentation including storyboards
- **Developer reference** — Exact behavior to implement
- **QA checklist** — States to test

---

## Tips for Success

**DO:**

- Start with high-impact elements
- Document error states
- Include the "why"
- Specify timing
- Use visuals when helpful

**DON'T:**

- Storyboard everything
- Skip error states
- Forget transitions
- Over-document micro-interactions
- Ignore edge cases

---

## Common Questions

**Q: Do I need images for every keyframe?**
A: No. Descriptions work for simple states. Images help for complex visual changes.

**Q: How detailed should timing be?**
A: Detailed enough to implement. "Fast" is vague; "200ms ease-out" is specific.

**Q: What if I'm not sure about a state?**
A: Document your best guess and note it as "needs validation." Better to have something than nothing.

---

## You've Completed Module 10!

**Your transformations are documented.** You know:
- What changes on each page
- How each state looks
- Why each transformation happens

---

## Next Module

**[Module 11: Conceptual Specifications →](../module-11-conceptual-specifications/module-11-conceptual-specifications-overview.md)**

Time to document every decision in complete specifications.

---

[← Back to Lesson 2](lesson-02-storyboard-format.md) | [Back to Module Overview](module-10-storyboarding-overview.md)

*Part of Module 10: Storyboarding*
