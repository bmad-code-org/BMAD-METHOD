---
title: ""
template: arch-epic
version: 1.0.0
category: delivery
description: "Epic tech design against live code: story contracts, schemas, migrations and state flows."
not_for: "Multi-epic system spine (`arch-spine`); enterprise platform topology (`arch-enterprise`); a single story that fits existing patterns (`bmad-build`)."
agents: [bmad-agent-architect]
facilitation_order: [context-and-inherited-spine, codebase-grounding, story-seam-contracts, data-schema-and-migrations, component-and-state-flows, ai-and-probabilistic-boundaries, invariants-and-decisions, stack, spine-impact-and-deferred, open-questions]
guidance: guidance-method.md
rubric: rubric-architecture.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Concrete technical design for one epic against the live codebase: shared story contracts, schema/migrations, state flows, and seam verification. -->

<!-- stance: Design strictly for this epic against real shipped code. Inherit parent `arch-spine` `AD-n`s read-only without re-deriving them; if no parent spine exists, establish a compact paradigm, boundaries, and pinned stack inline. Keep per-story file/task lists out — `bmad-build` plans those against the code at build time. -->

<!-- opening: Read the epic ticket (`epic-*.md`), `prd-epic` (if any), parent `arch-spine` (if any), UX companions, and live codebase modules touched by this epic before asking anything. Play back what the live code and parent spine already settle, then focus on the concrete seams and contracts this epic introduces. -->

<!-- inputs: Epic container, `prd-epic`, parent `arch-spine`, live repo code, UX `DESIGN.md` / `EXPERIENCE.md`, and standing persistent facts. Only the user knows local performance budgets, rollout constraints, and trade-offs. -->

<!-- writing:
  - Cite inherited parent `AD-n`s by original ID (never renumber); local decisions allocate `AD-n` IDs above the highest ID already used across the parent spine and any sibling `arch-epic` documents (or start at `AD-1` when standalone) with `Binds`, `Prevents`, `Rule`, and optional one-line `Why`.
  - On updates, keep existing `AD-n` IDs stable (amend in place, never renumber or reuse retired IDs), allocate any new `AD-n` IDs above the highest ID in play across parent and siblings so no ID is allocated twice across the hierarchy, and flag any decision overriding the driving epic ticket so it can be updated.
  - Verify every proposed `AD-n` against epic and parent numeric `Passable` / `Good` `OKR-N` bounds and `INV-N` invariants before settling.
  - Flag any conflict with a parent `AD-n` as a spine impact rather than overriding silently.
-->

<!-- companions: When this epic defines an API, webhook, or event contract consumed by sibling epics or external clients, also write `contract.yaml` beside `{doc}` and register its pointer row in the parent `arch-spine` Contract index when a parent spine exists. -->

<!-- done when: Live repo seams are grounded in real modules; shared story contracts and any `contract.yaml` are concrete; schemas/migrations and state flows cover the epic's rules and failure modes; verification/eval gates and bounded costs hold where metered or probabilistic dependencies apply; every `AD-n` clears numeric `Passable` / `Good` `OKR-N` bounds and `INV-N` invariants; and any parent `arch-spine` Contract index or `AD-n` impacts are recorded. -->

# {title}

## Table of Contents

## Context and inherited spine
<!-- Link the epic ticket, `prd-epic`, and parent `arch-spine` (if any), citing target `OKR-N` bands and `INV-N` IDs. List binding parent `AD-n`s by original ID; for standalone epics with no parent spine, state the compact paradigm, operational boundary, and telemetry hook inline. -->

## Codebase grounding
<!-- Live modules, existing data models, APIs, auth/telemetry conventions, and test patterns inspected in the repo that this epic builds on or extends. -->

## Story seam contracts
<!-- Concrete API endpoints, event schemas, DTOs, or shared interfaces that multiple stories in this epic or sibling epics depend on. Note when `contract.yaml` is emitted beside `{doc}` as the canonical machine-readable contract. -->

## Data schema and migrations
<!-- include when: this epic adds or alters persistent data. Concrete tables, columns, indexes, retention/isolation keys, migration sequence, and rollback safety. `diagram: er` when multiple entities relate. -->

## Component and state flows
<!-- include when: this epic has non-trivial component boundaries, async jobs, retries, or state transitions. `diagram: sequence` or `state` showing happy and failure paths. -->

## AI and probabilistic boundaries
<!-- include when: this epic introduces or modifies an LLM, RAG, agent loop, or other probabilistic/ML component.
  - Split deterministic code from probabilistic/model inference; specify capability tiers (concrete model IDs in config, not hardcoded snapshots), output validation, and non-AI fallbacks.
  - Where retrieval or model tools apply, fix context/token budgets, compaction rules preserving invariants, structural pre-retrieval tenant/ACL isolation and grounding (plus a `diagram: flowchart` of ingestion and trust zones for RAG), and a tool permission table (`Tool`, `Data scope`, `Side effects`, `Auth & tenant check`, `Approval gate / idempotency`) so indirect prompt injection cannot escalate privileges.
  - Set offline/online eval thresholds (`Passable`/`Good` release and rollback gates) and hard circuit breakers (max turns, tool calls, subagent depth, per-run/daily spend caps, PII-redacted tracing where applicable).
-->

## Invariants and decisions
<!-- Epic-local `AD-n` blocks continuing above the parent spine's highest `AD-n` (or starting at `AD-1` when standalone, e.g. `### AD-1 — <decision>`): `- **Binds:**`, `- **Prevents:**`, `- **Rule:**`, optional one-line `- **Why:**`, and `[ADOPTED]` when pre-settled. Verify every `AD-n` against numeric `Passable` / `Good` `OKR-N` bounds and `INV-N` invariants; surface any parent `AD-n` contradiction as a spine conflict. -->

## Stack
<!-- include when: standalone epic bootstraps its stack inline or this epic adds new pinned dependencies. Verified pinned versions only: `| Name | Version |`. -->

## Spine impact and deferred
<!-- `"None"` if the parent `arch-spine` needs no update; otherwise list Contract index rows to register and impacted parent `AD-n`s to amend. Also list per-story implementation details deferred to `bmad-build`. -->

## Open questions
<!-- optional. Unsettled technical questions blocking stories, naming who can answer. -->
