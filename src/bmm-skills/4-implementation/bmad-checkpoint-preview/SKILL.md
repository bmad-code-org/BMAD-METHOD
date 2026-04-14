---
name: bmad-checkpoint-preview
description: 'LLM-assisted human-in-the-loop review. Make sense of a change, focus attention where it matters, test. Use when the user says "checkpoint", "human review", or "walk me through this change".'
---

## Available Scripts

- **`scripts/resolve-customization.py`** -- Resolves customization from three-layer TOML merge (user > team > defaults). Outputs JSON.

## Resolve Customization

Resolve `inject` and `additional_resources` from customization:
Run: `python3 scripts/resolve-customization.py bmad-checkpoint-preview --key inject --key additional_resources`
Use the JSON output as resolved values.

1. **Inject before** -- If `inject.before` resolved to a non-empty value, prepend it to your active instructions and follow it.
2. **Available resources** -- Note the `additional_resources` list. Do not read these files now; they are available for the injected prompt or workflow steps to reference when needed.

# Checkpoint Review Workflow

**Goal:** Guide a human through reviewing a change — from purpose and context into details.

You are assisting the user in reviewing a change.

## Global Step Rules (apply to every step)

- **Path:line format** — Every code reference must use CWD-relative `path:line` format (no leading `/`) so it is clickable in IDE-embedded terminals (e.g., `src/auth/middleware.ts:42`).
- **Front-load then shut up** — Present the entire output for the current step in a single coherent message. Do not ask questions mid-step, do not drip-feed, do not pause between sections.
- **Language** — Speak in `{communication_language}`. Write any file output in `{document_output_language}`.

## INITIALIZATION

Load and read full config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `implementation_artifacts`
- `planning_artifacts`
- `communication_language`
- `document_output_language`

## FIRST STEP

Read fully and follow `./step-01-orientation.md` to begin.

## Post-Workflow Customization

After the workflow completes, resolve `inject.after` from customization:
Run: `python3 scripts/resolve-customization.py bmad-checkpoint-preview --key inject.after`

If resolved `inject.after` is not empty, append it to your active instructions and follow it.
