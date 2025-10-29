# Integration Options for PR #821

Date: 2025-10-28
Branch: pr-821-review

## Option 1: Accept as Static "Snapshot" Module

- Location: `extras/subagentic/` or `src/modules/subagentic/` (doc-only)
- Scope: Keep Claude/OpenCode content intact; mark as snapshot
- Work: Clean whitespace, add README, wire docs
- Effort: 4–6 hours
- Risks: Drift from BMAD, dual system confusion

## Option 2: Use as Inspiration for Dynamic Generation (Recommended)

- Scope: Extract patterns from subagent definitions (principles, commands)
- Work:
  1. Spike adapter for 1–2 agents → `*.agent.yaml`
  2. Design templates to generate MD (if needed) for editor consumption
  3. Integrate via `bmad` CLI workflows and sidecars
- Effort: 10–16 hours (spike + template wiring)
- Benefits: Single source of truth; aligned with v6 vision

## Option 3: Reference as External Alternative

- Scope: Do not merge code; link to agentic-toolkit in docs
- Work: Update `README.md` + docs under `docs/installers-bundlers/`
- Effort: 1–2 hours
- Benefits: Zero maintenance; users can opt-in

## Option 4: Hybrid

- Scope: Accept 3 simple workflow agents (Create PRD, Generate Tasks, Process Task List)
- Work: Convert 3 agents to BMAD YAML; ship as `src/modules/simple/`
- Effort: 6–10 hours
- Benefits: Adds unique value with minimal footprint

## Decision Criteria

- Architectural alignment with v6 (dynamic, template-driven)
- Maintenance burden and ownership
- User clarity and documentation needs
- Ability to validate/test within existing tooling

## Next Steps

- If Option 2 or 4: Build a small adapter prototype for one agent (e.g., `master`)
- If Option 3: Add docs and close PR with appreciation and cross-link
- Prepare PR comment summarizing analysis and recommendation
