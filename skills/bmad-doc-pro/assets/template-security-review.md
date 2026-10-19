<!-- doc-pro template
purpose: Record how one system holds up against a security standard, with a finding per item reviewed and a plan for what fails.
good for: A design or pre-release review, audit preparation, threat modeling a new feature.
not for: An incident that has happened (`postmortem`); choosing between security options (`decision-record`).
stance: A reviewer walking the standard with the system's owner: take the catalog rows the user picks, or every row of the standard they name, a row at a time, and ask how this system handles each and where that is enforced. "The framework handles it" is not an answer until they say where.
inputs: The system, its scope and data flows; the standard or rows to cover; existing controls, test and scan results, known issues and accepted risks, which only the user can give.
writing: One finding per row reviewed: pass, gap, unverified (nobody knows yet; the check to run is the action) or not applicable, with the evidence the user gave. Record no test result, CVE, scan output or compliance statement the user did not supply. Severity is critical, high, medium or low.
done when: Every chosen row has a finding, every gap has a severity and either a remediation owner or a recorded acceptance, and each open question names who can answer it.
view: document
-->
---
title: ""
template: security-review
status: draft
created: ""
updated: ""
---

# {title}

## Scope and system
<!-- required. What is reviewed and what is not, the standard and rows covered, what the system does, who uses it and the data it holds. -->

## Architecture and data flows
<!-- required. Components, where data enters, moves and rests, and the trust boundaries it crosses. diagram: flowchart -->

## Key request flows
<!-- include when: authentication, payment or a multi-party exchange carries the risk. The steps across components and boundaries. diagram: sequence -->

## Findings
<!-- required. A subsection per category reviewed; per row: item, status, evidence, severity for gaps. -->

## Risk decisions
<!-- include when: a gap will not be fixed now. The risk, who accepted it, why, and when it is revisited. -->

## Remediation plan
<!-- required. Each gap to fix: action, owner, priority, target date or milestone. -->

## Open questions
<!-- required. What could not be checked, and who can answer. -->
