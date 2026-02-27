# Tutorial 11: Write Your Specifications

**Hands-on guide to creating complete page specifications with Freya**

---

## Overview

This tutorial walks you through creating detailed specifications that developers can implement without asking questions.

**Time:** 45-60 minutes
**Prerequisites:** Sketches (Module 09) and Storyboards (Module 10) completed
**Agent:** Freya
**What you'll create:** Complete specification documents for each page

---

## Before You Start

**You'll need:**

- Your page sketches
- Your storyboard documentation
- Your Trigger Map for references
- Real content ideas (not lorem ipsum)

**Freya will help you:**

- Structure specifications consistently
- Catch missing states and edge cases
- Write real content
- Ensure completeness

---

## Step 1: Choose Your First Page (2 min)

### Start with a key page:

**You say:**
> "Let's create the specification for the signup form from S01-User-Registration. I have the sketch and storyboards ready."

**Freya acknowledges:**
> "Great. Let's build a complete specification. I'll guide you through each section to ensure nothing is missed."

---

## Step 2: Document Purpose and Connections (5 min)

### Freya asks about context:

> "First, let's establish why this page exists. What's its purpose?"

**You respond:**
> "Allow new users to create an account with minimal friction. Get them from curious visitor to registered user."

**Freya continues:**
> "Which persona and driving force does this serve?"

**You respond:**
> "Felix the Full-Stack. His driving force is 'Want to try before committing.' He fears complicated onboarding."

**Freya documents:**
```markdown
# P02: Signup Form Specification

## Purpose
Allow new users to create an account with minimal friction.
Transform curious visitors into registered users.

## Connects To
- Scenario: S01-User-Registration
- Persona: Felix the Full-Stack
- Driving Force: "Want to try before committing"
- Feature: F03-Quick-Signup
- Business Goal: User acquisition and activation
```

---

## Step 3: List All Elements (10 min)

### Freya guides element identification:

> "Looking at your sketch, let's identify every element on this page. What's visible?"

**Work through systematically:**

**You respond:**
> "Header with logo and back button. Main heading and subheading. Email field. Password field with strength indicator. Submit button. Terms text with link. Login link for existing users."

**Freya creates structure:**
```markdown
## Elements

### Header Section
- Logo (left)
- Back button (left of logo or top-left)

### Form Section
- Headline
- Subheadline
- Email field
- Password field
- Password strength indicator
- Submit button

### Footer Section
- Terms text with link
- Login link
```

### Detail each element:

**Freya:**
> "Let's specify each element. Starting with the email field — what are the details?"

**You respond:**
> "Text input, label says 'Email', placeholder 'you@example.com', validates email format, error message 'Please enter a valid email'."

**Freya documents:**
```markdown
### Email Field
- ID: signup-email-field
- Type: Text input (email)
- Label: "Email"
- Placeholder: "you@example.com"
- Validation: Valid email format (on blur)
- Error message: "Please enter a valid email"
- Required: Yes
```

### Continue for all elements...

---

## Step 4: Define All States (10 min)

### Freya ensures state coverage:

> "Now let's document all possible states for this page. What's the default state when someone arrives?"

**You respond:**
> "Empty form, submit button disabled, no validation messages, headline and subhead visible."

**Freya continues:**
> "What states does the form go through as the user interacts?"

**Work through:**
- Default (empty)
- Filling (typing)
- Partially valid
- All valid (submit enabled)
- Submitting
- Error (from server)
- Success

**Freya documents:**
```markdown
## Page States

### Default
- Form: Empty
- Email field: Placeholder visible
- Password field: Empty, strength indicator hidden
- Submit button: Disabled (grayed)
- Validation: None visible

### Filling
- Fields show user input
- Validation appears on blur
- Strength indicator shows as user types password
- Submit button: Disabled until all valid

### Ready to Submit
- All fields valid (no error messages)
- Password strength: Acceptable or better
- Submit button: Enabled (primary blue)

### Submitting
- All fields: Disabled (slightly grayed)
- Submit button: Loading spinner
- No new input allowed

### Server Error
- Fields: Re-enabled
- Error banner: Appears above form
- Submit button: Returns to enabled
- User input: Preserved

### Success
- Brief success state (1.5s)
- Then redirect to Welcome Screen
```

---

## Step 5: Write Real Content (10 min)

### Freya prompts for actual copy:

> "Let's write the real content. No lorem ipsum. What should the headline say?"

**You respond:**
> "Something like 'Create your account' — but that's boring. Maybe 'Start in 2 minutes' to emphasize speed?"

**Freya helps refine:**
> "Given Felix's fear of complexity, emphasizing speed is smart. What about the subheadline?"

**You respond:**
> "'No credit card required. Cancel anytime.'"

**Freya documents:**
```markdown
## Content

### Headlines
- Main: "Start in 2 minutes"
- Sub: "No credit card required. Cancel anytime."

### Form Labels
- Email: "Email"
- Password: "Password"

### Button Text
- Submit: "Create Free Account"
- Loading: [Spinner, no text]

### Helper Text
- Password requirements: "At least 8 characters"
- Strength indicators: "Weak" / "Fair" / "Strong"

### Links
- Terms: "By continuing, you agree to our Terms and Privacy Policy"
- Login: "Already have an account? Log in"

### Error Messages
| Condition | Message |
|-----------|---------|
| Email empty | "Email is required" |
| Email invalid | "Please enter a valid email" |
| Email exists | "This email is already registered. Log in instead →" |
| Password empty | "Password is required" |
| Password too short | "Password must be at least 8 characters" |
| Server error | "Something went wrong. Please try again." |
| Network error | "Connection lost. Please check your internet." |
```

---

## Step 6: Add Behavior Details (5 min)

### Include storyboard references:

**Freya:**
> "Let's link the behavioral details. You have storyboards for the submit button and password field, correct?"

**You respond:**
> "Yes, those are documented."

**Freya adds:**
```markdown
## Behavior

### Submit Button
See: [Submit Button Storyboard](./storyboards/submit-button.md)

Summary:
- Default → Hover (instant, darker)
- Click → Loading (100ms delay)
- Success → Checkmark, green (1.5s then redirect)
- Error → Return to default

### Password Field
See: [Password Field Storyboard](./storyboards/password-field.md)

Summary:
- Focus → Blue border
- Typing → Strength indicator appears
- Eye click → Toggle visibility
```

---

## Step 7: Edge Cases and Accessibility (5 min)

### Freya prompts for completeness:

> "A few more things to cover. What edge cases should we document?"

**You respond:**
> "User hitting back button during submit. User on slow connection. User with JavaScript disabled."

**Freya documents:**
```markdown
## Edge Cases

### Back Button During Submit
- Behavior: Cancel request, return to form
- Form state: Preserved (not lost)

### Slow Connection (>3s)
- After 3s: Show "Still working..." below spinner
- After 10s: Show retry option

### JavaScript Disabled
- Form still submits (progressive enhancement)
- No client-side validation (server handles)
- No password strength indicator
```

### Accessibility:

**Freya:**
> "Let's add accessibility notes for the form."

```markdown
## Accessibility

### Form
- Labels: Associated with inputs via htmlFor
- Required fields: aria-required="true"
- Errors: aria-describedby pointing to error message

### Submit Button
- Type: button (within form)
- Loading state: aria-busy="true"
- Disabled: aria-disabled="true"

### Focus Order
1. Back button
2. Email field
3. Password field
4. Show/hide password toggle
5. Submit button
6. Terms link
7. Login link

### Keyboard Navigation
- Tab: Moves through focusable elements
- Enter: Submits form (when on submit button or input)
- Escape: No action (modal not applicable)
```

---

## Step 8: Add Spacing Objects (5 min)

### Freya guides the invisible layer:

> "Now let's specify the spacing between sections. Every gap needs an ID."

**You work through the page sections:**

```markdown
## Spacing Objects

#### ↕ `signup-v-space-zero` — header sits flush against form section
#### ↕ `signup-v-space-xl` — comfortable gap between form and trust section
#### ↕ `signup-v-space-lg` — standard gap between trust section and footer
```

**Freya reminds:**
> "Zero spacing is a design decision too — document it so nobody 'fixes' it later."

### Typography tokens:

> "Let's also specify the heading sizes using tokens, not pixels."

```markdown
### Headline
| Property | Value |
|----------|-------|
| Tag | h1 |
| Visual size | heading-xl / heading-2xl / heading-3xl |
| Font weight | 900 |
```

**Freya explains:**
> "The semantic tag (h1) and the visual size (heading-xl) are independent. The h1 tells screen readers this is the page title. The token controls how big it looks."

---

## Step 9: Review Complete Specification (5 min)

### Freya presents the full document:

> "Here's the complete specification. Let's review for completeness."

### Checklist:

- [x] Purpose documented
- [x] Persona/Trigger Map connection
- [x] All elements listed with IDs
- [x] All states documented
- [x] Real content written
- [x] Error messages complete
- [x] Storyboards referenced
- [x] Edge cases covered
- [x] Accessibility included

### Ask the test question:

> "Can a developer build this from the spec alone, without asking questions?"

If yes, you're done. If not, identify what's missing.

---

## Step 10: Save and Organize (2 min)

### Save the specification:

```
C-UX-Scenarios/
└── S01-User-Registration/
    └── P02-signup-form/
        ├── specification.md    ← Complete specification
        ├── sketch.png
        └── storyboards/
            ├── submit-button.md
            └── password-field.md
```

### Move to next page:

Repeat for P01-landing-page, P03-welcome-screen, etc.

---

## What You've Created

### For each page:

A complete specification including:
- Purpose and context
- All elements with IDs
- All states
- Real content
- Behavior details
- Edge cases
- Accessibility

### The specification is:

- **Implementation-ready** — Developers can build it
- **Testable** — QA can verify every state
- **Traceable** — Every element has an ID
- **Connected** — Links to personas and features

---

## Tips for Success

**DO:**

- Write real content
- Document all states
- Include error messages
- Reference storyboards
- Cover accessibility
- Use consistent IDs

**DON'T:**

- Use lorem ipsum
- Skip edge cases
- Forget loading states
- Leave content TBD
- Ignore keyboard navigation

---

## Common Questions

**Q: How long should a specification be?**
A: As long as needed to be complete. A simple page might be 1 page; a complex form might be 5+ pages.

**Q: What if content isn't final?**
A: Write your best guess and mark it "[CONTENT TBD - awaiting copy review]". Something is better than lorem ipsum.

**Q: Do I need all the accessibility details?**
A: For critical interactive elements, yes. For simple text, standard HTML semantics suffice.

---

## You've Completed Module 11!

**Your specifications are complete.** You've documented:
- Every element
- Every state
- All content
- All behavior

This is the core deliverable of WDS.

---

## Next Module

**[Module 12: Functional Components →](../module-12-functional-components/module-12-functional-components-overview.md)**

Time to identify reusable patterns across your specifications.

---

[← Back to Lesson 3](lesson-03-element-state-specifications.md) | [Back to Module Overview](module-11-conceptual-specifications-overview.md)

*Part of Module 11: Conceptual Specifications*
