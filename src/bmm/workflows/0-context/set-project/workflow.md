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

1.  **Analyze Request**: Determine the requested project name from the user's initial invocation (e.g., `/set-project my-app`).
2.  **Wait for Input (If Missing)**: If the user did NOT provide a project name:
    - Use your file listing capabilities to examine the `{project-root}/_bmad-output/` directory.
    - Output: A formatted list of the existing environments (subdirectories) you found, explicitly noting the `default (root)` environment.
    - Ask the user: "Please select an existing environment from the list above, or type a new name to create one. Enter `CLEAR` to reset to root."
    - **Wait for Input.**
3.  **Process Input**: Once a project name is established:
    - **Case: CLEAR**:
      - Delete file: `{project-root}/{{bmadFolderName}}/.current_project`
      - Output: "✅ Project context cleared. Artifacts will go to root `_bmad-output/`."
      - **HALT**
    - **Case: Path Provided**:
      - **1. Cleanup**: Remove leading/trailing slashes and any occurrences of `_bmad-output/`.
      - **2. Validate Existence**: Check if `{project-root}/_bmad-output/<sanitized_path>` exists on the file system.
        - **If it DOES NOT exist**:
          - Ask: "The environment `<sanitized_path>` is not present. Do you want to create a new one? (Yes/No)"
          - **Wait for Input.**
          - **If No**: Inform the user to run `/list-envs` to see available environments or `/set-project` to try again. **HALT**.
          - **If Yes**: Proceed to validation.
      - **3. Validate - No Traversal**: Reject if path contains `..`.
      - **4. Validate - No Absolute**: Reject if path starts with `/` or drive letter (e.g., `C:`).
      - **5. Validate - Empty/Whitespace**: Reject if empty or only whitespace.
      - **6. Validate - Whitelist**: Match against regex `^[a-zA-Z0-9._-/]+$`.
      - **Check Results**:
        - **If Invalid**:
          - Output: "❌ Error: Invalid project context — must be a relative path and contain only alphanumeric characters, dots, dashes, underscores, or slashes. Traversal (..) is strictly forbidden."
          - **HALT**
        - **If Valid**:
          - Write file: `{project-root}/{{bmadFolderName}}/.current_project` with content `<sanitized_path>`
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
