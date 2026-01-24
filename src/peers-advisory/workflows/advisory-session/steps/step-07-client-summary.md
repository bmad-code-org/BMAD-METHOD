# Step 07: Client Summary and Action Plan

## MANDATORY EXECUTION RULES (READ FIRST)

- 🛑 NEVER let client leave without clear commitments
- 🛑 NEVER accept vague action plans
- 🛑 NEVER skip the timeline - specificity matters
- ✅ ALWAYS push for concrete, dated commitments
- ✅ ALWAYS validate that actions are truly actionable
- ✅ ALWAYS record commitments for accountability
- 📋 YOU ARE facilitating client's synthesis and commitment
- 💬 FOCUS on extracting clear, specific action commitments

## EXECUTION PROTOCOLS

- 🎯 Guide client through 3 key reflection questions
- ⚠️ Push for specificity - no generic statements
- 💾 Record all commitments with dates
- ⏸️ Take time - this is critical for follow-through
- 🔍 Ensure actions are: Specific, Measurable, Time-bound

## CONTEXT BOUNDARIES

- All advisor feedback from step-06 available for reference
- Output file: `{session_output_folder}/session-{date}.md`
- Current step: 7 of 8
- Next step: `step-08-advisor-reflect.md`

## YOUR TASK

Guide the client to synthesize insights and commit to specific, time-bound actions.

---

## CLIENT SUMMARY

### Purpose

This step ensures:
- **Synthesis** - Client processes and integrates advisor wisdom
- **Clarity** - Key takeaways are articulated clearly
- **Commitment** - Specific actions with deadlines are established
- **Accountability** - Commitments are documented

Without this step, insights evaporate. Transformation requires action.

---

## EXECUTION SEQUENCE

### Introduction

> **Your Turn: Summary and Action Plan**
>
> You've received wisdom from four perspectives. Now it's time to make this actionable.
>
> I'm going to ask you three important questions. Please think carefully about each one:
>
> 1. What's your biggest takeaway from this session?
> 2. What specific actions will you take?
> 3. When will you take them?
>
> These aren't rhetorical questions - your answers will be recorded as your commitments.
>
> Ready?

**⏸️ STOP. Wait for acknowledgment.**

---

### Question 1: Key Takeaway

> **Question 1: Your Biggest Takeaway**
>
> Looking back at everything that was shared today - all the questions, all the feedback, all four advisors' perspectives...
>
> **What is your single biggest takeaway?**
>
> What insight hit hardest? What will you remember in 6 months?
>
> *(Take your time with this)*

**⏸️ STOP. Wait for response.**

**After receiving response:**

Validate and probe if needed:
- If clear and specific: "That's a powerful realization."
- If vague: "Can you be more specific about what that means for you?"
- If multiple points: "If you had to pick just one primary takeaway, which would it be?"

**Record to session file immediately.**

---

### Question 2: Action Commitments

> **Question 2: Your Action Plan**
>
> Insights without action remain just ideas. Let's make this real.
>
> **What specific actions will you take as a result of this session?**
>
> I'm looking for concrete actions, not intentions. Not "I'll think about it" but "I will [specific action]".
>
> Give me 2-3 specific things you commit to doing.
>
> *(Be as specific as possible)*

**⏸️ STOP. Wait for response.**

**After receiving response:**

**For each action they mention, validate specificity:**

If they say something vague like "I'll be more strategic":
> "That's a good intention. But what does 'more strategic' look like as a specific action? What will you actually DO?"

If they say something better like "I'll talk to Sarah":
> "Good. Let's make it even more specific. What exactly will you discuss with Sarah? What outcome are you looking for?"

**Push until each action is SMART:**
- **Specific**: Not "improve X" but "do Y"
- **Measurable**: You'll know when it's done
- **Actionable**: Within their control
- **Relevant**: Addresses the core issue
- **Time-bound**: Has a deadline (next question)

**Aim for 2-3 truly excellent commitments, not 5 mediocre ones.**

**Record to session file immediately.**

---

### Question 3: Timeline Commitments

> **Question 3: Your Timeline**
>
> Now let's put dates on these. Commitments without deadlines are just wishes.
>
> **For each action you just mentioned, when will you do it?**
>
> I need specific dates or timeframes:
> - Action 1: By when?
> - Action 2: By when?
> - Action 3: By when?
>
> *(Be realistic but ambitious)*

**⏸️ STOP. Wait for response.**

**After receiving response:**

**Validate each timeline:**

If they say "soon" or "in the next few weeks":
> "Let's be more specific. What's the actual date? Put it on your calendar right now."

If they say a date that seems too far out:
> "That's [X weeks] away. Could any of this be done sooner? What's stopping you from starting this week?"

If they say a date that seems unrealistic:
> "Let's make sure this is achievable. What needs to happen for you to hit that date?"

**Record final commitments with dates.**

---

### Summary Confirmation

Present their commitments back to them:

> **Your Commitments - Confirmed**
>
> Let me read back what you've committed to:
>
> **Key Takeaway:**
> [Their biggest takeaway]
>
> **Action Plan:**
> 1. [Action 1] - By [Date]
> 2. [Action 2] - By [Date]
> 3. [Action 3] - By [Date]
>
> This is now part of your permanent session record.
>
> **Are these commitments accurate? Do you stand by them?**

**⏸️ STOP. Wait for confirmation.**

If they want to adjust:
- Make adjustments
- Re-confirm

If they confirm:
- Proceed to transition

---

### Transition to Final Step

> **✅ Your Action Plan is Complete**
>
> You've done the hard work of translating insights into commitments.
>
> **Final Step**: Advisor Reflections
>
> Your advisors will now share one more thing - a reflection on:
> - Your strengths that showed up today
> - Potential traps to watch for
> - Your evolution direction
>
> This is the final layer of insight.
>
> ---
>
> **[Continue]** - Hear Advisor Reflections
> **[Pause]** - Pause and save progress

**⏸️ STOP. Wait for choice.**

---

## HANDLE USER CHOICE

**If [Continue]:**
- Update session record:
  ```yaml
  stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
  currentStep: 8
  ```
- Append client summary to session file
- Load and execute `step-08-advisor-reflect.md`

**If [Pause]:**
- Update session record status
- Note that commitments are saved
- Provide resume instructions

---

## RECORDING TO SESSION FILE

```markdown
## ✅ Client Summary and Action Plan

### Key Takeaway
[Client's biggest takeaway - exact words]

### Action Commitments

**1. [Action 1]**
- Deadline: [Specific date]
- Success looks like: [What completion means]

**2. [Action 2]**
- Deadline: [Specific date]
- Success looks like: [What completion means]

**3. [Action 3]**
- Deadline: [Specific date]
- Success looks like: [What completion means]

### Client Commitment Statement
"I, [client name], commit to taking these actions by the stated deadlines as a result of this advisory session."

Date: [Today's date]

---
```

---

## VALIDATION CHECKLIST

Before proceeding to Step 8:

- [ ] Client stated clear key takeaway
- [ ] 2-3 specific actions identified
- [ ] Each action is concrete and actionable
- [ ] Each action has a specific deadline
- [ ] Client confirmed commitments
- [ ] All commitments recorded
- [ ] Client chose to continue
- [ ] Session frontmatter updated

---

## COMMON PITFALLS AND CORRECTIONS

### Pitfall 1: Vague Actions

**Client says**: "I'll be more proactive"

**You respond**: "What does 'more proactive' look like as a specific action? Give me one thing you'll do differently starting Monday."

### Pitfall 2: No Timeline

**Client says**: "I'll have that conversation with my partner"

**You respond**: "By when? Let's put a specific date on it."

### Pitfall 3: Too Many Actions

**Client lists**: 7 different things

**You respond**: "That's ambitious. But let's be realistic - which 2-3 are the true priorities? Which ones, if done, would make the others easier or unnecessary?"

### Pitfall 4: Actions They Can't Control

**Client says**: "I'll get them to change their mind"

**You respond**: "You can't control their decision. What action can YOU take that's within your control?"

---

## ACCOUNTABILITY ENHANCEMENT

**Optional but powerful addition:**

> Before we continue, one more question:
>
> **Who will you share these commitments with?**
>
> Research shows that sharing commitments with someone who will check in on you dramatically increases follow-through.
>
> Who in your life would you be willing to share this with?

If they name someone:
> Excellent. Will you send them your commitments within 24 hours?

---

## COMPLETION CRITERIA

✅ Step 07 is complete when:
1. Client stated clear key takeaway
2. 2-3 specific, actionable commitments made
3. Each commitment has specific deadline
4. Commitments confirmed by client
5. All recorded to session file
6. Client chose to continue
7. Session frontmatter updated
