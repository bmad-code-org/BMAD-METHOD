# Ticketing compared with epics and sprint planning

`bmad-preview-ticketing` is a preview of the route that will replace `bmad-create-epics-and-stories` plus `bmad-sprint-planning`. Use this when a user asks how the two differ, which to pick, or why the ticketing route is designed the way it is.

## How the ticketing route works

- **Initiative.** One body of work, such as a product, a major feature, or a migration. Its planning documents and tickets live together in one folder.
- **Slicing.** The skill proposes how to split the initiative into epics from the user's source material. The user decides the split. The agreed epics, in build order, are recorded in `tickets.toml` beside the initiative file. Each epic gets its own folder holding the epic's ticket file, its own `tickets.toml`, its spec if it has one, and its stories. Epics not yet selected stay as short envelopes: outcome, done-when checks, boundary.
- **Epic boundaries.** An epic is one capability delivered to production by one owner. A module, service, or bounded context is an epic boundary when it is also the ownership or deployment boundary. A unit the work only consumes or configures gets no epic: it is a touch point, named in the initiative's Boundaries with the epic that owns the work there. A team's own rule for cutting epics can be saved to `_bmad/custom/bmad-preview-ticketing.toml`.
- **Decisions several epics share.** A contract, a data format, or a shared value list that more than one epic must adopt goes to `bmad-architecture` (the spine), or becomes a story in the opening epic that the others are blocked by. It is never a spike inside one epic. One repo or one unit needs no architecture pass; the second unit that must adopt a decision does.
- **Epic inception.** Planning one selected epic as a whole: every anticipated story and bug in build order, with what each delivers, its blockers, how it will be verified, and what is still uncertain. Each is an entry in the epic's `tickets.toml`. An entry has no file, no status, and no acceptance criteria. An unknown that must be settled before implementation is put to the user: answer it, record it as the entry's `unknown`, or add a spike when the user asks for one. By default the breakdown ends with a "Refactor sweep" story.
- **Pull, then build.** Pulling an entry writes its ticket file (`<type>-nn-slug.md`, `refined: false`); a script does it, with no conversation. The pulled file goes to `bmad-build` with its epic, and the builder plans the story's acceptance criteria from the epic's Requirements and Done when, the entry's description, and its `Verify:` check. After completed work changes the picture, the remaining breakdown is revisited.
- **Refining is optional.** With `bmad-build`, a story is refined during the build: the builder questions the user and writes the criteria into its plan. Refining in ticketing is a review of the entries with the user — description, check, references, notes, order, blockers — and writes no Given/When/Then. Recommend that review when the epic will run unattended (`bmad-build-auto`, a loop, a factory), because nobody answers questions during the build. Full acceptance criteria are written in ticketing only for a ticket with no epic, a bug, or when the user asks.
- **Source conflicts.** When the source contradicts the code, the skill records a `Source conflict:` line in the container's Notes and tells the user. When the source is a BMad spec, it offers to pass the correction to `bmad-spec`.
- **The board.** "What's next?" shows what is ready to pull, ready to refine (only the tickets that need it), ready to start, in progress, or blocked. Asked about the initiative, it covers every epic. A blocker can be a story in the same epic, a story in another epic, or a whole epic.
- **Other abilities.** A one-off bug or story goes straight into `backlog/` with no epic. Tickets can be published to a tracker such as Jira, Linear, or GitHub; the markdown file stays the working copy.

## Why it is designed this way

- **Detail is written when it is needed.** The epics route writes Given/When/Then criteria for every story up front, and the user approves each story one at a time. Criteria written weeks early go stale as building teaches the team things. Ticketing plans the whole epic at low cost. The builder writes each story's criteria at build time from the epic and the entry, using what earlier stories taught. Ticketing writes full criteria only for bugs, tickets with no epic, and on request.
- **A lower bar to start.** The epics route needs a PRD and an architecture. Ticketing takes any intent, works best with a spec, and handles a single bug.
- **One skill, one place.** Slicing, stories, status, and the board are together. The epics route splits them between `epics.md` and `sprint-status.yaml`.
- **One file per story.** A story file is easy to hand to `bmad-build`, to publish to a tracker, and to use across repositories.
- **It matches how teams track work.** When a tracker is the record, the epics route has nothing to offer.

## What the epics route still does better today

- **Automatic status.** `bmad-build` keeps `sprint-status.yaml` current. It does not move ticket status yet: the user starts and closes tickets through the ticketing skill.
- **A readiness verdict.** `bmad-sprint-planning` gives PASS / CONCERNS / FAIL before building starts.
- **Requirement coverage up front.** `epics.md` carries a map proving every PRD requirement is covered by a story.
- **Maturity.** Ticketing is a prerelease. Trackers other than the repo store are lightly tested, and nothing syncs on its own.

## Which to recommend

- Has a spec and wants stories from it → `bmad-preview-ticketing` with the spec folder, which plans it as one epic.
- Wants a board, uses a tracker, has bugs and one-off stories, or wants to help test the v7 direction → `bmad-preview-ticketing`.
- Has a PRD and an architecture, and wants criteria written up front for every story and status that updates itself → the epics route.
- The routes do not mix. Use one per piece of work.
