---
name: validate-workflow
description: Validate a target file against a checklist
standalone: true
---

# Task: Validate Workflow

## Initialization
- Load config from `{project-root}/_bmad/core/config.yaml`.
- Resolve variables (if available):
  - `communication_language`, `user_name`, `document_output_language`

## Purpose
Execute a validation checklist against a target file and report findings clearly and consistently.

## Steps
1. **Load checklist**
   - Use the checklist path provided by the calling workflow (e.g., its `validation` property).
   - If not provided, ask the user for the checklist path.

2. **Load target file**
   - Infer the target file from the checklist context or workflow inputs.
   - If unclear, ask the user for the exact file path to validate.

3. **Run the checklist**
   - Read the checklist fully.
   - Apply each item systematically to the target file.
   - Record pass/fail and capture specific evidence for any issues.

4. **Report findings**
   - Summarize issues with clear labels (e.g., CRITICAL/HIGH/MEDIUM/LOW when applicable).
   - Provide actionable fixes for each issue.

5. **Edits (if applicable)**
   - If the checklist instructs updates or auto-fixes, ask for confirmation before editing.
   - Only apply changes after user approval.

6. **Finalize**
   - Confirm completion and provide the final validation summary.
