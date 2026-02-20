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

Load and read full config from {main_config} and resolve variables and artifact paths.

### 2. Context Management

1.  **Ask User:** "Please enter the **project name** or path relative to `_bmad-output/` (e.g. `project-name` or `auth-lib`). Enter `CLEAR` to reset to root."
2.  **Wait for Input.**
3.  **Process Input:**
    - **Case: CLEAR**:
      - Delete file: `{project-root}/_bmad/.current_project`
      - Output: "✅ Project context cleared. Artifacts will go to root `_bmad-output/`."
    - **Case: Path Provided**:
      - **1. Cleanup**: Remove leading/trailing slashes and any occurrences of `_bmad-output/`.
      - **2. Validate - No Traversal**: Reject if path contains `..`.
      - **3. Validate - No Absolute**: Reject if path starts with `/` or drive letter (e.g., `C:`).
      - **4. Validate - Empty/Whitespace**: Reject if empty or only whitespace.
      - **5. Validate - Whitelist**: Match against regex `^[a-zA-Z0-9._-/]+$`.
      - **Check Results**:
        - **If Invalid**:
          - Output: "❌ Error: Invalid project context — must be a relative path and contain only alphanumeric characters, dots, dashes, underscores, or slashes. Traversal (..) is strictly forbidden."
          - **HALT**
        - **If Valid**:
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
2. **Global Context File** (`{project-root}/_bmad/.current_project`)
3. **Default Config** (if neither is present)
