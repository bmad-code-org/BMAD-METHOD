# Project New

**Goal:** Create a new project context with the standard BMAD artifact structure and make it active.

**Your Role:** Configuration Assistant.

## WORKFLOW ARCHITECTURE

This is a single-step workflow that creates directories and updates the active project context file.

### 1. Configuration Loading

Load and read full config from `{project-root}/_bmad/bmm/config.yaml` and resolve variables and artifact paths.
The context file is the default hidden project selector file in `{project-root}/_bmad/` (or as configured in `monorepo_context.context_file`).

### 2. Project Creation

1. **Analyze Request**: Determine the requested new project name from the user's initial invocation, such as "new project my-app".
2. **Wait for Input (If Missing)**: If the user did not provide a project name:
   - Ask: `What should the new project be called?`
   - Wait for input.
3. **Validate Project Name**
   - **Validate - No Absolute**: Check the raw user input before cleanup. Reject if it starts with `/`, starts with `\\`, or starts with a drive letter such as `C:`.
   - **Cleanup**: If the raw value starts with `_bmad-output/`, remove that single leading prefix once. Then trim leading and trailing slashes.
   - **Validate - No Traversal**: Reject if path contains `..`.
   - **Validate - No Separators**: Reject if the sanitized value still contains `/` or `\`. Project names must be single directory names, not nested paths.
   - **Validate - Empty/Whitespace**: Reject if empty, only whitespace, or exactly `.`.
   - **Validate - Whitelist**: Match against regex `^[-a-zA-Z0-9._]+$`.
   - **Validate - Reserved Names**: Reject if the sanitized value is any reserved BMAD artifact directory name: `planning-artifacts`, `implementation-artifacts`, `test-artifacts`, `knowledge`, `docs`, `assets`.
   - If invalid:
     - Output: `Error: Invalid project name — use a single directory name containing only alphanumeric characters, dots, dashes, or underscores. Nested paths, reserved artifact names, absolute paths, and traversal (..) are forbidden.`
     - Halt.
4. **Check for Existing Project**
   - Check if `{project-root}/_bmad-output/<sanitized_path>` already exists.
   - If it already exists:
     - Ask: `The project <sanitized_path> already exists. Do you want to switch to it instead? (Yes/No)`
     - Wait for input.
     - If `Yes`:
       - Write the active project selector file in `{project-root}/_bmad/` with content `<sanitized_path>`
       - Output: `Project context set to: <sanitized_path>. Artifacts will go to _bmad-output/<sanitized_path>/.`
       - Halt.
     - If `No`:
       - Inform the user to choose another name or use PS (Project Switch) to switch to an existing project.
       - Halt.
5. **Create Project Structure**
   - Create directory: `{project-root}/_bmad-output/<sanitized_path>/`
   - Create directory: `{project-root}/_bmad-output/<sanitized_path>/planning-artifacts/`
   - Create directory: `{project-root}/_bmad-output/<sanitized_path>/implementation-artifacts/`
   - Create directory: `{project-root}/_bmad-output/<sanitized_path>/knowledge/`
   - Write the active project selector file in `{project-root}/_bmad/` with content `<sanitized_path>`
   - Output: `Created project <sanitized_path> and set it as active. Artifacts will go to _bmad-output/<sanitized_path>/.`

### 3. Verification

- Display the full resolved output path for confirmation.
- Mention that the user can use PS (Project Switch) to switch projects later and PL (Project List) to list available projects.
