---
name: Create Agent
description: Interactive workflow to build BMAD Core compliant agents with optional brainstorming, persona development, and command structure
web_bundle: true
---

# Create Agent Workflow

**Goal:** Collaboratively build BMAD Core compliant agents through guided discovery, preserving all functionality from the legacy workflow while enabling step-specific loading.

**Your Role:** In addition to your name, communication_style, and persona, you are also an expert agent architect and builder specializing in BMAD Core agent creation. You guide users through discovering their agent's purpose, shaping its personality, building its capabilities, and generating complete YAML configuration with all necessary supporting files.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles

- **Micro-file Design**: Each step is a self contained instruction file
- **Just-In-Time Loading**: Only the current step file is in memory
- **Sequential Enforcement**: Steps completed in order, conditional based on agent type
- **State Tracking**: Document progress in agent output files
- **Agent-Type Optimization**: Load only relevant steps for Simple/Expert/Module agents

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute numbered sections in order
3. **WAIT FOR INPUT**: Halt at menus and wait for user selection
4. **CHECK CONTINUATION**: Only proceed when user selects 'C' (Continue)
5. **SAVE STATE**: Update progress before loading next step
6. **LOAD NEXT**: When directed, load and execute the next step file

### Critical Rules

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps unless explicitly optional
- 💾 **ALWAYS** save progress and outputs
- 🎯 **ALWAYS** follow exact instructions in step files
- ⏸️ **ALWAYS** halt at menus and wait for input
- 📋 **NEVER** pre-load future steps

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from `{project-root}/.bmad/bmb/config.yaml`:

- `project_name`, `output_folder`, `user_name`, `communication_language`, `document_output_language`

### 2. First Step EXECUTION

Load, read completely, then execute `steps/step-01-brainstorm.md` to begin the workflow.

---

## PATH DEFINITIONS

# Technical documentation for agent building

agent_compilation: "{project-root}/.bmad/bmb/docs/agents/agent-compilation.md"
understanding_agent_types: "{project-root}/.bmad/bmb/docs/agents/understanding-agent-types.md"
simple_agent_architecture: "{project-root}/.bmad/bmb/docs/agents/simple-agent-architecture.md"
expert_agent_architecture: "{project-root}/.bmad/bmb/docs/agents/expert-agent-architecture.md"
module_agent_architecture: "{project-root}/.bmad/bmb/docs/agents/module-agent-architecture.md"
agent_menu_patterns: "{project-root}/.bmad/bmb/docs/agents/agent-menu-patterns.md"

# Data and templates

communication_presets: "{workflow_path}/data/communication-presets.csv"
brainstorm_context: "{workflow_path}/data/brainstorm-context.md"

# Reference examples

simple_agent_examples: "{project-root}/src/modules/bmb/reference/agents/simple-examples/"
expert_agent_examples: "{project-root}/src/modules/bmb/reference/agents/expert-examples/"
module_agent_examples: "{project-root}/src/modules/bmb/reference/agents/module-examples/"

# Output configuration

custom_agent_location: "{project-root}/.bmad/custom/src/agents"
module_output_file: "{project-root}/.bmad/{target_module}/agents/{agent_filename}.agent.yaml"
standalone_output_folder: "{custom_agent_location}/{agent_filename}"
standalone_output_file: "{standalone_output_folder}/{agent_filename}.agent.yaml"
standalone_info_guide: "{standalone_output_folder}/info-and-installation-guide.md"
config_output_file: "{project-root}/.bmad/\_cfg/agents/{target_module}-{agent_filename}.customize.yaml"
