---
name: 'step-09-review-complete'
description: 'Final review against ISO 29148 Clause 8, cross-section consistency check, traceability verification, completeness assessment, and workflow completion'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/3-solutioning/create-syrs'

# File References
thisStepFile: './step-09-review-complete.md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{planning_artifacts}/syrs-{{project_name}}.md'
checklistFile: '{workflow_path}/checklist.md'

# Task References
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Step 9: Final Review & Completion

## STEP GOAL:

Perform a systematic final review of the complete SyRS against ISO 29148 Clause 8 requirements, check cross-section consistency, verify traceability to StRS and PRD, assess completeness, populate traceability matrices, and complete the workflow.

## MANDATORY EXECUTION RULES (READ FIRST):

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Role Reinforcement:

- ✅ You are a System Architecture and Requirements Engineering specialist
- ✅ If you already have been given communication or persona patterns, continue to use those while playing this new role
- ✅ We engage in collaborative dialogue, not command-response
- ✅ You bring ISO 29148 compliance review and quality assurance expertise
- ✅ User brings final approval authority and domain validation

### Step-Specific Rules:

- 🎯 Focus on comprehensive review, traceability completion, and workflow finalization
- 🚫 FORBIDDEN to skip any review checks
- 💬 Present review results transparently including any issues found
- 🚪 This is the FINAL step - ensure the document is complete before approval

## EXECUTION PROTOCOLS:

- 🎯 Load and apply the checklist systematically
- ✅ Present review findings with clear pass/fail status
- 📖 Update frontmatter to final state upon completion
- 🚫 THIS STEP CONTAINS THE FINAL REVIEW - handle with the R/F/A menu

## CONTEXT BOUNDARIES:

- Complete SyRS document with all sections populated
- All input documents still available for traceability verification
- Checklist available for systematic review
- Focus on review, traceability completion, and final approval

## FINAL REVIEW SEQUENCE:

### 1. Load Checklist

Read the checklist from `{checklistFile}` to guide the systematic review.

### 2. Build Traceability Matrices (Section 6)

Before the review, complete the traceability section:

#### Traceability to StRS (Section 6.1)

If StRS was available, create the traceability matrix:

```markdown
### 6.1 Traceability to StRS

| StRS Requirement | System Requirements | Coverage |
|-----------------|-------------------|----------|
| [StRS-001] | SYS-FUNC-001, SYS-FUNC-002 | Full |
| [StRS-002] | SYS-PERF-001, SYS-SEC-001 | Full |
| [StRS-003] | SYS-IF-001 | Partial - [note what's missing] |
...

**StRS Coverage Summary:**
- StRS requirements traced: {{count}}/{{total}}
- Fully covered: {{count}}
- Partially covered: {{count}}
- Not covered: {{count}} [list with justification]
```

If StRS was not available:
```markdown
### 6.1 Traceability to StRS

StRS was not available during SyRS creation. Traceability to stakeholder requirements should be established when the StRS is created or provided. System requirements in this document are derived from the PRD and collaborative engineering analysis.
```

#### Traceability to PRD (Section 6.2)

Create the PRD traceability matrix:

```markdown
### 6.2 Traceability to PRD

| PRD Requirement | System Requirements | Coverage |
|----------------|-------------------|----------|
| PRD-FR-001 | SYS-FUNC-001, SYS-FUNC-002, SYS-FUNC-003 | Full |
| PRD-FR-002 | SYS-FUNC-004 | Full |
| PRD-NFR-001 | SYS-PERF-001, SYS-PERF-002 | Full |
...

**PRD Coverage Summary:**
- PRD FRs traced: {{count}}/{{total}}
- PRD NFRs traced: {{count}}/{{total}}
- Fully covered: {{count}}
- Partially covered: {{count}}
- Not covered: {{count}} [list with justification]
```

### 3. Build Requirements Index (Appendix B)

Create a complete index of all requirements in the document:

```markdown
### Appendix B: Requirements Index

| Req ID | Section | Category | Priority | V&V Method |
|--------|---------|----------|----------|------------|
| SYS-FUNC-001 | 3.1.1 | Functional | Critical | Test |
| SYS-FUNC-002 | 3.1.1 | Functional | High | Test |
| SYS-IF-001 | 3.2.1 | User Interface | High | Demonstration |
...

**Requirements Summary:**
- Total requirements: {{total}}
- By category: Functional ({{count}}), Interface ({{count}}), Performance ({{count}}), Usability ({{count}}), Security ({{count}}), Operations ({{count}}), Modes ({{count}}), Physical ({{count}}), Environment ({{count}}), Info Mgmt ({{count}}), Policy ({{count}}), Lifecycle ({{count}}), Constraints ({{count}})
- By priority: Critical ({{count}}), High ({{count}}), Medium ({{count}}), Low ({{count}})
```

### 4. Systematic ISO 29148 Clause 8 Review

Using the checklist, review each section:

**Section 1 - Introduction:**
- [ ] System purpose clearly stated
- [ ] System scope and boundaries defined
- [ ] System context with external entities
- [ ] System functions listed
- [ ] User characteristics defined
- [ ] Glossary present and complete

**Section 2 - References:**
- [ ] ISO 29148 referenced
- [ ] All input documents listed
- [ ] All referenced standards included

**Section 3 - System Requirements:**
- [ ] 3.1 Functional requirements complete with SYS-FUNC-### format
- [ ] 3.2 Interface requirements complete with SYS-IF-### format
- [ ] 3.3 Performance requirements with measurable targets
- [ ] 3.4 Usability requirements specified
- [ ] 3.5 Security requirements at system level
- [ ] 3.6 System operations defined
- [ ] 3.7 System modes and states with transitions
- [ ] 3.8 Physical characteristics (or N/A)
- [ ] 3.9 Environment conditions specified
- [ ] 3.10 Information management defined
- [ ] 3.11 Policies and regulations documented
- [ ] 3.12 Lifecycle sustainability addressed
- [ ] 3.13 Design constraints documented

**Section 4 - Verification:**
- [ ] Every requirement has a verification method
- [ ] Verification summary table is complete
- [ ] TEA module integration documented

**Section 5 - Assumptions and Dependencies:**
- [ ] Assumptions documented
- [ ] Dependencies listed
- [ ] Risk implications noted

**Section 6 - Traceability:**
- [ ] StRS traceability matrix (or noted as unavailable)
- [ ] PRD traceability matrix
- [ ] No orphan requirements
- [ ] No coverage gaps

### 5. Cross-Section Consistency Check

Verify consistency across all sections:

- No conflicting requirements between sections
- Terminology consistent throughout
- Identifier numbering sequential and gap-free
- All cross-references between sections valid
- Performance requirements align with functional requirements
- Security requirements align with interface requirements
- Operational requirements align with system modes and states
- Constraints consistent with architectural decisions

### 6. Requirement Quality Spot Check

Select a representative sample of requirements (at least 3 from each category) and verify the 9 quality criteria:

1. **Necessary** - Essential for system success
2. **Appropriate** - Correct level of abstraction
3. **Unambiguous** - Single interpretation
4. **Complete** - Fully stated
5. **Singular** - Atomic (one thing per requirement)
6. **Feasible** - Technically achievable
7. **Verifiable** - Can be verified
8. **Correct** - Accurately represents need
9. **Conforming** - Follows SyRS format

### 7. Compile Review Results

Prepare the review findings:

```markdown
## SyRS Review Results

### ISO 29148 Clause 8 Compliance
**Status:** [COMPLIANT / PARTIALLY COMPLIANT / NON-COMPLIANT]

**Section Compliance:**
| Section | Status | Notes |
|---------|--------|-------|
| 1. Introduction | [Pass/Fail] | [notes] |
| 2. References | [Pass/Fail] | [notes] |
| 3.1 Functional | [Pass/Fail] | [notes] |
| 3.2 Interfaces | [Pass/Fail] | [notes] |
| 3.3 Performance | [Pass/Fail] | [notes] |
| 3.4 Usability | [Pass/Fail] | [notes] |
| 3.5 Security | [Pass/Fail] | [notes] |
| 3.6 Operations | [Pass/Fail] | [notes] |
| 3.7 Modes | [Pass/Fail] | [notes] |
| 3.8 Physical | [Pass/Fail] | [notes] |
| 3.9 Environment | [Pass/Fail] | [notes] |
| 3.10 Info Mgmt | [Pass/Fail] | [notes] |
| 3.11 Policy | [Pass/Fail] | [notes] |
| 3.12 Lifecycle | [Pass/Fail] | [notes] |
| 3.13 Constraints | [Pass/Fail] | [notes] |
| 4. Verification | [Pass/Fail] | [notes] |
| 5. Assumptions | [Pass/Fail] | [notes] |
| 6. Traceability | [Pass/Fail] | [notes] |

### Cross-Section Consistency
**Status:** [CONSISTENT / ISSUES FOUND]
[Details of any consistency issues]

### Traceability Assessment
- StRS coverage: {{percentage}}%
- PRD coverage: {{percentage}}%
- Orphan requirements: {{count}}

### Requirement Quality Assessment
- Sample size: {{count}} requirements reviewed
- Quality criteria pass rate: {{percentage}}%
- Issues found: [list any quality issues]

### Overall Assessment
**Total requirements:** {{count}}
**Verified (V&V assigned):** {{count}} (must be 100%)
**Traced (to StRS/PRD):** {{count}}

### Issues Found
**Critical (must fix):** [list or "None"]
**Minor (can address later):** [list or "None"]
**Recommendations:** [list or "None"]
```

### 8. Present Review Results and Menu

Present the complete review findings to the user:

"I've completed a comprehensive review of the System Requirements Specification.

**Review Summary:**
[Show key findings from step 7]

**What would you like to do?**
[R] Review - Address issues found and re-review specific sections
[F] Finalize - Accept the SyRS and finalize the document (minor issues to be addressed in next baseline)
[A] Approve - Formally approve the SyRS as the current baseline"

### 9. Handle Menu Selection

#### If 'R' (Review):

- Ask user which issues they want to address
- For each issue, collaborate to resolve it
- Update the relevant section in the output document
- After all issues addressed, re-run the review checks on affected sections
- Return to R/F/A menu

#### If 'F' (Finalize):

- Write all remaining content to the document (traceability matrices, requirements index, review results)
- Update frontmatter:
  ```yaml
  stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  status: 'final'
  completedAt: '{{current_date}}'
  ```
- Proceed to completion summary (step 10 below)

#### If 'A' (Approve):

- Write all remaining content to the document
- Update frontmatter:
  ```yaml
  stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  status: 'approved'
  baseline_version: '1.0'
  approvedAt: '{{current_date}}'
  approvedBy: '{{user_name}}'
  ```
- Proceed to completion summary (step 10 below)

### 10. Workflow Completion

Congratulate the user on completing the SyRS:

"Congratulations {{user_name}}! We've completed the System Requirements Specification for {{project_name}}.

**Document:** `{outputFile}`
**Status:** [Finalized / Approved as Baseline 1.0]
**Total System Requirements:** {{count}}
**ISO 29148 Clause 8 Compliance:** [COMPLIANT / status]

**What we accomplished together:**
- Defined the system context and boundaries
- Transformed {{prd_fr_count}} PRD requirements into {{sys_func_count}} system functional requirements
- Defined {{if_count}} interface requirements
- Specified {{quality_count}} quality requirements with measurable targets
- Documented {{ops_count}} operational requirements including system modes and states
- Established {{constraint_count}} constraints and lifecycle requirements
- Created a verification plan covering 100% of requirements
- Built traceability matrices to StRS and PRD

**Suggested Next Steps:**
1. **RTM Update** - Update the Requirements Traceability Matrix with the SyRS baseline
2. **Epics Creation** - Run the Create Epics and Stories workflow to break down system requirements into implementable stories
3. **Architecture Review** - Review and update the Architecture document for alignment with the SyRS
4. **Verification Execution** - Begin planning verification activities per the verification summary table"

SyRS complete. Read fully and follow: `_bmad/core/tasks/help.md` with argument `Create SyRS`.

Upon Completion of task output: offer to answer any questions about the System Requirements Specification.

## SUCCESS METRICS:

✅ Traceability matrices complete for both StRS and PRD
✅ Requirements index complete with all requirements listed
✅ Systematic ISO 29148 Clause 8 review performed using checklist
✅ Cross-section consistency verified
✅ Requirement quality spot check performed
✅ Review results clearly presented with pass/fail status
✅ R/F/A menu presented and handled correctly
✅ All content written to document upon finalization/approval
✅ Frontmatter updated to final/approved status
✅ User provided with clear next steps

## FAILURE MODES:

❌ Skipping the systematic review (just rubber-stamping)
❌ Not building traceability matrices
❌ Not identifying cross-section inconsistencies
❌ Not performing requirement quality spot check
❌ Approving document with critical issues unresolved
❌ Not updating frontmatter to final status
❌ Not providing next step guidance

❌ **CRITICAL**: Reading only partial step file - leads to incomplete understanding and poor decisions
❌ **CRITICAL**: Making decisions without complete understanding of step requirements and protocols

## WORKFLOW COMPLETE:

This is the final step of the SyRS workflow. The user now has a complete, reviewed System Requirements Specification that is:

- ISO 29148 Clause 8 compliant
- Traceable to StRS and PRD
- Verified with methods assigned to every requirement
- Ready for use in downstream engineering activities (epics, architecture review, verification execution)
