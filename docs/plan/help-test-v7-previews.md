---
title: 'Help Test v7 Previews'
description: Try proposed BMad v7 planning changes as they arrive — set up an initiative store, configure it, and use the ticketing preview skill.
sidebar:
  order: 8
---

Use this page to try proposed v7 planning changes before they replace anything, and to tell us what works and what does not. Previews ship beside the current skills. Nothing on this page changes how the existing planning path behaves.

:::caution[Not wired into the current flow yet]
Stories written by the ticketing preview are not read by `bmad-sprint-planning`, do not appear in `sprint-status.yaml`, and the current `bmad-build` does not move their status (YET). You can still hand any story file to `bmad-build` to implement it. Until the integration lands, you move the ticket's status yourself through the ticketing skill.
:::

## What Is in Preview

| Skill                    | Purpose                                                                                  | Stands in for                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `bmad-preview-ticketing` | Slices an initiative into epics, plans an epic into stories, refines tickets, runs a board | `bmad-create-epics-and-stories` plus `bmad-sprint-planning` |

A preview skill is an alternative to the skills it stands in for, not a companion. Use one path or the other for a given piece of work. This table grows as more v7 previews arrive.

## Get the Preview

Preview skills ship in the prerelease. Follow [Install the prerelease](../start/install-bmad.md#install-the-prerelease), then check that your AI tool lists `bmad-preview-ticketing`.

:::note[Prerequisites]
The ticketing preview runs its scripts through `uv`. The installer warns when `uv` is missing.
:::

## Create an Initiative Store

The initiative store is the folder where planning lives: one folder per initiative, plus a `backlog/` folder for standalone tickets. An initiative is one body of work, such as a product, a major feature, or a migration. Its planning documents and its tickets sit together in its folder.

### 1. Choose where the store lives

The store is your BMad output folder, `_bmad-output` by default. You can configure it to be any folder; the example below uses `_bmad-initiative-store` instead, and step 2 shows the setting. In a single repo, the default inside the project works fine.

When the work spans several repos, install BMad in the workspace folder that holds them and put the store there too. Start your AI tool from that workspace folder, so one session can reach the plan and every repo it touches. Give the store its own `git init`, which keeps planning history apart from each repo's code history.

```
shop-workspace/                          # start your AI tool here; not a repo itself
├── _bmad/                               # BMad install and configuration
├── _bmad-initiative-store/              # the store — its own git repo
│   ├── initiative-checkout/
│   │   ├── initiative-checkout.md
│   │   ├── prd-checkout/
│   │   │   └── prd-checkout.md
│   │   └── epic-cart-rules/
│   │       ├── epic-cart-rules.md
│   │       ├── story-01-cart-service-scaffold.md
│   │       └── story-02-cart-ui-shell.md
│   ├── initiative-loyalty-program/
│   └── backlog/
│       └── bug-01-checkout-total-ignores-discount-codes.md
├── shop-api/                            # code repo
├── shop-web/                            # code repo
└── shop-mobile/                         # code repo
```

### 2. Point BMad at it

Skip this step when you keep the default. Otherwise set `output_folder` in `_bmad/custom/config.toml`, which is committed and applies to the whole team:

```toml
[core]
output_folder = "{project-root}/_bmad-initiative-store"
```

`{project-root}` is the folder that holds `_bmad/`. In the layout above, that is `shop-workspace/`.

### 3. Name the active initiative

Set the initiative you are working on in `_bmad/custom/config.user.toml`, which is personal and not committed:

```toml
[modules.bmm]
active_initiative = "initiative-checkout"
```

The value is the initiative's folder name in the store. When it is unset, the ticketing skill offers to create the folder and record the setting for you. Setting it first avoids the question. Change it whenever you switch initiatives.

:::tip[One workspace, many projects]
If one workspace holds unrelated projects, tell your coding agent to follow the active initiative. Put a short rule in `AGENTS.md`, or whatever instruction file your tool reads, that names the setting and says which folders belong to which initiative:

```md
`active_initiative` in `_bmad/custom/config.user.toml` says what we are working on.

## If the active initiative contains `checkout`

Read `docs/shop.md` for how the shop repos fit together and how to run them.

## Otherwise

Ignore the `shop-*` repos and do not read `docs/shop.md` unless I ask.
```

The agent then stays out of repos that have nothing to do with the current work, and you switch its focus by changing one setting.
:::

## Bring Existing Planning Documents

If you already have a brief, PRD, UX design, or architecture, copy them into the initiative folder. The current skills each write to their own folder. The store keeps everything for one initiative together, each document as `<type>-<slug>/<type>-<slug>.md`:

```
_bmad-output/planning-artifacts/brief.md         → initiative-checkout/brief-checkout/brief-checkout.md
_bmad-output/planning-artifacts/prd.md           → initiative-checkout/prd-checkout/prd-checkout.md
_bmad-output/planning-artifacts/DESIGN.md        → initiative-checkout/ux-checkout/DESIGN.md
_bmad-output/planning-artifacts/EXPERIENCE.md    → initiative-checkout/ux-checkout/EXPERIENCE.md
_bmad-output/planning-artifacts/architecture.md  → initiative-checkout/architecture-checkout/architecture-checkout.md
```

UX is the exception to the naming: `bmad-ux` writes two peer documents, `DESIGN.md` and `EXPERIENCE.md`, and both keep their names inside the `ux-<slug>` folder. Your source paths will differ. Copy rather than move, so the current skills still find their files.

## Configure Where Tickets Are Tracked

The first time you use the ticketing skill, it asks where tickets are tracked and writes your choice to `_bmad/custom/ticketing-store-config.toml`. That file is yours to edit, and edits survive skill updates.

| Choice        | What it means                                                                        |
| ------------- | ------------------------------------------------------------------------------------ |
| Repo          | The default. Tickets are markdown files in the store. No account needed.             |
| GitHub Issues | Tickets publish as issues, with sub-issues and blocked-by relations.                 |
| Jira          | Tickets publish as Jira issues.                                                      |
| Linear        | Tickets publish as Linear issues.                                                    |
| Notion        | Tickets publish as rows in a Notion database.                                        |
| Trello        | Tickets publish as cards.                                                            |

With a tracker, the markdown files remain the working copy and the tracker is where the team sees them. Setup offers to connect the tool, create the labels or fields it needs, and prove the connection with a test ticket. Say "reconfigure the ticket store" to change it later.

:::note[Repo is the default, and the most tested]
Repo is the default and the choice that has been tested most. The tracker options still need a lot of testing. If you use one of those trackers, trying it and reporting what happens is some of the most useful help you can give, and all feedback is welcome.

Hooks are not integrated yet, so nothing syncs on its own: a tracker and the ticket files are brought in line only when you run the skill. Hooks may be added later.
:::

## Use the Ticketing Skill

The skill turns intent into tickets a coding agent can build from, at three levels. An initiative holds epics. An epic holds stories, spikes, and bugs. An initiative or an epic is itself the specification at its level: it holds the requirements, and its children are cut from them.

It takes almost any input. The best input is a `bmad-spec` output together with the documents that produced it. A PRD alone, meeting notes, or a one-paragraph idea also work.

| Say                                      | What happens                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| "Split this initiative into epics"       | Proposes epic boundaries from your source and records the agreed order in the initiative.   |
| "Incept the first epic"                  | Plans the whole epic with you into an ordered breakdown of stories and spikes.              |
| "What's next?"                           | Lists what is ready to refine, ready to start, in progress, and blocked.                    |
| "Refine story 02"                        | Writes the full acceptance criteria for a story you are about to build.                     |
| "File a bug: checkout ignores discounts" | Writes one ticket straight into `backlog/`, with no epic needed.                            |

Planning an epic lists every story, but only the stories that can start now become files. Those files begin thin: what the story contributes and how it will be verified. Full acceptance criteria are written when you pull a story to work on it, so detail is not written months before it is used.

## Hand a Story to Build

:::caution[Refine the story before you build it]
A new story file is thin on purpose. It has no full acceptance criteria yet, so it is not ready for `bmad-build`. You must refine it with the ticketing skill first:

- `/bmad-preview-ticketing refine story 02`
- `/bmad-preview-ticketing refine the next unrefined story`

A refined story has `refined: true` at the top of its file. In the future `bmad-build` will offer to refine a thin story itself. During this preview it does not, and building from a thin story gives it too little to work from.
:::

Once the story is refined, give its file to `bmad-build`, for example "build story-02-cart-ui-shell.md". Build treats the file as its work item.

Build does not update the ticket. Before you start, say "start story 02" to the ticketing skill, and when the work is finished say "mark story 02 done". On the repo store those are edits to the story file that you commit with your work.

## Tell Us What You Find

Preview feedback decides what ships in v7. The most useful reports say what you gave the skill, what you asked for, what it produced, and what you expected instead. Open a [GitHub issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) with "v7 preview" in the title, or post in [Discord](https://discord.gg/gk8jAdXWmj).
