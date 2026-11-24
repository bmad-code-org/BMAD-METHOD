---
title: ""
template: arch-ai
version: 1.0.0
category: specialized
description: "AI and agentic system architecture: routing, grounding, tool guardrails, evals and cost."
not_for: "Deterministic software with no LLM or agent runtime (`arch-spine` or `arch-epic`)."
agents: [bmad-agent-architect]
methods: methods-ai-architecture.csv
guidance: guidance-method.md
rubric: rubric-architecture.md
lint: uv run "{project-root}/_bmad/method/scripts/lint_arch.py" "{doc}"
status: draft
created: ""
updated: ""
---

<!-- purpose: Design an LLM, RAG, or agentic subsystem with deterministic boundaries, least-privilege tool guardrails, eval gates, and bounded unit economics. -->

<!-- stance:
  - Challenge whether an LLM or agent loop is warranted at all — push deterministic code, rules, or workflows wherever probabilistic judgment isn't needed.
  - Treat prompts, retrieved docs, and tool outputs as untrusted data crossing security boundaries.
  - Walk `methods-ai-architecture.csv` threats systematically and never hardcode specific vendor model snapshot names when capability tiers or config bindings suffice.
-->

<!-- opening: Read any parent PRD, `arch-spine`, or codebase first, then ask what job the AI component performs, what accuracy/latency/cost targets apply, and what worst-case mistake is unacceptable. -->

<!-- inputs: Use case, input/output contracts, sensitive data and tool permissions, `OKR-N` quality/latency/cost bounds, and failure tolerance. -->

<!-- writing:
  - Define architectural invariants as `AD-n` blocks (`Binds`, `Prevents`, `Rule`, optional `Why`) verified against `OKR-N` numeric `Passable` / `Good` bounds and `INV-N` invariants.
  - Specify capability tiers (fast/classifier, reasoning, embedding) and leave concrete model IDs in runtime configuration rather than hardcoding snapshots.
-->

<!-- done when: Probabilistic vs. deterministic boundaries are drawn; model routing and non-AI fallbacks exist; context/retrieval isolation is enforced; tools have least-privilege scopes and approval gates; eval thresholds (`Passable`/`Good`/`Excellent`) and loop/cost caps are fixed. -->

# {title}

## Table of Contents

## Problem and probabilistic fit
<!--
  - State what the AI/agent component does, why deterministic code cannot do it alone, and which workflow steps stay strictly deterministic (validation, auth, math, state commits).
  - Cite parent `OKR-N` bounds (quality, latency, cost per run) and `INV-N` invariants.
  - Done when only genuinely ambiguous or generative steps use model inference.
-->

## Model routing and fallbacks
<!--
  - Map capability tiers (extraction/routing, synthesis/reasoning, embeddings/rerank) to latency, structured-output, and provider-data-retention requirements.
  - Define fallback behavior on provider outage, rate limit, or malformed schema output (including graceful non-AI fallback where possible).
  - Done when provider outages, deprecations, and schema drift have deterministic handling.
-->

## Context, memory and grounding
<!--
  - Specify what enters the prompt or context window, token budgets, compaction/truncation priority (what invariants never drop), and retrieval pipeline if RAG is used.
  - Enforce tenant/ACL filtering before retrieval, index freshness/deletion SLA, and grounding/citation checks for factual claims.
  - Include a `diagram: flowchart` showing data ingestion, retrieval boundaries, and trust zones.
  - Done when context limits, freshness, and tenant isolation are enforced structurally rather than by prompt phrasing.
-->

## Tools, permissions and guardrails
<!--
  - Table every tool/action exposed to the model (`Tool`, `Data scope`, `Side effects`, `Auth & tenant check`, `Approval gate / idempotency`).
  - Walk `methods-ai-architecture.csv` security rows: untrusted data separation, prompt-injection defenses, secret/PII scrubbing, and human confirmation for destructive or external writes.
  - Done when a prompt injection in user or retrieved text cannot escalate privileges or leak cross-tenant data.
-->

## Eval harness and thresholds
<!--
  - Define offline golden/adversarial test sets, online sampling, automated judges/assertions, and numeric `Passable` / `Good` / `Excellent` release and rollback gates.
  - Include regression checks for prompt, retrieval, and model-tier changes.
  - Done when quality and safety regressions are caught before shipping to users.
-->

## Invariants and decisions
<!--
  - Capture durable rules as `### AD-n — <decision>` blocks (`Binds`, `Prevents`, `Rule`, optional `Why`), verified against `OKR-N` bounds and `INV-N` invariants.
  - Done when every architectural rule preventing hallucination, privilege escalation, or drift is enforceable.
-->

## Cost and observability
<!--
  - Define hard circuit breakers (max turns, tool calls, subagent depth, per-request and daily spend caps), caching strategy, and unit-cost budget per task.
  - Define trace logging (inputs/outputs/tool calls/latency/tokens with PII redaction) and anomaly alerts.
  - Done when runaway agent loops are capped automatically and unit economics match `OKR-N` targets.
-->

## Open questions
<!-- optional. Unsettled eval datasets, provider compliance approvals, or thresholds, naming owner and target milestone. -->
