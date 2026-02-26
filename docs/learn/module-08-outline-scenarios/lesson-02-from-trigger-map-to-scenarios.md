# Module 08: Outline Scenarios

## Lesson 2: From Trigger Map to Scenarios

**How to identify which scenarios to create from your Trigger Map**

---

## The Missing Bridge

You've completed your Trigger Map (Module 06):
- Personas with driving forces
- Business goals prioritized
- Features connected to both

Now you're in Module 08: Outline Scenarios.

**But which scenarios should you create?**

This lesson bridges the gap. It shows you how to use your prioritized Trigger Map to identify the scenarios that matter most.

---

## Strategic Context from the Trigger Map

Every scenario needs **strategic context** — the thread connecting business goals to user motivations through specific transactions, selected from your Trigger Map.

```
Business Goal → User Group → Driving Forces → Transaction → Scenario
```

**Example:**

```
BG01: 5,000 active teams
    ↓
Remote Team Leads (Persona: Harriet)
    ↓
Fear of burnout, desire for team awareness
    ↓
Create first pulse check
    ↓
S01-First-Pulse-Check-Setup
```

**The strategic context answers:**
- What's the most valuable transaction for our business?
- What are we offering that's valuable for the end user?
- How can we create a marriage between business goals and user driving forces?
- What would make both the business and the user happy?

**The scenario is the shortest path to make everyone happy.**

---

## The Marriage Question

For each potential scenario, ask:

**"What transaction would satisfy both this business goal AND this user's driving forces?"**

This is the marriage between business value and user value.

| Business Wants | User Wants | Transaction (Scenario) |
|----------------|------------|----------------------|
| 5,000 active teams | Quick team health check | First pulse check setup |
| Reduce churn | Avoid burnout | Schedule automated check-ins |
| Increase engagement | Team feels heard | Share pulse results with team |
| Premium subscriptions | Advanced insights | Unlock trend analysis |

**Each row is a potential scenario.**

The ones at the top (aligned with your highest-priority business goals and persona driving forces) become your first scenarios to design.

---

## Identifying Your First Scenarios

Use your Trigger Map prioritization to identify scenarios:

### Step 1: Start with Top Business Goal

Look at your Product Brief. What's your #1 business goal?

Example: **BG01 - Get 5,000 active teams using the product**

### Step 2: Identify Most Important User Group

Which persona is most critical to achieving this goal?

Example: **Remote Team Leads (Harriet)**

### Step 3: Connect to Top Driving Forces

What are this persona's strongest driving forces from your Trigger Map?

Example:
- Fear of team burnout
- Desire for team awareness without micromanaging
- Need for quick, actionable insights

### Step 4: Find the Valuable Transaction

What can the user do in your product that:
- Advances the business goal?
- Satisfies the user's driving forces?

Example: **Create and send first pulse check to team**

This becomes: **S01-First-Pulse-Check**

### Step 5: Repeat for Secondary Priorities

Continue down your prioritized Trigger Map:
- Next business goal
- Next persona
- Next driving force

Each valuable transaction becomes a scenario.

---

## The Strategic Grounding (Q1-Q4)

Before mapping any pages, Freya's 8-question dialog establishes the strategic grounding through the first four questions:

### Q1: Transaction — What needs to happen?

The specific thing the user needs to accomplish, stated as user purpose.

```
Transaction: Create and send first pulse check to team
```

### Q2: Business Goal — Why does the business care?

Direct connection to your Trigger Map business goals.

```
Business Goal: BG01 - 5,000 active teams
Objective: Drive trial-to-active conversion
```

### Q3: User & Situation — Who, where, when?

The persona AND their real-life context — not just a name but a vivid picture.

```
Harriet (Primary) — Remote team lead, Monday morning before weekly meeting.
Motivated to try something that shows value quickly. Cautiously optimistic.
```

### Q4: Driving Forces — What do they hope and fear?

Visceral, specific driving forces. One sentence each.

```
Hope: Quick visibility into team health without seeming like a micromanager
Worry: Wasting time on another tool the team won't use
```

**These four answers connect the scenario to strategy.** Q5-Q8 then define the entry point, success criteria, and page flow.

---

## Complete Example: From Trigger Map to Scenario

### Trigger Map (Module 06)

**Business Goal:** BG01 - 5,000 active teams (Priority: High)

**Persona:** Harriet the Hybrid Manager
- Role: Remote team lead, 8-person team
- Driving Forces:
  - Fear: Team burnout goes unnoticed
  - Desire: Team awareness without micromanaging
  - Need: Quick actionable insights
- Priority: High (critical user group)

**Feature:** F05-Pulse-Checks
- Connected to: BG01
- Connected to: Harriet (fear of burnout)

### Strategic Context (from Trigger Map)

```
BG01: 5,000 active teams
    ↓
Harriet (Remote Team Lead)
    ↓
Fear: Team burnout goes unnoticed
Desire: Awareness without micromanaging
    ↓
Transaction: Create and send first pulse check
    ↓
S01-First-Pulse-Check
```

### The Marriage

**Business wants:** 5,000 teams actively using the product

**Harriet wants:** Quick way to check team health without being intrusive

**Transaction that satisfies both:** Create simple pulse check, send to team, see results

**This becomes:** S01-First-Pulse-Check

### Scenario Outline (Q1-Q8 Format)

```markdown
# 01: Harriet's First Pulse Check

## Transaction (Q1)
Create and send first pulse check to team

## Business Goal (Q2)
BG01 - 5,000 active teams
Objective: Drive trial-to-active conversion

## User & Situation (Q3)
Harriet (Primary) — Remote team lead, Monday morning before weekly meeting.
Just set up her team account, motivated to try something that shows value quickly.

## Driving Forces (Q4)
Hope: Quick visibility into team health without seeming like a micromanager
Worry: Wasting time on another tool the team won't use

## Device & Starting Point (Q5 + Q6)
Desktop — Auto-redirected after team creation to "Create Your First Pulse Check"

## Best Outcome (Q7)
User: Pulse check sent, feels proactive about team health
Business: User activated core feature, team members receive first touchpoint

## Shortest Path (Q8)
1. **Welcome Screen** — Sees "Create First Pulse Check" prompt
2. **Pulse Check Builder** — Chooses template, reviews questions
3. **Select Recipients** — Picks team members
4. **Confirmation** — Pulse check sent successfully ✓

## Trigger Map Connections
Persona: Harriet (Primary)
Want: Team awareness without micromanaging
Fear: Team burnout going unnoticed
Business Goal: BG01 - 5,000 active teams
```

---

## Prioritizing Multiple Scenarios

You'll identify many potential scenarios. Prioritize using this hierarchy:

### Priority 1: Critical Path Scenarios

Scenarios directly connected to:
- Highest-priority business goal
- Most important persona
- Core product value

**Example:**
- S01-First-Pulse-Check (activation)
- S02-View-Results (value delivery)
- S03-Team-Setup (prerequisite)

Design these first. Everything else waits.

### Priority 2: Supporting Scenarios

Scenarios that support Priority 1:
- Secondary personas using same features
- Alternative paths to same goal
- Enhancement scenarios

**Example:**
- S04-Recurring-Pulse (power user scenario)
- S05-Export-Results (advanced usage)

Design these after Priority 1 is validated.

### Priority 3: Edge Case Scenarios

Scenarios for less common situations:
- Error recovery paths
- Administrative tasks
- Rare user segments

**Example:**
- S12-Password-Recovery
- S15-Delete-Team

Design these last, or defer to later iterations.

---

## The Shortest Path Principle

> **"The scenario is the shortest path to make everyone happy."**

When identifying scenarios from your Trigger Map:

**Don't design everything.**

Design the **shortest path** from:
- User's current state → User's desired state (user happy)
- Business's current state → Business's desired state (business happy)

**Ask:**
- What's the minimum number of steps?
- What's the fastest path to mutual value?
- What can we skip or defer?

**Example:**

**Bad (too long):**
```
Landing → Signup → Email Verify → Profile Setup → Team Creation →
Invite Members → Wait for Accepts → Tutorial → Feature Tour → Dashboard →
Finally Create Pulse Check
```

**Good (shortest path):**
```
Signup → Team Setup → First Pulse Check ✓
```

Everything else is optional or deferred to later scenarios.

---

## Multiple Entry Points

Some scenarios have multiple natural starting points:

**Example: S05-Add-Team-Member**

```
## Natural Starting Points

1. From Dashboard → "Add Member" button (most common)
2. From Team Settings → "Manage Members" → "Add"
3. From Email → "You were added as admin" → "Invite your team"
4. From Pulse Results → "Only 3/8 members responded" → "Invite missing members"
```

**Document all entry points**, but design for the most common one first.

Alternative entry points get documented in specifications, not designed separately.

---

## From Features to Scenarios

Your Trigger Map includes features. Scenarios implement those features.

**Relationship:**

| Trigger Map Feature | Scenarios That Implement It |
|-------------------|---------------------------|
| F05-Pulse-Checks | S01-First-Pulse-Check<br>S04-Recurring-Pulse<br>S07-Customize-Questions |
| F08-Results-Dashboard | S02-View-Results<br>S05-Export-Results<br>S09-Share-With-Team |
| F02-Team-Management | S03-Team-Setup<br>S06-Add-Member<br>S10-Remove-Member |

**One feature → Multiple scenarios**

Each scenario is a specific user journey through that feature.

---

## The Scenario Decision Matrix

Use this to decide if a potential scenario should be designed:

| Question | Must Answer |
|----------|-------------|
| **Does it connect to a business goal?** | Which one? |
| **Does it serve a persona from your Trigger Map?** | Which persona? |
| **Does it satisfy a driving force?** | Which force? |
| **What's the valuable transaction?** | Be specific. |
| **Where does the user come from?** | Natural starting point? |
| **What value does the user get?** | Concrete outcome? |
| **What value does the business get?** | Measurable result? |

**If you can't answer all seven questions, it's not ready to be a scenario.**

Go back to your Trigger Map and clarify.

---

## Common Patterns

### Pattern 1: Onboarding Sequence

Connected scenarios that form activation flow:

```
S01-Signup → S02-Team-Setup → S03-First-Pulse-Check → S04-View-Results
```

Each scenario hands off to the next. Natural starting point is previous scenario's end state.

### Pattern 2: Core Feature Variations

Same feature, different personas or situations:

```
F05-Pulse-Checks implemented as:
- S03-First-Pulse-Check (new user, guided)
- S08-Quick-Pulse (power user, shortcuts)
- S12-Recurring-Pulse-Setup (advanced, automation)
```

Each serves different driving forces for different personas.

### Pattern 3: Administrative Tasks

Supporting scenarios that enable core scenarios:

```
Core: S03-First-Pulse-Check
Supporting: S05-Add-Team-Member (so they have someone to send to)
Supporting: S11-Update-Questions (so they can customize)
```

Design core first. Add supporting scenarios as needed.

---

## How Freya Suggests Scenarios

Freya doesn't just help you create scenarios - she **proactively suggests them** by analyzing your Product Brief and Trigger Map.

### What Freya Analyzes

**From your Product Brief:**
- Top business goals (ranked by priority)
- Success metrics
- Critical constraints

**From your Trigger Map:**
- Persona rankings (from Workshop 4)
- Ranked driving forces per persona (top 5-7)
- Feature-to-driver connections
- Business goal alignments

**Freya combines these to identify strategic context for scenarios automatically.**

### Freya's Suggestion Process

**Phase 1: Identify High-Value Chains**

Freya looks for the strongest connections:

```
Priority #1 Business Goal
    ↓ (which persona drives this?)
Priority #1 Persona
    ↓ (what's their top driver?)
Top-Ranked Driving Force
    ↓ (what transaction satisfies both?)
Suggested Scenario
```

**Example:**

```
BG01: 5,000 active teams (Priority #1 from Brief)
    ↓
Remote Team Leads (Priority #1 from Workshop 4)
    ↓
Fear: Team burnout goes unnoticed (Top driver from Workshop 4)
    ↓
Transaction: Create first pulse check
    ↓
Freya suggests: S01-First-Pulse-Check
```

**Phase 2: Present Ranked Scenario Suggestions**

Freya presents scenarios in priority order with strategic reasoning:

> **Freya:** "Based on your Trigger Map, I've identified 8 potential scenarios. Here are the top 3 by strategic value:
>
> **S01-First-Pulse-Check** (Priority #1)
> - Business Goal: BG01 - 5,000 active teams
> - Persona: Remote Team Leads (your #1 priority group)
> - Driver: Fear of team burnout (their #1 driver)
> - Why this matters: Each team lead brings 5-10 team members. Solving their top fear drives activation and retention.
> - Estimated impact: High (multiplier effect + urgent pain)
>
> **S02-View-Results** (Priority #2)
> - Business Goal: BG01 - 5,000 active teams
> - Persona: Remote Team Leads
> - Driver: Desire for actionable insights (their #2 driver)
> - Why this matters: Completes the value loop from S01. Without seeing results, pulse check has no value.
> - Estimated impact: High (required for S01 to deliver value)
>
> **S03-Team-Setup** (Priority #3)
> - Business Goal: BG01 - 5,000 active teams
> - Persona: Remote Team Leads
> - Driver: Want simple onboarding (their #4 driver)
> - Why this matters: Prerequisite for S01. Must exist but isn't where the core value lives.
> - Estimated impact: Medium (enabler, not value driver)
>
> Should we start with S01?"

**Phase 3: Walk Through the 8-Question Dialog**

Once you select a scenario, Freya walks you through 8 questions — one at a time:

> **Freya:** "Let's outline Harriet's First Pulse Check. Q1: What transaction do we need to get really right for Harriet?"
>
> **You:** "Create and send her first pulse check to the team."
>
> **Freya:** "Q2: Which business goal does this serve?"
>
> **You:** "BG01 - getting 5,000 active teams."
>
> **Freya:** "Q3: Tell me about Harriet in this moment — who is she, where is she, what's happening?"
>
> **You:** "She just finished setting up her team. Monday morning before the weekly meeting. Cautiously optimistic but won't tolerate anything complicated."
>
> **Freya:** "Q4: What does she hope for and what does she fear?"

Each answer shapes the next question naturally. By Q8, the scenario outline is complete.

### How Freya Ranks Scenario Suggestions

Freya scores potential scenarios using:

**1. Strategic Alignment (40%)**
- Connection to top business goal: 20%
- Connection to priority persona: 10%
- Connection to top-ranked driver: 10%

**2. Impact Potential (30%)**
- Multiplier effect (does it bring more users?)
- Urgency of pain being solved
- Measurable business outcome

**3. Dependencies (20%)**
- Is this a prerequisite for other scenarios?
- Does it complete a value chain?
- What's the activation sequence?

**4. Scope Clarity (10%)**
- Can we define clear start/end states?
- Is the transaction well-bounded?
- Linear path possible?

**Freya shows her work:**

> **Freya:** "I ranked S01-First-Pulse-Check as #1 because:
> - ✓ Connects to your top business goal (BG01)
> - ✓ Serves your priority #1 persona (Team Leads)
> - ✓ Addresses their #1 driver (fear of burnout)
> - ✓ High multiplier (each lead brings a team)
> - ✓ Urgent pain (happening now)
> - ✓ Clear transaction (create → send → done)
>
> S02 ranked #2 because it completes the value chain but doesn't initiate it. S03 ranked #3 because it's an enabler, not core value."

### What Freya Needs From You

Freya can answer Q1 and Q2 automatically from your Trigger Map. She needs your input for:

**Q3: The real-life situation** — Only you know when and why this persona would actually use your product.

**Q4: Visceral driving forces** — Freya can reference your Trigger Map, but you refine the hope and worry to be specific to this transaction.

**Q6: How they actually arrive** — Only you know your marketing channels and discovery paths.

**Q8: The page flow** — Only you know your product's structure and what screens exist.

**Freya knows the "why" from your Trigger Map. You provide the "how" from your product knowledge.**

### Collaborative Flow

**Freya suggests → You validate → Together you detail**

```
Freya: "Your top 3 scenarios based on Trigger Map analysis..."
You: "Yes, S01 makes sense. But S03 should come before S01 - they need a team first."
Freya: "Good catch. Revising sequence: S03-Team-Setup, then S01-First-Pulse-Check."
You: "Exactly."
Freya: "Let's start with S03. How does a new user arrive at team setup?..."
```

**This is collaborative scenario identification**, not Freya dictating or you guessing.

### Freya's Questions (After Suggestions)

After suggesting scenarios, Freya asks clarifying questions:

> "I suggested S01-First-Pulse-Check as priority #1. Does this align with your product vision?"

> "Should S03-Team-Setup come before S01, or can they happen in parallel?"

> "I see a gap: How does the user get from signup to team setup? Is that a separate scenario?"

> "Looking at your top 3 suggested scenarios - do they form a complete activation flow, or are we missing steps?"

> "Your Trigger Map has 3 priority personas. Should we create parallel scenarios for each, or focus on Remote Team Leads first?"

**These questions refine the suggestions into a complete scenario roadmap.**

---

## Red Flags

Watch out for these signs that a scenario isn't ready:

❌ **"Users might want to..."** — Too vague, not connected to driving forces

❌ **Can't identify which persona** — Scenario isn't grounded in strategy

❌ **No clear business value** — Won't be sustainable

❌ **No clear user value** — Won't be used

❌ **Too many steps** — Not the shortest path

❌ **Branches everywhere** — This is multiple scenarios, not one

---

## Practical Exercise

**From your Trigger Map, answer the first 4 questions for your top scenario:**

1. **Q1:** What transaction do we need to get right? (user purpose, not feature name)
2. **Q2:** Which business goal does it serve?
3. **Q3:** Which persona, in what real-life situation?
4. **Q4:** What do they hope and fear?

**Write it down:**

```
Q1 Transaction: [What the user needs to accomplish]
Q2 Business Goal: [Which goal from your Trigger Map]
Q3 User & Situation: [Persona name + vivid context]
Q4 Hope: [One sentence]
Q4 Worry: [One sentence]

This becomes scenario: 01-[personas-purpose]
```

---

## What's Next

Now you know:
- ✓ What scenarios are (Lesson 1)
- ✓ How to identify which scenarios to create (Lesson 2)

Next lesson: **The 8-question dialog** — how Freya walks you through Q1-Q8 to create a complete scenario outline.

---

**[Continue to Lesson 3: Mapping the Journey →](lesson-03-mapping-the-journey.md)**

---

[← Back to Lesson 1](lesson-01-design-experiences-not-screens.md) | [Back to Module Overview](module-08-outline-scenarios-overview.md)

*Part of Module 08: Outline Scenarios*
