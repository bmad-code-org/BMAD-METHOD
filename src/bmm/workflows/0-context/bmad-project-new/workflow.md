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
   - **Cleanup**: Remove leading and trailing slashes and any occurrences of `_bmad-output/`.
   - **Validate - No Traversal**: Reject if path contains `..`.
   - **Validate - No Absolute**: Reject if path starts with `/` or a drive letter such as `C:`.
   - **Validate - Empty/Whitespace**: Reject if empty or only whitespace.
   - **Validate - Whitelist**: Match against regex `^[-a-zA-Z0-9._/]+$`.
   - If invalid:
     - Output: `Error: Invalid project name — must be a relative path and contain only alphanumeric characters, dots, dashes, underscores, or slashes. Traversal (..) is strictly forbidden.`
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
