---
title: BMAD-METHOD PRD Handoff - BMAD Code Review Auto
status: handoff
created: "2026-06-30"
updated: "2026-06-30"
source_parent_prd: ../../../_bmad-output/planning-artifacts/prds/prd-workflow-engine-2026-06-29/prd.md
source_parent_epics: ../../../_bmad-output/planning-artifacts/epics-bmad-tea-workflow-orchestration-2026-06-29/epics.md
---

# BMAD-METHOD PRD Handoff: BMAD Code Review Auto

## Document Purpose

This document is the local BMAD-METHOD product requirements handoff for the BMAD TEA v2 workflow orchestration feature.
It contains only BMAD-METHOD-owned requirements needed for isolated implementation inside this repository.
It is intended to be read with `architecture.md` and `epics.md` in this same folder.
Implementation agents must not traverse out of this repository to read parent workspace planning files.

## Product Context

The v2 Archon workflow needs automated code review without turning BMAD code review into an Archon wrapper.
BMAD-METHOD must provide an automation-native review surface named `bmad-code-review-auto`.
This surface must preserve the behavior and vocabulary of interactive `bmad-code-review` while removing workflow-time interactive choices.
It must emit a stable machine-readable `CR` gate contract for Archon routing and human-readable artifacts for review.

The existing interactive `bmad-code-review` must remain available.
Automation must be additive unless a local BMAD-METHOD decision proves a shared implementation path is safer.

## Scope

BMAD-METHOD owns these capabilities:

- Add `bmad-code-review-auto` as a BMAD-owned automation surface.
- Preserve BMAD review layers, including Blind Hunter, Edge Case Hunter, and Acceptance Auditor when story context exists.
- Preserve BMAD triage categories `patch`, `decision_needed`, `defer`, and `dismiss`.
- Prevent automated review from applying patches.
- Prevent automated review from offering or executing interactive next-step choices.
- Emit `code-review-auto.gate.json`.
- Emit or update `decision-needed.json`.
- Produce human-readable review evidence.
- Preserve decision-needed findings for later Linear sync.
- Sync Linear issue references back into BMAD story review findings, decision log, deferred-work tracking, and `decision-needed.json` when Archon supplies the issue references.
- Provide fixtures and deterministic tests proving outcome mapping.

BMAD-METHOD does not own these capabilities:

- Archon DAG routing, `when:` expressions, `route_loop`, or PR creation.
- BMAD-TEA test automation, RV, NR, or TR semantics.
- Linear API adapter implementation unless BMAD-METHOD has an existing local integration surface chosen during implementation.
- The full lifecycle after deferred Linear issues are created.

## Functional Requirements

### M-FR-1: Add `bmad-code-review-auto`

BMAD-METHOD must add an automation-native sibling surface named `bmad-code-review-auto`.
The existing interactive `bmad-code-review` remains available.
The new surface must be invokable from Archon without Archon reinterpreting BMAD findings.

Acceptance criteria:

- Given BMAD-METHOD contains `bmad-code-review`, when `bmad-code-review-auto` is added, then both surfaces are available.
- Given Archon invokes code review in the v2 workflow, when it calls `bmad-code-review-auto`, then BMAD-METHOD owns the review semantics.
- Given the new surface is validated, when BMAD skill validation runs, then metadata, step files, and command contract validation pass.

### M-FR-2: Preserve BMAD Review Behavior

`bmad-code-review-auto` must use the same review reasoning model as BMAD code review where automation permits it.
It must preserve applicable review layers and triage vocabulary.
It must not introduce Archon-specific finding categories.

Acceptance criteria:

- Given story context exists, when automated review runs, then Blind Hunter, Edge Case Hunter, and Acceptance Auditor are applied when relevant.
- Given findings are classified, when triage runs, then categories are `patch`, `decision_needed`, `defer`, and `dismiss`.
- Given a finding requires human product, design, or operator judgment, when classification runs, then it is recorded as `decision_needed`.
- Given a finding is fixable by development work, when classification runs, then it is recorded as `patch`.

### M-FR-3: Disable Patch Application And Interactive Choices In Automation

`bmad-code-review-auto` must not apply code patches.
It must not offer or execute interactive next-step choices.
It must write findings and contracts only.

Acceptance criteria:

- Given automated review produces a `patch` finding, when review completes, then no code patch is applied.
- Given automated review completes, when outputs are written, then no interactive menu or next-step action is executed.
- Given the same codebase uses interactive `bmad-code-review`, when that surface runs, then its interactive behavior remains available.

### M-FR-4: Emit CR JSON Gate Contract

`bmad-code-review-auto` must emit `code-review-auto.gate.json`.
The contract must include `contract_version`, `workflow`, `story_ref`, `node`, `round`, `gate`, `patch_count`, `decision_needed_count`, `defer_count`, `dismiss_count`, `blocking_findings_count`, `decision_needed_file`, `report_file`, and `story_file`.

Acceptance criteria:

- Given one or more `patch` findings exist, when the contract is emitted, then `gate` is `FAIL`.
- Given one or more `decision_needed` findings exist and no `patch` findings exist, when the contract is emitted, then `gate` is `CONCERNS`.
- Given no `patch` and no `decision_needed` findings exist, when the contract is emitted, then `gate` is `PASS`.
- Given reviewer execution fails, evidence is invalid, or output is untrusted, when the contract is emitted or validated, then the result is `ERROR`.

### M-FR-5: Persist Decision Needed Findings

BMAD-METHOD must persist `decision_needed` findings in `decision-needed.json`.
The artifact must be durable and readable by Archon `decision-needed-check`.
The artifact must not require a `converted_to_patch` path for v2.

Acceptance criteria:

- Given a `decision_needed` finding exists, when review artifacts are written, then `decision-needed.json` includes finding id, story reference, source gate, title, detail, evidence pointers, human-judgment reason, status, and timestamps.
- Given decision-needed findings exist without patch findings, when the CR contract is emitted, then `decision_needed_count` is greater than zero and the gate can be `CONCERNS`.
- Given v2 persistence runs, when statuses are recorded, then `converted_to_patch` is not required.

### M-FR-6: Sync Deferred Linear References Into BMAD Artifacts

BMAD-METHOD must provide or support a sync path that records Linear issue references back into BMAD artifacts after Archon creates or reuses the issues.
Sync targets are story Review Findings, decision log, deferred-work tracking, and `decision-needed.json`.

Acceptance criteria:

- Given Archon supplies a Linear issue id and URL for a finding, when sync runs, then `decision-needed.json` records the issue reference and deferred status.
- Given story Review Findings are updated, when sync completes, then the story records source gate, finding id, Linear id, Linear URL, and deferred status.
- Given decision log and deferred-work tracking exist, when sync completes, then they preserve original finding details and evidence pointers.
- Given sync fails, when output is emitted, then the sync result is `ERROR`.

### M-FR-7: Validate Outcome Mapping With Fixtures

BMAD-METHOD must provide fixtures or deterministic tests for `patch`, `decision_needed`, `defer`, `dismiss`, and invalid or untrusted output.

Acceptance criteria:

- Given a fixture has `patch`, when automated review runs, then `patch_count > 0` and `gate` is `FAIL`.
- Given a fixture has `decision_needed` and no patch findings, when automated review runs, then `decision_needed_count > 0` and `gate` is `CONCERNS`.
- Given a fixture has `defer`, when automated review runs, then `defer_count` increments and the reason is preserved.
- Given a fixture has `dismiss`, when automated review runs, then `dismiss_count` increments and the reason is preserved.
- Given a fixture has invalid evidence or untrusted output, when validation runs, then the result is `ERROR`.

## Non-Functional Requirements

- Automation must preserve BMAD review semantics better than an Archon wrapper.
- Contract output must be stable enough for Archon routing.
- Human-readable reports may evolve without breaking JSON contract consumers.
- Interactive BMAD review remains usable outside Archon.
- Decision-needed follow-up must remain traceable after PR preparation.
- Errors must be diagnosable as review execution, evidence, contract, or sync failures.
