---
name: 'step-01-init'
description: 'Initialize SyRS workflow, discover and load required input documents (StRS, PRD, Architecture), create output file from template'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-01-init.md'
nextStepFile: './step-02-system-context.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'
syrsTemplate: '{workflow_path}/templates/syrs-template.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 1: SyRS Workflow Initialization

## STEP GOAL:

Initialize the System Requirements Specification workflow by discovering and loading all required input documents, validating prerequisites, and creating the output document from the SyRS template.

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
- ✅ You bring ISO 29148 compliance expertise and system-level requirements engineering
- ✅ User brings domain expertise, stakeholder context, and system knowledge

### Step-Specific Rules:

- 🎯 Focus ONLY on initialization and document discovery
- 🚫 FORBIDDEN to start writing requirements content in this step
- 💬 Discover and validate input documents
- 🚪 DETECT existing workflow state and handle continuation properly
- ⚠️ StRS and PRD are REQUIRED inputs - warn prominently if missing

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis before taking any action
- 💾 Initialize document and update frontmatter
- 📖 Set up frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until setup is complete

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- Previous context = what's in output document + frontmatter
- Don't assume knowledge from other steps
- Input document discovery happens in this step

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow

First, check if the output document already exists:

- Look for existing `{planning_artifacts}/*syrs*.md`
- If exists, read the complete file(s) including frontmatter
- If the document exists and has frontmatter with `stepsCompleted`:
  - Determine the last completed step
  - Report current state to user
  - Ask if they want to resume from where they left off or restart
  - If resume: Load the appropriate step file based on last completed step
  - If restart: Continue with fresh workflow setup below
- If not exists, this is a fresh workflow

### 2. Fresh Workflow Setup (If No Document)

If no document exists or user chose to restart:

#### A. Input Document Discovery

Discover and load context documents using smart discovery. Documents can be in the following locations:
- {planning_artifacts}/**
- {output_folder}/**
- {product_knowledge}/**
- docs/**

Also - when searching - documents can be a single markdown file, or a folder with an index and multiple files. For example, if searching for `*foo*.md` and not found, also search for a folder called *foo*/index.md (which indicates sharded content).

Try to discover the following:

**REQUIRED Documents:**
- Stakeholder Requirements Specification (`*strs*.md` or `*stakeholder-req*.md` or `*stakeholder*.md`)
- Product Requirements Document (`*prd*.md`)

**RECOMMENDED Documents:**
- Architecture Document (`*architecture*.md`)
- Product Brief (`*brief*.md`)
- UX Design (`*ux-design*.md`)
- Research Documents (`*research*.md`)
- Project Context (`**/project-context.md`)

<critical>Confirm what you have found with the user, along with asking if the user wants to provide anything else. Only after this confirmation will you proceed to follow the loading rules.</critical>

**Loading Rules:**

- Load ALL discovered files completely that the user confirmed or provided (no offset/limit)
- For sharded folders, load ALL files to get complete picture, using the index first to potentially know the potential of each document
- index.md is a guide to what's relevant whenever available
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Validate Required Inputs

Before proceeding, verify we have the essential inputs:

**StRS Validation (REQUIRED):**

- If no StRS found: "⚠️ WARNING: The StRS (Stakeholder Requirements Specification) was not found. The SyRS derives system requirements from stakeholder requirements. Without StRS, traceability to stakeholder needs will be incomplete. You can still proceed, but traceability gaps will be noted throughout."
- Strongly recommend running StRS workflow first or providing the StRS file path

**PRD Validation (REQUIRED):**

- If no PRD found: "⚠️ WARNING: The PRD (Product Requirements Document) was not found. The SyRS transforms PRD functional requirements into system-level requirements. Without PRD, the functional requirements section will lack source material."
- Strongly recommend running PRD workflow first or providing the PRD file path

**Architecture Document (RECOMMENDED):**

- If found: "Architecture document informs system constraints and interface decisions but does not replace the SyRS. I will reference it for technical context."
- If not found: "Architecture document not found. System interface and constraint sections will rely on collaborative discovery with you."

**CRITICAL:** If BOTH StRS and PRD are missing, strongly advise the user to create them first. Allow proceeding only with explicit user acknowledgment of traceability gaps.

#### C. Create Initial Document

Copy the template from `{syrsTemplate}` to `{outputFile}`:

1. Load the SyRS template
2. Create the output file at `{planning_artifacts}/syrs-{{project_name}}.md`
3. Replace `{{project_name}}` with the actual project name
4. Replace `{{user_name}}` with the config user_name
5. Replace `{{date}}` with the current date
6. Initialize frontmatter with workflow state and inputDocuments array

#### D. Complete Initialization and Report

Complete setup and report to user:

**Document Setup:**

- Created: `{planning_artifacts}/syrs-{{project_name}}.md` from SyRS template
- Initialized frontmatter with workflow state

**Report:**
"Welcome {{user_name}}! I've set up your System Requirements Specification workspace for {{project_name}}.

**ISO 29148 Clause 8 Compliance:** This workflow will guide you through creating a fully compliant SyRS with sections covering system context, functional requirements, interfaces, performance, security, operations, lifecycle, and verification.

**Documents Found:**

- StRS: {status - loaded or "Not found - RECOMMENDED"}
- PRD: {status - loaded or "Not found - RECOMMENDED"}
- Architecture: {status - loaded or "Not found - optional"}
- Other documents: {list of additional files loaded or "None found"}

**Files loaded:** {list of specific file names}

**Track:** Enterprise - includes full verification planning and TEA module integration

Ready to begin system requirements engineering. Do you have any other documents you'd like me to include?

[C] Continue to system context definition"

## SUCCESS METRICS:

✅ Existing workflow detected and resume/restart offered correctly
✅ Fresh workflow initialized with SyRS template and frontmatter
✅ Input documents discovered and loaded using sharded-first logic
✅ All discovered files tracked in frontmatter `inputDocuments`
✅ StRS and PRD requirement validated and clearly communicated
✅ Architecture document relationship to SyRS explained
✅ User confirmed document setup and can proceed

## FAILURE MODES:

❌ Proceeding with fresh initialization when existing workflow exists
❌ Not warning about missing StRS or PRD
❌ Not updating frontmatter with discovered input documents
❌ Creating document without proper template
❌ Not checking sharded folders first before whole files
❌ Not reporting what documents were found to user
❌ Proceeding without validating required document status

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects [C] to continue, only after ensuring all the template output has been created and frontmatter updated with `stepsCompleted: [1]`, then load `./step-02-system-context.md` to define the system context and introduction.

Remember: Do NOT proceed to step-02 until user explicitly selects [C] and setup is confirmed!
