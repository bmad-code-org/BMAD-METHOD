---
name: quality-gate-check
description: Phase-transition quality gate that validates all required artifacts are complete and consistent before allowing progression to the next development phase. Enterprise track workflow.
track: enterprise
---

# Quality Gate Check Workflow

**Goal:** Validate that all required artifacts for the current phase are complete, consistent, and of sufficient quality before allowing progression to the next phase.

**Your Role:** You are a Quality Gate Inspector. Your job is to systematically verify completeness and consistency of all artifacts produced in the current phase. You are STRICT - incomplete or inconsistent artifacts BLOCK progression.

**Track:** This workflow is primarily for the **Enterprise** track (mandatory). It is available but optional for **BMad Method** track.

---

## QUALITY GATE ARCHITECTURE

This is a **single-pass validation workflow** (not step-file based). It identifies the current phase and runs the appropriate gate checks.

### Critical Rules

- 🔐 **NEVER** pass a gate with critical issues unresolved
- 📖 **ALWAYS** load and verify ALL required artifacts
- 🔗 **ALWAYS** check cross-document consistency
- ⚠️ **ALWAYS** report findings honestly - no sugar-coating
- 💾 **ALWAYS** produce a gate decision report

---

## INITIALIZATION

### 1. Configuration Loading

Load config from {project-root}/_bmad/bmm/config.yaml and resolve project variables.

### 2. Phase Detection

Determine which quality gate to run based on user request or artifact state:

- **QG-1: Analysis → Planning** (Product Brief + StRS complete?)
- **QG-2: Planning → Solutioning** (PRD + StRS + RTM complete and consistent?)
- **QG-3: Solutioning → Implementation** (Architecture + SyRS + Epics + RTM + TEA Gate complete?)

If unclear, ask user which gate to run.

---

## QUALITY GATE 1: Analysis → Planning

**Required Artifacts:**
- Product Brief (any track)
- StRS (Enterprise track only)

**Validation Checks:**

### Product Brief Completeness
- [ ] Product Brief exists and is substantive
- [ ] Vision/mission clearly defined
- [ ] Target audience identified
- [ ] Key features or capabilities listed
- [ ] Success metrics defined

### StRS Completeness (Enterprise Only)
- [ ] StRS exists and follows ISO 29148 Clause 7 structure
- [ ] All 7 major sections present (Introduction, References, Business Mgmt, Operational, User, System Concept, Constraints)
- [ ] Stakeholders identified with profiles
- [ ] Business objectives are SMART
- [ ] Operational scenarios documented
- [ ] Project constraints specified
- [ ] StRS status is at least 'review'

### Cross-Document Consistency
- [ ] StRS business purpose aligns with Product Brief vision
- [ ] StRS stakeholders consistent with Product Brief target audience
- [ ] No contradictions between documents

### Gate Decision
- **PASS:** All required artifacts complete and consistent → Proceed to Planning
- **PASS WITH CONDITIONS:** Minor gaps noted but non-blocking → Proceed with documented risks
- **FAIL:** Critical gaps or inconsistencies → Must resolve before proceeding

---

## QUALITY GATE 2: Planning → Solutioning

**Required Artifacts:**
- PRD/SRS (all tracks)
- StRS (Enterprise track)
- RTM initial version (Enterprise track)
- UX Design (if UI project)

**Validation Checks:**

### PRD Completeness
- [ ] PRD exists with all required sections
- [ ] Functional requirements defined with proper format
- [ ] Non-functional requirements defined
- [ ] Success criteria measurable
- [ ] User journeys documented
- [ ] Enterprise: Interface requirements, constraints, verification plan present
- [ ] Enterprise: All requirements have attributes (ID, priority, source, V&V)

### StRS-PRD Consistency (Enterprise)
- [ ] Every PRD FR traces to a stakeholder need in StRS
- [ ] PRD scope doesn't exceed StRS scope
- [ ] Terminology consistent between StRS and PRD
- [ ] No contradictions between StRS and PRD

### RTM Status (Enterprise)
- [ ] RTM exists with StRS → PRD traceability
- [ ] No orphan StRS requirements (all traced forward)
- [ ] Forward traceability coverage > 80%

### UX-PRD Alignment (if UX exists)
- [ ] UX design covers all UI-relevant FRs
- [ ] No UX features that aren't in PRD (scope creep)
- [ ] UX handoff checklist completed

### Gate Decision
- **PASS:** All artifacts complete, consistent, and traced → Proceed to Solutioning
- **PASS WITH CONDITIONS:** Minor gaps → Proceed with documented risks
- **FAIL:** Critical gaps, broken traceability, or inconsistencies → Must resolve

---

## QUALITY GATE 3: Solutioning → Implementation

**Required Artifacts:**
- Architecture Document (BMad + Enterprise)
- SyRS (Enterprise only)
- Epics & Stories (all tracks)
- RTM updated (Enterprise)
- Implementation Readiness Report (recommended)
- TEA Gate Decision (Enterprise with TEA installed)

**Validation Checks:**

### Architecture Completeness
- [ ] Architecture document exists with technical decisions
- [ ] Key ADRs (Architecture Decision Records) documented
- [ ] Tech stack defined
- [ ] Data model defined
- [ ] API contracts defined (if applicable)

### SyRS Completeness (Enterprise)
- [ ] SyRS exists with ISO 29148 Clause 8 structure
- [ ] System functional requirements mapped from PRD
- [ ] System interfaces defined
- [ ] Verification plan for system requirements
- [ ] Traceability to StRS and PRD maintained

### Epics & Stories Completeness
- [ ] Epics cover all PRD functional requirements
- [ ] Each story has acceptance criteria
- [ ] Enterprise: Stories reference source requirement IDs
- [ ] FR Coverage Map shows complete coverage
- [ ] Stories are implementation-ready (clear, actionable)

### RTM Completeness (Enterprise)
- [ ] RTM updated with StRS → SyRS → PRD → Stories chain
- [ ] No orphan requirements at any level
- [ ] Forward traceability coverage > 90%
- [ ] All requirement statuses updated

### TEA Gate Integration (Enterprise with TEA)
- [ ] TEA TD (Test Design) completed - test strategy exists
- [ ] TEA TR (Traceability) completed - test traceability exists
- [ ] TEA gate decision obtained: PASS / CONCERNS / FAIL
- [ ] If TEA FAIL → This gate also FAILS (blocking)
- [ ] If TEA CONCERNS → Document accepted risks

### Cross-Document Consistency
- [ ] Architecture aligns with PRD requirements
- [ ] SyRS consistent with Architecture decisions
- [ ] Epics/Stories don't introduce scope beyond PRD
- [ ] No terminology conflicts across documents

### Baseline Check (Enterprise)
- [ ] All requirement documents ready for baseline
- [ ] Version numbers assigned
- [ ] Change history documented

### Gate Decision
- **PASS:** All artifacts complete, consistent, traced, TEA passed → Proceed to Implementation
- **PASS WITH CONDITIONS:** Minor gaps, TEA CONCERNS accepted → Proceed with documented risks
- **FAIL:** Critical gaps, broken traceability, TEA FAIL, or major inconsistencies → Must resolve

---

## GATE DECISION REPORT

After running the appropriate gate, produce a report:

```markdown
# Quality Gate Report - {{project_name}}

**Gate:** QG-[1|2|3] - [Phase A] → [Phase B]
**Date:** {{date}}
**Assessed By:** {{agent_name}}

## Decision: [PASS | PASS WITH CONDITIONS | FAIL]

## Artifacts Assessed

| Artifact | Status | Issues |
|----------|--------|--------|
| [Name] | [✅ Complete / ⚠️ Partial / ❌ Missing] | [Details] |

## Validation Results

| Check | Result | Notes |
|-------|--------|-------|
| [Check name] | [PASS/FAIL] | [Details] |

## Issues Requiring Resolution (if FAIL)

| Issue | Severity | Resolution Required |
|-------|----------|-------------------|
| [Issue] | [Critical/High/Medium] | [What needs to happen] |

## Accepted Risks (if PASS WITH CONDITIONS)

| Risk | Impact | Mitigation |
|------|--------|-----------|
| [Risk] | [Impact] | [How to mitigate] |

## Recommendation

[Clear statement of whether to proceed, with any conditions]
```

Save report to: `{planning_artifacts}/quality-gate-report-qg[N]-{{date}}.md`

---

## SUCCESS METRICS:

✅ Correct gate identified and run
✅ All required artifacts discovered and assessed
✅ Cross-document consistency checked
✅ TEA gate decision integrated (if applicable)
✅ Clear PASS/FAIL/CONDITIONS decision with justification
✅ Report generated with actionable findings
✅ Blocking issues clearly identified (if FAIL)

## FAILURE MODES:

❌ Passing a gate when critical artifacts are missing
❌ Not checking cross-document consistency
❌ Not integrating TEA gate decision for Enterprise track
❌ Producing vague findings without specific artifacts/issues
❌ Not saving the gate report
