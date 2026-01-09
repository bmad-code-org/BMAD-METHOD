---
title: "Preventing Agent Conflicts"
description: How architecture prevents conflicts when multiple agents implement a system
---


When multiple AI agents implement different parts of a system, they can make conflicting technical decisions. Architecture documentation prevents this by establishing shared standards.

---

## Common Conflict Types

### API Style Conflicts

Without architecture:
- Agent A uses REST with `/users/{id}`
- Agent B uses GraphQL mutations
- Result: Inconsistent API patterns, confused consumers

With architecture:
- ADR specifies: "Use GraphQL for all client-server communication"
- All agents follow the same pattern

### Database Design Conflicts

Without architecture:
- Agent A uses snake_case column names
- Agent B uses camelCase column names
- Result: Inconsistent schema, confusing queries

With architecture:
- Standards document specifies naming conventions
- All agents follow the same patterns

### State Management Conflicts

Without architecture:
- Agent A uses Redux for global state
- Agent B uses React Context
- Result: Multiple state management approaches, complexity

With architecture:
- ADR specifies state management approach
- All agents implement consistently

---

## How Architecture Prevents Conflicts

### 1. Explicit Decisions via ADRs

Every significant technology choice is documented with:
- Context (why this decision matters)
- Options considered (what alternatives exist)
- Decision (what we chose)
- Rationale (why we chose it)
- Consequences (trade-offs accepted)

### 2. FR/NFR-Specific Guidance

Architecture maps each functional requirement to technical approach:
- FR-001: User Management → GraphQL mutations
- FR-002: Mobile App → Optimized queries

### 3. Standards and Conventions

Explicit documentation of:
- Directory structure
- Naming conventions
- Code organization
- Testing patterns

---

## Architecture as Shared Context

Think of architecture as the shared context that all agents read before implementing:

```
PRD: "What to build"
     ↓
Architecture: "How to build it"
     ↓
Agent A reads architecture → implements Epic 1
Agent B reads architecture → implements Epic 2
Agent C reads architecture → implements Epic 3
     ↓
Result: Consistent implementation
```

---

## Key ADR Topics

Common decisions that prevent conflicts:

| Topic | Example Decision |
|-------|-----------------|
| API Style | GraphQL vs REST vs gRPC |
| Database | PostgreSQL vs MongoDB |
| Auth | JWT vs Sessions |
| State Management | Redux vs Context vs Zustand |
| Styling | CSS Modules vs Tailwind vs Styled Components |
| Testing | Jest + Playwright vs Vitest + Cypress |

---

## Anti-Patterns

### ❌ Implicit Decisions

"We'll figure out the API style as we go"
→ Leads to inconsistency

### ❌ Over-Documentation

Every minor choice documented
→ Analysis paralysis, wasted time

### ❌ Stale Architecture

Document written once, never updated
→ Agents follow outdated patterns

### ✅ Correct Approach

- Document decisions that cross epic boundaries
- Focus on conflict-prone areas
- Update architecture as you learn
- Use `correct-course` for significant changes

---

## Related

- [Why Solutioning Matters](./why-solutioning-matters.md)
- [Four Phases](./four-phases.md)
- [Create Architecture](../../how-to/workflows/create-architecture.md)
