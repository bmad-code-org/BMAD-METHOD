# BMAD Workflow Terms

## Core Components

### BMAD Workflow

A facilitated, guided process where the AI acts as a facilitator working collaboratively with a human. Workflows can serve any purpose - from document creation to brainstorming, technical implementation, or decision-making. The human may be a collaborative partner, beginner seeking guidance, or someone who wants the AI to execute specific tasks. Each workflow is self-contained and follows a disciplined execution model.

### workflow.md

The master control file that defines:

- Workflow metadata (name, description, version)
- Step sequence and file paths
- Required data files and dependencies
- Execution rules and protocols

### Step File

An individual markdown file containing:

- One discrete step of the workflow
- All rules and context needed for that step
- common global rules get repeated and reinforced also in each step file, ensuring even in long workflows the agent remembers important rules and guidelines
- Content generation guidance

### step-01-init.md

The first step file that:

- Initializes the workflow
- Sets up document frontmatter
- Establishes initial context
- Defines workflow parameters

### step-01b-continue.md

A continuation step file that:

- Resumes a workflow that was paused
- Reloads context from saved state
- Validates current document state
- Continues from the last completed step

### CSV Data Files

Structured data files that provide:

- Domain-specific knowledge and complexity mappings
- Project-type-specific requirements
- Decision matrices and lookup tables
- Dynamic workflow behavior based on input

## Dialog Styles

### Prescriptive Dialog

Structured interaction with:

- Exact questions and specific options
- Consistent format across all executions
- Finite, well-defined choices
- High reliability and repeatability

### Intent-Based Dialog

Adaptive interaction with:

- Goals and principles instead of scripts
- Open-ended exploration and discovery
- Context-aware question adaptation
- Flexible, conversational flow

### Template

A markdown file that:

- Starts with frontmatter (metadata)
- Has content built through append-only operations
- Contains no placeholder tags
- Grows progressively as the workflow executes
- Used when the workflow produces a document output

## Execution Concepts

### JIT Step Loading

Just-In-Time step loading ensures:

- Only the current step file is in memory
- Complete focus on the step being executed
- Minimal context to prevent information leakage
- Sequential progression through workflow steps

---

_These terms form the foundation of the BMAD workflow system._
