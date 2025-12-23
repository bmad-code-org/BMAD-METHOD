# Workflow Init - Game Project Setup Instructions

<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>This workflow handles BOTH new game projects AND existing game projects</critical>

<workflow>

<step n="1" goal="Scan for existing work">
<output>Welcome to BMGD Game Development, {user_name}! 🎮</output>

<action>Perform comprehensive scan for existing work:

- BMGD artifacts: GDD, game brief, architecture, narrative design
- Implementation: stories, sprint-status, workflow-status
- Game project: engine files (Unity, Unreal, Godot), source directories
- Check both {output_folder} and {implementation_artifacts} locations
  </action>

<action>Categorize into one of these states:

- CLEAN: No artifacts or code (or scaffold only)
- DESIGN: Has GDD/brief but no implementation
- ACTIVE: Has stories or sprint status
- EXISTING: Has game code but no BMGD artifacts
- UNCLEAR: Mixed state needs clarification
  </action>

<ask>What's your game project called? {{#if project_name}}(Config shows: {{project_name}}){{/if}}</ask>
<action>Store project_name</action>
<template-output>project_name</template-output>
</step>

<step n="2" goal="Choose setup path">
<check if="state == CLEAN">
  <output>Perfect! Fresh start detected. Let's design your game!</output>
  <action>Continue to step 3</action>
</check>

<check if="state == ACTIVE AND workflow_status exists">
  <output>✅ You already have workflow tracking at: {{workflow_status_path}}

To check progress: Load any BMGD agent and run /bmad:bmgd:workflows:workflow-status

Happy game dev! 🎮</output>
<action>Exit workflow (already initialized)</action>
</check>

<check if="state != CLEAN">
  <output>Found existing work:
{{summary_of_findings}}</output>

<ask>How would you like to proceed?

1. **Continue** - Work with existing artifacts
2. **Archive & Start Fresh** - Move old work to archive
3. **Express Setup** - I know exactly what I need
4. **Guided Setup** - Walk me through options

Choice [1-4]</ask>

  <check if="choice == 1">
    <action>Set continuing_existing = true</action>
    <action>Store found artifacts</action>
    <action>Continue to step 7 (detect track from artifacts)</action>
  </check>

  <check if="choice == 2">
    <ask>Archive existing work? (y/n)</ask>
    <action if="y">Move artifacts to {output_folder}/archive/</action>
    <output>Ready for fresh start!</output>
    <action>Continue to step 3</action>
  </check>

  <check if="choice == 3">
    <action>Jump to step 3 (express path)</action>
  </check>

  <check if="choice == 4">
    <action>Continue to step 4 (guided path)</action>
  </check>
</check>

<check if="state == CLEAN">
  <ask>Setup approach:

1. **Express** - I know what I need
2. **Guided** - Show me the options

Choice [1 or 2]:</ask>

  <check if="choice == 1">
    <action>Continue to step 3 (express)</action>
  </check>

  <check if="choice == 2">
    <action>Continue to step 4 (guided)</action>
  </check>
</check>
</step>

<step n="3" goal="Express setup path">
<ask>Is this for:
1. **New game** (greenfield)
2. **Existing game codebase** (brownfield)

Choice [1/2]:</ask>
<action>Set field_type based on choice</action>

<ask>Development approach:

1. **Full Game Dev** - Complete GDD + Architecture + Production pipeline
2. **Quick Flow** - Rapid prototyping and iteration

Choice [1/2]:</ask>
<action>Map to selected_track: gamedev/quickflow</action>

<template-output>field_type</template-output>
<template-output>selected_track</template-output>
<action>Jump to step 6 (discovery options)</action>
</step>

<step n="4" goal="Guided setup - understand project">
<ask>Tell me about your game. What are you making?</ask>
<action>Store user_description</action>

<action>Analyze for field type indicators:

- Brownfield: "existing", "current", "enhance", "update", "add to"
- Greenfield: "new", "build", "create", "from scratch", "fresh"
- If game project exists, default to brownfield unless user indicates new
  </action>

<check if="field_type unclear AND game project exists">
  <ask>I see existing game files. Are you:
1. **Modifying** existing game (brownfield)
2. **Starting fresh** - code is just scaffold (greenfield)

Choice [1/2]:</ask>
<action>Set field_type based on answer</action>
</check>

<action if="field_type not set">Set based on project presence</action>

<template-output>user_description</template-output>
<template-output>field_type</template-output>
<action>Continue to step 5</action>
</step>

<step n="5" goal="Guided setup - select track">
<output>Based on your game, here are your BMGD development options:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Full Game Dev** 🎮 {{#if recommended}}(RECOMMENDED){{/if}}

- Complete: Game Brief + GDD + Architecture + Production
- Best for: Indie games, AA projects, complete releases
- Benefit: AI agents have full game context for better results

**2. Quick Flow** 🚀

- Rapid: Prototype → Iterate → Ship
- Best for: Game jams, prototypes, experiments
- Benefit: Get playable builds fast

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if brownfield}}
💡 Architecture helps integrate new features with your existing game systems.
{{/if}}</output>

<ask>Which approach fits your game?

1. Full Game Dev {{#if recommended}}(recommended){{/if}}
2. Quick Flow
3. Help me decide

Choice [1/2/3]:</ask>

<check if="choice == 3">
  <ask>What concerns you about choosing?</ask>
  <action>Provide tailored guidance based on concerns</action>
  <action>Loop back to choice</action>
</check>

<action>Map choice to selected_track</action>
<template-output>selected_track</template-output>
</step>

<step n="6" goal="Discovery workflows selection (unified)">
<action>Determine available discovery workflows based on:
- field_type (greenfield gets game-brief option)
- selected_track (gamedev/quickflow options)
</action>

<check if="field_type == greenfield AND selected_track == gamedev">
  <output>Optional pre-production workflows can help clarify your game vision:</output>
  <ask>Select any you'd like to include:

1. 🧠 **Brainstorm Game** - Creative exploration and ideation
2. 📋 **Game Brief** - Strategic game planning (recommended)

Enter numbers (e.g., "1,2" or "all" or "none"): </ask>
</check>

<check if="field_type == brownfield AND selected_track == gamedev">
  <output>Optional discovery workflows:</output>
  <ask>Include any of these?

1. 🧠 **Brainstorm Game** - Creative exploration for new features

Enter "1" or "none": </ask>
</check>

<check if="selected_track == quickflow">
  <output>Quick Flow focuses on rapid iteration. You can brainstorm during development.</output>
</check>

<action>Parse selections and set:

- brainstorm_requested
- game_brief_requested (if applicable)
  </action>

<template-output>brainstorm_requested</template-output>
<template-output>game_brief_requested</template-output>
</step>

<step n="7" goal="Detect track from artifacts" if="continuing_existing">
<action>Analyze artifacts to detect track:
- Has GDD → Full Game Dev
- Has tech-spec only → Quick Flow
</action>

<output>Detected: **{{detected_track}}** based on {{found_artifacts}}</output>
<ask>Correct? (y/n)</ask>

<ask if="n">Which BMGD track instead?

1. Full Game Dev
2. Quick Flow

Choice:</ask>

<action>Set selected_track</action>
<template-output>selected_track</template-output>
</step>

<step n="8" goal="Generate workflow path">
<action>Load path file: {path_files}/{{selected_track}}-{{field_type}}.yaml</action>
<action>Build workflow_items from path file</action>
<action>Scan for existing completed work and update statuses</action>
<action>Set generated date</action>

<template-output>generated</template-output>
<template-output>workflow_path_file</template-output>
<template-output>workflow_items</template-output>
</step>

<step n="9" goal="Create tracking file">
<output>Your BMGD workflow path:

**Track:** {{selected_track}}
**Type:** {{field_type}}
**Project:** {{project_name}}

{{#if brownfield}}Prerequisites: Analyze existing game code{{/if}}
{{#if has_discovery}}Pre-production: {{list_selected_discovery}}{{/if}}

{{workflow_path_summary}}
</output>

<ask>Create workflow tracking file? (y/n)</ask>

<check if="y">
  <action>Generate YAML from template with all variables</action>
  <action>Save to {output_folder}/bmgd-workflow-status.yaml</action>
  <action>Identify next workflow and agent</action>

<output>✅ **Created:** {output_folder}/bmgd-workflow-status.yaml

**Next:** {{next_workflow_name}}
**Agent:** {{next_agent}}
**Command:** /bmad:bmgd:workflows:{{next_workflow_id}}

{{#if next_agent not in [game-designer]}}
💡 Start new chat with **{{next_agent}}** agent first.
{{/if}}

To check progress: /bmad:bmgd:workflows:workflow-status

Happy game dev! 🎮</output>
</check>

</step>

</workflow>
