# Altitudes and the fractal model

Read this when the user asks why BMad uses four altitudes, how the fractal tree works, what the Coupling Test decides, how changes ripple upward, or how Specs, Tickets, Refined Stories, and Build Plans differ.

BMad v7 replaces heavyweight upfront PRDs and separate ad-hoc fast tracks with one mirrored **Intent-Spec Tree** (`(Program) -> Initiative -> Epic -> Story`). Product, UX, and Architecture refine together just in time, entered at the lowest altitude that holds the blast radius.

## Theory of altitudes

Every altitude above Story manages only the seams between its direct children. An Initiative maps epics with zero granular FRs; an Epic defines numbered `E0X-FR-xx` requirements and delivers them through right-sized Stories.

| Altitude | Horizon | Product Spec | UX Spec | Architecture Spec |
|---|---|---|---|---|
| **0. Program** (optional) | 1–2 yr wave | North Star, wave OKRs, enterprise invariants, `INIT-01`.. map, rollout (`prd-program` or `charter`) | Optional brand and system standards (`ux-system`) | Enterprise spine (`arch-enterprise`): domain ownership, cross-domain contracts |
| **1. Initiative** (thin spine) | Upfront (days) | Problem, non-goals, tiered `OKR-N`, `INV-N`, shared nouns, `E01`.. stubs, zero FRs (`prd`) | System UX (`ux-system`): `DESIGN.md` tokens, `EXPERIENCE.md` IA, accessibility | System spine (`arch-spine`): stack, seams, auth/tenancy, telemetry, Contract Index |
| **2. Epic** (inception) | Just in time | `E0X-FR-xx`, deep journeys, rules, target OKR band, Chunky Story Map (`prd-epic` by judgment) | Epic UX (`ux-epic`): inherits `DESIGN.md`; flows, states, microcopy, mockups (or `ux-quick`) | Epic tech design (`arch-epic`): migrations, payloads, state flows vs live code (+ `contract.yaml`) |
| **3. Story** (verification unit) | Epic inception or pickup | End-to-end behavior citing `E0X-FR-xx`, Given/When/Then functional + measurement ACs | Specific `EXPERIENCE.md#<section>` and mockup files cited per UI story | Ephemeral `story-<slug>-plan.md` (`bmad-build`): files, tasks, tests, `context:` contracts |

## The coupling test

Sorting requirements by blast radius replaces "what vs. how": keep cross-child seams in the parent spine and park single-child detail in the child's Seed Lot or Story.

| Dimension | Stays in parent spine | Defers to child inception or story |
|---|---|---|
| **Product rule** | Cross-epic capability stub, `INV-N` invariant, tiered `OKR-N` and measurement rule | Detailed `E0X-FR-xx` rules, filters, toasts, retries, empty/error paths |
| **UX contract** | `DESIGN.md` visual tokens, navigation, shared primitives, accessibility floor | Per-screen flows, field microcopy, HTML mockups (`ux-epic`) |
| **Architecture** | Service boundaries, core entity ownership, auth/tenancy/audit, Contract Index | Table columns, exact API payloads, component state trees (`arch-epic`) |

Facilitation adapts to whatever parent exists via one Spine Preamble: child runs inherit the parent and ask only for deltas, standalone epics run a compact Mini-Spine header automatically, and standalone `bmad-build` scans the repo and runs a 60-second micro-preamble with a one-line success signal.

## Upward ripples and promotion

- **Upward promotion without rework:** When unsure between adjacent altitudes, start lighter; hidden coupling promotes cleanly by nesting (`epic-<slug>/` moves into `initiative-<slug>/tickets/epic-<slug>/`, and multi-initiative work nests under `program-<slug>/tickets/`) without losing prior artifacts.
- **Inline parent updates:** When `prd-epic` surfaces agreed `Changes to the parent` (shared noun, invariant, OKR, or `AD-n` impact), John updates the parent PRD inline before closing so Sofia reconciles parent and child in one pass.
- **Mid-flight replan:** When implementation uncovers broken assumptions or new constraints, ask Sofia (`REPLAN`) to update requirements, re-slice or drop affected entries, and record a dated `Decision:`.

## Spec vs ticket vs refined story vs build plan

- **Specs** (`program-*.md`, `initiative-*.md`, `epic-*.md` Minimal Altitude SOT, plus optional `prd-*`, `ux-*`, `arch-*` companions) capture agreed decisions, boundaries, and provenance.
- **Tickets** (`tickets.toml` entries) stay 1–2 outcome sentences plus `verify`, `covers`, and concrete `DESIGN.md` / `EXPERIENCE.md#<section>` / mockup / `AD-n` references.
- **Refined Stories** (`story-<slug>.md`) are verification contracts (`E0X-FR-xx`, Given/When/Then functional and measurement ACs) authored by Sofia at epic inception by default, or at pickup if left thin.
- **Build Plans** (`story-<slug>-plan.md`) belong locally to Amelia (`bmad-build`): they cite Refined Story ACs verbatim inside `<frozen-after-approval>` alongside exact files, tasks, and tests.

## Binary invariants and tiered OKRs

Binary invariants (`INV-N`, plus `BR-N` / `RULE-N` from a BRD) are pass/fail non-negotiables such as tenant isolation, RBAC, and audit trails.

Tiered OKRs (`OKR-N`) grade measurable outcomes across three bands: `Passable` (hard ship floor and rollback line), `Good` (production target), and `Excellent` (long-horizon moat guiding spine seams).

No key result stands until production measurement is named and mapped by Sofia to an owning epic (or flagged loudly as an unmapped gap), and Winston verifies proposed `AD-n` decisions against those numeric bounds and invariants.

## Mary's upstream analysis role

Mary (`bmad-agent-analyst`) owns optional pre-commitment discovery: brainstorming, `bmad-deep-recon`, `bmad-project-context`, `brief`, `prfaq`, `opportunity`, `business-case`, `narrative`, `brd`, and shared `charter` or `experiment` work.

Her outputs feed John when open product discovery still needs drawing out, or feed Sofia's Minimal Altitude SOT directly when intent is already settled.
