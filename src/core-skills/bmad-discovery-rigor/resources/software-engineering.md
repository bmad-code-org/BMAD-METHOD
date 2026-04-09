# Software Engineering Domain Knowledge

_Loaded when classification indicates a software engineering problem. Provides domain-specific probes, verification patterns, and design considerations for the discovery workflow._

## When to Use

- Problem involves software design, architecture, implementation, or debugging
- Classification is Solve (any tier) or Build in a software context
- System under discussion is conventional software (no LLM in the deployed system)

## Domain-Specific Interview Probes

Use these to deepen Step 2 (Interview) questioning when the problem is software-related:

### Architecture and Design

- What is the current architecture? (Monolith, microservices, serverless, etc.)
- What patterns are in use? What was rejected and why?
- What are the system boundaries? Where does this code interact with external systems?
- Is there a formal specification or does the system rely on implicit contracts?

### State and Data Integrity

- What is the source of truth for each data entity?
- What invariants must the data maintain? ("What would break if this changed?")
- Are there race conditions, concurrent access, or distributed state issues?
- What consistency model is required? (Strong, eventual, causal)

### Type Safety and Contracts

- Does the codebase use escape hatches that bypass the type system? (e.g., `any`, `as` in TypeScript)
- Are function contracts (preconditions, postconditions) explicit or implicit?
- Where does the code trust external input without validation?

### Testing and Verification

- What is the testing strategy? (Unit, integration, e2e, property-based)
- Which critical paths lack test coverage?
- Is there a traceability matrix from requirements to test cases?

## Domain-Specific Blind-Spot Probes

Additional probes for Step 3 (Blind Spots) when category intersects with software:

| System Reality Category   | Software-Specific Probe                                                |
| ------------------------- | ---------------------------------------------------------------------- |
| Operational resilience    | What happens at 10x/100x traffic? Is there a circuit breaker?          |
| Observability             | Are distributed traces in place? Can you reconstruct a failed request? |
| Economic constraints      | What is the cloud cost at projected scale? Is there a cost ceiling?    |
| Evolution and change      | How do database migrations work? What's the deprecation strategy?      |
| Team and organization     | Who owns each service? Can they deploy independently?                  |
| Emergent behavior         | What cascading failure modes exist across service boundaries?          |
| Adversarial environment   | Is input sanitized at every boundary? Is the threat model documented?  |
| Cognitive maintainability | Could a new team member debug a production issue in this code?         |
| Partial observability     | What happens in the gap between log emission and dashboard rendering?  |
| Cross-boundary contracts  | Are producer/consumer/ownership contracts explicit or implicit? Is the interface versioned? How do you detect drift between repos? |

## Design Pattern Decision Framework

When the problem involves architectural or design decisions:

1. **State the selected pattern** and its category (creational, structural, behavioral, architectural)
2. **Justify the selection** — what problem does it solve?
3. **Name alternatives rejected** — what was considered and why not?
4. **Map to invariants** — how does the pattern preserve system invariants?

## Verification Approaches for Software

| Problem Shape                           | Primary Method           | Tool Targets                  |
| --------------------------------------- | ------------------------ | ----------------------------- |
| State integrity, guarded transitions    | Event-B / state machines | ProB, Atelier B               |
| Concurrency, message ordering, deadlock | CSP                      | FDR4, PAT                     |
| Temporal safety or liveness             | LTL                      | SPIN, NuSMV                   |
| Distributed protocols, state-space      | TLA+                     | TLC, Apalache                 |
| Bounded structural consistency          | Alloy                    | Alloy Analyzer                |
| Program contracts, proof-carrying code  | Dafny or Lean            | Dafny, Z3, Lean 4             |
| Property-based testing                  | PBT frameworks           | fast-check, Hypothesis, jqwik |

Choose the lightest method that still matches the real failure mode.

## Integration with Discovery Steps

- **Step 2 (Interview):** Use architecture and design probes to formulate questions
- **Step 3 (Blind Spots):** Use domain-specific blind-spot probes alongside System Reality Categories
- **Step 4 (Research):** Use verification approaches to structure technical research
- **Step 5 (Handoff):** Include architecture decisions, patterns, and verification strategy in Discovery Context
