---
installed_path: '{project-root}/.bmad/bmb/workflows/create-module'
nextStepFile: '{installed_path}/steps/step-09-documentation.md'
modulePlanFile: '{custom_module_location}/{module_name}/module-plan-{module_name}.md'
installerTemplate: '{installed_path}/templates/installer.template.js'
installConfigTemplate: '{installed_path}/templates/install-config.template.yaml'
advancedElicitationTask: '{project-root}/.bmad/core/tasks/advanced-elicitation.xml'
partyModeWorkflow: '{project-root}/.bmad/core/workflows/party-mode/workflow.md'
---

# Step 8: Setup Module Installer

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a Module Architect and Installation Specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring expertise in BMAD installation patterns, user brings their module requirements
- ✅ Maintain collaborative, technical tone

### Step-Specific Rules:

- 🎯 Focus on creating installer configuration files
- 🚫 FORBIDDEN to run actual installation
- 💬 Follow BMAD installer standards exactly
- 🚫 FORBIDDEN to deviate from configuration template

## EXECUTION PROTOCOLS:

- 🎯 Use configuration plan from step 5
- 💾 Create module.yaml with all fields
- 📖 Add "step-08-installer" to stepsCompleted array` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C'

## CONTEXT BOUNDARIES:

- Configuration plan from step 5 defines installer fields
- Standard BMAD installer template to follow
- Module structure already created
- Focus on installer setup, not module content

## STEP GOAL:

To create the module installer configuration (module.yaml) that defines how users will install and configure the module.

## INSTALLER SETUP PROCESS:

### 1. Review Configuration Plan

"Now let's set up the installer for your {module_display_name} module.

The installer will:

- Define how users install your module
- Collect configuration settings
- Set up the module structure in user projects
- Generate the module's config.yaml file

From step 5, we planned these configuration fields:

- [List planned configuration fields]"

### 2. Create Installer Directory

Ensure \_module-installer directory exists
Directory: {custom_module_location}/{module_name}/\_module-installer/

### 3. Create module.yaml

"I'll create the module.yaml file based on your configuration plan. This is the core installer configuration file."

Create file: {custom_module_location}/{module_name}/module.yaml from template {installConfigTemplate}

### 4. Handle Custom Installation Logic

"**Custom Installation Logic:**

Does your module need any special setup during installation? For example:

- Creating database tables
- Setting up API connections
- Downloading external assets
- Running initialization scripts"

<ask>Does your module need custom installation logic? [yes/no]</ask>

"I'll create an installer.js file for custom logic."

Create file: {custom_module_location}/{module_name}/\_module-installer/installer.js from {installerTemplate}

Update installer.js with module-specific logic

### 5. Create Assets Directory (if needed)

"**Installer Assets:**

If your module needs to copy files during installation (templates, examples, documentation), we can add them to the assets directory."

Create directory: \_module-installer/assets/
Add note about what assets to include

### 6. Document Installer Setup

Update module-plan.md with installer section:

```markdown
## Installer Configuration

### Install Configuration

- File: module.yaml
- Module code: {module_name}
- Default selected: false
- Configuration fields: [count]

### Custom Logic

- installer.js: [Created/Not needed]
- Custom setup: [description if yes]

### Installation Process

1. User runs: `bmad install {module_name}`
2. Installer asks: [list of questions]
3. Creates: .bmad/{module_name}/
4. Generates: config.yaml with user settings

### Validation

- ✅ YAML syntax valid
- ✅ All fields defined
- ✅ Paths use proper templates
- ✅ Custom logic ready (if needed)
```

### 7. Present MENU OPTIONS

Display: **Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue

#### Menu Handling Logic:

- IF A: Execute {advancedElicitationTask} to review installer configuration
- IF P: Execute {partyModeWorkflow} to get input on user experience
- IF C: Save installer info to module-plan.md, add step-08-installer to the end of the stepsCompleted array in frontmatter, then load nextStepFile
- IF Any other comments or queries: help user respond then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
- User can chat or ask questions - always respond then end with display again of the menu options

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- module.yaml created with all planned fields
- YAML syntax valid
- Custom installation logic prepared (if needed)
- Installer follows BMAD standards
- Configuration properly templated

### ❌ SYSTEM FAILURE:

- Not creating module.yaml
- Invalid YAML syntax
- Missing required fields
- Not using proper path templates

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN C is selected and installer info is saved to module-plan.md with stepsCompleted updated to [1, 2, 3, 4, 5, 6, 7, 8], will you then load, read entire file, then execute `{nextStepFile}` to begin documentation creation.
