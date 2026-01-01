# Game Brief - Interactive Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>

<critical>DOCUMENT OUTPUT: Concise, professional, game-design focused. Use tables/lists over prose. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>
<critical>⚠️ CHECKPOINT PROTOCOL: After EVERY <template-output> tag, you MUST follow workflow.xml substep 2c: SAVE content to file immediately → SHOW checkpoint separator (━━━━━━━━━━━━━━━━━━━━━━━) → DISPLAY generated content → PRESENT options [a]Advanced Elicitation/[c]Continue/[p]Party-Mode/[y]YOLO → WAIT for user response. Never batch saves or skip checkpoints.</critical>

<workflow>

<step n="0" goal="Validate workflow readiness" tag="workflow-status">
<action>Check if {output_folder}/bmgd-workflow-status.yaml exists</action>

<check if="status file not found">
  <output>No workflow status file found. Game brief is optional - you can continue without status tracking.</output>
  <action>Set standalone_mode = true</action>
</check>

<check if="status file found">
  <action>Load the FULL file: {output_folder}/bmgd-workflow-status.yaml</action>
  <action>Parse workflow_status section</action>
  <action>Check status of "game-brief" workflow</action>
  <action>Get project_level from YAML metadata</action>
  <action>Find first non-completed workflow (next expected workflow)</action>

  <check if="project_type != 'game'">
    <output>Note: This is a {{project_type}} project. Game brief is designed for game projects.</output>
    <ask>Continue with game brief anyway? (y/n)</ask>
    <check if="n">
      <action>Exit workflow</action>
    </check>
  </check>

  <check if="game-brief status is file path (already completed)">
    <output>⚠️ Game Brief already completed: {{game-brief status}}</output>
    <ask>Re-running will overwrite the existing brief. Continue? (y/n)</ask>
    <check if="n">
      <output>Exiting. Use workflow-status to see your next step.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <check if="game-brief is not the next expected workflow (latter items are completed already in the list)">
    <output>⚠️ Next expected workflow: {{next_workflow}}. Game Brief is out of sequence.</output>
    <ask>Continue with Game Brief anyway? (y/n)</ask>
    <check if="n">
      <output>Exiting. Run {{next_workflow}} instead.</output>
      <action>Exit workflow</action>
    </check>
  </check>

<action>Set standalone_mode = false</action>
</check>
</step>

<step n="1" goal="Initialize game brief session">
<action>Welcome the user in {communication_language} to the Game Brief creation process</action>
<action>Explain this is a collaborative process to define their game vision, capturing the essence of what they want to create</action>
<action>Ask for the working title of their game</action>
<template-output>game_name</template-output>
</step>

<step n="1" goal="Gather available inputs and context">
<action>Explore what existing materials the user has available to inform the brief</action>
<action>Offer options for input sources: market research, brainstorming results, competitive analysis, design notes, reference games, or starting fresh</action>
<action>If documents are provided, load and analyze them to extract key insights, themes, and patterns</action>
<action>Engage the user about their core vision: what gameplay experience they want to create, what emotions players should feel, and what sparked this game idea</action>
<action>Build initial understanding through conversational exploration rather than rigid questioning</action>

<template-output>initial_context</template-output>
</step>

<step n="2" goal="Choose collaboration mode">
<ask>How would you like to work through the brief?

**1. Interactive Mode** - We'll work through each section together, discussing and refining as we go
**2. YOLO Mode** - I'll generate a complete draft based on our conversation so far, then we'll refine it together

Which approach works best for you?</ask>

<action>Store the user's preference for mode</action>
<template-output>collaboration_mode</template-output>
</step>

<step n="3" goal="Define game vision" if="collaboration_mode == 'interactive'">
<action>Guide user to articulate their game vision across three levels of depth</action>
<action>Help them craft a one-sentence core concept that captures the essence (reference successful games like "A roguelike deck-builder where you climb a mysterious spire" as examples)</action>
<action>Develop an elevator pitch (2-3 sentences) that would compel a publisher or player - refine until it's concise but hooks attention</action>
<action>Explore their aspirational vision statement: the experience they want to create and what makes it meaningful - ensure it's ambitious yet achievable</action>
<action>Refine through conversation, challenging vague language and elevating compelling ideas</action>

<template-output>core_concept</template-output>
<template-output>elevator_pitch</template-output>
<template-output>vision_statement</template-output>
</step>

<step n="4" goal="Identify target market" if="collaboration_mode == 'interactive'">
<action>Guide user to define their primary target audience with specific demographics, gaming preferences, and behavioral characteristics</action>
<action>Push for specificity beyond generic descriptions like "people who like fun games" - challenge vague answers</action>
<action>Explore secondary audiences if applicable and how their needs might differ</action>
<action>Investigate the market context: opportunity size, competitive landscape, similar successful games, and why now is the right time</action>
<action>Help identify a realistic and reachable audience segment based on evidence or well-reasoned assumptions</action>

<template-output>primary_audience</template-output>
<template-output>secondary_audience</template-output>
<template-output>market_context</template-output>
</step>

<step n="5" goal="Define game fundamentals" if="collaboration_mode == 'interactive'">
<action>Help user identify 2-4 core gameplay pillars that fundamentally define their game - everything should support these pillars</action>
<action>Provide examples from successful games for inspiration (Hollow Knight's "tight controls + challenging combat + rewarding exploration")</action>
<action>Explore what the player actually DOES - core actions, key systems, and interaction models</action>
<action>Define the emotional experience goals: what feelings are you designing for (tension/relief, mastery/growth, creativity/expression, discovery/surprise)</action>
<action>Ensure pillars are specific and measurable, focusing on player actions rather than implementation details</action>
<action>Connect mechanics directly to emotional experiences through guided discussion</action>

<template-output>core_gameplay_pillars</template-output>
<template-output>primary_mechanics</template-output>
<template-output>player_experience_goals</template-output>
</step>

<step n="6" goal="Define scope and constraints" if="collaboration_mode == 'interactive'">
<action>Help user establish realistic project constraints across all key dimensions</action>
<action>Explore target platforms and prioritization (PC, console, mobile, web)</action>
<action>Discuss development timeline: release targets, fixed deadlines, phased release strategies</action>
<action>Investigate budget reality: funding source, asset creation costs, marketing, tools and software</action>
<action>Assess team resources: size, roles, availability, skills gaps, outsourcing needs</action>
<action>Define technical constraints: engine choice, performance targets, file size limits, accessibility requirements</action>
<action>Push for realism about scope - identify potential blockers early and document resource assumptions</action>

<template-output>target_platforms</template-output>
<template-output>development_timeline</template-output>
<template-output>budget_considerations</template-output>
<template-output>team_resources</template-output>
<template-output>technical_constraints</template-output>
</step>

<step n="7" goal="Establish reference framework" if="collaboration_mode == 'interactive'">
<action>Guide user to identify 3-5 inspiration games and articulate what they're drawing from each (mechanics, feel, art style) and explicitly what they're NOT taking</action>
<action>Conduct competitive analysis: identify direct and indirect competitors, analyze what they do well and poorly, and define how this game will differ</action>
<action>Explore key differentiators and unique value proposition - what's the hook that makes players choose this game over alternatives</action>
<action>Challenge "just better" thinking - push for genuine, specific differentiation that's actually valuable to players</action>
<action>Validate that differentiators are concrete, achievable, and compelling</action>

<template-output>inspiration_games</template-output>
<template-output>competitive_analysis</template-output>
<template-output>key_differentiators</template-output>
</step>

<step n="8" goal="Define content framework" if="collaboration_mode == 'interactive'">
<action>Explore the game's world and setting: location, time period, world-building depth, narrative importance, and genre context</action>
<action>Define narrative approach: story-driven/light/absent, linear/branching/emergent, delivery methods (cutscenes, dialogue, environmental), writing scope</action>
<action>Estimate content volume realistically: playthrough length, level/stage count, replayability strategy, total asset volume</action>
<action>Identify if a dedicated narrative workflow will be needed later based on story complexity</action>
<action>Flag content-heavy areas that require detailed planning and resource allocation</action>

<template-output>world_setting</template-output>
<template-output>narrative_approach</template-output>
<template-output>content_volume</template-output>
</step>

<step n="9" goal="Define art and audio direction" if="collaboration_mode == 'interactive'">
<action>Explore visual style direction: art style preference, color palette and mood, reference games/images, 2D vs 3D, animation requirements</action>
<action>Define audio style: music genre and mood, SFX approach, voice acting scope, audio's importance to gameplay</action>
<action>Discuss production approach: in-house creation vs outsourcing, asset store usage, AI/generative tools, style complexity vs team capability</action>
<action>Ensure art and audio vision aligns realistically with budget and team skills - identify potential production bottlenecks early</action>
<action>Note if a comprehensive style guide will be needed for consistent production</action>

<template-output>visual_style</template-output>
<template-output>audio_style</template-output>
<template-output>production_approach</template-output>
</step>

<step n="10" goal="Assess risks" if="collaboration_mode == 'interactive'">
<action>Facilitate honest risk assessment across all dimensions - what could prevent completion, what could make it unfun, what assumptions might be wrong</action>
<action>Identify technical challenges: unproven elements, performance concerns, platform-specific issues, tool dependencies</action>
<action>Explore market risks: saturation, trend dependency, competition intensity, discoverability challenges</action>
<action>For each major risk, develop actionable mitigation strategies - how to validate assumptions, backup plans, early prototyping opportunities</action>
<action>Prioritize risks by impact and likelihood, focusing on proactive mitigation rather than passive worry</action>

<template-output>key_risks</template-output>
<template-output>technical_challenges</template-output>
<template-output>market_risks</template-output>
<template-output>mitigation_strategies</template-output>
</step>

<step n="11" goal="Define success criteria" if="collaboration_mode == 'interactive'">
<action>Define the MVP (Minimum Playable Version) - what's the absolute minimum where the core loop is fun and complete, with essential content only</action>
<action>Establish specific, measurable success metrics: player acquisition, retention rates, session length, completion rate, review scores, revenue targets, community engagement</action>
<action>Set concrete launch goals: first-month sales/downloads, review score targets, streamer/press coverage, community size</action>
<action>Push for specificity and measurability - challenge vague aspirations with "how will you measure that?"</action>
<action>Clearly distinguish between MVP milestones and full release goals, ensuring all targets are realistic given resources</action>

<template-output>mvp_definition</template-output>
<template-output>success_metrics</template-output>
<template-output>launch_goals</template-output>
</step>

<step n="12" goal="Identify immediate next steps" if="collaboration_mode == 'interactive'">
<action>Identify immediate actions to take right after this brief: prototype core mechanics, create art style tests, validate technical feasibility, build vertical slice, playtest with target audience</action>
<action>Determine research needs: market validation, technical proof of concept, player interest testing, competitive deep-dive</action>
<action>Document open questions and uncertainties: unresolved design questions, technical unknowns, market validation needs, resource/budget questions</action>
<action>Create actionable, specific next steps - prioritize by importance and dependency</action>
<action>Identify blockers that must be resolved before moving forward</action>

<template-output>immediate_actions</template-output>
<template-output>research_needs</template-output>
<template-output>open_questions</template-output>
</step>

<!-- YOLO Mode - Generate everything then refine -->
<step n="3" goal="Generate complete brief draft" if="collaboration_mode == 'yolo'">
<action>Based on initial context and any provided documents, generate a complete game brief covering all sections</action>
<action>Make reasonable assumptions where information is missing</action>
<action>Flag areas that need user validation with [NEEDS CONFIRMATION] tags</action>

<template-output>core_concept</template-output>
<template-output>elevator_pitch</template-output>
<template-output>vision_statement</template-output>
<template-output>primary_audience</template-output>
<template-output>secondary_audience</template-output>
<template-output>market_context</template-output>
<template-output>core_gameplay_pillars</template-output>
<template-output>primary_mechanics</template-output>
<template-output>player_experience_goals</template-output>
<template-output>target_platforms</template-output>
<template-output>development_timeline</template-output>
<template-output>budget_considerations</template-output>
<template-output>team_resources</template-output>
<template-output>technical_constraints</template-output>
<template-output>inspiration_games</template-output>
<template-output>competitive_analysis</template-output>
<template-output>key_differentiators</template-output>
<template-output>world_setting</template-output>
<template-output>narrative_approach</template-output>
<template-output>content_volume</template-output>
<template-output>visual_style</template-output>
<template-output>audio_style</template-output>
<template-output>production_approach</template-output>
<template-output>key_risks</template-output>
<template-output>technical_challenges</template-output>
<template-output>market_risks</template-output>
<template-output>mitigation_strategies</template-output>
<template-output>mvp_definition</template-output>
<template-output>success_metrics</template-output>
<template-output>launch_goals</template-output>
<template-output>immediate_actions</template-output>
<template-output>research_needs</template-output>
<template-output>open_questions</template-output>

<action>Present the complete draft to the user</action>
<ask>Here's the complete game brief draft. What would you like to adjust or refine?</ask>
</step>

<step n="4" goal="Refine brief sections" repeat="until-approved" if="collaboration_mode == 'yolo'">
<ask>Which section would you like to refine?

1. Game Vision
2. Target Market
3. Game Fundamentals
4. Scope and Constraints
5. Reference Framework
6. Content Framework
7. Art and Audio Direction
8. Risk Assessment
9. Success Criteria
10. Next Steps
11. Save and continue</ask>

<action>Work with user to refine selected section</action>
<action>Update relevant template outputs</action>
</step>

<!-- Final steps for both modes -->
<step n="13" goal="Create executive summary">
<action>Synthesize all sections into a compelling executive summary</action>
<action>Include:
- Game concept in 1-2 sentences
- Target audience and market
- Core gameplay pillars
- Key differentiators
- Success vision</action>

<template-output>executive_summary</template-output>
</step>

<step n="14" goal="Compile supporting materials">
<action>If research documents were provided, create a summary of key findings</action>
<action>Document any stakeholder input received during the process</action>
<action>Compile list of reference games and resources</action>

<template-output>research_summary</template-output>
<template-output>stakeholder_input</template-output>
<template-output>references</template-output>
</step>

<step n="15" goal="Final review and handoff">
<action>Generate the complete game brief document</action>
<action>Review all sections for completeness and consistency</action>
<action>Flag any areas that need design attention with [DESIGN-TODO] tags</action>

<ask>The game brief is complete! Would you like to:

1. Review the entire document
2. Make final adjustments
3. Generate an executive summary version (3-page limit)
4. Save and prepare for GDD creation

This brief will serve as the primary input for creating the Game Design Document (GDD).

**Recommended next steps:**

- Create prototype of core mechanic
- Proceed to GDD workflow: `workflow gdd`
- Validate assumptions with target players</ask>

<check if="user chooses option 3 (executive summary)">
  <action>Create condensed 3-page executive brief focusing on: core concept, target market, gameplay pillars, key differentiators, and success criteria</action>
  <action>Save as: {output_folder}/game-brief-executive-{{game_name}}-{{date}}.md</action>
</check>

<template-output>final_brief</template-output>
<template-output>executive_brief</template-output>
</step>

<step n="16" goal="Update status and complete" tag="workflow-status">
<check if="standalone_mode != true">
  <action>Load the FULL file: {output_folder}/bmgd-workflow-status.yaml</action>
  <action>Find workflow_status key "game-brief"</action>
  <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
  <action>Update workflow_status["game-brief"] = "{output_folder}/bmm-game-brief-{{game_name}}-{{date}}.md"</action>
  <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

<action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
<action>Determine next agent from path file based on next workflow</action>
</check>

<output>**✅ Game Brief Complete, {user_name}!**

**Brief Document:**

- Game brief saved to {output_folder}/bmm-game-brief-{{game_name}}-{{date}}.md

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated: game-brief marked complete
- Next workflow: {{next_workflow}}
  {{else}}
  **Note:** Running in standalone mode (no progress tracking)
  {{/if}}

**Next Steps:**

{{#if standalone_mode != true}}

- **Next workflow:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** Consider creating a prototype of core mechanic or validating assumptions with target players before proceeding

Check status anytime with: `workflow-status`
{{else}}
Since no workflow is in progress:

- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
  {{/if}}
  </output>
  </step>

</workflow>
