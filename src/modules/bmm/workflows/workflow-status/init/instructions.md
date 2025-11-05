# Workflow Init - Project Setup Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>

<workflow>

<step n="1" goal="Quick scan and ask user about THEIR work">
<output>Welcome to BMad Method, {user_name}!</output>

<action>Quick scan for context (do NOT analyze in depth yet):</action>

- Check for codebase: src/, lib/, package.json, .git, etc.
- Check for BMM artifacts: PRD, epics, stories, tech-spec, architecture docs
- Store what was found but do NOT infer project details yet

<ask>What's your project called? {{#if project_name}}(Config shows: {{project_name}}){{/if}}</ask>
<action>Set project_name</action>
<template-output>project_name</template-output>

<check if="found artifacts OR found codebase">
<output>I found some existing work here. Let me understand what you're working on:</output>

<check if="found artifacts">
<output>
**Planning Documents Found:**
{{#each artifacts}}
- {{artifact_name}} ({{artifact_type}}, {{story_count}} stories, modified {{date}})
{{/each}}
</output>
</check>

<check if="found codebase">
<output>
**Codebase Found:**
- Source code in: {{source_dirs}}
- Tech stack: {{detected_tech_stack}}
{{#if git_history}}
- Git history: {{commit_count}} commits, last commit {{last_commit_date}}
{{/if}}
</output>
</check>

<ask>Looking at what I found, are these:

a) **Works in progress you're finishing** - continuing the work described in these documents
b) **Documents from a previous effort** - you're starting something NEW and different now
c) **The proposed work you're about to start** - these describe what you want to do
d) **None of these** - let me explain what I'm actually working on

Your choice [a/b/c/d]:</ask>

<check if="choice == a">
  <action>User is continuing old work - analyze artifacts to get details</action>
  <action>Set continuing_old_work = true</action>
  <action>Go to Step 2 (Analyze artifacts for details)</action>
</check>

<check if="choice == b">
  <action>User is doing NEW work - old artifacts are just context</action>
  <action>Set continuing_old_work = false</action>
  <action>Go to Step 3 (Ask about NEW work)</action>
</check>

<check if="choice == c">
  <action>Artifacts describe proposed work</action>
  <action>Set continuing_old_work = true</action>
  <action>Go to Step 2 (Analyze artifacts for details)</action>
</check>

<check if="choice == d">
  <action>User will explain their situation</action>
  <action>Go to Step 3 (Ask about their work)</action>
</check>
</check>

<check if="NOT found artifacts AND NOT found codebase">
  <output>I don't see any existing code or planning documents. Looks like we're starting fresh!</output>
  <action>Go to Step 3 (Ask about their work)</action>
</check>
</step>

<step n="2" goal="Analyze artifacts for continuing work" if="continuing_old_work == true">
<action>Analyze found artifacts in detail:</action>
<action>Extract project type from content (game vs software)</action>
<action>Count stories/epics to estimate level:
  - Level 0: 1 story
  - Level 1: 1-10 stories
  - Level 2: 5-15 stories
  - Level 3: 12-40 stories
  - Level 4: 40+ stories
</action>
<action>Detect field type from codebase presence (greenfield vs brownfield)</action>

<output>Based on the artifacts you're continuing, I'm suggesting **Level {{project_level}}** because I found {{story_count}} stories across {{epic_count}} epics.

Here's the complexity scale for reference:

**{{field_type}} Project Levels:**

- **Level 0** - Single atomic change (1 story) - bug fixes, typos, minor updates
- **Level 1** - Small feature (1-10 stories) - simple additions, isolated features
- **Level 2** - Medium feature set (5-15 stories) - dashboards, multiple related features
- **Level 3** - Complex integration (12-40 stories) - platform features, major integrations
- **Level 4** - Enterprise expansion (40+ stories) - multi-tenant, ecosystem changes

**My suggestion:** Level {{project_level}} {{field_type}} {{project_type}} project
</output>

<ask>Does this match what you're working on? (y/n or tell me what's different)</ask>

<check if="user confirms">
  <action>Use analyzed values</action>
  <action>Go to Step 4 (Load workflow path)</action>
</check>

<check if="user corrects">
  <action>Update values based on user corrections</action>
  <ask>Updated to: Level {{project_level}} {{field_type}} {{project_type}}. Correct? (y/n)</ask>
  <action>Go to Step 4 (Load workflow path)</action>
</check>

<template-output>project_name</template-output>
<template-output>project_type</template-output>
<template-output>project_level</template-output>
<template-output>field_type</template-output>
</step>

<step n="3" goal="Ask user about THEIR work">
<ask>Tell me about what you're working on. What's the goal?</ask>

<action>Analyze user's description using keyword detection:

- Level 0 keywords: "fix", "bug", "typo", "small change", "update", "patch", "one file"
- Level 1 keywords: "simple", "basic", "small feature", "add", "minor", "single feature"
- Level 2 keywords: "dashboard", "several features", "admin panel", "medium", "feature set"
- Level 3 keywords: "platform", "integration", "complex", "system", "architecture"
- Level 4 keywords: "enterprise", "multi-tenant", "multiple products", "ecosystem", "phased"
  </action>

<action>Make initial determination:

- project_type (game or software)
- project_level (0-4) - tentative based on keywords
- field_type (greenfield or brownfield)
- confidence (high/medium/low) - based on clarity of description
  </action>

<check if="confidence == low OR description is ambiguous">
  <output>Thanks! Let me ask a few clarifying questions to make sure I route you correctly:</output>

<ask>1. Roughly how many distinct features or changes do you think this involves?

- Just one thing (e.g., fix a bug, add one button, update one API)
- A small feature (2-5 related changes)
- Several features (5-15 related things)
- A major addition (15-40 things to do)
- A large initiative (40+ changes across many areas)
  </ask>

<action>Adjust project_level based on response</action>

<ask>2. How much of the existing codebase will this touch?

- Single file or small area
- One module or component
- Multiple modules (2-4 areas)
- Many modules with integration needs
- System-wide changes
  </ask>

<action>Validate and adjust project_level based on scope</action>

  <check if="project_type unclear">
    <ask>3. Is this a game or a software application?</ask>
    <action>Set project_type based on response</action>
  </check>
</check>

<check if="found codebase BUT field_type still unclear">
  <ask>I see you have existing code here. Are you:

1. **Adding to or modifying** the existing codebase (brownfield)
2. **Starting fresh** - the existing code is just a scaffold/template (greenfield)
3. **Something else** - let me clarify

Your choice [1/2/3]:</ask>

  <check if="choice == 1">
    <action>Set field_type = "brownfield"</action>
  </check>

  <check if="choice == 2">
    <action>Set field_type = "greenfield"</action>
    <output>Got it - treating as greenfield despite the scaffold.</output>
  </check>

  <check if="choice == 3">
    <ask>Please explain your situation:</ask>
    <action>Analyze explanation and set field_type accordingly</action>
  </check>
</check>

<action>Build reasoning for suggestion</action>
<action>Store detected_indicators (keywords, scope indicators, complexity signals)</action>

<output>Based on what you've described, I'm suggesting **Level {{project_level}}** because:

{{reasoning}} (detected: {{detected_indicators}})

Here's the complexity scale for reference:

**{{field_type}} Project Levels:**

- **Level 0** - Single atomic change (1 story) - bug fixes, typos, minor updates, single file changes
- **Level 1** - Small feature (1-10 stories) - simple additions, isolated features, one module
- **Level 2** - Medium feature set (5-15 stories) - dashboards, multiple related features, several modules
- **Level 3** - Complex integration (12-40 stories) - platform features, major integrations, architectural changes
- **Level 4** - Enterprise expansion (40+ stories) - multi-tenant, ecosystem changes, system-wide initiatives

**My suggestion:** Level {{project_level}} {{field_type}} {{project_type}} project
</output>

<ask>Does this match what you're working on? (y/n or tell me what's different)</ask>

<check if="user confirms">
  <action>Use determined values</action>
  <action>Go to Step 4 (Load workflow path)</action>
</check>

<check if="user corrects">
  <action>Update values based on corrections</action>
  <output>Updated to: Level {{project_level}} {{field_type}} {{project_type}}</output>
  <ask>Does that look right now? (y/n)</ask>
  <action>If yes, go to Step 4. If no, ask what needs adjustment and repeat.</action>
</check>

<template-output>project_name</template-output>
<template-output>project_type</template-output>
<template-output>project_level</template-output>
<template-output>field_type</template-output>
</step>

<step n="4" goal="Load appropriate workflow path">
<action>Determine path file based on selections:</action>

<check if="project_type == game">
  <action>Load {path_files}/game-design.yaml</action>
  <action>Set workflow_path_file = "game-design.yaml"</action>
</check>

<check if="project_type == software">
  <!-- field_type will be "greenfield" or "brownfield", project_level will be 0-4 -->
  <action>Build filename: {field_type}-level-{project_level}.yaml</action>
  <action>Load {path_files}/{field_type}-level-{project_level}.yaml</action>
  <action>Set workflow_path_file = constructed filename</action>
</check>

<action>Parse workflow path file to extract phases and workflows</action>
<template-output>workflow_path_file</template-output>
</step>

<step n="5" goal="Generate workflow summary">
<action>Build workflow from loaded path file</action>
<action>Display phases and workflows</action>
<action>Set initial values for status file</action>

<template-output>current_phase</template-output>
<template-output>current_workflow</template-output>
<template-output>current_agent</template-output>
<template-output>next_action</template-output>
<template-output>next_command</template-output>
<template-output>next_agent</template-output>
</step>

<step n="6" goal="Create status file">
<action>Initialize all status values</action>
<template-output>start_date</template-output>
<template-output>last_updated</template-output>
<template-output>phase_1_complete</template-output>
<template-output>phase_2_complete</template-output>
<template-output>phase_3_complete</template-output>
<template-output>phase_4_complete</template-output>

<ask>Ready to create your workflow status file? (y/n)</ask>

<check if="answer == y">
  <action>Save status file to {output_folder}/bmm-workflow-status.md</action>
  <output>✅ Status file created! Next up: {{next_agent}} agent, run `{{next_command}}`</output>
  <check if="next_agent !== current_agent">
    <output>It is strongly recommended to clear the context or start a new chat and load the next agent to execute the next command from that agents help menu, unless there is something else I can do for you first.</output>
  </check>
</check>
</step>

</workflow>
