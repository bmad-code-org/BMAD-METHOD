---
title: ""
template: tech-evaluation
version: 1.0.0
category: decisions
description: "Weighted build-vs-buy, vendor, or stack bake-off with TCO and lock-in analysis."
not_for: "Logging an already-made decision in one page (`decision-record`); full system architecture (`arch-spine` or `solution-design`)."
agents: [bmad-agent-architect]
order: fixed
facilitation_order: [decision-scope-and-disqualifiers, candidates, evaluation-matrix, tco-and-lock-in, spike-and-verification, recommendation, executive-summary]
guidance: guidance-method.md
rubric: rubric-planning.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Make a defensible build-vs-buy, vendor, or technology selection using pre-committed disqualifiers, weighted criteria, TCO, and lock-in analysis. -->

<!-- stance:
  - Lock disqualifiers and criterion weights BEFORE scoring candidates so the team cannot back-fit weights to a favorite.
  - Always include building in-house or keeping the current tool as a baseline candidate unless explicitly disqualified.
  - Verify current pricing, licensing, limits, and project maintenance health on the web — never cite vendor facts from memory.
-->

<!-- opening: Ask what capability or problem is being sourced, what already exists in the stack, and what budget, compliance, or timeline constraints are non-negotiable. -->

<!-- inputs: Problem context, non-negotiable constraints, candidate short-list, and any internal POC notes or vendor quotes. -->

<!-- writing:
  - Use comparison tables for candidates, weighted scoring, and total cost of ownership.
  - Tag vendor claims or unbenchmarked throughput figures `[ASSUMPTION: ...]` until verified by a spike or contract.
-->

<!-- done when: Disqualifiers and weights were locked before scoring; all serious candidates (including build/keep-current) were web-verified and scored; TCO and exit cost are explicit; and the recommendation names clear spike or adoption criteria. -->

<!-- layout: Decision Scorecard layout with an Executive Summary banner, locked criteria weights, color-coded comparison matrix, and TCO/exit-cost breakdown. -->

# {title}

## Table of Contents

## Executive summary
<!-- built: from the settled evaluation below.
  - State the recommended option, runner-up, decisive trade-offs, multi-year cost headline, and next validation step.
  - Done when an approver can verify the logic of the pick in one glance.
-->

## Decision scope and disqualifiers
<!--
  - Define what problem is being solved, who will operate it, and the binary pass/fail disqualifiers (compliance, data residency, licensing, hard `OKR-N`/`INV-N` bounds).
  - Lock the weighted evaluation criteria (`Criterion`, `Weight %`, `What 1 vs 5 means`) here BEFORE discussing candidate scores.
  - Done when weights sum cleanly and disqualifiers are agreed before candidates are evaluated.
-->

## Candidates
<!--
  - List every contender evaluated, explicitly including build-in-house or keep-status-quo alongside external/OSS options.
  - Record web-verified facts (license, release cadence, pricing tier, hard limits) and immediately mark any option eliminated by a disqualifier.
  - Done when the shortlist is complete and disqualified options are cleanly ruled out with evidence.
-->

## Evaluation matrix
<!--
  - Score each surviving candidate against the locked criteria with concrete evidence per cell (`Score 1–5`, `Evidence / gap`), not vague adjectives.
  - Challenge any score that relies on marketing claims instead of docs, benchmarks, or hands-on testing.
  - Done when weighted totals and clear differentiators between top two contenders are visible.
-->

## TCO and lock-in
<!--
  - Compare direct licensing/usage cost, integration and ongoing maintenance effort, operational overhead, and switching/exit cost if the choice fails later.
  - Flag hidden cost cliffs (per-seat, egress, volume tiers, proprietary lock-in APIs).
  - Done when total cost and reversibility are concrete across candidates.
-->

## Spike and verification
<!-- include when: a top candidate has unverified performance, integration, or quota claims.
  - Define a focused technical spike: hypotheses to prove, pass/fail exit metrics, and what would flip the choice to the runner-up.
  - Done when every risky assumption has a concrete test or explicit sign-off waiver.
-->

## Recommendation
<!--
  - State the chosen option, why it won over the runner-up, accepted downsides, and explicit conditions that would trigger revisiting this choice.
  - Done when the user confirms the pick and next adoption action.
-->
