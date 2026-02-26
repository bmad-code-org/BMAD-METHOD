# Module 10: Storyboarding

**Time: 45 min | Agent: Freya | Phase: Design | Focus: UX**

---

## Transformations Within a View

You have sketches of your pages. But pages aren't static.

Things change. Elements transform. States shift.

**Without leaving the page.**

---

## Scenario vs. Storyboard

| Concept | What Changes | Example |
|---------|--------------|---------|
| **Scenario** | Logical views change | User navigates from Signup to Welcome |
| **Storyboard** | Elements within a view change | Signup form shows loading → success → confetti |

A scenario is the journey **across** pages.

A storyboard is the transformation **within** a page.

Think of it like a film: scenarios are scene changes, storyboards are what happens in each scene.

---

## The Comic Strip Analogy

Think of storyboarding like a comic strip for your interface.

```
┌────────────────────────┐
│  [Logo]      [Nav]     │     ┌──────────────────────────────────────────────┐
├────────────────────────┤     │ SIGNUP FORM - STATE TRANSFORMATIONS          │
│                        │     ├──────────────────────────────────────────────┤
│   Hero Section         │     │                                              │
│                        │     │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐     │
├────────────────────────┤     │  │  1   │  │  2   │  │  3   │  │  4   │     │
│ ┌──────────────────┐   │ ──► │  │      │  │      │  │      │  │      │     │
│ │                  │   │     │  │[btn] │  │ ...  │  │  ✓   │  │  🎉  │     │
│ │   Signup Form    │◄──┼─┐   │  │      │  │      │  │      │  │      │     │
│ │  (Focus area)    │   │ │   │  └──────┘  └──────┘  └──────┘  └──────┘     │
│ └──────────────────┘   │ │   │   Click      Loading   Success   Celebrate  │
│                        │ │   │   Button     State     Message   Animation   │
├────────────────────────┤ │   │                                              │
│   Footer               │ │   └──────────────────────────────────────────────┘
└────────────────────────┘ │
    Full Page              │
    (Default State)        └─── Same section, 4 keyframes showing transformation
```

**The page stays the same. One section transforms.**

Like a comic strip, each frame shows what changes:
1. **Default** — User sees the button
2. **Loading** — Button becomes spinner
3. **Success** — Checkmark appears
4. **Celebration** — Confetti animation

---

## The Default State

Every page starts somewhere.

This is **keyframe 0** — the default state of all objects on the screen.

Your sketch from Module 09? That's typically the default state.

What happens next is the storyboard.

---

## What Storyboards Capture

Storyboards document **complex, non-standard transformations**:

### Async Operations
- Form submission → Loading → Success/Error
- Data fetching → Skeleton screens → Content
- File upload → Progress → Complete

### User Interactions (Complex)
- Accordion expand/collapse with animation
- Modal dialogs opening and closing
- Multi-step wizards with validation
- Searchable/filterable dropdowns

### Animations (Custom)
- Entrance effects when content loads
- Success celebrations (confetti, checkmarks)
- Error shake animations
- Progressive disclosure reveals

### System State Changes
- Real-time notifications appearing
- Live data updates
- Session timeout warnings
- Conditional content showing/hiding

**What storyboards DON'T capture:** Standard hover states, focus rings, simple link colors, or any behavior developers already know from design systems.

---

## Storyboard Format

Add the storyboard images to the section in question.

Specify step by step:

**Visual Example:**

```
K0: Default          K1: User Types      K2: Strong          K3: Show Password
┌────────────────┐  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Password       │  │ Password       │  │ Password       │  │ Password       │
│ ┌────────────┐ │  │ ┌────────────┐ │  │ ┌────────────┐ │  │ ┌────────────┐ │
│ │            │👁│  │ │ •••••      │👁│  │ │ ••••••••   │👁│  │ │MyP@ssw0rd! │👁│
│ └────────────┘ │  │ └────────────┘ │  │ └────────────┘ │  │ └────────────┘ │
│                │  │ [▌  ] Weak     │  │ [████▌] Strong │  │ [████▌] Strong │
│                │  │                │  │      ✓         │  │      ✓         │
└────────────────┘  └────────────────┘  └────────────────┘  └────────────────┘
```

**Documented Format:**

```markdown
## Password Field Storyboard

### Keyframe 0: Default State
[Image: password-field-default.png]
- Input empty
- Eye icon visible (closed)
- No validation message

### Keyframe 1: User Types
[Image: password-field-typing.png]
- Characters masked as dots
- Strength indicator appears
- Shows "Weak" in red

### Keyframe 2: Password Strong
[Image: password-field-strong.png]
- Strength indicator fills
- Shows "Strong" in green
- Checkmark appears

### Keyframe 3: Show Password
[Image: password-field-visible.png]
- User clicks eye icon
- Characters become visible
- Eye icon opens
```

---

## Why Each Change Happens

Don't just show what changes. Explain **why**.

```
The Complete Picture:

K0              K1              K2              K3
Empty    ─────► Typing   ─────► Strong   ─────► Visible
                  │               │               │
                  ▼               ▼               ▼
               WHY: User       WHY: User       WHY: User
               needs           needs           wants to
               feedback        visual          verify
               while           reinforcement   what they
               typing                          typed
```

| Keyframe | What Changes | Why |
|----------|--------------|-----|
| 0 → 1 | Strength indicator appears | User needs feedback while typing |
| 1 → 2 | Color shifts red → green | Reinforce password quality visually |
| 2 → 3 | Characters visible | User wants to verify what they typed |

---

## The Freya Method

Freya helps you think through on-page transformations:

> "When the user submits, what do they see while waiting?"
> "This dropdown opens instantly. Should it animate?"
> "The error appears, but how does the user know which field?"

She ensures every state change serves the user.

---

## What Needs Storyboarding

Storyboard **complex, non-standard transformations**:

```
✅ DO STORYBOARD:                    ❌ DON'T STORYBOARD:

Async Actions                        Button Hover
┌──────┐ ┌──────┐ ┌──────┐          ┌──────┐ ┌──────┐
│Submit│ │ ...  │ │  ✓   │          │Button│ │Button│
└──────┘ └──────┘ └──────┘          └──────┘ └──────┘
K0 → K1 → K2 → K3                    Default   Hover
Complex flow                         Standard behavior

Modal Dialog                         Focus Ring
    ┌──────────────┐                 ┌──────────┐
    │              │                 │ [Input ] │
    │   Content    │                 └──────────┘
    │              │                 Standard pattern
    └──────────────┘
Fade in, 200ms ease
Custom animation
```

| Element | What to Storyboard |
|---------|-------------------|
| **Async Actions** | Submit → Loading → Success/Error states |
| **Forms** | Multi-step validation, progressive disclosure, dynamic fields |
| **Modals** | Open animation, content transitions, close behavior |
| **Expandable Sections** | Collapsed → Expanded with content reveal |
| **Complex Dropdowns** | Multi-level menus, filtered searches, dynamic options |
| **Animations** | Entrance effects, celebration moments, transitions |
| **Real-time Updates** | Live data appearing, notifications arriving |

**Don't storyboard standard behaviors** like button hovers, link colors, or focus states — developers already know these.

---

## Output

For each interactive section of your page:

- Keyframe images showing transformation
- Step-by-step description of changes
- Reason for each change
- Timing/duration where relevant

This becomes the specification for developers.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Confusing with scenarios | Storyboards stay on one page |
| Missing intermediate states | Show every step, not just start/end |
| No "why" | Explain the purpose of each change |
| Forgetting error states | What happens when things fail? |

---

## Practice

Take one interactive section from your sketch:

1. Identify the default state (keyframe 0)
2. List all possible changes
3. Draw/describe each keyframe
4. Explain why each change happens
5. Note timing if relevant

---

## Learn More

- **[Lesson 1: Transformations](lesson-01-transformations.md)** — Understanding state changes within views
- **[Lesson 2: Storyboard Format](lesson-02-storyboard-format.md)** — How to document keyframes effectively
- **[Tutorial: Storyboard Your Views](tutorial-10.md)** — Hands-on practice with Freya

---

## Next Module

**[Module 11: Conceptual Specifications →](../module-11-conceptual-specifications/module-11-conceptual-specifications-overview.md)**

Document every decision.

---

*Part of the WDS Course: From Designer to Linchpin*
