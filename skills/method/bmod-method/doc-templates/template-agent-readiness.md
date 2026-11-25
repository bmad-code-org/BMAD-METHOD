---
title: ""
template: agent-readiness
version: 1.0.0
category: codebase-readiness
description: "Diagnose a codebase for agentic delivery friction, doc/comment noise, and pattern drift."
not_for: "Writing or refreshing `AGENTS.md` directly (`bmad-project-context`); greenfield architecture (`arch-spine`); reviewing one PR (`bmad-code-review`)."
agents: [bmad-agent-architect]
order: fixed
facilitation_order: [repository-baseline, pattern-consistency, attention-and-doc-hygiene, comment-hygiene, modularity-and-context-fit, feedback-loops-and-guardrails, remediation-backlog, executive-scorecard]
guidance: guidance-method.md
rubric: rubric-agent-readiness.md
view: always
status: draft
created: ""
updated: ""
---

<!-- purpose: Audit an existing codebase for what slows or misleads coding agents, settle canonical patterns, and sequence a test-first cleanup backlog. -->

<!-- stance:
  - Lead with measured repository evidence before asking questions.
  - Prioritize hot, frequently changed paths over frozen legacy files nobody edits.
  - Never replace documentation bloat with new documentation bloat.
  - Keep canonical decisions sharp (`AD-n`) and turn prose rules into automated checks wherever possible.
-->

<!-- opening:
  - Before asking anything, inspect `{project-root}` directly (or run quick git/file checks) to map file sizes, git churn hotspots, instruction/doc footprints, comment noise, and existing test/lint/CI guardrails.
  - Play back the measured summary and top hotspots briefly, then ask where coding agents have actually drifted, broken things, or wasted context recently.
-->

<!-- inputs: Direct repository telemetry, inspection of the hotspot files surfaced, and the user's firsthand knowledge of recurring agent mistakes and canonical preferences. -->

<!-- writing:
  - Cite real file paths and measured numbers from code and repository inspection.
  - Every canonical pattern choice uses an `AD-n` block (`Binds`, `Prevents`, `Rule`, optional one-line `Why`).
  - Score each diagnostic dimension cleanly: `Strong`, `Adequate`, `Friction`, or `Broken`.
-->

<!-- done when: All six diagnostic dimensions are scored against verified code evidence; every competing pattern in hot code names a single canonical `AD-n` winner; doc/comment pruning targets and prose-to-check promotions are concrete; and the remediation backlog is ordered with test gates before refactors. -->

<!-- layout: Executive Agent-Readiness Scorecard with a six-dimension health grid, churn-by-size hotspot table, canonical-vs-legacy pattern matrix, and sequenced test-first cleanup cards. -->

# {title}

## Table of Contents

## Executive scorecard
<!-- built: from the completed diagnostic sections below.
  - Present overall readiness verdict, six-dimension scores (`Strong` / `Adequate` / `Friction` / `Broken`), top three attention leaks, and the first cleanup slice to run next.
  - Keep strictly derived from settled sections; add no unverified claims.
  - Done when a tech lead can scan the verdict and approve slice 1 in two minutes.
-->

## Repository baseline
<!--
  - Record verified repository baseline telemetry: codebase footprint, primary languages, active test/lint guardrails, and top churn × size hotspots.
  - Confirm with the user which areas are actively developed versus frozen legacy so the audit ignores dead corners.
  - Done when active target scope and baseline telemetry are confirmed by the user.
-->

## Pattern consistency
<!--
  - Inspect the highest-churn directories and compare how recurring concerns are implemented (routing, data access, validation, error shapes, async jobs, test setup).
  - Surface every place the repo does the same thing two or more ways; lay out options and force the user to pick one canonical pattern and mark the old ones legacy.
  - Capture each settled winner as an `### AD-n — <canonical pattern>` block with `Binds`, `Prevents`, `Rule`, and optional `Why`.
  - Done when every competing pattern in active code has one canonical `AD-n` winner and a legacy migration rule.
-->

## Attention and doc hygiene
<!--
  - Review instruction and documentation files (`AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `README.md`, large `docs/*.md`, old plans).
  - Check each against live code: flag rules that contradict reality, restate what manifests already show, duplicate across files, or bloat auto-loaded context.
  - Produce a crisp disposition table (`File`, `Tokens`, `Issue`, `Action: keep | trim | consolidate | archive | delete`).
  - Done when every heavy doc or instruction file has an explicit keep, trim, consolidate, or delete decision.
-->

## Comment hygiene
<!--
  - Spot-check high-churn and recent source files for LLM-degrading comment noise.
  - Classify actionable targets: narrating-the-obvious comments, stale docblocks disagreeing with code, commented-out dead code, ticket/workflow breadcrumbs, and essay comments hiding unclear naming.
  - Contrast those with the rare high-value *why* comments to preserve (non-obvious invariants, external quirks, regulatory/perf constraints).
  - Done when concrete files/patterns are slated for pruning or refactoring without stripping valid *why* comments.
-->

## Modularity and context fit
<!--
  - Inspect the largest and highest-churn source files for god-files, dumping-ground `utils`/`helpers` modules, oversized barrel re-exports, and implicit magic that forces agents to load huge files for small edits.
  - Weight by churn: ignore giant files that never change unless they block current work.
  - Done when each hot oversized module has a clear split target or an explicit leave-alone call.
-->

## Feedback loops and guardrails
<!--
  - Evaluate how fast and reliably an agent can prove a change locally: typechecking, linting, unit/integration/E2E coverage, test isolation, and clear failure output.
  - List prose rules currently in docs or `AGENTS.md` that can be promoted into deterministic linters, architectural boundary tests, or pre-commit hooks.
  - Done when test gaps on hot paths and concrete prose-to-check promotions are named.
-->

## Remediation backlog
<!--
  - Assemble a sequenced, bounded cleanup plan ordered by `(churn × risk)`: characterization or E2E tests first, deterministic checks/doc pruning early, pattern/module refactors in separate single-concern slices.
  - Format each slice so Sofia (`bmad-agent-po`) or Amelia (`bmad-build`) can execute it directly: slice title, target files/patterns, test gate, and verification command.
  - Done when every finding from the six dimensions either maps to a bounded slice or is marked accepted/deferred.
-->
