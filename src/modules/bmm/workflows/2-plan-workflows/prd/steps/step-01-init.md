# Step 1: Workflow Initialization

**Progress: Step 1 of 10** - Next: Project Discovery

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between PM peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on initialization and setup only - don't look ahead to future steps
- 🚪 DETECT existing workflow state and handle continuation properly

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

## YOUR TASK:

Initialize the PRD workflow by detecting continuation state and setting up the document.

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow

First, check if the output document already exists:

- Look for file at `{output_folder}/prd.md`
- If exists, read the complete file including frontmatter
- If not exists, this is a fresh workflow

### 2. Handle Continuation (If Document Exists)

If the document exists and has frontmatter with `stepsCompleted`:

- **STOP here** and load `./step-01b-continue.md` immediately
- Do not proceed with any initialization tasks
- Let step-01b handle the continuation logic

### 3. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

Discover and load context documents using smart discovery:

**Product Brief (Priority: Analysis → Main → Sharded → Whole):**

1. Check analysis folder: `{output_folder}/analysis/*brief*.md`
2. If no analysis files: Try main folder: `{output_folder}/*brief*.md`
3. If no main files: Check for sharded brief folder: `{output_folder}/*brief*/**/*.md`
4. If sharded folder exists: Load EVERY file in that folder completely
5. Add discovered files to `inputDocuments` frontmatter

**Research Documents (Priority: Analysis → Main → Sharded → Whole):**

1. Check analysis folder: `{output_folder}/analysis/research/*research*.md`
2. If no analysis files: Try main folder: `{output_folder}/*research*.md`
3. If no main files: Check for sharded research folder: `{output_folder}/*research*/**/*.md`
4. Load useful research files completely
5. Add discovered files to `inputDocuments` frontmatter

**Brainstorming Documents (Priority: Analysis → Main):**

1. Check analysis folder: `{output_folder}/analysis/brainstorming/*brainstorming*.md`
2. If no analysis files: Try main folder: `{output_folder}/*brainstorming*.md`
3. Add discovered files to `inputDocuments` frontmatter

**Project Documentation (Existing Projects):**

1. Look for index file: `{output_folder}/index.md`
2. CRITICAL: Load index.md to understand what project files are available
3. Read available files from index to understand existing project context
4. This provides essential context for extending existing project with new PRD
5. Add discovered files to `inputDocuments` frontmatter

**Loading Rules:**

- Load ALL discovered files completely (no offset/limit)
- For sharded folders, load ALL files to get complete picture
- For existing projects, use index.md as guide to what's relevant
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Create Initial Document

Copy the template from `{installed_path}/prd-template.md` to `{output_folder}/prd.md`
Initialize frontmatter with:

```yaml
---
stepsCompleted: []
inputDocuments: []
workflowType: 'prd'
lastStep: 0
project_name: '{{project_name}}'
user_name: '{{user_name}}'
date: '{{date}}'
---
```

#### C. Complete Initialization and Report

Complete setup and report to user:

**Document Setup:**

- Created: `{output_folder}/prd.md` from template
- Initialized frontmatter with workflow state

**Input Documents Discovered:**
Report what was found:
"Welcome {{user_name}}! I've set up your PRD workspace for {{project_name}}.

**Documents Found:**

- Product brief: {number of brief files loaded or "None found"}
- Research: {number of research files loaded or "None found"}
- Project docs: {number of project files loaded or "None found"}

**Files loaded:** {list of specific file names or "No additional documents found"}

Do you have any other documents you'd like me to include, or shall we continue to the next step?

[C] Continue - Save this and move to Project Discovery (Step 2 of 10)

## SUCCESS METRICS:

✅ Existing workflow detected and handed off to step-01b correctly
✅ Fresh workflow initialized with template and frontmatter
✅ Input documents discovered and loaded using sharded-first logic
✅ All discovered files tracked in frontmatter `inputDocuments`
✅ User confirmed document setup and can proceed

## FAILURE MODES:

❌ Proceeding with fresh initialization when existing workflow exists
❌ Not updating frontmatter with discovered input documents
❌ Creating document without proper template
❌ Not checking sharded folders first before whole files
❌ Not reporting what documents were found to user

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects [C] to continue, load `{installed_path}/step/step-02-discovery.md` to begin the project discovery phase.
