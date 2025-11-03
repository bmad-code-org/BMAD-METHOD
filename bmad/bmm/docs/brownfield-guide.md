# BMad Method Brownfield Development Guide

## Overview

This guide provides comprehensive guidance for using BMad Method v6 with existing codebases (brownfield projects). Whether you're fixing a single bug, adding a small feature, or implementing a major system expansion, BMad Method adapts to your project's complexity while ensuring AI agents have the context they need to work effectively.

**Core Principle:** In brownfield development, producing contextual artifacts for agents is paramount. AI agents require comprehensive documentation to understand existing patterns, constraints, and integration points before they can effectively plan or implement changes.

## What is Brownfield Development?

Brownfield projects involve working within existing codebases rather than starting fresh. This includes:

- **Bug fixes** - Single file changes to resolve issues
- **Small features** - Adding functionality to existing modules
- **Feature sets** - Multiple related features across several areas
- **Major integrations** - Complex additions requiring architectural changes
- **System expansions** - Enterprise-scale enhancements to existing platforms

The key difference from greenfield development: you must understand and respect existing patterns, architecture, and constraints.

## Scale-Adaptive Workflow System

BMad Method v6 uses a **scale-adaptive** approach that automatically routes brownfield projects through appropriate workflows based on complexity:

### Brownfield Complexity Levels

| Level | Scope                  | Story Count   | Workflow Approach                        | Documentation Depth                                    |
| ----- | ---------------------- | ------------- | ---------------------------------------- | ------------------------------------------------------ |
| **0** | Single atomic change   | 1 story       | Lightweight tech-spec only               | Quick understanding of affected area                   |
| **1** | Small feature addition | 1-10 stories  | Tech-spec with epic breakdown            | Focused documentation of integration points            |
| **2** | Medium feature set     | 5-15 stories  | PRD + tech-spec                          | Comprehensive docs for affected systems                |
| **3** | Complex integration    | 12-40 stories | PRD → architecture → implementation      | Full system documentation + integration planning       |
| **4** | Enterprise expansion   | 40+ stories   | Full methodology with strategic planning | Complete codebase documentation + architectural review |

### How Scale Determination Works

When you run `workflow-init`, it asks about YOUR work first, then uses existing artifacts as context:

#### Step 1: Understand What You're Working On

The workflow asks you first:

1. **Project name**: "What's your project called?"

2. **If it finds existing work** (code or planning documents):
   - Shows what it found (PRD, epics, stories, codebase)
   - Asks a clear question:

> **"Looking at what I found, are these:**
>
> a) **Works in progress you're finishing** - continuing the work described in these documents
> b) **Documents from a previous effort** - you're starting something NEW and different now
> c) **The proposed work you're about to start** - these describe what you want to do
> d) **None of these** - let me explain what I'm actually working on"

**If you choose (a) or (c):** System analyzes the artifacts to get project details
**If you choose (b) or (d):** System asks you to describe your NEW work

3. **Asks about your work**: "Tell me about what you're working on. What's the goal?"

4. **Analyzes your description** using keyword detection:

**Level 0 Keywords:** "fix", "bug", "typo", "small change", "update", "patch"
**Level 1 Keywords:** "simple", "basic", "small feature", "add", "minor"
**Level 2 Keywords:** "dashboard", "several features", "admin panel", "medium"
**Level 3 Keywords:** "platform", "integration", "complex", "system"
**Level 4 Keywords:** "enterprise", "multi-tenant", "multiple products", "ecosystem"

**Examples:**

- "I need to update payment method enums" → **Level 0**
- "Adding forgot password feature" → **Level 1**
- "Building admin dashboard with analytics" → **Level 2**
- "Adding real-time collaboration to document editor" → **Level 3**
- "Implementing multi-tenancy across our SaaS" → **Level 4**

5. **Suggests and confirms**: "Based on your description: Level X brownfield project. Is that correct?"

#### How It Handles Old Artifacts

**Scenario: Old Level 3 PRD, New Level 0 Work**

```
System: "I found: PRD.md (Level 3, 30 stories, modified 6 months ago)"
System: "Are these works in progress you're finishing, or documents from a previous effort?"

You: "b - Documents from a previous effort"

System: "Tell me about what you're working on"
You: "I need to update payment method enums"

System: "Level 0 brownfield project. Is that correct?"
You: "yes"

✅ Result: Level 0 workflow
```

**Key Principle:** The system asks about YOUR current work first, then uses old artifacts as context, not as the primary source of truth.

## The Five Phases of Brownfield Development

### Phase 0: Documentation (Conditional)

Phase 0 has three possible scenarios based on your existing documentation state:

#### Scenario A: No Documentation

**When:** Codebase lacks adequate documentation for AI agents
**Action:** Run `document-project` workflow to create comprehensive documentation from scratch

#### Scenario B: Documentation Exists, But No Index

**When:** You have README, architecture docs, or other documentation BUT no `index.md` (master AI retrieval source)
**Action:** Run the `index-docs` task to generate `index.md` from existing documentation

**The `index-docs` Task** (from `bmad/core/tasks/index-docs.xml`):

- Scans your documentation directory
- Reads each file to understand its purpose
- Creates organized `index.md` with file listings and descriptions
- Provides structured navigation for AI agents
- Lightweight and fast (just indexes, doesn't scan codebase)

**Why This Matters:** The `index.md` file is the primary entry point for AI agents. Without it, agents must hunt through multiple files. Even with good existing docs, the index provides structured navigation and ensures agents can quickly find relevant context.

**When to Use `document-project` Instead:**
If your existing docs are inadequate or you need comprehensive codebase analysis:

- Use `document-project` workflow with appropriate scan level (deep/exhaustive)
- It will discover your existing docs in Step 2 and show them to you
- It will generate NEW documentation from codebase analysis
- Final `index.md` will link to BOTH existing docs AND newly generated docs
- Result: Comprehensive documentation combining your existing docs with AI-friendly codebase analysis

#### Scenario C: Complete Documentation with Index

**When:** You have comprehensive documentation including `docs/index.md`
**Action:** Skip Phase 0 entirely and proceed to Phase 1 or Phase 2

#### The `document-project` Workflow

This critical workflow analyzes and documents your existing codebase:

**What It Does:**

- Detects project type (web, backend, mobile, CLI, etc.)
- Identifies tech stack and dependencies
- Analyzes architecture patterns
- Documents API routes and data models
- Maps component structure
- Extracts development workflows
- **NEW:** Can incorporate existing documentation and generate master index

**Three Scan Levels:**

1. **Quick Scan** (2-5 min) - Pattern-based analysis without reading source
   - Use for: Fast project overview, initial understanding, index generation
   - Reads: Config files, manifests, directory structure, existing docs

2. **Deep Scan** (10-30 min) - Reads critical directories
   - Use for: Brownfield PRD preparation, focused analysis
   - Reads: Key paths based on project type (controllers, models, components)
   - Incorporates: Existing documentation as input

3. **Exhaustive Scan** (30-120 min) - Reads ALL source files
   - Use for: Migration planning, complete system understanding
   - Reads: Every source file (excludes node_modules, dist, .git)
   - Incorporates: All existing documentation

**Output Files:**

- `index.md` - Master documentation index (primary AI retrieval source)
- `project-overview.md` - Executive summary
- `architecture.md` - Detailed architecture analysis
- `source-tree-analysis.md` - Annotated directory structure
- `api-contracts.md` - API documentation (if applicable)
- `data-models.md` - Database schemas (if applicable)
- Additional conditional files based on project type

**Working with Existing Documentation:**

If you have existing docs (README, ARCHITECTURE.md, CONTRIBUTING.md, etc.) you have two options:

**Option 1: Just need an index (`index-docs` task)**

- Fast, lightweight approach
- Run the `index-docs` task from `bmad/core/tasks/index-docs.xml`
- Scans your docs directory and generates organized `index.md`
- Reads each file to create accurate descriptions
- Links to all existing documentation
- Perfect when docs are good but need structured navigation for AI agents

**Option 2: Need comprehensive codebase documentation (`document-project` workflow)**

- Scans the actual codebase to generate technical documentation
- Discovers existing docs (README, ARCHITECTURE.md, etc.) in Step 2
- Shows you what it found and asks for additional context
- Generates NEW documentation files from codebase analysis:
  - `project-overview.md` - Executive summary from codebase
  - `architecture.md` - Architecture analysis from code
  - `api-contracts.md` - API documentation from routes/controllers
  - `data-models.md` - Database schemas from models
  - `source-tree-analysis.md` - Annotated directory structure
- Creates `index.md` that links to BOTH existing docs AND newly generated docs
- Complements your existing documentation with AI-friendly codebase analysis

**Deep-Dive Mode:** If you already have documentation but need exhaustive analysis of a specific area (e.g., authentication system, dashboard module), you can run the workflow in deep-dive mode to create comprehensive documentation for just that subsystem.

**Example Usage:**

```bash
# Scenario A: No documentation
bmad analyst workflow-status
# → Directs to document-project
bmad analyst document-project
# → Choose: Deep scan (recommended for brownfield)

# Scenario B: Has docs but no index
# Option 1: Just generate index from existing docs
# Run the index-docs task directly (lightweight, fast)
# Load bmad/core/tasks/index-docs.xml
# Specify your docs directory (e.g., ./docs)

# Option 2: Need comprehensive codebase docs too
bmad analyst document-project
# → Choose: Deep or Exhaustive scan
# → Creates index.md AND additional codebase documentation

# Scenario C: Complete with index
bmad analyst workflow-status
# → Skips Phase 0, proceeds to Phase 1 or 2
```

### Phase 1: Analysis (Optional)

**Purpose:** Explore solutions and gather context before formal planning.

**Available Workflows:**

- `brainstorm-project` - Solution exploration for new features
- `research` - Market/technical research for decision-making
- `product-brief` - Strategic product planning document

**When to Use:**

- Complex features requiring multiple solution approaches
- Technical decisions needing research (frameworks, patterns, tools)
- Strategic additions requiring business context

**When to Skip:**

- Bug fixes or minor changes with obvious solutions
- Well-understood features with clear requirements
- Time-sensitive changes where planning overhead isn't justified

### Phase 2: Planning (Required)

**Purpose:** Create formal requirements and break down work into epics and stories.

The planning approach adapts to your brownfield project's complexity:

#### Level 0: Single Atomic Change

**Workflow:** `tech-spec` only
**Outputs:** `tech-spec.md` + single story file
**Next Phase:** → Implementation (Phase 4)

**Use For:**

- Bug fixes
- Single file changes
- Minor configuration updates
- Small refactors

**Key Considerations:**

- Must understand existing pattern in affected file
- Document integration points
- Identify potential side effects

**Example:** Fixing authentication token expiration bug in auth middleware

#### Level 1: Small Feature

**Workflow:** `tech-spec` only
**Outputs:** `tech-spec.md` + epic breakdown + 2-10 story files
**Next Phase:** → Implementation (Phase 4)

**Use For:**

- Single module additions
- Small UI enhancements
- Isolated feature additions
- API endpoint additions

**Key Considerations:**

- Identify reusable existing components
- Respect current architectural patterns
- Plan integration with existing APIs/services

**Example:** Adding "forgot password" feature to existing auth system

#### Level 2: Medium Feature Set

**Workflow:** `prd` → `tech-spec`
**Outputs:** `PRD.md` + `epics.md` + `tech-spec.md`
**Next Phase:** → Implementation (Phase 4)

**Use For:**

- Multiple related features
- Cross-module enhancements
- Moderate scope additions
- Feature sets spanning 1-2 areas

**Key Considerations:**

- Document all integration points
- Map dependencies to existing systems
- Identify shared components for reuse
- Plan migration strategy if changing patterns

**Special Note:** Level 2 uses `tech-spec` instead of full architecture workflow to keep planning lightweight while still providing adequate technical guidance.

**Example:** Adding user dashboard with analytics, preferences, and activity history

#### Level 3: Complex Integration

**Workflow:** `prd` → `create-architecture` → implementation
**Outputs:** `PRD.md` + `epics.md` + `architecture.md` (extension of existing)
**Next Phase:** → Solutioning (Phase 3) → Implementation (Phase 4)

**Use For:**

- Major feature additions
- Architectural integrations
- Multi-system changes
- Complex data migrations

**Key Considerations:**

- Review existing architecture first
- Plan integration strategy
- Document architectural extensions
- Identify migration paths
- Plan backward compatibility

**Phase 3 Workflows:**

- `architecture-review` - Review existing architecture first
- `integration-planning` - Create integration strategy document
- `create-architecture` - Extend existing architecture documentation
- `solutioning-gate-check` - Validate architecture before implementation

**Example:** Adding real-time collaboration features to existing document editor

#### Level 4: Enterprise Expansion

**Workflow:** Full methodology with strategic analysis
**Outputs:** Product brief → PRD → comprehensive architecture → phased implementation
**Next Phase:** → Solutioning (Phase 3) → Implementation (Phase 4)

**Use For:**

- Platform expansions
- Multi-team initiatives
- System-wide modernization
- Major architectural shifts

**Key Considerations:**

- Comprehensive codebase documentation required (Phase 0)
- Deep architectural review mandatory
- Backward compatibility strategy
- Phased rollout planning
- Feature flag implementation
- Migration strategy for existing data/users
- Cross-team coordination

**Critical for Enterprise:**

- Documentation phase is nearly mandatory
- Analysis phase (research, product brief) recommended
- Full architecture review before planning
- Extensive integration testing strategy
- Risk assessment and mitigation planning

**Example:** Adding multi-tenancy to existing single-tenant SaaS platform

### Phase 3: Solutioning (Levels 2-4)

**Purpose:** Design architectural extensions and integration strategy.

**Workflows Available:**

| Workflow                 | Level | Purpose                              | Output                    |
| ------------------------ | ----- | ------------------------------------ | ------------------------- |
| `architecture-review`    | 3-4   | Review existing architecture         | Analysis document         |
| `integration-planning`   | 3-4   | Plan integration approach            | Integration strategy      |
| `create-architecture`    | 2-4   | Extend architecture documentation    | architecture.md (updated) |
| `validate-architecture`  | 2-4   | Validate design decisions            | Validation report         |
| `solutioning-gate-check` | 3-4   | Final approval before implementation | Gate check report         |

**Critical Differences from Greenfield:**

- You're **extending** existing architecture, not creating from scratch
- Must document **integration points** explicitly
- Need **migration strategy** for any pattern changes
- Require **backward compatibility** considerations
- Should plan **feature flags** for gradual rollout

**Architecture Extensions Should Include:**

- How new components integrate with existing systems
- Data flow between new and existing modules
- API contract changes (if any)
- Database schema changes and migration strategy
- Security implications and authentication integration
- Performance impact on existing functionality

### Phase 4: Implementation (Iterative)

**Purpose:** Transform plans into working code through sprint-based iteration.

#### The Sprint Planning Entry Point

Phase 4 begins with the `sprint-planning` workflow:

**What It Does:**

1. Extracts all epics and stories from epic files
2. Creates `sprint-status.yaml` - single source of truth for tracking
3. Auto-detects existing story files and contexts
4. Maintains status through development lifecycle

**Run sprint-planning:**

- Initially after Phase 2 or Phase 3 completion
- After creating epic contexts
- Periodically to sync with file system
- To check overall progress

#### The Implementation Loop

```
Phase Transition → sprint-planning
                       ↓
                 epic-tech-context (per epic)
                       ↓
    ┌──────────────────┴──────────────────┐
    │                                      │
    ↓                                      ↓
create-story → story-context → dev-story → code-review
    │              │               │            │
    ↓              ↓               ↓            ↓
 drafted    ready-for-dev    in-progress     review
                                   │            │
                                   └────→───────┘
                                         ↓
                                       done
                                         │
                              [epic complete?]
                                         ↓
                                  retrospective
```

#### Status State Machine

**Epic Status:**

```
backlog → contexted
```

**Story Status:**

```
backlog → drafted → ready-for-dev → in-progress → review → done
```

#### Phase 4 Workflows

| Workflow            | Agent | Purpose                         | Status Update                               |
| ------------------- | ----- | ------------------------------- | ------------------------------------------- |
| `sprint-planning`   | SM    | Initialize sprint tracking      | Creates sprint-status.yaml                  |
| `epic-tech-context` | SM    | Create epic technical context   | Epic: backlog → contexted                   |
| `create-story`      | SM    | Draft individual story          | Story: backlog → drafted                    |
| `story-context`     | SM    | Generate implementation context | Story: drafted → ready-for-dev              |
| `dev-story`         | DEV   | Implement story                 | Story: ready-for-dev → in-progress → review |
| `code-review`       | SM/SR | Quality validation              | Manual state management                     |
| `retrospective`     | SM    | Capture epic learnings          | Retrospective: optional → completed         |
| `correct-course`    | SM    | Handle issues/scope changes     | Adaptive based on situation                 |

#### Brownfield-Specific Implementation Considerations

1. **Respect Existing Patterns**
   - Use existing coding conventions
   - Follow established architectural approaches
   - Maintain consistency with current UI/UX patterns
   - Preserve team preferences and standards

2. **Integration Testing is Critical**
   - Test interactions with existing functionality
   - Validate API contracts remain unchanged (unless intentionally versioned)
   - Check for regression in existing features
   - Verify performance impact on legacy components

3. **Gradual Rollout Strategy**
   - Implement feature flags for new functionality
   - Plan rollback strategy
   - Support backward compatibility
   - Consider migration scripts for data/schema changes

4. **Context Injection**
   - `epic-tech-context`: Provides technical guidance specific to epic scope
   - `story-context`: Generates implementation context for each story
   - Both reference existing codebase patterns and integration points
   - Ensures developers have exact expertise needed for each task

## Workflow Routing by Level

### Visual Decision Tree

```
Start → workflow-status
           ↓
    [Has documentation?]
           ↓
      No ─→ document-project → [Choose scan level]
      Yes ↓
           ↓
    [Complexity level?]
           ↓
    ┌──────┴──────┬──────┬──────┬──────┐
    ↓             ↓      ↓      ↓      ↓
  Level 0      Level 1  Level 2  Level 3  Level 4
    ↓             ↓         ↓       ↓        ↓
tech-spec    tech-spec    prd     prd      prd
    ↓             ↓         ↓       ↓        ↓
    └─────────────┴─────────┤       ├────────┘
                            ↓       ↓
                      tech-spec   create-architecture
                            ↓       ↓
                            └───────┤
                                    ↓
                            sprint-planning
                                    ↓
                          Implementation Loop
```

### Path Files

The v6 system uses modular path definitions for each brownfield level:

**Location:** `/src/modules/bmm/workflows/workflow-status/paths/`

- `brownfield-level-0.yaml` - Single atomic change path
- `brownfield-level-1.yaml` - Small feature path
- `brownfield-level-2.yaml` - Medium project path
- `brownfield-level-3.yaml` - Complex integration path
- `brownfield-level-4.yaml` - Enterprise expansion path

Each path file clearly defines:

- Required vs optional workflows for each phase
- Agent assignments
- Expected outputs
- Integration notes

## Universal Entry Points

### `workflow-status` - Your Command Center

**Always start here.** This workflow:

- Checks for existing workflow status file
- Displays current phase and progress
- Shows next recommended action
- Routes to appropriate workflows based on context

**For New Projects:**

- Detects missing status file
- Directs to `workflow-init`
- Guides through project setup

**For Existing Projects:**

- Displays current phase and progress
- Shows Phase 4 implementation state
- Recommends exact next action
- Offers to change workflow if needed

**Example Usage:**

```bash
bmad analyst workflow-status
```

### `workflow-init` - Smart Initialization

If you don't have a status file, this workflow initializes your project workflow by asking about YOUR work first, then using artifacts as context:

**Step 1: Quick Scan (Context Only)**

- Checks for existing code (`src/`, package files, `.git`)
- Checks for planning artifacts (PRD, epics, stories, architecture docs)
- Does NOT analyze in depth yet - just sees what's there

**Step 2: Ask About YOUR Work**

Asks: "What's your project called?"

Then, if it found existing work, shows what it found and asks:

> **"Looking at what I found, are these:**
>
> a) Works in progress you're finishing
> b) Documents from a previous effort (you're doing something NEW now)
> c) The proposed work you're about to start
> d) None of these - let me explain"

**Your Paths:**

- **Choose (a) or (c):** System analyzes the artifacts to determine level
- **Choose (b) or (d):** System asks you to describe your NEW work

**Step 3: Determine Level**

If continuing old work: Counts stories from artifacts
If new work: Asks "Tell me about what you're working on" and uses keyword detection

Then confirms: "Level X brownfield project. Is that correct?"

**Step 4: Create Workflow**

- Loads appropriate path file: `brownfield-level-{0-4}.yaml`
- Generates workflow with all phases and workflows
- Creates status file

**Example: Old Level 3 PRD, New Level 0 Work**

```
System: "What's your project called?"
You: "PaymentApp"

System: "I found: PRD.md (Level 3, 30 stories, 6mo ago), src/ codebase"
System: "Are these works in progress, previous effort, or proposed work?"

You: "b - Previous effort"

System: "Tell me about what you're working on"
You: "I need to update payment method enums"

System: "Level 0 brownfield project. Is that correct?"
You: "yes"

✅ Creates Level 0 workflow
```

**Smart Features:**

- Asks about YOUR work first
- Uses artifacts as context, not primary source
- Keyword detection: "fix", "update" → Level 0
- Handles scaffolds: "Just a starter" → still greenfield
- Flags missing documentation automatically

## Key Artifacts in Brownfield Projects

### Tracking Documents

**`bmm-workflow-status.md`** (Phases 0-3)

- Current phase and progress
- Workflow history
- Next recommended actions
- Project metadata

**`sprint-status.yaml`** (Phase 4 only)

- All epics, stories, retrospectives
- Current status for each item
- Single source of truth for implementation
- Updated by agents as work progresses

### Planning Documents

**Level 0-1:**

- `tech-spec.md` - Technical specification
- `story-{key}.md` - Story files

**Level 2:**

- `PRD.md` - Product requirements
- `epics.md` - Epic breakdown
- `tech-spec.md` - Technical specification

**Level 3-4:**

- `PRD.md` - Product requirements
- `epics.md` - Epic breakdown
- `architecture.md` - Architecture extensions
- Integration and validation reports

### Implementation Documents

**Phase 4 Artifacts:**

- `sprint-status.yaml` - Status tracking
- `epic-{n}-context.md` - Epic technical contexts
- `stories/` directory:
  - `{epic}-{story}-{title}.md` - Story definitions
  - `{epic}-{story}-{title}-context.md` - Implementation contexts

## Best Practices for Brownfield Success

### 1. Always Document First

Even if you know the codebase well, AI agents need comprehensive context. Run `document-project` with appropriate scan level before planning.

**Why:** AI discovers undocumented patterns, integration points, and constraints that humans might overlook or take for granted.

**Important:** Even if you have good documentation (README, ARCHITECTURE.md, etc.), you still need `docs/index.md` as the master AI retrieval source. If you have docs but no index:

- **Quick fix:** Run the `index-docs` task (lightweight, just creates index)
- **Comprehensive:** Use `document-project` with Deep scan to create index AND enhance docs
- The index provides structured navigation for AI agents

### 2. Be Specific About Your Current Work

When `workflow-init` asks about your work, be specific about what you're doing NOW:

**Good descriptions:**

- "I need to update payment method enums to include Apple Pay"
- "Adding forgot password feature to existing auth system"
- "Building admin dashboard with analytics and user management"

**Why this matters:** The system uses your description to suggest the right complexity level. Clear, specific descriptions lead to accurate routing through appropriate workflows.

### 3. Choose the Right Documentation Approach

**For existing docs without index:**

- Use `index-docs` task - fast, lightweight, just generates index
- Located at `bmad/core/tasks/index-docs.xml`

**For comprehensive codebase documentation:**

- Use `document-project` workflow with appropriate scan level:
  - **Quick:** Fast overview, planning next steps
  - **Deep:** Brownfield PRD preparation (most common)
  - **Exhaustive:** Migration planning, complete understanding

### 4. Respect Existing Patterns

The brownfield templates identify:

- Current coding conventions
- Architectural approaches
- Technology constraints
- Team preferences

**Always preserve these unless explicitly modernizing them.**

### 5. Plan Integration Points Explicitly

Document in your tech-spec or architecture:

- Which existing modules you'll modify
- What APIs/services you'll integrate with
- How data flows between new and existing code
- What shared components you'll reuse

### 6. Design for Gradual Rollout

Brownfield changes should support:

- Feature flags for new functionality
- Rollback strategies
- Backward compatibility
- Migration scripts (if needed)

### 7. Test Integration Thoroughly

Use the Test Architect (TEA) workflows:

- `test-design` - Plan integration test strategy
- `test-review` - Validate test coverage
- `nfr-assess` - Check performance/security impact

**Critical for Brownfield:**

- Regression testing of existing features
- Integration point validation
- Performance impact assessment
- API contract verification

### 8. Use Sprint Planning Effectively

- Run `sprint-planning` at Phase 4 start
- Context epics before drafting stories
- Update `sprint-status.yaml` as work progresses
- Re-run sprint-planning to sync with file system

### 9. Leverage Context Injection

- Run `epic-tech-context` before story drafting
- Always create `story-context` before implementation
- These workflows reference existing patterns for consistency

### 10. Learn Continuously

- Run `retrospective` after each epic
- Incorporate learnings into next story drafts
- Update patterns discovered during development
- Share insights across team

## Common Brownfield Scenarios

### Scenario 1: Bug Fix (Level 0)

**Situation:** Authentication token expiration causing logout issues

**Workflow:**

1. `workflow-status` → detects brownfield, suggests Level 0
2. Skip Phase 0 if auth system is documented
3. `tech-spec` → analyzes bug, plans fix, creates single story
4. `sprint-planning` → creates sprint status
5. `dev-story` → implement fix
6. `code-review` → validate fix + test regression

**Time:** ~2-4 hours total

### Scenario 2: Small Feature (Level 1)

**Situation:** Add "forgot password" to existing auth system

**Workflow:**

1. `workflow-status` → suggests Level 1
2. Phase 0: `document-project` (deep scan of auth module if not documented)
3. Phase 1: Optional - skip if requirements are clear
4. Phase 2: `tech-spec` → creates epic with 3-5 stories
5. Phase 4: `sprint-planning` → `create-story` → `dev-story` → repeat

**Time:** 1-3 days

### Scenario 3: Feature Set (Level 2)

**Situation:** Add user dashboard with analytics, preferences, activity

**Workflow:**

1. `workflow-status` → suggests Level 2
2. Phase 0: `document-project` (deep scan) - critical for understanding existing UI patterns
3. Phase 1: `research` (if evaluating analytics libraries)
4. Phase 2: `prd` → `tech-spec`
5. Phase 4: Sprint-based implementation (10-15 stories)

**Time:** 1-2 weeks

### Scenario 4: Complex Integration (Level 3)

**Situation:** Add real-time collaboration to document editor

**Workflow:**

1. `workflow-status` → suggests Level 3
2. Phase 0: `document-project` (exhaustive if not documented)
3. Phase 1: `research` (WebSocket vs WebRTC vs CRDT)
4. Phase 2: `prd` → creates requirements + epics
5. Phase 3:
   - `architecture-review` → understand existing editor architecture
   - `integration-planning` → plan WebSocket integration strategy
   - `create-architecture` → extend architecture for real-time layer
   - `solutioning-gate-check` → validate before implementation
6. Phase 4: Sprint-based implementation (20-30 stories)

**Time:** 3-6 weeks

### Scenario 5: Enterprise Expansion (Level 4)

**Situation:** Add multi-tenancy to single-tenant SaaS platform

**Workflow:**

1. `workflow-status` → suggests Level 4
2. Phase 0: `document-project` (exhaustive) - **mandatory**
3. Phase 1: **Required**
   - `brainstorm-project` → explore multi-tenancy approaches
   - `research` → database sharding, tenant isolation, pricing models
   - `product-brief` → strategic document
4. Phase 2: `prd` → comprehensive requirements
5. Phase 3:
   - `architecture-review` → full existing system review
   - `integration-planning` → phased migration strategy
   - `create-architecture` → multi-tenancy architecture
   - `validate-architecture` → external review
   - `solutioning-gate-check` → executive approval
6. Phase 4: Phased sprint-based implementation (50+ stories)

**Time:** 3-6 months

## Troubleshooting Common Issues

### Issue: AI Lacks Codebase Understanding

**Symptoms:**

- Generated plans don't align with existing patterns
- Suggestions ignore available components
- Integration approaches miss existing APIs

**Solution:**

1. Run `document-project` with deep or exhaustive scan
2. Review `index.md` - ensure it captures key systems
3. If specific area is unclear, run deep-dive mode on that area
4. Provide additional context in PRD about existing systems

### Issue: Have Documentation But Agents Can't Find It

**Symptoms:**

- You have README, ARCHITECTURE.md, CONTRIBUTING.md, etc.
- But AI agents aren't using the information effectively
- Agents ask questions already answered in existing docs
- No `docs/index.md` file exists

**Solution:**

1. **Quick fix:** Run the `index-docs` task (from `bmad/core/tasks/index-docs.xml`)
   - Lightweight and fast (just indexes existing docs)
   - Scans your docs directory
   - Generates organized `index.md` with file descriptions
   - Provides AI agents with structured navigation

2. **Comprehensive approach:** Run `document-project` with Deep/Exhaustive scan
   - Discovers existing docs in Step 2 (shows you what it found)
   - Generates NEW AI-friendly documentation from codebase analysis
   - Creates index.md that links to BOTH existing docs AND new docs
   - Useful when existing docs are good but need technical codebase analysis too

**Why This Happens:** AI agents need a structured entry point (`index.md`) to efficiently navigate documentation. Without it, they must search through multiple files, often missing relevant context.

### Issue: Plans Feel Too Complex for Simple Changes

**Symptoms:**

- Level 2+ workflow suggested for minor change
- Too much documentation overhead

**Solution:**

1. Re-run `workflow-status` or `workflow-init`
2. Correct the level when prompted (choose Level 0 or 1)
3. Trust your judgment - BMad Method adapts to your choice
4. Skip optional phases (Analysis)

### Issue: Integration Points Unclear

**Symptoms:**

- Stories lack detail on connecting to existing systems
- Uncertainty about which existing code to modify

**Solution:**

1. Ensure Phase 0 documentation is complete
2. Run deep-dive on integration areas in `document-project`
3. In Phase 2, explicitly document integration points
4. In Phase 3 (if Level 3+), use `integration-planning` workflow
5. Create detailed `epic-tech-context` and `story-context`

### Issue: Existing Tests Breaking

**Symptoms:**

- Regression test failures
- Existing functionality broken by changes

**Solution:**

1. Review existing test patterns in documentation
2. Use Test Architect workflows:
   - `test-design` - Plan test strategy upfront
   - `trace` - Map requirements to tests
   - `test-review` - Validate before merging
3. Add regression testing to Definition of Done
4. Consider feature flags for gradual rollout

### Issue: Inconsistent Patterns Being Introduced

**Symptoms:**

- New code doesn't match existing style
- Different architectural approach than existing modules

**Solution:**

1. Ensure `document-project` captured existing patterns
2. Review architecture documentation before Phase 4
3. Use `story-context` to inject pattern guidance
4. Include pattern adherence in `code-review` checklist
5. Run retrospectives to identify pattern deviations

## Test Architect Integration

The Test Architect (TEA) plays a critical role in brownfield projects to prevent regression and validate integration.

### Four-Stage Approach

**Stage 1 (Before Development):**

- Risk assessment identifying legacy dependencies
- Test design planning for regression + new features
- Integration point identification

**Stage 2 (During Development):**

- Requirements tracing validating existing functionality preservation
- NFR validation ensuring performance/security unchanged

**Stage 3 (Code Review):**

- Deep analysis of API contracts, data migrations
- Performance regression checks
- Integration point validation
- Dependency mapping

**Stage 4 (Post-Review):**

- Gate status updates
- Technical debt documentation

### TEA Workflows for Brownfield

| Workflow      | Purpose                    | When to Use                          |
| ------------- | -------------------------- | ------------------------------------ |
| `test-design` | Plan testing strategy      | After Phase 2, before implementation |
| `test-review` | Validate test coverage     | During story review                  |
| `trace`       | Map requirements to tests  | After test implementation            |
| `nfr-assess`  | Check performance/security | Before major releases                |
| `atdd`        | Acceptance test planning   | For user-facing features             |

### Risk Scoring for Brownfield

TEA uses enhanced brownfield metrics:

- **Regression Risk** = integration_points × code_age
- **Data Risk** = migration_complexity × data_volume
- **Performance Risk** = current_load × added_complexity
- **Compatibility Risk** = api_consumers × contract_changes

**Automatic Thresholds:**

- Score ≥9: Automatic failure (must mitigate)
- Score ≥6: Concern (requires mitigation plan)
- Score <6: Acceptable (document only)

## Quick Reference Commands

```bash
# Universal Entry Point (Always Start Here)
bmad analyst workflow-status

# Phase 0: Documentation (If Needed)
bmad analyst document-project
# → Choose: Quick / Deep / Exhaustive

# Phase 1: Analysis (Optional)
bmad analyst brainstorm-project    # Explore solutions
bmad analyst research              # Gather technical/market data
bmad analyst product-brief         # Strategic planning

# Phase 2: Planning (Required)
bmad pm tech-spec           # Level 0-1 only
bmad pm prd                 # Level 2-4 only

# Phase 3: Solutioning (Levels 2-4)
bmad architect architecture-review      # Review existing (L3-4)
bmad architect integration-planning     # Plan integration (L3-4)
bmad architect create-architecture      # Extend architecture (L2-4)
bmad architect solutioning-gate-check   # Final approval (L3-4)

# Phase 4: Implementation (All Levels)
bmad sm sprint-planning        # FIRST: Initialize tracking
bmad sm epic-tech-context      # Create epic context
bmad sm create-story           # Draft story
bmad sm story-context          # Create story context
bmad dev dev-story             # Implement story
bmad sm code-review           # Review implementation
# (Manually update sprint-status.yaml to 'done')
bmad sm retrospective          # After epic completion
bmad sm correct-course         # If issues arise

# Test Architect (Integration Throughout)
bmad tea test-design          # Plan testing strategy
bmad tea test-review          # Validate test coverage
bmad tea nfr-assess           # Check performance/security
```

## Key Files Reference

### Documentation Phase

- `docs/index.md` - **Master documentation index (REQUIRED for AI agents)** - Primary entry point
- `docs/project-overview.md` - Executive summary
- `docs/architecture.md` - Architecture analysis
- `docs/source-tree-analysis.md` - Annotated directory structure
- `docs/api-contracts.md` - API documentation (if applicable)
- `docs/data-models.md` - Database schemas (if applicable)
- `docs/deep-dive-{area}.md` - Area-specific deep dives
- Existing docs (README.md, ARCHITECTURE.md, etc.) - Incorporated and linked from index

### Planning Phase

- `bmm-workflow-status.md` - Phase 0-3 tracking
- `PRD.md` - Product requirements (L2-4)
- `epics.md` - Epic breakdown (L2-4)
- `tech-spec.md` - Technical specification (L0-2)

### Solutioning Phase

- `architecture.md` - Architecture extensions (L2-4)
- `integration-strategy.md` - Integration planning (L3-4)
- Validation and gate check reports

### Implementation Phase

- `sprint-status.yaml` - **Single source of truth** for Phase 4
- `epic-{n}-context.md` - Epic technical contexts
- `stories/{epic}-{story}-{title}.md` - Story files
- `stories/{epic}-{story}-{title}-context.md` - Story contexts

## Comparison: v4 vs v6 Brownfield

### What Changed

**v4 Approach:**

- Task-based system with fixed workflows
- Manual tracking across multiple documents
- Heavy upfront documentation requirements
- Rigid phase progression

**v6 Improvements:**

- Scale-adaptive workflows (0-4 levels)
- Unified status tracking (`workflow-status`, `sprint-status.yaml`)
- Three-level scanning (quick/deep/exhaustive)
- Just-in-time context injection
- Flexible resumability
- Modular workflow paths
- Intelligent routing system

### Migration from v4

If you used BMad Method v4, here's how to transition:

**Old v4 Task → New v6 Workflow:**

- `create-brownfield-prd` → `prd` (with brownfield path)
- `document-project` → `document-project` (enhanced with scan levels)
- Legacy task templates → Replaced by workflow system
- Manual status tracking → `sprint-status.yaml` + agents

**Key Conceptual Shifts:**

1. **Scale-adaptive planning** - Choose level based on complexity
2. **Phase 0 is conditional** - Only if documentation is lacking
3. **Sprint status is centralized** - Single YAML file for Phase 4
4. **Context injection** - Epic and story contexts provide JIT guidance
5. **Workflow paths** - Clean separation by level and field type

## Tips for Success

### For Solo Developers

1. Don't skip documentation phase - even if you know the code, AI agents need it
2. Choose appropriate scan level - deep scan is usually best for brownfield PRDs
3. Use Level 0-1 for small changes - don't over-engineer simple fixes
4. Trust the sprint planning system - it tracks everything automatically
5. Be specific when describing your work - helps system route to the right level

### For Teams

1. Document once, use everywhere - Phase 0 documentation serves entire team
2. Use sprint-status.yaml as single source of truth - no multiple tracking systems
3. Run retrospectives after epics - transfer learning to next stories
4. Coordinate parallel work - multiple stories can be in-progress if capacity allows
5. Establish clear communication about current iteration scope vs historical complexity

### For Enterprise

1. Phase 0 is mandatory - comprehensive documentation prevents costly mistakes
2. Include stakeholders early - Analysis phase (Phase 1) gathers business context
3. Use gate checks - `solutioning-gate-check` provides approval checkpoint
4. Plan phased rollout - feature flags and migration strategies are critical
5. Document architectural extensions - maintain system documentation as you evolve
6. Consider archiving completed planning artifacts to keep workspace clean

## Support and Resources

**Documentation:**

- [BMM Workflows Guide](../src/modules/bmm/workflows/README.md) - Complete v6 workflow reference
- [Test Architect Guide](@bmad/bmm/docs/tea-README.md) - Quality and testing strategy
- [BMM Module README](../src/modules/bmm/README.md) - Module overview

**Community:**

- Discord: [https://discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj) (#general-dev, #bugs-issues)
- GitHub Issues: [https://github.com/bmad-code-org/BMAD-METHOD/issues](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- YouTube: [https://www.youtube.com/@BMadCode](https://www.youtube.com/@BMadCode)

**Getting Started:**

```bash
# Install BMad Method
npx bmad-method install

# Start your first brownfield project
cd your-project
bmad analyst workflow-status
```

---

## Remember

**Brownfield development** is about understanding and respecting what exists while thoughtfully extending it. BMad Method v6's scale-adaptive approach ensures you get the right level of planning and documentation without unnecessary overhead.

**Key Principles:**

1. **Ask First, Infer Second**: The system asks about YOUR work first, then uses artifacts as context
2. **Scale Adapts**: From single fixes (Level 0) to enterprise expansions (Level 4)
3. **Documentation Matters**: AI agents need comprehensive context to work effectively
4. **Context Injection**: Epic and story contexts provide just-in-time guidance
5. **Sprint-Based Tracking**: Single source of truth keeps everyone aligned

**Quick Start:**

```bash
cd your-brownfield-project
bmad analyst workflow-status

# System will guide you through:
# 1. What's your project called?
# 2. What are you working on? (if finds old work: "is this continuing old work or new work?")
# 3. Confirms detected level
# 4. Creates appropriate workflow
```

**The system is designed to understand YOUR current work and route you to the right workflows.**
