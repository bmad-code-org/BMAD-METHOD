---
last-redoc-date: 2025-09-30
---

# Test Architect (TEA) Agent Guide

## Overview

- **Persona:** Murat, Master Test Architect and Quality Advisor focused on risk-based testing, fixture architecture, ATDD, and CI/CD governance.
- **Mission:** Deliver actionable quality strategies, automation coverage, and gate decisions that scale with project level and compliance demands.
- **Use When:** Project level ≥2, integration risk is non-trivial, brownfield regression risk exists, or compliance/NFR evidence is required.

## Prerequisites and Setup

1. Run the core planning workflows first:
   - Analyst `*product-brief`
   - Product Manager `*plan-project`
   - Architect `*solution-architecture`
2. Confirm `bmad/bmm/config.yaml` defines `project_name`, `output_folder`, `dev_story_location`, and language settings.
3. Ensure a test test framework setup exists; if not, use `*framework` command to create a test framework setup, prior to development.
4. Skim supporting references (knowledge under `testarch/`, command workflows under `workflows/testarch/`).
   - `tea-index.csv` + `knowledge/*.md`

## High-Level Cheat Sheets

### Greenfield Feature Launch (Level 2)

| Phase              | Test Architect                                                            | Dev / Team                                                                       | Outputs                                                                               |
| ------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Setup              | -                                                                         | Analyst `*product-brief`, PM `*plan-project`, Architect `*solution-architecture` | `{output_folder}/product-brief*.md`, `PRD.md`, `epics.md`, `solution-architecture.md` |
| Pre-Implementation | Run `*framework` (if harness missing), `*ci`, and `*test-design`          | Review risk/design/CI guidance, align backlog                                    | Test scaffold, CI pipeline, risk and coverage strategy                                |
| Story Prep         | -                                                                         | Scrum Master `*create-story`, `*story-context`                                   | Story markdown + context XML                                                          |
| Implementation     | (Optional) Trigger `*atdd` before dev to supply failing tests + checklist | Implement story guided by ATDD checklist                                         | Failing acceptance tests + implementation checklist                                   |
| Post-Dev           | Execute `*automate`, re-run `*trace`                                      | Address recommendations, update code/tests                                       | Regression specs, refreshed coverage matrix                                           |
| Release            | Run `*gate`                                                               | Confirm Definition of Done, share release notes                                  | Gate YAML + release summary (owners, waivers)                                         |

<details>
<summary>Execution Notes</summary>

- Run `*framework` only once per repo or when modern harness support is missing.
- `*framework` followed by `*ci` establishes install + pipeline; `*test-design` then handles risk scoring, mitigations, and scenario planning in one pass.
- Use `*atdd` before coding when the team can adopt ATDD; share its checklist with the dev agent.
- Post-implementation, keep `*trace` current, expand coverage with `*automate`, and finish with `*gate`.

</details>

<details>
<summary>Worked Example – “Nova CRM” Greenfield Feature</summary>

1. **Planning:** Analyst runs `*product-brief`; PM executes `*plan-project` to produce PRD and epics; Architect completes `*solution-architecture` for the new module.
2. **Setup:** TEA checks harness via `*framework`, configures `*ci`, and runs `*test-design` to capture risk/coverage plans.
3. **Story Prep:** Scrum Master generates the story via `*create-story`; PO validates using `*assess-project-ready`.
4. **Implementation:** TEA optionally runs `*atdd`; Dev implements with guidance from failing tests and the plan.
5. **Post-Dev and Release:** TEA runs `*automate`, re-runs `*trace`, and finishes with `*gate` to document the decision.

</details>

### Brownfield Feature Enhancement (Level 3–4)

| Phase             | Test Architect                                                      | Dev / Team                                                 | Outputs                                                 |
| ----------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| Refresh Context   | -                                                                   | Analyst/PM/Architect rerun planning workflows              | Updated planning artifacts in `{output_folder}`         |
| Baseline Coverage | Run `*trace` to inventory existing tests                            | Review matrix, flag hotspots                               | Coverage matrix + initial gate snippet                  |
| Risk Targeting    | Run `*test-design`                                                  | Align remediation/backlog priorities                       | Brownfield risk memo + scenario matrix                  |
| Story Prep        | -                                                                   | Scrum Master `*create-story`                               | Updated story markdown                                  |
| Implementation    | (Optional) Run `*atdd` before dev                                   | Implement story, referencing checklist/tests               | Failing acceptance tests + implementation checklist     |
| Post-Dev          | Apply `*automate`, re-run `*trace`, trigger `*nfr-assess` if needed | Resolve gaps, update docs/tests                            | Regression specs, refreshed coverage matrix, NFR report |
| Release           | Run `*gate`                                                         | Product Owner `*assess-project-ready`, share release notes | Gate YAML + release summary                             |

<details>
<summary>Execution Notes</summary>

- Lead with `*trace` so remediation plans target true coverage gaps. Ensure `*framework` and `*ci` are in place early in the engagement; if the brownfield lacks them, run those setup steps immediately after refreshing context.
- `*test-design` should highlight regression hotspots, mitigations, and P0 scenarios.
- Use `*atdd` when stories benefit from ATDD; otherwise proceed to implementation and rely on post-dev automation.
- After development, expand coverage with `*automate`, re-run `*trace`, and close with `*gate`. Run `*nfr-assess` now if non-functional risks weren't addressed earlier.
- Product Owner `*assess-project-ready` confirms the team has artifacts before handoff or release.

</details>

<details>
<summary>Worked Example – “Atlas Payments” Brownfield Story</summary>

1. **Context Refresh:** Analyst reruns `*product-brief`; PM executes `*plan-project` to update PRD, analysis, and `epics.md`; Architect triggers `*solution-architecture` capturing legacy payment flows.
2. **Baseline Coverage:** TEA executes `*trace` to record current coverage in `docs/qa/assessments/atlas-payment-trace.md`.
3. **Risk and Design:** `*test-design` flags settlement edge cases, plans mitigations, and allocates new API/E2E scenarios with P0 priorities.
4. **Story Prep:** Scrum Master generates `stories/story-1.1.md` via `*create-story`, automatically pulling updated context.
5. **ATDD First:** TEA runs `*atdd`, producing failing Playwright specs under `tests/e2e/payments/` plus an implementation checklist.
6. **Implementation:** Dev pairs with the checklist/tests to deliver the story.
7. **Post-Implementation:** TEA applies `*automate`, re-runs `*trace`, performs `*nfr-assess` to validate SLAs, and closes with `*gate` marking PASS with follow-ups.

</details>

### Enterprise / Compliance Program (Level 4)

| Phase               | Test Architect                                   | Dev / Team                                     | Outputs                                                   |
| ------------------- | ------------------------------------------------ | ---------------------------------------------- | --------------------------------------------------------- |
| Strategic Planning  | -                                                | Analyst/PM/Architect standard workflows        | Enterprise-grade PRD, epics, architecture                 |
| Quality Planning    | Run `*framework`, `*test-design`, `*nfr-assess`  | Review guidance, align compliance requirements | Harness scaffold, risk + coverage plan, NFR documentation |
| Pipeline Enablement | Configure `*ci`                                  | Coordinate secrets, pipeline approvals         | `.github/workflows/test.yml`, helper scripts              |
| Execution           | Enforce `*atdd`, `*automate`, `*trace` per story | Implement stories, resolve TEA findings        | Tests, fixtures, coverage matrices                        |
| Release             | Run `*gate`                                      | Capture sign-offs, archive artifacts           | Updated assessments, gate YAML, audit trail               |

<details>
<summary>Execution Notes</summary>

- Use `*atdd` for every story when feasible so acceptance tests lead implementation in regulated environments.
- `*ci` scaffolds selective testing scripts, burn-in jobs, caching, and notifications for long-running suites.
- Prior to release, rerun coverage (`*trace`, `*automate`) and formalize the decision in `*gate`; store everything for audits. Call `*nfr-assess` here if compliance/performance requirements weren't captured during planning.

</details>

<details>
<summary>Worked Example – “Helios Ledger” Enterprise Release</summary>

1. **Strategic Planning:** Analyst/PM/Architect complete PRD, epics, and architecture using the standard workflows.
2. **Quality Planning:** TEA runs `*framework`, `*test-design`, and `*nfr-assess` to establish mitigations, coverage, and NFR targets.
3. **Pipeline Setup:** TEA configures CI via `*ci` with selective execution scripts.
4. **Execution:** For each story, TEA enforces `*atdd`, `*automate`, and `*trace`; Dev teams iterate on the findings.
5. **Release:** TEA re-checks coverage and logs the final gate decision via `*gate`, archiving artifacts for compliance.

</details>

## Command Catalog

| Command        | Task File                                        | Primary Outputs                                                     | Notes                                            |
| -------------- | ------------------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------ |
| `*framework`   | `workflows/testarch/framework/instructions.md`   | Playwright/Cypress scaffold, `.env.example`, `.nvmrc`, sample specs | Use when no production-ready harness exists      |
| `*atdd`        | `workflows/testarch/atdd/instructions.md`        | Failing acceptance tests + implementation checklist                 | Requires approved story + harness                |
| `*automate`    | `workflows/testarch/automate/instructions.md`    | Prioritized specs, fixtures, README/script updates, DoD summary     | Avoid duplicate coverage (see priority matrix)   |
| `*ci`          | `workflows/testarch/ci/instructions.md`          | CI workflow, selective test scripts, secrets checklist              | Platform-aware (GitHub Actions default)          |
| `*test-design` | `workflows/testarch/test-design/instructions.md` | Combined risk assessment, mitigation plan, and coverage strategy    | Handles risk scoring and test design in one pass |
| `*trace`       | `workflows/testarch/trace/instructions.md`       | Coverage matrix, recommendations, gate snippet                      | Requires access to story/tests repositories      |
| `*nfr-assess`  | `workflows/testarch/nfr-assess/instructions.md`  | NFR assessment report with actions                                  | Focus on security/performance/reliability        |
| `*gate`        | `workflows/testarch/gate/instructions.md`        | Gate YAML + summary (PASS/CONCERNS/FAIL/WAIVED)                     | Deterministic decision rules + rationale         |

<details>
<summary>Command Guidance and Context Loading</summary>

- Each task now carries its own preflight/flow/deliverable guidance inline.
- `tea-index.csv` maps workflow needs to knowledge fragments; keep tags accurate as you add guidance.
- Consider future modularization into orchestrated workflows if additional automation is needed.
- Update the fragment markdown files alongside workflow edits so guidance and outputs stay in sync.

</details>

## Workflow Placement

The TEA stack has three tightly-linked layers:

1. **Agent spec (`agents/tea.md`)** – declares the persona, critical actions, and the `run-workflow` entries for every TEA command. Critical actions instruct the agent to load `tea-index.csv` and then fetch only the fragments it needs from `knowledge/` before giving guidance.
2. **Knowledge index (`tea-index.csv`)** – catalogues each fragment with tags and file paths. Workflows call out the IDs they need (e.g., `risk-governance`, `fixture-architecture`) so the agent loads targeted guidance instead of a monolithic brief.
3. **Workflows (`workflows/testarch/*`)** – contain the task flows and reference `tea-index.csv` in their `<flow>`/`<notes>` sections to request specific fragments. Keeping all workflows in this directory ensures consistent discovery during planning (`*framework`), implementation (`*atdd`, `*automate`, `*trace`), and release (`*nfr-assess`, `*gate`).

This separation lets us expand the knowledge base without touching agent wiring and keeps every command remote-controllable via the standard BMAD workflow runner. As navigation improves, we can add lightweight entrypoints or tags in the index without changing where workflows live.

## Appendix

- **Supporting Knowledge:**
  - `tea-index.csv` – Catalog of knowledge fragments with tags and file paths under `knowledge/` for task-specific loading.
  - `knowledge/*.md` – Focused summaries (fixtures, network, CI, levels, priorities, etc.) distilled from Murat’s external resources.
  - `test-resources-for-ai-flat.txt` – Raw 347 KB archive retained for manual deep dives when a fragment needs source validation.
