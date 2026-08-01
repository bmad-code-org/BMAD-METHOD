---
title: "Sprint Planning"
description: One skill owns the sprint-status artifact end to end — gate the plan, generate the tracking, view the status — with the mechanical work done by a deterministic script.
sidebar:
  order: 16
---

Run `bmad-sprint-planning` at the boundary between planning and implementation. It answers three questions with one skill: is this plan actually buildable (the readiness gate), what work exists and where does it stand (`sprint-status.yaml` generation), and where are we now (the status view). Say "check implementation readiness", "run sprint planning", or "show sprint status" — the skill detects which of the three you want.

## Why one skill

`sprint-status.yaml` is the single tracking artifact the whole dev cycle reads and writes — build syncs story statuses into it, code-review moves stories through review, the retrospective appends action items to it. Everything that *creates* or *summarizes* that artifact now lives in the skill that owns it. Gating, generating, and viewing were previously spread across three skills (`bmad-check-implementation-readiness`, `bmad-sprint-planning`, `bmad-sprint-status`); consolidation means one owner, one status vocabulary, and no drift between what the gate checks and what the tracker builds.

## The readiness gate

Before any tracking exists, the skill judges the plan like a skeptical senior developer reading a handoff. It inventories whatever planning artifacts the project actually has — briefs, PRFAQs, PRDs, specs, UX outputs, architecture, epics — identifying documents by reading them, not by filename patterns. Then it asks one question: **could a developer implement these epics without inventing decisions nothing records?**

The verdict is `PASS`, `CONCERNS`, or `FAIL`. Concerns are listed and you choose whether to proceed; a fail stops the workflow with findings ordered by severity, each naming the skill that fixes it. A missing document type is only a finding if stories depend on it — a project with no UX artifact and no UI stories is fine.

The `IR` trigger on the Product Manager's and Architect's menus runs this gate.

## Deterministic where it should be

Parsing epic files, deriving story keys, ordering entries, merging with an existing status file, and counting statuses are not judgment calls — so they aren't done by inference. A script inside the skill (`sprint_plan.py`) owns them:

- **`generate`** parses `## Epic N:` / `### Story N.M: Title` headings into kebab-case keys, orders each epic with its stories and retrospective entry, and merges against any existing file: advanced statuses are preserved, never downgraded, and retrospective `action_items` pass through untouched. A story file already on disk floors its status at `ready-for-dev`. Writes are atomic and validated, with the original restored on failure.
- **`check`** reports drift between the epics and an existing status file without writing.
- **`status`** computes counts, risk flags (stale file, orphaned stories, in-progress epics with no stories, stories waiting in review), open action items, and the next recommended action by fixed priority: resume in-progress → review what's waiting → start the next ready story → start the first backlog story → run an open retrospective → done.

The LLM keeps the parts that need judgment: deciding which files are epics, weighing readiness, and reconciling what the script flags — unparsed headings, orphaned entries whose status would be lost by a rename. And if a hand-edited file defeats the script entirely, the skill falls back to reading it directly and giving you a best-judgment summary, telling you the deterministic path failed and offering to repair the file.

## The status view

"Show sprint status" skips the gate and renders the script's summary: counts, risks, open action items from retrospectives, and one recommended next action with its story key. No time estimates — status, risks, and next steps only. Legacy status values from older files (`drafted`, `contexted`) are mapped transparently and reported.

## Migration notes

- `bmad-check-implementation-readiness` has been removed; the `IR` agent menu trigger forwards here.
- `bmad-sprint-status` is now a deprecation shim that forwards here with status-view intent. Migrate any `_bmad/custom/bmad-sprint-status.toml` overrides to `_bmad/custom/bmad-sprint-planning.toml`.
- The output format of `sprint-status.yaml` is unchanged — build's sprint sync and the retrospective tooling read and write it exactly as before.
