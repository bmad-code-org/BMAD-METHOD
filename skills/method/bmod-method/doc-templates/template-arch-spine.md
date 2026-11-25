---
title: ""
template: arch-spine
version: 1.0.0
category: delivery
description: "Initiative architecture spine: stack, service seams, AD-n invariants and contract index."
not_for: "Multi-initiative enterprise topology (`arch-enterprise`); one epic's concrete schema and API payloads (`arch-epic`); a single trade-off (`decision-record`)."
agents: [bmad-agent-architect]
facilitation_order: [context-and-inherited-invariants, coupling-radar, design-paradigm-and-boundaries, ai-and-probabilistic-boundaries, invariants-and-decisions, consistency-conventions, stack, structural-seed-and-operations, contract-index, capability-map, explicitly-deferred-decisions, open-questions]
guidance: guidance-method.md
rubric: rubric-architecture.md
status: draft
created: ""
updated: ""
---

<!-- purpose: The consistency contract several epics build under (or a lean build substrate for a standalone app): paradigm, service boundaries, core entity ownership, operational envelope, pinned stack, and `AD-n` invariants. -->

<!-- stance: Keep the spine a terse build substrate scaled to stakes — a small standalone app may be just paradigm, a few ADs, conventions, and stack, while a multi-epic platform earns more. Fix only what two units built independently could get incompatibly wrong, AND the call is non-obvious, AND it is a real trade-off; otherwise defer. Never stall asking for table columns, field lists, or exact endpoint payloads — those belong in `arch-epic`. Never invent 30 tables or future-epic schemas for `Stubbed` epics; park lower-level choices in Explicitly deferred decisions. When the stack is open, recommend a web-verified current starter; on brownfield, inspect the codebase first and ratify live conventions. Lay out realistic trade-offs for load-bearing calls before the user chooses. -->

<!-- opening: Read the initiative ticket (`initiative-*.md`), PRD (`prd`), `Saved for this epic` seed lots, UX companions, parent `arch-enterprise` (if any), and live codebase before asking anything they already answer. Play back what is already settled and start with the 2–3 highest-leverage boundary questions still open. -->

<!-- inputs: Initiative container, PRD (`OKR-N`, `INV-N`, shared nouns, journeys, epic map), existing codebase, UX spines, and standing persistent facts. Only the user knows non-functional trade-offs, operational constraints, and team preferences. -->

<!-- writing:
  - Inherit parent `arch-enterprise` `AD-n`s by original ID (read-only, never renumbered); surface conflicts rather than overriding.
  - On updates, keep existing `AD-n` IDs stable (amend in place or append the next ID; never renumber or reuse retired IDs) and flag any decision overriding the driving ticket so it can be updated.
  - Every `AD-n` carries `Binds`, `Prevents`, `Rule`, optional one-line `Why`, and `[ADOPTED]` when pre-settled.
  - Verify every proposed `AD-n` against numeric `Passable` and `Good` `OKR-N` bounds and binary `INV-N` invariants before settling.
  - Verify named technology versions on the web before pinning in `## Stack`.
-->

<!-- done when: Every non-obvious divergence point is settled as an `AD-n` or convention; every `AD-n` clears numeric `Passable` and `Good` `OKR-N` thresholds and `INV-N` invariants; Coupling radar (when applicable) swept all `Saved for this epic` notes; operational envelope, metered cost bounds, verification/eval gates, probabilistic/AI boundaries (when applicable), and telemetry hooks are settled or explicitly deferred; and Explicitly deferred decisions names what waits for `arch-epic`. -->

# {title}

## Table of Contents

## Context and inherited invariants
<!-- Link the initiative ticket and PRD, citing `OKR-N` (with numeric `Passable` / `Good` bounds), `INV-N`, and shared nouns by ID without restating them. If a parent `arch-enterprise` exists, table its binding `AD-n`s by original ID and note brownfield conventions ratified from code. -->

## Coupling radar
<!-- include when: a multi-epic PRD or ticket has cross-epic saved notes. Sweep every `Saved for this epic` note in the PRD or ticket and extract only cross-cutting patterns (shared domain events, auth/session model, async queues, caching, audit rails). Record each cross-cutting signal without designing single-epic tables or endpoints. -->

## Design paradigm and boundaries
<!-- Name the design paradigm and map layers or services to module boundaries, core entity ownership, auth/tenancy/audit backbone, and telemetry hooks proving `OKR-N` measurements. Include a dependency-direction `diagram: flowchart`. -->

## AI and probabilistic boundaries
<!-- include when: the system uses an LLM, RAG, or agent loop.
  - Keep deterministic code in charge of auth, math, state commits, and safety-critical paths; map non-deterministic steps and fallback behavior on provider outage or malformed output.
  - Route by capability tier (leaving concrete model IDs in config rather than hardcoded snapshots), enforce tenant/ACL isolation and grounding before retrieval structurally (never in prompt text), and require least-privilege tool scopes plus human approval gates where prompt injection could trigger side effects.
  - Fix eval regression gates (`Passable`/`Good` thresholds) and loop/spend circuit breakers (max turns, tool calls, unit/daily spend caps, PII-redacted trace logging), or record concrete deferrals to the owning epic.
-->

## Invariants and decisions
<!-- Ascending decision blocks (`### AD-1 — <decision>`): `- **Binds:**` (`E0X` or `all`), `- **Prevents:**`, `- **Rule:**`, optional one-line `- **Why:**`, and `[ADOPTED]` when pre-settled. Verify each `AD-n` against numeric `Passable` / `Good` `OKR-N` bounds (e.g. latency, throughput, recovery windows) and `INV-N` invariants so no decision violates a target threshold. -->

## Consistency conventions
<!-- Defaults binding across epics in a table (`| Concern | Convention |`): naming (entities, files, events), data and formats (IDs, dates, error envelopes), and cross-cutting rules (mutation, logging, config, auth). -->

## Stack
<!-- Seed of verified current versions (`| Name | Version |`). A stack choice with trade-offs or a user reason also gets an `AD-n`. -->

## Structural seed and operations
<!-- Deployment and environments, infra/provider strategy, operational envelope (backups, scaling, SLO rails, cost envelope and spend caps for metered dependencies, pre-ship verification/eval gates for high-risk or non-deterministic paths), minimal directory scaffold, and core-entity ERD (`diagram: er`) with names and relationships only. -->

## Contract index
<!-- include when: multiple epics or external consumers share contracts. Pointer table for cross-epic contracts (`| Contract | Status | Owning epic | Canonical path |`) — link `contract.yaml` or schema files owned inside child `arch-epic` folders; never copy endpoint payloads here. -->

## Capability map
<!-- include when: a ticket or PRD drove this run. Table bridging each epic (`E01`..) or capability to its module/service location and governing `AD-n` / convention IDs. -->

## Explicitly deferred decisions
<!-- Decisions deliberately left to `arch-epic` or future stubbed epics, each naming what was deferred, which epic (`E0X`) owns it, and the trigger to revisit. -->

## Open questions
<!-- optional. Unsettled spine questions, one line each, naming who can answer and which epic needs it. -->
