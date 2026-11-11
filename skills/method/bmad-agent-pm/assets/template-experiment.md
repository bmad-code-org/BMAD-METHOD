---
title: ""
template: experiment
version: 1.1.0
description: "A measured test of one hypothesis, its thresholds set before it runs."
not_for: "Learning by building something (`prototype-plan`); a change already decided that needs requirements (`prd`, `prd-light`)."
paced: true
facilitation_order: [hypothesis, test, thresholds, guardrails, duration, result?]
guidance: guidance-planning
rubric: rubric-planning
status: draft
created: ""
updated: ""
---

<!-- purpose: Settle one question by measurement, with what counts as an answer fixed before the data arrives. -->

<!-- stance: One hypothesis per card; a second one is a second card. Press for numbers on the thresholds. When the traffic or time available cannot show the effect, say so before anyone runs it. -->

<!-- inputs: The change, who sees it and the metric it should move. Only the user knows what result would make them act, and what must not get worse. -->

<!-- writing: About a page. No requirement ids. Result stays out until the experiment has run. -->

<!-- done when: Someone else could run it from this file, and two readers given the data would reach the same verdict. -->

<!-- next: Once it has run, write Result through an Update, against the thresholds as written; a threshold moved after the data is a new experiment. A supported hypothesis goes to `prd`, `prd-light` or Sofia (`bmad-agent-po`). -->

# {title}

## Hypothesis
<!-- "We believe [change] for [who] will [effect], because [evidence]." You are a scientist who will not run a test that cannot fail: one change, one group, one effect, and evidence that it is worth testing at all. A hypothesis with two effects is two cards; say so and pick one. Done when the user would accept a result that proves it wrong. -->

## Test
<!-- What will be done, to whom, how they are split, and the one metric that decides it. Ask how the groups are kept apart and what else could move the metric at the same time; a metric that drifts with the season or a campaign needs a control. Done when someone else could set it up from this section alone. -->

## Thresholds
<!-- The result that counts as success and the result that kills the idea, each a number or a named observation, written before the test starts. This is the section the card exists for: hold the user to numbers. "It goes up" and "we'll see" are not thresholds. Ask what result would make them stop, not only what would make them celebrate, and what happens in between. Done when two people given the data would reach the same verdict. -->

## Guardrails
<!-- What must not get worse while it runs, and the level that stops it early. You are the person who answers for the damage if it goes wrong: ask what a customer, the revenue or support would notice first. Done when each guardrail has a stop level and someone watching it. -->

## Duration
<!-- How long or what sample, and why that is enough to show the effect. Check the traffic against the effect the thresholds need; when it cannot show that effect in the time available, say so before anyone runs it, and offer a bigger change, a longer run or a different metric. Done when the user knows the run can answer the question. -->

## Result
<!-- include when: the experiment has run; written through an Update. The verdict first, the numbers against each threshold, what surprised anyone, the decision, and the next hypothesis. -->
