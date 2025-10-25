# Workflow Init - Project Setup Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: workflow-init/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>

<workflow>

<step n="1" goal="Scan for existing work">
<action>Search {output_folder}/ for existing BMM artifacts:</action>
- PRD files (*prd*.md)
- Architecture docs (architecture*.md, architecture*.md, architecture/*)
- Briefs (*brief*.md)
- Brainstorming docs (brainstorm*.md)
- Research docs (*research*.md)
- Tech specs (tech-spec*.md)
- GDD files (gdd*.md)
- Story files (story-*.md)
- Epic files (epic*.md)
- Documentation files (index.md (and referenced files within), other files in docs or provided)

Check for existing codebase indicators:

- src/ or lib/ directories
- package.json, requirements.txt, go.mod, Cargo.toml, etc.
- .git directory (check git log for commit history age)
- README.md (check if it describes existing functionality)
- Test directories (tests/, **tests**/, spec/)
- Existing source files (_.js, _.py, _.go, _.rs, etc.)

<action>Also check config for existing {project_name} variable</action>

<check if="found existing artifacts">
  <action>Analyze documents to infer project details</action>
  <action>Guess project type (game vs software) from content</action>
  <action>Estimate level based on scope:
    - Level 0: Single atomic change (1 story)
    - Level 1: Small feature (1-10 stories)
    - Level 2: Medium project (5-15 stories)
    - Level 3: Complex system (12-40 stories)
    - Level 4: Enterprise scale (40+ stories)
  </action>
  <action>Detect if greenfield (only planning) or brownfield (has code)</action>
  <action>Go to Step 2 (Confirm inferred settings)</action>
</check>

<check if="no artifacts found">
  <action>Set fresh_start = true</action>
  <action>Go to Step 3 (Gather project info)</action>
</check>
</step>

<step n="2" goal="Confirm inferred settings" if="found artifacts">
<output>📊 I found existing work! Here's what I detected:

**Project Name:** {{inferred_project_name}}
**Type:** {{inferred_type}}
**Complexity:** {{inferred_level_description}}
**Codebase:** {{inferred_field_type}}
**Current Phase:** {{current_phase}}
</output>

<ask>Is this correct?

1. **Yes** - Use these settings
2. **Start Fresh** - Ignore existing work
   Or tell me what's different:</ask>

<check if="choice == 1">
  <action>Use inferred settings</action>
  <action>Go to Step 5 (Generate workflow)</action>
</check>

<check if="choice == 2">
  <action>Set fresh_start = true</action>
  <action>Go to Step 3 (Gather project info)</action>
</check>

<check if="user provides corrections">
  <action>Update inferred values based on user input</action>
  <action>Go to Step 5 (Generate workflow)</action>
</check>

<template-output>project_name</template-output>
<template-output>project_type</template-output>
<template-output>project_level</template-output>
<template-output>field_type</template-output>
</step>

<step n="3" goal="Gather project info">
<output>Welcome to BMad Method, {user_name}!</output>

<ask>What's your project called? {{#if project_name}}(Config shows: {{project_name}}){{/if}}</ask>
<action>Set project_name</action>
<template-output>project_name</template-output>

<ask>Tell me about what you're building. What's the goal? are we adding on to something or starting fresh.</ask>

<action>Analyze description to determine project type, level, and field type</action>
<action>Set project_type (game or software)</action>
<action>Set project_level (0-4 based on complexity)</action>
<action>Set field_type (greenfield or brownfield based on description)</action>

<ask>Based on your description: Level {{project_level}} {{field_type}} {{project_type}} project.

Is that correct? (y/n or tell me what's different)</ask>

<check if="user corrects">
  <action>Update values based on corrections</action>
</check>

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
