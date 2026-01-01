# BMM Glossary

Comprehensive terminology reference for the BMad Method Module.

---

## Navigation

- [Core Concepts](#core-concepts)
- [Scale and Complexity](#scale-and-complexity)
- [Planning Documents](#planning-documents)
- [Workflow and Phases](#workflow-and-phases)
- [Agents and Roles](#agents-and-roles)
- [Status and Tracking](#status-and-tracking)
- [Project Types](#project-types)
- [Implementation Terms](#implementation-terms)

---

## Core Concepts

### BMM (BMad Method Module)

Core orchestration system for AI-driven agile development, providing comprehensive lifecycle management through specialized agents and workflows.

### BMad Method

The complete methodology for AI-assisted software development, encompassing planning, architecture, implementation, and quality assurance workflows that adapt to project complexity.

### Scale-Adaptive System

BMad Method's intelligent workflow orchestration that automatically adjusts planning depth, documentation requirements, and implementation processes based on project needs through three distinct planning tracks (Quick Flow, BMad Method, Enterprise Method).

### Agent

A specialized AI persona with specific expertise (PM, Architect, SM, DEV, TEA) that guides users through workflows and creates deliverables. Agents have defined capabilities, communication styles, and workflow access.

### Workflow

A multi-step guided process that orchestrates AI agent activities to produce specific deliverables. Workflows are interactive and adapt to user context.

---

## Scale and Complexity

### Quick Flow Track

Fast implementation track using tech-spec planning only. Best for bug fixes, small features, and changes with clear scope. Typical range: 1-15 stories. No architecture phase needed. Examples: bug fixes, OAuth login, search features.

### BMad Method Track

Full product planning track using PRD + Architecture + UX. Best for products, platforms, and complex features requiring system design. Typical range: 10-50+ stories. Examples: admin dashboards, e-commerce platforms, SaaS products.

### Enterprise Method Track

Extended enterprise planning track adding Security Architecture, DevOps Strategy, and Test Strategy to BMad Method. Best for enterprise requirements, compliance needs, and multi-tenant systems. Typical range: 30+ stories. Examples: multi-tenant platforms, compliance-driven systems, mission-critical applications.

### Planning Track

The methodology path (Quick Flow, BMad Method, or Enterprise Method) chosen for a project based on planning needs, complexity, and requirements rather than story count alone.

**Note:** Story counts are guidance, not definitions. Tracks are determined by what planning the project needs, not story math.

---

## Planning Documents

### Tech-Spec (Technical Specification)

**Quick Flow track only.** Comprehensive technical plan created upfront that serves as the primary planning document for small changes or features. Contains problem statement, solution approach, file-level changes, stack detection (brownfield), testing strategy, and developer resources.

### PRD (Product Requirements Document)

**BMad Method/Enterprise tracks.** Product-level planning document containing vision, goals, Functional Requirements (FRs), Non-Functional Requirements (NFRs), success criteria, and UX considerations. Replaces tech-spec for larger projects that need product planning. **V6 Note:** PRD focuses on WHAT to build (requirements). Epic+Stories are created separately AFTER architecture via create-epics-and-stories workflow.

### Architecture Document

**BMad Method/Enterprise tracks.** System-wide design document defining structure, components, interactions, data models, integration patterns, security, performance, and deployment.

**Scale-Adaptive:** Architecture complexity scales with track - BMad Method is lightweight to moderate, Enterprise Method is comprehensive with security/devops/test strategies.

### Epics

High-level feature groupings that contain multiple related stories. Typically span 5-15 stories each and represent cohesive functionality (e.g., "User Authentication Epic").

### Product Brief

Optional strategic planning document created in Phase 1 (Analysis) that captures product vision, market context, user needs, and high-level requirements before detailed planning.

### GDD (Game Design Document)

Game development equivalent of PRD, created by Game Designer agent for game projects.

---

## Workflow and Phases

### Phase 0: Documentation (Prerequisite)

**Conditional phase for brownfield projects.** Creates comprehensive codebase documentation before planning. Only required if existing documentation is insufficient for AI agents.

### Phase 1: Analysis (Optional)

Discovery and research phase including brainstorming, research workflows, and product brief creation. Optional for Quick Flow, recommended for BMad Method, required for Enterprise Method.

### Phase 2: Planning (Required)

**Always required.** Creates formal requirements and work breakdown. Routes to tech-spec (Quick Flow) or PRD (BMad Method/Enterprise) based on selected track.

### Phase 3: Solutioning (Track-Dependent)

Architecture design phase. Required for BMad Method and Enterprise Method tracks. Includes architecture creation, validation, and gate checks.

### Phase 4: Implementation (Required)

Sprint-based development through story-by-story iteration. Uses sprint-planning, create-story, dev-story, code-review, and retrospective workflows.

### Documentation (Prerequisite for Brownfield)

**Conditional prerequisite for brownfield projects.** Creates comprehensive codebase documentation before planning. Only required if existing documentation is insufficient for AI agents. Uses the `document-project` workflow.

### Quick Spec Flow

Fast-track workflow system for Quick Flow track projects that goes straight from idea to tech-spec to implementation, bypassing heavy planning. Designed for bug fixes, small features, and rapid prototyping.

---

## Agents and Roles

### PM (Product Manager)

Agent responsible for creating PRDs, tech-specs, and managing product requirements. Primary agent for Phase 2 planning.

### Analyst (Business Analyst)

Agent that initializes workflows, conducts research, creates product briefs, and tracks progress. Often the entry point for new projects.

### Architect

Agent that designs system architecture, creates architecture documents, performs technical reviews, and validates designs. Primary agent for Phase 3 solutioning.

### SM (Scrum Master)

Agent that manages sprints, creates stories, generates contexts, and coordinates implementation. Primary orchestrator for Phase 4 implementation.

### DEV (Developer)

Agent that implements stories, writes code, runs tests, and performs code reviews. Primary implementer in Phase 4.

### TEA (Test Architect)

Agent responsible for test strategy, quality gates, NFR assessment, and comprehensive quality assurance. Integrates throughout all phases.

### Technical Writer

Agent specialized in creating and maintaining high-quality technical documentation. Expert in documentation standards, information architecture, and professional technical writing. The agent's internal name is "paige" but is presented as "Technical Writer" to users.

### UX Designer

Agent that creates UX design documents, interaction patterns, and visual specifications for UI-heavy projects.

### Game Designer

Specialized agent for game development projects. Creates game design documents (GDD) and game-specific workflows.

### BMad Master

Meta-level orchestrator agent from BMad Core. Facilitates party mode, lists available tasks and workflows, and provides high-level guidance across all modules.

### Party Mode

Multi-agent collaboration feature where all installed agents (19+ from BMM, CIS, BMB, custom modules) discuss challenges together in real-time. BMad Master orchestrates, selecting 2-3 relevant agents per message for natural cross-talk and debate. Best for strategic decisions, creative brainstorming, cross-functional alignment, and complex problem-solving. See [Party Mode Guide](./party-mode.md).

---

## Status and Tracking

### bmm-workflow-status.yaml

**Phases 1-3.** Tracking file that shows current phase, completed workflows, progress, and next recommended actions. Created by workflow-init, updated automatically.

### sprint-status.yaml

**Phase 4 only.** Single source of truth for implementation tracking. Contains all epics, stories, and retrospectives with current status for each. Created by sprint-planning, updated by agents.

### Story Status Progression

```
backlog → ready-for-dev → in-progress → review → done
```

- **backlog** - Story exists in epic but not yet created
- **ready-for-dev** - Story file created via create-story; validation is optional (run `validate-create-story` for quality check before dev picks it up)
- **in-progress** - DEV is implementing via dev-story
- **review** - Implementation complete, awaiting code-review
- **done** - Completed with DoD met

### Epic Status Progression

```
backlog → in-progress → done
```

- **backlog** - Epic not yet started
- **in-progress** - Epic actively being worked on
- **done** - All stories in epic completed

### Retrospective

Workflow run after completing each epic to capture learnings, identify improvements, and feed insights into next epic planning. Critical for continuous improvement.

---

## Project Types

### Greenfield

New project starting from scratch with no existing codebase. Freedom to establish patterns, choose stack, and design from clean slate.

### Brownfield

Existing project with established codebase, patterns, and constraints. Requires understanding existing architecture, respecting established conventions, and planning integration with current systems.

**Critical:** Brownfield projects should run document-project workflow BEFORE planning to ensure AI agents have adequate context about existing code.

### document-project Workflow

**Brownfield prerequisite.** Analyzes and documents existing codebase, creating comprehensive documentation including project overview, architecture analysis, source tree, API contracts, and data models. Three scan levels: quick, deep, exhaustive.

---

## Implementation Terms

### Story

Single unit of implementable work with clear acceptance criteria, typically 2-8 hours of development effort. Stories are grouped into epics and tracked in sprint-status.yaml.

### Story File

Markdown file containing story details: description, acceptance criteria, technical notes, dependencies, implementation guidance, and testing requirements.

### Story Context

Implementation guidance embedded within story files during the create-story workflow. Provides implementation-specific context, references existing patterns, suggests approaches, and helps maintain consistency with established codebase conventions.

### Sprint Planning

Workflow that initializes Phase 4 implementation by creating sprint-status.yaml, extracting all epics/stories from planning docs, and setting up tracking infrastructure.

### Gate Check

Validation workflow (implementation-readiness) run before Phase 4 to ensure PRD + Architecture + Epics + UX (optional) are aligned with no gaps or contradictions. Required for BMad Method and Enterprise Method tracks.

### DoD (Definition of Done)

Criteria that must be met before marking a story as done. Typically includes: implementation complete, tests written and passing, code reviewed, documentation updated, and acceptance criteria validated.

### Shard / Sharding

**For runtime LLM optimization only (NOT human docs).** Splitting large planning documents (PRD, epics, architecture) into smaller section-based files to improve workflow efficiency. Phase 1-3 workflows load entire sharded documents transparently. Phase 4 workflows selectively load only needed sections for massive token savings.

---

## Additional Terms

### Workflow Status

Universal entry point workflow that checks for existing status file, displays current phase/progress, and recommends next action based on project state.

### Workflow Init

Initialization workflow that creates bmm-workflow-status.yaml, detects greenfield vs brownfield, determines planning track, and sets up appropriate workflow path.

### Track Selection

Automatic analysis by workflow-init that uses keyword analysis, complexity indicators, and project requirements to suggest appropriate track (Quick Flow, BMad Method, or Enterprise Method). User can override suggested track.

### Correct Course

Workflow run during Phase 4 when significant changes or issues arise. Analyzes impact, proposes solutions, and routes to appropriate remediation workflows.

### Migration Strategy

Plan for handling changes to existing data, schemas, APIs, or patterns during brownfield development. Critical for ensuring backward compatibility and smooth rollout.

### Feature Flags

Implementation technique for brownfield projects that allows gradual rollout of new functionality, easy rollback, and A/B testing. Recommended for BMad Method and Enterprise brownfield changes.

### Integration Points

Specific locations where new code connects with existing systems. Must be documented explicitly in brownfield tech-specs and architectures.

### Convention Detection

Quick Spec Flow feature that automatically detects existing code style, naming conventions, patterns, and frameworks from brownfield codebases, then asks user to confirm before proceeding.

---

## Related Documentation

- [Quick Start Guide](./quick-start.md) - Learn BMM basics
- [Scale Adaptive System](./scale-adaptive-system.md) - Deep dive on tracks and complexity
- [Brownfield Guide](./brownfield-guide.md) - Working with existing codebases
- [Quick Spec Flow](./quick-spec-flow.md) - Fast-track for Quick Flow track
- [FAQ](./faq.md) - Common questions
