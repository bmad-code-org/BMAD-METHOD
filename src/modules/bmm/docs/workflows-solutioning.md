# BMM Solutioning Workflows (Phase 3)

**Reading Time:** ~8 minutes

## Overview

Phase 3 (Solutioning) workflows translate **what** to build (from Planning) into **how** to build it (technical design). This phase prevents agent conflicts in multi-epic projects by documenting architectural decisions before implementation begins.

**Key principle:** Make technical decisions explicit and documented so all agents implement consistently. Prevent one agent choosing REST while another chooses GraphQL.

**Required for:** BMad Method (complex projects), Enterprise Method

**Optional for:** BMad Method (simple projects), Quick Flow (skip entirely)

---

## Phase 3 Solutioning Workflow Map

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#fff','primaryTextColor':'#000','primaryBorderColor':'#000','lineColor':'#000','fontSize':'16px','fontFamily':'arial'}}}%%
graph TB
    FromPlanning["<b>FROM Phase 2 Planning</b><br/>PRD (FRs/NFRs) complete"]

    subgraph QuickFlow["<b>QUICK FLOW PATH</b>"]
        direction TB
        SkipArch["<b>Skip Phase 3</b><br/>Go directly to Implementation"]
    end

    subgraph BMadEnterprise["<b>BMAD METHOD + ENTERPRISE (Same Start)</b>"]
        direction TB
        OptionalUX["<b>UX Designer: create-ux-design</b><br/>(Optional)"]
        Architecture["<b>Architect: architecture</b><br/>System design + ADRs"]

        subgraph Optional["<b>ENTERPRISE ADDITIONS (Optional)</b>"]
            direction LR
            SecArch["<b>Architect: security-architecture</b><br/>(Future)"]
            DevOps["<b>Architect: devops-strategy</b><br/>(Future)"]
        end

        EpicsStories["<b>PM: create-epics-and-stories</b><br/>Break down FRs/NFRs into epics"]
        GateCheck["<b>Architect: implementation-readiness</b><br/>Validation before Phase 4"]

        OptionalUX -.-> Architecture
        Architecture -.->|Enterprise only| Optional
        Architecture --> EpicsStories
        Optional -.-> EpicsStories
        EpicsStories --> GateCheck
    end

    subgraph Result["<b>GATE CHECK RESULTS</b>"]
        direction LR
        Pass["✅ PASS<br/>Proceed to Phase 4"]
        Concerns["⚠️ CONCERNS<br/>Proceed with caution"]
        Fail["❌ FAIL<br/>Resolve issues first"]
    end

    FromPlanning -->|Quick Flow| QuickFlow
    FromPlanning -->|BMad Method<br/>or Enterprise| OptionalUX

    QuickFlow --> Phase4["<b>Phase 4: Implementation</b>"]
    GateCheck --> Result
    Pass --> Phase4
    Concerns --> Phase4
    Fail -.->|Fix issues| Architecture

    style FromPlanning fill:#e1bee7,stroke:#6a1b9a,stroke-width:2px,color:#000
    style QuickFlow fill:#c5e1a5,stroke:#33691e,stroke-width:3px,color:#000
    style BMadEnterprise fill:#90caf9,stroke:#0d47a1,stroke-width:3px,color:#000
    style Optional fill:#ffcdd2,stroke:#c62828,stroke-width:3px,color:#000
    style Result fill:#fff9c4,stroke:#f57f17,stroke-width:3px,color:#000
    style Phase4 fill:#ffcc80,stroke:#e65100,stroke-width:2px,color:#000

    style SkipArch fill:#aed581,stroke:#1b5e20,stroke-width:2px,color:#000
    style OptionalUX fill:#64b5f6,stroke:#0d47a1,stroke-width:2px,color:#000
    style Architecture fill:#42a5f5,stroke:#0d47a1,stroke-width:2px,color:#000
    style SecArch fill:#ef9a9a,stroke:#c62828,stroke-width:2px,color:#000
    style DevOps fill:#ef9a9a,stroke:#c62828,stroke-width:2px,color:#000
    style EpicsStories fill:#42a5f5,stroke:#0d47a1,stroke-width:2px,color:#000
    style GateCheck fill:#42a5f5,stroke:#0d47a1,stroke-width:2px,color:#000
    style Pass fill:#81c784,stroke:#388e3c,stroke-width:2px,color:#000
    style Concerns fill:#ffb74d,stroke:#f57f17,stroke-width:2px,color:#000
    style Fail fill:#e57373,stroke:#d32f2f,stroke-width:2px,color:#000
```

---

## Quick Reference

| Workflow                     | Agent       | Track                    | Purpose                                      |
| ---------------------------- | ----------- | ------------------------ | -------------------------------------------- |
| **create-ux-design**         | UX Designer | BMad Method, Enterprise  | Optional UX design (after PRD, before arch)  |
| **architecture**             | Architect   | BMad Method, Enterprise  | Technical architecture and design decisions  |
| **create-epics-and-stories** | PM          | BMad Method, Enterprise  | Break FRs/NFRs into epics after architecture |
| **implementation-readiness** | Architect   | BMad Complex, Enterprise | Validate planning/solutioning completeness   |

**When to Skip Solutioning:**

- **Quick Flow:** Simple changes don't need architecture → Skip to Phase 4

**When Solutioning is Required:**

- **BMad Method:** Multi-epic projects need architecture to prevent conflicts
- **Enterprise:** Same as BMad Method, plus optional extended workflows (test architecture, security architecture, devops strategy) added AFTER architecture but BEFORE gate check

---

## Why Solutioning Matters

### The Problem Without Solutioning

```
Agent 1 implements Epic 1 using REST API
Agent 2 implements Epic 2 using GraphQL
Result: Inconsistent API design, integration nightmare
```

### The Solution With Solutioning

```
architecture workflow decides: "Use GraphQL for all APIs"
All agents follow architecture decisions
Result: Consistent implementation, no conflicts
```

### Solutioning vs Planning

| Aspect   | Planning (Phase 2)      | Solutioning (Phase 3)             |
| -------- | ----------------------- | --------------------------------- |
| Question | What and Why?           | How? Then What units of work?     |
| Output   | FRs/NFRs (Requirements) | Architecture + Epics/Stories      |
| Agent    | PM                      | Architect → PM                    |
| Audience | Stakeholders            | Developers                        |
| Document | PRD (FRs/NFRs)          | Architecture + Epic Files         |
| Level    | Business logic          | Technical design + Work breakdown |

---

## Workflow Descriptions

### architecture

**Purpose:** Make technical decisions explicit to prevent agent conflicts. Produces decision-focused architecture document optimized for AI consistency.

**Agent:** Architect

**When to Use:**

- Multi-epic projects (BMad Complex, Enterprise)
- Cross-cutting technical concerns
- Multiple agents implementing different parts
- Integration complexity exists
- Technology choices need alignment

**When to Skip:**

- Quick Flow (simple changes)
- BMad Method Simple with straightforward tech stack
- Single epic with clear technical approach

**Adaptive Conversation Approach:**

This is NOT a template filler. The architecture workflow:

1. **Discovers** technical needs through conversation
2. **Proposes** architectural options with trade-offs
3. **Documents** decisions that prevent agent conflicts
4. **Focuses** on decision points, not exhaustive documentation

**Key Outputs:**

**architecture.md** containing:

1. **Architecture Overview** - System context, principles, style
2. **System Architecture** - High-level diagram, component interactions, communication patterns
3. **Data Architecture** - Database design, state management, caching, data flow
4. **API Architecture** - API style (REST/GraphQL/gRPC), auth, versioning, error handling
5. **Frontend Architecture** (if applicable) - Framework, state management, component architecture, routing
6. **Integration Architecture** - Third-party integrations, message queuing, event-driven patterns
7. **Security Architecture** - Auth/authorization, data protection, security boundaries
8. **Deployment Architecture** - Deployment model, CI/CD, environment strategy, monitoring
9. **Architecture Decision Records (ADRs)** - Key decisions with context, options, trade-offs, rationale
10. **FR/NFR-Specific Guidance** - Technical approach per functional requirement, implementation priorities, dependencies
11. **Standards and Conventions** - Directory structure, naming conventions, code organization, testing

**ADR Format (Brief):**

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

**Implications for FRs:**

- FR-001: User Management → GraphQL mutations
- FR-002: Mobile App → Optimized queries
```

**Example:** E-commerce platform → Monolith + PostgreSQL + Redis + Next.js + GraphQL, with ADRs explaining each choice and FR/NFR-specific guidance.

**Integration:** Feeds into create-epics-and-stories workflow. Architecture provides the technical context needed for breaking FRs/NFRs into implementable epics and stories. All dev agents reference architecture during Phase 4 implementation.

---

### create-epics-and-stories

**Purpose:** Transform PRD's functional and non-functional requirements into bite-sized stories organized into deliverable functional epics. This workflow runs AFTER architecture so epics/stories are informed by technical decisions.

**Agent:** PM (Product Manager)

**When to Use:**

- After architecture workflow completes
- When PRD contains FRs/NFRs ready for implementation breakdown
- Before implementation-readiness gate check

**Key Inputs:**

- PRD (FRs/NFRs) from Phase 2 Planning
- architecture.md with ADRs and technical decisions
- Optional: UX design artifacts

**Why After Architecture:**

The create-epics-and-stories workflow runs AFTER architecture because:

1. **Informed Story Sizing:** Architecture decisions (database choice, API style, etc.) affect story complexity
2. **Dependency Awareness:** Architecture reveals technical dependencies between stories
3. **Technical Feasibility:** Stories can be properly scoped knowing the tech stack
4. **Consistency:** All stories align with documented architectural patterns

**Key Outputs:**

Epic files (one per epic) containing:

1. Epic objective and scope
2. User stories with acceptance criteria
3. Story priorities (P0/P1/P2/P3)
4. Dependencies between stories
5. Technical notes referencing architecture decisions

**Example:** E-commerce PRD with FR-001 (User Registration), FR-002 (Product Catalog) → Epic 1: User Management (3 stories), Epic 2: Product Display (4 stories), each story referencing relevant ADRs.

---

### implementation-readiness

**Purpose:** Systematically validate that planning and solutioning are complete and aligned before Phase 4 implementation. Ensures PRD, architecture, and epics are cohesive with no gaps.

**Agent:** Architect

**When to Use:**

- **Always** before Phase 4 for BMad Complex and Enterprise projects
- After create-epics-and-stories workflow completes
- Before sprint-planning workflow
- When stakeholders request readiness check

**When to Skip:**

- Quick Flow (no solutioning)
- BMad Simple (no gate check required)

**Purpose of Gate Check:**

**Prevents:**

- ❌ Architecture doesn't address all FRs/NFRs
- ❌ Epics conflict with architecture decisions
- ❌ Requirements ambiguous or contradictory
- ❌ Missing critical dependencies

**Ensures:**

- ✅ PRD → Architecture → Epics alignment
- ✅ All epics have clear technical approach
- ✅ No contradictions or gaps
- ✅ Team ready to implement

**Check Criteria:**

**PRD/GDD Completeness:**

- Problem statement clear and evidence-based
- Success metrics defined
- User personas identified
- Functional requirements (FRs) complete
- Non-functional requirements (NFRs) specified
- Risks and assumptions documented

**Architecture Completeness:**

- System architecture defined
- Data architecture specified
- API architecture decided
- Key ADRs documented
- Security architecture addressed
- FR/NFR-specific guidance provided
- Standards and conventions defined

**Epic/Story Completeness:**

- All PRD features mapped to stories
- Stories have acceptance criteria
- Stories prioritized (P0/P1/P2/P3)
- Dependencies identified
- Story sequencing logical

**Alignment Checks:**

- Architecture addresses all PRD FRs/NFRs
- Epics align with architecture decisions
- No contradictions between epics
- NFRs have technical approach
- Integration points clear

**Gate Decision Logic:**

**✅ PASS**

- All critical criteria met
- Minor gaps acceptable with documented plan
- **Action:** Proceed to Phase 4

**⚠️ CONCERNS**

- Some criteria not met but not blockers
- Gaps identified with clear resolution path
- **Action:** Proceed with caution, address gaps in parallel

**❌ FAIL**

- Critical gaps or contradictions
- Architecture missing key decisions
- Epics conflict with PRD/architecture
- **Action:** BLOCK Phase 4, resolve issues first

**Key Outputs:**

**implementation-readiness.md** containing:

1. Executive Summary (PASS/CONCERNS/FAIL)
2. Completeness Assessment (scores for PRD, Architecture, Epics)
3. Alignment Assessment (PRD↔Architecture, Architecture↔Epics/Stories, cross-epic consistency)
4. Quality Assessment (story quality, dependencies, risks)
5. Gaps and Recommendations (critical/minor gaps, remediation)
6. Gate Decision with rationale
7. Next Steps

**Example:** E-commerce platform → CONCERNS ⚠️ due to missing security architecture and undefined payment gateway. Recommendation: Complete security section and add payment gateway ADR before proceeding.

---

## Integration with Planning and Implementation

### Planning → Solutioning Flow

**Quick Flow:**

```
Planning (tech-spec by PM)
  → Skip Solutioning
  → Phase 4 (Implementation)
```

**BMad Method:**

```
Planning (prd by PM - FRs/NFRs only)
  → Optional: create-ux-design (UX Designer)
  → architecture (Architect)
  → create-epics-and-stories (PM)
  → implementation-readiness (Architect)
  → Phase 4 (Implementation)
```

**Enterprise:**

```
Planning (prd by PM - FRs/NFRs only)
  → Optional: create-ux-design (UX Designer)
  → architecture (Architect)
  → Optional: security-architecture (Architect, future)
  → Optional: devops-strategy (Architect, future)
  → create-epics-and-stories (PM)
  → implementation-readiness (Architect)
  → Phase 4 (Implementation)
```

**Note on TEA (Test Architect):** TEA is fully operational with 8 workflows across all phases. TEA validates architecture testability during Phase 3 reviews but does not have a dedicated solutioning workflow. TEA's primary setup occurs in Phase 2 (`*framework`, `*ci`, `*test-design`) and testing execution in Phase 4 (`*atdd`, `*automate`, `*test-review`, `*trace`, `*nfr-assess`).

**Note:** Enterprise uses the same planning and architecture as BMad Method. The only difference is optional extended workflows added AFTER architecture but BEFORE create-epics-and-stories.

### Solutioning → Implementation Handoff

**Documents Produced:**

1. **architecture.md** → Guides all dev agents during implementation
2. **ADRs** (in architecture) → Referenced by agents for technical decisions
3. **Epic files** (from create-epics-and-stories) → Work breakdown into implementable units
4. **implementation-readiness.md** → Confirms readiness for Phase 4

**How Implementation Uses Solutioning:**

- **sprint-planning** - Loads architecture and epic files for sprint organization
- **dev-story** - References architecture decisions and ADRs
- **code-review** - Validates code follows architectural standards

---

## Best Practices

### 1. Make Decisions Explicit

Don't leave technology choices implicit. Document decisions with rationale in ADRs so agents understand context.

### 2. Focus on Agent Conflicts

Architecture's primary job is preventing conflicting implementations. Focus on cross-cutting concerns.

### 3. Use ADRs for Key Decisions

Every significant technology choice should have an ADR explaining "why", not just "what".

### 4. Keep It Practical

Don't over-architect simple projects. BMad Simple projects need simple architecture.

### 5. Run Gate Check Before Implementation

Catching alignment issues in solutioning is 10× faster than discovering them mid-implementation.

### 6. Iterate Architecture

Architecture documents are living. Update them as you learn during implementation.

---

## Decision Guide

### Quick Flow

- **Planning:** tech-spec (PM)
- **Solutioning:** Skip entirely
- **Implementation:** sprint-planning → dev-story

### BMad Method

- **Planning:** prd (PM) - creates FRs/NFRs only, NOT epics
- **Solutioning:** Optional UX → architecture (Architect) → create-epics-and-stories (PM) → implementation-readiness (Architect)
- **Implementation:** sprint-planning → epic-tech-context → dev-story

### Enterprise

- **Planning:** prd (PM) - creates FRs/NFRs only (same as BMad Method)
- **Solutioning:** Optional UX → architecture (Architect) → Optional extended workflows (security-architecture, devops-strategy) → create-epics-and-stories (PM) → implementation-readiness (Architect)
- **Implementation:** sprint-planning → epic-tech-context → dev-story

**Key Difference:** Enterprise adds optional extended workflows AFTER architecture but BEFORE create-epics-and-stories. Everything else is identical to BMad Method.

**Note:** TEA (Test Architect) operates across all phases and validates architecture testability but is not a Phase 3-specific workflow. See [Test Architecture Guide](./test-architecture.md) for TEA's full lifecycle integration.

---

## Common Anti-Patterns

### ❌ Skipping Architecture for Complex Projects

"Architecture slows us down, let's just start coding."
**Result:** Agent conflicts, inconsistent design, massive rework

### ❌ Over-Engineering Simple Projects

"Let me design this simple feature like a distributed system."
**Result:** Wasted time, over-engineering, analysis paralysis

### ❌ Template-Driven Architecture

"Fill out every section of this architecture template."
**Result:** Documentation theater, no real decisions made

### ❌ Skipping Gate Check

"PRD and architecture look good enough, let's start."
**Result:** Gaps discovered mid-sprint, wasted implementation time

### ✅ Correct Approach

- Use architecture for BMad Method and Enterprise (both required)
- Focus on decisions, not documentation volume
- Enterprise: Add optional extended workflows (test/security/devops) after architecture
- Always run gate check before implementation

---

## Related Documentation

- [Phase 2: Planning Workflows](./workflows-planning.md) - Previous phase
- [Phase 4: Implementation Workflows](./workflows-implementation.md) - Next phase
- [Scale Adaptive System](./scale-adaptive-system.md) - Understanding tracks
- [Agents Guide](./agents-guide.md) - Complete agent reference

---

## Troubleshooting

**Q: Do I always need architecture?**
A: No. Quick Flow skips it. BMad Method and Enterprise both require it.

**Q: How do I know if I need architecture?**
A: If you chose BMad Method or Enterprise track in planning (workflow-init), you need architecture to prevent agent conflicts.

**Q: What's the difference between architecture and tech-spec?**
A: Tech-spec is implementation-focused for simple changes. Architecture is system design for complex multi-epic projects.

**Q: Can I skip gate check?**
A: Only for Quick Flow. BMad Method and Enterprise both require gate check before Phase 4.

**Q: What if gate check fails?**
A: Resolve the identified gaps (missing architecture sections, conflicting requirements) and re-run gate check.

**Q: How long should architecture take?**
A: BMad Method: 1-2 days for architecture. Enterprise: 2-3 days total (1-2 days architecture + 0.5-1 day optional extended workflows). If taking longer, you may be over-documenting.

**Q: Do ADRs need to be perfect?**
A: No. ADRs capture key decisions with rationale. They should be concise (1 page max per ADR).

**Q: Can I update architecture during implementation?**
A: Yes! Architecture is living. Update it as you learn. Use `correct-course` workflow for significant changes.

---

_Phase 3 Solutioning - Technical decisions before implementation._
