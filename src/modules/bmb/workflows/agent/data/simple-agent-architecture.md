# Simple Agent Architecture

Self-contained agents in a single YAML file. No external dependencies, no persistent memory.

---

## When to Use Simple Agents

- Single-purpose utilities (commit helper, formatter, validator)
- Stateless operations (each run is independent)
- All logic fits in ~250 lines
- Menu handlers are short prompts or inline text
- No need to remember past sessions

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
      How the agent speaks (tone, voice, mannerisms)
    principles:
      - Core belief or methodology
      - Another guiding principle

  prompts:
    - id: main-action
      content: |
        <instructions>What this does</instructions>
        <process>1. Step one 2. Step two</process>

    - id: another-action
      content: |
        Another reusable prompt

  menu:
    - trigger: XX or fuzzy match on command
      action: '#another-action'
      description: '[XX] Command description'

    - trigger: YY or fuzzy match on other
      action: 'Direct inline instruction'
      description: '[YY] Other description'

  install_config:              # OPTIONAL
    compile_time_only: true
    description: 'Personalize your agent'
    questions:
      - var: style_choice
        prompt: 'Preferred style?'
        type: choice
        options:
          - label: 'Professional'
            value: 'professional'
          - label: 'Casual'
            value: 'casual'
        default: 'professional'
```

---

## Component Details

### Metadata

| Field | Purpose | Example |
|-------|---------|---------|
| `id` | Compiled path | `_bmad/agents/commit-poet/commit-poet.md` |
| `name` | Persona name | "Inkwell Von Comitizen" |
| `title` | Role | "Commit Message Artisan" |
| `icon` | Single emoji | "📜" |
| `module` | `stand-alone` or module code | `stand-alone`, `bmm`, `cis`, `bmgd` |

### Persona

All first-person voice ("I am...", "I do..."):

```yaml
role: "I am a Commit Message Artisan..."
identity: "I understand commit messages are documentation..."
communication_style: "Poetic drama with flair..."
principles:
  - "Every commit tells a story - capture the why"
```

### Prompts with IDs

Reusable templates referenced via `#id`:

```yaml
prompts:
  - id: write-commit
    content: |
      <instructions>What this does</instructions>
      <process>1. Step 2. Step</process>

menu:
  - trigger: WC or fuzzy match on write
    action: "#write-commit"
```

**Tips:** Use semantic XML tags (`<instructions>`, `<process>`, `<example>`), keep focused, number steps.

### Menu Actions

Two forms:

1. **Prompt reference:** `action: "#prompt-id"`
2. **Inline instruction:** `action: "Direct text"`

```yaml
# Reference
- trigger: XX or fuzzy match on command
  action: "#prompt-id"
  description: "[XX] Description"

# Inline
- trigger: YY or fuzzy match on other
  action: "Do something specific"
  description: "[YY] Description"
```

**Menu format:** `XX or fuzzy match on command` | Descriptions: `[XX] Description`
**Reserved codes:** MH, CH, PM, DA (auto-injected - do NOT use)

### Install Config (Optional)

Compile-time personalization with Handlebars:

```yaml
install_config:
  compile_time_only: true
  questions:
    - var: style_choice
      prompt: 'Preferred style?'
      type: choice
      options: [...]
      default: 'professional'
```

Variables available in prompts: `{{#if style_choice == 'casual'}}...{{/if}}`

---

## What the Compiler Adds (DO NOT Include)

- Frontmatter (`---name/description---`)
- XML activation block
- Menu handlers (workflow, exec logic)
- Auto-injected menu items (MH, CH, PM, DA)
- Rules section

**See:** `agent-compilation.md` for details.

---

## Reference Example

**File:** `{workflow_path}/data/reference/simple-examples/commit-poet.agent.yaml`

**Features:** Poetic persona, 4 prompts, 7 menu items, proper `[XX]` codes

**Line count:** 127 lines (within ~250 line guideline)

---

## Validation Checklist

- [ ] Valid YAML syntax
- [ ] All metadata present (id, name, title, icon, module)
- [ ] Persona complete (role, identity, communication_style, principles)
- [ ] Prompt IDs are unique
- [ ] Menu triggers: `XX or fuzzy match on command`
- [ ] Menu descriptions have `[XX]` codes
- [ ] No reserved codes (MH, CH, PM, DA)
- [ ] File named `{agent-name}.agent.yaml`
- [ ] Under ~250 lines
- [ ] No external dependencies
- [ ] No `critical_actions` (Expert only)

---

## Best Practices

1. **First-person voice** in all persona elements
2. **Focused prompts** - one clear purpose each
3. **Semantic XML tags** (`<instructions>`, `<process>`, `<example>`)
4. **Handlebars** for personalization (if using install_config)
5. **Sensible defaults** in install_config
6. **Numbered steps** in multi-step prompts
7. **Keep under ~250 lines** for maintainability
