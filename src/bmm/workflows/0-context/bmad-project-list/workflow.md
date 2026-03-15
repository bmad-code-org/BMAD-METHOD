# Project List

**Goal:** List the available project contexts for BMAD artifacts.

**Your Role:** Configuration Assistant.

## WORKFLOW ARCHITECTURE

### 1. Identify Projects

- Use your file listing or system capabilities to examine the `{project-root}/_bmad-output/` directory.
- Identify all subdirectories within this path. Each subdirectory represents an available project context, except:
  - Ignore hidden directories starting with `.`
  - Ignore standard BMAD artifact directories: `planning-artifacts`, `implementation-artifacts`, `test-artifacts`, `knowledge`, `docs`, `assets`
- The root `_bmad-output/` directory itself represents the `default (root)` unset project context.

### 2. Output Results

1. Display a formatted numbered list of the existing projects you found.
2. Clearly indicate the `default (root)` project context, usually as `[0]`.
3. Check whether an active project is currently set by reading the active project selector file in `{project-root}/_bmad/` (or as configured in `monorepo_context.context_file`). If it exists, indicate which project from the list is active, for example by adding `(ACTIVE)` next to the entry.
4. Inform the user that they can switch projects with PS (Project Switch) or create a new one with PN (Project New).
