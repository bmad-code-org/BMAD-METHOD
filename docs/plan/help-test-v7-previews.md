---
title: 'Help Test v7 Previews'
description: Try proposed BMad v7 planning changes as they arrive — set up an initiative store, configure it, and use the ticketing preview skill.
sidebar:
  order: 8
---

Use this page to try proposed v7 planning changes before they replace anything, and to tell us what works and what does not. Previews ship beside the current skills. Nothing on this page changes how the existing planning path behaves.

:::caution[Not wired into the current flow yet]
Stories written by the ticketing preview are not read by `bmad-sprint-planning`, do not appear in `sprint-status.yaml`, and the current `bmad-build` does not move their status (YET). You can still hand any story file to `bmad-build` to implement it. Until the integration lands, you move the ticket's status yourself through the ticketing skill. `bmad-retrospective` and unattended loops such as bmad-loop do not read `tickets.toml` yet.

While ticketing is in preview, `bmad-create-epics-and-stories` with `bmad-sprint-planning` remains the supported path and works as before. Use it when you need sprint status, the retrospective, or an unattended loop today.
:::

## What Is in Preview

| Skill                    | Purpose                                                                                  | Stands in for                                                  |
| ------------------------ | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `bmad-preview-ticketing` | Slices an initiative into epics, plans an epic into stories, refines tickets, runs a board | `bmad-create-epics-and-stories` plus `bmad-sprint-planning` |

A preview skill is an alternative to the skills it stands in for, not a companion. Use one path or the other for a given piece of work. This table grows as more v7 previews arrive.

## Get the Preview

Preview skills install with the skills CLI. `npx bmad-method install`, with or without `@next`, does not install them. Run this in your project:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill bmad --skill bmod-method --skill bmad-preview-ticketing
```

Add `--skill bmad-build` and any other skill you want in the same command. Then open your AI tool in the project, ask the `bmad` skill to run `bmad setup`, and check that the tool lists `bmad-preview-ticketing`. Update later with `npx skills update`.

:::note[Prerequisites]
You need Node.js with npm, Git, and [uv](https://docs.astral.sh/uv/). BMad setup and the ticketing scripts run through `uv`.
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
│   │   ├── tickets.toml               # the epics in build order
│   │   ├── prd-checkout/
│   │   │   └── prd-checkout.md
│   │   └── epic-cart-rules/
│   │       ├── epic-cart-rules.md
│   │       ├── tickets.toml           # every planned story, pulled or not
│   │       ├── story-cart-service-scaffold.md
│   │       └── story-cart-ui-shell.md
│   ├── initiative-loyalty-program/
│   └── backlog/
│       └── bug-checkout-total-ignores-discount-codes.md
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

It takes almost any input. The best input is a `bmad-spec` output together with the documents that produced it. Give it the spec folder and it plans one epic whose stories cite the spec's `CAP-N` ids. A PRD alone, meeting notes, or a one-paragraph idea also work.

| Say                                      | What happens                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| "Split this initiative into epics"       | Proposes epic boundaries from your source and records the agreed order in `tickets.toml`.   |
| "Incept the first epic"                  | Plans the whole epic with you into an ordered breakdown of stories.                         |
| "What's next?"                           | Lists what is ready to pull, refine, or start, in progress, and blocked.                    |
| "Pull the next story"                    | Writes the story's file from its entry in the breakdown.                                    |
| "Review the stories"                     | Pulls each story's file if needed, then reviews and improves it with you: description, check, references, order, and prerequisites. |
| "File a bug: checkout ignores discounts" | Writes one ticket straight into `backlog/`, with no epic needed.                            |

Each initiative and epic keeps its plan in a `tickets.toml` file beside its ticket file. The initiative's file lists the epics in build order. An epic's file lists every planned story and bug as an entry, in build order, each with an `id` that names it under the epic: what it delivers, how it will be verified, what it waits on (`after`), and what is still uncertain. When something must be settled before implementation, the skill asks you to answer it or records it as the entry's `unknown`. It adds a spike when you ask for one. By default the last entry is a "Refactor sweep" story for cleanup found during the epic.

An entry has no file until you pull it. Pulling writes the story file, and from then on the file is truth: refining edits the file, and the entry keeps only the story's `id`, `type`, `title`, prerequisites (`after`, edited in both places), and `hitl`. The file ends with an empty `## Plan` section. It belongs to the coding agent and is never sent to a tracker; it is where the builder's plan will live once `bmad-build` reads ticket files as its spec. Today it does not, so the section stays empty. `bmad-build` plans the story's acceptance criteria when it builds, from the epic and the entry, so detail is not written months before it is used.

A story's `after` can name a story in another epic, or a whole epic. Ask "what's next?" about the initiative to see every epic at once.

### How epics are cut

An epic is one capability that one owner delivers to production. A module, service, or bounded context can be an epic when it is also the ownership or deployment boundary. A unit the work only consumes or configures gets no epic. It is a touch point, named in the initiative's Boundaries with the epic that owns the work there. If your team cuts epics by its own rule, tell the skill and it offers to save the rule to `_bmad/custom/bmad-preview-ticketing.toml`.

After the epics are agreed, the skill lists the decisions that more than one epic must adopt, such as a contract, a data format, or a shared value list. It offers `bmad-architecture` to settle them in the architecture spine. If you decline, each becomes a story in the opening epic that the other epics wait on. Work in one repo or one unit needs no architecture pass. It is needed from the second unit that must adopt a decision.

When your source contradicts the code, the skill records a `Source conflict:` line in the Notes of the initiative or epic and tells you. When the source is a BMad spec, it offers to pass the correction to `bmad-spec`.

## Hand a Story to Build

Give the pulled story file to `bmad-build` with its epic, for example "build story-cart-ui-shell.md". Build treats the file as its work item. It plans the story's acceptance criteria from the epic's Requirements and Done when, the entry's description, and its `Verify:` check.

:::note[Refining is optional]
A story needs no refining before `bmad-build`. Build refines it as part of the build: it questions you and writes the acceptance criteria itself. If you will build unattended, with `bmad-build-auto`, a loop, or a factory, nobody answers questions during the build, so review the sequence and each story with the ticketing skill first. The ticketing skill writes full acceptance criteria only for a bug, a ticket with no epic, or when you ask.
:::

The ticket file's `status` belongs to build, but build does not write it yet. Until it does, say "start story 2" to the ticketing skill before you start, and "mark story 2 done" when the work is finished. On the repo store those are edits to the story file that you commit with your work. With a tracker, the tracker's status is read into the file as `tracker_status` beside `status`, so moving a card on the board never makes build skip planning.

## Tell Us What You Find

Preview feedback decides what ships in v7. The most useful reports say what you gave the skill, what you asked for, what it produced, and what you expected instead. Open a [GitHub issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) with "v7 preview" in the title, or post in [Discord](https://discord.gg/gk8jAdXWmj).
