---
title: "How to Run Test Design"
description: How to create comprehensive test plans using TEA's test-design workflow
---


Use TEA's `*test-design` workflow to create comprehensive test plans with risk assessment and coverage strategies.

---

## When to Use This

**System-level (Phase 3):**
- After architecture is complete
- Before implementation-readiness gate
- To validate architecture testability

**Epic-level (Phase 4):**
- At the start of each epic
- Before implementing stories in the epic
- To identify epic-specific testing needs

---

## Prerequisites

- BMad Method installed
- TEA agent available
- For system-level: Architecture document complete
- For epic-level: Epic defined with stories

---

## Steps

### 1. Load the TEA Agent

Start a fresh chat and load the TEA (Test Architect) agent.

### 2. Run the Test Design Workflow

```
*test-design
```

### 3. Specify the Mode

TEA will ask if you want:

- **System-level** - For architecture testability review (Phase 3)
- **Epic-level** - For epic-specific test planning (Phase 4)

### 4. Provide Context

For system-level:
- Point to your architecture document
- Reference any ADRs (Architecture Decision Records)

For epic-level:
- Specify which epic you're planning
- Reference the epic file with stories

### 5. Review the Output

TEA generates a comprehensive test design document.

---

## What You Get

### System-Level Output (`test-design-system.md`)

- Testability review of architecture
- ADR → test mapping
- Architecturally Significant Requirements (ASRs)
- Environment needs
- Test infrastructure recommendations

### Epic-Level Output (`test-design-epic-N.md`)

- Risk assessment for the epic
- Test priorities
- Coverage plan
- Regression hotspots (for brownfield)
- Integration risks
- Mitigation strategies

---

## Test Design for Different Tracks

### Greenfield - BMad Method

| Stage | Test Design Focus |
|-------|-------------------|
| Phase 3 | System-level testability review |
| Phase 4 | Per-epic risk assessment and test plan |

### Brownfield - BMad Method/Enterprise

| Stage | Test Design Focus |
|-------|-------------------|
| Phase 3 | System-level + existing test baseline |
| Phase 4 | Regression hotspots, integration risks |

### Enterprise

| Stage | Test Design Focus |
|-------|-------------------|
| Phase 3 | Compliance-aware testability |
| Phase 4 | Security/performance/compliance focus |

---

## Tips

- Run system-level test-design right after architecture
- Run epic-level test-design at the start of each epic
- Update test design if ADRs change
- Use the output to guide `*atdd` and `*automate` workflows

---

## Related

- [TEA Overview](/docs/explanation/features/tea-overview.md) - Understanding the Test Architect
- [Setup Test Framework](/docs/how-to/workflows/setup-test-framework.md) - Setting up testing infrastructure
- [Create Architecture](/docs/how-to/workflows/create-architecture.md) - Architecture workflow
