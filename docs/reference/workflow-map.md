---
title: 'Workflow Map'
description: Reference for BMad Method phases, workflows, and outputs.
sidebar:
  order: 1
---

The BMad Method (BMM) organizes software delivery into four phases. Each phase
adds only the context the work needs, from optional discovery through planning,
solutioning, and implementation.

Use [Choose a Development Path](../how-to/choose-a-development-path.md) to
decide how much of this map your change needs. Invoke the listed skills directly.
If you are unsure what to do next in an installed project, run `bmad-help`.

<iframe src="/workflow-map-diagram.html" title="BMad Method Workflow Map Diagram" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram.html" target="_blank" rel="noopener noreferrer">Open diagram in new tab ↗</a>
</p>

## Phase 1: Analysis (Optional)

Explore the problem space and validate ideas before committing to planning. [**Learn what each tool does and when to use
it**](../explanation/analysis-phase.md).

| Workflow             | Purpose                                                                                                                                                             | Produces                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `bmad-brainstorming` | Brainstorm Project Ideas with guided facilitation of a brainstorming coach                                                                                          | `brainstorm.html` keepsake plus an optional `brainstorm-intent.md`       |
| `bmad-forge-idea`    | Pressure-test an idea until it hardens, proves out, or dies cheaply                                                                                                 | `forge-report.html` every run; `forged-idea.md` when an idea hardens     |
| `bmad-deep-recon`    | Research any subject for a decision — draft a prompt for your deep-research tool, process its report, or run the research here; six typed packs, verified and cited | Research report or summary + optional HTML briefing                      |
| `bmad-product-brief` | Capture strategic vision — best when your concept is clear                                                                                                          | `brief.md` + `addendum.md`, plus any desired HTML or presentation output |
| `bmad-prfaq`         | Working Backwards — stress-test your product concept customer-first                                                                                                 | `prfaq-{project}.md`                                                     |

For Deep Recon's three modes and how a research run works inside, see [Deep Recon](../explanation/deep-recon.md).

## Phase 2: Planning

Define what to build and for whom.

| Workflow    | Purpose                                                                                                                                                    | Produces                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `bmad-prd`  | Create, update, or validate a PRD — facilitated discovery, three intents in one skill                                                                      | Create/Update: `prd.md`, `addendum.md`, `.memlog.md`; Validate: `validation-report.html` + `.md` |
| `bmad-ux`   | Design user experience (when UX matters) — DESIGN.md (visual) + EXPERIENCE.md (behavioral) spine pair                                                      | `DESIGN.md`, `EXPERIENCE.md`, `.memlog.md`                                                       |
| `bmad-spec` | Distill any intent input (brief, PRD, transcript, brain dump, design folder) into a succinct SPEC.md contract + companions — locks the WHAT before the HOW | `SPEC.md` + companions under `{output_folder}/specs/spec-{slug}/`; optional `stories.yaml`       |

:::tip[Three intents in one skill]
`bmad-prd` handles the full PRD lifecycle. State your intent when invoking or the skill will ask:

- **Create** — new PRD from scratch via coached discovery; produces `prd.md`, `addendum.md`, and `.memlog.md`
- **Update** — reconcile an existing PRD with a change signal, surfacing conflicts before applying changes
- **Validate** — critique a PRD against a configurable checklist and produce a structured HTML findings report
  :::

:::note[`bmad-spec`]
`bmad-spec` produces the canonical machine contract: a five-field kernel (Why, Capabilities, Constraints, Non-goals, Success signal) plus companion files, validated so every load-bearing source claim is preserved. It is the only writer of `SPEC.md`; other skills invoke it headless when they need to express or update intent. On request, Story Breakdown also creates the ordered `stories.yaml` used to implement an epic across several sessions. See [Choose a Development Path](../how-to/choose-a-development-path.md#4-start-epic-sized-work).
:::

:::tip[Upstream: `bmad-product-brief`]
`bmad-product-brief` (Phase 1) produces a `product-brief.md` that `bmad-prd` can source-extract during Discovery, reducing re-explanation and keeping the two documents aligned. Neither skill requires the other — start with `bmad-prd` directly if you already know what you're building.
:::

## Phase 3: Solutioning

Decide how to build it and break work into stories.

| Workflow                        | Purpose                                                                   | Produces                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `bmad-architecture`             | Make technical decisions explicit                                         | `ARCHITECTURE-SPINE.md` is the spine by default but can hydrate to your desired output or presentation needs also |
| `bmad-create-epics-and-stories` | Break requirements into implementable work                                | Epic files with stories                                                                                           |
| `bmad-sprint-planning`          | Readiness gate before implementation, then story tracking and status view | PASS/CONCERNS/FAIL + `sprint-status.yaml`                                                                         |

For how the readiness gate, deterministic tracking, and status view work together, see [Sprint Planning](../explanation/sprint-planning.md).

## Phase 4: Implementation

Implementation happens in session-sized units. `bmad-build` handles a unit
attentively; `bmad-build-auto` handles one unit unattended. Larger planning
paths create and preserve the context those units need. See
[Build a Change](../build/build-a-change.md) for the attended path,
[Walk Through a Change](../build/walk-through-a-change.md) to walk a finished
change, and [Test Completed Work](../build/test-completed-work.md) to choose a
testing path.

| Workflow              | Purpose                                                                        | Produces                                         |
| --------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| `bmad-build`          | Implement and review one direct intent or planned story with human checkpoints | Implementation record + code                     |
| `bmad-build-auto`     | Implement and review one unit unattended for a caller or orchestrator          | Implementation record + code + terminal status   |
| `bmad-code-review`    | Ad hoc review of any code change                                               | Findings + applied patches                       |
| `bmad-correct-course` | Handle significant mid-sprint changes                                          | Updated plan or re-routing                       |
| `bmad-retrospective`  | Evidence-based review of a completed epic against its acceptance criteria      | Retro document, action items, acceptance verdict |

### Direct and Planned Entry

Clear one-session work can enter `bmad-build` directly. A spec-backed epic uses
Story Breakdown to create several units under one `SPEC.md`. A multi-epic
project may add a PRD, UX, architecture, epics, readiness results, and sprint
tracking before selecting each unit.

Build Auto does not orchestrate those units. An AI coding session or another
orchestrator, such as bmad-loop, selects and dispatches one worker per unit. See
[Autonomous Development Loops](./build-auto.md) for the worker and orchestration
contracts.

## Context Management

Each document becomes context for later decisions. The PRD records the product
requirements. The architecture records the patterns and boundaries that each
implementation unit must follow. Specs and story records preserve intent,
decisions, and completion state as work is divided and recombined.

### Project Context

:::tip[Recommended]
Set up your repo so AI agents follow your project's rules across all workflows: a small verified block in
`AGENTS.md`, maintained by `bmad-project-context`. Seed it from your architecture at the end of planning, or
discover it from an existing codebase at any time.
:::

**How to create it:**

- Run `bmad-project-context` — greenfield (seeded from your spec or architecture) or brownfield (discovered from the codebase, verified, then confirmed with you). The earlier `bmad-generate-project-context` is deprecated and forwards there; an existing `project-context.md` is offered up for absorption.

[**Learn more about project context**](../explanation/project-context.md)
