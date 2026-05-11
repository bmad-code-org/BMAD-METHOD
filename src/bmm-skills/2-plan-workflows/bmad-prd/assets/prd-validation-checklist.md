# PRD Validation Checklist

Loaded by the PRD validator subagent. For each item, return `{id, status: pass|fail|warn|n/a, severity: low|medium|high|critical, location, note}`. Skip items not applicable to the agreed stakes. Cite specific PRD locations — never abstract criticism.

## Quality

- **Q-1. Information density.** Sentences carry weight. Flag filler, hedging, and conversational padding.
- **Q-2. Measurability.** Where measurement matters, FRs and Success Metrics are measurable; subjective adjectives flagged. Counter-metrics named when Success Metrics exist.
- **Q-3. Traceability.** Where the chain matters, FRs name their link to a user journey or success criterion inline.
- **Q-4. Vision and JTBDs concrete.** Vision is specific and stands alone — not a generic feature list. JTBDs are audience-grounded, not abstract.
- **Q-5. Non-Goals explicit.** A Non-Goals section is present where it would do real work; inline `[NON-GOAL]` and `[v2]` callouts where omissions would otherwise be silently assumed.
- **Q-6. Dual-audience and self-contained.** Each section makes sense pulled out alone (cross-references via Glossary terms, not "see above"); the PRD is readable by humans and structured cleanly for downstream source-extraction by UX, architecture, and story-creation workflows.

## Discipline

- **D-1. Capabilities, not implementation.** FRs describe what users/systems can do, not how. Flag technology names, library choices, architecture decisions.
- **D-2. Input fidelity.** Requirements from input documents (brief, research, prior PRD) are still in scope or explicitly handled via Non-Goals or `[ASSUMPTION]`.
- **D-3. Personas grounded.** If personas exist, they are research-grounded or marked `[ILLUSTRATIVE]`. Each persona drives at least one decision.
- **D-4. No innovation theater.** Novelty claims are real, not invented.

## Structural integrity

- **S-1. Glossary integrity.** Every domain noun is defined in the Glossary and used identically throughout. Flag drift (case, plural, synonyms) and candidate missing-term entries.
- **S-2. ID continuity.** FR / UJ / Story IDs are contiguous, unique, and cross-references resolve.
- **S-3. Assumptions Index.** Every inline `[ASSUMPTION: ...]` appears in the Assumptions Index and vice versa.
- **S-4. Open-items density.** Count Open Questions + `[ASSUMPTION]` + `[NOTE FOR PM]`. Red flag if density is high relative to the agreed stakes.

## Stakes-gated

- **STK-1. Required sections.** The PRD includes the sections the agreed stakes and product type warrant.
