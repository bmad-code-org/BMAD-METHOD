# Value Trigger Chain Creation Workshop

**Purpose:** Create a VTC from scratch when no Trigger Map exists

**Duration:** 20-30 minutes

**When to use:** No Trigger Map, early stage, quick projects, standalone scenarios

---

## Workshop Overview

We'll imagine the strategic chain by answering 5 key questions:

1. **Business Goal** - What success looks like (5 mins)
2. **Solution** - What we're building (2 mins)
3. **User** - Who will use it (5 mins)
4. **Driving Forces** - What motivates them (10 mins)
5. **Customer Awareness** - Where they start/end (5 mins)

**Output:** A complete VTC ready to guide design decisions

---

## Step 1: Define Business Goal (5 minutes)

**Ask:**
> "What does success look like for the business? What measurable outcome do we want?"

**Guidelines:**
- Be specific and measurable
- Include timeframe if relevant
- One primary goal (can mention secondary)

**Good Examples:**
- "500 newsletter signups in Q1"
- "30% increase in premium conversions"
- "Reduce support tickets by 40%"

**Bad Examples:**
- "More engagement" (vague)
- "Better user experience" (not measurable)
- "Lots of features and happy users" (too many things)

**Capture:**
```yaml
business_goal: "[Specific, measurable outcome]"
```

**Validation Questions:**
- Can we measure this?
- Is this achievable?
- Is this one clear goal?

---

## Step 2: Identify Solution (2 minutes)

**Ask:**
> "What are you building to achieve this goal?"

**Guidelines:**
- Be specific about what this is
- Not features list - the thing itself
- Connection point between business and user

**Examples:**
- "Landing page with lead magnet offer"
- "Onboarding flow for new users"
- "Premium upgrade prompt in app"
- "Self-service help center"

**Capture:**
```yaml
solution: "[The thing being built]"
```

**Validation:**
- Does this serve the business goal?
- Will users actually interact with this?
- Is this focused (not too broad)?

---

## Step 3: Describe User (5 minutes)

**Ask:**
> "Who is the primary user for this solution? Tell me about them."

**Guidelines:**
- Go beyond demographics to psychology
- One primary user (add others later if needed)
- Include context of when/where they encounter solution

**Template:**
```
[Name] ([role/context], [key traits])
Context: [when/where they use solution]
Current state: [what they're trying to accomplish]
```

**Example:**
```
Harriet (hairdresser, ambitious, small-town)
Context: Late evening, researching trends
Current state: Wants to stay ahead of local competitors
```

**Capture:**
```yaml
user:
  name: "[Name/Type]"
  description: "[Role, traits, context]"
  context: "[When/where they encounter solution]"
  current_state: "[What they're trying to accomplish]"
```

**Validation Questions:**
- Can you picture this person?
- Why would they care about this solution?
- What are they trying to achieve?

---

## Step 4: Identify Driving Forces (10 minutes)

**This is the core of the VTC.** Spend time here!

### 4A: Positive Driving Forces (5 minutes)

**Ask:**
> "What does this user WANT to achieve? What would make them feel successful?"

**Guidelines:**
- Think aspirations, not just functional needs
- What would they brag about?
- What makes them feel capable/proud?

**Brainstorm 3-5 wishes:**

Example questions:
- "What would 'winning' look like for them?"
- "What outcome would they be proud of?"
- "What capability would transform their work/life?"

**Capture:**
```yaml
driving_forces:
  positive:
    - "Wish to [aspiration]"
    - "Wish to [aspiration]"
    - "Wish to [aspiration]"
```

### 4B: Negative Driving Forces (5 minutes)

**Ask:**
> "What does this user FEAR or want to avoid? What keeps them up at night?"

**Guidelines:**
- Think anxieties, frustrations, risks
- What would feel like failure?
- What are they trying to prevent?

**Brainstorm 2-3 fears:**

Example questions:
- "What are they worried about?"
- "What would be embarrassing/costly?"
- "What friction do they currently experience?"

**Capture:**
```yaml
driving_forces:
  negative:
    - "Fear of [anxiety]"
    - "Fear of [frustration]"
    - "Avoid [problem]"
```

### 4C: Validate and Refine

**Review the list together:**
- Do these feel true for this user?
- Are they specific enough to inform design?
- Do positive and negative connect (often opposite sides)?

**Example:**
- ✅ Positive: "Wish to be local beauty authority"
- ✅ Negative: "Fear of missing industry trends"
- (These are connected - both about staying ahead)

**Tip:** You don't need many. 3-5 total driving forces are sufficient if they're the RIGHT ones.

---

## Step 5: Position Customer Awareness (5 minutes)

**Explain the concept:**
> "Customer Awareness is where the user is NOW in their understanding, and where we want to move them."

**The 5 Stages:**
1. **Unaware** - Doesn't know problem exists
2. **Problem Aware** - Knows problem, doesn't know solutions
3. **Solution Aware** - Knows solutions exist, doesn't know yours
4. **Product Aware** - Knows your solution, hasn't committed
5. **Most Aware** - Has used, loved, advocates

### 5A: Identify Starting Point

**Ask:**
> "Where is this user NOW when they encounter your solution?"

**Help them choose:**
- "Do they know the problem exists?" (If no → Unaware)
- "Do they know solutions exist?" (If no → Problem Aware)
- "Do they know about YOUR solution?" (If no → Solution Aware)
- "Have they tried your solution?" (If no → Product Aware)

**Capture:**
```yaml
customer_awareness:
  start: "[Current stage]"
```

### 5B: Define Target End Point

**Ask:**
> "Where do you want to move them with this interaction?"

**Guidelines:**
- Usually move 1-2 stages (not jumping from Unaware to Most Aware)
- Consider what's realistic for this solution type
- Landing page might move Problem → Product Aware
- Onboarding might move Product → Most Aware

**Capture:**
```yaml
customer_awareness:
  start: "[Current stage]"
  end: "[Target stage]"
```

### 5C: Validate Connection

**Check:**
- Does moving from [start] to [end] help achieve business goal?
- Is this progression realistic for this solution?
- Does this match the driving forces we identified?

**Example:**
```yaml
customer_awareness:
  start: "Problem Aware"  # Knows they need to stay current
  end: "Product Aware"    # Knows OUR newsletter helps
# Makes sense: Landing page educates about our specific solution
```

---

## Step 6: Review Complete VTC

**Read back the complete VTC:**

```yaml
vtc:
  business_goal: "[Goal]"
  solution: "[Solution]"
  user:
    name: "[Name]"
    description: "[Description]"
    context: "[Context]"
  driving_forces:
    positive:
      - "[Wish 1]"
      - "[Wish 2]"
    negative:
      - "[Fear 1]"
      - "[Fear 2]"
  customer_awareness:
    start: "[Start stage]"
    end: "[End stage]"
```

**Validation Questions:**

1. **Coherence:** Does this tell a coherent story?
2. **Actionable:** Can you make design decisions from this?
3. **Specific:** Are the driving forces specific enough?
4. **Realistic:** Does the awareness progression make sense?

**Test it:**
> "If someone reads this VTC, would they understand WHY we're building WHAT for WHOM, and what the user wants to achieve?"

If yes → VTC is complete!  
If no → Which part needs refinement?

---

## Step 7: Document and Save

**Create VTC file:**

File location depends on use case:
- **Product Pitch:** `docs/A-Product-Brief/vtc-primary.yaml`
- **Scenario:** `docs/D-UX-Design/[scenario-name]/vtc.yaml`

**Use template:** [vtc-template.yaml](./vtc-template.yaml)

**Add notes section:**
```yaml
notes: |
  Created: [Date]
  Created by: [Name/Team]
  Context: [Why this VTC was created]
  
  Key insights:
  - [Any important realizations during workshop]
  - [Decisions made and why]
```

---

## Step 8: Communicate Purpose

**Explain to user what they now have:**

> "Great! We've created a Value Trigger Chain that shows:
> 
> - **Business Goal:** [goal]
> - **User:** [name] who wants to [positive force] and avoid [negative force]
> - **Solution:** [solution] that moves them from [start] to [end] awareness
> 
> This VTC will guide all design decisions for [context]. Every piece of content, every interaction should serve this strategic chain."

**Next steps depend on context:**

**If Product Pitch:**
- Add VTC to pitch document
- Use VTC to structure pitch narrative
- Can evolve into full Trigger Map later

**If Scenario:**
- VTC anchors this scenario
- All pages inherit this VTC
- Can create additional VTCs for other scenarios

---

## Common Questions During Workshop

### "Can I have multiple users?"

For a single VTC, focus on ONE primary user. You can:
- Create additional VTCs for other users
- Or list secondary user in notes
- Don't try to serve everyone in one VTC

### "Can business goals change?"

Yes! VTCs can evolve as you learn. Version them if significant changes:
- vtc-v1.yaml (original)
- vtc-v2.yaml (refined after learning)

### "How many driving forces should I have?"

**Minimum:** 2 (one positive, one negative)  
**Sweet spot:** 4-5 total (2-3 positive, 2-3 negative)  
**Maximum:** 7-8 (beyond this, lose focus)

Quality over quantity. Better to have 3 powerful driving forces than 10 generic ones.

### "What if I'm not sure about Customer Awareness?"

Make your best guess and test:
- Where do users seem confused? (might be wrong starting point)
- Where do they lose interest? (might be wrong progression)
- Adjust VTC based on what you learn

### "Can I skip Customer Awareness?"

You CAN, but you lose strategic guidance for content depth and messaging. Even a rough estimate is better than nothing.

---

## Workshop Tips for Agents

### Keep Momentum
- Don't let user get stuck on perfection
- "We can refine later, let's capture first version"
- Move through steps at steady pace

### Ask Follow-up Questions
- If answer is vague: "Can you be more specific?"
- If stuck: "What would [user name] say about this?"
- If too broad: "If you had to pick ONE, which matters most?"

### Use Examples
- Show good vs bad examples
- Reference examples from VTC guide
- Make concepts concrete

### Validate as You Go
- Quick checks at each step
- Catch issues early
- Build confidence

### Celebrate Completion
- Acknowledge this is valuable work
- Explain what they can now do with VTC
- Create clear next steps

---

## Troubleshooting

**Problem:** User can't think of driving forces

**Solution:** Ask about:
- What does success look like for them?
- What would they tell their friends about?
- What frustrates them in current situation?
- What would make them switch to competitor?

**Problem:** Too many driving forces (scattered)

**Solution:**
- "Which 3 matter MOST?"
- Look for themes/grouping
- Focus ruthlessly

**Problem:** Generic statements ("want to save time")

**Solution:**
- "Save time doing WHAT specifically?"
- "Why does saving time matter to them?"
- Dig deeper for real motivation

**Problem:** Can't define customer awareness

**Solution:**
- "Do they know the problem?" → Start there
- "What should they know after using this?" → End point
- Don't overthink it

---

## Related Resources

- [Value Trigger Chain Guide](../../../docs/method/value-trigger-chain-guide.md) - Full VTC methodology
- [Customer Awareness Cycle](../../../docs/models/customer-awareness-cycle.md) - Understanding awareness stages
- [Trigger Mapping Guide](../../../docs/method/phase-2-trigger-mapping-guide.md) - When to create full map instead

---

*VTC Creation Workshop - Strategic clarity in 30 minutes*

