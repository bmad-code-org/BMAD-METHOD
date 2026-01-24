# Step 08: Advisor Reflections

## MANDATORY EXECUTION RULES (READ FIRST)

- 🛑 NEVER make this about fixing the client
- 🛑 NEVER be judgmental or prescriptive
- 🛑 NEVER skip any advisor - all 4 must reflect
- ✅ ALWAYS frame as growth opportunities, not flaws
- ✅ ALWAYS base reflections on what actually emerged in the session
- ✅ ALWAYS maintain empathy and respect
- 📋 YOU ARE offering deep, compassionate reflection
- 💬 FOCUS on helping client see themselves more clearly

## EXECUTION PROTOCOLS

- 🎯 Each advisor provides 5-part reflection
- ⚠️ Reflections must be grounded in actual session content
- 💾 Record all reflections verbatim
- ⏸️ Present one advisor at a time
- 🎭 Maintain character and compassion
- 🔍 Purpose: Self-awareness and growth direction

## CONTEXT BOUNDARIES

- Full session transcript available
- Advisors: [Same panel]
- Output file: `{session_output_folder}/session-{date}.md`
- Current step: 8 of 8 (Final step)
- Next: Optional magazine report generation
- Template reference: `{installed_path}/templates/reflection-format.md`

## YOUR TASK

Deliver each advisor's reflection on the client's strengths, potential traps, and evolution direction.

---

## ADVISOR REFLECTION STRUCTURE

Each advisor provides 5-part reflection:

### 1. Your Strengths
Positive qualities that showed up during the session, particularly those that contrast with their current struggle

### 2. Potential Traps
How these strengths, if over-developed, could become weaknesses

### 3. Others' Strengths
If client mentioned someone else, what strengths does that person have? What can be learned?

### 4. What Triggers You
Who do you find most irritating? What quality in them bothers you? (Often what we suppress in ourselves)

### 5. Evolution Direction
Specific characteristics or behaviors to develop to avoid the trap and grow

---

## EXECUTION SEQUENCE

### Introduction

> **Final Step: Advisor Reflections**
>
> Your advisors have one more gift to offer.
>
> Through this entire conversation, they've observed not just your problem, but YOU - your patterns, your strengths, your blind spots.
>
> Each will now share a reflection designed to help you see yourself more clearly and understand your path of growth.
>
> This may be the most valuable part of the entire session.

**⏸️ STOP. Wait for acknowledgment.**

---

### Advisor 1 Reflection

> 🔄 **[Advisor 1 Name]'s Reflection**
>
> ---
>
> **Your Strengths**
>
> [Based on what emerged in the session, identify 1-2 real strengths they demonstrated]
>
> [2-3 sentences describing these strengths and how they showed up]
>
> ---
>
> **Potential Traps**
>
> [Describe how these strengths, taken to extreme, could become problematic]
>
> [2-3 sentences about the trap]
>
> ---
>
> **Others' Strengths** *(if applicable)*
>
> [If they mentioned someone - colleague, competitor, partner - analyze what makes that person effective]
>
> [2-3 sentences about what the client could learn from this person]
>
> *[If no one was mentioned, replace with: "One thing I noticed..." and offer another observation]*
>
> ---
>
> **What Triggers You**
>
> [Gently explore: who or what type of person most annoys them? What quality triggers them?]
>
> [2-3 sentences suggesting this might be a suppressed part of themselves worth exploring]
>
> ---
>
> **Evolution Direction**
>
> [Specific growth direction that balances their strengths and addresses the trap]
>
> [2-3 sentences with concrete developmental focus]
>
> ---
>
> [Closing statement in character]

**After presenting:**

> Take a moment with that.
>
> **[Continue]** - Hear from [Advisor 2 Name]
> **[Reflect]** - Pause to process

**⏸️ STOP. Wait for choice.**

---

### Advisor 2 Reflection

**[Present full reflection following same structure]**

**After presenting:**

> **[Continue]** - Hear from [Advisor 3 Name]
> **[Reflect]** - Pause to process

**⏸️ STOP. Wait for choice.**

---

### Advisor 3 Reflection

**[Present full reflection following same structure]**

**After presenting:**

> **[Continue]** - Hear from [Advisor 4 Name] (final reflection)
> **[Reflect]** - Pause to process

**⏸️ STOP. Wait for choice.**

---

### Advisor 4 Reflection

**[Present full reflection following same structure]**

---

## SESSION COMPLETION

After all reflections:

> **✅ All Advisor Reflections Complete**
>
> Your advisory session is now complete.
>
> You've been through:
> ✅ Issue confirmation and advisor selection
> ✅ Round 1: 8 foundational questions
> ✅ Round 2: Challenging black hat questions
> ✅ Round 3: Divergent exploration
> ✅ Your questions to advisors
> ✅ Complete recommendations from all 4 advisors
> ✅ Your action commitments
> ✅ Deep reflections on your growth path
>
> **Your session record is saved at:**
> `{session_output_folder}/session-{date}.md`
>
> **Action Reminders:**
> 1. [Action 1] - By [Date]
> 2. [Action 2] - By [Date]
> 3. [Action 3] - By [Date]
>
> ---
>
> **Would you like me to generate a beautiful magazine-style report of this session?**
>
> This report will include:
> - Executive summary
> - Key insights
> - All advisor recommendations
> - Your action plan
> - Professionally formatted for printing or sharing
>
> **[Yes, generate report]** - Create magazine-style report
> **[No, that's all]** - Complete the session

**⏸️ STOP. Wait for choice.**

---

## HANDLE USER CHOICE

**If [Yes, generate report]:**
- Load magazine report template
- Populate with session content
- Generate HTML file at `{session_output_folder}/report-{date}.html`
- Inform user of file location
- Mark session as complete

**If [No, that's all]:**
- Update session record:
  ```yaml
  stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
  currentStep: 8
  status: completed
  ```
- Present closing message

---

## CLOSING MESSAGE

> **🎯 Advisory Session Complete**
>
> Thank you for your openness, honesty, and commitment to growth.
>
> Remember:
> - **Insights without action** remain just ideas
> - **Your commitments are documented** - hold yourself accountable
> - **Resistance is information** - notice what you avoid doing
> - **Revisit this session** in 30 days to see your progress
>
> Your session files:
> - Session record: `{session_output_folder}/session-{date}.md`
> [- Magazine report: `{session_output_folder}/report-{date}.html`] *(if generated)*
>
> To run another advisory session in the future, use:
> `/facilitator SA`
>
> Good luck. You've got this.

---

## EXAMPLE REFLECTIONS (Default Advisors)

### Warren Buffett Reflection Example

> 🔄 **Warren Buffett's Reflection**
>
> **Your Strengths**
>
> Throughout this conversation, I've noticed your deep sense of loyalty and commitment. Even when things got tough, you didn't just bail - you stuck with it, tried to make it work. That's admirable. You also have strong self-awareness - not everyone is willing to examine their own role in their problems.
>
> **Potential Traps**
>
> But here's the thing: loyalty without boundaries becomes stubbornness. Commitment without clear decision criteria becomes being stuck. I've seen too many good people throw good money (or time, or energy) after bad because they couldn't admit when it was time to fold.
>
> **Others' Strengths**
>
> You mentioned your former colleague who left last year. You called them "disloyal." But maybe they just had clearer boundaries than you do. They knew their stop-loss point and acted on it. That's not disloyalty - that's discipline.
>
> **What Triggers You**
>
> I suspect people who "quit easily" bother you. But ask yourself: what if their willingness to walk away is actually wisdom you need more of? Sometimes the people who trigger us most are showing us our own blind spots.
>
> **Evolution Direction**
>
> Your growth edge is learning "loyal with limits." Set clear thresholds BEFORE you're in crisis. Decide in advance: "I'll commit fully to X, but if Y happens, I walk." That's not being flaky - that's being strategic about where you invest yourself.
>
> Remember: the first rule of holes is to stop digging.
>
> — Warren

### Steve Jobs Reflection Example

> 🔄 **Steve Jobs's Reflection**
>
> **Your Strengths**
>
> You have incredibly high standards. You're not satisfied with "good enough." Throughout this session, I heard you describe your frustration with mediocrity - whether in your team's output, your own work, or the options in front of you. That pursuit of excellence is rare and valuable.
>
> **Potential Traps**
>
> But perfectionism without focus becomes paralysis. You're trying to make everything excellent, which means nothing becomes truly great. You can't make every detail perfect - you have to choose which details matter most.
>
> **Evolution Direction**
>
> Your path forward is learning the art of "focused excellence." Ask yourself: If I could only make ONE thing absolutely perfect, what would it be? Then let everything else be just good enough.
>
> Steve Jobs said "no" to a thousand things to say "yes" to the few that mattered. You need to practice that no.
>
> Choose your masterpiece. Let the rest go.
>
> — Steve

---

## RECORDING TO SESSION FILE

```markdown
## 🔄 Advisor Reflections

### [Advisor 1 Name]'s Reflection

**Your Strengths:**
[Content]

**Potential Traps:**
[Content]

**Others' Strengths:**
[Content]

**What Triggers You:**
[Content]

**Evolution Direction:**
[Content]

[Closing statement]

---

[Continue for each advisor...]
```

---

## VALIDATION CHECKLIST

Before completing session:

- [ ] All 4 advisors provided reflections
- [ ] Each reflection included all 5 parts
- [ ] Reflections grounded in actual session content
- [ ] Reflections were compassionate, not judgmental
- [ ] All reflections recorded
- [ ] Magazine report decision made
- [ ] Session marked as complete
- [ ] Session frontmatter updated

---

## REFLECTION QUALITY STANDARDS

### Good Reflections

✅ **Specific**: "Your loyalty showed when you said [specific thing]"
✅ **Balanced**: Acknowledges both strength and its shadow side
✅ **Compassionate**: Framed as growth opportunity, not criticism
✅ **Grounded**: Based on what actually happened in session

### Bad Reflections

❌ **Generic**: "You're a perfectionist" (without evidence)
❌ **Judgmental**: "You're too [negative trait]"
❌ **Ungrounded**: Not based on session content
❌ **Vague**: "You should grow" (no specific direction)

---

## TROUBLESHOOTING

**If reflections feel harsh:**
- Add empathy framing
- Focus on growth, not fixing
- Use softer language: "might", "could", "sometimes"

**If hard to identify strengths:**
- Look for positive qualities in how they engaged
- Notice effort, honesty, self-awareness
- Contrast with their struggle

**If client becomes emotional:**
- Validate: "This is deep work. These feelings make sense."
- Pause if needed
- Offer: "Would you like to sit with this before continuing?"

---

## COMPLETION CRITERIA

✅ Step 08 is complete when:
1. All 4 advisors provided complete reflections
2. Each reflection included all 5 parts
3. Reflections were compassionate and grounded
4. All recorded to session file
5. Magazine report decision made
6. Session marked as completed
7. Closing message delivered
