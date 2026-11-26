# Planning skills in detail

Read this when the question is about Sofia (`bmad-agent-po`), John (`bmad-agent-pm`), Sally (`bmad-agent-ux-designer`), or Winston (`bmad-agent-architect`): what each gives, when to pick it, and what it writes.

## Sofia — Product Owner (`bmad-agent-po`)

Sofia owns the **Minimal Altitude SOT** (`program-*.md`, `initiative-*.md`, `epic-*.md`), slicing, Refined Story authoring, and board management (`help/ticketing-and-epics.md`).

- **Gives:** Reconciles any input (PRD, BRD, brief, PRFAQ, UX, transcript, or notes) into `R<n>` requirements and `C<n>` constraints citing their sources, adopts `companions:` (UX and architecture docs) in one pass, and surfaces cross-artifact contradictions without inventing product or UX discovery answers.
- **Slicing & picks:** Adopts `prd-program`, `prd`, and `prd-epic` Section 9 maps verbatim. Her picks stay strictly within slicing, ordering, and board mechanics; on non-PRD inputs with no success measure, she asks what proves the work succeeded and how it will be measured, mapping every OKR baseline to an owning epic or flagging unmapped gaps.
- **Pick when:** Distilling any finished analysis/planning output into a container SOT, reconciling newly added UX/arch companions, slicing work, managing board status, or replanning mid-flight.
- **Not when:** Product discovery or UX design still needs open-ended exploration — hand off to John or Sally in a fresh chat rather than having Sofia invent product answers.
- **Writes:** `<type>-<slug>/<type>-<slug>.md` under `{output_folder}/{active_initiative}/`, `.memlog.md`, `tickets/tickets.toml`, Refined Story files (`story-<slug>.md`), and `{output_folder}/backlog/` leaves.

## John — Product Manager (`bmad-agent-pm`)

John coaches, updates, and validates product contracts matched to blast radius and stakes via `bmad-facilitate`.

- **Documents by altitude:** `prd-program` (`INIT-01`.. map + rollout strategy) or `charter` (governance, shared with Mary) at Program scale; thin `prd` (`OKR-N`, `INV-N`, `E01`.. stubs, zero granular FRs) at Initiative scale; `prd-epic` (journeys, `E0X-FR-xx`, instrumentation, Section 9 Chunky Story Slice Map, inline parent updates) at Epic scale; plus `srs`, `pitch`, `launch`, `prototype-plan`, and `experiment` (shared with Mary).
- **Modes and stakes:** Templates carry stable ids (`INIT-01`.., `E01`.., `E0X-FR-xx`) for Sofia to lift. Runs default to `freeform` (`prototype-plan` starts `fast`; `srs` starts `step-by-step`; `experiment` keeps `order: fixed`) and support switching modes anytime.
- **Pick when:** Open product questions, multiple stakeholders, compliance/SLA needs, or a launch/pitch/prototype plan needs drawing out before becoming a ticket spec.
- **Not when:** Scope is one bounded story → `(Story ->) bmad-build`. A lighter concept summary is enough → Mary (`brief`), then Sofia.
- **Customizing:** Recommend `bmad-customize` to extend templates in `_bmad/custom/facilitate-templates/` or adjust `bmad-facilitate` standards, reviewers, style, or HTML views.
- **Writes:** `{output_folder}/{active_initiative}/<id>-<slug>/<id>-<slug>.md` (inside `<epic>/<id>-<slug>/` for epic runs).

## Sally — UX Designer (`bmad-agent-ux-designer`)

Sally coaches UX strategy, branding, visual direction, product UX, websites, and UI audits via `bmad-facilitate`, leading UX-first or following a PRD.

- **Gives:** `trigger-map` (shared with Mary), `brand-identity` (`branding/` with logos, `BRAND.md`, `DESIGN.md`), `design-direction`, `ux-system` (`DESIGN.md` + system `EXPERIENCE.md`), `ux-epic` (inherits `DESIGN.md` read-only + epic flows, states, microcopy, mockups), `ux-quick`, `website-design`, and `ux-audit`, plus interactive HTML mockups and Stitch/Claude Design/Figma handoffs.
- **Pick when:** Starting UX-first, building brand/visual direction, designing UI flows before epic story slicing, or auditing an existing UI.
- **Not when:** There is no meaningful UI, or the task is pure server/SEO engineering (Winston or `bmad-build`).
- **Writes:** `{output_folder}/{active_initiative}/<id>-<slug>/` (`branding/` for `brand-identity`; `<epic>/ux-epic-<slug>/` on epics). Update UX files through Sally rather than editing tickets.

## Winston — System Architect (`bmad-agent-architect`)

Winston settles cross-cutting seams, epic tech design, RFCs, and repo readiness via `bmad-facilitate`, checking every `AD-n` against numeric `Passable` / `Good` `OKR-N` bounds and `INV-N` invariants.

- **Gives:** Delivery spines (`arch-enterprise`, `arch-spine` with Coupling Radar & Contract Index, `arch-epic` against live code with optional `contract.yaml`), proposals (`solution-design`, `tech-evaluation`, `api-design`, `decision-record`), `agent-readiness`, and risk plans (`migration-plan`, `production-readiness`, `security-review`, `postmortem`), folding AI/probabilistic guardrails and cost bounds into core templates.
- **Pick when:** Separate units could diverge on stack, schemas, or contracts; an epic needs concrete migrations/APIs against live code; a repo needs `agent-readiness` cleanup; or an RFC/migration/launch needs sign-off.
- **Not when:** One bounded story fits existing codebase patterns → `bmad-build`.
- **Writes:** `{output_folder}/{active_initiative}/<id>-<slug>/<id>-<slug>.md` (`<epic>/arch-epic-<slug>/` on epics).

## Slicing, epic inception, and multi-initiative scale

Slicing an initiative follows its PRD's Epic Map verbatim (or groups cohesive capabilities — never rollout phases — when no PRD exists) and writes thin epics (`refined: false`).

Refining an epic is a judgment call by Sofia before stories are sliced:

- When open product discovery remains, she recommends a fresh chat with John (`prd-epic`); when parent + companions already settle the capability (or the user skips the PRD), she fills the epic SOT directly and states why.
- At real stakes, for any UI-bearing epic lacking an epic-level `ux-epic` companion (an initiative-level `ux-system` does not replace it), she unpromptedly offers Sally (`ux-epic`) in a fresh chat before slicing; when stories share contracts, migrations, or state flows, she offers Winston (`arch-epic`). At hobby or personal stakes, she skips unsolicited specialist offers unless asked.
- She slices journey-shaped chunky stories (with no standalone setup or go-live stories unless asked) into 1–2 sentence `tickets.toml` entries citing `DESIGN.md`, `EXPERIENCE.md#<section>`, mockups, and `AD-n`, and authors Refined Stories (`story-<slug>.md`) at epic inception by default (or at pickup if left thin).

Work spanning several initiatives uses a top-level `program-*` container whose `tickets/tickets.toml` orders nested `tickets/initiative-*` folders (legacy parent initiatives — before converting to `type: program` — still read sibling folders cleanly). Point `core.active_initiative` at the program for rollup or at a child container for local work.
