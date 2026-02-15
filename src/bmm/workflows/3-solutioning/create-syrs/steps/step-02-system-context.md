---
name: 'step-02-system-context'
description: 'Define system purpose, scope, overview, boundaries, stakeholders, and references for SyRS Sections 1 and 2'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-02-system-context.md'
nextStepFile: './step-03-functional-requirements.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 2: System Context

## STEP GOAL:

Define the system purpose, scope, overview, boundaries, stakeholders, and references. This step populates ISO 29148 Clause 8 Sections 1 (Introduction) and 2 (References) of the SyRS.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a System Architecture and Requirements Engineering specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring ISO 29148 system context framing expertise
- ✅ User brings domain expertise and system knowledge

### Step-Specific Rules:

- 🎯 Focus ONLY on system context, scope, and introduction content
- 🚫 FORBIDDEN to start writing system requirements in this step
- 💬 Frame the system from a system engineering perspective, not product perspective
- 🚪 Differentiate between product-level context (PRD) and system-level context (SyRS)

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- ⚠️ Present A/P/C menu after generating system context content
- 💾 ONLY save when user chooses C (Continue)
- 📖 Update frontmatter `stepsCompleted: [1, 2]` before loading next step
- 🚫 FORBIDDEN to load next step until C is selected

## COLLABORATION MENUS (A/P/C):

This step will generate content and present choices:

- **A (Advanced Elicitation)**: Use discovery protocols to develop deeper insights about system boundaries and context
- **P (Party Mode)**: Bring multiple perspectives to analyze system context from different engineering angles
- **C (Continue)**: Save the content to the document and proceed to next step

## PROTOCOL INTEGRATION:

- When 'A' selected: Read fully and follow: {advancedElicitationTask}
- When 'P' selected: Read fully and follow: {partyModeWorkflow}
- PROTOCOLS always return to display this step's A/P/C menu after the A or P have completed
- User accepts/rejects protocol changes before proceeding

## CONTEXT BOUNDARIES:

- Current document and frontmatter from step 1 are available
- Input documents already loaded are in memory (StRS, PRD, Architecture, etc.)
- Focus on system-level context framing
- No requirements writing yet - pure system context definition

## SYSTEM CONTEXT ANALYSIS SEQUENCE:

### 1. Analyze Input Documents for System Context

**From StRS (if available):**

- Extract the overall system purpose from stakeholder perspective
- Identify system boundaries as defined by stakeholders
- Note stakeholder-identified constraints and operational environment
- Extract stakeholder groups and their relationship to the system

**From PRD (if available):**

- Extract product scope and map to system scope
- Identify system functions from product features
- Extract user types and characteristics
- Note any product-level assumptions that become system constraints

**From Architecture (if available):**

- Extract system boundary definitions
- Note external system interfaces
- Identify deployment environment characteristics
- Reference architectural decisions that constrain the system

### 2. Define System Purpose (Section 1.1)

Collaborate with user to define:

- Why the system exists (its reason for being)
- What problem it solves at the system level
- How it relates to the broader organizational or business context
- The system's role within any larger system-of-systems

### 3. Define System Scope (Section 1.2)

Collaborate with user to define:

- What is IN scope for this system
- What is explicitly OUT of scope
- System boundaries (what the system includes vs. external entities)
- The system's relationship to adjacent systems

### 4. Define System Overview (Section 1.3)

#### System Context (1.3.1):

- Describe the system's operating environment
- Identify external entities the system interacts with
- Define the system boundary clearly
- Present a textual system context description (or suggest diagram contents)

#### System Functions (1.3.2):

- List the high-level system functions derived from PRD features
- Group functions logically
- Note which functions are primary vs. supporting
- Map functions to stakeholder needs from StRS

#### User Characteristics (1.3.3):

- Define user types from a system perspective
- Characterize user expertise levels
- Note user access patterns and frequency
- Define any user role hierarchies

### 5. Define Glossary (Section 1.4)

- Extract domain-specific terms from input documents
- Define ISO 29148 terminology used in the document
- Add system-specific acronyms and abbreviations
- Ensure alignment with StRS and PRD glossaries

### 6. Compile References (Section 2)

Create the references section listing:

- ISO/IEC/IEEE 29148:2018 - Systems and software engineering - Life cycle processes - Requirements engineering
- StRS document (if available, with version/date)
- PRD document (if available, with version/date)
- Architecture document (if available, with version/date)
- Any other standards, regulations, or documents referenced
- Organizational standards or policies that apply

### 7. Generate System Context Content

Prepare the content to replace placeholders in Sections 1 and 2:

#### Content Structure:

```markdown
## 1. Introduction

### 1.1 System Purpose

{{system_purpose_content}}

### 1.2 System Scope

{{system_scope_content}}

### 1.3 System Overview

#### 1.3.1 System Context

{{system_context_content}}

#### 1.3.2 System Functions

{{system_functions_content}}

#### 1.3.3 User Characteristics

{{user_characteristics_content}}

### 1.4 Definitions, Acronyms, and Abbreviations

{{glossary_content}}

## 2. References

{{references_content}}
```

### 8. Present Content and Menu

Show the generated content and present choices:

"I've drafted the System Context and Introduction sections based on your input documents and our discussion.

**Here's what I'll add to the SyRS document (Sections 1 and 2):**

[Show the complete markdown content from step 7]

**What would you like to do?**
[A] Advanced Elicitation - Dive deeper into system boundary definition and context
[P] Party Mode - Analyze system context from different engineering perspectives
[C] Continue - Save this content and proceed to functional requirements"

### 9. Handle Menu Selection

#### If 'A' (Advanced Elicitation):

- Read fully and follow: {advancedElicitationTask} with the current system context analysis
- Process enhanced insights about system boundaries and context
- Ask user: "Accept these enhancements to the system context? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'P' (Party Mode):

- Read fully and follow: {partyModeWorkflow} with the current system context
- Process collaborative improvements to system understanding
- Ask user: "Accept these changes to the system context? (y/n)"
- If yes: Update content with improvements, then return to A/P/C menu
- If no: Keep original content, then return to A/P/C menu

#### If 'C' (Continue):

- Write the final content to Sections 1 and 2 in `{outputFile}`
- Update frontmatter: `stepsCompleted: [1, 2]`
- Load `{nextStepFile}`

## APPEND TO DOCUMENT:

When user selects 'C', replace the placeholder content in Sections 1 and 2 of the output document with the finalized content.

## SUCCESS METRICS:

✅ System purpose clearly defined from system engineering perspective
✅ System scope and boundaries explicitly stated
✅ System context described with external entities identified
✅ System functions mapped from PRD features
✅ User characteristics defined at system level
✅ Glossary initiated with domain and standard terms
✅ References section complete with all applicable documents and standards
✅ A/P/C menu presented and handled correctly
✅ Content properly written to document when C selected

## FAILURE MODES:

❌ Confusing product-level context with system-level context
❌ Not defining system boundaries explicitly
❌ Missing external entities in system context
❌ Not referencing ISO 29148 in the references section
❌ Skipping glossary initialization
❌ Not presenting A/P/C menu after content generation

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects 'C' and content is saved to document, load `./step-03-functional-requirements.md` to begin defining system functional requirements.

Remember: Do NOT proceed to step-03 until user explicitly selects 'C' from the A/P/C menu and content is saved!
