# Module 14: Agentic Development

## Lesson 1: The Development Design Log

**How the process is organized**

---

## Every Session Starts with a Plan

When you ask Freya to develop something, the first thing the agent does is create a **Design Log**.

This isn't documentation after the fact. It's the plan *before* anything is built.

The agent reads your input — a specification, a concept, an inspiration image, a rough idea — and creates:

1. **Scope** — What are we building? What's the boundary?
2. **Tasks** — Ordered steps to get there
3. **Requirements** — Constraints we must respect (brand, accessibility, technical)
4. **Test protocol** — How we'll verify each step is done right

Then the agent starts executing. One step at a time.

---

## The Design Log Document

```markdown
# Design Log: Signup Form

## Meta
- Date: 2026-02-10
- Input: P02-signup-form.md (specification)
- Agent: Freya
- Status: In Progress

## Scope
Build the signup form as a working prototype from the specification.
Includes: form layout, validation, error states, loading states.
Excludes: backend integration, email verification flow.

## Tasks
1. [x] Create form layout with all fields
2. [x] Add real-time validation
3. [ ] Implement error states
4. [ ] Add loading and success states
5. [ ] Responsive adjustments
6. [ ] Accessibility pass

## Requirements
- Must match specification P02 exactly
- Inter font, #0066FF primary
- Mobile-first, max-width 400px
- WCAG AA contrast compliance

## Test Protocol
- [ ] All text matches spec
- [ ] All states render correctly
- [ ] Tab navigation works
- [ ] Touch targets 44px+
- [ ] Contrast ratios pass

## Log
### Step 1: Form layout (completed)
- Created form with email, password, submit
- Matches spec layout
- Decision: Used flexbox for vertical stacking

### Step 2: Validation (completed)
- Added blur-based validation
- Decision: Blur instead of keypress (less jarring)
- Spec impact: Updated storyboard to clarify trigger

### Step 3: Error states (in progress)
- ...
```

---

## Why Start with the Dialog?

### It forces clarity

Before building, you know exactly what you're building and how you'll know it's done.

### It enables restart

AI conversations are ephemeral. The dialog is permanent. If you lose context, start a new session, or come back next week — load the dialog. Everything is there.

### It tracks decisions

"Why did we use blur validation?" The answer is in the log, not in someone's memory.

### It shows progress

At any point you can see: what's done, what's next, what changed.

---

## The Log Is the Heartbeat

As you execute each step, the agent logs:

- **What was built** — the output
- **Decisions made** — and the reasoning
- **Spec impacts** — did anything in the spec change?
- **Issues found** — unexpected problems

This log is what makes the dialog a living document, not a static plan.

---

## Plans Change

After completing a step, you and the agent re-evaluate:

- Did this step reveal something new?
- Should priorities change?
- Do we need to add tasks?
- Should we remove tasks that are no longer relevant?
- Did the scope shift?

**Example:** You planned to build the password strength indicator. But after implementing the form, you realize the field is too small to show it on mobile. New task: rethink the indicator placement. Old task: build indicator as-is → removed.

The plan is not a contract. It's a compass.

---

## Types of Agentic Sessions

The same Design Log structure works for all types:

| Type | Example | Agent |
|------|---------|-------|
| **Concept exploration** | "Dream up a dashboard layout for dog trainers" | Freya |
| **Proof of concept** | "Can we do infinite scroll with this data model?" | Freya |
| **Prototype** | "Build a working signup form from this spec" | Freya |
| **Design inspiration** | "Generate 3 visual directions for the landing page" | Freya |
| **Production code** | "Implement the complete registration scenario" | Freya |

The scope and depth change. The process doesn't.

---

## Session Continuity

### Starting a new session

Load the Design Log into your new conversation:

```
"I'm continuing the signup form implementation.
Here's the current Design Log with plan and log:

[Paste dialog.md content]

We completed steps 1-3. Next is step 4: loading states."
```

The agent picks up from the log, not from memory.

### Handing off between agents

You dreamed up a component in a design session. Now you need to build it.

The Design Log travels with the work. The agent reads the previous design log and continues where it left off.

---

## What's Next

In the next lesson, you'll learn how to evaluate results effectively and give feedback that keeps the work on track.

---

**[Continue to Lesson 2: Evaluation and Feedback →](lesson-02-documenting-decisions.md)**

---

[← Back to Module Overview](module-14-agentic-development-overview.md)

*Part of Module 14: Agentic Development*
