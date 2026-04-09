# LLM Systems Domain Knowledge

_Loaded when classification indicates a problem involving LLMs or AI agents as deployed components. Provides domain-specific probes, contract patterns, and probabilistic reasoning frameworks for the discovery workflow._

## When to Use

- System contains an LLM or AI agent as a component (not just using an LLM to help solve the problem)
- Problem involves agent behavioral contracts, tool governance, or autonomous decision-making
- Classification is Solve or Build in an LLM/agent context

## Domain-Specific Interview Probes

Use these to deepen Step 2 (Interview) questioning for LLM-based systems:

### Agent Architecture

- What is the agent's role? What actions can it take autonomously?
- What tools and APIs does the agent have access to? What are the governance limits?
- Is this a single agent or a multi-agent system? How do agents coordinate?
- What is the verification paradigm? (Pure formal, pure LLM, hybrid neuro-symbolic)

### Behavioral Contracts

- What preconditions must hold before the agent executes? (Context window state, required inputs)
- What invariants must hold across the entire session? (Never reveal system prompt, output language matches input, etc.)
- What governance boundaries exist? (Max tool calls per turn, filesystem access restrictions, etc.)
- What recovery procedures handle soft-constraint violations without terminating the session?

### Probabilistic Reasoning

Help the user reason about acceptable failure rates:

- "Out of 100 agent actions, how many failures would you tolerate before considering the system broken?"
- What is the acceptable violation tolerance (epsilon)? Use domain defaults if user cannot specify:

| Domain                   | Epsilon | Confidence (delta) | Evaluation Window (n) |
| ------------------------ | ------- | ------------------ | --------------------- |
| Chat agents / assistants | 0.05    | 0.01               | 100                   |
| Code generation          | 0.01    | 0.001              | 500                   |
| Safety-critical systems  | 0.001   | 0.0001             | 1000                  |

### Context and Session Management

- What is the maximum session length? How does performance degrade as context fills?
- Are there context summarization checkpoints?
- How are upstream model provider changes detected? Is there behavioral fingerprinting?

## Domain-Specific Blind-Spot Probes

Additional probes for Step 3 (Blind Spots) when the system involves LLMs:

| System Reality Category   | LLM-Specific Probe                                                                  |
| ------------------------- | ----------------------------------------------------------------------------------- |
| Operational resilience    | What happens when the LLM provider has an outage? Is there a fallback model?        |
| Observability             | How do you detect behavioral drift vs. normal stochastic variation?                 |
| Economic constraints      | What is the token cost per session? At projected scale, is this sustainable?        |
| Evolution and change      | How do upstream model updates affect behavior? Is there regression testing?         |
| Team and organization     | Who monitors agent behavior post-deployment? Who investigates anomalies?            |
| Emergent behavior         | What happens when chained tool calls produce unexpected compound effects?           |
| Adversarial environment   | What is the prompt injection threat model? Can tool outputs be weaponized?          |
| Cognitive maintainability | Can a new team member understand the agent's behavioral contracts?                  |
| Partial observability     | What can't you see about the agent's internal reasoning? What decisions are opaque? |
| Cross-boundary contracts  | Are skill/agent/tool interface contracts explicit? What happens when a skill is updated but its consumers are not? |

## LLM-Specific Risk Patterns

### Standard Interrogation Patterns

Use these during Step 2 or Step 3 to probe for LLM-domain failure modes:

1. **LLM-as-a-Judge risk:** If the system uses an LLM to evaluate another LLM's output, the oversight is inherently subjective. Consider deterministic verification instead.

2. **Context window degradation:** Agent performance degrades as context fills, causing early instructions to be effectively forgotten. Define maximum session length in governance.

3. **Upstream model regression:** Silent model changes by the provider alter agent behavior without code changes. Implement behavioral fingerprinting with pinned model snapshots.

4. **Hallucination in generated artifacts:** LLM output may be syntactically valid but semantically wrong. Combine static analysis with dynamic testing against formal properties.

5. **Supply chain risk:** External tools and APIs invoked by agents can be vectors for data exfiltration or prompt injection via tool output.

## Agent Contract Template (ABC Framework)

When the problem involves specifying agent behavior, capture these four components:

| Component         | Definition                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| **Preconditions** | Required state before agent executes                                    |
| **Invariants**    | Properties that must hold across the entire session                     |
| **Governance**    | Action-space constraints, tool limits, hard security boundaries         |
| **Recovery**      | Procedures for handling soft violations without terminating the session |

## Integration with Discovery Steps

- **Step 2 (Interview):** Use agent architecture and behavioral contract probes
- **Step 3 (Blind Spots):** Use LLM-specific probes alongside System Reality Categories; apply standard interrogation patterns
- **Step 4 (Research):** Use probabilistic reasoning framework to structure research on acceptable bounds
- **Step 5 (Handoff):** Include contract template, risk patterns, and epsilon/delta bounds in Discovery Context
