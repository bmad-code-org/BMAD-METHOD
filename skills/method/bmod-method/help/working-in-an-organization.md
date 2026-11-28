# Working in an organization

Use this when the work belongs to a team or enterprise: a PRD already exists, a tracker such as Jira is the record, people must approve, several engineers build in parallel, or requirements change mid-flight.

## When the full path is warranted

A single builder or small aligned team can work directly from Sofia (`bmad-agent-po`) or `(Story ->) bmad-build` without a formal PRD. Recommend the full path (`prd`, `ux-system` if UI-bearing, `arch-spine`, epic inception, and tracking) when one of these holds:

- People outside the core builders must review and approve what gets built.
- Several epics, teams, or parallel coding agents share contracts and must not diverge.
- A regulator, steering committee, or compliance process mandates named artifacts.

Before committing, an analyst, PM, or designer can prototype to validate the concept (`help/prototyping.md`).

## An existing PRD is input

- Point John (`bmad-agent-pm`) at the existing PRD: `validate` yields read-only findings, while `create` reshapes it into an altitude-appropriate `prd` (tagging inferred gaps as `[ASSUMPTION]`). Tell users not to hand-edit generated `prd-<slug>.md` files directly.
- Sally (`bmad-agent-ux-designer`) builds on any existing design system; Winston (`bmad-agent-architect`) reads the initiative alongside existing architecture docs or live code.
- When an upstream PRD and Sofia's Minimal Altitude SOT conflict, Sofia surfaces the contradiction for the human to settle.

## One owner per document

Each artifact has one owning skill, though one person may wear several hats:

| Role | Skill | Owns |
|---|---|---|
| Analyst | `bmad-agent-analyst` | `brief`, `prfaq`, `opportunity`, `business-case`, `narrative`, `brd`, plus `trigger-map` / `charter` / `experiment` |
| Product manager | `bmad-agent-pm` | `prd-program`, `prd`, `prd-epic`, `srs`, `pitch`, `launch`, `prototype-plan`, plus `charter` / `experiment` |
| Designer | `bmad-agent-ux-designer` | `DESIGN.md`, `EXPERIENCE.md`, `BRAND.md`, mockups (`ux-system`, `ux-epic`, `ux-quick`, `brand-identity`) |
| Architect | `bmad-agent-architect` | `arch-enterprise`, `arch-spine`, `arch-epic` (+ `contract.yaml`), RFCs, readiness, and ADR/security plans |
| Epic owner | `bmad-agent-po`, `bmad-build`, `bmad-retrospective` | Epic SOT, stories, builds, and epic retrospective |
| Portfolio / board owner | `bmad-agent-po` | Fractal ticket tree and tracker sync |

Several engineers can execute separate epics in parallel once the parent spine (`arch-spine` / `ux-system`) locks shared boundaries; each epic inherits its parent's invariants and contracts.

## Large initiatives and programs

Epics slice cohesive capabilities, never team org charts. Thin epics (`refined: false`) wait until Epic Inception to expand: Sofia flags when a fresh-chat `prd-epic` from John is needed, and offers fresh-chat Sally (`ux-epic`) and Winston (`arch-epic`) runs before slicing stories.

Work spanning multiple initiatives uses a top-level **`program-<slug>/`** container (`prd-program` for rollout waves and `INIT-01`.. maps, or `charter` for governance, plus `arch-enterprise` when initiatives share technical seams). Nested `tickets/initiative-<slug>/` folders hold each initiative's epics and stories, and `core.active_initiative` points either at the program for rollup or at a specific child initiative.

## Where sign-off happens

| Moment | Gate |
|---|---|
| Mary's PRFAQ verdict | Committing to a full PRD |
| John's PRD validation | Downstream UX and architecture alignment |
| Architecture spine review | Expanding child epics |
| `bmad-agent-po` slicing approval | Locking the breakdown and dependencies |
| `bmad-retrospective` verdict | Closing an epic and pulling the next |

Mary's PRFAQ supports headless mode when requested, and `bmad-retrospective` accepts `-H` for non-interactive runs.

## When requirements change

Apply changes in the owning source document first, then cascade downstream in fresh chats:

1. Ask John to update the owning `prd` or `prd-epic` (which surfaces conflicts with prior decisions).
2. Ask Sofia to reconcile the updated source into the ticket tree while keeping `R<n>` ids stable and flagging stale stories.
3. Ask Winston (`bmad-agent-architect`) to update `arch-spine` or `arch-epic` if cross-epic or seam contracts shifted.
4. Have Sofia re-slice or drop affected entries while preserving live plans and completed work.

For mid-build pivots or technical blockers, start with Sofia (`"this changed, what now"`) to `REPLAN` before writing new code.

## Tracker integration

- Nothing syncs automatically with Jira, Linear, or GitHub Issues. Publication follows `publication`: `at_inception` offers to publish the agreed set after validation, while `on_start` publishes each unpublished ticket when the user approves starting it (headless runs follow the configured policy, and explicit requests publish anytime).
- Each story's local plan tracks `status` (builds stop at `built` for human or orchestrator `done` sign-off), independent of `tracker_status` on leaf files (`help/ticketing-and-epics.md`).
