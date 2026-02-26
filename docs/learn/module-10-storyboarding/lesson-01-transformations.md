# Module 10: Storyboarding

## Lesson 1: Transformations Within a View

**What happens after the page loads**

---

## Pages Aren't Static

You have sketches of your pages now. The default state — keyframe 0.

But pages don't stay frozen. Things change.

- Buttons get clicked
- Forms get filled
- Data loads in
- Errors appear
- Animations play

All of this happens **without leaving the page**.

---

## Scenario vs. Storyboard

This distinction is crucial:

| Concept | What Changes | Example |
|---------|--------------|---------|
| **Scenario** | Logical views change | User navigates Signup → Welcome |
| **Storyboard** | Elements within a view change | Button: Default → Loading → Success |

A scenario is the journey **across** pages.
A storyboard is the transformation **within** a page.

```
SCENARIO (across pages):
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   Page 1:    │  nav   │   Page 2:    │  nav   │   Page 3:    │
│   Signup     │ ─────► │   Welcome    │ ─────► │  Dashboard   │
└──────────────┘        └──────────────┘        └──────────────┘

STORYBOARD (within one page):
┌──────────────────────────────────────────────────────────────┐
│                        Page 2: Welcome                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │   K0     │  │   K1     │  │   K2     │  │   K3     │    │
│  │          │  │          │  │          │  │          │    │
│  │ Default  │  │ Loading  │  │ Success  │  │ Animate  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
│                                                              │
│  Same page, element transformations                         │
└──────────────────────────────────────────────────────────────┘
```

---

## Why Storyboard?

Without storyboarding:

> Developer: "What happens when the user clicks submit?"
> Designer: "Uh... it submits."
> Developer: "But what do they see? Loading state? Confirmation? Does the button change?"
> Designer: "I... didn't think about that."

With storyboarding:

> Developer reads specification:
> "Submit button: Default → Loading (spinner replaces text) → Success (checkmark appears, redirects in 1.5s)"
> Developer knows exactly what to build.

---

## The Default State Anchor

Everything starts from the default state.

Your sketch from Module 09? That's keyframe 0.

```
Keyframe 0: Default State
├── User hasn't interacted yet
├── Data hasn't loaded yet
├── No errors, no success
└── This is what they see first
```

Every transformation you document is a change FROM this state.

---

## What Storyboards Capture

```
Three Types of Transformations:

1. USER INTERACTIONS
   User action → Element responds

   ┌────────┐  user    ┌────────┐
   │ [btn]  │  clicks  │  ...   │
   └────────┘  ──────► └────────┘
   Accordion           Expands

2. SYSTEM STATE CHANGES
   System event → View updates

   ┌────────┐  data    ┌────────┐
   │ ▓▓▓▓▓▓ │  loads   │ Content│
   └────────┘  ──────► └────────┘
   Skeleton            Real data

3. ANIMATIONS
   Time-based transformation

   ┌────────┐  200ms   ┌────────┐
   │  ✓     │  fade    │  ✓     │
   │        │  ──────► │Success!│
   └────────┘    in    └────────┘
   Icon              + Message
```

### 1. Interactions

User does something → Element responds

- Button pressed → Loading spinner appears
- Input focused → Placeholder fades, label animates
- Accordion clicked → Content expands
- Drag initiated → Element follows cursor

### 2. System State Changes

Something happens in the system → View reflects it

- Data loads → Skeleton replaced with content
- Error occurs → Error message appears
- Timer expires → Session timeout modal
- Real-time update → New item appears

### 3. Animations

Something changes over time

- Form submitted → Success message fades in
- Page loads → Elements stagger in
- Scroll happens → Header shrinks
- Error occurs → Field shakes

---

## Keyframes

Storyboards are sequences of **keyframes**.

Each keyframe is a snapshot of the view at a specific moment:

```
Timeline View:

Keyframe 0: Default State
    ↓ (user clicks submit)
Keyframe 1: Loading State
    ↓ (server responds success)
Keyframe 2: Success State
    ↓ (redirect after 1.5s)
[Navigate to Welcome Screen]


Visual View:

  K0              K1              K2
┌─────────┐    ┌─────────┐    ┌─────────┐
│         │    │         │    │         │
│ [Submit]│    │  (...)  │    │   ✓     │
│         │    │         │    │         │
└─────────┘    └─────────┘    └─────────┘
  Default       Loading        Success

  ↑             ↑              ↑
  User sees   User clicks   Server
  button      button        responds
```

The spaces between keyframes are animations or transitions.

---

## Example: Password Field

```
K0: Default State        K1: User Types          K2: Password Strong     K3: Show Password
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Password         │    │ Password         │    │ Password         │    │ Password         │
│ ┌──────────────┐ │    │ ┌──────────────┐ │    │ ┌──────────────┐ │    │ ┌──────────────┐ │
│ │              │👁│    │ │ •••••        │👁│    │ │ ••••••••     │👁│    │ │ MyP@ssw0rd!  │👁│
│ └──────────────┘ │    │ └──────────────┘ │    │ └──────────────┘ │    │ └──────────────┘ │
│                  │    │ [▌    ] Weak     │    │ [████▌] Strong   │    │ [████▌] Strong   │
│                  │    │                  │    │        ✓         │    │        ✓         │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
   Empty input            Typing starts          Strong password         Click eye to reveal
```

**The Transformation:**

```
Keyframe 0: Default State
- Input empty
- Eye icon visible (closed)
- No validation message

Keyframe 1: User Types
- Characters masked as dots
- Strength indicator appears
- Shows "Weak" in red

Keyframe 2: Password Strong
- Strength indicator fills
- Shows "Strong" in green
- Checkmark appears

Keyframe 3: Show Password (on eye click)
- Characters become visible
- Eye icon opens
```

Each keyframe is a distinct state. The storyboard shows how they connect.

---

## Why Each Change Happens

Don't just show what changes. Explain **why**.

| Transition | What Changes | Why |
|------------|--------------|-----|
| 0 → 1 | Strength indicator appears | User needs feedback while typing |
| 1 → 2 | Color shifts red → green | Reinforce password quality visually |
| 2 → 3 | Characters visible | User wants to verify what they typed |

The "why" connects to user experience. Every change serves a purpose.

---

## What to Storyboard

Focus on **complex, meaningful transformations**:

| Interaction Type | What to Document |
|------------------|-----------------|
| **Async Actions** | Submit → Loading (spinner) → Success/Error states |
| **Multi-step Forms** | Step progression, validation feedback, dynamic fields |
| **Modals/Dialogs** | Open animation, content loading, close behavior |
| **Expand/Collapse** | Accordion opens, content reveals, height animations |
| **Complex Dropdowns** | Multi-level menus, search filtering, dynamic options |
| **Data Loading** | Skeleton → Content, empty states, error states |
| **Notifications** | Entrance animation, auto-dismiss timing, user dismiss |
| **Progressive Disclosure** | Show more, inline editing, conditional fields |

**Don't storyboard:** Hover states, focus rings, standard link colors, or other behaviors developers already know.

---

## Timing Matters

Some transitions need timing specifications:

```
Loading spinner: Appears after 300ms delay
(Don't show spinner for quick operations)

Success message: Visible for 3 seconds
(Then auto-dismiss)

Modal open: 200ms ease-out animation
(Feels snappy but not jarring)
```

Timing affects user perception. Specify when it matters.

---

## Error States

Don't forget what happens when things go wrong:

```
Happy Path vs Error Path:

HAPPY PATH:                    ERROR PATHS:
K0 ──► K1 ──► K2              K0 ──► K1 ──► E1 (Validation)
                              │      │      │
┌──────┐  ┌──────┐  ┌──────┐ │      │      └─► ┌──────────┐
│Submit│  │ ...  │  │  ✓   │ │      │          │ Email!   │
└──────┘  └──────┘  └──────┘ │      │          │ ┌──────┐ │
Default   Loading  Success   │      │          │ │error │ │
                              │      │          │ └──────┘ │
                              │      │          └──────────┘
                              │      │          Field error
                              │      │
                              │      └─► E2 (Network)
                              │          ┌──────────┐
                              │          │ Network  │
                              │          │ error!   │
                              │          │ [Retry]  │
                              │          └──────────┘
                              │          System error
```

**Error State Details:**

```
Keyframe E1: Validation Error
- Field border turns red
- Error message appears below
- Focus moves to first error field

Keyframe E2: Network Error
- Form grays out slightly
- Error banner appears at top
- Retry button becomes available
```

Error states are as important as success states.

---

## The Storyboarding Principle

**When to create a storyboard:**

Ask: "Would a developer know exactly what to build without this?"

- **YES** → Don't storyboard (it's standard behavior)
- **NO** → Storyboard it (it needs documentation)

```
SKIP STORYBOARDING:              DO STORYBOARD:

Simple hover state               Async form submission
┌────────┐  ┌────────┐          ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
│ Submit │  │ Submit │          │ Submit │  │  ...   │  │   ✓    │  │ Error! │
└────────┘  └────────┘          └────────┘  └────────┘  └────────┘  └────────┘
  Default     Hover                K0          K1          K2          K3
  ❌ Too simple                    ✅ Complex flow needs documentation


Link color change                Modal dialog animation
─────────────                    ┌──────────────────────────────────┐
  Click me                       │                                  │
─────────────                    │  ┌──────────────────────────┐   │
  ❌ Standard                     │  │                          │   │
                                 │  │    Modal Content         │   │
                                 │  │                          │   │
                                 │  └──────────────────────────┘   │
                                 │                                  │
                                 └──────────────────────────────────┘
                                 K0 → K1 (fade in, 200ms ease-out)
                                 ✅ Custom timing & effect
```

**Examples:**

| Behavior | Storyboard? | Why |
|----------|-------------|-----|
| Button hover effect | ❌ No | Standard design system behavior |
| Form submission with loading state | ✅ Yes | Complex async flow with multiple states |
| Link color change on click | ❌ No | Standard browser behavior |
| Modal opening animation | ✅ Yes | Custom timing and entrance effect |
| Input focus ring | ❌ No | Standard accessibility pattern |
| Multi-step wizard progress | ✅ Yes | Complex flow with validation between steps |

**The rule:** Storyboard custom, complex, or non-obvious behaviors. Skip standard UI patterns.

---

## What's Next

In the next lesson, you'll learn specific techniques for documenting storyboards effectively — the format, tools, and level of detail that makes specifications actionable for developers.

---

**[Continue to Lesson 2: Storyboard Format →](lesson-02-storyboard-format.md)**

---

[← Back to Module Overview](module-10-storyboarding-overview.md)

*Part of Module 10: Storyboarding*
