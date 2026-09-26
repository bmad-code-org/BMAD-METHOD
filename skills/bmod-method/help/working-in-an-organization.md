# Working in an organization

Use this when the work belongs to a team or enterprise: a PRD already exists, a tracker such as Jira is the record, people must approve, several engineers build in parallel, or requirements change mid-flight.

## When the full path is warranted

A single builder, or a small team that already agrees, goes straight to `bmad-spec` and needs no PRD. Recommend the full path (PRD, architecture, one spec per epic, tracking) only when one of these is true:

- People who did not do the thinking must approve what the product is.
- Several epics, teams, or agents build against the same decisions and must not diverge.
- A regulator, steering committee, or company process requires named documents.

Before any of this, a product manager, designer, or analyst can prototype the idea (`help/prototyping.md`).

## An existing PRD is input

- Point `bmad-prd` at the existing PRD. Validate gives a findings report and changes nothing. Create rewrites the same requirements in the shape later skills read, with `[ASSUMPTION]` tags on what it filled in.
- When the source PRD changes, run `bmad-prd` update. Tell the user never to hand-edit `prd.md`.
- `bmad-ux` and `bmad-architecture` start from the existing design system, architecture document, or codebase.

## One owner per document

Each document has one skill that writes it, so give it one owner. One person can hold several roles.

| Role | Runs | Owns |
|---|---|---|
| Product manager | `bmad-prd` | `prd.md` and its updates |
| Designer | `bmad-ux` | `DESIGN.md`, `EXPERIENCE.md` |
| Tech lead | `bmad-architecture` | The architecture spine |
| One engineer per epic | `bmad-spec`, `bmad-build`, `bmad-retrospective` | That epic's spec, stories, verdict |
| Whoever tracks the whole | `bmad-preview-ticketing` | the ticket tree |

Several engineers can each take an epic at once. An epic-level spine inherits the parent spine's decisions as binding.

## Where sign-off happens

Each moment produces a written result an approval can attach to. Advise placing existing approvals here.

| Moment | What it holds back |
|---|---|
| `bmad-prfaq` verdict | Writing the PRD |
| `bmad-prd` validate | Design and architecture work |
| Architecture spine review | Writing epic specs |
| `bmad-preview-ticketing` planning approval | Accepting the breakdown and its dependencies |
| `bmad-retrospective` verdict | Starting the next epic |

`bmad-prfaq` and `bmad-retrospective` accept `-H` to run without a conversation.

## When requirements change

Reviewers ask for changes in whichever document they are reading. Apply the change to the document that owns it, then re-run the later skills.

1. `bmad-prd` update. It surfaces conflicts with earlier decisions before applying anything.
2. `bmad-architecture` update when a decision shared across epics changes.
3. `bmad-spec` for each affected epic. Capability ids stay stable, and it says which stories no longer match.
4. Story breakdown or `bmad-preview-ticketing` again. Existing plans retain status.

For a change that threatens the plan itself, run `bmad-correct-course` first. It needs a PRD or a spec.

## Tracker integration

- Nothing syncs with Jira or any tracker automatically, in either direction.
- Repo-store status lives in each joined plan. Builds stop at `built`; the user or orchestrator marks `done`.
- `bmad-preview-ticketing` can publish tickets to Jira, Linear, or GitHub. When the skill runs, the tracker's status is read into the leaf file as `tracker_status`. The build's own `status` stays in its separate joined plan; tracker status never drives the build (`help/ticketing-and-epics.md`).
