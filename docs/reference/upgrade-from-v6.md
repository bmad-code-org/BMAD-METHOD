---
title: 'How to Upgrade from v6'
description: Move a BMad v6 project to v7 with bmad setup and bmad migrate method, and handle the breaking changes.
sidebar:
  order: 2
---

Use the `bmad` skill's `bmad setup` and `bmad migrate method` to move a project from BMad v6 to v7: install the v7 skills, clean up the skills v7 retired, and move your v6 planning and implementation files into the v7 initiative layout.

## When to Use This

- The project was installed with BMad v6.
- The project holds v6 planning documents, epics, sprint tracking, or story files.
- You customized or configured skills and settings that v7 renamed or removed.

:::note[Prerequisites]
[uv](https://docs.astral.sh/uv/) is required. Setup stops without it.
:::

## Install the v7 Skills

Skills replace the v6 installer. From the project directory, run `npx skills add bmad-code-org/BMAD-METHOD`, or install from a plugin marketplace. [Install BMad](../start/install-bmad.md) lists the skills to select and the marketplace commands.

## Run Setup

Ask the `bmad` skill to run `bmad setup`. It is one flow that checks the installation, reports what it found, and fixes what you choose. It always asks before deleting anything or running a migration.

- **Runtime.** It installs the shared scripts and each module's scripts under `_bmad/`, and asks any new config questions.
- **Updates.** When a module has a newer version, it runs `npx skills update` for you.
- **Renamed skills.** It moves a renamed skill's `_bmad/custom/` files to the new name when no file of that name exists yet. When both exist, you merge them.
- **Retired skills.** It offers to delete renamed and removed skills still in your skills folders, including ones your v6 install left behind, and says when a customization no longer applies.
- **Migrations.** It ends by checking whether a migration applies and asking whether to run it.

Retired skills with a replacement:

| v6 skill | In v7 |
| --- | --- |
| `bmad-sprint-planning`, `bmad-create-epics-and-stories` | Removed; `bmad-ticket` replaces both. |
| `bmad-create-ux-design` | Renamed to `bmad-ux`. |
| `bmad-agent-builder`, `bmad-workflow-builder`, `bmad-module-builder` | Removed; Toolsmith's `bmad-toolsmith` agent replaces them. |
| `bmad-eval-runner` | Renamed to `bmad-eval`. |
| `bmad-bmm-document-project`, `bmad-bmm-generate-project-context` | Removed; `bmad-project-context` replaces both. |

Setup lists every other retired skill it finds.

## Migrate Your v6 Files

Accept setup's offer, or ask `bmad` to run `bmad migrate method`. The migration reads your files first, shows what it found, and changes nothing until you approve its plan.

### What Counts as v6

The migration looks in your v6 planning and implementation folders and in the output folder. Any of these makes it worth running:

| v6 file | In v7 |
| --- | --- |
| `epics.md` or `sprint-status.yaml` | A ticket tree: `tickets.toml` in the initiative and in each epic folder. The originals move to `archive-v6/` unchanged. |
| Story files named `<epic>-<story>-<slug>.md` or `spec-<epic>-<story>-<slug>.md` with `route:` and `status:` in frontmatter | A plan, `story-<slug>-plan.md`, beside its entry in the epic folder. A story that has not started can fold into its entry instead. |
| Dated folders such as `prds/prd-<name>-<date>/prd.md` | `prd-<name>/prd-<name>.md`, with the date kept in `created` frontmatter. |
| `specs/spec-<slug>/SPEC.md` | `spec-<slug>/spec-<slug>.md`, with its companions unchanged. |

It applies only while no active initiative is set and no `initiative-*/` folder under the output folder holds a file of the same name. A project that has those, with `tickets.toml` and a ticketing store config, is already on v7: the migration says so and stops, unless you name v6 leftovers to bring in.

### The v7 Layout

```
<output folder>/
├── initiative-<slug>/
│   ├── initiative-<slug>.md                 # the initiative envelope
│   ├── tickets.toml                         # one [[epic]] per epic, in build order
│   ├── prd-<slug>/prd-<slug>.md             # each planning document in its own folder
│   ├── epic-<slug>/
│   │   ├── epic-<slug>.md                   # the epic envelope
│   │   ├── tickets.toml                     # one [[entry]] per story
│   │   └── story-<slug>-plan.md             # a v6 build record; owns status
│   ├── archive-v6/                          # the v6 tracking sources, unchanged
│   └── migration-v6-v7/migration-v6-v7.md   # the plan and verification record
├── backlog/                                 # stories and bugs with no epic
└── inbox/                                   # v6 work with no home yet
```

No name the migration writes carries a date or a v6 story or epic number. No file is deleted: files that do not join the initiative go to `inbox/` or `archive-v6/`, or stay where they are.

### Plan and Approve

The migration asks its questions together, each with a default, so "all defaults" is an answer:

| Question | Default |
| --- | --- |
| Back up the output folder first? A clean, committed git folder already counts as a backup. | Yes |
| Is the work one initiative or several, and what is each called? | One, named after the project |
| Will the work touch other repositories? If so, `_bmad/` and the planning files move into a workspace folder above them. | No |
| Keep the planning files' git history in their own repository? | No |
| Finish stories in progress or in review in v6 first, or migrate now? | Finish first |
| Fold the story files of unstarted stories into their entries and archive them? | Yes |

It writes the plan to `migration-v6-v7/migration-v6-v7.md` in the output folder. The plan lists which files join the initiative and the evidence for each, which go to `inbox/`, which stay, and which are archived, plus each story's new entry and status. Correct the lists once and approve. Until then, the only things written are the plan and the backup. Under git, every move is a `git mv`, so history follows the file, and in an existing repository the migration commits after each group of moves. It never pushes.

## Check the Result

The migration runs its checklist, records each result in the plan, and fixes or reports each failure. It then reports the ticket tree's status, the archived sources, the files left in place, and plans with no baseline revision. Then:

1. Read the checklist results in the plan, now at `migration-v6-v7/migration-v6-v7.md` in the initiative folder.
2. Update the references the report lists outside the output folder and `_bmad/`. The migration finds them but never edits them.
3. If the migration created a repository for the planning files, accept its initial commit, or the tree stays uncommitted.
4. Delete the backup when you no longer need it. It is yours to delete.

Next, run `bmad-build` on the next entry, `bmad-retrospective` on an epic, or `bmad-project-context` for a root `AGENTS.md` that names the active initiative.

## Handle the Breaking Changes

| Change | What to do |
| --- | --- |
| `planning_artifacts` and `implementation_artifacts` are no longer read or seeded. | Run `bmad migrate method`. It finds your v6 files through them and moves those files into the initiative layout. |
| The ticketing store's `root` key is gone. The ticket tree is `{output_folder}/{active_initiative}`. | To move the store, set `core.output_folder` in `_bmad/custom/config.toml`. |
| `active_initiative` moved from `[modules.bmm]` to `[core]` in `_bmad/custom/config.user.toml`. | If you set it on a preview build, move the line. The migration and `bmad` write it under `[core]`. |
| `bmad-preview-ticketing` is now `bmad-ticket`, and no forwarder remains under the old name. | Run `bmad setup`. It moves the skill's `_bmad/custom/` file to `bmad-ticket.toml`, offers to delete the old skill, and offers to install `bmad-ticket`. |
| Web bundles are removed: the `web-bundles/` folder, its packager, and its docs pages. | Gemini Gems and ChatGPT Custom GPTs are deprecated, and both platforms are replacing them with skills. Use BMad's skills instead. |

## What You Get

The project runs the v7 skills, with the retired ones deleted where you agreed. Your v6 planning documents, epics, and stories sit in one initiative folder as a ticket tree whose plans own status, and that initiative is active. The v6 tracking sources are archived unchanged, and the plan records every question, answer, and check.
