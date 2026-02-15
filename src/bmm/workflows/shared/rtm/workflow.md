---
name: create-update-rtm
description: Generate or update the Requirements Traceability Matrix (RTM) by scanning all requirement documents and mapping bidirectional traceability. Enterprise track workflow.
track: enterprise
---

# Requirements Traceability Matrix (RTM) Workflow

**Goal:** Generate or update the RTM by scanning all requirement documents (StRS, SyRS, PRD/SRS, Epics/Stories) and creating bidirectional traceability links with gap analysis.

**Your Role:** You are a Requirements Traceability specialist. Your job is to systematically scan all requirement documents, extract requirement IDs, and map the traceability chain. This is a systematic, analytical task.

**Track:** This workflow is part of the **Enterprise** track.

---

## WORKFLOW ARCHITECTURE

This is a **single-pass analytical workflow** (not step-file based). It runs as a complete analysis task.

### Critical Rules

- 📖 **ALWAYS** load ALL requirement documents before analysis
- 🔗 **ALWAYS** trace in both directions (forward and backward)
- 🔍 **ALWAYS** identify orphan items (unlinked requirements, stories, tests)
- ⚠️ **NEVER** fabricate traceability links that don't exist in documents
- 💾 **ALWAYS** save the RTM to the output file

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from {project-root}/_bmad/bmm/config.yaml and resolve:

- `project_name`, `output_folder`, `planning_artifacts`, `user_name`
- `communication_language`, `document_output_language`
- `date` as system-generated current datetime

✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the configured `{communication_language}`.

### 2. Document Discovery

Search for all requirement documents:

**Required Documents (load if found):**
- StRS: `{planning_artifacts}/*strs*.md`
- SyRS: `{planning_artifacts}/*syrs*.md`
- PRD/SRS: `{planning_artifacts}/*prd*.md`
- Epics & Stories: `{planning_artifacts}/*epic*.md`

**Optional Documents:**
- Test documents: `{implementation_artifacts}/tests/**`
- Story files: `{implementation_artifacts}/*story*.md`

**Report to user what was found and what's missing.**

### 3. Check for Existing RTM

Look for existing RTM: `{planning_artifacts}/rtm-{{project_name}}.md`
- If exists: Load and update (preserve change history)
- If not exists: Create new from template

---

## RTM GENERATION SEQUENCE

### Step 1: Extract All Requirement IDs

Scan each document and extract all requirement identifiers:

**From StRS:**
- Look for patterns: `BO-###`, `OP-###`, `UP-###`, `OS-###`, `BC-###`, `TC-###`, `RC-###`
- Or any consistent ID pattern in the document

**From SyRS:**
- Look for patterns: `SYS-###`, `SYS-FUNC-###`, `SYS-IF-###`, `SYS-PERF-###`
- Or any consistent ID pattern in the document

**From PRD/SRS:**
- Look for patterns: `FR-###`, `FR#`, `NFR-###`
- Look for Enterprise format: `FR-[AREA]-###`, `NFR-[AREA]-###`
- Or any consistent ID pattern in the document

**From Epics/Stories:**
- Look for Epic numbers: `Epic N`, `Story N.M`
- Look for acceptance criteria patterns

### Step 2: Map Forward Traceability

For each requirement at each level, find its downstream references:

**StRS → SyRS:** Match by content similarity, explicit references, or source fields
**SyRS → PRD:** Match by content similarity, explicit references, or source fields
**PRD → Stories:** Match by FR references in stories, acceptance criteria alignment
**Stories → Tests:** Match by test descriptions, acceptance criteria references

### Step 3: Map Backward Traceability

Verify backward links exist:
- Each test traces to a story
- Each story traces to a PRD requirement
- Each PRD requirement traces to SyRS (if SyRS exists)
- Each SyRS requirement traces to StRS (if StRS exists)

### Step 4: Identify Orphans and Gaps

**Orphan Requirements:** Requirements with no downstream trace
- These represent features that will NOT be implemented unless addressed

**Orphan Stories:** Stories with no upstream requirement trace
- These represent scope creep or undocumented requirements

**Orphan Tests:** Tests with no story or requirement trace
- These represent untraceable testing effort

**Coverage Gaps:** Downstream levels with missing upstream links
- These represent broken traceability chains

### Step 5: Generate Coverage Statistics

Calculate:
- Forward traceability coverage percentage per level
- Total requirements per status (proposed, approved, implemented, verified)
- Orphan count per category

### Step 6: Generate RTM Document

Create or update the RTM document at: `{planning_artifacts}/rtm-{{project_name}}.md`

Use the template from: `{project-root}/_bmad/bmm/workflows/shared/templates/rtm-template.md`

Fill in all tables with extracted data.

### Step 7: Present Results

**Report to user:**

"**RTM Analysis Complete for {{project_name}}**

**Documents Scanned:**
- StRS: [found/not found] - [X requirements extracted]
- SyRS: [found/not found] - [X requirements extracted]
- PRD/SRS: [found/not found] - [X requirements extracted]
- Epics/Stories: [found/not found] - [X stories extracted]

**Traceability Coverage:**
- StRS → SyRS: [X%]
- SyRS → PRD: [X%]
- PRD → Stories: [X%]
- Stories → Tests: [X%]

**Issues Found:**
- Orphan requirements: [count]
- Orphan stories: [count]
- Orphan tests: [count]

**RTM saved to:** `{planning_artifacts}/rtm-{{project_name}}.md`

**Recommendations:** [List any actions needed to improve traceability]"

---

## SUCCESS METRICS:

✅ All available requirement documents discovered and scanned
✅ Requirement IDs extracted from all documents
✅ Forward traceability mapped (StRS→SyRS→PRD→Stories→Tests)
✅ Backward traceability mapped (Tests→Stories→PRD→SyRS→StRS)
✅ Orphan items identified with clear actions needed
✅ Coverage statistics calculated accurately
✅ RTM document generated/updated with all data
✅ Clear summary presented to user

## FAILURE MODES:

❌ Not scanning all available documents
❌ Fabricating traceability links that don't exist
❌ Missing orphan identification
❌ Not providing actionable recommendations
❌ Not preserving change history when updating existing RTM
