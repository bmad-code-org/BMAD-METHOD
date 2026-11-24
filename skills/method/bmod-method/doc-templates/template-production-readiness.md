---
title: ""
template: production-readiness
version: 1.0.0
category: risk-and-ops
description: "Pre-launch production readiness review: SLOs, failure modes, capacity, recovery and verdict."
not_for: "An incident that already happened (`postmortem`); OWASP/STRIDE security audit alone (`security-review`)."
agents: [bmad-agent-architect]
order: fixed
methods: methods-resilience.csv
guidance: guidance-method.md
rubric: rubric-architecture.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Audit a service or release before production launch across failure modes, capacity, observability, and tested recovery, ending in a Go / Conditional Go / No-Go verdict. -->

<!-- stance:
  - Act as a battle-tested SRE conducting a launch gate review.
  - Never accept "the cloud/framework handles it" or untested backups/failovers as passing — anything not exercised in staging or production is `unverified`.
  - Walk every applicable row of `methods-resilience.csv` systematically.
-->

<!-- opening: Ask what is launching, who depends on it, its criticality tier, and ask for existing architecture docs, load-test results, dashboards, and runbooks to inspect before probing. -->

<!-- inputs: System architecture, dependency list, expected traffic/burst profile, observability links, and test/drill evidence supplied by the user. -->

<!-- writing:
  - Record only evidence actually verified by the user or repo; never invent load numbers, SLOs, or drill results.
  - Mark every resilience check explicitly: `pass`, `gap`, `unverified`, or `not applicable`.
-->

<!-- done when: Criticality and SLOs are stated; every applicable resilience failure mode has a verified status; capacity ceiling and first bottleneck are named; alerts and tested recovery exist; and every blocker has an owner or blocks launch. -->

<!-- layout: Launch Readiness Gate dashboard highlighting the Go / Conditional Go / No-Go verdict banner, SLO targets, resilience status matrix, and launch-blocker tracker. -->

# {title}

## Table of Contents

## Summary
<!-- built: from the completed readiness review below.
  - State the verdict (`Go`, `Conditional Go`, or `No-Go`), service tier, top three risks or unverified gaps, and sign-off owners.
  - Done when a launch approver can see the exact ship decision and open blockers immediately.
-->

## Service and criticality
<!--
  - Describe the service/release boundary, blast radius of downtime or data loss, availability/latency SLOs (matching `OKR-N` Passable/Good bounds), and on-call ownership.
  - Done when target reliability expectations are concrete and agreed.
-->

## Dependency and failure modes
<!--
  - Inventory every upstream/downstream dependency (DB, queue, cache, auth, third-party APIs, model providers) with configured timeouts, retry/backoff caps, circuit breakers, and degraded behavior.
  - Walk applicable rows from `methods-resilience.csv` and record a table (`Mode`, `Status: pass | gap | unverified | n/a`, `Evidence / behavior`, `Action`).
  - Include a `diagram: flowchart` showing dependency isolation boundaries.
  - Done when every critical dependency failure path is explicit and tested or flagged.
-->

## Capacity and scaling limits
<!--
  - Compare expected steady-state and peak traffic against measured load-test ceilings, connection-pool limits, queue depths, and autoscaling lag.
  - Name the first resource expected to saturate under a 10x spike and what protects the system (shedding, rate limits, backpressure).
  - Done when scaling headroom and overload protection are backed by numbers or marked `unverified`.
-->

## Observability and alerting
<!--
  - Verify structured logs, distributed trace correlation, metrics proving `OKR-N` targets, actionable alerts (tied to user impact, not noisy CPU spikes), and runbook links on every page.
  - Verify dashboard visibility during rollout and canary comparison.
  - Done when an on-call engineer could detect and localize a launch failure quickly.
-->

## Recovery and security hygiene
<!--
  - Check backup/restore RPO and RTO (untested restore stays `unverified`), feature flags/kill switches, safe deploy rollback, secret rotation, and least-privilege IAM.
  - Done when emergency rollback and data recovery paths are concrete and verified.
-->

## Launch blockers and verdict
<!--
  - List all `gap` and high-risk `unverified` findings in a table (`Finding`, `Severity`, `Launch blocker?`, `Owner`, `Mitigation / acceptance`).
  - Deliver an honest verdict: `Go` (zero open blockers), `Conditional Go` (specific blockers must close before GA), or `No-Go` (material risk unacceptable).
  - Done when every blocker has an owner or the team explicitly accepts a `No-Go` / delayed launch.
-->
