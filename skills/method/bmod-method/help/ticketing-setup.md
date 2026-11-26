# Setting up and driving the ticket tree with Sofia

Use this when a user asks how to set up or drive the ticket tree with Sofia (`bmad-agent-po`). For the shared layout and file roles, see `help/ticketing-and-epics.md`.

## Where the store lives

- `core.active_initiative` under `core.output_folder` (`_bmad-output` by default, configurable in `_bmad/custom/config.toml`) accepts any fractal container root (`program-*`, `initiative-*`, `epic-*`, or a nested path like `program-shop/tickets/initiative-checkout`). Standalone one-offs go in `{output_folder}/backlog/`.
- Epic stories live as crisp 1–2 sentence `[[entry]]` items in `tickets/tickets.toml` alongside Refined Story files (`story-<slug>.md`, authored at epic inception by default or at pickup if left thin).

## Several repos

Install BMad in the workspace folder holding all repositories and launch your AI tool from there so one session reaches the store and every repo (`help/monorepo-and-polyrepo.md`). Give a new store folder its own `git init`.

## Existing planning documents

Place or run briefs, PRDs, UX (`DESIGN.md`, `EXPERIENCE.md`, mockups), and architecture docs as `<type>-<slug>/` folders inside the container they belong to (`<epic>/ux-epic-<slug>/` for epic runs). `tickets.py status` reports unadopted runs in one pass so Sofia reconciles them into `companions:` / `sources:` and surfaces contradictions without dropping anything.

## Trackers

- The repo store (versioned Markdown + `tickets.toml`) is the default and most tested; external trackers (GitHub Issues, Jira, Linear, Notion, Trello) are configured via `"set up the ticket store"` into `_bmad/custom/ticketing-store-config.toml` and remain lightly tested.
- With a tracker, Markdown files stay the working copy and sync only when the user asks Sofia (`"Publish the tickets"`). Sofia never pushes git branches.

## What the user says

| Say | Result |
|---|---|
| "Split this initiative into epics" | Adopts PRD Epic Map verbatim (or proposes cohesive capabilities) in `tickets/tickets.toml`, writing thin `epic-<slug>.md` files (`refined: false`). |
| "Refine the booking epic" | Evaluates open questions: recommends a fresh chat with John (`prd-epic`) if product discovery is open, else fills the epic SOT directly; offers fresh-chat Sally (`ux-epic`) and Winston (`arch-epic`) when UI or shared contracts apply. |
| "Plan the first epic's stories" | Slices journey-shaped chunky stories into `tickets.toml` (with `DESIGN.md` / `EXPERIENCE.md#<section>` / mockup / `AD-n` refs) and drafts Refined Stories (`story-<slug>.md`) by default. |
| "Refine story 1.2", "review the stories" | Pulls or updates `story-<slug>.md` with functional + measurement Given/When/Then ACs and verifies coverage against the epic. |
| "File a bug: ..." | Creates a standalone ticket directly in `{output_folder}/backlog/`. |
| "What's ready?", "what's next?" | Reports `ready_to_refine`, `ready_to_start`, `in_progress`, and `blocked` across the active container (rolling up programs recursively). |
| "Start story 1.2" | Confirms readiness; on external trackers publishes if needed and marks in progress; on the repo store hands off to `bmad-build`. |
| "Mark story 1.2 done" | Updates `status` in the story's plan via `tickets.py mark`; `done` is always marked by the human or orchestrator. |
| "Publish the tickets" | Pulls any missing story files first, then pushes to the configured tracker (either all on approval or `on_start`). |

## Hand-off to bmad-build

- Start a fresh chat and run `bmad-build` on `"build story 1.2"`. Amelia reads the Refined Story (or entry), its epic file, and relevant UX/architecture `companions:` (`DESIGN.md`, `EXPERIENCE.md#<section>`, mockups, `contract.yaml` listed in plan `context:`), walking `parent:` upward only when the epic defers something.
- `bmad-build` cites Refined Story ACs verbatim inside `<frozen-after-approval>`, keeps its ephemeral task breakdown in `story-<slug>-plan.md` beside `tickets.toml`, and advances `status` as far as `built`.

## Feedback

Open an issue at `github.com/bmad-code-org/BMAD-METHOD` with `"bmad-agent-po"` in the title, or post in the BMad Discord with what was given, asked, produced, and expected.
