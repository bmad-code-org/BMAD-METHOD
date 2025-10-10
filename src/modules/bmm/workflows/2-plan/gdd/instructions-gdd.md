# GDD Workflow - Game Projects (All Levels)

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is the GDD instruction set for GAME projects - replaces PRD with Game Design Document</critical>
<critical>Project analysis already completed - proceeding with game-specific design</critical>
<critical>Uses gdd_template for GDD output, game_types.csv for type-specific sections</critical>
<critical>Routes to 3-solutioning for architecture (platform-specific decisions handled there)</critical>
<critical>If users mention technical details, append to technical_preferences with timestamp</critical>

<step n="1" goal="Load context and determine game type">

<action>Load project-workflow-analysis.md</action>
<action>Confirm project_type == "game"</action>

<check if="continuation_mode == true">
  <action>Load existing GDD.md and check completion status</action>
  <ask>Found existing work. Would you like to:
  1. Review what's done and continue
  2. Modify existing sections
  3. Start fresh
  </ask>
  <action>If continuing, skip to first incomplete section</action>
</check>

<action if="new or starting fresh">Check or existing game-brief in output_folder</action>

<check if="game-brief exists">
  <ask>Found existing game brief! Would you like to:

1. Use it as input (recommended - I'll extract key info)
2. Ignore it and start fresh
   </ask>
   </check>

<check if="using game-brief">
  <action>Load and analyze game-brief document</action>
  <action>Extract: game_name, core_concept, target_audience, platforms, game_pillars, primary_mechanics</action>
  <action>Pre-fill relevant GDD sections with game-brief content</action>
  <action>Note which sections were pre-filled from brief</action>

</check>

<check if="no game-brief was loaded">
  <ask>Describe your game. What is it about? What does the player do? What is the Genre or type?</ask>

<action>Analyze description to determine game type</action>
<action>Map to closest game_types.csv id or use "custom"</action>
</check>

<check if="else (game-brief was loaded)">
  <action>Use game concept from brief to determine game type</action>

  <ask optional="true">
    I've identified this as a **{{game_type}}** game. Is that correct?
    If not, briefly describe what type it should be:
  </ask>

<action>Map selection to game_types.csv id</action>
<action>Load corresponding fragment file from game-types/ folder</action>
<action>Store game_type for later injection</action>

<action>Load gdd_template from workflow.yaml</action>

Get core game concept and vision.

<template-output>description</template-output>
</check>

</step>

<step n="2" goal="Define platforms and target audience">

<ask>What platform(s) are you targeting?

- Desktop (Windows/Mac/Linux)
- Mobile (iOS/Android)
- Web (Browser-based)
- Console (which consoles?)
- Multiple platforms

Your answer:</ask>

<template-output>platforms</template-output>

<ask>Who is your target audience?

Consider:

- Age range
- Gaming experience level (casual, core, hardcore)
- Genre familiarity
- Play session length preferences

Your answer:</ask>

<template-output>target_audience</template-output>

</step>

<step n="3" goal="Define goals and context">

**Goal Guidelines based on project level:**

- Level 0-1: 1-2 primary goals
- Level 2: 2-3 primary goals
- Level 3-4: 3-5 strategic goals

<template-output>goals</template-output>

Brief context on why this game matters now.

<template-output>context</template-output>

</step>

<step n="4" goal="Core gameplay definition">

<critical>These are game-defining decisions</critical>

<ask>What are the core game pillars (2-4 fundamental gameplay elements)?

Examples:

- Tight controls + challenging combat + rewarding exploration
- Strategic depth + replayability + quick sessions
- Narrative + atmosphere + player agency

Your game pillars:</ask>

<template-output>game_pillars</template-output>

<ask>Describe the core gameplay loop (what the player does repeatedly):

Example: "Player explores level → encounters enemies → defeats enemies with abilities → collects resources → upgrades abilities → explores deeper"

Your gameplay loop:</ask>

<template-output>gameplay_loop</template-output>

<ask>How does the player win? How do they lose?</ask>

<template-output>win_loss_conditions</template-output>

</step>

<step n="5" goal="Game mechanics and controls">

Define the primary game mechanics.

<template-output>primary_mechanics</template-output>
<elicit-required/>

<ask>Describe the control scheme and input method:

- Keyboard + Mouse
- Gamepad
- Touch screen
- Other

Include key bindings or button layouts if known.</ask>

<template-output>controls</template-output>

</step>

<step n="6" goal="Inject game-type-specific sections">

<action>Load game-type fragment from: {installed_path}/gdd/game-types/{{game_type}}.md</action>

<critical>Process each section in the fragment template</critical>

For each {{placeholder}} in the fragment, elicit and capture that information.

<template-output file="GDD.md">GAME_TYPE_SPECIFIC_SECTIONS</template-output>

<elicit-required/>

</step>

<step n="7" goal="Progression and balance">

<ask>How does player progression work?

- Skill-based (player gets better)
- Power-based (character gets stronger)
- Unlock-based (new abilities/areas)
- Narrative-based (story progression)
- Combination

Describe:</ask>

<template-output>player_progression</template-output>

<ask>Describe the difficulty curve:

- How does difficulty increase?
- Pacing (steady, spikes, player-controlled?)
- Accessibility options?</ask>

<template-output>difficulty_curve</template-output>

<ask optional="true">Is there an in-game economy or resource system?

Skip if not applicable.</ask>

<template-output>economy_resources</template-output>

</step>

<step n="8" goal="Level design framework">

<ask>What types of levels/stages does your game have?

Examples:

- Tutorial, early levels, mid-game, late-game, boss arenas
- Biomes/themes
- Procedural vs. handcrafted

Describe:</ask>

<template-output>level_types</template-output>

<ask>How do levels progress or unlock?

- Linear sequence
- Hub-based
- Open world
- Player choice

Describe:</ask>

<template-output>level_progression</template-output>

</step>

<step n="9" goal="Art and audio direction">

<ask>Describe the art style:

- Visual aesthetic (pixel art, low-poly, realistic, stylized, etc.)
- Color palette
- Inspirations or references

Your vision:</ask>

<template-output>art_style</template-output>

<ask>Describe audio and music direction:

- Music style/genre
- Sound effect tone
- Audio importance to gameplay

Your vision:</ask>

<template-output>audio_music</template-output>

</step>

<step n="10" goal="Technical specifications">

<ask>What are the performance requirements?

Consider:

- Target frame rate
- Resolution
- Load times
- Battery life (mobile)

Requirements:</ask>

<template-output>performance_requirements</template-output>

<ask>Any platform-specific considerations?

- Mobile: Touch controls, screen sizes
- PC: Keyboard/mouse, settings
- Console: Controller, certification
- Web: Browser compatibility, file size

Platform details:</ask>

<template-output>platform_details</template-output>

<ask>What are the key asset requirements?

- Art assets (sprites, models, animations)
- Audio assets (music, SFX, voice)
- Estimated asset counts/sizes
- Asset pipeline needs

Asset requirements:</ask>

<template-output>asset_requirements</template-output>

</step>

<step n="11" goal="Epic structure">

<action>Translate game features into development epics</action>

**Epic Guidelines based on project level:**

- Level 1: 1 epic with 1-10 stories
- Level 2: 1-2 epics with 5-15 stories total
- Level 3: 2-5 epics with 12-40 stories
- Level 4: 5+ epics with 40+ stories

<template-output>epics</template-output>
<elicit-required/>

</step>

<step n="12" goal="Generate detailed epic breakdown in epics.md">

<action>Load epics_template from workflow.yaml</action>

<critical>Create separate epics.md with full story hierarchy</critical>

<template-output file="epics.md">epic_overview</template-output>

<for-each epic="epic_list">

Generate Epic {{epic_number}} with expanded goals, capabilities, success criteria.

Generate all stories with:

- User story format
- Prerequisites
- Acceptance criteria (3-8 per story)
- Technical notes (high-level only)

<template-output file="epics.md">epic\_{{epic_number}}\_details</template-output>
<elicit-required/>

</for-each>

</step>
<step n="13" goal="Success metrics">

<ask>What technical metrics will you track?

Examples:

- Frame rate consistency
- Load times
- Crash rate
- Memory usage

Your metrics:</ask>

<template-output>technical_metrics</template-output>

<ask>What gameplay metrics will you track?

Examples:

- Player completion rate
- Average session length
- Difficulty pain points
- Feature engagement

Your metrics:</ask>

<template-output>gameplay_metrics</template-output>

</step>

<step n="14" goal="Document out of scope and assumptions">

<template-output>out_of_scope</template-output>

<template-output>assumptions_and_dependencies</template-output>

</step>

<step n="15" goal="Generate solutioning handoff and next steps">

<action>Check if game-type fragment contained narrative tags</action>

<check if="fragment had <narrative-workflow-critical> or <narrative-workflow-recommended>">
  <action>Set needs_narrative = true</action>
  <action>Extract narrative importance level from tag</action>

## Next Steps for {{game_name}}

</check>

<check if="needs_narrative == true">
  <ask>This game type ({{game_type}}) is **{{narrative_importance}}** for narrative.

Your game would benefit from a Narrative Design Document to detail:

- Story structure and beats
- Character profiles and arcs
- World lore and history
- Dialogue framework
- Environmental storytelling

Would you like to create a Narrative Design Document now?

1. Yes, create Narrative Design Document (recommended)
2. No, proceed directly to solutioning
3. Skip for now, I'll do it later

Your choice:</ask>

</check>

<check if="user selects option 1 or fuzzy indicates wanting to create the narrative design document">
  <invoke-workflow>{project-root}/bmad/bmm/workflows/2-plan/narrative/workflow.yaml</invoke-workflow>
  <action>Pass GDD context to narrative workflow</action>
  <action>Exit current workflow (narrative will hand off to solutioning when done)</action>

Since this is a Level {{project_level}} game project, you need solutioning for platform/engine architecture.

**Start new chat with solutioning workflow and provide:**

1. This GDD: `{{gdd_output_file}}`
2. Project analysis: `{{analysis_file}}`

**The solutioning workflow will:**

- Determine game engine/platform (Unity, Godot, Phaser, custom, etc.)
- Generate solution-architecture.md with engine-specific decisions
- Create per-epic tech specs
- Handle platform-specific architecture (from registry.csv game-\* entries)

## Complete Next Steps Checklist

<action>Generate comprehensive checklist based on project analysis</action>

### Phase 1: Solution Architecture and Engine Selection

- [ ] **Run solutioning workflow** (REQUIRED)
  - Command: `workflow solution-architecture`
  - Input: GDD.md, project-workflow-analysis.md
  - Output: solution-architecture.md with engine/platform specifics
  - Note: Registry.csv will provide engine-specific guidance

### Phase 2: Prototype and Playtesting

- [ ] **Create core mechanic prototype**
  - Validate game feel
  - Test control responsiveness
  - Iterate on game pillars

- [ ] **Playtest early and often**
  - Internal testing
  - External playtesting
  - Feedback integration

### Phase 3: Asset Production

- [ ] **Create asset pipeline**
  - Art style guides
  - Technical constraints
  - Asset naming conventions

- [ ] **Audio integration**
  - Music composition/licensing
  - SFX creation
  - Audio middleware setup

### Phase 4: Development

- [ ] **Generate detailed user stories**
  - Command: `workflow generate-stories`
  - Input: GDD.md + solution-architecture.md

- [ ] **Sprint planning**
  - Vertical slices
  - Milestone planning
  - Demo/playable builds

<ask>GDD Complete! Next immediate action:

</check>

<check if="needs_narrative == true">

1. Create Narrative Design Document (recommended for {{game_type}})
2. Start solutioning workflow (engine/architecture)
3. Create prototype build
4. Begin asset production planning
5. Review GDD with team/stakeholders
6. Exit workflow

</check>

<check if="else">

1. Start solutioning workflow (engine/architecture)
2. Create prototype build
3. Begin asset production planning
4. Review GDD with team/stakeholders
5. Exit workflow

Which would you like to proceed with?</ask>
</check>

<check if="user selects narrative option">
  <invoke-workflow>{project-root}/bmad/bmm/workflows/2-plan/narrative/workflow.yaml</invoke-workflow>
  <action>Pass GDD context to narrative workflow</action>
</check>

</step>

</workflow>
