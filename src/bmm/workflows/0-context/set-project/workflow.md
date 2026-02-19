---
name: set-project
description: Set the current project context for monorepo support
main_config: '{project-root}/_bmad/bmm/config.yaml'
---

# Set Project Context

**Goal:** Configure the active project path for BMAD artifacts.

**Your Role:** Configuration Assistant.

## WORKFLOW ARCHITECTURE

This is a single-step workflow that updates a local state file.

### 1. Configuration Loading

Load and read full config from {main_config} and resolve basic variables.

### 2. Context Management

1.  **Ask User:** "Please enter the **project name** or path relative to `_bmad-output/` (e.g. `project-name` or `libs/auth-lib`). Enter `CLEAR` to reset to root."
2.  **Wait for Input.**
3.  **Process Input:**
    - **Case: CLEAR**:
      - Delete file: `{project-root}/_bmad/.current_project`
      - Output: "✅ Project context cleared. Artifacts will go to root `_bmad-output/`."
    - **Case: Path Provided**:
      - **Sanitize:** Remove leading `/` or `_bmad-output/` if present in the input.
      - Write file: `{project-root}/_bmad/.current_project` with content `<sanitized_path>`
      - Output: "✅ Project context set to: `<sanitized_path>`. Artifacts will go to `_bmad-output/<sanitized_path>/`."

### 3. Verification

- Display the full resolved output path for confirmation.

## Inline Project Overrides

You can also temporarily run a command against a different project without changing the global context file. Use the `#project:NAME` or `#p:NAME` syntax in your command invocation.

**Examples:**
- `/create-prd #project:my-app`
- `/sprint-planning #p:admin-portal`

**Precedence:**
1. **Inline Override** (`#p:NAME`)
2. **Global Context File** (`_bmad/.current_project`)
3. **Default Config** (if neither is present)
