# Step Type Patterns

**Purpose:** Templates for different step types.

---

## Core Step Structure

All steps share this skeleton:
```markdown
---
name: 'step-[N]-[name]'
description: '[what it does]'
[file references - relative path and only if used in this steps file]
---

# Step [N]: [Name]

## STEP GOAL:
[Single sentence goal]

## MANDATORY EXECUTION RULES (READ FIRST):
### Universal Rules:
- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read complete step file before action
- 🔄 CRITICAL: When loading next with 'C', read entire file
- 📋 YOU ARE A FACILITATOR, not content generator

### Role Reinforcement:
- ✅ You are [specific role]
- ✅ Collaborative dialogue, not command-response
- ✅ You bring [expertise], user brings [theirs]

### Step-Specific Rules:
- 🎯 Focus only on [specific task]
- 🚫 FORBIDDEN to [prohibited action]
- 💬 Approach: [how to engage]

## EXECUTION PROTOCOLS:
- 🎯 Follow the MANDATORY SEQUENCE exactly
- 💾 [Additional protocol]
- 📖 [Additional protocol]

## CONTEXT BOUNDARIES:
- Available context: [what's available]
- Focus: [what to focus on]
- Limits: [boundaries]
- Dependencies: [what this depends on]

## MANDATORY SEQUENCE

**CRITICAL:** Follow this sequence exactly. Do not skip, reorder, or improvise unless user explicitly requests a change.

### 1. [First action]
[Instructions]

### N. Present MENU OPTIONS
[Menu section - see menu-handling-standards.md]

## 🚨 SYSTEM SUCCESS/FAILURE METRICS:
### ✅ SUCCESS: [criteria]
### ❌ SYSTEM FAILURE: [criteria]
**Master Rule:** Skipping steps is FORBIDDEN.
```

---

## Step Types

### 1. Init Step (Non-Continuable)

**Use:** Single-session workflow

**Frontmatter:**
```yaml
---
name: 'step-01-init'
description: 'Initialize [workflow]'
nextStepFile: './step-02-[name].md'
outputFile: '{output_folder}/[output].md'
templateFile: '../templates/[template].md'
---
```

**Characteristics:**
- No continuation detection
- Auto-proceeds to step 2
- No A/P menu
- Creates output from template

**Menu:** Auto-proceed (no user choice)

### 2. Init Step (Continuable)

**Use:** Multi-session workflow

**Frontmatter:** Add `continueFile` reference
```yaml
continueFile: './step-01b-continue.md'
```

**Logic:**
```markdown
## 1. Check for Existing Workflow
- Look for {outputFile}
- If exists AND has stepsCompleted → STOP, load {continueFile}
- If not exists → continue to setup
```

**Reference:** `step-01-init-continuable-template.md`

### 3. Continuation Step (01b)

**Use:** Paired with continuable init

**Frontmatter:**
```yaml
---
name: 'step-01b-continue'
description: 'Handle workflow continuation'
outputFile: '{output_folder}/[output].md'
workflowFile: '{workflow_path}/workflow.md'
---
```

**Logic:**
1. Read `stepsCompleted` array from output
2. Read last completed step file to find nextStep
3. Welcome user back
4. Route to appropriate step

**Reference:** `step-1b-template.md`

### 4. Middle Step (Standard)

**Use:** Collaborative content generation

**Frontmatter:**
```yaml
---
name: 'step-[N]-[name]'
nextStepFile: './step-[N+1]-[name].md'
outputFile: '{output_folder}/[output].md'
advancedElicitationTask: '{project-root}/.../advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/.../party-mode/workflow.md'
---
```

**Menu:** A/P/C pattern

### 5. Middle Step (Simple)

**Use:** Data gathering, no refinement needed

**Menu:** C only (no A/P)

### 6. Branch Step

**Use:** User choice determines next path

**Frontmatter:**
```yaml
nextStepFile: './step-[default].md'
altStepFile: './step-[alternate].md'
```

**Menu:** Custom letters (L/R/etc.) with branching logic

### 7. Validation Sequence Step

**Use:** Multiple checks without user interruption

**Menu:** Auto-proceed to next validation

**Pattern:**
```markdown
## 1. Perform validation check
[Check logic]

## 2. Write results to {outputFile}
Append findings

## 3. Proceed to next validation
Display: "**Proceeding to next check...**"
→ Immediately load {nextValidationStep}
```

### 8. Init Step (With Input Discovery)

**Use:** Workflow that requires documents from prior workflows or external sources

**Frontmatter:**
```yaml
---
name: 'step-01-init'
description: 'Initialize and discover input documents'
inputDocuments: []
requiredInputCount: 1
moduleInputFolder: '{module_output_folder}'
inputFilePatterns:
  - '*-prd.md'
  - '*-ux.md'
---
```

**Characteristics:**
- Discovers documents from prior workflows
- Searches by folder, pattern, or user-provided paths
- Validates inputs are complete
- User confirms which documents to use
- Auto-proceeds when required inputs found

**Logic:**
```markdown
## 1. Discover Required Inputs
Search {moduleInputFolder} for {inputFilePatterns}
Search {project_folder}/docs/ for {inputFilePatterns}

## 2. Present Findings
"Found these documents:
[1] prd-my-project.md (3 days ago) ✓
[2] ux-research.md (1 week ago)
Which would you like to use?"

## 3. Validate and Load
Check workflowType, stepsCompleted, date
Load selected documents
Add to {inputDocuments} array

## 4. Auto-Proceed
If all required inputs found → proceed to step 2
If missing → Error with guidance
```

**Reference:** `input-discovery-standards.md`

### 9. Final Polish Step

**Use:** Optimizes document built section-by-section

**Frontmatter:**
```yaml
---
name: 'step-[N]-polish'
description: 'Optimize and finalize document'
outputFile: '{output_folder}/[document].md'
---
```

**Characteristics:**
- Loads entire document
- Reviews for flow and coherence
- Reduces duplication
- Ensures proper ## Level 2 headers
- Improves transitions
- Keeps general order but optimizes readability

**Logic:**
```markdown
## 1. Load Complete Document
Read {outputFile} entirely

## 2. Document Optimization
Review entire document for:
1. Flow and coherence
2. Duplication (remove while preserving essential info)
3. Proper ## Level 2 section headers
4. Smooth transitions between sections
5. Overall readability

## 3. Optimize
Make improvements while maintaining:
- General order of sections
- Essential information
- User's voice and intent

## 4. Final Output
Save optimized document
Mark workflow complete
```

**Use for:** Free-form output workflows (most document-producing workflows)

### 10. Final Step

**Use:** Last step, completion

**Frontmatter:** No `nextStepFile`

**Logic:**
- Update frontmatter to mark workflow complete
- Provide final summary
- No next step

---

## Step Size Guidelines

| Type                  | Recommended | Maximum |
| --------------------- | ----------- | ------- |
| Init                  | < 100       | 150     |
| Init (with discovery) | < 150       | 200     |
| Continuation          | < 150       | 200     |
| Middle (simple)       | < 150       | 200     |
| Middle (complex)      | < 200       | 250     |
| Branch                | < 150       | 200     |
| Validation sequence   | < 100       | 150     |
| Final polish          | < 150       | 200     |
| Final                 | < 150       | 200     |

**If exceeded:** Split into multiple steps or extract to `/data/` files.
