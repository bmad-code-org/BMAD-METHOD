---
name: validate-workflow
description: Validate a target file against a checklist
standalone: true
---

# Task: Validate Workflow

## Initialization
- Load config from `{project-root}/_bmad/core/config.yaml`.
- Validate config load before continuing:
  - Verify file exists and is readable.
  - Parse YAML and fail fast with explicit error if parsing fails.
  - Require `user_name`; if missing, abort initialization with descriptive error.
  - Apply explicit defaults when optional keys are absent:
    - `communication_language = "English"`
    - `document_output_language = "English"`
  - Log resolved values and config source path.

## Purpose
Execute a validation checklist against a target file and report findings clearly and consistently.

## Steps
1. **Load checklist**
   - Use the checklist path provided by the calling workflow (e.g., its `validation` property).
   - If not provided, ask the user for the checklist path.

2. **Load target file**
   - Infer candidate target path in this order:
     - Explicit keys in workflow/checklist inputs: `file`, `path`, `target`, `filePath`
     - Path-like tokens in checklist items
     - First matching path from glob patterns supplied by checklist/input
   - Normalize all candidate paths relative to repo root and resolve `.`/`..`.
   - Validate candidate existence and expected file type (`.yaml`, `.yml`, `.json`, or checklist-defined extension).
   - If multiple valid candidates remain, prefer explicit key fields over inferred tokens.
   - If no valid candidate is found, prompt user with schema example:
     - `Please provide the exact file path (relative to repo root), e.g. ./workflows/ci.yml`
   - Validate user-supplied path before proceeding.

3. **Run the checklist**
   - Read the checklist fully.
   - Apply each item systematically to the target file.
   - Record pass/fail and capture specific evidence for any issues.

4. **Report findings**
   - Summarize issues with clear labels (e.g., CRITICAL/HIGH/MEDIUM/LOW when applicable).
   - Provide actionable fixes for each issue.

5. **Edits (if applicable)**
   - If checklist requires edits/auto-fixes, follow safe-edit protocol:
     - Ask for confirmation before editing.
     - Create backup snapshot of target file before changes.
     - Generate reversible diff preview and show it to user.
     - Apply edits only after user approval.
     - Run syntax/validation checks against edited file.
     - If validation fails or user cancels, rollback from backup and report rollback status.
     - Record backup/diff locations in task output.

6. **Finalize**
   - Confirm completion and provide the final validation summary.
