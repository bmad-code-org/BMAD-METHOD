# Module 08: Outline Scenarios

## Lesson 1: Scenarios, Not Pages

**Why linear journeys matter more than isolated screens**

---

## The Page Trap

Here's how most design projects start:

> "We need a login page."
> "Let's design the dashboard."
> "What should the settings screen look like?"

Pages. Screens. Static views.

And here's what happens: You design a beautiful login page. Perfect layout. Clear hierarchy. Polished UI.

But you've answered the wrong question.

---

## The Right Question

A button doesn't exist in isolation. A form doesn't float in space.

**Every element exists in a journey.**

Where did the user come from?
What are they trying to accomplish?
What happens after they succeed?
What if something goes wrong?

**Scenarios answer these questions. Pages don't.**

---

## What Is a Scenario?

A scenario is a **linear journey across logical views**.

Not a page. Not a screen. A *journey*.

```
┌─────────────┐    Click CTA    ┌─────────────┐    Submit    ┌─────────────┐
│   Landing   │ ──────────────► │   Signup    │ ───────────► │   Welcome   │
│    Page     │                 │    Form     │              │   Screen    │
└─────────────┘                 └─────────────┘              └─────────────┘
     START                                                        END
```

Each box is a **logical view**. Each arrow is a **navigation event**.

The scenario is the whole path — start to finish.

---

## Why Linear?

WDS forces linear scenarios. No branching. No decision trees.

This seems limiting. It's actually liberating.

**Both approaches handle the same artifacts. The critical difference: separation vs integration of flow and design.**

---

### Traditional Flowchart Approach: Flow Divorced from Experience

**Two separate artifacts that must be mentally reconciled:**

```
ABSTRACT FLOWCHART                              FIGMA PAGES (separate file)
(no visual design)                              (no flow context)

                                                ┌──────────────────┐
                    ┌─► Password Reset ──┐      │  LOGIN PAGE      │
                    │                    │      │  [Designed       │
                    │  ┌─► Error Screen ─┤      │   in isolation]  │
                    │  │                 │      │                  │
Landing ─► Login ──┼──┼─► Signup Form ──┼──    │  • Email field   │
                    │  │                 │      │  • Password      │
                    │  └─► Login Form ───┤      │  • Submit btn    │
                    │                    │      └──────────────────┘
                    └─► Forgot Password ─┘      ┌──────────────────┐
                                                │  SIGNUP PAGE     │
No visual design,                               │  [Somewhere else │
just abstract boxes                             │   in file]       │
and arrows                                      │                  │
                                                │  • Name field    │
                                                │  • Email field   │
                                                │  • Password      │
                                                └──────────────────┘
                                                ┌──────────────────┐
                                                │  ERROR PAGE      │
                                                │  [Loosely        │
                                                │   hanging]       │
                                                │                  │
                                                │  • Error msg     │
                                                │  • Retry btn     │
                                                └──────────────────┘
                                                ┌──────────────────┐
                                                │  PASSWORD RESET  │
                                                │  [Another screen │
                                                │   in stack]      │
                                                └──────────────────┘
                                                ┌──────────────────┐
                                                │  WELCOME PAGE    │
                                                │  [Disconnected]  │
                                                └──────────────────┘
```

**The fundamental problem — mystical complexity:**

This creates **two artifacts that don't clearly map to each other:**

- **Flowchart is abstract** (boxes and arrows, no actual design)
- **Pages exist separately** as a disconnected stack in Figma
- **No visual connection** between flowchart and screens
- **Flow and design are divorced** - two separate artifacts to keep in sync
- When reviewing flowchart: Can't see what screens actually look like
- When reviewing pages: Can't see how they connect or which paths lead where
- Requires mental gymnastics: "This Login box in the flowchart corresponds to... which Figma frame?"

**As complexity grows:**
- Every branch multiplies disconnection
- Documentation sprawls across two systems
- Testing becomes a nightmare (which path corresponds to which design?)
- Changes require updating both artifacts independently
- Easy for flow and design to drift out of sync

---

### WDS Approach: The Pages ARE the Flowchart

**In WDS, there is no separate flowchart. The scenario IS the visual flow.**

#### 1. Linear Scenario = Screen Sketches Arranged in Flow

```
SCENARIO S01-USER-SIGNUP (Sunshine Path with Storyboards)

┌────────────────────┐       ┌────────────────────┐       ┌────────────────────┐
│                    │  CTA  │                    │Submit │                    │
│  [SKETCH 1]        │──────>│  [SKETCH 2]        │──────>│  [SKETCH 3]        │
│  Landing Page      │ Click │  Signup Form       │       │  Welcome Screen    │
│                    │       │                    │       │                    │
│  • Hero image      │       │  • Email field     │       │  • Success message │
│  • Value prop      │       │  • Password field  │       │  • Next steps      │
│  • "Sign Up" CTA   │       │  • Name field      │       │  • Dashboard link  │
│                    │       │  • Submit button   │       │                    │
└────────────────────┘       └────────────────────┘       └────────────────────┘
         │                            │                            │
         │ Storyboard:                │ Storyboard:                │ Storyboard:
         ▼                            ▼                            ▼
  ○ Default state              ○ Empty (default)            ○ With confetti
  ○ Hover on CTA               ○ Typing (validation)        ○ Without animation
  ○ Mobile view                ○ Invalid (errors shown)
                               ○ Valid (ready to submit)
                               ○ Submitting (loading)
                               ○ Network error (retry)
```

**The scenario IS visual with integrated storyboards:**
- Top boxes = actual sketches of screens in sunshine path flow
- Arrows = user navigation between screens
- Underneath each sketch = storyboard states for that screen
- **The flow, design, and state variations are one integrated artifact**

**What this captures:**
- ✓ Main navigation flow (view to view, horizontal arrows)
- ✓ Visual representation of each screen (actual sketches)
- ✓ State transformations within each screen (bullets underneath)
- ✓ The sunshine path (when everything works)
- ✓ User journey from start to desired state

**What it deliberately excludes:**
- ✗ Edge cases and business rules (that's specifications)
- ✗ Alternative navigation paths (that's separate scenarios)

**Note on storyboards:** This diagram shows storyboards integrated into scenarios as a preview of the complete artifact. You'll learn to create detailed storyboards in **Module 10: Storyboarding**. For now in Module 08, you're focusing on scenario outlines (the linear flow between screens) without detailed storyboard documentation.

---

#### 3. Specifications = Business Rules & Edge Cases (Text Document)

```
Edge Cases:
- Email already exists → Show error in storyboard state 6, offer login link
- Network failure → Show retry in storyboard state 6 with exponential backoff
- Password too weak → Show requirements in storyboard state 3
- User already logged in → Redirect to dashboard (before scenario starts)
- Invalid email format → Real-time validation in storyboard state 3

Alternative Paths:
- Login instead of signup → See Scenario S02-User-Login
- Password reset → See Scenario S03-Password-Recovery
- Social signup → See Scenario S04-Social-Auth

Business Rules:
- Minimum password length: 8 characters
- Required fields: email, password, name
- Auto-login after successful signup
```

**What this captures:**
- ✓ Error states and recovery flows (references storyboard states)
- ✓ Alternative paths and branches (links to other scenarios)
- ✓ Business rules and validation logic
- ✓ Complete documentation without cluttering visual flow

---

### The Critical Difference

| Traditional Approach | WDS Approach |
|---------------------|--------------|
| **Flowchart** = Abstract boxes and arrows | **Scenario** = Actual screen sketches in flow |
| **Pages** = Separate, disconnected Figma files | **Pages** = Integrated into scenario flow |
| Two artifacts to maintain | One integrated visual artifact |
| Flow divorced from design | **The pages ARE the flowchart** |
| Can't see experience in flowchart | Can see and experience the journey |
| Can't see flow in Figma pages | Flow is explicit in scenario layout |
| Designer reviews boxes, PM reviews pages (separately) | Everyone reviews the same visual journey |

**The WDS insight:**

> **In WDS, the pages ARE the flowchart.**

There is no abstract diagram. The scenario is a visual arrangement of actual screen sketches showing the journey.

**What this means in practice:**

When you create a scenario in WDS:
1. You sketch the screens (rough, conceptual)
2. You arrange them in linear flow (sunshine path)
3. **That arrangement IS your flowchart**
4. Flow and design are integrated from the start

When stakeholders review:
- They see the actual journey visually
- They understand the flow by looking at real screens
- No translation needed between abstract boxes and actual design
- Everyone sees the same integrated artifact

**Traditional split:**
```
Product Manager reviews: [Abstract flowchart]
Designer reviews: [Disconnected Figma pages]
Developer receives: Both (and has to reconcile them)
```

**WDS integration:**
```
Everyone reviews: [Scenario = sketched screens in flow]
Everyone sees: The actual visual journey
No reconciliation needed: Flow and design are one
```

- **Scenario (top)** = Screen sketches arranged in sunshine path flow
- **Storyboards (beneath)** = State variation sketches for each screen
- **Specifications (separate doc)** = Business rules and edge cases in text

**Why linear scenarios work:**

- Focus attention on what matters (sunshine path first)
- Force clear priority decisions (one main flow)
- Make testing straightforward (follow the linear path)
- Keep documentation manageable (complexity in storyboards, not flow)

---

## The Sunshine Scenario

A scenario is the **shortest path** from current state to desired state — for both user and business.

| Who | Current State | Desired State |
|-----|---------------|---------------|
| **User** | Wants to sign up | Has an account, feels welcomed |
| **Business** | Visitor on site | Registered user in funnel |

Both must be satisfied. That's what makes software sustainable.

**Not just user value.** Not just business value. Both, together.

---

## What About Edge Cases?

They exist. They matter. But they're not the scenario.

**The WDS approach:**
- **Scenario** captures the main flow (sunshine path)
- **Specifications** document edge cases and error states
- **Storyboarding** shows how alternatives transform within views

**Scenario (main flow):**
```
User creates account successfully → Welcome screen
```

**Edge cases (documented in specifications):**
- Email already exists → Show error message
- Network failure → Show retry option
- Invalid email format → Show validation error

**Transformations (shown in storyboarding):**
- Submit button: default → loading → success/error states
- Form validation: empty → invalid → valid
- Error messages: appear/disappear based on state

The scenario is the sunshine path. Specifications and storyboarding handle the alternatives — but separately, so the scenario stays clean and focused.

---

## Selective Ignorance

**During the design phase, you cannot focus on everything at once.**

If you try to figure out all the things that could go wrong on every step and how to handle them, you would make no progress in designing the experience.

### The Squeaky Wheel Problem

**The problem:** The squeaky wheel gets the grease.

When you're focused on fixing the very annoying edge cases, you lose track of the whole picture. Edge cases scream for attention because they're frustrating when they happen. But that emotional urgency doesn't mean they're strategically important.

**If you chase every squeaky wheel, you end up with:**
- 100 buttons trying to handle every edge case
- Cluttered interfaces designed around exceptions
- Lost sight of the core experience
- Perfect handling of rare cases, broken handling of common ones

WDS applies **selective ignorance** strategically: Focus on what gives the best experience and value to the business for the vast majority of the most valuable customers in the most valuable transactions.

### The Strategic Progression

**1. Main Flow First**
- Design the most effortless journey when all is great and nothing goes wrong
- Focus on the sunshine path where everything works perfectly
- Get this right before anything else

**2. Pressure Test with Obvious Variations**
- When you're happy with the main flow, test it with obvious variations
- Does it still stand? Does the structure hold?
- If yes, proceed. If no, refine the main flow.

**3. Introduce Edge Cases**
- Now bring in edge cases and error states
- Design for graceful failure
- The system should fail elegantly, not catastrophically

**4. The Ultimate Goal**
> "The user should be able to use it wrong and it should be right anyway."

### The Tradeoff

| | What Happens |
|---|---|
| **Upside** | More space and attention for what matters. Clean, focused designs. Progress on the core experience. |
| **Downside** | You may redraw as secondary cases pile up. |

Worth it. The alternative is unbearable.

**If you start with intricate navigation schemes and try to handle every edge case upfront, you end up with 100 buttons on the screen and make no progress on the core experience. Nobody wins.**

Selective ignorance is not laziness — it's strategic focus.

### Ask "What If" Questions

**Selective ignorance also means asking whether steps should exist at all.**

As a Linchpin designer, you ask the "what if" questions:

> "We need to log in."

**What if** we didn't require login upfront?

- What if users arrived from email with magic links?
- What if users could browse freely?
- What if login was only required for sensitive data or changes?

**Be the kid pointing out the emperor has no clothes.**

Ask "what if" over and over until the scenario shrinks:
- 8 steps → What if we combined these?
- 4 steps → What if we skipped this entirely?
- 2 steps → Now we have the essential journey

**Every step in a scenario should justify its existence.**

If you can't defend why a step is necessary, remove it. The best scenarios aren't the most complete — they're the most essential.

---

## Logical Views

A logical view is a distinct screen state in your application.

| Is a Logical View | Is NOT a Logical View |
|-------------------|----------------------|
| A page | A button state |
| A modal overlay | A loading spinner |
| A wizard step | A hover effect |
| A full-screen confirmation | A toast notification |

**When the user navigates** from one logical view to another — that's a scenario.

**When elements transform** within a single logical view — that's a storyboard (Module 10).

---

## Connecting to Triggers

Every scenario should trace back to your Trigger Map.

| Scenario Element | Trigger Map Connection |
|------------------|----------------------|
| Who is doing this? | Which persona |
| Why are they here? | Which driving force |
| What's the goal? | Which business goal |
| What feature enables it? | Which feature from the map |

If you can't connect a scenario to your Trigger Map, question whether it should exist.

---

## Dual Value Check

For every scenario, verify:

**User value:**
> "Does completing this satisfy the user's goal?"

If the user completes this journey, do they get what they wanted?

**Business value:**
> "Does completing this advance a business objective?"

If users complete this journey, does it help the business?

**If either is missing, the scenario isn't sustainable.**

A scenario that only serves users (no business value) won't get funded.
A scenario that only serves business (no user value) won't get used.

---

## Naming Scenarios

```
01-felixs-quick-registration
02-harriets-family-setup
03-kids-daily-overview
```

The number indicates priority order. The name includes the **persona** and their **purpose**.

**Good names:**
- 01-felixs-quick-registration
- 02-harriets-family-setup
- 03-kids-daily-overview

**Bad names:**
- login-page
- dashboard
- settings

Pages are not scenarios. Journeys are.

---

## How Many Scenarios?

Depends on your product:

| Product Type | Typical Scenarios |
|--------------|-------------------|
| Simple landing page | 2-3 |
| Web application | 8-15 |
| Complex platform | 20+ |

Start with the core user journeys. Add more as needed.

**Rule of thumb:** Each persona + primary goal = one scenario.

If you have 3 personas with 3 primary goals each, you might have 9 scenarios.

---

## The Scenario's Purpose

A scenario outline is NOT a detailed specification.

It's a **roadmap** that tells you:

1. Where the journey starts
2. What logical views the user passes through
3. Where the journey ends
4. Why it matters (user + business value)

The detailed work (how each view looks, what happens in each step) comes in later modules.

---

## What You'll Create

For each scenario, Freya's 8-question dialog produces:

```markdown
# 01: Felix's Quick Registration

## Transaction (Q1)
Create account and experience first success

## Business Goal (Q2)
BG01 - Increase trial signups by 40%

## User & Situation (Q3)
Felix (Primary) — Full-stack parent, evening, skeptical but motivated

## Driving Forces (Q4)
Hope: Find a simple app the family will use
Worry: Complex onboarding that wastes time

## Device & Starting Point (Q5 + Q6)
Mobile — Googles "family dog care app", clicks top result

## Best Outcome (Q7)
User: Account created, feels confident
Business: New user in activation funnel

## Shortest Path (Q8)
1. **Landing Page** — Sees value, clicks "Start Free"
2. **Signup Form** — Enters credentials
3. **Welcome Screen** — Greeted, ready to explore ✓
```

Simple. Clear. Connected to strategy through every question.

---

## What's Next

In the next lesson, you'll learn how to map logical views within scenarios and understand the relationship between scenarios and storyboards.

Then in the tutorial, you'll create scenario outlines for your own project with Freya's guidance.

---

**[Continue to Lesson 2: From Trigger Map to Scenarios →](lesson-02-from-trigger-map-to-scenarios.md)**

---

[← Back to Module Overview](module-08-outline-scenarios-overview.md)

*Part of Module 08: Outline Scenarios*
