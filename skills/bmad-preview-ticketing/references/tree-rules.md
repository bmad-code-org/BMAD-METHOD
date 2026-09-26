# Rules for skills that use the ticket tree

Every skill that takes work from the tree, builds it, reviews it, or looks back on it follows these rules: the ticketing skill, `bmad-build`, `bmad-build-auto`, `bmad-code-review`, `bmad-retrospective`, and `bmad migrate`.

## Finding the tree

- The tree is `{tickets.root}/{active_initiative}`: `root` from `[tickets]` in `_bmad/custom/ticketing-store-config.toml` with `{output_folder}` substituted, and `active_initiative` from `[modules.bmm]` in the BMad config.
- `tickets.py` is installed at `{project-root}/_bmad/method/scripts/tickets.py`. The ticketing skill declares it in its `bmod.toml`. Other skills run it from there and never open the ticketing skill's folder.
- Called with no folder, `tickets.py next`, `status`, and `find` resolve the active initiative themselves. When no initiative is set, they exit with an error that names the missing key, and the calling skill works without the tree.
- A ticket is read through `tickets.py find`: its entry's fields, its epic file, its story file when one was refined, and its plan path, whether or not the plan exists yet. The build's input is the entry and its epic, plus the story file when there is one. No skill writes a ticket file to start work.

## The plan file

- One plan per leaf, written by `bmad-build` or `bmad-build-auto`. It sits in the leaf's folder (the epic folder, or `backlog/`) and is named `<type>-<slug>-plan.md`, where `<type>-<slug>` is the name the leaf's file would have. `find` returns this path.
- Its frontmatter carries `ticket: <entry id>`. That field joins the plan to its entry, so a title change that renames the plan never breaks the link. A backlog leaf has a file and no entry, so its plan carries `ticket: <file stem>` instead. Its `type` is the build's (`feature`, `bugfix`, `refactor`, `chore`), never a ticket type.
- It stays local on every store. A tracker never receives it.
- On a tracker store, publishing writes the leaf's file, because that file is the body the tracker receives. `tracker_id`, `remote`, and `tracker_status` stay in that file. The plan is still a separate file beside it.

## Status

- On the repo store, a leaf's status lives in its plan's `status`. An older leaf file can still carry `status`; `tickets.py` reads it only when there is no plan. An entry with no file and no plan is `planned`, and it is ready to start once its prerequisites are done or in review; an epic file's `after` still waits for that epic to be done. No pull is needed.
- The board state comes from `status`: none, `draft`, `ready-for-dev` → `backlog`; `in-progress`, `blocked` → `in-progress`; `in-review`, `built` → `review`; `done` and `dropped` are themselves.
- `assignee`, `blocked_at`, and `blocked_reason` also sit in the plan's frontmatter. `tickets.py mark` writes them. Given a leaf with no plan, it creates the plan with only its frontmatter.

| Status | Written by |
|---|---|
| `draft`, `ready-for-dev`, `in-progress`, `in-review`, `built` | `bmad-build`, `bmad-build-auto` as they work |
| `blocked` | `bmad-build-auto` when it halts, with the reason in the plan |
| `done` | the user, or an orchestrator, through `tickets.py mark` |
| `dropped` | the ticketing skill, when the user says so |

- No skill moves a ticket past `built`: the build's last status, meaning the build finished and nobody has called it done. When the user tells a skill that a ticket is done, the skill runs `mark` for them. `bmad-code-review` never changes `status`.

## Baseline

- Before any code change, the build records `baseline_revision` in the plan: the commit the work starts from. It keeps an existing value when it resumes. The field is called `baseline_revision` in both build skills.
- Code review diffs from `baseline_revision`. The retrospective reads it to find each ticket's changes.

## Where review and retrospective write

- `bmad-code-review` appends a `## Code Review` section to the reviewed ticket's plan. Each run adds a dated block with that run's findings. Deferred findings go into the same block.
- `bmad-retrospective` writes `epic-<slug>-retrospective.md` in the epic folder, with `verdict` in its frontmatter. It does not edit the epic file. Closing the epic is still the ticketing skill's closure check, confirmed by the user.
