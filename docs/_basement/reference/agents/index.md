---
title: "Agents Reference"
description: Complete reference for BMad Method agents and their commands
---

Quick reference of all BMad Method agents and their available commands.

:::tip[Universal Commands]
All agents support: `*menu` (redisplay options), `*dismiss` (dismiss agent), and `*party-mode` (multi-agent collaboration).
:::

## Analyst (Mary)

Business analysis and research.

**Commands:**
- `*workflow-status` — Get workflow status or initialize tracking
- `*brainstorm-project` — Guided brainstorming session
- `*research` — Market, domain, competitive, or technical research
- `*product-brief` — Create a product brief (input for PRD)
- `*document-project` — Document existing brownfield projects

## PM (John)

Product requirements and planning.

**Commands:**
- `*workflow-status` — Get workflow status or initialize tracking
- `*create-prd` — Create Product Requirements Document
- `*create-epics-and-stories` — Break PRD into epics and user stories (after Architecture)
- `*implementation-readiness` — Validate PRD, UX, Architecture, Epics alignment
- `*correct-course` — Course correction during implementation

## Architect (Winston)

System architecture and technical design.

**Commands:**
- `*workflow-status` — Get workflow status or initialize tracking
- `*create-architecture` — Create architecture document to guide development
- `*implementation-readiness` — Validate PRD, UX, Architecture, Epics alignment
- `*create-excalidraw-diagram` — System architecture or technical diagrams
- `*create-excalidraw-dataflow` — Data flow diagrams

## SM (Bob)

Sprint planning and story preparation.

**Commands:**
- `*sprint-planning` — Generate sprint-status.yaml from epic files
- `*create-story` — Create story from epic (prep for development)
- `*validate-create-story` — Validate story quality
- `*epic-retrospective` — Team retrospective after epic completion
- `*correct-course` — Course correction during implementation

## DEV (Amelia)

Story implementation and code review.

**Commands:**
- `*dev-story` — Execute story workflow (implementation with tests)
- `*code-review` — Thorough code review

## Quick Flow Solo Dev (Barry)

Fast solo development without handoffs.

**Commands:**
- `*quick-spec` — Architect technical spec with implementation-ready stories
- `*quick-dev` — Implement tech spec end-to-end solo
- `*code-review` — Review and improve code

## TEA (Murat)

Test architecture and quality strategy.

**Commands:**
- `*framework` — Initialize production-ready test framework
- `*atdd` — Generate E2E tests first (before implementation)
- `*automate` — Comprehensive test automation
- `*test-design` — Create comprehensive test scenarios
- `*trace` — Map requirements to tests, quality gate decision
- `*nfr-assess` — Validate non-functional requirements
- `*ci` — Scaffold CI/CD quality pipeline
- `*test-review` — Review test quality

## UX Designer (Sally)

User experience and UI design.

**Commands:**
- `*create-ux-design` — Generate UX design and UI plan from PRD
- `*validate-design` — Validate UX specification and design artifacts
- `*create-excalidraw-wireframe` — Create website or app wireframe

## Technical Writer (Paige)

Technical documentation and diagrams.

**Commands:**
- `*document-project` — Comprehensive project documentation
- `*generate-mermaid` — Generate Mermaid diagrams
- `*create-excalidraw-flowchart` — Process and logic flow visualizations
- `*create-excalidraw-diagram` — System architecture or technical diagrams
- `*create-excalidraw-dataflow` — Data flow visualizations
- `*validate-doc` — Review documentation against standards
- `*improve-readme` — Review and improve README files
- `*explain-concept` — Create clear technical explanations
- `*standards-guide` — Show BMad documentation standards
