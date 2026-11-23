---
title: ""
template: brd
version: 1.4.0
description: "What the business requires and signs for across a program or initiative a separate party builds."
not_for: "Product work inside one organization (`opportunity`, `prd-program`, `prd`); a funding decision (`business-case`); what the system shall do, line by line (`srs`)."
agents: [bmad-agent-analyst]
facilitation_order: [objectives, stakeholders, scope, current-and-future-process, business-requirements, business-rules, constraints-and-assumptions, cost-and-benefit, traceability, open-questions, approval, summary]
guidance: guidance-method.md
rubric: rubric-planning.md
lint: ../scripts/check_ids.py
status: draft
created: ""
updated: ""
---

<!-- purpose: A baseline of what the business requires, signed by its sponsor, that a separate builder, vendor or delivery team plans and is held to. -->

<!-- stance: Stakes are usually contracted or regulated. Stay on the business side of the line: once a statement names a screen, a field or an API it has started designing, so move it to `prd` or `srs`. Push for an owner and a source on every requirement and rule. -->

<!-- opening: Who signs for the business and who builds, the process being changed, and the documents behind it (business case, charter, contract, policy), to read first. The brain dump is what the business needs to be different once the work is done. -->

<!-- inputs: The sponsor, the process being changed, and any business case, charter, contract or policy behind it. Only the user knows who signs, which rules are binding and what is out. -->

<!-- writing: Requirements are outcomes the business needs, not system behavior. Ids (BR-N, RULE-N) are global and never reused. A rule is stated once, in Business rules, and cited everywhere else. Objectives and cost point at the business case or charter where one exists instead of repeating it. `status: final` does not record a signature; the approval block does. -->

<!-- done when: Every BR-N has an owner, a source, a priority and a way to verify it; every rule has an id and an owner; nothing in the document names a screen, a field or an API; and the approval block names who signs. -->

# {title}

## Table of Contents

## Summary
<!-- built: from the settled sections. What the business wants changed, for whom, and why now, in a short paragraph. -->

## Objectives
<!-- The measurable outcomes this serves, short, citing the business case or charter when one exists. -->

## Stakeholders
<!-- A table: who asks, who owns the outcome, who approves, who is affected. Ask who must live with the result and was not in the room. -->

## Scope
<!-- In and out, each explicit. Ask what the builder will assume is included, and what the business will assume is. -->

## Current and future process
<!-- How the work runs today and how it should run after, in business terms: who does what, in what order, and where it goes wrong today. diagram: flowchart, one for today and one for after -->

## Business requirements
<!-- A table: BR-N, the requirement as an outcome, owner, source, priority, how it will be verified. When everything comes back as a must, ask what the business would give up first, and rank from that answer. -->

## Business rules
<!-- RULE-N, kept apart from requirements: each rule states what must hold or how a term is defined, with its owner and source. Use a decision table where the logic is dense. -->

## Constraints and assumptions
<!-- optional. Limits the business sets on budget, dates, policy or suppliers, and what is assumed true. -->

## Cost and benefit
<!-- include when: no business case exists. Rough cost, expected benefit and who bears each. -->

## Traceability
<!-- A table: BR-N, then empty columns for the `prd` or `srs` line, the test and the ticket, which a later Update fills in from the documents that cite each id. -->

## Open questions
<!-- Each with an owner and what it blocks. -->

## Approval
<!-- A table of names, roles, decision and date. The user supplies each name; a blank row means not yet approved. -->
