# APF v2 Phase 0 Baseline

## Scope

This baseline covers the tracked contents of `expansion-packs/ai-product-factory` before the APF v2 runtime refactor. It does not modify an active workflow or agent.

## Measured inventory

| Entity | Count | Notes |
| --- | ---: | --- |
| Agent skills | 53 | Eight functional layers; most are small role wrappers. |
| Workflow skills | 11 | README must be kept aligned with this measured count. |
| Total APF skills | 64 | Each has an active `SKILL.md`. |
| Knowledge files | 6 | Excludes this Phase 0 inventory. |
| Checklists | 3 | UX, launch, and deployment. |
| Templates | 2 | Idea validation and run manifest. |
| Example runs | 1 | Habit tracker. |

## Confirmed baseline risks

- Cursor is present in generic runtime instructions, agent conventions, workflow instructions, help text, and product claims.
- `bmad-apf-build-mvp` has a fixed implementation sequence and treats Cursor as the execution engine.
- The current agent roster overlaps with BMAD core capabilities including PRD, architecture, stories, UX, testing, and review.
- Current artifacts and handoffs are Markdown conventions, not schema-validated contracts.
- Current skills do not yet enforce the APF v2 execution economy: no shared mode classifier, verification ladder, or explicit subagent budget.
- No APF-specific eval or benchmark suite exists yet.

## Phase 0 decisions

1. Do not add new persistent agents before the migration map is implemented.
2. Do not delete active skills in Phase 0. Every replacement must first receive deterministic validation and a documented compatibility route.
3. Keep BMAD core as the owner of PRD, UX, architecture, stories, implementation, and review capabilities; APF supplies context, routing, product evidence, and lifecycle gates.
4. Treat `entity-migration-map.yaml` as the complete disposition record. It must cover every active APF agent and workflow exactly once.

## Required ADRs before runtime migration

### Namespace and validator compatibility

The APF v2 specification uses `apf-*` conceptual names, while the repository's deterministic skill validator accepts names beginning with `bmad-`. APF v2 therefore retains `bmad-apf-*` as its canonical installed identifier and uses the shorter form only in architecture discussion. The compatibility resolver maps v1 identifiers for one transition release.

### Allowed integration surface

The specification prohibits changing BMAD core behavior, but APF checks may need root-level package scripts or CI configuration. Define whether those integration points are allowed, or keep all APF validation invocations self-contained under the expansion pack.

## Exit criteria for Phase 0

- Every one of the 64 active APF skills is represented in the migration map.
- Every entry has one disposition, target capability, rationale, and compatibility strategy.
- No Phase 0 change alters runtime behavior.
- The next phase can implement policies and adapters without guessing which legacy capability it replaces.
