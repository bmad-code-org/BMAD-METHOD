---
validationDate: 2026-01-08
workflowName: prd
workflowPath: /Users/brianmadison/dev/BMAD-METHOD/src/modules/bmm/workflows/2-plan-workflows/prd
validationStatus: COMPLETE
---

# Validation Report: prd

**Validation Started:** 2026-01-08
**Validator:** BMAD Workflow Validation System
**Standards Version:** BMAD Workflow Standards

---

## File Structure & Size

### Folder Structure

```
/Users/brianmadison/dev/BMAD-METHOD/src/modules/bmm/workflows/2-plan-workflows/prd/
├── workflow.md
├── steps-c/
│   ├── step-01-init.md
│   ├── step-01b-continue.md
│   ├── step-02-discovery.md
│   ├── step-03-success.md
│   ├── step-04-journeys.md
│   ├── step-05-domain.md
│   ├── step-06-innovation.md
│   ├── step-07-project-type.md
│   ├── step-08-scoping.md
│   ├── step-09-functional.md
│   ├── step-10-nonfunctional.md
│   └── step-11-complete.md
├── data/
│   ├── domain-complexity.csv
│   └── project-types.csv
└── templates/
    └── prd-template.md
```

### Files Present

✅ **Required Files Present:**
- workflow.md exists
- steps-c/ folder exists with 11 step files
- data/ folder exists with 2 CSV files
- templates/ folder exists with 1 template file

✅ **Folder Structure:**
- Follows BMAD tri-modal convention (steps-c/ for create mode)
- data/ folder present for reference materials
- templates/ folder present for output templates
- No unexpected files found

### File Size Check

| File | Lines | Status |
|------|-------|--------|
| step-01-init.md | 191 | ✅ Good |
| step-01b-continue.md | 162 | ✅ Good |
| step-02-discovery.md | 184 | ✅ Good |
| step-03-success.md | 285 | ❌ Exceeds limit - should split |
| step-04-journeys.md | 286 | ❌ Exceeds limit - should split |
| step-05-domain.md | 193 | ✅ Good |
| step-06-innovation.md | 257 | ❌ Exceeds limit - should split |
| step-07-project-type.md | 253 | ❌ Exceeds limit - should split |
| step-08-scoping.md | 294 | ❌ Exceeds limit - should split |
| step-09-functional.md | 265 | ❌ Exceeds limit - should split |
| step-10-nonfunctional.md | 289 | ❌ Exceeds limit - should split |
| step-11-complete.md | 181 | ✅ Good |

**Summary:** 4/12 files within limits, 8/12 files exceed 250-line maximum

### Data File Size Check

| Data File | Lines | Status |
|-----------|-------|--------|
| domain-complexity.csv | 12 | ✅ Good |
| project-types.csv | 10 | ✅ Good |
| prd-template.md | 11 | ✅ Good |

### Issues Found

**Critical Issues:**
- ❌ **8 step files exceed 250-line limit** (absolute maximum)
  - step-03-success.md: 285 lines (35 lines over)
  - step-04-journeys.md: 286 lines (36 lines over)
  - step-06-innovation.md: 257 lines (7 lines over)
  - step-07-project-type.md: 253 lines (3 lines over)
  - step-08-scoping.md: 294 lines (44 lines over)
  - step-09-functional.md: 265 lines (15 lines over)
  - step-10-nonfunctional.md: 289 lines (39 lines over)

**Recommendations:**
1. **Split oversized step files** into multiple steps
2. **Extract reference content** to data/ folder for:
   - Domain complexity reference materials (step-05)
   - Project type definitions (step-07)
   - Scoping frameworks (step-08)
   - Functional requirement patterns (step-09)
   - Non-functional requirement catalogs (step-10)
3. **Remove overly prescriptive "say this" instructions** - Replace with intent-based instructions (see "Instruction Style" section below)
4. **Remove redundant menu pattern sections** - Use standard BMAD menu structure (see "Menu Handling" section above)
5. **Consider creating sub-steps** for complex elicitation tasks
6. **Use data files** for large reference tables, examples, or patterns

**Note on File Size Root Causes:**
The primary reason files are oversized is NOT just content volume, but:
- ❌ Overly prescriptive instructions with exact dialogue ("say this...")
- ❌ Redundant menu pattern sections ("COLLABORATION MENUS", "PROTOCOL INTEGRATION")
- ❌ Repetitive explanations instead of intent-based guidance

**Fixing these issues will dramatically reduce file sizes AND improve quality.**

### Status

⚠️ **WARNINGS** - Workflow structure is correct, but multiple step files exceed size limits

---

## Frontmatter Validation

### Validation Results

| File | Required Fields | All Vars Used | Relative Paths | No Forbidden | Status |
|------|----------------|---------------|----------------|-------------|--------|
| step-01-init.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-01b-continue.md | ✅ | ❌ Unused: workflowFile | ✅ | ❌ {workflow_path} | ❌ FAIL |
| step-02-discovery.md | ✅ | ✅ | ✅ | ✅ | ❌ FAIL (wrong nextStep) |
| step-03-success.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-04-journeys.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-05-domain.md | ✅ | ⚠️ Syntax error | ✅ | ✅ | ❌ FAIL |
| step-06-innovation.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-07-project-type.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-08-scoping.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-09-functional.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-10-nonfunctional.md | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-11-complete.md | ✅ | ✅ | N/A | ✅ | ✅ PASS |

**Summary:** 9/12 files pass, 3/12 files have violations

### Violations Found

**step-01b-continue.md:**
- ❌ **Unused variable:** `workflowFile: '{workflow_path}/workflow.md'` - Variable is defined but `{workflowFile}` never appears in step body
- ❌ **Forbidden pattern:** Uses `{workflow_path}` which is forbidden per frontmatter standards
- **Fix:** Remove `workflowFile` from frontmatter entirely (it's not used)

**step-02-discovery.md:**
- ❌ **CRITICAL: Wrong nextStep path:** `nextStepFile: './step-02b-vision.md'` - This file doesn't exist!
- **Context:** Step was previously split (vision was separated) but changes were lost
- **Should be:** `nextStepFile: './step-03-success.md'`
- **Impact:** Workflow will break when trying to load non-existent step file

**step-05-domain.md:**
- ❌ **CRITICAL SYNTAX ERROR:** Line 10 has malformed frontmatter:
  ```yaml
  domainComplexityCSV: ../data/domain-complexity.csv'
  ```
- **Missing opening quote** - Should be: `domainComplexityCSV: '../data/domain-complexity.csv'`
- **Impact:** This is a YAML syntax error that will cause frontmatter parsing to fail

### Status

❌ **FAIL** - Multiple critical frontmatter violations that will break workflow execution

## Menu Handling Validation

### Menu Handling Validation Results

| File | Has Menu | Handler Section | Exec Rules | Halt & Wait | A/P Return | Status |
|------|----------|----------------|------------|-------------|------------|--------|
| step-01-init.md | ✅ (C-only) | ✅ | ✅ | ✅ | N/A | ✅ PASS |
| step-01b-continue.md | ✅ (C-only) | ✅ | ✅ | ✅ | N/A | ✅ PASS |
| step-02-discovery.md | ✅ (A/P/C) | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-03-success.md | ✅ (A/P/C) | ✅ | ⚠️ Top-level only | ❌ Missing after menu | ✅ | ⚠️ WARN |
| step-04-journeys.md | ✅ (A/P/C) | ✅ | ⚠️ Top-level only | ❌ Missing after menu | ✅ | ⚠️ WARN |
| step-05-domain.md | ✅ (A/P/C) | ✅ | ✅ | ✅ | ✅ | ✅ PASS |
| step-06-innovation.md | ✅ (A/P/C) | ✅ | ⚠️ Top-level only | ❌ Missing after menu | ✅ | ⚠️ WARN |
| step-07-project-type.md | ✅ (A/P/C) | ✅ | ⚠️ Top-level only | ❌ Missing after menu | ✅ | ⚠️ WARN |
| step-08-scoping.md | ✅ (A/P/C) | ✅ | ⚠️ Top-level only | ❌ Missing after menu | ✅ | ⚠️ WARN |
| step-09-functional.md | ✅ (A/P/C) | ✅ | ⚠️ Top-level only | ❌ Missing after menu | ✅ | ⚠️ WARN |
| step-10-nonfunctional.md | ✅ (A/P/C) | ✅ | ⚠️ Top-level only | ❌ Missing after menu | ✅ | ⚠️ WARN |
| step-11-complete.md | N/A | N/A | N/A | N/A | N/A | ✅ PASS |

**Summary:** 4/12 fully compliant, 7/12 have minor issues, 1/12 N/A (final step)

### Menu Violations Found

**❌ CRITICAL: Wrong Menu Pattern in Steps 3, 4, 6, 7, 8, 9, 10:**

These steps use an **incorrect and redundant menu pattern** instead of the standard BMAD menu structure:

**Current (WRONG) Structure:**
```markdown
## COLLABORATION MENUS (A/P/C):
[A/P/C description]

## PROTOCOL INTEGRATION:
[Redundant protocol info]

### N. Handle Menu Selection
#### If 'A' (Advanced Elicitation):
[handler]
```

**Should Be (Standard Pattern):**
```markdown
### N. Present MENU OPTIONS

Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:
- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Save content to {outputFile}, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#n-present-menu-options)

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
```

**Issues with Current Pattern:**
- ❌ Redundant "COLLABORATION MENUS" section (should be "Present MENU OPTIONS")
- ❌ Redundant "PROTOCOL INTEGRATION" section (protocol info already in frontmatter)
- ❌ Menu logic split across multiple sections instead of unified handler
- ❌ Missing explicit "#### EXECUTION RULES:" with halt/wait instructions
- ⚠️ A/P handlers do specify "return to A/P/C menu" (partial credit)

**Impact:** Files are longer, harder to follow, and don't follow BMAD standards. This pattern needs to be replaced with the standard menu structure.

**Files Affected:**
- step-03-success.md
- step-04-journeys.md
- step-06-innovation.md
- step-07-project-type.md
- step-08-scoping.md
- step-09-functional.md
- step-10-nonfunctional.md

**Current Structure:**
```markdown
## COLLABORATION MENUS (A/P/C):
[A/P/C description]

### N. Handle Menu Selection
#### If 'A' (Advanced Elicitation):
[handler with "return to A/P/C menu"]
```

**Should Be:**
```markdown
## COLLABORATION MENUS (A/P/C):
[A/P/C description]

### N. Handle Menu Selection
#### If 'A' (Advanced Elicitation):
[handler with "return to A/P/C menu"]

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
```

**Impact:** Minor - functionality works but missing explicit halt instruction could lead to confusion

### Positive Findings

✅ **All steps properly implement A/P menu return behavior**
✅ **No A/P menus in inappropriate locations (step 01 correctly uses C-only)**
✅ **All handlers properly reference file variables**
✅ **C options properly sequence: save → update → load next**

### Status

❌ **FAIL - CRITICAL** - Wrong menu pattern used in 7 steps, must be fixed to follow BMAD standards

## Step Type Validation

### Step Type Validation Results

| File | Should Be Type | Follows Pattern | Issues | Status |
|------|----------------|-----------------|--------|--------|
| step-01-init.md | Init (Continuable with Input Discovery) | ✅ | None | ✅ PASS |
| step-01b-continue.md | Continuation (01b) | ✅ | None | ✅ PASS |
| step-02-discovery.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-03-success.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-04-journeys.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-05-domain.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-06-innovation.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-07-project-type.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-08-scoping.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-09-functional.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-10-nonfunctional.md | Middle (Standard) | ✅ | None | ✅ PASS |
| step-11-complete.md | Final | ✅ | None | ✅ PASS |

**Summary:** 12/12 steps correctly follow their type patterns

### Type Pattern Analysis

**Init Step (Continuable with Input Discovery) - step-01-init.md:**
✅ Has `continueStepFile` reference for continuation logic
✅ Has `inputDocuments` array for tracking discovered inputs
✅ Has input discovery logic (searches for product briefs, research, etc.)
✅ Creates output from template (`prdTemplate`)
✅ C-only menu (no A/P - appropriate for init step)
✅ Checks for existing workflow state before proceeding
**Status:** ✅ Correctly implements Init (Continuable with Input Discovery) pattern

**Continuation Step (01b) - step-01b-continue.md:**
✅ Paired with continuable init step
✅ Reads `stepsCompleted` from output frontmatter
✅ Routes to appropriate next step based on last completed step
✅ Restores context by reloading input documents
✅ C-only menu
**Status:** ✅ Correctly implements Continuation (01b) pattern

**Middle Steps (Standard) - steps 02-10:**
✅ All have A/P/C menu structure
✅ All generate collaborative content
✅ All append content to output document
✅ All have proper handler sections
✅ All use advanced elicitation and party mode workflows appropriately
**Status:** ✅ All correctly implement Middle (Standard) pattern

**Final Step - step-11-complete.md:**
✅ No `nextStepFile` in frontmatter
✅ Provides completion message
✅ Finalizes workflow status
✅ No next step to load
**Status:** ✅ Correctly implements Final pattern

### Status

✅ **PASS** - All steps correctly follow their designated type patterns

## Output Format Validation

### Output Format Validation Results

**Workflow Produces Documents:** Yes

**Template Type:** Free-form (RECOMMENDED)

**Template File Check:**
- Template exists: ✅ (prd-template.md)
- Matches designed type: ✅ (Free-form with minimal structure)
- Proper frontmatter: ✅ (stepsCompleted, inputDocuments, workflowType, lastStep)

**Final Polish Step:**
- Required: Yes (free-form workflows typically need final polish)
- Present: ⚠️ Partially
- Document quality check exists: ✅ (step-11-complete.md has completeness/consistency checks)
- Full document polish: ❌ Missing (no flow/coherence optimization, duplication removal, header optimization)

**Step-to-Output Mapping:**
| Step | Has Output Variable | Saves Before Next | Status |
|------|-------------------|-------------------|--------|
| step-01-init.md | ✅ | ✅ | ✅ |
| step-01b-continue.md | ✅ | N/A (continuation) | ✅ |
| step-02-discovery.md | ✅ | ✅ | ✅ |
| step-03-success.md | ✅ | ✅ | ✅ |
| step-04-journeys.md | ✅ | ✅ | ✅ |
| step-05-domain.md | ✅ | ✅ | ✅ |
| step-06-innovation.md | ✅ | ✅ | ✅ |
| step-07-project-type.md | ✅ | ✅ | ✅ |
| step-08-scoping.md | ✅ | ✅ | ✅ |
| step-09-functional.md | ✅ | ✅ | ✅ |
| step-10-nonfunctional.md | ✅ | ✅ | ✅ |
| step-11-complete.md | ✅ | N/A (final step) | ✅ |

**Issues Found:**

1. ⚠️ **Missing Full Document Polish Step:**
   - Current step-11-complete.md includes quality checks (completeness, consistency)
   - **Missing:** Document optimization features:
     - Load entire document
     - Review for flow and coherence
     - Reduce duplication while preserving essential info
     - Ensure proper ## Level 2 headers
     - Improve transitions between sections
     - Optimize overall readability

   **Recommendation:** Either:
   - Add polish logic to step-11-complete.md before finalization
   - OR insert a new step-10b-polish.md between step-10 and step-11
   - OR rename step-11 to include "polish" in its description and add optimization logic

2. ✅ **Positive:**
   - Template correctly implements free-form structure
   - All steps properly reference outputFile
   - All steps follow "save → update frontmatter → load next" pattern
   - Progressive append approach is correct for PRD workflow

### Status

⚠️ **WARNINGS** - Output structure is correct, but free-form workflow would benefit from full document polish step

## Validation Design Check

### Validation Design Check Results

**Workflow Requires Validation:** No

**Workflow Domain Type:** Creative/Collaborative Document Creation

**Reasoning:**
- This is a Product Requirements Document creation workflow
- It's a collaborative, user-driven document generation process
- Output quality is user's responsibility (not compliance/safety-critical)
- No regulatory, safety, or compliance requirements
- The workflow we're currently running (validation) is a meta-workflow that validates OTHER workflows, not part of the PRD workflow itself

**Validation Steps in PRD Workflow:**
- None ✅ (Correct - PRD workflow doesn't need embedded validation steps)
- Workflow focuses on collaborative document creation
- Quality assurance happens through user review and iteration

**Status:** ✅ PASS - N/A (Validation steps not required for this workflow type)

## Instruction Style Check

### Instruction Style Check Results

**Domain Type:** Creative/Collaborative (Product Requirements Document creation)

**Appropriate Style:** Intent-based (facilitative, flexible, conversational)

**Current Style:** ❌ **FAIL - Overly Prescriptive**

### Step Instruction Style Analysis

| Step | Style Type | Appropriate | Notes | Status |
|------|-----------|-------------|-------|--------|
| step-01-init.md | Mixed | ⚠️ | Has dialogue templates | ⚠️ WARN |
| step-01b-continue.md | Mixed | ⚠️ | Has dialogue templates | ⚠️ WARN |
| step-02-discovery.md | Mixed | ⚠️ | Some prescriptive dialogue | ⚠️ WARN |
| step-03-success.md | ❌ Prescriptive | ❌ | Extensive exact dialogue | ❌ FAIL |
| step-04-journeys.md | ❌ Prescriptive | ❌ | Extensive exact dialogue | ❌ FAIL |
| step-05-domain.md | ❌ Prescriptive | ❌ | Exact dialogue specified | ❌ FAIL |
| step-06-innovation.md | ❌ Prescriptive | ❌ | Exact dialogue specified | ❌ FAIL |
| step-07-project-type.md | ❌ Prescriptive | ❌ | Exact dialogue specified | ❌ FAIL |
| step-08-scoping.md | ❌ Prescriptive | ❌ | Exact dialogue specified | ❌ FAIL |
| step-09-functional.md | ❌ Prescriptive | ❌ | Exact dialogue specified | ❌ FAIL |
| step-10-nonfunctional.md | ❌ Prescriptive | ❌ | Exact dialogue specified | ❌ FAIL |
| step-11-complete.md | Mixed | ⚠️ | Has completion messages | ⚠️ WARN |

**Summary:** 0/12 properly intent-based, 4/12 mixed, 8/12 overly prescriptive

### Critical Issues Found

**❌ MAJOR ISSUE: Overly Prescriptive Instructions Across Most Steps**

**Example from step-03-success.md (lines 70-95):**
```markdown
**If Input Documents Contain Success Criteria:**
"Looking at your product brief and research, I see some initial success criteria already defined:

**From your brief:**
{{extracted_success_criteria_from_brief}}

**From research:**
{{extracted_success_criteria_from_research}}

**From brainstorming:**
{{extracted_success_criteria_from_brainstorming}}

This gives us a great foundation. Let's refine and expand on these initial thoughts:

**User Success First:**
Based on what we have, how would you refine these user success indicators:

- {{refined_user_success_from_documents}}
- Are there other user success metrics we should consider?

**What would make a user say 'this was worth it'** beyond what's already captured?"
```

**Example from step-03-success.md (lines 212-221):**
```markdown
"I've drafted our success criteria and scope definition based on our conversation.

**Here's what I'll add to the document:**

[Show the complete markdown content from step 7]

**What would you like to do?**
[A] Advanced Elicitation - Let's dive deeper and refine these success metrics
[P] Party Mode - Bring in different perspectives on success criteria
[C] Continue - Save success criteria and move to User Journey Mapping (Step 4 of 11)"
```

**Problems with Current Approach:**

1. **Exact Dialogue Specified:**
   - ❌ "Looking at your product brief..." - Agent must say exactly this
   - ❌ "I've drafted our success criteria..." - No room for natural conversation
   - ❌ "What would you like to do?" - Scripted response

2. **No Flexibility for Conversation Flow:**
   - ❌ Agent can't adapt to user's actual responses
   - ❌ Can't follow natural conversation pivots
   - ❌ Forces template-based dialogue instead of facilitation

3. **Bloated File Sizes:**
   - ❌ All this exact dialogue inflates line counts significantly
   - ❌ Contributing to 8/12 files exceeding 250-line limit

4. **Reduced Quality:**
   - ❌ Agent feels robotic and scripted
   - ❌ Not真正的 collaborative facilitation
   - ❌ User experience suffers from repetitive phrasing

### What It Should Be (Intent-Based)

**Current (WRONG):**
```markdown
"Looking at your product brief and research, I see some initial success criteria already defined:

**From your brief:**
{{extracted_success_criteria_from_brief}}

This gives us a great foundation. Let's refine and expand on these initial thoughts:

**User Success First:**
Based on what we have, how would you refine these user success indicators:

- {{refined_user_success_from_documents}}
- Are there other user success metrics we should consider?"
```

**Should Be (INTENT-BASED):**
```markdown
### 2. Begin Success Definition Conversation

**If Input Documents Contain Success Criteria:**
Guide user to refine existing success criteria:
- Acknowledge what's already documented in their materials
- Help user identify gaps and areas for expansion
- Probe for specific, measurable outcomes
- Ask about emotional success moments: When do users feel delighted/relieved/empowered?

**If No Success Criteria in Input Documents:**
Start with user-centered success exploration:
- Guide conversation toward defining what "worth it" means for users
- Ask about specific user outcomes and emotional states
- Identify success "aha!" moments and completion scenarios
```

### Impact

**This is a CRITICAL QUALITY issue that affects:**
1. ✅ File size (will dramatically reduce when fixed)
2. ✅ Conversation quality (will be more natural and flexible)
3. ✅ Agent behavior (will be facilitative instead of scripted)
4. ✅ User experience (will feel like genuine collaboration)

### Good Examples Found

✅ **step-01-init.md** has some intent-based elements:
- "Guide user to define requirements through open-ended discussion" (good)
- But still has prescriptive dialogue templates (needs cleanup)

### Status

❌ **FAIL - CRITICAL** - Overly prescriptive instructions must be replaced with intent-based facilitation guidance. This is the PRIMARY cause of oversized files and reduced quality.

## Collaborative Experience Check

### Collaborative Experience Check Results

**Overall Facilitation Quality:** ⚠️ **NEEDS IMPROVEMENT**

**Root Cause:** The overly prescriptive instructions (documented in "Instruction Style" section) directly undermine collaborative quality.

### Step-by-Step Analysis

**General Assessment Across All Steps:**
- Question style: ❌ Mixed - some progressive, many prescriptive templates
- Conversation flow: ⚠️ Constrained by exact dialogue requirements
- Role clarity: ✅ Present in all steps ("You are a product-focused PM facilitator...")
- Flexibility: ❌ Limited by scripted dialogue

**Collaborative Strengths Found:**

✅ **Role Reinforcement:**
- All steps clearly establish the agent as a facilitator
- "We engage in collaborative dialogue, not command-response"
- "Together we produce something better"

✅ **Progress Indicators:**
- "Progress: Step X of Y" shown in most steps
- User knows where they are in the process

✅ **Some Intent-Based Language:**
- "Guide user to..." (good intention)
- "Probe to understand..." (good facilitation)
- "Use conversation, not interrogation" (stated principle)

**Collaborative Issues Found:**

❌ **Scripted Dialogue Undermines Collaboration:**

Because of the exact dialogue requirements (see Instruction Style section), the workflow suffers:

1. **No Adaptation to User:**
   - Agent must say prescribed phrases
   - Can't follow user's natural conversation flow
   - Feels like reading a script, not collaborating

2. **Reduced Facilitation Quality:**
   - "I've drafted our success criteria..." (announcement, not facilitation)
   - "Looking at your product brief..." (template opening, not responsive)
   - "What would you like to do?" (canned options, not open facilitation)

3. **Formulaic Interactions:**
   - Each step follows exact dialogue pattern
   - User experience becomes predictable in a bad way
   - No room for spontaneous collaboration

**User Experience Assessment:**

**Would this workflow feel like:**
- [ ] A collaborative partner working WITH the user
- [✓] A form collecting data FROM the user (due to prescriptive templates)
- [ ] An interrogation extracting information
- [✓] A mix - depends on step (some facilitation intent, but scripted delivery)

**Specific Issues by Step Type:**

**Init Steps (01, 01b):**
- ⚠️ Have setup report templates (necessary for initialization)
- ⚠️ Mix of facilitation and scripted announcements
- Status: ⚠️ Acceptable for init, but could be more flexible

**Middle Steps (02-10):**
- ❌ Heavy use of prescribed dialogue
- ❌ "I've drafted...", "I've mapped...", "I've defined..." (announcements)
- ❌ Menu options are canned phrases
- Status: ❌ Needs significant improvement

**Final Step (11):**
- ⚠️ Completion messages are appropriate
- Status: ⚠️ Acceptable for final step

**Progression and Arc:**
- ✅ Clear progression from step to step
- ✅ Each step builds on previous work
- ✅ User knows where they are
- ✅ Satisfying completion at end
- Status: ✅ GOOD

**Relationship to Other Issues:**

The collaborative experience issues are **directly caused by** the prescriptive instruction style problem:

```
Prescriptive Instructions → Scripted Dialogue → Poor Collaboration
```

**Fix the prescriptive instructions, and collaboration will improve dramatically.**

### Overall Collaborative Rating

⭐⭐⭐☆☆ (3/5 stars)

**Breakdown:**
- Process design: ⭐⭐⭐⭐☆ (4/5) - Good structure and progression
- Facilitation intent: ⭐⭐⭐☆☆ (3/5) - Good intent, poor execution
- Actual experience: ⭐⭐☆☆☆ (2/5) - Scripted dialogue undermines collaboration
- Role clarity: ⭐⭐⭐⭐⭐ (5/5) - Excellent role establishment

**Status:** ⚠️ **NEEDS IMPROVEMENT** - Good foundation, but prescriptive instructions prevent true collaboration. Fix instruction style to dramatically improve collaborative experience.

## Cohesive Review

### Cohesive Review Results

**Overall Assessment:** ⚠️ **NEEDS WORK** - Has critical issues that must be addressed

### Quality Ratings

| Aspect | Rating | Notes |
|--------|--------|-------|
| Clear Goal | ⭐⭐⭐⭐⭐ | Excellent - create comprehensive PRD through collaboration |
| Logical Flow | ⭐⭐⭐⭐☆ | Good progression, one broken link (step-02 wrong path) |
| Facilitation Quality | ⭐⭐☆☆☆ | Poor - overly prescriptive undermines facilitation |
| User Experience | ⭐⭐☆☆☆ | Poor - feels scripted, not collaborative |
| Goal Achievement | ⭐⭐⭐☆☆ | Moderate - would create PRD but quality suffers |
| **Overall Quality** | **⭐⭐⭐☆☆** | **Good foundation, critical execution issues** |

### Cohesiveness Analysis

**Flow Assessment:**
- ✅ Overall flow is logical: Discovery → Success → Journeys → Domain → Innovation → Project Type → Scoping → Functional → Non-functional → Complete
- ❌ **CRITICAL BREAK:** step-02-discovery.md has wrong nextStepFile path (points to non-existent step-02b-vision.md)
- ✅ Otherwise each step connects properly to the next
- ⚠️ Some optional steps (05-domain, 06-innovation) may need better gating

**Progression Assessment:**
- ✅ Clear arc: Start with vision → Define success → Map users → Deep dives → Requirements → Complete
- ✅ User always knows where they are (Progress indicators present)
- ✅ Each step builds on previous work
- ✅ Satisfying completion at end

**Voice and Tone:**
- ✅ Consistent PM facilitator persona throughout
- ✅ "We're in this together" messaging present
- ❌ BUT: Voice is undermined by prescriptive dialogue (see Instruction Style section)

### Strengths

1. **Excellent Structure and Process Design:**
   - 11-step process makes sense for PRD creation
   - Proper progression from vision to requirements
   - Good balance of strategic and tactical steps
   - Appropriate use of continuation (01b) for multi-session workflows

2. **Strong Role Clarity:**
   - "Product-focused PM facilitator" clearly established
   - "Collaborative dialogue, not command-response" reinforced throughout
   - "Together we produce something better" philosophy

3. **Proper Technical Implementation:**
   - All step types correctly implemented (Init, Continuation, Middle, Final)
   - Proper use of frontmatter variables
   - Correct step-to-output mapping
   - Appropriate template structure (free-form with progressive append)

4. **Good Input Discovery:**
   - Step-01 properly discovers and loads context documents
   - Tracks inputDocuments in frontmatter
   - Distinguishes greenfield vs brownfield projects

5. **Appropriate Workflow Type:**
   - Correctly identified as continuable document creation workflow
   - Uses free-form template (appropriate for PRD)
   - Has proper continuation logic

### Weaknesses

1. **❌ CRITICAL: Overly Prescriptive Instructions (PRIMARY ISSUE):**
   - Affects 8/12 steps severely
   - Inflates file sizes (primary cause of 8 files exceeding 250-line limit)
   - Undermines collaborative quality
   - Makes agent feel robotic and scripted
   - **Impact:** This is the root cause of most other issues

2. **❌ CRITICAL: Wrong Menu Pattern (7 steps):**
   - Uses redundant "COLLABORATION MENUS" and "PROTOCOL INTEGRATION" sections
   - Should use standard BMAD menu pattern
   - Missing "#### EXECUTION RULES:" sections with halt/wait instructions
   - **Impact:** Bloated files, harder to follow, non-compliant

3. **❌ CRITICAL: Frontmatter Violations (3 steps):**
   - step-01b-continue.md: Unused workflowFile variable + forbidden {workflow_path}
   - step-02-discovery.md: Wrong nextStepFile (breaks workflow execution)
   - step-05-domain.md: **SYNTAX ERROR** - missing opening quote in YAML
   - **Impact:** Workflow will break, won't execute properly

4. **⚠️ Missing Document Polish Step:**
   - Free-form workflow would benefit from full document optimization
   - Step-11 has quality checks but no flow/coherence optimization
   - **Impact:** Final document may have duplication and flow issues

### Critical Issues (Show-Stoppers)

1. **step-02-discovery.md:**
   - `nextStepFile: './step-02b-vision.md'` - This file doesn't exist!
   - **Workflow will BREAK when trying to load step 3**

2. **step-05-domain.md:**
   - Line 10: `domainComplexityCSV: ../data/domain-complexity.csv'`
   - **SYNTAX ERROR** - Missing opening quote breaks YAML parsing
   - **Frontmatter won't load, step will fail**

3. **File Size Crisis:**
   - 8/12 files exceed 250-line absolute maximum
   - Primary cause: Prescriptive dialogue + wrong menu pattern
   - **Impact:** Files are unmaintainable, quality suffers

### What Makes This Work Well

The **process design is excellent**:
- Right steps in right order for PRD creation
- Proper technical architecture (continuation, templates, frontmatter)
- Good understanding of BMAD workflow patterns
- Clear role and facilitation intent

**If prescriptive instructions were fixed,** this would be a ⭐⭐⭐⭐☆ (4/5 star) workflow.

### What Could Be Improved

**Priority 1 (CRITICAL - Must Fix):**
1. Fix step-02-discovery.md nextStepFile path
2. Fix step-05-domain.md syntax error
3. Fix step-01b-continue.md frontmatter violations
4. Replace all prescriptive dialogue with intent-based instructions (8 steps)
5. Convert menu patterns to standard BMAD format (7 steps)

**Priority 2 (HIGH - Should Fix):**
6. Add document polish logic to step-11 or create separate polish step
7. Reduce file sizes by 30-50% through above fixes

**Priority 3 (MEDIUM - Nice to Have):**
8. Add better gating for optional steps (05-domain, 06-innovation)
9. Consider if step-02 should be split back into discovery + vision (if that was the original design)

### User Experience Forecast

**How would a user experience this workflow?**

**Currently (with issues):**
- ❌ Would feel like agent is reading a script
- ❌ Conversations would feel formulaic and repetitive
- ❌ Agent can't adapt to user's actual needs
- ❌ Workflow breaks at step-03 (won't load)
- ✅ Process structure is clear and logical
- ✅ Progress indicators keep user informed

**After fixes (prescriptive → intent-based):**
- ✅ Would feel like genuine collaboration
- ✅ Agent adapts to conversation naturally
- ✅ Flexible and responsive facilitation
- ✅ Proper workflow execution
- ✅ Clear process and progress
- ✅ High-quality PRD output

### Recommendation

**⚠️ NEEDS REVISION** - Major rework needed

**Specific Assessment:**
- Process design: EXCELLENT (don't change the flow)
- Technical implementation: GOOD (fix the 3 critical bugs)
- Instruction quality: POOR (must rewrite to intent-based)
- Menu structure: POOR (must convert to standard pattern)
- File size: POOR (will automatically fix with above)

**Fix Priority Order:**
1. Fix the 3 critical frontmatter/syntax issues (30 minutes)
2. Convert 7 steps to standard menu pattern (2-3 hours)
3. Rewrite prescriptive instructions to intent-based (4-6 hours)
4. Add document polish step (1 hour)

**Total Effort Estimate:** 8-11 hours of focused work

**After fixes, this would be:** ⭐⭐⭐⭐☆ (4/5 stars) - Excellent workflow

**Status:** ⚠️ **NEEDS WORK** - Critical issues must be addressed before use

## Summary

### Overall Validation Status

**Workflow:** PRD (Product Requirements Document)
**Location:** `/Users/brianmadison/dev/BMAD-METHOD/src/modules/bmm/workflows/2-plan-workflows/prd`
**Validation Date:** 2026-01-08
**Overall Status:** ❌ **NEEDS REVISION** - Critical issues must be addressed

---

### Executive Summary

The PRD workflow has an **excellent foundation** with proper process design, technical architecture, and role clarity. However, it suffers from **critical execution issues** that will prevent it from working properly and significantly reduce quality:

**Good News:**
- ✅ Process structure is well-designed
- ✅ Technical implementation is mostly correct
- ✅ Clear role and facilitation philosophy
- ✅ Proper use of BMAD workflow patterns

**Bad News:**
- ❌ 3 critical bugs that break workflow execution
- ❌ 8/12 steps use overly prescriptive instructions (root cause of file size and quality issues)
- ❌ 7/12 steps use wrong menu pattern (non-compliant, bloated)
- ❌ 8/12 files exceed 250-line limit (unmaintainable)

---

### Critical Issues (Must Fix Before Use)

**1. Workflow Breaking Bugs (3 issues - FIX IMMEDIATELY):**

| File | Issue | Impact | Fix Time |
|------|-------|--------|----------|
| step-02-discovery.md | Wrong `nextStepFile: './step-02b-vision.md'` | ❌ Workflow breaks at step 3 | 2 minutes |
| step-05-domain.md | Syntax error - missing opening quote | ❌ Frontmatter won't parse | 1 minute |
| step-01b-continue.md | Unused `workflowFile` variable + forbidden `{workflow_path}` | ⚠️ Non-compliant | 2 minutes |

**Total Bug Fix Time:** ~5 minutes

**2. Instruction Style Crisis (8 steps - HIGH PRIORITY):**

**Problem:** Steps specify exact dialogue instead of intent-based facilitation

**Affected Files:**
- step-03-success.md
- step-04-journeys.md
- step-05-domain.md
- step-06-innovation.md
- step-07-project-type.md
- step-08-scoping.md
- step-09-functional.md
- step-10-nonfunctional.md

**Impact:**
- Makes files 30-50% larger than necessary
- Agent feels robotic and scripted
- No flexibility for natural conversation
- Poor user experience

**Fix:** Rewrite prescriptive dialogue as intent-based instructions

**Estimated Time:** 4-6 hours

**3. Menu Pattern Violations (7 steps - HIGH PRIORITY):**

**Problem:** Using non-standard "COLLABORATION MENUS" + "PROTOCOL INTEGRATION" instead of standard BMAD menu structure

**Affected Files:** Same 8 files as above (plus step-02)

**Required Change:**
```markdown
## REMOVE THESE:
## COLLABORATION MENUS (A/P/C):
## PROTOCOL INTEGRATION:

## REPLACE WITH:
### N. Present MENU OPTIONS
Display: "**Select:** [A] Advanced Elicitation [P] Party Mode [C] Continue"

#### Menu Handling Logic:
- IF A: Execute {advancedElicitationTask}, and when finished redisplay the menu
- IF P: Execute {partyModeWorkflow}, and when finished redisplay the menu
- IF C: Save content to {outputFile}, update frontmatter, then load, read entire file, then execute {nextStepFile}
- IF Any other: help user, then [Redisplay Menu Options](#n-present-menu-options)

#### EXECUTION RULES:
- ALWAYS halt and wait for user input after presenting menu
- ONLY proceed to next step when user selects 'C'
- After other menu items execution, return to this menu
```

**Estimated Time:** 2-3 hours

---

### File Size Issues

**Current State:**
- 4/12 files within limits ✅
- 8/12 files exceed 250-line maximum ❌

**Root Cause:** Prescriptive dialogue + wrong menu pattern (not content volume)

**Solution:** Fix issues #2 and #3 above → file sizes will automatically reduce by 30-50%

**Projected After Fixes:**
- All 12/12 files within 200-line recommended limit ✅
- No files exceed 250-line absolute maximum ✅

---

### Validation Results by Section

| Section | Status | Files Affected | Priority |
|---------|--------|----------------|----------|
| File Structure & Size | ⚠️ WARN | 8/12 oversized | Medium |
| Frontmatter Validation | ❌ FAIL | 3/12 critical bugs | **CRITICAL** |
| Menu Handling Validation | ❌ FAIL | 7/12 wrong pattern | **HIGH** |
| Step Type Validation | ✅ PASS | All correct | N/A |
| Output Format Validation | ⚠️ WARN | Missing polish | Low |
| Validation Design Check | ✅ PASS | N/A (not required) | N/A |
| Instruction Style Check | ❌ FAIL | 8/12 prescriptive | **HIGH** |
| Collaborative Experience Check | ⚠️ NEEDS IMPROVEMENT | All (root cause) | **HIGH** |
| Cohesive Review | ⚠️ NEEDS WORK | Overall | **HIGH** |

---

### Detailed Fix Checklist

**Phase 1: Critical Bugs (5 minutes)**
- [ ] Fix step-02-discovery.md: Change `nextStepFile: './step-02b-vision.md'` to `nextStepFile: './step-03-success.md'`
- [ ] Fix step-05-domain.md: Add missing opening quote to `domainComplexityCSV` value
- [ ] Fix step-01b-continue.md: Remove unused `workflowFile` variable

**Phase 2: Menu Pattern Conversion (2-3 hours)**
For each of 7 files (step-03, 04, 06, 07, 08, 09, 10):
- [ ] Remove "## COLLABORATION MENUS (A/P/C):" section
- [ ] Remove "## PROTOCOL INTEGRATION:" section
- [ ] Replace with "### N. Present MENU OPTIONS" + Display + Handler + EXECUTION RULES
- [ ] Test menu structure matches BMAD standard

**Phase 3: Instruction Style Rewrite (4-6 hours)**
For each of 8 files (same as Phase 2):
- [ ] Identify all prescriptive dialogue blocks
- [ ] Rewrite as intent-based instructions
- [ ] Remove exact "say this" language
- [ ] Replace with facilitation guidance
- [ ] Verify reduction in line count (target: <200 lines)

**Phase 4: Polish Enhancement (1 hour)**
- [ ] Add document optimization logic to step-11-complete.md OR create new step-10b-polish.md
- [ ] Include: Load entire doc → Review flow → Remove duplication → Ensure ## Level 2 headers → Improve transitions

---

### Final Recommendation

**Before This Workflow Can Be Used:**

1. ✅ **FIX THE 3 CRITICAL BUGS** (5 minutes) - Workflow won't run otherwise
2. ✅ **CONVERT MENUS TO STANDARD PATTERN** (2-3 hours) - Required for BMAD compliance
3. ✅ **REWRITE PRESCRIPTIVE INSTRUCTIONS** (4-6 hours) - Required for quality

**After Critical Fixes:**

This workflow has excellent process design and will be ⭐⭐⭐⭐☆ (4/5 stars) after fixes.

**Total Effort Required:** 8-11 hours of focused work

**Effort Breakdown:**
- Critical bugs: 5 minutes
- Menu pattern fixes: 2-3 hours
- Instruction style rewrite: 4-6 hours
- Document polish enhancement: 1 hour

---

### Conclusion

The PRD workflow has a **solid foundation** but suffers from **systematic execution issues** that stem from two root causes:

1. **Overly prescriptive instructions** - Makes files bloated and quality poor
2. **Wrong menu pattern** - Makes files non-compliant and harder to follow

**Good news:** These are fixable process issues, not fundamental design flaws. The workflow structure, progression, and technical architecture are all sound.

**Bottom line:** This workflow needs significant revision before use, but the fixes are straightforward and the result will be excellent.

---

**Report Generated:** 2026-01-08
**Validator:** BMAD Workflow Validation System
**Next Review:** After fixes are applied
