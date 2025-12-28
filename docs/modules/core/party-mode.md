# Party Mode

**Orchestrate dynamic multi-agent conversations with your entire BMAD team.**

Party Mode brings together all your installed BMAD agents for collaborative discussions. Instead of working with a single agent, you can engage with multiple specialized perspectives simultaneously—each agent maintaining their unique personality, expertise, and communication style.

---

## When to Use It

- Exploring complex topics that would benefit from diverse expert perspectives
- Brainstorming with agents who can build on each other's ideas
- Getting a comprehensive view across multiple domains (technical, business, creative, strategic)
- Enjoying dynamic, agent-to-agent conversations where experts challenge and complement each other

---

## How It Works

1. Party Mode loads your complete agent roster and introduces the available team members
2. You present a topic or question
3. The facilitator intelligently selects 2-3 most relevant agents based on expertise needed
4. Agents respond in character, can reference each other, and engage in natural cross-talk
5. The conversation continues until you choose to exit

---

## Key Features

- **Intelligent agent selection** — The system analyzes your topic and selects the most relevant agents based on their expertise, capabilities, and principles
- **Authentic personalities** — Each agent maintains their unique voice, communication style, and domain knowledge throughout the conversation
- **Natural cross-talk** — Agents can reference each other, build on previous points, ask questions, and even respectfully disagree
- **Optional TTS integration** — Each agent response can be read aloud with voice configurations matching their personalities
- **Graceful exit** — Sessions conclude with personalized farewells from participating agents

---

## Workflow Integration

Party Mode is a core workflow designed to be invoked and configured by other modules. When called from another workflow, it accepts contextual parameters:

| Parameter | Description |
|-----------|-------------|
| **Topic focus** | Prebias the discussion toward a specific domain or question |
| **Additional personas** | Inject expert agents into the roster at runtime for specialized perspectives |
| **Participation constraints** | Limit which agents can contribute based on relevance |

### Example

A medical module workflow could invoke Party Mode with expert doctor personas added to the roster, and the conversation pre-focused on a specific diagnosis or treatment decision. The agents would then discuss the medical case with appropriate domain expertise while maintaining their distinct personalities and perspectives.
