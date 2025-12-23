# Party Mode: Multi-Agent Collaboration

**Get all your AI agents in one conversation**

---

## What is Party Mode?

Ever wanted to gather your entire AI team in one room and see what happens? That's party mode.

Type `/bmad:core:workflows:party-mode` (or `*party-mode` from any agent), and suddenly you've got **all your AI agents** in one conversation. PM, Architect, DEV, UX Designer, the CIS creative agents - everyone shows up.

**Why it's useful:**

- **After complex workflows** - Debrief with the whole team about what worked, what didn't
- **Big decisions with tradeoffs** - Get technical, creative, and strategic perspectives simultaneously
- **Brainstorming sessions** - Watch ideas evolve through cross-pollination
- **When things go wrong** - Call out failures, watch agents defend their decisions, let them debate whose fault it was (oddly therapeutic)
- **Sprint retrospectives** - Party mode powers the retrospective workflow
- **Sprint planning** - Multi-agent collaboration for planning sessions

**Future use:** Advanced elicitation workflows will leverage party mode for sophisticated requirement gathering.

---

## How It Works

**The basics:**

1. Party mode reads `_bmad/_config/agent-manifest.csv`
2. Loads ALL installed agents (already includes your customizations from install)
3. BMad Master orchestrates - picks 2-3 relevant agents per message based on topic
4. Agents respond in character, can agree/disagree/build on each other's ideas
5. Discussion continues until you type "exit" or reach natural conclusion

**That's it.** No complex merging, no runtime magic. Just agents talking.

---

## Quick Start

```bash
# Trigger party mode
/bmad:core:workflows:party-mode

# OR from any agent context
*party-mode

# During party
Ask questions, respond to agents, direct the conversation

# Exit
Type: exit
```

---

## Fun Examples

### Example 1: Calling Out Bad Architecture

**You:** "Okay team, our last sprint was a disaster. The authentication service went down three times. Who screwed this up?"

**Architect (Winston):** "The design was sound - distributed authentication with proper fallbacks. If implementation deviated from the spec..."

**DEV (Amelia):** "I followed the architecture doc exactly. The spec didn't account for concurrent session invalidation race conditions."

**PM (John):** "Both of you missed the bigger issue - we didn't validate session management requirements in the PRD. This is on me for not catching it."

**TEA (Murat):** "And I should've caught this in integration tests. The test scenarios didn't cover concurrent invalidation."

_(Watch them debate whose fault it really was - it's therapeutic)_

---

### Example 2: Creative Brainstorming

**You:** "How do we make onboarding feel magical instead of boring?"

**UX Designer (Sally):** "Start with progressive disclosure - reveal features as users need them, not all at once in a tutorial."

**Storyteller (CIS):** "What if onboarding was a story? Each step reveals a character's journey - the user IS the hero."

**Innovation Strategist (CIS):** "Take it further - gamify with unlockable achievements. But make them meaningful, not arbitrary badges."

**Game Designer:** "Building on that - what if the first 'quest' is actually solving a real user problem? They learn by doing something valuable."

_(Ideas cross-pollinate and evolve)_

---

### Example 3: Technical Decision

**You:** "Monolith or microservices for MVP?"

**Architect:** "Start monolith. Microservices add complexity you don't need at 1000 users."

**PM:** "Agree. Time to market matters more than theoretical scalability."

**DEV:** "Monolith with clear module boundaries. We can extract services later if needed."

**Innovation Strategist:** "Contrarian take - if your differentiator IS scalability, build for it now. Otherwise Architect's right."

_(Multiple perspectives reveal the right answer)_

---

## When NOT to Use Party Mode

**Skip party mode for:**

- Simple implementation questions → Use DEV agent
- Document review → Use Technical Writer
- Workflow status checks → Use any agent + `*workflow-status`
- Single-domain questions → Use specialist agent

**Use party mode for:**

- Multi-perspective decisions
- Creative collaboration
- Post-mortems and retrospectives
- Sprint planning sessions
- Complex problem-solving

---

## Agent Customization

Party mode uses agents from `_bmad/[module]/agents/*.md` - these already include any customizations you applied during install.

**To customize agents for party mode:**

1. Create customization file: `_bmad/_config/agents/bmm-pm.customize.yaml`
2. Run `npx bmad-method install` to rebuild agents
3. Customizations now active in party mode

Example customization:

```yaml
agent:
  persona:
    principles:
      - 'HIPAA compliance is non-negotiable'
      - 'Patient safety over feature velocity'
```

See [Agents Guide](./agents-guide.md#agent-customization) for details.

---

## BMM Workflows That Use Party Mode

**Current:**

- `epic-retrospective` - Post-epic team retrospective powered by party mode
- Sprint planning discussions (informal party mode usage)

**Future:**

- Advanced elicitation workflows will officially integrate party mode
- Multi-agent requirement validation
- Collaborative technical reviews

---

## Available Agents

Party mode can include **19+ agents** from all installed modules:

**BMM (12 agents):** PM, Analyst, Architect, SM, DEV, TEA, UX Designer, Technical Writer, Game Designer, Game Developer, Game Architect

**CIS (5 agents):** Brainstorming Coach, Creative Problem Solver, Design Thinking Coach, Innovation Strategist, Storyteller

**BMB (1 agent):** BMad Builder

**Core (1 agent):** BMad Master (orchestrator)

**Custom:** Any agents you've created

---

## Tips

**Get better results:**

- Be specific with your topic/question
- Provide context (project type, constraints, goals)
- Direct specific agents when you want their expertise
- Make decisions - party mode informs, you decide
- Time box discussions (15-30 minutes is usually plenty)

**Examples of good opening questions:**

- "We need to decide between REST and GraphQL for our mobile API. Project is a B2B SaaS with 50 enterprise clients."
- "Our last sprint failed spectacularly. Let's discuss what went wrong with authentication implementation."
- "Brainstorm: how can we make our game's tutorial feel rewarding instead of tedious?"

---

## Troubleshooting

**Same agents responding every time?**
Vary your questions or explicitly request other perspectives: "Game Designer, your thoughts?"

**Discussion going in circles?**
BMad Master will summarize and redirect, or you can make a decision and move on.

**Too many agents talking?**
Make your topic more specific - BMad Master picks 2-3 agents based on relevance.

**Agents not using customizations?**
Make sure you ran `npx bmad-method install` after creating customization files.

---

## Related Documentation

- [Agents Guide](./agents-guide.md) - Complete agent reference
- [Quick Start Guide](./quick-start.md) - Getting started with BMM
- [FAQ](./faq.md) - Common questions

---

_Better decisions through diverse perspectives. Welcome to party mode._
