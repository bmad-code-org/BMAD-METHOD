---
title: "How to Set Up Party Mode"
description: How to set up and use Party Mode for multi-agent collaboration
---

Use Party Mode to orchestrate dynamic multi-agent conversations with your entire BMad team.

## When to Use This

- Exploring complex topics that benefit from diverse expert perspectives
- Brainstorming with agents who can build on each other's ideas
- Getting comprehensive views across multiple domains
- Strategic decisions with trade-offs

:::note[Prerequisites]
- BMad Method installed with multiple agents
- Any agent loaded that supports party mode
:::

## Steps

### 1. Load Any Agent

Start with any agent that supports party mode (most do).

### 2. Start Party Mode

```
*party-mode
```

Or use the full path:
```
/bmad:core:workflows:party-mode
```

### 3. Introduce Your Topic

Present a topic or question for the group to discuss:

```
I'm trying to decide between a monolithic architecture
and microservices for our new platform.
```

### 4. Engage with the Discussion

The facilitator will:
- Select 2-3 most relevant agents based on expertise
- Let agents respond in character
- Enable natural cross-talk and debate
- Continue until you choose to exit

### 5. Exit When Ready

Type "exit" or "done" to conclude the session. Participating agents will say personalized farewells.

## What Happens

1. **Agent Roster** — Party Mode loads your complete agent roster
2. **Introduction** — Available team members are introduced
3. **Topic Analysis** — The facilitator analyzes your topic
4. **Agent Selection** — 2-3 most relevant agents are selected
5. **Discussion** — Agents respond, reference each other, engage in cross-talk
6. **Exit** — Session concludes with farewells

## Example Party Compositions

| Topic                  | Typical Agents                                                |
| ---------------------- | ------------------------------------------------------------- |
| **Product Strategy**   | PM + Innovation Strategist (CIS) + Analyst                    |
| **Technical Design**   | Architect + Creative Problem Solver (CIS) + Game Architect    |
| **User Experience**    | UX Designer + Design Thinking Coach (CIS) + Storyteller (CIS) |
| **Quality Assessment** | TEA + DEV + Architect                                         |

## Key Features

- **Intelligent agent selection** — Selects based on expertise needed
- **Authentic personalities** — Each agent maintains their unique voice
- **Natural cross-talk** — Agents reference and build on each other
- **Graceful exit** — Personalized farewells

## Tips

- **Be specific about your topic** — Better agent selection
- **Let the conversation flow** — Don't over-direct
- **Ask follow-up questions** — Go deeper on interesting points
- **Take notes on key insights** — Capture valuable perspectives
- **Use for strategic decisions** — Not routine tasks
