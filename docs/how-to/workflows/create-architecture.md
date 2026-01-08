---
title: "How to Create Architecture"
description: How to create system architecture using the BMad Method
---


Use the `architecture` workflow to make technical decisions explicit and prevent agent conflicts during implementation.

---

## When to Use This

- Multi-epic projects (BMad Method, Enterprise)
- Cross-cutting technical concerns
- Multiple agents implementing different parts
- Integration complexity exists
- Technology choices need alignment

---

## When to Skip This

- Quick Flow (simple changes)
- BMad Method Simple with straightforward tech stack
- Single epic with clear technical approach

---

## Prerequisites

- BMad Method installed
- Architect agent available
- PRD completed

---

## Steps

### 1. Load the Architect Agent

Start a fresh chat and load the Architect agent.

### 2. Run the Architecture Workflow

```
*create-architecture
```

### 3. Engage in Discovery

This is NOT a template filler. The architecture workflow:

1. **Discovers** technical needs through conversation
2. **Proposes** architectural options with trade-offs
3. **Documents** decisions that prevent agent conflicts
4. **Focuses** on decision points, not exhaustive documentation

### 4. Document Key Decisions

Work with the agent to create Architecture Decision Records (ADRs) for significant choices.

### 5. Review the Architecture

The agent produces a decision-focused architecture document.

---

## What You Get

An `architecture.md` document containing:

1. **Architecture Overview** - System context, principles, style
2. **System Architecture** - High-level diagram, component interactions
3. **Data Architecture** - Database design, state management, caching
4. **API Architecture** - API style (REST/GraphQL/gRPC), auth, versioning
5. **Frontend Architecture** - Framework, state management, components
6. **Integration Architecture** - Third-party integrations, messaging
7. **Security Architecture** - Auth/authorization, data protection
8. **Deployment Architecture** - CI/CD, environments, monitoring
9. **ADRs** - Key decisions with context, options, rationale
10. **FR/NFR-Specific Guidance** - Technical approach per requirement
11. **Standards and Conventions** - Directory structure, naming, testing

---

## ADR Format

```markdown
## ADR-001: Use GraphQL for All APIs

**Status:** Accepted | **Date:** 2025-11-02

**Context:** PRD requires flexible querying across multiple epics

**Decision:** Use GraphQL for all client-server communication

**Options Considered:**
1. REST - Familiar but requires multiple endpoints
2. GraphQL - Flexible querying, learning curve
3. gRPC - High performance, poor browser support

**Rationale:**
- PRD requires flexible data fetching (Epic 1, 3)
- Mobile app needs bandwidth optimization (Epic 2)
- Team has GraphQL experience

**Consequences:**
- Positive: Flexible querying, reduced versioning
- Negative: Caching complexity, N+1 query risk
- Mitigation: Use DataLoader for batching
```

---

## Example

E-commerce platform produces:
- Monolith + PostgreSQL + Redis + Next.js + GraphQL
- ADRs explaining each choice
- FR/NFR-specific implementation guidance

---

## Tips

- Focus on decisions that prevent agent conflicts
- Use ADRs for every significant technology choice
- Keep it practical - don't over-architect
- Architecture is living - update as you learn

---

## Next Steps

After architecture:

1. **Create Epics and Stories** - Work breakdown informed by architecture
2. **Implementation Readiness** - Gate check before Phase 4

---

## Related

- [Create PRD](/docs/how-to/workflows/create-prd.md) - Requirements before architecture
- [Create Epics and Stories](/docs/how-to/workflows/create-epics-and-stories.md) - Next step
- [Run Implementation Readiness](/docs/how-to/workflows/run-implementation-readiness.md) - Gate check
- [Why Solutioning Matters](/docs/explanation/architecture/why-solutioning-matters.md)
