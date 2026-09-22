# BMad Method knowledge

This document covers the skills of the `method` module: what each one gives the user, when to recommend it, and what to offer next.

## How the method works

The method turns an intent of any size into working software. Recommend the smallest path that safely fits the work; never march the user through every skill. A project may hold only some of these skills: recommend from what is installed, and say plainly when a step has no installed skill rather than inventing a substitute.

**`bmad-spec` is the hub.** It condenses any input, at any altitude, into a spec folder: `SPEC.md` plus companion files, the contract every build reads. A user can talk to it directly. Every analysis and planning skill exists to give the user better material to feed into a spec, and they can run in any order, before or after the spec exists, because the spec is re-derived from a running log and never hand-merged. After any of them finishes, the usual next step is to fold its result into the spec with `bmad-spec`.

The four phases are analysis (ideation, research, is it worth building), planning (what exactly, and in what slices), implementation (build it), and validation (is it right). They describe what kind of help a skill gives. They are not a mandatory sequence to complete.

Project size decides how many build sessions the work needs. Stakes decide how heavy the planning gets. A large hobby project keeps planning light; a small change to a regulated system may not.

## More detail

This document should be enough to route the user and say what to do next. Each topic file below sits in this folder and goes deeper on one subject. Read one only when the question is about that subject, using the path the knowledge script lists for it.

| Topic file | Read when the user asks about |
|---|---|
| `help/analysis-skills.md` | `bmad-product-brief` or `bmad-prfaq` in depth: what each gives, when to pick it, when not to, how they relate. |
| `help/planning-skills.md` | `bmad-spec`, `bmad-prd`, `bmad-ux`, `bmad-architecture`, `bmad-create-epics-and-stories`, `bmad-sprint-planning`, or `bmad-preview-ticketing` in depth. |
| `help/implementation-skills.md` | `bmad-build`, `bmad-build-auto`, or `bmad-correct-course` in depth. |
| `help/validation-skills.md` | `bmad-code-review`, `bmad-walkthrough`, `bmad-qa-generate-e2e-tests`, or `bmad-retrospective` in depth. |
| `help/prototyping.md` | Prototyping or vibe coding first, what a prototype is good for (worth doing, feasibility, complexity, unknowns), non-engineers prototyping, what to do with a prototype afterwards, whether planning still matters after a good first version. |
| `help/existing-codebase.md` | Using BMad on an inherited, brownfield, or long-lived codebase. |
| `help/preparing-a-repo-for-agents.md` | Getting a codebase ready for agentic coding, inconsistent agent output, how much documentation to keep (small ADRs, not heavy docs), regular refactoring, holding quality over time. |
| `help/artifact-lifetime.md` | Whether to keep PRDs, specs, stories, and build records after the work is done, archiving, closing out an epic, keeping old plans from misleading agents. |
| `help/monorepo-and-polyrepo.md` | Where to install BMad and keep planning when work spans one repository or several; the workspace layout for a poly repo. |
| `help/working-in-an-organization.md` | A team or enterprise: an existing PRD, Jira or another tracker, approvals and sign-off, document owners, several engineers in parallel, requirements changing mid-flight. |
| `help/ticketing-and-epics.md` | How `bmad-preview-ticketing` works (initiatives, epic inception, the breakdown, pull and refine), why it differs from epics plus sprint planning, and which to pick. |
| `help/ticketing-setup.md` | Setting up and driving `bmad-preview-ticketing`: the store, several repos, trackers, the phrases to say, the hand-off to `bmad-build`. |
| `help/unattended-builds.md` | `bmad-build-auto`, building stories with no human present, a blocked run and how to retry, what to check after a run. |
| `help/review-choices.md` | Review depth, skipping review, another review pass, when to stop, slow reviews, customizing review. |
| `help/project-context.md` | `bmad-project-context` in depth: what belongs in `AGENTS.md`, why the block is small, its intents, removing a rule. |

## Start here

- Can one session understand, build, review, and finish it?
  - Obvious and low-risk (typo, formatting, config): just make the edit. No skill.
  - Yes → `bmad-build`. No planning skill first.
- Bigger than one session: does the user already have enough to say or paste (an idea they can explain in detail, notes, intent.md, single ticket, a transcript, a brief, a PRD)?
  - Yes → `bmad-spec`, then `bmad-preview-ticketing` with the spec folder to plan the stories. Then pull each story, and one `bmad-build` per story.
  - No → find what is missing, run the skill that supplies it, then `bmad-spec`:
    - They cannot name a customer or a problem → `bmad-forge-idea` or `bmad-brainstorming` (core tools), if installed.
    - Unsure the idea is worth building → `bmad-prfaq`.
    - Sure of the idea, but it is not written down or not shareable → `bmad-product-brief`. It is also the lighter choice when a full PRD is more than the work needs.
    - Requirements need real detail, or many stakeholders, compliance, or integrations are involved → `bmad-prd`.
    - The look and feel matter, or the user thinks best in screens and flows → `bmad-ux`. Starting with UX is a normal way in.
    - Separate people, agents, or sessions could build parts that do not fit together → `bmad-architecture`.
- Wants to prototype first, or is unsure the work is worth doing, feasible, or how complex it is → encourage a prototype. It suits enterprise work as much as hobby work, greenfield or existing code, and non-engineers can build one. A throwaway needs no skill. Afterwards the user decides to throw it away or keep it, and either way what it taught them goes into `bmad-spec` (`help/prototyping.md`).
- Risk, unclear requirements, architectural reach, or coordination between people push work up a tier even when it is small.

## Match the situation

Situations the tree above does not settle.

| The user says or has | Recommend | Because |
|---|---|---|
| "I want to start from the design" | `bmad-ux` | UX may lead. Feed its files to `bmad-prd` when requirements still need drawing out, to `bmad-product-brief` for a lighter write-up, or straight to `bmad-spec` when they say enough. |
| A prototype, and asks what now | Decide: throw away or keep | Thrown away, the notes go to `bmad-spec`. Kept, treat it as an existing codebase (`help/prototyping.md`). |
| Work spans several repositories | Install BMad at a workspace root that holds them all, with planning kept there | One session then reaches the plan and every project (`help/monorepo-and-polyrepo.md`). |
| "How do I get my repo ready for AI agents?", or agents keep producing inconsistent work | Consistent patterns, a good initial `AGENTS.md`, end-to-end tests, and cleanup first when quality is low | Agents copy what they find (`help/preparing-a-repo-for-agents.md`). |
| "Do I keep the PRD, spec, and stories once it is built?" | Archive them and keep only small maintenance documentation | They are snapshots in time and mislead agents later; git keeps the history (`help/artifact-lifetime.md`). |
| An inherited or brownfield codebase | A small `bmad-build` change first; `bmad-project-context` and `bmad-walkthrough` as needed | No up-front documentation pass is required (`help/existing-codebase.md`). |
| "I don't know architecture, stacks, or hosting" | `bmad-architecture`, or the architect agent to talk it through | It coaches, recommends a current starter, and lays out options with reasons for the user to choose. Technical knowledge is not needed to start. |
| "An app for X" and nothing more | `bmad-product-brief`, or `bmad-prd` when the stakes call for full requirements | `bmad-spec` distills and will not coach; the input is too thin for it. The brief is the lighter of the two. |
| A PRD and architecture, several epics, wants tracking | `bmad-create-epics-and-stories` → `bmad-sprint-planning` | The only route with acceptance criteria up front and a status file `bmad-build` keeps current. |
| A team with an existing PRD, a tracker, approvals, or several engineers | The full path only when approvers, parallel teams, or required documents call for it | The existing PRD is input, each document has one owner, and sign-off attaches to skill results (`help/working-in-an-organization.md`). |
| "Can BMad build my stories by itself?" | `bmad-build-auto`, dispatched per story by a loop | It suits settled decisions and well specified stories, with someone reading the results. For work planned with `bmad-preview-ticketing`, give it the pulled ticket file, one run per ticket (`help/unattended-builds.md`). |
| Wants tickets or a tracker (Jira, Linear, GitHub) as the record | `bmad-preview-ticketing` | Tickets are the board. It is a preview; a ticket's `status` belongs to the build, and until `bmad-build` writes it the user marks tickets by hand. |
| "Where are we?" with a `sprint-status.yaml` | `bmad-sprint-planning` status | It reads the file and names the next story. |
| A v6 project (`epics.md`, `sprint-status.yaml`, dated folders under the planning folder) that wants the v7 layout | `bmad migrate method` | The module ships `v6-v7-migration.toml`: the rules for moving the project's artifacts into initiative folders, turning epics and sprint status into a ticket tree, and putting loose work in `inbox/`. The `bmad` skill plans it with the user, then performs it. |
| A PR, a branch, or code `bmad-build` did not write | `bmad-code-review` | Agent lenses over any diff. |
| "Walk me through what changed" | `bmad-walkthrough` | The human is the reviewer. |
| All stories of an epic or spec folder are done | `bmad-retrospective` | It judges the whole against the spec. |
| A big change surfaced mid-build | Spec route: update through `bmad-spec`. Epics route: `bmad-correct-course`. | Correct course needs a PRD and epics and halts without them. |
| Wants an expert to think a phase through with, or is unsure where to begin in it | The agent for that phase (see "The agents") | It guides across turns and runs the phase's skills from its menu. |
| Agents keep making the same mistake in this repo | `bmad-project-context` | It records the rule in `AGENTS.md`. |

## The skills

One line per skill: what it is for and what it writes. The files it writes are how to tell what is already done. Open the phase file for the full picture of a skill: what it gives, when to pick it, when not to.

| Skill | For | Writes |
|---|---|---|
| **Analysis** (`help/analysis-skills.md`) | | |
| `bmad-product-brief` | A 1-2 page brief of a product the user believes in. Lighter than a PRD, sharper than a hand-written intent file. It does not judge the idea. | `{planning_artifacts}/briefs/brief-{project_name}-{date}/brief.md` |
| `bmad-prfaq` | Tests whether a concept survives scrutiny: press release, hard FAQs, researched claims, a verdict. | `{planning_artifacts}/prfaq-{project_name}.md` |
| **Planning** (`help/planning-skills.md`) | | |
| `bmad-spec` | The hub. Distills any input into the contract builds read, and updates it. It does not slice or coach; splitting work into stories is `bmad-preview-ticketing`. | `{output_folder}/specs/spec-{slug}/` with `SPEC.md` and companions |
| `bmad-prd` | Coaches detailed requirements out of the user, sized to the stakes. Also updates and validates a PRD. | `{planning_artifacts}/prds/prd-{project_name}-{date}/prd.md` |
| `bmad-ux` | How the product looks and works. May lead, follow, or stand alone. Can produce mocks and wireframes. | `{planning_artifacts}/ux-designs/ux-{project_name}-{date}/` with `DESIGN.md`, `EXPERIENCE.md` |
| `bmad-architecture` | Settles only the decisions that keep separately built parts consistent. Coaches a user with no architecture knowledge, recommends a current starter, and covers hosting and deployment. | `{planning_artifacts}/architecture/architecture-{project_name}-{date}/ARCHITECTURE-SPINE.md` |
| `bmad-create-epics-and-stories` | Breaks a PRD and architecture into epics and stories with acceptance criteria up front. | `{planning_artifacts}/epics.md` |
| `bmad-sprint-planning` | A readiness verdict, then a status file. Answers "where are we" on the epics route. | `{implementation_artifacts}/sprint-status.yaml` |
| `bmad-preview-ticketing` | Preview. A ticket tree run as a board: initiatives, epics, stories planned in `tickets.toml` and refined when pulled, one-off bugs, optional tracker. | Ticket files under `{output_folder}/{active_initiative}/` and `{output_folder}/backlog/` |
| **Implementation** (`help/implementation-skills.md`) | | |
| `bmad-build` | One session of delivery: clarifies intent, plans, implements, reviews, commits. The default for any real change. Takes free text, a spec folder plus story id, or any file as intent. | `{implementation_artifacts}/spec-{slug}.md`, or `stories/{story_id}-{slug}.md` in the spec folder; `deferred-work.md` |
| `bmad-build-auto` | One unattended build of one story, dispatched by a loop or script. Never for attended work. | The same story files as `bmad-build` |
| `bmad-correct-course` | Assesses a significant midstream change on the epics route. Needs a PRD and epics. | `{planning_artifacts}/sprint-change-proposal-{date}.md` |
| **Validation** (`help/validation-skills.md`) | | |
| `bmad-code-review` | Agent review of any diff, PR, or branch, with triaged findings. Redundant right after a full `bmad-build` review of the same change. | A `Review Findings` section in the story file, or chat |
| `bmad-walkthrough` | The human reviews a change block by block, guided. Also a way to learn unfamiliar code. | A review narrative and log under `{implementation_artifacts}` |
| `bmad-qa-generate-e2e-tests` | API and end-to-end tests for features that already exist. | `{project-root}/tests`, `{implementation_artifacts}/tests/test-summary.md` |
| `bmad-retrospective` | Judges a finished epic or spec folder as a whole against its spec. | `epic-{n}-retro-{date}.md`, or `RETROSPECTIVE.md` in the spec folder |
| **Any time** (`help/project-context.md`) | | |
| `bmad-project-context` | Keeps a small, verified block of rules for agents. Use it when an agent got something wrong in this repo, a repo has no usable `AGENTS.md`, or the stack was just decided. It gives no repo overview. | `{project-root}/AGENTS.md` |

### Slicing and tracking the work

Two ways. Use one per piece of work, never both for the same work. A request to split or break up work goes to the second, also when it starts from a spec.

| | `bmad-create-epics-and-stories` + `bmad-sprint-planning` | `bmad-preview-ticketing` |
|---|---|---|
| Needs | A PRD and an architecture | Any intent; best with a spec |
| Gives | Epics, stories with acceptance criteria, a readiness verdict, a status file | A ticket tree used as a board; optional tracker publishing |
| Status | `bmad-build` updates it | Moved by hand through the skill |
| Effort | High: every story approved one at a time | Sized at intake; a single bug or story is quick |

### Who reviews what

| | Reviewer | Looks at | Fixes |
|---|---|---|---|
| Review inside `bmad-build` | Agents | The change just built | Clear findings, itself |
| `bmad-code-review` | Agents | Any diff, PR, branch, or commit | What the human chooses |
| `bmad-walkthrough` | The human, guided | A commit, PR, file, or directory | Nothing unless asked |
| `bmad-retrospective` | Agents, across stories | A whole epic or spec folder | Nothing; proposes action items |

## The agents

Five named experts, each owning a phase and staying in the conversation across turns. An agent carries its role's judgment, offers a menu of the skills it owns, and helps the user decide what to do and why before and between skill runs. Offer one whenever the user wants an expert to work with rather than a single skill to run, is unsure where to begin in a phase, or likes the experience of interacting with unique personas. In the future these agents will have the ability to retain memory and work autonomously which is why they are still a core part of the project.

| Agent | Phase | Work with them to |
|---|---|---|
| Mary, analyst — `bmad-agent-analyst` | Analysis | Brainstorm, research a market, domain, technology, or competitor, then shape a brief or a PRFAQ. |
| John, product manager — `bmad-agent-pm` | Planning | Turn a vision into a PRD, epics and stories, check readiness, and handle a midstream change. |
| Sally, UX designer — `bmad-agent-ux-designer` | Planning | Work out how the product looks and behaves. |
| Winston, architect — `bmad-agent-architect` | Planning | Settle the technical decisions that keep the parts consistent, and check readiness. |
| Amelia, developer — `bmad-agent-dev` | Implementation and validation | Build stories, generate tests, review code, plan the sprint, and run a retrospective. |

An agent and its skills are two ways into the same work: a skill run directly does the job, and an agent adds a guide who knows the whole phase. `bmad-party-mode` brings the agents together in one discussion and offers the `product-team` room.

## After a skill finishes

| Just finished | Offer next |
|---|---|
| `bmad-product-brief`, `bmad-prfaq` | `bmad-spec` with the result as input. `bmad-prd` first when the requirements still need drawing out. After a PRFAQ verdict with serious gaps, address those before anything else. |
| `bmad-prd` | `bmad-spec` to absorb it. `bmad-ux` when the UI matters; `bmad-architecture` when parts must fit together. |
| `bmad-ux` | `bmad-spec` to adopt the files as companions. When UX came first and requirements are still thin, `bmad-prd` or the lighter `bmad-product-brief` with the UX files as input. |
| `bmad-architecture` | `bmad-spec` to adopt the spine as a companion. |
| `bmad-spec` | Its open questions and assumptions, if any. Then `bmad-preview-ticketing` with the spec folder to plan the stories, and `bmad-build` per pulled story, or straight to `bmad-build` when one session can do it. |
| `bmad-create-epics-and-stories` | `bmad-sprint-planning`. |
| `bmad-sprint-planning` | `bmad-build` on the story its status view names. On FAIL, the skill that owns the gap. |
| `bmad-build` | Open a PR, or `bmad-walkthrough` when a person wants to understand the change, then the next story. `bmad-qa-generate-e2e-tests` when end-to-end coverage is wanted. |
| The last story of an epic or spec folder | `bmad-retrospective`, then a refactoring pass over the whole changeset, which is commonly skipped (`help/preparing-a-repo-for-agents.md`). Then close the epic out and archive its story files (`help/artifact-lifetime.md`). |

## Answering "what's next?"

Read the state before recommending: which of the outputs named above exist, and what the codebase, git history, and the user say is done. A file's presence, or a story file with `status: done`, is evidence the skill ran, not proof the work is finished or current.

- Mid-path, recommend the next unfinished step of the route the user is on, not a restart, and do not move them to a different slicing route mid-work.
- When a significant change surfaces, route it as the table in "Match the situation" says, then resume at the earliest affected step. Do not replay unaffected work.
- The work is complete when the intent is satisfied, its chosen checks pass, and no chosen review leaves material findings open — not when every skill has run.

## When this document is not enough

For a `method` question this document, its topic files, and the installed skills cannot answer, fetch the documentation site at `https://docs.bmad-method.org/` and follow the pages relevant to the question. The source repository it links to is the final authority on how anything actually behaves.
