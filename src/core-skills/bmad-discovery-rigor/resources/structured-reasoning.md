# Structured Reasoning Framework

_Loaded when classification is Solve/Structured or higher. Provides a formal reasoning scaffold for problems with unknowns, multiple valid approaches, or cross-domain constraints._

## When to Use

- Tier is **Structured** or **Full Formal**
- User cannot immediately state constraints or invariants
- Multiple valid approaches exist and must be reasoned through

## Reasoning Sequence

Use this sequence to deepen analysis during interview (step 2) and blind-spot sweep (step 3). Each element feeds the next.

### 1. Axioms

Fundamental truths about the problem domain. Help the user identify these — do not assume they already know them. If the user struggles, offer candidates and ask: "Does this seem true in your domain?"

- **What is always true in this domain?**
- **What would an expert take as given?**

Check for pairwise contradictions. If found, present the contradiction and resolve before proceeding.

### 2. State Model

What exists, what changes, what must remain true.

- **Entities:** What objects, actors, or concepts exist?
- **Variables:** What properties change?
- **Invariants:** What must ALWAYS hold? ("What would break if it changed? That's your invariant.")
- **Operations:** What actions change the state? What are their preconditions and postconditions?

### 3. Behavioral Constraints

- **Safety (always):** Conditions that must hold at every point — "It is never the case that [bad thing]"
- **Liveness (eventually):** Conditions that must eventually be reached — "If [trigger], then eventually [response]"
- **Temporal order:** Things that must happen in sequence — "[A] before [B]"

### 4. Risk Categories

When populating risks, use these categories beyond logical correctness:

| Category        | What to look for                                                     |
| --------------- | -------------------------------------------------------------------- |
| Logical         | Incorrect reasoning, violated invariants, flawed assumptions         |
| Operational     | Failure modes, monitoring gaps, rollback limitations, capacity       |
| Economic        | Cost overruns, over-engineering, insufficient investment             |
| Socio-technical | Team capability gaps, ownership problems, Conway's Law               |
| Evolution       | Brittleness to change, migration risk, dependency risk               |
| Adversarial     | Security threats, abuse scenarios, supply chain risks                |
| Cognitive       | Complexity exceeding team capacity, opaque design                    |
| Emergent        | Cascading failures, feedback loops, unintended system-level behavior |

### 5. Verification Strategy

How to prove the solution is correct:

| Approach                              | When to use                                        | What it establishes                   |
| ------------------------------------- | -------------------------------------------------- | ------------------------------------- |
| Formal proof                          | Properties can be stated precisely, system bounded | Correctness within the model          |
| Statistical / property-based testing  | Large state space or stochastic behavior           | Confidence bounds, not guarantees     |
| Simulation / prototyping              | Real-world behavior hard to predict from spec      | Empirical evidence of behavior        |
| Monitoring and alerting               | Production may diverge from test behavior          | Ongoing operational correctness       |
| Chaos / resilience testing            | System must tolerate component failures            | Resilience under real conditions      |
| Threat modeling                       | System faces adversarial input                     | Security posture                      |
| Code review and cognitive walkthrough | System maintained by humans over time              | Maintainability and comprehensibility |
| A/B testing and canary deployment     | Behavioral impact hard to predict statically       | Empirical validation at scale         |

## Integration with Discovery Steps

- **Step 2 (Interview):** Use axioms, state model, and constraints to formulate deeper questions
- **Step 3 (Blind Spots):** Use risk categories to enhance System Reality Category sweep
- **Step 4 (Research):** Use verification strategy to structure research goals
- **Step 5 (Handoff):** Include axioms, invariants, and constraints in Discovery Context
