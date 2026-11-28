---
title: ""
template: solution-design
version: 1.0.0
category: decisions
description: "Human-facing technical RFC and proposal for ARB, partner team, or client sign-off."
not_for: "Terse coding-agent build substrate (`arch-spine`); recording a single settled choice (`decision-record`); comparing outside vendors (`tech-evaluation`)."
agents: [bmad-agent-architect]
facilitation_order: [problem-and-constraints, options-considered, proposed-solution, integration-and-data-flows, operational-and-security-posture, rollout-and-risks, cost-and-effort, open-questions, executive-summary]
guidance: guidance-method.md
rubric: rubric-architecture.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Align reviewers, partner teams, or an Architecture Review Board on a complete technical proposal with explicit alternatives, flows, risks, and sign-off. -->

<!-- stance:
  - Act as a skeptical Architecture Review Board reviewer helping the author build an airtight case.
  - Demand real alternatives including doing nothing, steelman each rejected option, and test every claim against stated `OKR-N` bounds and `INV-N` invariants.
  - Verify named dependencies, APIs, and constraints against live code or web sources.
-->

<!-- opening: Read any driving ticket, PRD, parent `arch-spine`, or codebase context first, then ask who must approve or consume this proposal and what decision or deadline drives it. -->

<!-- inputs: The business or technical problem, stakeholders/approvers, binding `OKR-N` / `INV-N` constraints, and realistic design alternatives. -->

<!-- writing:
  - Write for busy technical reviewers who did not attend the design sessions.
  - Carry architecture, sequence, and boundary shape in Mermaid diagrams and comparison tables rather than long prose walls.
  - Cite parent `OKR-N`, `INV-N`, and `AD-n` items by short handle and id, linking the parent document, rather than redefining them.
-->

<!-- done when: Problem and constraints are grounded; at least two realistic alternatives are fairly weighed; end-to-end flows, failure/security posture, rollout/rollback, and cost/effort are concrete; and an approver can sign off or reject cleanly. -->

<!-- layout: Clean technical RFC layout with a crisp Executive Summary callout, side-by-side option trade-off matrix, prominent architecture and sequence diagrams, and a highlighted Rollout & Sign-off section. -->

# {title}

## Table of Contents

## Executive summary
<!-- built: from the settled proposal below.
  - State in half a page: the problem, the recommended design, why it beat the alternatives, key trade-offs accepted, cost/risk headline, and the exact sign-off requested.
  - Done when an executive or ARB chair understands the decision without reading the full RFC first.
-->

## Problem and constraints
<!--
  - State the technical and business driver, who is affected, explicit non-goals, and binding `OKR-N` numeric `Passable` / `Good` bounds and `INV-N` invariants.
  - Name existing systems or parent `AD-n` constraints that this design must obey.
  - Done when reviewers agree on what problem is solved and what is out of scope.
-->

## Options considered
<!--
  - Compare at least two realistic options plus doing nothing or extending the status quo.
  - Steelman each option fairly in a structured table (`Option`, `Strengths`, `Costs & risks`, `OKR/INV fit`) before stating why one wins.
  - Push back if only one viable option is presented or if rejected options are strawmanned.
  - Done when a supporter of any rejected option would recognize their case was fairly represented.
-->

## Proposed solution
<!--
  - Present the chosen architecture: components, responsibilities, data ownership, key schema or interface changes, and verified stack choices.
  - Include a `diagram: flowchart` showing components, trust boundaries, and dependencies.
  - Done when a partner engineer can trace where every responsibility lives.
-->

## Integration and data flows
<!--
  - Walk the critical happy paths and failure/retry paths across systems or teams.
  - Include a `diagram: sequence` for multi-hop interactions, plus payload contracts, idempotency, and consistency guarantees.
  - Done when upstream/downstream team contracts and failure behaviors are unambiguous.
-->

## Operational and security posture
<!--
  - Cover auth/authz, data classification/privacy, telemetry hooks for `OKR-N` proof, alerting, SLO expectations, and failure-isolation boundaries.
  - When the proposal uses an LLM, RAG, agent loop, or other probabilistic/ML component, explicitly cover deterministic vs. probabilistic boundaries, non-AI fallbacks, and eval/regression gates (plus pre-retrieval tenant isolation and prompt-injection/tool approval guardrails where retrieval or tools apply).
  - Flag any new compliance, secret-management, or operational support burden.
  - Done when security and SRE reviewers see how the design behaves under abuse or outage.
-->

## Rollout and risks
<!--
  - Detail phased rollout or feature-flag strategy, backward compatibility, rollback trigger and mechanism, and top technical risks with mitigations.
  - Include explicit review/sign-off owners (`Approver`, `Area`, `Status`).
  - Done when rollout safety and clear sign-off ownership are established.
-->

## Cost and effort
<!--
  - Summarize build/migration effort drivers, ongoing infrastructure or vendor cost changes, unit economics and hard spend/loop caps for metered dependencies, and team dependencies.
  - Tag unverified estimates `[ASSUMPTION: ...]` rather than inventing precision.
  - Done when cost drivers and cross-team dependencies are transparent.
-->

## Open questions
<!-- optional. Unresolved items blocking or following approval, naming owner and needed-by milestone. -->
