# Agent Menu Patterns

Technical reference for creating agent menu items in YAML.

---

## Menu Item Structure

Every menu item requires:

```yaml
- trigger: XX or fuzzy match on command-name
  [handler]: [value]
  description: '[XX] Display text here'
  data: [optional]   # Pass file to workflow
```

**Required fields:**
- `trigger` - Format: `XX or fuzzy match on command-name` (XX = 2-letter code, command-name = what user says)
- `description` - Must start with `[XX]` code
- Handler - Either `action` (Simple/Expert) or `exec` (Module)

**Reserved codes (do NOT use):** MH, CH, PM, DA (auto-injected by compiler)

---

## Handler Types

### Action Handler

For Simple/Expert agents with self-contained operations.

```yaml
# Reference prompt by ID
- trigger: WC or fuzzy match on write-commit
  action: '#write-commit'
  description: '[WC] Write commit message'

# Direct inline instruction
- trigger: QC or fuzzy match on quick-commit
  action: 'Generate commit message from diff'
  description: '[QC] Quick commit from diff'
```

**When to use:** Simple/Expert agents. Use `#id` for complex multi-step prompts, inline text for simple operations.

### Workflow Handler

For module agents referencing external workflow files.

```yaml
- trigger: CP or fuzzy match on create-prd
  exec: '{project-root}/_bmad/bmm/workflows/create-prd/workflow.md'
  description: '[CP] Create Product Requirements Document'

- trigger: GB or fuzzy match on brainstorm
  exec: '{project-root}/_bmad/core/workflows/brainstorming/workflow.md'
  description: '[GB] Guided brainstorming session'

# Planned but unimplemented
- trigger: FF or fuzzy match on future-feature
  exec: 'todo'
  description: '[FF] Coming soon'
```

**When to use:** Module agents, multi-step workflows, complex processes. Use `exec: 'todo'` for unimplemented features.

### Data Parameter (Optional)

Add to ANY handler to pass files to the workflow/action.

```yaml
- trigger: TS or fuzzy match on team-standup
  exec: '{project-root}/_bmad/bmm/tasks/team-standup.md'
  data: '{project-root}/_bmad/_config/agent-manifest.csv'
  description: '[TS] Run team standup'

- trigger: AM or fuzzy match on analyze-metrics
  action: 'Analyze these metrics for trends'
  data: '{project-root}/_data/metrics.json'
  description: '[AM] Analyze metrics'
```

**When to use:** Workflow needs input file, action processes external data.

---

## Prompts Section

For Simple/Expert agents, define reusable prompts referenced by `action: '#id'`.

```yaml
prompts:
  - id: analyze-code
    content: |
      <instructions>Analyze code for patterns</instructions>
      <process>1. Identify structure 2. Check issues 3. Suggest improvements</process>

menu:
  - trigger: AC or fuzzy match on analyze-code
    action: '#analyze-code'
    description: '[AC] Analyze code patterns'
```

**Common XML tags:** `<instructions>`, `<process>`, `<example>`, `<output_format>`

---

## Path Variables

**Always use variables, never hardcoded paths:**

```yaml
# ✅ CORRECT
exec: '{project-root}/_bmad/core/workflows/brainstorming/workflow.md'
data: '{project-root}/_data/metrics.csv'

# ❌ WRONG
exec: '../../../core/workflows/brainstorming/workflow.md'
```

**Available variables:**
- `{project-root}` - Project root directory
- `{output_folder}` - Document output location
- `{user_name}` - User's name from config
- `{communication_language}` - Language preference

**Expert Agent sidecar paths:**
```yaml
# Agent YAML referencing sidecar files
action: 'Update {project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md with insights'
```

---

## Creation Thought Process

When creating menu items, follow this sequence:

1. **User capability** → "Check code for issues"
2. **Choose code** → `LC` (Lint Code)
3. **Write trigger** → `LC or fuzzy match on lint-code`
4. **Choose handler** → `action` (inline is simple enough)
5. **Write description** → `[LC] Lint code for issues`

Result:
```yaml
- trigger: LC or fuzzy match on lint-code
  action: 'Check code for common issues and anti-patterns'
  description: '[LC] Lint code for issues'
```

---

## Complete Examples

### Simple Agent Menu

```yaml
prompts:
  - id: format-code
    content: |
      <instructions>Format code to style guidelines</instructions>
      <process>1. Indentation 2. Spacing 3. Naming</process>

menu:
  - trigger: FC or fuzzy match on format-code
    action: '#format-code'
    description: '[FC] Format code to style guidelines'

  - trigger: LC or fuzzy match on lint-code
    action: 'Check code for common issues and anti-patterns'
    description: '[LC] Lint code for issues'

  - trigger: SI or fuzzy match on suggest-improvements
    action: 'Suggest improvements following project-context.md guidelines'
    description: '[SI] Suggest improvements'
```

### Expert Agent Menu

```yaml
critical_actions:
  - 'Load COMPLETE file {project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md'
  - 'Load COMPLETE file {project-root}/_bmad/_memory/journal-keeper-sidecar/instructions.md'
  - 'ONLY read/write files in {project-root}/_bmad/_memory/journal-keeper-sidecar/'

prompts:
  - id: guided-entry
    content: |
      <instructions>Guide through journal entry</instructions>

menu:
  - trigger: WE or fuzzy match on write-entry
    action: '#guided-entry'
    description: '[WE] Write journal entry'

  - trigger: QC or fuzzy match on quick-capture
    action: 'Save entry to {project-root}/_bmad/_memory/journal-keeper-sidecar/entries/entry-{date}.md'
    description: '[QC] Quick capture'

  - trigger: SM or fuzzy match on save-memory
    action: 'Update {project-root}/_bmad/_memory/journal-keeper-sidecar/memories.md with insights'
    description: '[SM] Save session'
```

### Module Agent Menu

```yaml
menu:
  - trigger: WI or fuzzy match on workflow-init
    exec: '{project-root}/_bmad/bmm/workflows/workflow-status/workflow.md'
    description: '[WI] Initialize workflow path'

  - trigger: BS or fuzzy match on brainstorm
    exec: '{project-root}/_bmad/core/workflows/brainstorming/workflow.md'
    description: '[BS] Guided brainstorming [K,T,A,B,C]'

  - trigger: CP or fuzzy match on create-prd
    exec: '{project-root}/_bmad/bmm/workflows/create-prd/workflow.md'
    description: '[CP] Create PRD'
```

---

## Key Patterns to Remember

1. **Triggers always:** `XX or fuzzy match on command-name`
2. **Descriptions always:** `[XX] Display text`
3. **Reserved codes:** MH, CH, PM, DA (never use)
4. **Codes must be:** Unique within each agent
5. **Paths always:** `{project-root}` variable, never relative
6. **Expert sidecars:** `{project-root}/_bmad/_memory/{sidecar-folder}/`
