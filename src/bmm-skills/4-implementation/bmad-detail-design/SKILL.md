---
name: bmad-detail-design
description: Create a BMAD detail design artifact from a validated story before development. Use when the user asks for detail design, technical design, design before dev, API contract, data model, sequence flow, transaction strategy, error matrix, test plan, or observability for a story.
---

# BMad Detail Design

## Purpose

Turn a validated BMAD story into a concrete technical design a developer can implement and test without guessing. Keep the design story-specific and aligned with the current repo architecture and conventions.

## Inputs

Resolve these inputs before writing:

- `story_path`: explicit user-provided story path, or the next story from sprint status.
- `implementation_artifacts`: from BMAD config; fallback to `_bmad-output/implementation-artifacts`.
- `story_key`: derive from story frontmatter, filename, or sprint status.
- `project_context`: load `**/project-context.md` if present.
- Planning context: load relevant PRD, epics/stories, architecture, UX, readiness, and sprint artifacts only when needed to avoid design drift.

## Workflow

1. Load BMAD config from `{project-root}/_bmad/bmm/config.yaml` and related config files if they exist. Use `communication_language` for user-facing chat and `document_output_language` for generated artifacts.
2. Resolve `story_path`.
   - If the user provided a path, use it.
   - Otherwise read the sprint status file under `{implementation_artifacts}` and select the current story after validation and before development.
   - If no valid story is discoverable, stop and ask for a story path.
3. Read the full story file, including acceptance criteria, tasks/subtasks, constraints, and validation notes.
4. Read only the repo artifacts needed to ground the design: project context, architecture, PRD, epics, UX, existing code, schemas, API contracts, tests, and docs relevant to the story.
5. Write the detail design to `{implementation_artifacts}/detail-design/{story_key}-detail-design.md`. Create the `detail-design/` directory if needed.
6. If the story file has an obvious safe section for references or Dev Agent notes, add a link to the detail design artifact. If not, do not modify the story file.
7. Report the artifact path and any unresolved design assumptions.

## Artifact Template

Use this structure unless the story clearly needs a narrower format:

```markdown
# Detail Design: {story_title}

## 1. Scope And Non-Goals

## 2. Acceptance Criteria Mapping

| AC | Design Coverage | Notes |
| --- | --- | --- |

## 3. Current Architecture Context

## 4. API Or Interface Contract

## 5. Data Model And State Changes

## 6. Main Sequence Flow

## 7. Alternative And Error Flows

## 8. Transaction, Idempotency, Concurrency, And Retry Strategy

## 9. Error Handling Matrix

| Condition | Status/Code | User-Safe Message | Logging/Telemetry |
| --- | --- | --- | --- |

## 10. Test Plan

## 11. Observability And Audit

## 12. Implementation Checklist For bmad-dev-story

## 13. Open Questions And Assumptions
```

## Design Rules

- Do not use generic examples unless the actual story is about that domain.
- Prefer concrete repo terms: service names, package paths, entities, tables, message topics, endpoints, and test files.
- Explicitly cover consistency risks: transaction boundaries, idempotency, race conditions, retries, rollback, and partial failure.
- Map every acceptance criterion to at least one design element and at least one test expectation.
- Keep the implementation checklist actionable for `bmad-dev-story`; do not include vague tasks like "implement logic".
- If a design decision is uncertain, state the assumption and the file or owner needed to resolve it.

## Completion Criteria

Complete only when:

- A detail design artifact exists at the expected path.
- The artifact covers scope, contract, data and state changes, sequence and error flows, consistency strategy, error matrix, tests, observability, and implementation checklist.
- The design is grounded in current repo artifacts rather than invented architecture.
- Any story link update is safe and minimal, or intentionally skipped with a reason.
