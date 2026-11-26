# Implementation skills in detail

Read this when the question is about `bmad-build` or `bmad-build-auto`. For running stories without a human, see `help/unattended-builds.md`.

**`bmad-build`** — one session of delivery: clarifies intent, plans, implements, reviews, and presents a commit.

- **Inputs:** Takes free text, a ticket from the tree (`1.2`, file, or title), nothing (the next ready ticket), a plan to resume, an intent file, or recent conversation. With a ticket, it reads the story file (or entry) and epic file in full, loads relevant `References` and `companions:` (`DESIGN.md`, `EXPERIENCE.md`, mockups, architecture contracts) into plan `context:`, follows a container's `parent:` only when the epic defers something upward, and never re-reads already-distilled `sources:`.
- **Standalone `(Story ->) bmad-build`:** When starting from free text with no ticket, Amelia runs a quick repo scan plus a 60-second micro-preamble confirming scope and a one-line success signal (what proves it worked) before planning or building, escalating upward only if hidden multi-story coupling surfaces.
- **Refined Stories:** Cites functional and measurement Given/When/Then ACs from a Refined Story (`story-<slug>.md`) verbatim inside `<frozen-after-approval>`, keeping exact files, tasks, and tests in the local `story-<slug>-plan.md`.
- **Pick when:** Any feature, story, bug fix, or meaningful change, including single stories taking more than one build session. Risky or foundational stories belong here because a human approves the plan.
- **Not when:** Typo-level or config edits, or line-by-line user-directed edits.
- **Size and review:** Target one goal per session (~500 changed lines excluding tests). Built-in agent review defaults to `quick` (one lens); `thorough` runs four independent lenses and `none` skips review. Fixes clear findings itself, asks on intent gaps, logs pre-existing issues to `deferred-work.md`, commits locally, and never pushes.
- **Writes:** A ticket's plan beside `tickets.toml` (or in `backlog/`) at the path `tickets.py find` returns, moving `status` up to `built` so the user can mark `done`. Loose builds write `{output_folder}/{active_initiative}/plan-<slug>.md` (or `{output_folder}/plan-<slug>.md`).

**`bmad-build-auto`** — one unattended build of one ticket, for a loop or script that dispatches it.

- Do not offer it for attended work, except to execute an approved `prototype-plan` in one pass.
- Walks the same `parent:` chain, UX/architecture `companions:`, and verbatim Refined Story ACs as `bmad-build`, halting `blocked` with a named reason on any intent gap rather than asking. Requires subagents and, under git, a clean tree on an appropriate branch.

A significant midstream change — technical limit, misread requirement, pivot, or failed approach — means starting a fresh chat with Sofia (`bmad-agent-po`) to `REPLAN` ("this changed, what now"). She updates the ticket's Requirements, re-slices or drops affected entries, and records a dated `Decision:` line.
