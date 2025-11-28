# Define Vision Workflow

## Overview

This workflow guides the definition or refinement of product vision, mission, and strategic direction. A clear vision aligns the entire organization and guides every product decision.

## Prerequisites

- Founder agent activated
- Module config loaded

## Workflow Stages

### Stage 1: Gather Context

**Objective:** Understand the current state and gather inputs for vision work.

**Questions to explore:**

1. **Current State**
   - Is this a new vision or updating an existing one?
   - If updating: What prompted this revision?
   - What has changed in the market, customer needs, or business?

2. **Inputs Available**
   - Any customer research or feedback?
   - Market analysis or competitive intelligence?
   - Team insights or concerns?
   - Investor/stakeholder input?

3. **Constraints**
   - Any non-negotiable constraints (technical, regulatory, resource)?
   - Timeline pressures?
   - Existing commitments that must be honored?

**Output:** Context summary for vision work

---

### Stage 2: Define Customer

**Objective:** Crystallize who we're building for and what problem we're solving.

**Framework: Customer Problem Statement**

Complete this template:

```
[Target customer segment]
who [has this specific problem/need]
currently [solves it this way / doesn't solve it]
and experiences [these pain points/frustrations]
```

**Questions to explore:**

1. **Customer Segment**
   - Who specifically are we targeting? (Be specific, not "everyone")
   - What defines this segment? (Company size, role, industry, behavior)
   - Why this segment vs. others?

2. **Problem Definition**
   - What problem are we solving?
   - How painful is this problem? (Nice-to-solve vs. must-solve)
   - How do they solve it today?
   - What triggers them to seek a solution?

3. **Validation**
   - How do we know this problem exists?
   - What evidence do we have?
   - Have we talked to potential customers?

**Output:** Clear customer problem statement

---

### Stage 3: Define Solution

**Objective:** Articulate what we're building and the value it provides.

**Framework: Solution Value Statement**

Complete this template:

```
[Product name] is a [category]
that helps [target customer]
[achieve this outcome / solve this problem]
by [key mechanism / approach]
```

**Questions to explore:**

1. **Product Definition**
   - What category does this product belong to?
   - What is the core functionality?
   - What's the primary use case?

2. **Value Delivered**
   - What outcome does the customer achieve?
   - What pain is eliminated?
   - What gain is created?
   - How do we measure success for the customer?

3. **Approach**
   - How does the product deliver this value?
   - What's the key insight or mechanism?
   - Why does this approach work?

**Output:** Clear solution value statement

---

### Stage 4: Define Differentiation

**Objective:** Identify what makes this product uniquely valuable.

**Framework: Differentiation Analysis**

For each potential differentiator, evaluate:
- Is it meaningful to customers?
- Is it believable/credible?
- Is it defensible over time?
- Is it unique to us?

**Questions to explore:**

1. **Competitive Landscape**
   - Who are the main alternatives? (Competitors, substitutes, status quo)
   - How do customers perceive these alternatives?
   - What do alternatives do well/poorly?

2. **Our Unique Advantage**
   - What can we do that competitors can't easily copy?
   - What's our unfair advantage? (Technology, team, data, distribution, brand)
   - What would make a customer choose us over alternatives?

3. **Positioning**
   - How do we want to be perceived?
   - What's our category position? (Leader, challenger, niche specialist)
   - "Unlike [competitor], we [differentiator]"

**Output:** 3-5 key differentiators with supporting rationale

---

### Stage 5: Synthesize Vision

**Objective:** Create the vision and mission statements.

**Vision Statement Framework**

A vision statement describes the future state we're creating. It should be:
- **Aspirational:** Describes an inspiring future
- **Clear:** Easy to understand and remember
- **Timeless:** Doesn't change frequently
- **Motivating:** Energizes the team

Template:
```
To [achieve this future state/outcome]
for [target beneficiaries]
by [our approach/mechanism]
```

Examples:
- "To organize the world's information and make it universally accessible"
- "To accelerate the world's transition to sustainable energy"
- "To give everyone the power to create and share ideas instantly"

**Mission Statement Framework**

A mission statement describes how we achieve the vision day-to-day:
- **Actionable:** Describes what we do
- **Focused:** Specific enough to guide decisions
- **Measurable:** Progress can be assessed

Template:
```
We [action verb] [target customers]
[achieve outcome]
through [our approach]
```

**Output:** Draft vision and mission statements

---

### Stage 6: Validate & Commit

**Objective:** Review, refine, and finalize the vision.

**Validation Checklist:**

- [ ] **Clarity Test:** Can someone unfamiliar understand it in 30 seconds?
- [ ] **Inspiration Test:** Does it motivate and energize?
- [ ] **Focus Test:** Does it help say "no" to off-strategy ideas?
- [ ] **Longevity Test:** Will this still be relevant in 5 years?
- [ ] **Authenticity Test:** Does it reflect who we truly are/want to be?
- [ ] **Differentiation Test:** Is this distinct from competitors' visions?

**Questions to finalize:**

1. Does this vision align with our values and capabilities?
2. Can we credibly pursue this vision?
3. Does the team believe in this direction?
4. Are there any red flags or concerns?

**Refinement:**
- Read it aloud - does it sound natural?
- Remove jargon and buzzwords
- Simplify wherever possible
- Ensure it's memorable

**Final Output:**

Document in config.yaml:
```yaml
vision:
  statement: "[Final vision statement]"
  mission: "[Final mission statement]"
  value_proposition: "[Clear value prop]"
  differentiators:
    - "[Differentiator 1]"
    - "[Differentiator 2]"
    - "[Differentiator 3]"
  target_customer: "[Customer segment]"
```

---

## Events Published

On completion:
- `vision.defined` - If this is a new vision
- `vision.updated` - If updating existing vision

Event payload:
```yaml
vision_statement: "[statement]"
mission: "[mission]"
value_proposition: "[value prop]"
differentiators: [list]
target_customer: "[segment]"
```

---

## Next Steps

After defining vision:
1. **Set Priorities** → `*priorities` - Define what we focus on first
2. **Market Positioning** → `*positioning` - Align market messaging
3. **Communicate** → Share with team and stakeholders

---

## Tips for Success

1. **Be specific, not generic** - "Everyone" is not a target customer
2. **Choose focus** - Trying to be everything means being nothing
3. **Stay grounded** - Aspirational but achievable
4. **Iterate** - Vision can evolve as you learn
5. **Communicate often** - A vision only works if people know it
