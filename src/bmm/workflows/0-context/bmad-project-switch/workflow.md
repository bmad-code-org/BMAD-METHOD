# Project Switch

**Goal:** Switch the active project path for BMAD artifacts.

**Your Role:** Configuration Assistant.

## WORKFLOW ARCHITECTURE

This is a single-step workflow that updates a local state file.

### 1. Configuration Loading

Load and read full config from `{project-root}/_bmad/bmm/config.yaml` and resolve variables and artifact paths.
The context file is the default hidden project selector file in `{project-root}/_bmad/` (or as configured in `monorepo_context.context_file`).

### 2. Context Management

1. **Analyze Request**: Determine the requested project name from the user's initial invocation, such as "switch project my-app".
2. **Wait for Input (If Missing)**: If the user did not provide a project name:
   - Use your file listing capabilities to examine the `{project-root}/_bmad-output/` directory.
   - Output a formatted list of the existing projects you found, explicitly noting the `default (root)` project context.
     Exclude hidden directories and standard BMAD artifact folders: `planning-artifacts`, `implementation-artifacts`, `test-artifacts`, `knowledge`, `docs`, `assets`.
   - Present options in a numbered list format:

```text
Select a project:
[0] default (root) - Current location for standard artifacts
[1] project-name-1
[2] project-name-2
...

Enter a number to select, type an existing project name, or enter 'CLEAR' to reset to root:
```

   - Wait for input.
3. **Process Input**: Once a project name is established:
   - **Case: CLEAR**
     - Delete the active project selector file in `{project-root}/_bmad/`
     - Output: `Project context cleared. Artifacts will go to root _bmad-output/.`
     - Halt.
   - **Case: Numeric Selection**
     - Map the number to the corresponding project from your earlier listing.
     - If number is `0`, treat it as the `CLEAR` case.
     - If the number is out of range, show an error and ask again.
     - If valid, use that project name as the path.
   - **Case: Path Provided** (text input)
     - **Cleanup**: Remove leading and trailing slashes and any occurrences of `_bmad-output/`.
     - **Validate - No Traversal**: Reject if path contains `..`.
     - **Validate - No Absolute**: Reject if path starts with `/` or a drive letter such as `C:`.
     - **Validate - Empty/Whitespace**: Reject if empty or only whitespace.
     - **Validate - Whitelist**: Match against regex `^[-a-zA-Z0-9._/]+$`.
     - **Check Results**
       - If invalid:
         - Output: `Error: Invalid project name — must be a relative path and contain only alphanumeric characters, dots, dashes, underscores, or slashes. Traversal (..) is strictly forbidden.`
         - Halt.
     - **Validate Existence**: Check if `{project-root}/_bmad-output/<sanitized_path>` exists on disk.
       - If it does not exist:
         - Output: `Error: Project <sanitized_path> does not exist. Use PN (Project New) to create it first, or PL (Project List) to see available projects.`
         - Halt.
     - Write the active project selector file in `{project-root}/_bmad/` with content `<sanitized_path>`
     - Output: `Project context set to: <sanitized_path>. Artifacts will go to _bmad-output/<sanitized_path>/.`

### 3. Verification

- Display the full resolved output path for confirmation.

## Inline Project Overrides

You can also temporarily run a command against a different project without changing the global context file. Use the `#project:NAME` or `#p:NAME` syntax in your command invocation.

**Examples:**

- `create-prd #project:my-app`
- `sprint-planning #p:admin-portal`

**Precedence:**

1. **Inline Override** (`#p:NAME`) — highest priority
2. **Global Context File** (the active project selector file in `{project-root}/_bmad/`)
3. **Default Config** (if neither is present)
