# Test Architect Workflows

This directory houses the per-command workflows used by the Test Architect agent (`tea`). Each workflow wraps the standalone instructions that used to live under `testarch/` so they can run through the standard BMAD workflow runner.

## Available workflows

- `framework` – scaffolds Playwright/Cypress harnesses.
- `atdd` – generates failing acceptance tests before coding.
- `automate` – expands regression coverage after implementation.
- `ci` – bootstraps CI/CD pipelines aligned with TEA practices.
- `test-design` – combines risk assessment and coverage planning.
- `trace` – maps requirements to implemented automated tests.
- `nfr-assess` – evaluates non-functional requirements.
- `gate` – records the release decision in the gate file.
- `test-review` – reviews test quality using knowledge base patterns and generates quality score.

Each subdirectory contains:

- `README.md` – comprehensive workflow documentation with usage, inputs, outputs, and integration notes.
- `instructions.md` – detailed workflow steps in pure markdown v4.0 format.
- `workflow.yaml` – metadata, variables, and configuration for BMAD workflow runner.
- `checklist.md` – validation checklist for quality assurance and completeness verification.
- `template.md` – output template for workflow deliverables (where applicable).

The TEA agent now invokes these workflows via `run-workflow` rather than executing instruction files directly.
