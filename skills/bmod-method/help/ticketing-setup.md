# Setting up and using the ticketing preview

Use this when a user asks how to set up or drive `bmad-preview-ticketing`. For the design and the comparison with the epics route, see `help/ticketing-and-epics.md`.

## Where the store lives

- Tickets are markdown files under `root` in `_bmad/custom/ticketing-store-config.toml`. `root` defaults to `{output_folder}`, which is `_bmad-output` unless changed.
- To move the store, set `output_folder` under `[core]` in `_bmad/custom/config.toml` (committed, applies to the team), or edit `root` in the store config.
- `active_initiative` under `[modules.bmm]` in `_bmad/custom/config.user.toml` (personal, not committed) names the initiative folder in use. Unset, the skill offers to create and record it. Change it to switch initiatives.

## Several repos

Install BMad in the workspace folder that holds the repos, put the store there, and start the AI tool from that folder so one session reaches the plan and every repo. Give a new store folder its own `git init`.

## Existing planning documents

Copy a brief, PRD, UX design, or architecture into the initiative folder as `<type>-<slug>/<type>-<slug>.md`, for example `initiative-checkout/prd-checkout/prd-checkout.md`. The UX files keep their names, `DESIGN.md` and `EXPERIENCE.md`, inside `ux-<slug>/`. Copy, do not move, so other skills still find their files. The best input is a `bmad-spec` output with its source documents.

## Trackers

- First use asks where tickets are tracked and copies a starter to the store config. "Reconfigure the ticket store" changes it later.
- Choices: repo (the default; files under version control, no account), GitHub Issues, Jira, Linear, Notion, or Trello. The skill checks the needed CLI or connection at setup.
- Repo is the most tested. The trackers are lightly tested.
- With a tracker, the markdown files stay the working copy. Nothing syncs on its own: files and tracker line up only when the user runs the skill. The skill never pushes.

## What the user says

| Say | Result |
|---|---|
| "Split this initiative into epics" | Proposes epic boundaries and records the agreed order. |
| "Incept the first epic" | Plans the whole epic into ordered stories and spikes. |
| "Refine story 02" | Writes the full acceptance criteria. |
| "File a bug: ..." | One ticket straight into `backlog/`, with no epic. |
| "What's ready?", "what's next?" | Lists what is ready, in progress, and blocked. |
| "Start story 02", "mark story 02 done" | Moves status. |
| "Publish the tickets" | Sends tickets to the tracker. By default each publishes when pulled. |

## Hand-off to bmad-build

- A new story is thin (`refined: false`) and not ready to build. The user refines it first; `bmad-build` does not.
- Once the file shows `refined: true`, give it to `bmad-build`: "build story-02-cart-ui-shell.md".
- `bmad-build` does not move ticket status. The user says "start story 02" before and "mark story 02 done" after.
- `bmad-sprint-planning` does not read these stories.

## Feedback

Open an issue at github.com/bmad-code-org/BMAD-METHOD with "v7 preview" in the title, or post in the BMad Discord. Useful reports say what was given, asked, produced, and expected.
