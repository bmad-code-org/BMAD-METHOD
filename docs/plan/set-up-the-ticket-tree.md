---
title: 'Set Up the Ticket Tree'
description: Set up an initiative store, switch active work, migrate older planning files, and optionally connect an external issue tracker for Sofia, the Product Owner.
sidebar:
  order: 7
---

Sofia, the Product Owner (`bmad-agent-po`), plans and tracks work in a shared folder called the ticket tree: requirements, epics, stories, and their build plans. `bmad-build`, `bmad-build-auto`, `bmad-code-review`, and `bmad-retrospective` all read from that tree.

With BMad installed and tickets stored inside your repository (the default), nothing needs to be configured: go straight to [Write and Slice the Initiative](./write-and-slice-the-initiative.md). Read on if you want to install only Sofia's skills, keep planning files in a separate folder shared across multiple repos, migrate from an older BMad version, or connect an external issue tracker.

## Install the Skills

Install with the skills CLI from your project root:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill bmad --skill bmod-core-tools --skill bmod-method --skill bmad-agent-po
```

Add `--skill bmad-build` and any other skill you want in the same command. Then open your AI tool in the project, ask the `bmad` skill to run `bmad setup`, and verify that `bmad-agent-po` appears in your tool's skill list. To update later, ask `bmad` to run `bmad setup` again.

:::note[Prerequisites]
You need Node.js with npm, Git, and [uv](https://docs.astral.sh/uv/). BMad setup and the ticket tree scripts run through `uv`.
:::

## Create an Initiative Store

The initiative store is the folder where your planning files and tickets live: one top-level folder per program, initiative, or standalone epic, plus a `backlog/` folder for standalone stories, bugs, or spikes. Every container keeps its own spec, planning documents, and retrospective at the top of its folder and its child breakdown inside `tickets/`.

### 1. Choose where the store lives

By default, your store is `_bmad-output/` inside your project. That works out of the box for a single repository.

When one project spans multiple repositories, install BMad in the parent workspace folder that holds all of them and put the store there too (the layout below uses `_bmad-initiative-store/`). Launch your AI tool from that workspace folder when planning so one session can inspect the plan and every repository. Giving the store its own `git init` keeps planning history separate from each code repository's commit log.

```text
rooms-workspace/                         # start planning sessions here; not a code repo itself
├── _bmad/                               # BMad install and configuration
├── _bmad-initiative-store/              # the store, with its own git history
│   ├── program-workplace-ops/           # optional program holding child initiatives
│   │   ├── program-workplace-ops.md
│   │   └── tickets/
│   │       ├── tickets.toml             # child initiatives in build order
│   │       └── initiative-check-in/     # nested child initiative
│   ├── initiative-room-analytics/       # standalone multi-epic initiative
│   │   ├── initiative-room-analytics.md
│   │   ├── prd-room-analytics/
│   │   │   └── prd-room-analytics.md
│   │   └── tickets/
│   │       ├── tickets.toml             # epics in build order
│   │       └── epic-usage-dashboard/
│   │           ├── epic-usage-dashboard.md
│   │           ├── ux-epic-usage-dashboard/   # Sally's epic UX design
│   │           └── tickets/
│   │               ├── tickets.toml           # stories in build order
│   │               ├── story-show-room-occupancy.md       # refined story file (created by default)
│   │               └── story-show-room-occupancy-plan.md  # build plan and status
│   ├── epic-door-tablet-kiosk/          # standalone single-epic project (no initiative wrapper needed)
│   │   ├── epic-door-tablet-kiosk.md
│   │   └── tickets/
│   └── backlog/
│       └── bug-recurring-booking-shows-twice.md
├── rooms-api/                           # code repo
├── rooms-web/                           # code repo
└── door-tablet/                         # code repo
```

:::caution[Start each build in its code repo]
`bmad-build` runs Git in the folder where you start your chat session, so run planning from the workspace folder and start each coding session inside the specific code repository that story belongs to. BMad walks up parent folders to find `_bmad/` and your shared store automatically.
:::

### 2. Point BMad at your store

Skip this step if you keep the default `_bmad-output/` folder. To choose a different output folder for your project or workspace, run `bmad setup` (or invoke `bmad-customize` and tell it where you want your planning store to live). For the underlying configuration file locations and keys, see [Configuration](../reference/configuration.md).

### 3. Select your active initiative

You do not need to edit config files to switch between initiatives, programs, or standalone epics. Ask the `bmad` skill in chat to show, switch, create, or clear your active initiative anytime:

```text wrap
/bmad switch active initiative to initiative-room-analytics
```

When no active initiative is set yet, Sofia offers to create the folder and select it for you automatically. Your active initiative setting is personal to you and is not committed to your team's repository.

:::tip[One workspace, many projects]
If one parent workspace holds unrelated projects, add a short note to `AGENTS.md` telling coding agents which repositories belong to each initiative so they ignore unrelated folders when you switch active work. See [Configuration](../reference/configuration.md) for how active initiative settings resolve.
:::

## Bring Existing Planning Documents

Planning skills write into the active container's folder, placing each document in its own subfolder. If you are upgrading from an earlier BMad version (including v6 flat planning folders or earlier ticket layouts without `tickets/` subfolders), ask the `bmad` skill to run `bmad migrate method`. It inspects your files, shows a migration plan for your approval, and moves your planning documents, epics, and stories into the current layout cleanly.

If you prefer to copy a few standalone v6 planning documents into an active initiative folder by hand, place them like this:

```text
_bmad-output/planning-artifacts/brief.md         → initiative-check-in/brief-check-in/brief-check-in.md
_bmad-output/planning-artifacts/prd.md           → initiative-check-in/prd-check-in/prd-check-in.md
_bmad-output/planning-artifacts/DESIGN.md        → initiative-check-in/ux-system-check-in/DESIGN.md
_bmad-output/planning-artifacts/EXPERIENCE.md    → initiative-check-in/ux-system-check-in/EXPERIENCE.md
_bmad-output/planning-artifacts/architecture.md  → initiative-check-in/arch-spine-check-in/arch-spine-check-in.md
```

UX designs store `DESIGN.md` and `EXPERIENCE.md` inside their UX run folder (`ux-system-<slug>/` for an initiative or `ux-epic-<slug>/` for an epic). Your original filenames may vary.

## Configure Where Tickets Are Tracked

Out of the box, tickets live as markdown files in your store with zero setup. To publish and mirror tickets in an external issue tracker, ask Sofia:

```text wrap
/bmad-agent-po set up the ticket store
```

Sofia walks you through connecting your tracker and saves the project's tracker settings so they survive future skill updates (see [Configuration](../reference/configuration.md) for where tracker settings are stored).

| Choice | What it means |
| --- | --- |
| Repo | The default. Tickets stay as markdown files in your store with no external account needed. |
| GitHub Issues | Tickets publish as issues, with sub-issues and blocked-by links. |
| Jira | Tickets publish as Jira issues. |
| Linear | Tickets publish as Linear issues. |
| Notion | Tickets publish as rows in a Notion database. |
| Trello | Tickets publish as cards. |

Even with a tracker connected, the markdown files remain the working source for BMad skills while the tracker gives the team visibility. Setup checks authentication, offers to create any needed labels or fields, and verifies the connection with a test ticket. See [Map Your Tracker to the Ticket Tree](../reference/map-your-tracker.md) for how each level and status maps. To change your tracker later:

```text wrap
/bmad-agent-po reconfigure the ticket store
```

:::note[Repo is the default and the most tested]
Storing tickets in the repository is the default and the most thoroughly tested path. External tracker integrations are still maturing, so trying them and sharing feedback on what worked or broke is genuinely helpful.

Automatic webhooks are not built in yet, so your tracker and local ticket files stay in sync when you run Sofia rather than syncing silently in the background.
:::

## Use Sofia

Once your store is ready, talk to Sofia to write requirements, slice epics, and see what is ready next. [Write and Slice the Initiative](./write-and-slice-the-initiative.md) and [Plan an Epic's Stories](./plan-an-epics-stories.md) walk through planning, [Build and Verify](../build/build-and-verify.md) covers building each story, and [The Ticket Tree](../reference/ticket-tree.md) documents the full layout and fields.

When using an external tracker, ask Sofia to start a story before you build so she publishes it if needed and moves its card to In Progress:

```text wrap
/bmad-agent-po start story 1.2
```

Sofia mirrors the tracker's card state separately from the local build plan status so moving a card on a board never tricks a build session into skipping planning.

:::note[Example: the room booker]
In the [room booker](../start/how-bmad-works.md#the-example-app), an office meeting-room app:

**You:**

```text wrap
/bmad-agent-po set up the ticket store
```

**Sofia:** Repo, GitHub Issues, Jira, Linear, Notion, or Trello?

**You:** Jira, project key ROOM.

Once you approve the door check-in epic's stories, Sofia offers to publish them as Jira issues. Before building:

**You:**

```text wrap
/bmad-agent-po start story 1.2
```

**Sofia:** Story 1.2 is ready to start. Published as ROOM-12 and moved to In Progress.

Then start a fresh chat to build it:

```text wrap
/bmad-build 1.2
```

Moving a card on a board never starts coding on its own: you launch each build session, or direct an unattended run as described in [Autonomous Development Loops](../build/autonomous-development-loops.md).
:::

## Tell Us What You Find

Feedback helps improve Sofia and her tracker integrations. The most helpful reports include what input you gave her, what you asked for, what she produced, and what you expected instead. Open a [GitHub issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) with "bmad-agent-po" in the title, or post in [Discord](https://discord.gg/gk8jAdXWmj).
