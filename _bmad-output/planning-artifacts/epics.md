---
title: BMAD-METHOD Epics Handoff - BMAD Code Review Auto
status: handoff
created: "2026-06-30"
updated: "2026-06-30"
source_parent_epics: ../../../_bmad-output/planning-artifacts/epics-bmad-tea-workflow-orchestration-2026-06-29/epics.md
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/implementation-readiness-report-2026-06-30.md
---

# BMAD-METHOD Epics: BMAD Code Review Auto

## Overview

This file contains the BMAD-METHOD-owned subset of the parent BMAD TEA v2 workflow orchestration epics.
It is local planning input for implementation inside `BMAD-METHOD`.
It excludes Archon DAG work and BMAD-TEA gate work except where dependency notes are required.
No BMAD-METHOD story may require traversal out of `BMAD-METHOD` to read parent workspace planning files during implementation.

## Requirements Inventory

### Functional Requirements

M-FR-1: Add `bmad-code-review-auto`.
BMAD-METHOD must add an automation-native sibling surface named `bmad-code-review-auto`.
The existing interactive `bmad-code-review` remains available.
The new surface must be invokable from Archon without Archon reinterpreting BMAD findings.

M-FR-2: Preserve BMAD Review Behavior.
`bmad-code-review-auto` must use the same review reasoning model as BMAD code review where automation permits it.
It must preserve applicable review layers and triage vocabulary.
It must not introduce Archon-specific finding categories.

M-FR-3: Disable Patch Application And Interactive Choices In Automation.
`bmad-code-review-auto` must not apply code patches.
It must not offer or execute interactive next-step choices.
It must write findings and contracts only.

M-FR-4: Emit CR JSON Gate Contract.
`bmad-code-review-auto` must emit `code-review-auto.gate.json`.
The contract must include `contract_version`, `workflow`, `story_ref`, `node`, `round`, `gate`, `patch_count`, `decision_needed_count`, `defer_count`, `dismiss_count`, `blocking_findings_count`, `decision_needed_file`, `report_file`, and `story_file`.

M-FR-5: Persist Decision Needed Findings.
BMAD-METHOD must persist `decision_needed` findings in `decision-needed.json`.
The artifact must be durable and readable by Archon `decision-needed-check`.
The artifact must not require a `converted_to_patch` path for v2.

M-FR-6: Sync Deferred Linear References Into BMAD Artifacts.
BMAD-METHOD must provide or support a sync path that records Linear issue references back into BMAD artifacts after Archon creates or reuses the issues.
Sync targets are story Review Findings, decision log, deferred-work tracking, and `decision-needed.json`.

M-FR-7: Validate Outcome Mapping With Fixtures.
BMAD-METHOD must provide fixtures or deterministic tests for `patch`, `decision_needed`, `defer`, `dismiss`, and invalid or untrusted output.

### NonFunctional Requirements

NFR1: Automation must preserve BMAD review semantics better than an Archon wrapper.

NFR2: Contract output must be stable enough for Archon routing.

NFR3: Human-readable reports may evolve without breaking JSON contract consumers.

NFR4: Interactive BMAD review remains usable outside Archon.

NFR5: Decision-needed follow-up must remain traceable after PR preparation.

NFR6: Errors must be diagnosable as review execution, evidence, contract, or sync failures.

### Additional Requirements

- `bmad-code-review-auto` lives in BMAD-METHOD.
- Archon may invoke it but does not own its review semantics.
- The implementation must preserve BMAD review layers where context allows, including Blind Hunter, Edge Case Hunter, and Acceptance Auditor when story context exists.
- The required triage categories are `patch`, `decision_needed`, `defer`, and `dismiss`.
- `bmad-code-review-auto` never applies code patches.
- `code-review-auto.gate.json` is the machine-readable route API.
- Markdown review reports are human evidence and may evolve.
- `decision_needed` findings are written to `decision-needed.json`.
- `decision_needed` findings are not converted to patches in v2.
- When Archon supplies Linear references, BMAD-METHOD must update story Review Findings, decision log, deferred-work tracking, and `decision-needed.json`.
- Fixture coverage must include `patch`, `decision_needed`, `defer`, `dismiss`, and invalid or untrusted output.
- JSON contract validation must prove `PASS`, `FAIL`, `CONCERNS`, and `ERROR`.
- Implementation agents must not traverse out of this repository to read parent workspace planning files.

### UX Design Requirements

No UX design requirements were found.
No UX design contract exists, and this scope is not a product UI.

### FR Coverage Map

| FR Number | Epic Coverage |
| --------- | ------------- |
| M-FR-1 | Epic M1, Story M1.1 |
| M-FR-2 | Epic M1, Story M1.2 |
| M-FR-3 | Epic M1, Story M1.1 |
| M-FR-4 | Epic M2, Stories M2.1 and M2.2 |
| M-FR-5 | Epic M3, Story M3.1 |
| M-FR-6 | Epic M3, Story M3.2 |
| M-FR-7 | Epic M4, Story M4.1 |

## Epic List

### Epic M1: Automation-Native BMAD Code Review

BMAD-METHOD maintainers and Archon can invoke a non-interactive BMAD-owned review surface that preserves existing review behavior and never patches code.
**FRs covered:** M-FR-1, M-FR-2, M-FR-3.

### Epic M2: CR Contract And Review Evidence

Archon can route on stable JSON while humans can inspect readable review evidence.
**FRs covered:** M-FR-4.

### Epic M3: Decision Needed Persistence And Sync

Workflow operators keep human-judgment findings durable and traceable through Linear deferral sync.
**FRs covered:** M-FR-5, M-FR-6.

### Epic M4: BMAD Review Auto Validation

Maintainers can trust the automated review contract because outcome mapping is covered by deterministic fixtures.
**FRs covered:** M-FR-7.

## Epic M1: Automation-Native BMAD Code Review

BMAD-METHOD provides a non-interactive code review surface that preserves BMAD review behavior.

### Story M1.1: Add `bmad-code-review-auto`

As a BMAD-METHOD maintainer,
I want `bmad-code-review-auto` to exist as a BMAD-owned automation surface,
So that Archon can invoke code review without a wrapper that reinterprets BMAD findings.

**Requirements Covered:** M-FR-1, M-FR-3.

Depends on: existing `bmad-code-review`.
Contract needed: BMAD skill or command metadata and invocation contract.
Blocking behavior: Archon Story A2.1 cannot complete until this surface is available.
Integration validation: BMAD validation proves both `bmad-code-review` and `bmad-code-review-auto` are available.

**Acceptance Criteria:**

**Given** BMAD-METHOD contains interactive `bmad-code-review`
**When** `bmad-code-review-auto` is added
**Then** both surfaces are available
**And** the interactive surface remains usable.

**Given** automation review runs
**When** findings are produced
**Then** no code patch is applied
**And** no interactive next-step choice is offered or executed.

### Story M1.2: Preserve Review Layers And Triage Vocabulary

As a BMAD-METHOD maintainer,
I want automated review to preserve BMAD review layers and triage,
So that automation does not weaken BMAD code-review semantics.

**Requirements Covered:** M-FR-2.

Depends on: Story M1.1.
Contract needed: Finding model with layer, category, evidence, reason, and source context.
Blocking behavior: CR contract stories cannot complete until findings use BMAD categories.
Integration validation: Fixtures prove `patch`, `decision_needed`, `defer`, and `dismiss` are emitted from BMAD triage.

**Acceptance Criteria:**

**Given** story context exists
**When** automated review runs
**Then** applicable BMAD review layers include Blind Hunter, Edge Case Hunter, and Acceptance Auditor.

**Given** findings are classified
**When** triage completes
**Then** categories are `patch`, `decision_needed`, `defer`, and `dismiss`
**And** no Archon-specific category is introduced.

**Given** a finding requires human product, design, or operator judgment
**When** classification runs
**Then** it is recorded as `decision_needed`.

**Given** a finding is fixable by development work
**When** classification runs
**Then** it is recorded as `patch`.

## Epic M2: CR Contract And Review Evidence

BMAD-METHOD emits stable machine-readable review output while preserving human review evidence.

### Story M2.1: Emit `code-review-auto.gate.json`

As an Archon workflow maintainer,
I want BMAD-METHOD automated review to emit a stable CR gate contract,
So that Archon can route on JSON without parsing markdown.

**Requirements Covered:** M-FR-4.

Depends on: Stories M1.1 and M1.2.
Contract needed: `code-review-auto.gate.json`.
Blocking behavior: Archon Story A2.1 cannot route CR until this contract exists.
Integration validation: Contract fixtures prove PASS, FAIL, CONCERNS, and ERROR.

**Acceptance Criteria:**

**Given** automated review completes
**When** route-facing output is written
**Then** `code-review-auto.gate.json` includes the required envelope, count fields, and evidence pointers.

**Given** patch findings exist
**When** the contract is emitted
**Then** `gate` is `FAIL`
**And** `blocking_findings_count` is greater than zero.

**Given** only decision-needed findings exist
**When** the contract is emitted
**Then** `gate` is `CONCERNS`
**And** `decision_needed_file` points to `decision-needed.json`.

**Given** no `patch` and no `decision_needed` findings exist
**When** the contract is emitted
**Then** `gate` is `PASS`.

**Given** reviewer execution fails, evidence is invalid, or output is untrusted
**When** the contract is emitted or validated
**Then** `gate` is `ERROR`.

### Story M2.2: Preserve Human Review Report

As a human reviewer,
I want automated review to produce a human-readable report,
So that I can inspect BMAD evidence without affecting Archon routing.

**Requirements Covered:** M-FR-4.

Depends on: Story M2.1.
Contract needed: Review report path in the CR contract.
Blocking behavior: PR handoff cannot link CR human evidence until the report path is stable.
Integration validation: Report fixtures preserve source findings, triage reasons, and evidence pointers.

**Acceptance Criteria:**

**Given** automated review writes the CR contract
**When** the human-readable report is generated
**Then** the report preserves source findings, triage reasons, and evidence pointers
**And** Archon does not need to parse it for routing.

## Epic M3: Decision Needed Persistence And Sync

BMAD-METHOD keeps human-judgment findings durable and records Linear deferral references.

### Story M3.1: Persist `decision-needed.json`

As a workflow operator,
I want decision-needed findings persisted in a durable BMAD artifact,
So that human-judgment items remain visible after automated review.

**Requirements Covered:** M-FR-5.

Depends on: Story M2.1.
Contract needed: `decision-needed.json`.
Blocking behavior: Archon Story A5.1 cannot create Linear follow-up from BMAD findings until this artifact is available.
Integration validation: Fixtures prove unresolved decision-needed findings are written and referenced from the CR contract.

**Acceptance Criteria:**

**Given** automated review identifies `decision_needed`
**When** artifacts are written
**Then** `decision-needed.json` records finding id, story reference, source gate, title, detail, evidence pointers, human-judgment reason, status, and timestamps.

**Given** v2 status values are written
**When** the artifact is validated
**Then** `converted_to_patch` is not required.

### Story M3.2: Sync Linear References Into BMAD Artifacts

As a BMAD-METHOD maintainer,
I want Linear issue references synced into BMAD artifacts,
So that deferred decisions are visible from the story and review trail.

**Requirements Covered:** M-FR-6.

Depends on: Story M3.1 and the Archon decision-needed issue-reference input contract.
Contract needed: Linear issue id, Linear URL, finding id, story reference, sync target list, and sync output.
Blocking behavior: Archon PR preparation cannot continue if BMAD artifact sync fails or returns an inconsistent target state.
Integration validation: BMAD-METHOD fixtures supply Archon-shaped Linear references and prove sync updates story Review Findings, decision log, deferred-work tracking, and `decision-needed.json`.

**Acceptance Criteria:**

**Given** a sync request supplies a Linear issue id, Linear URL, finding id, and story reference
**When** sync runs
**Then** `decision-needed.json` records the issue reference and deferred status.

**Given** the story file is updated
**When** sync completes
**Then** Review Findings include source gate, finding id, Linear id, Linear URL, and deferred status.

**Given** any sync target fails
**When** sync output is emitted
**Then** the result is `ERROR`.

**Given** a sync request is missing required Linear reference fields
**When** sync validates the request
**Then** the result is `ERROR`
**And** no partial BMAD artifact update is reported as successful.

## Epic M4: BMAD Review Auto Validation

BMAD-METHOD proves automated review preserves behavior and emits correct contracts.

### Story M4.1: Add Outcome Mapping Fixtures

As a BMAD-METHOD maintainer,
I want deterministic fixtures for automated review outcomes,
So that route-facing contracts can be trusted by Archon.

**Requirements Covered:** M-FR-7.

Depends on: Stories M1.2, M2.1, and M3.1.
Contract needed: Fixture cases for `patch`, `decision_needed`, `defer`, `dismiss`, and invalid or untrusted output.
Blocking behavior: Archon vertical slice cannot be marked complete until these mappings are validated.
Integration validation: BMAD tests prove expected counts and gate values for each fixture.

**Acceptance Criteria:**

**Given** a `patch` fixture runs
**When** automated review emits a contract
**Then** `patch_count > 0`
**And** `gate` is `FAIL`.

**Given** a `decision_needed` fixture runs with no patch findings
**When** automated review emits a contract
**Then** `decision_needed_count > 0`
**And** `gate` is `CONCERNS`.

**Given** `defer` and `dismiss` fixtures run
**When** automated review emits contracts
**Then** the matching counts increment
**And** human-readable reasons are preserved.

**Given** invalid evidence or untrusted output is present
**When** validation runs
**Then** the result is `ERROR`.
