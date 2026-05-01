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
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

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
- Update frontmatter: add this step name to the end of the steps completed array (it should be the first entry in the steps array since this is step 1)
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

If the document exists and has frontmatter with `stepsCompleted` BUT `step-12-complete` is NOT in the list, follow the Continuation Protocol since the document is incomplete:

**Continuation Protocol:**

- **STOP immediately** and load `./step-01b-continue.md`
- Do not proceed with any initialization tasks
- Let step-01b handle all continuation logic
- This is an auto-proceed situation - no user choice needed

### 3. Fresh Workflow Setup (If No Document)

If no document exists or no `stepsCompleted` in frontmatter:

#### A. Input Document Discovery

Discover and load context documents using smart discovery. Documents can be in the following locations:
- {planning_artifacts}/**
- {output_folder}/**
- {project_knowledge}/**
- {implementation_artifacts}/investigations/**
- docs/**

Also - when searching - documents can be a single markdown file, or a folder with an index and multiple files. For Example, if searching for `*foo*.md` and not found, also search for a folder called *foo*/index.md (which indicates sharded content)

Try to discover the following:
- Product Brief (`*brief*.md`)
- Research Documents (`/*research*.md`)
- Project Documentation (generally multiple documents might be found for this in the `{project_knowledge}` or `docs` folder.)
- Project Context (`**/project-context.md`)
- Investigation Files (`{implementation_artifacts}/investigations/*.md`) — `bmad-investigate` case files when the PRD is being driven by a forensic investigation rather than greenfield ideation. Captures both `*-investigation.md` and `*-archaeology.md`.

<critical>Confirm what you have found with the user, along with asking if the user wants to provide anything else. Only after this confirmation will you proceed to follow the loading rules</critical>

**Loading Rules:**

- Load ALL discovered files completely that the user confirmed or provided (no offset/limit)
- If there is a project context, whatever is relevant should try to be biased in the remainder of this whole workflow process
- For sharded folders, load ALL files to get complete picture, using the index first to potentially know the potential of each document
- index.md is a guide to what's relevant whenever available
- Track all successfully loaded files in frontmatter `inputDocuments` array

#### B. Create Initial Document

**Document Setup:**

- Copy the template from `../templates/prd-template.md` to `{outputFile}`
- Initialize frontmatter with proper structure including inputDocuments array.

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
- Investigations: {{investigationCount}} files {if investigationCount > 0}✓ loaded{else}(none found){/if}
- Project docs: {{projectDocsCount}} files {if projectDocsCount > 0}✓ loaded (brownfield project){else}(none found - greenfield project){/if}

**Files loaded:** {list of specific file names or "No additional documents found"}

{if projectDocsCount > 0}
📋 **Note:** This is a **brownfield project**. Your existing project documentation has been loaded. In the next step, I'll ask specifically about what new features or changes you want to add to your existing system.
{/if}

{if investigationCount > 0}
🔎 **Note:** Investigation files have been loaded. The evidence-graded findings (Confirmed / Deduced / Hypothesized), timeline, and fix direction are available as context while we scope requirements.
{/if}

Do you have any other documents you'd like me to include, or shall we continue to the next step?"

### 4. Present MENU OPTIONS

Display menu after setup report:

"[C] Continue - Save this and move to Project Discovery (Step 2 of 11)"

#### Menu Handling Logic:

- IF C: Update output file frontmatter, adding this step name to the end of the list of stepsCompleted, then read fully and follow: ./step-02-discovery.md
- IF user provides additional files: Load them, update inputDocuments and documentCounts, redisplay report
- IF user asks questions: Answer and redisplay menu

#### EXECUTION RULES:

- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'

## CRITICAL STEP COMPLETION NOTE

ONLY WHEN [C continue option] is selected and [frontmatter properly updated with this step added to stepsCompleted and documentCounts], will you then read fully and follow: `./step-02-discovery.md` to begin project discovery.

---

## 🚨 SYSTEM SUCCESS/FAILURE METRICS

### ✅ SUCCESS:

- Existing workflow detected and properly handed off to step-01b
- Fresh workflow initialized with template and proper frontmatter
- Input documents discovered and loaded using sharded-first logic
- All discovered files tracked in frontmatter `inputDocuments`
- User clearly informed of brownfield vs greenfield status
- Menu presented and user input handled correctly
- Frontmatter updated with this step name added to stepsCompleted before proceeding

### ❌ SYSTEM FAILURE:

- Proceeding with fresh initialization when existing workflow exists
- Not updating frontmatter with discovered input documents
- **Not storing document counts in frontmatter**
- Creating document without proper template structure
- Not checking sharded folders first before whole files
- Not reporting discovered documents to user clearly
- Proceeding without user selecting 'C' (Continue)

**Master Rule:** Skipping steps, optimizing sequences, or not following exact instructions is FORBIDDEN and constitutes SYSTEM FAILURE.
