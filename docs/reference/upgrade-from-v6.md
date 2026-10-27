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
- **v6 leftovers.** It lists the v6 traces under `_bmad/` that v7 no longer reads, such as stale config keys and unused customizations, and offers once to remove them after copying `_bmad/` to a backup folder.
- **Migrations.** It ends by checking whether a migration applies and asking whether to run it.

Retired skills with a replacement:

| v6 skill | In v7 |
| --- | --- |
| `bmad-sprint-planning`, `bmad-create-epics-and-stories`, `bmad-correct-course` | Removed; Sofia, the Product Owner (`bmad-agent-po`), replaces them. |
| `bmad-quick-spec`, `bmad-spec` | Removed; Sofia writes the requirements into the ticket itself. |
| `bmad-create-ux-design` | Renamed to `bmad-ux`. |
| `bmad-agent-builder`, `bmad-workflow-builder`, `bmad-module-builder` | Removed; Toolsmith's `bmad-toolsmith` agent replaces them. |
| `bmad-eval-runner` | Renamed to `bmad-eval`. |
| `bmad-bmm-document-project`, `bmad-bmm-generate-project-context` | Removed; `bmad-project-context` replaces both. |

Setup lists every other retired skill it finds.

## Migrate Your v6 Files

Accept setup's offer, or ask `bmad` to run `bmad migrate method`. The migration backs up `_bmad/` and your output folder, reads your files, shows what it found, and changes nothing else until you approve its plan.

### What Counts as v6

The migration looks in your v6 planning and implementation folders and in the output folder. Any of these makes it worth running:

| v6 file | In v7 |
| --- | --- |
| `epics.md` or `sprint-status.yaml` | A ticket tree: a `tickets/` folder with a `tickets.toml` in the initiative and in each epic. Open action items become lines in the initiative's Notes. The originals move to `archive-v6/` unchanged. |
| Story files named `<epic>-<story>-<slug>.md` or `spec-<epic>-<story>-<slug>.md` with `route:` and `status:` in frontmatter | A plan, `story-<slug>-plan.md`, in the epic's `tickets/` folder beside its entry. A story that has not started can fold into its entry instead. |
| Dated folders such as `prds/prd-<name>-<date>/prd.md` | The folder moves whole into the initiative under its v6 name; its main file is renamed to match the folder and gains `type`, `title`, and `created` frontmatter when it lacks them. |
| `specs/spec-<slug>/SPEC.md` | With `stories.yaml`, an epic in the initiative's `tickets/` folder, each story an entry. Without, the folder moves whole like any other document. |
| `spec-<slug>/spec-<slug>.md` with `.memlog.md` beside it, from a 6.13 pre-release | Folded into the ticket it sits in: capabilities become Requirements lines, companions become References, the memlog entries join the ticket's, and the folder goes. One at the output folder's root becomes `backlog/story-<slug>.md`. |

It applies only while no active initiative is set and no `initiative-*/` folder under the output folder holds a file of the same name. A project that has those, with `tickets.toml` and a ticketing store config, is already on v7: the migration says so and stops, unless you name v6 leftovers to bring in.

### The v7 Layout

```
<output folder>/
├── initiative-<slug>/
│   ├── initiative-<slug>.md                 # the initiative envelope
│   ├── prd-<name>-<date>/                   # each v6 document folder, moved whole, its name kept
│   │   └── prd-<name>-<date>.md             # the main file, renamed to match its folder
│   ├── tickets/
│   │   ├── tickets.toml                     # one [[epic]] per epic, in build order
│   │   └── epic-<slug>/
│   │       ├── epic-<slug>.md               # the epic envelope
│   │       ├── epic-<slug>-retrospective.md # historical retrospectives
│   │       └── tickets/
│   │           ├── tickets.toml             # one [[entry]] per story, in build order
│   │           └── story-<slug>-plan.md     # a v6 build record; owns status
│   └── archive-v6/                          # the v6 tracking sources and folded story files, unchanged
├── backlog/                                 # stories and bugs with no epic
├── archive/                                 # older document versions you chose to archive
└── migration-v6-v7/migration-v6-v7.md       # the plan and verification record
```

A moved document keeps its v6 folder name, dates and sequence numbers included; only the names the migration writes itself, the envelopes, epic folders, and plans, follow the v7 ticketing names. No file is deleted: what the migration does not recognize stays where it is and is listed in the plan and the report. The backup sits at `.v6-v7-migration-backup-<datetime>/` in the project root, ignored by git.

### Plan and Approve

After the inventory, the migration asks two questions together, each with a default, so "all defaults" is an answer:

| Question | Default |
| --- | --- |
| Are the planning and implementation folders it found the right ones, and is there content elsewhere? | Yes; none elsewhere |
| Will the work touch other repositories, or should the planning files keep their own git history apart from the code? If so, the store becomes its own repository, or `_bmad/` and the planning files move into a workspace folder above the projects. | No |

Others come up where they apply: when the inventory suggests several initiatives, which documents group into which; when stories are in progress or in review, whether to finish them in v6 first (the default); whether to fold the files of unstarted stories into their entries (the default); and when several versions of one document share a name, whether the older ones move to `archive/`.

It writes the plan to `migration-v6-v7/migration-v6-v7.md` in the output folder. The plan lists which files join the initiative and the evidence for each, which stay in place and why, and which are archived, plus each story's new entry and status. Correct the lists once and approve. Until then, the only things written are the plan and the backup. Under git, every move is a `git mv`, so history follows the file, and in an existing repository the migration commits after each step. It never pushes.

## Check the Result

The migration runs its checklist, records each result in the plan, and fixes or reports each failure. It then reports the ticket tree's status, the archived sources, the files left in place, and plans with no baseline revision. Then:

1. Read the checklist results in the plan at `migration-v6-v7/migration-v6-v7.md` in the output folder.
2. Update the references the report lists outside the output folder and `_bmad/`. The migration finds them but never edits them.
3. If the migration created a repository for the planning files, accept its initial commit, or the tree stays uncommitted.
4. Delete the backup when you no longer need it. It is yours to delete.

Next, run `bmad-build` on the next entry, `bmad-code-review` on a historical plan, `bmad-retrospective` on an epic, or `bmad-project-context` for a root `AGENTS.md` that names the active initiative.

## Handle the Breaking Changes

| Change | What to do |
| --- | --- |
| `planning_artifacts` and `implementation_artifacts` are no longer read or seeded. | Run `bmad migrate method`. It finds your v6 files through them and moves those files into the initiative layout. |
| The ticketing store's `root` key is gone. The ticket tree is `{output_folder}/{active_initiative}`. | To move the store, set `core.output_folder` in `_bmad/custom/config.toml`. |
| `active_initiative` moved from `[modules.bmm]` to `[core]` in `_bmad/custom/config.user.toml`. | If you set it on a preview build, move the line. The migration and `bmad` write it under `[core]`. |
| Sofia, the Product Owner (`bmad-agent-po`), replaces `bmad-spec`, `bmad-ticket`, and `bmad-correct-course`, and `bmad-preview-ticketing` is gone. | Run `bmad setup`. It moves `_bmad/custom/bmad-ticket.toml` to `bmad-agent-po.toml`, moves its `persistent_facts` and `activation_steps_*` from `[workflow]` to `[agent]`, drops the keys Sofia does not read, and offers to delete the old skills. Overrides of the other three do not move; copy what you still need into `bmad-agent-po.toml`. |
| An initiative or epic keeps its `tickets.toml`, child epics, leaf files, and plans in a `tickets/` folder inside it, and `tickets.py` refuses a tree in the earlier layout. | Run `bmad migrate method` to move it. |
| Web bundles are removed: the `web-bundles/` folder, its packager, and its docs pages. | Gemini Gems and ChatGPT Custom GPTs are deprecated, and both platforms are replacing them with skills. Use BMad's skills instead. |

## What You Get

The project runs the v7 skills, with the retired ones deleted where you agreed. Your v6 planning documents, epics, and stories sit in one initiative folder as a ticket tree whose plans own status, and that initiative is active. The v6 tracking sources are archived unchanged, and the plan records every question, answer, and check.
