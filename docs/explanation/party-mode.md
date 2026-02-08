---
title: "Party Mode"
description: Multi-agent collaboration - get all your AI agents in one conversation
sidebar:
  order: 7
---

Get all your AI agents in one conversation.

## What is Party Mode?

Run `party-mode` and you've got your whole AI team in one room - PM, Architect, Dev, UX Designer, whoever you need. BMad Master orchestrates, picking relevant agents per message. Agents respond in character, agree, disagree, and build on each other's ideas.

The conversation continues as long as you want. Ask follow-ups, push back on answers, redirect the discussion - it's a real back-and-forth with your agents until you're done.

**Good for:**

- Big decisions with tradeoffs
- Brainstorming sessions
- Post-mortems when things go wrong
- Sprint retrospectives and planning

## Examples

### Calling Out Bad Architecture

**You:** "Okay team, our last sprint was a disaster. The authentication service went down three times. Who screwed this up?"

**Architect:** "The design was sound - distributed authentication with proper fallbacks. If implementation deviated from the spec..."

**Dev:** "I followed the architecture doc exactly. The spec didn't account for concurrent session invalidation race conditions."

**PM:** "Both of you missed the bigger issue - we didn't validate session management requirements in the PRD. This is on me for not catching it."

**TEA:** "And I should've caught this in integration tests. The test scenarios didn't cover concurrent invalidation."

### Creative Brainstorming

**You:** "How do we make onboarding feel magical instead of boring?"

**UX Designer:** "Start with progressive disclosure - reveal features as users need them, not all at once in a tutorial."

**Storyteller:** "What if onboarding was a story? Each step reveals a character's journey - the user IS the hero."

**Game Designer:** "Building on that - what if the first 'quest' is actually solving a real user problem? They learn by doing something valuable."

### Technical Decision

**You:** "Monolith or microservices for MVP?"

**Architect:** "Start monolith. Microservices add complexity you don't need at 1000 users."

**PM:** "Agree. Time to market matters more than theoretical scalability."

**Dev:** "Monolith with clear module boundaries. We can extract services later if needed."

:::tip[Better Decisions]
Better decisions through diverse perspectives. Welcome to party mode.
:::
