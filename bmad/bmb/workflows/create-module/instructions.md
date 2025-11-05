# Build Module - Interactive Module Builder Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmb/workflows/create-module/workflow.yaml</critical>
<critical>Study existing modules in: {project-root}/bmad/ for patterns</critical>
<critical>Communicate in {communication_language} throughout the module creation process</critical>

<workflow>

<step n="-1" goal="Optional brainstorming for module ideas" optional="true">
<ask>Do you want to brainstorm module ideas first? [y/n]</ask>

<check if="yes">
  <action>Invoke brainstorming workflow: {brainstorming_workflow}</action>
  <action>Pass context data: {brainstorming_context}</action>
  <action>Wait for brainstorming session completion</action>
  <action>Use brainstorming output to inform module concept, agent lineup, and workflow portfolio in following steps</action>
</check>

<check if="no">
  <action>Proceed directly to Step 0</action>
</check>

<template-output>brainstorming_results</template-output>
</step>

<step n="0" goal="Check for module brief" optional="true">
<ask>Do you have a module brief or should we create one? [have/create/skip]</ask>

<check if="create">
  <action>Invoke module-brief workflow: {project-root}/bmad/bmb/workflows/module-brief/workflow.yaml</action>
  <action>Wait for module brief completion</action>
  <action>Load the module brief to use as blueprint</action>
</check>

<check if="have">
  <ask>Provide path to module brief document</ask>
  <action>Load the module brief and use it to pre-populate all planning sections</action>
</check>

<check if="skip">
  <action>Proceed directly to Step 1</action>
</check>

<template-output>module_brief</template-output>
</step>

<step n="1" goal="Define module concept and scope">
<critical>Load and study the complete module structure guide</critical>
<action>Load module structure guide: {module_structure_guide}</action>
<action>Understand module types (Simple/Standard/Complex)</action>
<action>Review directory structures and component guidelines</action>
<action>Study the installation infrastructure patterns</action>

<action>If brainstorming or module brief was completed, reference those results to guide the conversation</action>

<action>Guide user to articulate their module's vision, exploring its purpose, what it will help with, and who will use it</action>

<action>Based on their description, intelligently propose module details:</action>

**Module Identity Development:**

1. **Module name** - Extract from their description with proper title case
2. **Module code** - Generate kebab-case from name following patterns:
   - Multi-word descriptive names → shortened kebab-case
   - Domain-specific terms → recognizable abbreviations
   - Present suggested code and confirm it works for paths like bmad/{{code}}/agents/
3. **Module purpose** - Refine their description into 1-2 clear sentences
4. **Target audience** - Infer from context or ask if unclear

**Module Theme Reference Categories:**

- Domain-Specific (Legal, Medical, Finance, Education)
- Creative (RPG/Gaming, Story Writing, Music Production)
- Technical (DevOps, Testing, Architecture, Security)
- Business (Project Management, Marketing, Sales)
- Personal (Journaling, Learning, Productivity)

<critical>Determine output location:</critical>

- Module will be created at {installer_output_folder}

<action>Store module identity for scaffolding</action>

<template-output>module_identity</template-output>
</step>

<step n="2" goal="Plan module components">
<action>Based on the module purpose, intelligently propose an initial component architecture</action>

**Agents Planning:**

<action>Suggest agents based on module purpose, considering agent types (Simple/Expert/Module) appropriate to each role</action>

**Example Agent Patterns by Domain:**

- Data/Analytics: Analyst, Designer, Builder roles
- Gaming/Creative: Game Master, Generator, Storytelling roles
- Team/Business: Manager, Facilitator, Documentation roles

<action>Present suggested agent list with types, explaining we can start with core ones and add others later</action>
<action>Confirm which agents resonate with their vision</action>

**Workflows Planning:**

<action>Intelligently suggest workflows that complement the proposed agents</action>

**Example Workflow Patterns by Domain:**

- Data/Analytics: analyze-dataset, create-dashboard, generate-report
- Gaming/Creative: session-prep, generate-encounter, world-building
- Team/Business: planning, facilitation, documentation workflows

<action>For each workflow, note whether it should be Document, Action, or Interactive type</action>
<action>Confirm which workflows are most important to start with</action>
<action>Determine which to create now vs placeholder</action>

**Tasks Planning (optional):**
<ask>Any special tasks that don't warrant full workflows?</ask>

<action if="tasks needed">For each task, capture name, purpose, and whether standalone or supporting</action>

<template-output>module_components</template-output>
</step>

<step n="2b" goal="Determine module complexity">
<action>Based on components, intelligently determine module type using criteria:</action>

**Simple Module Criteria:**

- 1-2 agents, all Simple type
- 1-3 workflows
- No complex integrations

**Standard Module Criteria:**

- 2-4 agents with mixed types
- 3-8 workflows
- Some shared resources

**Complex Module Criteria:**

- 4+ agents or multiple Module-type agents
- 8+ workflows
- Complex interdependencies
- External integrations

<action>Present determined module type with explanation of what structure will be set up</action>

<template-output>module_type</template-output>
</step>

<step n="3" goal="Create module directory structure">
<critical>Use module path determined in Step 1:</critical>
- The module base path is {{module_path}}

<action>Create base module directories at the determined path:</action>

```
{{module_code}}/
├── agents/                    # Agent definitions
├── workflows/                 # Workflow folders
├── tasks/                     # Task files (if any)
├── templates/                 # Shared templates
├── data/                      # Module data files
├── _module-installer/         # Installation configuration
│   └── install-config.yaml   # Configuration questions (config.yaml generated at install time)
└── README.md                  # Module documentation
```

<action>Create installer directory:</action>

**INSTALLED MODULE STRUCTURE** (generated in target project after installation):

```
{{module_code}}/
├── agents/                    # Compiled agents
├── workflows/                 # Workflow instances
├── config.yaml               # Generated from install-config.yaml during installation
└── data/                     # User data directory
```

**SOURCE MODULE** (\_module-installer is for installation only, not copied to target):

```
{{module_code}}/
├── _module-installer/
│   ├── install-config.yaml   # Configuration questions
│   ├── installer.js          # Optional custom installation logic
│   └── assets/               # Files to copy during install
```

<template-output>directory_structure</template-output>
</step>

<step n="4" goal="Plan module configuration fields">
<action>Based on the module purpose and components, determine what configuration settings the module needs</action>

**Configuration Field Planning:**

<ask>Does your module need any user-configurable settings during installation?</ask>

**Common configuration patterns:**

- Output/data paths (where module saves files)
- Feature toggles (enable/disable functionality)
- Integration settings (API keys, external services)
- Behavior preferences (automation level, detail level)
- User skill level or experience settings

<action>For each configuration field needed, determine:</action>

1. Field name (snake_case)
2. Whether it's INTERACTIVE (asks user) or STATIC (hardcoded)
3. Prompt text (if interactive)
4. Default value
5. Type: text input, single-select, or multi-select
6. Result template (how the value gets stored)

<action>Store planned configuration fields for installer generation in step 7</action>

<template-output>module_config_fields</template-output>
</step>

<step n="5" goal="Create first agent" optional="true">
<ask>Create your first agent now? [yes/no]</ask>

<check if="yes">
  <action>Invoke agent builder workflow: {agent_builder}</action>
  <action>Pass module_components as context input</action>
  <action>Guide them to create the primary agent for the module</action>

<critical>Save to module's agents folder:</critical>

- Save to {{module_path}}/agents/
  </check>

<check if="no">
  <action>Create placeholder file in agents folder with TODO notes including agent name, purpose, and type</action>
</check>

<template-output>first_agent</template-output>
</step>

<step n="6" goal="Create first workflow" optional="true">
<ask>Create your first workflow now? [yes/no]</ask>

<check if="yes">
  <action>Invoke workflow builder: {workflow_builder}</action>
  <action>Pass module_components as context input</action>
  <action>Guide them to create the primary workflow</action>

<critical>Save to module's workflows folder:</critical>

- Save to {{module_path}}/workflows/
  </check>

<check if="no">
  <action>Create placeholder workflow folder structure with TODO notes for workflow.yaml, instructions.md, and template.md if document workflow</action>
</check>

<template-output>first_workflow</template-output>
</step>

<step n="7" goal="Setup module installer">
<action>Load installer template from: {installer_templates}/install-config.yaml</action>

<critical>IMPORTANT: Create install-config.yaml NOT install-config.yaml</critical>
<critical>This is the STANDARD format that BMAD installer uses</critical>

Create \_module-installer/install-config.yaml:

```yaml
# {{module_name}} Module Configuration
# This file defines installation questions and module configuration values

code: {{module_code}}
name: "{{module_name}}"
default_selected: false # Set to true if this should be selected by default

# Welcome message shown during installation
prompt:
  - "Thank you for choosing {{module_name}}!"
  - "{{brief_module_description}}"

# Core config values are automatically inherited:
## user_name
## communication_language
## document_output_language
## output_folder

# ============================================================================
# CONFIGURATION FIELDS (from step 4 planning)
# ============================================================================
# Each field can be:
# 1. INTERACTIVE (has 'prompt' - asks user during installation)
# 2. STATIC (no 'prompt' - just uses 'result' value)
# ============================================================================

# EXAMPLE Interactive text input:
# output_path:
#   prompt: "Where should {{module_code}} save outputs?"
#   default: "output/{{module_code}}"
#   result: "{project-root}/{value}"

# EXAMPLE Interactive single-select:
# detail_level:
#   prompt: "How detailed should outputs be?"
#   default: "standard"
#   result: "{value}"
#   single-select:
#     - value: "minimal"
#       label: "Minimal - Brief summaries only"
#     - value: "standard"
#       label: "Standard - Balanced detail"
#     - value: "detailed"
#       label: "Detailed - Comprehensive information"

# EXAMPLE Static value:
# module_version:
#   result: "1.0.0"

# EXAMPLE Static path:
# data_path:
#   result: "{project-root}/bmad/{{module_code}}/data"

{{generated_config_fields_from_step_4}}
```

<critical>Save location:</critical>

- Save to {{module_path}}/\_module-installer/install-config.yaml

<ask>Does your module need custom installation logic (database setup, API registration, etc.)?</ask>

<check if="yes, create installer.js">
  ```javascript
  // {{module_name}} Module Installer
  // Custom installation logic

/\*\*

- Module installation hook
- Called after files are copied but before IDE configuration
-
- @param {Object} options - Installation options
- @param {string} options.projectRoot - Project root directory
- @param {Object} options.config - Module configuration from install-config.yaml
- @param {Array} options.installedIDEs - List of IDE codes being configured
- @param {Object} options.logger - Logger instance (log, warn, error methods)
- @returns {boolean} - true if successful, false to abort installation
  \*/
  async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  logger.log('Running {{module_name}} custom installer...');

  // TODO: Add custom installation logic here
  // Examples:
  // - Create database tables
  // - Download external assets
  // - Configure API connections
  // - Initialize data files
  // - Set up webhooks or integrations

  logger.log('{{module_name}} custom installation complete!');
  return true;

}

module.exports = { install };

`````

<critical>Save location:</critical>

- Save to {{module_path}}/\_module-installer/installer.js
</check>

<check if="no">
<action>Skip installer.js creation - the standard installer will handle everything</action>
</check>

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
`````

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
```

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
<action>Run validation checks:</action>

**Structure validation:**

- All required directories created
- Config files properly formatted
- Installer configuration valid

**Component validation:**

- At least one agent or workflow exists (or planned)
- All references use correct paths
- Module code consistent throughout

**Documentation validation:**

- README.md complete
- Installation instructions clear
- Examples provided

<action>Present summary to {user_name}:</action>

- Module name and code
- Location path
- Agent count (created vs planned)
- Workflow count (created vs planned)
- Task count
- Installer status

<action>Provide next steps guidance:</action>

1. Complete remaining components using roadmap
2. Run the BMAD Method installer to this project location
3. Select 'Compile Agents' option after confirming folder
4. Module will be compiled and available for use
5. Test with bmad install command
6. Share or integrate with existing system

<ask>Would you like to:

- Create another component now?
- Test the module installation?
- Exit and continue later?
  </ask>

<template-output>module_summary</template-output>
</step>

</workflow>
