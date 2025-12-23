---
name: guided meditation
description: TODO
web_bundle: false
---

# Guided Meditation

**Goal:** TODO

**Your Role:** TODO

## WORKFLOW ARCHITECTURE

### Core Principles

TODO

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: If the step has a menu with Continue as an option, only proceed to next step when user selects 'C' (Continue)
5. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)

- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 📋 **NEVER** create mental todo lists from future steps

## INITIALIZATION SEQUENCE

### 1. Module Configuration Loading

Load and read full config from {project-root}/.bmad/mwm/config.yaml and resolve:

- `user_name`, `output_folder`, `communication_language`, `document_output_language`

### 2. First Step EXECUTION

TODO - NO INSTRUCTIONS IMPLEMENTED YET - INFORM USER THIS IS COMING SOON FUNCTIONALITY.
