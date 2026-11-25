---
tracker_id: ""   # with remote (url): set at publish on a tracker, on a story by `tickets.py mirror`; cut on the repo store
id: [story: its tickets.toml entry id, or the folder's `next_id` if none; cut on a container]
type: [program | initiative | epic | story]
title: "[Container: its outcome. Story: what works when done]"
parent: [the parent container's folder name; none for a top-level program, initiative, standalone epic, or backlog/ story]
covers: [child initiative, epic, or story: parent ids it owns or serves; cut on a top-level container. Constraints go in References, not here]
sources: []   # every input SPEC derived Requirements from, paths from {project-root}; each is re-read on update; never the memlog
companions: []   # files downstream reads beside this ticket, written or adopted by SPEC, paths from {project-root}
after: []   # container: siblings it waits on; order is in tickets.toml. Story: prerequisites only: sibling id, "<epic id>.<entry id>", or epic-<slug>
assignee: ""   # story: only a tracker's, via `tickets.py mirror`; cut on a container
# container: add status: in-progress | done | dropped when its first ticket starts
# a story's status, assignee, blocked_at, blocked_reason live in the plan beside this file, not here; tracker_status from tracker sync
refined: false   # story: true once the user approves its criteria; on a pulled story only if its entry has `refine = true`. Epic: false while unrefined (thin from slicing or standalone intake), until refined; else cut. Cut on a program or initiative
hitl: false   # true when a person does part of the work; story only, cut on a container
risk: [low|medium|high; container: a best guess until sliced, then its children's highest]
---

<!-- Container contract: `program`, `initiative`, and `epic` files hold only the reconciled contract — Outcome, concise `R<n>`, `C<n>`, `Done when`, Boundaries, typed `References`, and `Notes`. Full PRD prose, journeys, seed lots, ADs, and UX mockups stay backlinked in `companions:` or `sources:`, never copied in. -->
<!-- Unrefined epic (`refined: false`): Description, Outcome, Boundaries, known `Done when`, parent References; Requirements and Constraints land on refine. Pulled story: Description, `Verify:`, References, local Notes. Refined Story (authored at epic inception by default, or at pickup if left thin): verification contract adding boundaries and numbered Given/When/Then functional + measurement ACs pointing to the epic ticket when one exists. Done/dropped tickets stay as written. -->

# [Title]

## Description

[Container: a short paragraph — what is true when done and why, pointing at inputs or parent. Story: 1–2 outcome sentences; with numbered criteria, 2–4 on how it advances the epic without restating them.]

## Outcome

[Container: one sentence: who benefits and what changes for them, plus the source's success measure when stated. Never points at another section of this ticket or its parent. Story: cut.]

## Requirements

[Container (`spec.md` writes from `.memlog.md`; slicing never edits it):
- Program: one `R<n> (<source ids>): <outcome>` per child initiative (`INIT-01`.. from `prd-program`, or workstreams from `charter`/`brd`).
- Initiative: one `R<n> (<source ids>): <outcome>` per epic or capability (`E01`.. from `prd`, or distilled from brief/`brd`/UX/notes).
- Epic: crisp capability `R<n>` lines grouping cohesive `E0X-FR-xx` ids explicitly in parentheses (`prd-epic`) or `parent R<m>` / source section (non-PRD), plus a dedicated `R<n>` line per instrumentation/measurement requirement.
Story (pulled unrefined): `Verify: how it will be checked`.
Refined Story (at epic inception by default, `refine = true` at pickup, bugs, or standalone): numbered Given/When/Then verification criteria citing epic `R<m>` and `E0X-FR-xx` (for epic stories; none for standalone `backlog/` leaves) — covering behavior, failure paths, and production measurement checks when required:]

1. **[Behavior or measurement name]** (R<m> / E0X-FR-xx)
   **Given** [state before]
   **When** [the one action or measurement trigger]
   **Then** [what is observable]
   **And** [another observation, if any]

## Constraints

[SPEC writes this. Program/Initiative: each design-bending invariant (`INV-N`, `RULE-N`), citing its source id or section. Epic: the parent constraints and local rules that bind it. Story: only constraints beyond its epic's; behavior that must not change goes under Boundaries.]

## Done when

[Container: three to six verifiable end checks at this altitude from the source's OKRs, measures, and limits — program: wave OKR bands and rollout gates; initiative: OKR bands and production measurement; epic: target OKR band, instrumentation, and integrated capability deliverables at its Requirements' altitude. Story: cut.]

## Boundaries

[Container: scope edges and explicit non-goals. Program: cross-domain limits and what each initiative excludes. Initiative: non-goals, one line per touched unit with no epic, and a one-sentence tracer path across epics. Epic: what belongs to siblings and local non-goals. Refined Story: adjacent behavior an implementation could break, not files; else cut.]

- Touch point: [unit] — [what is used there]; owner: epic-[slug]
- Must not change: [behavior]

## References

[`type — location, section`, location a path from {project-root} or a url. A line per source or companion SPEC adopts, typed by content (`prd`, `design`, `architecture`, `glossary`, `parent`). Initiative/Program: section pointers into sources and companions. Epic: parent Requirements plus adopted `ux-*` / `arch-*` sections. UI Story: parent epic plus `DESIGN.md`, `EXPERIENCE.md#<section>`, promoted mockups/wireframes, and any `arch-epic` / `contract.yaml` / `AD-n` anchors.]

- parent — [path or url, section Requirements]
- [companion — a file beside this one, named for its content]
- [design — ux-system-<slug>/DESIGN.md, ux-epic-<slug>/EXPERIENCE.md#<section>, ux-epic-<slug>/mockups/<screen>.html]
- [architecture — arch-epic-<slug>/arch-epic-<slug>.md (AD-n), arch-epic-<slug>/contract.yaml]

## Notes

[Only what is unsettled here and not in the repo or source, one marked line each; cut if empty. SPEC writes `Assumption:` and `Open question:` from the memlog; slicing and refining write the rest.]

- Assumption: [an unconfirmed choice; once confirmed, a dated Decision]
- Open question: [container: what the source leaves open, and who waits; story: only its own, answered in its work]
- Unknown: [the gap and the entries waiting on it; gates an entry only once copied to its `unknown` key]
- Parked: [an unplaced requirement id, why, with the user's knowledge]
- Decision: [the user's choice, dated; a declined suggestion too]
- Source conflict: [id or section — source vs code or another source]
- Waits on [container] because: [reason, one per after entry]
- Dropped: [why, before status goes to dropped]
