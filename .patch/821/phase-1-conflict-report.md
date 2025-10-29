# Phase 1: Conflict Detection Report (PR #821)

Date: 2025-10-28
Branch: pr-821-review

## Summary

- No direct file path conflicts with existing BMAD `src/` assets
- All additions isolated under top-level `subagentic/`
- Potential non-functional concerns: conventions and user experience divergence

## Checks Performed

- File path overlap against `src/core`, `src/modules`, `bmad/` — none found
- Naming overlap (agent names vs existing) — conceptual overlaps only
- Tooling impact — BMAD validators ignore `subagentic/` (not under `src/`)
- Repo status after apply — warnings for trailing whitespace; no merge conflicts

## Notable Items

- `.idea/` directory appeared as untracked; likely local IDE artifacts (not from PR)
- `subagentic/` includes many Markdown files with trailing whitespace (47 lines warned during patch apply)
- Adds a parallel structure (agents, templates, tasks) that mirrors BMAD concepts but with different schema

## Risks

- User confusion: Two parallel agent systems in the same repo
- Maintenance: Static snapshot agents can drift from BMAD evolution
- Packaging: Top-level `subagentic/` increases repo surface area without integration

## Suggested Mitigations (if keeping content)

- Move to a separate branch or submodule; or
- Place under `extras/subagentic/` to signal optionality; or
- Document clearly as an "external alternative" with link to agentic-toolkit
- Add `.editorconfig` or linters to auto-trim trailing whitespace
