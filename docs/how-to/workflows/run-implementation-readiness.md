---
title: "How to Run Implementation Readiness"
description: How to validate planning and solutioning before implementation
---


Use the `implementation-readiness` workflow to validate that planning and solutioning are complete and aligned before Phase 4 implementation.

---

## When to Use This

- **Always** before Phase 4 for BMad Method and Enterprise projects
- After create-epics-and-stories workflow completes
- Before sprint-planning workflow
- When stakeholders request readiness check

---

## When to Skip This

- Quick Flow (no solutioning phase)
- BMad Method Simple (no gate check required)

---

## Prerequisites

- BMad Method installed
- Architect agent available
- PRD, Architecture, and Epics completed

---

## Steps

### 1. Load the Architect Agent

Start a fresh chat and load the Architect agent.

### 2. Run the Workflow

```
*implementation-readiness
```

### 3. Let the Agent Validate

The workflow systematically checks:
- PRD completeness
- Architecture completeness
- Epic/Story completeness
- Alignment between all documents

### 4. Review the Gate Decision

The agent produces a gate decision with rationale.

---

## Gate Decision Outcomes

### ✅ PASS

- All critical criteria met
- Minor gaps acceptable with documented plan
- **Action:** Proceed to Phase 4

### ⚠️ CONCERNS

- Some criteria not met but not blockers
- Gaps identified with clear resolution path
- **Action:** Proceed with caution, address gaps in parallel

### ❌ FAIL

- Critical gaps or contradictions
- Architecture missing key decisions
- Epics conflict with PRD/architecture
- **Action:** BLOCK Phase 4, resolve issues first

---

## What Gets Checked

### PRD/GDD Completeness
- Problem statement clear and evidence-based
- Success metrics defined
- User personas identified
- Functional requirements (FRs) complete
- Non-functional requirements (NFRs) specified
- Risks and assumptions documented

### Architecture Completeness
- System architecture defined
- Data architecture specified
- API architecture decided
- Key ADRs documented
- Security architecture addressed
- FR/NFR-specific guidance provided
- Standards and conventions defined

### Epic/Story Completeness
- All PRD features mapped to stories
- Stories have acceptance criteria
- Stories prioritized (P0/P1/P2/P3)
- Dependencies identified
- Story sequencing logical

### Alignment Checks
- Architecture addresses all PRD FRs/NFRs
- Epics align with architecture decisions
- No contradictions between epics
- NFRs have technical approach
- Integration points clear

---

## What You Get

An `implementation-readiness.md` document containing:

1. **Executive Summary** (PASS/CONCERNS/FAIL)
2. **Completeness Assessment** (scores for PRD, Architecture, Epics)
3. **Alignment Assessment** (PRD↔Architecture, Architecture↔Epics)
4. **Quality Assessment** (story quality, dependencies, risks)
5. **Gaps and Recommendations** (critical/minor gaps, remediation)
6. **Gate Decision** with rationale
7. **Next Steps**

---

## Example

E-commerce platform → CONCERNS ⚠️

**Gaps identified:**
- Missing security architecture section
- Undefined payment gateway

**Recommendation:**
- Complete security section
- Add payment gateway ADR

**Action:** Proceed with caution, address before payment epic.

---

## Tips

- Run this before every Phase 4 start
- Take FAIL decisions seriously - fix issues first
- Use CONCERNS as a checklist for parallel work
- Document why you proceed despite concerns

---

## Related

- [Create Architecture](/docs/how-to/workflows/create-architecture.md) - Architecture workflow
- [Create Epics and Stories](/docs/how-to/workflows/create-epics-and-stories.md) - Work breakdown
- [Run Sprint Planning](/docs/how-to/workflows/run-sprint-planning.md) - Start implementation
