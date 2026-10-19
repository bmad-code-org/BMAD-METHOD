# Working in an organization

Use this when the work belongs to a team or enterprise: a PRD already exists, a tracker such as Jira is the record, people must approve, several engineers build in parallel, or requirements change mid-flight.

## When the full path is warranted

A single builder, or a small team that already agrees, talks to Sofia the Product Owner (`bmad-agent-po`) to write the initiative and needs no PRD. Recommend the full path (PRD, architecture, requirements on every epic, tracking) only when one of these is true:

- People who did not do the thinking must approve what the product is.
- Several epics, teams, or agents build against the same decisions and must not diverge.
- A regulator, steering committee, or company process requires named documents.

Before any of this, a product manager, designer, or analyst can prototype the idea (`help/prototyping.md`).

## An existing PRD is input

- Point `bmad-prd` at the existing PRD. Validate gives a findings report and changes nothing. Create rewrites the same requirements in the shape later skills read, with `[ASSUMPTION]` tags on what it filled in.
- When the source PRD changes, run `bmad-prd` update. Tell the user never to hand-edit `prd-<slug>.md`.
- `bmad-ux` starts from the existing design system. `bmad-architecture` reads the initiative and takes the existing architecture document or codebase as input beside it.
- When the PRD and a ticket's Requirements disagree, the ticket's Requirements win and the PRD is a source: Sofia surfaces the contradiction and the user decides.

## One owner per document

Each document has one skill that writes it, so give it one owner. One person can hold several roles.

| Role | Runs | Owns |
|---|---|---|
| Product manager | `bmad-prd` | `prd-<slug>.md` and its updates |
| Designer | `bmad-ux` | `DESIGN.md`, `EXPERIENCE.md` |
| Tech lead | `bmad-architecture` | The architecture spine |
| One engineer per epic | `bmad-agent-po`, `bmad-build`, `bmad-retrospective` | That epic's requirements, stories, verdict |
| Whoever tracks the whole | `bmad-agent-po` | the ticket tree |

Several engineers can each take an epic at once. An epic-level spine inherits the parent spine's decisions as binding.

## Large initiatives

Epics are split by outcome, deployment and slice size, not by who builds them. A team that wants another rule sets `slice_to_epics` in `_bmad/custom/bmad-agent-po.toml`.

Slicing writes each epic thin. Before its stories are planned, talk to Sofia the Product Owner to refine it ("refine the booking epic"): she names what is still open, with her pick for each. On a large initiative, the user may flesh an epic out with `bmad-prd`, `bmad-ux` or `bmad-architecture` run on the epic, or `bmad-deep-recon`. Those runs land in the epic's folder and become its companions.

When the work is more than one initiative's worth, talk to Sofia the Product Owner to propose a parent initiative. It holds the Requirements and decisions its children share and the order between them, and no epics or stories. Each child is an ordinary initiative, planned and built as usual, that names the parent in `sources:`. Set the active initiative to the child being worked, or to the parent to see the whole.

## Where sign-off happens

Each moment produces a written result an approval can attach to. Advise placing existing approvals here.

| Moment | What it holds back |
|---|---|
| `bmad-prfaq` verdict | Writing the PRD |
| `bmad-prd` validate | Design and architecture work |
| Architecture spine review | Writing each epic's Requirements |
| `bmad-agent-po` planning approval | Accepting the breakdown and its dependencies |
| `bmad-retrospective` verdict | Starting the next epic |

`bmad-prfaq` and `bmad-retrospective` accept `-H` to run without a conversation.

## When requirements change

Reviewers ask for changes in whichever document they are reading. Apply the change to the document that owns it, then re-run the later skills.

1. `bmad-prd` update. It surfaces conflicts with earlier decisions before applying anything.
2. Talk to Sofia the Product Owner to update the initiative's Requirements from the PRD. Requirement ids stay stable, and she names the epics and stories that no longer match.
3. `bmad-architecture` update when a decision shared across epics changes; it reads the updated initiative.
4. Talk to Sofia the Product Owner to re-slice them. Existing plans retain status.

For a change that threatens the plan itself, talk to Sofia the Product Owner to replan first: "this changed, what now".

## Tracker integration

- Nothing syncs with Jira or any tracker automatically, in either direction.
- Repo-store status lives in each joined plan. Builds stop at `built`; the user or orchestrator marks `done`.
- Sofia can publish tickets to Jira, Linear, or GitHub. When she runs, the tracker's status is read into the leaf file as `tracker_status`. The build's own `status` stays in its separate joined plan; tracker status never drives the build (`help/ticketing-and-epics.md`).
