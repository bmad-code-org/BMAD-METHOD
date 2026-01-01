# Step 3: Define Required Action

**Apply Action Mapping to filter for relevance and purpose**

---

## Purpose

Action Mapping (Cathy Moore) asks the critical question: **"What action does this content enable?"** 

If content doesn't enable a specific, valuable action, it's likely fluff. This step ensures every word serves a purpose.

---

## Duration

⏱️ **3-5 minutes**

---

## What You're Doing

Identifying the specific action the user must be able to take after reading this content, and using that to filter what information is truly necessary.

---

## Context from Previous Steps

**VTC:** Business goal, user, driving forces, awareness positioning  
**Awareness Strategy:** Language guidelines, information priorities, emotional journey

---

## The Action Mapping Principle (Quick Reference)

**Cathy Moore's Core Question:**
> "What does the user need to be able to DO?"

**Not:**
- "What do they need to know?"
- "What information should we provide?"
- "What sounds impressive?"

**But:**
- "What behavior enables success?"
- "What action drives the business goal?"

**Then work backward:**
- What information enables that action?
- What practice enables that action?
- What environment enables that action?

---

## Questions for the User

### 1. Identify the Required Action

**"After reading this content, what must the user be able to DO?"**

Be specific. Not "understand" or "know about" - but actual behaviors:

**Good examples:**
- "Click the signup button with confidence"
- "Choose the right pricing tier for their needs"
- "Complete the first step in the onboarding flow"
- "Recognize if this product is right for them (or not)"
- "Explain the value to their boss/team"

**Bad examples:**
- "Understand our features" (too vague)
- "Learn about our company" (no action)
- "Be aware of the benefits" (awareness isn't action)

**"What's the ONE action this content must enable?"**

### 2. Connect Action to Business Goal

**"How does this action serve the business goal?"**

Trace the logic:
- User does [action]
- Which leads to [outcome]
- Which drives [business goal from VTC]

**Example:**
- User clicks signup button (action)
- Which leads to email capture (outcome)
- Which drives "500 newsletter signups" goal (business goal)

**"Does this action clearly serve the VTC's business goal?"**

- If YES → Continue
- If NO → Reconsider if this content is needed, or if the action is defined correctly

### 3. Connect Action to Driving Forces

**"How does this action satisfy the user's driving forces?"**

From VTC, we know:
- Positive driving force (wish): [from VTC]
- Negative driving force (fear): [from VTC]

**"By taking this action, how does the user move toward their wish or away from their fear?"**

**Example:**
- Action: Sign up for newsletter
- Wish satisfied: "Become local beauty authority" (gets trend info)
- Fear addressed: "Stop missing industry trends" (regular updates)

### 4. Determine Essential Information

**"What information is REQUIRED to enable this action?"**

Work backward from the action:

- To [do the action], the user must understand [X]
- To understand [X], they need to know [Y]
- To know [Y], we must tell them [Z]

**Strip away everything else.**

**"What can we cut without preventing the action?"**

- Nice-to-know company history? → Cut
- Impressive but irrelevant features? → Cut
- Background context that doesn't enable action? → Cut

### 5. Identify Action Barriers

**"What might prevent the user from taking this action?"**

Common barriers:
- **Confusion:** Don't understand what to do
- **Fear:** Worried about consequences
- **Effort:** Seems too hard or time-consuming
- **Distrust:** Don't believe it will work
- **Irrelevance:** Don't see how it helps them

**"What content is needed to remove these barriers?"**

---

## Agent Actions

1. **Guide user to identify specific action** (not vague understanding)
2. **Validate action connects** to business goal and driving forces
3. **Work backward** to determine essential information
4. **Challenge "nice to know"** content that doesn't enable action
5. **Document** the required action and supporting information

---

## Validation

Before proceeding to Step 4:

- [ ] Specific action identified (not vague "understanding")
- [ ] Action connects to VTC business goal
- [ ] Action satisfies user's driving forces
- [ ] Essential information determined (what enables the action)
- [ ] Unnecessary information identified (what doesn't enable action)
- [ ] Action barriers identified and addressed

---

## Output

**Action Filter Document:**

```yaml
action_filter:
  required_action:
    description: "[Specific action user must be able to take]"
    success_criteria: "[How we know they can do it]"
  
  business_impact:
    connection: "[How this action drives the VTC business goal]"
    logic: "[Action → Outcome → Goal]"
  
  user_motivation:
    positive_driver: "[How action satisfies their wish]"
    negative_driver: "[How action addresses their fear]"
  
  essential_information:
    - "[Information element 1 - WHY needed for action]"
    - "[Information element 2 - WHY needed for action]"
    - "[Information element 3 - WHY needed for action]"
  
  cut_list:
    - "[Nice-to-know info that doesn't enable action]"
    - "[Impressive but irrelevant content]"
  
  action_barriers:
    - barrier: "[e.g., confusion about next steps]"
      solution: "[Content that removes this barrier]"
    - barrier: "[e.g., fear of commitment]"
      solution: "[Content that addresses this fear]"
```

---

## Next Step

Once the required action is clear and information is filtered:

**→ Proceed to [Step 4: Frame User Empowerment](step-04-empowerment-frame.md)**

---

## Example

**VTC Context:** Hairdresser newsletter signup

**Action Filter:**

```yaml
action_filter:
  required_action:
    description: "Click the 'Start Staying Ahead' button to begin email signup"
    success_criteria: "User clicks with confidence, clear on what they'll get"
  
  business_impact:
    connection: "Email capture drives 500 newsletter signups goal"
    logic: "Click button → Enter email → Confirm subscription → New subscriber"
  
  user_motivation:
    positive_driver: "Satisfies wish to 'be local beauty authority' by getting trend info"
    negative_driver: "Addresses fear of 'missing industry trends' with regular updates"
  
  essential_information:
    - "WHAT they'll get: Weekly trend alerts (enables confident click)"
    - "HOW OFTEN: Every Monday (sets expectation, reduces uncertainty)"
    - "TIME INVESTMENT: 60 seconds per trend (shows it's manageable)"
    - "SOCIAL PROOF: 2,000 stylists (reduces risk, builds trust)"
    - "COMMITMENT LEVEL: Free, cancel anytime (removes fear barrier)"
  
  cut_list:
    - "Company founding story (doesn't enable signup action)"
    - "Technical newsletter platform details (irrelevant to action)"
    - "Full team bios (nice but doesn't reduce barriers)"
  
  action_barriers:
    - barrier: "Fear of email overload"
      solution: "Weekly (not daily), 60-second reads, unsubscribe anytime"
    - barrier: "Uncertainty about value"
      solution: "Specific: 'Top 5 trends' + testimonial about client reactions"
    - barrier: "Distrust of free offers"
      solution: "2,000 stylists already using it (social proof)"
```

---

## Notes

- This step often reveals that pages have too much content that doesn't serve the action
- It's normal to identify 30-50% of planned content as "cut-able"
- If you can't identify a clear action, question whether this content section is needed at all
- Multiple small actions are fine (e.g., "read OR watch video")
- But vague goals like "learn about us" indicate unfocused content

---

**⚠️ ALPHA:** Was this filtering process helpful or did it feel limiting? Feedback appreciated.

