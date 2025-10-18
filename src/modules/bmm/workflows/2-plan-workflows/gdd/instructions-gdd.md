# GDD Workflow - Game Projects (All Levels)

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This is the GDD instruction set for GAME projects - replaces PRD with Game Design Document</critical>
<critical>Project analysis already completed - proceeding with game-specific design</critical>
<critical>Uses gdd_template for GDD output, game_types.csv for type-specific sections</critical>
<critical>Routes to 3-solutioning for architecture (platform-specific decisions handled there)</critical>
<critical>If users mention technical details, append to technical_preferences with timestamp</critical>

<critical>DOCUMENT OUTPUT: Concise, clear, actionable game design specs. Use tables/lists over prose. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>

<step n="0" goal="Validate workflow and extract project configuration">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>**⚠️ No Workflow Status File Found**

The GDD workflow requires a status file to understand your project context.

Please run `workflow-init` first to:

- Define your project type and level
- Map out your workflow journey
- Create the status file

Run: `workflow-init`

After setup, return here to create your GDD.
</output>
<action>Exit workflow - cannot proceed without status file</action>
</check>

<check if="status_exists == true">
  <action>Store {{status_file_path}} for later updates</action>

  <check if="project_type != 'game'">
    <output>**Incorrect Workflow for Software Projects**

Your project is type: {{project_type}}

**Correct workflows for software projects:**

- Level 0-1: `tech-spec` (Architect agent)
- Level 2-4: `prd` (PM agent)

{{#if project_level <= 1}}
Use: `tech-spec`
{{else}}
Use: `prd`
{{/if}}
</output>
<action>Exit and redirect to appropriate workflow</action>
</check>
</check>
</step>

<step n="0.5" goal="Validate workflow sequencing">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: validate</param>
  <param>calling_workflow: gdd</param>
</invoke-workflow>

<check if="warning != ''">
  <output>{{warning}}</output>
  <ask>Continue with GDD anyway? (y/n)</ask>
  <check if="n">
    <output>{{suggestion}}</output>
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="1" goal="Load context and determine game type">

<action>Use {{project_type}} and {{project_level}} from status data</action>

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

<action>Guide user to specify target platform(s) for their game, exploring considerations like desktop, mobile, web, console, or multi-platform deployment</action>

<template-output>platforms</template-output>

<action>Guide user to define their target audience with specific demographics: age range, gaming experience level (casual/core/hardcore), genre familiarity, and preferred play session lengths</action>

<template-output>target_audience</template-output>

</step>

<step n="3" goal="Define goals, context, and unique selling points">

<action>Guide user to define project goals appropriate for their level (Level 0-1: 1-2 goals, Level 2: 2-3 goals, Level 3-4: 3-5 strategic goals) - what success looks like for this game</action>

<template-output>goals</template-output>

<action>Guide user to provide context on why this game matters now - the motivation and rationale behind the project</action>

<template-output>context</template-output>

<action>Guide user to identify the unique selling points (USPs) - what makes this game different from existing games in the market</action>

<template-output>unique_selling_points</template-output>

</step>

<step n="4" goal="Core gameplay definition">

<critical>These are game-defining decisions</critical>

<action>Guide user to identify 2-4 core game pillars - the fundamental gameplay elements that define their game's experience (e.g., tight controls + challenging combat + rewarding exploration, or strategic depth + replayability + quick sessions)</action>

<template-output>game_pillars</template-output>

<action>Guide user to describe the core gameplay loop - what actions the player repeats throughout the game, creating a clear cyclical pattern of player behavior and rewards</action>

<template-output>gameplay_loop</template-output>

<action>Guide user to define win and loss conditions - how the player succeeds and fails in the game</action>

<template-output>win_loss_conditions</template-output>

</step>

<step n="5" goal="Game mechanics and controls">

<action>Guide user to define the primary game mechanics that players will interact with throughout the game</action>

<template-output>primary_mechanics</template-output>
<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

<action>Guide user to describe their control scheme and input method (keyboard/mouse, gamepad, touchscreen, etc.), including key bindings or button layouts if known</action>

<template-output>controls</template-output>

</step>

<step n="6" goal="Inject game-type-specific sections">

<action>Load game-type fragment from: {installed_path}/gdd/game-types/{{game_type}}.md</action>

<critical>Process each section in the fragment template</critical>

For each {{placeholder}} in the fragment, elicit and capture that information.

<template-output file="GDD.md">GAME_TYPE_SPECIFIC_SECTIONS</template-output>

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="7" goal="Progression and balance">

<action>Guide user to describe how player progression works in their game - whether through skill improvement, power gains, ability unlocking, narrative advancement, or a combination of approaches</action>

<template-output>player_progression</template-output>

<action>Guide user to define the difficulty curve: how challenge increases over time, pacing rhythm (steady/spikes/player-controlled), and any accessibility options planned</action>

<template-output>difficulty_curve</template-output>

<action>Ask if the game includes an in-game economy or resource system, and if so, guide user to describe it (skip if not applicable)</action>

<template-output>economy_resources</template-output>

</step>

<step n="8" goal="Level design framework">

<action>Guide user to describe the types of levels/stages in their game (e.g., tutorial, themed biomes, boss arenas, procedural vs. handcrafted, etc.)</action>

<template-output>level_types</template-output>

<action>Guide user to explain how levels progress or unlock - whether through linear sequence, hub-based structure, open world exploration, or player-driven choices</action>

<template-output>level_progression</template-output>

</step>

<step n="9" goal="Art and audio direction">

<action>Guide user to describe their art style vision: visual aesthetic (pixel art, low-poly, realistic, stylized), color palette preferences, and any inspirations or references</action>

<template-output>art_style</template-output>

<action>Guide user to describe their audio and music direction: music style/genre, sound effect tone, and how important audio is to the gameplay experience</action>

<template-output>audio_music</template-output>

</step>

<step n="10" goal="Technical specifications">

<action>Guide user to define performance requirements: target frame rate, resolution, acceptable load times, and mobile battery considerations if applicable</action>

<template-output>performance_requirements</template-output>

<action>Guide user to identify platform-specific considerations (mobile touch controls/screen sizes, PC keyboard/mouse/settings, console controller/certification, web browser compatibility/file size)</action>

<template-output>platform_details</template-output>

<action>Guide user to document key asset requirements: art assets (sprites/models/animations), audio assets (music/SFX/voice), estimated counts/sizes, and asset pipeline needs</action>

<template-output>asset_requirements</template-output>

</step>

<step n="11" goal="Epic structure">

<action>Work with user to translate game features into development epics, following level-appropriate guidelines (Level 1: 1 epic/1-10 stories, Level 2: 1-2 epics/5-15 stories, Level 3: 2-5 epics/12-40 stories, Level 4: 5+ epics/40+ stories)</action>

<template-output>epics</template-output>
<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="12" goal="Generate detailed epic breakdown in epics.md">

<action>Load epics_template from workflow.yaml</action>

<critical>Create separate epics.md with full story hierarchy</critical>

<action>Generate epic overview section with all epics listed</action>

<template-output file="epics.md">epic_overview</template-output>

<action>For each epic, generate detailed breakdown with expanded goals, capabilities, and success criteria</action>

<action>For each epic, generate all stories in user story format with prerequisites, acceptance criteria (3-8 per story), and high-level technical notes</action>

<for-each epic="epic_list">

<template-output file="epics.md">epic\_{{epic_number}}\_details</template-output>
<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</for-each>

</step>
<step n="13" goal="Success metrics">

<action>Guide user to identify technical metrics they'll track (e.g., frame rate consistency, load times, crash rate, memory usage)</action>

<template-output>technical_metrics</template-output>

<action>Guide user to identify gameplay metrics they'll track (e.g., player completion rate, session length, difficulty pain points, feature engagement)</action>

<template-output>gameplay_metrics</template-output>

</step>

<step n="14" goal="Document out of scope and assumptions">

<action>Guide user to document what is explicitly out of scope for this game - features, platforms, or content that won't be included in this version</action>

<template-output>out_of_scope</template-output>

<action>Guide user to document key assumptions and dependencies - technical assumptions, team capabilities, third-party dependencies, or external factors the project relies on</action>

<template-output>assumptions_and_dependencies</template-output>

</step>

<step n="15" goal="Update status and populate story sequence">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: complete_workflow</param>
  <param>workflow_name: gdd</param>
  <param>populate_stories_from: {epics_output_file}</param>
</invoke-workflow>

<check if="success == true">
  <output>Status updated! Next: {{next_workflow}} ({{next_agent}} agent)</output>
  <output>Loaded {{total_stories}} stories from epics.</output>
</check>

</step>

<step n="16" goal="Generate solutioning handoff and next steps">

<action>Check if game-type fragment contained narrative tags indicating narrative importance</action>

<check if="fragment had <narrative-workflow-critical> or <narrative-workflow-recommended>">
  <action>Set needs_narrative = true</action>
  <action>Extract narrative importance level from tag</action>

## Next Steps for {{game_name}}

</check>

<check if="needs_narrative == true">
  <action>Inform user that their game type benefits from narrative design, presenting the option to create a Narrative Design Document covering story structure, character arcs, world lore, dialogue framework, and environmental storytelling</action>

<ask>This game type ({{game_type}}) benefits from narrative design.

Would you like to create a Narrative Design Document now?

1. Yes, create Narrative Design Document (recommended)
2. No, proceed directly to solutioning
3. Skip for now, I'll do it later

Your choice:</ask>

</check>

<check if="user selects option 1 or fuzzy indicates wanting to create the narrative design document">
  <invoke-workflow>{project-root}/bmad/bmm/workflows/2-plan-workflows/narrative/workflow.yaml</invoke-workflow>
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
  - Input: GDD.md, bmm-workflow-status.md
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

<ask>**✅ GDD Complete, {user_name}!**

Next immediate action:

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
  <invoke-workflow>{project-root}/bmad/bmm/workflows/2-plan-workflows/narrative/workflow.yaml</invoke-workflow>
  <action>Pass GDD context to narrative workflow</action>
</check>

</step>

</workflow>
