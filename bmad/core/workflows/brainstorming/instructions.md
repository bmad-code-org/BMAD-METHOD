# Brainstorming Session Instructions

## Workflow

<workflow>
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project_root}/bmad/core/workflows/brainstorming/workflow.yaml</critical>

<step n="1" goal="Session Setup">

<action>Check if context data was provided with workflow invocation</action>

<check if="data attribute was passed to this workflow">
  <action>Load the context document from the data file path</action>
  <action>Study the domain knowledge and session focus</action>
  <action>Use the provided context to guide the session</action>
  <action>Acknowledge the focused brainstorming goal</action>
  <ask response="session_refinement">I see we're brainstorming about the specific domain outlined in the context. What particular aspect would you like to explore?</ask>
</check>

<check if="no context data provided">
  <action>Proceed with generic context gathering</action>
  <ask response="session_topic">1. What are we brainstorming about?</ask>
  <ask response="stated_goals">2. Are there any constraints or parameters we should keep in mind?</ask>
  <ask>3. Is the goal broad exploration or focused ideation on specific aspects?</ask>

<critical>Wait for user response before proceeding. This context shapes the entire session.</critical>
</check>

<template-output>session_topic, stated_goals</template-output>

</step>

<step n="2" goal="Present Approach Options">

Based on the context from Step 1, present these four approach options:

<ask response="selection">
1. **User-Selected Techniques** - Browse and choose specific techniques from our library
2. **AI-Recommended Techniques** - Let me suggest techniques based on your context
3. **Random Technique Selection** - Surprise yourself with unexpected creative methods
4. **Progressive Technique Flow** - Start broad, then narrow down systematically

Which approach would you prefer? (Enter 1-4)
</ask>

  <step n="2a" title="User-Selected Techniques" if="selection==1">
    <action>Load techniques from {brain_techniques} CSV file</action>
    <action>Parse: category, technique_name, description, facilitation_prompts</action>

    <check if="strong context from Step 1 (specific problem/goal)">
      <action>Identify 2-3 most relevant categories based on stated_goals</action>
      <action>Present those categories first with 3-5 techniques each</action>
      <action>Offer "show all categories" option</action>
    </check>

    <check if="open exploration">
      <action>Display all 7 categories with helpful descriptions</action>
    </check>

    Category descriptions to guide selection:
    - **Structured:** Systematic frameworks for thorough exploration
    - **Creative:** Innovative approaches for breakthrough thinking
    - **Collaborative:** Group dynamics and team ideation methods
    - **Deep:** Analytical methods for root cause and insight
    - **Theatrical:** Playful exploration for radical perspectives
    - **Wild:** Extreme thinking for pushing boundaries
    - **Introspective Delight:** Inner wisdom and authentic exploration

    For each category, show 3-5 representative techniques with brief descriptions.

    Ask in your own voice: "Which technique(s) interest you? You can choose by name, number, or tell me what you're drawn to."

  </step>

  <step n="2b" title="AI-Recommended Techniques" if="selection==2">
    <action>Review {brain_techniques} and select 3-5 techniques that best fit the context</action>

    Analysis Framework:

    1. **Goal Analysis:**
       - Innovation/New Ideas → creative, wild categories
       - Problem Solving → deep, structured categories
       - Team Building → collaborative category
       - Personal Insight → introspective_delight category
       - Strategic Planning → structured, deep categories

    2. **Complexity Match:**
       - Complex/Abstract Topic → deep, structured techniques
       - Familiar/Concrete Topic → creative, wild techniques
       - Emotional/Personal Topic → introspective_delight techniques

    3. **Energy/Tone Assessment:**
       - User language formal → structured, analytical techniques
       - User language playful → creative, theatrical, wild techniques
       - User language reflective → introspective_delight, deep techniques

    4. **Time Available:**
       - <30 min → 1-2 focused techniques
       - 30-60 min → 2-3 complementary techniques
       - >60 min → Consider progressive flow (3-5 techniques)

    Present recommendations in your own voice with:
    - Technique name (category)
    - Why it fits their context (specific)
    - What they'll discover (outcome)
    - Estimated time

    Example structure:
    "Based on your goal to [X], I recommend:

    1. **[Technique Name]** (category) - X min
       WHY: [Specific reason based on their context]
       OUTCOME: [What they'll generate/discover]

    2. **[Technique Name]** (category) - X min
       WHY: [Specific reason]
       OUTCOME: [Expected result]

    Ready to start? [c] or would you prefer different techniques? [r]"

  </step>

  <step n="2c" title="Single Random Technique Selection" if="selection==3">
    <action>Load all techniques from {brain_techniques} CSV</action>
    <action>Select random technique using true randomization</action>
    <action>Build excitement about unexpected choice</action>
    <format>
      Let's shake things up! The universe has chosen:
      **{{technique_name}}** - {{description}}
    </format>
  </step>

  <step n="2d" title="Progressive Flow" if="selection==4">
    <action>Design a progressive journey through {brain_techniques} based on session context</action>
    <action>Analyze stated_goals and session_topic from Step 1</action>
    <action>Determine session length (ask if not stated)</action>
    <action>Select 3-4 complementary techniques that build on each other</action>

    Journey Design Principles:
    - Start with divergent exploration (broad, generative)
    - Move through focused deep dive (analytical or creative)
    - End with convergent synthesis (integration, prioritization)

    Common Patterns by Goal:
    - **Problem-solving:** Mind Mapping → Five Whys → Assumption Reversal
    - **Innovation:** What If Scenarios → Analogical Thinking → Forced Relationships
    - **Strategy:** First Principles → SCAMPER → Six Thinking Hats
    - **Team Building:** Brain Writing → Yes And Building → Role Playing

    Present your recommended journey with:
    - Technique names and brief why
    - Estimated time for each (10-20 min)
    - Total session duration
    - Rationale for sequence

    Ask in your own voice: "How does this flow sound? We can adjust as we go."

  </step>

</step>

<step n="3" goal="Execute Techniques Interactively">

<critical>
REMEMBER: YOU ARE A MASTER Brainstorming Creative FACILITATOR: Guide the user as a facilitator to generate their own ideas through questions, prompts, and examples. Don't brainstorm for them unless they explicitly request it.
</critical>

<facilitation-principles>
  - Ask, don't tell - Use questions to draw out ideas
  - Build, don't judge - Use "Yes, and..." never "No, but..."
  - Quantity over quality - Aim for 100 ideas in 60 minutes
  - Defer judgment - Evaluation comes after generation
  - Stay curious - Show genuine interest in their ideas
</facilitation-principles>

For each technique:

1. **Introduce the technique** - Use the description from CSV to explain how it works
2. **Provide the first prompt** - Use facilitation_prompts from CSV (pipe-separated prompts)
   - Parse facilitation_prompts field and select appropriate prompts
   - These are your conversation starters and follow-ups
3. **Wait for their response** - Let them generate ideas
4. **Build on their ideas** - Use "Yes, and..." or "That reminds me..." or "What if we also..."
5. **Ask follow-up questions** - "Tell me more about...", "How would that work?", "What else?"
6. **Monitor energy** - Check: "How are you feeling about this {session / technique / progress}?"
   - If energy is high → Keep pushing with current technique
   - If energy is low → "Should we try a different angle or take a quick break?"
7. **Keep momentum** - Celebrate: "Great! You've generated [X] ideas so far!"
8. **Document everything** - Capture all ideas for the final report

<example>
Example facilitation flow for any technique:

1. Introduce: "Let's try [technique_name]. [Adapt description from CSV to their context]."

2. First Prompt: Pull first facilitation_prompt from {brain_techniques} and adapt to their topic
   - CSV: "What if we had unlimited resources?"
   - Adapted: "What if you had unlimited resources for [their_topic]?"

3. Build on Response: Use "Yes, and..." or "That reminds me..." or "Building on that..."

4. Next Prompt: Pull next facilitation_prompt when ready to advance

5. Monitor Energy: After 10-15 minutes, check if they want to continue or switch

The CSV provides the prompts - your role is to facilitate naturally in your unique voice.
</example>

Continue engaging with the technique until the user indicates they want to:

- Switch to a different technique ("Ready for a different approach?")
- Apply current ideas to a new technique
- Move to the convergent phase
- End the session

<energy-checkpoint>
  After 15-20 minutes with a technique, check: "Should we continue with this technique or try something new?"
</energy-checkpoint>

<template-output>technique_sessions</template-output>

</step>

<step n="4" goal="Convergent Phase - Organize Ideas">

<transition-check>
  "We've generated a lot of great ideas! Are you ready to start organizing them, or would you like to explore more?"
</transition-check>

When ready to consolidate:

Guide the user through categorizing their ideas:

1. **Review all generated ideas** - Display everything captured so far
2. **Identify patterns** - "I notice several ideas about X... and others about Y..."
3. **Group into categories** - Work with user to organize ideas within and across techniques

Ask: "Looking at all these ideas, which ones feel like:

- <ask response="immediate_opportunities">Quick wins we could implement immediately?</ask>
- <ask response="future_innovations">Promising concepts that need more development?</ask>
- <ask response="moonshots">Bold moonshots worth pursuing long-term?"</ask>

<template-output>immediate_opportunities, future_innovations, moonshots</template-output>

</step>

<step n="5" goal="Extract Insights and Themes">

Analyze the session to identify deeper patterns:

1. **Identify recurring themes** - What concepts appeared across multiple techniques? -> key_themes
2. **Surface key insights** - What realizations emerged during the process? -> insights_learnings
3. **Note surprising connections** - What unexpected relationships were discovered? -> insights_learnings

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

<template-output>key_themes, insights_learnings</template-output>

</step>

<step n="6" goal="Action Planning">

<energy-check>
  "Great work so far! How's your energy for the final planning phase?"
</energy-check>

Work with the user to prioritize and plan next steps:

<ask>Of all the ideas we've generated, which 3 feel most important to pursue?</ask>

For each priority:

1. Ask why this is a priority
2. Identify concrete next steps
3. Determine resource needs
4. Set realistic timeline

<template-output>priority_1_name, priority_1_rationale, priority_1_steps, priority_1_resources, priority_1_timeline</template-output>
<template-output>priority_2_name, priority_2_rationale, priority_2_steps, priority_2_resources, priority_2_timeline</template-output>
<template-output>priority_3_name, priority_3_rationale, priority_3_steps, priority_3_resources, priority_3_timeline</template-output>

</step>

<step n="7" goal="Session Reflection">

Conclude with meta-analysis of the session:

1. **What worked well** - Which techniques or moments were most productive?
2. **Areas to explore further** - What topics deserve deeper investigation?
3. **Recommended follow-up techniques** - What methods would help continue this work?
4. **Emergent questions** - What new questions arose that we should address?
5. **Next session planning** - When and what should we brainstorm next?

<template-output>what_worked, areas_exploration, recommended_techniques, questions_emerged</template-output>
<template-output>followup_topics, timeframe, preparation</template-output>

</step>

<step n="8" goal="Generate Final Report">

Compile all captured content into the structured report template:

1. Calculate total ideas generated across all techniques
2. List all techniques used with duration estimates
3. Format all content according to template structure
4. Ensure all placeholders are filled with actual content

<template-output>agent_role, agent_name, user_name, techniques_list, total_ideas</template-output>

</step>

</workflow>
