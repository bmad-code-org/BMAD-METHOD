---
title: "How to Run Test Design"
description: How to create comprehensive test plans using TEA's test-design workflow
---

Use TEA's `*test-design` workflow to create comprehensive test plans with risk assessment and coverage strategies.

## When to Use This

**System-level (Phase 3):**
- After architecture is complete
- Before implementation-readiness gate
- To validate architecture testability

**Epic-level (Phase 4):**
- At the start of each epic
- Before implementing stories in the epic
- To identify epic-specific testing needs

:::note[Prerequisites]
- BMad Method installed
- TEA agent available
- For system-level: Architecture document complete
- For epic-level: Epic defined with stories
:::

## Steps

### 1. Load the TEA Agent

Start a fresh chat and load the TEA (Test Architect) agent.

### 2. Run the Test Design Workflow

```
*test-design
```

### 3. Specify the Mode

TEA will ask if you want:

- **System-level** — For architecture testability review (Phase 3)
- **Epic-level** — For epic-specific test planning (Phase 4)

### 4. Provide Context

For system-level:
- Point to your architecture document
- Reference any ADRs (Architecture Decision Records)

For epic-level:
- Specify which epic you're planning
- Reference the epic file with stories

### 5. Review the Output

TEA generates a comprehensive test design document.

## What You Get

**System-Level Output (`test-design-system.md`):**
- Testability review of architecture
- ADR → test mapping
- Architecturally Significant Requirements (ASRs)
- Environment needs
- Test infrastructure recommendations

**Epic-Level Output (`test-design-epic-N.md`):**
- Risk assessment for the epic
- Test priorities
- Coverage plan
- Regression hotspots (for brownfield)
- Integration risks
- Mitigation strategies

## Test Design for Different Tracks

| Track | Phase 3 Focus | Phase 4 Focus |
|-------|---------------|---------------|
| **Greenfield** | System-level testability review | Per-epic risk assessment and test plan |
| **Brownfield** | System-level + existing test baseline | Regression hotspots, integration risks |
| **Enterprise** | Compliance-aware testability | Security/performance/compliance focus |

## Tips

- **Run system-level right after architecture** — Early testability review
- **Run epic-level at the start of each epic** — Targeted test planning
- **Update if ADRs change** — Keep test design aligned
- **Use output to guide other workflows** — Feeds into `*atdd` and `*automate`

## Next Steps

After test design:

1. **Setup Test Framework** — If not already configured
2. **Implementation Readiness** — System-level feeds into gate check
3. **Story Implementation** — Epic-level guides testing during dev
