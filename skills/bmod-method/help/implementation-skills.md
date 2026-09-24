# Implementation skills in detail

Read this when the question is about `bmad-build`, `bmad-build-auto`, or `bmad-correct-course`. For running stories without a human, see `help/unattended-builds.md`.

**`bmad-build`** — one session of delivery: clarifies intent, plans, implements, reviews, and presents a commit.
- Takes: free text however brief; a ticket from the tree, named by a ref such as `1.2`, its file, or its title; nothing, for the next ready ticket of the active initiative; a plan to resume; any other file as intent; or the recent conversation.
- Pick when: any feature, story, bug fix, or meaningful change. It is the default, and risky or foundational stories belong here because a human approves the plan.
- Not when: typo-level or config edits, or edits the user is directing line by line.
- Size: one session is one goal, roughly 500 changed lines, not counting tests, in a handful of files. Start it in a fresh chat.
- Its review: built in and done by agents. By default a small change gets a quick review with one lens and a full change gets a thorough review with four independent lenses. The user can say `none`, `quick`, or `thorough` in the request. It fixes clear findings itself and returns to the human when intent is in doubt. It commits and never pushes.
- Writes: a ticket's plan beside `tickets.toml`, or in `backlog/` for a backlog ticket, at the path `tickets.py find` returns, with `ticket` and a `status` it moves as far as `built`; the user marks the ticket done. Other work gets `{implementation_artifacts}/plan-{slug}.md`. Deferred goals go in `{implementation_artifacts}/deferred-work.md`.

**`bmad-build-auto`** — one unattended build of one ticket, for a loop or script that dispatches it.
- Do not offer it for attended work. It never asks: anything unclear halts it as `blocked` with a named reason written into the plan. It needs subagents. Its input is a ticket from the tree, one run per ticket; free text or an intent file also work. Where version control is present it also needs a clean working tree on a branch that fits the work.
- Fits when: decisions and patterns are stable and the tickets are well specified.
- Writes: the same plans as `bmad-build`.

**`bmad-correct-course`** — assesses a significant midstream change on the epics route.
- Gives: a change proposal covering impact across PRD, epics, architecture, and UX; a recommended path (adjust, roll back, or cut scope); and proposed edits. It drafts the edits to the PRD, epics, architecture, and UX and does not apply them: the user applies those through the owning skills. After approval it updates `sprint-status.yaml` itself for added, removed, or renumbered epics and stories.
- Pick when: a story exposes something that reaches across artifacts, such as a technical limit, a new or misread requirement, a pivot, or a failed approach.
- Not when: there is no PRD or no epics (it halts). On the spec route → update the spec with `bmad-spec`. On the ticketing route → re-slice in `bmad-preview-ticketing`.
- Writes: `{planning_artifacts}/sprint-change-proposal-{date}.md`.
