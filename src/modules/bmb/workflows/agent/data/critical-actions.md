# critical_actions

Activation instructions that execute every time the agent starts.

---

## Purpose

Numbered steps that execute FIRST when an agent activates.

**Use for:**
- Loading memory/knowledge files
- Setting file access boundaries
- Startup behavior (greeting enhancement, data fetch, state init)
- Any MUST-do activation behavior

**Applies to:** BOTH Simple and Expert agents

---

## Expert Agent Pattern

```yaml
# ✅ CORRECT Expert Agent
critical_actions:
  - 'Load COMPLETE file {project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md'
  - 'Load COMPLETE file {project-root}/_bmad/_memory/journal-keeper-sidecar/instructions.md'
  - 'ONLY read/write files in {project-root}/_bmad/_memory/journal-keeper-sidecar/'
  - 'Search web for biotech headlines from last 2 days, display before menu'
```

**CRITICAL Path Format:**
- `{project-root}` = literal text (not replaced)
- Sidecar created next to agent.yaml during BUILD, then copied to `_memory/` during BMAD INSTALLATION
- Use `{project-root}/_bmad/_memory/{sidecar-folder}/` format for RUNTIME paths in agent YAML

---

## Simple Agent Pattern

```yaml
# ✅ CORRECT Simple Agent with activation behavior
critical_actions:
  - 'Give user an inspirational quote before showing menu'
  - 'Review {project-root}/finances/ for most recent data file'
```

**Note:** Agents without activation needs can omit `critical_actions` entirely.

---

## Path Reference Patterns

| Type | Pattern |
|------|---------|
| Expert sidecar | `{project-root}/_bmad/_memory/{sidecar-folder}/file.md` |
| Simple data | `{project-root}/finances/data.csv` |
| Output folders | `{output_folder}/results/` |

---

## critical_actions vs principles

| critical_actions | principles |
|------------------|------------|
| Technical activation steps | Philosophical guidance |
| "Load memories.md" | "I believe in evidence" |
| MUST execute on startup | Guides decision-making |

**Grey area:** "Verify data before presenting" can be either - activation behavior vs philosophical belief. Use judgment.

---

## What the Compiler Adds (DO NOT Duplicate)

- Load persona
- Load configuration
- Menu system initialization
- Greeting/handshake

Your `critical_actions` become numbered steps AFTER compiler initialization.

---

## Common Issues

### Wrong Path Format

```yaml
# ❌ WRONG
- 'Load ./journal-keeper-sidecar/memories.md'

# ✅ CORRECT
- 'Load COMPLETE file {project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md'
```

### Missing COMPLETE Keyword

```yaml
# ❌ WRONG
- 'Load file memories.md'

# ✅ CORRECT
- 'Load COMPLETE file {project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md'
```

`COMPLETE` ensures LLM reads entire file, not a portion.

### Duplicating Compiler Functions

```yaml
# ❌ WRONG - compiler does these
- 'Load my persona'
- 'Initialize menu system'
- 'Say hello to user'

# ✅ CORRECT - agent-specific only
- 'Load memory files'
- 'Search web for headlines before menu'
```
