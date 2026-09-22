# Planning skills in detail

Read this when the question is about `bmad-spec`, `bmad-prd`, `bmad-ux`, `bmad-architecture`, or the skills that slice and track work: what each gives, when to pick it, when not to, and what it writes.

**`bmad-spec`** — the hub. Condenses any input into the contract builds read.
- Gives: a spec folder with `SPEC.md` (why, capabilities with stable ids, constraints, non-goals, success signal) and companions. It adopts UX files and an architecture spine as companions and absorbs a PRD or brief as a source. On request it hands the spec folder to `bmad-preview-ticketing` to be planned into stories. It also updates and validates an existing spec.
- Pick when: the user has anything to distill, or can explain the idea in detail; after any other analysis or planning skill finishes; when requirements change on the spec route (it appends to its log, re-derives the spec, and names the tickets that no longer match).
- Not when: the input is a bare idea. It distills and does not coach → `bmad-product-brief` first, or `bmad-prd` when full requirements are needed.
- Splitting into stories is not this skill: send the user to `bmad-preview-ticketing` with the spec folder, which plans one epic whose stories cite the spec's `CAP-N` ids. After writing a spec that reads as several slices, `bmad-spec` offers that hand-off once.
- Writes: `{output_folder}/specs/spec-{slug}/` holding `SPEC.md` and companions.

**`bmad-prd`** — coaches detailed requirements out of the user.
- Gives: a PRD sized to the stakes (about 2 pages for a hobby project, longer for a launch): features, requirements with stable ids, user journeys, non-goals, MVP scope, metrics. Fast path or coaching path. Also updates and validates an existing PRD.
- Pick when: the idea is too thin for `bmad-spec`; a consumer or multi-stakeholder product; compliance, integration, or SLA concerns; an existing PRD needs editing or critique.
- Not when: scope is one or two stories → `bmad-build`. A lighter document will do → `bmad-product-brief`, then `bmad-spec`. A brief is an optional input, never a prerequisite.
- Writes: `{planning_artifacts}/prds/prd-{project_name}-{date}/prd.md`.

**`bmad-ux`** — captures how the product looks and how it works. It may lead, follow, or stand alone.
- Gives: `DESIGN.md` (visual tokens and rules) and `EXPERIENCE.md` (structure, states, interactions, accessibility, key flows), optionally mockups and wireframes. It captures the user's vision and never imposes one. A design-handoff mode builds a prompt for an external design tool.
- Pick when: the UI is a significant part of the work; the user wants to design first and derive requirements from the design; the user has design assets to fold in; design will happen in an outside tool but a contract is still needed.
- Not when: there is no meaningful UI.
- UX first: its files are good input to `bmad-prd` when requirements still need drawing out, to `bmad-product-brief` when a lighter write-up will do, or straight to `bmad-spec` when the design already says enough.
- In the spec: both files are adopted as companions. Change them with `bmad-ux` update, not through the spec.
- Writes: `{planning_artifacts}/ux-designs/ux-{project_name}-{date}/`.

**`bmad-architecture`** — fixes only the decisions that keep separately built parts consistent.
- For a user new to architecture: it coaches by default, so the user needs no architecture knowledge to start. When the stack is open it recommends a well-known current starter, checked on the web first, because a good starter settles a coherent set of decisions for free. For each big call (paradigm, stack or starter, major boundaries, and where and how it is deployed and hosted) it lays out the realistic options and why it leans one way, then the user chooses. Its fast path drafts everything with `[ASSUMPTION]` tags to correct.
- Gives: a terse `ARCHITECTURE-SPINE.md` of decisions with stable ids, plus a list of what it deliberately leaves open. Not a full architecture document unless the user asks for one. Works at initiative, feature, or epic altitude, and can start from a spec, a raw idea, an existing codebase, or a sprawling document to distill.
- Pick when: two units built independently could choose incompatibly; an initiative has been cut into epics and more than one epic must adopt the same contract, format, or value list; the stack is open; the user does not know what stack, starter, or hosting to choose; a brownfield codebase has conventions worth ratifying; a feature touches an existing system.
- Not when: the input is too thin → `bmad-spec` first. One session builds all of it → skip.
- Next: it offers to have `bmad-spec` adopt the spine as a companion. Recommend that first.
- Writes: `{planning_artifacts}/architecture/architecture-{project_name}-{date}/ARCHITECTURE-SPINE.md`.

## Slicing and tracking the work

Two ways. Use one per piece of work, never both for the same work. A request to split or break up work goes to the second, also when it starts from a spec.

| | `bmad-create-epics-and-stories` + `bmad-sprint-planning` | `bmad-preview-ticketing` |
|---|---|---|
| Needs | A PRD and an architecture | Any intent; best with a spec |
| Gives | Epics, stories with acceptance criteria, a readiness verdict, a status file | A ticket tree used as a board; optional tracker publishing |
| Status | `bmad-build` updates it | Moved by hand through the skill |
| Effort | High: every story approved one at a time | Sized at intake; a single bug or story is quick |

For how the ticketing route works and why, see `help/ticketing-and-epics.md`. For setting it up and driving it, see `help/ticketing-setup.md`.

**`bmad-create-epics-and-stories`** — breaks a PRD and architecture into user-value epics and stories.
- Gives: `epics.md` with a requirements inventory, a map proving every requirement is covered, and Given/When/Then criteria per story.
- Pick when: a PRD and architecture exist, the work spans several epics, and the user wants traceability and criteria up front.
- Not when: there is only a spec, or the user wants to build now → `bmad-spec`, then `bmad-preview-ticketing` with the spec folder. It needs a PRD to extract requirements from.
- Writes: one file, `{planning_artifacts}/epics.md`. A spec can be added as extra input when it asks, but a PRD and an architecture are still required.

**`bmad-sprint-planning`** — judges whether the plan is buildable, then tracks it.
- Gives: a PASS / CONCERNS / FAIL readiness verdict and `sprint-status.yaml` covering every epic, story, and retrospective. Its status action answers "where are we" and names the next story. It can also validate or repair the file.
- Pick when: `epics.md` exists and building is about to start; any time the user asks where things stand; after epics change (refresh never downgrades a status).
- Not when: the work is on the spec route or the ticketing route. It reads only `epics.md` headings, never `stories.yaml` or tickets.
- Writes: `{implementation_artifacts}/sprint-status.yaml`.

**`bmad-preview-ticketing`** — preview of the ticket tree that will replace the two skills above.
- Gives: an initiative sliced into epics, each planned into stories and bugs as entries in `tickets.toml`, in build order, each with an `id`, its prerequisites (`after`), and a verify line; a spike is added when the user asks for one. An entry becomes a ticket file when pulled. Run as a board, optionally published to a tracker.
- Pick when: tickets or a tracker are the record; one-off bugs and stories with no PRD; work across repos; the user accepts a prerelease skill.
- Tell the user: a ticket file's `status` belongs to the build, and `bmad-build` does not write it yet, so they tell this skill to start and close a ticket by hand. They hand the pulled ticket file to `bmad-build` with its epic. A story needs no refining first; a bug, a ticket with no epic, or an entry the user marked `refine = true` gets full criteria first. Before an unattended run, recommend a review of the stories. Trackers other than the repo store are lightly tested.
- Writes: ticket files under `{output_folder}/{active_initiative}/` and `{output_folder}/backlog/`, named `epic-<slug>/`, `story-<slug>.md`, `spike-<slug>.md`, `bug-<slug>.md`, and a `tickets.toml` beside each initiative and epic file.
