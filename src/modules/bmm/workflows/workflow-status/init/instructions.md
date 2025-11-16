# Workflow Init - Project Setup Instructions

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>
<critical>This workflow handles BOTH new projects AND legacy projects being migrated to BMad Method</critical>

<workflow>

<step n="1" goal="Scan for existing work">
<output>Welcome to BMad Method, {user_name}!</output>

<action>Perform comprehensive scan for existing work:

- BMM artifacts: PRD, tech-spec, epics, architecture, UX, brief, research, brainstorm
- Implementation: stories, sprint-status, workflow-status
- Codebase: source directories, package files, git repo
- Check both {output_folder} and {sprint_artifacts} locations
  </action>

<action>Categorize into one of these states:

- CLEAN: No artifacts or code (or scaffold only)
- PLANNING: Has PRD/spec but no implementation
- ACTIVE: Has stories or sprint status
- LEGACY: Has code but no BMM artifacts
- UNCLEAR: Mixed state needs clarification
  </action>

<ask>What's your project called? {{#if project_name}}(Config shows: {{project_name}}){{/if}}</ask>
<action>Store project_name</action>
<template-output>project_name</template-output>
</step>

<step n="2" goal="Choose setup path">
<check if="state == CLEAN">
  <output>Perfect! Fresh start detected.</output>
  <action>Continue to step 3</action>
</check>

<check if="state == ACTIVE AND workflow_status exists">
  <output>✅ You already have workflow tracking at: {{workflow_status_path}}

To check progress: Load any BMM agent and run /bmad:bmm:workflows:workflow-status

Happy building! 🚀</output>
<action>Exit workflow (already initialized)</action>
</check>

<check if="state != CLEAN">
  <output>Found existing work:
{{summary_of_findings}}</output>

<ask>How would you like to proceed?

a) **Continue** - Work with existing artifacts
b) **Archive & Start Fresh** - Move old work to archive
c) **Express Setup** - I know exactly what I need
d) **Guided Setup** - Walk me through options

Choice [a/b/c/d]:</ask>

  <check if="choice == a">
    <action>Set continuing_existing = true</action>
    <action>Store found artifacts</action>
    <action>Continue to step 7 (detect track from artifacts)</action>
  </check>

  <check if="choice == b">
    <ask>Archive existing work? (y/n)</ask>
    <action if="y">Move artifacts to {output_folder}/archive/</action>
    <output>Ready for fresh start!</output>
    <action>Continue to step 3</action>
  </check>

  <check if="choice == c">
    <action>Jump to step 3 (express path)</action>
  </check>

  <check if="choice == d">
    <action>Continue to step 4 (guided path)</action>
  </check>
</check>

<check if="state == CLEAN">
  <ask>Setup approach:

a) **Express** - I know what I need
b) **Guided** - Show me the options

Choice [a/b]:</ask>

  <check if="choice == a">
    <action>Continue to step 3 (express)</action>
  </check>

  <check if="choice == b">
    <action>Continue to step 4 (guided)</action>
  </check>
</check>
</step>

<step n="3" goal="Express setup path">
<ask>Is this for:
1) **New project** (greenfield)
2) **Existing codebase** (brownfield)

Choice [1/2]:</ask>
<action>Set field_type based on choice</action>

<ask>Planning approach:

1. **Quick Flow** - Minimal planning, fast to code
2. **BMad Method** - Full planning for complex projects
3. **Enterprise Method** - Extended planning with security/DevOps

Choice [1/2/3]:</ask>
<action>Map to selected_track: quick-flow/method/enterprise</action>

<template-output>field_type</template-output>
<template-output>selected_track</template-output>
<action>Jump to step 6 (discovery options)</action>
</step>

<step n="4" goal="Guided setup - understand project">
<ask>Tell me about what you're working on. What's the goal?</ask>
<action>Store user_description</action>

<action>Analyze for field type indicators:

- Brownfield: "existing", "current", "enhance", "modify"
- Greenfield: "new", "build", "create", "from scratch"
- If codebase exists, default to brownfield unless user indicates scaffold
  </action>

<check if="field_type unclear AND codebase exists">
  <ask>I see existing code. Are you:
1) **Modifying** existing codebase (brownfield)
2) **Starting fresh** - code is just scaffold (greenfield)

Choice [1/2]:</ask>
<action>Set field_type based on answer</action>
</check>

<action if="field_type not set">Set based on codebase presence</action>

<action>Check for game development keywords</action>
<check if="game_detected">
<output>🎮 **GAME DEVELOPMENT DETECTED**

For game development, install the BMGD module:

```bash
bmad install bmgd
```

Continue with software workflows? (y/n)</output>
<ask>Choice:</ask>
<action if="n">Exit workflow</action>
</check>

<template-output>user_description</template-output>
<template-output>field_type</template-output>
<action>Continue to step 5</action>
</step>

<step n="5" goal="Guided setup - select track">
<output>Based on your project, here are your planning options:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**1. Quick Flow** 🚀

- Minimal planning, straight to code
- Best for: Simple features, bug fixes
- Risk: Potential rework if complexity emerges

**2. BMad Method** 🎯 {{#if recommended}}(RECOMMENDED){{/if}}

- Full planning: PRD + UX + Architecture
- Best for: Products, platforms, complex features
- Benefit: AI agents have complete context for better results

**3. Enterprise Method** 🏢

- Extended: Method + Security + DevOps + Testing
- Best for: Enterprise, compliance, mission-critical
- Benefit: Comprehensive planning for complex systems

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#if brownfield}}
💡 Architecture creates focused solution design from your codebase, keeping AI agents on track.
{{/if}}</output>

<ask>Which approach fits best?

1. Quick Flow
2. BMad Method {{#if recommended}}(recommended){{/if}}
3. Enterprise Method
4. Help me decide

Choice [1/2/3/4]:</ask>

<check if="choice == 4">
  <ask>What concerns you about choosing?</ask>
  <action>Provide tailored guidance based on concerns</action>
  <action>Loop back to choice</action>
</check>

<action>Map choice to selected_track</action>
<template-output>selected_track</template-output>
</step>

<step n="6" goal="Discovery workflows selection (unified)">
<action>Determine available discovery workflows based on:
- field_type (greenfield gets product-brief option)
- selected_track (quick-flow skips product-brief)
</action>

<check if="field_type == greenfield AND selected_track in [method, enterprise]">
  <output>Optional discovery workflows can help clarify your vision:</output>
  <ask>Select any you'd like to include:

1. 🧠 **Brainstorm** - Creative exploration and ideation
2. 🔍 **Research** - Technical/competitive analysis
3. 📋 **Product Brief** - Strategic product planning (recommended)

Enter numbers (e.g., "1,3" or "all" or "none"): </ask>
</check>

<check if="field_type == brownfield OR selected_track == quick-flow">
  <output>Optional discovery workflows:</output>
  <ask>Include any of these?

1. 🧠 **Brainstorm** - Creative exploration
2. 🔍 **Research** - Domain analysis

Enter numbers (e.g., "1,2" or "none"): </ask>
</check>

<action>Parse selections and set:

- brainstorm_requested
- research_requested
- product_brief_requested (if applicable)
  </action>

<template-output>brainstorm_requested</template-output>
<template-output>research_requested</template-output>
<template-output>product_brief_requested</template-output>

<check if="brownfield AND selected_track != quick-flow">
  <output>💡 **Note:** For brownfield projects, run document-project workflow first to analyze your codebase.</output>
</check>
</step>

<step n="7" goal="Detect track from artifacts" if="continuing_existing OR migrating_legacy">
<action>Analyze artifacts to detect track:
- Has PRD → BMad Method
- Has tech-spec only → Quick Flow
- Has Security/DevOps → Enterprise Method
</action>

<output>Detected: **{{detected_track}}** based on {{found_artifacts}}</output>
<ask>Correct? (y/n)</ask>

<ask if="n">Which track instead?

1. Quick Flow
2. BMad Method
3. Enterprise Method

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
<output>Your BMad workflow path:

**Track:** {{selected_track}}
**Type:** {{field_type}}
**Project:** {{project_name}}

{{#if brownfield}}Prerequisites: document-project{{/if}}
{{#if has_discovery}}Discovery: {{list_selected_discovery}}{{/if}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{workflow_path_summary}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</output>

<ask>Create workflow tracking file? (y/n)</ask>

<check if="y">
  <action>Generate YAML from template with all variables</action>
  <action>Save to {output_folder}/bmm-workflow-status.yaml</action>
  <action>Identify next workflow and agent</action>

<output>✅ **Created:** {output_folder}/bmm-workflow-status.yaml

**Next:** {{next_workflow_name}}
**Agent:** {{next_agent}}
**Command:** /bmad:bmm:workflows:{{next_workflow_id}}

{{#if next_agent not in [analyst, pm]}}
💡 Start new chat with **{{next_agent}}** agent first.
{{/if}}

To check progress: /bmad:bmm:workflows:workflow-status

Happy building! 🚀</output>
</check>

<check if="n">
  <output>No problem! Run workflow-init again when ready.</output>
</check>
</step>

</workflow>
