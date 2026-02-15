---
name: 'step-01-init'
description: 'Initialize the StRS workflow by detecting continuation state and loading input documents'

# File References
nextStepFile: './step-02-stakeholder-identification.md'
outputFile: '{planning_artifacts}/strs-{{project_name}}.md'

# Template References
strsTemplate: '../templates/strs-template.md'
---

# Step 1: StRS Initialization

## STEP GOAL:

Initialize the StRS workflow by detecting continuation state, loading the Product Brief and other input documents, and setting up the document structure.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a Requirements Engineering specialist facilitating ISO 29148 compliance
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring structured requirements thinking, while the user brings domain expertise and stakeholder knowledge
- ✅ Maintain collaborative discovery tone throughout

### Step-Specific Rules:

- 🎯 Focus only on initialization and setup - no content generation yet
- 🚫 FORBIDDEN to look ahead to future steps or assume knowledge from them
- 💬 Approach: Systematic setup with clear reporting to user
- 📋 Detect existing workflow state and handle continuation properly

## EXECUTION PROTOCOLS:

- 🎯 Show your analysis of current state before taking any action
- 💾 Initialize document structure and update frontmatter appropriately
- 📖 Set up frontmatter `stepsCompleted: [1]` before loading next step
- 🚫 FORBIDDEN to load next step until user selects 'C' (Continue)

## CONTEXT BOUNDARIES:

- Available context: Variables from workflow.md are available in memory
- Focus: Workflow initialization and document setup only
- Limits: Don't assume knowledge from other steps or create content yet
- Dependencies: Configuration loaded from workflow.md initialization

## Sequence of Instructions (Do not deviate, skip, or optimize)

### 1. Check for Existing Workflow State

First, check if the output document already exists:

**Workflow State Detection:**

- Look for file `{outputFile}`
- If exists, read the complete file including frontmatter
- If not exists, this is a fresh workflow

### 2. Handle Continuation (If Document Exists)

If the document exists and has frontmatter with `stepsCompleted`:

**Continuation Protocol:**

- Determine which step to resume from based on `stepsCompleted` array
- Report to user what has been completed and what remains
- Offer to continue from the next incomplete step
- Load the appropriate step file based on last completed step

### 3. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

Load context documents using smart discovery. Documents can be in the following locations:
- {planning_artifacts}/**
- {output_folder}/**
- {product_knowledge}/**
- docs/**

Also - when searching - documents can be a single markdown file, or a folder with an index and multiple files.

**REQUIRED Input (Product Brief):**
Try to discover the Product Brief:
- `*product-brief*.md` or `*brief*.md`
- The Product Brief is the PRIMARY input for StRS creation - it provides business vision, target audience, and market context

**Optional Inputs:**
- Brainstorming Reports (`*brainstorming*.md`)
- Research Documents (`*research*.md`)
- Project Documentation (in `{product_knowledge}` or `docs` folder)
- Project Context (`**/project-context.md`)

<critical>Confirm what you have found with the user, along with asking if the user wants to provide anything else. The Product Brief is strongly recommended - if not found, warn the user that StRS quality will be impacted. Only after this confirmation will you proceed to follow the loading rules.</critical>

**Loading Rules:**

- Load ALL discovered files completely that the user confirmed or provided (no offset/limit)
- The Product Brief content should be biased throughout the entire workflow process
- For sharded folders, load ALL files to get complete picture, using the index first
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Create Initial Document

**Document Setup:**

- Copy the template from `{strsTemplate}` to `{outputFile}`, and update the frontmatter fields

#### C. Present Initialization Results

**Setup Report to User:**
"Welcome {{user_name}}! I've set up your Stakeholder Requirements Specification workspace for {{project_name}}.

**What is an StRS?**
The Stakeholder Requirements Specification (ISO 29148 Clause 7) captures WHAT stakeholders need from the system - their business requirements, operational needs, user profiles, and project constraints. It bridges your Product Brief (business vision) and the PRD/SRS (detailed software requirements).

**Document Setup:**

- Created: `{outputFile}` from ISO 29148 template
- Initialized frontmatter with workflow state

**Input Documents Discovered:**

- Product Brief: {found or "NOT FOUND - strongly recommended"}
- Research: {number of research files loaded or "None found"}
- Brainstorming: {number of brainstorming files loaded or "None found"}
- Project docs: {number of project files loaded or "None found"}

**Files loaded:** {list of specific file names or "No additional documents found"}

**We'll work through 7 sections together:**
1. Stakeholder Identification & Analysis
2. Business Context (objectives, model, environment)
3. Operational Requirements (processes, constraints, modes)
4. User Requirements (profiles, personas, needs)
5. Operational Concept & Scenarios
6. Project Constraints (budget, timeline, environment)
7. Final Review & Quality Check

Do you have any other documents you'd like me to include, or shall we continue?"

### 4. Present MENU OPTIONS

Display: "**Select:** [C] Continue to Stakeholder Identification (Step 2 of 8)"

#### Menu Handling Logic:

- IF C: Update frontmatter with `stepsCompleted: [1]`, then read fully and follow: {nextStepFile}
- IF Any other: help user respond, then redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [setup completion is achieved and frontmatter properly updated], will you then read fully and follow: `{nextStepFile}` to begin stakeholder identification.

---

## SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Existing workflow detected and properly handled for continuation
- Fresh workflow initialized with ISO 29148 template and proper frontmatter
- Product Brief discovered and loaded (primary input)
- Input documents discovered and loaded using smart discovery
- All discovered files tracked in frontmatter `inputDocuments`
- User informed about StRS purpose and workflow structure
- Menu presented and user input handled correctly
- Frontmatter updated with `stepsCompleted: [1]` before proceeding

### ❌ SYSTEM FAILURE:

- Proceeding with fresh initialization when existing workflow exists
- Not loading Product Brief when available
- Not warning user if Product Brief is missing
- Not updating frontmatter with discovered input documents
- Creating document without proper template structure
- Not reporting discovered documents to user clearly
- Proceeding without user selecting 'C' (Continue)

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
