---
name: document-project-full-scan
description: 'Complete project documentation workflow (initial scan or full rescan)'
---

# Full Project Scan Sub-Workflow

**Goal:** Complete project documentation (initial scan or full rescan).

**Your Role:** Full project scan documentation specialist.

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_knowledge`
- `user_name`
- `communication_language`, `document_output_language`
- `date` as system-generated current datetime

✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the configured `{communication_language}`.
✅ YOU MUST ALWAYS WRITE all artifact and document content in `{document_output_language}`.

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/document-project/workflows`
- `instructions` = `{installed_path}/full-scan-instructions.md`
- `validation` = `{project-root}/_bmad/bmm/workflows/document-project/checklist.md`
- `documentation_requirements_csv` = `{project-root}/_bmad/bmm/workflows/document-project/documentation-requirements.csv`

### Runtime Inputs

- `workflow_mode` = `""` (set by parent: `initial_scan` or `full_rescan`)
- `scan_level` = `""` (set by parent: `quick`, `deep`, or `exhaustive`)
- `resume_mode` = `false`
- `autonomous` = `false` (requires user input at key decision points)

---

## EXECUTION

Read fully and follow: `{installed_path}/full-scan-instructions.md`
