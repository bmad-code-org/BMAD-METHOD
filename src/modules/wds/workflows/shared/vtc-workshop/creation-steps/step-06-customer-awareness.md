# Step 6: Position Customer Awareness

**Duration:** 5-10 minutes

**Purpose:** Define where user starts and where we move them in their awareness journey

---

## What You'll Do

Explore what the user knows NOW, and what transformation we want to create.

---

## Step 6A: Understand Current State

**Start with exploration:**

> "Let's understand where [user name] is right now. When they encounter [solution], what's going on in their head?"

**Ask progressively:**

### 1. "Do they know something's wrong?"

**If NO:**
> "Interesting - so they don't even realize there's a problem yet. What would make them suddenly notice?"

**Capture:** Starting at **Unaware**

**If YES:**
> "Okay, they know something's not working. Tell me more about that..."

### 2. "What language are they using?"

> "When they talk about this problem - to themselves or others - what words do they use?"

**Listen for:**
- Generic problem language → **Problem Aware**
- Comparing solutions → **Solution Aware**
- Mentioning your product → **Product Aware**
- Sharing their experience → **Most Aware**

### 3. "What are they looking for?"

> "If they're searching for help, what would they type into Google?"

**Examples show awareness:**
- "how to fix [problem]" → Problem Aware
- "best tools for [need]" → Solution Aware
- "[your product name] review" → Product Aware

### 4. "Have they tried anything?"

> "Are they already trying other solutions? Or still figuring out if solutions exist?"

**Reveals:**
- Never tried anything → Problem Aware
- Tried competitors → Solution Aware
- Using your free version → Product Aware
- Paying customer → Most Aware

### 5. "Capture their current position"

Based on these explorations, summarize:

```yaml
customer_awareness:
  start: "[One of: Unaware / Problem Aware / Solution Aware / Product Aware / Most Aware]"
  start_context: "[What they know, what they're looking for, language they use]"
```

**The 5 stages (reference):**
- **Unaware** - Doesn't know problem exists
- **Problem Aware** - Knows problem, doesn't know solutions exist
- **Solution Aware** - Knows solutions exist, researching options
- **Product Aware** - Knows YOUR solution exists specifically
- **Most Aware** - Has used, experienced value, may advocate

---

## Step 6B: Define Desired Transformation

**Now explore where we want to move them:**

> "After they interact with [solution], what should change in their understanding?"

### 1. "What will they realize?"

> "What new insight or understanding will they gain?"

**Examples:**
- "Oh, I didn't know this was even possible" (Unaware → Problem Aware)
- "This solves it without the hassle I expected" (Solution → Product Aware)
- "This actually works!" (Product → Most Aware)

### 2. "What will they be able to articulate?"

> "After this experience, if they told a friend about it, what would they say?"

**Their new language shows awareness shift.**

### 3. "What action becomes possible?"

> "What can they do NOW that they couldn't before?"

**Actions show awareness level:**
- Admit problem → Problem Aware
- Compare solutions → Solution Aware
- Try your product → Product Aware
- Recommend it → Most Aware

---

## Step 6C: Validate Realistic Progression

**Discuss realistic movement:**

> "So they're starting at [start stage]. Where's realistic to move them with [this solution]?"

**Important:** Usually move 1-2 stages, not jumping from Unaware → Most Aware

**Guide with questions:**

- "Is this a quick interaction or deep engagement?"
- "Will they actually USE it, or just learn about it?"
- "What's preventing bigger jump?" (skepticism, complexity, commitment)

**Capture:**

```yaml
customer_awareness:
  start: "[Current stage]"
  start_context: "[What they know/feel NOW]"
  end: "[Target stage]"
  end_context: "[What they'll know/feel AFTER]"
  transformation: "[Key shift that happens]"
```

**Example:**
```yaml
customer_awareness:
  start: "Problem Aware"
  start_context: "Knows they need to stay current with beauty trends, searching for solutions"
  end: "Product Aware"
  end_context: "Knows our newsletter provides curated trends, considering signup"
  transformation: "From generic need to specific solution"
```

---

## Validation Through Storytelling

**Ask user to tell the story:**

> "Walk me through their awareness journey:
> 
> They start: [knowing what?]
> They encounter: [this solution]
> They realize: [what new understanding?]
> They end up: [able to do what?]"

**Listen for:**
- ✅ Coherent narrative
- ✅ Realistic transformation
- ✅ Matches driving forces
- ✅ Supports business goal

**If story doesn't flow** - one of the stages is wrong.

---

## Common Patterns

**Landing Pages:** Usually Problem/Solution → Product Aware  
*"I know solutions exist" → "I know THIS solution"*

**Onboarding:** Usually Product → Most Aware  
*"I signed up" → "I see the value, I'll keep using it"*

**Educational Content:** Often Unaware → Problem Aware  
*"Didn't know this mattered" → "Oh, this IS a problem"*

**Feature Announcements:** Often Most Aware → Most Aware (deepen)  
*"Love this product" → "Love it even more now"*

---

## Common Issues

**Issue:** User wants to jump multiple stages (Unaware → Most Aware)

**Solution:**
> "That's the ultimate goal, but THIS interaction likely moves them 1-2 stages. What's the next realistic step for someone encountering [solution]?"

**Issue:** User not sure about stages

**Solution:**
> "Let's think about it this way: What do they know BEFORE encountering your solution? What should they know AFTER?"

**Issue:** Starting and ending are the same stage

**Solution:**
> "If awareness doesn't change, what IS changing for them? Maybe we're maintaining Most Aware, or maybe the starting point needs adjustment?"

---

## How This Guides Design

**Understanding awareness informs everything:**

**Content Strategy:**
- **Start stage** tells you what language to use (theirs, not yours)
- **End stage** tells you what message to deliver (the transformation)
- **Gap between** tells you how much explanation needed

**Examples:**
- Problem → Product Aware: Need to explain solutions exist, then show yours is best
- Product → Most Aware: Skip explanation, show immediate value

**Tone:**
- Earlier in awareness: More exploratory, educational, empathetic
- Later in awareness: More direct, confident, action-oriented

**Depth:**
- Unaware: Need context (why should I care?)
- Problem Aware: Need options (what solves this?)
- Solution Aware: Need differentiation (why yours?)
- Product Aware: Need proof (does it work?)
- Most Aware: Need expansion (what else?)

---

## Next Step

Once customer awareness is positioned and validated:

**→ Proceed to [Step 7: Review and Save VTC](./step-07-review-and-save.md)**

---

## Output at This Point

You now have:
- ✅ Business goal
- ✅ Solution
- ✅ User description
- ✅ Positive driving forces
- ✅ Negative driving forces
- ✅ Customer Awareness positioning

**VTC is complete! Final step is review and save.**

---

*Step 6 complete - Awareness positioned*

