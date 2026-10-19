# PRD

The outcome is a PRD at `{doc_workspace}/{workflow.run_folder_pattern}.md`, with `addendum.md` beside it for the depth that does not belong in it. A team, human or AI, acts on it without this conversation in the room: Sofia the Product Owner distills it into the initiative's requirements, and UX and architecture read it. So every requirement traces to a need and is stated so someone could test whether it was met, scope edges are explicit, including what is out, and open questions are named as open rather than papered over.

## Files

- `.memlog.md` is the run's memory: every decision, change, assumption and override lands there as one line when it happens, through `uv run {project-root}/_bmad/scripts/memlog.py append --workspace {doc_workspace} --type <decision|change|override|assumption|event> --text "<gist, reason included>"`, never by hand. The PRD is distilled toward it, and what is not logged is lost on resume.
- `addendum.md` keeps depth the user volunteers that does not fit the PRD or belongs downstream: rejected alternatives, options matrices, mechanism and transport decisions, technical how, in-depth personas, sizing data. Capture it as it comes, not at finalize. Audit and override notes never go there.

## Intent

**Create** when no PRD exists for this work. Before binding a workspace, scan `{workflow.prd_output_path}`, and the epic's folder when the ticket is an epic, for folders matching `{workflow.run_folder_pattern}` whose main file's frontmatter `status` is not `final`, and offer to resume one rather than start over. Then bind `{doc_workspace}` to `{workflow.prd_output_path}/{workflow.run_folder_pattern}/`, the epic's folder in place of `{workflow.prd_output_path}` when the ticket is an epic; `{slug}` is what the PRD is about in kebab-case, or the epic's slug without `epic-`. Write the PRD with YAML frontmatter (`title`, `status: draft`, `created`, `updated`), seed the memlog with `uv run {project-root}/_bmad/scripts/memlog.py init --workspace {doc_workspace} --field topic="<product>"`, tell the user the path, then run Discovery and Finalize.

**Update** when a PRD exists and the user brings a change signal. Source-extract against the PRD, `addendum.md`, `.memlog.md` and the original inputs. A missing `.memlog.md`: init it, then one bootstrap subagent recovers a thin log from the PRD, one `memlog.py append --type decision` per decision it finds. Surface conflicts with prior decisions before applying anything, apply and log each change, then Finalize.

Ambiguous between the two: ask.

## Discovery

Order: brain dump, stakes, working mode, then the work the mode scopes. Reach working mode in two or three turns; a user in a hurry is not held by upstream probing.

**Brain dump.** Always, even when the user opened with paragraphs of context: that was intake, not the dump. Ask for the verbal picture and every existing input they want read: brief, research, customer transcripts, competitive analysis, a prior draft, design docs, by path or paste; large documents are fine, subagents extract them. "Anything else?" surfaces what they almost forgot.

**Research.** During Discovery, spawn web-research subagents on what exists in the space and how comparables position themselves; you receive a digest, not the search.

**Elicitation, not direction.** Discovery pulls the user's vision out and does not insert yours. Open-ended "tell me about X" beats multiple choice; infer-and-confirm ("I'm assuming X works like Y, right?") is fine. When you find yourself naming wedges, picking MVP cuts or proposing phases, you have crossed from eliciting into authoring: hand the pen back.

**Stakes.** One short probe, hobby, internal or launch, calibrates rigor and section depth. Audience, inputs and downstream depth fill in inside the chosen mode, not before it.

**Working mode.** Offer, in the user's language:

- Fast path: you batch the remaining gaps into one or two consolidated questions, then draft the whole PRD with `[ASSUMPTION]` tags where you inferred; the user reviews and you iterate. Its first quality depends on what they gave upfront.
- Coaching path: you walk the PM-thinking sections together. Ask which entry fits: Vision + Features (capability-first, for enterprise, developer products, internal tools, anyone who thinks in features), Journey-led (user-first, for consumer, UX-heavy, multi-stakeholder products; journeys with named protagonists carry persona context inline, no persona section), or let you suggest from what you heard. The entry sets the section order.

The workspace persists; the user can stop and resume at any point.

**Concerns.** As you read what the user gave you, name the concerns this product carries: compliance, integration density, operational SLAs, hardware constraints, public-API contracts, monetization, data governance, whatever applies. The list is open. These concerns choose which Adapt-In clusters to pull from the template and which sections to invent when no cluster names them.

**Form factor.** If the sources do not say, ask: mobile, web, desktop, multi-surface, hardware, API.

**User journeys are captured, not authored.** Where they are warranted (consumer, multi-stakeholder B2B, meaningful UX; drop or downscale them for a single-operator internal tool, a regulatory-only update, hobby work, a pure technical PRD), have the user narrate a real session with a named protagonist, Mary, mom of three, not "the user": what the person does, in what order, where it lands. Structure the answer into UJ-N form and confirm.

## PRD discipline

**Shape.** Features grouped; FRs nested with globally numbered stable ids. Cross-cutting NFRs in their own section; no traceability matrix. Capabilities, not implementation: tech choices go to `addendum.md`. Treat `{workflow.prd_template}` as expert prior knowledge, not a checklist. Its Essential Spine is the default: present each section unless the product genuinely does not need it, and drop one only for a reason a reviewer would accept. Its Adapt-In Menu is conditional: pull the clusters the product's concerns need, and when a concern has no cluster, invent the section, name it well and place it where it serves the reader. Reorder and combine for readability. Never include a section because it exists, never skip a concern because no section covered it. Name counter-metrics wherever Success Metrics exist.

**Length scales with stakes.** Hobby and solo PRDs run about two pages, internal tools five to eight, launch and chain-top PRDs as long as their FRs and concerns require. Detail that does not earn its place in the main narrative moves to `addendum.md`; padding the PRD to look thorough is the failure, moving overflow out is correct.

## Finalize

Tell the user the sequence in one sentence, then walk it. Polish goes last so it does not redo work after reviewer fixes.

1. **Memlog audit.** Walk `.memlog.md` with the user; each entry is captured in the PRD, in the addendum, or set aside.
2. **Input reconciliation.** One subagent per user-supplied input against the PRD and `addendum.md`. Each writes its extract to `{doc_workspace}/reconcile-{input}.md` and returns only a compact summary (input, two to five gaps, path). Surface the gaps, above all the qualitative ideas, tone, voice, feel, that FR structure silently drops. Before polish.
3. **Reviewer pass.** Run the reviewer gate in `references/validate.md`; findings stay in the conversation and no report is written. Resolve before polish.
4. **Triage open items.** Every Open Question, `[ASSUMPTION]` tag and `[NOTE FOR PM]` callout. A phase-blocker, one that would make the PRD unsafe for UX, architecture or epics, is surfaced alone and resolved; a non-blocker is deferred with an owner and a revisit condition, logged with `memlog.py append`. Many phase-blockers is itself a finding: say so.
5. **Polish.** Apply `{workflow.doc_standards}` to the PRD and `addendum.md` in declared order, structural passes before prose so prose does not polish text about to be cut. Parallel across documents, sequential within one.
6. **External handoffs.** Run `{workflow.external_handoffs}`; surface returned URLs and ids; skip and flag a tool that is unavailable.
7. **Close.** Set the PRD's frontmatter `status: final` and `updated` to today, so a later run tells this PRD from a draft. Log it: `uv run {project-root}/_bmad/scripts/memlog.py append --workspace {doc_workspace} --type event --text "PRD finalized"`. Share the artifact paths. Common next: talk to Sofia the Product Owner (`bmad-agent-po`) to write the initiative's requirements from the PRD, or update them when the initiative file exists; `bmad-ux` can run before or after; `bmad-architecture` reads the initiative file, so Sofia first. The `bmad` skill gives the authoritative route.
8. Run `{workflow.on_complete}` when it is non-empty.
