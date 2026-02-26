# Module 08: Outline Scenarios

**Time: 30 min | Agent: Freya | Phase: Design | Focus: UX**

---

## Scenarios, Not Pages

You don't design "a login page."

You design "new user creates account and experiences first success."

**Scenarios are linear journeys across logical views.**

---

## The Sunshine Scenario

WDS forces linear motion. No branching. No decision trees.

A scenario is the **shortest path** from current state to desired state — for both business and user.

| Who | Current State | Desired State |
|-----|---------------|---------------|
| **User** | Wants to sign up | Has an account, feels welcomed |
| **Business** | Visitor on site | Registered user in funnel |

Both must be satisfied. That's what makes software sustainable.

---

## Selective Ignorance

By focusing on the primary scenario first, you get the important stuff done and usable.

Less important things? Deprioritized. Not ignored forever — just not now.

WDS applies **selective ignorance** to all the itsy-bitsy stuff "you have to have" in favor of what matters most.

Everything else? Treated as an edge case.

### The Tradeoff

| | What Happens |
|---|---|
| **Upside** | More space and attention for what matters. Clean, focused designs. |
| **Downside** | You may redraw as secondary cases pile up. |

Worth it. The alternative is unbearable.

When you start with intricate navigation schemes, you end up with 100 buttons on the screen. Nobody wins.

---

## What Is a Logical View?

A logical view is a distinct screen state in your application.

- A page is a logical view
- A modal overlay is a logical view
- A wizard step is a logical view

When the user **navigates** from one logical view to another — that's a scenario.

When elements **transform** within a single logical view — that's a storyboard (Module 10).

---

## Scenario vs. Storyboard

| Concept | What Changes | Example |
|---------|--------------|---------|
| **Scenario** | Logical views change | Signup → Email Verification → Welcome |
| **Storyboard** | Elements within a view change | Button loading → success animation |

This module focuses on **scenarios** — the journey between views.

**You'll learn storyboarding in Module 10.** For now, focus on mapping the linear flow between screens. The detailed state transformations within each screen come later.

---

## Why This Matters

Pages in isolation are meaningless. A button only makes sense in context.

- Where did the user come from?
- What are they trying to accomplish?
- What happens after they succeed?
- What if something goes wrong?

Scenarios answer these questions.

---

## What Makes a Good Scenario

### 1. Linear

One path. No branches. The shortest way from A to B.

Error handling and edge cases exist — but they're not the scenario. They're exceptions documented separately.

### 2. Dual Value

Serves both user and business.

| Check | Question |
|-------|----------|
| User value | Does completing this satisfy the user's goal? |
| Business value | Does completing this advance a business objective? |

If either is missing, the scenario isn't sustainable.

### 3. Connected to Persona

Who is doing this?

- Which persona from your Trigger Map?
- What driving forces brought them here?

### 4. Testable

Can you verify it works?

- Clear start and end states
- Observable outcomes
- Measurable success

---

## Mapping the Journey

A scenario traces the linear path through logical views:

```
┌─────────────┐    Click CTA    ┌─────────────┐    Submit    ┌─────────────┐
│   Landing   │ ──────────────► │   Signup    │ ───────────► │   Welcome   │
│    Page     │                 │    Form     │              │   Screen    │
└─────────────┘                 └─────────────┘              └─────────────┘
     START                                                        END
```

Each box is a **logical view**. Each arrow is a **navigation event**.

**No branches.** Error states and edge cases are documented separately — they don't clutter the sunshine path.

What happens *within* each box (loading states, animations, validation feedback) — that's storyboarding.

---

## Naming Convention

```
01-felixs-quick-registration
02-harriets-family-setup
03-kids-daily-overview
```

The number prefix keeps them ordered by priority. The name includes the **persona** and their **purpose**.

**Not:** `login-page`, `dashboard`, `settings`

---

## The 8-Question Dialog

Freya outlines scenarios through an 8-question dialog. Each question builds on the previous answer, creating a complete scenario outline from strategy to page flow.

**Two modes — same 8 questions:**
- **Conversation** (default): Freya asks, you answer. One question at a time.
- **Suggest**: Freya answers all 8 based on your Trigger Map, then you review and adjust.

The questions:

| # | Question | What it defines |
|---|----------|----------------|
| Q1 | What transaction do we need to get right? | The user purpose |
| Q2 | Which business goal does it serve? | Strategic connection |
| Q3 | Which user, in what situation? | Persona + context |
| Q4 | What do they hope and fear? | Driving forces |
| Q5 | What device? | Design approach |
| Q6 | How do they arrive? | Entry point |
| Q7 | Best outcome for both sides? | Success criteria |
| Q8 | Shortest path through the site? | Linear page flow |

---

## Scenario Outline Template

```markdown
# 01: Felix's Quick Registration

## Transaction (Q1)
Verify service availability before booking

## Business Goal (Q2)
BG01 - Increase trial signups by 40%

## User & Situation (Q3)
Felix (Primary) — Full-stack parent, evening after kids asleep, skeptical but motivated

## Driving Forces (Q4)
Hope: Find a simple app that the whole family will actually use
Worry: Wasting time on another tool nobody adopts

## Device & Starting Point (Q5 + Q6)
Mobile — Googles "family dog care app", clicks top result

## Best Outcome (Q7)
User: Account created, feels confident this will help
Business: New user in activation funnel, one step closer to subscription

## Shortest Path (Q8)
1. **Landing Page** — Sees value proposition, clicks "Start Free"
2. **Signup Form** — Enters email and password
3. **Welcome Screen** — Greeted, ready to explore ✓

## Trigger Map Connections
Persona: Felix (Primary)
Want: Try before committing
Fear: Complex onboarding that wastes time
Business Goal: BG01 - Increase trial signups
```

Error states and edge cases are documented in the page specifications, not the scenario outline.

---

## Output

```
C-UX-Scenarios/
└── 01-felixs-quick-registration/
    ├── 01-felixs-quick-registration.md
    ├── 1.1-landing-page/
    ├── 1.2-signup-form/
    └── 1.3-welcome-screen/
```

Each scenario gets its own folder. Pages use `NN.step-page-slug` naming and are created via the page outline dialog or when you jump to Phase 4 (UX Design).

---

## How Many Scenarios?

Depends on your product. Common patterns:

| Product Type | Typical Scenarios |
|--------------|-------------------|
| Simple landing page | 2-3 |
| Web application | 8-15 |
| Complex platform | 20+ |

Start with the core user journeys. Add more as needed.

---

## Practice

From your Trigger Map:

1. List your personas
2. For each persona, identify their primary goal
3. That goal becomes a scenario
4. Map the logical views they'll pass through
5. Name it clearly

---

## Lessons

### [Lesson 1: Scenarios, Not Pages](lesson-01-design-experiences-not-screens.md)
Why linear journeys matter more than isolated screens

### [Lesson 2: From Trigger Map to Scenarios](lesson-02-from-trigger-map-to-scenarios.md)
How to identify which scenarios to create from your Trigger Map

### [Lesson 3: Mapping the Journey](lesson-03-mapping-the-journey.md)
How to structure scenario outlines for clarity and action

---

## Tutorial

### [Tutorial 08: Create Your Scenario Outlines](tutorial-08.md)
Hands-on guide to defining user journeys with Freya

---

## Next Module

**[Module 09: Conceptual Sketching →](../module-09-conceptual-sketching/module-09-conceptual-sketching-overview.md)**

Time to sketch the default state of each logical view.

---

*Part of the WDS Course: From Designer to Linchpin*
