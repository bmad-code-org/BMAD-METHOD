# Ticketing compared with epics and sprint planning

`bmad-preview-ticketing` is a preview of the route that will replace `bmad-create-epics-and-stories` plus `bmad-sprint-planning`. Use this when a user asks how the two differ, which to pick, or why the ticketing route is designed the way it is.

## How the ticketing route works

- **Initiative.** One body of work, such as a product, a major feature, or a migration. Its planning documents and tickets live together in one folder.
- **Slicing.** The skill proposes how to split the initiative into epics from the user's source material. The user decides the split. Each epic gets its own folder holding the epic's ticket file, its spec if it has one, and its stories. Epics not yet selected stay as short envelopes: outcome, done-when checks, boundary.
- **Epic inception.** Planning one selected epic as a whole: every anticipated story, spike, and bug in build order, with what each contributes, its blockers, how it will be verified, and what is still uncertain. The full list is recorded in the epic. By default only the first story and whatever else is unblocked become files.
- **Thin stories.** A story starts thin (`refined: false`): its contribution and verification approach, without detailed acceptance criteria.
- **Refined when pulled.** When the user pulls a story to work on it, the skill reads the finished sibling stories and the current code, then writes the acceptance criteria. After completed work changes the picture, the remaining breakdown is revisited.
- **The board.** "What's next?" shows what is ready to refine, ready to start, in progress, or blocked. Blockers are recorded on the tickets.
- **Other abilities.** A one-off bug or story goes straight into `backlog/` with no epic. Tickets can be published to a tracker such as Jira, Linear, or GitHub; the markdown file stays the working copy.

## Why it is designed this way

- **Detail is written when it is needed.** The epics route writes Given/When/Then criteria for every story up front, and the user approves each story one at a time. Criteria written weeks early go stale as building teaches the team things. Ticketing plans the whole epic at low cost and spends the effort on detail only for the story being pulled, using what earlier stories taught.
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

- Wants to build now with little ceremony → neither. `bmad-spec` story breakdown.
- Wants a board, uses a tracker, has bugs and one-off stories, or wants to help test the v7 direction → `bmad-preview-ticketing`.
- Has a PRD and an architecture, and wants criteria for every story and status that updates itself → the epics route.
- The routes do not mix. Use one per piece of work.
