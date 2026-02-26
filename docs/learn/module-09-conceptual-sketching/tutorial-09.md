# Tutorial 09: Sketch Your Views

**Hands-on guide to visualizing logical views with Freya**

---

## Overview

This tutorial walks you through creating conceptual sketches for each logical view in your scenarios.

**Time:** 30-40 minutes
**Prerequisites:** Scenario outlines completed (Module 08)
**Agent:** Freya
**What you'll create:** Rough sketches showing default state for each logical view

---

## Before You Start

**You'll need:**

- Your scenario outlines (from Module 08)
- A way to sketch (paper, tablet, or just conversation)
- Your Trigger Map for persona reference

**Freya will help you:**

- Explore multiple layout options
- Connect visual decisions to personas
- Identify gaps before detailed specification
- Refine through conversation

---

## Step 1: Choose Your Entry Point (2 min)

### Decide how you'll visualize:

**Option A: Workshop (conversation-first)**
> "I want to talk through what this screen should contain, then you help me visualize it."

**Option B: You sketch first**
> "I'll sketch this on paper and share a photo for your feedback."

**Option C: AI generates options**
> "Show me 3 different layout approaches for this screen."

**Option D: Reference example**
> "I like how [product] handles this. Can we use similar patterns?"

All paths lead to the same outcome. Choose what feels natural.

---

## Step 2: Select First Scenario (2 min)

### Start with your most important scenario:

**You say:**
> "Let's sketch the views for S01-User-Registration. Starting with the landing page — the first logical view in the journey."

**Freya acknowledges:**
> "Perfect. S01-User-Registration takes the user from landing page to welcome screen. Let's start with the landing page — keyframe 0, the default state when the page loads."

---

## Step 3: Explore the First View (10 min)

### If using Workshop approach:

**Freya asks:**
> "What's the primary purpose of this landing page? What must the user understand immediately?"

**You respond:**
> "They need to understand what Dog Week is and feel confident it's worth trying. The primary action is clicking 'Start Free.'"

**Freya continues:**
> "For Felix, who fears complicated tools, how prominent should that CTA be? And what supporting information helps him feel confident?"

**Work through:**
- What elements are needed?
- What's the visual hierarchy?
- Where does the eye flow?

**Freya might suggest:**
```
Here's one approach:

┌─────────────────────────────────┐
│  Dog Week            [Login]   │
├─────────────────────────────────┤
│                                 │
│     Coordinate Your Family's    │
│          Dog Care               │
│                                 │
│     Everyone knows what to do.  │
│     No more missed walks.       │
│                                 │
│     [   Start Free   ]          │
│                                 │
│     No credit card required     │
│                                 │
└─────────────────────────────────┘

The CTA is prominent and the risk-reducer
("No credit card") addresses Felix's try-first
mentality.
```

### If sketching yourself:

1. Do 3 quick variants (60 seconds each)
2. Photo/scan and share with Freya
3. Discuss which elements work

**Freya responds:**
> "I see variant B has the CTA above the fold and minimal text. This aligns well with Felix. Variant C has more social proof — should we consider adding testimonials?"

---

## Step 4: Select Direction (5 min)

### Choose the layout that best serves the user:

**Freya helps evaluate:**
> "Looking at these options, which layout best addresses Felix's need for simplicity and quick start?"

**You decide:**
> "I think the centered layout with minimal distractions. It keeps the focus on the primary action."

**Freya confirms:**
> "Got it. The centered single-column layout becomes our selected direction for the landing page. Ready to sketch the next view?"

The WHY behind these decisions will be documented later in specifications (Module 11).

---

## Step 5: Continue Through Scenario (10 min)

### Move to next logical view:

**Freya prompts:**
> "Landing page is sketched. The next view in S01 is the Signup Form. What happens when Felix clicks 'Start Free'?"

**Repeat the process:**
1. What's the purpose of this view?
2. Explore layout options
3. Connect to persona
4. Select direction

**Example for Signup Form:**

```
Signup Form - S01-User-Registration - View 02

┌─────────────────────────────────┐
│  Dog Week            [Login]   │
├─────────────────────────────────┤
│                                 │
│     Create Your Account         │
│                                 │
│   ┌───────────────────────┐     │
│   │ Email                 │     │
│   └───────────────────────┘     │
│                                 │
│   ┌───────────────────────┐     │
│   │ Password              │     │
│   └───────────────────────┘     │
│                                 │
│   [    Create Account    ]      │
│                                 │
│   ← Back                        │
│                                 │
└─────────────────────────────────┘

Layout: Centered form, minimal distractions
Elements: Email field, password field, CTA button, back link
```

---

## Step 6: Complete the Scenario (5 min)

### Sketch remaining views:

For S01-User-Registration:
- ✓ Landing Page
- ✓ Signup Form
- Email Verification Prompt
- Welcome Screen

**Freya tracks progress:**
> "We have 2 of 4 views sketched. The Email Verification Prompt is next — this is a transitional view. What does Felix need to see and do here?"

### Keep moving:

Don't over-polish. Rough and complete is the goal.

---

## Step 7: Review and Refine (5 min)

### Look at the complete flow:

**Freya presents:**
> "Here's the full S01-User-Registration journey with sketches:
>
> 1. Landing Page — Value prop, prominent CTA
> 2. Signup Form — Minimal 2-field form
> 3. Email Verification — Check inbox prompt
> 4. Welcome Screen — Next step guidance
>
> Does this flow feel right for Felix?"

### Check for gaps:

- Does each view connect smoothly to the next?
- Is there any missing information?
- Does the layout serve the user's needs?

### Adjust as needed:

> "Looking at this, I think the welcome screen needs more guidance. Felix just signed up — what should he do next?"

---

## Step 8: Save and Organize (3 min)

### Save sketches with scenarios:

```
C-UX-Scenarios/
└── S01-User-Registration/
    ├── scenario-overview.md
    ├── sketches/
    │   ├── 01-landing-page-sketch.png
    │   ├── 02-signup-form-sketch.png
    │   ├── 03-email-verification-sketch.png
    │   └── 04-welcome-screen-sketch.png
```

Or keep sketches in the chat:

> "These sketches are saved in our conversation. Ready to reference when we create detailed specifications and document the WHY behind each decision."

---

## What You've Created

### For each logical view:

- **Rough sketch** showing default state layout
- **Selected direction** identified through exploration
- **Sketches ready** to serve as keyframe 0 for storyboarding

### Example deliverable:

```markdown
# S01-User-Registration Sketches

## View 01: Landing Page
[Sketch image or ASCII layout]

┌─────────────────────────────────┐
│  Dog Week            [Login]   │
├─────────────────────────────────┤
│                                 │
│     Coordinate Your Family's    │
│          Dog Care               │
│                                 │
│     Everyone knows what to do.  │
│     No more missed walks.       │
│                                 │
│     [   Start Free   ]          │
│                                 │
│     No credit card required     │
│                                 │
└─────────────────────────────────┘

Selected: Single-column, centered, mobile-first

## View 02: Signup Form
[Sketch image or ASCII layout]

┌─────────────────────────────────┐
│  Dog Week            [Login]   │
├─────────────────────────────────┤
│                                 │
│     Create Your Account         │
│                                 │
│   ┌───────────────────────┐     │
│   │ Email                 │     │
│   └───────────────────────┘     │
│                                 │
│   ┌───────────────────────┐     │
│   │ Password              │     │
│   └───────────────────────┘     │
│                                 │
│   [    Create Account    ]      │
│                                 │
│   ← Back                        │
│                                 │
└─────────────────────────────────┘

Selected: Centered minimal form, 2 fields only
```

---

## What Happens Next

### These sketches become:

- **Storyboards** (Module 10) — What changes after the default state
- **Specifications** (Module 11) — Detailed documentation of every element

### Your sketches inform:

- Layout structure
- Element hierarchy
- User flow
- Key interactions

---

## Tips for Success

**DO:**

- Keep sketches rough
- Explore multiple variants
- Focus on WHAT appears on screen
- Move quickly through all views
- Select a direction for each view

**DON'T:**

- Polish too early
- Settle on first idea
- Skip exploring alternatives
- Ignore mobile considerations
- Include colors/typography yet

---

## Common Questions

**Q: Do I need to be able to draw?**
A: No. Boxes and labels communicate structure. Freya can generate visual options too.

**Q: How detailed should sketches be?**
A: Just detailed enough to understand layout and hierarchy. Details come in specifications.

**Q: What if I change my mind later?**
A: That's the point of sketching. Better to change a rough sketch than a polished mockup.

**Q: Should I sketch every state?**
A: Just the default state for now. Other states (loading, error, success) come in storyboarding.

---

## You've Completed Module 09!

**Your logical views are visualized.** You have:
- Rough sketches showing default state for each view
- Selected layout directions identified through exploration
- Keyframe 0 ready for storyboarding

---

## Next Module

**[Module 10: Storyboarding →](../module-10-storyboarding/module-10-storyboarding-overview.md)**

Time to show what happens AFTER the default state — the transformations within each view.

---

[← Back to Lesson 3](lesson-03-why-hand-sketching.md) | [Back to Module Overview](module-09-conceptual-sketching-overview.md)

*Part of Module 09: Conceptual Sketching*
