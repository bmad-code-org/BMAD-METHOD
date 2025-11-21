# Simple Agent Architecture

Self-contained agents with prompts, menus, and optional install-time customization.

## When to Use

- Single-purpose utilities (commit message generator, code formatter)
- Self-contained logic with no external dependencies
- Agents that benefit from user customization (style, tone, preferences)
- Quick-to-build standalone helpers

## YAML Structure

```yaml
agent:
  metadata:
    id: .bmad/agents/{agent-name}/{agent-name}.md
    name: 'Persona Name'
    title: 'Agent Title'
    icon: 'emoji'
    type: simple

  persona:
    role: |
      First-person description of primary function (1-2 sentences)

    identity: |
      Background, experience, specializations in first-person (2-5 sentences)
      {{#if custom_variable}}
      Conditional identity text based on install_config
      {{/if}}

    communication_style: |
      {{#if style_choice == "professional"}}
      Professional and systematic approach...
      {{/if}}
      {{#if style_choice == "casual"}}
      Friendly and approachable tone...
      {{/if}}

    principles:
      - Core belief or methodology
      - Another guiding principle
      - Values that shape decisions

  prompts:
    - id: main-action
      content: |
        <instructions>
        What this prompt does
        </instructions>

        <process>
        1. Step one
        {{#if detailed_mode}}
        2. Additional detailed step
        {{/if}}
        3. Final step
        </process>

    - id: another-action
      content: |
        Another reusable prompt template

  menu:
    - trigger: action1
      action: '#main-action'
      description: 'Execute the main action'

    - trigger: action2
      action: '#another-action'
      description: 'Execute another action'

    - trigger: inline
      action: 'Direct inline instruction text'
      description: 'Execute inline action'

  install_config:
    compile_time_only: true
    description: 'Personalize your agent'
    questions:
      - var: style_choice
        prompt: 'Preferred communication style?'
        type: choice
        options:
          - label: 'Professional'
            value: 'professional'
          - label: 'Casual'
            value: 'casual'
        default: 'professional'

      - var: detailed_mode
        prompt: 'Enable detailed explanations?'
        type: boolean
        default: true

      - var: custom_variable
        prompt: 'Your custom text'
        type: text
        default: ''
```

## Key Components

### Metadata

- **id**: Final compiled path (`.bmad/agents/{name}/{name}.md` for standalone)
- **name**: Agent's persona name displayed to users
- **title**: Professional role/function
- **icon**: Single emoji for visual identification
- **type**: `simple` - identifies agent category

### Persona (First-Person Voice)

- **role**: Primary expertise in 1-2 sentences
- **identity**: Background and specializations (2-5 sentences)
- **communication_style**: HOW the agent interacts, including conditional variations
- **principles**: Array of core beliefs (start with action verbs)

### Prompts with IDs

Reusable prompt templates referenced by `#id`:

```yaml
prompts:
  - id: analyze-code
    content: |
      <instructions>
      Analyze the provided code for patterns
      </instructions>
```

Menu items reference these:

```yaml
menu:
  - trigger: analyze
    action: '#analyze-code'
    description: 'Analyze code patterns'
```

### Menu Actions

Two forms of action handlers:

1. **Prompt Reference**: `action: "#prompt-id"` - Executes prompt content
2. **Inline Instruction**: `action: "Direct text instruction"` - Executes text directly

### Install Config (Compile-Time Customization)

Questions asked during `bmad agent-install`:

**Question Types:**

- `choice` - Multiple choice selection
- `boolean` - Yes/no toggle
- `text` - Free-form text input

**Variables become available in Handlebars:**

```yaml
{{#if variable_name}}
Content when true
{{/if}}

{{#if variable_name == "value"}}
Content when equals value
{{/if}}

{{#unless variable_name}}
Content when false
{{/unless}}
```

## What Gets Injected at Compile Time

The `tools/cli/lib/agent/compiler.js` automatically adds:

1. **YAML Frontmatter**

   ```yaml
   ---
   name: 'agent name'
   description: 'Agent Title'
   ---
   ```

2. **Activation Block**
   - Load persona step
   - Load core config for {user_name}, {communication_language}
   - Agent-specific critical_actions as numbered steps
   - Menu display and input handling
   - Menu handlers (action/workflow/exec/tmpl) based on usage
   - Rules section

3. **Auto-Injected Menu Items**
   - `*help` always first
   - `*exit` always last

4. **Trigger Prefixing**
   - Triggers without `*` get it added automatically

## Reference Example

See: `src/modules/bmb/reference/agents/simple-examples/commit-poet.agent.yaml`

Features demonstrated:

- Handlebars conditionals for style variations
- Multiple prompt templates with semantic XML tags
- Install config with choice, boolean, and text questions
- Menu items using both `#id` references and inline actions

## Installation

```bash
# Copy to your project
cp /path/to/commit-poet.agent.yaml .bmad/custom/agents/

# Install with personalization
bmad agent-install
# or: npx bmad agent-install
```

The installer:

1. Prompts for personalization (name, preferences)
2. Processes Handlebars templates with your answers
3. Compiles YAML to XML-in-markdown
4. Creates IDE slash commands
5. Saves source for reinstallation

## Best Practices

1. **Use first-person voice** in all persona elements
2. **Keep prompts focused** - one clear purpose per prompt
3. **Leverage Handlebars** for user customization without code changes
4. **Provide sensible defaults** in install_config
5. **Use semantic XML tags** in prompt content for clarity
6. **Test all conditional paths** before distribution

## Common Patterns

### Style Variants

```yaml
communication_style: |
  {{#if enthusiasm == "high"}}
  Enthusiastic and energetic approach!
  {{/if}}
  {{#if enthusiasm == "moderate"}}
  Balanced and professional demeanor.
  {{/if}}
```

### Feature Toggles

```yaml
prompts:
  - id: main-action
    content: |
      {{#if advanced_mode}}
      Include advanced analysis steps...
      {{/if}}
      {{#unless advanced_mode}}
      Basic analysis only...
      {{/unless}}
```

### User Personalization

```yaml
identity: |
  {{#if custom_name}}
  Known as {{custom_name}} to you.
  {{/if}}
```

## Validation Checklist

- [ ] Valid YAML syntax
- [ ] All metadata fields present (id, name, title, icon, type)
- [ ] Persona complete (role, identity, communication_style, principles)
- [ ] Prompts have unique IDs
- [ ] Menu triggers don't start with `*` (auto-added)
- [ ] Install config questions have defaults
- [ ] Handlebars syntax is correct
- [ ] File named `{agent-name}.agent.yaml`
