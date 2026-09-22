# Setting up and using the ticketing preview

Use this when a user asks how to set up or drive `bmad-preview-ticketing`. For the design and the comparison with the epics route, see `help/ticketing-and-epics.md`.

## Where the store lives

- Tickets are markdown files under `root` in `_bmad/custom/ticketing-store-config.toml`. `root` defaults to `{output_folder}`, which is `_bmad-output` unless changed.
- To move the store, set `output_folder` under `[core]` in `_bmad/custom/config.toml` (committed, applies to the team), or edit `root` in the store config.
- `active_initiative` under `[modules.bmm]` in `_bmad/custom/config.user.toml` (personal, not committed) names the initiative folder in use. Unset, the skill offers to create and record it. Change it to switch initiatives.

## Several repos

Install BMad in the workspace folder that holds the repos, put the store there, and start the AI tool from that folder so one session reaches the plan and every repo. Give a new store folder its own `git init`.

## Existing planning documents

Copy a brief, PRD, UX design, or architecture into the initiative folder as `<type>-<slug>/<type>-<slug>.md`, for example `initiative-checkout/prd-checkout/prd-checkout.md`. The UX files keep their names, `DESIGN.md` and `EXPERIENCE.md`, inside `ux-<slug>/`. Copy, do not move, so other skills still find their files. The best input is a `bmad-spec` output with its source documents. `bmad-spec` offers to hand its spec folder to this skill, which does the story breakdown; the stories cite the spec's `CAP-N` ids.

## Trackers

- First use asks where tickets are tracked and copies a starter to the store config. "Reconfigure the ticket store" changes it later.
- Choices: repo (the default; files under version control, no account), GitHub Issues, Jira, Linear, Notion, or Trello. The skill checks the needed CLI or connection at setup.
- Repo is the most tested. The trackers are lightly tested.
- With a tracker, the markdown files stay the working copy. Nothing syncs on its own: files and tracker line up only when the user runs the skill. The skill never pushes.

## What the user says

| Say | Result |
|---|---|
| "Split this initiative into epics" | Proposes epic boundaries and records the agreed order in the initiative's `tickets.toml`. |
| "Incept the first epic" | Plans the whole epic into entries in the epic's `tickets.toml`, in build order, each with an `id` that names it under the epic. No story file is written yet. |
| "Pull the next story" | Writes the story file from its entry, ending with an empty `## Plan` for the coding agent. A script does it, with no conversation. |
| "Refine story 2", "review the stories" | Pulls the story's file if it has none, then reviews and improves it with the user. Full acceptance criteria are written only for a bug, a ticket with no epic, or when the user asks. |
| "File a bug: ..." | One ticket straight into `backlog/`, with no epic. |
| "What's ready?", "what's next?" | Lists what is ready to pull, ready to refine, ready to start, in progress, and blocked, for one epic or the whole initiative. |
| "Start story 2", "mark story 2 done" | Writes the ticket file's `status` by hand, for a ticket a person works or until `bmad-build` writes it. |
| "Publish the tickets" | Sends tickets to the tracker. By default, with a tracker the whole breakdown publishes at inception; on the repo store each ticket publishes when pulled. |

## Hand-off to bmad-build

- A planned story has no file until it is pulled.
- Give the pulled file to `bmad-build` with its epic: "build story-cart-ui-shell.md". The builder plans the story's acceptance criteria from the epic's Requirements and Done when, the entry's description, and its `Verify:` check.
- A story needs no refining before `bmad-build`; the build refines it. Before an unattended run, review the stories with this skill. A bug, a ticket with no epic, and an entry the user marked `refine = true` get full criteria first; "what's next?" lists these under ready to refine.
- A ticket file's `status` belongs to the build, and `bmad-build` does not write it yet. Until it does, the user says "start story 2" before and "mark story 2 done" after.
- `bmad-sprint-planning` does not read these stories.

## Feedback

Open an issue at github.com/bmad-code-org/BMAD-METHOD with "v7 preview" in the title, or post in the BMad Discord. Useful reports say what was given, asked, produced, and expected.
