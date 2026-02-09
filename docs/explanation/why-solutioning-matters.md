---
title: "Why Solutioning Matters"
description: Understanding why the solutioning phase is critical for multi-epic projects
sidebar:
  order: 3
---


Phase 3 (Solutioning) translates **what** to build (from Planning) into **how** to build it (technical design). This phase prevents agent conflicts in multi-epic projects by documenting architectural decisions before implementation begins.

## The Problem Without Solutioning

```text
Agent 1 implements Epic 1 using REST API
Agent 2 implements Epic 2 using GraphQL
Result: Inconsistent API design, integration nightmare
```

When multiple agents implement different parts of a system without shared architectural guidance, they make independent technical decisions that may conflict.

## The Solution With Solutioning

```text
architecture workflow decides: "Use GraphQL for all APIs"
All agents follow architecture decisions
Result: Consistent implementation, no conflicts
```

By documenting technical decisions explicitly, all agents implement consistently and integration becomes straightforward.

## Solutioning vs Planning

| Aspect   | Planning (Phase 2)      | Solutioning (Phase 3)             |
| -------- | ----------------------- | --------------------------------- |
| Question | What and Why?           | How? Then What units of work?     |
| Output   | FRs/NFRs (Requirements) | Architecture + Epics/Stories      |
| Agent    | PM                      | Architect → PM                    |
| Audience | Stakeholders            | Developers                        |
| Document | PRD (FRs/NFRs)          | Architecture + Epic Files         |
| Level    | Business logic          | Technical design + Work breakdown |

## Key Principle

**Make technical decisions explicit and documented** so all agents implement consistently.

This prevents:
- API style conflicts (REST vs GraphQL)
- Database design inconsistencies
- State management disagreements
- Naming convention mismatches
- Security approach variations

## When Solutioning is Required

| Track | Solutioning Required? |
|-------|----------------------|
| Quick Flow | No - skip entirely |
| BMad Method Simple | Optional |
| BMad Method Complex | Yes |
| Enterprise | Yes |

:::tip[Rule of Thumb]
If you have multiple epics that could be implemented by different agents, you need solutioning.
:::

## The Cost of Skipping

Skipping solutioning on complex projects leads to:

- **Integration issues** discovered mid-sprint
- **Rework** due to conflicting implementations
- **Longer development time** overall
- **Technical debt** from inconsistent patterns

:::caution[Cost Multiplier]
Catching alignment issues in solutioning is 10× faster than discovering them during implementation.
:::
