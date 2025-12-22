# Agent Compilation: YAML to XML

What the compiler auto-injects. **DO NOT duplicate these in your YAML.**

## Compilation Pipeline

```
agent.yaml → Handlebars processing → XML generation → frontmatter.md
```

Source: `tools/cli/lib/agent/compiler.js`

## File Naming Convention

**CRITICAL:** Agent filenames must be ROLE-BASED, not persona-based.

**Why:** Users can customize the agent's persona name via `customize.yaml` config. The filename provides stable identity.

**Correct:**

```
presentation-master.agent.yaml  ← Role/function
tech-writer.agent.yaml          ← Role/function
code-reviewer.agent.yaml        ← Role/function
```

**Incorrect:**

```
caravaggio.agent.yaml    ← Persona name (users might rename to "Pablo")
paige.agent.yaml         ← Persona name (users might rename to "Sarah")
rex.agent.yaml           ← Persona name (users might rename to "Max")
```

**Pattern:**

- Filename: `{role-or-function}.agent.yaml` (kebab-case)
- Metadata ID: `_bmad/{module}/agents/{role-or-function}.md`
- Persona Name: User-customizable in metadata or customize.yaml

**Example:**

```yaml
# File: presentation-master.agent.yaml
agent:
  metadata:
    id: '_bmad/cis/agents/presentation-master.md'
    name: Caravaggio # ← Users can change this to "Pablo" or "Vince"
    title: Visual Communication & Presentation Expert
```

## Auto-Injected Components

### 1. Frontmatter

**Injected automatically:**

```yaml
---
name: '{agent name from filename}'
description: '{title from metadata}'
---
You must fully embody this agent's persona...
```

**DO NOT add** frontmatter to your YAML source.

### 2. Activation Block

**Entire activation section is auto-generated:**

```xml
<activation critical="MANDATORY">
  <step n="1">Load persona from this current agent file</step>
  <step n="2">Load config to get {user_name}, {communication_language}</step>
  <step n="3">Remember: user's name is {user_name}</step>

  <!-- YOUR critical_actions inserted here as numbered steps -->

  <step n="N">ALWAYS communicate in {communication_language}</step>
  <step n="N+1">Show greeting + numbered menu</step>
  <step n="N+2">STOP and WAIT for user input</step>
  <step n="N+3">Input resolution rules</step>

  <menu-handlers>
    <!-- Only handler instructions for the handler types used in the agents specific menu are included -->
  </menu-handlers>

  <rules>
    <!-- Standard agent behavior rules -->
  </rules>
</activation>
```

**DO NOT create** activation sections - compiler builds it from your critical_actions.

### 3. Menu Enhancements

**Auto-injected menu items:**

- `*help` - Always FIRST in compiled menu
- `*exit` - Always LAST in compiled menu

**Trigger prefixing:**

- Your trigger `analyze` becomes `*analyze`
- Don't add `*` prefix - compiler does it

**DO NOT include:**

```yaml
# BAD - these are auto-injected
menu:
  - trigger: help
    description: 'Show help'
  - trigger: exit
    description: 'Exit'
```

### 4. Menu Handlers

Compiler detects which handlers you use and ONLY includes those:

```xml
<menu-handlers>
  <handlers>
    <!-- Only if you use action="#id" or action="text" -->
    <handler type="action">...</handler>

    <!-- Only if you use workflow="path" -->
    <handler type="workflow">...</handler>

    <!-- Only if you use exec="path" -->
    <handler type="exec">...</handler>

    <!-- Only if you use tmpl="path" -->
    <handler type="tmpl">...</handler>
  </handlers>
</menu-handlers>
```

**DO NOT document** handler behavior - it's injected.

### 5. Rules Section

**Auto-injected rules:**

- Always communicate in {communication_language}
- Stay in character until exit
- Menu triggers use asterisk (\*) - NOT markdown
- Number all lists, use letters for sub-options
- Load files ONLY when executing menu items
- Written output follows communication style

**DO NOT add** rules - compiler handles it.

## What YOU Provide in YAML

### Required

```yaml
agent:
  metadata:
    name: 'Persona Name'
    title: 'Agent Title'
    icon: 'emoji'
    type: 'simple|expert' # or module: "bmm"

  persona:
    role: '...'
    identity: '...'
    communication_style: '...'
    principles: [...]

  menu:
    - trigger: your-action
      action: '#prompt-id'
      description: 'What it does'
```

### Optional (based on type)

```yaml
# Expert agents only
critical_actions:
  - 'Load sidecar files...'
  - 'Restrict access...'

# Simple/Expert with embedded logic
prompts:
  - id: prompt-id
    content: '...'

# Simple/Expert with customization
install_config:
  questions: [...]
```

## Common Duplication Mistakes

### Adding Activation Logic

```yaml
# BAD - compiler builds activation
agent:
  activation:
    steps: [...]
```

### Including Help/Exit

```yaml
# BAD - auto-injected
menu:
  - trigger: help
  - trigger: exit
```

### Prefixing Triggers

```yaml
# BAD - compiler adds *
menu:
  - trigger: '*analyze' # Should be: analyze
```

### Documenting Handlers

```yaml
# BAD - don't explain handlers, compiler injects them
# When using workflow, load workflow.xml...
```

### Adding Rules in YAML

```yaml
# BAD - rules are auto-injected
agent:
  rules:
    - Stay in character...
```

## Compilation Example

**Your YAML:**

```yaml
agent:
  metadata:
    name: 'Rex'
    title: 'Code Reviewer'
    icon: '🔍'
    type: simple

  persona:
    role: Code Review Expert
    identity: Systematic reviewer...
    communication_style: Direct and constructive
    principles:
      - Code should be readable

  prompts:
    - id: review
      content: |
        Analyze code for issues...

  menu:
    - trigger: review
      action: '#review'
      description: 'Review code'
```

**Compiled Output (.md):**

```markdown
---
name: 'rex'
description: 'Code Reviewer'
---

You must fully embody...

\`\`\`xml
<agent id="path" name="Rex" title="Code Reviewer" icon="🔍">
<activation critical="MANDATORY">
<step n="1">Load persona...</step>
<step n="2">Load config...</step>
<step n="3">Remember user...</step>
<step n="4">Communicate in language...</step>
<step n="5">Show greeting + menu...</step>
<step n="6">STOP and WAIT...</step>
<step n="7">Input resolution...</step>

  <menu-handlers>
    <handlers>
      <handler type="action">
        action="#id" → Find prompt, execute
        action="text" → Execute directly
      </handler>
    </handlers>
  </menu-handlers>

  <rules>
    - Stay in character...
    - Number lists...
    - Load files when executing...
  </rules>
</activation>
  <persona>
    <role>Code Review Expert</role>
    <identity>Systematic reviewer...</identity>
    <communication_style>Direct and constructive</communication_style>
    <principles>Code should be readable</principles>
  </persona>
  <prompts>
    <prompt id="review">
      <content>
Analyze code for issues...
      </content>
    </prompt>
  </prompts>
  <menu>
    <item cmd="*help">Show numbered menu</item>
    <item cmd="*review" action="#review">Review code</item>
    <item cmd="*exit">Exit with confirmation</item>
  </menu>
</agent>
\`\`\`
```

## Key Takeaways

1. **Compiler handles boilerplate** - Focus on persona and logic
2. **Critical_actions become activation steps** - Just list your agent-specific needs
3. **Menu items are enhanced** - Help/exit added, triggers prefixed
4. **Handlers auto-detected** - Only what you use is included
5. **Rules standardized** - Consistent behavior across agents

**Your job:** Define persona, prompts, menu actions
**Compiler's job:** Activation, handlers, rules, help/exit, prefixes
