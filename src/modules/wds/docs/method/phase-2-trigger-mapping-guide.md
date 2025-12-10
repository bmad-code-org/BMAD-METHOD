# Phase 2: Trigger map

**Agent:** Saga the Analyst  
**Output:** `B-Trigger-Map/` (or your configured prefix)

---

## What This Phase Does

User Research connects business goals to user psychology through Trigger Mapping. You discover not just WHO your users are, but WHY they act and WHAT triggers their decisions.

By the end, you'll have a Trigger Map that visually shows how user success drives business success.

---

## What You'll Create

Your Trigger Map includes:

- **Business Goals** - What success looks like for your organization
- **Target Groups** - User types who can help achieve those goals
- **Personas** - Detailed profiles with psychological depth
- **Usage Goals** - What users want vs. what they fear
- **Visual Trigger Map** - Diagram connecting all the pieces
- **Priority Rankings** - Which goals, users, and drivers matter most
- **Feature Impact Analysis** - Scored feature list ranked by strategic value

---

## From Effect Mapping to Trigger Mapping

WDS Trigger Mapping is based on the groundbreaking **Effect Management** methodology from inUse, Sweden.

### Credits & Foundation

**Effect Management** was created by **Mijo Balic** and **Ingrid Domingues (Ottersten)** at **inUse**, Sweden. Their pioneering work on connecting business goals to user behavior through visual mapping - the **Effect Map** - laid the foundation for how we think about strategic software design.

The methodology gained wider recognition through Gojko Adzic's book **"Impact Mapping: Making a Big Impact with Software Products and Projects"** (2012), which acknowledges Effect Mapping as a key influence.

> **Founder's Note:** I personally acquired the insights about the power of the Effect Map back in 2007, and it has served as the philosophical basis for all of my work in UX for almost 20 years. I am eternally grateful for this model that I now have the pleasure to share with the world in an updated version suitable for modern projects.
> — _Martin Eriksson, WDS Creator_

📚 **Further Reading:**

- [Impact Mapping on Amazon](https://www.amazon.com/Impact-Mapping-Software-Products-Projects/dp/0955683645) - Gojko Adzic's book building on Effect Mapping concepts
- [impactmapping.org](https://www.impactmapping.org) - Resources and community

### What is Effect Mapping?

Effect Mapping is the original model that connects business goals to user behavior through a visual map. It includes business goals, target groups, usage goals, and the specific actions/features that enable those goals.

### What is Trigger Mapping?

Trigger Mapping is WDS's adaptation of Effect Mapping, designed for longer shelf life and deeper psychological insight:

**Simplified:**

- Leaves out actions/features from the map
- Focuses on the strategic connections
- Map stays relevant even as features evolve

**Enhanced:**

- Adds **negative driving forces** (fears, frustrations)
- Creates fuller picture of user psychology
- Both what users want AND what they want to avoid

### The Core Insight

Any software is about **flow of value**. There's always a group of people who, through their use of the software, make your success happen.

These users have their own goals:

- **GAIN** - Benefits and positive outcomes they achieve
- **PAIN** - Resistance and friction they experience

**The key:** Make GAIN > PAIN for users, so through their usage, they add value to your system.

### The Three Layers

The Trigger Map combines three critical layers in one picture:

1. **Business Goals** - Your WHY (Vision that motivates, and SMART objectives that measure success)
2. **Target Groups** - The WHO (User types whose success drives your success)
3. **Usage Goals** - Their WHY (Driving forces both positive - what they wish to achieve, and negative - what they wish to avoid)

When all levels are then prioritized, you have perfect guidance for design:

- Present features that add value to your most prioritized goal first
- To the highest prioritized target group
- In a way that best suits their most prioritized usage goal
- Make sound decisions about priority of bugs or features based on the total impact on users' goals

---

## How It Works

### Stage 1: Business Goals (15-20 minutes)

Starting question: "Looking at your product brief, what does 'winning' look like for your organization?"

Business goals work at two levels:

**Vision (Motivating, not easily quantifiable)**
A statement that inspires and guides direction:

- "Become the most popular free and open source design support framework"
- "Be the go-to partner for SMB digital transformation"
- "Make professional UX accessible to every startup"

**Objectives (SMART metrics)**
Specific, measurable targets that indicate progress toward the vision:

- "10,000 active designer users by 2027"
- "100 community contributions accepted by Q4 2026"
- "50% of users complete full 6-phase workflow"
- "NPS score of 60+ from design professionals"

You'll define both levels:

- Vision that motivates the team
- Objectives with clear success metrics

### Stage 2: Target Groups (20-30 minutes)

Key question: "Who needs to succeed for YOU to succeed?"

Instead of demographics, you discover:

- User types who can drive business success
- The role each type plays in your strategy
- How different users contribute differently
- Why each user type matters to business goals

Users become strategic assets, not just audience segments.

### Stage 3: Psychological Deep Dive (30-40 minutes)

For each user type:

"When this user type is at their best - when they're succeeding - what are they accomplishing? What are they feeling?"

"Now the flip side: What do they desperately want to avoid? What would feel like failure?"

This reveals:

- **Positive Triggers** - What motivates action
- **Negative Triggers** - What prevents engagement
- **Emotional Drivers** - The psychology behind decisions
- **Behavioral Patterns** - When and why they act

### Stage 4: Visual Strategy Map (15-20 minutes)

Saga helps build the complete trigger map:

- Connecting every user insight to business goals
- Creating the visual strategy guide
- Validating the strategic logic together

### Stage 5: Prioritization (20-30 minutes)

This stage is critical for shaping the final product concept. You systematically prioritize each column of the Trigger Map.

**The Prioritization Process:**

1. **Rank Business Goals** - Which goal matters most right now? Which is secondary?
2. **Rank Target Groups** - Which user types have the most impact on your top goal?
3. **Rank Usage Goals** - For your top users, which driving forces are most urgent?

**Why This Matters:**

Different prioritizations lead to fundamentally different products. The same Trigger Map can produce wildly different concepts depending on what you prioritize first.

### Stage 6: Feature Impact Analysis (20-30 minutes)

Now the magic happens. You connect strategy to concrete features using a systematic impact scoring approach.

**The Process:**

1. **Gather Feature Ideas** - Pull from your Product Brief, stakeholder input, and brainstorming
2. **Map to Target Groups** - For each feature, identify which target groups it serves
3. **Map to Driving Forces** - Which positive and negative drivers does it address?
4. **Score the Impact** - Features serving multiple groups and drivers score higher

**The Scoring System:** _(Beta - refinements welcome)_

For each feature, award points:

| Impact                                       | Points   |
| -------------------------------------------- | -------- |
| Serves Priority 1 Target Group               | +3       |
| Serves Priority 2 Target Group               | +2       |
| Serves Priority 3 Target Group               | +1       |
| Addresses Priority 1 Positive Driver         | +3       |
| Addresses Priority 2 Positive Driver         | +2       |
| Addresses Priority 3 Positive Driver         | +1       |
| **Addresses Priority 1 Negative Driver**     | **+4**   |
| **Addresses Priority 2 Negative Driver**     | **+3**   |
| **Addresses Priority 3 Negative Driver**     | **+2**   |
| Serves multiple target groups                | +2 bonus |
| Addresses both positive AND negative drivers | +2 bonus |

> **Why negative drivers score higher:** Loss aversion is a well-documented psychological principle - humans work harder to avoid pain than to pursue gain. Features that remove friction, fear, or frustration create stronger user loyalty than features that simply add benefits.

**Example:**

| Feature           | Target Groups                     | Driving Forces                                                                    | Score  |
| ----------------- | --------------------------------- | --------------------------------------------------------------------------------- | ------ |
| One-click booking | P1 Dog Owner (+3), P2 Walker (+2) | Convenience (+3), Fear of complexity (-P1: +4), Multi-group (+2), Both types (+2) | **16** |
| Review system     | P1 Dog Owner (+3)                 | Trust (+2), Fear of bad walker (-P1: +4), Both types (+2)                         | **11** |
| Calendar sync     | P2 Walker (+2)                    | Efficiency (+1)                                                                   | **3**  |

**The Output:**

A ranked feature list showing:

- Which features have the broadest impact
- Which features are "single-purpose" vs "multi-impact"
- Natural MVP candidates (highest scores)
- Features to defer (low scores but still valuable)

**Why This Works:**

Features that resonate with multiple target groups and address multiple driving forces are inherently more valuable. They create more value per development effort and satisfy more users simultaneously.

---

## Personas with Depth

Traditional personas describe demographics: "Jennifer, 34, likes yoga and lattes."

WDS personas capture psychology:

**Alliterative Naming** - Each persona gets a memorable name that hints at their role:

- "Patrick the Professional" - Decision-maker focused on efficiency
- "Sophie the Socializer" - Values connection and community
- "Tyler the Technical" - Wants control and customization

**What Each Persona Includes:**

- Role and context
- Goals they're trying to achieve
- Fears and frustrations
- How they'd describe their problem
- What success looks like to them
- Triggers that motivate action

---

## When to Use This Phase

**Use after Phase 1 if:**

- Building a new product
- Need clarity on who you're building for
- Want design decisions grounded in user psychology

**Start here if:**

- You have product vision but unclear user strategy
- Existing personas feel shallow or unused
- Features aren't connecting with users

**Skip if:**

- Quick enhancement to existing feature
- Users are already well-documented and validated
- Design system work without new user research

---

## What to Prepare

Bring:

- Your completed Product Brief (Phase 1)
- Any existing user research (even informal)
- Stakeholder availability for the workshop

---

## What Comes Next

Your Trigger Map enables:

- **Phase 3: Requirements** - Technical decisions aligned with user priorities
- **Phase 4: UX Design** - Design work grounded in user psychology
- **Development priorities** - Clear guidance on what to build first

The trigger map becomes the strategic brain of your product.

---

## Tips for Great Sessions

**Think strategically, not demographically**

- "Who needs to win for us to win?" not "Who might use this?"
- Connect every user insight to business outcomes

**Go deep on psychology**

- Push beyond surface responses
- Ask "why" multiple times
- Understand motivations, not just behaviors

**Build the map live**

- See connections as they emerge
- Validate strategic logic together
- Make it visual and shareable

---

## Example Output

See: `examples/dog-week-patterns/B-Trigger-Map/` for a complete Trigger Map with personas from a real project.

---

_Phase 2 of the Whiteport Design Studio method_
