# Tutorial 15: Create Your Visuals

**Hands-on guide to generating and refining visual designs**

---

## Overview

This tutorial walks you through generating visual prototypes from your specifications.

**Time:** 40-50 minutes
**Prerequisites:** Working prototypes (Module 14), Components documented (Module 12)
**Agent:** Freya
**What you'll create:** Visual prototypes for your key pages

---

## Before You Start

**You'll need:**

- Your page specifications
- Your component documentation
- Design tokens (if using Design System Mode 2-4)
- Access to Figma or browser preview

**Freya will help you:**

- Generate initial visuals
- Review against specifications
- Identify refinements needed
- Ensure accessibility compliance

---

## Step 1: Choose Your First Page (2 min)

### Start with a key page:

**You say:**
> "Let's create visuals for the signup form (P02) from S01-User-Registration. Here's my specification."

**Share your specification with Freya.**

**Freya acknowledges:**
> "I have your signup form specification. Let's generate a visual prototype and refine it."

---

## Step 2: Define Visual Requirements (3 min)

### Establish design tokens:

**Freya asks:**
> "What are your visual requirements? Font family, primary color, and base sizing?"

**You respond:**
> "Inter font, primary color #0066FF, 16px base, white background with light gray accents (#F9FAFB)."

**Freya notes:**
```
Visual tokens:
- Font: Inter
- Primary: #0066FF
- Background: #FFFFFF
- Accent/muted: #F9FAFB
- Text: #111827
- Error: #DC2626
- Base size: 16px
- Spacing scale: 8px increments
```

---

## Step 3: Generate Initial Visual (5 min)

### Freya generates prototype:

> "Generating signup form prototype based on your specification..."

**Freya produces:**
```html
<!-- Signup Form Prototype -->
<div style="max-width: 400px; margin: 0 auto; padding: 24px; font-family: Inter, sans-serif;">
  <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 8px;">
    Start in 2 minutes
  </h1>
  <p style="color: #6B7280; margin-bottom: 24px;">
    No credit card required. Cancel anytime.
  </p>

  <form>
    <div style="margin-bottom: 16px;">
      <label style="display: block; margin-bottom: 4px;">Email</label>
      <input type="email" placeholder="you@example.com"
             style="width: 100%; padding: 12px; border: 1px solid #D1D5DB; border-radius: 6px;">
    </div>

    <div style="margin-bottom: 24px;">
      <label style="display: block; margin-bottom: 4px;">Password</label>
      <input type="password"
             style="width: 100%; padding: 12px; border: 1px solid #D1D5DB; border-radius: 6px;">
      <span style="color: #6B7280; font-size: 14px;">At least 8 characters</span>
    </div>

    <button style="width: 100%; padding: 14px; background: #0066FF; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer;">
      Create Free Account
    </button>
  </form>

  <p style="margin-top: 16px; font-size: 14px; color: #6B7280; text-align: center;">
    By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
  </p>

  <p style="margin-top: 24px; text-align: center;">
    Already have an account? <a href="#">Log in</a>
  </p>
</div>
```

> "Preview this in your browser and let me know what needs adjustment."

---

## Step 4: Review Against Specification (5 min)

### Compare visual to spec:

**Freya:**
> "Let's verify the visual matches your specification. Checking each element..."

**Checklist:**

| Element | Spec | Visual | Status |
|---------|------|--------|--------|
| Headline | "Start in 2 minutes" | ✓ | Match |
| Subheadline | "No credit card required" | ✓ | Match |
| Email field | Required, placeholder | ✓ | Match |
| Password field | 8+ chars, helper text | ✓ | Match |
| Submit button | "Create Free Account" | ✓ | Match |
| Terms link | Present | ✓ | Match |
| Login link | Present | ✓ | Match |

### Identify gaps:

**Freya:**
> "I notice a few things:
> 1. Password show/hide toggle is missing from the visual
> 2. Strength indicator not shown
> 3. Error states not visualized yet
>
> Should we add these?"

**You respond:**
> "Yes, add the show/hide toggle. Skip strength indicator for MVP. We need error states too."

---

## Step 5: Refine the Visual (10 min)

### Add missing elements:

**Freya updates:**
> "Adding password toggle and generating error states..."

**Password field with toggle:**
```html
<div style="position: relative;">
  <input type="password" style="...">
  <button type="button" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer;">
    👁️ <!-- Eye icon -->
  </button>
</div>
```

**Error state:**
```html
<div style="margin-bottom: 16px;">
  <label style="display: block; margin-bottom: 4px;">Email</label>
  <input type="email"
         style="... border-color: #DC2626;">
  <span style="color: #DC2626; font-size: 14px;">
    Please enter a valid email
  </span>
</div>
```

### Design all states:

- Default (empty form)
- Filling (content entered)
- Error (validation failed)
- Submitting (loading state)
- Success (before redirect)

---

## Step 6: Check Accessibility (5 min)

### Verify contrast and sizing:

**Freya:**
> "Running accessibility checks..."

**Results:**
| Check | Result |
|-------|--------|
| Button text contrast | 8.6:1 ✓ Pass |
| Input text contrast | 13.4:1 ✓ Pass |
| Helper text contrast | 4.8:1 ✓ Pass |
| Error text contrast | 5.3:1 ✓ Pass |
| Focus visible | ⚠️ Need to add |
| Touch targets | ✓ 44px+ |

### Add focus states:

**Freya:**
> "Adding focus styles for keyboard navigation..."

```css
input:focus {
  outline: 2px solid #0066FF;
  outline-offset: 2px;
}

button:focus {
  outline: 2px solid #0066FF;
  outline-offset: 2px;
}
```

---

## Step 7: Generate Responsive Variations (5 min)

### Create tablet/desktop versions:

**Freya:**
> "Your base is mobile-first. For larger screens, do you want any layout changes?"

**You respond:**
> "Center the form on desktop with max-width 400px. Add some padding around it."

**Freya generates:**
```css
@media (min-width: 768px) {
  .signup-container {
    max-width: 400px;
    margin: 64px auto;
    padding: 32px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
}
```

---

## Step 8: Save and Document (5 min)

### Save the visual prototype:

**Options:**
1. **HTML file** — Save in scenario folder
2. **Figma import** — Use html.to.design
3. **Screenshots** — Capture each state

```
C-UX-Scenarios/
└── S01-User-Registration/
    ├── P02-signup-form/
    │   ├── specification.md
    │   ├── visual-prototype.html
    │   └── states/
    │       ├── default.png
    │       ├── error.png
    │       ├── loading.png
    │       └── success.png
```

### Document visual decisions:

```markdown
## Visual Notes

### Design Tokens Applied
- Primary button: #0066FF
- Error: #DC2626
- Text: #111827
- Muted text: #6B7280

### Deviations from Spec
- Strength indicator removed (MVP scope)
- Added subtle shadow on desktop

### Accessibility
- All contrast ratios pass WCAG AA
- Focus states visible
- Touch targets 44px+
```

---

## Step 9: Move to Next Page (Optional)

### Repeat for remaining pages:

**Freya:**
> "Signup form visual is complete. The next pages in S01 are:
> - P01-landing-page
> - P03-welcome-screen
>
> Which would you like to visualize next?"

Continue the process for each page in your scenarios.

---

## What You've Created

### For each page:

- **Visual prototype** — Working HTML/CSS
- **State screenshots** — All states visualized
- **Responsive variations** — Mobile + desktop
- **Accessibility verified** — Contrast, focus, targets

### Ready for:

- Stakeholder review
- Usability testing
- Developer handoff
- Design delivery

---

## Tips for Success

**DO:**

- Start with specification, not visuals
- Check against spec after every generation
- Design all states, not just default
- Verify accessibility before approving
- Document deviations

**DON'T:**

- Skip error states
- Ignore responsive behavior
- Approve without contrast check
- Leave spec-visual mismatches

---

## You've Completed Module 15!

**Your specifications are now visible.** You have:
- Working prototypes
- All states designed
- Accessibility verified
- Responsive behavior defined

---

## Next Module

**[Module 16: Design Delivery →](../module-16-design-delivery/module-16-design-delivery-overview.md)**

Package and deliver your design.

---

[← Back to Lesson 2](lesson-02-visual-techniques.md) | [Back to Module Overview](module-15-visual-design-overview.md)

*Part of Module 15: Visual Design*
