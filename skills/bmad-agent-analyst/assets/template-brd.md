---
title: ""
template: brd
version: 1.1.0
description: "What the business requires and signs for, when the builder is a separate party."
not_for: "Product work inside one organization (`opportunity`, `prd`); a funding decision (`business-case`); what the system shall do, line by line (`srs`)."
facilitation_order: [objectives, stakeholders, scope, current-and-future-process, business-requirements, business-rules, constraints-and-assumptions?, cost-and-benefit?, traceability, open-questions, summary, approval]
guidance: guidance-planning
rubric: rubric-planning
status: draft
created: ""
updated: ""
---

<!-- purpose: A baseline of what the business requires, signed by its sponsor, that a separate builder, vendor or delivery team plans and is held to. -->

<!-- stance: Stakes are usually contracted or regulated. Stay on the business side of the line: once a statement names a screen, a field or an API it has started designing, so move it to `prd` or `srs`. Push for an owner and a source on every requirement and rule. -->

<!-- inputs: The sponsor, the process being changed, and any business case, charter, contract or policy behind it. Only the user knows who signs, which rules are binding and what is out. -->

<!-- writing: About 3,000 words. Requirements are outcomes the business needs, not system behavior. Ids (BR-N, RULE-N) are global and never reused. A rule is stated once, in Business rules, and cited everywhere else. Objectives and cost point at the business case or charter where one exists instead of repeating it. -->

<!-- done when: Every BR-N has an owner, a source, a priority and a way to verify it; every rule has an id and an owner; nothing in the document names a screen, a field or an API; and the approval block names who signs. -->

<!-- next: `status: final` does not record a signature; the approval block does. After sign-off, `prd` or `srs` picks up the BR-N and RULE-N ids and fills the traceability table's empty columns. -->

# {title}

## Table of Contents

## Summary
<!-- What the business wants changed, for whom, and why now, in a short paragraph. -->

## Objectives
<!-- The measurable outcomes this serves, short, citing the business case or charter when one exists. -->

## Stakeholders
<!-- Who asks, who owns the outcome, who approves, who is affected. -->

## Scope
<!-- In and out, each explicit. -->

## Current and future process
<!-- How the work runs today and how it should run after, in business terms. diagram: flowchart -->

## Business requirements
<!-- A table: BR-N, the requirement as an outcome, owner, source, priority, how it will be verified. When everything comes back as a must, ask what the business would give up first, and rank from that answer. -->

## Business rules
<!-- RULE-N, kept apart from requirements: each rule states what must hold or how a term is defined, with its owner and source. Use a decision table where the logic is dense. -->

## Constraints and assumptions
<!-- optional. Limits the business sets on budget, dates, policy or suppliers, and what is assumed true. -->

## Cost and benefit
<!-- include when: no business case exists. Rough cost, expected benefit and who bears each. -->

## Traceability
<!-- A table: BR-N, then empty columns for the `prd` or `srs` line, the test and the ticket, which later documents fill in. -->

## Open questions
<!-- Each with an owner and what it blocks. -->

## Approval
<!-- A table of names, roles, decision and date. The user supplies each name; a blank row means not yet approved. -->
