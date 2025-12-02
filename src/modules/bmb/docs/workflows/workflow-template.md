# BMAD Workflow Template

This template provides the standard structure for all BMAD workflow files. Copy and modify this template for each new workflow you create.

## Frontmatter Structure

Copy this YAML frontmatter and fill in your specific values:

```yaml
---
name: [WORKFLOW_DISPLAY_NAME]
description: [Brief description of what this workflow accomplishes]
web_bundle: [true/false]  # Set to true for inclusion in web bundle builds
---

# [WORKFLOW_DISPLAY_NAME]

**Goal:** [State the primary goal of this workflow in one clear sentence]

**Your Role:** In addition to your name, communication_style, and persona, you are also a [role] collaborating with [user type]. This is a partnership, not a client-vendor relationship. You bring [your expertise], while the user brings [their expertise]. Work together as equals.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

### Core Principles
- **Micro-file Design**: Each step is a self contained instruction file that is a part of an overall workflow that must be followed exactly
- **Just-In-Time Loading**: Only the current step file is in memory - never load future step files until told to do so
- **Sequential Enforcement**: Sequence within the step files must be completed in order, no skipping or optimization allowed
- **State Tracking**: Document progress in output file frontmatter using `stepsCompleted` array when a workflow produces a document
- **Append-Only Building**: Build documents by appending content as directed to the output file

### Step Processing Rules
1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all numbered sections in order, never deviate
3. **WAIT FOR INPUT**: If a menu is presented, halt and wait for user selection
4. **CHECK CONTINUATION**: If the step has a menu with Continue as an option, only proceed to next step when user selects 'C' (Continue)
5. **SAVE STATE**: Update `stepsCompleted` in frontmatter before loading next step
6. **LOAD NEXT**: When directed, load, read entire file, then execute the next step file

### Critical Rules (NO EXCEPTIONS)
- 🛑 **NEVER** load multiple step files simultaneously
- 📖 **ALWAYS** read entire step file before execution
- 🚫 **NEVER** skip steps or optimize the sequence
- 💾 **ALWAYS** update frontmatter of output files when writing the final output for a specific step
- 🎯 **ALWAYS** follow the exact instructions in the step file
- ⏸️ **ALWAYS** halt at menus and wait for user input
- 📋 **NEVER** create mental todo lists from future steps

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {project-root}/{bmad_folder}/[module such as core, bmm, bmb]/config.yaml and resolve:

- `project_name`, `output_folder`, `user_name`, `communication_language`, `document_output_language`, [any additional variables]

**Note:** Use variable substitution patterns for flexible installation paths:
- `{project-root}` - Root directory of the project
- `{bmad_folder}` - Name of the BMAD folder (usually `.bmad`)
- `[module]` - Module name (core, bmm, bmb, or custom)

### 2. First Step EXECUTION

Load, read the full file and then execute `{workflow_path}/steps/step-01-init.md` to begin the workflow.
```

## How to Use This Template

### Step 1: Copy and Replace Placeholders

Copy the template above and replace:

- `[WORKFLOW_DISPLAY_NAME]` → Your workflow's display name
- `[Brief description]` → One-sentence description
- `[true/false]` → Whether to include in web bundle
- `[role]` → AI's role in this workflow
- `[user type]` → Who the user is
- `[CONFIG_PATH]` → Path to config file (usually `bmm/config.yaml` or `bmb/config.yaml`)
- `[WORKFLOW_PATH]` → Path to your workflow folder
- `[any additional variables]` → Extra config variables needed

### Step 2: Create the Folder Structure

```
[workflow-folder]/
├── workflow.md          # This file
└── steps/
    ├── step-01-init.md
    ├── step-02-[name].md
    └── ...
```

### Step 3: Configure the Initialization Path

Update the last line to point to your actual first step file:

```markdown
Load, read the full file and then execute `{workflow_path}/steps/step-01-init.md` to begin the workflow.
```

## Examples

### Example 1: Document Creation Workflow

```yaml
---
name: User Guide Creator
description: Creates comprehensive user guides through collaborative content creation
web_bundle: true
---

# User Guide Creator

**Goal:** Create comprehensive user guides through collaborative content creation

**Your Role:** In addition to your name, communication_style, and persona, you are also a technical writer collaborating with a subject matter expert. This is a partnership, not a client-vendor relationship. You bring structured writing skills and documentation expertise, while the user brings domain knowledge and technical expertise. Work together as equals.
```

### Example 2: Decision Support Workflow

```yaml
---
name: Decision Framework
description: Helps users make structured decisions using proven methodologies
web_bundle: false
---

# Decision Framework

**Goal:** Helps users make structured decisions using proven methodologies

**Your Role:** In addition to your name, communication_style, and persona, you are also a decision facilitator collaborating with a decision maker. This is a partnership, not a client-vendor relationship. You bring structured thinking and facilitation skills, while the user brings context and decision criteria. Work together as equals.
```

## Best Practices

1. **Keep Roles Collaborative**: Always emphasize partnership over client-vendor relationships
2. **Be Specific About Goals**: One clear sentence that describes the outcome
3. **Use Standard Architecture**: Never modify the WORKFLOW ARCHITECTURE section
4. **Include web_bundle**: Set to true for production-ready workflows
5. **Test the Path**: Verify the step file path exists and is correct

## Example Implementation

See the [Meal Prep & Nutrition Plan workflow](../reference/workflows/meal-prep-nutrition/workflow.md) for a complete implementation of this template.

Remember: This template is the STANDARD for all BMAD workflows. Do not modify the core architecture section - only customize the role description and goal.
