# <!-- Powered by BMAD™ Core -->

# Context Loading Guide

Decision trees and strategies for Just-in-Time context retrieval. This guide helps agents load the minimal necessary context at the right time.

## Core Principle

**Load context when making decisions, not before.**

Every piece of context loaded costs tokens. Load only what you need, when you need it, for the specific decision you're making RIGHT NOW.

## Universal Loading Rules

### Always Load (Every Task Start)
- ✅ Agent role definition
- ✅ [core-principles.md](core-principles.md)
- ✅ Current task description and requirements
- ✅ Explicitly referenced artifacts (checkpoints, PRDs, specs)

### Never Load (Unless Specific Decision)
- ❌ Technology-specific implementation guides
- ❌ Best practices documentation
- ❌ Pattern libraries
- ❌ Other agents' domain-specific guides

### Ask Before Loading
Before loading ANY additional file, ask these 4 questions:
1. **Am I making THIS decision RIGHT NOW?** (Not later, not "might need")
2. **Is this MY role's responsibility?** (Not another agent's domain)
3. **Is this already in checkpoint/requirements?** (Don't duplicate)
4. **Can I use role knowledge instead?** (Load only for complex/unfamiliar decisions)

If answer to #1 or #2 is NO → **Don't load it**

## Decision Tree by Task Type

### Task: Greenfield Project Architecture

```
Start: Load requirements + core-principles.md
│
├─ Technology Stack Decision?
│  └─ YES → Load technology-stack-guide.md
│  └─ NO → Skip (already decided)
│
├─ Deployment Strategy Decision?
│  └─ YES → Load deployment-strategies.md
│  └─ NO → Skip (decide later)
│
├─ Security Requirements Present?
│  └─ YES (auth/PII/payments) → Load security-guidelines.md
│  └─ NO → Skip
│
├─ Architecture Pattern Decision?
│  └─ YES → Load architecture-patterns.md
│  └─ NO → Use standard monolith, skip
│
└─ Implementation Details?
   └─ SKIP ALL (delegate to implementation agents)
```

**Token Budget**: ~2,000-4,000 tokens
- Base: ~500 tokens (role + requirements)
- Stack guide: ~1,000 tokens
- Deployment: ~500 tokens
- Security (if needed): ~1,000 tokens

### Task: Feature Development (Existing Project)

```
Start: Load checkpoint + feature requirements
│
├─ New Components Needed?
│  ├─ Simple component → Use role knowledge (skip guides)
│  └─ Complex reusable component → Load component-design-guidelines.md
│
├─ State Management Decision?
│  ├─ Already defined in architecture → Use existing pattern (skip guide)
│  └─ New state solution needed → Load state-management-guide.md
│
├─ New API Endpoints?
│  ├─ Standard CRUD → Use role knowledge (skip guides)
│  └─ Complex/new API type → Load api-implementation-patterns.md (specific section only)
│
├─ Authentication/Authorization Changes?
│  └─ YES → Load security-guidelines.md
│  └─ NO → Skip
│
└─ Performance Requirements?
   └─ YES → Load performance-checklist.md
   └─ NO → Skip
```

**Token Budget**: ~1,000-2,000 tokens
- Base: ~700 tokens (checkpoint + requirements)
- Add ~300-500 per guide loaded
- Target: Load max 1-2 guides per feature

### Task: API Design

```
Start: Load requirements + data models
│
├─ What API Type?
│  ├─ REST → Load REST section of api-implementation-patterns.md (~200 tokens)
│  ├─ GraphQL → Load GraphQL section of api-implementation-patterns.md (~300 tokens)
│  └─ tRPC → Load tRPC section of api-implementation-patterns.md (~200 tokens)
│
├─ Authentication Endpoints?
│  └─ YES → Load security-guidelines.md
│  └─ NO → Skip
│
└─ Existing API Standards?
   ├─ YES → Follow existing patterns (skip guide)
   └─ NO → Load api-best-practices.md
```

**Token Budget**: ~1,000-1,500 tokens
- Base: ~500 tokens
- API pattern section: ~200-300 tokens
- Security (if auth): ~1,000 tokens

### Task: Code Review

```
Start: Load code being reviewed + task context
│
├─ Check Architecture Alignment?
│  └─ Load architecture-review-checklist.md
│
├─ Security-Critical Code (auth/validation)?
│  └─ Load security-guidelines.md
│
├─ Performance-Critical Code?
│  └─ Load performance-checklist.md
│
└─ General Code Quality?
   └─ Load development-guidelines.md
```

**Token Budget**: ~800-1,500 tokens
- Code: ~500 tokens
- Checklist: ~300-500 tokens
- Add specific guides as needed

### Task: Database Schema Design

```
Start: Load requirements + data relationships
│
├─ Database Type Decision?
│  ├─ Choosing SQL vs NoSQL → Load database-design-patterns.md (comparison section)
│  └─ Already chosen → Skip, use existing
│
├─ Complex Relationships?
│  └─ Load database-design-patterns.md (schema design section)
│
└─ Simple CRUD Schema?
   └─ Use role knowledge (skip guides)
```

**Token Budget**: ~800-1,200 tokens

### Task: TypeScript Migration

```
Start: Load existing JavaScript code + migration requirements
│
├─ Project Setup?
│  └─ Load development-guidelines.md (tsconfig section)
│
├─ Complex Type Scenarios?
│  └─ Load TypeScript advanced patterns
│
└─ Gradual Migration Strategy?
   └─ Load migration guide
```

**Token Budget**: ~1,000-2,000 tokens

## Decision Trees by Agent Role

### React Developer

```
Task Received
│
├─ Component Implementation (Simple)
│  └─ Load: NOTHING (use role knowledge)
│
├─ Component Implementation (Complex/Reusable)
│  └─ Load: component-design-guidelines.md
│
├─ State Management Decision
│  └─ Load: state-management-guide.md
│
├─ Performance Optimization
│  └─ Load: performance-checklist.md
│
├─ Form Implementation
│  └─ Load: form validation patterns
│
└─ Testing Complex Component
   └─ Load: testing-strategy.md
```

### Node Backend Developer

```
Task Received
│
├─ CRUD Endpoints (Standard)
│  └─ Load: NOTHING (use role knowledge)
│
├─ Authentication/Authorization
│  └─ Load: security-guidelines.md
│
├─ Framework Selection
│  └─ Load: backend-patterns.md (framework comparison)
│
├─ Complex Queries / Performance Issues
│  └─ Load: database-optimization.md
│
└─ Background Jobs
   └─ Load: job queue patterns
```

### Solution Architect

```
Task Received
│
├─ Requirements Analysis
│  └─ Load: NOTHING except requirements
│
├─ Technology Stack Decision
│  └─ Load: technology-stack-guide.md
│
├─ Architecture Pattern Selection
│  └─ Load: architecture-patterns.md
│
├─ Deployment Strategy
│  └─ Load: deployment-strategies.md
│
├─ Security/Compliance Requirements
│  └─ Load: security-guidelines.md
│
└─ Implementation Details
   └─ SKIP (delegate to implementation agents)
```

### API Developer

```
Task Received
│
├─ REST API Design
│  └─ Load: api-implementation-patterns.md (REST section ONLY)
│
├─ GraphQL API Design
│  └─ Load: api-implementation-patterns.md (GraphQL section ONLY)
│
├─ tRPC API Design
│  └─ Load: api-implementation-patterns.md (tRPC section ONLY)
│
├─ Auth Endpoints
│  └─ Load: security-guidelines.md
│
└─ Standard CRUD
   └─ Load: NOTHING (use OpenAPI spec template)
```

### TypeScript Expert

```
Task Received
│
├─ Project Setup / tsconfig
│  └─ Load: development-guidelines.md (TS section)
│
├─ Standard Type Definitions
│  └─ Load: NOTHING (use role knowledge)
│
├─ Complex Generics / Advanced Types
│  └─ Load: TypeScript advanced patterns
│
└─ JS to TS Migration
   └─ Load: migration guide
```

## Context Loading Patterns

### Pattern 1: Minimal Start

**When**: Every task
**Load**: Role + core-principles.md + task requirements only
**Skip**: Everything else until decision point
**Tokens**: ~500-700

### Pattern 2: Checkpoint-Based

**When**: Continuing multi-phase workflow
**Load**: Most recent checkpoint + current task
**Skip**: Full phase history, archived discussions
**Tokens**: ~800-1,200

### Pattern 3: Decision-Triggered

**When**: Making specific technology/pattern choice
**Load**: Single guide for that decision
**Skip**: All other guides
**Tokens**: +300-1,000 (per decision)

### Pattern 4: Section-Only Loading

**When**: Loading large reference file
**Load**: Only relevant section (e.g., "REST API" from api-implementation-patterns.md)
**Skip**: Other sections
**Tokens**: ~200-500 vs ~1,500-3,000 (full file)

### Pattern 5: Progressive Expansion

**When**: Complex task with multiple decision points
**Load**: Stage 1 (minimal) → Stage 2 (decision guides) → Stage 3 (implementation patterns)
**Skip**: Future stage context until needed
**Tokens**: Spread across stages, create checkpoints between

## Red Flags: When You're Over-Loading

🚩 **Red Flag Signals**:
- Loading >3 data files for single task
- Loading files "just in case"
- Loading before knowing what decision you're making
- Loading other agents' domain-specific guides
- Loading implementation details during architecture phase
- Loading optimization guides before having performance issue

## Token Budget Guidelines

### By Task Complexity

**Simple Task** (component, CRUD endpoint, type definition):
- Budget: <1,000 tokens total
- Load: Role + task only

**Medium Task** (feature, API design, review):
- Budget: 1,000-2,000 tokens
- Load: Role + task + 1-2 specific guides

**Complex Task** (architecture, migration, system design):
- Budget: 2,000-4,000 tokens
- Load: Role + task + multiple guides
- Strategy: Use checkpoints to compress

**Multi-Phase Workflow**:
- Budget: <10,000 tokens cumulative
- Strategy: Checkpoint after each phase (compress to ~1,000 tokens)

### Budget Triggers

**Create Checkpoint When**:
- Phase context exceeds 3,000 tokens
- Transitioning between workflow phases
- Completed major decision point
- 5+ agent interactions in sequence

**Archive Context When**:
- Discussion exceeds 1,000 tokens
- Implementation details complete
- Decision finalized (keep conclusion only)

## Validation Checklist

Before loading any file, verify:

- [ ] I am making a specific decision RIGHT NOW (not "might need later")
- [ ] This decision is my role's responsibility
- [ ] This information is NOT in checkpoint/requirements already
- [ ] I cannot use my role knowledge for this decision
- [ ] I am loading ONLY the relevant section, not entire file
- [ ] I have not already loaded >2 guides for this task
- [ ] This will help me complete THIS task, not future tasks

**If any checkbox is unchecked → Don't load it**

## Examples

### ✅ Good: JIT Loading

**Task**: Build user authentication system

**Sequence**:
1. Start: Load role + core-principles.md + requirements (~500 tokens)
2. Decision: Auth approach → Load security-guidelines.md (~1,000 tokens)
3. Decision: API design → Load api-implementation-patterns.md (REST section ~200 tokens)
4. Implementation: Use loaded context, skip additional guides
5. Total: ~1,700 tokens

### ❌ Bad: Upfront Loading

**Task**: Build user authentication system

**Sequence**:
1. Start: Load role + security-guidelines.md + api-implementation-patterns.md + database-optimization.md + deployment-strategies.md + best-practices.md (~6,000 tokens)
2. Use: Only security-guidelines.md and partial API patterns
3. Waste: ~4,000 tokens of unused context

**Problem**: Loaded everything upfront, used <40% of it

### ✅ Good: Section-Only Loading

**Task**: Design REST API for user service

**Sequence**:
1. Load: Role + task (~500 tokens)
2. Load: REST section from api-implementation-patterns.md (~200 tokens)
3. Skip: GraphQL, tRPC, WebSocket sections
4. Total: ~700 tokens vs ~1,500 if loaded full file

### ❌ Bad: Full File Loading

**Task**: Design REST API for user service

**Sequence**:
1. Load: Full api-implementation-patterns.md (~1,500 tokens)
2. Use: Only REST section (~200 tokens worth)
3. Waste: ~1,300 tokens of GraphQL/tRPC/WebSocket patterns

## Summary

**Golden Rules**:
1. Start minimal (role + task + requirements)
2. Load on decision points (not before)
3. Load sections, not full files
4. Ask 4 questions before loading
5. Create checkpoints when >3K tokens
6. Archive verbose context immediately

**Target**: <1,000 tokens for simple tasks, <2,000 for medium, <4,000 for complex

**Remember**: Context is expensive. Every token loaded must directly contribute to the current decision.
