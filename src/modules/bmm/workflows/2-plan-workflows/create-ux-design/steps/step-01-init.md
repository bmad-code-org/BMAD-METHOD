# Step 1: UX Design Workflow Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between UX facilitator and stakeholder
- 📋 YOU ARE A UX FACILITATOR, not a content generator
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

Initialize the UX design workflow by detecting continuation state and setting up the design specification document.

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow

First, check if the output document already exists:

- Look for file at `{planning_artifacts}/ux-design-specification.md`
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

**PRD (Priority: Analysis → Main → Sharded → Whole):**

1. Check analysis folder: `{planning_artifacts}/*prd*.md`
2. If no files: Try main folder: `{output_folder}/*prd*.md`
3. If no main files: Check for sharded PRD folder: `**/*prd*/**/*.md`
4. If sharded folder exists: Load EVERY file in that folder completely for UX context
5. Add discovered files to `inputDocuments` frontmatter

**Product Brief (Priority: Analysis → Main → Sharded → Whole):**

1. Check analysis folder: `{planning_artifacts}/*brief*.md`
2. If no analysis files: Try main folder: `{output_folder}/*brief*.md`
3. If no main files: Check for sharded brief folder: `**/*brief*/**/*.md`
4. If sharded folder exists: Load EVERY file in that folder completely
5. Add discovered files to `inputDocuments` frontmatter

**Research Documents (Priority: Analysis → Main → Sharded → Whole):**

1. Check analysis folder: `{planning_artifacts}/research/*research*.md`
2. If no analysis files: Try main folder: `{output_folder}/*research*.md`
3. If no main files: Check for sharded research folder: `{output_folder}/*research*/**/*.md`
4. Load useful research files completely
5. Add discovered files to `inputDocuments` frontmatter

**Other Context (Priority: Analysis → Main → Sharded):**

- Epics: `{output_folder}/analysis/*epic*.md` or `{output_folder}/*epic*.md` or `{output_folder}/*epic*/**/*.md`
- Brainstorming: `{output_folder}/analysis/brainstorming/*brainstorming*.md` or `{output_folder}/*brainstorming*.md`

**Loading Rules:**

- Load ALL discovered files completely (no offset/limit)
- For sharded folders, load ALL files to get complete picture
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Create Initial Document

Copy the template from `{installed_path}/ux-design-template.md` to `{planning_artifacts}/ux-design-specification.md`
Initialize frontmatter with:

```yaml
---
stepsCompleted: []
inputDocuments: []
workflowType: 'ux-design'
lastStep: 0
project_name: '{{project_name}}'
user_name: '{{user_name}}'
date: '{{date}}'
---
```

#### C. Complete Initialization and Report

Complete setup and report to user:

**Document Setup:**

- Created: `{planning_artifacts}/ux-design-specification.md` from template
- Initialized frontmatter with workflow state

**Input Documents Discovered:**
Report what was found:
"Welcome {{user_name}}! I've set up your UX design workspace for {{project_name}}.

**Documents Found:**

- PRD: {number of PRD files loaded or "None found"}
- Product brief: {number of brief files loaded or "None found"}
- Other context: {number of other files loaded or "None found"}

**Files loaded:** {list of specific file names or "No additional documents found"}

Do you have any other documents you'd like me to include, or shall we continue to the next step?

[C] Continue to UX discovery"

## NEXT STEP:

After user selects [C] to continue, load `./step-02-discovery.md` to begin the UX discovery phase.

Remember: Do NOT proceed to step-02 until output file has been updated and user explicitly selects [C] to continue!

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
