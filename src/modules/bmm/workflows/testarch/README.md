# Test Architect Workflows

This directory houses the per-command workflows used by the Test Architect agent (`tea`). Each workflow wraps the standalone instructions that used to live under `testarch/` so they can run through the standard BMAD workflow runner.

## Available workflows

- `framework` – scaffolds Playwright/Cypress harnesses.
- `atdd` – generates failing acceptance tests before coding.
- `automate` – expands regression coverage after implementation.
- `ci` – bootstraps CI/CD pipelines aligned with TEA practices.
- `test-design` – combines risk assessment and coverage planning.
- `trace` – maps requirements to tests (Phase 1) and makes quality gate decisions (Phase 2).
- `nfr-assess` – evaluates non-functional requirements.
- `test-review` – reviews test quality using knowledge base patterns and generates quality score.

**Note**: The `gate` workflow has been merged into `trace` as Phase 2. The `*trace` command now performs both requirements-to-tests traceability mapping AND quality gate decision (PASS/CONCERNS/FAIL/WAIVED) in a single atomic operation.

Each subdirectory contains:

- `README.md` – comprehensive workflow documentation with usage, inputs, outputs, and integration notes.
- `instructions.md` – detailed workflow steps in pure markdown v4.0 format.
- `workflow.yaml` – metadata, variables, and configuration for BMAD workflow runner.
- `checklist.md` – validation checklist for quality assurance and completeness verification.
- `template.md` – output template for workflow deliverables (where applicable).

The TEA agent now invokes these workflows via `run-workflow` rather than executing instruction files directly.
