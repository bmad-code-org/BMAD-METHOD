# Module 08: Outline Scenarios

## Lesson 3: Mapping the Journey

**How to structure scenario outlines using the 8-question dialog**

---

## The 8-Question Dialog

Every scenario outline is built through 8 strategic questions. Freya walks you through them one at a time — each answer shapes the next question naturally.

| # | Question | What it captures |
|---|----------|-----------------|
| Q1 | What transaction do we need to get right? | User purpose |
| Q2 | Which business goal does it serve? | Strategic connection |
| Q3 | Which user, in what situation? | Persona + real-life context |
| Q4 | What do they hope and fear? | Driving forces |
| Q5 | What device? | Design approach |
| Q6 | How do they arrive? | Entry point + discovery |
| Q7 | Best outcome for both sides? | Success criteria |
| Q8 | Shortest path through the site? | Linear page flow |

When all 8 are answered, the scenario outline writes itself.

---

## Q1: "What transaction do we need to get really right?"

Start with the WHY. What's the most important thing a user needs to accomplish?

State as **user purpose**, not feature name.

- **Bad:** "Homepage and service pages"
- **Good:** "Verify service availability before booking"

A **transaction** isn't just purchases. Browsing content page-by-page counts. Comparing options counts. Any meaningful journey where the user moves through the site with intent.

---

## Q2: "Which business goal does it serve?"

Connect to your Trigger Map immediately. Which specific business goal and objective does this transaction advance?

```
Business Goal: BG01 - 5,000 active teams
Objective: Drive trial-to-active conversion
```

This grounds the scenario in business strategy, not just user needs.

---

## Q3: "Which user experiences this most, and in what real-life situation?"

Identify the persona AND their context. Not just "who" but "who, where, when."

- **Bad:** "A customer looking for information"
- **Good:** "Hasse, 55, motorhome tourist stranded in Byxelkrok with a broken vehicle during family vacation"

Use actual personas from your Trigger Map. The situation should feel visceral and specific.

---

## Q4: "What do they hope and fear?"

The driving forces — hope and worry. These must be visceral and specific.

- **Hope:** What they're hoping to find or achieve
- **Worry:** What they're afraid of or want to avoid

**One sentence max per component.** Phrases, not paragraphs.

- **Bad:** "User is interested in the product"
- **Good:** Hope: "Find trustworthy mechanic nearby, get back on road today." Worry: "Being stranded for days, getting ripped off by unknown mechanic."

---

## Q5: "What device are they on?"

Mobile, desktop, or tablet. This shapes the entire design approach.

Simple question, but it matters — a panicked tourist on mobile needs a completely different experience than a manager at their desk.

---

## Q6: "How do they actually arrive?"

How the user ACTUALLY gets to the site. Be specific about discovery method.

- **Bad:** "User opens the website"
- **Good:** "Googles 'car repair Öland' on mobile while parked at gas station, clicks top organic result"

**1-2 sentences max.** Device + context + discovery method.

---

## Q7: "What does the best possible outcome look like — for both sides?"

Mutual success — user AND business. Both specific and measurable.

- **User Success:** Tangible outcome the user achieves
- **Business Success:** Measurable result for the business

- **Bad:** User: "Successfully use the site" / Business: "Get more customers"
- **Good:** User: "Confirmed mechanic fixes motorhomes, has location and hours, feels confident calling" / Business: "High-intent tourist call captured, positioned as emergency-capable, info call avoided"

---

## Q8: "What's the shortest path through the site?"

The linear sunshine path. Numbered steps, each with page name + what the user accomplishes.

**Rules:**
- Completely linear — ZERO "if" statements, ZERO branches
- Minimum viable steps — can you remove any without breaking the flow?
- Each step moves meaningfully toward success

```
1. **Start Page** — Sees hero with emergency message, clicks "Vehicle Service"
2. **Service Page** — Confirms motorhome service available, sees phone number
3. **Contact Page** — Gets address, hours, and map directions ✓
```

---

## After the 8 Questions

### Name the Scenario

Use the persona name + purpose:

```
01: Hasse's Emergency Search
02: Harriet's Family Setup
03: Felix's Quick Registration
```

The number indicates priority order. The name tells you who and what.

### Trigger Map Connections

Explicitly link back to your strategic foundation:

```
## Trigger Map Connections
Persona: Hasse (Primary)
Want: Find trustworthy mechanic nearby
Fear: Being stranded, getting ripped off
Business Goal: BG01 - Capture high-intent service calls
```

### Pages Table

List the pages that will be designed:

```
| Page | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 1.1 | 1.1-start-page/ | See value, find service | Click "Vehicle Service" |
| 1.2 | 1.2-service-page/ | Confirm capability | Click "Contact" |
| 1.3 | 1.3-contact-page/ | Get address + hours | Call or navigate ✓ |
```

---

## Scenario vs. Storyboard Boundary

This is crucial to understand:

**Scenario = Journey between logical views**
```
Start Page → Service Page → Contact Page
```

**Storyboard = Transformations within a logical view**
```
Service Page: Loading → Content visible → Phone number copied
```

| Question | Answer |
|----------|--------|
| User clicks button and new screen loads | Scenario |
| Button changes from "Submit" to "Loading..." | Storyboard |
| Modal opens on top of current page | Scenario (modal is new logical view) |
| Form field shows validation error | Storyboard |

---

## Edge Cases: Where Do They Go?

Edge cases are real. They need documentation. But not in the scenario outline.

**In scenario outline (Q8):**
```
1. **Signup Form** — Enters email and password
2. **Welcome Screen** — Greeted, ready to explore ✓
```

**In page specification (Module 11):**
```
## Error States

### Email Already Exists
- Message: "This email is already registered. [Log in instead]"
- User action: Click link to login flow

### Network Error
- Message: "Connection lost. Your data is saved. [Retry]"
- User action: Click retry to resubmit
```

The scenario outline is the sunshine path. Page specifications handle the shadows.

**Module progression:**
- **Module 08** (now): Outline scenarios — 8-question dialog defines the journey
- **Module 09**: Conceptual sketching — visualize each screen's default state
- **Module 10**: Storyboarding — document state transformations within each screen
- **Module 11**: Detailed specifications — document edge cases, error states, business rules

---

## The Complete Template

Here's what a finished scenario outline looks like:

```markdown
# 01: Felix's Quick Registration

**Project:** Dog Walker App
**Created:** 2026-02-26
**Method:** Whiteport Design Studio (WDS)

---

## Transaction (Q1)
Create account and experience first success with minimal friction

## Business Goal (Q2)
BG01 - Increase trial signups by 40%
Objective: Drive visitor-to-registered conversion

## User & Situation (Q3)
Felix (Primary) — Full-stack parent, late evening after kids asleep.
Saw Google ad, motivated to find solution but skeptical of time investment.

## Driving Forces (Q4)
Hope: Find a simple app the whole family will actually use
Worry: Complex onboarding that wastes his limited free time

## Device & Starting Point (Q5 + Q6)
Mobile — Googles "family dog care app", clicks top organic result

## Best Outcome (Q7)
User: Account created, feels confident this app will help the family
Business: New user in activation funnel, one step closer to subscription

## Shortest Path (Q8)
1. **Landing Page** — Sees value proposition, clicks "Start Free"
2. **Signup Form** — Enters email and password
3. **Welcome Screen** — Greeted, ready to add first dog profile ✓

## Trigger Map Connections
Persona: Felix (Primary)
Want: Try before committing
Fear: Complex onboarding that wastes time
Business Goal: BG01 - Increase trial signups

## Pages in This Scenario

| Page | Folder | Purpose | Exit Action |
|------|--------|---------|-------------|
| 1.1 | 1.1-landing-page/ | See value, click CTA | Click "Start Free" |
| 1.2 | 1.2-signup-form/ | Create account | Submit credentials |
| 1.3 | 1.3-welcome-screen/ | Feel welcomed, ready to explore | Scenario complete ✓ |
```

---

## Folder Structure

Each scenario gets its own folder:

```
C-UX-Scenarios/
├── 01-felixs-quick-registration/
│   ├── 01-felixs-quick-registration.md
│   ├── 1.1-landing-page/
│   ├── 1.2-signup-form/
│   └── 1.3-welcome-screen/
├── 02-harriets-family-setup/
│   ├── 02-harriets-family-setup.md
│   └── ...
```

The scenario file contains the 8-question outline.
Page folders are created via Freya's page outline dialog or when you jump to Phase 4 (UX Design).

---

## Two Modes

Freya offers two ways to work through the 8 questions:

**Conversation mode** (default): Freya asks one question at a time. Your answers shape the next question naturally. Best for learning and complex scenarios.

**Suggest mode**: Ask Freya to suggest, and she answers all 8 questions based on your Trigger Map and Product Brief. You review and adjust. Best when you want speed or have a clear Trigger Map.

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Starting with pages | Start with Q1 — the transaction |
| Including branches in Q8 | Keep it linear — zero "if" statements |
| Generic driving forces in Q4 | Make them visceral and specific |
| Vague outcomes in Q7 | Both user and business must be measurable |
| Skipping Q2 | Every scenario must connect to a business goal |

---

## How to Start

From your Trigger Map:

1. **Pick your highest-priority business goal**
2. **Identify which persona is critical to that goal**
3. **Find the transaction that satisfies both** — Q1
4. **Walk through Q2-Q8** with Freya
5. **Name it** using persona + purpose

---

## What's Next

In the tutorial, you'll create scenario outlines for your own project. Freya will guide you through the 8-question dialog, building each scenario from your Trigger Map.

---

**[Continue to Tutorial: Create Scenario Outlines →](tutorial-08.md)**

---

[← Back to Lesson 2](lesson-02-from-trigger-map-to-scenarios.md) | [Back to Module Overview](module-08-outline-scenarios-overview.md)

*Part of Module 08: Outline Scenarios*
