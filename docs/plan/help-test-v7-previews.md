---
title: 'Set Up the Ticket Tree'
description: Try proposed BMad v7 planning changes as they arrive — set up an initiative store, configure it, and use the ticketing preview skill.
sidebar:
  order: 8
---

Use `bmad-preview-ticketing` to plan and track work in the shared ticket tree. Build, Build Auto, code review, and retrospective consume that tree. The skill keeps its preview name while tracker integrations continue to mature.

## Install the Skills

Preview skills install with the skills CLI. `npx bmad-method install`, with or without `@next`, does not install them. Run this in your project:

```bash
npx skills add bmad-code-org/BMAD-METHOD --skill bmad --skill bmod-core-tools --skill bmod-method --skill bmad-preview-ticketing
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
│   │       ├── tickets.toml           # every planned story, in build order
│   │       ├── story-cart-service-scaffold-plan.md  # the build's plan, with the story's status
│   │       └── story-cart-ui-shell.md               # a story's file, only when refined or published
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

UX is the exception to the naming: `bmad-ux` writes two peer documents, `DESIGN.md` and `EXPERIENCE.md`, and both keep their names inside the `ux-<slug>` folder. Your source paths will differ.

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
| "What's next?"                           | Lists what is ready to refine or start, in progress, and blocked.                           |
| "Review the stories"                     | Writes each story's file from its entry if needed, then reviews and improves it with you: description, check, references, order, and prerequisites. |
| "File a bug: checkout ignores discounts" | Writes one ticket straight into `backlog/`, with no epic needed.                            |

Each initiative and epic keeps its breakdown in a `tickets.toml` file beside its ticket file. The initiative's file lists the epics in build order. An epic's file lists every planned story and bug as an entry, in build order, each with an `id` that names it under the epic: what it delivers, how it will be verified, what it waits on (`after`), and what is still uncertain. When something must be settled before implementation, the skill asks you to answer it or records it as the entry's `unknown`. It adds a spike when you ask for one. By default the last entry is a "Refactor sweep" story for cleanup found during the epic.

An entry needs no file to be built. `bmad-build` plans the story's acceptance criteria when it builds, from the epic and the entry, so detail is not written months before it is used. It writes that plan beside `tickets.toml`, as `story-<slug>-plan.md`, and the plan is never sent to a tracker. A story gets its own file only when you refine it or publish it to a tracker. From then on the file is truth: refining edits the file, and the entry keeps only the story's `id`, `type`, `title`, prerequisites (`after`, edited in both places), and `hitl`.

A story's `after` can name a story in another epic, or a whole epic. Ask "what's next?" about the initiative to see every epic at once.

### How epics are cut

An epic is one capability that one owner delivers to production. A module, service, or bounded context can be an epic when it is also the ownership or deployment boundary. A unit the work only consumes or configures gets no epic. It is a touch point, named in the initiative's Boundaries with the epic that owns the work there. If your team cuts epics by its own rule, tell the skill and it offers to save the rule to `_bmad/custom/bmad-preview-ticketing.toml`.

After the epics are agreed, the skill lists the decisions that more than one epic must adopt, such as a contract, a data format, or a shared value list. It offers `bmad-architecture` to settle them in the architecture spine. If you decline, each becomes a story in the opening epic that the other epics wait on. Work in one repo or one unit needs no architecture pass. It is needed from the second unit that must adopt a decision.

When your source contradicts the code, the skill records a `Source conflict:` line in the Notes of the initiative or epic and tells you. When the source is a BMad spec, it offers to pass the correction to `bmad-spec`.

## Hand a Story to Build

Name the story to `bmad-build`, for example "build story 1.2" for the second story of the first epic. There is no file to write first. Build reads the story's entry and its epic, plus the story file when you refined one. It plans the story's acceptance criteria from the epic's Requirements and Done when, the entry's description, and its `Verify:` check.

:::note[Refining is optional]
A story needs no refining before `bmad-build`. Build refines it as part of the build: it questions you and writes the acceptance criteria itself. If you will build unattended, with `bmad-build-auto`, a loop, or a factory, nobody answers questions during the build, so review the sequence and each story with the ticketing skill first. The ticketing skill writes full acceptance criteria only for a bug, a ticket with no epic, or when you ask.
:::

The story's `status` lives in the build's plan. Build moves it as it works and stops at `built`; only you, or an orchestrator, mark a story done. When you have checked the work, say "mark story 1.2 done" to the ticketing skill. On the repo store that is an edit to the plan that you commit with your work. With a tracker, say "start story 1.2" before you build, so the ticket publishes if it has not and its card moves to in progress. The tracker's status is read into the story's file as `tracker_status`, so moving a card on the board never makes build skip planning.

## Tell Us What You Find

Feedback helps improve the ticketing integrations. The most useful reports say what you gave the skill, what you asked for, what it produced, and what you expected instead. Open a [GitHub issue](https://github.com/bmad-code-org/BMAD-METHOD/issues) with "v7 preview" in the title, or post in [Discord](https://discord.gg/gk8jAdXWmj).
