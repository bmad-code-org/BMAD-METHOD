# Core Workflows

Core Workflows are domain-agnostic workflows that can be utilized by any BMAD-compliant module, workflow, or agent. These workflows are installed by default and available at any time.

## Available Core Workflows

### [Party Mode](party-mode.md)

Orchestrate dynamic multi-agent conversations with your entire BMAD team. Engage with multiple specialized perspectives simultaneously—each agent maintaining their unique personality, expertise, and communication style.

### [Brainstorming](brainstorming.md)

Facilitate structured creative sessions using 60+ proven ideation techniques. The AI acts as coach and guide, using proven creativity methods to draw out ideas and insights that are already within you.

### [Advanced Elicitation](advanced-elicitation.md)

Push the LLM to rethink its work through 50+ reasoning methods—the inverse of brainstorming. The LLM applies sophisticated techniques to re-examine and enhance content it has just generated, essentially "LLM brainstorming" to find better approaches and uncover improvements.

---

## Workflow Integration

Core Workflows are designed to be invoked and configured by other modules. When called from another workflow, they accept contextual parameters to customize the session:

- **Topic focus** — Direct the session toward a specific domain or question
- **Additional personas** (Party Mode) — Inject expert agents into the roster at runtime
- **Guardrails** (Brainstorming) — Set constraints and boundaries for ideation
- **Output goals** — Define what the final output needs to accomplish

This allows modules to leverage these workflows' capabilities while maintaining focus on their specific domain and objectives.
