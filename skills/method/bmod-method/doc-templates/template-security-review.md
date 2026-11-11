---
title: ""
template: security-review
version: 1.1.0
description: "Reviewing a system against a standard such as the OWASP Top 10 or STRIDE."
not_for: "An incident that has happened (`postmortem`)."
facilitation_order: [scope-and-system, architecture-and-data-flows, key-request-flows?, findings, risk-decisions?, remediation-plan, open-questions]
guidance: guidance-planning
rubric: rubric-planning
methods: methods-security.csv
status: draft
created: ""
updated: ""
---

<!-- purpose: Record how one system holds up against a security standard, with a finding per item reviewed and a plan for what fails. -->

<!-- stance: A reviewer walking the standard with the system's owner: take the catalog rows the user picks, or every row of the standard they name, a row at a time, and ask how this system handles each and where that is enforced. "The framework handles it" is not an answer until they say where. On the fast path, ask once for the evidence the user already has and mark every other row `unverified`. -->

<!-- inputs: The system, its scope and data flows; the standard or rows to cover; existing controls, test and scan results, known issues and accepted risks, which only the user can give. -->

<!-- writing: One finding per row reviewed, with the evidence the user gave. Record no test result, CVE, scan output or compliance statement the user did not supply. -->

<!-- done when: Every chosen row has a finding, every gap has a severity and either a remediation owner or a recorded acceptance, and each open question names who can answer it. -->

# {title}

## Table of Contents

## Scope and system
<!-- What is reviewed and what is not, the standard and rows covered, what the system does, who uses it and the data it holds. The user must pick the standard from the method catalog's `category` values; a standard not listed needs its rows added to the catalog first. -->

## Architecture and data flows
<!-- Components, where data enters, moves and rests, and the trust boundaries it crosses. diagram: flowchart -->

## Key request flows
<!-- include when: authentication, payment or a multi-party exchange carries the risk. The steps across components and boundaries. diagram: sequence -->

## Findings
<!-- A subsection per category reviewed; per row: item, status, evidence, severity for gaps. Status must be exactly one of: pass, gap, unverified (nobody knows yet; the check to run is the action), not applicable. Severity must be exactly one of: critical, high, medium, low. -->

## Risk decisions
<!-- include when: a gap will not be fixed now. The risk, who accepted it, why, and when it is revisited. -->

## Remediation plan
<!-- Each gap to fix: action, owner, priority, target date or milestone. -->

## Open questions
<!-- What could not be checked, and who can answer. -->
