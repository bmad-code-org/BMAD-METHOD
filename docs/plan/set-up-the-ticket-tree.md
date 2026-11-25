---
title: 'Set Up the Ticket Tree'
description: Set up an initiative store and choose where tickets are tracked, so Sofia, the Product Owner, can plan and track work in the ticket tree.
sidebar:
  order: 7
---

Sofia, the Product Owner (`bmad-agent-po`), is how BMad plans and tracks work: she writes each ticket's requirements and breaks work into epics and stories in the shared ticket tree. Build, Build Auto, code review, and retrospective consume that tree.

With BMad installed and tickets kept in the repository, the default, there is nothing to set up: go to [Write and Slice the Initiative](./write-and-slice-the-initiative.md). Read on to install only Sofia's skills, keep the store somewhere else or across several repos, or track tickets in a tracker.

## Install the Skills

Install with the skills CLI. Run this in your project:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill bmad --skill bmod-core-tools --skill bmod-method --skill bmad-agent-po
```

Add `--skill bmad-build` and any other skill you want in the same command. Then open your AI tool in the project, ask the `bmad` skill to run `bmad setup`, and check that the tool lists `bmad-agent-po`. Update later by asking `bmad` to run `bmad setup` again.

:::note[Prerequisites]
You need Node.js with npm, Git, and [uv](https://docs.astral.sh/uv/). BMad setup and the ticketing scripts run through `uv`.
:::

## Create an Initiative Store

The initiative store is the folder where planning lives: one folder per initiative, plus a `backlog/` folder for standalone tickets. An initiative is one body of work, such as a product, a major feature, or a migration. Its planning documents and its tickets sit together in its folder.

### 1. Choose where the store lives

The store is your BMad output folder, `_bmad-output` by default. You can configure it to be any folder; the example below uses `_bmad-initiative-store` instead, and step 2 shows the setting. In a single repo, the default inside the project works fine.

When the work spans several repos, install BMad in the workspace folder that holds them and put the store there too. Start your AI tool from that workspace folder, so one session can reach the plan and every repo it touches. Give the store its own `git init`, which keeps planning history apart from each repo's code history.

```
rooms-workspace/                         # start your AI tool here; not a repo itself
├── _bmad/                               # BMad install and configuration
├── _bmad-initiative-store/              # the store — its own git repo
│   ├── initiative-check-in/
│   │   ├── initiative-check-in.md
│   │   ├── prd-check-in/
│   │   │   └── prd-check-in.md
│   │   └── tickets/                     # the initiative's breakdown
│   │       ├── tickets.toml             # the epics in build order
│   │       └── epic-door-check-in/
│   │           ├── epic-door-check-in.md
│   │           ├── ux-epic-door-check-in/ # a Sally (bmad-agent-ux-designer) ux-epic run on this epic
│   │           └── tickets/             # the epic's breakdown
│   │               ├── tickets.toml     # every planned story, in build order
│   │               ├── story-show-each-room-on-its-door-tablet-plan.md  # the build's plan and the story's status
│   │               └── story-check-in-at-the-door.md                    # a story's file, only when refined or published
│   ├── initiative-room-analytics/
│   └── backlog/
│       └── bug-recurring-booking-shows-twice.md
├── rooms-api/                           # code repo
├── rooms-web/                           # code repo
└── door-tablet/                         # code repo
```

:::caution[Start each build in its code repo]
`bmad-build` runs git in the folder you start it from, so plan from the
workspace but start each build in the code repo the story belongs to. BMad
finds `_bmad/` by walking up the folders, so it still finds the plan.
:::

### 2. Point BMad at it

Skip this step when you keep the default. Otherwise set `output_folder` in `_bmad/custom/config.toml`, which is committed and applies to the whole team:

```toml
[core]
output_folder = "{project-root}/_bmad-initiative-store"
```

`{project-root}` is the folder that holds `_bmad/`. In the layout above, that is `rooms-workspace/`.

### 3. Name the active initiative

Set the initiative you are working on in `_bmad/custom/config.user.toml`, which is personal and not committed:

```toml
[core]
active_initiative = "initiative-check-in"
```

The value is the initiative's folder name in the store. When it is unset, Sofia offers to create the folder and record the setting for you. You can also ask the `bmad` skill to show, switch, create, or clear the active initiative at any time.

:::tip[One workspace, many projects]
If one workspace holds unrelated projects, tell your coding agent to follow the active initiative. Put a short rule in `AGENTS.md`, or whatever instruction file your tool reads, that names the setting and says which folders belong to which initiative:

```md
`active_initiative` in `_bmad/custom/config.user.toml` says what we are working on.

## If the active initiative contains `check-in`

Read `docs/rooms.md` for how the room booker repos fit together and how to run them.

## Otherwise

Ignore `rooms-api`, `rooms-web`, and `door-tablet`, and do not read `docs/rooms.md` unless I ask.
```

The agent then stays out of repos that have nothing to do with the current work, and you switch its focus by changing one setting.
:::

## Bring Existing Planning Documents

The planning skills write into the active initiative's folder, each document as `<type>-<slug>/<type>-<slug>.md`. If you have a project from an earlier BMad version, ask the `bmad` skill to run `bmad migrate method`: it plans the move for the planning documents, `epics.md`, `sprint-status.yaml`, and the stories, shows you the plan, and applies it. The same command moves an earlier tree, with `tickets.toml` and epic folders directly in the initiative folder, into the `tickets/` folders. To move only a few planning documents by hand, copy them in the same way:

```
_bmad-output/planning-artifacts/brief.md         → initiative-check-in/brief-check-in/brief-check-in.md
_bmad-output/planning-artifacts/prd.md           → initiative-check-in/prd-check-in/prd-check-in.md
_bmad-output/planning-artifacts/DESIGN.md        → initiative-check-in/ux-check-in/DESIGN.md
_bmad-output/planning-artifacts/EXPERIENCE.md    → initiative-check-in/ux-check-in/EXPERIENCE.md
_bmad-output/planning-artifacts/architecture.md  → initiative-check-in/architecture-check-in/architecture-check-in.md
```

UX is the exception to the naming: Sally (`bmad-agent-ux-designer`) writes `EXPERIENCE.md` and (when defining or overriding tokens) `DESIGN.md` inside the `ux-<slug>` (or `ux-system-<slug>` / `ux-epic-<slug>`) folder beside the short `<id>-<slug>.md` router that names them. Your source paths will differ.

## Configure Where Tickets Are Tracked

Out of the box, tickets are markdown files in the store, and there is nothing to set up. To use a tracker, ask Sofia:

```text wrap
/bmad-agent-po set up the ticket store
```

Sofia writes your choice to `_bmad/custom/ticketing-store-config.toml`. That file holds only what your project sets, such as the tracker's project key. Anything you add to it overrides the skill's default for that tracker, and your edits survive skill updates.

| Choice        | What it means                                                                        |
| ------------- | ------------------------------------------------------------------------------------ |
| Repo          | The default. Tickets are markdown files in the store. No account needed.             |
| GitHub Issues | Tickets publish as issues, with sub-issues and blocked-by relations.                 |
| Jira          | Tickets publish as Jira issues.                                                      |
| Linear        | Tickets publish as Linear issues.                                                    |
| Notion        | Tickets publish as rows in a Notion database.                                        |
| Trello        | Tickets publish as cards.                                                            |

With a tracker, the markdown files remain the working copy and the tracker is where the team sees them. Setup offers to connect the tool, create the labels or fields it needs, and prove the connection with a test ticket. [Map Your Tracker to the Ticket Tree](../reference/map-your-tracker.md) shows what each level and status becomes in each tracker, and what has no counterpart. To change it later:

```text wrap
/bmad-agent-po reconfigure the ticket store
```

:::note[Repo is the default, and the most tested]
Repo is the default and the choice that has been tested most. The tracker options still need a lot of testing. If you use one of those trackers, trying it and reporting what happens is some of the most useful help you can give, and all feedback is welcome.

Hooks are not integrated yet, so nothing syncs on its own: a tracker and the ticket files are brought in line only when you run the skill. Hooks may be added later.
:::

## Use Sofia

With the store set, talk to Sofia to write and slice the work, and to see what
is ready. [Write and Slice the Initiative](./write-and-slice-the-initiative.md)
and [Plan an Epic's Stories](./plan-an-epics-stories.md) walk through the
steps, [Build and Verify](../build/build-and-verify.md) hands a story to the
build, and [The Ticket Tree](../reference/ticket-tree.md) has the exact
layout, fields, and statuses.

With a tracker, start the story with Sofia before you build, so the ticket
publishes if it has not and its card moves to in progress:

```text wrap
/bmad-agent-po start story 1.2
```

The tracker's status is read into the story's file as `tracker_status`, so
moving a card on the board never makes a build skip planning.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office's meeting-room app:

**You:**

```text wrap
/bmad-agent-po set up the ticket store
```
**Sofia:** Repo, GitHub Issues, Jira, Linear, Notion, or Trello?

**You:** Jira, project key ROOM.

Once you approve the door check-in epic's stories, Sofia offers to publish
them as Jira issues. Before building:

**You:**

```text wrap
/bmad-agent-po start story 1.2
```
**Sofia:** Story 1.2 is ready to start. Published as ROOM-12 and moved to In
Progress.

Then build it; when the build finishes, it offers to open a pull request.

```text wrap
/bmad-build 1.2
```

Moving a card on the board starts nothing by itself: you start each build,
or an AI coding session you direct does, as in [Autonomous Development Loops](../build/autonomous-development-loops.md).
:::

## Tell Us What You Find

Feedback helps improve Sofia and her tracker integrations. The most useful reports say what you gave her, what you asked for, what she produced, and what you expected instead. Open a [GitHub issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) with "bmad-agent-po" in the title, or post in [Discord](https://discord.gg/gk8jAdXWmj).
