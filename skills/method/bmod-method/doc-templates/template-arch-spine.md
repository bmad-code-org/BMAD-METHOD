---
title: ""
template: arch-spine
version: 1.0.0
description: "Initiative architecture spine: stack, service seams, AD-n invariants and contract index."
not_for: "Multi-initiative enterprise topology (`arch-enterprise`); one epic's concrete schema and API payloads (`arch-epic`); a single trade-off (`decision-record`)."
agents: [bmad-agent-architect]
facilitation_order: [context-and-inherited-invariants, coupling-radar, design-paradigm-and-boundaries, invariants-and-decisions, consistency-conventions, stack, structural-seed-and-operations, contract-index, capability-map, explicitly-deferred-decisions, open-questions]
guidance: guidance-method.md
rubric: rubric-architecture.md
lint: uv run "{project-root}/_bmad/method/scripts/lint_arch.py" "{doc}"
status: draft
created: ""
updated: ""
---

<!-- purpose: The consistency contract several epics build under: paradigm, service boundaries, core entity ownership, operational envelope, pinned stack, and `AD-n` invariants. -->

<!-- stance: Fix only what two epics built independently could get incompatibly wrong. Never stall asking for table columns, field lists, or exact endpoint payloads — those belong in `arch-epic`. Never invent 30 tables or future-epic schemas for `Stubbed` epics; park lower-level choices in Explicitly deferred decisions. When the stack is open, recommend a web-verified current starter; on brownfield, inspect the codebase first and ratify live conventions. Lay out realistic trade-offs for load-bearing calls before the user chooses. -->

<!-- opening: Read the initiative ticket (`initiative-*.md`), PRD (`prd`), `Saved for this epic` seed lots, UX companions, parent `arch-enterprise` (if any), and live codebase before asking anything they already answer. Play back what is already settled and ask only the 6–10 cross-epic boundary questions still open. -->

<!-- inputs: Initiative container, PRD (`OKR-N`, `INV-N`, shared nouns, journeys, epic map), existing codebase, UX spines, and standing persistent facts. Only the user knows non-functional trade-offs, operational constraints, and team preferences. -->

<!-- writing:
  - Inherit parent `arch-enterprise` `AD-n`s by original ID (read-only, never renumbered); surface conflicts rather than overriding.
  - Every `AD-n` carries `Binds`, `Prevents`, `Rule`, optional one-line `Why`, and `[ADOPTED]` when pre-settled.
  - Verify every proposed `AD-n` against numeric `Passable` and `Good` `OKR-N` bounds and binary `INV-N` invariants before settling.
  - Verify named technology versions on the web before pinning in `## Stack`.
-->

<!-- done when: Every cross-epic divergence point is settled as an `AD-n` or convention; every `AD-n` clears numeric `Passable` and `Good` `OKR-N` thresholds and `INV-N` invariants; Coupling radar swept all `Saved for this epic` notes; operational envelope and telemetry hooks are settled; and Explicitly deferred decisions names what waits for `arch-epic`. -->

# {title}

## Table of Contents

## Context and inherited invariants
<!-- Link the initiative ticket and PRD, citing `OKR-N` (with numeric `Passable` / `Good` bounds), `INV-N`, and shared nouns by ID without restating them. If a parent `arch-enterprise` exists, table its binding `AD-n`s by original ID and note brownfield conventions ratified from code. -->

## Coupling radar
<!-- Sweep every `Saved for this epic` note in the PRD or ticket and extract only cross-cutting patterns (shared domain events, auth/session model, async queues, caching, audit rails). Record each cross-cutting signal without designing single-epic tables or endpoints. -->

## Design paradigm and boundaries
<!-- Name the design paradigm and map layers or services to module boundaries, core entity ownership, auth/tenancy/audit backbone, and telemetry hooks proving `OKR-N` measurements. Include a dependency-direction `diagram: flowchart`. -->

## Invariants and decisions
<!-- Ascending decision blocks (`### AD-1 — <decision>`): `- **Binds:**` (`E0X` or `all`), `- **Prevents:**`, `- **Rule:**`, optional one-line `- **Why:**`, and `[ADOPTED]` when pre-settled. Verify each `AD-n` against numeric `Passable` / `Good` `OKR-N` bounds (e.g. latency, throughput, recovery windows) and `INV-N` invariants so no decision violates a target threshold. -->

## Consistency conventions
<!-- Defaults binding across epics in a table (`| Concern | Convention |`): naming (entities, files, events), data and formats (IDs, dates, error envelopes), and cross-cutting rules (mutation, logging, config, auth). -->

## Stack
<!-- Seed of verified current versions (`| Name | Version |`). A stack choice with trade-offs or a user reason also gets an `AD-n`. -->

## Structural seed and operations
<!-- Deployment and environments, infra/provider strategy, operational envelope (backups, scaling, SLO rails), minimal directory scaffold, and core-entity ERD (`diagram: er`) with names and relationships only. -->

## Contract index
<!-- Pointer table for cross-epic contracts (`| Contract | Status | Owning epic | Canonical path |`) — link `contract.yaml` or schema files owned inside child `arch-epic` folders; never copy endpoint payloads here. -->

## Capability map
<!-- include when: a ticket or PRD drove this run. Table bridging each epic (`E01`..) or capability to its module/service location and governing `AD-n` / convention IDs. -->

## Explicitly deferred decisions
<!-- Decisions deliberately left to `arch-epic` or future stubbed epics, each naming what was deferred, which epic (`E0X`) owns it, and the trigger to revisit. -->

## Open questions
<!-- optional. Unsettled spine questions, one line each, naming who can answer and which epic needs it. -->
