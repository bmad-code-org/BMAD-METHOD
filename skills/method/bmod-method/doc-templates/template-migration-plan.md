---
title: ""
template: migration-plan
version: 1.0.0
category: risk-and-ops
description: "Safety-first data, platform, or API migration plan with parity proof and rollback gates."
not_for: "Greenfield system architecture (`arch-spine`); post-incident analysis (`postmortem`)."
agents: [bmad-agent-architect]
order: fixed
facilitation_order: [scope-and-blast-radius, parity-and-verification-proof, rollback-and-point-of-no-return, coexistence-and-backfill, cutover-sequence, communication-and-decommission, open-questions, summary]
guidance: guidance-method.md
rubric: rubric-architecture.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Plan a data, schema, platform, or API migration so zero data is silently lost and every stage has proven parity and a tested rollback path. -->

<!-- stance:
  - Refuse to design cutover steps until parity verification and rollback rules are settled first.
  - Probe every hidden hazard: partial failures, dual-write drift, lock contention, skewed old/new code deploys, and the exact point of no return.
-->

<!-- opening: Ask what is moving from where to where, data volume/traffic scale, acceptable downtime or read-only window (if any), and who feels a bad cutover. Read any live schemas or existing architecture docs first. -->

<!-- inputs: Source and target systems, volume/throughput bounds, downtime tolerance, and live schema/traffic constraints. -->

<!-- writing:
  - Keep cutover, backfill, and rollback steps as numbered runbook tables with explicit go/no-go verification checks.
  - Every verification step names an exact query, metric, or diff — never "verify everything looks good".
-->

<!-- done when: Blast radius is bounded; parity verification queries/checks are concrete; rollback triggers and point of no return are explicit; backfill idempotency and coexistence rules hold; and old-system decommissioning has clear criteria. -->

# {title}

## Table of Contents

## Summary
<!-- built: from the completed migration plan below.
  - Summarize source/target, strategy (expand-contract, dual-write, strangler, or big-bang window), parity proof, point of no return, and go/no-go gates.
  - Done when an operator or release lead sees the shape and risk controls at a glance.
-->

## Scope and blast radius
<!--
  - Inventory every store, table, topic, API, background job, report, and downstream consumer touched by the migration.
  - State acceptable maintenance window, data-loss tolerance (RPO), and binding `OKR-N` / `INV-N` constraints.
  - Done when no hidden consumer or dependent job is unaccounted for.
-->

## Parity and verification proof
<!--
  - Define exact automated checks proving target matches source before any traffic or authority switches: row counts, checksums, shadow-read diffs, invariant assertions, and discrepancy tolerance.
  - Decide how discrepancies are logged and reconciled before advancing.
  - Done when parity can be proven mechanically at each stage.
-->

## Rollback and point of no return
<!--
  - Define exact abort/rollback triggers, how traffic and writes revert at each phase, and the exact point of no return after which rollback requires forward-fix or restore.
  - Require a dry-run or staging rehearsal of rollback before production cutover.
  - Done when every phase up to the point of no return has a concrete, fast undo step.
-->

## Coexistence and backfill
<!--
  - Detail expand-contract schema order, dual-write or CDC sync mechanics, idempotent/resumable batched backfill, throttling to protect live traffic, and handling updates/deletes during backfill.
  - Include a `diagram: sequence` or `flowchart` of the coexistence state.
  - Done when old and new code versions can run safely side by side during transition.
-->

## Cutover sequence
<!--
  - Order cutover into explicit phases (`Phase`, `Action`, `Entry gate`, `Parity check`, `Abort path`), including canary/cohort progression if applicable.
  - Name one command/runbook owner per phase.
  - Done when an on-call team can run the cutover step by step without improvising.
-->

## Communication and decommission
<!--
  - Cover customer/partner notice requirements, support/on-call briefing, soak window before deleting old structures, and explicit criteria to retire legacy code/tables.
  - Done when legacy teardown has a clean gate instead of lingering forever.
-->

## Open questions
<!-- optional. Unresolved migration risks or environment unknowns, naming owner and needed-by milestone. -->
