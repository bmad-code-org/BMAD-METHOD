# PRD Workflow Validation Checklist

**Purpose**: Validate PRD workflow outputs are complete, consistent, and ready for next phase.

**Scope**: Levels 2-4 software projects

**Expected Outputs**: PRD.md, epics.md, updated bmm-workflow-status.md

---

## 1. Output Files Exist

- [ ] PRD.md created in output folder
- [ ] epics.md created in output folder (separate file)
- [ ] bmm-workflow-status.md updated
- [ ] No unfilled {{template_variables}}

---

## 2. PRD.md Core Quality

### Requirements Coverage

- [ ] Functional requirements describe WHAT capabilities (not HOW to implement)
- [ ] Each FR has unique identifier (FR001, FR002, etc.)
- [ ] Non-functional requirements (if any) have business justification
- [ ] Requirements are testable and verifiable

### User Journeys

- [ ] User journeys reference specific FR numbers
- [ ] Journeys show complete user paths through system
- [ ] Success outcomes are clear

### Strategic Focus

- [ ] PRD focuses on WHAT and WHY (not technical HOW)
- [ ] No specific technology choices in PRD (those belong in technical-decisions.md)
- [ ] Goals are outcome-focused, not implementation-focused

---

## 3. epics.md Story Quality

### Story Format

- [ ] All stories follow user story format: "As a [role], I want [capability], so that [benefit]"
- [ ] Each story has numbered acceptance criteria
- [ ] Prerequisites/dependencies explicitly stated

### Story Sequencing (CRITICAL)

- [ ] **Epic 1 establishes foundation** (infrastructure, initial deployable functionality)
  - Exception noted if adding to existing app
- [ ] **Vertical slices**: Each story delivers complete, testable functionality (not horizontal layers)
- [ ] **No forward dependencies**: No story depends on work from a LATER story or epic
- [ ] Stories are sequentially ordered within each epic
- [ ] Each story leaves system in working state

### Coverage

- [ ] All FRs from PRD.md are covered by stories in epics.md
- [ ] Epic list in PRD.md matches epics in epics.md (titles and count)

---

## 4. Cross-Document Consistency

- [ ] Epic titles consistent between PRD.md and epics.md
- [ ] FR references in user journeys exist in requirements section
- [ ] Terminology consistent across documents
- [ ] No contradictions between PRD and epics

---

## 5. Readiness for Next Phase

**Adapt based on project level from bmm-workflow-status.md:**

### If Level 2:

- [ ] PRD provides sufficient context for tech-spec workflow (lightweight solutioning)
- [ ] Epic structure supports 5-15 story implementation scope

### If Level 3-4:

- [ ] PRD provides sufficient context for create-architecture workflow
- [ ] Epic structure supports phased delivery approach
- [ ] Clear value delivery path through epic sequence

---

## 6. Critical Failures (Auto-Fail)

- [ ] ❌ **No epics.md file** (two-file output is required)
- [ ] ❌ **Epic 1 doesn't establish foundation** (violates core principle)
- [ ] ❌ **Stories have forward dependencies** (would break sequential implementation)
- [ ] ❌ **Stories not vertically sliced** (horizontal layers block value delivery)
- [ ] ❌ **Technical decisions in PRD** (should be in technical-decisions.md)
- [ ] ❌ **Epics don't cover all FRs** (orphaned requirements)
- [ ] ❌ **User journeys don't reference FR numbers** (missing traceability)

---

## Validation Notes

**Document any findings:**

- Strengths:
- Issues to address:
- Recommended actions:

**Ready for next phase?** [Yes / No - explain]

---

_Adapt this checklist based on actual outputs. Not all sections may apply to every project._
