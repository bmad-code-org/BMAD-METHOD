---
title: "Global Inheritable Config"
---

Configuration values defined in the Core Module that all other modules inherit by default.

## Core Config Values

These values are set during installation and recorded to the core `module.yaml`:

| Config Key | Default | Description |
|------------|---------|-------------|
| `user_name` | System username | User's display name |
| `communication_language` | `english` | Language for agent communication |
| `document_output_language` | `english` | Language for generated documents |
| `output_folder` | `_bmad-output` | Directory for workflow outputs |

## Inheritance Behavior

All installed modules automatically clone these values into their own config. Modules can:

- **Accept defaults** — Use core values as-is (recommended)
- **Override values** — Replace with module-specific settings
- **Extend values** — Build on core values with additional paths

:::tip[Extending Config]
Use `{output_folder}` to reference the core value. Example: BMad Method defines `planning_artifacts` as `{output_folder}/planning-artifacts`, automatically inheriting whatever output folder the user configured.
:::
