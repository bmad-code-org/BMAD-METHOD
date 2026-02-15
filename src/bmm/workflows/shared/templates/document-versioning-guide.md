# Document Versioning and Approval Guide - Enterprise Track

## Frontmatter Standard

All Enterprise track requirement documents MUST include these frontmatter fields:

```yaml
---
version: "1.0.0"
status: "draft"
baseline_version: null
track: "enterprise"
last_updated: "{{date}}"
last_updated_by: "{{agent_name}}"
change_log:
  - version: "1.0.0"
    date: "{{date}}"
    change: "Initial creation"
    by: "{{agent_name}}"
---
```

## Version Numbering

Follow semantic versioning for requirement documents:

| Change Type | Version Bump | Example |
|------------|-------------|---------|
| Initial creation | 1.0.0 | First draft |
| New requirements added | +0.1.0 | 1.0.0 → 1.1.0 |
| Requirement modifications | +0.1.0 | 1.1.0 → 1.2.0 |
| Corrections/typos | +0.0.1 | 1.2.0 → 1.2.1 |
| Major restructuring | +1.0.0 | 1.2.1 → 2.0.0 |
| Post-baseline changes | +0.1.0 minimum | Via change request only |

## Document Status Lifecycle

```
draft → review → approved → baseline
  ↑                           |
  └──── (change request) ─────┘
```

### Status Definitions

| Status | Meaning | Who Can Transition |
|--------|---------|-------------------|
| **draft** | Document is being created or actively modified | Any agent during workflow |
| **review** | Document is complete and ready for quality validation | Workflow completion step |
| **approved** | Document has passed quality validation | User confirmation |
| **baseline** | Document is locked for reference; changes require formal CR | User explicit approval |

### Transition Rules

1. `draft` → `review`: Workflow completion step sets this automatically
2. `review` → `approved`: User confirms after validation workflow passes
3. `approved` → `baseline`: User explicitly baselines (typically at phase transition quality gate)
4. `baseline` → `draft` (new version): Only via approved Change Request (CR)

## Baseline Management

### When to Baseline

- At each quality gate (QG-1, QG-2, QG-3) for documents assessed
- Before starting the next development phase
- When all stakeholders agree the document is stable

### Baseline Rules

1. Record `baseline_version` in frontmatter (matches current `version`)
2. All requirement IDs are frozen at baseline
3. Changes after baseline require formal Change Request
4. Previous baseline versions should be noted in change log

## Change Log Format

Each change log entry should include:

```yaml
change_log:
  - version: "1.2.0"
    date: "2024-01-15"
    change: "Added FR-AUTH-005 per CR-003"
    by: "John (PM)"
    cr_ref: "CR-003"  # Optional: link to change request
```

## Approval History (Optional)

For formal approval tracking:

```yaml
approval_history:
  - version: "1.0.0"
    date: "2024-01-10"
    approved_by: "Mary (Analyst)"
    status: "approved"
    notes: "Initial StRS approved after QG-1"
```
