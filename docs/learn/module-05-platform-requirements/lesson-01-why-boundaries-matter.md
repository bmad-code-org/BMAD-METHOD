# Module 05: Platform Requirements

## Lesson 1: Why Boundaries Matter

**Designing in reality, not fantasy**

---

## The Beautiful Disaster

Picture this: You've spent three weeks designing a stunning real-time collaboration feature. Users can see each other's cursors moving across the screen. Changes sync instantly. It's beautiful.

You present it to the development team.

Silence.

Then: "Our backend doesn't support WebSockets. That would take months to implement."

Three weeks of design work. Gone. Not because the design was bad, but because you designed in ignorance of what was possible.

---

## The Invisible Fence

Every project has boundaries. Technical boundaries. Budget boundaries. Timeline boundaries. Expertise boundaries.

**Most designers never see these fences until they crash into them.**

And by then, they've invested significant time designing solutions that can't be built. Or can only be built at enormous cost. Or will take so long that the project loses momentum.

**This isn't just frustrating — it's preventable.**

---

## What Boundaries Really Are

Boundaries aren't limitations on your creativity. They're the shape of reality that your design must fit into.

**Think of it like architecture:**

An architect doesn't complain about gravity. They design *with* it. They use it. They understand that buildings must stand up, water runs downhill, and structural loads must be distributed.

**As a designer, your gravity is:**

- The platforms you're targeting (web, mobile, desktop)
- The systems you must integrate with (authentication, payments, APIs)
- The constraints you must work within (budget, timeline, team skills)
- The complexity that exists in integrations
- The gaps in what the team knows

These aren't restrictions. They're the physics of your design universe.

---

## The Real Cost of Ignorance

Let's be blunt about what happens when designers don't understand platform requirements:

**Scenario 1: The Offline Fantasy**

Designer creates mobile app with offline-first experience. Beautiful sync conflict resolution. Elegant local storage patterns.

Reality: Client only has budget for a web app. No native development resources. The entire offline architecture? Irrelevant.

**Scenario 2: The Integration Assumption**

Designer assumes single sign-on with existing company tools. Designs seamless flow between systems.

Reality: Legacy system has no API. Integration would require custom middleware costing $50K. Feature gets cut.

**Scenario 3: The Performance Ignore**

Designer creates image-heavy, animation-rich experience.

Reality: Target users are in regions with slow internet. Page takes 30 seconds to load. Bounce rate is 90%.

**Each of these represents weeks or months of wasted work.**

---

## This Isn't About Being a Developer

Here's what many designers get wrong: they think understanding platform requirements means becoming technical. Learning to code. Understanding databases.

**No.**

You don't need to know *how* WebSockets work. You need to know *whether they're available*.

You don't need to understand OAuth implementation details. You need to know *which authentication the client already uses*.

You don't need to design the database schema. You need to know *what data already exists*.

**You're discovering boundaries, not building infrastructure.**

---

## The Strategic Advantage

When you understand platform requirements, something shifts:

**Your designs become immediately buildable.**

Developers don't push back. They don't say "that's not possible." They say "yes, we can do that."

**Your estimates become accurate.**

Because you're designing within real constraints, timeline predictions hold. Projects finish on time.

**Your stakeholders gain confidence.**

When every design is grounded in reality, stakeholders trust your judgment. They stop micromanaging technical feasibility.

**You become the designer who "gets it."**

The one who doesn't waste time. The one who delivers. The one who makes implementation smooth instead of painful.

---

## When to Discover Boundaries

This is Phase 1 work — before you design anything.

**Before sketches.** Before wireframes. Before mockups. Before prototypes.

If you wait until you're deep in design to discover boundaries, you'll have to throw work away. If you discover them upfront, every minute of design time is spent on solutions that can actually be built.

**The time investment is tiny:**

- 30 minutes with Saga
- A conversation with the development team
- A quick review of existing systems

**The payoff is massive:**

- Zero wasted design time
- Immediate developer buy-in
- Stakeholder confidence
- Faster project completion

---

## The Saga Approach

This is why Saga handles platform requirements, not Freya.

**Platform requirements are strategic, not creative.**

You're not designing — you're discovering. You're mapping the terrain before you start building.

Saga asks the strategic questions:

- "What platforms are we targeting?"
- "What systems need to integrate?"
- "What constraints should I know about?"
- "What feels risky or unknown?"

These questions surface boundaries before they become blockers.

---

## What You're Creating

At the end of this module, you'll have:

`A-Product-Brief/platform-requirements.md`

A simple document that captures:

1. **Platforms** — Where the product will live
2. **Integrations** — What systems connect
3. **Constraints** — What's impossible or expensive
4. **Complexity** — Where challenges exist
5. **Knowledge Gaps** — What we don't know yet

This document travels with your Product Brief because it's strategic context — the shape of reality that all design decisions must respect.

---

## The Handoff Advantage

Here's a powerful pattern:

Once you document platform requirements, you can **hand them off to development immediately**.

While you move into UX design, Freya can also handle development tasks in parallel:

- Research knowledge gaps
- Spike complex integrations
- Set up development environment
- Validate technical assumptions

**Design and platform prep happen in parallel.**

You're not waiting. You're not blocked. The project moves forward on multiple fronts simultaneously.

---

## The Emotional Shift

Without understanding boundaries:

- Constant anxiety about whether designs are buildable
- Fear of presenting to developers
- Frustration when ideas get rejected
- Feeling like you're working in the dark

With understanding boundaries:

- Confidence that every design is grounded
- Developer meetings become collaborative, not confrontational
- Ideas get refined, not rejected
- Clarity about what's possible and what's not

**This one shift transforms how it feels to work on projects.**

---

## What's Next

In the next lesson, you'll learn exactly how to document platform requirements. We'll walk through each section: platforms, integrations, constraints, complexity, and knowledge gaps.

Then you'll practice with a tutorial that guides you through creating your own platform-requirements.md.

---

**[Continue to Lesson 2: Defining Platform Requirements →](lesson-02-defining-platform-requirements.md)**

---

[← Back to Module Overview](module-05-platform-requirements-overview.md)

*Part of Module 05: Platform Requirements*
