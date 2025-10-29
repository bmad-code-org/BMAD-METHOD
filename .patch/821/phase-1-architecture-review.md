# Phase 1: Architecture Review (PR #821)

Date: 2025-10-28
Branch: pr-821-review

## Scope

- Compare new `subagentic/` content with BMAD v6 structure
- Identify overlaps, integration points, and isolation boundaries

## New Structure (from PR #821)

Top-level additions:

- `subagentic/`
  - `claude-subagents/` (agents, teams, templates, tasks, checklists, workflows, utils, data, AGENTS.md)
  - `opencode-subagents/` (mirrors claude-subagents)
  - `subagentic-manual.md`

Characteristics:

- Self-contained system for two IDEs (Claude, OpenCode)
- Agents defined as Markdown files with YAML frontmatter + behavioral prose
- Invocation designed for editor-level usage (e.g., @agent_name, \*commands)
- Global install model in external toolkit (~/.claude, ~/.config/opencode)

## BMAD v6 Structure (relevant)

- `src/core/` — core method assets
- `src/modules/` — modules (e.g., `bmb`, `bmm`, `cis`)
  - Module agents live under `src/modules/<module>/agents/*.agent.yaml`
  - Validated by `tools/schema/agent.js` (Zod schema)
- `bmad/bmb/` — module assets used by BMB builder workflows
- CLI: `tools/cli/bmad-cli.js` (npx bmad)

## Comparison Matrix

| Aspect        | PR #821 (subagentic)                | BMAD v6                                        |
| ------------- | ----------------------------------- | ---------------------------------------------- |
| Agent format  | Markdown with frontmatter           | YAML (`*.agent.yaml`) conforming to Zod schema |
| Location      | `subagentic/` (top-level)           | `src/core`, `src/modules/<module>`             |
| Invocation    | Editor commands (@agent, \*command) | BMAD CLI / workflows / menu triggers           |
| Install model | Global (user home config)           | Project-scoped via CLI and templates           |
| Generation    | Static, hand-authored               | Dynamic via templates and sidecars             |
| Targets       | Claude, OpenCode                    | Tool-agnostic (BMAD method)                    |
| Docs index    | `AGENTS.md` loaded by OpenCode      | YAML-driven menus + module docs                |

## Overlaps & Integration Points

- Conceptual roles align: master, orchestrator, BA/PM/PO/SM, architect, dev, QA, UX
- Subagent checklists/templates/tasks are analogous to BMAD resources but not schema-aligned
- `subagentic/claude-subagents/AGENTS.md` acts like an index; BMAD uses menu triggers and workflows

## Isolation & Risks

- No direct conflicts with `src/` assets; content is fully isolated under `subagentic/`
- Introduces a parallel agent system with different conventions
- Risk of user confusion: two ways to do similar things
- Maintenance risk: static agents can drift from BMAD updates

## Preliminary Conclusion

- Technically non-conflicting; architecturally divergent
- Best treated as either:
  1. An external alternative documented in BMAD
  2. Source of patterns for BMAD dynamic generation
  3. A standalone snapshot module (if maintained separately)
