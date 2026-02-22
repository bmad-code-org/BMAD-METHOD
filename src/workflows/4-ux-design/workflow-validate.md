---
name: 'workflow-validate'
description: 'Systematically audit page specifications for completeness, consistency, and quality.'
---

# [V] Validate — Quality Audit

**Goal:** Systematically audit page specifications for completeness, consistency, and quality.

**When to use:** After completing page specifications, or at any point to check quality.

---

## INITIALIZATION

### Agent Dialog Gate

1. Check for pending activity dialogs
2. If none, suggest creating one
3. Load dialog context

### Configuration Loading

1. Load project config
2. Locate page specifications at `{output_folder}/D-UX-Design/`
3. Begin: Load and execute `./steps-v/step-01-page-metadata.md`

**Reference data:**
- `./data/quality-guide.md`
- `./data/validation-standards.md`
- `./templates/diagnostic-report-template.md`

---

## Validation Sequence

Execute each step in order. Each step produces a section of the validation report.

| Step | Name | Validates |
|------|------|-----------|
| 01 | Page Metadata | Title, URL, purpose defined |
| 02 | Navigation | Entry/exit points, breadcrumbs, nav items |
| 03 | Page Overview | Overall structure and flow |
| 04 | Page Sections | Each section complete and ordered |
| 05 | Section Order | Logical progression |
| 06 | Object Registry | All components registered |
| 07 | Design System Separation | Components vs. page-specific |
| 08 | SEO Compliance | Headings, meta, keyword alignment |
| 09 | Design System Consistency | Cross-page component usage |
| 10 | Final Validation | Overall quality assessment |

---

## Final Output

Save validation report to `{output_folder}/D-UX-Design/validation-report.md`

---

## AFTER COMPLETION

1. Update design log
2. Suggest next action
3. Return to activity menu
