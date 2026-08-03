---
title: "Sprint Planning"
description: One skill owns the sprint-status artifact end to end — gate the plan, generate the tracking, view the status, repair it when it breaks — with the mechanical work done by a deterministic script.
sidebar:
  order: 17
---

Run `bmad-sprint-planning` at the boundary between planning and implementation. It answers three questions with one skill: is this plan actually buildable (the readiness gate), what work exists and where does it stand (`sprint-status.yaml` generation), and where are we now (the status view). It also validates and repairs the tracking file itself. Say "check implementation readiness", "run sprint planning", "show sprint status", "validate sprint status", or "fix sprint status" — the skill detects which you want.

## Why one skill

`sprint-status.yaml` is the single tracking artifact the whole dev cycle reads and writes — build syncs story statuses into it, code-review moves stories through review, the retrospective appends action items to it. Everything that *creates* or *summarizes* that artifact now lives in the skill that owns it. Gating, generating, and viewing were previously spread across three skills (`bmad-check-implementation-readiness`, `bmad-sprint-planning`, `bmad-sprint-status`); consolidation means one owner, one status vocabulary, and no drift between what the gate checks and what the tracker builds.

## The readiness gate

Before any tracking exists, the skill judges the plan like a skeptical senior developer reading a handoff. It inventories whatever planning artifacts the project actually has — briefs, PRFAQs, PRDs, specs, UX outputs, architecture, epics — identifying documents by reading them, not by filename patterns. Then it asks one question: **could a developer implement these epics without inventing decisions nothing records?**

The verdict is `PASS`, `CONCERNS`, or `FAIL`. Concerns are listed and you choose whether to proceed; a fail stops the workflow with findings ordered by severity, each naming the skill that fixes it. A missing document type is only a finding if stories depend on it — a project with no UX artifact and no UI stories is fine.

The `IR` trigger on the Product Manager's and Architect's menus runs this gate.

## Deterministic where it should be

Parsing epic files, deriving story keys, ordering entries, merging with an existing status file, and counting statuses are not judgment calls — so they aren't done by inference. A script inside the skill (`sprint_plan.py`) owns them:

- **`generate`** parses `## Epic N:` / `### Story N.M: Title` headings into kebab-case keys (fenced code blocks ignored, non-Latin titles keep their characters), orders each epic with its stories and retrospective entry, and merges against any existing file: advanced statuses are preserved, never downgraded; legacy v6 values (`drafted`, `contexted`) are normalized to their modern meaning rather than reset; retrospective `action_items`, custom keys, and hand-written comments pass through untouched; and `project_key`/`tracking_system`/`story_location` are kept from the existing file unless explicitly overridden. A story file already on disk floors its status at `ready-for-dev`. `--dry-run` doubles as the drift report (`in_sync`, new entries, orphans with their old statuses, illegal values) without writing. Writes are atomic and validated, with the original restored on failure.
- **`status`** computes counts, risk flags (stale file, orphaned stories, in-progress epics with no stories, stories waiting in review, unrecognized keys), open action items, and the next recommended action by fixed priority: resume in-progress → review what's waiting → start the next ready story → start the first backlog story → run an open retrospective → done.
- **`validate`** reports whether the file is structurally sound — recognized keys, legal statuses, well-formed action items, parseable timestamps — without writing.

The LLM keeps the parts that need judgment: deciding which files are epics, weighing readiness, and reconciling what the script flags — unparsed headings, orphaned entries whose old status now rides along in the report so a rename can be transplanted with `--set`. And if a hand-edited file defeats the script entirely, the skill falls back to reading it directly and giving you a best-judgment summary, telling you the deterministic path failed and offering the fix flow.

## Repair

"Fix sprint status" rebuilds a broken or drifted tracking file to a pristine state. The order matters: inference first, confirmation second, script last. Subagents fan out over the evidence — epic files for the work breakdown, story files and git history for what actually got built, the current file for anything salvageable — and reconcile it into one proposed state table. Nothing is written until you confirm that table. Then a single `generate --fresh --set key=status ...` run produces a clean, canonical file, and `validate` confirms it. The `--set` path is deliberately the only one allowed to downgrade a status: repair reflects confirmed reality, not the never-downgrade merge rule.

## The status view

"Show sprint status" skips the gate and renders the script's summary: counts, risks, open action items from retrospectives, and one recommended next action with its story key. No time estimates — status, risks, and next steps only. Legacy status values from older files (`drafted`, `contexted`) are mapped transparently and reported.

## Migration notes

- `bmad-check-implementation-readiness` has been removed; the `IR` agent menu trigger forwards here.
- `bmad-sprint-status` is now a deprecation shim that forwards here with status-view intent. Migrate any `_bmad/custom/bmad-sprint-status.toml` overrides to `_bmad/custom/bmad-sprint-planning.toml`.
- The output format of `sprint-status.yaml` is unchanged — build's sprint sync and the retrospective tooling read and write it exactly as before.
