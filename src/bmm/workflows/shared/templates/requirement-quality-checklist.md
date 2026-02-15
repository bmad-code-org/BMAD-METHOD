# Per-Requirement Quality Checklist (ISO 29148)

Apply this checklist to EVERY individual requirement in StRS, SyRS, and PRD/SRS documents. Each requirement must satisfy all 9 quality criteria.

## The 9 Quality Criteria

### 1. Necessary

- [ ] The requirement traces to a real stakeholder need or business objective
- [ ] Removing this requirement would leave a stakeholder need unmet
- [ ] The requirement is not gold-plating (adding unnecessary complexity)

**Test:** "If we remove this requirement, would a stakeholder's need go unmet?"

### 2. Implementation-Free

- [ ] The requirement states WHAT is needed, not HOW to build it
- [ ] No technology choices are embedded (unless it IS a design constraint)
- [ ] No UI/UX specifics are included (unless it IS an interface requirement)
- [ ] The requirement could be implemented in multiple different ways

**Test:** "Could an architect choose from 3+ different implementation approaches?"

### 3. Unambiguous

- [ ] The requirement has only ONE possible interpretation
- [ ] No vague adjectives (good, fast, easy, user-friendly, intuitive, robust)
- [ ] Measurable criteria are used where applicable
- [ ] Terms are defined in the glossary or are industry-standard

**Test:** "Would 5 different engineers interpret this the same way?"

### 4. Consistent

- [ ] The requirement does NOT contradict any other requirement
- [ ] Terminology is consistent with the rest of the document
- [ ] Scope aligns with the product vision and boundaries
- [ ] No conflicting quality attribute targets (e.g., maximum security AND minimal latency)

**Test:** "Does this requirement peacefully coexist with all other requirements?"

### 5. Complete

- [ ] The requirement contains enough detail to design and test against
- [ ] All conditions and constraints are specified
- [ ] Edge cases and boundary conditions are addressed (or explicitly deferred)
- [ ] No TBD, TBC, or placeholder values remain

**Test:** "Could a developer implement this without asking clarifying questions?"

### 6. Singular

- [ ] The requirement expresses exactly ONE capability or constraint
- [ ] No compound requirements joined by "and" or "or" (split if needed)
- [ ] The requirement can be independently verified
- [ ] The requirement can be independently prioritized

**Test:** "Can I assign a single pass/fail verdict to this requirement?"

### 7. Feasible

- [ ] The requirement is technically achievable with known technology
- [ ] The requirement is achievable within the project's constraints (budget, timeline, team)
- [ ] No physical impossibilities or contradictions with laws of physics/math
- [ ] Required third-party capabilities or services are available

**Test:** "Can the team actually build this within the project constraints?"

### 8. Traceable

- [ ] The requirement has a unique identifier (ID)
- [ ] The requirement's source is documented (stakeholder, regulation, business objective)
- [ ] The requirement can be linked to downstream artifacts (design, code, tests)
- [ ] The requirement can be linked to upstream sources (StRS, business needs)

**Test:** "Can I follow this requirement from origin to implementation to test?"

### 9. Verifiable

- [ ] There exists a method to prove the requirement is satisfied
- [ ] The verification method is identified (Test, Analysis, Demonstration, Inspection)
- [ ] Acceptance criteria are clear and objective
- [ ] The verification can be performed within project constraints

**Test:** "Can I write a test or create a verification procedure for this?"

---

## Quick Reference Card

| # | Criterion | Key Question | Red Flags |
|---|-----------|-------------|-----------|
| 1 | Necessary | Would removing it leave a need unmet? | Gold-plating, nice-to-have disguised as must-have |
| 2 | Implementation-Free | Can it be built 3+ ways? | Technology names, UI specifics, algorithm choices |
| 3 | Unambiguous | Would 5 engineers agree? | "Good", "fast", "easy", "user-friendly", "robust" |
| 4 | Consistent | Does it conflict with others? | Contradicting metrics, overlapping scope |
| 5 | Complete | Can dev build without questions? | TBD, TBC, "details to follow", missing conditions |
| 6 | Singular | Can I give one pass/fail? | "and", "or" joining two capabilities |
| 7 | Feasible | Can the team actually build it? | Unrealistic targets, unavailable technology |
| 8 | Traceable | Can I follow origin → test? | Missing ID, no source reference |
| 9 | Verifiable | Can I test/prove it? | Subjective criteria, unmeasurable quality |

## Usage

**When to Apply:**
- During PRD/SRS creation (Step 9: FR synthesis, Step 10: NFR synthesis)
- During PRD validation (validation workflow)
- During StRS and SyRS review steps
- During change management (new or modified requirements)

**How to Apply:**
1. Select a requirement
2. Walk through all 9 criteria
3. Mark any failures
4. Fix failures before proceeding or flag for review
5. A requirement that fails ANY criterion needs attention

**Scoring:**
- 9/9: Requirement is high quality
- 7-8/9: Minor issues, address if time permits
- 5-6/9: Significant issues, must address before approval
- <5/9: Requirement needs rewrite
