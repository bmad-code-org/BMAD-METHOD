---
title: ""
template: security-review
version: 1.3.0
category: risk-and-ops
description: "Reviewing a system against a standard such as the OWASP Top 10 or STRIDE."
not_for: "An incident that has happened (`postmortem`)."
agents: [bmad-agent-architect]
facilitation_order: [scope-and-system, architecture-and-data-flows, key-request-flows, findings, risk-decisions, remediation-plan, open-questions]
guidance: guidance-method.md
rubric: rubric-planning.md
status: draft
created: ""
updated: ""
---

<!-- purpose: Record how one system holds up against a security standard, with a finding per item reviewed and a plan for what fails. -->

<!-- stance: A reviewer walking the standard with the system's owner: walk every row of the named standard or threat model (defaulting to current OWASP Top 10 or STRIDE, verifying current standard items on the web when needed; also supporting OWASP API/LLM Top 10, SOC 2, HIPAA, PCI-DSS, or any custom `methods:` catalog override) a row at a time, and ask how this system handles each and where that is enforced. "The framework handles it" is not an answer until they say where. When the system uses an LLM, RAG, agent loop, or other probabilistic/ML component, also probe indirect prompt injection, pre-retrieval tenant/ACL isolation, and least-privilege tool approval gates where relevant. In fast mode, ask once for the evidence the user already has and mark every other row `unverified`. -->

<!-- opening: The system under review and its boundary, and which standard or threat model rows to walk. No brain dump: ask for the evidence already in hand, such as architecture documents, test and scan results, known issues and accepted risks, to read before the first row. -->

<!-- inputs: The system, its scope and data flows; the standard or rows to cover; existing controls, test and scan results, known issues and accepted risks, which only the user can give. -->

<!-- writing: One finding per row reviewed, with the evidence the user gave. Record no test result, CVE, scan output or compliance statement the user did not supply. -->

<!-- done when: Every chosen row has a finding, every gap has a severity and either a remediation owner or a recorded acceptance, and each open question names who can answer it. -->

# {title}

## Table of Contents

## Scope and system
<!-- What is reviewed and what is not, the security standard or threat model and rows covered (or custom `methods:` catalog categories if supplied), what the system does, who uses it and the data it holds. -->

## Architecture and data flows
<!-- Components, where data enters, moves and rests, and the trust boundaries it crosses. diagram: flowchart -->

## Key request flows
<!-- include when: authentication, payment or a multi-party exchange carries the risk. The steps across components and boundaries. diagram: sequence -->

## Findings
<!-- A subsection per category reviewed; per row: item, status, evidence, severity for gaps. Status must be exactly one of: pass, gap, unverified (nobody knows yet; the check to run is the action), not applicable. Severity must be exactly one of: critical, high, medium, low. -->

## Risk decisions
<!-- include when: a gap will not be fixed now. The risk, who accepted it, why, and when it is revisited. -->

## Remediation plan
<!-- A table of each gap to fix: action, owner, priority, target date or milestone. A gap with no owner is not planned; ask who, or move it to Risk decisions. -->

## Open questions
<!-- What could not be checked, and who can answer. -->
