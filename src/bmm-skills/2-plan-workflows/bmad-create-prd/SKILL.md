---
name: bmad-create-prd
description: 'Create a PRD from scratch. Use when the user says "lets create a product requirements document" or "I want to create a new PRD"'
---

## Resolve Customization

Resolve `inject` and `additional_resources` from customization:
Run: `python ./scripts/resolve-customization.py bmad-create-prd --key inject --key additional_resources`
Use the JSON output as resolved values.

If `inject.before` is not empty, incorporate its content as high-priority context.
If `additional_resources` is not empty, read each listed file and incorporate as reference context.

Follow the instructions in ./workflow.md.

## Post-Workflow Customization

After the workflow completes, resolve `inject.after` from customization:
Run: `python ./scripts/resolve-customization.py bmad-create-prd --key inject.after`

If resolved `inject.after` is not empty, incorporate its content as a final checklist or validation gate.
