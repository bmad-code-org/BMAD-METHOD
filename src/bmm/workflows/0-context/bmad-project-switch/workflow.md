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
   - First check whether `{project-root}/_bmad-output/` exists and is readable.
   - If it exists, use your file listing capabilities to examine that directory.
   - Output a formatted list of the existing projects you found, explicitly noting the `default (root)` project context.
     Exclude hidden directories and standard BMAD artifact folders: `planning-artifacts`, `implementation-artifacts`, `test-artifacts`, `knowledge`, `docs`, `assets`.
   - If `{project-root}/_bmad-output/` does not exist or is unreadable because it is missing, show only the `default (root)` project context.
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
     - **Validate - No Absolute**: Check the raw user input before cleanup. Reject if it starts with `/`, starts with `\\`, or starts with a drive letter such as `C:`.
     - **Cleanup**: If the raw value starts with `_bmad-output/`, remove that single leading prefix once. Then trim leading and trailing slashes.
     - **Validate - No Traversal**: Reject if path contains `..`.
     - **Validate - No Separators**: Reject if the sanitized value still contains `/` or `\`. Project names must be single directory names, not nested paths.
     - **Validate - Empty/Whitespace**: Reject if empty, only whitespace, or exactly `.`.
     - **Validate - Whitelist**: Match against regex `^[-a-zA-Z0-9._]+$`.
     - **Validate - Reserved Names**: Reject if the sanitized value is any reserved BMAD artifact directory name: `planning-artifacts`, `implementation-artifacts`, `test-artifacts`, `knowledge`, `docs`, `assets`.
     - **Check Results**
       - If invalid:
         - Output: `Error: Invalid project name — use a single directory name containing only alphanumeric characters, dots, dashes, or underscores. Nested paths, reserved artifact names, absolute paths, and traversal (..) are forbidden.`
         - Halt.
     - **Validate Existence**: Check if `{project-root}/_bmad-output/<sanitized_path>` exists and is a directory.
       - If it does not exist, or exists but is not a directory:
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
