---
title: ""
template: srs
version: 1.4.0
description: "An initiative's traceable, verifiable requirements for regulated or contracted work."
not_for: "Product work with no external check (`prd` for several capabilities, `prd-epic` for one); what the business requires, before system behavior (`brd`)."
agents: [bmad-agent-pm]
facilitation_order: [introduction, references, overall-description, functional-requirements, interface-requirements, quality-requirements, compliance-requirements, design-constraints, verification, open-questions, revision-history, definitions]
guidance: guidance-method.md
rubric: rubric-planning.md
lint: ../scripts/check_ids.py
status: draft
created: ""
updated: ""
---

<!-- purpose: A requirements baseline an auditor, regulator or contracting party can verify delivery against. -->

<!-- stance: Stakes are regulated or contracted; push for a source on every requirement. One with no source is cut or becomes an open question, because a baseline can only hold what someone can answer for. -->

<!-- opening: Which regulations, standards or contract clauses govern the work, and who approves the baseline. No brain dump: ask for those documents, and any business requirements document or earlier baseline, because every requirement here traces to a source and one written from memory has none. -->

<!-- inputs: The governing regulations, standards and contract clauses, stakeholders and their needs, external interfaces, prior baselines. A business requirements document among them: keep its ids. Only the user knows which obligations apply and who approves the baseline. -->

<!-- writing: Requirement sections are tables: id, one "shall" statement, source (a stakeholder need, BR-N, RULE-N, regulation clause or contract item), verification method (inspection, analysis, demonstration or test). Ids are never reused. Defined terms are used exactly as defined. -->

<!-- done when: Every requirement has an id, a source and a verification method; every cited regulation, clause and threshold comes from the user or a supplied document; every term is defined. -->

# {title}

## Table of Contents

## Introduction
<!-- Purpose, scope (what the system does and does not do), intended readers. -->

## Definitions
<!-- built: once the requirements are settled, from the terms they use: terms, acronyms and abbreviations. Ask only which are wrong or missing. -->

## References
<!-- Every regulation, standard, contract and document cited, with the version or date as supplied. -->

## Overall description
<!-- Context and boundaries, functions in summary, user classes, constraints, assumptions and dependencies. diagram: flowchart -->

## Functional requirements
<!-- What the system shall do. Take each from its source: walk the stakeholder needs, the BR-N lines and the clauses one at a time and ask what the system shall do to meet each. A requirement the user wants and no source asks for is an open question until someone answers for it. -->

## Interface requirements
<!-- include when: the system exchanges data with users, hardware, software or networks. Each interface: the other party, what crosses in each direction and the standard or format it follows. diagram: sequence, for an exchange of more than two steps -->

## Quality requirements
<!-- Performance, reliability, security, safety, usability, each with a measurable bound from the user or a source. -->

## Compliance requirements
<!-- include when: a regulation, standard or contract clause applies. Each traced to its clause. -->

## Design constraints
<!-- include when: a standard, platform or prior decision limits the design. -->

## Verification
<!-- How the baseline is verified: environments, evidence kept, who accepts it. Ask what the auditor or the contracting party will ask to see, and where it is kept. -->

## Open questions
<!-- Each with what would resolve it. -->

## Revision history
<!-- Version, date, change, approver. -->
