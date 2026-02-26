# Module 06: Trigger Mapping

## Lesson 11: Feature Impact Scoring

**Systematic Feature Prioritization**

---

## The Problem with Traditional Prioritization

How do most teams prioritize features?

**Common approaches:**
- "The CEO wants it" (politics)
- "It seems important" (gut feeling)
- "Competitors have it" (copying)
- "Users asked for it" (squeaky wheel)
- "It's easy to build" (convenience)

**The result:** Random feature lists with no strategic foundation.

---

## The Feature Impact Approach

Feature Impact Scoring connects features directly to your Trigger Map:

**The logic:**
1. You've prioritized target groups (Workshop 4)
2. You've prioritized their driving forces (Workshop 4)
3. Now score each feature: How well does it address top drivers?
4. Features with highest scores = highest strategic impact

**The result:** Data-driven prioritization based on user psychology and business goals.

---

## How the Scoring Works

### Step 1: List Your Features

Brainstorm all potential features:
- Ideas from Product Brief
- Stakeholder requests
- Competitor features
- User feedback
- Team suggestions

**Aim for:** 10-20 features to evaluate

### Step 2: Set Up the Scoring Matrix

Create a matrix with:
- **Rows:** Your features
- **Columns:** Top 5-7 prioritized driving forces
- **Cells:** Impact scores (0-3 scale)

### Step 3: Score Each Feature

For each feature, ask: "How well does this address [driving force]?"

**Scoring scale:**
- **3** = Directly addresses this driver (core solution)
- **2** = Significantly helps with this driver
- **1** = Somewhat related to this driver
- **0** = Doesn't address this driver

### Step 4: Calculate Total Scores

Sum the scores across all drivers for each feature.

**Higher total = Higher strategic impact**

### Step 5: Rank and Prioritize

Sort features by total score to create your prioritized roadmap.

---

## Generic Example

### Context

**Top Target Group:** Remote Team Leads

**Top Prioritized Drivers:**
1. Fear of team burnout without noticing (Negative - Priority 1)
2. Want to demonstrate effective leadership (Positive - Priority 2)
3. Fear of losing top performers (Negative - Priority 3)
4. Want to build strong team culture (Positive - Priority 4)
5. Fear of missed deadlines (Negative - Priority 5)

### Features to Evaluate

1. Daily team pulse check
2. Async video updates
3. Automated meeting summaries
4. Team workload dashboard
5. Recognition and kudos system

### Scoring Matrix

| Feature | Burnout Fear | Leadership | Losing Performers | Team Culture | Missed Deadlines | **Total** |
|---------|-------------|------------|-------------------|--------------|------------------|-----------|
| Daily pulse check | 3 | 2 | 2 | 1 | 1 | **9** |
| Team workload dashboard | 3 | 2 | 2 | 0 | 2 | **9** |
| Recognition system | 1 | 1 | 2 | 3 | 0 | **7** |
| Meeting summaries | 0 | 1 | 0 | 1 | 2 | **4** |
| Async video updates | 1 | 1 | 0 | 2 | 0 | **4** |

### Prioritized Roadmap

**Phase 1 (Highest Impact):**
1. Daily pulse check (Score: 9)
2. Team workload dashboard (Score: 9)

**Phase 2 (High Impact):**
3. Recognition system (Score: 7)

**Phase 3 (Lower Impact):**
4. Meeting summaries (Score: 4)
5. Async video updates (Score: 4)

---

## Why This Works

### It's Strategic

Every score connects to:
- A prioritized driving force
- A prioritized target group
- A business goal

**Not arbitrary - traceable to strategy**

### It's Objective

**Traditional:** "I think Feature A is more important"  
**Feature Impact:** "Feature A scores 9, Feature B scores 4"

**Data beats opinions**

### It's Defensible

When stakeholders ask "Why aren't we building X?"

**You can show:**
- Here's our Trigger Map
- Here are our top drivers
- Here's how features score against them
- Feature X scores lower than our current roadmap

**Strategic reasoning, not politics**

### It's Flexible

**When priorities change:**
- Update driver rankings
- Re-score features
- New roadmap emerges

**Strategy drives features, not the reverse**

---

## Scoring Guidelines

### For Negative Drivers (Fears/Frustrations)

**Ask:** "Does this feature help users avoid this pain?"

**High score (3):**
- Directly prevents the feared outcome
- Provides early warning system
- Creates safety net

**Example:**
- Driver: "Fear of team burnout without noticing"
- Feature: "Daily pulse check with burnout indicators"
- Score: 3 (directly addresses the fear)

### For Positive Drivers (Goals/Benefits)

**Ask:** "Does this feature help users achieve this goal?"

**High score (3):**
- Directly enables the desired outcome
- Makes the goal achievable
- Provides clear progress toward goal

**Example:**
- Driver: "Want to demonstrate effective leadership"
- Feature: "Team health dashboard with actionable insights"
- Score: 2 (provides data to demonstrate leadership)

### When in Doubt

**Be honest:**
- Don't inflate scores to justify pet features
- 0 is okay - not everything addresses everything
- Challenge yourself: "Does this REALLY address this driver?"

**Saga will help:**
- "How specifically does this address the fear?"
- "What about this feature reduces that pain?"
- "Is this a 2 or a 3? What's the difference?"

---

## Common Patterns

### Pattern 1: High Scores Across Multiple Drivers

**What it means:** This feature has high leverage - it addresses multiple psychological needs

**Example:**
- Daily pulse check scores high on burnout fear, leadership goals, and retention fear
- **Action:** Prioritize this - it's strategically valuable

### Pattern 2: High Score on Top Driver Only

**What it means:** Laser-focused solution for most important need

**Example:**
- Workload balancing tool scores 3 on burnout fear, low on others
- **Action:** Still high priority if that driver is #1

### Pattern 3: Moderate Scores Across Many Drivers

**What it means:** Nice-to-have that helps a bit with everything

**Example:**
- Team chat feature scores 1-2 on multiple drivers
- **Action:** Lower priority - not solving urgent problems

### Pattern 4: Low Scores Everywhere

**What it means:** Feature doesn't connect to strategy

**Example:**
- Fancy animations score 0-1 across all drivers
- **Action:** Cut it or deprioritize significantly

---

## Beyond the Numbers

### The Conversation Matters

The real value isn't just the scores - it's the strategic conversation:

**Questions that emerge:**
- "Why doesn't this feature score higher?"
- "Could we modify it to address more drivers?"
- "Are we missing a feature that would score higher?"
- "Do these scores match our intuition? If not, why?"

**Insights from discussion:**
- Features can be refined to increase impact
- Missing features can be identified
- Assumptions can be challenged
- Strategy can be sharpened

### Combining with Other Factors

Feature Impact is strategic value. You should also consider:

**Feasibility:**
- How hard is this to build?
- Do we have the resources?
- What's the technical risk?

**Dependencies:**
- Does this require other features first?
- Does this enable other features?

**Market timing:**
- Is this urgent for competitive reasons?
- Is there a window of opportunity?

**Combined prioritization:**
```
Priority = (Strategic Impact × Feasibility) + Urgency Bonus
```

---

## Using the Scored Feature List

### For Roadmap Planning

**Phase 1:** Top-scoring features (typically 8-10 range)  
**Phase 2:** High-scoring features (typically 6-7 range)  
**Phase 3:** Medium-scoring features (typically 4-5 range)  
**Backlog:** Low-scoring features (typically 0-3 range)

### For Stakeholder Communication

**When presenting roadmap:**
1. Show the Trigger Map
2. Show the scoring matrix
3. Show the prioritized list
4. Explain the strategic reasoning

**Stakeholders appreciate:**
- Clear methodology
- Traceable decisions
- Strategic foundation
- Data-driven approach

### For Design Decisions

**During design:**
- Reference the scores
- Focus on high-impact features first
- Ensure design addresses the drivers
- Validate against the scoring

**Example:**
"We're designing the pulse check (score: 9). It needs to address burnout fear, so let's include early warning indicators and actionable suggestions."

---

## Updating Scores

### When to Re-Score

**Re-score when:**
- ✅ New user research changes driver priorities
- ✅ Business goals shift
- ✅ You learn features don't work as expected
- ✅ Quarterly strategy reviews

**Don't re-score when:**
- ❌ Stakeholder has new pet feature
- ❌ Competitor launches something
- ❌ Minor tactical changes
- ❌ Every sprint planning meeting

### The Living Roadmap

**The scored feature list should:**
- Be updated quarterly (or when strategy shifts)
- Be referenced in every sprint planning
- Guide all feature discussions
- Evolve with your understanding

---

## The Complete Picture

Now you have the full Trigger Mapping system:

```
Workshop 1: Business Goals
    ↓
Workshop 2: Target Groups (prioritized)
    ↓
Workshop 3: Driving Forces (positive + negative)
    ↓
Workshop 4: Prioritization (top drivers identified)
    ↓
Workshop 5: Feature Impact (scored feature list)
    ↓
Strategic Roadmap (data-driven priorities)
```

**Every feature traces back to:**
- A psychological driver
- A target group
- A business goal

**No orphaned features. No guesswork. Strategic clarity.**

---

## What's Next

You're ready to create your own Trigger Map. The tutorial will walk you through all 5 workshops step by step with Saga, creating your complete Trigger Map and scored feature list.

---

## Key Takeaways

✅ **Systematic scoring** - Features rated against prioritized drivers (0-3 scale)  
✅ **Data-driven prioritization** - Total scores determine roadmap  
✅ **Strategically defensible** - Every decision traces to strategy  
✅ **Flexible and updateable** - Re-score when strategy shifts  
✅ **Beyond numbers** - The conversation reveals insights  
✅ **Complete traceability** - Feature → Driver → Group → Goal

---

## Reflection Questions

1. How would systematic scoring change your current prioritization process?
2. What features on your roadmap might score lower than you thought?
3. How would this help you defend design decisions to stakeholders?

---

[← Back to Module Overview](module-06-overview.md) | [← Back to Lesson 10](lesson-10-visual-trigger-map.md) | [Next: Tutorial - Create Your Trigger Map →](tutorial-06.md)

*Part of Module 06: Trigger Mapping*
