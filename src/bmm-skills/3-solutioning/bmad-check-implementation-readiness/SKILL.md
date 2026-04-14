---
name: bmad-check-implementation-readiness
description: 'Validate PRD, UX, Architecture and Epics specs are complete. Use when the user says "check implementation readiness".'
---

## Available Scripts

- **`scripts/resolve-customization.py`** -- Resolves customization from three-layer TOML merge (user > team > defaults). Outputs JSON.

## Resolve Customization

Resolve `inject` and `additional_resources` from customization:
Run: `python3 scripts/resolve-customization.py bmad-check-implementation-readiness --key inject --key additional_resources`
Use the JSON output as resolved values.

1. **Inject before** -- If `inject.before` resolved to a non-empty value, prepend it to your active instructions and follow it.
2. **Available resources** -- Note the `additional_resources` list. Do not read these files now; they are available for the injected prompt or workflow steps to reference when needed.

Follow the instructions in ./workflow.md.

## Post-Workflow Customization

After the workflow completes, resolve `inject.after` from customization:
Run: `python3 scripts/resolve-customization.py bmad-check-implementation-readiness --key inject.after`

If resolved `inject.after` is not empty, append it to your active instructions and follow it.
