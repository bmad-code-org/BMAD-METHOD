# Tutorial 08: Create Your Scenario Outlines

**Hands-on guide to defining user journeys with Freya's 8-question dialog**

---

## Overview

This tutorial walks you through creating scenario outlines using Freya's 8-question dialog — the structured conversation that maps user journeys across your application.

**Time:** 20-25 minutes
**Prerequisites:** Trigger Map completed (Module 06)
**Agent:** Freya
**What you'll create:** Scenario outline documents in `C-UX-Scenarios/`

---

## Before You Start

**You'll need:**

- Your completed Trigger Map
- Understanding of your personas and their goals
- Product Brief for context

**Freya will help you:**

- Identify which scenarios to prioritize
- Walk through the 8-question dialog for each scenario
- Connect every answer back to your Trigger Map
- Ensure dual value (user + business)

---

## Step 1: Start the Conversation with Freya (2 min)

### Open your AI IDE and initiate:

**You say:**
> "I want to create scenario outlines for my project. I have my Trigger Map ready. Can you help me identify and structure the key user journeys?"

**Freya responds with context questions about your personas.**

### Share your Trigger Map:

Reference your B-Trigger-Map folder or summarize your personas and their primary goals.

---

## Step 2: Freya Analyzes and Suggests Scenarios (5 min)

### Ask Freya to analyze your Trigger Map:

**You say:**
> "I'd like you to analyze my Trigger Map and suggest prioritized scenarios. Here's my Product Brief and Trigger Map..." (share the files)

### Freya analyzes automatically:

Freya examines:
- Your top business goals (from Product Brief)
- Priority personas (from Trigger Map workshops)
- Top driving forces per persona
- Feature-to-driver connections

**Then suggests scenarios ranked by strategic value.**

### Freya presents ranked suggestions:

> **Freya:** "Based on your Trigger Map, I've identified 8 potential scenarios. Here are the top 3 by strategic value:
>
> **01: Harriet's Family Setup** (Priority #1)
> - Business Goal: BG01 - Multi-user adoption
> - Persona: Harriet the Household Manager (your #1 priority)
> - Driver: Need to get whole family on same page (her #1 driver)
> - Why this matters: Household with multiple members = higher retention
>
> **02: Felix's Daily Overview** (Priority #2)
> - Business Goal: BG02 - Daily active usage
> - Persona: Felix the Full-Stack (Harriet's spouse)
> - Driver: Quick visibility into what's needed (his #2 driver)
> - Why this matters: Enables daily habit formation
>
> **03: Kids' Task Completion** (Priority #3)
> - Business Goal: BG02 - Daily active usage
> - Persona: Kids (Junior Members)
> - Driver: Clear expectations and progress visibility
> - Why this matters: Completes family loop
>
> Should we start with 01: Harriet's Family Setup?"

### You validate and adjust:

**You respond:**
> "Yes, 01 makes sense. Let's start there."

---

## Step 3: Walk Through the 8-Question Dialog (10 min)

Freya guides you through 8 questions, one at a time. Each answer shapes the next question.

### Q1: The Transaction

**Freya:**
> "What transaction do we need to get really right for Harriet? What's the most important thing she needs to accomplish?"

**You:**
> "Set up her household and get at least one family member to join."

### Q2: Business Goal

**Freya:**
> "If this transaction succeeds, which business goal does it serve?"

**You:**
> "BG01 - Multi-user adoption. Each household with multiple members means higher retention."

### Q3: User & Situation

**Freya:**
> "Tell me about Harriet in this moment. Who is she, where is she, what's happening?"

**You:**
> "She's a mom, evening after kids are in bed. Just saw a Facebook ad for the app. She's motivated but skeptical — she's tried 2 other family apps that nobody used."

### Q4: Hope & Worry

**Freya:**
> "What does Harriet hope for and what does she fear going into this?"

**You:**
> "Hope: Finally get the family coordinated without nagging. Worry: Another app nobody will actually use."

### Q5: Device

**Freya:**
> "What device is she on?"

**You:**
> "Mobile — she's on her phone on the couch."

### Q6: Starting Point

**Freya:**
> "How does she actually arrive at the first screen?"

**You:**
> "Clicks the download link from the Facebook ad, lands on the app store page, installs, opens the app."

### Q7: Best Outcome

**Freya:**
> "What does the best possible outcome look like — for Harriet AND for the business?"

**You:**
> "Harriet: Household created, husband invited, feels like she's actually made progress. Business: Activated user plus second user invited — retention signal and network effect."

### Q8: Shortest Path

**Freya:**
> "What's the shortest path through the app to get there? Walk me through the screens."

**You:**
> "Landing screen, then signup, then create household with a name, then invite screen where she sends invite to her husband, then dashboard showing the household is set up."

**Freya structures it:**

```
1. **Welcome Screen** — Sees value proposition, taps "Start Free"
2. **Signup** — Enters email and password
3. **Create Household** — Names the household
4. **Invite Family** — Sends invite to husband
5. **Dashboard** — Sees household created, invite sent ✓
```

---

## Step 4: Review the Complete Scenario (2 min)

### Freya presents the full outline:

```markdown
# 01: Harriet's Family Setup

**Project:** Dog Walker App
**Created:** 2026-02-26
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)
Set up household and get first family member to join

## Business Goal (Q2)
BG01 - Multi-user adoption
Objective: Drive household activation with multiple members

## User & Situation (Q3)
Harriet (Primary) — Mom, evening after kids in bed.
Just saw Facebook ad, motivated but skeptical after 2 failed app attempts.

## Driving Forces (Q4)
Hope: Finally get the family coordinated without nagging
Worry: Another app nobody will actually use

## Device & Starting Point (Q5 + Q6)
Mobile — Clicks download link from Facebook ad, installs app

## Best Outcome (Q7)
User: Household created, husband invited, feels like real progress
Business: Activated user + second user invited (retention signal + network effect)

## Shortest Path (Q8)
1. **Welcome Screen** — Sees value proposition, taps "Start Free"
2. **Signup** — Enters email and password
3. **Create Household** — Names the household
4. **Invite Family** — Sends invite to husband
5. **Dashboard** — Sees household created, invite sent ✓

## Trigger Map Connections
Persona: Harriet (Primary)
Want: Get whole family on same page
Fear: Another app nobody will use
Business Goal: BG01 - Multi-user adoption

## Pages in This Scenario

| Page | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 1.1 | 1.1-welcome-screen/ | See value, start signup | Tap "Start Free" |
| 1.2 | 1.2-signup/ | Create account | Submit credentials |
| 1.3 | 1.3-create-household/ | Name the household | Enter name, continue |
| 1.4 | 1.4-invite-family/ | Invite first member | Send invite |
| 1.5 | 1.5-dashboard/ | See success confirmation | Scenario complete ✓ |
```

### Verify and adjust:

> "Does this capture the journey accurately? Anything missing or incorrect?"

---

## Step 5: After Each Scenario — Choose What's Next

After completing a scenario, Freya presents options:

> **Freya:** "Scenario 01 complete! What would you like to do?
>
> **[N]** Define the next scenario — 02: Felix's Daily Overview
> **[O]** Outline scenario pages — create page folders for scenario 01
> **[D]** Start designing — create first page and jump to Phase 4
> **[C]** Continue to overview — when all scenarios are done"

**Choose based on your workflow:**
- **[N]** to keep outlining scenarios (most common)
- **[O]** to detail the pages in this scenario before moving on
- **[D]** to jump straight into designing the first page
- **[C]** only when ALL planned scenarios are complete

---

## Step 6: Continue with Remaining Scenarios (5 min)

### Work through remaining scenarios using the same 8-question dialog:

**You:**
> "Let's do [N] — next scenario."

**Freya:**
> "Great. Let's work on 02: Felix's Daily Overview.
>
> **Q1:** What transaction do we need to get right for Felix?"

Work through Q1-Q8 again. Each scenario follows the same dialog pattern but the answers are unique to the persona and their situation.

### Freya tracks progress:

> "We've completed:
> - 01: Harriet's Family Setup ✓
> - 02: Felix's Daily Overview ✓
> - 03: Kids' Task Completion (next)
>
> These 3 cover your core activation flow. Ready for 03?"

---

## Step 7: Save the Scenarios (2 min)

### Freya saves each scenario:

```
C-UX-Scenarios/
├── 01-harriets-family-setup/
│   └── 01-harriets-family-setup.md
├── 02-felixs-daily-overview/
│   └── 02-felixs-daily-overview.md
├── 03-kids-task-completion/
│   └── 03-kids-task-completion.md
```

### Confirm the structure:

> "I've created the scenario folders with outline documents. Each scenario is ready for the next steps: page outlining, conceptual sketching, or detailed specifications."

---

## What You've Created

### For each scenario, the 8-question dialog produced:

- **Transaction (Q1)** — What the user needs to accomplish
- **Business Goal (Q2)** — Strategic connection to Trigger Map
- **User & Situation (Q3)** — Persona + real-life context
- **Driving Forces (Q4)** — Hope and worry, visceral and specific
- **Device (Q5)** — Design approach
- **Starting Point (Q6)** — How they actually arrive
- **Best Outcome (Q7)** — Success for user AND business
- **Shortest Path (Q8)** — Linear page flow, no branches
- **Trigger Map Connections** — Explicit link back to strategic foundation
- **Pages Table** — Page folders ready for Phase 4

---

## What Happens Next

### Immediate:

- Each scenario is a roadmap for design
- Pages from Q8 become screens to sketch
- The 8-question answers inform every design decision

### Next Module:

- **Module 09: Conceptual Sketching** — Visualize the default state of each page
- Take one scenario and sketch what the user sees at each step

---

## Tips for Success

**DO:**

- Keep Q8 linear (zero "if" statements)
- Make Q4 visceral — "interested" is too weak
- Connect every scenario to the Trigger Map (Q2)
- Be specific in Q3 — who, where, when, why
- Make Q7 measurable for both sides

**DON'T:**

- Design pages in isolation
- Include edge cases in Q8 (those go in page specs)
- Create more scenarios than you need for MVP
- Use generic driving forces in Q4
- Skip Q2 — every scenario needs a business goal

---

## Common Questions

**Q: How many scenarios should I have?**
A: For MVP, typically 3-8. Each persona's primary transaction = one scenario. Start core, expand later.

**Q: What if a scenario feels too long?**
A: If Q8 has more than 7 steps, consider splitting into two scenarios. Look for natural milestones.

**Q: Where do error states go?**
A: In page specifications (Module 11), not the scenario outline. Q8 is the sunshine path.

**Q: Can one page appear in multiple scenarios?**
A: Absolutely. The Dashboard might be the end of scenario 01 and the start of scenario 02.

**Q: Conversation mode or Suggest mode?**
A: Conversation (default) is best for learning. Suggest is faster when you have a detailed Trigger Map and want Freya to draft all 8 answers for your review.

---

## You've Completed Module 08!

**Your scenarios are outlined.** You know:
- The journeys you're designing (Q1 + Q8)
- Who is taking each journey (Q3 + Q4)
- What value each journey delivers (Q2 + Q7)

---

## Next Module

**[Module 09: Conceptual Sketching →](../module-09-conceptual-sketching/module-09-conceptual-sketching-overview.md)**

Time to visualize what the user sees at each step.

---

[← Back to Lesson 3](lesson-03-mapping-the-journey.md) | [Back to Module Overview](module-08-outline-scenarios-overview.md)

*Part of Module 08: Outline Scenarios*
