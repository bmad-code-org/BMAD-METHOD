---
title: ""
template: arch-enterprise
version: 1.0.0
category: delivery
description: "Enterprise architecture spine: shared platform, cross-initiative seams and sovereignty."
not_for: "One initiative's system architecture (`arch-spine`); one epic's technical design (`arch-epic`); a single architectural trade-off (`decision-record`)."
agents: [bmad-agent-architect]
facilitation_order: [context-and-program-bounds, domain-ownership-and-sovereignty, cross-domain-contracts-and-topology, shared-platform-and-telemetry, invariants-and-decisions, stack, explicitly-deferred-decisions, open-questions]
guidance: guidance-method.md
rubric: rubric-architecture.md
lint: uv run "{project-root}/_bmad/method/scripts/lint_arch.py" --project-root "{project-root}" "{doc}"
status: draft
created: ""
updated: ""
---

<!-- purpose: The portfolio consistency contract across bounded initiatives: domain ownership, data sovereignty, versioned cross-domain contracts, and shared operational rails. -->

<!-- stance: Stay strictly at program altitude. Only fix calls that cross initiatives (`INIT-NN`); single-initiative system design belongs in `arch-spine`, and table columns or payloads belong in `arch-epic`. For major calls, lay out the realistic trade-offs and why you lean one way, then let the user choose. -->

<!-- opening: Establish whether the program is legacy modernization, net-new greenfield, or hybrid, plus what existing platform constraints or enterprise policies bind it. Read the program ticket, `prd-program`, `charter`, and `brd` before asking anything they already answer. -->

<!-- inputs: The program container (`program-*.md`), `prd-program` or `charter`, existing architecture standards, and standing persistent facts. Only the user knows org politics, vendor mandates, and wave priorities. -->

<!-- writing:
  - Record decisions, not prose rationale: each `AD-n` carries `Binds`, `Prevents`, `Rule`, and a one-line `Why` only when alternatives were weighed or the user gave a reason.
  - Tag `[ADOPTED]` when the user or existing platform reality already settled a decision.
  - Verify every named technology and version on the web before pinning it.
  - Verify every proposed `AD-n` against program `OKR-N` numeric `Passable` and `Good` bounds and binary `INV-N` invariants before settling.
-->

<!-- done when: Domain system-of-record ownership is settled; versioned cross-domain seams and shared telemetry rails are fixed; every `AD-n` passes program `OKR-N` bounds and `INV-N` invariants; nothing under Explicitly deferred decisions lets two initiatives collide; and every open question names an owner. -->

# {title}

## Table of Contents

## Context and program bounds
<!-- Link the program ticket and `prd-program` (or `charter`), citing wave `OKR-N` bounds and `INV-N` invariants by ID without restating them. Summarize existing enterprise systems and compliance constraints in a crisp table. -->

## Domain ownership and sovereignty
<!-- Map each bounded domain or initiative (`INIT-01`..) to the canonical nouns and data stores it owns as system of record, plus data residency, tenant isolation, and sovereignty boundaries. -->

## Cross-domain contracts and topology
<!-- Versioned integration contracts and event or API boundaries crossing between initiatives or legacy systems, plus Strangler Fig or coexistence seams when modernizing. `diagram: flowchart` showing domains and contract flows. -->

## Shared platform and telemetry
<!-- Shared auth/identity backbone, OTel observability and correlation rails for wave `OKR-N` measurement, CI/CD, and multi-region or hosting envelope owned at program scale. -->

## Invariants and decisions
<!-- Durable cross-initiative rules as ascending blocks (`### AD-1 — <decision>`): `- **Binds:**` (`INIT-NN` or `all`), `- **Prevents:**`, `- **Rule:**`, optional one-line `- **Why:**`, and `[ADOPTED]` when pre-settled. Before settling each `AD-n`, check it against numeric `Passable` and `Good` `OKR-N` thresholds and `INV-N` invariants. Include a dependency-direction diagram (`diagram: flowchart`). -->

## Stack
<!-- include when: the program standardizes shared platform technologies or runtimes across initiatives. Verified pinned versions only: `| Name | Version |`. Any stack choice with trade-offs or a user reason also gets an `AD-n`. -->

## Explicitly deferred decisions
<!-- Decisions intentionally pushed down to child `arch-spine` or `arch-epic`, naming the owning `INIT-NN` and the revisit condition or wave gate. -->

## Open questions
<!-- optional. Unsettled enterprise questions, one line each, naming who can answer and which wave or initiative needs it. -->
