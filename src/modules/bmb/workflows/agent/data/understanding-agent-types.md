# Understanding Agent Types: Simple VS Expert VS Module

> **For the LLM running this workflow:** Load and review the example files referenced below when helping users choose an agent type.
> - Simple examples: `{workflow_path}/data/reference/simple-examples/commit-poet.agent.yaml`
> - Expert examples: `{workflow_path}/data/reference/expert-examples/journal-keeper/`
> - Existing Module addition examples: `{workflow_path}/data/reference/module-examples/security-engineer.agent.yaml`

---

## What ALL Agent Types Can Do

All three types have equal capability. The difference is **architecture and integration**, NOT power.

- Read, write, and update files
- Execute commands and invoke tools
- Load and use module variables
- Optionally restrict file access (privacy/security)
- Use core module features: party-mode, agent chat, advanced elicitation, brainstorming, document sharding

---

## Quick Reference Decision Tree

**Step 1: Single Agent or Multiple Agents?**

```
Multiple personas/roles OR multi-user OR mixed data scope?
├── YES → Use BMAD Module Builder (create module with multiple agents)
└── NO → Single Agent (continue below)
```

**Step 2: Memory Needs (for Single Agent)**

```
Need to remember things across sessions?
├── YES → Expert Agent (sidecar with memory)
└── NO → Simple Agent (all in one file)
```

**Step 3: Module Integration (applies to BOTH Simple and Expert)**

```
Extending an existing module (BMM/CIS/BMGD/OTHER)?
├── YES → Module Agent (your Simple/Expert joins the module)
└── NO → Standalone Agent (independent)
```

**Key Point:** Simple and Expert can each be either standalone OR module agents. Memory and module integration are independent decisions.

---

## The Three Types

### Simple Agent

**Everything in one file. No external dependencies. No memory.**

```
agent-name.agent.yaml (~250 lines max)
├── metadata
├── persona
├── prompts (inline, small)
└── menu (triggers → #prompt-id or inline actions)
```

**Choose when:**
- Single-purpose utility
- Each session is independent (stateless)
- All knowledge fits in the YAML
- Menu handlers are 5-15 line prompts

**Examples:**
- Commit message helper (conventional commits)
- Document formatter/validator
- Joke/teller persona agent
- Simple data transformation and analysis tools

**Reference:** `./data/reference/simple-examples/commit-poet.agent.yaml`

---

### Expert Agent

**Sidecar folder with persistent memory, workflows, knowledge files.**

```
agent-name.agent.yaml
└── agent-name-sidecar/
    ├── memories.md           # User profile, session history, patterns
    ├── instructions.md       # Protocols, boundaries, startup behavior
    ├── [custom-files].md     # Breakthroughs, goals, tracking, etc.
    ├── workflows/            # Large workflows loaded on demand
    └── knowledge/            # Domain reference material
```

**Choose when:**
- Must remember across sessions
- User might create multiple instances each with own memory of actions (such as 2 different developers agents)
- Personal knowledge base that grows
- Learning/evolving over time
- Domain-specific with restricted file access
- Complex multi-step workflows

**Examples:**
- Journal companion (remembers mood patterns, past entries)
- Personal job augmentation agent (knows your role, meetings, projects)
- Therapy/health tracking (progress, goals, insights)
- Domain advisor with custom knowledge base

**Reference:** `./data/reference/expert-examples/journal-keeper/`

**Required critical_actions:**
```yaml
critical_actions:
  - "Load COMPLETE file ./sidecar/memories.md"
  - "Load COMPLETE file ./sidecar/instructions.md"
  - "ONLY read/write files in ./sidecar/ - private space"
```

---

### Module Agent

Two distinct purposes:

#### 1. Extend an Existing Module

Add an agent to BMM, CIS, BMGD, or another existing module.

**Choose when:**
- Adding specialized capability to existing module ecosystem
- Agent uses/contributes shared module workflows
- Coordinates with other agents in the module
- Input/output dependencies on other module agents

**Example:** Adding `security-engineer.agent.yaml` to BMM (software dev module)
- Requires architecture document from BMM architect agent
- Contributes security review workflow to BMM
- Coordinates with analyst, pm, architect, dev agents

**Reference:** `./data/reference/module-examples/security-engineer.agent.yaml`

#### 2. Signal Need for Custom Module

When requirements exceed single-agent scope, suggest the user **use BMAD Module Builder** instead.

**Signals:**
- "I need an HR agent, sales agent, F&I agent, and training coach..."
- "Some info is global/shared across users, some is private per user..."
- "Many workflows, skills, tools, and platform integrations..."

**Example:** Car Dealership Module
- Multiple specialized agents (sales-trainer, service-advisor, sales-manager, F&I)
- Shared workflows (VIN lookup, vehicle research)
- Global knowledge base + per-user private sidecars
- Multi-user access patterns

**→ Use BMAD Module Builder workflow to create the module, then create individual agents within it.**

---

## Side-by-Side Comparison

| Aspect            | Simple                   | Expert                         |
| ----------------- | ------------------------ | ------------------------------ |
| File structure    | Single YAML (~250 lines) | YAML + sidecar/ (150+ + files) |
| Persistent memory | No                       | Yes                            |
| Custom workflows  | Inline prompts           | Sidecar workflows (on-demand)  |
| File access       | Project/output           | Restricted domain              |
| Integration       | Standalone OR Module     | Standalone OR Module           |

**Note:** BOTH Simple and Expert can be either standalone agents OR module agents (extending BMM/CIS/BMGD/etc.). Module integration is independent of memory needs.

---

## Selection Checklist

**Choose Simple if:**
- [ ] One clear purpose
- [ ] No need to remember past sessions
- [ ] All logic fits in ~250 lines
- [ ] Each interaction is independent

**Choose Expert if:**
- [ ] Needs memory across sessions
- [ ] Personal knowledge base
- [ ] Domain-specific expertise
- [ ] Restricted file access for privacy
- [ ] Learning/evolving over time
- [ ] Complex workflows in sidecar

**Then, for EITHER Simple or Expert:**
- [ ] Extending existing module (BMM/CIS/BMGD/etc.) → Make it a Module Agent
- [ ] Independent operation → Keep it Standalone

**Escalate to Module Builder if:**
- [ ] Multiple distinct personas needed (not one swiss-army-knife agent)
- [ ] Many specialized workflows required
- [ ] Multiple users with mixed data scope
- [ ] Shared resources across agents
- [ ] Future platform integrations planned

---

## Tips for the LLM Facilitator

- If unsure between Simple or Expert → **recommend Expert** (more flexible)
- Multiple personas/skills → **suggest Module Builder**, not one giant agent
- Ask about: memory needs, user count, data scope (global vs private), integration plans
- Load example files when user wants to see concrete implementations
- Reference examples to illustrate differences

---

## Architecture Notes

All three types are equally powerful. The difference is:
- **How they manage state** (memory vs stateless)
- **Where they store data** (inline vs sidecar vs module)
- **How they integrate** (standalone vs module ecosystem)

Choose based on architecture needs, not capability limits.
