# Module 10: Storyboarding

## Lesson 2: Storyboard Format

**How to document transformations clearly**

---

## The Structure

Every storyboard follows this pattern:

1. **Element name** — What's being storyboarded
2. **Keyframes** — Each distinct state
3. **Transitions** — What triggers the change
4. **Why** — Purpose of each state
5. **Timing** — Duration where relevant

```
Storyboard Anatomy:

┌────────────────────────────────────────────────────────────┐
│ ## [Element Name] Storyboard ◄─── 1. What's being tracked │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ### Keyframe 0: Default State  ◄──── 2. Each distinct     │
│ [Visual representation]                  state            │
│ - State description                                        │
│ - Key elements                                             │
│                                                            │
│ **Transition:** User clicks  ◄────── 3. What triggers      │
│ **Why:** User needs feedback          change              │
│                                                            │
│ ### Keyframe 1: Loading State                             │
│ [Visual representation]                                    │
│ - What changed                                             │
│ **Duration:** 300ms  ◄───────────── 5. Timing where       │
│ **Why:** Prevents confusion             relevant          │
│                                                            │
└────────────────────────────────────────────────────────────┘
                          ▲
                    4. Purpose of each state
```

---

## Basic Format

```markdown
## [Element Name] Storyboard

### Keyframe 0: Default State
[Image/description]
- State description
- Key visual elements
- What user can interact with

**Transition:** [What triggers next keyframe]

### Keyframe 1: [State Name]
[Image/description]
- What changed
- What's visible now
- What user can do

**Transition:** [What triggers next keyframe]

### Keyframe 2: [State Name]
...
```

---

## Detailed Example: Form Submit Flow

**Visual Overview:**

```
K0: Ready          K1: Submitting     K2: Success        K3: Error (alt)
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ Email       │   │ Email       │   │ Email       │   │ Email       │
│ ┌─────────┐ │   │ ┌─────────┐ │   │ ┌─────────┐ │   │ ┌─────────┐ │
│ │email@...│ │   │ │email@...│ │   │ │email@...│ │   │ │email@...│ │ ⚠
│ └─────────┘ │   │ └─────────┘ │   │ └─────────┘ │   │ └─────────┘ │
│             │   │             │   │             │   │ ┌─────────┐ │
│ Password    │   │ Password    │   │ Password    │   │ │Email    │ │
│ ┌─────────┐ │   │ ┌─────────┐ │   │ ┌─────────┐ │   │ │exists!  │ │
│ │•••••••••│ │   │ │•••••••••│ │   │ │•••••••••│ │   │ └─────────┘ │
│ └─────────┘ │   │ └─────────┘ │   │ └─────────┘ │   │ Password    │
│             │   │             │   │             │   │ ┌─────────┐ │
│ ┌─────────┐ │   │ ┌─────────┐ │   │ ┌─────────┐ │   │ │•••••••••│ │
│ │ Submit  │ │   │ │   ...   │ │   │ │   ✓     │ │   │ └─────────┘ │
│ └─────────┘ │   │ └─────────┘ │   │ └─────────┘ │   │             │
└─────────────┘   └─────────────┘   │ Account     │   │ ┌─────────┐ │
                                    │ created!    │   │ │ Submit  │ │
  User clicks       Processing       └─────────────┘   │ └─────────┘ │
                    (300ms delay)    Success           └─────────────┘
                                     (1.5s, redirect)   Error state
```

**Documented Format:**

```markdown
## Form Submit Storyboard

### Keyframe 0: Default State (Ready to Submit)
[Image: form-ready.png]
- Form filled with valid data
- Submit button: "Create Account" (enabled)
- No loading indicators visible

**Why:** User has completed form, ready to submit

### Keyframe 1: Submitting State
[Image: form-submitting.png]
- Submit button shows spinner (text replaced)
- Button disabled (grayed out)
- Form fields locked (can't edit)
**Transition:** User clicks submit (appears after 300ms delay)
**Duration:** Until server responds

**Why:** User knows request is processing, prevents double-submit

### Keyframe 2: Success State
[Image: form-success.png]
- Submit button shows checkmark icon
- Button background: Green
- Success message appears above form: "Account created!"
**Transition:** Server responds successfully
**Duration:** 1.5s visible, then redirect

**Why:** Confirms success before navigation

### Keyframe 3: Error State
[Image: form-error.png]
- Submit button returns to default "Create Account"
- Error banner appears at top: "Email already exists"
- Email field highlighted in red
- Form re-enabled for corrections
**Transition:** Server responds with error

**Why:** User can identify and fix the problem
```

---

## Visual Options

You can document storyboards with:

### 1. Screenshots/Images

Most precise. Capture exact states.

```
[Image: form-empty.png]
[Image: form-filling.png]
[Image: form-error.png]
[Image: form-success.png]
```

### 2. ASCII Art

Quick to create, easy to iterate.

```
Keyframe 0:        Keyframe 1:        Keyframe 2:
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Email        │   │ jane@...     │   │ jane@co.com  │
└──────────────┘   └──────────────┘   └──────────────┘
                                      ✓ Valid format
```

### 3. Description Only

When visuals aren't critical.

```
Keyframe 0: Button shows "Submit"
Keyframe 1: Button shows spinner, text hidden
Keyframe 2: Button shows checkmark, turns green
```

### 4. Figma/Design Tool States

Create component variants showing each state.

---

## Transition Types

Document how states change:

```
INSTANT                   TIMED ANIMATION            DELAYED
K0 ──► K1                K0 ─────────► K1           K0 ─ ─ ─► K1
     0ms                      200ms                      300ms wait
┌────┐ ┌────┐           ┌────┐   fade  ┌────┐      ┌────┐ wait ┌────┐
│ A  │ │ A  │           │    │  ─────► │ ▓▓ │      │ X  │      │ X  │
└────┘ └────┘           │    │   in    │ ▓▓ │      └────┘      │ ⚠  │
Default Hover           └────┘         └────┘      No error    └────┘
                        Hidden         Modal                    Error
                                      visible                   appears

No animation            Smooth fade    Prevents flash
Instant feedback        200ms ease     After delay
```

### Instant

```
**Transition:** Instant (no animation)
```

Used for: Hover states, active states, error appearances

### Timed Animation

```
**Transition:** 200ms ease-out
```

Used for: Modals, expandable sections, smooth state changes

### Delayed

```
**Transition:** Appears after 300ms delay
```

Used for: Loading spinners (avoid flash), auto-dismiss messages

### User-Triggered

```
**Transition:** On button click
**Transition:** On input focus
**Transition:** On scroll to element
```

### System-Triggered

```
**Transition:** On server response
**Transition:** On data load complete
**Transition:** On timer expiry
```

---

## Grouping Storyboards

Organize by element type:

```
Page Structure:
┌─────────────────────────────────────────────────┐
│ # Page: Signup Form                             │
├─────────────────────────────────────────────────┤
│ ## Form Fields                                  │
│   ├── Email Field Storyboard ────┐              │
│   │   K0 → K1 → K2                │ User input  │
│   └── Password Field Storyboard ─┘              │
│                                                  │
│ ## Buttons                                      │
│   ├── Submit Button Storyboard ──┐              │
│   │   K0 → K1 → K2 → K3           │ Actions     │
│   └── Back Button Storyboard ────┘              │
│                                                  │
│ ## System States                                │
│   ├── Form Validation Storyboard ┐              │
│   │   K0 → K1 → K2                │ Feedback    │
│   └── Network Error Storyboard ──┘              │
└─────────────────────────────────────────────────┘
```

**Documented Format:**

```markdown
# Page: Signup Form

## Form Fields

### Email Field Storyboard
[keyframes...]

### Password Field Storyboard
[keyframes...]

## Buttons

### Submit Button Storyboard
[keyframes...]

### Back Button Storyboard
[keyframes...]

## System States

### Form Validation Storyboard
[keyframes...]

### Network Error Storyboard
[keyframes...]
```

---

## The Freya Method

Freya helps you think through transformations:

> "When the user submits, what do they see while waiting?"

> "This dropdown opens instantly. Should it animate for smoother UX?"

> "The error appears, but how does the user know which field caused it?"

She ensures every state change serves the user.

---

## What NOT to Storyboard

**Skip storyboarding standard UI behaviors:**

- **Button hover/active states** — Developers know these
- **Link colors** — Standard browser behavior
- **Focus states** — Design system handles this
- **Cursor changes** — Standard pointer/text cursors
- **Simple show/hide** — Basic visibility toggles
- **Static content** — No interactivity

**DO storyboard complex, non-standard transformations:**

- **Async operations** — Loading → Success/Error flows
- **Modal dialogs** — Open/close with animations
- **Expandable sections** — Accordion behavior, content reveals
- **Complex dropdowns** — Multi-level, searchable, filtered
- **Form wizards** — Multi-step progress and validation
- **Animations** — Custom entrance/exit effects
- **Real-time updates** — Live data, notifications

**The rule:** If it's a standard behavior developers already know, don't document it. If it's complex or custom, storyboard it.

---

## Connecting to Specifications

Storyboards become part of your page specifications (Module 11):

```markdown
## Signup Form Specification

### Submit Button
- Component: Button (primary, large)
- Label: "Create Account"
- **Storyboard:** See Submit Button Storyboard

### Email Field
- Component: Input (email)
- Label: "Email"
- **Storyboard:** See Email Field Storyboard
```

The storyboard provides the dynamic behavior; the specification provides the full context.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Confusing with scenarios | Storyboards stay on one page |
| Missing intermediate states | Show every step, not just start/end |
| No "why" | Explain the purpose of each state |
| Forgetting error states | What happens when things fail? |
| Over-documenting | Focus on meaningful transformations |
| No timing | Specify duration when it matters |

---

## Checklist

For each interactive element:

- [ ] Default state documented
- [ ] All user-triggered states
- [ ] All system-triggered states
- [ ] Error states
- [ ] Success states
- [ ] Transition types specified
- [ ] Timing where relevant
- [ ] Why for each state

---

## What's Next

In the tutorial, you'll create storyboards for the interactive elements in your own page sketches. Freya will guide you through identifying what needs storyboarding and documenting each transformation.

---

**[Continue to Tutorial: Create Your Storyboards →](tutorial-10.md)**

---

[← Back to Lesson 1](lesson-01-transformations.md) | [Back to Module Overview](module-10-storyboarding-overview.md)

*Part of Module 10: Storyboarding*
