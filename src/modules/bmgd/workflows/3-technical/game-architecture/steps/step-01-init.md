---
name: 'step-01-init'
description: 'Initialize the architecture workflow, validate readiness, and discover input documents'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmgd/workflows/3-technical/game-architecture'

# File References
thisStepFile: './step-01-init.md'
continueStepFile: './step-01b-continue.md'
nextStepFile: './step-02-context.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/game-architecture.md'
templateFile: '{workflow_path}/templates/architecture-template.md'

# Knowledge Bases
decisionCatalog: '{workflow_path}/decision-catalog.yaml'
architecturePatterns: '{workflow_path}/architecture-patterns.yaml'
patternCategories: '{workflow_path}/pattern-categories.csv'
---

# Step 1: Initialize Architecture Workflow

**Progress: Step 1 of 9** - Next: Project Context

## STEP GOAL:

Validate workflow readiness, check for existing architecture work, discover input documents (GDD, Epics), and initialize the output document with proper frontmatter.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- NEVER generate content without user input
- CRITICAL: Read the complete step file before taking any action
- CRITICAL: When loading next step with 'C', ensure entire file is read
- YOU ARE A FACILITATOR, not a content generator
- NEVER mention time estimates
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- You are a veteran game architect facilitator
- Focus on architectural decisions that prevent AI agent conflicts
- This is a decision-focused workflow, not an implementation spec

### Step-Specific Rules:

- Check for existing architecture before starting fresh
- Validate that required input documents exist (GDD at minimum)
- Initialize document with proper frontmatter for state tracking

## EXECUTION PROTOCOLS:

- Show your analysis before taking any action
- Wait for user confirmation at each checkpoint
- Update frontmatter `stepsCompleted: [1]` before loading next step

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Check for Existing Architecture

**Search for existing architecture document:**

Look for existing architecture files in {output_folder}:

- `*architecture*.md`
- `*arch*.md`

**If existing architecture found:**

"I found an existing architecture document: `{{existing_file}}`

**Options:**

1. **Continue** - Resume from where you left off
2. **Start Fresh** - Begin a new architecture (will overwrite)
3. **Review** - Let me review the existing document first

Which would you like to do?"

**Handle user selection:**

- If **Continue**: Load `{continueStepFile}`
- If **Start Fresh**: Continue with step 2 below
- If **Review**: Show document summary and return to options

### 2. Discover Required Input Documents

**Search for GDD:**

Look for GDD files using patterns:

- `{output_folder}/*gdd*.md`
- `{output_folder}/*game-design*.md`

**If GDD not found:**

"**GDD Not Found**

The Architecture workflow works from your Game Design Document (GDD).

The GDD provides:

- Core mechanics and systems to architect
- Technical requirements and constraints
- Platform targets and performance needs

Please run the GDD workflow first: `create-gdd`"

**Exit workflow - GDD required**

**If GDD found:**

"**Input Document Found:**

- GDD: `{{gdd_file}}`

I'll analyze this to understand your game's technical requirements."

### 3. Discover Optional Input Documents

**Search for additional documents:**

- **Epics**: `{output_folder}/*epic*.md`
- **Game Brief**: `{output_folder}/*brief*.md`
- **Narrative**: `{output_folder}/*narrative*.md`

**Report findings:**

"**Additional Documents Found:**
{{list_of_found_documents}}

These will provide additional context for architectural decisions."

### 4. Confirm Workflow Start

**Present start confirmation:**

"**Ready to Start Architecture Workflow**

{{user_name}}, I'm ready to help you create the game architecture for your project.

**What we'll cover:**

1. Engine/framework selection and validation
2. Core architectural decisions (rendering, physics, networking, etc.)
3. Project structure and code organization
4. Implementation patterns for AI agent consistency
5. Cross-cutting concerns (error handling, logging, etc.)

**Input documents:**

- GDD: `{{gdd_file}}`
  {{additional_documents_list}}

**The goal:** Create an architecture document that ensures all AI agents implement your game consistently.

Ready to begin? [Y/N]"

### 5. Initialize Output Document

**If user confirms, create the initial document:**

Create `{outputFile}` with frontmatter:

```markdown
---
title: 'Game Architecture'
project: '{{project_name}}'
date: '{{date}}'
author: '{{user_name}}'
version: '1.0'
stepsCompleted: [1]
status: 'in-progress'

# Source Documents
gdd: '{{gdd_file}}'
epics: '{{epics_file_or_null}}'
brief: '{{brief_file_or_null}}'
---

# Game Architecture

## Document Status

This architecture document is being created through the BMGD Architecture Workflow.

**Steps Completed:** 1 of 9 (Initialize)

---

_Content will be added as we progress through the workflow._
```

### 6. Proceed to Context Step

After initialization:

- Update frontmatter: `stepsCompleted: [1]`
- Load `{nextStepFile}`

---

## SYSTEM SUCCESS/FAILURE METRICS

### SUCCESS:

- Existing architecture check performed
- GDD discovered and validated
- Optional documents discovered
- User confirmed workflow start
- Output document initialized with proper frontmatter
- Frontmatter updated with stepsCompleted: [1]

### SYSTEM FAILURE:

- Skipping input document discovery
- Starting without user confirmation
- Not checking for existing architecture
- Missing frontmatter initialization
- Proceeding without GDD

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
