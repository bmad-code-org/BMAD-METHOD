# Module 05: Platform Requirements

**Time: 30 min | Agent: Saga | Phase: Strategy**

---

## What You'll Learn

How to define the technical boundaries that inform your design decisions before you start designing.

---

## Why This Matters

Imagine designing a beautiful real-time collaboration feature... then learning the backend can't support WebSockets.

Or specifying an offline-first mobile experience... when the client only has budget for a web app.

**Knowing the tech stack is a necessity for UX work — not optional.**

You can't design well in ignorance. The platform shapes the experience.

---

## Not Architecture — Boundaries

You're not designing the database. You're not specifying API endpoints. That's development work.

You're understanding what's possible so your designs are grounded in reality.

---

## What You'll Discover

### 1. Platforms

Where will this product live?

- Web only?
- Mobile (iOS, Android, both)?
- Desktop application?
- All of the above?

Each platform has different capabilities and constraints.

### 2. Integrations

What systems must we connect to?

- Authentication (OAuth, SSO, custom)?
- Payment processing?
- Third-party APIs?
- Legacy systems?
- External databases?

### 3. Constraints

What's technically impossible or expensive?

- Hosting limitations?
- Budget constraints?
- Team expertise?
- Timeline restrictions?
- Regulatory requirements?

### 4. Complexity & Challenges

Investigate integrations from a strategic standpoint:

- How complex is this integration really?
- What's the challenge level?
- Is this well-understood or experimental?
- Are there unknowns that need research?

### 5. Knowledge Gaps

What do we **not** know yet?

- Unproven technology?
- Missing documentation?
- No team expertise?
- Needs a spike or proof-of-concept?

**Surface these gaps explicitly.** They become development tasks to investigate in parallel.

---

## The Saga Method

Saga helps you think through boundaries conversationally:

> "What platforms are we targeting?"
> "Are there any systems we need to integrate with?"
> "What technical constraints should I know about?"
> "Is there anything that feels risky or uncertain?"

She'll probe deeper where needed, ensuring nothing gets missed.

---

## Output

`A-Product-Brief/platform-requirements.md`

This document lives with your Product Brief because it's part of the strategic foundation — not a technical specification.

---

## Handoff to Development

Once platform requirements are documented, you can **hand them off to development** immediately.

While you continue with UX design, Freya can also handle development tasks:

- Research knowledge gaps
- Spike complex integrations
- Set up the development environment
- Validate technical assumptions

**Parallel work.** Design and platform prep happen simultaneously.

---

## What's NOT in This Document

- Database schemas
- API specifications
- Code architecture
- Technical implementation details

Those come later, in BMM's architecture phase.

---

## Connection to Design

Every boundary you discover shapes your design:

| Boundary | Design Impact |
|----------|---------------|
| Web only | No native mobile gestures |
| No real-time | Polling instead of live updates |
| Tight budget | Simpler interactions |
| Legacy integration | Work within existing patterns |

---

## Practice

Think about your current project:

1. What platforms are you designing for?
2. What integrations are required?
3. What constraints exist?
4. What feels risky?

Document these before you start designing.

---

## Lessons

### [Lesson 1: Why Boundaries Matter](lesson-01-why-boundaries-matter.md)
Designing in reality, not fantasy

### [Lesson 2: Defining Platform Requirements](lesson-02-defining-platform-requirements.md)
How to document the boundaries that shape your design

---

## Tutorial

### [Tutorial 05: Create Your Platform Requirements](tutorial-05.md)
Hands-on guide to documenting technical boundaries with Saga

---

## Next Module

**[Module 06: Trigger Mapping →](../module-06-trigger-mapping/module-06-overview.md)**

Now understand the user psychology that drives behavior.

---

*Part of the WDS Course: From Designer to Linchpin*
