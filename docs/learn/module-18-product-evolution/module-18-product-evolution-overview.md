# Module 18: Product Evolution

**Time: 30 min | Agent: Freya | Phase: Continuous**

---

## Greenfield and Brownfield

In software development, there are two starting points:

**Greenfield** — Building something from scratch. No existing code, no existing users, no constraints from previous decisions. You start with a blank page. This is what the course has been about so far.

**Brownfield** — Working with something that already exists. There's a live product, real users, existing code, accumulated design decisions, and technical debt. You're not starting from zero — you're improving what's there.

Most of your career will be brownfield. Products don't end at launch. They evolve.

---

## This Is Where You Start

If you already have a product in production and want to improve it, this module is your entry point.

You don't need to rebuild everything from scratch using WDS. You can adopt the methodology incrementally, one change at a time.

Every improvement — a new feature, a redesign, a fix — becomes an opportunity to apply creative discipline. Over time, the product accumulates specifications, traceability, and design system components. The brownfield becomes greener with every iteration.

---

## WDS in Miniature

Here is the key insight: **product evolution follows the exact same WDS process, just compressed.**

Every change you make to a living product walks through the same steps you learned in this course — but smaller, faster, and focused on a single improvement.

Here is the full WDS process and how each module maps to an evolution cycle:

### Strategy (Where does this change come from?)

**Product Brief (Module 4)** — You don't write a new brief for every change. But the original brief still anchors your decisions. When someone requests a feature, check: does it align with the product's purpose? If there is no brief, write one now. It's never too late.

**Trigger Map (Module 6)** — Every change should trace to a persona, a driving force, or a business goal. If it doesn't connect, question whether it should happen. The trigger map is your filter against feature creep.

### Design (What does the change look like?)

**Scenarios (Module 8)** — For larger changes, outline the scenario. What's the user journey? Where does the user start, what do they do, where do they end up?

**Sketching & Storyboarding (Modules 9-10)** — For complex features, sketch the concept before specifying. For smaller changes, you can skip straight to specification.

**Specifications (Module 11)** — Update the existing specification, or create a new one. Every element, every state, every interaction — documented. This is the source of truth.

**Components (Module 12-13)** — Does this change require new components? Can existing ones be reused? The design system grows with the product.

### Build (How do we implement it?)

**Agentic Development (Module 14)** — Start a Design Log. The agent builds the change from the specification while verifying with Puppeteer.

**Visual Design (Module 15)** — Does the change need visual polish? Apply the same design layer process — code first, Figma when needed.

**Design Delivery (Module 16)** — Package the change as a DD. Same format, same handoff process, smaller scope.

### Validate (Does it work?)

**Usability Testing (Module 17)** — Is the change worth testing with users? Apply the Whiteport Rule: if it's not worth showing to 5 users and 1 domain expert, it shouldn't be built. If it is worth building, test it.

---

## The Product Evolution Design Log

The Design Log is the container for every change. In greenfield, it organizes a build session. In brownfield, it organizes an evolution cycle.

The structure is identical:

```markdown
# Design Log: [Change Name]

## Meta
- Date: 2026-03-15
- Type: Evolution (feature | modification | fix | optimization)
- Input: User feedback / analytics / business request
- Agent: Freya
- Branch: fix/password-requirements
- Status: In Progress

## Context
What exists today and why it needs to change.
Trigger Map connection: which persona, driving force, business goal.

## Scope
What we're changing. What we're not touching.

## Tasks
1. [ ] Review current specification
2. [ ] Update specification with change
3. [ ] Implement change
4. [ ] Agent verifies against updated spec
5. [ ] Test with users (if applicable)
6. [ ] Create DD for the change
7. [ ] Update design system (if applicable)

## Requirements
- Must not break existing functionality
- Must maintain design system consistency
- Must connect to trigger map

## Test Protocol
- [ ] Changed functionality works as specified
- [ ] Unchanged functionality still works
- [ ] All states handled
- [ ] Accessible
```

Same structure. Same discipline. The steps are the same — the scope is smaller.

---

## The 6-Activity Kaizen Cycle

Phase 8 is **menu-driven** — each improvement cycle picks the activity it needs:

```
[A] Analyze Product      — Understand what exists, identify targets
[S] Scope Improvement    — Define the change, write the scenario
[D] Design Solution      — Design the change (borrows from Phase 4)
[I] Implement            — Build the change (borrows from Phase 5)
[T] Acceptance Test      — Verify against specs (borrows from Phase 5)
[P] Deploy               — Package and deliver (borrows from Phase 4)
```

This is a **Kaizen cycle** — continuous, incremental improvement. After deploying one change, you return to [A] Analyze for the next opportunity.

---

## Types of Evolution

### Feature Additions → [A] → [S] → [D] → [I] → [T] → [P]

A new capability that didn't exist before. This is the closest to greenfield within brownfield — you're adding something new to an existing product.

**Full cycle through all 6 activities.**

### Feature Modifications → [A] → [S] → [D] → [I] → [T] → [P]

An existing capability needs to change. User feedback, business pivot, or better idea.

**Same cycle, but [A] Analyze focuses on the existing implementation and [S] Scope defines what changes vs what stays.**

### Bug Fixes → [A] → [I] → [T] → [P]

Something doesn't work as specified.

**Shortened cycle — skip [S] Scope and [D] Design if the spec is correct. Go straight to implementation.**

### Optimizations → [A] → [S] → [I] → [T] → [P]

Same functionality, better experience. Faster, smoother, more accessible.

**Skip [D] Design unless the optimization changes the visual. Focus on implementation and verification.**

---

## The Design System Grows

Every evolution cycle is an opportunity to strengthen the design system.

New component? Add it to the system. New pattern? Document it. Better approach to an existing component? Update the definition.

Over time, the product accumulates:

- Complete specifications for every page and flow
- A growing component library
- Documented decisions and rationale
- Version history showing how the product evolved
- Test results showing what works and what was changed

The brownfield becomes as well-documented as a greenfield project — one change at a time.

---

## What You'll Learn

### Lesson 1: The Evolution Cycle

How to run a complete evolution cycle using the Product Evolution Design Log — from receiving feedback through implementation and delivery. The same WDS steps, compressed for a single change.

### Lesson 2: Update the Spec — Project the Code

The discipline of changing the specification before touching code. How to read the current spec, make the change, version it, and project it into the codebase through the agent. Preventing spec drift in brownfield development.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Skipping specification updates | Always update specs — even for small changes |
| No trigger map connection | Every change serves a persona or business goal |
| Fixing without understanding | Investigate root cause before changing code |
| Letting specs drift from reality | Spec and implementation stay synchronized |
| Not testing changes | Apply the Whiteport Rule |
| Treating evolution as less rigorous | Same discipline, smaller scope |

---

## Lessons

### [Lesson 1: The Evolution Cycle](lesson-01-continuous-improvement.md)
Running WDS in miniature for every change

### [Lesson 2: Update the Spec — Project the Code](lesson-02-update-spec-project-code.md)
The specification changes first. The code follows.

---

## Tutorial

### [Tutorial 18: Evolve Your Product](tutorial-18.md)
Hands-on guide to running a complete evolution cycle

---

## Course Complete

You've learned the full WDS methodology:

1. **Strategy** — Product Brief, Trigger Map, Platform Requirements
2. **Design** — Scenarios, Sketches, Storyboards, Specifications, Components, Design System
3. **Build** — Agentic Development, Visual Design, Design Delivery
4. **Validate** — Usability Testing
5. **Evolve** — Product Evolution (this module)

Whether you're starting from a blank page or improving a live product, the process is the same. The scope changes. The discipline doesn't.

---

## What's Next?

- **Apply to a real project** — The only way to truly learn is to do
- **Join the community** — [Discord](https://discord.gg/whiteport)
- **Contribute** — WDS is open source
- **Teach others** — Spread creative discipline

**You are the linchpin.**

---

*Part of the WDS Course: From Designer to Linchpin*

**[← Back to Course Overview](../00-course-overview/00-course-overview.md)**

---

*Created by Mårten Angner and the Whiteport team*
*Part of the BMad Method ecosystem*
