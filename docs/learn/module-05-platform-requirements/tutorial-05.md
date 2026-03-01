# Tutorial 05: Create Your Platform Requirements

**Hands-on guide to documenting technical boundaries with Saga**

---

## Overview

This tutorial walks you through creating a platform requirements document that captures the technical reality your design must work within.

**Time:** 15-20 minutes
**Prerequisites:** Module 04 (Product Brief) completed
**Agent:** Saga
**What you'll create:** `A-Product-Brief/platform-requirements.md`

---

## Before You Start

**You'll need:**

- Your completed Product Brief
- Basic understanding of the project's technical context
- Access to technical stakeholders (helpful but not required)

**Saga will help you:**

- Ask the right questions
- Identify gaps you might miss
- Document clearly and consistently
- Prepare handoff to development

---

## Step 1: Start the Conversation with Saga (2 min)

### Open your AI IDE and start a conversation:

**You say:**
> "I need to create platform requirements for my project. I've completed my Product Brief. Can you help me document the technical boundaries?"

**Saga responds with initial questions about your project context.**

### Provide context:

Share your Product Brief or summarize:
- What you're building
- Who it's for
- Key goals

This gives Saga the context to ask relevant questions.

---

## Step 2: Define Platforms (3 min)

### Saga will ask about platforms:

> "What platforms are you targeting? Web, mobile native, desktop, or a combination?"

### Think through:

- Where will users primarily access this?
- Do you need offline capability?
- Are there device-specific requirements?
- What browsers or OS versions must you support?

### Example response:

> "We're building a PWA that works on mobile and desktop browsers. Users will primarily use it on their phones. We need basic offline capability for core features. Must support modern browsers — Chrome, Safari, Firefox, Edge."

### Saga documents and probes deeper:

> "What about offline capability — which features must work offline, and which can require connection?"

---

## Step 3: Identify Integrations (3 min)

### Saga asks about integrations:

> "What systems does this need to integrate with? Think about authentication, payments, data sources, and third-party services."

### Categories to consider:

**Authentication:**
- How will users log in?
- Is there an existing identity system?
- Do you need social login?

**Data:**
- Where does data live?
- What existing databases connect?
- What external data do you need?

**Services:**
- Payment processing?
- Email/SMS notifications?
- Maps or location?
- Analytics?

### Example response:

> "Authentication through Supabase, with optional Google login. All data in Supabase PostgreSQL. We'll need push notifications eventually. No payment processing for MVP."

### Saga probes:

> "Are there any legacy systems or existing tools users currently use that this should connect with?"

---

## Step 4: Document Constraints (3 min)

### Saga asks about limitations:

> "What constraints are you working within? Think about technical limitations, budget, team skills, timeline, and regulations."

### Areas to cover:

**Technical:**
- Hosting limitations?
- Performance requirements?
- Platform restrictions?

**Budget:**
- What can't you afford?
- What's the spending limit?

**Team:**
- What skills are missing?
- What's the team size?

**Timeline:**
- When must this launch?
- Are there phases?

**Regulatory:**
- Privacy requirements?
- Accessibility mandates?
- Industry regulations?

### Example response:

> "Bootstrap budget — using Supabase free tier. Solo developer, no mobile expertise. MVP needed in 8 weeks. GDPR compliance required for Swedish users. No budget for native app development."

### Saga clarifies:

> "For GDPR, does your app handle any child data? That might require additional considerations."

---

## Step 5: Assess Complexity (2 min)

### Saga asks about challenges:

> "Where do you see technical complexity or challenges? Which integrations feel risky or uncertain?"

### Rate each major component:

- **Low** — Well-understood, team has experience
- **Medium** — Achievable but requires research
- **High** — Significant unknowns, may need spikes
- **Unknown** — Needs investigation

### Example response:

> "Push notifications on iOS PWA feel medium complexity — I've read there are limitations. Offline sync is probably medium too. Basic auth and CRUD operations are low — Supabase handles that well."

### Saga summarizes:

> "So we have medium complexity on push notifications and offline sync, with lower complexity on core features. I'll flag the iOS push notification limitations as something that needs research."

---

## Step 6: Identify Knowledge Gaps (2 min)

### Saga asks what's unknown:

> "What don't you know yet? What assumptions haven't been validated? What needs research or a proof-of-concept?"

### Categories:

- **Needs Research** — Documentation review, competitor analysis
- **Needs Spike** — Technical proof-of-concept
- **Needs Decision** — Team or stakeholder choice required

### Example response:

> "I don't know how iOS 17 handles PWA push notifications. Not sure about Supabase performance with complex row-level security. We haven't decided if we'll eventually go React Native."

### Saga documents:

> "I'll create three knowledge gap items:
> 1. Research: iOS 17+ PWA push notification behavior
> 2. Research: Supabase RLS performance characteristics
> 3. Decision needed: React Native vs PWA long-term"

---

## Step 7: Review and Finalize (3 min)

### Saga presents the complete document:

> "Here's your platform requirements document. Let me read it back so you can confirm everything is accurate."

### Review checklist:

- ✓ All target platforms listed
- ✓ Key integrations captured
- ✓ Constraints are specific and accurate
- ✓ Complexity levels feel right
- ✓ Knowledge gaps are clear and actionable

### Make corrections:

If anything is missing or wrong, tell Saga:

> "Add that we need to support Swedish and English languages. And the timeline is actually 10 weeks, not 8."

### Saga updates the document.

---

## Step 8: Save the Document (1 min)

### Saga will save to:

`A-Product-Brief/platform-requirements.md`

### Confirm the save:

> "Save this as platform-requirements.md in the A-Product-Brief folder."

### Saga confirms:

> "Platform requirements saved. This document is now part of your strategic foundation alongside your Product Brief."

---

## Step 9: Handoff to Development (Optional)

### If you want parallel development:

> "Please prepare a handoff for development with the knowledge gaps that need investigation."

### Saga creates handoff:

> "Handoff prepared for development:
>
> **Research Tasks:**
> - iOS 17+ PWA push notification behavior
> - Supabase RLS performance characteristics
>
> **Spike Tasks:**
> - Offline sync conflict resolution patterns
>
> **Pending Decisions:**
> - React Native vs PWA long-term strategy
>
> Development can start while you continue to UX design with Freya."

---

## What You've Created

### Your platform-requirements.md includes:

```markdown
# Platform Requirements

## Platforms
- Primary: Progressive Web App (PWA)
- Mobile: iOS and Android via PWA
- Desktop: Web browser (Chrome, Safari, Firefox, Edge)
- Offline: Core features must work offline

## Integrations
- Authentication: Supabase Auth, Google OAuth optional
- Database: Supabase PostgreSQL
- Storage: Supabase Storage
- Future: Push notifications

## Constraints
- Technical: PWA approach, Supabase free tier initially
- Budget: Bootstrap phase
- Team: Solo developer
- Regulatory: GDPR compliance
- Timeline: MVP in 10 weeks

## Complexity & Challenges
- Medium: Push notifications (iOS limitations), offline sync
- Low: Authentication, basic CRUD

## Knowledge Gaps
- Research: iOS 17+ PWA push notifications
- Research: Supabase RLS performance
- Spike: Offline sync patterns
- Decision: React Native vs PWA long-term
```

---

## What Happens Next

### Immediate:

- Platform requirements inform all design decisions
- Knowledge gaps become development research tasks
- You have a clear picture of what's possible

### Next Phase:

- **Module 07: The Design Phase** — Meet Freya and begin UX design
- Design within these boundaries
- Reference platform requirements when making decisions

---

## Tips for Success

**DO:**

- Be honest about constraints
- Document what you don't know
- Ask technical stakeholders if unsure
- Update as you learn more

**DON'T:**

- Guess at technical details
- Skip knowledge gaps
- Assume constraints are permanent
- Over-engineer the document

---

## Common Questions

**Q: What if I don't know the technical details?**
A: That's what knowledge gaps are for. Document what you don't know and let the development agent investigate.

**Q: Should I talk to developers before creating this?**
A: Helpful but not required. Saga will ask questions that surface what you know. Mark unknowns as knowledge gaps.

**Q: Can this document change?**
A: Absolutely. It's a living document. Update it as you learn more or as the project evolves.

**Q: What if I realize a constraint later?**
A: Add it to the document. Better to discover and document late than never.

---

## You've Completed Module 05!

**Platform Requirements Complete**

You now have:
- ✅ Product Brief (Module 04)
- ✅ Platform Requirements (Module 05)

**Next up: Trigger Mapping to connect business goals to user psychology.**

**Your strategic foundation is solid.**

---

## Next Module

**[Module 06: Trigger Mapping →](../module-06-trigger-mapping/module-06-overview.md)**

Connect business goals to user psychology with Saga.

---

[← Back to Lesson 2](lesson-02-defining-platform-requirements.md) | [Back to Module Overview](module-05-platform-requirements-overview.md)

*Part of Module 05: Platform Requirements*
