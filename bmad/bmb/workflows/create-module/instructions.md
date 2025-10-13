# Build Module - Interactive Module Builder Instructions

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project_root}/bmad/bmb/workflows/create-module/workflow.yaml</critical>
<critical>Study existing modules in: {project_root}/bmad/ for patterns</critical>

<workflow>

<step n="-1" goal="Optional brainstorming for module ideas" optional="true">
<ask>Do you want to brainstorm module ideas first? [y/n]</ask>

If yes:
<action>Invoke brainstorming workflow: {brainstorming-workflow}</action>
<action>Pass context data: {brainstorming_context}</action>
<action>Wait for brainstorming session completion</action>
<action>Use brainstorming output to inform module concept, agent lineup, and workflow portfolio</action>

If no, proceed to check for module brief.

<template-output>brainstorming_results</template-output>
</step>

<step n="0" goal="Check for module brief" optional="true">
<ask>Do you have a module brief or should we create one? [have/create/skip]</ask>

If create:
<action>Invoke module-brief workflow: {project-root}/bmad/bmb/workflows/module-brief/workflow.yaml</action>
<action>Wait for module brief completion</action>
<action>Load the module brief to use as blueprint</action>

If have:
<ask>Provide path to module brief document</ask>
<action>Load the module brief and use it to pre-populate all planning sections</action>

If skip, proceed directly to module definition.

<template-output>module_brief</template-output>
</step>

<step n="1" goal="Define module concept and scope">
<critical>Load and study the complete module structure guide</critical>
<action>Load module structure guide: {module_structure_guide}</action>
<action>Understand module types (Simple/Standard/Complex)</action>
<action>Review directory structures and component guidelines</action>
<action>Study the installation infrastructure patterns</action>

Ask the user about their module vision:

**"What kind of module do you want to create? Tell me about its purpose and what it will help with."**

Listen to their description and then:

<action>Based on their description, intelligently propose module details:</action>

**Module Identity (AI Proposed):**

1. **Module name** - Extract from their description (e.g., "Data Visualization Suite", "RPG Toolkit")
2. **Module code** - Generate kebab-case from name:
   - "Data Visualization Suite" → propose: "data-viz"
   - "RPG Game Master Tools" → propose: "rpg-toolkit"
   - "Team Collaboration System" → propose: "team-collab"
   - "Personal Finance Manager" → propose: "fin-manager"

   Present as: _"Based on what you described, I suggest the module code: `{{proposed-code}}`. This will be used in paths like bmad/{{proposed-code}}/agents/. Does this work or would you prefer something different?"_

3. **Module purpose** - Refine their description into 1-2 clear sentences
4. **Target audience** - Infer from context or ask if unclear

**Module Theme Examples:**

- **Domain-Specific:** Legal, Medical, Finance, Education
- **Creative:** RPG/Gaming, Story Writing, Music Production
- **Technical:** DevOps, Testing, Architecture, Security
- **Business:** Project Management, Marketing, Sales
- **Personal:** Journaling, Learning, Productivity

<critical>Determine output location:</critical>

- Module will be created at {installer_output_folder}

Store module identity for scaffolding.

<template-output>module_identity</template-output>
</step>

<step n="2" goal="Plan module components">
<action>Based on the module purpose, propose an initial component architecture:</action>

**"Based on your {{module_name}}, here's what I think would make a great module structure:"**

**Agents Planning (AI Proposed):**

<action>Intelligently suggest agents based on module purpose:</action>

For a Data Visualization module, suggest:

- "Data Analyst" - Interprets and analyzes datasets (Module type)
- "Chart Designer" - Creates visualization specs (Simple type)
- "Report Builder" - Generates comprehensive reports (Module type)

For an RPG Toolkit, suggest:

- "Dungeon Master" - Runs game sessions (Module type)
- "NPC Generator" - Creates characters (Expert type)
- "Story Weaver" - Builds adventures (Module type)

For a Team Collaboration module, suggest:

- "Project Manager" - Coordinates tasks (Module type)
- "Meeting Facilitator" - Runs standups/retros (Simple type)
- "Documentation Lead" - Maintains team docs (Expert type)

Present as: _"I'm thinking your module could have these agents: [list]. We can start with the core ones and add others later. Which of these resonate with your vision?"_

**Workflows Planning (AI Proposed):**

<action>Intelligently suggest workflows based on module purpose:</action>

For a Data Visualization module, suggest workflows like:

- "analyze-dataset" - Statistical analysis workflow
- "create-dashboard" - Interactive dashboard builder
- "generate-report" - Automated report generation

For an RPG Toolkit, suggest workflows like:

- "session-prep" - Prepare game session materials
- "generate-encounter" - Create combat/social encounters
- "world-building" - Design locations and lore

Present as: _"For workflows, these would complement your agents well: [list]. Each can be created as we need them. Which are most important to start with?"_

- Create now or placeholder?

Example workflows:

1. adventure-plan - Create full adventure (Document)
2. random-encounter - Quick encounter generator (Action)
3. npc-generator - Create NPCs on the fly (Interactive)
4. treasure-generator - Loot tables (Action)

**Tasks Planning (optional):**
Ask: Any special tasks that don't warrant full workflows?

For each task:

- Task name and purpose
- Standalone or supporting?

<template-output>module_components</template-output>
</step>

<step n="2b" goal="Determine module complexity">
<action>Based on components, intelligently determine module type:</action>

**Simple Module** (auto-select if):

- 1-2 agents, all Simple type
- 1-3 workflows
- No complex integrations

**Standard Module** (auto-select if):

- 2-4 agents with mixed types
- 3-8 workflows
- Some shared resources

**Complex Module** (auto-select if):

- 4+ agents or multiple Module-type agents
- 8+ workflows
- Complex interdependencies
- External integrations

Present as: _"Based on your planned components, this looks like a {{determined_type}} module. This means we'll set up {{structure_description}}."_

<template-output>module_type</template-output>
</step>

<step n="3" goal="Create module directory structure">
<critical>Use module path determined in Step 1:</critical>
- The module base path is {{module_path}}

<action>Create base module directories at the determined path:</action>

```
{{module_code}}/
├── agents/           # Agent definitions
├── workflows/        # Workflow folders
├── tasks/           # Task files (if any)
├── templates/       # Shared templates
├── data/           # Module data files
├── config.yaml     # Module configuration
└── README.md       # Module documentation
```

<action>Create installer directory:</action>

```
{{module_code}}/
├── _module-installer/
│   ├── install-module-config.yaml
│   ├── installer.js (optional)
│   └── assets/     # Files to copy during install
├── config.yaml     # Runtime configuration
├── agents/         # Agent configs (optional)
├── workflows/      # Workflow instances
└── data/          # User data directory
```

<template-output>directory_structure</template-output>
</step>

<step n="4" goal="Generate module configuration">
Create the main module config.yaml:

```yaml
# {{module_name}} Module Configuration
module_name: {{module_name}}
module_code: {{module_code}}
author: {{user_name}}
description: {{module_purpose}}

# Module paths
module_root: "{project-root}/bmad/{{module_code}}"
installer_path: "{project-root}/bmad/{{module_code}}"

# Component counts
agents:
  count: {{agent_count}}
  list: {{agent_list}}

workflows:
  count: {{workflow_count}}
  list: {{workflow_list}}

tasks:
  count: {{task_count}}
  list: {{task_list}}

# Module-specific settings
{{custom_settings}}

# Output configuration
output_folder: "{project-root}/docs/{{module_code}}"
data_folder: "{{determined_module_path}}/data"
```

<critical>Save location:</critical>

- Save to {{module_path}}/config.yaml

<template-output>module_config</template-output>
</step>

<step n="5" goal="Create first agent" optional="true">
Ask: **Create your first agent now? [Yes/no]**

If yes:
<invoke-workflow input="{{module_components}}">
{agent_builder}
</invoke-workflow>

Guide them to create the primary agent for the module.
<critical>Save to module's agents folder:</critical>

- Save to {{module_path}}/agents/

If no, create placeholder:

```md
# {{primary_agent_name}} Agent

<!-- TODO: Create using create-agent workflow -->
<!-- Purpose: {{agent_purpose}} -->
<!-- Type: {{agent_type}} -->
```

<template-output>first_agent</template-output>
</step>

<step n="6" goal="Create first workflow" optional="true">
Ask: **Create your first workflow now? [Yes/no]**

If yes:
<invoke-workflow input="{{module_components}}">
{workflow_builder}
</invoke-workflow>

Guide them to create the primary workflow.
<critical>Save to module's workflows folder:</critical>

- Save to {{module_path}}/workflows/

If no, create placeholder structure:

```
workflows/{{workflow_name}}/
├── workflow.yaml    # TODO: Configure
├── instructions.md  # TODO: Add steps
└── template.md     # TODO: If document workflow
```

<template-output>first_workflow</template-output>
</step>

<step n="7" goal="Setup module installer">
<action>Load installer templates from: {installer_templates}</action>

Create install-module-config.yaml:

```yaml
# {{module_name}} Installation Configuration
module_name: { { module_name } }
module_code: { { module_code } }
installation_date: { { date } }

# Installation steps
install_steps:
  - name: 'Create directories'
    action: 'mkdir'
    paths:
      - '{project-root}/bmad/{{module_code}}'
      - '{project-root}/bmad/{{module_code}}/data'
      - '{project-root}/bmad/{{module_code}}/agents'

  - name: 'Copy configuration'
    action: 'copy'
    source: '{installer_path}/config.yaml'
    dest: '{project-root}/bmad/{{module_code}}/config.yaml'

  - name: 'Register module'
    action: 'register'
    manifest: '{project-root}/bmad/_cfg/manifest.yaml'

# External assets (if any)
external_assets:
  - description: '{{asset_description}}'
    source: 'assets/{{filename}}'
    dest: '{{destination_path}}'

# Post-install message
post_install_message: |
  {{module_name}} has been installed successfully!

  To get started:
  1. Load any {{module_code}} agent
  2. Use *help to see available commands
  3. Check README.md for full documentation
```

Create installer.js stub (optional):

```javascript
// {{module_name}} Module Installer
// This is a placeholder for complex installation logic

function installModule(config) {
  console.log('Installing {{module_name}} module...');

  // TODO: Add any complex installation logic here
  // Examples:
  // - Database setup
  // - API key configuration
  // - External service registration
  // - File system preparation

  console.log('{{module_name}} module installed successfully!');
  return true;
}

module.exports = { installModule };
```

<template-output>installer_config</template-output>
</step>

<step n="8" goal="Create module documentation">
Generate comprehensive README.md:

````markdown
# {{module_name}}

{{module_purpose}}

## Overview

This module provides:
{{component_summary}}

## Installation

```bash
bmad install {{module_code}}
```
````

## Components

### Agents ({{agent_count}})

{{agent_documentation}}

### Workflows ({{workflow_count}})

{{workflow_documentation}}

### Tasks ({{task_count}})

{{task_documentation}}

## Quick Start

1. **Load the main agent:**

   ```
   agent {{primary_agent}}
   ```

2. **View available commands:**

   ```
   *help
   ```

3. **Run the main workflow:**
   ```
   workflow {{primary_workflow}}
   ```

## Module Structure

```
{{directory_tree}}
```

## Configuration

The module can be configured in `bmad/{{module_code}}/config.yaml`

Key settings:
{{configuration_options}}

## Examples

### Example 1: {{example_use_case}}

{{example_walkthrough}}

## Development Roadmap

- [ ] {{roadmap_item_1}}
- [ ] {{roadmap_item_2}}
- [ ] {{roadmap_item_3}}

## Contributing

To extend this module:

1. Add new agents using `create-agent` workflow
2. Add new workflows using `create-workflow` workflow
3. Submit improvements via pull request

## Author

Created by {{user_name}} on {{date}}

````

<template-output>module_readme</template-output>
</step>

<step n="9" goal="Generate component roadmap">
Create a development roadmap for remaining components:

**TODO.md file:**
```markdown
# {{module_name}} Development Roadmap

## Phase 1: Core Components
{{phase1_tasks}}

## Phase 2: Enhanced Features
{{phase2_tasks}}

## Phase 3: Polish and Integration
{{phase3_tasks}}

## Quick Commands

Create new agent:
````

workflow create-agent

```

Create new workflow:
```

workflow create-workflow

```

## Notes
{{development_notes}}
```

Ask if user wants to:

1. Continue building more components now
2. Save roadmap for later development
3. Test what's been built so far

<template-output>development_roadmap</template-output>
</step>

<step n="10" goal="Validate and finalize module">
Run validation checks:

1. **Structure validation:**
   - All required directories created
   - Config files properly formatted
   - Installer configuration valid

2. **Component validation:**
   - At least one agent or workflow exists (or planned)
   - All references use correct paths
   - Module code consistent throughout

3. **Documentation validation:**
   - README.md complete
   - Installation instructions clear
   - Examples provided

Show summary:

```
✅ Module: {{module_name}} ({{module_code}})
📁 Location: {{module_path}}
👥 Agents: {{agent_count}} ({{agents_created}} created, {{agents_planned}} planned)
📋 Workflows: {{workflow_count}} ({{workflows_created}} created, {{workflows_planned}} planned)
📝 Tasks: {{task_count}}
📦 Installer: Ready at same location
```

Next steps:

1. Complete remaining components using roadmap
2. Run the BMAD Method installer to this project location
3. Select the option 'Compile Agents (Quick rebuild of all agent .md files)' after confirming the folder
4. This will compile your new module and make it available for use
5. Test module with: `bmad install {{module_code}}`
6. Share module or integrate with existing system

Ask: Would you like to:

- Create another component now?
- Test the module installation?
- Exit and continue later?

<template-output>module_summary</template-output>
</step>

</workflow>
