---
type: bmad-distillate
sources:
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-android-e2e-avd.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-android-e2e-ci-failure.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-android-e2e-detox-startup.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-android-e2e-disk-space.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-ci-full-audit.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-conference-solution-id-audit.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-desktop-audio-share.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-discovery-rigor-improvements.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-electron-migration.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-playwright-migration.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-playwright-shared-helpers-2026-03-24.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-qa-screenshots-republish.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-tabs-host-module-resolution.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-trigger-title-delay.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-virtual-background-ab-toggles.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-virtual-background-broader-audit.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-virtual-background-improvements.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context-virtual-background.md'
  - '../../../../../../thinking-protocol/_bmad-output/discovery-context.md'
  - '../../../../../../thinking-protocol/_bmad-output/planning-artifacts/discovery-context.md'
  - '../../../../../../thinking-protocol/_bmad-output/planning-artifacts/epic-playwright-desktop-migration.md'
  - '../../../../../../thinking-protocol/_bmad-output/planning-artifacts/technical-design-docpipe-playwright-convergence.md'
  - '../../../../../../thinking-protocol/_bmad-output/planning-artifacts/research/technical-gas-closed-sidebar-freshness-research-2026-03-23.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/1-1-define-desktop-launcher-contract.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/1-2-create-desktop-playwright-project-and-fixture.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/1-3-consolidate-shared-helper-surface.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/1-4-port-desktop-data-and-verification-utilities.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/1-5-migrate-desktop-spec-files.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/1-6-remove-legacy-test-ownership-from-desktop-app-repo.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/deferred-work.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/sprint-status.yaml'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/tech-spec-docpipe-v1.1-editorial-layer.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/tech-spec-fix-macos-desktop-audio-screen-share-silent-success.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/tech-spec-generic-docpipe-workflow-contract.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/tech-spec-generic-docpipe.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/tech-spec-migrate-electron-tests-toda-e2e.md'
  - '../../../../../../thinking-protocol/_bmad-output/implementation-artifacts/tech-spec-virtual-background-temporary-instrumentation.md'
downstream_consumer: 'BMAD-METHOD repository improvement'
created: '2026-03-24'
token_estimate: 3887
source_total_tokens: 88547
compression_ratio: '22.8:1'
parts: 1
---

## Corpus Shape

- 37 artifacts: 20 discovery contexts, 4 planning artifacts, 13 implementation artifacts; span Solve/Quick through Full-Formal; Execute and Build classifications; all completed 2026-03-22 through 2026-03-24
- Artifact lifecycle chain: Discovery Context → Epic → Technical Design → Tech Spec → Story → Dev Agent Record → Sprint Status → Deferred Work; strongest BMAD value came from layered freeze points and explicit contract sections, not any single artifact type
- Discovery contexts consistently carried: classification, interview findings, blind spots (resolved/deferred), open items, constraints/non-goals, verification strategy, recommendation, and often a State Ledger; this is the most reusable BMAD output shape
- Implementation artifacts consistently carried: frozen intent, acceptance criteria, task checklists, dev notes (intent, technical requirements, architecture compliance, file structure, testing, constraints/non-goals, risks to avoid, references), validation notes, and dev agent record; these sections enabled bounded autonomous execution and review-ready evidence
- Planning/design artifacts separated: research facts, design decisions (numbered with rationale), workflow/operator contracts, data contracts (producer/consumer/ownership), implementation slices (with exit criteria), and verification strategy; BMAD should treat these as distinct artifact classes

## Discovery-Rigor Classification Effectiveness

- Solve/Quick (1 of 20): single-domain codebase trace; resolved via workspace evidence alone; correct classification prevented over-engineering discovery
- Solve/Structured (14 of 20): cross-boundary issues needing formal evidence gathering; discoveryCounter 0–3; predominant tier; worked well when autonomous self-serve was available
- Solve/Full-Formal (1 of 20): system-wide CI audit; high unknown count and consequence of partial fixes; appropriate depth
- Execute (3 of 20): migration, test porting, framework convergence; tier=null; worked but classification lacks signal for convergence/contract-standardization work
- Build (1 of 20): self-referential framework improvement; domain fragments identification useful here
- Gap: no classification signal for convergence work (unifying parallel systems under shared contracts); these were classified as Execute but needed contract-first downstream handoff rather than standard sprint decomposition

## Interview and Self-Serve Patterns

- 🔍 self-serve marker used 10+ times across corpus; question answered from workspace evidence without user interaction; discipline consistently applied
- Self-serve rate high: 15 of 20 contexts completed steps 1-3 autonomously; only 2 reached research step; zero returned mid-discovery asking "what should I do next"
- Interview table format (# | Question | Answer | Status) enables structured triage; Unknown status (+1 Counter) works as designed
- Common resolved topics: cross-repo dependencies, config surface vs implementation, platform scope, auth/credentials, file paths, naming schemes, prior changes
- When self-serve stuck correctly: android-e2e-detox-startup Counter hit 3 before answering "does this repro locally?"; flagged Unknown without guessing

## Blind-Spot Sweep Effectiveness

- Seven categories recurred with real findings across corpus: operational resilience, evolution and change, partial observability, cognitive maintainability, emergent behavior, economic constraints, cross-boundary commitment
- Most productive categories: operational resilience (missing preflight guards, recovery paths), evolution and change (version drift, implicit assumptions, breaking schema changes), partial observability (missing instrumentation, silent failures, unvalidated contracts)
- Blind-spot resolution triage: Resolved (address downstream) → Deferred (later phase/different owner) → Unknown (increments Counter); triage worked well
- Gap: blind spots do not probe contract surfaces (ownership boundaries, operator model, evidence provenance, compatibility rules, migration posture) when multi-system convergence is the core problem; these were surfaced ad-hoc but not guided by the standard category sweep
- Gap: no category for cross-repo contract formalization; "team and organization" is closest but doesn't probe interface definitions, versioning, or validation across repo boundaries

## Handoff and Transition Gaps

- Handoff recommendation strongly bound to classification: Counter=0+Structured → bmad-quick-dev-new-preview; Counter=0+Execute → bmad-sprint-planning; Counter≥2 → bmad-technical-research
- Non-goals/constraints repeated at handoff prevent downstream scope creep; verification strategy bundled with handoff; both patterns effective
- Gap: discovery stops at context + recommendation; successful execution still needed manual bridging to convert findings into execution slices, ownership matrices, validation matrices, review evidence expectations
- Gap: no post-handoff State Ledger inheritance; downstream skill creates independent progress tracking; discovery → implementation audit trail lost
- Gap: no standardized Implementation Checklist or Verification Artifact output from discovery; verification strategy stated in words, not as testable assertion list or acceptance criteria formalism
- Gap: no Evidence Manifest section standardizing which files, logs, commands, and self-served surfaces were consulted
- Gap: handoff verification does not reject cross-run contamination of the canonical discovery file; one mutable file can collide with isolated runs

## Artifact Structure Patterns That Worked

- Frozen-intent blocks (`<frozen-after-approval>`) lock human-owned narrative before implementation; prevents agent scope renegotiation; used across all tech specs and stories
- Boundaries & Constraints matrix (Always / Ask First / Never): clear constraint formalism clarifying fixed boundaries, human decision points, and architectural non-starters
- I/O & Edge-Case Matrix (scenario | input/state | expected output | error handling): defines contract surface before implementation; enables exhaustive edge-case coverage
- Story Dev Notes structure (Intent, Technical Requirements, Architecture Compliance, File Structure, Testing, Constraints/Non-Goals, Risks to Avoid, References): enables Copilot to parse intent and constraints predictably
- Dev Agent Record (Agent Model, Debug Log References, Completion Notes, File List, Change Log): machine-readable completion audit trail for retrospective
- Validation Notes recording how ACs were validated during implementation: audit trail proving compliance without re-running
- Deferred-work artifact: adversarial review surfaced issues captured separately so they don't block current work but aren't forgotten
- Sprint status YAML with explicit state definitions and transition rules: single source of truth for status queries
- Config schema evolution: YAML + JSON Schema model with adapter pattern, optional fields with defaults, validation as separate concern

## Contract and Ownership Patterns

- Producer/Consumer/Ownership contract triple: who produces what, who consumes what, who owns each concern; prevents ambiguous cross-repo failures
- Launcher contract pattern: typed contract covering repoPath, startCommand, readiness signal, envOverrides; preflight validation fails clearly when prerequisites missing
- Manifest extension pattern: additive optional fields (sourceId, sourceHash, generatedFrom); collision rule (fail hard on identity conflict, not silent overwrite)
- Proof vs publish isolation in single manifest: safe proof runs that don't affect live publish state
- Compliance checklist pattern: explicit verifiable questions (where do docs live, which command proves, which publishes, where is evidence written)
- Cross-platform configuration: macOS/Windows command differences resolved through config rather than hard-coded test logic

## Missing BMAD Skills Identified

- Primary: bmad-create-workflow-contract — turn discovery/design outputs into canonical workflow/operator contract for cross-repo or cross-system work; define config paths, command surface, proof vs publish, evidence locations, ownership matrix, identity rules, compatibility strategy, migration posture; the corpus repeatedly solved this manually
- Cross-repo contract formalization — no skill for defining, validating, or versioning cross-repo interfaces; needed by all migration and convergence work
- Config schema & migration — no skill for designing forward-compatible frontmatter or config schemas with migration paths; docpipe and discovery-rigor both need this
- Compliance-checklist validation — docpipe workflow contract has explicit checklist but no "validate this repo is compliant" skill
- Deferred-item capture workflow — deferred-work.md is hand-written; no formal skill to standardize when to defer vs implement now
- Frozen-intent directive — tech specs use frozen-after-approval manually; no formal skill to mark intent immutable and prevent renegotiation
- Instrumentation & benchmarking — no skill for "add metrics → run matrix → interpret results" temporary measurement harness
- Platform variance validation — no skill for designing cross-platform verification matrices or platform-specific regression detection
- Implementation slice planning — no formal skill for decomposing features into minimal viable slices with exit criteria and rollback boundaries
- Design verification operationalization — no skill to convert "design is valid only if [N conditions] pass" into test fixture inventory and condition matrix

## Discovery-Rigor Specific Improvements Needed

- Classification should recognize convergence/contract-standardization as Build/Execute signal requiring contract-first downstream handoff
- Blind-spot sweep should probe: stable identity, ownership boundaries, canonical intermediate artifacts, operator surface, evidence contracts, compatibility rules, migration posture when multi-system convergence detected
- Handoff should emit Evidence Manifest (files, logs, commands, self-served surfaces consulted) and Contract Candidates (identity, ownership, operator, evidence, compatibility) when applicable
- Research routing should allow evidence-depth override; comparative/convergence work sometimes needs research even when Counter stays below threshold
- Handoff verification should reject cross-run contamination of canonical discovery file; should enforce missing evidence provenance; should reject non-actionable open items
- Canonical artifact identity is weak; runId, artifactRole, canonicalAlias should be first-class frontmatter metadata to prevent collision between isolated discovery runs
- Artifact schema discipline is inconsistent; frontmatter field names vary across tech specs (status vs no status, different field sets); opportunity for validation
- Session state not persisted across discovery invocations; if long conversations cause context pressure and restart, prior State Ledger not re-loaded; recovery is manual
- Party-mode exploration (discovery-rigor-improvements context) identified P0=Recovery Check protocol, P1=preamble extraction, P2=session memory layer, P3=two-tier memory documentation, P4=token measurement; P0 and P3 now implemented, P1/P2/P4 still open
