---
name: 'step-01-init'
description: 'Initialize narrative workflow, load GDD context, and assess narrative complexity'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/2-design/narrative'

# File References
thisStepFile: './step-01-init.md'
continueStepFile: './step-01b-continue.md'
nextStepFile: './step-02-foundation.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/narrative-design.md'
templateFile: '{workflow_path}/templates/narrative-template.md'
---

# Step 1: Initialize Narrative Workflow

**Progress: Step 1 of 11** - Next: Story Foundation

## STEP GOAL:

Validate workflow readiness, check for existing narrative document, load GDD context, and assess the appropriate level of narrative complexity for this game.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a narrative design facilitator
- Help users craft THEIR story, not yours
- Narrative complexity should match the game

### Step-Specific Rules:

- Check for existing narrative before starting fresh
- Load GDD to understand game context
- Let user confirm narrative complexity level

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Wait for user confirmation at each checkpoint
- Update frontmatter `stepsCompleted: [1]` before loading next step

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Check Workflow Status

**Search for workflow status file:**

Check if `{output_folder}/bmgd-workflow-status.yaml` exists.

**If status file found:**

- Load and parse workflow_status section
- Check status of "narrative" workflow
- Determine if this is the expected next workflow

**Handle scenarios:**

- If already completed: Ask about overwriting
- If out of sequence: Warn and confirm continuation
- Set `standalone_mode` appropriately

### 2. Check for Existing Narrative

**Search for existing narrative document:**

Look for existing narrative files in {output_folder}:

- `*narrative*.md`
- `*story*.md`

**If existing narrative found:**

"I found an existing narrative document: `{{existing_file}}`

**Options:**

1. **Continue** - Resume from where you left off
2. **Start Fresh** - Begin a new narrative (will overwrite)
3. **Review** - Let me review the existing document first

Which would you like to do?"

**Handle selection:**

- If **Continue**: Load `{continueStepFile}`
- If **Start Fresh**: Continue with step 3
- If **Review**: Show document summary

### 3. Load GDD Context

**Search for GDD:**

Look for GDD files using patterns:

- `{output_folder}/*gdd*.md`
- `{output_folder}/*game-design*.md`

**If GDD not found:**

"**Note: GDD Not Found**

The Narrative workflow works best with a completed GDD.

**Options:**

1. Continue without GDD (I'll ask more questions)
2. Run GDD workflow first: `create-gdd`

Your choice:"

**If GDD found:**

Load and extract:

- `game_type`
- `game_name`
- Any existing narrative mentions
- Core mechanics and themes

### 4. Assess Narrative Complexity

"**Narrative Complexity Assessment**

Let's determine the right depth for your narrative design.

**Narrative Complexity Levels:**

| Level        | Description             | Examples                       |
| ------------ | ----------------------- | ------------------------------ |
| **Critical** | Story IS the game       | Visual Novel, Text Adventure   |
| **Heavy**    | Story drives experience | Story RPG, Narrative Adventure |
| **Moderate** | Story enhances gameplay | Metroidvania, Horror, Tactics  |
| **Light**    | Story provides context  | Most action, puzzle, arcade    |

**Based on {{game_type}}, I'd suggest: {{suggested_complexity}}**

What level of narrative complexity does {{game_name}} have?"

### 5. Validate Complexity Choice

**If user selects Light:**

"**Light narrative games usually don't need a full Narrative Design Document.**

Your options:

1. **Proceed anyway** - Create full narrative document
2. **Quick narrative** - Just the essentials (premise, setting, key characters)
3. **Expand GDD** - Add narrative sections to existing GDD instead

What would you like to do?"

**Handle selection appropriately.**

### 6. Initialize Output Document

**If proceeding with full narrative:**

Create `{outputFile}` with frontmatter:

```markdown
---
title: 'Narrative Design Document'
project: '{{game_name}}'
date: '{{date}}'
author: '{{user_name}}'
version: '1.0'
stepsCompleted: [1]
status: 'in-progress'
narrativeComplexity: '{{selected_complexity}}'
gdd: '{{gdd_file}}'
---

# Narrative Design Document

## {{game_name}}

### Document Status

This narrative document is being created through the BMGD Narrative Workflow.

**Narrative Complexity:** {{selected_complexity}}
**Steps Completed:** 1 of 11 (Initialize)

---

_Content will be added as we progress through the workflow._
```

### 7. Proceed to Foundation Step

After initialization:

- Update frontmatter: `stepsCompleted: [1]`
- Load `{nextStepFile}`

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Workflow status checked appropriately
- Existing narrative check performed
- GDD loaded and analyzed (if available)
- Narrative complexity assessed with user
- Output document initialized with proper frontmatter
- Frontmatter updated with stepsCompleted: [1]

### SYSTEM FAILURE:

- Starting without complexity assessment
- Not checking for existing narrative
- Proceeding without user confirmation
- Missing frontmatter initialization

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
