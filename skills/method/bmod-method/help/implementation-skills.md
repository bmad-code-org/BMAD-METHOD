# Implementation skills in detail

Read this when the question is about `bmad-build` or `bmad-build-auto`. For running stories without a human, see `help/unattended-builds.md`.

**`bmad-build`** — one session of delivery: clarifies intent, plans, implements, reviews, and presents a commit.
- Takes: free text however brief; a ticket from the tree, named by a ref such as `1.2`, its file, or its title; nothing, for the next ready ticket of the active initiative; a plan to resume; any other file as intent; or the recent conversation. With a ticket it reads the entry, its epic file and any story file in full, and opens a companion only where the ticket points; the PRD and UX are not build input.
- Pick when: any feature, story, bug fix, or meaningful change. It is the default, and risky or foundational stories belong here because a human approves the plan.
- Not when: typo-level or config edits, or edits the user is directing line by line.
- Size: one session is one goal, roughly 500 changed lines, not counting tests, in a handful of files. Start it in a fresh chat.
- Its review: built in and done by agents. By default it runs a quick review with one lens; a thorough review runs four independent lenses. The user can say `none`, `quick`, or `thorough` in the request; `thorough` suits a change that is unusually risky or makes many design decisions. It fixes clear findings itself and returns to the human when intent is in doubt. It commits and never pushes.
- Writes: a ticket's plan beside `tickets.toml`, or in `backlog/` for a backlog ticket, at the path `tickets.py find` returns, with `ticket` and a `status` it moves as far as `built`; the user marks the ticket done. Other work gets `{output_folder}/{active_initiative}/plan-<slug>.md`. Deferred goals go in `{output_folder}/{active_initiative}/deferred-work.md`. With no initiative active, both go in `{output_folder}/`.

**`bmad-build-auto`** — one unattended build of one ticket, for a loop or script that dispatches it.
- Do not offer it for attended work. It never asks: anything unclear halts it as `blocked` with a named reason written into the plan. It needs subagents. Its input is a ticket from the tree, one run per ticket; free text or an intent file also work. Where version control is present it also needs a clean working tree on a branch that fits the work.
- Fits when: decisions and patterns are stable and the tickets are well specified.
- Writes: the same plans as `bmad-build`.

A significant midstream change, such as a technical limit, a new or misread requirement, a pivot, or a failed approach, means talking to Sofia the Product Owner (`bmad-agent-po`, `help/planning-skills.md`) to replan: "this changed, what now". She reads the ticket tree, proposes the path (adjust, roll back, or cut scope), updates the ticket's Requirements when what is required changed, re-slices or drops the affected entries, and records the reason as a dated Decision line.
