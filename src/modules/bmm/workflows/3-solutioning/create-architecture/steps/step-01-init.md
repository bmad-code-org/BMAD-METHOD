# Step 1: Architecture Workflow Initialization

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input

- 📖 CRITICAL: ALWAYS read the complete step file before taking any action - partial understanding leads to incomplete decisions
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative discovery between architectural peers
- 📋 YOU ARE A FACILITATOR, not a content generator
- 💬 FOCUS on initialization and setup only - don't look ahead to future steps
- 🚪 DETECT existing workflow state and handle continuation properly
- ⚠️ ABSOLUTELY NO TIME ESTIMATES - AI development speed has fundamentally changed

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

Initialize the Architecture workflow by detecting continuation state, discovering input documents, and setting up the document for collaborative architectural decision making.

## INITIALIZATION SEQUENCE:

### 1. Check for Existing Workflow

First, check if the output document already exists:

- Look for existing {output_folder}||{planning_artifacts} architecture.md or \*\*/architecture/
- If exists, read the complete file(s) including frontmatter
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

**PRD Document (Priority: Analysis → Main → Sharded → Whole):**

1. Check analysis folders: {output_folder} and {planning_artifacts} for a `*prd*.md`
2. If no main files: Check for sharded PRD folder: `**/*prd*/**/*.md`
3. If sharded folder exists: Load EVERY file in that folder completely
4. Add discovered files to `inputDocuments` frontmatter

**Epics/Stories Document (Priority: Analysis → Main → Sharded → Whole):**

1. Check folders: {output_folder} and {planning_artifacts} for a `*epic*.md`
2. If no analysis files: Try main folder: `{output_folder}/*epic*.md`
3. If no main files: Check for sharded epics folder: `{output_folder}/*epic*/**/*.md`
4. If sharded folder exists: Load EVERY file in that folder completely
5. Add discovered files to `inputDocuments` frontmatter

**UX Design Specification (Priority: Analysis → Main → Sharded → Whole):**

1. Check folders: {output_folder} and {planning_artifacts} for a `*ux*.md`
2. If no main files: Check for sharded UX folder: `{output_folder}/*ux*/**/*.md`
3. If sharded folder exists: Load EVERY file in that folder completely
4. Add discovered files to `inputDocuments` frontmatter

**Research Documents (Priority: Analysis → Main):**

1. Check folders {output_folder} and {planning_artifacts} for `/research/*research*.md`
2. If no files: Try folder: `{output_folder}/*research*.md`
3. Add discovered files to `inputDocuments` frontmatter

**Project Documentation (Existing Projects):**

1. Look for index file: `{project_knowledge}/index.md`
2. CRITICAL: Load index.md to understand what project files are available
3. Read available files from index to understand existing project context
4. This provides essential context for extending existing project with new architecture
5. Add discovered files to `inputDocuments` frontmatter
6. IF no index.md, ask user which files from the folder to include

**Project Context Rules (Critical for AI Agents):**

1. Check for project context file: `**/project-context.md`
2. If exists: Load COMPLETE file contents - this contains critical rules for AI agents
3. Add to frontmatter `hasProjectContext: true` and track file path
4. Report to user: "Found existing project context with {number_of_rules} agent rules"
5. This file contains language-specific patterns, testing rules, and implementation guidelines that must be followed

**Loading Rules:**

- Load ALL discovered files completely (no offset/limit)
- For sharded folders, load ALL files to get complete picture
- For existing projects, use index.md as guide to what's relevant
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Validate Required Inputs

Before proceeding, verify we have the essential inputs:

**PRD Validation:**

- If no PRD found: "Architecture requires a PRD to work from. Please run the PRD workflow first or provide the PRD file path."
- Do NOT proceed without PRD

**Other Inputs:**

- UX Spec: "Provides UI/UX architectural requirements" (Optional)

#### C. Create Initial Document

Copy the template from `{installed_path}/architecture-decision-template.md` to `{output_folder}/architecture.md`

#### D. Complete Initialization and Report

Complete setup and report to user:

**Document Setup:**

- Created: `{output_folder}/architecture.md` from template
- Initialized frontmatter with workflow state

**Input Documents Discovered:**
Report what was found:
"Welcome {{user_name}}! I've set up your Architecture workspace for {{project_name}}.

**Documents Found:**

- PRD: {number of PRD files loaded or "None found - REQUIRED"}
- Epics/Stories: {number of epic files loaded or "None found"}
- UX Design: {number of UX files loaded or "None found"}
- Research: {number of research files loaded or "None found"}
- Project docs: {number of project files loaded or "None found"}
- Project context: {project_context_rules count of rules for AI agents found}

**Files loaded:** {list of specific file names or "No additional documents found"}

Ready to begin architectural decision making. Do you have any other documents you'd like me to include?

[C] Continue to project context analysis

## SUCCESS METRICS:

✅ Existing workflow detected and handed off to step-01b correctly
✅ Fresh workflow initialized with template and frontmatter
✅ Input documents discovered and loaded using sharded-first logic
✅ All discovered files tracked in frontmatter `inputDocuments`
✅ PRD requirement validated and communicated
✅ User confirmed document setup and can proceed

## FAILURE MODES:

❌ Proceeding with fresh initialization when existing workflow exists
❌ Not updating frontmatter with discovered input documents
❌ Creating document without proper template
❌ Not checking sharded folders first before whole files
❌ Not reporting what documents were found to user
❌ Proceeding without validating PRD requirement

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Proceeding with 'C' without fully reading and understanding the next step file
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## NEXT STEP:

After user selects [C] to continue, load `./step-02-context.md` to analyze the project context and begin architectural decision making.

Remember: Do NOT proceed to step-02 until user explicitly selects [C] from the menu and setup is confirmed!
