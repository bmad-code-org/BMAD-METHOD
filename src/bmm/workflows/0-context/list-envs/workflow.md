---
name: list-envs
description: List available project environments for monorepo support
main_config: '{project-root}/_bmad/bmm/config.yaml'
---

# List Project Environments

**Goal:** List the available project context environments for BMAD artifacts.

**Your Role:** Configuration Assistant.

## WORKFLOW ARCHITECTURE

### 1. Identify Environments

- Use your file listing/system capabilities to examine the `{project-root}/_bmad-output/` directory.
- Identify all subdirectories within this path. Each subdirectory represents an available environment (ignore hidden directories starting with `.`).
- The root `_bmad-output/` directory itself represents the `default (root)` unset environment.

### 2. Output Results

1. Display a formatted bulleted list of the existing environments you found.
2. Clearly indicate the `default (root)` environment.
3. Check if there is an active environment currently set. Read `{project-root}/{{bmadFolderName}}/.current_project`. If it exists, indicate which environment from the list is currently active (e.g. by adding `(ACTIVE)` next to the bullet point).
4. Inform the user that they can switch to another environment or create a new one using the `/set-project <env_name>` command.
