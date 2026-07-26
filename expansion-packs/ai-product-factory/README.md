# AI Product Factory v2

AI Product Factory (APF) is a Codex-first expansion pack for BMAD. It adds product evidence, lifecycle routing, project reproducibility, and risk-proportional delivery without replacing BMAD core.

## What APF owns

- Founder context, evidence classification, business assumptions, and lifecycle gates.
- Product execution tracks: experiment, prototype, MVP, production, and brownfield.
- Project delivery routing, shared project contract, and execution economy.
- Release and learning loops built on observed signals.

BMAD core remains the canonical owner for PRD, UX, architecture, stories, implementation, and code review.

## Start here

For normal work in an existing project:

```text
use the bmad-apf-execute skill
<task>
```

It selects one of four modes:

| Mode | Specification | Subagents | Verification |
| --- | --- | ---: | --- |
| patch | off | 0 | manual or targeted static |
| focused | off | 0 | affected module |
| planned | compact when needed | 1 | relevant |
| critical | required | 2 | full relevant |

For a shared team operating contract:

```text
use the bmad-apf-project-contract skill
create
```

For a product lifecycle, use `bmad-apf-launch-product`. It selects only the relevant APF workflows; it never runs every stage by default.

## Active APF v2 skills

### Workflows

- `bmad-apf-execute`
- `bmad-apf-project-contract`
- `bmad-apf-optimize-skills`
- `bmad-apf-launch-product`
- `bmad-apf-validate-opportunity`
- `bmad-apf-design-experiment`
- `bmad-apf-plan-product`
- `bmad-apf-plan-delivery`
- `bmad-apf-build-vertical-slice`
- `bmad-apf-release-product`
- `bmad-apf-learn-and-iterate`

### Agents

- `bmad-apf-founder`
- `bmad-apf-product-operator`
- `bmad-apf-product-engineer`
- `bmad-apf-growth-operator`

## Team reproducibility

`bmad-apf-project-contract` records what the repository actually does and generates only the guidance the project needs:

```text
.apf/project-contract.yaml
AGENTS.md
docs/ai/project-map.md
.agents/skills/*
.codex/config.toml
```

Rules are marked as declared, observed, inferred, conflict, unknown, or deprecated. The workflow does not silently treat a legacy pattern as approved architecture.

## Evidence and gates

APF labels claims as declared, observed, verified, inferred, assumption, unknown, or conflict. A `validated-go` requires a real signal such as interviews, waitlist conversion, preorder, paid pilot, or usage data.

Lifecycle artifacts and gate reports use schemas in `schemas/`. A failed blocking gate prevents transition unless a waiver identifies an owner, reason, and expiry.

## Compatibility

APF v2 is distributed from a maintenance fork of BMAD-METHOD. It does not modify or replace BMAD core. The Phase 0 migration map is in [inventory/entity-migration-map.yaml](inventory/entity-migration-map.yaml); it documents the transition from the v1 roster to the v2 skills.

The current repository validator reserves the `bmad-` skill prefix, so APF v2 keeps `bmad-apf-` as the installed identifier pending the namespace ADR.

## Quality checks

```bash
npm run apf:inventory
npm run apf:lint
npm run apf:benchmark
npm run apf:contract-test
```

APF checks are deterministic by default. LLM-based evals belong to a budgeted nightly or release workflow, never an implicit hook.

## Short guides

- [Economy of tokens and limits](guides/token-economy.md)
- [Install BMAD-TEMPLATE in a project](guides/install-in-project.md)
