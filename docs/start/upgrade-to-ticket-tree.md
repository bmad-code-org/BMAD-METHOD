---
title: 'Upgrade to the Ticket Tree'
description: Replace the old planning skills and preserve historical work in entries and joined plans.
---

Use this guide when moving an existing installation to the ticket-tree skills. The npm v6 installer is a separate distribution; rerunning it does not perform this migration.

## Update the Installed Skills

For a Skills CLI installation, run from the project where you installed BMad:

```bash
npx skills update
npx skills add bmad-code-org/BMAD-METHOD --skill bmad --skill bmod-core-tools --skill bmod-method --skill bmad-preview-ticketing --skill bmad-build --skill bmad-build-auto --skill bmad-code-review --skill bmad-retrospective --skill bmad-correct-course
npx skills remove bmad-create-epics-and-stories bmad-sprint-planning --yes
npx skills list
```

Use the branch or release containing the ticket-tree changes if they have not reached your installation source yet. Keep the installation scope consistent: add `--global` for global add/remove/list operations. Omit `--agent` on removal to remove all links to those skills; use it only when intentionally limiting cleanup to selected agents. Check both project and global listings if you used both scopes.

For a plugin-managed installation, update the BMad plugin through the same manager that installed it, then restart the coding tool. Claude Code supports `claude plugin marketplace update` and `claude plugin update <plugin>`; Codex supports `codex plugin marketplace upgrade` and plugin installation through `codex plugin add <plugin@marketplace>`. If your manager retains removed skills, remove and reinstall that BMad plugin at the same scope. These are whole-plugin operations; do not hand-delete its cache or try Skills CLI removal on plugin-owned files.

For a manual copy or an old npm installation being replaced, inventory the configured agents' skill and command directories. Back up custom overrides, then remove only the obsolete `bmad-create-epics-and-stories` and `bmad-sprint-planning` folders and their links or forwarding commands. Install the current skills through the method you chose above. `removals.txt` records retired names but no current installer reads it to perform cleanup.

Run `bmad setup`, restart your coding tool, and check its skill list. The two removed names should be absent; ticketing, Build, review, retrospective, and correct-course should remain available.

## Migrate Historical Work

Ask `bmad migrate method` to inventory the v6 project. It proposes a conversion and backup before moving anything. Review and approve that plan, including the destination store and how unrelated files are handled.

Classic `epics.md` and `sprint-status.yaml`, and spec folders with `stories.yaml`, become epic entries and joined plans. Original tracking sources are archived unchanged. Criteria, implementation history, review findings, and completed states survive. A missing historical baseline is reported as missing; migration never substitutes today's commit.

An epic plan joins by numeric `ticket`; a standalone backlog plan joins by its leaf file stem. Untouched backlog entries need no plan. A historical status without its build record gets a minimal plan preserving that status and recording the missing evidence. Migration never creates epic story files just to start work, and standalone work needs no invented epic.

Retrospectives move directly into their epic as `epic-<slug>-retrospective.md`, retaining supported verdicts and historical content. Keep completed plans: they own live status and evidence, even after the epic is closed.

## Update Customizations and Runners

Rename Build's `open_spec` customization to `open_plan`. Replace `{spec_file}` with `{plan_file}` in Build and code-review overrides. The old names have no aliases. Rewrite custom instructions that depend on the removed tracking files around the ticket tree and joined plans.

Build finishes at `built`, which appears in the review column. The user or orchestrator marks work `done`. Code review writes findings to the plan and never advances status. Retrospective proposes action items and a verdict without creating tickets or closing the epic.

Build Auto requires explicit dispatch of one ticket or intent per invocation. A runner selects work, handles checkpoints and blocked results, and decides when to mark it done. Read [Autonomous Development Loops](../build/autonomous-development-loops.md) before updating a runner; installing these skills alone does not upgrade an external orchestrator.

## Verify the Migration

Compare mapped counts and completed states with the archived sources. Ask ticketing for status, build the next entry directly, and confirm its joined plan ends at `built`. Review a historical plan without changing its state, and run retrospective against the epic to confirm the preserved evidence is readable. Record missing baselines as limits on historical review.
