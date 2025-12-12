# BMM Planning Workflows (Phase 2)

## Overview

Phase 2 (Planning) workflows are **required** for all projects. They transform strategic vision into actionable requirements using a **scale-adaptive system** that automatically selects the right planning depth based on project complexity.

**Key principle:** One unified entry point (`workflow-init`) intelligently routes to the appropriate planning methodology - from quick tech-specs to comprehensive PRDs.

**When to use:** All projects require planning. The system adapts depth automatically based on complexity.

---

## Phase 2 Planning Workflow Overview

Phase 2 Planning uses a scale-adaptive system with three tracks:

### Quick Flow (Simple Planning)

- Entry: `workflow-init` routes based on project complexity
- Workflow: `tech-spec`
- Output: Technical document with story/epic structure
- Story count: 1-15 (typical)
- Next: Phase 4 (Implementation) - skips Phase 3

### BMad Method (Recommended)

- Entry: `workflow-init` routes based on project complexity
- Workflows: `prd` → (optional) `create-ux-design`
- Output: PRD with FRs/NFRs
- Story count: 10-50+ (typical)
- Next: Phase 3 (Solutioning) → Phase 4

### Enterprise Method

- Planning: Same as BMad Method (`prd` workflow)
- Solutioning: Extended Phase 3 workflows (Architecture + Security + DevOps)
- Story count: 30+ (typical)
- Next: Phase 4

The `correct-course` workflow can be used anytime for significant requirement changes.

---

## Quick Reference

| Workflow             | Agent       | Track                   | Purpose                                         | Typical Stories |
| -------------------- | ----------- | ----------------------- | ----------------------------------------------- | --------------- |
| **workflow-init**    | PM/Analyst  | All                     | Entry point: discovery + routing                | N/A             |
| **tech-spec**        | PM          | Quick Flow              | Technical document → Story or Epic+Stories      | 1-15            |
| **prd**              | PM          | BMad Method, Enterprise | Strategic PRD with FRs/NFRs (no epic breakdown) | 10-50+          |
| **create-ux-design** | UX Designer | BMad Method, Enterprise | Optional UX specification (after PRD)           | N/A             |
| **correct-course**   | PM/SM       | All                     | Mid-stream requirement changes                  | N/A             |

**Note:** Story counts are guidance. V6 improvement: Epic+Stories are created AFTER architecture for better quality.

---

## Scale-Adaptive Planning System

BMM uses three distinct planning tracks that adapt to project complexity:

### Track 1: Quick Flow

**Best For:** Bug fixes, simple features, clear scope, enhancements

**Planning:** Tech-spec only → Implementation

**Time:** Hours to 1 day

**Story Count:** Typically 1-15 (guidance)

**Documents:** tech-spec.md + story files

**Example:** "Fix authentication bug", "Add OAuth social login"

---

### Track 2: BMad Method (RECOMMENDED)

**Best For:** Products, platforms, complex features, multiple epics

**Planning:** PRD + Architecture → Implementation

**Time:** 1-3 days

**Story Count:** Typically 10-50+ (guidance)

**Documents:** PRD.md (FRs/NFRs) + architecture.md + epics.md + epic files

**Greenfield:** Product Brief (optional) → PRD (FRs/NFRs) → UX (optional) → Architecture → Epics+Stories → Implementation

**Brownfield:** document-project → PRD (FRs/NFRs) → Architecture (recommended) → Epics+Stories → Implementation

**Example:** "Customer dashboard", "E-commerce platform", "Add search to existing app"

**Why Architecture for Brownfield?** Distills massive codebase context into focused solution design for your specific project.

---

### Track 3: Enterprise Method

**Best For:** Enterprise requirements, multi-tenant, compliance, security-sensitive

**Planning (Phase 2):** Uses BMad Method planning (PRD with FRs/NFRs)

**Solutioning (Phase 3):** Extended workflows (Architecture + Security + DevOps + SecOps as optional additions) → Epics+Stories

**Time:** 3-7 days total (1-3 days planning + 2-4 days extended solutioning)

**Story Count:** Typically 30+ (but defined by enterprise needs)

**Documents Phase 2:** PRD.md (FRs/NFRs)

**Documents Phase 3:** architecture.md + epics.md + epic files + security-architecture.md (optional) + devops-strategy.md (optional) + secops-strategy.md (optional)

**Example:** "Multi-tenant SaaS", "HIPAA-compliant portal", "Add SOC2 audit logging"

---

## How Track Selection Works

`workflow-init` guides you through educational choice:

1. **Description Analysis** - Analyzes project description for complexity
2. **Educational Presentation** - Shows all three tracks with trade-offs
3. **Recommendation** - Suggests track based on keywords and context
4. **User Choice** - You select the track that fits

The system guides but never forces. You can override recommendations.

---

## Workflow Descriptions

### workflow-init (Entry Point)

**Purpose:** Single unified entry point for all planning. Discovers project needs and intelligently routes to appropriate track.

**Agent:** PM (orchestrates others as needed)

**Always Use:** This is your planning starting point. Don't call prd/tech-spec directly unless skipping discovery.

**Process:**

1. Discovery (understand context, assess complexity, identify concerns)
2. Routing Decision (determine track, explain rationale, confirm)
3. Execute Target Workflow (invoke planning workflow, pass context)
4. Handoff (document decisions, recommend next phase)

---

### tech-spec (Quick Flow)

**Purpose:** Lightweight technical specification for simple changes (Quick Flow track). Produces technical document and story or epic+stories structure.

**Agent:** PM

**When to Use:**

- Bug fixes
- Single API endpoint additions
- Configuration changes
- Small UI component additions
- Isolated validation rules

**Key Outputs:**

- **tech-spec.md** - Technical document containing:
  - Problem statement and solution
  - Source tree changes
  - Implementation details
  - Testing strategy
  - Acceptance criteria
- **Story file(s)** - Single story OR epic+stories structure (1-15 stories typically)

**Skip To Phase:** 4 (Implementation) - no Phase 3 architecture needed

**Example:** "Fix null pointer when user has no profile image" → Single file change, null check, unit test, no DB migration.

---

### prd (Product Requirements Document)

**Purpose:** Strategic PRD with Functional Requirements (FRs) and Non-Functional Requirements (NFRs) for software products (BMad Method track).

**Agent:** PM (with Architect and Analyst support)

**When to Use:**

- Medium to large feature sets
- Multi-screen user experiences
- Complex business logic
- Multiple system integrations
- Phased delivery required

**Scale-Adaptive Structure:**

- **Light:** Focused FRs/NFRs, simplified analysis (10-15 pages)
- **Standard:** Comprehensive FRs/NFRs, thorough analysis (20-30 pages)
- **Comprehensive:** Extensive FRs/NFRs, multi-phase, stakeholder analysis (30-50+ pages)

**Key Outputs:**

- PRD.md (complete requirements with FRs and NFRs)

**Note:** V6 improvement - PRD focuses on WHAT to build (requirements). Epic+Stories are created AFTER architecture via `create-epics-and-stories` workflow for better quality.

**Integration:** Feeds into Architecture (Phase 3)

**Example:** E-commerce checkout → PRD with 15 FRs (user account, cart management, payment flow) and 8 NFRs (performance, security, scalability).

---

### create-ux-design (UX Design)

**Purpose:** UX specification for projects where user experience is the primary differentiator (BMad Method track).

**Agent:** UX Designer

**When to Use:**

- UX is primary competitive advantage
- Complex user workflows needing design thinking
- Innovative interaction patterns
- Design system creation
- Accessibility-critical experiences

**Collaborative Approach:**

1. Visual exploration (generate multiple options)
2. Informed decisions (evaluate with user needs)
3. Collaborative design (refine iteratively)
4. Living documentation (evolves with project)

**Key Outputs:**

- ux-spec.md (complete UX specification)
- User journeys
- Wireframes and mockups
- Interaction specifications
- Design system (components, patterns, tokens)
- Epic breakdown (UX stories)

**Integration:** Feeds PRD or updates epics, then Architecture (Phase 3)

**Example:** Dashboard redesign → Card-based layout with split-pane toggle, 5 card components, 12 color tokens, responsive grid, 3 epics (Layout, Visualization, Accessibility).

---

### correct-course

**Purpose:** Handle significant requirement changes during implementation (all tracks).

**Agent:** PM, Architect, or SM

**When to Use:**

- Priorities change mid-project
- New requirements emerge
- Scope adjustments needed
- Technical blockers require replanning

**Process:**

1. Analyze impact of change
2. Propose solutions (continue, pivot, pause)
3. Update affected documents (PRD, epics, stories)
4. Re-route for implementation

**Integration:** Updates planning artifacts, may trigger architecture review

---

## Decision Guide

### Which Planning Workflow?

**Use `workflow-init` (Recommended):** Let the system discover needs and route appropriately.

**Direct Selection (Advanced):**

- **Bug fix or single change** → `tech-spec` (Quick Flow)
- **Software product** → `prd` (BMad Method)
- **UX innovation project** → `create-ux-design` + `prd` (BMad Method)
- **Enterprise with compliance** → Choose track in `workflow-init` → Enterprise Method

---

## Integration with Phase 3 (Solutioning)

Planning outputs feed into Solutioning:

| Planning Output | Solutioning Input                  | Track Decision               |
| --------------- | ---------------------------------- | ---------------------------- |
| tech-spec.md    | Skip Phase 3 → Phase 4 directly    | Quick Flow (no architecture) |
| PRD.md          | **architecture** (Level 3-4)       | BMad Method (recommended)    |
| ux-spec.md      | **architecture** (frontend design) | BMad Method                  |
| Enterprise docs | **architecture** + security/ops    | Enterprise Method (required) |

**Key Decision Points:**

- **Quick Flow:** Skip Phase 3 entirely → Phase 4 (Implementation)
- **BMad Method:** Optional Phase 3 (simple), Required Phase 3 (complex)
- **Enterprise:** Required Phase 3 (architecture + extended planning)

See: [workflows-solutioning.md](./workflows-solutioning.md)

---

## Best Practices

### 1. Always Start with workflow-init

Let the entry point guide you. It prevents over-planning simple features or under-planning complex initiatives.

### 2. Trust the Recommendation

If `workflow-init` suggests BMad Method, there's likely complexity you haven't considered. Review carefully before overriding.

### 3. Iterate on Requirements

Planning documents are living. Refine PRDs as you learn during Solutioning and Implementation.

### 4. Involve Stakeholders Early

Review PRDs with stakeholders before Solutioning. Catch misalignment early.

### 5. Focus on "What" Not "How"

Planning defines **what** to build and **why**. Leave **how** (technical design) to Phase 3 (Solutioning).

### 6. Document-Project First for Brownfield

Always run `document-project` before planning brownfield projects. AI agents need existing codebase context.

---

## Common Patterns

### Greenfield Software (BMad Method)

```
1. (Optional) Analysis: product-brief, research
2. workflow-init → routes to prd
3. PM: prd workflow
4. (Optional) UX Designer: create-ux-design workflow
5. → Phase 3: architecture
```

### Brownfield Software (BMad Method)

```
1. Technical Writer or Analyst: document-project
2. workflow-init → routes to prd
3. PM: prd workflow
4. → Phase 3: architecture (recommended for focused solution design)
```

### Bug Fix (Quick Flow)

```
1. workflow-init → routes to tech-spec
2. PM: tech-spec workflow
3. → Phase 4: Implementation (skip Phase 3)
```

### Enterprise Project (Enterprise Method)

```
1. (Recommended) Analysis: research (compliance, security)
2. workflow-init → routes to Enterprise Method
3. PM: prd workflow
4. (Optional) UX Designer: ux workflow
5. PM: create-epics-and-stories
6. → Phase 3: architecture + security + devops + test strategy
```

---

## Common Anti-Patterns

### ❌ Skipping Planning

"We'll just start coding and figure it out."
**Result:** Scope creep, rework, missed requirements

### ❌ Over-Planning Simple Changes

"Let me write a 20-page PRD for this button color change."
**Result:** Wasted time, analysis paralysis

### ❌ Planning Without Discovery

"I already know what I want, skip the questions."
**Result:** Solving wrong problem, missing opportunities

### ❌ Treating PRD as Immutable

"The PRD is locked, no changes allowed."
**Result:** Ignoring new information, rigid planning

### ✅ Correct Approach

- Use scale-adaptive planning (right depth for complexity)
- Involve stakeholders in review
- Iterate as you learn
- Keep planning docs living and updated
- Use `correct-course` for significant changes

---

## Related Documentation

- [Phase 1: Analysis Workflows](./workflows-analysis.md) - Optional discovery phase
- [Phase 3: Solutioning Workflows](./workflows-solutioning.md) - Next phase
- [Phase 4: Implementation Workflows](./workflows-implementation.md)
- [Scale Adaptive System](./scale-adaptive-system.md) - Understanding the three tracks
- [Quick Spec Flow](./quick-spec-flow.md) - Quick Flow track details
- [Agents Guide](./agents-guide.md) - Complete agent reference

---

## Troubleshooting

**Q: Which workflow should I run first?**
A: Run `workflow-init`. It analyzes your project and routes to the right planning workflow.

**Q: Do I always need a PRD?**
A: No. Simple changes use `tech-spec` (Quick Flow). Only BMad Method and Enterprise tracks create PRDs.

**Q: Can I skip Phase 3 (Solutioning)?**
A: Yes for Quick Flow. Optional for BMad Method (simple projects). Required for BMad Method (complex projects) and Enterprise.

**Q: How do I know which track to choose?**
A: Use `workflow-init` - it recommends based on your description. Story counts are guidance, not definitions.

**Q: What if requirements change mid-project?**
A: Run `correct-course` workflow. It analyzes impact and updates planning artifacts.

**Q: Do brownfield projects need architecture?**
A: Recommended! Architecture distills massive codebase into focused solution design for your specific project.

**Q: When do I run create-epics-and-stories?**
A: In Phase 3 (Solutioning), after architecture is complete.

**Q: Should I use product-brief before PRD?**
A: Optional but recommended for greenfield. Helps strategic thinking. `workflow-init` offers it based on context.

---

_Phase 2 Planning - Scale-adaptive requirements for every project._
