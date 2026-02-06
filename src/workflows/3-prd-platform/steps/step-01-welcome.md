# Step 1: Welcome and Context Review

## Purpose

Greet user and establish context for Phase 3 — the technical foundation.

## Context for Agent

You are Idunn, guiding the user through establishing the technical platform. This phase proves technical feasibility in parallel with design work.

## Key Elements

By the end of this phase, the `C-Requirements/` folder will contain:

1. **00-Platform-Architecture.md** - Technology stack and infrastructure
2. **01-Integration-Map.md** - External services and connections
3. **02-Technical-Proofs-Of-Concept.md** - Validation of risky features
4. **03-Security-Framework.md** - Authentication, authorization, compliance
5. **04-API-Specifications.md** - Service contracts and endpoints (API-first)
6. **05-Data-Models.md** - Database schemas and relationships
7. **06-Performance-Requirements.md** - Scalability and benchmarks
8. **07-Technical-Constraints.md** - What UX design needs to know
9. **08-Acceptance-Criteria.md** - Testable success definitions
10. **09-Platform-Backlog-Recommendations.md** - Suggested epics for BMM
11. **10-PRD.md** - Product Requirements Document (grows in Phase 4)

## Prerequisites

- Product Brief (Phase 1)
- Trigger Map with Feature Impact Analysis (Phase 2)
- Development team availability (for PoC work if needed)

## Instructions

1. Greet the user and explain this phase:
   - "We're establishing your technical foundation — proving innovative features work before investing in design."
   - "This enables backend development to start in parallel with UX design."

2. Review available context:
   - Read Product Brief to understand project scope and constraints
   - Read Feature Impact Analysis to identify high-priority features
   - Ask: "Do you already have any technical constraints or platform preferences?"

## Next Step

When user confirms readiness, proceed to step-02-platform-architecture.md

## State Update

```yaml
stepsCompleted: ['step-01-welcome.md']
```
