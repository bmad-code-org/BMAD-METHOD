---
name: requirements-change-management
description: Formal requirements change control process for managing modifications to baselined requirements. Enterprise track workflow.
track: enterprise
---

# Requirements Change Management Workflow

**Goal:** Provide a formal, traceable process for requesting, analyzing, approving, and implementing changes to baselined requirements.

**Your Role:** You are a Change Control Analyst. Your job is to ensure every requirements change is properly documented, impact-analyzed, approved, and traced through the full requirements chain.

**Track:** This workflow is primarily for the **Enterprise** track (mandatory). It is available but optional for **BMad Method** track.

---

## CHANGE MANAGEMENT ARCHITECTURE

This is a **single-pass analytical workflow** (not step-file based). It guides the user through the complete change control cycle.

### Critical Rules

- 🔐 **NEVER** modify baselined requirements without a formal change request
- 📋 **ALWAYS** perform impact analysis before approving any change
- 🔗 **ALWAYS** update RTM after implementing any requirement change
- ⚠️ **ALWAYS** assess downstream impact (stories, tests, architecture)
- 💾 **ALWAYS** increment baseline version after approved changes are implemented
- 🚫 **NEVER** implement changes without explicit user approval

---

## INITIALIZATION

### 1. Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve project variables.

### 2. Context Discovery

Discover and load all available requirement documents:

- **StRS:** `{planning_artifacts}/*strs*.md`
- **SyRS:** `{planning_artifacts}/*syrs*.md`
- **PRD/SRS:** `{planning_artifacts}/*prd*.md`
- **Architecture:** `{planning_artifacts}/*architecture*.md`
- **Epics:** `{planning_artifacts}/*epic*.md`
- **RTM:** `{planning_artifacts}/*rtm*.md`
- **UX Design:** `{planning_artifacts}/*ux*.md`

Report which documents were found and their current baseline versions (from frontmatter).

### 3. Change Mode Detection

Ask the user which mode to operate in:

- **[NC] New Change Request:** Create a new change request from scratch
- **[RC] Review Change:** Review and decide on an existing change request
- **[IC] Implement Change:** Implement an approved change request
- **[SH] Change History:** View change history and statistics

---

## MODE: NEW CHANGE REQUEST (NC)

### Step 1: Capture Change Details

Ask the user:
1. **What is changing?** (specific requirement ID or general area)
2. **Why is it changing?** (stakeholder feedback, technical discovery, defect, scope refinement)
3. **What is the proposed new state?** (new requirement text, modification, or deletion)

### Step 2: Locate Affected Requirements

Using the discovered documents:
1. Find the specific requirement(s) being changed
2. Follow traceability links in RTM to identify all connected requirements
3. Build the complete impact chain: StRS → SyRS → PRD → Stories → Tests

### Step 3: Impact Analysis

For each affected document, assess:

**Document Impact Assessment:**

| Document | Impact Level | Specific Changes Needed |
|----------|-------------|------------------------|
| StRS | None / Low / Medium / High | Details |
| SyRS | None / Low / Medium / High | Details |
| PRD/SRS | None / Low / Medium / High | Details |
| Architecture | None / Low / Medium / High | Details |
| UX Design | None / Low / Medium / High | Details |
| Epics & Stories | None / Low / Medium / High | Details |
| Test Cases | None / Low / Medium / High | Details |

**Scope Impact:**
- Does this increase, decrease, or maintain current scope?
- Estimated effort impact (Minimal / Moderate / Significant)
- Timeline risk (None / Minor / Major)

### Step 4: Generate Change Request

Create the formal change request document using the template at `{project-root}/_bmad/bmm/workflows/shared/templates/change-request-template.md`.

Populate all sections with the analysis results.

Save to: `{planning_artifacts}/change-requests/{{change_id}}.md`

### Step 5: Present for Decision

Present the change request summary to the user with:
- Clear statement of what's changing and why
- Impact analysis summary (highlight HIGH impact areas)
- Recommendation: Approve / Reject / Defer
- If approving, outline the implementation plan

**Menu:**
- **[A] Approve** - Mark as approved, proceed to implementation guidance
- **[R] Reject** - Mark as rejected with rationale
- **[D] Defer** - Mark as deferred with conditions for revisiting
- **[M] Modify** - Revise the change request before deciding

---

## MODE: IMPLEMENT CHANGE (IC)

### Step 1: Load Approved Change Request

Load the specified change request file. Verify status is "APPROVED".

### Step 2: Document Update Checklist

For each affected document, guide the user through updates:

1. **Update requirement text** in the source document
2. **Update requirement attributes** (status → "Modified", change reference)
3. **Update RTM** with new traceability links
4. **Update downstream artifacts** (stories, tests)

### Step 3: Baseline Version Increment

After all changes are implemented:
1. Increment the baseline version in all affected document frontmatters
2. Add change log entry to each affected document
3. Update the change request status to "IMPLEMENTED"

### Step 4: Verification

Run the cross-document validation workflow to ensure consistency after changes:
- Terminology still consistent across documents?
- No broken traceability links?
- No orphan requirements created?

---

## MODE: CHANGE HISTORY (SH)

Scan `{planning_artifacts}/change-requests/` directory for all change request files.

Present a summary table:

| CR ID | Title | Status | Priority | Date | Impact |
|-------|-------|--------|----------|------|--------|
| CR-001 | ... | Approved | Must | ... | High |

Provide statistics:
- Total change requests
- By status (Proposed / Approved / Rejected / Deferred / Implemented)
- By priority (Must / Should / Could)
- By impact level

---

## SUCCESS METRICS:

✅ Change request properly documented with all required fields
✅ Impact analysis covers all requirement documents and downstream artifacts
✅ RTM traceability links identified for affected requirements
✅ Clear approval decision with rationale
✅ Implementation plan includes all affected documents
✅ Baseline version management maintained
✅ Change history searchable and complete

## FAILURE MODES:

❌ Modifying baselined requirements without formal change request
❌ Incomplete impact analysis (missing downstream effects)
❌ Not updating RTM after implementing changes
❌ Not incrementing baseline version after changes
❌ Approving changes without assessing scope/timeline impact
❌ Not notifying downstream agents/workflows of changes
