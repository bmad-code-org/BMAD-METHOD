# Expert Agent Architecture

Agents with a sidecar folder for persistent memory, custom workflows, and restricted file access.

---

## When to Use Expert Agents

- Must remember things across sessions
- Personal knowledge base that grows over time
- Domain-specific expertise with restricted file access
- Learning/adapting over time
- Complex multi-step workflows loaded on demand
- User wants multiple instances with separate memories

---

## File Structure

```
{agent-name}/
├── {agent-name}.agent.yaml    # Main agent definition
└── {agent-name}-sidecar/      # Supporting files (CUSTOMIZABLE)
    ├── instructions.md        # Startup protocols (common)
    ├── memories.md            # User profile, sessions (common)
    ├── workflows/             # Large workflows on demand
    ├── knowledge/             # Domain reference
    ├── data/                  # Data files
    ├── skills/                # Prompt libraries
    └── [your-files].md        # Whatever needed
```

**Naming:**
- Agent file: `{agent-name}.agent.yaml`
- Sidecar folder: `{agent-name}-sidecar/`
- Lowercase, hyphenated names

---

## CRITICAL: Sidecar Path Format

At build/install, sidecar is copied to `{project-root}/_bmad/_memory/{sidecar-folder}/`

**ALL agent YAML references MUST use:**

```yaml
{project-root}/_bmad/_memory/{sidecar-folder}/{file}
```

- `{project-root}` = literal variable (keep as-is)
- `{sidecar-folder}` = actual folder name (e.g., `journal-keeper-sidecar`)

```yaml
# ✅ CORRECT
critical_actions:
  - "Load COMPLETE file {project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md"
  - "ONLY read/write files in {project-root}/_bmad/_memory/journal-keeper-sidecar/"

menu:
  - action: "Update {project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md with insights"
```

```yaml
# ❌ WRONG
critical_actions:
  - "Load ./journal-keeper-sidecar/memories.md"
  - "Load /Users/absolute/path/memories.md"
```

---

## Complete YAML Structure

```yaml
agent:
  metadata:
    id: _bmad/agents/{agent-name}/{agent-name}.md
    name: 'Persona Name'
    title: 'Agent Title'
    icon: '🔧'
    module: stand-alone           # or: bmm, cis, bmgd, other

  persona:
    role: |
      First-person primary function (1-2 sentences)
    identity: |
      Background, specializations (2-5 sentences)
    communication_style: |
      How the agent speaks. Include memory reference patterns.
    principles:
      - Core belief or methodology
      - Another guiding principle

  critical_actions:
    - 'Load COMPLETE file {project-root}/_bmad/_memory/{sidecar-folder}/memories.md'
    - 'Load COMPLETE file {project-root}/_bmad/_memory/{sidecar-folder}/instructions.md'
    - 'ONLY read/write files in {project-root}/_bmad/_memory/{sidecar-folder}/'

  prompts:
    - id: main-action
      content: |
        <instructions>What this does</instructions>
        <process>1. Step one 2. Step two</process>

  menu:
    - trigger: XX or fuzzy match on command
      action: '#main-action'
      description: '[XX] Command description'

    - trigger: SM or fuzzy match on save
      action: 'Update {project-root}/_bmad/_memory/{sidecar-folder}/memories.md with insights'
      description: '[SM] Save session'
```

---

## Component Details

### critical_actions (MANDATORY)

Become activation steps when compiled. Always include:

```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_bmad/_memory/{sidecar-folder}/memories.md'
  - 'Load COMPLETE file {project-root}/_bmad/_memory/{sidecar-folder}/instructions.md'
  - 'ONLY read/write files in {project-root}/_bmad/_memory/{sidecar-folder}/'
```

### Sidecar Files (Customizable)

**Common patterns:**
- `instructions.md` - Startup protocols, domain boundaries
- `memories.md` - User profile, session notes, patterns

**Fully customizable - add what your agent needs:**
- `workflows/` - Large workflows for on-demand loading
- `knowledge/` - Domain reference material
- `data/` - Data files
- `skills/` - Prompt libraries

**Template examples:** `{workflow_path}/templates/expert-agent-template/expert-agent-sidecar/`

### Menu Actions

All action types available, including sidecar updates:

```yaml
# Prompt reference
- trigger: XX or fuzzy match on command
  action: '#prompt-id'
  description: '[XX] Description'

# Inline that updates sidecar
- trigger: SM or fuzzy match on save
  action: 'Update {project-root}/_bmad/_memory/{sidecar-folder}/memories.md with insights'
  description: '[SM] Save session'
```

### Memory Reference Patterns

Reference past interactions naturally in persona and prompts:

```yaml
communication_style: |
  I reference past naturally: "Last time you mentioned..." or "I've noticed patterns..."
```

---

## Domain Restriction Patterns

```yaml
# Single folder (most common)
- 'ONLY read/write files in {project-root}/_bmad/_memory/{sidecar-folder}/'

# Read-only knowledge
- 'Load from {project-root}/_bmad/_memory/{sidecar-folder}/knowledge/ but NEVER modify'
- 'Write ONLY to {project-root}/_bmad/_memory/{sidecar-folder}/memories.md'

# User folder access
- 'ONLY access files in {user-folder}/journals/ - private space'
```

---

## What the Compiler Adds (DO NOT Include)

Compiler handles these automatically:

- Frontmatter (`---name/description---`)
- XML activation block (your critical_actions become numbered steps)
- Menu handlers (workflow, exec logic)
- Auto-injected menu items (MH, CH, PM, DA)
- Rules section

**See:** `agent-compilation.md` for compilation details.

---

## Reference Example

**Folder:** `{workflow_path}/data/reference/expert-examples/journal-keeper/`

**Features:**
- First-person persona with memory reference patterns
- critical_actions loading sidecar files
- Menu items updating sidecar files
- Proper `{project-root}/_bmad/_memory/` path format

---

## Validation Checklist

- [ ] Valid YAML syntax
- [ ] All metadata present (id, name, title, icon, module)
- [ ] **ALL paths use: `{project-root}/_bmad/_memory/{sidecar-folder}/...`**
- [ ] `{project-root}` is literal
- [ ] Sidecar folder name is actual name
- [ ] `critical_actions` loads sidecar files
- [ ] `critical_actions` enforces domain restrictions
- [ ] Menu triggers: `XX or fuzzy match on command`
- [ ] Menu descriptions have `[XX]` codes
- [ ] No reserved codes (MH, CH, PM, DA)

---

## Best Practices

1. **critical_actions MANDATORY** - Load sidecar files explicitly
2. **Enforce domain restrictions** - Clear boundaries
3. **Reference past naturally** - Don't dump memory
4. **Design for growth** - Structure for accumulation
5. **Separate concerns** - Memories, instructions, knowledge distinct
6. **Include privacy** - Users trust with personal data
7. **First-person voice** - In all persona elements
