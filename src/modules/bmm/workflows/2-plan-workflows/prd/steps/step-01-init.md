---
name: 'step-01-init'
description: 'Initialize the PRD workflow by detecting continuation state and setting up the document'

# Path Definitions
workflow_path: '{project-root}/.bmad/bmm/workflows/2-plan-workflows/prd'

# File References
thisStepFile: '{workflow_path}/steps/step-01-init.md'
nextStepFile: '{workflow_path}/steps/step-02-discovery.md'
continueStepFile: '{workflow_path}/steps/step-01b-continue.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/prd.md'

# Template References
prdTemplate: '{workflow_path}/prd-template.md'
---

# Step 1: Workflow Initialization

**Progress: Step 1 of 11** - Next: Project Discovery

## STEP GOAL:

Initialize the PRD workflow by detecting continuation state, discovering input documents, and setting up the document structure for collaborative product requirement discovery.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator

### Role Reinforcement:

- ✅ You are a product-focused PM facilitator collaborating with an expert peer
- ✅ If you already have been given a name, communication_style and persona, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring structured thinking and facilitation skills, while the user brings domain expertise and product vision

### Step-Specific Rules:

- 🎯 Focus only on initialization and setup - no content generation yet
- 🚫 FORBIDDEN to look ahead to future steps or assume knowledge from them
- 💬 Approach: Systematic setup with clear reporting to user
- 🚪 Detect existing workflow state and handle continuation properly

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

- Look for file at `{outputFile}`
- If exists, read the complete file including frontmatter
- If not exists, this is a fresh workflow

### 2. Handle Continuation (If Document Exists)

If the document exists and has frontmatter with `stepsCompleted`:

**Continuation Protocol:**

- **STOP immediately** and load `{continueStepFile}`
- Do not proceed with any initialization tasks
- Let step-01b handle all continuation logic
- This is an auto-proceed situation - no user choice needed

### 3. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

Discover and load context documents using smart discovery.

**IMPORTANT: Track document counts as you discover files.**

Initialize counters:

```
briefCount = 0
researchCount = 0
brainstormingCount = 0
projectDocsCount = 0
```

**Product Brief (Priority: Analysis → Main → Sharded → Whole):**

1. Check analysis folder: `{output_folder}/analysis/*brief*.md`
2. If no analysis files: Try main folder: `{output_folder}/*brief*.md`
3. If no main files: Check for sharded brief folder: `{output_folder}/*brief*/**/*.md`
4. If sharded folder exists: Load EVERY file in that folder completely
5. Add discovered files to `inputDocuments` frontmatter
6. **Update briefCount with number of files found**

**Research Documents (Priority: Analysis → Main → Sharded → Whole):**

1. Check analysis folder: `{output_folder}/analysis/research/*research*.md`
2. If no analysis files: Try main folder: `{output_folder}/*research*.md`
3. If no main files: Check for sharded research folder: `{output_folder}/*research*/**/*.md`
4. Load useful research files completely
5. Add discovered files to `inputDocuments` frontmatter
6. **Update researchCount with number of files found**

**Brainstorming Documents (Priority: Analysis → Main):**

1. Check analysis folder: `{output_folder}/analysis/brainstorming/*brainstorming*.md`
2. If no analysis files: Try main folder: `{output_folder}/*brainstorming*.md`
3. Add discovered files to `inputDocuments` frontmatter
4. **Update brainstormingCount with number of files found**

**Project Documentation (Existing Projects - Brownfield):**

1. Look for index file: `{output_folder}/index.md`
2. CRITICAL: Load index.md to understand what project files are available
3. Read available files from index to understand existing project context
4. This provides essential context for extending existing project with new PRD
5. Add discovered files to `inputDocuments` frontmatter
6. **Update projectDocsCount with number of files found (including index.md)**

**Loading Rules:**

- Load ALL discovered files completely (no offset/limit)
- For sharded folders, load ALL files to get complete picture
- For existing projects, use index.md as guide to what's relevant
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Create Initial Document

**Document Setup:**

- Copy the template from `{prdTemplate}` to `{outputFile}`
- Initialize frontmatter with proper structure including document counts:

```yaml
---
stepsCompleted: []
inputDocuments: []
documentCounts:
  briefs: { { briefCount } }
  research: { { researchCount } }
  brainstorming: { { brainstormingCount } }
  projectDocs: { { projectDocsCount } }
workflowType: 'prd'
lastStep: 0
project_name: '{{project_name}}'
user_name: '{{user_name}}'
date: '{{date}}'
---
```

#### C. Present Initialization Results

**Setup Report to User:**

"Welcome {{user_name}}! I've set up your PRD workspace for {{project_name}}.

**Document Setup:**

- Created: `{outputFile}` from template
- Initialized frontmatter with workflow state

**Input Documents Discovered:**

- Product briefs: {{briefCount}} files {if briefCount > 0}✓ loaded{else}(none found){/if}
- Research: {{researchCount}} files {if researchCount > 0}✓ loaded{else}(none found){/if}
- Brainstorming: {{brainstormingCount}} files {if brainstormingCount > 0}✓ loaded{else}(none found){/if}
- Project docs: {{projectDocsCount}} files {if projectDocsCount > 0}✓ loaded (brownfield project){else}(none found - greenfield project){/if}

**Files loaded:** {list of specific file names or "No additional documents found"}

{if projectDocsCount > 0}
📋 **Note:** This is a **brownfield project**. Your existing project documentation has been loaded. In the next step, I'll ask specifically about what new features or changes you want to add to your existing system.
{/if}

Do you have any other documents you'd like me to include, or shall we continue to the next step?"

### 4. Present MENU OPTIONS

Display menu after setup report:

"[C] Continue - Save this and move to Project Discovery (Step 2 of 11)"

#### Menu Handling Logic:

- IF C: Update frontmatter with `stepsCompleted: [1]`, then load, read entire file, then execute {nextStepFile}
- IF user provides additional files: Load them, update inputDocuments and documentCounts, redisplay report
- IF user asks questions: Answer and redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [frontmatter properly updated with stepsCompleted: [1] and documentCounts], will you then load and read fully `{nextStepFile}` to execute and begin project discovery.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Existing workflow detected and properly handed off to step-01b
- Fresh workflow initialized with template and proper frontmatter
- Input documents discovered and loaded using sharded-first logic
- All discovered files tracked in frontmatter `inputDocuments`
- **Document counts stored in frontmatter `documentCounts`**
- User clearly informed of brownfield vs greenfield status
- Menu presented and user input handled correctly
- Frontmatter updated with `stepsCompleted: [1]` before proceeding

### ❌ SYSTEM FAILURE:

- Proceeding with fresh initialization when existing workflow exists
- Not updating frontmatter with discovered input documents
- **Not storing document counts in frontmatter**
- Creating document without proper template structure
- Not checking sharded folders first before whole files
- Not reporting discovered documents to user clearly
- Proceeding without user selecting 'C' (Continue)

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
