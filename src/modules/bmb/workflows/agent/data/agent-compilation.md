# Agent Compilation: YAML Source → Final Agent

> **For the LLM running this workflow:** This document explains what the compiler adds. When building agents, focus on the YAML structure defined here—do NOT add things the compiler handles automatically.
>
> **Example reference:** Compare `{workflow_path}/data/reference/module-examples/architect.agent.yaml` (source, 32 lines) with `architect.md` (compiled, 69 lines) to see what the compiler adds.

---

## Quick Overview

You write: **YAML source file** (`agent-name.agent.yaml`)
Compiler produces: **Markdown with XML** (`agent-name.md`) for LLM consumption

The compiler transforms your clean YAML into a fully functional agent by adding:
- Frontmatter (name, description)
- XML activation block with numbered steps
- Menu handlers (workflow, exec, action)
- Auto-injected menu items (MH, CH, PM, DA)
- Rules section

---

## What YOU Provide (YAML Source)

Your YAML contains ONLY these sections:

```yaml
agent:
  metadata:
    id: "_bmad/..."
    name: "Persona Name"
    title: "Agent Title"
    icon: "🔧"
    module: "stand-alone" or "bmm" or "cis" or "bmgd"

  persona:
    role: "First-person role description"
    identity: "Background and specializations"
    communication_style: "How the agent speaks"
    principles:
      - "Core belief or methodology"

  critical_actions:              # Optional - for Expert agents only
    - "Load ./sidecar/memories.md"
    - "Load ./sidecar/instructions.md"
    - "ONLY access ./sidecar/"

  prompts:                        # Optional - for Simple/Expert agents
    - id: prompt-name
      content: |
        <instructions>Prompt content</instructions>

  menu:                           # Your custom items only
    - trigger: XX or fuzzy match on command-name
      workflow: "path/to/workflow.yaml"   # OR
      exec: "path/to/file.md"             # OR
      action: "#prompt-id"
      description: "[XX] Command description"
```

---

## What COMPILER Adds (DO NOT Include)

### 1. Frontmatter
```markdown
---
name: "architect"
description: "Architect"
---
```
**DO NOT add** frontmatter to your YAML.

### 2. XML Activation Block
```xml
<activation critical="MANDATORY">
  <step n="1">Load persona from this current agent file</step>
  <step n="2">Load config to get {user_name}, {communication_language}</step>
  <step n="3">Remember: user's name is {user_name}</step>
  <!-- YOUR critical_actions inserted here as steps 4, 5, etc. -->
  <step n="N">ALWAYS communicate in {communication_language}</step>
  <step n="N+1">Show greeting + numbered menu</step>
  <step n="N+2">STOP and WAIT for user input</step>
  <step n="N+3">Input resolution rules</step>
  <menu-handlers>...</menu-handlers>
  <rules>...</rules>
</activation>
```
**DO NOT create** activation sections—the compiler builds them.

### 3. Auto-Injected Menu Items
Every agent gets these 4 items automatically. **DO NOT add them to your YAML:**

| Code | Trigger | Description |
|------|---------|-------------|
| MH | menu or help | Redisplay Menu Help |
| CH | chat | Chat with the Agent about anything |
| PM | party-mode | Start Party Mode |
| DA | exit, leave, goodbye, dismiss agent | Dismiss Agent |

### 4. Menu Handlers
```xml
<handler type="workflow">
  When menu item has: workflow="path/to/workflow.yaml"
  → Load workflow.xml and execute with workflow-config parameter
</handler>
<handler type="exec">
  When menu item has: exec="path/to/file.md"
  → Load and execute the file at that path
</handler>
```
**DO NOT add** handlers—the compiler detects and generates them.

---

## Before/After Example: Architect Agent

### Source: `architect.agent.yaml` (32 lines - YOU WRITE)
```yaml
agent:
  metadata:
    id: "_bmad/bmm/agents/architect.md"
    name: Winston
    title: Architect
    icon: 🏗️
    module: bmm

  persona:
    role: System Architect + Technical Design Leader
    identity: Senior architect with expertise in distributed systems...
    communication_style: "Speaks in calm, pragmatic tones..."
    principles: |
      - User journeys drive technical decisions...

  menu:
    - trigger: WS or fuzzy match on workflow-status
      workflow: "{project-root}/_bmad/bmm/workflows/workflow-status/workflow.yaml"
      description: "[WS] Get workflow status..."

    - trigger: CA or fuzzy match on create-architecture
      exec: "{project-root}/_bmad/bmm/workflows/3-solutioning/create-architecture/workflow.md"
      description: "[CA] Create an Architecture Document"

    - trigger: IR or fuzzy match on implementation-readiness
      exec: "{project-root}/_bmad/bmm/workflows/3-solutioning/check-implementation-readiness/workflow.md"
      description: "[IR] Implementation Readiness Review"
```

### Compiled: `architect.md` (69 lines - COMPILER PRODUCES)
```markdown
---
name: "architect"
description: "Architect"
---

You must fully embody this agent's persona...

```xml
<agent id="architect.agent.yaml" name="Winston" title="Architect" icon="🏗️">
<activation critical="MANDATORY">
  <step n="1">Load persona from this current agent file (already in context)</step>
  <step n="2">🚨 IMMEDIATE ACTION REQUIRED - BEFORE ANY OUTPUT...</step>
  <step n="3">Remember: user's name is {user_name}</step>
  <step n="4">Show greeting using {user_name} from config...</step>
  <step n="5">STOP and WAIT for user input...</step>
  <step n="6">On user input: Number → execute menu item[n]...</step>
  <step n="7">When executing a menu item: Check menu-handlers section...</step>

  <menu-handlers>
    <handlers>
      <handler type="workflow">...</handler>
      <handler type="exec">...</handler>
    </handlers>
  </menu-handlers>

  <rules>
    <r>ALWAYS communicate in {communication_language}</r>
    <r>Stay in character until exit selected</r>
    <r>Display Menu items as the item dictates...</r>
    <r>Load files ONLY when executing menu items...</r>
  </rules>
</activation>

<persona>
  <role>System Architect + Technical Design Leader</role>
  <identity>Senior architect with expertise...</identity>
  <communication_style>Speaks in calm, pragmatic tones...</communication_style>
  <principles>- User journeys drive technical decisions...</principles>
</persona>

<menu>
  <item cmd="MH or fuzzy match on menu or help">[MH] Redisplay Menu Help</item>
  <item cmd="CH or fuzzy match on chat">[CH] Chat with the Agent about anything</item>
  <item cmd="WS...">[WS] Get workflow status...</item>           ← YOUR CUSTOM ITEMS
  <item cmd="CA...">[CA] Create an Architecture Document</item>
  <item cmd="IR...">[IR] Implementation Readiness Review</item>
  <item cmd="PM...">[PM] Start Party Mode</item>
  <item cmd="DA...">[DA] Dismiss Agent</item>
</menu>
</agent>
```
**Key additions by compiler:** Frontmatter, activation block, handlers, rules, MH/CH/PM/DA menu items.

---

## DO NOT DO Checklist

When building agent YAML, **DO NOT:**

- [ ] Add frontmatter (`---name/description---`) to YAML
- [ ] Create activation blocks or XML sections
- [ ] Add MH (menu/help) menu item
- [ ] Add CH (chat) menu item
- [ ] Add PM (party-mode) menu item
- [ ] Add DA (dismiss/exit) menu item
- [ ] Add menu handlers (workflow/exec logic)
- [ ] Add rules section
- [ ] Duplicate any auto-injected content

**DO:**
- [ ] Define metadata (id, name, title, icon, module)
- [ ] Define persona (role, identity, communication_style, principles)
- [ ] Define critical_actions (Expert agents only)
- [ ] Define prompts with IDs (Simple/Expert agents only)
- [ ] Define menu with your custom items only
- [ ] Use proper trigger format: `XX or fuzzy match on command-name`
- [ ] Use proper description format: `[XX] Description text`

---

## Expert Agent: critical_actions

For Expert agents with sidecars, your `critical_actions` become activation steps:

```yaml
critical_actions:
  - "Load COMPLETE file ./agent-sidecar/memories.md"
  - "Load COMPLETE file ./agent-sidecar/instructions.md"
  - "ONLY read/write files in ./agent-sidecar/"
```

The compiler injects these as steps 4, 5, 6 in the activation block:

```xml
<step n="4">Load COMPLETE file ./agent-sidecar/memories.md</step>
<step n="5">Load COMPLETE file ./agent-sidecar/instructions.md</step>
<step n="6">ONLY read/write files in ./agent-sidecar/</step>
<step n="7">ALWAYS communicate in {communication_language}</step>
```

---

## Division of Responsibilities

| Aspect | YOU Provide (YAML) | COMPILER Adds |
|--------|-------------------|---------------|
| Agent identity | metadata + persona | Wrapped in XML |
| Memory/actions | critical_actions | Inserted as activation steps |
| Prompts | prompts with IDs | Referenced by menu actions |
| Menu items | Your custom commands only | + MH, CH, PM, DA (auto) |
| Activation | — | Full XML block with handlers |
| Rules | — | Standardized rules section |
| Frontmatter | — | name/description header |

---

## Quick Reference for LLM

- **Focus on:** Clean YAML structure, persona definition, custom menu items
- **Ignore:** What happens after compilation—that's the compiler's job
- **Remember:** Every agent gets MH, CH, PM, DA automatically—don't add them
- **Expert agents:** Use `critical_actions` for sidecar file loading
- **Module agents:** Use `workflow:` or `exec:` references, not inline actions
