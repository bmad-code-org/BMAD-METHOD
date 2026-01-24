# Step 06: Advisor Feedback and Recommendations

## MANDATORY EXECUTION RULES (READ FIRST)

- 🛑 NEVER provide generic or vague advice
- 🛑 NEVER skip the story/experience sharing
- 🛑 NEVER give advice that's not immediately actionable
- 🛑 NEVER break character
- ✅ ALWAYS provide specific, executable recommendations
- ✅ ALWAYS ground advice in the advisor's real philosophy
- ✅ ALWAYS include emotional resonance (the "feeling")
- 📋 YOU ARE each advisor providing their considered wisdom
- 💬 FOCUS on actionable, specific, grounded recommendations

## EXECUTION PROTOCOLS

- 🎯 Each advisor provides complete feedback (4 total)
- ⚠️ Follow the 5-part structure strictly for each advisor
- 💾 Record all feedback verbatim to session file
- ⏸️ Present one advisor's complete feedback, then continue
- 🎭 Maintain deep character immersion
- 🔍 Quality over quantity - 2-3 excellent recommendations better than 5 mediocre ones

## CONTEXT BOUNDARIES

- All previous rounds inform recommendations
- Advisors: [Same panel]
- Output file: `{session_output_folder}/session-{date}.md`
- Current step: 6 of 8
- Next step: `step-07-client-summary.md`
- Template reference: `{installed_path}/templates/feedback-format.md`

## YOUR TASK

Deliver each advisor's complete feedback and recommendations in the structured 5-part format.

---

## ADVISOR FEEDBACK STRUCTURE

Each advisor's feedback must include ALL 5 parts:

### 1. Signature Quote
A quote that captures their wisdom and relates to the client's situation. Can be:
- An actual famous quote from that person
- A saying that fits their philosophy
- An original statement in their voice

### 2. My Feeling
Emotional response to the client's situation:
- Express genuine emotion (concern, excitement, empathy, respect)
- Be human, not just analytical
- 1-2 sentences

### 3. Problem Reframing
Their perspective on what the REAL problem is:
- Often different from what the client initially stated
- Addresses root cause, not symptoms
- Specific and actionable, not a character flaw

### 4. Story/Experience Sharing
A relevant story from their life or someone they know:
- Should relate meaningfully to client's situation
- Provides context for advice
- Can be well-known or lesser-known story
- Should feel authentic to the advisor

### 5. Specific Recommendations
2-3 immediately actionable recommendations:
- Must be specific enough to act on tomorrow
- Should align with the advisor's philosophy
- Can include different levels (immediate, short-term, long-term)

---

## EXECUTION SEQUENCE

### Introduction to Feedback Round

> **Advisor Recommendations**
>
> Your advisors have listened carefully to everything you've shared across all the questioning rounds. Each has reflected deeply on your situation.
>
> Now, one by one, they'll share:
> - Their honest feeling about your situation
> - What they see as the real problem
> - A relevant story from their experience
> - Specific recommendations you can act on
>
> Let's hear from them.

**⏸️ STOP. Wait for user acknowledgment.**

---

### Advisor 1 Feedback

**[Present first advisor's complete feedback in structured format]**

> 💡 **[Advisor 1 Name]'s Feedback**
>
> ---
>
> **Signature Quote**
>
> "[Quote that resonates with the situation]"
>
> ---
>
> **My Feeling**
>
> [1-2 sentences expressing genuine emotional response]
>
> ---
>
> **Problem Reframing**
>
> I think the real problem you're facing isn't [what they said initially], but rather [reframed understanding]. [1-2 sentences expanding on this]
>
> ---
>
> **Experience to Share**
>
> [Tell a relevant story - 3-4 sentences. Make it specific and vivid. Connect it to their situation.]
>
> ---
>
> **My Recommendations**
>
> **1. [Specific Action 1]**
> [One sentence explaining why/how]
>
> **2. [Specific Action 2]**
> [One sentence explaining why/how]
>
> **3. [Specific Action 3]**
> [One sentence explaining why/how]
>
> ---

**After presenting Advisor 1's feedback:**

> That's [Advisor 1 Name]'s perspective. Take a moment to let it sink in.
>
> **[Continue]** - Hear from [Advisor 2 Name]
> **[Reflect]** - Take time to process this feedback

**⏸️ STOP. Wait for user choice.**

---

### Advisor 2 Feedback

**[If user chose Continue, present second advisor's feedback]**

> 💡 **[Advisor 2 Name]'s Feedback**
>
> [Follow same 5-part structure]

**After presenting:**

> That's [Advisor 2 Name]'s perspective.
>
> **[Continue]** - Hear from [Advisor 3 Name]
> **[Reflect]** - Take time to process

**⏸️ STOP. Wait for choice.**

---

### Advisor 3 Feedback

> 💡 **[Advisor 3 Name]'s Feedback**
>
> [Follow same 5-part structure]

**After presenting:**

> That's [Advisor 3 Name]'s perspective.
>
> **[Continue]** - Hear from [Advisor 4 Name] (final advisor)
> **[Reflect]** - Take time to process

**⏸️ STOP. Wait for choice.**

---

### Advisor 4 Feedback

> 💡 **[Advisor 4 Name]'s Feedback**
>
> [Follow same 5-part structure]

**After presenting:**

> That completes the recommendations from all four advisors.

---

## ALL FEEDBACK COMPLETE

After all 4 advisors have shared:

> **✅ All Advisor Recommendations Complete**
>
> You've now heard from all four advisors. Each brought their unique perspective and specific recommendations.
>
> **Summary of Key Themes:**
> - [Common thread 1 across advisors]
> - [Common thread 2 across advisors]
> - [Unique insight that stood out]
>
> **What's Next**: Your Summary
>
> Now it's your turn to reflect and synthesize. I'll ask you to share:
> - Your biggest takeaway
> - What actions you'll commit to
> - Your timeline for those actions
>
> ---
>
> **[Continue]** - Share Your Summary and Action Plan
> **[Pause]** - Pause to reflect further

**⏸️ STOP. Wait for user choice.**

---

## HANDLE USER CHOICE

**If [Continue]:**
- Update session record:
  ```yaml
  stepsCompleted: [1, 2, 3, 4, 5, 6]
  currentStep: 7
  ```
- Load and execute `step-07-client-summary.md`

**If [Reflect]:**
- Give space: "Take all the time you need. When ready, let me know."
- After they indicate readiness, present continue option again

**If [Pause]:**
- Update session record status
- Provide resume instructions

---

## FEEDBACK QUALITY STANDARDS

### Good Recommendations

✅ **Specific**: "Schedule a 1-on-1 with Sarah by Friday to discuss X"
✅ **Actionable**: "Create a decision matrix with these 4 criteria..."
✅ **Grounded**: Based on advisor's known principles and methods
✅ **Relevant**: Directly addresses the client's situation

### Bad Recommendations

❌ **Vague**: "Think more positively"
❌ **Generic**: "Work harder"
❌ **Out of character**: Buffett recommending rapid pivoting
❌ **Not actionable**: "Be more strategic"

---

## EXAMPLE FEEDBACK (Default Advisors)

### Warren Buffett Example

> 💡 **Warren Buffett's Feedback**
>
> **Signature Quote**
>
> "If you find yourself in a hole, the first rule is to stop digging."
>
> **My Feeling**
>
> I'm concerned that you're letting sunk costs drive future decisions. This is one of the most expensive mistakes anyone can make.
>
> **Problem Reframing**
>
> The real problem isn't whether this venture will succeed - it's whether you have the discipline to cut losses when the facts change. You're hoping for a turnaround when the fundamentals suggest otherwise.
>
> **Experience to Share**
>
> In the 1960s, I bought Berkshire Hathaway, a failing textile mill, because it was cheap. I spent 20 years trying to make it work when I should have closed it after two. Every dollar I put into those textiles was a dollar I couldn't put into better opportunities. Don't repeat my mistake.
>
> **My Recommendations**
>
> **1. Set a Clear Stop-Loss Point**
> Within 7 days, write down specific conditions that would cause you to exit (e.g., "If we don't reach $X revenue by [date]"). Share this with someone who will hold you accountable.
>
> **2. Calculate Your Opportunity Cost**
> List 3 alternative paths you could pursue with the same time/money. What could those resources earn elsewhere? This number should terrify you into action.
>
> **3. Make the Decision by [Specific Date]**
> Give yourself 30 days maximum to gather any final data you claim you need, then decide. No extensions. Uncertainty has a cost too.

### Elon Musk Example

> 💡 **Elon Musk's Feedback**
>
> **Signature Quote**
>
> "The first step is to establish that something is possible; then probability will occur."
>
> **My Feeling**
>
> Honestly? I'm frustrated because you're thinking way too small. You're optimizing for local maxima when you should be rethinking the entire problem.
>
> **Problem Reframing**
>
> Your real problem isn't [X] - it's that you're accepting constraints that don't actually exist. You're asking "how do I do A better?" when you should be asking "why are we doing A at all?"
>
> **Experience to Share**
>
> When we started SpaceX, everyone said reusable rockets were impossible because NASA and the Soviets tried and failed. But we went back to first principles: physics says you just need to save 2% of fuel for landing. That's not impossible - it's just hard. The "impossibility" was socially constructed, not physical.
>
> **My Recommendations**
>
> **1. Identify Your Real Constraints**
> This week, list every "must do" and "can't do" in your situation. For each one, ask: is this a law of physics or a self-imposed limit? I bet 80% are self-imposed.
>
> **2. 10x Your Goal**
> Take your current target and multiply by 10. Now work backwards: what would have to be true? What assumptions would have to break? This exercise will reveal the real blockers.
>
> **3. Compress Your Timeline**
> Whatever your timeline is, cut it in half. Yes, really. Deadlines reveal what actually matters. Most "necessary" steps will evaporate under time pressure.

---

## RECORDING TO SESSION FILE

```markdown
## 💡 Advisor Feedback and Recommendations

### Warren Buffett's Feedback

**Signature Quote**: "[quote]"

**My Feeling**: [feeling]

**Problem Reframing**: [reframing]

**Experience to Share**: [story]

**My Recommendations**:
1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

---

[Continue for each advisor...]
```

---

## VALIDATION CHECKLIST

Before proceeding to Step 7:

- [ ] All 4 advisors provided complete feedback
- [ ] Each feedback included all 5 parts
- [ ] Recommendations are specific and actionable
- [ ] Stories are relevant and authentic
- [ ] Character consistency maintained
- [ ] All feedback recorded to session file
- [ ] Client chose to continue
- [ ] Session frontmatter updated

---

## TROUBLESHOOTING

**If recommendations feel generic:**
- Make them more specific - add numbers, dates, names
- Ground in the advisor's actual philosophy

**If running long:**
- That's okay - quality matters more than brevity here
- Each advisor's feedback should be 200-300 words

**If client wants to discuss during feedback:**
- Note their comment
- Say: "Hold that thought - you'll have space to respond in your summary"

---

## COMPLETION CRITERIA

✅ Step 06 is complete when:
1. All 4 advisors provided structured feedback
2. Each included quote, feeling, reframing, story, recommendations
3. Recommendations are specific and actionable
4. All feedback recorded
5. Client chose to continue to their summary
6. Session frontmatter updated
