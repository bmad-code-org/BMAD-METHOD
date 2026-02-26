# Impact/Effect Mapping

**A visual strategic planning technique that connects business goals to user behaviors and features**

**Originated by:** Mijo Balic & Ingrid Domingues (Ottersten) at inUse, Sweden  
**Popularized by:** Gojko Adzic, *Impact Mapping* (2012)  
**Applied in WDS:** Trigger Mapping, strategic alignment

---

## What It Is

**Effect Mapping** (the original methodology) and **Impact Mapping** (Gojko Adzic's adaptation) are visual strategic planning techniques that create a map connecting:

1. **Business Goals** (Why are we building this?)
2. **Actors** (Who will help us achieve the goal?)
3. **Impacts** (How should their behavior change?)
4. **Deliverables** (What can we build to create those impacts?)

The result is a visual map that shows the strategic connections between what you build and what you want to achieve.

**Core Structure:**

```
WHY → WHO → HOW → WHAT

Goal → Actors → Behavioral Changes → Features/Deliverables
```

**Example:**

```
Goal: 30% increase in premium conversions
  ↓
  → Free users
      ↓
      → Use advanced features more
          ↓
          → Feature usage analytics dashboard
          → In-app upsell prompts
      ↓
      → See clear ROI from upgrade
          ↓
          → ROI calculator
          → Case studies
```

---

## Why It Matters

### The Problem Without Impact/Effect Mapping

Traditional feature roadmaps start with "what to build":
- Features disconnected from business goals
- No clear understanding of WHO will drive success
- Assumptions about user behavior go untested
- Hard to prioritize features objectively
- Teams argue about opinions, not strategy

### The Solution With Impact/Effect Mapping

Strategic clarity from goal to execution:
- Every feature traces back to a business goal
- Clear identification of whose behavior drives success
- Explicit assumptions about behavioral change
- Objective prioritization based on strategic impact
- Alignment across team on WHY before arguing about WHAT

**The Revolutionary Insight:** Users drive business success through their behaviors. Map those connections visually to make better decisions.

---

## How It's Valuable in Strategic Design

### 1. **Prevents Feature Bloat**

Question: "Should we build [feature]?"  
Answer: "Does it appear on our Impact Map? Which goal and actor does it serve?"

If it's not on the map, you probably don't need it.

### 2. **Enables Rapid Prioritization**

When features connect to:
- Most important goals
- Most impactful actors
- Most significant behavioral changes

...they rise to the top naturally.

### 3. **Facilitates Strategic Conversations**

Instead of debating features, discuss:
- Are these the right goals?
- Who else could help achieve them?
- What other behavioral changes could work?
- What's the cheapest way to test this impact?

### 4. **Supports Iterative Delivery**

Build minimum features to test behavioral assumptions:
- Ship smallest feature that could change behavior
- Measure actual vs. expected impact
- Adjust based on data
- Add features only if needed

### 5. **Creates Shared Understanding**

Visual map shows entire team:
- Strategic priorities
- How their work connects to goals
- Who they're building for
- What success looks like

---

## Attribution and History

### Effect Management - The Origin (inUse, Sweden)

**Effect Management** was pioneered in the early 2000s by **Mijo Balic** and **Ingrid Domingues (Ottersten)** at **inUse**, a Swedish user experience consultancy.

Their breakthrough insight: Software projects fail not from technical problems, but from building things that don't achieve desired business effects through user behavior.

**Effect Mapping** was their visual technique for:
- Identifying whose behavior drives business success
- Mapping connections from goals → users → behaviors → features
- Making strategic assumptions explicit and testable

**Key Innovation:** Putting USERS in the middle of strategic planning, not just at the end (UX testing).

### Impact Mapping - The Book (Gojko Adzic, 2012)

**Gojko Adzic**, a software consultant, learned about Effect Mapping and saw its power for agile software development. He wrote **"Impact Mapping: Making a Big Impact with Software Products and Projects"** (2012), which:

- Brought Effect Mapping concepts to wider software community
- Adapted the methodology for agile/iterative development
- Added techniques for collaborative map-building
- Provided extensive examples and templates
- Credited Effect Mapping as foundational influence

**Adzic's Contribution:** Making the methodology accessible, practical, and adapted for modern agile workflows.

### Founder's Note

> I personally acquired the insights about the power of the Effect Map back in 2007, and it has served as the philosophical basis for all of my work in UX for almost 20 years. I am eternally grateful for this model that I now have the pleasure to share with the world in an updated version suitable for modern projects.
>
> — _Martin Eriksson, WDS Creator_

---

## Source Materials

### Books

📚 **Impact Mapping: Making a Big Impact with Software Products and Projects**  
By Gojko Adzic (2012)

- The most accessible introduction to the methodology
- Practical workshop techniques
- Extensive examples
- Template and guide included
- [Available on Amazon](https://www.amazon.com/Impact-Mapping-Software-Products-Projects/dp/0955683645)

### Websites

🔗 **[ImpactMapping.org](https://www.impactmapping.org)**
- Official Impact Mapping website
- Free resources and templates
- Community examples
- Workshop guides

🔗 **[inUse - Effect Management](https://inuse.se)**
- Original creators of Effect Mapping
- Swedish consultancy pioneering user-centered strategic planning

### Articles

🔗 **"Introducing Impact Mapping"** - Gojko Adzic  
[https://www.impactmapping.org/book.html](https://www.impactmapping.org/book.html)

🔗 **"Effect Mapping: Making the right thing"** - Various authors  
Search for "Effect Mapping inUse" for historical context

### Videos

🎥 **"Impact Mapping" by Gojko Adzic** - Various conference talks  
[Search YouTube for "Gojko Adzic Impact Mapping"](https://www.youtube.com/results?search_query=gojko+adzic+impact+mapping)

🎥 **Workshop recordings and tutorials** - Multiple practitioners  
[Search for "Impact Mapping workshop"](https://www.youtube.com/results?search_query=impact+mapping+workshop)

---

## Whiteport Methods That Harness This Model

### [Trigger Mapping Guide](../method/phase-2-trigger-mapping-guide.md)

Whiteport's enhanced adaptation of Effect/Impact Mapping:

**Keeps:**
- Goals → Actors (Users) structure
- Visual mapping technique
- Strategic alignment from business goals to user psychology

**Critical Differences:**

**Solutions NOT on the map:**
- Original Impact/Effect Mapping: Features/deliverables connected to each usage goal
- Problem: Created enormous wall-sized maps, very short shelf life when scope changed
- Trigger Map: Solutions are NOT on the map at all
- Solutions are envisioned AGAINST all driving forces after mapping
- Result: Map stays relevant as features and solutions evolve

**Driving Forces (not just Impacts):**
- Clear distinction between positive (wishes) and negative (fears) driving forces
- Both are mapped and prioritized
- Solutions address both types of forces

**Smaller, Focused Maps:**
- Maximum 3-4 target groups per map
- Manageable number of driving forces per user
- Large projects use multiple Trigger Maps for different software parts
- Not one enormous map covering entire system

**Prioritization:**
- Driving forces and target groups are prioritized
- Some matter more than others
- Guides which forces to address first

**Result:** A compact, long-lived strategic map that guides solution design without becoming outdated.

### [Feature Impact Analysis](../method/phase-2-trigger-mapping-guide.md)

A separate method (also derived from Impact Mapping) that uses the Trigger Map:

**Purpose:** Score and prioritize features based on strategic impact

**Process:**
- Take completed Trigger Map (with prioritized goals, users, driving forces)
- For each potential feature, score its impact on driving forces
- Calculate total strategic value
- Rank features by impact, not opinion

**Result:** Objective feature prioritization based on which features serve the most important driving forces for the most important users toward the most important goals.

**Note:** This is a distinct method that USES the Trigger Map data, to be fair to Impact Mapping's influence on this approach.

### Trigger Mapping

Whiteport's adaptation extracting core strategic elements:

- Business Goal (from Effect/Impact Mapping)
- Solution (combines Actor context + Impact)
- User (Actor with psychological depth)
- Driving Forces (Positive and negative impacts)
- Feature Impact Analysis (scored prioritization)

**Result:** Minimum viable strategic context, perfect for quick projects or prototypes.

---

## Imaginary Examples

### Example 1: E-Learning Platform

**Traditional Feature List:**
- Video hosting
- Quiz builder
- Certificate generation
- Discussion forums
- Mobile app

**Impact Map:**

```
GOAL: 50% course completion rate (currently 15%)

WHO: Course students
  HOW: Practice more consistently
    WHAT: 
      - Daily practice reminders
      - Streak tracking
      - Quick 5-min exercises
  
  HOW: Feel accountable to others
    WHAT:
      - Study groups
      - Peer check-ins
      - Social progress sharing

WHO: Course instructors  
  HOW: Identify struggling students early
    WHAT:
      - Analytics dashboard
      - At-risk student alerts
  
  HOW: Provide timely encouragement
    WHAT:
      - One-click praise
      - Automated milestone celebrations
```

**Notice:** No video hosting, no mobile app on the map. Why? They don't directly increase completion rates. The map reveals this.

### Example 2: SaaS Product

**Traditional Roadmap:**
- Advanced reporting
- API integrations
- Custom workflows
- White labeling

**Impact Map:**

```
GOAL: $500K ARR from enterprise customers

WHO: IT managers at mid-size companies
  HOW: Reduce security review time from 3 months to 2 weeks
    WHAT:
      - SOC 2 compliance package
      - Security documentation
      - Pre-filled questionnaires
  
  HOW: Get buy-in from reluctant teams
    WHAT:
      - Gradual rollout features
      - Team-by-team permissions
      - Change management guide

WHO: End users at those companies
  HOW: Adopt tool without training
    WHAT:
      - Import from old tool
      - Familiar keyboard shortcuts
      - Contextual help
```

**Notice:** Custom workflows appear nowhere. White labeling might not matter. Security and adoption are what drive enterprise sales.

### Example 3: E-Commerce Site

**Goal:** 25% increase in average order value

**Impact Map:**

```
WHO: First-time buyers
  HOW: Discover complementary products
    WHAT:
      - "Complete the look" suggestions
      - "Frequently bought together"
  
  HOW: Feel confident about quality
    WHAT:
      - Detailed product descriptions
      - Customer photos/reviews
      - Easy returns

WHO: Repeat customers
  HOW: Try premium products
    WHAT:
      - "Upgrade to [premium]" suggestions
      - Side-by-side comparisons
      - Loyalty rewards toward premium items
  
  HOW: Stock up on favorites
    WHAT:
      - Subscribe and save
      - Bulk discounts
      - Replenishment reminders
```

---

## Real Applications

### WDS Presentation Project

The WDS Presentation uses Trigger Mapping (Whiteport's adaptation of Effect/Impact Mapping) to connect business goals to user psychology.

**See:** [WDS Presentation Trigger Map](../examples/WDS-Presentation/docs/2-trigger-map/00-trigger-map.md)

**Strategic Structure:**
- **Business Goals:** Newsletter signups, demo bookings, community growth
- **Actors:** Stina (designer), Lars (executive), Felix (developer)
- **Impacts/Driving Forces:** Each persona's wishes and fears mapped
- **Deliverables:** Landing page sections targeting specific driving forces

The Trigger Map shows WHY each section of the landing page exists and WHO it serves.

---

## How Effect/Impact Mapping Works

### Step 1: Define the Goal (5-10 minutes)

What business outcome do you want?

**Good Goals:**
- Measurable: "30% increase in conversions"
- Time-bound: "500 signups in Q1"
- Specific: "Reduce churn from 8% to 5%"

**Bad Goals:**
- Vague: "Better engagement"
- No metric: "More satisfied users"
- Too many: "Increase revenue, satisfaction, and features"

**Pro Tip:** One map = one primary goal. Make multiple maps if needed.

### Step 2: Identify Actors (15-20 minutes)

WHO can help achieve this goal through their behavior?

**Brainstorm:**
- Direct users (buyers, subscribers, active users)
- Indirect influencers (administrators, decision makers, reviewers)
- Internal actors (support team, sales team)
- External actors (partners, integration users)

**Prioritize:**
- Which actors have biggest potential impact?
- Which are easiest to influence?
- Which represent low-hanging fruit?

### Step 3: Define Impacts (20-30 minutes)

For each key actor: HOW should their behavior change?

**Good Impacts:**
- Specific: "Use feature X twice per week"
- Observable: "Refer at least one colleague"
- Connected to goal: Clear link between behavior and business outcome

**Bad Impacts:**
- Vague: "Be more engaged"
- Internal state: "Understand our value" (not a behavior)
- Disconnected: No clear link to goal

**Brainstorm multiple impacts per actor** - not just one "right" answer.

### Step 4: Generate Deliverables (30-45 minutes)

For each impact: WHAT could we build to enable it?

**Brainstorm widely:**
- Features
- Content
- Processes
- Integrations
- Services

**Don't commit yet** - list options, don't design solutions.

**Pro Tip:** Ask "What's the cheapest way to test if this impact actually helps?" before building the big solution.

### Step 5: Prioritize and Plan (20-30 minutes)

Which deliverables to build first?

**Consider:**
- Strategic importance (closest to goal)
- Certainty (known vs. assumed impact)
- Effort (quick wins vs. major projects)

**Build iteratively:**
1. Start with highest-value, lowest-effort, highest-certainty
2. Measure actual impact
3. Adjust based on data
4. Continue

---

## Common Questions

### Q: How is Impact Mapping different from user stories?

**A:** User stories describe WHAT to build ("As a user, I want..."). Impact Mapping explains WHY we're building it (to change this actor's behavior to achieve this goal). Use Impact Mapping first for strategy, then write user stories for execution.

### Q: How often should I update the map?

**A:** When assumptions prove wrong, goals change, or you discover new actors/impacts. The map is a living document, not a one-time exercise.

### Q: Can I have multiple goals on one map?

**A:** Technically yes, but it gets messy. Better to create separate maps for distinct goals and see where they overlap or conflict.

### Q: What if an actor helps multiple goals?

**A:** That actor appears on multiple maps (or multiple branches if goals are related). This highlights high-leverage users who drive multiple outcomes.

### Q: Should features appear on the map?

**A:** In traditional Impact Mapping, yes. In Whiteport's Trigger Mapping, no - we focus on goals, users, and driving forces for longer shelf life. Features live in separate planning documents.

### Q: How detailed should impacts be?

**A:** Specific enough to measure. "Use more" is too vague. "Log in 3x per week" or "Complete onboarding" are measurable.

---

## Impact Mapping vs. Trigger Mapping

### Traditional Impact Mapping

```
Goal
  → Actor
      → Impact (behavioral change)
          → Deliverable (feature)
          → Deliverable (feature)
      → Impact
          → Deliverable
```

**Pros:**
- Direct connection to features
- Complete strategic picture
- Good for short-term planning

**Cons:**
- Map becomes outdated as features change
- Focuses on behaviors, not psychology
- Positive impacts only (what users DO, not what they AVOID)

### Whiteport Trigger Mapping

```
Goal
  → User (Actor with psychological depth)
      → Driving Force (positive - wish to achieve)
      → Driving Force (negative - fear to avoid)
      → Customer Awareness positioning

[Features live in separate planning docs, reference the map]
```

**Pros:**
- Map stays relevant as features evolve
- Richer psychological insight
- Both positive and negative motivation
- Awareness positioning adds strategic layer

**Cons:**
- Slightly less direct connection to features
- Requires separate feature planning step

**Bottom Line:** Both use the same core strategic insight (users drive business success). Trigger Mapping optimizes for longevity and psychological depth.

---

## Getting Started with Impact/Effect Mapping

### For Your Next Project

1. **Gather team** (30-90 minutes total)
2. **Start with goal:** What business outcome matters most?
3. **List actors:** Who can help achieve it?
4. **Brainstorm impacts:** How should their behavior change?
5. **Generate ideas:** What could we build?
6. **Prioritize:** What to test first?
7. **Build and measure:** Did it work?

### Tools Needed

- Whiteboard or large paper (physical)
- Miro/Mural/FigJam (digital)
- Sticky notes (physical)
- Team with diverse perspectives

### Workshop Format

- **30 minutes:** Intro and goal definition
- **45 minutes:** Actors and impacts
- **30 minutes:** Deliverable ideas
- **15 minutes:** Prioritization and next steps

**Total: 2 hours well spent**

---

## Next Steps

1. **Read:** Get Gojko Adzic's book for full methodology
2. **Try:** Run a simple Impact Mapping session for current project
3. **Compare:** See how Whiteport's Trigger Mapping adapts the concepts
4. **Choose:** Decide if you need a slim Trigger Map, full Impact Map, or comprehensive Trigger Map

**Related Resources:**
- [Trigger Mapping Guide](../method/phase-2-trigger-mapping-guide.md) - Whiteport's adaptation
- [ImpactMapping.org](https://www.impactmapping.org) - Official resources

---

*Impact/Effect Mapping - Strategic clarity from why to what, with users driving success.*

