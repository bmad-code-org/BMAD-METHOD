---
title: "How to Run Implementation Readiness"
description: How to validate planning and solutioning before implementation
---

Use the `implementation-readiness` workflow to validate that planning and solutioning are complete and aligned before Phase 4 implementation.

## When to Use This

- **Always** before Phase 4 for BMad Method and Enterprise projects
- After create-epics-and-stories workflow completes
- Before sprint-planning workflow
- When stakeholders request readiness check

## When to Skip This

- Quick Flow (no solutioning phase)
- BMad Method Simple (no gate check required)

:::note[Prerequisites]
- BMad Method installed
- Architect agent available
- PRD, Architecture, and Epics completed
:::

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

## Gate Decision Outcomes

| Decision | Meaning | Action |
|----------|---------|--------|
| **PASS** | All critical criteria met, minor gaps acceptable | Proceed to Phase 4 |
| **CONCERNS** | Some criteria not met but not blockers | Proceed with caution, address gaps in parallel |
| **FAIL** | Critical gaps or contradictions | BLOCK Phase 4, resolve issues first |

## What Gets Checked

**PRD/GDD Completeness:**
- Problem statement clear and evidence-based
- Success metrics defined
- User personas identified
- FRs and NFRs complete
- Risks and assumptions documented

**Architecture Completeness:**
- System, data, API architecture defined
- Key ADRs documented
- Security architecture addressed
- FR/NFR-specific guidance provided
- Standards and conventions defined

**Epic/Story Completeness:**
- All PRD features mapped to stories
- Stories have acceptance criteria
- Stories prioritized (P0/P1/P2/P3)
- Dependencies identified

**Alignment Checks:**
- Architecture addresses all PRD FRs/NFRs
- Epics align with architecture decisions
- No contradictions between epics
- Integration points clear

## What You Get

An `implementation-readiness.md` document containing:

1. **Executive Summary** (PASS/CONCERNS/FAIL)
2. **Completeness Assessment** (scores for PRD, Architecture, Epics)
3. **Alignment Assessment** (PRD↔Architecture, Architecture↔Epics)
4. **Quality Assessment** (story quality, dependencies, risks)
5. **Gaps and Recommendations** (critical/minor gaps, remediation)
6. **Gate Decision** with rationale
7. **Next Steps**

## Example

E-commerce platform → CONCERNS

**Gaps identified:**
- Missing security architecture section
- Undefined payment gateway

**Recommendation:**
- Complete security section
- Add payment gateway ADR

**Action:** Proceed with caution, address before payment epic.

## Tips

- **Run before every Phase 4 start** — It's a valuable checkpoint
- **Take FAIL decisions seriously** — Fix issues first
- **Use CONCERNS as a checklist** — Track parallel work
- **Document why you proceed despite concerns** — Transparency matters

## Next Steps

After implementation readiness:

1. **If PASS** — Run sprint-planning to start Phase 4
2. **If CONCERNS** — Proceed with documented gaps to address
3. **If FAIL** — Return to relevant workflow to fix issues
