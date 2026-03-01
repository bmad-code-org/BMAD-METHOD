# Module 14: Agentic Development

**Time: 60 min | Agent: Freya | Phase: Design-Build**

---

## What Is Agentic Development?

Agentic development is every process where you use an AI agent to transform your ideas into coded form.

It can produce:

- **Concepts** — quick explorations to test an idea
- **Proof of concepts** — does this approach work at all?
- **Prototypes** — working versions to evaluate and refine
- **Production code** — final implementation for delivery

It works in both directions:

- **Inspiration → Specification** — Ask the agent to suggest or dream up a component, section, page, scenario, or complete app. Use the output as input for your specifications.
- **Specification → Code** — Feed the agent your specifications and generate working code that matches.

Whether you're exploring possibilities or building the final product, the process is the same.

---

## The 7-Activity Menu

Agentic development is **menu-driven**, not linear. When you enter Phase 5, you choose what you need:

```
[P] Prototyping           — Build throwaway prototypes to validate ideas
[D] Development           — Write production code from approved specs
[F] Bugfixing             — Systematically fix bugs in existing code
[E] Evolution             — Add features to existing products
[A] Analysis              — Investigate codebase, architecture, patterns
[R] Reverse Engineering   — Capture existing product as WDS specifications
[T] Acceptance Testing    — Verify implementation against specs
```

Each activity has its own workflow with dedicated steps. The core agentic loop (plan → execute → evaluate → update) applies to all of them — the context differs.

---

## The Design Log

Every agentic development session starts with a **Design Log** — a structured document that organizes the work.

Before writing a single line of code, the agent creates:

1. **Scope** — What are we building?
2. **Tasks** — What steps will get us there?
3. **Requirements** — What constraints must we respect?
4. **Test protocol** — How will we know it's right?

This is your plan. It evolves as you work.

---

## The Agentic Development Loop

```
┌──────────────┐
│ Create plan  │  ← Design Log: scope, tasks, requirements, tests
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Execute step │  ← Build one thing
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Evaluate   │  ← Does it match? What did we learn?
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Update plan  │  ← Reprioritize, add, remove, shuffle
└──────┬───────┘
       │
       └──────────► Next step
```

After each step, you re-evaluate the plan. Priorities shift. New tasks appear. Others become irrelevant. The plan is alive.

---

## The Agent Tests Its Own Work

The evaluate step isn't just you looking at the screen. The agent actively verifies its own output.

Using **Puppeteer MCP**, the agent opens a browser, navigates to the prototype, and checks the acceptance criteria — while you watch.

```
┌──────────────┐
│ Execute step │  ← Agent builds the feature
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Agent opens  │  ← Puppeteer navigates to the page
│   browser    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Agent checks │  ← Reads text, clicks buttons, checks states,
│  criteria    │     verifies styling, takes screenshots
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Agent reports│  ← "5 of 6 criteria pass. Error color mismatch."
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ You decide   │  ← Fix it? Update spec? Move on?
└──────────────┘
```

The agent narrates what it finds:

> "Opening signup form at localhost:3000/signup..."
> "Headline says 'Start in 2 minutes' — matches spec. ✓"
> "Clicking submit with empty fields..."
> "Error message: 'Please enter a valid email' — matches spec. ✓"
> "Error color is #EF4444 — spec says #DC2626. ✗ Mismatch."
> "Submit button touch target: 48px — meets 44px minimum. ✓"

**The agent handles the measurable criteria.** Does the text match? Is the touch target big enough? Does the error state trigger?

**You handle the qualitative judgment.** Does the flow feel natural? Is the visual hierarchy right? Would a real user understand this?

Together, nothing gets missed. Functional testing happens during development — not after.

---

## Everything Is Logged

Every step is logged. Every action is noted. Every decision is recorded.

This means you can **restart the conversation at any time**. New session? Load the dialog. The agent picks up where you left off.

```
docs/_progress/
├── 00-design-log.md        ← Plan, status, backlog
└── agent-experiences/
    └── 2026-02-10-signup-form.md  ← Session insights
```

---

## Who Does What?

Freya handles all agentic development activities:

| Agent | Activities | When to use |
|-------|-----------|-------------|
| **Freya** | All 7 activities: [P] Prototyping, [D] Development, [F] Bugfixing, [E] Evolution, [A] Analysis, [R] Reverse Engineering, [T] Acceptance Testing | Design exploration, implementation, bugfixing, evolution, analysis, reverse engineering, and acceptance testing. |

The process is the same across all activities. The scope and context differ.

---

## What You'll Learn

### Lesson 1: The Development Design Log

How the process is organized. Creating plans, logging steps, structuring sessions so you can restart at any time.

### Lesson 2: Evaluation and Feedback

After each step: evaluate, reprioritize, shuffle. How to give effective feedback to AI agents and keep the work on track.

### Lesson 3: When You Get Stuck

Sometimes the agent makes change after change and can't find the problem. When to troubleshoot, when to pivot, and when to ask a developer for help.

### Lesson 4: Choosing Your Code Format

Output formats, technology stacks, component libraries, and how to choose between static prototypes and executable code.

### Lesson 5: Git Discipline

Keeping your work safe with version control. When to branch, how to commit, working with your team, and letting the agent handle Git for you.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Jumping in without a plan | Start with Design Log every time |
| Not logging steps | Everything gets logged, no exceptions |
| Keeping a stale plan | Re-evaluate after every step |
| Fighting the AI for too long | Know when to ask for help |
| Building everything at once | One step at a time |

---

## Practice

Pick one specification and run the full loop:

1. Create a Design Log with scope, tasks, and test protocol
2. Execute one step
3. Evaluate the result
4. Update the plan
5. Repeat

---

## Lessons

### [Lesson 1: The Development Design Log](lesson-01-iterative-building.md)
How the process is organized

### [Lesson 2: Evaluation and Feedback](lesson-02-documenting-decisions.md)
Staying in control as the agent builds

### [Lesson 3: When You Get Stuck](lesson-03-when-you-get-stuck.md)
Because AI doesn't always get it right

### [Lesson 4: Choosing Your Code Format](lesson-04-working-with-code.md)
Understanding what the agent produces and which technology fits your needs

### [Lesson 5: Git Discipline](lesson-05-git-discipline.md)
Keeping your work safe, organized, and shareable

---

## Tutorial

### [Tutorial 14: Your First Agentic Session](tutorial-14.md)
Hands-on guide to running a complete agentic development loop

---

## Next Module

**[Module 15: Visual Design →](../module-15-visual-design/module-15-visual-design-overview.md)**

Add soul and visual polish to your prototypes.

---

*Part of the WDS Course: From Designer to Linchpin*
