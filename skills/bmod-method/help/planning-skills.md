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

`bmad-preview-ticketing` plans and tracks work in one ticket tree. An initiative holds epics; each epic's `tickets.toml` holds ordered entries. Build an entry directly without making a story file. Standalone stories and bugs can be direct intent or backlog leaves. Plans own status and remain live after completion. Builds stop at `built`; the user or orchestrator marks `done`. See `help/ticketing-setup.md`.

**`bmad-preview-ticketing`** — slices initiatives into epics, incepts each epic into entries, refines when needed, and manages the board and optional tracker publishing. A spec, PRD, or described intent is valid input. Requirements stay in the epic and entries cite them with `covers`. A file is needed for refinement or tracker publishing, not to start a build. Tracker stores are lightly tested.
