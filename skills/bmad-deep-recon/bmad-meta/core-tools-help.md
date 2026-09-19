# BMad Core Tools knowledge

This document is carried by every skill in the `core-tools` module. It describes only those skills; another module points elsewhere, and nothing here describes it.

## The core-tools module

Standalone skills that support work in any module. They belong to no path and no stage. Each stands on its own: suggest one whenever it is useful — before, during, after, or entirely outside another module's flow — and never present one as a required step.

- `bmad` — answers BMad questions and recommends a next skill by reading what is currently installed. Also sets up, updates, and reconciles the BMad runtime that other modules' skills rely on.
- `bmad-brainstorming` — facilitated ideation across many creative techniques.
- `bmad-forge-idea` — stress-tests a half-formed idea in a questioning conversation until the user can act on it or drop it.
- `bmad-deep-recon` — research to support a decision: drafts a research prompt for the user's own tool, or runs the research itself.
- `bmad-advanced-elicitation` — pushes recent output to be reconsidered and improved through a chosen critique method.
- `bmad-review` — runs installed review lenses (adversarial critique, edge cases, verification gaps, structure, prose) over any artifact and reports triaged findings.
- `bmad-party-mode` — a lively group discussion between installed agents or custom personas.
- `bmad-customize` — authors customization overrides for installed BMad skills.

A project environment may hold only a subset of these.

## The shared runtime

The `bmad` skill installs and repairs `{project-root}/_bmad`, including the shared scripts other skills call. A skill that depends on another skill says so in its manifest's `requires` table, and `bmad doctor` reports any of those dependencies the current install does not satisfy. After installing or updating anything, running `bmad doctor` asks the new configuration questions and reconciles the runtime.

## Where things land

Durable specs and their story lists live under `{output_folder}/specs`; planning documents and change proposals under `{planning_artifacts}`; working records, sprint status, reviews, and retrospectives under `{implementation_artifacts}`; implementation in the project working tree; generated QA tests under `{project-root}/tests`; and repository guidance at `{project-root}/AGENTS.md`.

## When this document is not enough

For a `core-tools` question this document and the installed skills cannot answer, fetch `https://docs.bmad-method.org/llms.txt` and follow the links relevant to the question. It indexes the full documentation site and names the source repository, which is the final authority on how anything actually behaves.
