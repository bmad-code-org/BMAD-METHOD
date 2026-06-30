---
title: BMAD-METHOD Epics Handoff - BMAD Code Review Auto
status: handoff
created: "2026-06-30"
updated: "2026-06-30"
source_parent_epics: ../../../_bmad-output/planning-artifacts/epics-bmad-tea-workflow-orchestration-2026-06-29/epics.md
---

# BMAD-METHOD Epics: BMAD Code Review Auto

## Overview

This file contains the BMAD-METHOD-owned subset of the parent BMAD TEA v2 workflow orchestration epics.
It is local planning input for implementation inside `BMAD-METHOD`.
It excludes Archon DAG work and BMAD-TEA gate work except where dependency notes are required.
No BMAD-METHOD story may require traversal out of `BMAD-METHOD` to read parent workspace planning files during implementation.

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
