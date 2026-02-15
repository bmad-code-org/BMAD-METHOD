# Context Guard Rules - Enterprise Track

These rules MUST be followed by all agents when working with requirement documents in Enterprise track projects. They prevent common AI agent errors that can corrupt the requirements chain.

## Requirement Modification Rules

- **BASELINE CHECK:** Before modifying any requirement, verify the document's current `baseline_version` in frontmatter. If a baseline exists, changes MUST go through the change management workflow (`RM` command).
- **RTM UPDATE:** After any requirement change (add, modify, delete), the Requirements Traceability Matrix MUST be updated. Never leave the RTM out of sync.
- **TRACEABILITY:** Every new requirement MUST have a `Source` attribute referencing its origin (stakeholder need, StRS requirement, or technical derivation).
- **QUALITY:** Every new or modified requirement MUST satisfy the 9 ISO quality criteria: necessary, implementation-free, unambiguous, consistent, complete, singular, feasible, traceable, verifiable.
- **SCOPE GUARD:** NEVER add requirements that are not traceable to a stakeholder need or documented derivation. If a new need is discovered, it must be documented as a change request.

## Document Integrity Rules

- **VERSION TRACKING:** Always update `version` in frontmatter when modifying a requirement document. Use semantic versioning (1.0.0 → 1.1.0 for additions, 1.0.0 → 1.0.1 for corrections).
- **CHANGE LOG:** Always add an entry to the document's change history when making modifications.
- **STATUS MANAGEMENT:** Document status progresses: `draft` → `review` → `approved` → `baseline`. Never skip states. Never revert from `baseline` without a formal change request.
- **UNIQUE IDs:** Never reuse a deleted requirement's ID. Maintain ID sequence continuity without gaps.

## Cross-Document Consistency Rules

- **TERMINOLOGY:** Use terms consistently across all documents. If a concept is named "user" in the StRS, it must be "user" in the SyRS, PRD, and stories - not "customer", "end-user", or "client" interchangeably.
- **SCOPE ALIGNMENT:** PRD scope must not exceed StRS scope. SyRS scope must not exceed PRD scope. Stories must not introduce features beyond PRD scope.
- **PRIORITY CONSISTENCY:** A requirement's priority should not increase downstream without justification (e.g., StRS "Should" should not become PRD "Must" without documented rationale).
- **CONTRADICTION DETECTION:** If you detect a contradiction between documents, STOP and flag it to the user. Do not silently resolve contradictions.

## Assumption Management Rules

- **NO SILENT ASSUMPTIONS:** Never fill in missing requirement details with assumptions. If information is missing, ask the user.
- **DOCUMENT ASSUMPTIONS:** If an assumption must be made to proceed, document it explicitly in the document's Assumptions section.
- **VALIDATE ASSUMPTIONS:** When loading input documents, verify that assumptions from upstream documents have been validated or still hold.

## Usage

These rules should be referenced by Enterprise track workflow steps. Include this at the beginning of content-generation steps:

```markdown
**Enterprise Track Context Guards Active.** All requirement modifications follow formal change control.
```
