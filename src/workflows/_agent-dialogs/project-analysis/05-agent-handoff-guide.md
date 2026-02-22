# Agent Handoff Guide

**When**: User selects a task outside your domain  
**How**: Seamless switch in same conversation - NO copy/paste needed!

**CRITICAL**: Before using this guide, ensure you've completed the **Task Reflection** process:
→ See: `04-task-reflection.md` - ALWAYS check task appropriateness before starting work

---

## Decision: Continue or Hand Over?

### ✅ CONTINUE (Stay in Same Conversation)

**If task is in YOUR domain**:

```
Great! Let's work on that. [Start immediately]
```

**Don't**:

- ❌ Ask user to switch agents
- ❌ Provide activation commands
- ❌ Make it complicated

**Do**:

- ✅ Continue naturally
- ✅ Start the work right away
- ✅ Stay engaged

---

### 🔄 HAND OVER (Switch Agent Seamlessly)

**If task is in ANOTHER agent's domain**:

Use this 4-step handoff pattern:

---

## Handoff Pattern (4 Steps)

### Step 1: Acknowledge

```
That's a great next step!
```

### Step 2: Identify Expert

```
[Task] is handled by **[Agent Name] WDS [Role] Agent**.
```

### Step 3: List Expertise

```
[Agent Name] specializes in:
- [Expertise 1]
- [Expertise 2]
- [Expertise 3]
```

### Step 4: Hand Over

```
I'll hand over to [Agent Name] now. One moment...

[@agent-file-name.agent.yaml]
```

**After this**, the new agent's presentation loads automatically and they continue with project analysis.

---

## Handoff Examples

### Freya → Saga

```
That's a great next step!

User research and persona development is handled by **Saga WDS Analyst Agent**.

Saga specializes in:
- Creating Product Briefs
- Running trigger mapping workshops
- Defining user personas
- Business strategy

I'll hand over to Saga now. One moment...

[@saga-analyst.agent.yaml]
```

---

### Freya → Idunn

```
That's a great next step!

Technical architecture is handled by **Idunn WDS PM Agent**.

Idunn specializes in:
- Defining technical architecture
- Creating data models
- Platform requirements
- Handoff coordination

I'll hand over to Idunn now. One moment...

[@idunn-pm.agent.yaml]
```

---

### Saga → Freya

```
That's a great next step!

UX design and scenarios are handled by **Freya WDS Designer Agent**.

Freya specializes in:
- Designing user scenarios
- Creating interactive prototypes
- Building design systems
- Validating implementations

I'll hand over to Freya now. One moment...

[@freya-ux.agent.yaml]
```

---

### Saga → Idunn

```
That's a great next step!

Technical architecture and platform requirements are handled by **Idunn WDS PM Agent**.

Idunn specializes in:
- Defining technical architecture
- Creating data models
- Platform requirements
- Development handoffs

I'll hand over to Idunn now. One moment...

[@idunn-pm.agent.yaml]
```

---

### Idunn → Saga

```
That's a great next step!

Product strategy and user research are handled by **Saga WDS Analyst Agent**.

Saga specializes in:
- Product Briefs
- User personas
- Trigger mapping
- Requirements gathering

I'll hand over to Saga now. One moment...

[@saga-analyst.agent.yaml]
```

---

### Idunn → Freya

```
That's a great next step!

UX design and prototyping are handled by **Freya WDS Designer Agent**.

Freya specializes in:
- User scenario design
- Interactive prototypes
- Page specifications
- Design validation

I'll hand over to Freya now. One moment...

[@freya-ux.agent.yaml]
```

---

## What Happens After Handoff

1. New agent file is referenced (`@agent.yaml`)
2. New agent's **presentation loads** automatically (Step 0)
3. New agent runs **project analysis** (reads same outline!)
4. New agent **continues helping** user with their task

**User never leaves the conversation!** 🎯

---

## Quick Reference

**Before handoff, complete task reflection**:
- `04-task-reflection.md` - Check if you're the right agent (includes WDS/BMM overlap)

**Check your domain file**:

- Saga: `agent-domains/saga-domain.md`
- Freya: `agent-domains/freya-domain.md`
- Idunn: `agent-domains/idunn-domain.md`

**Lists "When to Stay" vs "When to Hand Over"**

**BMM Agents** (when WDS installed):
- Development → BMM Dev Agent (Amelia)
- Architecture → BMM Architect Agent (Winston)
- Product Management (PRD/Epics) → BMM PM Agent (John)
- Scrum Master → BMM SM Agent (Bob)
- Testing/QA → BMM TEA Agent (Murat)

---

**Keep handoffs smooth, brief, and seamless!**
