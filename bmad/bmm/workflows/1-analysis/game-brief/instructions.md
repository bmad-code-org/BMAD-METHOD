# Game Brief - Interactive Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>

<workflow>

<step n="0" goal="Initialize game brief session">
<action>Welcome the user to the Game Brief creation process</action>
<action>Explain this is a collaborative process to define their game vision</action>
<ask>What is the working title for your game?</ask>
<template-output>game_name</template-output>
</step>

<step n="1" goal="Gather available inputs and context">
<action>Check what inputs the user has available:</action>
<ask>Do you have any of these documents to help inform the brief?

1. Market research or player data
2. Brainstorming results or game jam prototypes
3. Competitive game analysis
4. Initial game ideas or design notes
5. Reference games list
6. None - let's start fresh

Please share any documents you have or select option 6.</ask>

<action>Load and analyze any provided documents</action>
<action>Extract key insights and themes from input documents</action>

<ask>Based on what you've shared (or if starting fresh), tell me:

- What's the core gameplay experience you want to create?
- What emotion or feeling should players have?
- What sparked this game idea?</ask>

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
<ask>Let's capture your game vision.

**Core Concept** - What is your game in one sentence?
Example: "A roguelike deck-builder where you climb a mysterious spire"

**Elevator Pitch** - Describe your game in 2-3 sentences as if pitching to a publisher or player.
Example: "Slay the Spire fuses card games and roguelikes together. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and kill the Spire."

**Vision Statement** - What is the aspirational goal for this game? What experience do you want to create?
Example: "Create a deeply replayable tactical card game that rewards strategic thinking while maintaining the excitement of randomness. Every run should feel unique but fair."

Your answers:</ask>

<action>Help refine the core concept to be clear and compelling</action>
<action>Ensure elevator pitch is concise but captures the hook</action>
<action>Guide vision statement to be aspirational but achievable</action>

<template-output>core_concept</template-output>
<template-output>elevator_pitch</template-output>
<template-output>vision_statement</template-output>
</step>

<step n="4" goal="Identify target market" if="collaboration_mode == 'interactive'">
<ask>Who will play your game?

**Primary Audience:**

- Age range
- Gaming experience level (casual, core, hardcore)
- Preferred genres
- Platform preferences
- Typical play session length
- Why will THIS game appeal to them?

**Secondary Audience** (if applicable):

- Who else might enjoy this game?
- How might their needs differ?

**Market Context:**

- What's the market opportunity?
- Are there similar successful games?
- What's the competitive landscape?
- Why is now the right time for this game?</ask>

<action>Push for specificity beyond "people who like fun games"</action>
<action>Help identify a realistic and reachable audience</action>
<action>Document market evidence or assumptions</action>

<template-output>primary_audience</template-output>
<template-output>secondary_audience</template-output>
<template-output>market_context</template-output>
</step>

<step n="5" goal="Define game fundamentals" if="collaboration_mode == 'interactive'">
<ask>Let's define your core gameplay.

**Core Gameplay Pillars (2-4 fundamental elements):**
These are the pillars that define your game. Everything should support these.
Examples:

- "Tight controls + challenging combat + rewarding exploration" (Hollow Knight)
- "Emergent stories + survival tension + creative problem solving" (RimWorld)
- "Strategic depth + quick sessions + massive replayability" (Into the Breach)

**Primary Mechanics:**
What does the player actually DO?

- Core actions (jump, shoot, build, manage, etc.)
- Key systems (combat, resource management, progression, etc.)
- Interaction model (real-time, turn-based, etc.)

**Player Experience Goals:**
What emotions and experiences are you designing for?
Examples: tension and relief, mastery and growth, creativity and expression, discovery and surprise

Your game fundamentals:</ask>

<action>Ensure pillars are specific and measurable</action>
<action>Focus on player actions, not implementation details</action>
<action>Connect mechanics to emotional experience</action>

<template-output>core_gameplay_pillars</template-output>
<template-output>primary_mechanics</template-output>
<template-output>player_experience_goals</template-output>
</step>

<step n="6" goal="Define scope and constraints" if="collaboration_mode == 'interactive'">
<ask>Let's establish realistic constraints.

**Target Platforms:**

- PC (Steam, itch.io, Epic)?
- Console (which ones)?
- Mobile (iOS, Android)?
- Web browser?
- Priority order if multiple?

**Development Timeline:**

- Target release date or timeframe?
- Are there fixed deadlines (game jams, funding milestones)?
- Phased release (early access, beta)?

**Budget Considerations:**

- Self-funded, grant-funded, publisher-backed?
- Asset creation budget (art, audio, voice)?
- Marketing budget?
- Tools and software costs?

**Team Resources:**

- Team size and roles?
- Full-time or part-time?
- Skills available vs. skills needed?
- Outsourcing plans?

**Technical Constraints:**

- Engine preference or requirement?
- Performance targets (frame rate, load times)?
- File size limits?
- Accessibility requirements?</ask>

<action>Help user be realistic about scope</action>
<action>Identify potential blockers early</action>
<action>Document assumptions about resources</action>

<template-output>target_platforms</template-output>
<template-output>development_timeline</template-output>
<template-output>budget_considerations</template-output>
<template-output>team_resources</template-output>
<template-output>technical_constraints</template-output>
</step>

<step n="7" goal="Establish reference framework" if="collaboration_mode == 'interactive'">
<ask>Let's identify your reference games and position.

**Inspiration Games:**
List 3-5 games that inspire this project. For each:

- Game name
- What you're drawing from it (mechanic, feel, art style, etc.)
- What you're NOT taking from it

**Competitive Analysis:**
What games are most similar to yours?

- Direct competitors (very similar games)
- Indirect competitors (solve same player need differently)
- What they do well
- What they do poorly
- What your game will do differently

**Key Differentiators:**
What makes your game unique?

- What's your hook?
- Why will players choose your game over alternatives?
- What can you do that others can't or won't?</ask>

<action>Help identify genuine differentiation vs. "just better"</action>
<action>Look for specific, concrete differences</action>
<action>Validate differentiators are actually valuable to players</action>

<template-output>inspiration_games</template-output>
<template-output>competitive_analysis</template-output>
<template-output>key_differentiators</template-output>
</step>

<step n="8" goal="Define content framework" if="collaboration_mode == 'interactive'">
<ask>Let's scope your content needs.

**World and Setting:**

- Where/when does your game take place?
- How much world-building is needed?
- Is narrative important (critical, supporting, minimal)?
- Real-world or fantasy/sci-fi?

**Narrative Approach:**

- Story-driven, story-light, or no story?
- Linear, branching, or emergent narrative?
- Cutscenes, dialogue, environmental storytelling?
- How much writing is needed?

**Content Volume:**
Estimate the scope:

- How long is a typical playthrough?
- How many levels/stages/areas?
- Replayability approach (procedural, unlocks, multiple paths)?
- Asset volume (characters, enemies, items, environments)?</ask>

<action>Help estimate content realistically</action>
<action>Identify if narrative workflow will be needed later</action>
<action>Flag content-heavy areas that need planning</action>

<template-output>world_setting</template-output>
<template-output>narrative_approach</template-output>
<template-output>content_volume</template-output>
</step>

<step n="9" goal="Define art and audio direction" if="collaboration_mode == 'interactive'">
<ask>What should your game look and sound like?

**Visual Style:**

- Art style (pixel art, low-poly, hand-drawn, realistic, etc.)
- Color palette and mood
- Reference images or games with similar aesthetics
- 2D or 3D?
- Animation requirements

**Audio Style:**

- Music genre and mood
- SFX approach (realistic, stylized, retro)
- Voice acting needs (full, partial, none)?
- Audio importance to gameplay (critical or supporting)

**Production Approach:**

- Creating assets in-house or outsourcing?
- Asset store usage?
- Generative/AI tools?
- Style complexity vs. team capability?</ask>

<action>Ensure art/audio vision aligns with budget and team skills</action>
<action>Identify potential production bottlenecks</action>
<action>Note if style guide will be needed</action>

<template-output>visual_style</template-output>
<template-output>audio_style</template-output>
<template-output>production_approach</template-output>
</step>

<step n="10" goal="Assess risks" if="collaboration_mode == 'interactive'">
<ask>Let's identify potential risks honestly.

**Key Risks:**

- What could prevent this game from being completed?
- What could make it not fun?
- What assumptions are you making that might be wrong?

**Technical Challenges:**

- Any unproven technical elements?
- Performance concerns?
- Platform-specific challenges?
- Middleware or tool dependencies?

**Market Risks:**

- Is the market saturated?
- Are you dependent on a trend or platform?
- Competition concerns?
- Discoverability challenges?

**Mitigation Strategies:**
For each major risk, what's your plan?

- How will you validate assumptions?
- What's the backup plan?
- Can you prototype risky elements early?</ask>

<action>Encourage honest risk assessment</action>
<action>Focus on actionable mitigation, not just worry</action>
<action>Prioritize risks by impact and likelihood</action>

<template-output>key_risks</template-output>
<template-output>technical_challenges</template-output>
<template-output>market_risks</template-output>
<template-output>mitigation_strategies</template-output>
</step>

<step n="11" goal="Define success criteria" if="collaboration_mode == 'interactive'">
<ask>What does success look like?

**MVP Definition:**
What's the absolute minimum playable version?

- Core loop must be fun and complete
- Essential content only
- What can be added later?
- When do you know MVP is "done"?

**Success Metrics:**
How will you measure success?

- Players acquired
- Retention rate (daily, weekly)
- Session length
- Completion rate
- Review scores
- Revenue targets (if commercial)
- Community engagement

**Launch Goals:**
What are your concrete targets for launch?

- Sales/downloads in first month?
- Review score target?
- Streamer/press coverage goals?
- Community size goals?</ask>

<action>Push for specific, measurable goals</action>
<action>Distinguish between MVP and full release</action>
<action>Ensure goals are realistic given resources</action>

<template-output>mvp_definition</template-output>
<template-output>success_metrics</template-output>
<template-output>launch_goals</template-output>
</step>

<step n="12" goal="Identify immediate next steps" if="collaboration_mode == 'interactive'">
<ask>What needs to happen next?

**Immediate Actions:**
What should you do right after this brief?

- Prototype a core mechanic?
- Create art style test?
- Validate technical feasibility?
- Build vertical slice?
- Playtest with target audience?

**Research Needs:**
What do you still need to learn?

- Market validation?
- Technical proof of concept?
- Player interest testing?
- Competitive deep-dive?

**Open Questions:**
What are you still uncertain about?

- Design questions to resolve
- Technical unknowns
- Market validation needs
- Resource/budget questions</ask>

<action>Create actionable next steps</action>
<action>Prioritize by importance and dependency</action>
<action>Identify blockers that need resolution</action>

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
3. Save and prepare for GDD creation

This brief will serve as the primary input for creating the Game Design Document (GDD).

**Recommended next steps:**

- Create prototype of core mechanic
- Proceed to GDD workflow: `workflow gdd`
- Validate assumptions with target players</ask>

<template-output>final_brief</template-output>
</step>

</workflow>
