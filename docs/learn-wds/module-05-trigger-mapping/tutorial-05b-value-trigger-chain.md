# Tutorial 05B: Create a Slim Trigger Map

> **Note:** This tutorial previously covered "Value Trigger Chains (VTC)" which has been replaced by the simpler concept of a Slim Trigger Map — define one business goal, one target group, and their key driving forces. The core process is the same.

**Quick strategic validation for focused user journeys**

---

## Overview

This tutorial walks you through creating a Slim Trigger Map - a lightweight, streamlined version of Trigger Mapping. Perfect for when you need quick strategic validation or are working with a single, focused user journey.

**Time:** 15-20 minutes  
**Prerequisites:** Module 04 completed (Product Brief created)  
**What you'll create:** Single-chain map from business goal to user trigger

---

## When to Use This Approach

**Value Trigger Chain is ideal for:**
- ✅ Smaller features or iterations
- ✅ Single user journey focus
- ✅ Quick strategic validation
- ✅ Early-stage exploration
- ✅ Time-constrained situations

**Use Full Trigger Mapping instead if:**
- ❌ Multiple user groups to consider
- ❌ Complex feature prioritization needed
- ❌ Long-term strategic planning
- ❌ Need defensible stakeholder justification

**Not sure which to use?** See [Lesson 2: Heritage & Evolution](lesson-02-heritage-evolution.md#two-approaches-choose-your-depth)

---

## Before You Start

### What You Need

- ✅ Completed Product Brief (from Tutorial 04)
- ✅ WDS installed and Saga activated
- ✅ 15-20 minutes of focused time
- ✅ One clear user journey in mind

### What to Expect

**Saga will:**
- Guide you through one streamlined workshop
- Ask focused questions
- Help you create a single value chain
- Document the essential connections

**You will:**
- Define one strategic objective
- Identify one primary user
- Map their key driver
- Connect to specific trigger moment

---

## The Value Trigger Chain Workshop

### Starting the Workshop

**In your IDE, activate Saga:**

```
@saga I want to create a Value Trigger Chain for [brief description of feature/journey]. Let's do the lightweight version.
```

---

## Step 1: Define Your Strategic Objective (3 minutes)

### What Saga Will Ask

**Focus on one measurable goal:**
- "What's the one strategic objective this feature/journey needs to achieve?"
- "How will you measure success?"
- "By when do you need to achieve this?"

### Your Task

**Pick ONE objective from your Product Brief:**
- Must be specific and measurable (using SMART method)
- Should be achievable through this single journey
- Clear timeframe

**Example:**
"Increase trial-to-paid conversion to 25% by Q3 2024"

**Not:**
"Improve user experience and increase revenue and build brand awareness"
(Too many objectives - use Full Trigger Mapping for this)

---

## Step 2: Identify Your Primary User (3 minutes)

### What Saga Will Ask

**WHO will make this happen through their product use:**
- "Who is the ONE user type whose behavior drives this objective?"
- "What's their context and situation?"
- "What are they trying to accomplish?"

### Your Task

**Define one primary user:**
- Behavioral profile, not demographics
- Specific context
- Clear connection to your objective

**Example:**
"Startup founders evaluating project management tools during their first team expansion (3-10 people). They're overwhelmed by options and need to make a decision quickly before their team grows chaotic."

**Why this works:**
- Specific behavioral context
- Clear situation
- Connects to trial-to-paid conversion (they need to decide)

---

## Step 3: Map the Key Driver (4 minutes)

### What Saga Will Ask

**What's the ONE psychological driver:**
- "What's the strongest driver for this user in this journey?"
- "Is it positive (what they want) or negative (what they fear)?"
- "Why does this matter emotionally to them?"

### Your Task

**Identify the dominant driver:**
- Usually negative drivers are stronger (loss aversion)
- Must be specific to this journey
- Should have emotional intensity

**Example:**
**Negative Driver:** "Fear of making the wrong tool choice and wasting team's time learning a system they'll have to abandon"

**Why this works:**
- Specific fear (not generic "want good tool")
- Emotional (embarrassment, wasted time, team frustration)
- Directly relevant to trial-to-paid decision

---

## Step 4: Define the Trigger Moment (4 minutes)

### What Saga Will Ask

**When does this driver activate:**
- "What specific moment triggers this driver?"
- "What's happening in their world when they feel this most strongly?"
- "What prompts them to take action?"

### Your Task

**Identify the trigger moment:**
- Specific situation or event
- When the driver becomes urgent
- What makes them act NOW

**Example:**
**Trigger Moment:** "When their team asks 'Which tool are we using?' for the third time in a week, and they realize they're losing credibility by not having made a decision"

**Why this works:**
- Specific moment (third time asked)
- Emotional trigger (losing credibility)
- Creates urgency (need to decide now)

---

## Step 5: Connect to Your Solution (3 minutes)

### What Saga Will Ask

**How does your feature address this:**
- "What does your feature do at this trigger moment?"
- "How does it reduce the pain or enable the gain?"
- "Why is this better than alternatives?"

### Your Task

**Define the value connection:**
- What your feature does
- How it addresses the driver
- Why it works at this trigger moment

**Example:**
**Solution:** "Guided comparison tool that shows them exactly how our features map to their team size and use case, with a 'Decision Confidence Score' that validates their choice"

**Why this works:**
- Addresses the fear (reduces wrong-choice risk)
- Provides validation (confidence score)
- Specific to the trigger moment (helps them decide NOW)

---

## Your Value Trigger Chain

### The Complete Chain

```
Strategic Objective
    ↓
"Increase trial-to-paid conversion to 25% by Q3 2024"
    ↓
Primary User
    ↓
"Startup founders evaluating tools during first team expansion"
    ↓
Key Driver (Negative)
    ↓
"Fear of making wrong choice and wasting team's time"
    ↓
Trigger Moment
    ↓
"When team asks 'which tool?' for 3rd time - losing credibility"
    ↓
Solution
    ↓
"Guided comparison tool with Decision Confidence Score"
    ↓
Result: User converts because fear is reduced, decision validated
```

---

## Validating Your Chain

### The Control Questions

Ask yourself:

**1. Is the connection clear?**
- Can you trace from objective → user → driver → trigger → solution?
- Does each step logically lead to the next?

**2. Is this the strongest path?**
- Is this the PRIMARY user for this objective?
- Is this their STRONGEST driver?
- Is this the most URGENT trigger moment?

**3. Does your solution actually work?**
- Does it address the driver at the trigger moment?
- Is it better than alternatives?
- Why should they care?

**If any answer is weak:** Revisit that step and strengthen the connection.

---

## Generic Example: Fitness App

### The Chain

**Objective:** "Achieve 1,000 daily active users by Q4 2024"

**Primary User:** "Busy professionals who want to exercise but struggle with consistency"

**Key Driver (Negative):** "Fear of losing fitness progress when work gets hectic"

**Trigger Moment:** "When they miss their third workout in a row and feel guilty"

**Solution:** "3-minute 'Streak Saver' workout that counts toward their weekly goal"

**Why it works:**
- Addresses the fear (prevents losing progress)
- Works at trigger moment (when they've missed workouts)
- Low barrier (only 3 minutes)
- Maintains streak (reduces guilt)

---

## What You Get

✅ **Clear strategic connection** - Objective to solution in one chain  
✅ **Focused validation** - One user, one driver, one trigger  
✅ **Quick decision-making** - Is this feature worth building?  
✅ **Defensible reasoning** - Traceable logic  
✅ **15-20 minute investment** - Fast strategic check

---

## When to Expand to Full Trigger Mapping

**Consider the full process if you discover:**
- Multiple user types are equally important
- Several drivers compete for priority
- You need to score many features
- Stakeholders need comprehensive justification
- The project is more complex than initially thought

**The Value Trigger Chain is a starting point.** If it reveals complexity, upgrade to Full Trigger Mapping.

---

## Common Mistakes to Avoid

### Mistake 1: Too Many Objectives

**Problem:** Trying to achieve 5 different goals in one chain  
**Why it fails:** Dilutes focus, unclear success criteria  
**Fix:** Pick ONE objective, use Full Trigger Mapping for multiple goals

### Mistake 2: Generic User

**Problem:** "All users" or "people who want X"  
**Why it fails:** Can't identify specific drivers or triggers  
**Fix:** Get specific about context and situation

### Mistake 3: Vague Driver

**Problem:** "Want better experience"  
**Why it fails:** Not actionable, no emotional core  
**Fix:** Find the specific fear or desire with emotional intensity

### Mistake 4: Missing the Trigger

**Problem:** No specific moment when driver activates  
**Why it fails:** Don't know when to intervene  
**Fix:** Identify the exact situation that creates urgency

### Mistake 5: Solution Doesn't Connect

**Problem:** Feature doesn't actually address the driver  
**Why it fails:** Won't drive the objective  
**Fix:** Ensure solution reduces pain or enables gain at trigger moment

---

## Tips for Success

**DO:**
- ✅ Focus on ONE clear path
- ✅ Be specific at every step
- ✅ Find the emotional core
- ✅ Validate the connections
- ✅ Keep it simple

**DON'T:**
- ❌ Try to map everything (use Full Trigger Mapping for that)
- ❌ Accept vague or generic statements
- ❌ Skip the trigger moment
- ❌ Forget to validate the chain
- ❌ Overcomplicate it

---

## What's Next

### If This Validated Your Feature

**Move to scenario design:**
- Use this chain to inform your scenario
- Design for the trigger moment
- Address the driver directly
- Measure against the objective

### If This Revealed Complexity

**Upgrade to Full Trigger Mapping:**
- [Tutorial 05: Create Your Trigger Map](tutorial-05.md)
- Map multiple users and drivers
- Score features systematically
- Build comprehensive strategy

### If This Showed a Problem

**Revisit your Product Brief:**
- Is the objective right?
- Is this the right user?
- Should you pivot the feature?
- Do you need more research?

---

## Key Takeaways

✅ **Lightweight but strategic** - Quick validation with clear reasoning  
✅ **One clear path** - Objective → User → Driver → Trigger → Solution  
✅ **15-20 minutes** - Fast strategic check  
✅ **Know when to expand** - Upgrade to Full Trigger Mapping when needed  
✅ **Traceable logic** - Every step connects to the next

---

[← Back to Lesson 2](lesson-02-heritage-evolution.md) | [Full Trigger Mapping Tutorial →](tutorial-05.md)

*Part of Module 05: Trigger Mapping*
